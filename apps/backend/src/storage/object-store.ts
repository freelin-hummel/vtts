import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface StorageObjectWriteResult {
  path: string;
  byteLength: number;
}

export interface ObjectStore {
  readonly rootDir: string;
  writeObject(path: string, data: Uint8Array | string): Promise<StorageObjectWriteResult>;
  readObject(path: string): Promise<Buffer>;
  hasObject(path: string): Promise<boolean>;
  listObjects(prefix?: string): Promise<string[]>;
}

const normalizeStoragePath = (value: string): string => {
  if (value.length === 0) {
    throw new Error('Storage paths must not be empty');
  }

  const normalized = path.posix.normalize(value.replaceAll('\\', '/'));

  if (
    normalized === '.' ||
    normalized.startsWith('/') ||
    normalized.startsWith('../') ||
    normalized.includes('/../')
  ) {
    throw new Error(`Storage paths must stay relative to the object-store root: ${value}`);
  }

  return normalized;
};

const resolveStoragePath = (
  rootDir: string,
  storagePath: string,
): { absolutePath: string; normalizedPath: string } => {
  const normalizedPath = normalizeStoragePath(storagePath);
  const absoluteRoot = path.resolve(rootDir);
  const absolutePath = path.resolve(absoluteRoot, normalizedPath);
  const rootPrefix = `${absoluteRoot}${path.sep}`;

  if (absolutePath !== absoluteRoot && !absolutePath.startsWith(rootPrefix)) {
    throw new Error(`Resolved path escaped the object-store root: ${storagePath}`);
  }

  return { absolutePath, normalizedPath };
};

const walkDirectory = async (directoryPath: string, rootDir: string): Promise<string[]> => {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const children = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return walkDirectory(entryPath, rootDir);
      }

      return path.relative(rootDir, entryPath).replaceAll(path.sep, '/');
    }),
  );

  return children.flat().sort();
};

export class LocalDiskObjectStore implements ObjectStore {
  readonly rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = path.resolve(rootDir);
  }

  async writeObject(
    storagePath: string,
    data: Uint8Array | string,
  ): Promise<StorageObjectWriteResult> {
    const { absolutePath, normalizedPath } = resolveStoragePath(this.rootDir, storagePath);

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, data);

    return {
      path: normalizedPath,
      byteLength: typeof data === 'string' ? Buffer.byteLength(data) : data.byteLength,
    };
  }

  async readObject(storagePath: string): Promise<Buffer> {
    const { absolutePath } = resolveStoragePath(this.rootDir, storagePath);
    return readFile(absolutePath);
  }

  async hasObject(storagePath: string): Promise<boolean> {
    const { absolutePath } = resolveStoragePath(this.rootDir, storagePath);

    try {
      return (await stat(absolutePath)).isFile();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }

      throw error;
    }
  }

  async listObjects(prefix = ''): Promise<string[]> {
    if (prefix.length === 0) {
      try {
        return walkDirectory(this.rootDir, this.rootDir);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return [];
        }

        throw error;
      }
    }

    const { absolutePath, normalizedPath } = resolveStoragePath(this.rootDir, prefix);

    try {
      const entryStats = await stat(absolutePath);

      if (entryStats.isDirectory()) {
        return walkDirectory(absolutePath, this.rootDir);
      }

      return [normalizedPath];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }

      throw error;
    }
  }
}

import {
  assetRecordSchema,
  packageManifestSchema,
  prefabRecordSchema,
  type AssetRecord,
  type PackageManifest,
  type PrefabRecord,
} from "@vtts/content-schema";

const getContentKey = (packageId: string, recordId: string): string => `${packageId}:${recordId}`;

export interface MetadataIndex {
  upsertPackage(record: PackageManifest): PackageManifest;
  upsertAsset(record: AssetRecord): AssetRecord;
  upsertPrefab(record: PrefabRecord): PrefabRecord;
  getPackage(id: string): PackageManifest | undefined;
  getAsset(packageId: string, id: string): AssetRecord | undefined;
  getPrefab(packageId: string, id: string): PrefabRecord | undefined;
  listPackages(): PackageManifest[];
  listAssets(packageId?: string): AssetRecord[];
  listPrefabs(packageId?: string): PrefabRecord[];
}

export class InMemoryMetadataIndex implements MetadataIndex {
  private readonly packages = new Map<string, PackageManifest>();
  private readonly assets = new Map<string, AssetRecord>();
  private readonly prefabs = new Map<string, PrefabRecord>();

  upsertPackage(record: PackageManifest): PackageManifest {
    const parsedRecord = packageManifestSchema.parse(record);
    this.packages.set(parsedRecord.id, parsedRecord);
    return parsedRecord;
  }

  upsertAsset(record: AssetRecord): AssetRecord {
    const parsedRecord = assetRecordSchema.parse(record);
    this.assets.set(getContentKey(parsedRecord.packageId, parsedRecord.id), parsedRecord);
    return parsedRecord;
  }

  upsertPrefab(record: PrefabRecord): PrefabRecord {
    const parsedRecord = prefabRecordSchema.parse(record);
    this.prefabs.set(getContentKey(parsedRecord.packageId, parsedRecord.id), parsedRecord);
    return parsedRecord;
  }

  getPackage(id: string): PackageManifest | undefined {
    return this.packages.get(id);
  }

  getAsset(packageId: string, id: string): AssetRecord | undefined {
    return this.assets.get(getContentKey(packageId, id));
  }

  getPrefab(packageId: string, id: string): PrefabRecord | undefined {
    return this.prefabs.get(getContentKey(packageId, id));
  }

  listPackages(): PackageManifest[] {
    return [...this.packages.values()].sort((left, right) => left.id.localeCompare(right.id));
  }

  listAssets(packageId?: string): AssetRecord[] {
    const records = [...this.assets.values()];
    return records
      .filter((record) => packageId === undefined || record.packageId === packageId)
      .sort((left, right) => left.id.localeCompare(right.id));
  }

  listPrefabs(packageId?: string): PrefabRecord[] {
    const records = [...this.prefabs.values()];
    return records
      .filter((record) => packageId === undefined || record.packageId === packageId)
      .sort((left, right) => left.id.localeCompare(right.id));
  }
}

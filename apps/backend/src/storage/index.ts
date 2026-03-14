export const storageModule = {
  metadataDatabase: "sqlite",
  objectStore: "local-disk",
  packageRoot: "content/packages",
  metadataIndex: "in-memory",
} as const;

export * from "./metadata-index.js";
export * from "./object-store.js";

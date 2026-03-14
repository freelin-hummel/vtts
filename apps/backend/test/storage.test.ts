import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";

import { describe, expect, it } from "vitest";

import { InMemoryMetadataIndex, LocalDiskObjectStore } from "../src/storage/index.js";

describe("storage", () => {
  it("stores and lists objects beneath the configured root directory", async () => {
    const rootDir = await mkdtemp(path.join(tmpdir(), "vtts-object-store-"));

    try {
      const store = new LocalDiskObjectStore(rootDir);
      const payload = Buffer.from("mesh-data");

      const writeResult = await store.writeObject("core-rules/assets/meshes/table.glb", payload);

      expect(writeResult).toEqual({
        path: "core-rules/assets/meshes/table.glb",
        byteLength: payload.byteLength,
      });
      await expect(store.hasObject("core-rules/assets/meshes/table.glb")).resolves.toBe(true);
      await expect(store.readObject("core-rules/assets/meshes/table.glb")).resolves.toEqual(payload);
      await expect(store.listObjects("core-rules")).resolves.toEqual([
        "core-rules/assets/meshes/table.glb",
      ]);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("rejects object paths that escape the configured root", async () => {
    const rootDir = await mkdtemp(path.join(tmpdir(), "vtts-object-store-"));

    try {
      const store = new LocalDiskObjectStore(rootDir);

      await expect(store.writeObject("../escape.txt", "nope")).rejects.toThrow(
        /object-store root/i,
      );
      await expect(store.listObjects("../escape.txt")).rejects.toThrow(/object-store root/i);
    } finally {
      await rm(rootDir, { recursive: true, force: true });
    }
  });

  it("indexes validated package, asset, and prefab records", () => {
    const index = new InMemoryMetadataIndex();

    index.upsertPackage({
      schemaVersion: "1",
      id: "core-rules",
      globalId: "pkg_core-rules",
      name: "core-rules",
      version: "0.1.0",
      title: "Core Rules",
      createdAt: "2026-03-13T23:31:01.754Z",
      updatedAt: "2026-03-13T23:31:01.754Z",
      importSource: {
        rootPath: "content/packages/core-rules",
        sourceKind: "tts-mod",
      },
      assetIds: ["meshes/table.glb"],
      prefabIds: ["prefabs/table"],
      sceneIds: [],
      scriptIds: [],
      warningCodes: [],
    });

    index.upsertAsset({
      schemaVersion: "1",
      packageId: "core-rules",
      id: "meshes/table.glb",
      globalId: "asset_table_glb",
      kind: "mesh",
      name: "Wood Table",
      tags: ["prop"],
      delivery: {
        path: "assets/meshes/table.glb",
        mimeType: "model/gltf-binary",
        byteLength: 1024,
      },
      provenance: {
        sourceKind: "tts-mod",
        sourceUri: "Mods/example.json",
        importedAt: "2026-03-13T23:31:01.754Z",
        importerVersion: "0.1.0",
      },
      warningCodes: [],
    });

    index.upsertPrefab({
      schemaVersion: "1",
      packageId: "core-rules",
      id: "prefabs/table",
      globalId: "prefab_table",
      name: "Table",
      tags: ["prop"],
      assetRefs: {
        mesh: {
          packageId: "core-rules",
          localId: "meshes/table.glb",
          globalId: "asset_table_glb",
        },
        materials: [],
        textures: [],
        audio: [],
        decals: [],
      },
      defaultTransform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      components: [],
      nestedPrefabs: [],
      scripts: [],
    });

    expect(index.listPackages().map((record) => record.id)).toEqual(["core-rules"]);
    expect(index.listAssets("core-rules").map((record) => record.id)).toEqual(["meshes/table.glb"]);
    expect(index.getAsset("core-rules", "meshes/table.glb")?.delivery.path).toBe(
      "assets/meshes/table.glb",
    );
    expect(index.listPrefabs("core-rules").map((record) => record.id)).toEqual(["prefabs/table"]);
  });
});

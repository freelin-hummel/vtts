import { describe, expect, it } from 'vitest';

import {
  assetRecordSchema,
  importJobSchema,
  packageManifestSchema,
  sceneManifestSchema,
} from '../src/index.js';

describe('content schemas', () => {
  it('accepts a package manifest with concrete package fields', () => {
    const result = packageManifestSchema.parse({
      schemaVersion: '1',
      id: 'core-rules',
      globalId: 'pkg_core-rules',
      name: 'core-rules',
      version: '0.1.0',
      title: 'Core Rules',
      createdAt: '2026-03-13T23:31:01.754Z',
      updatedAt: '2026-03-13T23:31:01.754Z',
      importSource: {
        rootPath: 'content/packages/core-rules',
        sourceKind: 'tts-mod',
      },
      assetIds: ['meshes/table.glb'],
      prefabIds: ['prefabs/table'],
      sceneIds: ['scenes/tavern'],
      scriptIds: ['scripts/open-door'],
      warningCodes: [],
    });

    expect(result.id).toBe('core-rules');
    expect(result.importSource.rootPath).toBe('content/packages/core-rules');
  });

  it('accepts an asset record with delivery, overrides, and provenance', () => {
    const result = assetRecordSchema.parse({
      schemaVersion: '1',
      packageId: 'core-rules',
      id: 'meshes/table.glb',
      globalId: 'asset_table_glb',
      kind: 'mesh',
      name: 'Wood Table',
      tags: ['prop'],
      delivery: {
        path: 'assets/meshes/table.glb',
        mimeType: 'model/gltf-binary',
        byteLength: 1024,
      },
      overrides: {
        scale: { x: 1, y: 1, z: 1 },
        origin: { x: 0, y: 0, z: 0 },
      },
      provenance: {
        sourceKind: 'tts-mod',
        sourceUri: 'Mods/example.json',
        originalRelativePath: 'Assetbundles/table',
        importedAt: '2026-03-13T23:31:01.754Z',
        importerVersion: '0.1.0',
      },
      warningCodes: [],
    });

    expect(result.delivery.path).toBe('assets/meshes/table.glb');
    expect(result.provenance.sourceKind).toBe('tts-mod');
  });

  it('requires scenes to reference prefabs by id plus overrides instead of embedding prefab payloads', () => {
    const validScene = sceneManifestSchema.parse({
      schemaVersion: '1',
      packageId: 'core-rules',
      id: 'scenes/tavern',
      globalId: 'scene_tavern',
      name: 'Tavern',
      entities: [
        {
          id: 'entity/table-1',
          prefab: {
            packageId: 'core-rules',
            localId: 'prefabs/table',
            globalId: 'prefab_table',
          },
          visible: true,
          overrides: {
            transform: {
              position: { x: 0, y: 0, z: 0 },
            },
            componentData: {},
            scriptParameters: {},
          },
          scripts: [],
        },
      ],
      gmNotes: [
        {
          id: 'gm-note-1',
          text: 'Keep this hidden until initiative starts.',
        },
      ],
      perUserCameraState: [
        {
          userId: 'gm',
          mode: 'orbit',
          position: { x: 0, y: 10, z: 10 },
          target: { x: 0, y: 0, z: 0 },
        },
      ],
      createdAt: '2026-03-13T23:31:01.754Z',
      updatedAt: '2026-03-13T23:31:01.754Z',
    });

    expect(validScene.entities[0]?.prefab.localId).toBe('prefabs/table');

    expect(() =>
      sceneManifestSchema.parse({
        ...validScene,
        entities: [
          {
            ...validScene.entities[0],
            prefabData: {
              id: 'prefabs/table',
            },
          },
        ],
      }),
    ).toThrow();
  });

  it('accepts import jobs with structured warnings and outputs', () => {
    const result = importJobSchema.parse({
      schemaVersion: '1',
      id: 'job-import-core-rules',
      globalId: 'job_global_1',
      status: 'running',
      createdAt: '2026-03-13T23:31:01.754Z',
      startedAt: '2026-03-13T23:31:01.754Z',
      source: {
        kind: 'tts-mod',
        uri: 'Mods/CoreRules',
        packageIdHint: 'core-rules',
      },
      progress: {
        currentStage: 'validate',
        completedStages: 2,
        totalStages: 6,
      },
      output: {
        packageId: 'core-rules',
        assetIds: [
          {
            packageId: 'core-rules',
            localId: 'meshes/table.glb',
            globalId: 'asset_table_glb',
          },
        ],
        prefabIds: [],
        sceneIds: [],
      },
      warnings: [
        {
          code: 'missing-material',
          severity: 'warning',
          message: 'Using a fallback material.',
          recordType: 'asset',
          recordRef: {
            packageId: 'core-rules',
            localId: 'meshes/table.glb',
          },
        },
      ],
      provenance: [
        {
          sourceKind: 'tts-mod',
          sourceUri: 'Mods/CoreRules',
          importedAt: '2026-03-13T23:31:01.754Z',
          importerVersion: '0.1.0',
        },
      ],
    });

    expect(result.warnings[0]?.code).toBe('missing-material');
    expect(result.output.packageId).toBe('core-rules');
  });
});

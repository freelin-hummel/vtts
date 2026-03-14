import { z } from "zod";

const schemaVersionSchema = z.literal("1");
const packageIdSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const localRecordIdSchema = z.string().regex(/^[a-z0-9][a-z0-9._/-]*$/);
const globalRecordIdSchema = z.string().min(1);
const isoDateTimeSchema = z.string().datetime({ offset: true });
const relativePathSchema = z.string().min(1).refine((value) => !value.startsWith("/"), {
  message: "Expected a relative path",
});
const vector3Schema = z
  .object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  })
  .strict();

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const contentRefSchema = z
  .object({
    packageId: packageIdSchema,
    localId: localRecordIdSchema,
    globalId: globalRecordIdSchema.optional(),
  })
  .strict();

export const provenanceRecordSchema = z
  .object({
    sourceKind: z.enum(["tts-mod", "tts-save", "unity-bundle", "loose-file", "manual"]),
    sourceUri: z.string().min(1),
    sourcePackageId: z.string().min(1).optional(),
    sourceObjectId: z.string().min(1).optional(),
    originalRelativePath: relativePathSchema.optional(),
    importedAt: isoDateTimeSchema,
    importerVersion: z.string().min(1),
  })
  .strict();

export const importWarningSchema = z
  .object({
    code: z.string().min(1),
    severity: z.enum(["info", "warning", "error"]),
    message: z.string().min(1),
    recordType: z.enum(["package", "asset", "prefab", "scene", "script", "import-job"]),
    recordRef: contentRefSchema.optional(),
  })
  .strict();

export const scriptParameterSchema = z
  .object({
    name: z.string().min(1),
    type: z.enum(["string", "number", "boolean", "json", "entity-ref", "asset-ref"]),
    required: z.boolean().default(false),
    defaultValue: jsonValueSchema.optional(),
    description: z.string().min(1).optional(),
  })
  .strict();

export const scriptMetadataSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    packageId: packageIdSchema,
    id: localRecordIdSchema,
    globalId: globalRecordIdSchema,
    name: z.string().min(1),
    entryPath: relativePathSchema,
    lifecycleHooks: z.array(
      z.enum([
        "onInit",
        "onDestroy",
        "onUpdate",
        "onInteract",
        "onEnterTrigger",
        "onLeaveTrigger",
      ]),
    ),
    permissions: z.array(z.string().min(1)),
    parameters: z.array(scriptParameterSchema),
    description: z.string().min(1).optional(),
  })
  .strict();

export const scriptAttachmentSchema = z
  .object({
    script: contentRefSchema,
    enabled: z.boolean().default(true),
    parameters: z.record(z.string(), jsonValueSchema).default({}),
  })
  .strict();

export const assetRecordSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    packageId: packageIdSchema,
    id: localRecordIdSchema,
    globalId: globalRecordIdSchema,
    kind: z.enum(["mesh", "material", "texture", "audio", "decal", "document", "text"]),
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    delivery: z
      .object({
        path: relativePathSchema,
        mimeType: z.string().min(1),
        byteLength: z.number().int().nonnegative(),
        checksum: z.string().min(1).optional(),
      })
      .strict(),
    thumbnailPath: relativePathSchema.optional(),
    overrides: z
      .object({
        scale: vector3Schema.optional(),
        origin: vector3Schema.optional(),
        materialAssetId: contentRefSchema.optional(),
      })
      .strict()
      .optional(),
    provenance: provenanceRecordSchema,
    warningCodes: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const prefabRecordSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    packageId: packageIdSchema,
    id: localRecordIdSchema,
    globalId: globalRecordIdSchema,
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    assetRefs: z
      .object({
        mesh: contentRefSchema.optional(),
        materials: z.array(contentRefSchema).default([]),
        textures: z.array(contentRefSchema).default([]),
        audio: z.array(contentRefSchema).default([]),
        decals: z.array(contentRefSchema).default([]),
      })
      .strict(),
    defaultTransform: z
      .object({
        position: vector3Schema,
        rotation: vector3Schema,
        scale: vector3Schema,
      })
      .strict(),
    components: z.array(
      z
        .object({
          type: z.string().min(1),
          data: z.record(z.string(), jsonValueSchema),
        })
        .strict(),
    ),
    nestedPrefabs: z.array(contentRefSchema).default([]),
    scripts: z.array(scriptAttachmentSchema).default([]),
    thumbnailAsset: contentRefSchema.optional(),
  })
  .strict();

export const sceneEntitySchema = z
  .object({
    id: localRecordIdSchema,
    name: z.string().min(1).optional(),
    prefab: contentRefSchema,
    visible: z.boolean().default(true),
    overrides: z
      .object({
        transform: z
          .object({
            position: vector3Schema.optional(),
            rotation: vector3Schema.optional(),
            scale: vector3Schema.optional(),
          })
          .strict()
          .optional(),
        componentData: z.record(z.string(), jsonValueSchema).default({}),
        scriptParameters: z.record(z.string(), jsonValueSchema).default({}),
      })
      .strict(),
    notes: z.string().min(1).optional(),
    scripts: z.array(scriptAttachmentSchema).default([]),
  })
  .strict();

export const sceneManifestSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    packageId: packageIdSchema,
    id: localRecordIdSchema,
    globalId: globalRecordIdSchema,
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    entities: z.array(sceneEntitySchema),
    gmNotes: z.array(
      z
        .object({
          id: localRecordIdSchema,
          text: z.string().min(1),
          entityId: localRecordIdSchema.optional(),
        })
        .strict(),
    ),
    perUserCameraState: z.array(
      z
        .object({
          userId: z.string().min(1),
          mode: z.enum(["orbit", "walk"]),
          position: vector3Schema,
          target: vector3Schema,
          zoom: z.number().positive().optional(),
        })
        .strict(),
    ),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .strict();

export const packageManifestSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    id: packageIdSchema,
    globalId: globalRecordIdSchema,
    name: z.string().min(1),
    version: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
    importSource: z
      .object({
        rootPath: relativePathSchema,
        sourceKind: z.enum(["tts-mod", "tts-save", "manual"]),
      })
      .strict(),
    assetIds: z.array(localRecordIdSchema).default([]),
    prefabIds: z.array(localRecordIdSchema).default([]),
    sceneIds: z.array(localRecordIdSchema).default([]),
    scriptIds: z.array(localRecordIdSchema).default([]),
    warningCodes: z.array(z.string().min(1)).default([]),
  })
  .strict();

export const importJobSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    id: localRecordIdSchema,
    globalId: globalRecordIdSchema,
    status: z.enum(["queued", "running", "completed", "failed", "cancelled"]),
    createdAt: isoDateTimeSchema,
    startedAt: isoDateTimeSchema.optional(),
    completedAt: isoDateTimeSchema.optional(),
    source: z
      .object({
        kind: z.enum(["tts-mod", "tts-save", "unity-bundle", "loose-file", "manual"]),
        uri: z.string().min(1),
        packageIdHint: packageIdSchema.optional(),
      })
      .strict(),
    progress: z
      .object({
        currentStage: z.enum(["scan", "extract", "validate", "stylize", "prefab", "index"]),
        completedStages: z.number().int().nonnegative(),
        totalStages: z.number().int().positive(),
      })
      .strict(),
    output: z
      .object({
        packageId: packageIdSchema.optional(),
        assetIds: z.array(contentRefSchema).default([]),
        prefabIds: z.array(contentRefSchema).default([]),
        sceneIds: z.array(contentRefSchema).default([]),
      })
      .strict(),
    warnings: z.array(importWarningSchema).default([]),
    provenance: z.array(provenanceRecordSchema).default([]),
    errorMessage: z.string().min(1).optional(),
  })
  .strict();

export type AssetRecord = z.infer<typeof assetRecordSchema>;
export type ImportJob = z.infer<typeof importJobSchema>;
export type PackageManifest = z.infer<typeof packageManifestSchema>;
export type PrefabRecord = z.infer<typeof prefabRecordSchema>;
export type SceneManifest = z.infer<typeof sceneManifestSchema>;
export type ScriptMetadata = z.infer<typeof scriptMetadataSchema>;

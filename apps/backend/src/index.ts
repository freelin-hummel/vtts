import {
  importJobSchema,
  packageManifestSchema,
  sceneManifestSchema,
} from "@vtts/content-schema";

import { apiModule } from "./api/index.js";
import { importPipelineStages } from "./imports/index.js";
import { storageModule } from "./storage/index.js";

export { createImportJobRequestSchema, ImportJobStore } from "./import-jobs/store.js";
export type { CreateImportJobRequest } from "./import-jobs/store.js";

export const backendContracts = {
  importJob: importJobSchema,
  packageManifest: packageManifestSchema,
  sceneManifest: sceneManifestSchema,
} as const;

export const backendApp = {
  runtime: "node",
  shape: "single-service",
  modules: {
    api: apiModule,
    imports: {
      stages: importPipelineStages,
    },
    storage: storageModule,
  },
} as const;

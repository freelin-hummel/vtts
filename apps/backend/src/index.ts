import { importJobSchema, packageManifestSchema, sceneManifestSchema } from '@vtts/content-schema';

import { apiModule } from './api/index.js';
import { importPipelineStages } from './imports/index.js';
import { storageModule } from './storage/index.js';

export const backendContracts = {
  importJob: importJobSchema,
  packageManifest: packageManifestSchema,
  sceneManifest: sceneManifestSchema,
} as const;

export const backendApp = {
  runtime: 'node',
  shape: 'single-service',
  modules: {
    api: apiModule,
    imports: {
      stages: importPipelineStages,
    },
    storage: storageModule,
  },
} as const;

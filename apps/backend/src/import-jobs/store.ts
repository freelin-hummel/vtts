import { randomUUID } from "node:crypto";

import { z } from "zod";

import { importJobSchema, type ImportJob } from "@vtts/content-schema";

export const createImportJobRequestSchema = z
  .object({
    source: z
      .object({
        kind: z.enum(["tts-mod", "tts-save", "unity-bundle", "loose-file", "manual"]),
        uri: z.string().min(1),
        packageIdHint: z
          .string()
          .regex(/^[a-z0-9][a-z0-9-]*$/)
          .optional(),
      })
      .strict(),
    options: z
      .object({
        dryRun: z.boolean().optional(),
        overwrite: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type CreateImportJobRequest = z.infer<typeof createImportJobRequestSchema>;

export class ImportJobStore {
  private readonly jobs = new Map<string, ImportJob>();

  create(request: CreateImportJobRequest): ImportJob {
    const now = new Date().toISOString();
    const id = randomUUID();

    const job: ImportJob = importJobSchema.parse({
      schemaVersion: "1",
      id,
      globalId: `job_${id}`,
      status: "queued",
      createdAt: now,
      source: request.source,
      progress: {
        currentStage: "scan",
        completedStages: 0,
        totalStages: 6,
      },
      output: {
        assetIds: [],
        prefabIds: [],
        sceneIds: [],
      },
      warnings: [],
      provenance: [],
    });

    this.jobs.set(id, job);
    return job;
  }

  get(id: string): ImportJob | undefined {
    return this.jobs.get(id);
  }

  list(): ImportJob[] {
    return [...this.jobs.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
}

export const defaultImportJobStore = new ImportJobStore();

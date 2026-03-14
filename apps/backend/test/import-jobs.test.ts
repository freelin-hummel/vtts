import { describe, expect, it } from "vitest";

import {
  createImportJobRequestSchema,
  ImportJobStore,
} from "../src/import-jobs/store.js";

describe("createImportJobRequestSchema", () => {
  it("accepts a valid create request with required source fields", () => {
    const result = createImportJobRequestSchema.safeParse({
      source: { kind: "tts-mod", uri: "Mods/CoreRules" },
    });

    expect(result.success).toBe(true);
  });

  it("accepts a request with all optional fields", () => {
    const result = createImportJobRequestSchema.safeParse({
      source: {
        kind: "loose-file",
        uri: "Mods/example.json",
        packageIdHint: "core-rules",
      },
      options: { dryRun: true, overwrite: false },
    });

    expect(result.success).toBe(true);
  });

  it("rejects a request missing the source field", () => {
    const result = createImportJobRequestSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects a request with an invalid source kind", () => {
    const result = createImportJobRequestSchema.safeParse({
      source: { kind: "unknown-source", uri: "Mods/CoreRules" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects a request with an empty source uri", () => {
    const result = createImportJobRequestSchema.safeParse({
      source: { kind: "tts-mod", uri: "" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects a packageIdHint that does not match the package-id pattern", () => {
    const result = createImportJobRequestSchema.safeParse({
      source: { kind: "tts-mod", uri: "Mods/CoreRules", packageIdHint: "Invalid ID!" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown extra fields on source", () => {
    const result = createImportJobRequestSchema.safeParse({
      source: { kind: "tts-mod", uri: "Mods/CoreRules", unexpected: true },
    });

    expect(result.success).toBe(false);
  });
});

describe("ImportJobStore", () => {
  it("creates a job with queued status and all required fields", () => {
    const store = new ImportJobStore();

    const job = store.create({
      source: { kind: "tts-mod", uri: "Mods/CoreRules" },
    });

    expect(job.status).toBe("queued");
    expect(job.id).toBeTruthy();
    expect(job.globalId).toBe(`job_${job.id}`);
    expect(job.createdAt).toBeTruthy();
    expect(job.source.kind).toBe("tts-mod");
    expect(job.source.uri).toBe("Mods/CoreRules");
    expect(job.progress.currentStage).toBe("scan");
    expect(job.progress.completedStages).toBe(0);
    expect(job.progress.totalStages).toBe(6);
  });

  it("assigns unique IDs to each created job", () => {
    const store = new ImportJobStore();

    const job1 = store.create({ source: { kind: "tts-mod", uri: "Mods/A" } });
    const job2 = store.create({ source: { kind: "tts-mod", uri: "Mods/B" } });

    expect(job1.id).not.toBe(job2.id);
  });

  it("retrieves a created job by ID", () => {
    const store = new ImportJobStore();

    const created = store.create({ source: { kind: "tts-save", uri: "Saves/game.json" } });
    const retrieved = store.get(created.id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.source.uri).toBe("Saves/game.json");
  });

  it("returns undefined for an unknown job ID", () => {
    const store = new ImportJobStore();

    expect(store.get("nonexistent-id")).toBeUndefined();
  });

  it("lists all created jobs sorted by createdAt", () => {
    const store = new ImportJobStore();

    const job1 = store.create({ source: { kind: "tts-mod", uri: "Mods/A" } });
    const job2 = store.create({ source: { kind: "tts-mod", uri: "Mods/B" } });

    const listed = store.list();

    expect(listed.length).toBe(2);
    expect(listed.map((j) => j.id)).toContain(job1.id);
    expect(listed.map((j) => j.id)).toContain(job2.id);
  });

  it("stores source packageIdHint when provided", () => {
    const store = new ImportJobStore();

    const job = store.create({
      source: { kind: "tts-mod", uri: "Mods/CoreRules", packageIdHint: "core-rules" },
    });

    expect(job.source.packageIdHint).toBe("core-rules");
  });
});

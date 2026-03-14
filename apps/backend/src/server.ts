import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { createImportJobRequestSchema, defaultImportJobStore } from "./import-jobs/store.js";

const PORT = parseInt(process.env["PORT"] ?? "3000", 10);
const IMPORT_JOBS_PATH = "/api/import-jobs";

async function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: unknown) => {
      body += String(chunk);
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", `http://localhost`);
  const { pathname } = url;

  if (req.method === "POST" && pathname === IMPORT_JOBS_PATH) {
    const rawBody = await readRequestBody(req);

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      sendJson(res, 400, { error: "Invalid JSON body" });
      return;
    }

    const result = createImportJobRequestSchema.safeParse(parsed);
    if (!result.success) {
      sendJson(res, 400, { error: "Validation error", details: result.error.issues });
      return;
    }

    const job = defaultImportJobStore.create(result.data);
    sendJson(res, 201, { jobId: job.id, status: job.status, createdAt: job.createdAt });
    return;
  }

  if (req.method === "GET" && pathname === IMPORT_JOBS_PATH) {
    sendJson(res, 200, defaultImportJobStore.list());
    return;
  }

  if (req.method === "GET" && pathname.startsWith(`${IMPORT_JOBS_PATH}/`)) {
    const jobId = pathname.slice(`${IMPORT_JOBS_PATH}/`.length);
    if (!jobId) {
      sendJson(res, 400, { error: "Missing job ID" });
      return;
    }

    const job = defaultImportJobStore.get(jobId);
    if (!job) {
      sendJson(res, 404, { error: "Import job not found" });
      return;
    }

    sendJson(res, 200, job);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

const server = createServer((req, res) => {
  handleRequest(req, res).catch((error: unknown) => {
    console.error("Unhandled request error:", error);
    if (!res.headersSent) {
      sendJson(res, 500, { error: "Internal server error" });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
  console.log(`  POST ${IMPORT_JOBS_PATH}       — create import job`);
  console.log(`  GET  ${IMPORT_JOBS_PATH}       — list import jobs`);
  console.log(`  GET  ${IMPORT_JOBS_PATH}/:jobId — get import job`);
});

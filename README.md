# vtts

This repository is currently in its planning baseline.

- OpenSpec under [`openspec/`](openspec/) is the canonical planning and implementation-tracking layer.
- [`docs/3d-vtt-spec.md`](docs/3d-vtt-spec.md) remains the narrative product and technical background brief.

Active OpenSpec change set: [openspec/changes/bootstrap-3d-vtt-foundation/proposal.md](openspec/changes/bootstrap-3d-vtt-foundation/proposal.md)

Product and technical spec: [docs/3d-vtt-spec.md](docs/3d-vtt-spec.md)

This repository currently contains example Tabletop Simulator mod assets under [Mods/](Mods/).

## Workspace

This repository now uses a `pnpm` workspace with a minimal backend app scaffold and shared content schemas.

- Install: `corepack pnpm install`
- Build: `corepack pnpm build`
- Test: `corepack pnpm test`

## Backend API

Start the backend server (builds TypeScript then runs):

```sh
corepack pnpm --filter @vtts/backend dev
```

The server listens on `http://localhost:3000` by default (override with the `PORT` environment variable).

### Create an import job

```sh
curl -X POST http://localhost:3000/api/import-jobs \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "kind": "tts-mod",
      "uri": "Mods/CoreRules"
    }
  }'
```

Response (`201 Created`):

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "createdAt": "2026-03-14T01:00:00.000Z"
}
```

Optional fields in the request body:

| Field | Type | Description |
|---|---|---|
| `source.kind` | `"tts-mod" \| "tts-save" \| "unity-bundle" \| "loose-file" \| "manual"` | Import source type |
| `source.uri` | `string` | Path or identifier for the source |
| `source.packageIdHint` | `string` (optional) | Suggested package ID for the output |
| `options.dryRun` | `boolean` (optional) | Validate without writing output |
| `options.overwrite` | `boolean` (optional) | Allow overwriting an existing package |

### Retrieve an import job

```sh
curl http://localhost:3000/api/import-jobs/<jobId>
```

### List all import jobs

```sh
curl http://localhost:3000/api/import-jobs
```

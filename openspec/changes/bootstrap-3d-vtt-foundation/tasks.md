## 1. OpenSpec Baseline

- [x] 1.1 Keep `docs/3d-vtt-spec.md` as narrative background and treat OpenSpec as the canonical planning layer
- [x] 1.2 Review and refine the `bootstrap-3d-vtt-foundation` change after the first code scaffold is in place
- [x] 1.3 Encode the defined startup import, ID, scene-reference, and storage contracts into shared schemas before service code branches

## 2. Repository Scaffolding

- [ ] 2.1 Expand the monorepo beyond `apps/backend` with `apps/web` and additional core `packages/*` as the next slices land
- [x] 2.2 Set up TypeScript project references or workspace-level package management
- [ ] 2.3 Add baseline linting, formatting, and build scripts
- [x] 2.4 Set up the repo for `pnpm` workspaces and a single-service backend entrypoint with internal module boundaries

## 3. Content Schema and Backend Import Path

- [x] 3.1 Define Zod schemas for asset, prefab, scene, script, and import job manifests
- [x] 3.2 Define stable package-scoped IDs, generated global IDs, and prefab-plus-override scene references in the schemas
- [x] 3.3 Implement package storage and metadata index abstractions for normalized content
- [x] 3.4 Implement a local-disk object-store backend behind the storage abstraction
- [ ] 3.5 Implement an HTTP import entrypoint that creates import jobs from a running app flow
- [ ] 3.6 Implement startup import of the existing `Mods/` corpus and reindex newly discovered assets
- [ ] 3.7 Implement watched-folder auto-reimport for configured mod sources
- [ ] 3.8 Implement a first worker path that normalizes a narrow TTS-derived sample into package output
- [ ] 3.9 Generate thumbnails and import warnings as part of importer output
- [ ] 3.10 Expose indexed package and asset lookup endpoints for the frontend

## 3A. Persistence Baseline

- [ ] 3A.1 Use SQLite for package metadata, scene records, import jobs, warnings, and provenance
- [ ] 3A.2 Define the first scene save format to include entity references, local overrides, visibility, script params, notes, and per-user camera state

## 4. Scene Persistence and Realtime Baseline

- [ ] 4.1 Define scene persistence endpoints and storage format
- [ ] 4.2 Add a minimal WebSocket session gateway interface for future live sync
- [ ] 4.3 Keep realtime session events scoped to presence and transforms for the first slice

## 5. Web Runtime Foundation

- [ ] 5.1 Scaffold the React + Vite + R3F web app
- [ ] 5.2 Implement camera orbit, pan, zoom, and object selection
- [ ] 5.3 Render one imported package asset inside a minimal scene

## 6. Editor Surface

- [ ] 6.1 Add a compact asset browser and scene outliner backed by package index data
- [ ] 6.2 Add inspector editing for transform and simple component data
- [ ] 6.3 Support drag-drop placement from asset browser into the scene
- [ ] 6.4 Implement overlay-first dockable panels with pinnable asset browser surfaces
- [ ] 6.5 Add command palette and keyboard-accelerated access for advanced editor actions
- [ ] 6.6 Define the dark-first tactical UI tokens and pressed-state interaction styling

## 7. Scripting Foundation

- [ ] 7.1 Define the initial scripting lifecycle hooks and typed sandbox API around `onInit`, `onDestroy`, `onUpdate`, `onInteract`, `onEnterTrigger`, and `onLeaveTrigger`
- [ ] 7.2 Integrate Monaco Editor for script authoring
- [ ] 7.3 Execute a trivial safe script against a scene entity in play mode

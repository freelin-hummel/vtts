# Design: bootstrap-3d-vtt-foundation

## Context

The repo is greenfield apart from the imported asset corpus in `Mods/` and a narrative product brief in `docs/3d-vtt-spec.md`. The first design decision is not about polishing implementation details; it is about choosing a stack and repository shape that support fast movement, retro rendering, modular content, and in-editor scripting without painting the project into a corner.

## Goals / Non-Goals

**Goals**
- Establish a concrete starter stack for a Three.js-based 3D VTT.
- Keep engine/runtime concerns decoupled from React UI concerns.
- Define package boundaries that support modular content and tooling.
- Support importing TTS-derived content while the app is running, using a dedicated import pipeline instead of raw browser-side bundle parsing in the render path.
- Choose an editor and scripting path that is realistic for MVP.

**Non-Goals**
- Finalize every backend technology before the frontend foundation exists.
- Build a generalized game engine.
- Support raw `.unity3d` bundle parsing directly in the browser render path.
- Solve advanced collaborative editing in the first slice.

## Concrete Stack Recommendation

### Frontend application

- React 19 + TypeScript
- Vite for the web app and local development
- Three.js as the rendering engine
- `@react-three/fiber` for React integration with the viewport
- `@react-three/drei` used selectively for low-level helpers, not as a replacement for explicit engine code
- Zustand for editor and session state
- React Router only if multi-page flows appear; otherwise keep the app shell single-surface initially

### Editor UI

- Plain React components with a custom visual system tuned for minimal chrome
- Radix UI primitives only where accessibility and focus management matter, such as dialogs, menus, and popovers
- Monaco Editor for in-editor scripting with TypeScript language support

### UI design principles

- Scene editing is the primary first-load mode, but the interface should support a blended edit and play workflow without forcing hard context switches.
- The viewport remains dominant, while tool surfaces stay ultracompact, tool-rich, and customizable.
- Panels should overlay the viewport by default rather than permanently shrinking it, while still being pinnable, dockable, and rearrangeable.
- The default visible editing surfaces should be scene outliner, inspector, and chat or notes, with deeper tools available on demand.
- The asset browser should be summonable as a hotkey or command-driven drawer, but also pinnable and optionally usable as a bottom shelf.
- Selection should be viewport-first: show transform gizmos plus compact quick actions near the selected object.
- The interaction model should be keyboard-accelerated without making mouse use feel secondary.
- Grid and snapping should be optional but prominent, with fast toggles instead of being hidden in deep settings.
- Advanced actions should be discoverable through both visible panels and a strong command palette.
- Motion should be nearly absent; feedback should come from crisp state changes, pressed states, and minimal transitions rather than animated choreography.
- The visual tone should be dark-first and tactical, with restrained retro references rather than novelty styling.

### UI visual language

- Default theme should be dark-first.
- The UI should feel modern and utilitarian, not decorative.
- Retro references should stay light and structural, such as beveled or shaded button edges that visibly depress on click.
- Avoid modal-heavy workflows and avoid forcing users into separate views for common editing actions.
- Reference influences are Owlbear Rodeo for low-friction play surface, Foundry for tool breadth, and IMGUI-like immediacy for dense editing interactions.

### Asset and content pipeline

- Node.js + TypeScript import pipeline in `apps/importer`, usable as a local CLI and callable from the running app through a worker or service boundary
- Zod schemas in `packages/content-schema` for manifests, prefabs, scenes, and script metadata
- `@gltf-transform/*` for mesh and material normalization where applicable
- `sharp` for texture conversion, resizing, thumbnail generation, and palette reduction
- External extractor adapter layer for Unity/TTS source conversion so the importer can call dedicated tooling rather than reimplement bundle parsing in-browser

### Backend services

- HTTP API for durable resource management, import control, and scene persistence
- WebSocket gateway for live tabletop session state, presence, and transform/event sync
- Background import workers for extraction, normalization, validation, and thumbnail generation
- Metadata database for packages, assets, prefabs, scenes, import jobs, and warnings
- Blob or filesystem-backed package storage for normalized meshes, textures, audio, manifests, and thumbnails

### Runtime and engine boundary

- `packages/engine` holds scene entity models, component registry, asset loading orchestration, and interaction contracts
- `packages/render-presets` holds retro material presets, post-processing configuration, and shader utilities
- `packages/scripting-api` defines the sandbox-visible API surface and typed lifecycle hooks
- `apps/web` owns the React shell, R3F canvas, panels, and viewport orchestration

### Multiplayer baseline

- Start with a simple authoritative WebSocket service interface, but keep it behind an adapter boundary
- Defer collaborative authoring CRDT work until after single-scene play/edit loops are solid
- If realtime shared editing becomes early priority, add Yjs at the editor document layer rather than mixing it into runtime entity state immediately

## Architecture Decisions

### Decision: Use React Three Fiber over raw imperative scene wiring

React Three Fiber is the right default for this project because the editor UI is already React-shaped, and the viewport benefits from declarative composition, pointer event handling, and shared state patterns. This does not weaken the Three.js requirement because Three.js remains the underlying engine.

The constraint is important: engine objects, content schemas, and runtime state must not become JSX-only concepts. Complex editor internals such as transform controls, selection passes, custom raycasting, and render presets should still be free to operate directly on Three.js primitives where that is clearer.

### Decision: Make the editor tool-rich without becoming modal or heavy

The editor should not chase an empty "minimal app" aesthetic if that hides useful controls. The right direction is a tool-rich interface compressed into small, contextual surfaces that stay close to the viewport.

This means:

- overlay-first panels instead of layout-heavy permanent sidebars
- keyboard-accessible commands for advanced actions
- default visibility for only the most frequently used panels
- no forced view switching for normal editing flows
- quick access to snapping, placement, selection, and notes without opening large modal dialogs

The result should feel closer to a tactical board with professional editing affordances than to a traditional form-heavy admin UI.

### Decision: Keep the content system package-based from day one

Imported assets, prefabs, scripts, and scenes should live in portable package folders with explicit manifests. This makes the modularity requirement real instead of aspirational and gives the editor a stable content contract to target.

Recommended package shape:

```text
content/packages/<package-name>/
  manifest.json
  assets/
  prefabs/
  scenes/
  scripts/
  thumbnails/
```

  ### Decision: Use a hybrid backend interface instead of a single transport style

  This system has three different workloads and they should not be forced through one interface model.

  - HTTP is the right default for import creation, package browsing, asset metadata lookup, scene save/load, and account or permission management.
  - WebSocket is the right default for live room presence, token movement, transform updates, pings, and transient play-mode events.
  - Background job workers are the right execution model for asset extraction, normalization, and thumbnail generation.

  This keeps the system debuggable and simple where it should be simple, while still giving the tabletop the low-latency behavior it needs.

  ### Decision: Build the import backend before the viewer-facing frontend

  The frontend cannot meaningfully validate rendering, asset browsing, or scene assembly until the system can ingest and serve normalized content. Because of that, the first backend slice should focus on import, storage, indexing, and asset delivery rather than on full auth or multiplayer concerns.

  The first backend slice should provide:

  1. An import entrypoint that can be triggered while the app is running.
  2. An import job runner that writes normalized package output.
  3. A metadata index that lets the frontend query available packages and assets.
  4. Stable asset delivery paths for normalized content.
  5. Scene persistence for saved scene data once content exists.

  ### Backend request and event model

  The backend should be shaped around explicit boundaries:

  ```text
  Browser / Editor
    │
    ├── HTTP API
    │   - create import jobs
    │   - list packages and assets
    │   - fetch and save scenes
    │   - inspect import status and warnings
    │
    ├── WebSocket gateway
    │   - join live session
    │   - presence updates
    │   - object transform sync
    │   - interaction and script events
    │
    └── Asset delivery
       - glb/gltf
       - textures
       - audio
       - thumbnails

  Backend
    │
    ├── API service
    ├── realtime session service
    ├── import worker
    ├── metadata DB
    └── package storage
  ```

  ### Initial backend API shape

  The MVP backend does not need a broad surface area. It needs a tight set of content-first endpoints and events.

  HTTP endpoints:

  - `POST /imports` creates an import job from a selected source bundle, file set, or uploaded archive.
  - `GET /imports/:id` returns job status, warnings, progress, and output package IDs.
  - `GET /packages` lists imported packages and summary metadata.
  - `GET /packages/:id` returns package manifests, asset summaries, and provenance.
  - `GET /assets/:id` returns asset metadata and the stable delivery path.
  - `GET /scenes/:id` returns a saved scene manifest.
  - `PUT /scenes/:id` persists scene state and prefab overrides.

  WebSocket event categories:

  - session join and leave
  - presence updates
  - entity transform updates
  - visibility and selection broadcasts where needed
  - script-generated scene events
  - GM control events

### Decision: Prefer a component registry over a full ECS framework initially

The project needs modular, attachable behaviors, but a heavyweight ECS is not required for the first slice. A typed component registry backed by serializable JSON data is simpler to debug, easier to expose in the editor inspector, and more compatible with package editing.

If scale later demands a denser ECS, the registry can evolve internally without changing author-facing content files.

### Decision: Sandboxed scripting uses a restricted API, not unrestricted app code execution

Scripts should be authored like TypeScript modules with declared parameters and lifecycle hooks, but executed through a sandbox boundary that only exposes approved capabilities such as entity lookup, transform mutation, local state, audio triggers, and event dispatch.

This keeps customizability high without making imported packages equivalent to arbitrary trusted code.

## Suggested Repository Layout

```text
apps/
  web/
  importer/
  api/
  session-gateway/
  import-worker/
packages/
  content-schema/
  asset-index/
  engine/
  import-core/
  import-tts/
  render-presets/
  scripting-api/
  storage/
  ui/
content/
  packages/
docs/
openspec/
Mods/
```

## First Build Slice

1. Define the manifest schemas for assets, prefabs, scenes, scripts, and import job records.
2. Build the import backend path: API entrypoint, worker, package storage, and metadata index.
3. Normalize one narrow class of TTS-derived source assets into the manifest format and serve the results back through stable asset paths.
4. Scaffold `apps/web` with React, Vite, TypeScript, Three.js, and R3F.
5. Build a viewport that can render one imported test asset, orbit the camera, and select objects.
6. Add a minimal asset browser and scene outliner backed by the package index.
7. Add Monaco-based script editing and a stub sandbox runtime.

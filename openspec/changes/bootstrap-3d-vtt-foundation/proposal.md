# bootstrap-3d-vtt-foundation

## Why

This repository has a useful corpus of Tabletop Simulator-related assets, but it does not yet have a structured product plan for turning those assets into a usable 3D virtual tabletop. The immediate need is to convert the broad vision into an OpenSpec change that captures the first implementation slice clearly enough to drive code and review.

## What Changes

**Planning model**
- From: a standalone narrative product brief in `docs/3d-vtt-spec.md`
- To: an OpenSpec change set with proposal, delta specs, technical design, and implementation tasks
- Reason: the project needs reviewable, versioned artifacts that can evolve as implementation begins
- Impact: non-breaking; establishes the planning baseline for future work

**Rendering and editor foundation**
- From: no agreed implementation stack
- To: a concrete web stack centered on Three.js, React, and React Three Fiber with a clean separation between editor UI and engine/runtime modules
- Reason: early stack drift will slow development and make modularity harder later
- Impact: foundational; shapes package boundaries and first code scaffolding

**Import and content model**
- From: raw TTS-derived assets with no normalized pipeline
- To: a package-based import model with a dedicated backend pipeline for import jobs, normalized asset storage, metadata indexing, and asset delivery
- Reason: the frontend needs imported content before it can render anything meaningful, and raw Unity bundles are not a stable browser runtime format
- Impact: foundational; defines how content enters and moves through the system

**Backend interface model**
- From: no agreed backend communication model
- To: a hybrid backend where HTTP handles durable resources and import control flows, WebSocket handles live session state, and workers handle asset normalization jobs
- Reason: this matches the actual workload split of a 3D VTT better than forcing everything through one interface style
- Impact: foundational; shapes service boundaries, storage contracts, and frontend integration points

**Scripting and modularity**
- From: no defined extensibility model
- To: a sandboxed in-editor scripting path and package-based modular content structure
- Reason: custom behavior and content reuse are core to the product value
- Impact: foundational; shapes API boundaries, editor UX, and trust model

## Capabilities

### New Capabilities
- `asset-import`: Runtime-triggered import flow, normalization jobs, and package indexing for TTS-derived content.
- `content-schema`: Shared schema contracts for startup import behavior, package identity, scene references, and storage/index metadata.
- `runtime-rendering`: Retro-styled 3D scene rendering, camera movement, and object interaction.
- `scene-editor`: Minimal editor UX for assembling and editing scenes in-browser.
- `scripting-runtime`: Sandboxed in-editor scripting and attachable behavior modules.

### Modified Capabilities

None.

## Impact

- [docs/3d-vtt-spec.md](docs/3d-vtt-spec.md): remains as the narrative brief and background context
- OpenSpec structure under `openspec/`: becomes the canonical planning layer for ongoing work
- Future code layout: expected to adopt a monorepo split between web app, backend import/session services, engine, schema, and scripting packages

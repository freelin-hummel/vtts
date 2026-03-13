# 3D VTT Spec

## 1. Product Summary

Build a web-based 3D virtual tabletop using Three.js that feels as frictionless as Owlbear Rodeo, but in a fully navigable 3D scene. It should import content derived from Tabletop Simulator mod assets, render in a deliberately low-fidelity late-90s style, and expose an in-editor scripting and customization model where nearly every system is modular and editable.

The product target is not photorealism, heavy simulation, or AAA tooling. The target is fast session setup, low cognitive load, intuitive movement, expressive modular content, and an art direction closer to RuneScape Classic, PlayStation 1, and Nintendo 64-era worlds.

## 2. Vision

### Core promise

"Open a map, drop in pieces, move quickly, script behavior simply, and run a session without fighting the tool."

### Design pillars

1. Movement first
   Navigation, camera control, token placement, and scene editing must feel immediate and legible.
2. Low-friction setup
   Importing assets and assembling scenes should take minutes, not hours.
3. Stylized, low-fidelity rendering
   Visual quality should come from art direction and clarity, not polygon count or complex lighting.
4. Modular by default
   Every meaningful subsystem should be replaceable, configurable, or extensible without forking the entire app.
5. Scriptable in editor
   Creators should be able to attach lightweight scripts and data-driven behaviors without rebuilding the application.

## 3. Product Goals

### Primary goals

1. Import meshes, textures, audio, and metadata originating from TTS mods.
2. Assemble 3D scenes from imported assets and reusable prefabs.
3. Support fast GM and player movement through a clean 3D interface.
4. Provide lightweight multiplayer presence with synchronized object state.
5. Allow in-editor scripting for interactions, triggers, object behaviors, and scene logic.
6. Make content structure explicit and editable through modular packages.

### Non-goals for MVP

1. Photorealistic rendering.
2. Physics-heavy sandbox simulation.
3. Full parity with Tabletop Simulator game logic.
4. Native direct execution of arbitrary untrusted third-party scripts.
5. Full DCC-grade modeling tools inside the editor.

## 4. Target Users

### Game master

Needs to import content fast, assemble scenes quickly, move through the world cleanly, place tokens/props/NPCs, and trigger simple scripted interactions.

### Module builder

Needs a reusable asset and prefab system, editable data, attachable scripts, and a package-based workflow for sharing adventures, props, encounters, and mechanics.

### Player

Needs clear movement, strong spatial understanding, simple interaction affordances, and minimal UI clutter.

## 5. Experience Principles

### UI principles

1. Minimal chrome
   The 3D scene is the primary surface. Toolbars stay compact and contextual.
2. One obvious movement model
   Default controls must be predictable and visible in onboarding.
3. Fast manipulation
   Move, rotate, duplicate, group, and snap should require few clicks.
4. Progressive complexity
   Basic play works without touching advanced scripting or configuration.
5. Consistent object model
   Assets, prefabs, scene instances, scripts, and properties should follow the same editing patterns.

### Interaction baseline

1. Left click selects.
2. Right drag or middle drag orbits camera.
3. WASD pans or walks depending on camera mode.
4. Mouse wheel zooms or changes height.
5. Double click focuses object.
6. Drag from asset browser drops object into world.
7. Gizmo handles cover translate, rotate, and scale.

## 6. Visual Direction

### Rendering style

The look should intentionally evoke RuneScape, PSX, and N64-era 3D:

1. Low polygon counts.
2. Limited texture resolution.
3. Vertex-lit or very simple directional lighting.
4. Optional affine-like texture wobble, dithering, posterization, and fog.
5. Strong silhouettes and readable color blocks.
6. Deliberately constrained material model.

### Technical style constraints

1. Prefer glTF assets with reduced geometry and compressed textures.
2. Use a small set of shader variants instead of physically based complexity.
3. Support scene-wide render presets such as `Classic`, `PSX`, `N64`, and `Clean Lowpoly`.
4. Favor baked ambient color, gradient fog, and stylized shadows over dynamic realism.

## 7. Core Feature Set

### 7.1 Scene and board management

1. Create, duplicate, archive, and publish scenes.
2. Scene contains terrain, static props, interactive props, lights, triggers, tokens, audio zones, and metadata.
3. Scene state is serializable as JSON plus referenced assets.
4. Optional scene layers for GM notes, collision, audio, gameplay, and decoration.

### 7.2 Asset library

1. Import pipeline for TTS-derived assets.
2. Internal normalized asset library built around mesh, material, texture, audio, decal, and prefab types.
3. Search, tags, collections, and thumbnails.
4. Bulk metadata editing.
5. Variant system for alternate skins or simplified LODs.

### 7.3 Prefabs and modular content

1. Prefabs wrap asset references plus default components and properties.
2. Prefabs can be nested.
3. Prefabs can include scripts, trigger volumes, interaction prompts, and default permissions.
4. Adventure packs and rulesets ship as modular packages.

### 7.4 Play surface

1. Select and move tokens or objects.
2. Grid and gridless support.
3. Snap options for translation and rotation.
4. Distance measuring in 3D.
5. Ping, focus, and follow-camera interactions.
6. Hidden or GM-only objects.

### 7.5 Multiplayer

1. Real-time shared scene state for object transforms, visibility, turn markers, and script-triggered state.
2. Presence indicators for connected users.
3. Role model: owner, GM, player, spectator.
4. Event log for state changes and script actions.

### 7.6 Editor

1. In-browser scene editor.
2. Dockable or collapsible panels for outliner, inspector, asset browser, console, and script editor.
3. Direct manipulation in viewport.
4. Undo and redo for all authoring actions.
5. Play mode and edit mode separation.

## 8. TTS Asset Import Requirements

### 8.1 Supported source types

The provided repository already contains example TTS-related assets under [Mods/](../Mods/). Import should target the following source categories:

1. Extracted meshes and textures from TTS mods.
2. Tabletop Simulator save or object JSON metadata when available.
3. Unity asset bundles that have been preprocessed offline.
4. Loose media files such as images, PDFs, text, translations, and audio.

### 8.2 Important constraint

Direct browser-side ingestion of Unity `.unity3d` bundles is a poor primary strategy. Parsing them reliably in a browser is difficult, format-sensitive, and will create a fragile runtime. The system should instead define:

1. An offline importer or CLI that extracts TTS-origin assets into a normalized project format.
2. A browser-side importer for already-normalized assets and metadata.

### 8.3 Normalized import target

Imported source material should be converted into:

1. `glTF/glb` for meshes.
2. `png/webp/ktx2` for textures.
3. `ogg/mp3/wav` for audio.
4. JSON manifests for object metadata, tags, transforms, scripts, and references.
5. Generated thumbnail images.

### 8.4 Import stages

1. Source scan
   Detect supported files, infer object groupings, and locate metadata.
2. Extraction
   Convert Unity or raw source assets into normalized formats.
3. Validation
   Check missing textures, invalid meshes, oversized geometry, and unsupported materials.
4. Stylization
   Optionally reduce texture resolution, quantize colors, decimate geometry, and assign low-fidelity material presets.
5. Prefab generation
   Turn recognized object groups into reusable prefabs.
6. Indexing
   Generate searchable library entries and thumbnails.

### 8.5 Importer outputs

Each imported asset package should produce:

1. A package manifest.
2. Asset records.
3. Prefab records.
4. Referenced binary assets.
5. Import warnings and provenance metadata.

### 8.6 Provenance and editing

Imported assets remain editable after import. Users should be able to:

1. Replace textures.
2. Swap materials.
3. Override mesh scale and origin.
4. Add colliders and interaction volumes.
5. Attach scripts.
6. Re-export as a reusable package.

## 9. Content Data Model

### Key entities

1. Asset
   Raw imported file or normalized media resource.
2. Prefab
   Reusable object blueprint with components and defaults.
3. Scene
   Collection of instantiated prefabs and scene settings.
4. Entity
   Runtime object instance in a scene.
5. Component
   Modular behavior or data attachment such as transform, mesh, collider, light, audio source, token, trigger, or script.
6. Script
   Editable logic module with declared inputs, outputs, permissions, and events.
7. Package
   Versioned bundle of assets, prefabs, scripts, and scenes.

### Recommended storage model

Use JSON or JSONC for editable metadata and manifests. Binary assets should remain in predictable package folders. The system should be content-addressable where practical so deduplication and syncing are straightforward.

Example package shape:

```text
package/
  manifest.json
  assets/
    meshes/
    textures/
    audio/
  prefabs/
  scenes/
  scripts/
  thumbnails/
```

## 10. Technical Architecture

### Frontend stack

1. Three.js remains the underlying rendering engine and source of truth for scene graph, materials, loaders, cameras, and low-level render behavior.
2. React Three Fiber should be the preferred React integration layer for the web app viewport because it preserves full Three.js access while fitting naturally with a React editor UI.
3. React is used for editor UI, panel layout, inspectors, and state-driven tools around the viewport.
4. TypeScript across the full codebase.
5. Zustand or another lightweight store for editor and runtime state.
6. Yjs or a similar CRDT/event-sync layer for collaborative editing if collaborative authoring is prioritized.

### React Three Fiber guidance

React Three Fiber is compatible with the requirement to use Three.js because it is a renderer on top of Three.js rather than a separate graphics engine. It is a good fit here if used deliberately:

1. Use React Three Fiber for scene composition, pointer events, camera wrappers, and integration with React-driven editor state.
2. Keep the core content model, entity-component system, import pipeline, and multiplayer state independent from JSX so the engine does not become tightly coupled to React.
3. Allow imperative escape hatches for editor tooling that is easier to implement directly against Three.js objects, especially transform gizmos, selection outlines, custom raycasting, and specialized render passes.
4. Use helper libraries selectively. `@react-three/drei` is useful, but the editor should not depend on convenience abstractions that are hard to control or serialize.
5. Keep render presets, materials, and post-processing defined in engine-level modules so they can be reused even if the UI shell changes later.

### Rendering architecture

1. Core scene graph wraps Three.js objects with application entity IDs.
2. Entity-component layer defines editable runtime behavior.
3. React Three Fiber binds the scene graph into the React app and handles viewport composition without replacing the underlying Three.js object model.
4. Render pipeline exposes low-fidelity presets via post-processing and shader flags.
5. Asset manager caches normalized media and mesh resources.
6. Interaction system handles selection, hit testing, gizmos, and camera controls.

### Backend services

1. Auth and session service.
2. Multiplayer sync service.
3. Asset/package storage service.
4. Import worker service for offline or server-side conversion jobs.
5. Optional search/indexing service for large content libraries.

### Deployment modes

1. Hosted SaaS mode.
2. Self-hosted mode for private groups.
3. Local-only authoring mode with optional later publish/sync.

## 11. Rendering Specification

### Camera modes

1. Orbit mode for general tabletop overview.
2. Strategy mode with angled top-down control.
3. Explore mode for close third-person or free-fly inspection.

### Performance targets

1. Mid-range laptop should handle a typical session scene at 60 FPS with stylized preset enabled.
2. Large scenes should degrade gracefully through simplified LODs, impostors, culling, and texture caps.
3. Mobile is a stretch goal unless scenes and tooling are aggressively constrained.

### Shader and post-process options

1. Color quantization.
2. Ordered dithering.
3. Vertex snapping for retro wobble.
4. Distance fog.
5. Palette remapping.
6. Shadow simplification.

Each effect should be optional and grouped into presets rather than exposed as unexplained raw toggles.

## 12. Movement and Usability Specification

### Must-have usability outcomes

1. A new player can move camera and token confidently within 30 seconds.
2. A GM can place a new object from the asset browser into the scene in under 10 seconds.
3. Most common actions should be available with no more than one panel open.

### Navigation requirements

1. Smooth orbit with bounded pitch.
2. Fast pan and zoom with sensible damping.
3. Focus shortcut to selected entity.
4. Optional edge-scroll and keyboard navigation.
5. Clear ground-plane projection while dragging objects.
6. Movement collision rules configurable per scene.

### Editing requirements

1. Transform gizmo always visible when applicable.
2. Multi-select and group operations.
3. Snap toggle and step controls.
4. Inspector editing for numeric transforms.
5. Contextual quick actions near selected object.

## 13. In-Editor Scripting Specification

### Goals

Enable creators to add interaction and logic without requiring a full rebuild or external development environment.

### Script model

Scripts are modular resources attached to prefabs, scene instances, or global scene controllers. They should expose:

1. Metadata
   Name, version, author, package, permissions.
2. Public parameters
   Editable inspector fields for designers.
3. Lifecycle hooks
   `onInit`, `onDestroy`, `onUpdate`, `onInteract`, `onEnterTrigger`, `onLeaveTrigger`, `onNetworkEvent`.
4. Event API
   Publish and subscribe to typed scene events.
5. Safe capability model
   Explicit access to transform, tags, state, audio, chat, dice, and spawn APIs.

### Execution model

1. Use a sandboxed scripting runtime.
2. Prefer TypeScript-like authored scripts compiled or interpreted into a safe subset.
3. Do not execute arbitrary unrestricted JavaScript from untrusted packages.
4. Validate and lint scripts in editor.
5. Provide console output, warnings, and runtime error overlays.

### Recommended implementation options

1. Sandboxed JavaScript/TypeScript with a restricted API surface.
2. Visual scripting later, not in MVP.
3. Data-driven trigger graphs as a simpler alternative for non-programmers.

### Editor features for scripts

1. Inline code editor with syntax highlighting.
2. Autocomplete for supported APIs.
3. Live validation.
4. Hot reload in play mode where safe.
5. Parameter inspector for script-exposed fields.
6. Event log and debugging tools.

## 14. Modularity and Customization Specification

### System modularity

All major systems should be isolated behind interfaces or plugin contracts:

1. Import adapters.
2. Render presets.
3. Component types.
4. Script APIs.
5. Storage backends.
6. Authentication providers.
7. Networking transport.
8. Ruleset packages.

### Customization principles

1. Prefer configuration over hardcoded assumptions.
2. Keep content definitions human-readable.
3. Support local package development with immediate reload.
4. Separate engine, editor, and content packages.
5. Version packages independently.

## 15. Security and Trust Model

1. Treat imported third-party content as untrusted.
2. Run import conversion in isolated worker or server processes.
3. Sandbox scripts with explicit permission scopes.
4. Validate all package manifests and script metadata.
5. Keep authoritative multiplayer state on the server for competitive or persistent sessions.

## 16. Suggested Package and Repository Layout

```text
apps/
  web/
  importer/
packages/
  engine/
  editor/
  ui/
  content-schema/
  scripting-api/
  render-presets/
  tts-importer/
content/
  packages/
docs/
  3d-vtt-spec.md
Mods/
```

## 17. MVP Scope

### MVP should include

1. Three.js scene viewport with orbit camera and object selection.
2. Asset browser for normalized imported assets.
3. Drag-drop scene assembly.
4. Basic prefab and component system.
5. Scene save/load.
6. One retro render preset.
7. Simple multiplayer state sync for transforms and visibility.
8. Sandboxed scripts with a minimal event API.
9. Offline TTS asset normalization workflow.

### MVP should exclude

1. Advanced character sheets.
2. Full rules automation.
3. In-browser raw Unity asset bundle parsing.
4. Visual scripting graphs.
5. Mobile-first support.

## 18. Post-MVP Roadmap

### Phase 2

1. Multiple render presets.
2. More advanced script APIs.
3. Package marketplace or import/export sharing flow.
4. Better collaborative editing.
5. Audio zones and ambient systems.

### Phase 3

1. Visual scripting.
2. Ruleset kits.
3. NPC pathing and encounter tools.
4. Procedural terrain helpers.
5. Replay or timeline tooling.

## 19. Open Technical Questions

1. Will the first importer be a local CLI, an Electron helper, or a server-side job?
2. How much of TTS metadata is available alongside the provided asset corpus?
3. Is the initial multiplayer model authoritative server sync or lightweight peer-assisted sync?
4. Should scripts be per-scene only in MVP, or also attachable to prefab instances?
5. Is character movement token-based, freeform, or both in the first release?

## 20. Recommended First Build Sequence

1. Define normalized content schema.
2. Build offline TTS import prototype that outputs glTF plus manifests.
3. Build Three.js viewport with selection, orbit, and drag placement.
4. Add asset library and prefab system.
5. Add scene persistence.
6. Add one retro render preset.
7. Add script runtime and editor.
8. Add multiplayer sync.

## 21. Success Metrics

1. Time to first playable imported scene: under 15 minutes.
2. Time to place and configure a new object: under 10 seconds for common cases.
3. Median frame rate on target hardware: 60 FPS in typical scenes.
4. Script authoring loop: edit to visible result in under 3 seconds.
5. Session startup friction: GM can open and begin running a scene in under 1 minute.

## 22. Summary

This project should be a Three.js-based, low-friction, low-fidelity 3D VTT with a strong import story for TTS-derived content, a scene-first editor, and a safe modular scripting model. The product succeeds if it feels fast, readable, easy to move through, and easy to customize, even when the underlying content comes from messy imported mod assets.
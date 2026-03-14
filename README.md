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

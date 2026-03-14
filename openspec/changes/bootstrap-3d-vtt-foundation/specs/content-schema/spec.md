# Delta for content-schema

## ADDED Requirements

### Requirement: Define startup import behavior in shared schemas
The system SHALL define shared schema contracts for startup import configuration and results before backend service code branches so import orchestration, indexing, and storage agree on the first package lifecycle.

#### Scenario: Importing configured mod sources on startup
- **GIVEN** the backend starts with one or more configured mod source folders
- **WHEN** the startup import flow scans those sources
- **THEN** the shared import contracts SHALL model each discovered mod as a package-scoped import unit
- **AND** the contracts SHALL support reindexing newly discovered assets without redefining the package shape per service

### Requirement: Define stable package and asset identity contracts
The system SHALL define shared schema contracts for stable package-scoped IDs and generated global IDs before service code branches so imported content can be referenced consistently across APIs, workers, storage, and scenes.

#### Scenario: Referencing imported content across boundaries
- **GIVEN** an imported package contains assets and prefabs
- **WHEN** API handlers, workers, or frontend clients reference that content
- **THEN** the shared contracts SHALL preserve stable package-scoped identifiers for authored content records
- **AND** the contracts SHALL expose generated global identifiers for cross-package lookup and delivery paths

### Requirement: Define prefab-plus-override scene references
The system SHALL define shared schema contracts for scene entities to reference prefabs plus local overrides rather than embedding full prefab payloads into scene state.

#### Scenario: Saving scene state for an imported prefab
- **GIVEN** a creator places a prefab-derived entity into a scene
- **WHEN** the scene state is serialized
- **THEN** the shared scene contracts SHALL store a prefab reference with local override data for transform, visibility, script parameters, notes, and related per-scene fields
- **AND** the saved scene SHALL remain reusable without copying unrelated prefab data into the scene record

### Requirement: Define storage and metadata boundaries as shared contracts
The system SHALL define shared schema contracts for package metadata records and object-storage-backed asset locations before service code branches so storage implementations can vary without changing import or API payload shape.

#### Scenario: Resolving stored assets from indexed metadata
- **GIVEN** a package has normalized assets written to storage
- **WHEN** the metadata index returns package, asset, or prefab records
- **THEN** the shared contracts SHALL distinguish structured metadata from object-storage delivery locations
- **AND** services SHALL be able to switch between local disk and future storage backends without changing the content record schema

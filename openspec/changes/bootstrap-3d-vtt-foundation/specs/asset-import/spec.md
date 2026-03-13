# Delta for asset-import

## ADDED Requirements

### Requirement: Normalize TTS-derived source assets
The system SHALL convert supported TTS-derived source assets into a normalized package format that the browser runtime can load without depending on raw Unity bundle parsing.

#### Scenario: Importing supported source files
- **GIVEN** a package of supported TTS-derived source files
- **WHEN** the user runs the import workflow
- **THEN** the system SHALL output normalized meshes, textures, audio, and JSON manifests
- **AND** the output SHALL be stored in a package structure that the editor can index

#### Scenario: Starting import from the running app
- **GIVEN** a creator is using the application while connected to an available import backend
- **WHEN** the creator starts an import from the app interface
- **THEN** the system SHALL create an import job without blocking the main editor workflow
- **AND** the creator SHALL be able to inspect progress, completion, or warnings for that import

#### Scenario: Unsupported raw input
- **GIVEN** a source file that the importer cannot normalize directly
- **WHEN** the user attempts to import it
- **THEN** the system SHALL report a structured warning or failure reason
- **AND** the system SHALL not require the browser runtime to parse that raw file directly

### Requirement: Preserve editable provenance after import
The system SHALL preserve enough metadata after import for creators to edit imported assets without losing the relationship to the original source package.

#### Scenario: Reviewing import results
- **GIVEN** an imported asset package
- **WHEN** the creator inspects imported assets in the editor
- **THEN** the system SHALL show import warnings, source identifiers, or provenance metadata where available
- **AND** the creator SHALL be able to override presentation properties such as scale, origin, and material assignment

### Requirement: Provide indexed access to imported packages
The system SHALL make imported packages queryable through structured metadata rather than requiring the frontend to scan raw package folders directly.

#### Scenario: Browsing imported content
- **GIVEN** one or more packages have been imported successfully
- **WHEN** the editor requests available content for browsing or placement
- **THEN** the system SHALL return indexed package, asset, and prefab metadata
- **AND** the editor SHALL be able to resolve stable asset delivery paths from that metadata

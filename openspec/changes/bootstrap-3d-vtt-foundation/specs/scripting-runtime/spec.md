# Delta for scripting-runtime

## ADDED Requirements

### Requirement: Allow attachable in-editor scripts

The system SHALL allow creators to attach scripts to prefabs, scene entities, or scene controllers from within the editor.

#### Scenario: Attaching a script to an entity

- **GIVEN** a creator selects an entity or prefab in the editor
- **WHEN** the creator attaches a script resource
- **THEN** the system SHALL persist the script reference and editable parameters with that content
- **AND** the script SHALL become available during play mode according to its lifecycle hooks

### Requirement: Restrict script capabilities through a sandbox API

The system SHALL execute user-authored scripts through a restricted runtime API rather than granting unrestricted application code access.

#### Scenario: Running a safe scene interaction script

- **GIVEN** a script that uses supported lifecycle hooks and approved scene APIs
- **WHEN** the relevant play-mode event occurs
- **THEN** the system SHALL execute the script within the sandbox boundary
- **AND** the script SHALL only access approved capabilities exposed by the scripting API

#### Scenario: Script attempts unsupported access

- **GIVEN** a script that attempts to call unsupported or restricted functionality
- **WHEN** the script is validated or executed
- **THEN** the system SHALL reject or report the unsupported access clearly
- **AND** the failure SHALL not compromise scene stability or unrelated editor state

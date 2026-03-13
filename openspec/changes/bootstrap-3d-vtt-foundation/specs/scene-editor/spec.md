# Delta for scene-editor

## ADDED Requirements

### Requirement: Keep the editor surface minimal and movement-first
The system SHALL keep the editor interface visually minimal and centered on fast movement, selection, and placement in the 3D scene.

#### Scenario: Opening the editor
- **GIVEN** a GM opens the editor for a scene
- **WHEN** the main interface loads
- **THEN** the viewport SHALL remain the dominant surface
- **AND** only essential controls for navigation, selection, asset browsing, and inspection SHALL be visible by default

### Requirement: Keep the editor tool-rich but ultracompact
The system SHALL provide dense editing capability without relying on large permanent panels, modal-heavy workflows, or view switching for common actions.

#### Scenario: Working with default editor surfaces
- **GIVEN** a creator opens the editor in its default layout
- **WHEN** the editor finishes loading
- **THEN** the default visible surfaces SHALL stay limited to the viewport, scene outliner, inspector, and notes or chat surface
- **AND** additional tools SHALL remain quickly accessible without overwhelming the main view

#### Scenario: Opening additional tools
- **GIVEN** a creator needs access to assets or advanced actions
- **WHEN** the creator invokes the relevant control or shortcut
- **THEN** the system SHALL open compact overlay or docked tools without forcing a separate editor view
- **AND** the creator SHALL be able to pin or rearrange those tools when needed

### Requirement: Support direct scene assembly
The system SHALL let creators assemble scenes by placing and editing assets directly in the viewport with minimal panel friction.

#### Scenario: Dragging an asset into the scene
- **GIVEN** a creator browsing imported assets
- **WHEN** the creator drags an asset into the viewport
- **THEN** the system SHALL place an instance into the scene at a visible target location
- **AND** the creator SHALL be able to immediately adjust transform properties from the viewport or inspector

#### Scenario: Editing transforms after placement
- **GIVEN** a selected scene entity
- **WHEN** the creator moves, rotates, or scales the entity
- **THEN** the system SHALL expose direct manipulation controls and inspector values for the same object
- **AND** the edited state SHALL remain serializable in the scene manifest

### Requirement: Favor viewport-first selection and keyboard-accelerated editing
The system SHALL let creators act on selected objects primarily from the viewport while supporting fast keyboard-driven operation.

#### Scenario: Selecting an object
- **GIVEN** a creator selects an entity in the scene
- **WHEN** the selection becomes active
- **THEN** the system SHALL show transform controls and compact quick actions near the selected object
- **AND** equivalent inspector controls SHALL remain available without taking focus away from the viewport unnecessarily

#### Scenario: Using advanced editing actions
- **GIVEN** a creator needs a less common editing action
- **WHEN** the creator uses shortcuts or command search
- **THEN** the system SHALL expose advanced actions without requiring navigation through modal flows
- **AND** keyboard-first use SHALL remain a first-class interaction path

### Requirement: Blend editing and play-facing interaction in one surface
The system SHALL support a fluid workflow where creators can move between editing and practical interaction checks without disruptive mode changes.

#### Scenario: Checking behavior while editing
- **GIVEN** a creator is assembling or configuring a scene
- **WHEN** the creator wants to test movement, placement, or interaction behavior
- **THEN** the system SHALL allow that check from the same main surface
- **AND** the creator SHALL not need to fully leave the editor context for routine validation

### Requirement: Express a dark-first tactical visual style
The system SHALL present the editor with a dark-first visual language that feels tactical and modern, using restrained retro references rather than novelty styling.

#### Scenario: Rendering editor controls
- **GIVEN** a creator is working in the editor
- **WHEN** controls, panels, and buttons are displayed
- **THEN** the default theme SHALL be dark-first and visually subordinate to the 3D scene
- **AND** control styling MAY use light retro cues such as beveled or shaded pressed states without becoming ornamental

### Requirement: Keep content modular and reusable
The system SHALL organize imported and authored content as reusable packages, prefabs, and scene data rather than hardcoded one-off scene state.

#### Scenario: Reusing authored content
- **GIVEN** a creator has assembled and configured a reusable object or encounter setup
- **WHEN** the creator saves it as reusable content
- **THEN** the system SHALL preserve it as package-backed reusable data
- **AND** the content SHALL remain editable without modifying unrelated scenes

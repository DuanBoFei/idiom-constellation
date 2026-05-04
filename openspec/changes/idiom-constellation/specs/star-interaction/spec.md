## ADDED Requirements

### Requirement: Star layout generation
The game SHALL generate positions for 12-16 star buttons per question, placed pseudo-randomly within the game area.

#### Scenario: Layout calculation
- **WHEN** a new question loads
- **THEN** the system SHALL calculate non-overlapping positions for all stars (answer characters + distractors), ensuring minimum 80px spacing between stars

#### Scenario: Star coordinate sharing
- **WHEN** stars are positioned
- **THEN** the same coordinate data SHALL be shared between the DOM star buttons and the top Canvas (for connection line drawing)

### Requirement: Star interaction via DOM buttons
Each character star SHALL be rendered as a DOM button element for reliable touch and click handling.

#### Scenario: Star button properties
- **WHEN** a star button is rendered
- **THEN** it SHALL be absolutely positioned at its calculated coordinates, with a visual size of 40×40px and a touch target of 64×64px

#### Scenario: Pointer Events handling
- **WHEN** a user taps/clicks a star
- **THEN** the game SHALL handle the interaction via Pointer Events (not click or touchstart separately), supporting both mouse and touch input

#### Scenario: Star press feedback
- **WHEN** a star is correctly selected
- **THEN** the star SHALL animate to 1.5x scale with a golden glow effect

### Requirement: Sequential selection and validation
The player SHALL select exactly 4 stars in sequence. Selection order matters and is strictly validated.

#### Scenario: Select 4 stars in order
- **WHEN** the player taps 4 stars sequentially
- **THEN** the game SHALL record the selection order and immediately validate against the correct answer

#### Scenario: Strict order validation
- **WHEN** the selected characters match the correct idiom in the exact order
- **THEN** the game SHALL trigger the success flow (golden constellation, result card)

#### Scenario: Wrong order feedback
- **WHEN** the selected characters do not match the correct idiom in order
- **THEN** the game SHALL flash the 4 selected stars red, show a brief shake animation, and reset the selection

#### Scenario: Cannot select same star twice
- **WHEN** the player taps an already-selected star
- **THEN** the game SHALL ignore the tap (no deselect, no error)

### Requirement: Connection line drawing
The game SHALL draw connection lines between selected stars on the top Canvas layer in real time.

#### Scenario: Step-by-step line drawing
- **WHEN** the player selects each star in sequence
- **THEN** the Canvas SHALL draw a line from the previously selected star to the current one

#### Scenario: Ink-wash bezier curve
- **WHEN** drawing connection lines
- **THEN** the line SHALL be rendered as a bezier curve with a gradient stroke resembling ink-wash brush effect

#### Scenario: Drag preview line
- **WHEN** the player has selected at least 1 star and is dragging toward another
- **THEN** a semi-transparent preview line SHALL follow the pointer to the nearest selectable star

#### Scenario: Error line break
- **WHEN** validation fails
- **THEN** all connection lines SHALL animate breaking and snapping back to individual star positions

#### Scenario: Success golden ribbon
- **WHEN** validation succeeds
- **THEN** lines SHALL animate from ink color to golden color, with a glowing ribbon effect

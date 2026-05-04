## ADDED Requirements

### Requirement: WebAudio context initialization
The audio engine SHALL use the WebAudio API and initialize AudioContext on first user interaction.

#### Scenario: AudioContext lazy init
- **WHEN** the user first taps any interactive element
- **THEN** the game SHALL create or resume an AudioContext instance (required for iOS Safari compliance)

### Requirement: Click confirmation sound
Each star tap SHALL produce a short confirmation sound.

#### Scenario: Star click sound
- **WHEN** a star is selected
- **THEN** the game SHALL play a short (0.15s) sine wave tone at a pitch determined by the character's position (1st=262Hz, 2nd=330Hz, 3rd=392Hz, 4th=524Hz)

### Requirement: Idiom melody playback
Each idiom SHALL have an associated pentatonic melody that plays upon successful completion.

#### Scenario: Success melody
- **WHEN** an idiom is completed correctly
- **THEN** the game SHALL play a 4-note pentatonic melody (using the idiom's melody array) with each note lasting 0.2s, ascending in pitch

### Requirement: Error sound
Failed validation SHALL produce a distinct negative feedback sound.

#### Scenario: Error feedback
- **WHEN** the selected star order is incorrect
- **THEN** the game SHALL play a low-frequency (150Hz) sawtooth wave for 0.3s with quick decay

### Requirement: Success fanfare
Game completion SHALL play a celebratory sound.

#### Scenario: Game over fanfare
- **WHEN** all 6 questions are complete
- **THEN** the game SHALL play a rising arpeggio (C-E-G-C) as a completion fanfare

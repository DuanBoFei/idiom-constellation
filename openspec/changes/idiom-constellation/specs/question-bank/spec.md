## ADDED Requirements

### Requirement: Idiom question data model
The question bank SHALL define each idiom question using a structured JSON format with required fields.

#### Scenario: Question data structure
- **WHEN** a question is loaded
- **THEN** it SHALL contain fields: id, idiom (4-character string), pinyin, meaning, hint, difficulty (1-3), distractors (array of single characters), and optional story field

#### Scenario: Double idiom structure
- **WHEN** a double-idiom question is loaded
- **THEN** it SHALL contain a rounds array with two entries, each having idiom, hint, and distractors

### Requirement: 20 idiom minimum
The question bank SHALL contain at least 20 distinct idiom questions at MVP launch.

#### Scenario: Question count
- **WHEN** the game starts
- **THEN** question bank SHALL have at least 20 entries available

### Requirement: Difficulty tiering
Questions SHALL be tagged with difficulty levels 1, 2, or 3. The game SHALL use easier questions early and harder ones late.

#### Scenario: Difficulty distribution
- **WHEN** 6 questions are selected for a session
- **THEN** the distribution SHALL be approximately: 2 easy (level 1), 2 medium (level 2), 2 hard (level 3)

#### Scenario: Double idiom equals hard
- **WHEN** a hard question (level 3) is loaded
- **THEN** it SHALL use the double-idiom format

### Requirement: Randomized selection
The game SHALL randomly select 6 questions from the bank and shuffle the character stars per question.

#### Scenario: Per-session shuffle
- **WHEN** a new game session begins
- **THEN** the game SHALL randomly select 6 questions and shuffle their presentation order

#### Scenario: Star position shuffle
- **WHEN** each question loads
- **THEN** the star positions for both answer characters and distractors SHALL be randomly generated

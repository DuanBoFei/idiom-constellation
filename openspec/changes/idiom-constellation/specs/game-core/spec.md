## ADDED Requirements

### Requirement: Game state machine
The game SHALL manage a deterministic state machine with the following states: INIT, PLAYING, CHECKING, RESULT, GAMEOVER

#### Scenario: Game initializes in INIT state
- **WHEN** the game first loads
- **THEN** the game state SHALL be INIT, showing the start screen

#### Scenario: Playing state handles active gameplay
- **WHEN** the player starts a round
- **THEN** the game state SHALL transition to PLAYING, starting the timer and enabling star interaction

#### Scenario: Checking state validates star selection
- **WHEN** the player selects exactly 4 stars
- **THEN** the game state SHALL transition to CHECKING and validate the sequence

#### Scenario: Result state shows feedback
- **WHEN** validation completes
- **THEN** the game state SHALL transition to RESULT, showing success animation or error feedback

### Requirement: Fixed 6-question speed challenge
The game SHALL present exactly 6 questions per session in shuffled order. Questions 1-4 are single-idiom, questions 5-6 are double-idiom mode.

#### Scenario: Normal difficulty time limit
- **WHEN** a question is single-idiom (difficulty 1-2)
- **THEN** the time limit SHALL be 20 seconds

#### Scenario: Hard difficulty time limit
- **WHEN** a question is double-idiom (difficulty 3)
- **THEN** the time limit SHALL be 25 seconds

#### Scenario: Time bonus on correct answer
- **WHEN** the player answers correctly
- **THEN** the game SHALL add 5 bonus seconds

#### Scenario: Time runs out
- **WHEN** the timer reaches 0
- **THEN** the game SHALL mark the current question as failed and proceed to the next

#### Scenario: Game over condition
- **WHEN** all 6 questions are answered or the total time expires
- **THEN** the game SHALL transition to GAMEOVER state and show the results screen

### Requirement: Scoring system
The game SHALL calculate a final score based on correct answers and remaining time.

#### Scenario: Score calculation
- **WHEN** the game ends
- **THEN** the final score SHALL be calculated as: (correctAnswers × 100) + (remainingSeconds × 20), multiplied by 1.2 if all 6 correct

#### Scenario: Zero score
- **WHEN** no answers are correct
- **THEN** the final score SHALL be 0

### Requirement: Question progression
The game SHALL show a clue at the start of each question and reveal the answer after completion.

#### Scenario: Clue display
- **WHEN** a new question begins
- **THEN** the game SHALL display the clue (meaning or story reference) at the top of the screen

#### Scenario: Answer reveal
- **WHEN** the player answers correctly or time runs out
- **THEN** the game SHALL show the correct idiom characters in order

### Requirement: Double idiom mode
Questions 5 and 6 SHALL present two idioms in the same star field. The player completes one set before seeing the clue for the second.

#### Scenario: Sequential resolution
- **WHEN** the first idiom in double mode is completed
- **THEN** its 4 stars SHALL turn gold and become non-interactive, and the clue for the second idiom SHALL appear

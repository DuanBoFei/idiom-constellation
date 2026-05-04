## ADDED Requirements

### Requirement: Learning moment card
After each correct answer, the game SHALL display a card showing the idiom's meaning and cultural background.

#### Scenario: Correct answer card
- **WHEN** an idiom is completed correctly
- **THEN** a card SHALL slide up from the bottom with the idiom in large text, pinyin, meaning, and a short story/origin note

#### Scenario: Card dismiss
- **WHEN** the player taps anywhere outside the card or taps a "继续" button
- **THEN** the card SHALL animate out and the next question SHALL load

### Requirement: Incorrect answer feedback
After each wrong answer, the game SHALL briefly flash feedback without blocking gameplay.

#### Scenario: Wrong order feedback
- **WHEN** the star order is incorrect
- **THEN** the 4 selected stars SHALL flash red for 0.6s, shake, and the selection SHALL reset

#### Scenario: Timeout reveal
- **WHEN** time runs out without completing the idiom
- **THEN** the correct idiom SHALL be briefly shown (1.5s) with dimmed stars, then auto-advance to the next question

### Requirement: Game over summary
When the game ends, a summary screen SHALL overlay the star field showing session results.

#### Scenario: Score summary display
- **WHEN** the game ends
- **THEN** the summary SHALL display: final score, number of correct answers, and average response time per question

#### Scenario: Return to menu
- **WHEN** the summary screen is shown
- **THEN** the player SHALL have options to "再来一局" (play again) or "查看排行" (view leaderboard)

## ADDED Requirements

### Requirement: LocalStorage leaderboard persistence
The game SHALL store the top 10 scores in localStorage for the current day.

#### Scenario: Save score
- **WHEN** a game session ends
- **THEN** the score SHALL be saved to localStorage with: player name (default "匿名玩家"), score, correct count, date, and timestamp

#### Scenario: Daily reset
- **WHEN** loading the leaderboard
- **THEN** entries from previous days SHALL be filtered out, keeping only today's scores

#### Scenario: Top 10 limit
- **WHEN** saving a new score
- **THEN** only the top 10 scores for today SHALL be retained

### Requirement: Leaderboard display
The game SHALL display the daily top 10 leaderboard in a sortable list.

#### Scenario: Leaderboard rendering
- **WHEN** the leaderboard screen is shown
- **THEN** it SHALL display entries ranked by score (highest first), showing rank number, player name, score, and correct count

#### Scenario: Empty leaderboard
- **WHEN** no scores exist for today
- **THEN** the leaderboard SHALL display a "还没有记录" message

#### Scenario: Current player highlight
- **WHEN** the current player's score appears in the top 10
- **THEN** their entry SHALL be visually highlighted

# Answer Tracking System Documentation

## Overview

The game now tracks every question answer by player email, allowing you to analyze player performance across multiple sessions.

## How It Works

### 1. Session Start

When a player starts the game, a new session is created:

- **Endpoint**: `POST /api/sessions/start`
- **Data Sent**: `{ email: "player@example.com" }`
- **Returns**: Unique session ID
- **Storage**: `admin/data/sessions.json`

### 2. Answer Recording

Every time a player answers a question:

- **Endpoint**: `POST /api/sessions/answer`
- **Data Sent**:
  ```json
  {
    "session_id": "abc123...",
    "email": "player@example.com",
    "question_id": 1,
    "selected_answer": 0,
    "is_correct": true
  }
  ```
- **Storage**: `admin/data/answers.json`

### 3. Session End

When the game finishes (win or lose):

- **Endpoint**: `POST /api/sessions/end`
- **Data Sent**:
  ```json
  {
    "session_id": "abc123...",
    "email": "player@example.com",
    "final_score": 15000,
    "fuel_remaining": 20,
    "completed": true
  }
  ```
- **Updates**: Session record in `sessions.json`

## Data Structure

### sessions.json

```json
{
  "sessions": [
    {
      "id": 1,
      "session_id": "unique-session-id",
      "player_email": "player@example.com",
      "start_time": "2025-01-26T10:00:00.000Z",
      "end_time": "2025-01-26T10:05:30.000Z",
      "final_score": 15000,
      "fuel_remaining": 20,
      "completed": 1,
      "ip_address": "::1",
      "user_agent": "Mozilla/5.0..."
    }
  ]
}
```

### answers.json

```json
{
  "answers": [
    {
      "id": 1,
      "session_id": "unique-session-id",
      "player_email": "player@example.com",
      "question_id": 1,
      "selected_answer": 0,
      "is_correct": 1,
      "answered_at": "2025-01-26T10:02:00.000Z"
    }
  ]
}
```

## Querying Player Performance

### Get All Answers by Email

```javascript
const answers = require("./admin/data/answers.json").answers;
const playerAnswers = answers.filter(
  (a) => a.player_email === "player@example.com"
);
```

### Get Player Sessions

```javascript
const sessions = require("./admin/data/sessions.json").sessions;
const playerSessions = sessions.filter(
  (s) => s.player_email === "player@example.com"
);
```

### Calculate Success Rate

```javascript
const playerAnswers = answers.filter(
  (a) => a.player_email === "player@example.com"
);
const correctCount = playerAnswers.filter((a) => a.is_correct === 1).length;
const successRate = ((correctCount / playerAnswers.length) * 100).toFixed(2);
console.log(`Success Rate: ${successRate}%`);
```

### Get Answers for a Specific Session

```javascript
const sessionAnswers = answers.filter(
  (a) => a.session_id === "unique-session-id"
);
```

## Game Flow with Tracking

1. **Player Enters Email** → `POST /api/players/register`
2. **Game Starts** → `POST /api/sessions/start` (creates session with email)
3. **Player Answers Question 1** → `POST /api/sessions/answer` (records with email)
4. **Player Answers Question 2** → `POST /api/sessions/answer` (records with email)
5. **Player Answers Question 3** → `POST /api/sessions/answer` (records with email)
6. **Game Ends** → `POST /api/sessions/end` (updates session with final results)

## Benefits

- **Player History**: See all answers from a specific player across all their games
- **Question Analytics**: Identify which questions are most difficult
- **Session Tracking**: Link answers to specific game sessions
- **Performance Metrics**: Calculate success rates, average scores, etc.
- **Email-Based Reporting**: Generate reports per player

## Testing

1. Start the server: `npm start`
2. Play the game and enter your email
3. Answer the 3 quiz questions
4. Complete the game
5. Check the data files:
   - `admin/data/sessions.json` - Your session with email
   - `admin/data/answers.json` - Your 3 answers with email

## Notes

- All timestamps are in ISO 8601 format (UTC)
- `is_correct` is stored as 1 (true) or 0 (false)
- `completed` is stored as 1 (completed) or 0 (game over)
- Session IDs are cryptographically random (64 hex characters)
- Each answer is linked to both session_id and player_email for flexible querying

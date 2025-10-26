# Email Tracking Guide

## How Email Tracking Works

### 1. Player Registration

- When a player enters their email at the start of the game, it's stored in `admin/data/players.json`
- The email is also saved in browser's `sessionStorage` so they don't have to re-enter it

### 2. Session Tracking

- Every game session is linked to the player's email in `admin/data/sessions.json`
- Each session includes:
  - `player_email` - The player's email address
  - `session_id` - Unique identifier for this game session
  - `start_time` - When the game started
  - `end_time` - When the game ended
  - `final_score` - Player's final score
  - `fuel_remaining` - How much fuel was left
  - `completed` - Whether they finished the game (1) or ran out of fuel (0)

### 3. Answer Tracking

- Every quiz answer is recorded in `admin/data/answers.json` with:
  - `player_email` - Who answered
  - `session_id` - Which game session
  - `question_id` - Which question
  - `selected_answer` - What they chose (0=A, 1=B)
  - `is_correct` - Whether they got it right (1) or wrong (0)
  - `answered_at` - When they answered

## Viewing in Admin Panel

### To see the emails in the admin panel:

1. **Make sure the server is running**: The server must be restarted after code changes

   ```bash
   cd /Users/johnalcantara/Documents/yamaha
   npm start
   ```

2. **Play the game**:

   - Open http://localhost:3000
   - Enter your email
   - Play through the game
   - Answer the quiz questions

3. **Check the admin panel**:

   - Go to http://localhost:3000/admin/dashboard-vue.html
   - Login with your admin credentials
   - Click on "Sessions" tab
   - You'll see the "Player Email" column showing emails

4. **View session details**:
   - Click "View Details" on any session
   - You'll see a modal with:
     - Player email
     - All session information
     - All answers with correct/incorrect indicators

## Claim Prize Button Logic

The "Claim Prize" button works as follows:

1. **First time playing**: Button shows with a 5-second countdown, then auto-redirects
2. **Already clicked "Claim Prize"**: Button is hidden in all future sessions
3. **Status tracking**:
   - When clicked, `has_redirected` is set to `true` in `players.json`
   - This flag persists across all future game sessions
   - Button will never show again for that email

## Testing the Email Tracking

1. **Test new player**:

   ```bash
   # Open game, enter: test1@example.com
   # Complete the game
   # Check admin panel - should see email in sessions
   ```

2. **Test returning player**:

   ```bash
   # Close browser tab
   # Open game again - email modal should NOT appear
   # Play again
   # Check admin panel - should see 2 sessions with same email
   ```

3. **Test claim prize logic**:
   ```bash
   # First game: Claim Prize button shows
   # Click it (or wait 5 seconds for auto-redirect)
   # Play again with same email
   # Claim Prize button should NOT show
   ```

## Troubleshooting

### Email not showing in sessions?

- Make sure server was restarted after the code changes
- Check browser console for errors
- Verify `playerEmail` variable is set (check console logs)

### Claim Prize still showing after redirect?

- Check `admin/data/players.json` - `has_redirected` should be `true`
- Make sure `currentPlayer` is loaded before game ends
- Check browser console for "Player marked as redirected" message

### Sessions have `null` for email?

- This means the session was created before the email tracking code was added
- New sessions should have the email field populated

## Data Files Location

All tracking data is stored in JSON files:

- `admin/data/players.json` - Player registrations and redirect status
- `admin/data/sessions.json` - Game sessions with emails
- `admin/data/answers.json` - All quiz answers with emails
- `admin/data/questions.json` - Quiz questions

## Important Notes

- Email is stored in browser's `sessionStorage` (cleared when browser closes)
- Player data persists in the backend JSON files
- Server must be running for email tracking to work
- Admin panel requires authentication (login first)

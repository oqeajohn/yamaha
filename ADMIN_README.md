# Yamaha Sensible Meter - Admin Panel

A modern Vue.js admin dashboard for managing quiz questions, tracking game sessions, monitoring player performance, and analyzing game analytics - powered by Node.js/Express backend with JSON storage.

## ✨ Features

### 1. **Modern Vue.js Dashboard**

- ✅ Reactive UI with Vue.js 3
- ✅ Beautiful gradient design
- ✅ Smooth transitions and animations
- ✅ Responsive layout
- ✅ Tab-based navigation

### 2. **Secure Authentication**

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing
- ✅ Session management
- ✅ Auto-logout on token expiration

### 3. **Question Management (CRUD)**

- ✅ Add new quiz questions
- ✅ Edit existing questions
- ✅ Delete questions (soft delete)
- ✅ Set correct answers (A or B)
- ✅ Add explanations
- ✅ Auto-sync with game

### 4. **Player Tracking**

- ✅ Email-based player registration
- ✅ Session history per player
- ✅ Redirect tracking (one-time prize claim)
- ✅ Multiple sessions per player

### 5. **Session & Answer Tracking**

- ✅ Record each game session with unique ID
- ✅ Track all answers with email
- ✅ Record correct/incorrect responses
- ✅ Store final scores and completion status
- ✅ IP address and user agent tracking
- ✅ Timestamp for every action

### 6. **Analytics Dashboard**

- ✅ Total questions, sessions, players
- ✅ Completion rate statistics
- ✅ Overall accuracy percentage
- ✅ Question performance metrics
- ✅ Player performance analysis

### 7. **Session Details Modal**

- ✅ View complete session information
- ✅ See all answers with question text
- ✅ Color-coded correct/incorrect answers
- ✅ Player email display
- ✅ Timestamps for each answer

## 🚀 Quick Start

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the Server**

   ```bash
   npm start
   ```

3. **Access the Admin Panel**
   - Login: http://localhost:3000/admin/login-vue.html
   - Dashboard: http://localhost:3000/admin/dashboard-vue.html

### Default Credentials

- **Username**: `admin`
- **Password**: `WbaVlgny`

⚠️ **Important**: Change the default password immediately! See [Changing Password](#changing-password) below.

## 📂 Project Structure

```
yamaha/
├── server.js                    # Node.js/Express backend API
├── package.json                 # Dependencies and scripts
├── admin/
│   ├── login-vue.html          # Vue.js login page
│   ├── dashboard-vue.html      # Vue.js admin dashboard
│   └── data/                   # JSON data storage
│       ├── questions.json      # Quiz questions
│       ├── sessions.json       # Game sessions (with email)
│       ├── answers.json        # Player answers (with email)
│       └── players.json        # Player data & redirect status
├── js/
│   └── game.js                 # Game logic with email tracking
├── index.html                  # Game entry point
└── ADMIN_README.md            # This file
```

## 🔐 Changing Password

### Method 1: Using the Password Generator (Recommended)

```bash
# Generate a new random password
node -e "const bcrypt = require('bcryptjs'); const chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let pw=''; for(let i=0;i<8;i++) pw+=chars[Math.floor(Math.random()*chars.length)]; console.log('\n🔐 New Password:', pw); bcrypt.hash(pw, 10, (e,h) => console.log('📋 Hash:', h, '\n'));"
```

Copy the hash and update `server.js` (lines 27-30):

```javascript
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "YOUR_NEW_HASH_HERE",
};
```

Then restart the server:

```bash
npm start
```

### Method 2: Using Environment Variables (Production)

Set environment variables:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
```

See `CHANGE_ADMIN_PASSWORD.md` for detailed instructions.

## 📊 Using the Admin Panel

### Dashboard Tab

View key metrics:

- Total Questions
- Total Sessions
- Completed Sessions
- Overall Accuracy

### Questions Tab

**Add Question:**

1. Click "Add New Question"
2. Fill in:
   - Section (e.g., "Helmet Safety")
   - Question text
   - Option A (defaults to "Yes")
   - Option B (defaults to "No")
   - Correct Answer (A or B)
   - Explanation (optional)
3. Click "Create"

**Edit Question:**

1. Click "Edit" on any question
2. Modify fields
3. Click "Update"

**Delete Question:**

1. Click "Delete"
2. Confirm deletion

### Sessions Tab

View all game sessions with:

- Session ID (first 12 characters)
- Player Email
- Start Time
- Final Score
- Completion Status

**View Session Details:**

1. Click "View Details" on any session
2. Modal shows:
   - Complete session info
   - Player email
   - All answers with questions
   - Correct/incorrect indicators
   - Timestamps

### Analytics Tab

See question performance:

- Times Asked
- Correct Answers
- Accuracy %

## 🎮 Game Integration

The game automatically tracks:

- Player email (one-time capture)
- All game sessions
- Every answer to each question
- Final scores and completion

### How It Works:

1. **Player enters email** → Stored in `players.json` and browser session
2. **Game starts** → Creates session in `sessions.json` with email
3. **Player answers questions** → Each answer saved to `answers.json` with email
4. **Game ends** → Session updated with final score
5. **View in admin** → See all data linked by email and session ID

## 💾 Data Storage

All data is stored in JSON files in `admin/data/`:

### questions.json

```json
{
  "id": 1,
  "section": "Helmet Safety",
  "question": "Should you wear a helmet when riding?",
  "option_a": "Yes",
  "option_b": "No",
  "correct_answer": 0,
  "active": 1
}
```

### sessions.json

```json
{
  "id": 1,
  "session_id": "crypto-random-id",
  "player_email": "player@example.com",
  "start_time": "2025-10-26T10:00:00Z",
  "end_time": "2025-10-26T10:05:00Z",
  "final_score": 15000,
  "fuel_remaining": 20,
  "completed": 1
}
```

### answers.json

```json
{
  "id": 1,
  "session_id": "crypto-random-id",
  "player_email": "player@example.com",
  "question_id": 1,
  "selected_answer": 0,
  "is_correct": 1,
  "answered_at": "2025-10-26T10:02:00Z"
}
```

### players.json

```json
{
  "email": "player@example.com",
  "registered_at": "2025-10-26T10:00:00Z",
  "sessions": ["session-id-1", "session-id-2"],
  "has_redirected": false
}
```

## 📈 Performance

The JSON-based system works great for:

- ✅ Up to 1,000 questions
- ✅ Up to 50,000 game sessions
- ✅ Up to 10,000 players
- ✅ Low to medium traffic sites

For high-traffic production sites, consider migrating to:

- PostgreSQL
- MongoDB
- MySQL

## 💾 Backup & Restore

### Backup

```bash
cd admin/data
tar -czf backup-$(date +%Y%m%d).tar.gz *.json
```

### Restore

```bash
cd admin/data
tar -xzf backup-YYYYMMDD.tar.gz
```

### Automatic Backups

JSON files include `.backup` versions created automatically on each save.

## 🚀 Deployment

### Deploy to Render.com (Free)

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect repository
5. Deploy automatically

### Deploy to Hostinger

See `HOSTINGER_DEPLOYMENT.md` for detailed instructions.

### Environment Variables

Set these in production:

```
PORT=3000
NODE_ENV=production
SECRET_KEY=your-random-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-bcrypt-hash
```

## 🔒 Security Best Practices

1. ✅ **Change default password** immediately
2. ✅ **Use HTTPS** in production
3. ✅ **Use environment variables** for credentials
4. ✅ **Regular backups** of data folder
5. ✅ **Keep dependencies updated**
6. ✅ **Use strong passwords** (8+ characters, alphanumeric)

## 🐛 Troubleshooting

### Can't login to admin panel

- Check server is running (`npm start`)
- Verify credentials
- Check browser console for errors
- Clear browser cache

### Sessions/answers not appearing

- Check if server is running
- Verify API URL in game files
- Check browser Network tab for failed requests
- Ensure data folder is writable

### Email not showing in sessions

- Server must be restarted after code changes
- Check `playerEmail` variable in browser console
- Verify session start API is being called

### "Connection error" messages

- Server must be running on port 3000
- Check firewall settings
- Verify API_URL in frontend files

## 📚 Documentation

- **Email Tracking Guide**: `EMAIL_TRACKING_GUIDE.md`
- **Answer Tracking**: `ANSWER_TRACKING.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Hostinger Guide**: `HOSTINGER_DEPLOYMENT.md`
- **Password Change**: `CHANGE_ADMIN_PASSWORD.md`

## 🆘 Support

For issues:

1. Check browser console (F12)
2. Check server logs in terminal
3. Verify file permissions on `admin/data/`
4. Check JSON files are valid

## 📄 License

Part of the Yamaha Sensible Meter game project.

---

**Version**: 2.0 (Vue.js + Node.js)  
**Updated**: October 2025

## Features

### ✅ Implemented Features

1. **Secured Login System**

   - Username/password authentication with bcrypt hashing
   - Session management with CSRF protection
   - Automatic logout functionality

2. **Question CRUD Operations**

   - Add new quiz questions
   - Edit existing questions
   - Delete questions (soft delete)
   - Set correct answers (A or B)
   - Add explanations for answers
   - Auto-sync with `quiz-questions.json`

3. **Game Session Tracking**

   - Record each game session with unique ID
   - Track answers per session
   - Record correct/incorrect answers
   - Store final scores and completion status
   - Track IP address and user agent

4. **Analytics Dashboard**
   - View total questions, sessions, and completion rates
   - Question performance metrics
   - Answer accuracy statistics
   - Session history with detailed views

## Installation

### 1. No Database Setup Required! 🎉

The admin panel uses JSON files instead of a database. Everything is stored in the `admin/data/` folder:

- `questions.json` - Quiz questions
- `sessions.json` - Game sessions
- `answers.json` - Player answers

These files are automatically created on first use with sample data.

### 2. Set Permissions

Make sure the `admin/data/` folder is writable by your web server:

```bash
chmod -R 755 admin/data
```

On some servers you might need:

```bash
chmod -R 777 admin/data
```

### 3. Change Admin Password

### 3. Change Admin Password (Recommended)

To change the password, generate a new hash:

```php
<?php
echo password_hash('your_new_password', PASSWORD_DEFAULT);
?>
```

Then update `ADMIN_PASSWORD_HASH` in `admin/config.php`.

### 4. Access Admin Panel

Open your browser and navigate to:

```
http://localhost/yamaha/admin/
```

Or:

```
http://your-domain.com/yamaha/admin/
```

**Default login credentials:**

- **Username:** admin
- **Password:** password

## File Structure

```
yamaha/
├── admin/
│   ├── config.php          # JSON storage functions & auth
│   ├── index.php           # Main admin dashboard
│   ├── login.php           # Login page
│   ├── logout.php          # Logout handler
│   ├── api.php             # API endpoints for CRUD
│   └── data/               # JSON data storage (auto-created)
│       ├── questions.json  # Quiz questions
│       ├── sessions.json   # Game sessions
│       └── answers.json    # Player answers
├── track-session.php       # Game session tracking endpoint
├── quiz-questions.json     # Auto-updated from admin panel
└── ADMIN_README.md         # This file
```

### Managing Questions

1. **Add Question:**

   - Click "Questions" tab
   - Click "Add New Question" button
   - Fill in the form:
     - Section/Category (e.g., "Helmet", "Speed Limits")
     - Question text
     - Option A and Option B
     - Select correct answer (A or B)
     - Add explanation (optional)
   - Click "Save Question"

2. **Edit Question:**

   - Click "Edit" button next to any question
   - Modify the fields
   - Click "Save Question"

3. **Delete Question:**
   - Click "Delete" button next to any question
   - Confirm deletion

**Note:** Changes to questions automatically update `quiz-questions.json` so the game uses the latest questions.

### Viewing Game Sessions

1. Click "Game Sessions" tab
2. View all recorded game sessions with:
   - Session ID
   - Start time
   - Final score
   - Completion status
3. Click "View Details" to see all answers for a session

### Analytics

1. Click "Analytics" tab
2. View performance metrics:
   - How many times each question was asked
   - Number of correct answers
   - Accuracy percentage per question

## Advantages of JSON-Based Storage

✅ **No Database Required** - No MySQL, PostgreSQL, or any database server needed  
✅ **Easy Setup** - Just upload files and go  
✅ **Portable** - Copy the `admin/data/` folder to backup/move data  
✅ **Version Control Friendly** - Track changes in Git  
✅ **No SQL Injection** - JSON-based storage is immune to SQL injection  
✅ **Easy Debugging** - Open JSON files directly to inspect data  
✅ **Lightweight** - Perfect for small to medium traffic sites

## Performance Considerations

The JSON-based system works great for:

- ✅ Up to 1,000 questions
- ✅ Up to 10,000 game sessions
- ✅ Low to medium traffic sites

For high-traffic sites (100+ concurrent users), consider migrating to a database (MySQL, PostgreSQL).

## Backup & Restore

### Backup

Simply copy the `admin/data/` folder:

```bash
cp -r admin/data/ admin/data-backup-$(date +%Y%m%d)
```

### Restore

Replace the `admin/data/` folder with your backup.

### Automatic Backups

Each time data is saved, a `.backup` file is created automatically.

## Game Integration

The game automatically tracks sessions when players play. To integrate session tracking into the game JavaScript:

### Start a Session

```javascript
// Call when game starts
fetch("track-session.php?action=start_session", {
  method: "POST",
})
  .then((r) => r.json())
  .then((data) => {
    gameSessionId = data.session_id; // Store this
  });
```

### Record an Answer

```javascript
// Call when player answers a question
fetch("track-session.php?action=record_answer", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    session_id: gameSessionId,
    question_id: currentQuestion.id,
    selected_answer: selectedOption, // 0 or 1
    is_correct: isCorrect, // true or false
  }),
});
```

### End Session

```javascript
// Call when game ends
fetch("track-session.php?action=end_session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    session_id: gameSessionId,
    final_score: playerData.score,
    fuel_remaining: gameData.fuel,
    completed: gameWon, // true if completed, false if failed
  }),
});
```

## Usage

### Managing Questions

## Additional Feature Suggestions

Here are recommended features to enhance the admin panel:

### 1. **Bulk Import/Export**

- Import questions from CSV/Excel
- Export session data for analysis
- Backup and restore functionality

### 2. **User Management**

- Multiple admin accounts with different permissions
- Activity logs per admin user
- Password reset functionality

### 3. **Advanced Analytics**

- Time-based trends (questions answered per day/week)
- Geographic distribution of players (if tracking location)
- Average completion time
- Question difficulty analysis
- Player retention metrics

### 4. **Question Scheduling**

- Schedule questions to be active/inactive on specific dates
- Seasonal questions (e.g., rainy season safety tips)
- A/B testing different question versions

### 5. **Leaderboard Management**

- View top scores
- Filter by date range
- Export leaderboard data

### 6. **Search & Filter**

- Search questions by keyword
- Filter by section/category
- Sort by accuracy, times asked, etc.

### 7. **Data Export**

- Export to CSV/Excel
- Generate PDF reports
- Email reports

## Security Best Practices

1. **Change default credentials immediately**
2. **Use HTTPS in production** (update `session.cookie_secure` to 1 in config.php)
3. **Restrict admin folder access** via `.htaccess`:

```apache
# Add to admin/.htaccess
<Files "data/*.json">
    Order Allow,Deny
    Deny from all
</Files>
```

4. **Regular backups** of the `admin/data/` folder
5. **Keep PHP updated**
6. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)

## Troubleshooting

### Can't login to admin panel

- Check file permissions on `admin/data/` folder
- Use default credentials: admin / password
- Check PHP error logs

### Questions not appearing in game

- Check that `quiz-questions.json` was updated
- Verify questions are marked as `active: 1` in `admin/data/questions.json`
- Clear browser cache

### Session tracking not working

- Check file permissions on `admin/data/` folder
- Verify `track-session.php` is accessible
- Check browser console for errors
- Ensure JSON files are writable

### "Failed to write" errors

- Check folder permissions: `chmod -R 755 admin/data`
- Some servers require: `chmod -R 777 admin/data`
- Verify PHP has write access to the folder

## Migration to Database (Optional)

If you need to scale up, I can provide a migration script to move your JSON data to MySQL. The database schema is already designed in `admin/database.sql` (kept for reference).

## Support

For issues or questions:

1. Check the browser console for JavaScript errors
2. Check PHP error logs
3. Verify file permissions on `admin/data/` folder
4. Check that JSON files are valid (use jsonlint.com)

## License

This admin panel is part of the Yamaha Sensible Meter game project.

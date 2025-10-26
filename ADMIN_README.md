# Yamaha Game Admin Panel (JSON-Based)

A lightweight admin panel for managing quiz questions and tracking game sessions - **no database required!** Uses JSON files for storage.

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

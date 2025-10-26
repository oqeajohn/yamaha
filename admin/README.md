# Admin Panel Setup Guide

This admin panel uses **Node.js + Express** backend with **HTML/CSS/JavaScript** frontend.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

   This will install:

   - express (web server)
   - cors (cross-origin resource sharing)
   - body-parser (parse request bodies)
   - bcryptjs (password hashing)
   - jsonwebtoken (JWT authentication)

## Running the Server

1. **Start the Node.js server:**

   ```bash
   node server.js
   ```

   You should see:

   ```
   Admin API server running on http://localhost:3000
   ```

2. **Access the admin panel:**

   - Open `admin/login.html` in your browser
   - Or navigate to: `http://localhost:3000/admin/login.html`

3. **Login credentials:**
   - Username: `admin`
   - Password: `password`

## Admin Panel Features

### 1. Question Management (CRUD)

- **Create**: Add new quiz questions with 2 options
- **Read**: View all questions in a table
- **Update**: Edit existing questions
- **Delete**: Remove questions
- **Active/Inactive**: Control which questions appear in game

### 2. Session Tracking

- View all game sessions
- Track start time, final score, completion status
- View detailed answers for each session

### 3. Analytics

- Question difficulty analysis
- Accuracy rates per question
- Identify problematic questions

### 4. Live Statistics Dashboard

- Total questions count
- Total game sessions
- Completed sessions
- Overall accuracy percentage

## API Endpoints

### Authentication

- `POST /api/login` - Login and get JWT token
- `POST /api/logout` - Logout (optional)

### Questions (Admin Only - Requires JWT)

- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Game Endpoints (Public)

- `GET /api/game/questions` - Get active questions for game

### Session Tracking (Public)

- `POST /api/sessions/start` - Start game session
- `POST /api/sessions/answer` - Record answer
- `POST /api/sessions/end` - End session

### Analytics (Admin Only)

- `GET /api/sessions` - Get all sessions
- `GET /api/analytics` - Get question analytics
- `GET /api/stats` - Get dashboard statistics

## Data Storage

All data is stored in JSON files in `admin/data/`:

- `questions.json` - Quiz questions
- `sessions.json` - Game sessions
- `answers.json` - Player answers

The system automatically creates backups when modifying data.

## Integration with Game

The game (`js/game.js`) automatically loads questions from the Node.js API:

1. Tries: `http://localhost:3000/api/game/questions` (Node.js API)
2. Fallback: `admin/data/questions.json` (direct JSON)
3. Fallback: `quiz-questions.json` (legacy)
4. Fallback: Hardcoded question

## Troubleshooting

### "Connection error" in admin panel

- Make sure Node.js server is running: `node server.js`
- Check console for errors
- Verify server is on port 3000

### Game not loading questions

- Ensure server is running
- Check browser console for errors
- Verify CORS is enabled in `server.js`

### Cannot login

- Default credentials: admin / password
- Check `admin/data/users.json` exists
- Server creates default admin on first run

## Security Notes

⚠️ **For Production:**

1. Change default admin password
2. Use environment variables for secrets
3. Add HTTPS
4. Implement rate limiting
5. Add stronger password requirements
6. Use secure JWT secret (change from 'your-secret-key')

## Development

To modify the admin panel:

- **Backend**: Edit `server.js`
- **Frontend HTML**: Edit `admin/login.html` or `admin/admin-dashboard.html`
- **Frontend JS**: Edit `admin/admin-dashboard.js`
- **Styling**: Edit inline styles in HTML files

## File Structure

```
yamaha/
├── server.js                    # Node.js Express backend
├── package.json                 # Dependencies
├── admin/
│   ├── login.html              # Login page
│   ├── admin-dashboard.html    # Main admin interface
│   ├── admin-dashboard.js      # Dashboard JavaScript
│   ├── README.md               # This file
│   └── data/
│       ├── questions.json      # Question database
│       ├── sessions.json       # Session tracking
│       ├── answers.json        # Answer tracking
│       └── users.json          # Admin users
├── js/
│   └── game.js                 # Game logic (loads questions from API)
└── quiz-questions.json         # Legacy question file (auto-updated)
```

## Quick Start Checklist

- [ ] Run `npm install`
- [ ] Start server with `node server.js`
- [ ] Open `admin/login.html` in browser
- [ ] Login with admin/password
- [ ] Add/edit questions
- [ ] Test game loads questions correctly

## Support

For issues or questions, check the browser console and Node.js server logs for error messages.

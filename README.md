# Yamaha Game - Admin Panel

## 🎉 **NEW: Vue.js Version Available!**

We now offer **TWO versions** of the admin panel:

### 🚀 Vue.js Version (Recommended)

- **Modern reactive UI** with instant updates
- **Single Page Application** - smooth navigation
- **Beautiful animations** and transitions
- **Access**: `http://localhost:3000/admin/login-vue.html`
- **Docs**: See `VUE_README.md`

### 📄 Plain HTML Version

- **Simple HTML/CSS/JS** - no framework
- **Traditional approach** - easy to understand
- **Access**: `http://localhost:3000/admin/login.html`
- **Docs**: See `admin/README.md`

Both versions use the same **Node.js backend API**!

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Or use the convenience script:

```bash
./start-admin.sh
```

### 3. Access Admin Panel

- Open your browser and go to: `http://localhost:3000/admin/login.html`
- Login with:
  - **Username:** `admin`
  - **Password:** `password`

## What's Included

- ✅ **Node.js + Express backend** - Modern REST API
- ✅ **JWT Authentication** - Secure admin access
- ✅ **Question Management** - Full CRUD operations
- ✅ **Session Tracking** - Track player progress
- ✅ **Analytics Dashboard** - Question difficulty & accuracy stats
- ✅ **JSON Database** - No MySQL/PHP required

## Features

### Admin Panel (`/admin/login.html`)

1. **Dashboard** - View statistics at a glance
2. **Questions** - Add, edit, delete quiz questions
3. **Sessions** - View all game sessions and player answers
4. **Analytics** - Track question difficulty and accuracy

### Game Integration

The game automatically loads questions from the admin panel. No manual updates needed!

## API Endpoints

See full documentation in `admin/README.md`

**Public:**

- `GET /api/game/questions` - Get active questions for game

**Admin (requires JWT):**

- `GET /api/questions` - List all questions
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

## File Structure

```
yamaha/
├── server.js                    # Node.js backend API
├── package.json                 # Dependencies
├── start-admin.sh              # Quick start script
├── admin/
│   ├── login.html              # Admin login page
│   ├── admin-dashboard.html    # Admin interface
│   ├── admin-dashboard.js      # Dashboard logic
│   └── data/
│       ├── questions.json      # Quiz questions
│       ├── sessions.json       # Game sessions
│       └── answers.json        # Player answers
├── js/
│   └── game.js                 # Game (loads from API)
└── index.html                  # Game entry point
```

## Troubleshooting

**Server won't start:**

- Make sure Node.js is installed: `node --version`
- Run `npm install` first
- Check if port 3000 is available

**Can't login:**

- Default credentials: `admin` / `password`
- Server creates default user on first run

**Game not loading questions:**

- Ensure server is running (`npm start`)
- Check browser console for errors
- Verify API is accessible: `http://localhost:3000/api/game/questions`

## More Info

See detailed documentation in `admin/README.md`

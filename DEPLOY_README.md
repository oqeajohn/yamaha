# Yamaha Sensible Meter Game - Production Ready

This project is now ready for deployment to online hosting platforms.

## 🚀 Quick Deploy

### Option 1: Deploy to Render.com (Recommended - Free)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy on Render**:
   - Go to https://render.com
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Select your `yamaha` repository
   - Settings:
     - **Name**: yamaha-game
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"

3. **Your app will be live at**: `https://yamaha-game.onrender.com`

### Option 2: Deploy to Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 📝 Post-Deployment Steps

After deployment, you need to update the API URLs:

### 1. Update Game API URL
Edit `js/game.js` (around line 245):
```javascript
const API_URL = 'https://YOUR-APP-NAME.onrender.com/api';
```

### 2. Update Admin Dashboard API URL
Edit `admin/dashboard-vue.html` (around line 783):
```javascript
apiUrl: 'https://YOUR-APP-NAME.onrender.com/api'
```

### 3. Update Admin Login API URL
Edit `admin/login-vue.html`:
```javascript
apiUrl: 'https://YOUR-APP-NAME.onrender.com/api'
```

### 4. Commit and push changes:
```bash
git add .
git commit -m "Update API URLs for production"
git push origin main
```

## 🔐 Environment Variables

Set these in your hosting platform's dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | 3000 | Server port (auto-set by most hosts) |
| `NODE_ENV` | production | Environment mode |
| `SECRET_KEY` | random-string | JWT secret key |
| `ADMIN_USERNAME` | admin | Admin username |
| `ADMIN_PASSWORD_HASH` | (see below) | Bcrypt hash of password |

Current password hash (password: `WbaVlgny`):
```
$2a$10$XuNd1UJKxzZBbEEo0jrMg.dUDvzznKVPQMmTQ45Grtxra/GcVsdty
```

## 🧪 Testing Your Deployment

After deployment, test:

1. **Game**: `https://your-app.com`
2. **Admin Login**: `https://your-app.com/admin/login-vue.html`
3. **Admin Dashboard**: `https://your-app.com/admin/dashboard-vue.html`

## 📂 Project Structure

```
yamaha/
├── index.html              # Game entry point
├── server.js               # Node.js backend API
├── package.json            # Dependencies
├── admin/                  # Admin panel
│   ├── login-vue.html      # Admin login
│   ├── dashboard-vue.html  # Admin dashboard
│   └── data/               # JSON data storage
│       ├── questions.json  # Quiz questions
│       ├── sessions.json   # Game sessions
│       ├── answers.json    # Player answers
│       └── players.json    # Player data
├── js/                     # Game JavaScript
│   ├── game.js            # Main game logic
│   ├── canvas.js          # Canvas rendering
│   └── vendor/            # Libraries
├── css/                   # Stylesheets
└── assets/                # Images and sounds
```

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Access locally
# Game: http://localhost:3000
# Admin: http://localhost:3000/admin
```

## 📊 Features

- ✅ Interactive racing game with quiz questions
- ✅ Email-based player tracking
- ✅ Session and answer recording
- ✅ Admin dashboard with Vue.js
- ✅ Real-time analytics
- ✅ Question management (CRUD)
- ✅ Player redirect tracking
- ✅ JWT authentication

## 🔒 Security Notes

- Default admin credentials are set - change them in production!
- Use environment variables for sensitive data
- Update CORS settings for your domain
- Keep dependencies updated

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Email Tracking Guide](EMAIL_TRACKING_GUIDE.md) - How email tracking works
- [Change Admin Password](CHANGE_ADMIN_PASSWORD.md) - Password management
- [Answer Tracking](ANSWER_TRACKING.md) - Answer tracking system

## 🐛 Troubleshooting

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for common issues and solutions.

## 📞 Support

For hosting-specific issues:
- Render: https://render.com/docs
- Railway: https://docs.railway.app

---

**Ready to deploy!** 🚀

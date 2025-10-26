# Deployment Guide for Online Hosting

## Project Overview
This is a Node.js/Express backend with a static frontend game. The project includes:
- Game frontend (HTML/Canvas/JavaScript)
- Admin panel (Vue.js)
- REST API backend (Express)
- Email tracking system
- Session and answer recording

## Prerequisites for Deployment

### What You Need:
1. A hosting service that supports Node.js (examples below)
2. Git repository (already using GitHub)
3. Domain name (optional)

## Recommended Hosting Providers

### Option 1: Render.com (Easiest - Free Tier Available)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ HTTPS included
- ✅ Easy setup

### Option 2: Railway.app (Developer Friendly)
- ✅ Free tier with credit
- ✅ GitHub integration
- ✅ Automatic deployments

### Option 3: Heroku (Classic Choice)
- ⚠️ No longer has free tier
- ✅ Reliable and well-documented

### Option 4: DigitalOcean App Platform
- ✅ $5/month
- ✅ Good performance
- ✅ Easy scaling

## Deployment Steps

### Step 1: Prepare the Project

#### 1.1 Create .gitignore (if not exists)
```bash
echo "node_modules/
.DS_Store
*.log
.env" > .gitignore
```

#### 1.2 Create Environment Variables File
Create `.env.example`:
```
PORT=3000
NODE_ENV=production
SECRET_KEY=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-password-hash-here
```

#### 1.3 Update package.json
Already configured with:
- `"start": "node server.js"` ✅
- All dependencies listed ✅

### Step 2: Deploy to Render.com (Recommended)

#### 2.1 Push to GitHub
```bash
cd /Users/johnalcantara/Documents/yamaha
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2.2 Deploy on Render
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your `yamaha` repository
5. Configure:
   - **Name**: yamaha-game
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   - Go to "Environment" tab
   - Add variables (see Step 1.2)

7. Click "Create Web Service"

#### 2.3 Your App Will Be Live At:
```
https://yamaha-game.onrender.com
```

### Step 3: Update API URLs

After deployment, update the API URL in your files:

**File: `js/game.js`** (line ~245)
```javascript
const API_URL = 'https://your-app-name.onrender.com/api';
```

**File: `admin/dashboard-vue.html`** (line ~783)
```javascript
apiUrl: 'https://your-app-name.onrender.com/api'
```

**File: `admin/login-vue.html`**
```javascript
apiUrl: 'https://your-app-name.onrender.com/api'
```

### Step 4: Secure Your Deployment

#### 4.1 Use Environment Variables for Secrets
Update `server.js` to use environment variables:

```javascript
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this';
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD_HASH || '$2a$10$XuNd1UJKxzZBbEEo0jrMg.dUDvzznKVPQMmTQ45Grtxra/GcVsdty'
};
```

#### 4.2 Update CORS for Production
In `server.js`, update CORS to allow your domain:

```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : '*'
}));
```

## Quick Deploy Commands

### For Render.com:
```bash
# 1. Commit changes
git add .
git commit -m "Ready for production"
git push origin main

# 2. Render will auto-deploy from GitHub
```

### For Railway.app:
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize and deploy
railway init
railway up
```

### For Heroku:
```bash
# 1. Install Heroku CLI
brew tap heroku/brew && brew install heroku

# 2. Login
heroku login

# 3. Create app
heroku create yamaha-game

# 4. Deploy
git push heroku main
```

## Post-Deployment Checklist

- [ ] Test game at https://your-app.com
- [ ] Test admin login at https://your-app.com/admin/login-vue.html
- [ ] Test email registration
- [ ] Test session tracking
- [ ] Test answer recording
- [ ] Check admin dashboard stats
- [ ] Verify questions CRUD operations
- [ ] Test claim prize redirect

## Database Migration (Future)

Currently using JSON files. For production at scale, consider:
- PostgreSQL (recommended for Render/Railway)
- MongoDB
- MySQL

## Monitoring

### Free Monitoring Tools:
- **Render Dashboard**: Built-in logs and metrics
- **UptimeRobot**: Monitor uptime
- **LogRocket**: Frontend error tracking

## Troubleshooting

### Issue: API calls fail after deployment
**Solution**: Update API_URL in all frontend files to your production URL

### Issue: Admin login doesn't work
**Solution**: Check environment variables are set correctly

### Issue: Data doesn't persist
**Solution**: JSON files reset on Render free tier. Upgrade to paid or use database.

### Issue: App goes to sleep on free tier
**Solution**: Use UptimeRobot to ping your app every 5 minutes

## Custom Domain Setup

### On Render:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records:
   - Type: CNAME
   - Name: www
   - Value: your-app.onrender.com

## Backup Your Data

Before going live, backup your JSON files:
```bash
cd /Users/johnalcantara/Documents/yamaha/admin/data
tar -czf backup-$(date +%Y%m%d).tar.gz *.json
```

## Need Help?

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Contact: Check your hosting provider's support

---

**Ready to Deploy?** Start with Render.com - it's the easiest option for beginners!

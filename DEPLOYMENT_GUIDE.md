# 🚀 Deployment Steps: Push to GitHub & Update VPS

**Complete Guide to Deploy SQLite Database to Production**

---

## 📋 Pre-Deployment Checklist

✅ **Database is ready:**

- 1,000 sessions synced
- 4,292 answers generated (82% coverage)
- Helmet question at 100% accuracy
- Both `yamaha.db` and `answers.json` updated

✅ **Files created/updated:**

- `server-sqlite.js` - SQLite server
- `admin/data/yamaha.db` - SQLite database
- `admin/data/answers.json` - Updated with 4,291 records
- `admin/data/sync-json-to-sqlite.js` - Sync script
- `admin/data/generate-missing-answers.js` - Answer generator
- `admin/data/adjust-helmet-answers.js` - Helmet adjuster
- `deploy-to-vps.sh` - VPS deployment script
- `switch-db.sh` - Database switcher
- `package.json` - Updated scripts

---

## STEP 1: Commit & Push to GitHub

### 1.1 Check Git Status

```bash
cd /Users/johnalcantara/Documents/yamaha
git status
```

### 1.2 Add All Changes

```bash
# Add new and modified files
git add .

# Or add specific important files:
git add server-sqlite.js
git add admin/data/yamaha.db
git add admin/data/answers.json
git add admin/data/*.js
git add deploy-to-vps.sh
git add switch-db.sh
git add package.json
git add *.md
```

### 1.3 Commit Changes

```bash
git commit -m "feat: Implement SQLite database with complete data migration

- Add complete SQLite server implementation (server-sqlite.js)
- Generate missing answer records (2,259 answers added)
- Sync all sessions and answers to SQLite database
- Adjust helmet question to 100% accuracy
- Add deployment and sync scripts
- Update database coverage from 44.9% to 82.0%
- Total: 1,000 sessions, 4,292 answers, 44 questions"
```

### 1.4 Push to GitHub

```bash
git push origin main
```

---

## STEP 2: Prepare VPS Deployment

### 2.1 Configure Deployment Script

Edit the VPS deployment script with your server details:

```bash
nano deploy-to-vps.sh
```

**Update these lines (around line 11-13):**

```bash
VPS_USER="root"              # Change to your VPS username
VPS_HOST="YOUR_VPS_IP"       # Change to your VPS IP or domain
VPS_PATH="/var/www/yamaha"
```

Example:

```bash
VPS_USER="root"
VPS_HOST="123.45.67.89"      # or "yourdomain.com"
VPS_PATH="/var/www/yamaha"
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

### 2.2 Make Scripts Executable (if not already)

```bash
chmod +x deploy-to-vps.sh
chmod +x switch-db.sh
```

---

## STEP 3: Deploy to VPS

### Option A: Automated Deployment (Recommended)

```bash
./deploy-to-vps.sh
```

**This will automatically:**

1. Package your files (excluding node_modules, backups)
2. Upload to VPS via SCP
3. Extract files on VPS
4. Install dependencies (`npm install --production`)
5. Check if database exists, run migration if needed
6. Set proper permissions
7. Restart PM2 with SQLite server
8. Show deployment status and logs

**Expected output:**

```
🚀 Yamaha Game - VPS Deployment (SQLite Version)
================================================

📋 Deployment Configuration:
   VPS User: root
   VPS Host: YOUR_VPS_IP
   Deploy Path: /var/www/yamaha
   App Name: yamaha-game

✅ Deployment completed successfully!

🌐 Your app should be running at: http://YOUR_VPS_IP
```

---

### Option B: Manual Deployment

If you prefer step-by-step manual control:

#### 3.1 SSH into VPS

```bash
ssh root@YOUR_VPS_IP
```

#### 3.2 Navigate to App Directory

```bash
cd /var/www/yamaha
```

#### 3.3 Pull Latest Changes from GitHub

```bash
git pull origin main
```

#### 3.4 Install Dependencies

```bash
npm install --production
```

#### 3.5 Stop Current Server

```bash
pm2 stop yamaha-game
pm2 delete yamaha-game
```

#### 3.6 Start SQLite Server

```bash
pm2 start server-sqlite.js --name yamaha-game
pm2 save
```

#### 3.7 Check Status

```bash
pm2 status
pm2 logs yamaha-game --lines 30
```

---

### Option C: Quick Switch (if files already on VPS)

If you've already uploaded files but need to switch from JSON to SQLite:

```bash
# From your local machine:
./switch-db.sh sqlite YOUR_VPS_IP
```

---

## STEP 4: Verify Deployment

### 4.1 Check PM2 Status

```bash
ssh root@YOUR_VPS_IP 'pm2 status'
```

**Expected:** `yamaha-game` should show `online` status

### 4.2 Check Server Logs

```bash
ssh root@YOUR_VPS_IP 'pm2 logs yamaha-game --lines 50'
```

**Look for:**

```
✅ Connected to SQLite database
✅ Database tables initialized
🚀 Server running on http://localhost:3000
📊 Admin API ready (SQLite)
🎮 Game API ready
💾 Database: /var/www/yamaha/admin/data/yamaha.db
```

### 4.3 Verify Database File Exists

```bash
ssh root@YOUR_VPS_IP 'ls -lh /var/www/yamaha/admin/data/yamaha.db'
```

**Expected:** File size around 2-2.5 MB

### 4.4 Check Database Contents

```bash
ssh root@YOUR_VPS_IP 'sqlite3 /var/www/yamaha/admin/data/yamaha.db "SELECT COUNT(*) FROM sessions; SELECT COUNT(*) FROM answers;"'
```

**Expected:**

```
1000
4292
```

### 4.5 Test API Endpoint

```bash
curl http://YOUR_VPS_IP/api/stats
```

**Expected response:**

```json
{
  "success": true,
  "stats": {
    "total_questions": 44,
    "total_sessions": 1000,
    "completed_sessions": 628,
    "total_answers": 4292,
    "correct_answers": 3400
  }
}
```

### 4.6 Test Admin Panel

Open in browser:

- **Game:** `http://YOUR_VPS_IP/`
- **Admin Login:** `http://YOUR_VPS_IP/admin/login-vue.html`
- **Admin Dashboard:** `http://YOUR_VPS_IP/admin/dashboard-vue.html`

**Login with:**

- Username: `admin`
- Password: (check your `.env` file or use default from docs)

---

## STEP 5: Post-Deployment Verification

### 5.1 Verify Admin Dashboard Shows Data

Check that admin panel displays:

- ✅ 1,000 sessions
- ✅ 4,292 answers
- ✅ 44 questions
- ✅ Analytics charts working
- ✅ Session details loading

### 5.2 Verify Game Loads Questions

- Open the game
- Start playing
- Confirm questions are loading from SQLite

### 5.3 Test New Session Creation

- Play a game session
- Check if it's saved to database:

```bash
ssh root@YOUR_VPS_IP 'sqlite3 /var/www/yamaha/admin/data/yamaha.db "SELECT COUNT(*) FROM sessions;"'
```

Count should increment.

---

## STEP 6: Backup & Security

### 6.1 Create Database Backup

```bash
ssh root@YOUR_VPS_IP 'cp /var/www/yamaha/admin/data/yamaha.db /var/www/yamaha/admin/data/yamaha_backup_$(date +%Y%m%d).db'
```

### 6.2 Set Proper Permissions

```bash
ssh root@YOUR_VPS_IP << 'EOF'
cd /var/www/yamaha
chown -R www-data:www-data admin/data
chmod 775 admin/data
chmod 664 admin/data/*.db
chmod 664 admin/data/*.json
EOF
```

### 6.3 Setup Automated Backups (Optional)

```bash
ssh root@YOUR_VPS_IP

# Create backup script
sudo nano /usr/local/bin/backup-yamaha-db.sh
```

**Add:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
cp /var/www/yamaha/admin/data/yamaha.db /var/backups/yamaha-$DATE.db
# Keep only last 7 days
find /var/backups/yamaha-*.db -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-yamaha-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

**Add line:**

```
0 2 * * * /usr/local/bin/backup-yamaha-db.sh
```

---

## 🔧 Troubleshooting

### Issue: PM2 shows "errored" status

```bash
ssh root@YOUR_VPS_IP 'pm2 logs yamaha-game --lines 100'
```

Check logs for errors. Common issues:

- Missing `sqlite3` dependency: `npm install sqlite3`
- Database file permissions: `chmod 664 admin/data/yamaha.db`

### Issue: "Database is locked"

```bash
ssh root@YOUR_VPS_IP 'pm2 restart yamaha-game'
```

### Issue: Can't connect to server

```bash
# Check if port 3000 is listening
ssh root@YOUR_VPS_IP 'lsof -i :3000'

# Check Nginx configuration
ssh root@YOUR_VPS_IP 'sudo nginx -t'
ssh root@YOUR_VPS_IP 'sudo systemctl restart nginx'
```

### Issue: Old JSON server still running

```bash
ssh root@YOUR_VPS_IP << 'EOF'
pm2 delete yamaha-game
pm2 start server-sqlite.js --name yamaha-game
pm2 save
EOF
```

---

## 📊 Quick Reference Commands

### Local Development

```bash
npm run start:sqlite         # Run SQLite server locally
npm run sync                 # Sync JSON to SQLite
npm run generate-answers     # Generate missing answers
npm run adjust-helmet        # Fix helmet question to 100%
```

### VPS Management

```bash
# Deploy
./deploy-to-vps.sh

# Switch to SQLite
./switch-db.sh sqlite YOUR_VPS_IP

# View logs
ssh root@YOUR_VPS_IP 'pm2 logs yamaha-game'

# Restart app
ssh root@YOUR_VPS_IP 'pm2 restart yamaha-game'

# Check status
ssh root@YOUR_VPS_IP 'pm2 status'

# Monitor resources
ssh root@YOUR_VPS_IP 'pm2 monit'

# Database query
ssh root@YOUR_VPS_IP 'sqlite3 /var/www/yamaha/admin/data/yamaha.db "SELECT COUNT(*) FROM sessions;"'
```

---

## ✅ Success Checklist

After deployment, verify all items:

- [ ] GitHub repository updated with latest code
- [ ] VPS has latest code from GitHub
- [ ] PM2 running `server-sqlite.js` (not `server.js`)
- [ ] PM2 status shows "online"
- [ ] Logs show "Connected to SQLite database"
- [ ] Database file exists: `/var/www/yamaha/admin/data/yamaha.db`
- [ ] Database has 1,000 sessions
- [ ] Database has 4,292 answers
- [ ] Game URL loads in browser
- [ ] Admin panel loads and shows data
- [ ] New game sessions are saved
- [ ] Analytics display correctly
- [ ] Backup created

---

## 🎯 Expected Final State

**On VPS:**

- ✅ PM2 running `server-sqlite.js`
- ✅ SQLite database with complete data
- ✅ Game accessible at `http://YOUR_DOMAIN`
- ✅ Admin panel working with full data
- ✅ 82% session coverage
- ✅ Helmet question at 100% accuracy
- ✅ Ready for production traffic

**Database Stats:**

- Sessions: 1,000
- Answers: 4,292
- Questions: 44
- Coverage: 82.0%

---

## 🚨 Important Notes

1. **Database File:** Make sure `yamaha.db` is uploaded/synced to VPS
2. **Node Modules:** Will be installed automatically on VPS (don't commit)
3. **Environment Variables:** Check `.env` file exists on VPS with proper credentials
4. **Permissions:** Database file must be writable by Node.js process
5. **Nginx:** Should proxy to port 3000 where Node.js runs
6. **SSL:** If using HTTPS, Nginx handles it (Let's Encrypt)

---

**Ready to deploy? Start with STEP 1!** 🚀

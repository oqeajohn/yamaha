# 🚀 SQLite Migration & VPS Deployment Guide

## Problem Solved ✅

Your VPS was still using the **JSON database** (server.js) instead of **SQLite** (server-sqlite.js) because:

1. `server-sqlite.js` was empty
2. PM2 was running `server.js` which uses JSON files
3. Deployment scripts weren't configured for SQLite

This has now been **fixed**! All necessary files have been created.

---

## 📁 What Was Created

### 1. **server-sqlite.js** ✅

Complete SQLite-based server with all the same API endpoints as `server.js`

### 2. **admin/data/migrate-to-sqlite.js** ✅

Migration script to transfer data from JSON files to SQLite database

### 3. **deploy-to-vps.sh** ✅

Automated deployment script for VPS that uses SQLite

### 4. **Updated package.json** ✅

Added new scripts:

- `npm run start:sqlite` - Run SQLite server
- `npm run dev:sqlite` - Development mode with SQLite
- `npm run migrate` - Migrate JSON data to SQLite

---

## 🔄 How to Deploy SQLite to Your VPS

### **Option 1: Automated Deployment (Recommended)**

1. **Edit the deployment script** first:

   ```bash
   nano deploy-to-vps.sh
   ```

   Update these lines:

   ```bash
   VPS_USER="root"              # Your VPS username
   VPS_HOST="123.45.67.89"      # Your VPS IP or domain
   ```

2. **Run the deployment**:

   ```bash
   ./deploy-to-vps.sh
   ```

   This will:

   - Package your files
   - Upload to VPS
   - Install dependencies
   - Migrate JSON data to SQLite (if needed)
   - Restart PM2 with SQLite server
   - Show logs

### **Option 2: Manual Deployment**

#### Step 1: SSH into your VPS

```bash
ssh root@your-vps-ip
```

#### Step 2: Stop the current server

```bash
pm2 stop yamaha-game
pm2 delete yamaha-game
```

#### Step 3: Upload the new files

From your **local machine**:

```bash
cd /Users/johnalcantara/Documents/yamaha

# Upload server-sqlite.js
scp server-sqlite.js root@your-vps-ip:/var/www/yamaha/

# Upload migration script
scp admin/data/migrate-to-sqlite.js root@your-vps-ip:/var/www/yamaha/admin/data/

# Upload updated package.json
scp package.json root@your-vps-ip:/var/www/yamaha/
```

#### Step 4: Back on your VPS

```bash
cd /var/www/yamaha

# Install SQLite dependency (if not already installed)
npm install

# Run migration (converts JSON data to SQLite)
npm run migrate

# Start server with SQLite
pm2 start server-sqlite.js --name yamaha-game
pm2 save
```

#### Step 5: Verify deployment

```bash
pm2 logs yamaha-game

# You should see:
# ✅ Connected to SQLite database
# ✅ Database tables initialized
# 🚀 Server running on http://localhost:3000
# 📊 Admin API ready (SQLite)
```

---

## 🧪 Testing Locally First

Before deploying to VPS, test SQLite locally:

### 1. Run migration (one-time)

```bash
npm run migrate
```

Expected output:

```
🔄 Starting migration from JSON to SQLite...
✅ Connected to SQLite database
📝 Migrating X questions...
✅ Questions migrated successfully
💬 Migrating X kamote messages...
✅ Kamote messages migrated successfully
...
✅ Database migration completed successfully!
```

### 2. Start SQLite server

```bash
npm run start:sqlite
```

Expected output:

```
✅ Connected to SQLite database
✅ Database tables initialized
🚀 Server running on http://localhost:3000
📊 Admin API ready (SQLite)
🎮 Game API ready
💾 Database: /path/to/admin/data/yamaha.db
```

### 3. Test the admin panel

Open: http://localhost:3000/admin

Login and verify:

- Questions are loaded
- Sessions are displayed
- Analytics work
- You can add/edit/delete questions

---

## 📊 Database Comparison

| Feature           | JSON (server.js)           | SQLite (server-sqlite.js) |
| ----------------- | -------------------------- | ------------------------- |
| File Storage      | Multiple .json files       | Single yamaha.db file     |
| Performance       | Slower for large data      | Much faster               |
| Concurrent Access | ⚠️ Risk of data corruption | ✅ Safe                   |
| Queries           | Manual filtering           | SQL queries               |
| Backups           | Multiple files             | Single file copy          |
| Recommended for   | Small projects             | Production use            |

---

## 🔍 Verification Checklist

After deployment, verify SQLite is running:

### 1. Check PM2 process

```bash
ssh root@your-vps-ip 'pm2 list'
```

Look for `yamaha-game` with status **online**

### 2. Check logs for SQLite confirmation

```bash
ssh root@your-vps-ip 'pm2 logs yamaha-game --lines 50'
```

Should see:

```
✅ Connected to SQLite database
📊 Admin API ready (SQLite)
💾 Database: /var/www/yamaha/admin/data/yamaha.db
```

### 3. Test API endpoint

```bash
curl http://your-vps-ip/api/stats
```

### 4. Check database file exists

```bash
ssh root@your-vps-ip 'ls -lh /var/www/yamaha/admin/data/yamaha.db'
```

Should show the database file

---

## 🔄 Switching Between JSON and SQLite

### On Your Local Machine:

**Use JSON:**

```bash
npm start          # or npm run dev
```

**Use SQLite:**

```bash
npm run start:sqlite    # or npm run dev:sqlite
```

### On VPS:

**Switch to SQLite (recommended):**

```bash
pm2 stop yamaha-game
pm2 delete yamaha-game
pm2 start server-sqlite.js --name yamaha-game
pm2 save
```

**Switch back to JSON (if needed):**

```bash
pm2 stop yamaha-game
pm2 delete yamaha-game
pm2 start server.js --name yamaha-game
pm2 save
```

---

## 🛡️ Backup & Safety

### Backup SQLite Database

```bash
# On VPS
cp /var/www/yamaha/admin/data/yamaha.db \
   /var/www/yamaha/admin/data/yamaha_backup_$(date +%Y%m%d).db
```

### Backup via API

Use the admin endpoint:

```bash
curl -X POST http://your-domain.com/api/backup-sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Download backup to local machine

```bash
scp root@your-vps-ip:/var/www/yamaha/admin/data/yamaha.db \
    ./yamaha-backup.db
```

---

## 🐛 Troubleshooting

### Issue: "Database is locked"

**Solution:** Only one server instance should run at a time

```bash
pm2 delete yamaha-game
pm2 start server-sqlite.js --name yamaha-game
```

### Issue: "Table doesn't exist"

**Solution:** Database wasn't initialized

```bash
# Delete the database and restart (it will auto-create)
rm admin/data/yamaha.db
npm run start:sqlite
```

### Issue: "No data after migration"

**Solution:** Run migration manually

```bash
npm run migrate
```

### Issue: Still seeing JSON file operations in logs

**Solution:** You're running the wrong server

```bash
pm2 list   # Check which file is running
# Should be server-sqlite.js, not server.js
```

---

## 📝 Quick Reference Commands

### Local Development

```bash
npm run migrate          # Migrate JSON to SQLite
npm run start:sqlite     # Run SQLite server
npm run dev:sqlite       # Development mode
```

### VPS Deployment

```bash
./deploy-to-vps.sh                                    # Auto deploy
ssh root@vps 'pm2 logs yamaha-game'                  # View logs
ssh root@vps 'pm2 restart yamaha-game'               # Restart
ssh root@vps 'pm2 monit'                             # Monitor
```

### Database Operations

```bash
npm run migrate                                       # Migrate data
sqlite3 admin/data/yamaha.db "SELECT COUNT(*) FROM questions;"  # Query
```

---

## ✅ Success Indicators

You'll know SQLite is working when:

1. ✅ PM2 logs show "Admin API ready (SQLite)"
2. ✅ Database file exists at `admin/data/yamaha.db`
3. ✅ Admin panel loads questions and sessions
4. ✅ New sessions are saved to SQLite (not JSON files)
5. ✅ JSON files in `admin/data/*.json` stop being updated

---

## 🎯 Next Steps

1. **Deploy to VPS** using `./deploy-to-vps.sh`
2. **Verify logs** show SQLite is connected
3. **Test admin panel** to confirm everything works
4. **Setup automated backups** for `yamaha.db`
5. **Monitor performance** - SQLite should be faster!

---

**Need help?** Check the logs:

```bash
pm2 logs yamaha-game --lines 100
```

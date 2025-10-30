# Hostinger VPS Deployment Checklist

## Pre-Deployment Preparation ✓

- [x] SQLite migration complete locally
- [x] All tests passing (10/10)
- [x] Database created and verified
- [x] JSON backups created
- [x] Documentation created
- [x] Deployment scripts ready

## Information You'll Need

**VPS Details:**
- [ ] VPS IP Address: ___________________
- [ ] SSH Username: _____________________ (usually 'root')
- [ ] SSH Password/Key: _________________
- [ ] App Directory: ____________________ (usually '/var/www/yamaha')
- [ ] Domain Name: _____________________ (if applicable)

## Deployment Steps

### Option 1: Automated Deployment (Recommended)

- [ ] Open terminal on your Mac
- [ ] Navigate to project: `cd /Users/johnalcantara/Documents/yamaha`
- [ ] Run deployment script: `./deploy-to-vps.sh`
- [ ] Enter VPS IP when prompted
- [ ] Enter SSH username when prompted
- [ ] Enter app directory when prompted
- [ ] Wait for deployment to complete (~5-10 minutes)
- [ ] Verify success message

### Option 2: Manual Deployment

**Step 1: Upload Files**
- [ ] Upload `admin/data/database.js` to VPS
- [ ] Upload `admin/data/migrate-to-sqlite.js` to VPS
- [ ] Upload `server-sqlite.js` to VPS
- [ ] Upload `db-query.sh` to VPS
- [ ] Upload `switch-db.sh` to VPS
- [ ] Upload `test-sqlite.sh` to VPS

**Step 2: SSH into VPS**
- [ ] SSH connection successful
- [ ] Navigate to app directory: `cd /var/www/yamaha`

**Step 3: Backup Current Data**
- [ ] Create backup directory
- [ ] Copy all JSON files to backup
- [ ] Verify backup created successfully

**Step 4: Install Dependencies**
- [ ] Run: `npm install sqlite3`
- [ ] Verify installation: `npm list sqlite3`

**Step 5: Stop Application**
- [ ] Run: `pm2 stop yamaha-game`
- [ ] Verify app is stopped: `pm2 status`

**Step 6: Run Migration**
- [ ] Navigate to: `cd admin/data`
- [ ] Run: `node migrate-to-sqlite.js`
- [ ] Verify success message
- [ ] Check questions count: _____ (should match local)
- [ ] Check sessions count: _____ (should match local)
- [ ] Check answers count: _____ (should match local)
- [ ] Return to app root: `cd ../..`

**Step 7: Switch to SQLite Server**
- [ ] Backup current server: `cp server.js server-json-backup.js`
- [ ] Switch to SQLite: `cp server-sqlite.js server.js`
- [ ] Verify switch: `grep -q "getDatabase" server.js && echo "SQLite"`

**Step 8: Restart Application**
- [ ] Run: `pm2 restart yamaha-game`
- [ ] Save PM2 state: `pm2 save`
- [ ] Check status: `pm2 status`
- [ ] Application shows as 'online'

**Step 9: Make Scripts Executable**
- [ ] Run: `chmod +x *.sh`

## Post-Deployment Verification

### On VPS Server

- [ ] Run test suite: `./test-sqlite.sh`
- [ ] All 10 tests passing
- [ ] Check database stats: `./db-query.sh stats`
- [ ] Stats match expected values
- [ ] View logs: `pm2 logs yamaha-game --lines 50`
- [ ] No errors in logs
- [ ] Check app status: `pm2 status`
- [ ] App shows as 'online' with uptime

### In Web Browser

**Game Testing:**
- [ ] Visit: `https://yourdomain.com` (or `http://YOUR_VPS_IP`)
- [ ] Game loads without errors
- [ ] Can start a new game
- [ ] Questions display correctly
- [ ] Can answer questions
- [ ] Score updates correctly
- [ ] Game completes successfully

**Admin Testing:**
- [ ] Visit: `https://yourdomain.com/admin`
- [ ] Login page loads
- [ ] Can login with credentials
- [ ] Dashboard loads
- [ ] Analytics display correctly
- [ ] Leaderboard shows data
- [ ] Session list shows data
- [ ] Question stats display
- [ ] Can view session details

### API Testing

- [ ] Test questions endpoint: 
  ```bash
  curl https://yourdomain.com/api/game/questions
  ```
- [ ] Test analytics endpoint (need auth token)
- [ ] Response times are fast (<200ms)

## Database Verification

- [ ] Check database file exists: `ls -lh admin/data/yamaha.db`
- [ ] File size is reasonable (>100KB)
- [ ] Query database: `./db-query.sh stats`
- [ ] Questions count correct
- [ ] Sessions count correct
- [ ] Answers count correct
- [ ] View leaderboard: `./db-query.sh leaderboard 10`
- [ ] Top players display correctly

## Monitoring (First 24 Hours)

**Hour 1:**
- [ ] Check logs: `pm2 logs yamaha-game`
- [ ] No errors or warnings
- [ ] Test game in browser
- [ ] Works correctly

**Hour 6:**
- [ ] Check app status: `pm2 status`
- [ ] Still running
- [ ] Check logs for errors
- [ ] No issues reported

**Hour 24:**
- [ ] Full functionality test
- [ ] Check database stats: `./db-query.sh stats`
- [ ] New sessions recorded
- [ ] Analytics updating
- [ ] Performance is good

## Backup Setup

- [ ] Create backup script: `/usr/local/bin/backup-yamaha-db.sh`
- [ ] Make executable: `chmod +x /usr/local/bin/backup-yamaha-db.sh`
- [ ] Test backup: `/usr/local/bin/backup-yamaha-db.sh`
- [ ] Add to crontab: `crontab -e`
- [ ] Schedule daily backups (2 AM): `0 2 * * * /usr/local/bin/backup-yamaha-db.sh`
- [ ] Verify crontab saved: `crontab -l`

## Rollback Plan (If Needed)

**Know how to rollback before deploying:**
- [ ] Understand rollback process
- [ ] Know where backups are: `/var/backups/yamaha-TIMESTAMP/`
- [ ] Know rollback commands:
  ```bash
  pm2 stop yamaha-game
  cp server-json-backup.js server.js
  pm2 restart yamaha-game
  ```

## Security Checklist

- [ ] Admin password is strong
- [ ] Consider moving credentials to environment variables
- [ ] SSL/HTTPS is enabled (Let's Encrypt)
- [ ] Firewall rules configured (ports 22, 80, 443)
- [ ] Regular backups scheduled
- [ ] fail2ban installed (blocks brute force)

## Documentation

- [ ] Read: `HOSTINGER_SQLITE_DEPLOYMENT.md`
- [ ] Bookmark: `VPS_DEPLOYMENT_QUICK_REFERENCE.txt`
- [ ] Understand: `DATABASE_README.md`
- [ ] Keep handy: `QUICKSTART_SQLITE.md`

## Success Criteria

**Deployment is successful when:**
- [x] All files uploaded to VPS
- [ ] Migration completed without errors
- [ ] Application restarted successfully
- [ ] No errors in logs
- [ ] Game works in browser
- [ ] Admin panel accessible
- [ ] Analytics displaying correctly
- [ ] Database queries are fast
- [ ] Backups configured
- [ ] Monitoring in place

## Performance Benchmarks

**Before (JSON):**
- Response time: _____ ms
- Load time: _____ seconds

**After (SQLite):**
- Response time: _____ ms (should be faster)
- Load time: _____ seconds (should be same or better)

## Notes

Record any issues or observations:

__________________________________________________________________

__________________________________________________________________

__________________________________________________________________

__________________________________________________________________


## Deployment Completed

- [ ] Date: _______________
- [ ] Time: _______________
- [ ] Deployed by: _______________
- [ ] VPS IP: _______________
- [ ] Domain: _______________
- [ ] Database size: _______________
- [ ] No issues to report
- [ ] Team notified

---

**Status:** 
- [ ] ✅ Deployment Successful
- [ ] ⚠️  Deployment Successful with Minor Issues
- [ ] ❌ Deployment Failed (Rolled Back)

**Next Review:** _______________

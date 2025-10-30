# 📋 Yamaha Quiz Game - Database Management

## Quick Commands

```bash
# Check current database
./switch-db.sh status

# Switch to SQLite (recommended)
./switch-db.sh sqlite

# Switch back to JSON (if needed)
./switch-db.sh json

# Start server
./switch-db.sh start

# Test everything
./test-sqlite.sh

# Query database
./db-query.sh stats
./db-query.sh leaderboard 10
./db-query.sh questions
```

## What Changed?

### Before (JSON)
- Data stored in separate JSON files
- File locks when writing
- Risk of corruption
- Manual analytics calculations
- Slow with large datasets

### After (SQLite) ✅
- Single database file with indexes
- Concurrent access
- ACID compliance
- SQL-powered analytics
- Fast and scalable

## Files Overview

### Core Files
- `server.js` - Your main server (switch between versions)
- `server-sqlite.js` - SQLite version (ready to use)
- `server-json-backup.js` - JSON version backup

### Database
- `admin/data/yamaha.db` - SQLite database (380KB)
- `admin/data/database.js` - Database helper module
- `admin/data/json-backup/` - Original JSON backups

### Utilities
- `switch-db.sh` - Switch between SQLite/JSON
- `test-sqlite.sh` - Full API test suite
- `db-query.sh` - Database query tools

### Documentation
- `SQLITE_MIGRATION_COMPLETE.md` - Technical details
- `QUICKSTART_SQLITE.md` - Quick reference
- `migration-summary.txt` - Migration summary
- This file (`DATABASE_README.md`) - Quick guide

## Database Stats

**Current Data:**
- Questions: 44 (30 active)
- Sessions: 449 (234 completed)
- Answers: 2033 records

**Top Players:**
1. rubiossheehan@yahoo.com - 3000 pts
2. Jericksonmiro25@gmail.com - 2500 pts
3. Leojr1113@yahoo.com - 2500 pts

## Common Tasks

### View Database Stats
```bash
./db-query.sh stats
```

### See Leaderboard
```bash
./db-query.sh leaderboard 20
```

### Check Player Stats
```bash
./db-query.sh player email@example.com
```

### Backup Database
```bash
./db-query.sh backup
```

### Optimize Database
```bash
./db-query.sh vacuum
```

### Query Directly
```bash
./db-query.sh shell
# Then run SQL commands:
# SELECT * FROM sessions WHERE completed = 1;
# .quit to exit
```

## Testing

### Full Test Suite
```bash
./test-sqlite.sh
```

Expected output: **10/10 tests passing ✅**

### Manual API Tests
```bash
# Get questions
curl http://localhost:3000/api/game/questions

# Start session
curl -X POST http://localhost:3000/api/sessions/start \
  -H "Content-Type: application/json" \
  -d '{"player_email":"test@example.com"}'
```

## Switching Between Databases

### To SQLite (Recommended)
```bash
./switch-db.sh sqlite
node server.js
```

Benefits:
- ✅ Faster queries
- ✅ Better concurrency
- ✅ Data integrity
- ✅ Advanced analytics

### To JSON (Rollback)
```bash
./switch-db.sh json
node server.js
```

Use if:
- Need to debug
- Want original behavior
- Testing compatibility

## Backup Strategy

### Automated (Recommended)
Add to crontab for daily backups:
```bash
0 2 * * * cd /path/to/yamaha && ./db-query.sh backup
```

### Manual Backup
```bash
./db-query.sh backup
# Creates: admin/data/backups/yamaha_TIMESTAMP.db
```

### Restore Backup
```bash
cp admin/data/backups/yamaha_20240101_120000.db admin/data/yamaha.db
```

## Admin Access

**URL:** http://localhost:3000/admin  
**Username:** admin  
**Password:** YamahaAdmin2024@Prod

⚠️ **Security:** Consider moving credentials to environment variables in production

## Troubleshooting

### Server won't start
```bash
# Check if port is in use
lsof -i :3000

# Kill existing process
pkill -f "node server.js"

# Start fresh
node server.js
```

### Database locked error
```bash
# Check for zombie processes
ps aux | grep node

# Kill all node processes
pkill -9 node

# Restart server
node server.js
```

### Need to rebuild database
```bash
# Stop server
pkill -f "node server.js"

# Backup current DB
cp admin/data/yamaha.db admin/data/yamaha.db.backup

# Re-run migration
cd admin/data
node migrate-to-sqlite.js
```

## Performance Tips

1. **Use indexes** - Already configured for common queries
2. **Run VACUUM** - `./db-query.sh vacuum` monthly
3. **Monitor size** - Check `ls -lh admin/data/yamaha.db`
4. **Regular backups** - Automate with cron

## API Endpoints

### Public
- `GET /api/game/questions` - Quiz questions
- `POST /api/sessions/start` - Start game
- `POST /api/sessions/answer` - Submit answer
- `POST /api/sessions/end` - End game

### Admin (Auth Required)
- `POST /api/login` - Get auth token
- `GET /api/questions` - All questions
- `GET /api/sessions` - All sessions
- `GET /api/analytics` - Dashboard stats
- Full CRUD for questions/sessions/messages

## Next Steps

1. ✅ SQLite migration complete
2. ✅ All tests passing
3. ✅ Documentation ready
4. ⏳ Switch to SQLite in production
5. ⏳ Set up automated backups
6. ⏳ Monitor performance

## Support

For detailed documentation:
- `SQLITE_MIGRATION_COMPLETE.md` - Full technical details
- `QUICKSTART_SQLITE.md` - Quick start guide

For live queries:
- `./db-query.sh` - Database utilities
- `./test-sqlite.sh` - Test suite

---

**Status:** ✅ Ready for production  
**Last Updated:** 2024  
**Database:** SQLite 3 (ACID compliant)

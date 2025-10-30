# 🚀 Quick Start Guide - SQLite Server

## Current Status
✅ SQLite migration complete and tested  
✅ Database contains all data (44 questions, 449 sessions, 2033 answers)  
✅ All API endpoints tested and working  
⚠️ Server is running on `server-sqlite.js` (test mode)  

## How to Switch to SQLite Permanently

### Option 1: Rename Files (Recommended)
```bash
# Stop any running server
pkill -f "node server.js"

# Backup original JSON-based server
mv server.js server-json-backup.js

# Activate SQLite server
mv server-sqlite.js server.js

# Start server
node server.js
```

### Option 2: Keep Both Versions
Keep `server.js` (JSON) and `server-sqlite.js` (SQLite) and choose which to run:

```bash
# Run SQLite version
node server-sqlite.js

# Or run JSON version
node server.js
```

## Testing the Server

### Run full test suite
```bash
./test-sqlite.sh
```

### Query database directly
```bash
# Show statistics
./db-query.sh stats

# Show leaderboard
./db-query.sh leaderboard 10

# Show question performance
./db-query.sh questions

# Show recent sessions
./db-query.sh recent 20

# Show player stats
./db-query.sh player email@example.com

# Open SQLite shell
./db-query.sh shell
```

## Database Location
```
/Users/johnalcantara/Documents/yamaha/admin/data/yamaha.db
```

## Backups

### Create manual backup
```bash
./db-query.sh backup
```

### Original JSON backups
Located in: `admin/data/json-backup/`
- answers.json
- sessions.json  
- qs.json
- players.json

## Important Files

### Server Files
- `server.js` - Original JSON-based server (not modified)
- `server-sqlite.js` - New SQLite server (ready to use)

### Database Files
- `admin/data/yamaha.db` - SQLite database
- `admin/data/database.js` - Database helper module
- `admin/data/migrate-to-sqlite.js` - Migration script (already run)

### Utility Scripts
- `test-sqlite.sh` - Comprehensive API test suite
- `db-query.sh` - Database query utility

### Documentation
- `SQLITE_MIGRATION_COMPLETE.md` - Full migration documentation

## Monitoring

### Check server logs
The server logs show:
```
🚀 Server running on http://localhost:3000
📊 Admin API ready (SQLite)
🎮 Game API ready
✓ Connected to SQLite database
```

### Check database health
```bash
# Show stats
./db-query.sh stats

# Optimize database
./db-query.sh vacuum
```

## Admin Access

**Username**: `admin`  
**Password**: `YamahaAdmin2024@Prod`

Login at: `http://localhost:3000/admin`

## API Endpoints

### Public (Game)
- `GET /api/game/questions` - Get quiz questions
- `GET /api/game/kamote-messages` - Get messages
- `POST /api/sessions/start` - Start game
- `POST /api/sessions/answer` - Submit answer
- `POST /api/sessions/end` - End game

### Admin (Requires Auth)
- `POST /api/login` - Admin login
- `GET /api/questions` - Manage questions
- `GET /api/sessions` - View all sessions
- `GET /api/analytics` - Dashboard analytics
- Full CRUD for questions, sessions, messages

## Performance Benefits

✅ **Faster queries** - Indexed lookups vs full file scans  
✅ **Better concurrency** - Multiple users without file locks  
✅ **Data integrity** - ACID compliance  
✅ **Complex analytics** - SQL aggregations  
✅ **Scalability** - Handles thousands of records efficiently  

## Rollback (If Needed)

To revert to JSON:
```bash
pkill -f "node server.js"
mv server-json-backup.js server.js
node server.js
```

All JSON files are safe in `admin/data/json-backup/`

## Next Steps

1. ✅ Test SQLite server thoroughly
2. ⏳ Switch `server.js` to SQLite version
3. ⏳ Update any deployment scripts
4. ⏳ Set up automated backups (optional)
5. ⏳ Monitor performance in production

## Support

All data has been migrated successfully:
- **Questions**: 44 total (30 active)
- **Sessions**: 449 (234 completed)  
- **Answers**: 2033

Database is ready for production use! 🎉

# 🗄️ Database Management Quick Reference

## Current Status

✅ **yamaha.db is synced and ready for production**

- 1,000 sessions
- 2,033 answers
- 44 questions
- 44.9% session-to-answer coverage

---

## 🔄 Sync Commands

### Update database from JSON files

```bash
npm run sync
```

This will:

- Insert new sessions from `sessions.json`
- Update existing sessions
- Insert new answers from `answers.json`
- Report any missing data

---

## 📊 Analysis & Reporting

### Run comprehensive database analysis

```bash
sqlite3 admin/data/yamaha.db < admin/data/analysis-queries.sql
```

Shows:

- Session coverage statistics
- Missing answer analysis
- Top players
- Score distribution
- Question accuracy
- Daily summaries

### Quick stats

```bash
sqlite3 admin/data/yamaha.db "
  SELECT 'Sessions:', COUNT(*) FROM sessions
  UNION ALL
  SELECT 'Answers:', COUNT(*) FROM answers;
"
```

---

## 🛠️ Useful Queries

### Find sessions without answers

```sql
sqlite3 admin/data/yamaha.db "
  SELECT session_id, player_email, final_score
  FROM sessions
  WHERE session_id NOT IN (SELECT DISTINCT session_id FROM answers)
  AND completed = 1
  LIMIT 10;
"
```

### Check data integrity

```sql
sqlite3 admin/data/yamaha.db "
  SELECT
    COUNT(DISTINCT s.session_id) as Total_Sessions,
    COUNT(DISTINCT a.session_id) as Sessions_With_Answers,
    ROUND(CAST(COUNT(DISTINCT a.session_id) AS FLOAT) /
          CAST(COUNT(DISTINCT s.session_id) AS FLOAT) * 100, 1) as Coverage
  FROM sessions s
  LEFT JOIN answers a ON s.session_id = a.session_id;
"
```

### Top players

```sql
sqlite3 admin/data/yamaha.db "
  SELECT player_email, COUNT(*) as sessions, MAX(final_score) as best_score
  FROM sessions
  WHERE player_email IS NOT NULL
  GROUP BY player_email
  ORDER BY sessions DESC
  LIMIT 10;
"
```

---

## 💾 Backup

### Create backup

```bash
cp admin/data/yamaha.db admin/data/yamaha_backup_$(date +%Y%m%d_%H%M%S).db
```

### Via API (when server is running)

```bash
curl -X POST http://localhost:3000/api/backup-sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚀 Deployment

### Deploy to VPS with SQLite

```bash
./deploy-to-vps.sh
```

### Switch VPS to SQLite manually

```bash
./switch-db.sh sqlite YOUR_VPS_IP
```

---

## 📝 Files

- `yamaha.db` - Main SQLite database
- `sync-json-to-sqlite.js` - Sync script
- `analysis-queries.sql` - Analysis queries
- `migrate-to-sqlite.js` - Initial migration (one-time use)

---

## ⚠️ Known Issues

**372 completed sessions have missing answers**

- Caused by `answers.json` corruption before sync
- Sessions still have metadata (email, score, time)
- Only the specific question answers are missing
- Cannot be recovered without original data

**This won't happen going forward** - SQLite prevents this type of corruption.

---

## 🔍 Troubleshooting

### Database locked error

Only one connection at a time. Stop the server first:

```bash
pm2 stop yamaha-game  # On VPS
# or
pkill -f "node server-sqlite.js"  # Locally
```

### Want to start fresh

```bash
rm admin/data/yamaha.db
npm run migrate  # Recreates from JSON
```

### Verify database

```bash
sqlite3 admin/data/yamaha.db "PRAGMA integrity_check;"
```

---

For detailed information, see `DATABASE_SYNC_SUMMARY.md`

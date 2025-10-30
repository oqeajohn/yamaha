#!/bin/bash

# Yamaha Database Query Utility
# Quick access to common database queries

DB_PATH="./admin/data/yamaha.db"

case "$1" in
  stats)
    echo "📊 Database Statistics"
    echo "══════════════════════════════════════"
    sqlite3 $DB_PATH << EOF
.mode column
.headers on
SELECT 
  (SELECT COUNT(*) FROM questions WHERE active = 1) as 'Active Questions',
  (SELECT COUNT(*) FROM sessions) as 'Total Sessions',
  (SELECT COUNT(*) FROM sessions WHERE completed = 1) as 'Completed',
  (SELECT COUNT(*) FROM answers) as 'Total Answers';
EOF
    ;;
    
  leaderboard)
    LIMIT=${2:-10}
    echo "🏆 Top $LIMIT Players"
    echo "══════════════════════════════════════"
    sqlite3 $DB_PATH << EOF
.mode column
.headers on
SELECT 
  player_email as 'Player Email',
  MAX(final_score) as 'Best Score',
  COUNT(*) as 'Games Played',
  SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as 'Completed'
FROM sessions
GROUP BY player_email
ORDER BY MAX(final_score) DESC
LIMIT $LIMIT;
EOF
    ;;
    
  questions)
    echo "❓ Question Performance"
    echo "══════════════════════════════════════"
    sqlite3 $DB_PATH << EOF
.mode column
.headers on
SELECT 
  q.id as 'ID',
  SUBSTR(q.question, 1, 40) as 'Question',
  COUNT(a.id) as 'Attempts',
  ROUND(AVG(a.is_correct) * 100, 1) as 'Accuracy %'
FROM questions q
LEFT JOIN answers a ON q.id = a.question_id
WHERE q.active = 1
GROUP BY q.id
ORDER BY COUNT(a.id) DESC
LIMIT 20;
EOF
    ;;
    
  recent)
    LIMIT=${2:-10}
    echo "🕒 Recent Sessions ($LIMIT)"
    echo "══════════════════════════════════════"
    sqlite3 $DB_PATH << EOF
.mode column
.headers on
SELECT 
  SUBSTR(session_id, 1, 12) as 'Session',
  player_email as 'Player',
  final_score as 'Score',
  completed as 'Done',
  SUBSTR(start_time, 1, 19) as 'Started'
FROM sessions
ORDER BY start_time DESC
LIMIT $LIMIT;
EOF
    ;;
    
  player)
    if [ -z "$2" ]; then
      echo "Usage: $0 player <email>"
      exit 1
    fi
    echo "👤 Player Stats: $2"
    echo "══════════════════════════════════════"
    sqlite3 $DB_PATH << EOF
.mode column
.headers on
SELECT 
  COUNT(*) as 'Total Games',
  SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as 'Completed',
  MAX(final_score) as 'Best Score',
  AVG(final_score) as 'Avg Score',
  MIN(start_time) as 'First Played',
  MAX(start_time) as 'Last Played'
FROM sessions
WHERE player_email = '$2';
EOF
    ;;
    
  backup)
    BACKUP_DIR="./admin/data/backups"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/yamaha_$TIMESTAMP.db"
    
    mkdir -p $BACKUP_DIR
    cp $DB_PATH $BACKUP_FILE
    
    echo "✅ Database backed up to: $BACKUP_FILE"
    ls -lh $BACKUP_FILE
    ;;
    
  vacuum)
    echo "🧹 Optimizing database..."
    sqlite3 $DB_PATH "VACUUM;"
    echo "✅ Database optimized"
    ls -lh $DB_PATH
    ;;
    
  shell)
    echo "🐚 Opening SQLite shell (type .quit to exit)"
    sqlite3 $DB_PATH
    ;;
    
  *)
    echo "Yamaha Database Query Utility"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  stats              Show database statistics"
    echo "  leaderboard [N]    Show top N players (default: 10)"
    echo "  questions          Show question performance metrics"
    echo "  recent [N]         Show N most recent sessions (default: 10)"
    echo "  player <email>     Show stats for specific player"
    echo "  backup             Create database backup"
    echo "  vacuum             Optimize database file"
    echo "  shell              Open SQLite interactive shell"
    echo ""
    echo "Examples:"
    echo "  $0 stats"
    echo "  $0 leaderboard 20"
    echo "  $0 player user@example.com"
    echo "  $0 backup"
    ;;
esac

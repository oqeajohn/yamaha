#!/bin/bash

###############################################################################
# Database Switcher for Yamaha Game
# Allows easy switching between JSON and SQLite on VPS
###############################################################################

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <database-type> <vps-host>"
    echo ""
    echo "Database types:"
    echo "  json    - Use JSON file database (server.js)"
    echo "  sqlite  - Use SQLite database (server-sqlite.js)"
    echo ""
    echo "Example:"
    echo "  $0 sqlite 123.45.67.89"
    echo "  $0 json yourdomain.com"
    exit 1
fi

DB_TYPE=$1
VPS_HOST=$2
VPS_USER="root"
APP_NAME="yamaha-game"

case $DB_TYPE in
    json)
        SERVER_FILE="server.js"
        DB_NAME="JSON files"
        ;;
    sqlite)
        SERVER_FILE="server-sqlite.js"
        DB_NAME="SQLite database"
        ;;
    *)
        echo "❌ Invalid database type: $DB_TYPE"
        echo "Use 'json' or 'sqlite'"
        exit 1
        ;;
esac

echo "🔄 Switching to $DB_NAME on $VPS_HOST..."
echo ""

ssh $VPS_USER@$VPS_HOST << ENDSSH
set -e

cd /var/www/yamaha

echo "⏹️  Stopping current server..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

echo "🚀 Starting with $SERVER_FILE..."
pm2 start $SERVER_FILE --name $APP_NAME

echo "💾 Saving PM2 configuration..."
pm2 save

echo ""
echo "✅ Successfully switched to $DB_NAME"
echo ""
echo "📊 Current status:"
pm2 status $APP_NAME

echo ""
echo "📝 Recent logs:"
pm2 logs $APP_NAME --lines 10 --nostream

ENDSSH

echo ""
echo "✅ Database switch complete!"
echo "🌐 Your app: http://$VPS_HOST"
echo ""
echo "Monitor logs with:"
echo "  ssh $VPS_USER@$VPS_HOST 'pm2 logs $APP_NAME'"

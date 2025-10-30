#!/bin/bash

# Yamaha Server Switcher
# Switch between JSON and SQLite database backends

show_status() {
    if [ -f "server.js" ]; then
        if grep -q "getDatabase" server.js 2>/dev/null; then
            echo "📊 Current: SQLite Database"
        else
            echo "📄 Current: JSON Files"
        fi
    else
        echo "⚠️  No server.js found"
    fi
}

switch_to_sqlite() {
    echo "🔄 Switching to SQLite..."
    
    # Stop server
    pkill -f "node server.js" 2>/dev/null
    
    # Check if files exist
    if [ ! -f "server-sqlite.js" ]; then
        echo "❌ Error: server-sqlite.js not found"
        exit 1
    fi
    
    # Backup current server.js if it's the JSON version
    if [ -f "server.js" ] && ! grep -q "getDatabase" server.js 2>/dev/null; then
        echo "📦 Backing up current server.js to server-json-backup.js"
        cp server.js server-json-backup.js
    fi
    
    # Switch to SQLite
    cp server-sqlite.js server.js
    
    echo "✅ Switched to SQLite database"
    echo "   Database: admin/data/yamaha.db"
    echo ""
    echo "To start server: node server.js"
}

switch_to_json() {
    echo "🔄 Switching to JSON..."
    
    # Stop server
    pkill -f "node server.js" 2>/dev/null
    
    # Check if backup exists
    if [ ! -f "server-json-backup.js" ]; then
        echo "❌ Error: server-json-backup.js not found"
        echo "   Cannot restore JSON version"
        exit 1
    fi
    
    # Backup current server.js if it's the SQLite version
    if grep -q "getDatabase" server.js 2>/dev/null; then
        echo "📦 Current SQLite version backed up (already in server-sqlite.js)"
    fi
    
    # Switch to JSON
    cp server-json-backup.js server.js
    
    echo "✅ Switched to JSON files"
    echo "   Data directory: admin/data/"
    echo ""
    echo "To start server: node server.js"
}

start_server() {
    if [ -f "server.js" ]; then
        echo "🚀 Starting server..."
        node server.js
    else
        echo "❌ Error: server.js not found"
        exit 1
    fi
}

show_help() {
    echo "Yamaha Server Switcher"
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  status        Show current database backend"
    echo "  sqlite        Switch to SQLite database"
    echo "  json          Switch to JSON files"
    echo "  start         Start the server"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 sqlite"
    echo "  $0 json"
    echo "  $0 start"
}

case "$1" in
    status)
        show_status
        ;;
    sqlite)
        switch_to_sqlite
        ;;
    json)
        switch_to_json
        ;;
    start)
        show_status
        echo ""
        start_server
        ;;
    *)
        show_help
        ;;
esac

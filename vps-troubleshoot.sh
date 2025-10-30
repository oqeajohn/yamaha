#!/bin/bash

# VPS Troubleshooting Script
# Run this ON YOUR VPS to diagnose connection issues

echo "🔍 Yamaha App - Connection Troubleshooting"
echo "==========================================="
echo ""

# Check 1: Is Node.js running?
echo "1️⃣  Checking if Node.js process is running..."
if pgrep -f "node.*server.js" > /dev/null; then
    echo "   ✅ Node.js process found"
    ps aux | grep "node.*server.js" | grep -v grep
else
    echo "   ❌ Node.js process NOT running"
fi
echo ""

# Check 2: Is PM2 running?
echo "2️⃣  Checking PM2 status..."
if command -v pm2 &> /dev/null; then
    pm2 status
else
    echo "   ⚠️  PM2 not installed or not in PATH"
fi
echo ""

# Check 3: Is port 3000 in use?
echo "3️⃣  Checking if port 3000 is listening..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "   ✅ Port 3000 is in use"
    lsof -i :3000
elif ss -tuln | grep :3000 > /dev/null 2>&1; then
    echo "   ✅ Port 3000 is listening"
    ss -tuln | grep :3000
else
    echo "   ❌ Port 3000 is NOT listening"
fi
echo ""

# Check 4: Test local connection
echo "4️⃣  Testing local connection to port 3000..."
if curl -s http://localhost:3000/api/game/questions > /dev/null 2>&1; then
    echo "   ✅ Local connection successful"
else
    echo "   ❌ Local connection failed"
fi
echo ""

# Check 5: Check application directory
echo "5️⃣  Checking application files..."
if [ -f "server.js" ]; then
    echo "   ✅ server.js exists"
else
    echo "   ❌ server.js NOT found"
fi

if [ -f "package.json" ]; then
    echo "   ✅ package.json exists"
else
    echo "   ❌ package.json NOT found"
fi
echo ""

# Check 6: Check for errors in logs
echo "6️⃣  Checking PM2 logs (last 20 lines)..."
if command -v pm2 &> /dev/null; then
    pm2 logs yamaha-game --lines 20 --nostream
else
    echo "   ⚠️  PM2 not available"
fi
echo ""

# Check 7: Check Nginx status
echo "7️⃣  Checking Nginx status..."
if systemctl is-active --quiet nginx; then
    echo "   ✅ Nginx is running"
else
    echo "   ❌ Nginx is NOT running"
fi
echo ""

# Check 8: Check firewall
echo "8️⃣  Checking firewall rules..."
if command -v ufw &> /dev/null; then
    if ufw status | grep -q "Status: active"; then
        echo "   Firewall Status:"
        ufw status | grep -E "(3000|80|443)"
    else
        echo "   ℹ️  Firewall not active"
    fi
else
    echo "   ℹ️  UFW not installed"
fi
echo ""

echo "==========================================="
echo "📋 RECOMMENDATIONS:"
echo ""

# Provide recommendations based on checks
if ! pgrep -f "node.*server.js" > /dev/null; then
    echo "⚠️  Application is not running!"
    echo "   Fix: pm2 start server.js --name yamaha-game"
    echo "   Or: cd /var/www/yamaha && node server.js"
fi

if ! lsof -i :3000 > /dev/null 2>&1 && ! ss -tuln | grep :3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is not listening!"
    echo "   Fix: Check application logs for startup errors"
    echo "   Command: pm2 logs yamaha-game --err"
fi

echo ""
echo "==========================================="

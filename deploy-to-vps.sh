#!/bin/bash

# 🚀 Quick Deploy to Hostinger VPS
# This script guides you through SQLite deployment

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 Yamaha Quiz - SQLite Deployment to Hostinger VPS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Get VPS details
read -p "Enter your VPS IP address: " VPS_IP
read -p "Enter your SSH username (default: root): " SSH_USER
SSH_USER=${SSH_USER:-root}
read -p "Enter your app directory (default: /var/www/yamaha): " APP_DIR
APP_DIR=${APP_DIR:-/var/www/yamaha}

echo ""
echo "📋 Configuration:"
echo "   VPS IP: $VPS_IP"
echo "   SSH User: $SSH_USER"
echo "   App Directory: $APP_DIR"
echo ""

read -p "Continue with deployment? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Step 1: Uploading Files to VPS"
echo "═══════════════════════════════════════════════════════════"

# Upload files
echo "📤 Uploading SQLite migration files..."

scp admin/data/database.js $SSH_USER@$VPS_IP:$APP_DIR/admin/data/
scp admin/data/migrate-to-sqlite.js $SSH_USER@$VPS_IP:$APP_DIR/admin/data/
scp server-sqlite.js $SSH_USER@$VPS_IP:$APP_DIR/
scp db-query.sh $SSH_USER@$VPS_IP:$APP_DIR/
scp switch-db.sh $SSH_USER@$VPS_IP:$APP_DIR/
scp test-sqlite.sh $SSH_USER@$VPS_IP:$APP_DIR/

if [ $? -eq 0 ]; then
    echo "✅ Files uploaded successfully"
else
    echo "❌ Upload failed. Check your SSH connection."
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Step 2: Running Deployment on VPS"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Next steps will be executed on your VPS..."
echo ""

# Create and upload deployment script
cat > /tmp/deploy-sqlite-vps.sh << 'DEPLOYSCRIPT'
#!/bin/bash
set -e

APP_DIR=$1

echo "🔍 Current location: $(pwd)"
cd $APP_DIR

echo ""
echo "📦 Step 2.1: Creating backup..."
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p /var/backups/yamaha-$DATE
cp admin/data/*.json /var/backups/yamaha-$DATE/ 2>/dev/null || true
echo "✅ Backup created: /var/backups/yamaha-$DATE"

echo ""
echo "📦 Step 2.2: Installing sqlite3..."
npm install sqlite3
echo "✅ sqlite3 installed"

echo ""
echo "⏸️  Step 2.3: Stopping application..."
pm2 stop yamaha-game || echo "⚠️  App not running in PM2"

echo ""
echo "🔄 Step 2.4: Making scripts executable..."
chmod +x *.sh

echo ""
echo "🗄️  Step 2.5: Running migration..."
cd admin/data

# Only migrate if database doesn't exist
if [ ! -f "yamaha.db" ]; then
    node migrate-to-sqlite.js
    echo "✅ Migration completed"
else
    echo "⏭️  Database already exists"
    ls -lh yamaha.db
fi

cd ../..

echo ""
echo "🔄 Step 2.6: Switching to SQLite server..."
cp server.js server-json-backup.js 2>/dev/null || true
cp server-sqlite.js server.js
echo "✅ Server switched to SQLite"

echo ""
echo "▶️  Step 2.7: Starting application..."
pm2 restart yamaha-game || pm2 start server.js --name yamaha-game
pm2 save
echo "✅ Application started"

echo ""
echo "🧪 Step 2.8: Verifying deployment..."
sleep 3

# Check if server is responding
if curl -s http://localhost:3000/api/game/questions > /dev/null; then
    echo "✅ API is responding"
else
    echo "⚠️  API not responding yet"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Deployment Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Database Stats:"
./db-query.sh stats

echo ""
echo "🎯 Next Steps:"
echo "   1. Test your website in browser"
echo "   2. Check admin dashboard"
echo "   3. Play a test game"
echo "   4. View logs: pm2 logs yamaha-game"
echo ""
echo "🔧 Useful Commands:"
echo "   ./db-query.sh stats          - View database stats"
echo "   ./db-query.sh leaderboard    - View leaderboard"
echo "   ./test-sqlite.sh             - Run full test suite"
echo "   pm2 logs yamaha-game         - View application logs"
echo "   pm2 status                   - Check app status"
echo ""
DEPLOYSCRIPT

chmod +x /tmp/deploy-sqlite-vps.sh

# Upload and execute deployment script
scp /tmp/deploy-sqlite-vps.sh $SSH_USER@$VPS_IP:/tmp/

echo ""
echo "Executing deployment on VPS..."
echo ""

ssh $SSH_USER@$VPS_IP "bash /tmp/deploy-sqlite-vps.sh $APP_DIR"

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  🎉 DEPLOYMENT SUCCESSFUL!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Your application is now using SQLite database!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Game: http://$VPS_IP (or your domain)"
    echo "   Admin: http://$VPS_IP/admin"
    echo ""
    echo "🔍 Monitor your application:"
    echo "   ssh $SSH_USER@$VPS_IP"
    echo "   cd $APP_DIR"
    echo "   pm2 logs yamaha-game"
    echo ""
    echo "📊 Database location:"
    echo "   $APP_DIR/admin/data/yamaha.db"
    echo ""
    echo "💾 Backups:"
    echo "   /var/backups/yamaha-*"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Check the error messages above."
    echo "You can manually connect and check:"
    echo "   ssh $SSH_USER@$VPS_IP"
    echo "   cd $APP_DIR"
    echo "   pm2 logs yamaha-game"
fi

# Cleanup
rm /tmp/deploy-sqlite-vps.sh

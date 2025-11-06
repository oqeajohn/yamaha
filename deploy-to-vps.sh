#!/bin/bash

###############################################################################
# Yamaha Game - VPS Deployment Script (SQLite Version)
# This script deploys the Yamaha game to your Hostinger VPS using SQLite
###############################################################################

set -e  # Exit on error

echo "🚀 Yamaha Game - VPS Deployment (SQLite Version)"
echo "================================================"
echo ""

# Configuration
VPS_USER="root"  # Change this to your VPS username
VPS_HOST=""      # Change this to your VPS IP or domain
VPS_PATH="/var/www/yamaha"
APP_NAME="yamaha-game"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if VPS_HOST is set
if [ -z "$VPS_HOST" ]; then
    echo -e "${RED}❌ Error: VPS_HOST is not set${NC}"
    echo "Please edit this script and set VPS_HOST to your VPS IP or domain"
    echo "Example: VPS_HOST=\"123.45.67.89\" or VPS_HOST=\"yourdomain.com\""
    exit 1
fi

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "   VPS User: $VPS_USER"
echo "   VPS Host: $VPS_HOST"
echo "   Deploy Path: $VPS_PATH"
echo "   App Name: $APP_NAME"
echo ""

read -p "Continue with deployment? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo -e "${GREEN}Step 1: Building project locally${NC}"
# No build step needed for this project

echo -e "${GREEN}Step 2: Creating deployment package${NC}"
mkdir -p dist
tar -czf dist/yamaha-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='backup' \
    --exclude='*.backup' \
    --exclude='.DS_Store' \
    --exclude='*.old' \
    server-sqlite.js \
    package.json \
    package-lock.json \
    index.html \
    admin \
    js \
    css \
    assets \
    icons

echo -e "${GREEN}Step 3: Uploading to VPS${NC}"
scp dist/yamaha-deploy.tar.gz $VPS_USER@$VPS_HOST:/tmp/

echo -e "${GREEN}Step 4: Deploying on VPS${NC}"
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
set -e

echo "📦 Extracting files..."
mkdir -p /var/www/yamaha
cd /var/www/yamaha
tar -xzf /tmp/yamaha-deploy.tar.gz
rm /tmp/yamaha-deploy.tar.gz

echo "📚 Installing dependencies..."
npm install --production

echo "🔄 Checking if migration is needed..."
if [ ! -f admin/data/yamaha.db ]; then
    echo "📊 SQLite database not found, running migration..."
    if [ -f admin/data/qs.json ]; then
        npm run migrate
    else
        echo "⚠️  No JSON data found to migrate. Database will be created on first run."
    fi
else
    echo "✅ SQLite database already exists"
fi

echo "🔧 Setting permissions..."
chown -R www-data:www-data /var/www/yamaha
chmod -R 755 /var/www/yamaha
chmod 775 admin/data
chmod 664 admin/data/*.db 2>/dev/null || true

echo "🔄 Managing PM2 process..."
if pm2 describe yamaha-game > /dev/null 2>&1; then
    echo "   Restarting existing process..."
    pm2 restart yamaha-game
else
    echo "   Starting new process..."
    pm2 start server-sqlite.js --name yamaha-game
    pm2 save
fi

echo "✅ Deployment complete!"
echo ""
echo "📊 PM2 Status:"
pm2 status yamaha-game

echo ""
echo "📝 Recent logs:"
pm2 logs yamaha-game --lines 20 --nostream

ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "🌐 Your app should be running at: http://$VPS_HOST"
echo "🔐 Admin panel: http://$VPS_HOST/admin"
echo ""
echo "📊 Useful commands:"
echo "   ssh $VPS_USER@$VPS_HOST 'pm2 status'"
echo "   ssh $VPS_USER@$VPS_HOST 'pm2 logs yamaha-game'"
echo "   ssh $VPS_USER@$VPS_HOST 'pm2 restart yamaha-game'"
echo ""

# Cleanup
rm -rf dist

exit 0

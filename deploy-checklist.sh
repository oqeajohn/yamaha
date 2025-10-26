#!/bin/bash

# Deployment Pre-flight Checklist
# Run this before deploying to production

echo "🚀 Yamaha Game - Deployment Checklist"
echo "======================================"
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed. Run: npm install"
    exit 1
fi

# Check if server.js exists
if [ -f "server.js" ]; then
    echo "✅ Server file exists"
else
    echo "❌ server.js not found"
    exit 1
fi

# Check if package.json has start script
if grep -q '"start"' package.json; then
    echo "✅ Start script configured"
else
    echo "❌ No start script in package.json"
    exit 1
fi

# Check if admin data directory exists
if [ -d "admin/data" ]; then
    echo "✅ Admin data directory exists"
else
    echo "❌ admin/data directory not found"
    mkdir -p admin/data
    echo "✅ Created admin/data directory"
fi

# Check if required JSON files exist
for file in questions.json sessions.json answers.json players.json; do
    if [ -f "admin/data/$file" ]; then
        echo "✅ $file exists"
    else
        echo "⚠️  $file not found - will be created on first run"
    fi
done

# Check .gitignore
if [ -f ".gitignore" ]; then
    echo "✅ .gitignore exists"
else
    echo "⚠️  No .gitignore file"
fi

echo ""
echo "======================================"
echo "📋 Next Steps:"
echo "======================================"
echo ""
echo "1. Commit your code:"
echo "   git add ."
echo "   git commit -m 'Ready for production'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Render.com:"
echo "   - Go to https://render.com"
echo "   - Connect your GitHub repository"
echo "   - Select 'yamaha' repo"
echo "   - Choose 'Web Service'"
echo "   - Use these settings:"
echo "     Build Command: npm install"
echo "     Start Command: npm start"
echo ""
echo "3. After deployment, update API URLs in:"
echo "   - js/game.js (line ~245)"
echo "   - admin/dashboard-vue.html (line ~783)"
echo "   - admin/login-vue.html"
echo ""
echo "4. Set environment variables in Render:"
echo "   SECRET_KEY=your-random-secret-key"
echo "   ADMIN_USERNAME=admin"
echo "   ADMIN_PASSWORD_HASH=$2a$10$XuNd1UJKxzZBbEEo0jrMg.dUDvzznKVPQMmTQ45Grtxra/GcVsdty"
echo ""
echo "✅ Project is ready for deployment!"

# Hostinger VPS Deployment Guide

Complete guide for deploying the Yamaha Sensible Meter game (HTML/JS + Vue Admin + Node.js) on Hostinger VPS.

## 🎯 What You're Deploying

- **Game**: HTML/JS/Canvas (index.html, js/game.js, assets/)
- **Admin Panel**: Vue.js (admin/dashboard-vue.html, admin/login-vue.html)
- **Backend API**: Node.js/Express (server.js) on port 3000
- **Data Storage**: JSON files (admin/data/*.json)

## 📋 Prerequisites

- Hostinger VPS access (SSH)
- Domain pointed to your VPS IP
- Root or sudo access

## 🚀 Deployment Steps

### 1. Connect to Your VPS

```bash
ssh root@your-vps-ip
# Or with your username:
ssh your-username@your-vps-ip
```

### 2. Install Node.js (if not installed)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v  # Should show v18.x.x
npm -v   # Should show 9.x.x
```

### 3. Install Nginx (Reverse Proxy)

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. Upload Your Project Files

**Option A: Via Git (Recommended)**

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
sudo git clone https://github.com/oqeajohn/yamaha.git
cd yamaha

# Install dependencies
sudo npm install

# Set proper permissions
sudo chown -R www-data:www-data /var/www/yamaha
sudo chmod -R 755 /var/www/yamaha
```

**Option B: Via SFTP/SCP**

```bash
# On your local machine:
scp -r /Users/johnalcantara/Documents/yamaha root@your-vps-ip:/var/www/

# Then on VPS:
cd /var/www/yamaha
npm install
```

### 5. Create Environment Variables

```bash
cd /var/www/yamaha
sudo nano .env
```

Add this content:
```env
PORT=3000
NODE_ENV=production
SECRET_KEY=your-super-secret-random-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$XuNd1UJKxzZBbEEo0jrMg.dUDvzznKVPQMmTQ45Grtxra/GcVsdty
```

Save and exit (Ctrl+X, Y, Enter)

### 6. Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/yamaha
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # Change this!

    # Increase timeout for long requests
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Optional: Serve static files directly (better performance)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/yamaha;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Save and exit.

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/yamaha /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 7. Setup PM2 (Process Manager)

PM2 keeps your Node.js app running 24/7 and auto-restarts on crashes.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your app
cd /var/www/yamaha
pm2 start server.js --name yamaha-game

# Setup auto-start on server reboot
pm2 startup
pm2 save

# Useful PM2 commands:
pm2 status          # Check app status
pm2 logs yamaha-game    # View logs
pm2 restart yamaha-game # Restart app
pm2 stop yamaha-game    # Stop app
pm2 delete yamaha-game  # Remove from PM2
```

### 8. Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS (for SSL later)
sudo ufw enable
sudo ufw status
```

### 9. Test Your Deployment

Visit your domain or VPS IP:
- **Game**: http://yourdomain.com
- **Admin Login**: http://yourdomain.com/admin/login-vue.html
- **Admin Dashboard**: http://yourdomain.com/admin/dashboard-vue.html

Test the API:
```bash
curl http://yourdomain.com/api/questions
```

### 10. Setup SSL/HTTPS (Free with Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts (enter email, agree to terms)
# Certbot will automatically configure Nginx for HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL setup, your site will be accessible via:
- https://yourdomain.com (game)
- https://yourdomain.com/admin/login-vue.html (admin)

## 📊 File Structure on VPS

```
/var/www/yamaha/
├── server.js              # Node.js backend
├── package.json
├── .env                   # Environment variables (create this)
├── index.html             # Game entry point
├── js/                    # Game JavaScript
│   ├── game.js
│   └── ...
├── admin/                 # Vue.js admin panel
│   ├── login-vue.html
│   ├── dashboard-vue.html
│   └── data/              # JSON storage
│       ├── questions.json
│       ├── sessions.json
│       ├── answers.json
│       └── players.json
├── css/                   # Stylesheets
├── assets/                # Images, sounds
└── icons/                 # Favicons
```

## 🔄 Updating Your Application

When you make changes:

```bash
# SSH into VPS
ssh root@your-vps-ip

# Navigate to project
cd /var/www/yamaha

# Pull latest changes (if using Git)
sudo git pull origin main

# Install any new dependencies
sudo npm install

# Restart the application
pm2 restart yamaha-game

# Check logs
pm2 logs yamaha-game
```

## 🔐 Security Best Practices

1. **Change admin password** (already set in .env):
   ```bash
   node -e "const bcrypt = require('bcryptjs'); const chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let pw=''; for(let i=0;i<8;i++) pw+=chars[Math.floor(Math.random()*chars.length)]; console.log('\n🔐 New Password:', pw); bcrypt.hash(pw, 10, (e,h) => console.log('📋 Hash:', h, '\n'));"
   ```

2. **Secure SSH**:
   ```bash
   # Disable root login
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl restart sshd
   ```

3. **Setup fail2ban** (blocks brute force attacks):
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **Backup data regularly**:
   ```bash
   # Create backup script
   sudo nano /usr/local/bin/backup-yamaha.sh
   ```
   
   Add:
   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d-%H%M%S)
   tar -czf /var/backups/yamaha-$DATE.tar.gz /var/www/yamaha/admin/data/
   # Keep only last 7 days of backups
   find /var/backups/yamaha-*.tar.gz -mtime +7 -delete
   ```
   
   Make executable and schedule:
   ```bash
   sudo chmod +x /usr/local/bin/backup-yamaha.sh
   crontab -e
   # Add: 0 2 * * * /usr/local/bin/backup-yamaha.sh  # Daily at 2 AM
   ```

## 🐛 Troubleshooting

### App not accessible
```bash
# Check if Node.js is running
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check logs
pm2 logs yamaha-game
sudo tail -f /var/log/nginx/error.log
```

### API endpoints return 502
```bash
# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart yamaha-game
```

### Permission issues with JSON files
```bash
cd /var/www/yamaha
sudo chown -R www-data:www-data admin/data/
sudo chmod -R 775 admin/data/
```

### SSL certificate issues
```bash
# Renew manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## 📈 Performance Optimization

### Enable Gzip compression in Nginx:
```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Monitor Resources:
```bash
# Check CPU/Memory usage
htop

# Check disk space
df -h

# Check PM2 monitoring
pm2 monit
```

## 🎯 Access URLs

After deployment:
- **Game**: https://yourdomain.com
- **Admin Login**: https://yourdomain.com/admin/login-vue.html
- **Admin Dashboard**: https://yourdomain.com/admin/dashboard-vue.html

Default credentials:
- Username: `admin`
- Password: `WbaVlgny` (or your custom password)

## ✅ Deployment Checklist

- [ ] Node.js installed (v18+)
- [ ] Nginx installed and configured
- [ ] Project files uploaded to `/var/www/yamaha`
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`.env` file)
- [ ] PM2 running the application
- [ ] PM2 auto-start configured
- [ ] Nginx reverse proxy configured
- [ ] Firewall rules set (ports 22, 80, 443)
- [ ] Domain DNS pointing to VPS IP
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Backup script configured
- [ ] Admin password changed
- [ ] Application tested and working

## 📚 Additional Resources

- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

---

**Need help?** Check the logs:
```bash
pm2 logs yamaha-game --lines 100
```

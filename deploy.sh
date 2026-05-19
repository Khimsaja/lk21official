#!/bin/bash
# ============================================
# LK21 Streaming - VPS Deployment Script
# Domain: lk21official.eu.cc
# ============================================

set -e

APP_DIR="/var/www/lk21"
DOMAIN="lk21official.eu.cc"

echo "========================================="
echo "  LK21 Streaming - VPS Setup"
echo "========================================="

# 1. Install PM2 jika belum ada
if ! command -v pm2 &> /dev/null; then
    echo "[1/6] Installing PM2..."
    sudo npm install -g pm2
else
    echo "[1/6] PM2 sudah terinstall ✓"
fi

# 2. Install Nginx jika belum ada
if ! command -v nginx &> /dev/null; then
    echo "[2/6] Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
else
    echo "[2/6] Nginx sudah terinstall ✓"
fi

# 3. Buat direktori app
echo "[3/6] Setting up app directory..."
sudo mkdir -p $APP_DIR/logs
sudo chown -R $USER:$USER $APP_DIR

# 4. Setup Nginx
echo "[4/6] Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null << 'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name lk21official.eu.cc;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering on;
        proxy_buffer_size 16k;
        proxy_buffers 4 16k;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 5M;
}
NGINX_CONF

# Enable site
sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test dan reload Nginx
sudo nginx -t && sudo systemctl reload nginx
echo "   Nginx configured ✓"

# 5. Install SSL (Let's Encrypt)
echo "[5/6] Setting up SSL..."
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot python3-certbot-nginx
fi
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || {
    echo "   ⚠ SSL setup failed - you can run it manually later:"
    echo "   sudo certbot --nginx -d $DOMAIN"
}

# 6. Info
echo "[6/6] Setup complete!"
echo ""
echo "========================================="
echo "  SETUP SELESAI!"
echo "========================================="
echo ""
echo "Selanjutnya, upload file dari PC kamu:"
echo ""
echo "  1. Di PC (Windows PowerShell):"
echo "     scp -r build package.json ecosystem.config.cjs .env user@YOUR_VPS_IP:/var/www/lk21/"
echo ""
echo "  2. Di VPS:"
echo "     cd /var/www/lk21"
echo "     npm install --production"
echo "     pm2 start ecosystem.config.cjs"
echo "     pm2 save"
echo "     pm2 startup"
echo ""
echo "  Site akan live di: https://$DOMAIN"
echo "========================================="

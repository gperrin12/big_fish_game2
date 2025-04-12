#!/bin/bash

# Update packages
sudo apt update
sudo apt upgrade -y

# Install Python and dependencies
sudo apt install -y python3 python3-pip python3-venv nginx

# Create a Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Set up Nginx
sudo tee /etc/nginx/sites-available/big_fish_game <<EOF
server {
    listen 80;
    server_name \$host;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/big_fish_game /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

# Create a service file for the game
sudo tee /etc/systemd/system/big_fish_game.service <<EOF
[Unit]
Description=Big Fish Hunter Game
After=network.target

[Service]
User=$(whoami)
WorkingDirectory=$(pwd)
Environment="PATH=$(pwd)/venv/bin"
ExecStart=$(pwd)/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 app:app

[Install]
WantedBy=multi-user.target
EOF

# Start and enable the service
sudo systemctl start big_fish_game
sudo systemctl enable big_fish_game

echo "Deployment completed! Access the game at http://YOUR_SERVER_IP"
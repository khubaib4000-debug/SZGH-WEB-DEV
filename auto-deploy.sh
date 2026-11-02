#!/bin/bash
# SZGH Pakistan - 100% Hands-Free Auto-Updater
# Checks GitHub for new commits and rebuilds the container only when changes are detected.

REPO_DIR="/root/SZGH-WEB-DEV"
cd "$REPO_DIR" || exit 1

# Fetch latest info from GitHub without modifying files yet
git fetch origin main >/dev/null 2>&1 || git fetch origin master >/dev/null 2>&1

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date)] New update found on GitHub! Pulling and rebuilding szghpakistan.com..."
    git reset --hard "$REMOTE"
    sed -i 's/RUN npm install$/RUN npm install --legacy-peer-deps/' Dockerfile
    docker build -t szghpakistan-web .
    docker rm -f szgh
    docker run -d --name szgh --restart always --net proxy-network -p 8086:80 szghpakistan-web
    echo "[$(date)] Live website updated successfully!"
fi

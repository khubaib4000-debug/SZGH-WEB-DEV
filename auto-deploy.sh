#!/bin/bash
# SZGH Pakistan - 100% Hands-Free Auto-Updater
# Checks GitHub for new commits and rebuilds the container only when changes are detected.

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

REPO_DIR="/root/SZGH-WEB-DEV"
cd "$REPO_DIR" || exit 1

# Fetch all latest branch refs from GitHub so origin/main is updated
git fetch origin --prune >/dev/null 2>&1

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main 2>/dev/null || git rev-parse origin/master 2>/dev/null || git rev-parse FETCH_HEAD)

if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date)] New update found on GitHub ($LOCAL -> $REMOTE)! Pulling and rebuilding szghpakistan.com..."
    git reset --hard "$REMOTE"
    sed -i 's/RUN npm install$/RUN npm install --legacy-peer-deps/' Dockerfile
    if docker build -t szghpakistan-web .; then
        docker rm -f szgh >/dev/null 2>&1 || true
        docker run -d --name szgh --restart always --net proxy-network -p 8086:80 szghpakistan-web
        echo "[$(date)] Live website updated successfully to $REMOTE!"
    else
        echo "[$(date)] ERROR: docker build failed; resetting HEAD back to $LOCAL so next cron run retries."
        git reset --hard "$LOCAL"
        exit 1
    fi
fi

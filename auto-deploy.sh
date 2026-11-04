#!/bin/bash
# SZGH Pakistan - 100% Hands-Free Auto-Updater
# Checks GitHub for new commits and rebuilds the container only when changes are detected.

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Prevent overlapping cron runs while a Docker build is in progress
exec 9>/tmp/szgh-deploy.lock
flock -n 9 || exit 0

REPO_DIR="/root/SZGH-WEB-DEV"
cd "$REPO_DIR" || exit 1
chmod +x "$REPO_DIR/auto-deploy.sh" 2>/dev/null || true
cp -f "$REPO_DIR/auto-deploy.sh" /root/auto-deploy.sh 2>/dev/null || true
chmod +x /root/auto-deploy.sh 2>/dev/null || true

# Ensure cron always invokes /bin/bash every 2 minutes via both root crontab and /etc/cron.d
CRON_CMD="*/2 * * * * /bin/bash /root/SZGH-WEB-DEV/auto-deploy.sh >> /var/log/szgh-deploy.log 2>&1"
if ! crontab -l 2>/dev/null | grep -Fq "/bin/bash /root/SZGH-WEB-DEV/auto-deploy.sh"; then
    (crontab -l 2>/dev/null | grep -v "auto-deploy.sh"; echo "$CRON_CMD") | crontab - 2>/dev/null || true
fi
echo "*/2 * * * * root /bin/bash /root/SZGH-WEB-DEV/auto-deploy.sh >> /var/log/szgh-deploy.log 2>&1" > /etc/cron.d/szgh-auto-deploy 2>/dev/null || true
chmod 644 /etc/cron.d/szgh-auto-deploy 2>/dev/null || true

# Fetch all latest branch refs from GitHub so origin/main is updated
git fetch origin --prune >/dev/null 2>&1

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main 2>/dev/null || git rev-parse origin/master 2>/dev/null || git rev-parse FETCH_HEAD)

if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date)] New update found on GitHub ($LOCAL -> $REMOTE)! Pulling and rebuilding szghpakistan.com..."
    git reset --hard "$REMOTE"
    chmod +x "$REPO_DIR/auto-deploy.sh" 2>/dev/null || true
    sed -i 's/RUN npm install$/RUN npm install --legacy-peer-deps/' Dockerfile
    if docker build -t szghpakistan-web .; then
        docker rm -f szgh >/dev/null 2>&1 || true
        docker run -d --name szgh --restart always --net proxy-network -p 8086:80 szghpakistan-web
        echo "[$(date)] Live website updated successfully to $REMOTE!"
    else
        echo "[$(date)] ERROR: docker build failed; resetting HEAD back to $LOCAL so next cron run retries."
        git reset --hard "$LOCAL"
        chmod +x "$REPO_DIR/auto-deploy.sh" 2>/dev/null || true
        exit 1
    fi
fi


#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

NEW_TAG="${1:?usage: ./deploy.sh <image-tag>}"
OLD_TAG="$(grep -s '^IMAGE_TAG=' .env | cut -d= -f2 || true)"

echo "Deploying ${NEW_TAG} (previous: ${OLD_TAG:-none})"

# 1. download first: if the tag does not exist, nothing has changed yet
export IMAGE_TAG="$NEW_TAG"
docker compose pull

# 2. remember the choice, then start and WAIT until the health check passes
echo "IMAGE_TAG=${NEW_TAG}" > .env
if docker compose up -d --wait --wait-timeout 120; then
  echo "Healthy on ${NEW_TAG}"
  docker image prune -f > /dev/null
  exit 0
fi

# 3. failed: show why, then go back to the previous version
echo "Deploy FAILED. Last logs:"
docker compose logs --tail 40 api || true

if [ -n "${OLD_TAG}" ]; then
  echo "Rolling back to ${OLD_TAG}"
  export IMAGE_TAG="$OLD_TAG"
  echo "IMAGE_TAG=${OLD_TAG}" > .env
  docker compose up -d --wait --wait-timeout 120 || true
fi
exit 1
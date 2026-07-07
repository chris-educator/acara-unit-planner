#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
SKIP_PUSH=0; SKIP_HEALTH=0
for arg in "$@"; do case "$arg in --skip-push) SKIP_PUSH=1;; --skip-health) SKIP_HEALTH=1;; esac; done
echo "==> acara-unit-planner — ship"
bash scripts/verify-llm.sh
[[ "$SKIP_PUSH" -eq 1 ]] && exit 0
[[ -n "$(git status --porcelain)" ]] && { echo "Uncommitted changes"; exit 1; }
git push origin HEAD
[[ "$SKIP_HEALTH" -eq 1 ]] && exit 0
HEALTH_URL="${APP_PUBLIC_URL:-https://planner.appstax.ai}/api/health"
for i in $(seq 1 30); do
  body=$(curl -fsS "$HEALTH_URL" 2>/dev/null) && echo "$body" && exit 0
  sleep 10
done
exit 1

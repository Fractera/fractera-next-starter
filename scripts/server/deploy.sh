#!/usr/bin/env bash
# deploy.sh — весь цикл: доставка → замок панели → сборка с меткой коммита → pm2 reload →
# сверка. Метка `NEXT_PUBLIC_GIT_COMMIT` попадает в /api/health, и совпадение её с твоим
# хэшем — доказательство, что отвечает ИМЕННО твоя сборка.
#
# Гарантирует: сборка не столкнётся со сборкой панели (тот же pid-замок
# /tmp/fractera-deploy.lock(.pid), который держит панель); код возврата берётся у `npm`,
# а не у конвейера — `npm run build | tail` печатает код `tail`, то есть всегда ноль;
# после reload проверяются обе плоскости — держатель порта (status.sh) и `commit` в
# /api/health. Любой отказ — ненулевой код, успех — ===DEPLOY_OK===.
#
#   bash scripts/server/deploy.sh app/[lang]/page.tsx lib/products   # доставить и собрать
#   bash scripts/server/deploy.sh                                    # только пересобрать
#   FRACTERA_WAIT_LOCK=600 bash scripts/server/deploy.sh …           # подождать панель

set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/run.sh" --lib
fx_load

PORT="${FRACTERA_APP_PORT:-3000}"
PROC="${FRACTERA_APP_PROC:-fractera-app}"
WAIT="${FRACTERA_WAIT_LOCK:-0}"
HASH="${FRACTERA_BUILD_COMMIT:-$(git -C "$FX_ROOT" rev-parse --short HEAD)}"

echo "[deploy] коммит сборки: $HASH"

if [ $# -ge 1 ]; then
  bash "$FX_DIR/copy.sh" "$@"
else
  echo "[deploy] путей не задано — доставка пропущена, пересборка на месте"
fi

{
  printf 'PORT=%s\nPROC=%s\nAPP=%s\nHASH=%s\nWAIT=%s\nexport PORT PROC APP HASH WAIT\n' \
    "$PORT" "$PROC" "$FX_REMOTE_APP" "$HASH" "$WAIT"
  cat <<'REMOTE'
set -u
LOCK=/tmp/fractera-deploy.lock
LOCKPID=$LOCK.pid
LOG=/tmp/fractera-agent-build.log

waited=0
while [ -f "$LOCK" ]; do
  p="$(cat "$LOCKPID" 2>/dev/null || true)"
  if [ -n "$p" ] && kill -0 "$p" 2>/dev/null; then
    if [ "$waited" -ge "$WAIT" ]; then echo "===DEPLOY_BUSY=== панель собирает (pid $p), повторите позже"; exit 4; fi
    sleep 5; waited=$((waited + 5)); continue
  fi
  echo "[deploy] замок без живого процесса — снимаю"
  rm -f "$LOCK" "$LOCKPID"
done

echo "agent-$$" > "$LOCK"
echo "$$" > "$LOCKPID"
trap 'rm -f "$LOCK" "$LOCKPID"' EXIT INT TERM

cd "$APP" || { echo "===DEPLOY_FAIL=== нет каталога $APP"; exit 1; }

NEXT_PUBLIC_GIT_COMMIT="$HASH" npm run build > "$LOG" 2>&1
RC=$?
echo "NPM_EXIT=$RC"
if [ "$RC" != "0" ]; then
  tail -40 "$LOG"
  echo "===BUILD_FAILED==="
  exit 1
fi
echo "===BUILD_OK==="

pm2 reload "$PROC" > /dev/null 2>&1 || { echo "===RELOAD_FAILED==="; exit 1; }
echo "===RELOAD_OK==="

H=""
SEEN=""
i=0
while [ "$i" -lt 8 ]; do
  sleep 5
  H="$(curl -s --max-time 10 "http://localhost:$PORT/api/health" || true)"
  SEEN="$(printf '%s' "$H" | sed -n 's/.*"commit":"\([^"]*\)".*/\1/p')"
  [ "$SEEN" = "$HASH" ] && break
  i=$((i + 1))
done
echo "HEALTH=$H"
if [ "$SEEN" != "$HASH" ]; then
  echo "===DEPLOY_FAIL=== /api/health называет сборку '$SEEN', ожидался '$HASH'"
  exit 1
fi
echo "===HEALTH_COMMIT_OK==="
REMOTE
} | fx_ssh

bash "$FX_DIR/status.sh"

echo "===DEPLOY_OK=== $HASH"

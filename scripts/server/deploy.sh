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
#
# Два режима, выбор автоматический. Есть FRACTERA_DEPLOY_SECRET в .env.local — сборку
# запускает ПАНЕЛЬ: её очередь, её журнал развёртываний, её откат на последнюю рабочую
# сборку. Нет — собираем сами по SSH: быстрее, но журнал панели останется со старой
# записью, и владелец увидит в подвале не твою сборку.

set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/run.sh" --lib
fx_load

PORT="${FRACTERA_APP_PORT:-3000}"
PROC="${FRACTERA_APP_PROC:-fractera-app}"
WAIT="${FRACTERA_WAIT_LOCK:-0}"
HASH="${FRACTERA_BUILD_COMMIT:-$(git -C "$FX_ROOT" rev-parse --short HEAD)}"
SECRET="${FRACTERA_DEPLOY_SECRET:-}"
ADMIN_PORT="${FRACTERA_ADMIN_PORT:-3002}"
MODE=direct; [ -n "$SECRET" ] && MODE=panel

echo "[deploy] коммит сборки: $HASH; сборку запускает: $MODE"

if [ $# -ge 1 ]; then
  bash "$FX_DIR/copy.sh" "$@"
else
  echo "[deploy] путей не задано — доставка пропущена, пересборка на месте"
fi

{
  printf 'PORT=%s\nPROC=%s\nAPP=%s\nHASH=%s\nWAIT=%s\nMODE=%s\nSECRET=%s\nADMIN_PORT=%s\nexport PORT PROC APP HASH WAIT MODE SECRET ADMIN_PORT\n' \
    "$PORT" "$PROC" "$FX_REMOTE_APP" "$HASH" "$WAIT" "$MODE" "$SECRET" "$ADMIN_PORT"
  cat <<'REMOTE'
set -u
LOCK=/tmp/fractera-deploy.lock
LOCKPID=$LOCK.pid
LOG=/tmp/fractera-agent-build.log

# ── СБОРКА ЧЕРЕЗ ПАНЕЛЬ ──────────────────────────────────────────────────────
# Одна дверь вместо двух: очередь, журнал развёртываний и откат на последнюю
# рабочую сборку принадлежат панели; обходя её, мы оставляем владельцу подвал с
# чужой записью.
if [ "$MODE" = panel ]; then
  # Метку сборки панель сама не ставит — она берёт окружение слота. Пишем ПЕРЕД
  # запуском, поэтому запечённое значение всегда равно тому, что собирают.
  ENVF="$APP/.env.local"
  touch "$ENVF"
  if grep -q '^NEXT_PUBLIC_GIT_COMMIT=' "$ENVF"; then
    sed -i "s/^NEXT_PUBLIC_GIT_COMMIT=.*/NEXT_PUBLIC_GIT_COMMIT=$HASH/" "$ENVF"
  else
    printf 'NEXT_PUBLIC_GIT_COMMIT=%s\n' "$HASH" >> "$ENVF"
  fi

  R="$(curl -s -w '\n%{http_code}' --max-time 30 -X POST \
        -H "x-deploy-secret: $SECRET" -H 'Content-Type: application/json' \
        -d "{\"description\":\"agent $HASH\"}" \
        "http://localhost:$ADMIN_PORT/api/deploy" || true)"
  CODE="$(printf '%s' "$R" | tail -1)"
  BODY="$(printf '%s' "$R" | sed '$d')"
  JOB="$(printf '%s' "$BODY" | tr ',' '\n' | sed -n 's/.*"jobId":"*\([0-9][0-9]*\).*/\1/p' | head -1)"

  case "$CODE" in
    200) echo "===PANEL_BUILD_STARTED=== job $JOB" ;;
    409) echo "[deploy] панель уже собирает (job $JOB) — встаём в ту же очередь" ;;
    401) echo "===DEPLOY_FAIL=== панель не приняла ключ: проверьте FRACTERA_DEPLOY_SECRET"; exit 2 ;;
    *)   echo "===DEPLOY_FAIL=== панель ответила $CODE: $BODY"; exit 1 ;;
  esac

  i=0
  while [ "$i" -lt 180 ]; do
    sleep 5
    S="$(curl -s --max-time 10 -H "x-deploy-secret: $SECRET" \
          "http://localhost:$ADMIN_PORT/api/deploy/status?jobId=$JOB" || true)"
    RUNNING="$(printf '%s' "$S" | sed -n 's/.*"running":\([a-z][a-z]*\).*/\1/p')"
    ST="$(printf '%s' "$S" | tr ',' '\n' | sed -n 's/.*"status":"\([^"]*\)".*/\1/p' | head -1)"
    if [ "$RUNNING" = false ] && [ "$ST" != in_progress ]; then break; fi
    i=$((i + 1))
  done
  echo "PANEL_STATUS=$ST"
  case "$ST" in
    COMPLETED|completed|ok) echo "===BUILD_OK===" ;;
    *) echo "===DEPLOY_FAIL=== сборка панели кончилась статусом '$ST'"; exit 1 ;;
  esac
  # Процесс панель перезапускает сама — своего reload не делаем.
else

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
fi

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

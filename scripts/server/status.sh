#!/usr/bin/env bash
# status.sh — прочитать состояние приложения на сервере, ничего не меняя.
#
# Печатает: pid слушателя порта и цепочку `ppid` от него вверх, два замера uptime,
# счётчик рестартов, состояние замка панели, /opt/fractera/app/DEPLOY_STATE.json и
# ответ /api/health. Код возврата 0 — порт держит pm2 или его потомок; 3 — держит
# кто-то другой (сирота прошлой сессии) либо порт пуст.
# Закрывает две ловушки: слушатель — ПОТОМОК pm2-пида любой глубины (Next: npm run
# start → sh -c next start → next-server), поэтому идём вверх по `ppid`, а не
# сравниваем с прямым ребёнком; `online` в pm2 не значит ничего — процесс в вечном
# рестарте выглядит так же, поэтому смотрим на рестарты и на растущий uptime.
#
#   bash scripts/server/status.sh

set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/run.sh" --lib
fx_load

PORT="${FRACTERA_APP_PORT:-3000}"
PROC="${FRACTERA_APP_PROC:-fractera-app}"

{
  printf 'PORT=%s\nPROC=%s\nAPP=%s\nexport PORT PROC APP\n' "$PORT" "$PROC" "$FX_REMOTE_APP"
  cat <<'REMOTE'
set -u
echo "===STATUS_BEGIN==="

pm2_facts() {
  pm2 jlist > /tmp/fx-jlist.json 2>/dev/null || true
  node -e '
    const fs = require("fs");
    let list = [];
    try { list = JSON.parse(fs.readFileSync("/tmp/fx-jlist.json", "utf8")); } catch (e) {}
    const p = list.find(x => x.name === process.env.PROC);
    if (!p) { console.log("PM2_FOUND=0"); process.exit(0); }
    console.log("PM2_FOUND=1");
    console.log("PM2_PID=" + p.pid);
    console.log("PM2_STATUS=" + p.pm2_env.status);
    console.log("PM2_RESTARTS=" + p.pm2_env.restart_time);
    console.log("PM2_UPTIME_MS=" + (Date.now() - p.pm2_env.pm_uptime));
  '
}

LPID="$(ss -ltnpH 2>/dev/null | awk -v p=":$PORT\$" '$4 ~ p' | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2 || true)"
echo "PORT=$PORT"
echo "LISTENER_PID=${LPID:-none}"

pm2_facts > /tmp/fx-pm2-1.env
. /tmp/fx-pm2-1.env
cat /tmp/fx-pm2-1.env

OWNER=no-listener
if [ -n "${LPID:-}" ]; then
  OWNER=orphan
  p="$LPID"; depth=0
  while [ -n "$p" ] && [ "$p" != "0" ] && [ "$depth" -lt 12 ]; do
    comm="$(ps -o comm= -p "$p" 2>/dev/null | tr -d ' ')"
    echo "CHAIN pid=$p comm=${comm:-?}"
    if [ "${PM2_FOUND:-0}" = "1" ] && [ "$p" = "${PM2_PID:-x}" ]; then OWNER=pm2; break; fi
    case "$comm" in *PM2*) OWNER=pm2-daemon; break ;; esac
    if [ "$p" = "1" ]; then OWNER=orphan; break; fi
    p="$(ps -o ppid= -p "$p" 2>/dev/null | tr -d ' ')"
    depth=$((depth + 1))
  done
fi
echo "PORT_OWNER=$OWNER"

UP1="${PM2_UPTIME_MS:-}"
sleep 3
pm2_facts > /tmp/fx-pm2-2.env
. /tmp/fx-pm2-2.env
UP2="${PM2_UPTIME_MS:-}"
echo "UPTIME_MS_1=$UP1"
echo "UPTIME_MS_2=$UP2"
if [ -n "$UP1" ] && [ -n "$UP2" ] && [ "$UP2" -gt "$UP1" ]; then echo "UPTIME_GROWING=yes"; else echo "UPTIME_GROWING=no"; fi

if [ -f /tmp/fractera-deploy.lock ]; then
  LP="$(cat /tmp/fractera-deploy.lock.pid 2>/dev/null || true)"
  if [ -n "$LP" ] && kill -0 "$LP" 2>/dev/null; then echo "PANEL_BUILD=running pid=$LP"; else echo "PANEL_BUILD=stale-lock"; fi
else
  echo "PANEL_BUILD=idle"
fi

echo "--- $APP/DEPLOY_STATE.json"
cat "$APP/DEPLOY_STATE.json" 2>/dev/null || echo "(файла нет)"
echo ""
echo "--- /api/health"
curl -s --max-time 10 "http://localhost:$PORT/api/health" || echo "(нет ответа)"
echo ""
echo "===STATUS_END==="

case "$OWNER" in
  pm2|pm2-daemon) exit 0 ;;
  *) echo "===STATUS_BAD=== порт $PORT держит не pm2 ($OWNER)"; exit 3 ;;
esac
REMOTE
} | fx_ssh

#!/usr/bin/env bash
# run.sh — выполнить команду на сервере проекта. Тело команды подаётся ФАЙЛОМ или на stdin.
#
# Гарантирует: тело уходит на удалённый `bash -s` целиком по stdin, поэтому во внешней
# строке не остаётся ни одной кавычки; код возврата скрипта равен коду удалённой команды;
# пароль не спрашивается никогда (BatchMode) — доступ только по ключу.
# Закрывает ловушку `echo '…' | ssh`: кавычка, `%`, `|` в аргументе или не-ASCII рвут
# такую строку молча, без сообщения об ошибке.
#
#   bash scripts/server/run.sh cmd.sh          # тело из файла
#   printf 'pm2 list\n' | bash scripts/server/run.sh
#   bash scripts/server/run.sh -c 'pm2 list'   # короткая форма
#
# Этот же файл — библиотека для copy.sh / status.sh / deploy.sh: `. run.sh --lib`.

set -euo pipefail

FX_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FX_ROOT="$(cd "$FX_DIR/../.." && pwd)"
FX_ENV_FILE="$FX_ROOT/.env.local"
FX_REMOTE_APP="${FRACTERA_REMOTE_APP:-/opt/fractera/app}"

fx_die() { printf '%s\n' "$1" >&2; exit "${2:-1}"; }

# Значение переменной: сначала окружение, потом .env.local проекта.
fx_env_get() {
  local key="$1" val=""
  val="$(printf '%s' "${!key-}")"
  if [ -n "$val" ]; then printf '%s' "$val"; return 0; fi
  [ -f "$FX_ENV_FILE" ] || return 0
  val="$(sed -n "s/^[[:space:]]*${key}[[:space:]]*=[[:space:]]*//p" "$FX_ENV_FILE" | tail -1)"
  val="${val%$'\r'}"
  val="${val%\"}"; val="${val#\"}"
  val="${val%\'}"; val="${val#\'}"
  printf '%s' "$val"
}

fx_need() {
  local key="$1" val
  val="$(fx_env_get "$key")"
  [ -n "$val" ] || fx_die "scripts/server: нет переменной $key — впишите её в $FX_ENV_FILE (панель → «Переменные окружения» → выгрузка окружения)." 2
  printf '%s' "$val"
}

fx_load() {
  FX_HOST="$(fx_need FRACTERA_SSH_HOST)"
  FX_USER="$(fx_need FRACTERA_SSH_USER)"
  FX_KEY="$(fx_need FRACTERA_SSH_KEY_PATH)"
  FX_PORT="$(fx_env_get FRACTERA_SSH_PORT)"; FX_PORT="${FX_PORT:-22}"
  case "$FX_KEY" in "~"*) FX_KEY="$HOME${FX_KEY#\~}" ;; esac
  case "$FX_KEY" in /*|[A-Za-z]:*) ;; *) FX_KEY="$FX_ROOT/$FX_KEY" ;; esac
  [ -f "$FX_KEY" ] || fx_die "scripts/server: приватного ключа нет по пути FRACTERA_SSH_KEY_PATH=$FX_KEY — запросите ключ у владельца сервера." 2
  chmod 600 "$FX_KEY" 2>/dev/null || true
  FX_KNOWN="$FX_ROOT/.fractera-ssh/known_hosts"
  mkdir -p "$(dirname "$FX_KNOWN")"
  FX_SSH_OPTS=(-i "$FX_KEY" -p "$FX_PORT"
    -o BatchMode=yes
    -o StrictHostKeyChecking=accept-new
    -o UserKnownHostsFile="$FX_KNOWN"
    -o ConnectTimeout=15
    -o ServerAliveInterval=30)
}

# Тело команды читается со stdin вызывающего. Ничего не экранируем — нечего.
fx_ssh() { ssh "${FX_SSH_OPTS[@]}" "$FX_USER@$FX_HOST" bash -s; }

fx_scp() { scp "${FX_SSH_OPTS[@]}" "$1" "$FX_USER@$FX_HOST:$2"; }

if [ "${1:-}" = "--lib" ]; then return 0; fi

fx_load

if [ "${1:-}" = "-c" ]; then
  [ $# -ge 2 ] || fx_die "run.sh -c '<команда>'" 2
  printf '%s\n' "$2" | fx_ssh
elif [ $# -ge 1 ]; then
  [ -f "$1" ] || fx_die "run.sh: файла с телом команды нет — $1" 2
  fx_ssh < "$1"
else
  fx_ssh
fi

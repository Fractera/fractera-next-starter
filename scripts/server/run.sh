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

# 🔒 ОТКАЗ НАЗЫВАЕТ ПЕРВОЕ ПОРВАННОЕ ЗВЕНО, А НЕ ВТОРОЕ.
#
# ✗ Оплачено двумя сутками неверного диагноза (2026-08-24). Прежний текст здесь
# говорил «впишите её в .env.local» — то есть указывал на ВТОРОЕ звено цепочки,
# тогда как порвано было третье: ключ агенту ни разу не выдавали. Владелец делал
# выгрузку, строк не появлялось, и все — включая федерального агента —
# заключили «доступа нет вовсе». Долг простоял неверным двое суток.
#
# 🔒 ВПИСЫВАТЬ РУКАМИ НЕЛЬЗЯ И НЕ НУЖНО. Значения приезжают выгрузкой окружения
# целиком, вместе с ключом строкой `FRACTERA_SSH_KEY_B64`. Совет «впишите
# переменную» отправлял человека делать то, чего делать не надо, — и рядом, в
# двух других ветках этого же файла, стоял верный совет. Текст противоречил сам
# себе, а первым человек упирался в неверный.
#
# Три случая различаются и ведут к РАЗНЫМ действиям.
fx_die_access() {
  local key="$1"
  if [ ! -f "$FX_ENV_FILE" ]; then
    fx_die "scripts/server: файла $FX_ENV_FILE нет вовсе. Откройте панель → «Переменные окружения» → кнопка .env.local и сохраните файл в корень проекта. Больше ничего делать не нужно: ключ доступа заводится сам и едет внутри этого файла." 2
  fi
  if [ -z "$(fx_env_get FRACTERA_SSH_HOST)" ] && [ -z "$(fx_env_get FRACTERA_SSH_KEY_B64)" ]; then
    fx_die "scripts/server: в $FX_ENV_FILE нет ни одной строки доступа к серверу — значит файл устарел, а НЕ «доступа нет». Скачайте его заново: панель → «Переменные окружения» → кнопка .env.local. Вписывать что-либо руками не нужно. Не видно ни кнопки, ни строки состояния «ключ выдан» — панель на сервере старой сборки, скажите об этом владельцу." 2
  fi
  fx_die "scripts/server: строки доступа в $FX_ENV_FILE есть, но нет переменной $key — файл скачан со старой сборки панели. Скачайте .env.local заново той же кнопкой; руками ничего не дописывайте." 2
}

fx_need() {
  local key="$1" val
  val="$(fx_env_get "$key")"
  [ -n "$val" ] || fx_die_access "$key"
  printf '%s' "$val"
}

fx_load() {
  FX_HOST="$(fx_need FRACTERA_SSH_HOST)"
  FX_USER="$(fx_need FRACTERA_SSH_USER)"
  FX_KEY="$(fx_need FRACTERA_SSH_KEY_PATH)"
  FX_PORT="$(fx_env_get FRACTERA_SSH_PORT)"; FX_PORT="${FX_PORT:-22}"
  case "$FX_KEY" in "~"*) FX_KEY="$HOME${FX_KEY#\~}" ;; esac
  case "$FX_KEY" in /*|[A-Za-z]:*) ;; *) FX_KEY="$FX_ROOT/$FX_KEY" ;; esac

  # 🔒 КЛЮЧ РАЗВОРАЧИВАЕТСЯ САМ (владелец 2026-08-24). Панель кладёт приватную
  # половину прямо в файл окружения строкой `FRACTERA_SSH_KEY_B64`, потому что
  # прежний порядок — скачать ключ второй кнопкой и положить руками в папку —
  # владелец назвал неприемлемым: четыре ручных действия вместо одного.
  # Файл создаётся с правами 600, иначе ssh откажется его читать.
  if [ ! -f "$FX_KEY" ]; then
    FX_KEY_B64="$(fx_env_get FRACTERA_SSH_KEY_B64)"
    if [ -n "$FX_KEY_B64" ]; then
      mkdir -p "$(dirname "$FX_KEY")"
      printf '%s' "$FX_KEY_B64" | base64 -d > "$FX_KEY" 2>/dev/null || fx_die "scripts/server: FRACTERA_SSH_KEY_B64 не разбирается — скачайте .env.local заново в панели." 2
      chmod 600 "$FX_KEY"
    fi
  fi

  [ -f "$FX_KEY" ] || fx_die "scripts/server: приватного ключа нет и строки FRACTERA_SSH_KEY_B64 тоже — скачайте .env.local заново: панель → «Переменные окружения» → кнопка .env.local. Ключ заводится и приезжает сам, вручную ничего переносить не нужно." 2
  chmod 600 "$FX_KEY" 2>/dev/null || true
  FX_KNOWN="$FX_ROOT/.fractera-ssh/known_hosts"
  mkdir -p "$(dirname "$FX_KNOWN")"
  FX_COMMON_OPTS=(-i "$FX_KEY"
    -o BatchMode=yes
    -o StrictHostKeyChecking=accept-new
    -o UserKnownHostsFile="$FX_KNOWN"
    -o ConnectTimeout=15
    -o ServerAliveInterval=30)
  # У ssh порт — `-p`, у scp — `-P`; `-p` для scp означает «сохранить время файла»,
  # и номер порта уезжает в список копируемых файлов.
  FX_SSH_OPTS=(-p "$FX_PORT" "${FX_COMMON_OPTS[@]}")
  FX_SCP_OPTS=(-P "$FX_PORT" "${FX_COMMON_OPTS[@]}")
}

# Тело команды читается со stdin вызывающего. Ничего не экранируем — нечего.
fx_ssh() { ssh "${FX_SSH_OPTS[@]}" "$FX_USER@$FX_HOST" bash -s; }

fx_scp() { scp "${FX_SCP_OPTS[@]}" "$1" "$FX_USER@$FX_HOST:$2"; }

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

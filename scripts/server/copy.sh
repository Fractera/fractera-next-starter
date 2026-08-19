#!/usr/bin/env bash
# copy.sh — доставить указанные пути проекта в слот на сервере (/opt/fractera/app).
#
# Гарантирует: всё уезжает ОДНИМ архивом с простым именем и распаковывается уже на
# сервере, поэтому имена вроде `app/[lang]/(publicLayer)/...` нигде не экранируются;
# доставка аддитивна — распаковка перезаписывает файлы архива и ничего не удаляет;
# при отказе код возврата ненулевой, при успехе печатается ===COPY_OK===.
# Закрывает ловушку «файлы поодиночке»: каждая скобка в пути — лишний слой
# экранирования в цепочке оболочек, на котором молча рвётся команда.
#
#   bash scripts/server/copy.sh app/[lang]/page.tsx lib/products
#
# node_modules, .next, .git и .env* не уезжают никогда.

set -euo pipefail
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/run.sh" --lib
fx_load

[ $# -ge 1 ] || fx_die "copy.sh <путь> [путь...] — пути относительно корня проекта." 2

for p in "$@"; do
  [ -e "$FX_ROOT/$p" ] || fx_die "copy.sh: в проекте нет пути — $p" 2
done

STAMP="$(date +%s)"
LOCAL_TGZ="${TMPDIR:-/tmp}/fractera-copy-$STAMP.tgz"
REMOTE_TGZ="/tmp/fractera-copy-$STAMP.tgz"

tar -czf "$LOCAL_TGZ" -C "$FX_ROOT" \
  --exclude node_modules --exclude .next --exclude .git --exclude '.env*' \
  -- "$@"

fx_scp "$LOCAL_TGZ" "$REMOTE_TGZ"
rm -f "$LOCAL_TGZ"

{
  printf 'set -eu\n'
  printf 'TGZ=%s\n' "$REMOTE_TGZ"
  printf 'APP=%s\n' "$FX_REMOTE_APP"
  cat <<'REMOTE'
[ -d "$APP" ] || { echo "===COPY_FAIL=== нет каталога $APP"; exit 1; }
tar -xzf "$TGZ" -C "$APP"
echo "--- доставлено:"
tar -tzf "$TGZ"
rm -f "$TGZ"
echo "===COPY_OK==="
REMOTE
} | fx_ssh

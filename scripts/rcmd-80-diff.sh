echo "===DIFF_START==="
cd /opt/fractera/app
for f in CLAUDE.md sections/index.ts lib/content/blocks/types.ts \
         "app/[lang]/(protectedLayer)/(admin)/blocks/_data/specimen.ts" \
         "app/[lang]/(architectLayer)/_components/telegram-logs.client.tsx" \
         package.json _tools/TOOLS.json sections/taxonomy.json; do
  if [ -f "$f" ]; then printf '%s  %s\n' "$(md5sum "$f" | cut -c1-32)" "$f"; else echo "ОТСУТСТВУЕТ            $f"; fi
done
echo "--- метка сборки слота ---"
grep -E '^NEXT_PUBLIC_GIT_COMMIT' .env.local 2>/dev/null || echo "нет NEXT_PUBLIC_GIT_COMMIT"
echo "--- сколько файлов изменено против baseline ---"
git -c safe.directory=/opt/fractera/app status --porcelain | wc -l
echo "--- узел и npm ---"; node -v; npm -v
echo "--- есть ли пакеты шага 80 ---"
for p in @ai-sdk/react nanoid streamdown use-stick-to-bottom; do
  v=$(node -e "try{console.log(require('/opt/fractera/app/node_modules/$p/package.json').version)}catch(e){console.log('НЕТ')}")
  echo "  $p: $v"
done
echo "===DIFF_DONE==="

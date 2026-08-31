// СТОРОЖ СВЕЖЕСТИ КАРТЫ ИНСТРУМЕНТОВ (шаг 76-1, 2026-08-31).
//
// 🔒 ТРИ БЕДЫ, И ОНИ РАЗНЫЕ. Папка без карточки — инструмент, которого витрина не
// покажет. Карточка, обещающая несуществующий файл, — витрина, показывающая
// инструмент, которого нет. Устаревшая карта — витрина, показывающая вчерашний
// набор. Сторож обязан различать их словами: «что-то не так» лечится наугад.
//
// 🔒 ПОЧЕМУ ЭТО ВООБЩЕ СТОРОЖ. Запрет в тексте не исполняется — проверять надо
// кодом (`ANTI-PATTERNS.md`). Закон «второй список запрещён» уже был написан для
// блоков, и всё равно `CLAUDE.md` разошёлся с папкой `_tools/` на `socials-ai`:
// расхождение никого не разбудило, потому что будить было некому.

import { readFileSync, existsSync } from "node:fs"
import { collect, render, TARGET } from "./build-tools-map.mjs"

const { problems } = collect()
let failed = false

for (const p of problems) {
  console.error(`  ✗ ${p}`)
  failed = true
}

if (!existsSync(TARGET)) {
  console.error("нет _tools/TOOLS.json — карта не порождена")
  failed = true
} else if (!problems.length) {
  // 🔒 ПЕРЕВОДЫ СТРОК НОРМАЛИЗУЮТСЯ ПЕРЕД СРАВНЕНИЕМ — так же, как у
  // `check-blocks-map.mjs` и `check-config-schemas.mjs`. Два сторожа порождённых
  // файлов обязаны сравнивать одинаково: разойдись они, и один будет падать там,
  // где другой молчит, на одной и той же машине.
  const nl = t => t.replace(/\r\n/g, "\n")
  if (nl(readFileSync(TARGET, "utf8")) !== nl(render())) {
    console.error("_tools/TOOLS.json разошёлся с папкой — набор инструментов или их карточки изменились")
    failed = true
  }
}

if (failed) {
  console.error("Лечение: заполнить tool.json у каждой папки в _tools/, затем npm run build:tools-map")
  console.log("===TOOLS_MAP_FAILED===")
  process.exit(1)
}

console.log("===TOOLS_MAP_OK=== карта инструментов совпадает с папкой _tools/")

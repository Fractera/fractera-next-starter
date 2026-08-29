// Сторож свежести порождённых файлов слоя секций — `BLOCKS.md` и `SECTIONS.json`.
//
// 🔒 ПОЧЕМУ СТОРОЖ, А НЕ ПОРОЖДЕНИЕ В `prebuild`. Сборка, пишущая файлы в рабочее
// дерево, делает `git status` грязным на ровном месте и прячет настоящие правки.
// Поэтому порождение — командой, а сборка лишь проверяет, что порождённое совпадает
// с кодом. Разошлось — сборка падает и называет лечение.
//
// 🔒 ВТОРОЙ ФАЙЛ ВАЖНЕЕ ПЕРВОГО. `SECTIONS.json` читает ПАНЕЛЬ из слота: разойдись
// он с реестром — панель показывает владельцу каталог, которого в проекте больше
// нет, и делает это уверенно.

import { readFileSync, existsSync } from "node:fs"
import { render, renderCatalogue, TARGET, CATALOGUE } from "./build-blocks-map.mjs"

const files = [
  { path: TARGET, name: "sections/BLOCKS.md", expected: render },
  { path: CATALOGUE, name: "sections/SECTIONS.json", expected: renderCatalogue },
]

let failed = false
for (const f of files) {
  if (!existsSync(f.path)) {
    console.error(`нет ${f.name} — файл не порождён`)
    failed = true
    continue
  }
  // 🔒 ПЕРЕВОДЫ СТРОК НОРМАЛИЗУЮТСЯ ПЕРЕД СРАВНЕНИЕМ (найдено 2026-08-30 прогоном
  // свежего клона на Windows). Порождённый текст всегда с LF, а git на Windows
  // отдаёт рабочую копию с CRLF — и посимвольное сравнение объявляло устаревшими
  // ОБА файла сразу после чистого чекаута, при верном содержимом. В блобе лежит
  // LF, поэтому на Linux-сервере сборка проходила, и дефект был виден только у
  // того, кто клонировал проект на Windows: гейт называл верную беду ложной
  // причиной, а лечение build:blocks-map помогало до следующей операции git.
  //
  // 🔒 ТОТ ЖЕ ДЕФЕКТ И ТО ЖЕ ЛЕЧЕНИЕ УЖЕ ЕСТЬ У СОСЕДА — check-config-schemas.mjs,
  // 31-16. Два сторожа порождённых файлов обязаны сравнивать одинаково: разойдись
  // они, и один будет падать там, где другой молчит, на одной и той же машине.
  const nl = (t) => t.replace(/\r\n/g, "\n")
  if (nl(readFileSync(f.path, "utf8")) !== nl(f.expected())) {
    console.error(`${f.name} разошёлся с кодом — виды, таксономия или карточки изменились`)
    failed = true
  }
}

if (failed) {
  console.error("Лечение: npm run build:blocks-map")
  console.log("===BLOCKS_MAP_FAILED===")
  process.exit(1)
}

console.log("===BLOCKS_MAP_OK=== сводка и каталог секций совпадают с кодом")

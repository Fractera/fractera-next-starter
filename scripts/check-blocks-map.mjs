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
  if (readFileSync(f.path, "utf8") !== f.expected()) {
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

// Сторож свежести `sections/BLOCKS.md` — тот же приём, что у схем конфигов.
//
// 🔒 ПОЧЕМУ СТОРОЖ, А НЕ ПОРОЖДЕНИЕ В `prebuild`. Сборка, пишущая файлы в рабочее
// дерево, делает `git status` грязным на ровном месте и прячет настоящие правки.
// Поэтому порождение — командой, а сборка лишь проверяет, что порождённое совпадает
// с кодом. Разошлось — сборка падает и называет лечение.

import { readFileSync, existsSync } from "node:fs"
import { render, TARGET } from "./build-blocks-map.mjs"

if (!existsSync(TARGET)) {
  console.error("нет sections/BLOCKS.md — сводка видов не порождена")
  console.error("Лечение: npm run build:blocks-map")
  console.log("===BLOCKS_MAP_FAILED===")
  process.exit(1)
}

const onDisk = readFileSync(TARGET, "utf8")
if (onDisk !== render()) {
  console.error("sections/BLOCKS.md разошёлся с кодом — виды или карточки изменились")
  console.error("Лечение: npm run build:blocks-map")
  console.log("===BLOCKS_MAP_FAILED===")
  process.exit(1)
}

console.log("===BLOCKS_MAP_OK=== сводка видов совпадает с кодом")

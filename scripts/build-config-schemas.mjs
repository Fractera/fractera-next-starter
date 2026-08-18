// Порождает `<X>-CONFIG/schema.json` для всех четырёх конфигов.
//
// 🔒 СХЕМА КЛАДЁТСЯ В ПАПКУ КОНФИГА ДАННЫМИ, А НЕ КОДОМ. В папке рядом с JSON не
// должно быть ничего, что требует компилятора: два файла с разными законами жизни
// путают и человека, и агента. Тип остаётся в `config/` — это территория сборки, —
// а сюда приезжает его порождённая копия, которую можно просто прочитать.
//
// 🔒 ПОРОЖДЕНИЕ — КОМАНДОЙ, ПРОВЕРКА — ГЕЙТОМ (`check:config-schemas` в `prebuild`).
// Обратное заставило бы сборку писать файлы в рабочее дерево.

import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT, renderSchemas } from "./config-schemas.shared.mjs"

try {
  const schemas = await renderSchemas()
  for (const s of schemas) {
    writeFileSync(join(ROOT, s.target), s.text, "utf8")
    console.log(`✓ ${s.target}`)
  }
  console.log(`Записано файлов: ${schemas.length} (схема и умолчания на каждый конфиг)`)
} catch (err) {
  console.error(`Схемы не собраны: ${err.message}`)
  process.exit(2)
}

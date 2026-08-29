// Гейт: схема в папке конфига обязана совпадать с типом в `config/`.
//
// 🔒 ЗАЧЕМ ОН НУЖЕН. Порождённый файл живёт в репозитории, значит он МОЖЕТ
// устареть: поле добавили в тип, схему пересобрать забыли, и `schema.json`
// начинает описывать вчерашнюю форму. Устаревшая схема хуже отсутствующей —
// её читают и ей верят.
//
// Падает в трёх случаях: файла нет · файл отличается от порождаемого · схемы
// вообще не собираются. Лечение во всех трёх одно: `npm run build:config-schemas`.

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ROOT, renderSchemas } from "./config-schemas.shared.mjs"

let schemas
try {
  schemas = await renderSchemas()
} catch (err) {
  // 🔒 ОТСУТСТВУЮЩИЙ `esbuild` — НЕ ПОВОД УРОНИТЬ СБОРКУ НА СЕРВЕРЕ. Он лежит в
  // devDependencies, а установка на боевом может идти без них. Гейт стережёт
  // расхождение схемы с типом; превратив его ещё и в требование к окружению, мы
  // ломали бы развёртывание там, где ничего не разошлось.
  if (String(err.message).includes("esbuild")) {
    console.warn(`check:config-schemas — пропущено: ${err.message}`)
    process.exit(0)
  }
  console.error(`check:config-schemas — схемы не собираются: ${err.message}`)
  process.exit(1)
}

const stale = []
for (const s of schemas) {
  let onDisk = null
  try {
    onDisk = readFileSync(join(ROOT, s.target), "utf8")
  } catch {
    stale.push(`${s.target} — файла нет`)
    continue
  }
  // 🔒 ПЕРЕВОДЫ СТРОК НОРМАЛИЗУЮТСЯ ПЕРЕД СРАВНЕНИЕМ (найдено 31-16, 2026-08-29).
  // Порождённый текст всегда с `\n`, а на Windows git отдаёт рабочую копию с
  // `\r\n` — и посимвольное сравнение объявляло устаревшими ВСЕ восемь файлов
  // сразу после чистого чекаута. Сторож при этом называл верную беду ложной
  // причиной: «устарела» вместо «у тебя другая настройка рабочей копии», и
  // лечение (`build:config-schemas`) помогало ровно до следующей операции git.
  // Тот же дефект вчера был найден и вылечен в `build-blocks-map.mjs`.
  const nl = t => t.replace(/\r\n/g, "\n")
  if (nl(onDisk) !== nl(s.text)) stale.push(`${s.target} — устарела`)
}

if (stale.length) {
  console.error("check:config-schemas — порождённые файлы разошлись с типами:")
  for (const line of stale) console.error(`  ✗ ${line}`)
  console.error("Лечение: npm run build:config-schemas")
  process.exit(1)
}

console.log(`check:config-schemas — порождённые файлы свежие: ${schemas.length}`)

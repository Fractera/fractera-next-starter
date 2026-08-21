#!/usr/bin/env node
// check:api — у каждого маршрута есть ИМЯ, по которому его можно найти.
//
// 🔒 ЗАЧЕМ. Имя маршрута сегодня — это его адрес: `tap`, `me`, `catalogue`. На
// двадцати маршрутах так и живут; на сотне модель, которой нужен «тот, что пишет
// нажатия», перебирает папки и не находит. В навыке `use-code-shape` про имена API
// не было НИ СЛОВА (проверено 2026-08-17) — то есть правила не существовало.
//
// 🔒 ПОЧЕМУ ИМЯ В ЗАГОЛОВКЕ ФАЙЛА, А НЕ В URL (решение владельца 2026-08-17).
// URL — публичный контракт: он уезжает в браузер, в журналы, в чужие интеграции
// и в закладки. Переименование ломает всё, что на него ссылается, и делает это
// молча — ответ 404 приходит не тому, кто переименовал. Имя в заголовке меняется
// свободно и стоит ноль.
//
// 🔒 ПОЧЕМУ ГЕЙТ, А НЕ ПРОСЬБА В ДОКУМЕНТЕ. Правило, которое ничего не роняет,
// исполняется через раз: `reports/patterns/model-rule-needs-code-check.md`. Здесь
// та же логика, что у имён шагов, — и границы те же, 6–12 слов.

import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"

const ROOT = process.cwd()
const API_DIR = join(ROOT, "app", "api")
const MIN = 6
const MAX = 12

// Строка вида: // @api record every mood button press with its amount and second
const TAG = /^\s*\/\/\s*@api\s+(.+)$/m

async function routeFiles(dir, out = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) await routeFiles(full, out)
    else if (e.name === "route.ts" || e.name === "route.tsx") out.push(full)
  }
  return out
}

/** Путь файла → адрес маршрута, как его видит браузер. */
export function routeUrl(file) {
  return "/" + file
    .slice(ROOT.length + 1)
    .replace(/\\/g, "/")
    .replace(/^app\//, "")
    .replace(/\/route\.tsx?$/, "")
}

export async function collectRoutes() {
  const files = await routeFiles(API_DIR)
  const rows = []
  for (const file of files.sort()) {
    const src = await readFile(file, "utf-8")
    const m = TAG.exec(src)
    const name = m ? m[1].trim() : ""
    const words = name ? name.split(/\s+/).filter(Boolean).length : 0
    // Какие методы маршрут отдаёт — это часть его контракта и стоит рядом с
    // именем: «где писать нажатие» и «где его читать» могут жить в одном файле.
    const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
      .filter((verb) => new RegExp(`export\\s+(async\\s+)?function\\s+${verb}\\b`).test(src))
    rows.push({ file, url: routeUrl(file), name, words, methods })
  }
  return rows
}

async function main() {
  const rows = await collectRoutes()
  const problems = []

  for (const r of rows) {
    if (!r.name) {
      problems.push(`${r.url} — нет строки \`// @api …\` (${MIN}-${MAX} слов, по-английски, глагол первым)`)
      continue
    }
    if (r.words < MIN || r.words > MAX) {
      problems.push(`${r.url} — имя из ${r.words} слов, нужно ${MIN}-${MAX}: «${r.name}»`)
    }
  }

  if (!rows.length) {
    console.log("===API_OK=== маршрутов нет")
    return
  }
  if (problems.length) {
    console.error(`Маршрутов: ${rows.length}. Без имени или с неверным именем: ${problems.length}\n`)
    for (const p of problems) console.error("  " + p)
    console.error(
      "\nИмя маршрута — это то, чем его находят в проекте на сотню маршрутов."
      + "\nПример: // @api record every mood button press with its amount and second"
      + "\n===API_FAILED===",
    )
    process.exit(1)
  }
  console.log(`===API_OK=== маршрутов: ${rows.length}, у каждого имя из ${MIN}-${MAX} слов`)
}

// Файл и модуль, и команда: реестр импортирует `collectRoutes`, а `npm run
// check:api` запускает проверку.
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`
    || process.argv[1]?.endsWith("check-api.mjs")) {
  main().catch((e) => { console.error("check:api упал:", e.message); process.exit(1) })
}

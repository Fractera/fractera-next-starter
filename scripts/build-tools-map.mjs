// ПОРОЖДЕНИЕ КАРТЫ ИНСТРУМЕНТОВ `_tools/TOOLS.json` (шаг 76-1, 2026-08-31).
//
// 🔒 ПОЧЕМУ КАРТА ПОРОЖДАЕТСЯ, А НЕ ПИШЕТСЯ СПИСКОМ. Второй список расходится с
// первым молча, и это здесь уже произошло: `CLAUDE.md` говорил «Five ready
// pieces», а папок было шесть — `socials-ai` приехал позже и не был назван ни
// разу. Витрина, собранная по такому списку, показала бы пять инструментов из
// шести и выглядела бы исправной. Единственный источник правды — сама папка.
//
// 🔒 ПРАВДА ОБ ИНСТРУМЕНТЕ ЖИВЁТ РЯДОМ С НИМ. Карточка `tool.json` лежит внутри
// `_tools/<id>/`, а не в словаре страницы: описание, оторванное от кода,
// устаревает в тот день, когда инструмент правят, и устаревает молча.
//
// 🔒 СБОРКА НЕ ПИШЕТ В РАБОЧЕЕ ДЕРЕВО — тот же довод, что у карты блоков.
// Порождение идёт КОМАНДОЙ (`npm run build:tools-map`), а сборка лишь проверяет
// свежесть сторожем. Иначе `git status` грязный на ровном месте и прячет
// настоящие правки.

import { readFileSync, existsSync, readdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const TOOLS_DIR = join(ROOT, "_tools")

export const TARGET = join(TOOLS_DIR, "TOOLS.json")

/** Что инструмент обязан назвать, чтобы им можно было пользоваться. */
const NEEDS = ["browser", "https", "openai-key", "ffmpeg"]
const TEXTS = ["title", "what", "how", "value"]

/** Папки инструментов — по алфавиту, чтобы порядок не зависел от файловой системы. */
export function toolDirs() {
  if (!existsSync(TOOLS_DIR)) return []
  return readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .sort()
}

/**
 * Прочитать карточку одной папки.
 *
 * Возвращает либо инструмент, либо перечень претензий. Претензии — не
 * исключение: сторож обязан назвать ВСЕ беды разом, а не падать на первой.
 */
export function readCard(id) {
  const file = join(TOOLS_DIR, id, "tool.json")
  const problems = []

  if (!existsSync(file)) {
    return { problems: [`${id}: нет карточки tool.json`] }
  }

  let raw
  try {
    // 🔒 ПЕРЕВОДЫ СТРОК НОРМАЛИЗУЮТСЯ ДО РАЗБОРА — тот же дефект, что у соседних
    // сторожей (32-8, 31-16): на Windows git отдаёт рабочую копию с CRLF, и
    // порождённый здесь JSON отличался бы от порождённого на сервере байтом на
    // каждой строке. Сторож падал бы сразу после чистого клона, ничего не сказав
    // о настоящей причине.
    raw = JSON.parse(readFileSync(file, "utf8").replace(/\r\n/g, "\n"))
  } catch (e) {
    return { problems: [`${id}: tool.json не разбирается — ${String(e).slice(0, 120)}`] }
  }

  if (raw.id !== id) problems.push(`${id}: поле id говорит «${raw.id}», а папка называется иначе`)

  // 🔒 ВХОД ПРОВЕРЯЕТСЯ НА ДИСКЕ, А НЕ ПРИНИМАЕТСЯ НА ВЕРУ. Карточка, обещающая
  // файл, которого нет, — это витрина, показывающая инструмент, которого нет.
  if (typeof raw.entry !== "string" || !raw.entry) {
    problems.push(`${id}: не назван entry`)
  } else if (!existsSync(join(TOOLS_DIR, id, raw.entry))) {
    problems.push(`${id}: entry «${raw.entry}» не найден на диске`)
  }

  const needs = Array.isArray(raw.needs) ? raw.needs : []
  for (const n of needs) if (!NEEDS.includes(n)) problems.push(`${id}: неизвестное требование «${n}»`)

  for (const lang of ["en", "ru"]) {
    const t = raw[lang]
    if (!t || typeof t !== "object") {
      problems.push(`${id}: нет описания на «${lang}»`)
      continue
    }
    for (const k of TEXTS) {
      if (typeof t[k] !== "string" || !t[k].trim()) problems.push(`${id}: пусто ${lang}.${k}`)
    }
  }

  if (problems.length) return { problems }

  // Поля перечислены явно, а не распылением: карточка может нести что угодно
  // сверх договора, и в карту обязано попасть ровно оговорённое.
  return {
    tool: {
      id,
      entry: raw.entry,
      dir: `_tools/${id}`,
      needs,
      npmDeps: Array.isArray(raw.npmDeps) ? raw.npmDeps : [],
      usedBy: Array.isArray(raw.usedBy) ? raw.usedBy : [],
      en: { title: raw.en.title, what: raw.en.what, how: raw.en.how, value: raw.en.value },
      ru: { title: raw.ru.title, what: raw.ru.what, how: raw.ru.how, value: raw.ru.value },
    },
  }
}

/** Все инструменты и все претензии разом. */
export function collect() {
  const tools = []
  const problems = []
  for (const id of toolDirs()) {
    const r = readCard(id)
    if (r.problems) problems.push(...r.problems)
    else tools.push(r.tool)
  }
  return { tools, problems }
}

/** Текст порождённого файла — всегда с LF и с переводом строки в конце. */
export function render() {
  const { tools } = collect()
  return JSON.stringify({ tools }, null, 2) + "\n"
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("build-tools-map.mjs")) {
  const { tools, problems } = collect()
  if (problems.length) {
    for (const p of problems) console.error(`  ✗ ${p}`)
    console.error("Карта не порождена: сначала почините карточки.")
    process.exit(1)
  }
  writeFileSync(TARGET, render(), "utf8")
  console.log(`✓ _tools/TOOLS.json — инструментов: ${tools.length}`)
}

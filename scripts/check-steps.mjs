// check-steps — сторож дисциплины шагов разработки.
//
// 🔒 ЧТО ИМЕННО ОН ЛОВИТ. Один класс дефекта: работа, которую ведут МИМО пяти
// адресов памяти. Чаще всего это самодельная папка учёта, заведённая рядом —
// `Migration/`, `tasks/`, `plans/`, `steps/` с markdown внутри. Она выглядит как
// порядок и им не является: следующая сессия читает пять адресов и не находит
// там ничего, потому что состояние ушло в место, о котором она не знает.
//
// ✗ ЧЕМ ОПЛАЧЕН. 2026-08-24: агент на удалённой машине завёл `Migration/` с
// имитацией шагов и сделал это криво; передача сессии не состоялась. Причина
// была не в непослушании — дефолтный режим `classic` умалчивал об учёте, а
// навык дисциплины объявлял себя необязательным. Обе дыры закрыты словами;
// этот сторож закрывает третью — тем, что дефект больше не проходит молча.
//
// 🔒 ЗАЧЕМ СТОРОЖ, ЕСЛИ ЕСТЬ ЗАКОН В ИНСТРУКЦИИ. Закон читает тот, кто открыл
// инструкцию. Восемнадцать соседних гейтов проверяют двери, секции, языки и
// контраст — а единственная дисциплина, на которой держится ПАМЯТЬ проекта, до
// сих пор держалась на одной прозе.
//
// Проверка намеренно узкая: она не судит о содержании шагов и не требует, чтобы
// шаг был заведён. Она ловит ровно две вещи — параллельный учёт и рассыпанную
// структуру самих пяти адресов. Сторож, кричащий на законный код, отключают
// целиком в тот же день, и тогда он не ловит вообще ничего.

import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const STEPS = path.join(ROOT, "development-docs", "development-steps")
const NEW = path.join(STEPS, "new-steps")
const DONE = path.join(STEPS, "completed-steps")
const CURRENT = path.join(STEPS, "current-steps.md")
const PASSPORT = path.join(ROOT, "development-docs", "PASSPORT.md")

// Имена, которыми агенты заводят параллельный учёт. Ищем только в корне проекта
// и в development-docs/: глубже это почти всегда чужой домен (например
// `app/[lang]/migration/` — законная страница).
const RIVAL_NAMES = new Set(["migration", "migrations", "tasks", "plans", "steps", "todo", "todos", "roadmap"])
const SCAN_ROOTS = [ROOT, path.join(ROOT, "development-docs")]

const findings = []
const warnings = []

function hasMarkdown(dir) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return false }
  return entries.some((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
}

// 1. Параллельный учёт рядом с пятью адресами.
for (const root of SCAN_ROOTS) {
  let entries
  try { entries = fs.readdirSync(root, { withFileTypes: true }) } catch { continue }
  for (const e of entries) {
    if (!e.isDirectory()) continue
    if (!RIVAL_NAMES.has(e.name.toLowerCase())) continue
    const dir = path.join(root, e.name)
    if (hasMarkdown(dir)) {
      findings.push({ kind: "rival", rel: path.relative(ROOT, dir).replace(/\\/g, "/") })
    }
  }
}

// 2. Целостность самих пяти адресов.
//
// 🔒 Паспорт (пятый адрес) проверяется ПРЕДУПРЕЖДЕНИЕМ, а не отказом, и это
// решение, а не небрежность: проекты, полученные до 2026-08-25, приехали без
// него, и роняющий сборку сторож наказал бы их за нашу правку шаблона. Отсутствие
// названо громко, но сборку не останавливает.
if (!fs.existsSync(PASSPORT)) {
  warnings.push("development-docs/PASSPORT.md — пятого адреса памяти нет на месте")
}

if (!fs.existsSync(STEPS)) {
  findings.push({ kind: "missing", rel: "development-docs/development-steps" })
} else {
  if (!fs.existsSync(CURRENT)) findings.push({ kind: "missing", rel: "development-docs/development-steps/current-steps.md" })
  for (const [dir, rel] of [[NEW, "new-steps"], [DONE, "completed-steps"]]) {
    if (!fs.existsSync(dir)) findings.push({ kind: "missing", rel: `development-docs/development-steps/${rel}` })
  }
}

// 3. Имя плана — указатель: <номер>-<описание из 6-8 слов>.
if (fs.existsSync(NEW)) {
  for (const name of fs.readdirSync(NEW)) {
    if (!name.endsWith(".md") || name === "README.md") continue
    const m = name.match(/^(\d+)-([a-z0-9-]+)\.md$/)
    if (!m) { findings.push({ kind: "planname", rel: `new-steps/${name}` }); continue }
    const words = m[2].split("-").filter(Boolean).length
    if (words < 4) findings.push({ kind: "planwords", rel: `new-steps/${name}`, words })
  }
}

// 4. План и итог одновременно не существуют: закрытый шаг забирает свой план.
if (fs.existsSync(NEW) && fs.existsSync(DONE)) {
  const closed = new Set()
  for (const name of fs.readdirSync(DONE)) {
    const m = name.match(/^(\d+)-main\.md$/)
    if (m) closed.add(m[1])
  }
  for (const name of fs.readdirSync(NEW)) {
    const m = name.match(/^(\d+)-/)
    if (m && closed.has(m[1])) findings.push({ kind: "both", rel: `new-steps/${name}`, step: m[1] })
  }
}

console.log("check-steps — дисциплина шагов разработки")

for (const w of warnings) console.log(`  ⚠️  ${w}`)

if (findings.length === 0) {
  console.log("  ✓ параллельного учёта рядом с пятью адресами нет")
  console.log("  ✓ структура памяти на месте: current-steps.md, new-steps/, completed-steps/")
  if (warnings.length) {
    console.log("\n  Паспорт — то, что отвечает «что это за проект». Заведите его по образцу")
    console.log("  из шаблона: development-docs/PASSPORT.md. → CLAUDE.md § Your memory")
  }
  console.log("\n===STEPS_OK===")
  process.exit(0)
}

console.log("  БЕДА: работа ведётся мимо памяти проекта\n")
for (const f of findings) {
  if (f.kind === "rival") console.log(`    ${f.rel} — параллельная система учёта рядом с пятью адресами`)
  if (f.kind === "missing") console.log(`    ${f.rel} — адреса памяти нет на месте`)
  if (f.kind === "planname") console.log(`    ${f.rel} — имя плана не читается как указатель: нужно <номер>-<описание-через-дефис>.md`)
  if (f.kind === "planwords") console.log(`    ${f.rel} — в имени ${f.words} слов(а), нужно 6–8: список папки обязан читаться без открытия файлов`)
  if (f.kind === "both") console.log(`    ${f.rel} — шаг ${f.step} закрыт (${f.step}-main.md), но его план всё ещё в new-steps/`)
}
console.log(`
  Память этого проекта живёт по пяти адресам, и других не бывает:

    development-docs/PASSPORT.md                          что это за ПРОЕКТ
    development-docs/development-steps/current-steps.md   где работа СЕЙЧАС
    development-docs/development-steps/new-steps/         планы
    development-docs/development-steps/completed-steps/   итоги
    development-docs/reports/                             разборы и репорты фич

  Своя папка учёта выглядит порядком и им не является: следующая сессия читает
  эти пять адресов и не находит там ничего. Не хватает чего-то в них — скажите
  об этом владельцу, а не заводите шестой адрес.

  Свобода выбирать метод касается того, КАК вы строите, и никогда — ведётся ли
  работа шагом и записано ли состояние. → навык use-development-steps
`)
console.log("===STEPS_FAILED===")
process.exit(1)

// check:protected — сторож слоя за авторизацией (шаг 508).
//
// 🔒 ЗАЧЕМ. У публичного слоя девять проверок; у приватного не было НИ ОДНОЙ.
// `check:content` пропускает его намеренно — там законны и клиентский островок, и
// динамический сегмент, — но из «эти правила сюда не применимы» не следует «сюда
// не применимы никакие». Законы у слоя свои, и до сих пор они жили только прозой
// в `CLAUDE.md`, то есть исполнялись, пока о них помнят.
//
// Проверяется ПЯТЬ вещей, и каждая — либо прямой закон инструкции, либо дефект,
// который в этом проекте уже случался на публичной половине и здесь обойдётся
// дороже: там ошибка стоит позиции в выдаче, здесь — чужих данных на экране.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const ROOT = process.cwd()
const LAYER = join(ROOT, "app", "[lang]", "(protectedLayer)")
const GROUPS = ["(account)", "(admin)", "(finance)", "(staff)"]

const problems = []
const fail = (file, rule, detail) => problems.push({ file: relative(ROOT, file), rule, detail })

const read = p => { try { return readFileSync(p, "utf8") } catch { return "" } }

/**
 * Убрать комментарии: сторож судит код, а не объяснения к нему.
 *
 * 🔒 СТРОЧНЫЕ СНИМАЮТСЯ ПЕРВЫМИ, И ПОРЯДОК — ВЕСЬ СМЫСЛ (найдено 2026-08-14).
 * Обратный порядок ОСЛЕПЛЯЛ проверку: в строчном комментарии встречается
 * `/api/` со звёздочкой, эта пара открывает блочный комментарий, и снятие
 * съедает НАСТОЯЩИЙ КОД до ближайшего закрытия. Сторож при этом молчит и
 * выглядит зелёным — то есть ведёт себя как отсутствующий, но не выглядит
 * таковым. Поймано на живом правиле: макет с `cookies()` не срабатывал,
 * потому что строкой выше стояло упоминание маршрутов API.
 */
function stripComments(text) {
  return text.replace(/^[ \t]*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(p)) out.push(p)
  }
  return out
}

if (!existsSync(LAYER)) {
  console.log("===PROTECTED_OK=== слоя за авторизацией нет — проверять нечего")
  process.exit(0)
}

const files = walk(LAYER)

// ── 1. Слой не индексируется ────────────────────────────────────────────────
// Страница за авторизацией, попавшая в выдачу, обещает поисковику адрес, где
// его встретит форма входа: краулинг потрачен, отчёт заполнен ошибками вместо
// страниц. Объявляется ОДИН раз на слой — на каждой странице по отдельности
// забыли бы на первой же новой.
const layerLayout = read(join(LAYER, "layout.tsx"))
if (!/robots:\s*\{[^}]*index:\s*false/.test(layerLayout)) {
  fail(join(LAYER, "layout.tsx"), "layer-indexable", "макет слоя не объявляет `robots: { index: false }` — страница за авторизацией попадёт в выдачу и встретит поисковик формой входа")
}

// ── 2. Макет не читает сессию ───────────────────────────────────────────────
// `auth()` / `cookies()` / `headers()` в макете делают динамическим ВЕСЬ слой
// одной строкой: пропадает предрендеренная оболочка, и пустое состояние страницы
// начинает считаться на каждый запрос. Спрашивает островок после гидратации, а
// настоящая проверка живёт в `/api/*`, которые отдают данные.
const SESSION_IN_LAYOUT = /\b(auth|cookies|headers)\s*\(\s*\)/
for (const f of files.filter(p => p.endsWith(`${sep}layout.tsx`))) {
  const hit = stripComments(read(f)).match(SESSION_IN_LAYOUT)
  if (hit) fail(f, "layout-reads-session", `${hit[0]} в макете — одна строка делает динамическим весь слой; спрашивает островок, решает /api/*`)
}

// ── 3. Каждая группа прав закрыта дверью ────────────────────────────────────
// Роли перечислены в `lib/roles.ts`, а дверь ставится макетом подгруппы. Группа
// без двери выглядит работающей ровно до первого гостя.
for (const g of GROUPS) {
  const p = join(LAYER, g, "layout.tsx")
  if (!existsSync(p)) { fail(join(LAYER, g), "group-without-layout", "у группы прав нет макета — ставить дверь негде"); continue }
  if (!/AccessGate/.test(read(p))) {
    fail(p, "group-without-gate", "макет группы прав не ставит `AccessGate` — страницы группы открыты всем")
  }
}

// ── 4. Группа не импортирует у соседней группы ──────────────────────────────
// Один и тот же предмет живёт в нескольких группах: персонал правит карточку
// целиком, бухгалтерия — только цену. Общее поднимается к ОБЩЕМУ предку
// (`_components`, `_lib`, `_data` слоя или `lib/<сущность>/`), а не берётся у
// той группы, которую построили первой. Это уже случалось: тип товара родился
// внутри `(staff)`, и публичная витрина импортировала из слоя прав.
for (const g of GROUPS) {
  for (const f of walk(join(LAYER, g))) {
    const src = stripComments(read(f))
    for (const other of GROUPS.filter(x => x !== g)) {
      if (src.includes(`${other}/`)) {
        fail(f, "cross-group-import", `тянет из ${other} — общее поднимается к общему предку, а не берётся у соседа`)
      }
    }
  }
}

// ── 5. Тонкий маршрут ───────────────────────────────────────────────────────
// Тот же закон, что у публичных страниц: `page.tsx` объявляет значения сегмента
// и отдаёт язык входу. Логика, заехавшая в файл маршрута, не переиспользуется и
// не проверяется — её просто не видно.
for (const f of files.filter(p => p.endsWith(`${sep}page.tsx`))) {
  const body = read(f).split("\n").filter(l => l.trim() && !l.trim().startsWith("//") && !l.trim().startsWith("*") && !l.trim().startsWith("/*"))
  if (body.length > 14) {
    fail(f, "route-not-thin", `${body.length} строк — маршрут объявляет сегмент и зовёт вход из ./_components, остальное живёт там`)
  }
}

if (problems.length === 0) {
  console.log(`===PROTECTED_OK=== групп прав: ${GROUPS.length}, файлов слоя: ${files.length}; индексация закрыта, двери на месте, групп-заимствований нет`)
  process.exit(0)
}

console.error(`===PROTECTED_FAILED=== нарушений: ${problems.length}\n`)
for (const p of problems) console.error(`  ${p.rule.padEnd(20)} ${p.file}\n${" ".repeat(23)}${p.detail}`)
console.error("\nЗаконы слоя — CLAUDE.md, раздел о двух моделях страницы.")
process.exit(1)

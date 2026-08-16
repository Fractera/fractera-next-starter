// check:layout — сторож ЛЕНТЫ СТРАНИЦЫ.
//
// 🔒 ЧТО ОН ЛОВИТ И ПОЧЕМУ ЭТОГО НЕ ЛОВИЛО НИЧТО (2026-08-16, нашёл владелец).
// Переключатель ширины в подвале двигает РОВНО ОДИН контейнер — тот, что помечен
// `data-app-column` (правило в `styles/globals.css`). Метку носила одна оболочка
// из десяти: шаблон материала. Остальные девять — каталог товаров, карточка
// товара, список блога, четыре рабочих экрана прав, каталог секций — писали
// предел ширины числом (`max-w-7xl`), и кнопка на них молча не делала НИЧЕГО.
//
// Дефект ровно того сорта, который человек находит раньше машины: страницы
// открываются, выглядят прилично, ширина у них даже совпадает с лентой — просто
// кнопка не работает. Ни типы, ни сборка, ни один прежний гейт про это не знают.
//
// Две проверки, и обе — по факту, а не по обещанию:
//   1. У КАЖДОЙ страницы под `app/[lang]` есть лента. Оболочка со своим `<main>`
//      обязана содержать `data-app-column` — иначе переключатель её не видит.
//   2. ПРЕДЕЛ ШИРИНЫ НЕ ПИШЕТСЯ ЧИСЛОМ. `max-w-7xl` — это 1280px, то же самое,
//      что стоит в `--app-w` по умолчанию: страница выглядит правильной и не
//      слушается. Ширину задаёт метка, а размер живёт в одной переменной.
//
// 🔒 ИСКЛЮЧЕНИЯ ПЕРЕЧИСЛЕНЫ ПОИМЁННО И С ПРИЧИНОЙ. Сторож, кричащий на законный
// код, отключают целиком в тот же день, и тогда он не ловит уже ничего.

import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const LANG_DIR = path.join(ROOT, "app", "[lang]")
const MARKER = "data-app-column"

// Страницы, у которых ленты нет и быть не должно: содержимое центрируется по
// экрану, предела ширины у них нет вовсе, двигать нечего.
const NO_COLUMN = new Set(
  [
    "(protectedLayer)/(staff)/manage/products/error.tsx",
    "(protectedLayer)/(staff)/manage/products/not-found.tsx",
    "(protectedLayer)/(staff)/manage/products/[productId]/not-found.tsx",
    "error.tsx",
    "not-found.tsx",
  ].map(p => p.split("/").join(path.sep)),
)

// Мебель страницы: шапка, подвал, полоса согласия. Ширина у них своя и
// переключателю не подчиняется — так записано в самом переключателе.
const CHROME = [
  path.join("components", "menu"),
  path.join("app", "[lang]", "_components", "cookie-banner"),
]

const problems = []
const fail = (rule, detail) => problems.push({ rule, detail })

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(p)) out.push(p)
  }
  return out
}

const rel = f => path.relative(ROOT, f)

// ── 1. У страницы со своим `<main>` есть лента ──────────────────────────────
//
// Ищем именно `<main`: это и есть признак «файл рисует страницу целиком».
// Компонент внутри страницы `<main>` не открывает и под правило не подпадает.
for (const file of walk(LANG_DIR)) {
  const src = fs.readFileSync(file, "utf8")
  if (!/<main[\s>]/.test(src)) continue

  const key = path.relative(LANG_DIR, file)
  if (NO_COLUMN.has(key)) continue

  if (!src.includes(MARKER)) {
    fail(
      "page-without-column",
      `${rel(file)}: страница рисует свой <main>, но ленты нет — переключатель ширины в подвале на ней не делает ничего`,
    )
  }
}

// ── 2. Предел ширины не пишется числом ──────────────────────────────────────
const HARD_WIDTH = /\bmax-w-7xl\b/
for (const dir of [path.join(ROOT, "app"), path.join(ROOT, "components")]) {
  for (const file of walk(dir)) {
    const r = rel(file)
    if (CHROME.some(c => r.startsWith(c))) continue
    const src = fs.readFileSync(file, "utf8")
    if (HARD_WIDTH.test(src)) {
      fail(
        "hardcoded-page-width",
        `${r}: «max-w-7xl» — предел ленты записан числом. Он равен значению по умолчанию, поэтому страница выглядит правильной и НЕ слушается переключателя. Ставьте метку ${MARKER}`,
      )
    }
  }
}

if (problems.length === 0) {
  console.log(`===LAYOUT_OK=== лента есть у каждой страницы; предел ширины нигде не записан числом`)
  process.exit(0)
}

console.error(`===LAYOUT_FAILED=== нарушений: ${problems.length}\n`)
for (const p of problems) console.error(`  ${p.rule.padEnd(22)} ${p.detail}`)
console.error("\nЗакон ленты — styles/globals.css, раздел «ШИРИНА ЛЕНТЫ СТРАНИЦЫ»")
process.exit(1)

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
const LANG_DIR = path.join(ROOT, "app", "[lang]", "(designLayer)")
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

// 🔒 СТОРОЖ ЧИТАЕТ КОД, А НЕ КОММЕНТАРИИ. Правило, объяснённое в файле словами
// («здесь стоял свой `<main>`»), — это текст ОБ оболочке, а не оболочка. Пока
// комментарии не отброшены, сторож наказывает ровно за то объяснение, которое
// сам же и потребовал написать, и его отключают целиком.
function code(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")   // блочные, включая JSX {/* … */}
    .split("\n")
    .filter(line => !/^\s*\/\//.test(line))
    .join("\n")
}

// ── 1. У страницы со своим `<main>` есть лента ──────────────────────────────
//
// Ищем именно `<main`: это и есть признак «файл рисует страницу целиком».
// Компонент внутри страницы `<main>` не открывает и под правило не подпадает.
for (const file of walk(LANG_DIR)) {
  const src = code(fs.readFileSync(file, "utf8"))
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

// ── 1а. Публичная страница не открывает СВОЮ оболочку ───────────────────────
//
// 🔒 ЧТО ЭТО ЛОВИТ (2026-08-19, нашёл владелец: «блог выпадает из общей
// концепции дизайна»). Метка ленты у списка блога БЫЛА — правило 1 проходило, —
// но `<main>`, воздух ленты и её внутренний ритм страница писала сама. На момент
// правки на четырёх публичных страницах стояло три разных воздуха и два разных
// тега ленты. Глаз читает это как «другая оболочка», а ни один гейт не видел
// ничего: каждая страница по отдельности была правильной.
//
// Поэтому оболочку теперь открывает ровно один компонент — `PageShell`, — а
// страница решает только то, что внутри.
const SHELL = path.join("components", "content-page", "page-shell.tsx")
const PUBLIC_DIRS = [
  path.join(LANG_DIR, "(publicLayer)"),
  path.join(ROOT, "components", "content-page"),
]

for (const dir of PUBLIC_DIRS) {
  for (const file of walk(dir)) {
    const r = rel(file)
    if (r === SHELL) continue
    const src = code(fs.readFileSync(file, "utf8"))
    if (!/<main[\s>]/.test(src)) continue
    fail(
      "own-page-shell",
      `${r}: страница открывает свой <main>. Оболочка публичной страницы одна — components/content-page/page-shell.tsx (PageShell): свой <main> означает свой воздух и свой ритм, а расходятся они молча`,
    )
  }
}

// ── 1б. Крошки не начинаются с корня сайта ──────────────────────────────────
//
// 🔒 КОРЕНЬ ПЕЧАТАЕТ САМ КОМПОНЕНТ КРОШЕК (`components/nav/breadcrumbs.server.tsx`,
// первая крошка = имя сайта из настроек). Страница, вписавшая его ещё раз,
// показывала «Fractera / Fractera / Блог» и объявляла в разметке `BreadcrumbList`
// два одинаковых первых пункта — поисковику это видно так же хорошо, как человеку.
// На момент правки так было у ОБОИХ постов блога и у всех четырёх страниц подвала.
const DOUBLE_ROOT = /breadcrumbs:\s*\[\s*\{\s*label:\s*(brand\(\)\.name|metaForLang\([^)]*\)\.siteName)/
for (const dir of [path.join(ROOT, "app"), path.join(ROOT, "components")]) {
  for (const file of walk(dir)) {
    const src = code(fs.readFileSync(file, "utf8"))
    if (!DOUBLE_ROOT.test(src)) continue
    fail(
      "breadcrumb-root-twice",
      `${rel(file)}: путь начинается с имени сайта, а его уже печатает компонент крошек — получается «Сайт / Сайт / Страница» и две одинаковые записи в BreadcrumbList`,
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

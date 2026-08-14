// check:sections — сторож слоя секций (шаг 508; вырос из `check:blocks`).
//
// 🔒 ЗАЧЕМ. Секции — единственное место, где живёт вёрстка материала, и правки
// туда вносит агент, который видит один файл, а не страницу целиком. Три
// правила, и каждое — уже оплаченный дефект.
//
// 1. У КАЖДОГО ВИДА КАТАЛОГА ЕСТЬ ОБРАЗЕЦ. Пять видов из шестнадцати не
//    рисовались нигде и никогда — в одном из них так и лежал дефект контраста.
//    Вид, который негде посмотреть, не «неиспользуемый», а НЕПРОВЕРЕННЫЙ.
//
// 2. НА СПЛОШНОЙ ЗАЛИВКЕ — ПАРНЫЙ ЦВЕТ. `bg-primary` ходит с
//    `text-primary-foreground`. Пара `bg-primary` + `text-foreground` читается
//    только в одной теме из двух, и в какой именно — зависит от палитры проекта,
//    то есть автор своей ошибки не увидит.
//
// 3. ВНУТРИ СЕКЦИИ — ТОЛЬКО ТОКЕНЫ ТЕМЫ. Абсолютный цвет не меняется со
//    сменой темы по определению: так блог оставался чёрным под светлой темой.
//    Возвращается это первым делом: рисовать абсолютным цветом — привычка
//    любого, кто пришёл из обычной вёрстки.
//

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const TYPES = join(ROOT, "lib", "content", "blocks", "types.ts")
const SPECIMEN = join(ROOT, "app", "[lang]", "(protectedLayer)", "(admin)", "blocks", "_data", "specimen.ts")
const SECTIONS = join(ROOT, "sections")
/** Шаблон страницы рисует хром вокруг блоков — правило пары действует и там. */
const PAGE_SHELL = join(ROOT, "components", "content-page", "standard-content-page.tsx")

const problems = []
const fail = (rule, detail) => problems.push({ rule, detail })

function read(path) {
  try {
    return readFileSync(path, "utf8")
  } catch {
    fail("file-missing", `нет файла ${path.replace(ROOT, ".")}`)
    return ""
  }
}

/** Все файлы дерева с указанными расширениями. */
function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(p)) out.push(p)
  }
  return out
}

/** Значения `className` файла — и в кавычках, и в шаблонной строке. */
function classNames(src) {
  return [...src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g)]
    .map(m => (m[1] ?? m[2] ?? m[3] ?? "").replace(/\s+/g, " ").trim())
}

/** Убрать комментарии: сторож судит код, а не объяснения к нему. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "")
}

// ── 1. Каждый вид каталога имеет образец ────────────────────────────────────
const kinds = [...new Set([...read(TYPES).matchAll(/kind:\s*'([a-z0-9]+)'/g)].map(m => m[1]))]
const inSpecimen = new Set([...read(SPECIMEN).matchAll(/kind:\s*'([a-z0-9]+)'/g)].map(m => m[1]))
for (const kind of kinds) {
  if (!inSpecimen.has(kind)) {
    fail("kind-not-rendered", `'${kind}' объявлен в каталоге, но образца нет — вид не рисуется нигде, значит не проверен ничем`)
  }
}

// ── 2. Текст на сплошной заливке — только парным цветом ─────────────────────
// `bg-primary/10` и подобные — ПОДЛОЖКА, на ней стоит обычный текст, и это
// правильно. Ловим только сплошной фон: `bg-primary` без дроби.
const SOLID_FILL = /\bbg-primary(?![\/-])/
for (const file of [...walk(SECTIONS), PAGE_SHELL]) {
  for (const cls of classNames(read(file))) {
    if (!SOLID_FILL.test(cls)) continue
    if (/\btext-[a-z]/.test(cls) && !/\btext-primary-foreground\b/.test(cls)) {
      fail("fill-without-pair", `${file.replace(ROOT, ".")}: «${cls.slice(0, 80)}…» — на заливке bg-primary текст обязан быть text-primary-foreground`)
    }
  }
}

// ── 3. Внутри секции — только токены темы ──────────────────────────────────
const ABSOLUTE_COLOUR = /\b(?:bg|text|border|from|to|via)-(?:black|white|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})\b/
// 🔒 ЦВЕТ ПРЯЧЕТСЯ НЕ ТОЛЬКО В КЛАССАХ (шаг 508). Первая версия правила смотрела
// один `className` — и пропустила фиолетовый градиент, записанный прямо в
// `style` цитаты владельца, и такую же обводку заголовка в шаблоне страницы.
// Инлайн-стиль сильнее любого класса, поэтому переключатель темы на него не
// влияет вовсе: это худшее место для абсолютного цвета, а не безобидное.
const INLINE_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\s*\(/
for (const file of walk(SECTIONS)) {
  const src = stripComments(read(file))
  for (const cls of classNames(src)) {
    const hit = cls.match(ABSOLUTE_COLOUR)
    if (hit) {
      fail("absolute-colour", `${file.replace(ROOT, ".")}: «${hit[0]}» — цвет секции берётся токеном темы, иначе секция не меняется вместе с темой`)
    }
  }
  const inlineHit = src.match(INLINE_COLOUR)
  if (inlineHit) {
    fail("absolute-colour", `${file.replace(ROOT, ".")}: «${inlineHit[0]}» в стилях — инлайн-стиль сильнее класса, тему он не слышит совсем`)
  }
}

if (problems.length === 0) {
  const files = walk(SECTIONS).filter(f => f.includes("blocks")).length
  console.log(`===SECTIONS_OK=== видов: ${kinds.length}, рендереров: ${files}, у каждого есть образец; цвета и пары — нарушений нет`)
  process.exit(0)
}

console.error(`===SECTIONS_FAILED=== нарушений: ${problems.length}\n`)
for (const p of problems) console.error(`  ${p.rule.padEnd(20)} ${p.detail}`)
console.error("\nЗаконы слоя — SECTIONS.md")
process.exit(1)

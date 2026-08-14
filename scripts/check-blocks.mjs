// check:blocks — сторож каталога секций.
//
// 🔒 ЗАЧЕМ. Пять видов секций из пятнадцати (`table`, `docref`, `callout`,
// `columns`, `group`) не были использованы ни в одном материале, то есть их код
// не рисовался НИ РАЗУ. В одном из них так и лежал дефект: у кнопки `docref`
// текст был цвета страницы на заливке `primary` — тёмный на тёмном в светлой
// теме, — хотя в соседней кнопке `cta` это вылечили днём раньше. Вид секции,
// который негде посмотреть, — не «неиспользуемый код», а НЕПРОВЕРЕННЫЙ.
//
// Проверяются две вещи, обе по факту:
//   1. У КАЖДОГО вида каталога есть образец на странице каталога секций.
//   2. Ни один сплошной фон `bg-primary` не несёт текст цвета страницы.
//
// Второе правило — это ровно тот дефект, ради которого сторож и написан:
// переменные ходят парой, фон `primary` и текст на нём `primary-foreground`.
// Пара `bg-primary` + `text-foreground` читается только в одной теме из двух, а
// какой именно — зависит от палитры проекта, то есть ошибка невидима автору.

import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const TYPES = join(ROOT, "lib", "content", "blocks", "types.ts")
const SPECIMEN = join(ROOT, "app", "[lang]", "(protectedLayer)", "(admin)", "blocks", "_data", "specimen.ts")
// Файлы, которые рисуют блоки: и реестр, и шаблон страницы вокруг него.
const RENDERERS = [
  join(ROOT, "lib", "content", "blocks", "registry.tsx"),
  join(ROOT, "components", "content-page", "standard-content-page.tsx"),
]

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

// ── 1. Каждый вид каталога имеет образец ────────────────────────────────────
const kindsInCatalogue = [...new Set([...read(TYPES).matchAll(/kind:\s*'([a-z0-9]+)'/g)].map(m => m[1]))]
const specimenSrc = read(SPECIMEN)
const kindsInSpecimen = new Set([...specimenSrc.matchAll(/kind:\s*'([a-z0-9]+)'/g)].map(m => m[1]))

for (const kind of kindsInCatalogue) {
  if (!kindsInSpecimen.has(kind)) {
    fail("kind-not-rendered", `'${kind}' объявлен в каталоге, но образца нет — вид не рисуется нигде, значит не проверен ничем`)
  }
}

// ── 2. Текст на сплошной заливке — только парным цветом ─────────────────────
// `bg-primary/10` и подобные — это ПОДЛОЖКА, на ней стоит обычный текст, и это
// правильно. Ловим только сплошной фон: `bg-primary` без дроби.
const SOLID_FILL = /\bbg-primary(?![\/-])/
for (const file of RENDERERS) {
  const src = read(file)
  for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g)) {
    const cls = m[1] ?? m[2] ?? m[3] ?? ""
    if (!SOLID_FILL.test(cls)) continue
    const hasText = /\btext-[a-z]/.test(cls)
    if (hasText && !/\btext-primary-foreground\b/.test(cls)) {
      const shown = cls.replace(/\s+/g, " ").slice(0, 90)
      fail("fill-without-pair", `${file.replace(ROOT, ".")}: «${shown}…» — на заливке bg-primary текст обязан быть text-primary-foreground`)
    }
  }
}

if (problems.length === 0) {
  console.log(`===BLOCKS_OK=== видов в каталоге: ${kindsInCatalogue.length}, у каждого есть образец; пар «фон + текст» — нарушений нет`)
  process.exit(0)
}

console.error(`===BLOCKS_FAILED=== нарушений: ${problems.length}\n`)
for (const p of problems) console.error(`  ${p.rule.padEnd(18)} ${p.detail}`)
console.error("\nОбразцы живут в app/[lang]/(protectedLayer)/(admin)/blocks/_data/specimen.ts")
process.exit(1)

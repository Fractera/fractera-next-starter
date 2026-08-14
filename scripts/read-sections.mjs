// read:sections — что умеет дизайн против того, что нужно содержимому.
//
// 🔒 ЭТО ОТЧЁТ, А НЕ ГЕЙТ, И ЭТО РЕШЕНИЕ, А НЕ УСТУПКА. Дизайн не обязан
// покрывать все виды секций: у одного есть карточка с картинкой, у другого нет.
// Такое расхождение — РАБОТА, которую кто-то должен сделать (дописать секцию или
// переписать материал под то, что дизайн умеет), а не поломка, из-за которой
// нельзя собрать проект. Уронить сборку здесь значило бы запретить пользователю
// начать свой дизайн, пока он не написал все шестнадцать видов.
//
// Три списка, и каждый отвечает на свой вопрос:
//   покрыто     — вид есть и у дизайна, и в содержимом: работает;
//   НЕ ПОКРЫТО  — вид есть в содержимом, а в дизайне его нет: ЗАДАЧА;
//   лишнее      — дизайн умеет то, чего в содержимом нет: подсказка, не ошибка.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs"
import { join } from "node:path"

const ROOT = process.cwd()
const SECTIONS = join(ROOT, "sections")
const APP = join(ROOT, "app", "[lang]")

/** Виды, объявленные каталогом платформы. */
function catalogueKinds() {
  const src = readFileSync(join(ROOT, "lib", "content", "blocks", "types.ts"), "utf8")
  return [...new Set([...src.matchAll(/kind:\s*'([a-z0-9]+)'/g)].map(m => m[1]))]
}

/** Виды, которые дизайн рисует сам: считаются из набора, а не из обещания. */
function designCovers(design) {
  const dir = join(SECTIONS, design, "blocks")
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => f.endsWith(".server.tsx"))
    .map(f => f.replace(".server.tsx", ""))
    .sort()
}

/** Наследует ли дизайн недостающее у набора по умолчанию. */
function designInherits(design) {
  const idx = join(SECTIONS, design, "index.ts")
  if (!existsSync(idx)) return false
  return /manifestOf\([^)]*,\s*true\s*\)/.test(readFileSync(idx, "utf8"))
}

/** Виды, которые ДЕЙСТВИТЕЛЬНО встречаются в материалах проекта. */
function kindsInContent() {
  const used = new Set()
  const walk = dir => {
    if (!existsSync(dir)) return
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.tsx?$/.test(p) && p.includes("_data")) {
        for (const m of readFileSync(p, "utf8").matchAll(/kind:\s*'([a-z0-9]+)'/g)) used.add(m[1])
      }
    }
  }
  walk(APP)
  return [...used].sort()
}

const kinds = catalogueKinds()
const content = kindsInContent()
const designs = existsSync(SECTIONS)
  ? readdirSync(SECTIONS).filter(n => statSync(join(SECTIONS, n)).isDirectory())
  : []

console.log(`Каталог платформы: ${kinds.length} видов`)
console.log(`Материалы проекта используют: ${content.length} — ${content.join(", ")}`)
console.log("")

for (const design of designs) {
  const covers = designCovers(design)
  const inherits = designInherits(design)
  const missing = content.filter(k => !covers.includes(k))
  const extra = covers.filter(k => !content.includes(k))

  console.log(`── дизайн «${design}» ${inherits ? "(наследует недостающее у набора по умолчанию)" : ""}`)
  console.log(`   покрыто: ${covers.length} из ${kinds.length}`)
  if (missing.length === 0) {
    console.log(`   НЕ ПОКРЫТО: нет — дизайн рисует всё, что встречается в материалах`)
  } else {
    console.log(`   НЕ ПОКРЫТО (задача): ${missing.join(", ")}`)
    console.log(`     → дописать эти секции в sections/${design}/blocks/ ИЛИ переписать материалы под то, что дизайн умеет`)
    if (inherits) console.log(`     → пока они рисуются набором по умолчанию: страница выйдет в двух почерках`)
  }
  if (extra.length) console.log(`   умеет сверх материалов: ${extra.join(", ")}`)
  console.log("")
}

if (designs.length === 1) {
  console.log("Дизайн в проекте один. Второй заводится папкой в sections/ по договору sections/contract.ts.")
}

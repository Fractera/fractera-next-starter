#!/usr/bin/env node
// check:page-composition — сторож СОСТАВА СТРАНИЦЫ.
//
// 🔒 ЧТО ОН СТЕРЕЖЁТ. «A page is a LIST OF BLOCKS in a language cell» — закон
// живёт в `CLAUDE.md` с самого начала, и до 2026-08-31 его не проверял никто.
// Из двадцати одного сторожа ни один не смотрел на СОСТАВ страницы:
// `check:layout` стережёт ленту ширины, `check:sections` — целостность
// каталога, `check:static` — серверность слоя секций. Правило держалось на
// внимательности агента.
//
// ✗ ЧЕМ ОПЛАЧЕНО. Шагом 62 целиком: стандарт модальных окон существовал —
// один `AppDialog`, гейт, закон в инструкции, — и был обойдён тем же агентом,
// который сутками раньше на этот гейт ссылался. Правило, у которого нет ни
// места, где его видно, ни машины, которая его проверяет, исполняется по
// памяти, то есть не исполняется.
//
// 🔒 ПРАВИЛО. На публичной странице появляется одно из трёх и ничего кроме:
//   1. КАТАЛОЖНЫЙ БЛОК — прямо или через фабрику (`createContentPage`,
//      `createContentPost`): фабрика рисует ТОЛЬКО видами каталога;
//   2. ВИДЖЕТ маршрута — `_widgets/{static|dynamic}/<имя>`;
//   3. ПЛАТФОРМЕННЫЙ ПРИМИТИВ — `PageHeader`, `PageShell`, `StaticImage`,
//      типографика. Примитив общий и лежит в `components/`.
// Собственная раскладка страницы — четвёртый источник, которого нет.
//
// 🔒 ИСКЛЮЧЕНИЯ ПЕРЕЧИСЛЕНЫ ПОИМЁННО И С ПРИЧИНОЙ. Сторож, кричащий на законный
// код, отключают целиком в тот же день, и тогда он не ловит уже ничего.
//
// 🔒 И ОТДЕЛЬНО — ДОЛГ, КОТОРЫЙ НЕ ПУТАЕТСЯ С ИСКЛЮЧЕНИЕМ. Три страницы-списка
// существовали до сторожа и рисуют свою раскладку. Они НЕ прощены: они названы
// долгом с датой и причиной, печатаются при каждом прогоне и ждут решения
// владельца — перевести их на блоки или узаконить. Новая страница с тем же
// нарушением роняет сборку сразу.

import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const LANG_DIR = path.join(ROOT, "app", "[lang]")

// Источники, каждый из которых делает страницу законной.
const FACTORY = /createContentPage|createContentPost/
const BLOCKS = /PostBody|renderBlocks|from ["']@\/sections|SPECIMEN/
const WIDGET = /_widgets\//

// Признак собственной раскладки: класс, расставляющий вещи по экрану.
// Отступ внутри примитива сюда не попадает намеренно — ищется РАСКЛАДКА.
const OWN_LAYOUT = /className=["'{][^"'}]*\b(grid|flex|max-w-|space-[xy]-|gap-\d|columns-)/

// 🔒 ИСКЛЮЧЕНИЯ — слои, к которым закон о списке блоков не относится, и почему.
const EXEMPT = [
  {
    match: "(protectedLayer)",
    why: "рабочие экраны прав: их содержимое — записи из базы и островки, а не список блоков; их раскладку держит общая оболочка рабочего экрана",
  },
  {
    match: "(architectLayer)",
    why: "внутренний кокпит архитектора: он настраивает сайт, а не является его страницей; живёт на той же общей оболочке",
  },
]

// 🛑 ДОЛГ, А НЕ ИСКЛЮЧЕНИЕ. Дата, причина и то, чего ждёт каждая строка.
const KNOWN_DEBT = [
  // Пусто — механизм оставлен намеренно: следующая страница, пришедшая в проект
  // со своей вёрсткой, встанет сюда, а не будет прощена исключением.
  //
  // Четыре файла, стоявшие здесь с 2026-08-31, закрыты шагом 64: витрина
  // товаров, её островок догрузки, страница товара и индекс блога стали
  // ВИДЖЕТАМИ своих маршрутов. Не видами каталога — вид обязан подходить любой
  // странице проекта, а эти три принадлежат одному адресу каждая.
]

const pages = []
;(function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name === "page.tsx") pages.push(p)
  }
})(LANG_DIR)

const rel = p => p.split(path.sep).join("/").replace(ROOT.split(path.sep).join("/") + "/", "")

// Вход страницы — сам файл маршрута ПЛЮС его `_components/` одним прыжком:
// `page.tsx` здесь тонкий по канону и почти всегда только реэкспортирует вход.
function entryFiles(page) {
  const files = [page]
  const dir = path.join(path.dirname(page), "_components")
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".tsx") || f.endsWith(".ts")) files.push(path.join(dir, f))
    }
  }
  return files
}

const problems = []
const debts = []
let ok = 0
let exempt = 0

for (const page of pages.sort()) {
  const r = rel(page)
  const skip = EXEMPT.find(e => r.includes(e.match))
  if (skip) {
    exempt++
    continue
  }

  const files = entryFiles(page)
  const text = files.map(f => fs.readFileSync(f, "utf8")).join("\n")

  if (FACTORY.test(text) || BLOCKS.test(text) || WIDGET.test(text)) {
    ok++
    continue
  }

  // Ни блока, ни виджета. Законно, только если страница вообще не раскладывает
  // ничего своими руками — тогда она собрана из примитивов и это третий источник.
  const guilty = files.filter(f => OWN_LAYOUT.test(fs.readFileSync(f, "utf8")))
  if (guilty.length === 0) {
    ok++
    continue
  }

  const known = guilty.map(f => KNOWN_DEBT.find(d => d.file === rel(f))).filter(Boolean)
  if (known.length === guilty.length) {
    debts.push(...known)
    continue
  }

  for (const f of guilty) {
    if (KNOWN_DEBT.some(d => d.file === rel(f))) continue
    problems.push(
      `${rel(f)}\n    страница не берёт ни блок каталога, ни виджет, а раскладывает содержимое сама.\n    Три законных источника: вид каталога (можно через createContentPage), виджет маршрута, платформенный примитив.`
    )
  }
}

console.log(`\n  страниц под app/[lang]: ${pages.length} — законных ${ok}, исключено ${exempt}, долгов ${debts.length}`)

for (const e of EXEMPT) console.log(`  · исключение ${e.match}: ${e.why}`)

if (debts.length) {
  console.log("\n  🛑 ДОЛГ, НАЗВАННЫЙ ВСЛУХ (не исключение — ждёт решения владельца):")
  for (const d of debts) console.log(`  · ${d.file}\n      с ${d.since}: ${d.why}`)
}

if (problems.length) {
  console.error("\n===PAGE_COMPOSITION_FAILED===")
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error(`\n  ${problems.length} нарушени(е/я). Закон — CLAUDE.md, «What goes on a page».\n`)
  process.exit(1)
}

console.log("\n===PAGE_COMPOSITION_OK===\n")

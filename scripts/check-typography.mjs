// check:typography — сторож единой шкалы текста.
//
// 🔒 ЧТО ОН ЛОВИТ И ПОЧЕМУ ЭТОГО НЕ ЛОВИЛО НИЧТО. В наборе `components/ui/` было
// двадцать два компонента и ни одного для текста: правило продукта требовало
// «один интерфейс, один стиль», но записано было только про интерактив. Каждый
// файл описывал заголовок сам, и к 2026-08-15 в дереве накопилось ДЕВЯТЬ разных
// описаний `<h1>` — от `text-xl` в панелях товаров до `text-4xl` в блоге, вдвое
// крупнее на соседней странице того же сайта.
//
// Ни одна проверка этого не видела: типы целы (className — строка), сборка
// зелёная, `check-contrast` смотрит палитру, `check-sections` — наличие образца.
// Вид страницы не проверял никто, поэтому расхождение росло молча и обнаружил
// его человек, открыв страницы подряд.
//
// Три проверки ниже — ровно те дефекты, что были найдены в тот день.

import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const SCAN = ["app", "components", "sections"]
const SKIP = new Set(["node_modules", ".next", ".git", ".swc"])

// 🔒 ЧУЖОЙ ВЕНДОРЕННЫЙ КОД — ИСКЛЮЧЕНИЕ, А НЕ ДОЛГ (шаг 80, доставка на сервер).
//
// `components/ai-elements/` — исходник AI Elements (Vercel), вендоренный целиком
// в 80-2. Мы правим в нём ровно то, что правит CLI библиотеки — пути импорта;
// всё остальное живёт до первого `npx shadcn add` и исчезает МОЛЧА. Требовать от
// него нашей шкалы текста значит либо держать правку, которую сотрёт обновление,
// либо не обновляться никогда.
//
// Тот же разрез и та же причина, что у `check:shadcn-rules`, где это исключение
// уже стояло. ✗ ОПЛАЧЕНО ТЕМ, ЧТО СБОРКА НА СЕРВЕРЕ УПАЛА НА `conversation.tsx:62`
// после того, как шаг 80 был закрыт: локально сборка не запускается по закону, а
// `next dev` гейтов не зовёт. **Вендорить чужой код — значит пройти ВСЕХ сторожей,
// а не только того, чьё имя вспомнилось.**
//
// 🔒 Это ИСКЛЮЧЕНИЕ, а не прощённое нарушение: правило сюда не относится, потому
// что файл не наш. Наш код в этой папке — только `_tools/chat/`, и он проверяется.
const VENDORED = new Set([path.join("components", "ai-elements")])

// 🔒 ИСКЛЮЧЕНИЯ ПЕРЕЧИСЛЕНЫ ПОИМЕННО, А НЕ ШАБЛОНОМ. Шаблон вроде «всё в
// components/ui» однажды накроет файл, который в него случайно переехал.
const ALLOWED_RAW_HEADINGS = new Set([
  // Сам примитив — он и определяет, как выглядит заголовок.
  path.join("components", "ui", "typography.tsx"),
  // Заменяет корневой макет целиком: глобальный CSS там не гарантирован, вся
  // разметка на инлайн-стилях. Классы примитива в этом файле просто не сработают.
  path.join("app", "global-error.tsx"),
])

// 🔒 ПОЛЯ ВВОДА УМЕНЬШАЮТ ТЕКСТ НАМЕРЕННО — И ЭТО НЕ ТА ОШИБКА, ЧТО ИЩЕТ СТОРОЖ.
//
// `text-base md:text-sm` в `input`/`textarea` — штатное решение shadcn, и у него
// одна конкретная причина: Safari на iPhone САМ приближает страницу, когда фокус
// попадает в поле со шрифтом мельче 16px. Вёрстка при этом уезжает, и вернуть
// масштаб пользователь может только вручную. Поэтому на телефоне ровно 16px
// (`text-base`), а на большом экране — обычные 14px.
//
// Исключение перечислено поимённо и с причиной: сторож, кричащий на законный
// код, отключают целиком в тот же день, и тогда он не ловит уже ничего.
// Кто вправе печатать собственный `<header>`.
const ALLOWED_RAW_HEADERS = new Set([
  // Сам примитив шапки.
  path.join("components", "content-page", "page-header.server.tsx"),
  // Шапка САЙТА — верхняя полоса. Это мебель, а не шапка страницы: у неё своя
  // ширина, своё прилипание к верху окна и своё содержимое.
  path.join("components", "menu", "top", "top-menu.server.tsx"),
])

const ALLOWED_SHRINKING = new Set([
  path.join("components", "ui", "input.tsx"),
  path.join("components", "ui", "textarea.tsx"),
])

const files = []
function walk(dir) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue
    if (VENDORED.has(path.relative(ROOT, path.join(dir, e.name)))) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith(".tsx")) files.push(p)
  }
}
for (const d of SCAN) walk(path.join(ROOT, d))

const findings = []
const fail = (kind, rel, line, text) => findings.push({ kind, rel, line, text })

// Размеры шкалы Tailwind В ПИКСЕЛЯХ — сравнивать надо с произвольными значениями.
//
// 🔒 ЗДЕСЬ БЫЛ ПОРЯДКОВЫЙ РАНГ, И ОН ДЕЛАЛ СТОРОЖА СЛЕПЫМ (найдено при аудите
// секций 2026-08-15). Ранг знал только имена (`sm`, `base`, `lg`), поэтому
// запись `text-[17px] … md:text-base` для него не существовала вовсе — а это
// ровно тот же дефект: 17px на телефоне против 16px на мониторе. Так молча
// проходили ЧЕТЫРЕ убывающих размера, включая `p.server.tsx` — то есть каждый
// абзац каждой контентной страницы.
//
// Пиксели сравнимы с чем угодно; имена переводятся в них один раз.
const PX = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
  "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72,
}

/** Размер шрифта в пикселях: `lg` → 18, `[17px]` → 17. `null` — не размер. */
function sizePx(token) {
  const named = PX[token]
  if (named) return named
  const custom = token.match(/^\[(\d+(?:\.\d+)?)px\]$/)
  return custom ? Number(custom[1]) : null
}

for (const file of files) {
  const rel = path.relative(ROOT, file)
  const src = fs.readFileSync(file, "utf8")
  const lines = src.split("\n")

  lines.forEach((line, i) => {
    const n = i + 1

    // ── 1. Сырой заголовок с оформлением вместо примитива ────────────────────
    // Ловится именно `<h1 className=…>`: голый `<h1>` без классов — обычно
    // обёртка, и придираться к ней значит учить обходить сторожа.
    if (!ALLOWED_RAW_HEADINGS.has(rel)) {
      const raw = line.match(/<h([1-4])\s[^>]*className=/)
      if (raw) fail("raw-heading", rel, n, `<h${raw[1]} className=…>`)
    }

    // ── 2. Размер УБЫВАЕТ с ростом экрана ────────────────────────────────────
    // `text-4xl md:text-3xl` — на телефоне крупнее, чем на мониторе. Восемь
    // таких мест жили в проекте, включая рендерер всех H2 контентных страниц.
    const base = line.match(/(?:^|["\s])text-(xs|sm|base|lg|[0-9]?xl|\[\d+(?:\.\d+)?px\])(?=["\s])/)
    const bigger = line.match(/(?:md|lg|xl):text-(xs|sm|base|lg|[0-9]?xl|\[\d+(?:\.\d+)?px\])(?=["\s])/)
    if (base && bigger && !ALLOWED_SHRINKING.has(rel)) {
      const from = sizePx(base[1])
      const to = sizePx(bigger[1])
      if (from !== null && to !== null && to < from) {
        fail("shrinking-text", rel, n, `text-${base[1]} (${from}px) → md:text-${bigger[1]} (${to}px)`)
      }
    }

    // ── 3. Вертикальный отступ УБЫВАЕТ с ростом экрана ───────────────────────
    // Тот же дефект, что у размера текста, и находился он рядом: `py-20 md:py-14`
    // на списке блога и `py-16 md:py-12` в шаблоне страницы. На мониторе места
    // больше — воздуха там должно быть не меньше, иначе страница на большом
    // экране выглядит сдавленной, а на телефоне разрежённой. Это и читается как
    // «то выше, то ниже».
    // 🔒 СРАВНИВАТЬ НАДО ПО ОСИ, А НЕ ПЕРВОЕ С ПЕРВЫМ. Первая версия брала одно
    // совпадение на строку и на `px-6 py-20 md:py-8` сравнивала `px` с `py`:
    // оси разные — проверка молча пропускала настоящий дефект. Поймано
    // отрицательным контролем, а не чтением кода: сторож, который «выглядит
    // правильно», ловится только попыткой его обмануть.
    const byAxis = { base: {}, wide: {} }
    for (const m of line.matchAll(/(?:^|["\s])p([xytblr]?)-(\d+)(?=["\s])/g)) byAxis.base[m[1]] = Number(m[2])
    for (const m of line.matchAll(/(?:md|lg|xl):p([xytblr]?)-(\d+)(?=["\s])/g)) byAxis.wide[m[1]] = Number(m[2])
    for (const axis of Object.keys(byAxis.wide)) {
      const from = byAxis.base[axis]
      const to = byAxis.wide[axis]
      if (from !== undefined && to < from) {
        fail("shrinking-space", rel, n, `p${axis}-${from} → md:p${axis}-${to}`)
      }
    }

    // ── 4. Шапка страницы собрана вручную ────────────────────────────────────
    //
    // 🔒 ПОРЯДОК И ОТСТУПЫ ШАПКИ — НЕ ДЕЛО СТРАНИЦЫ. Замер 2026-08-15: пять
    // разных сборок на восемь страниц. Подзаголовок существовал в ЧЕТЫРЁХ
    // размерах (20/16/14/12px), черта под шапкой была у двух из пяти, над
    // заголовком у каждой стояло своё, а крошки рисовались двумя разными
    // компонентами. Размеры самих заголовков к тому дню уже совпадали — и
    // именно поэтому разнобой читался как «заголовки разные»: глаз видит не
    // кегль, а расстояние и порядок.
    //
    // Собственный `<header>` вне примитива — это и есть начало пятой сборки.
    if (!ALLOWED_RAW_HEADERS.has(rel) && /<header[\s>]/.test(line)) {
      fail("raw-page-header", rel, n, "<header> вне PageHeader")
    }

    // ── 5. Шрифтовое семейство руками в заголовке ────────────────────────────
    // Семейство выбирает примитив: `font-serif` жил в двух файлах из десяти, и
    // страницы читались как собранные из разных проектов.
    if (!ALLOWED_RAW_HEADINGS.has(rel) && /<h[1-4]\s/.test(line) && /font-(serif|sans)/.test(line)) {
      fail("font-family-in-heading", rel, n, line.match(/font-(serif|sans)/)[0])
    }
  })
}

if (findings.length === 0) {
  console.log(`  ✓ заголовки идут через components/ui/typography.tsx`)
  console.log(`  ✓ ни один размер не убывает с ростом экрана`)
  console.log(`  ✓ шрифтовое семейство задаёт только примитив`)
  console.log(`\n  файлов проверено: ${files.length}`)
  console.log("\n===TYPOGRAPHY_OK===")
  process.exit(0)
}

const TITLES = {
  "raw-heading": "заголовок оформлен вручную, мимо примитива",
  "raw-page-header": "шапка страницы собрана вручную, мимо PageHeader",
  "shrinking-text": "размер УБЫВАЕТ с ростом экрана",
  "shrinking-space": "отступ УБЫВАЕТ с ростом экрана",
  "font-family-in-heading": "шрифт задан в заголовке руками",
}

console.log("  БЕДА: типографика разъезжается\n")
for (const kind of Object.keys(TITLES)) {
  const group = findings.filter((f) => f.kind === kind)
  if (!group.length) continue
  console.log(`  ${TITLES[kind]}:`)
  for (const f of group) console.log(`    ${f.rel}:${f.line} — ${f.text}`)
  console.log("")
}
console.log(`
  Шкала текста в проекте одна и живёт в components/ui/typography.tsx:
  H1 H2 H3 H4 (варианты content / ui), P, Lead, Small, Eyebrow.

  Нужен другой размер на одной странице — это не повод писать классы руками:
  либо страница берёт другой уровень, либо меняется сама шкала, и тогда она
  меняется у всех сразу. Ровно ради этого примитив и существует.

  Размер, убывающий с экраном, — всегда ошибка, а не выбор: на мониторе текста
  помещается больше, а не меньше.
`)
console.log("===TYPOGRAPHY_FAILED===")
process.exit(1)

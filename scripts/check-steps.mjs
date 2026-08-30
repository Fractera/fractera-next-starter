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
// Приёмная заявок (шаг 61). Её отсутствие НЕ дефект: проект живёт без неё, пока
// никто не нажал кнопку. Дефект — папка БЕЗ своего README: агент найдёт файл, не
// поймёт, кто его написал, и либо исполнит как задание, либо пройдёт мимо.
const PRE = path.join(STEPS, "pre-steps")

// Имена, которыми агенты заводят параллельный учёт. Ищем только в корне проекта
// и в development-docs/: глубже это почти всегда чужой домен (например
// `app/[lang]/migration/` — законная страница).
// 🪦 ЗАПРЕТ `pre-steps` ОТМЕНЁН 2026-08-30 (шаг 61), И ПРЕЖНИЙ НАЗВАН ЗДЕСЬ ЦЕЛИКОМ.
//    Он стоял с 2026-08-29 и звучал так: «приёмная принадлежит ФЕДЕРАЛЬНОМУ учёту,
//    который живёт в другом репозитории и этому проекту невидим; заведённая здесь
//    она была бы вторым каналом, в который никто не смотрит».
//
//    🔒 ОТМЕНЯЕТ ЕГО НЕ ПЕРЕДУМАННОЕ МНЕНИЕ, А ИСЧЕЗНОВЕНИЕ ПОСЫЛКИ. Запрет держался
//    на «в неё никто не смотрит». Теперь в неё ПИШЕТ страница проекта — каталог
//    блоков, карандаш у образца и кнопка «создать блок», — а ЧИТАЕТ её агент по
//    закону, наравне с current-steps.md. Канал перестал быть вторым: он стал
//    единственным путём, которым просьба владельца доезжает до работы.
//
//    Родовые имена параллельного учёта остались под запретом: они по-прежнему
//    означают попытку завести систему записи рядом с существующей.
const RIVAL_NAMES = new Set(["migration", "migrations", "tasks", "plans", "steps", "todo", "todos", "roadmap"])
const SCAN_ROOTS = [ROOT, path.join(ROOT, "development-docs")]

// 🔒 РЕЖИМ РАЗРАБОТКИ ЧИТАЕТСЯ ЗДЕСЬ, И В `classic` СТОРОЖ МОЛЧИТ О ШАГАХ
// (решение владельца 2026-08-29). Дословно: «в случае, если мы используем любой
// режим кроме классического, все элементы шагов разработки будут применяться;
// если используют классический — инструкция и навыки проигнорируют любые наши
// требования к шагам разработки».
//
// 🔒 ЧИТАЕТСЯ СЫРОЙ ФАЙЛ, А НЕ СЛИТЫЙ С УМОЛЧАНИЯМИ — но умолчание применяется
// то же, что в приложении: пустой конфиг означает `steps` (шаг 36), и свежий
// сервер поэтому стережётся с первого дня. Освобождение получает ТОЛЬКО тот, кто
// выбрал `classic` явно, либо кто унаследовал его от старого сервера.
//
// 🔒 ЗАПРЕТ ПАРАЛЛЕЛЬНОГО УЧЁТА ПЕРЕЖИВАЕТ ОСВОБОЖДЕНИЕ, и это названо вслух.
// Он не требование к шагам, а защита от второй системы записи: в `classic`
// сравнивать её не с чем, но владелец включает `steps` позже — и находит папку
// `tasks/`, набитую чужой структурой, которой никто не искал. Проверка дешёвая,
// а её отсутствие однажды уже стоило дня.
function developmentMode() {
  try {
    const raw = fs.readFileSync(path.join(ROOT, "PLATFORM-CONFIG", "platform-config.json"), "utf8")
    const v = JSON.parse(raw)?.developmentMode
    return ["classic", "steps", "cases", "migration"].includes(v) ? v : "steps"
  } catch {
    // Файла нет — законное состояние свежего проекта; умолчание то же, что в коде.
    return "steps"
  }
}

const MODE = developmentMode()
const STEPS_OWED = MODE !== "classic"

const findings = []
const warnings = []

function hasMarkdown(dir) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return false }
  return entries.some((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
}

// 1. Параллельный учёт рядом с шестью адресами.
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
if (STEPS_OWED && !fs.existsSync(PASSPORT)) {
  warnings.push("development-docs/PASSPORT.md — пятого адреса памяти нет на месте")
}

// 2. Четыре адреса памяти. 🔒 В `classic` этот блок не исполняется вовсе: владелец
//    освободил режим от требований к шагам, и сторож, продолжающий их требовать,
//    ронял бы сборку за неисполнение того, чего не просят.
if (STEPS_OWED && !fs.existsSync(STEPS)) {
  findings.push({ kind: "missing", rel: "development-docs/development-steps" })
} else if (STEPS_OWED) {
  if (!fs.existsSync(CURRENT)) findings.push({ kind: "missing", rel: "development-docs/development-steps/current-steps.md" })
  for (const [dir, rel] of [[NEW, "new-steps"], [DONE, "completed-steps"]]) {
    if (!fs.existsSync(dir)) findings.push({ kind: "missing", rel: `development-docs/development-steps/${rel}` })
  }
  // 🔒 ПРИЁМНАЯ БЕЗ ЗАКОНА ХУЖЕ, ЧЕМ ЕЁ ОТСУТСТВИЕ. Пустой папки здесь не бывает:
  //    либо её нет вовсе, либо она объяснена. Заявка — единственное место проекта,
  //    где текст пишет ЧЕЛОВЕК, а читает АГЕНТ; без README он не знает, что это
  //    данные, а не поручение.
  if (fs.existsSync(PRE) && !fs.existsSync(path.join(PRE, "README.md"))) {
    findings.push({ kind: "noreadme", rel: "development-docs/development-steps/pre-steps" })
  }
}

// 3. Имя плана — указатель: <номер>-<описание из 6-8 слов>.
if (STEPS_OWED && fs.existsSync(NEW)) {
  for (const name of fs.readdirSync(NEW)) {
    if (!name.endsWith(".md") || name === "README.md") continue
    const m = name.match(/^(\d+)-([a-z0-9-]+)\.md$/)
    if (!m) { findings.push({ kind: "planname", rel: `new-steps/${name}` }); continue }
    const words = m[2].split("-").filter(Boolean).length
    if (words < 4) findings.push({ kind: "planwords", rel: `new-steps/${name}`, words })
  }
}

// 4. План и итог одновременно не существуют: закрытый шаг забирает свой план.
if (STEPS_OWED && fs.existsSync(NEW) && fs.existsSync(DONE)) {
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

// 🔒 РЕЖИМ НАЗЫВАЕТСЯ В ОТЧЁТЕ ВСЕГДА. Молчащий сторож неотличим от сломанного:
//    человек, увидевший «нарушений нет» в classic, обязан понимать, что часть
//    проверок не исполнялась, а не считать, что они прошли.
console.log(`check-steps — дисциплина шагов разработки · режим: ${MODE}`)
if (!STEPS_OWED) {
  console.log("  режим classic — требования к шагам не применяются (решение владельца 2026-08-29)")
  console.log("  проверяется только отсутствие параллельного учёта")
}

for (const w of warnings) console.log(`  ⚠️  ${w}`)

if (findings.length === 0) {
  console.log("  ✓ параллельного учёта рядом с шестью адресами нет")
  // 🔒 О ТОМ, ЧЕГО НЕ ПРОВЕРЯЛ, СТОРОЖ НЕ ОТЧИТЫВАЕТСЯ. ✗ поймано при первом же
  //    прогоне освобождения: в classic он печатал «структура памяти на месте» —
  //    и печатал это ДАЖЕ когда папки не было вовсе. Зелёная строка о непроверенном
  //    хуже молчания: по ней принимают решение, что всё в порядке.
  if (STEPS_OWED) {
    const pre = fs.existsSync(PRE) ? ", pre-steps/" : ""
    console.log(`  ✓ структура памяти на месте: current-steps.md, new-steps/, completed-steps/${pre}`)
  }
  if (warnings.length) {
    console.log("\n  Паспорт — то, что отвечает «что это за проект». Заведите его по образцу")
    console.log("  из шаблона: development-docs/PASSPORT.md. → CLAUDE.md § Your memory")
  }
  console.log("\n===STEPS_OK===")
  process.exit(0)
}

console.log("  БЕДА: работа ведётся мимо памяти проекта\n")
for (const f of findings) {
  if (f.kind === "rival") console.log(`    ${f.rel} — параллельная система учёта рядом с шестью адресами`)
  if (f.kind === "missing") console.log(`    ${f.rel} — адреса памяти нет на месте`)
  if (f.kind === "planname") console.log(`    ${f.rel} — имя плана не читается как указатель: нужно <номер>-<описание-через-дефис>.md`)
  if (f.kind === "planwords") console.log(`    ${f.rel} — в имени ${f.words} слов(а), нужно 6–8: список папки обязан читаться без открытия файлов`)
  if (f.kind === "both") console.log(`    ${f.rel} — шаг ${f.step} закрыт (${f.step}-main.md), но его план всё ещё в new-steps/`)
  if (f.kind === "noreadme") console.log(`    ${f.rel} — приёмная есть, а README нет: агент не узнает, что заявка это ДАННЫЕ, а не поручение`)
}
console.log(`
  Память этого проекта живёт по шести адресам, и других не бывает:

    development-docs/PASSPORT.md                          что это за ПРОЕКТ
    development-docs/development-steps/current-steps.md   где работа СЕЙЧАС
    development-docs/development-steps/new-steps/         планы
    development-docs/development-steps/completed-steps/   итоги
    development-docs/development-steps/pre-steps/         что просят СНАРУЖИ
    development-docs/reports/                             разборы и репорты фич

  Своя папка учёта выглядит порядком и им не является: следующая сессия читает
  эти пять адресов и не находит там ничего. Не хватает чего-то в них — скажите
  об этом владельцу, а не заводите шестой адрес.

  Свобода выбирать метод касается того, КАК вы строите, и никогда — ведётся ли
  работа шагом и записано ли состояние. → навык use-development-steps
`)
console.log("===STEPS_FAILED===")
process.exit(1)

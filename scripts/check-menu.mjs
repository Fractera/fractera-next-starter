// check-menu — сторож против ВТОРОЙ навигационной шапки.
//
// 🔒 ЧТО ИМЕННО ОН ЛОВИТ. Не всякий `<header>` — их в проекте много, и почти все
// это заголовки страниц, законные и нужные. Опасен один случай: шапка, которая
// ПРИЛИПАЕТ К ВЕРХУ ОКНА и несёт ссылки, — то есть вторая навигация рядом с
// платформенной. Признак составной (`sticky top-0` + ссылка внутри) именно
// поэтому: он отделяет навигацию от заголовка механически, а не по имени файла.
//
// 🔒 ЗАЧЕМ СТОРОЖ, ЕСЛИ ЕСТЬ ЗАКОН В ИНСТРУКЦИИ. Закон читает тот, кто открыл
// инструкцию. Сюда же попадают правки, сделанные в спешке, чужой кусок кода,
// перенесённый из другого проекта, и агент, которому «было очевидно». Дефект
// этого класса не падает и не мешает сборке: он даёт ДВЕ полосы на странице, и
// одной из них владелец управлять не может — а заметно это только глазами.
//
// Проверка намеренно узкая. Сторож, кричащий на законный код, отключают целиком
// в тот же день, и тогда он не ловит вообще ничего.

import fs from "fs"
import path from "path"

const ROOT = process.cwd()
// Платформенная шапка — единственное законное место такой разметки.
const ALLOWED = ["components/menu/"]
const SCAN = ["app", "components"]
const SKIP = new Set(["node_modules", ".next", ".git", ".swc"])

const files = []
function walk(dir) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith(".tsx")) files.push(p)
  }
}
for (const d of SCAN) walk(path.join(ROOT, d))

const findings = []
for (const file of files) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/")
  if (ALLOWED.some((a) => rel.startsWith(a))) continue

  const src = fs.readFileSync(file, "utf8")
  // Разбираем ПОЭЛЕМЕНТНО: `sticky top-0` в одном месте файла и ссылка в другом
  // — это не шапка. Признаки обязаны стоять в одном элементе `<header>`.
  for (const m of src.matchAll(/<header[^>]*>/g)) {
    const openTag = m[0]
    if (!/sticky/.test(openTag) || !/top-0/.test(openTag)) continue

    // Тело до закрывающего тега: ищем ссылки — навигация без них не бывает.
    const rest = src.slice(m.index, src.indexOf("</header>", m.index) + 9)
    const links = (rest.match(/<Link\b|<a\b/g) ?? []).length
    if (links < 2) continue

    const line = src.slice(0, m.index).split("\n").length
    findings.push({ rel, line, links })
  }
}

// ── ПРОВЕРКА 2: КАЖДЫЙ МАНИФЕСТ ГРУППЫ ДОСТИЖИМ СКАНЕРОМ МЕНЮ ────────────────
//
// 🔒 ЧТО ЭТО ЛОВИТ И ПОЧЕМУ ЭТОГО НЕ ЛОВИЛО НИЧЕГО. Пункты меню приходят из
// манифестов `app/[lang]/…/<раздел>/_data/group.ts`, которые ищет обход в
// `lib/menu/group-menus.ts`. Шаг 507 переложил разделы внутрь слоя
// `(publicLayer)` — и обход, смотревший на один уровень, перестал находить их
// ВСЕ. Верхнее меню опустело у всех и навсегда, при этом:
//   • сборка зелёная — пустое меню законно для свежего проекта;
//   • типы целы — данных на диске обход не обещает;
//   • проверка выше молчит — она про ВТОРУЮ шапку, а не про пустую первую.
// Дефект искали трижды по симптому «меню пропало после выхода из аккаунта» и
// каждый раз чинили роли, хотя фильтровать было уже нечего.
//
// Отличить «групп нет» от «групп не нашли» по результату невозможно — поэтому
// сторож сравнивает не количество, а ДОСТИЖИМОСТЬ: путь от `app/[lang]` до
// раздела с манифестом обязан состоять только из скобочных групп `(…)`, которые
// обход проходит насквозь. Обычная папка на этом пути = манифест невидим.
const LANG_DIR = path.join(ROOT, "app", "[lang]", "(designLayer)")
const manifests = []
function walkGroups(dir) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith(".") || SKIP.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (fs.existsSync(path.join(p, "_data", "group.ts"))) manifests.push(p)
    walkGroups(p)
  }
}
walkGroups(LANG_DIR)

const unreachable = []
for (const dir of manifests) {
  const rel = path.relative(LANG_DIR, dir).split(path.sep)
  // Последний сегмент — сам раздел; всё перед ним обязано быть скобочной группой.
  const between = rel.slice(0, -1)
  const blocker = between.find((s) => !(s.startsWith("(") && s.endsWith(")")))
  if (blocker) unreachable.push({ rel: rel.join("/"), blocker })
  else if (between.length > 3) unreachable.push({ rel: rel.join("/"), blocker: `вложенность ${between.length}` })
}

if (unreachable.length > 0) {
  console.log("  БЕДА: манифест группы есть, а меню его не увидит\n")
  for (const u of unreachable) {
    console.log(`    app/[lang]/${u.rel} — мешает сегмент «${u.blocker}»`)
  }
  console.log(`
  Обход меню (lib/menu/group-menus.ts) проходит насквозь только скобочные
  группы маршрутов — они не влияют на адрес страницы. Любая обычная папка на
  пути делает манифест невидимым: страница откроется по прямой ссылке, а из
  шапки исчезнет, и ни одна проверка этого не заметит.

  Либо перенесите раздел так, чтобы над ним были только сегменты вида (имя),
  либо научите обход новому случаю — и добавьте его сюда же.
`)
  console.log("===MENU_FAILED===")
  process.exit(1)
}

if (findings.length === 0) {
  console.log("  ✓ второй навигационной шапки нет — меню одно, и им управляет владелец")
  console.log(`  ✓ манифестов групп: ${manifests.length}, все достижимы обходом меню`)
  console.log("\n===MENU_OK===")
  process.exit(0)
}

console.log("  БЕДА: похоже на ВТОРУЮ навигационную шапку\n")
for (const f of findings) {
  console.log(`    ${f.rel}:${f.line} — прилипшая к верху шапка со ссылками (${f.links})`)
}
console.log(`
  Верхнее меню в этом проекте уже есть, и его собирает ВЛАДЕЛЕЦ в панели
  управления: пункты, порядок, группы и переводы. Вторая шапка даёт на странице
  две полосы, и вашей владелец управлять не сможет.

  Нужен другой ВИД — меняйте components/menu/top/top-menu.server.tsx.
  Нужны другие ПУНКТЫ — это настройка, а не код: npm run read:menu покажет,
  что там сейчас и где это меняется.

  Если вторая шапка здесь действительно нужна (её просил владелец, и он знает
  про первую) — скажите ему об этом прямо и уберите прилипание к верху окна:
  две ПРИЛИПШИЕ полосы съедают экран телефона целиком.
`)
console.log("===MENU_FAILED===")
process.exit(1)

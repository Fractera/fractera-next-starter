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

if (findings.length === 0) {
  console.log("  ✓ второй навигационной шапки нет — меню одно, и им управляет владелец")
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

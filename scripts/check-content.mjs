#!/usr/bin/env node
// npm run check:content — mechanical gate for every co-located content post.
//
// 🔒 WHY THIS EXISTS. The two posts this project ships were repaired by hand
// once: their links were relative (dead on any site that is not the platform's
// own), their hero media was missing from `public/`, one of them had no Russian
// cell at all, and the site name was written into the data. Repairing the two
// posts fixes nothing durable — the owner may never touch them again, while
// every NEW post repeats the same four mistakes, silently, and each one ships.
//
// So the rules live here, as a check that FAILS the build instead of a
// paragraph nobody re-reads. A rule that is not mechanically enforced is a
// suggestion, and suggestions lose to deadlines.
//
// Scope: any folder under app/[lang]/<section>/<slug>/_data. Adding a section
// (news, docs) needs no change here — the walk finds it.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const ROOT = process.cwd()
const APP = join(ROOT, "app", "[lang]")
const PUBLIC = join(ROOT, "public")

const problems = []
const fail = (file, rule, detail) => problems.push({ file: relative(ROOT, file), rule, detail })

// 🔒 ЗАЩИЩЁННЫЙ СЛОЙ СЮДА НЕ ВХОДИТ. Эти правила описывают ПУБЛИЧНЫЙ контент:
// страницу, одинаковую для всех, предрендеренную и индексируемую. У страницы за
// авторизацией законны и клиентский островок, и динамический сегмент — там иначе
// нельзя. Проверка, зашедшая в `(protectedLayer)`, объявляет нарушением ровно то,
// что этот слой обязан делать, и «починка» по её отчёту сломала бы страницу.
// Граница описана в `CONTENT-ENGINE.md` §2.
const PROTECTED_GROUP = "(protectedLayer)"

/** Every `_data` folder under app/[lang], at any depth, outside the protected layer. */
function findDataDirs(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === PROTECTED_GROUP) continue
    const p = join(dir, name)
    if (!statSync(p).isDirectory()) continue
    if (name === "_data") out.push(p)
    else out.push(...findDataDirs(p, out).slice(out.length))
  }
  return out
}

// ── RULE 1 — a post knows exactly TWO kinds of link ─────────────────────────
//
// EXTERNAL — always absolute, with a host. A relative link is a promise about
// the site it lands on, and a post travels into projects that have no such
// page: `/ai-development-loop` returned 404 on every customer site.
//
// INTERNAL ROOT — the only relative link allowed, written `[%SITE%](/ru)`. It
// points at the home page in the language of that data cell, and its label is
// the site's own title. This is how an article natively pushes weight to the
// home page without anyone's name being typed into the text.
//
// Anything else relative is rejected.
// Подпись и адрес не переносятся на новую строку — иначе выражение цепляет
// открывающую скобку массива `blocks: [` и «ссылкой» становится вся статья.
const LINK_IN_TEXT = /\[([^\]\n]+)\]\(([^)\n]+)\)/g
const HREF_FIELD = /href:\s*'([^']+)'|href:\s*"([^"]+)"/g
const ROOT_LINK = /^\/[a-z]{2}$/

// ── RULE 2 — every local asset exists ───────────────────────────────────────
// `heroVideo`, `heroPoster`, `src:` pointing at `/something` must resolve to a
// file in public/. The hero of a shipped post pointed at a video that was never
// copied: the pattern arrived broken and nobody noticed until it was opened.
const LOCAL_ASSET = /(?:heroVideo|heroPoster|src):\s*'(\/[^']+)'|(?:heroVideo|heroPoster|src):\s*"(\/[^"]+)"/g

// ── RULE 3 — the site never names itself in content ─────────────────────────
// The blog's own data carried 'Blog | Fractera' and 'Fractera Blog', so every
// customer's blog introduced itself with the platform's name. Identity comes
// from APP-CONFIG at render time; data may not carry it.
const BRAND_LITERALS = [/'[^']*\|\s*Fractera'/i, /'Fractera\s+(Blog|News|Docs)'/i]

// ── RULE 4 — a declared language cell exists ────────────────────────────────
// `_data/index.ts` lists the overrides; a listed language whose file is missing
// is a build error, and a post with NO overrides silently serves English on
// every language. The second is legal but must be a decision, not an oversight,
// so it is reported as a notice rather than a failure.
function checkPost(dataDir) {
  const files = readdirSync(dataDir).filter(f => f.endsWith(".ts"))
  const indexPath = join(dataDir, "index.ts")
  if (!files.includes("index.ts")) return

  // Папка данных РАЗДЕЛА (строки интерфейса индекса) отличается от папки данных
  // ПОСТА наличием `meta.ts`. Правила про переводы и ссылку на корень —
  // про пост: у раздела нет ни автора, ни тела статьи.
  const isPost = files.includes("meta.ts")
  let rootLinks = 0

  for (const f of files) {
    const p = join(dataDir, f)
    const text = readFileSync(p, "utf8")

    for (const m of text.matchAll(LINK_IN_TEXT)) {
      const label = m[1].trim()
      const href = m[2].trim()
      if (ROOT_LINK.test(href)) {
        rootLinks++
        if (label !== "%SITE%") {
          fail(p, "root-link-label", `[${label}](${href}) — подпись внутренней ссылки на корень обязана быть %SITE%: она подставляется названием сайта из настроек`)
        }
        continue
      }
      if (!/^https?:\/\//.test(href) && !href.startsWith("#") && !href.startsWith("mailto:")) {
        fail(p, "link-not-absolute", `[…](${href}) — относительная ссылка; разрешена одна форма: [%SITE%](/${"<язык>"})`)
      }
    }
    for (const m of text.matchAll(HREF_FIELD)) {
      const href = (m[1] ?? m[2]).trim()
      if (!/^https?:\/\//.test(href) && !href.startsWith("#") && !href.startsWith("mailto:")) {
        fail(p, "link-not-absolute", `href: '${href}' — относительная ссылка`)
      }
    }
    for (const m of text.matchAll(LOCAL_ASSET)) {
      const rel = (m[1] ?? m[2]).trim()
      if (!existsSync(join(PUBLIC, rel))) {
        fail(p, "asset-missing", `${rel} — файла нет в public/`)
      }
    }
    for (const re of BRAND_LITERALS) {
      const hit = text.match(re)
      if (hit) fail(p, "brand-in-data", `${hit[0]} — имя сайта берётся из APP-CONFIG, не из данных`)
    }
  }

  // Language cells declared in index.ts must exist as files.
  const index = readFileSync(indexPath, "utf8")
  for (const m of index.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(\w+)'/g)) {
    const file = `${m[2]}.ts`
    if (!files.includes(file)) fail(indexPath, "cell-missing", `объявлен ${file}, файла нет`)
  }
  if (isPost && !/overrides\s*:/.test(index)) {
    fail(indexPath, "single-language", "нет ни одного перевода — пост будет английским на всех языках")
  }

  // ── RULE 5 — каждый пост тянет вес на главную ─────────────────────────────
  // Внешние ссылки отдают вес наружу. Если статья не ссылается на собственную
  // главную, сайт раздаёт и не получает. Одна ссылка на корень — минимум, и
  // она обязана быть в КАЖДОЙ языковой ячейке, иначе половина сайта немая.
  if (isPost && rootLinks < files.filter(f => /^(en|[a-z]{2})\.ts$/.test(f) && f !== "index.ts" && f !== "meta.ts").length) {
    fail(indexPath, "no-root-link", `внутренних ссылок на корень: ${rootLinks}; нужна одна в каждой языковой ячейке — [%SITE%](/<язык>)`)
  }
}

// ── ВТОРОЙ ПРОХОД: АУДИТ АРХИТЕКТУРЫ ПОВЕРХНОСТИ ────────────────────────────
//
// Правила выше проверяют СОДЕРЖИМОЕ поста. Этот проход проверяет саму
// поверхность: осталась ли она статической, тонкой и самодостаточной. Семь
// требований, из которых пять проверяются здесь, а два — сборкой и живой
// страницей (их команды названы в `CONTENT-ENGINE.md`, §10).
//
// Зачем в коде, а не в чек-листе: чек-лист исполняется, пока о нём помнят.
// Первая же правка «на минуту» вернёт `force-dynamic` в вкладку, и об этом
// узнают через месяц по просевшей выдаче.

// 🔒 `force-static` — ЭТО НЕ ДИНАМИКА, А ЕЁ ПРОТИВОПОЛОЖНОСТЬ (2026-08-13).
//
// Здесь стояло `export const dynamic\s*=` без разбора значения, и сторож объявлял
// нарушением ровно ту строку, которой добиваются: `export const dynamic =
// "force-static"` в markdown-версиях страниц (шаг 505). Гейт был красным шесть
// маршрутов подряд и оставался незамеченным, потому что в `prebuild` его нет.
//
// Красный гейт, который все привыкли игнорировать, хуже отсутствующего: он
// обесценивает и те проверки, что говорят правду.
const DYNAMIC_MARKERS = /force-dynamic|export const dynamic\s*=\s*["'](?!force-static)[^"']*["']|cookies\(\)|headers\(\)|auth\(\)/
const ENGINE_FILES = ["post-body", "registry", "resolve", "create-content-post", "create-content-page"]

/** Убрать комментарии, чтобы проверка смотрела на код, а не на объяснения к нему. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "")
}

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walkFiles(p, out)
    else if (/\.(ts|tsx)$/.test(p)) out.push(p)
  }
  return out
}

/** Вкладка = папка под app/[lang] с постами (её _data-папки нашлись выше). */
function auditSurface(tabDir) {
  const files = walkFiles(tabDir)

  for (const f of files) {
    const text = readFileSync(f, "utf8")
    // 1 — никакой динамики.
    //
    // 🔒 ИЩЕМ В КОДЕ, А НЕ В КОММЕНТАРИЯХ (2026-08-12). Раньше проверялся весь
    // файл целиком, и сторож ловил собственное имя дефекта в объяснении, почему
    // так делать нельзя: строка «никакого force-dynamic» в комментарии считалась
    // нарушением. Сторож, запрещающий ГОВОРИТЬ о проблеме, заставляет писать
    // код без объяснений — а объяснение здесь ценнее самой проверки.
    const dyn = stripComments(text).match(DYNAMIC_MARKERS)
    if (dyn) fail(f, "surface-dynamic", `${dyn[0]} — публичная поверхность обязана оставаться статической`)
    // 2 — ни одного клиентского компонента
    if (/^["']use client["']/m.test(text)) fail(f, "surface-client", `"use client" — клиентский компонент во вкладке ломает работу без JS`)
  }

  // 3 — тонкий маршрут: page.tsx только реэкспортирует вход
  for (const f of files.filter(p => p.endsWith(`${sep}page.tsx`))) {
    const body = readFileSync(f, "utf8").split("\n").filter(l => l.trim() && !l.trim().startsWith("//"))
    if (body.length > 12) fail(f, "route-not-thin", `${body.length} строк — page.tsx обязан только реэкспортировать ./_components`)
  }

  // 4 — движок не продублирован во вкладке
  for (const f of files.filter(p => p.includes(`${sep}_lib${sep}`))) {
    const base = f.split(sep).pop().replace(/\.tsx?$/, "")
    if (ENGINE_FILES.includes(base)) fail(f, "engine-duplicated", `${base} — это файл общего движка; вкладка обязана его переиспользовать, а не копировать`)
  }

  // 5 — состав папки поста и отсутствие хвостов вне её
  for (const slug of readdirSync(tabDir)) {
    const postDir = join(tabDir, slug)
    // Папка `index.md/` — это МАШИННЫЙ МАРШРУТ раздела (markdown-версия страницы,
    // шаг 505), а не пост: внутри один `route.ts`, и требовать от неё `page.tsx`
    // с языковыми ячейками бессмысленно. Отличается по имени, а не по содержимому,
    // потому что имя папки здесь и есть адрес.
    if (!statSync(postDir).isDirectory() || slug.startsWith("_") || slug.startsWith("[") || slug.endsWith(".md")) continue
    for (const need of ["page.tsx", join("_components", "index.tsx"), join("_data", "index.ts")]) {
      if (!existsSync(join(postDir, need))) fail(postDir, "post-incomplete", `нет ${need}`)
    }
    // Ссылки на пост извне его папки допустимы ровно в одном файле — в
    // сгенерированном списке. Всё прочее означает, что удаление папки оставит
    // висящий импорт.
    for (const f of files) {
      if (f.startsWith(postDir + sep) || f.endsWith("_list.generated.ts")) continue
      if (readFileSync(f, "utf8").includes(slug)) {
        fail(f, "post-tail", `упоминает «${slug}» вне его папки — удаление поста оставит хвост`)
      }
    }
  }
}

const dirs = [...new Set(findDataDirs(APP))]
for (const d of dirs) checkPost(d)

// Вкладка = папка, которой принадлежат посты. У ПОСТА данные лежат на два
// уровня ниже вкладки (`blog/<slug>/_data`), у самой вкладки — на один
// (`blog/_data`). Различаем по `meta.ts`: он есть только у поста.
//
// Область важна: считать вкладкой языковой корень `app/[lang]` значит
// проверять этими правилами весь публичный слой — там законно живут и
// клиентские островки, и толстая главная страница.
// 🔒 ВКЛАДКОЙ СЧИТАЕТСЯ ТОЛЬКО ТА, ЧЬИ ДАННЫЕ — ПОСТЫ. Папка `_data` бывает и у
// поверхностей другого рода: у публичной витрины каталога там лежат строки
// интерфейса, а сама она законно несёт клиентский островок догрузки. Первая
// версия проверки объявляла её нарушением — правило верное, область была не та.
//
// Признак поста — `_data/index.ts`, экспортирующий данные записи. Нет его —
// это не вкладка контента, и правила ко-локации постов к ней не относятся.
const postDataDirs = dirs.filter(d => existsSync(join(d, "index.ts")) && existsSync(join(d, "meta.ts")))
const surfaces = [...new Set(
  postDataDirs
    .map(d => join(d, "..", ".."))
    .filter(p => existsSync(p) && p !== APP && p.startsWith(APP + sep)),
)]
for (const s of surfaces) auditSurface(s)

if (problems.length === 0) {
  console.log(`===CONTENT_OK=== проверено папок данных: ${dirs.length}, нарушений нет`)
  process.exit(0)
}

console.error(`===CONTENT_FAILED=== нарушений: ${problems.length}\n`)
for (const p of problems) console.error(`  ${p.rule.padEnd(18)} ${p.file}\n${" ".repeat(21)}${p.detail}`)
console.error("\nПравила — CODING-STANDARDS.md, раздел о ко-локации и ссылках.")
process.exit(1)

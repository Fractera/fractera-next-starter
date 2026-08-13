// Машинная приёмка оптимизации под ИИ (шаг 505).
// Запуск: npm run check:aio
//
// ЗАЧЕМ. Карта `llms.txt` полезна ровно до первого расхождения с сайтом: агент,
// пришедший по ней, получает 404 и уходит, а владелец об этом не узнаёт никогда —
// в браузере эти файлы никто не открывает. Поэтому у каждой публичной поверхности
// обязана быть markdown-версия, а карта обязана строиться из того же перечня, что
// и сами страницы.
//
// Проверка — статическая, по дереву: она ловит забытый маршрут, а не поведение
// сборки. Живая отдача проверяется отдельно, после сборки.
//
// Что проверяется:
//   1. Перечень поверхностей существует и не пуст.
//   2. У КАЖДОЙ поверхности из перечня есть markdown-маршрут `<путь>/index.md`.
//   3. Ни один markdown-маршрут не лежит в группе прав `(protectedLayer)`:
//      карта для ИИ — приглашение прочитать, и закрытые адреса в неё не попадают.
//   4. Файлы карты существуют в корне и на язык.
//   5. `llms-full.txt` нигде не назван стандартом: его нет в спецификации.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP = path.join(ROOT, "app");
const LANG_DIR = path.join(APP, "[lang]");

const errors = [];
const warnings = [];

const read = f => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
const rel = f => path.relative(ROOT, f).replace(/\\/g, "/");

// 1 — перечень поверхностей существует и собирает карту.
const surfaces = read(path.join(ROOT, "lib", "aio", "surfaces.ts"));
if (!surfaces) errors.push("нет lib/aio/surfaces.ts — перечень публичных поверхностей отсутствует");

// 2 — У КАЖДОЙ ПУБЛИЧНОЙ СТРАНИЦЫ ЕСТЬ markdown-версия.
//
// Сверяем не с перечнем, а с деревом страниц — так проверка ловит именно то, что
// ловить надо: НОВУЮ страницу, о которой забыли. Разбор `surfaces.ts` регулярным
// выражением этого не умеет (пути там собираются в циклах) и вдобавок сравнивал
// бы файл сам с собой.
function walkDirs(dir, want, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const full = path.join(dir, e.name);
    if (e.name === want) out.push(full);
    else walkDirs(full, want, out);
  }
  return out;
}
function walkPages(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Внутрь самих markdown-маршрутов не заходим — там нет страниц.
      if (e.name !== "index.md") walkPages(full, out);
    } else if (e.name === "page.tsx") out.push(path.dirname(full));
  }
  return out;
}

const mdRoutes = walkDirs(LANG_DIR, "index.md");
const pageDirs = walkPages(LANG_DIR).filter(d => !rel(d).includes("(protectedLayer)"));

for (const dir of pageDirs) {
  if (!fs.existsSync(path.join(dir, "index.md", "route.ts"))) {
    errors.push(`${rel(dir)}: публичная страница без markdown-версии — агент, пришедший по карте, получит HTML со всей обвязкой сайта`);
  }
}

// 3 — ничего закрытого.
for (const dir of mdRoutes) {
  if (rel(dir).includes("(protectedLayer)")) {
    errors.push(`${rel(dir)}: markdown-версия у страницы за ролью — закрытый адрес не публикуется`);
  }
}

// 4 — сами карты.
for (const f of [
  path.join(APP, "llms.txt", "route.ts"),
  path.join(APP, "llms-full.txt", "route.ts"),
  path.join(LANG_DIR, "llms.txt", "route.ts"),
  path.join(LANG_DIR, "llms-full.txt", "route.ts"),
]) {
  if (!fs.existsSync(f)) errors.push(`нет ${rel(f)} — карта для ИИ не отдаётся по этому адресу`);
}

// Карта обязана строиться из перечня, а не из заготовки. Признак заготовки —
// собственный текст в маршруте вместо вызова сборщика.
for (const f of [path.join(APP, "llms.txt", "route.ts"), path.join(LANG_DIR, "llms.txt", "route.ts")]) {
  const text = read(f);
  if (text && !/buildLlmsTxt\s*\(/.test(text)) {
    errors.push(`${rel(f)}: карта не собирается из перечня поверхностей — это снова заготовка`);
  }
}

// 5 — честность о происхождении формата.
const llmsLib = read(path.join(ROOT, "lib", "aio", "llms.ts"));
if (llmsLib && /llms-full\.txt[^\n]{0,40}(standard|стандарт)/i.test(llmsLib)) {
  errors.push("lib/aio/llms.ts: `llms-full.txt` назван стандартом — его нет в спецификации llmstxt.org");
}
if (llmsLib && !/llmstxt\.org/.test(llmsLib)) {
  warnings.push("lib/aio/llms.ts: не сослался на первоисточник спецификации");
}

console.log(`публичных страниц: ${pageDirs.length} · markdown-маршрутов: ${mdRoutes.length}`);
for (const w of warnings) console.log(`  предупреждение: ${w}`);
for (const e of errors) console.log(`  ОШИБКА: ${e}`);

if (errors.length) {
  console.log(`\n===AIO_FAILED=== ошибок: ${errors.length}`);
  process.exit(1);
}
console.log(`\n===AIO_OK=== ошибок нет, предупреждений: ${warnings.length}`);

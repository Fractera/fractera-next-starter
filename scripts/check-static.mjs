// Машинная приёмка СТАТИКИ публичного слоя (шаг 529).
// Запуск: npm run check:static  ·  в `prebuild` идёт сам.
//
// ЗАЧЕМ ОНА СУЩЕСТВУЕТ. Статика в этом проекте — архитектурное требование, а не
// настройка: публичная страница обязана быть предрендеренной, читаться с
// выключенным JavaScript и стоить одинаково на сотне визитов и на сотне тысяч.
// Ломается это ОДНОЙ строкой, и ни одна проверка до сих пор её не ловила:
// сборка проходит, страница открывается, а в таблице маршрутов вместо `●`
// появляется `ƒ` — и узнают об этом позже всего, просевшей выдачей.
//
// Почему проверка читает ФАЙЛЫ, а не таблицу сборки. Таблица честнее, но она
// появляется в конце сборки — то есть после нескольких минут работы и уже на
// сервере. Здесь ловится ПРИЧИНА: три строки, превращающие страницу в
// динамическую, и два способа отдать краулеру пустую разметку. Таблица остаётся
// вторым доказательством, из другой плоскости (см. навык `use-code-shape`).
//
// Что проверяется:
//   1. `force-dynamic` / `revalidate = 0` в публичном слое.
//   2. `cookies()` / `headers()` / `auth()` в странице, макете или входе
//      публичного слоя.
//   3. `"use client"` в самом `page.tsx` — клиентский компонент, владеющий
//      маршрутом.
//   4. Библиотека движения (`motion`) в файле, который не является островком.
//   5. Прямое обращение к базе из папки маршрута публичного слоя.
//
// Выход: код 1 при любой ОШИБКЕ, 0 при одних предупреждениях.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP = path.join(ROOT, "app");
const LANG_DIR = path.join(APP, "[lang]", "(designLayer)");
const PUBLIC_GROUP = "(publicLayer)";

const errors = [];
const warnings = [];
const rel = f => path.relative(ROOT, f).replace(/\\/g, "/");

function walk(dir, out = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(full);
  }
  return out;
}

// Комментарии — это ПРОЗА, а не код. Проверка, падающая на объяснении
// собственного правила, учит удалять объяснения; тот же урок уже оплачен в
// `check-seo.mjs`, где первый прогон упал на комментарии в карте сайта.
function codeOnly(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const files = walk(LANG_DIR);
if (!files.length) errors.push("не найдено ни одного файла под app/[lang] — проверка смотрит не туда");

const isPublic = f => rel(f).includes(PUBLIC_GROUP);
const isRouteFile = f => /\/(page|layout)\.tsx$/.test(rel(f));

for (const file of files) {
  const relFile = rel(file);
  const code = codeOnly(fs.readFileSync(file, "utf8"));

  // 1 — три строки, убивающие предрендер. Первые две действуют на файл, третья —
  // на ВСЁ поддерево, поэтому в макете она дороже всего.
  if (isPublic(file)) {
    if (/force-dynamic/.test(code)) {
      errors.push(`${relFile}: force-dynamic в публичном слое — маршрут и всё его поддерево считаются на каждый запрос`);
    }
    if (/export\s+const\s+revalidate\s*=\s*0\b/.test(code)) {
      errors.push(`${relFile}: revalidate = 0 — это та же динамика, только записанная числом`);
    }
    if (/\b(cookies|headers)\s*\(\s*\)/.test(code) && isRouteFile(file)) {
      errors.push(`${relFile}: cookies()/headers() в маршруте — страницу спрашивает островок после гидратации, право решает /api/*`);
    }
    if (/\bauth\s*\(\s*\)/.test(code) && isRouteFile(file)) {
      errors.push(`${relFile}: auth() в маршруте публичного слоя — сессия делает страницу динамической`);
    }
  }

  // 2 — клиентский компонент, ВЛАДЕЮЩИЙ маршрутом. Настоящий убийца работы без
  // JavaScript: не серверная динамика, а страница, которую рисует браузер.
  if (/\/page\.tsx$/.test(relFile) && /^\s*["']use client["']/m.test(code)) {
    errors.push(`${relFile}: "use client" в самом page.tsx — маршрутом владеет браузер, без JavaScript страницы нет`);
  }

  // 3 — движение только в островке. `motion` печатает своё `initial` НА СЕРВЕРЕ:
  // `initial={{opacity: 0}}` уезжает в предрендеренный HTML, и содержимое
  // существует только после гидратации (антипаттерн №7).
  if (/from\s+["'](motion|framer-motion)/.test(code) && !/\.client\.tsx$/.test(relFile)) {
    errors.push(`${relFile}: motion вне островка — разметка уедет краулеру с opacity:0; движение живёт в *.client.tsx поверх статического близнеца`);
  }

  // 4 — база не читается из папки маршрута публичного слоя. Запрос, живущий во
  // входе страницы, повторяется у каждого следующего входа и не переиспользуется
  // ни картой сайта, ни машинной версией: у предмета обязан быть один читатель в
  // `lib/<предмет>/`.
  if (isPublic(file) && /from\s+["']@\/lib\/db["']/.test(code)) {
    errors.push(`${relFile}: прямое обращение к базе из папки маршрута — предмет читается своим модулем в lib/, один на всех потребителей`);
  }
}

// 5 — движение в слое секций. Слой серверный ЦЕЛИКОМ, и это его свойство, а не
// случайность: интерактив живёт в островке, который секция монтирует.
for (const file of walk(path.join(ROOT, "sections"))) {
  const code = codeOnly(fs.readFileSync(file, "utf8"));
  if (/^\s*["']use client["']/m.test(code)) {
    errors.push(`${rel(file)}: "use client" под sections/ — слой секций серверный целиком`);
  }
  if (/from\s+["'](motion|framer-motion)/.test(code)) {
    errors.push(`${rel(file)}: motion под sections/ — рендерер серверный, движение монтируется островком из components/`);
  }
}

const publicFiles = files.filter(isPublic).length;
console.log(`файлов публичного слоя: ${publicFiles}`);
for (const w of warnings) console.log(`  предупреждение: ${w}`);
for (const e of errors) console.log(`  ОШИБКА: ${e}`);

if (errors.length) {
  console.log(`\n===STATIC_FAILED=== ошибок: ${errors.length}`);
  process.exit(1);
}
console.log(`\n===STATIC_OK=== ошибок нет, предупреждений: ${warnings.length}`);

// Машинная приёмка устанавливаемого приложения (шаг 504).
// Запуск: npm run check:pwa
//
// ЗАЧЕМ. Всё, что относится к установке, проверяется только на телефоне — и
// поэтому не проверяется никогда. Эта команда ловит то, что видно по дереву:
// манифест на язык, обязательные поля, регистрацию воркера и — главное —
// СТРАТЕГИЮ воркера. Последнее важнее остального: воркер, отдающий страницы из
// кеша, показывает вчерашний сайт, а панель у нас меняет тексты без пересборки.
//
// Что проверяется:
//   1. Манифест собирается общим строителем и существует на язык.
//   2. Обязательные поля манифеста объявлены (включая `id`, `lang`, `start_url`).
//   3. Макет ссылается на ЯЗЫКОВОЙ манифест, а не на один общий.
//   4. Сервис-воркер существует и зарегистрирован.
//   5. 🔒 Воркер НЕ отдаёт документы из кеша первым делом.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const errors = [];
const warnings = [];
const read = f => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");

// 1 — строитель и маршруты.
const builder = read(path.join(ROOT, "lib", "pwa", "manifest.ts"));
if (!builder) errors.push("нет lib/pwa/manifest.ts — манифест собирается не общим строителем");

const perLang = path.join(ROOT, "app", "[lang]", "manifest.webmanifest", "route.ts");
if (!fs.existsSync(perLang)) errors.push("нет app/[lang]/manifest.webmanifest — приложение будет одноязычным на любом языке");
if (!read(perLang).includes("buildManifest")) errors.push("языковой манифест не использует общий строитель");

// 2 — поля.
for (const field of ["id:", "name:", "short_name:", "description:", "lang,", "start_url:", "scope:", "display:", "theme_color:", "background_color:", "icons,"]) {
  if (builder && !builder.includes(field)) {
    errors.push(`манифест без поля ${field.replace(/[:,]$/, "")} — карточка установки будет неполной`);
  }
}
if (builder && !/purpose:\s*['"]maskable['"]/.test(builder)) {
  errors.push("нет иконки maskable — на Android значок обрежется по чужой форме");
}

// 2a — СТАРТОВЫЕ ИКОНКИ СУЩЕСТВУЮТ НА ДИСКЕ.
//
// Правило написано по замеру на живом сайте: манифест отдавался с нулём иконок,
// то есть приложение нельзя было установить, хотя весь остальной PWA работал.
// Умолчание, ссылающееся на несуществующий файл, — та же пустота, только
// незаметная: она не видна ни в коде, ни в браузере разработчика.
const defaults = read(path.join(ROOT, "config", "app-config.defaults.ts"));
const declaredIcons = [...defaults.matchAll(/"(\/icons\/[^"]+)"/g)].map(m => m[1]);
if (!declaredIcons.length) {
  errors.push("в умолчаниях нет стартовых иконок — манифест свежего проекта уедет пустым, и приложение не установится");
}
for (const icon of declaredIcons) {
  if (!fs.existsSync(path.join(ROOT, "public", icon))) {
    errors.push(`умолчание ссылается на ${icon}, а файла нет — запустите npm run icons:default`);
  }
}
if (declaredIcons.length && !/icon512Maskable/.test(defaults)) {
  errors.push("среди стартовых иконок нет maskable — на Android значок обрежется по чужой форме");
}

// 2b — ЗАСТАВКИ iOS: объявленное и лежащее на диске совпадают.
//
// Расхождение здесь невидимо: часть устройств получит ссылку на несуществующую
// картинку и покажет при запуске белый экран — ровно то, ради чего заставки и
// делались. Заметит это только владелец такого телефона.
const splashDecl = read(path.join(ROOT, "components", "pwa", "ios-splash.tsx"));
const splashNames = [...splashDecl.matchAll(/name:\s*'([a-z0-9-]+)'/g)].map(m => m[1]);
if (!splashNames.length) {
  errors.push("нет объявлений заставок iOS — установленное приложение покажет при запуске белый экран");
}
for (const n of splashNames) {
  for (const o of ["portrait", "landscape"]) {
    const f = path.join(ROOT, "public", "splash", n + "-" + o + ".png");
    if (!fs.existsSync(f)) errors.push("заставка " + n + "-" + o + ".png объявлена, а файла нет — запустите npm run icons:default");
  }
}
if (splashDecl && !/apple-mobile-web-app-status-bar-style/.test(splashDecl)) {
  warnings.push("не задан стиль полосы состояния iOS — поверх заставки останется светлая планка");
}

// 3 — макет ссылается на языковой манифест.
const layout = read(path.join(ROOT, "app", "[lang]", "layout.tsx"));
if (layout && !/manifest:\s*`\/\$\{lang\}\/manifest\.webmanifest`/.test(layout)) {
  errors.push("app/[lang]/layout.tsx не ссылается на языковой манифест — установленное приложение будет на языке по умолчанию");
}

// 4 — воркер и его регистрация.
const sw = read(path.join(ROOT, "public", "sw.js"));
if (!sw) errors.push("нет public/sw.js — офлайна и быстрого повторного открытия не будет");
const reg = read(path.join(ROOT, "components", "pwa", "register-sw.client.tsx"));
if (!reg) errors.push("нет островка регистрации воркера — файл есть, а включить его некому");
if (layout && !/RegisterServiceWorker/.test(layout)) errors.push("макет не подключает регистрацию воркера");

// 5 — СТРАТЕГИЯ. Правило написано не про стиль, а про класс дефекта: страница из
// кеша расходится с настоящей в ту же минуту, когда владелец что-то поменял в
// панели, и найти это невозможно — у него-то браузер обычный.
if (sw) {
  const docBranch = sw.slice(sw.indexOf("isDocument"));
  if (/caches\.match\([^)]*\)\s*\|\|\s*fetch/.test(sw) || /const\s+cached\s*=\s*await\s+caches\.match[\s\S]{0,200}return\s+cached[\s\S]{0,200}fetch\(/.test(docBranch)) {
    errors.push("public/sw.js: документы отдаются из кеша раньше сети — приложение будет показывать вчерашний сайт");
  }
  if (!/mode\s*===\s*['"]navigate['"]/.test(sw)) {
    warnings.push("public/sw.js: не различает переходы по страницам — проверьте, что стратегия применяется к документам");
  }
  if (!/_next\/static/.test(sw)) {
    warnings.push("public/sw.js: не кеширует статику по хешу — повторное открытие не ускорится");
  }
}

console.log(`манифест: ${builder ? "общий строитель" : "НЕТ"} · воркер: ${sw ? "есть" : "НЕТ"}`);
for (const w of warnings) console.log(`  предупреждение: ${w}`);
for (const e of errors) console.log(`  ОШИБКА: ${e}`);

if (errors.length) {
  console.log(`\n===PWA_FAILED=== ошибок: ${errors.length}`);
  process.exit(1);
}
console.log(`\n===PWA_OK=== ошибок нет, предупреждений: ${warnings.length}`);

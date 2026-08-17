// check-dialogs — модальное окно в проекте одно, и это проверяется механически.
//
// 🔒 ЗАЧЕМ. К 2026-08-17 в приложении жили ВОСЕМЬ окон трёх разных пород, и три
// из них были собраны руками из голых `div`: без `role="dialog"`, без
// `aria-modal`, без ловушки фокуса, без Escape, без замка прокрутки. При этом в
// проекте всё это время лежал полноценный shadcn `Dialog`. Самопис вырос не
// потому, что кто-то решил обойтись без примитива, а потому, что НИЧТО не
// мешало: типы целы, сборка зелёная, на экране разницы нет. Разница появляется,
// когда окном пробуют пользоваться с клавиатуры или читалкой.
//
// Правило без механизма — пожелание. Здесь механизм.
//
// Проверяется три вещи:
//   1. Подложка во весь экран (`inset-0` + затемнение) вне разрешённых мест.
//   2. `createPortal` вне разрешённых мест — окно, вынесенное в `body` руками.
//   3. Клиентский файл, импортирующий словарь окна ЗНАЧЕНИЕМ, а не типом:
//      82 языка × словарь уехали бы в браузер на каждой странице.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN = ["app", "components", "sections", "services", "lib", "_tools"];

// Разрешено ровно двум: примитиву shadcn и общей обёртке над ним. Всё остальное
// приложение обязано ходить через `AppDialog`.
const ALLOWED = [
  join("components", "ui"),
  join("components", "dialog"),
];

// Именованные исключения. Каждое — с причиной: список без причин через полгода
// превращается в список того, что «почему-то нельзя чинить».
const EXCEPTIONS = new Map([
  [
    join("components", "menu", "top", "mobile-menu.client.tsx"),
    "Не модальное окно, а панель навигации, прицепленная ПОД шапку: подложка " +
    "начинается с `top-14`, чтобы полоса шапки осталась светлой и крестик был " +
    "виден и нажимаем (решение владельца 2026-08-16). `Sheet side=\"top\"` " +
    "затемняет шапку вместе со всем остальным и это решение молча отменил бы.",
  ],
]);

const DIALOG_DICT = "components/dialog/app-dialog.i18n";

let failed = 0;
const fail = (code, msg) => { failed++; console.log(`  ✗ [${code}] ${msg}`); };

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(full)) out.push(full);
  }
  return out;
}

const files = SCAN.flatMap(d => walk(join(ROOT, d)));

// `inset-0` вместе с затемнением — это подложка модального окна и ничто иное.
// Проверять один `inset-0` нельзя: он законно встречается у картинок и рамок.
const SCRIM = /\b(?:fixed|absolute)\b[^"'`]*\binset-0\b[^"'`]*\bbg-(?:black|foreground|background)\//;
const PORTAL = /\bcreatePortal\s*\(/;
// 🔒 ПРОВЕРКА ДЕРЖИТСЯ В ПРЕДЕЛАХ ОДНОЙ СТРОКИ, и это не мелочь. Первая версия
// разрешала переносы (`[^;]*`), а в проекте есть файлы без точек с запятой —
// поэтому выражение перепрыгивало с соседнего импорта на нужный путь и объявляло
// нарушением ДЕСЯТЬ честных `import type`. Сторож, который врёт, отключают.
const DICT_VALUE_IMPORT = new RegExp(`^[ \\t]*import[ \\t]+(?!type\\b)[^\\n]*${DIALOG_DICT.replace(/\//g, "\\/")}`, "m");

for (const file of files) {
  const rel = relative(ROOT, file);
  const relSep = rel.split("/").join(sep);
  if (ALLOWED.some(a => relSep.startsWith(a + sep))) continue;

  const src = readFileSync(file, "utf8");
  const exempt = EXCEPTIONS.has(relSep);

  if (SCRIM.test(src) && !exempt) {
    fail("hand-rolled-modal", `${rel} — подложка во весь экран собрана руками. Модальное окно продукта одно: components/dialog/app-dialog.client.tsx (AppDialog). Боковая панель — components/ui/sheet.tsx.`);
  }
  if (PORTAL.test(src) && !exempt) {
    fail("hand-rolled-portal", `${rel} — окно выносится в body через createPortal. Портал, подложку и слой перекрытия приносит AppDialog.`);
  }
  if (/^\s*["']use client["']/m.test(src) && DICT_VALUE_IMPORT.test(src)) {
    fail("dialog-dict-in-client", `${rel} — словарь окна импортирован ЗНАЧЕНИЕМ в клиентском файле. 82 языка уедут в браузер: сервер зовёт appDialogUi(lang) и передаёт результат пропсом \`ui\`, отсюда допустим только \`import type\`.`);
  }
}

console.log("");
if (failed) {
  console.log(`===DIALOGS_FAILED=== нарушений: ${failed}`);
  process.exit(1);
}
console.log(`===DIALOGS_OK=== проверено файлов: ${files.length}, исключений с причиной: ${EXCEPTIONS.size}`);

// check-project-types — у каждого направления есть слова, в каждом языке корпуса.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ СТОРОЖ, ЕСЛИ ЕСТЬ `check:i18n`. Тот читает плоские словари
// вида «язык → ключ → строка». Здесь на уровень больше: «язык → направление →
// поля», и его регулярные выражения такую запись не разбирают — ровно та же
// причина, по которой вне охраны стоит `footer-menu.i18n.ts`. Оставить корпус
// вовсе без проверки нельзя: молча пропавшая запись даёт карточку с пустым
// именем, и увидит это первым посетитель.
//
// 🔒 ПРОВЕРЯЕТСЯ ПОЛНОТА ОТНОСИТЕЛЬНО ТОГО, ЧТО В КОРПУСЕ ЕСТЬ, а не «сколько
// языков положено». Языков сегодня два, завтра восемьдесят два — число здесь не
// записано намеренно: сторож обязан ловить дыру, а не спорить с планом владельца
// о темпах перевода.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CATALOG = join(ROOT, "config", "project-types.ts");
const WORDS = join(ROOT, "lib", "i18n", "project-types.i18n.json");

const REQUIRED_STRINGS = ["title", "tagline", "definition"];
const REQUIRED_ARRAYS = ["examples", "signals", "questions"];

let failed = 0;
const fail = (code, msg) => { failed++; console.log(`  ✗ [${code}] ${msg}`); };

const ids = [...readFileSync(CATALOG, "utf8").matchAll(/^ {2}"([a-z0-9-]+)",$/gm)].map(m => m[1]);
if (!ids.length) {
  console.log("  ✗ [catalog-empty] config/project-types.ts не отдал ни одного идентификатора");
  process.exit(1);
}

const words = JSON.parse(readFileSync(WORDS, "utf8"));
const langs = Object.keys(words);
if (!langs.includes("en")) fail("no-base", "в корпусе нет языка-основы en — откат полей не на что опереть");

for (const lang of langs) {
  for (const id of ids) {
    const e = words[lang][id];
    if (!e) { fail("entry-missing", `${lang}: нет записи направления '${id}'`); continue; }

    for (const k of REQUIRED_STRINGS) {
      if (typeof e[k] !== "string" || !e[k].trim()) {
        fail("field-empty", `${lang}.${id}.${k} — пусто или не строка`);
      }
    }
    for (const k of REQUIRED_ARRAYS) {
      if (!Array.isArray(e[k])) { fail("field-not-array", `${lang}.${id}.${k} — не список`); continue; }
      // `custom.questions` пуст ОСОЗНАННО: вопросы к своему направлению пишет
      // владелец. Это единственная законная пустота во всём корпусе.
      if (!e[k].length && !(id === "custom" && k === "questions")) {
        fail("field-empty", `${lang}.${id}.${k} — пустой список`);
      }
      if (e[k].some(v => typeof v !== "string" || !v.trim())) {
        fail("field-empty", `${lang}.${id}.${k} — в списке есть пустая строка`);
      }
    }
  }
  // Лишняя запись — не мелочь: направление, выкинутое из каталога, оставляет за
  // собой слова, и следующий читатель считает его живым.
  for (const id of Object.keys(words[lang])) {
    if (!ids.includes(id)) fail("entry-orphan", `${lang}: запись '${id}' есть в словах, но нет в каталоге`);
  }
}

console.log("");
if (failed) {
  console.log(`===PROJECT_TYPES_FAILED=== нарушений: ${failed}`);
  process.exit(1);
}
console.log(`===PROJECT_TYPES_OK=== направлений: ${ids.length}, языков в корпусе: ${langs.length} (${langs.join(", ")})`);

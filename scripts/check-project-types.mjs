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
// 🔒 СПИСКА ВОПРОСОВ QUIZ В ПУБЛИЧНОМ КОРПУСЕ НЕТ (решение владельца 2026-08-17):
// он весил 91 КБ на язык — 86% всего объёма, 422 вопроса, — а задаёт их панель,
// там они и остались. Встретив поле вопросов здесь, НЕ возвращайте его: витрине
// оно не нужно, а перевод корпуса на каждый новый язык подорожал бы всемеро.
const REQUIRED_ARRAYS = ["examples", "signals"];

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
      if (!e[k].length) {
        fail("field-empty", `${lang}.${id}.${k} — пустой список`);
      }
      if (e[k].some(v => typeof v !== "string" || !v.trim())) {
        fail("field-empty", `${lang}.${id}.${k} — в списке есть пустая строка`);
      }
      // 🔒 ДЛИНА СПИСКА ОБЯЗАНА СОВПАДАТЬ С ОСНОВОЙ. Правило записано по
      // реальному промаху: при переводе на испанский у «Доставки» потерялся один
      // признак из трёх. Потеря тихая — запись остаётся валидной, поле непустое,
      // и заметить её можно только сравнив два языка глазами. У всех записей
      // корпуса по четыре примера и по три признака, и расхождение здесь всегда
      // означает пропуск при переводе, а не замысел.
      const baseLen = words.en[id]?.[k]?.length;
      if (lang !== "en" && baseLen !== undefined && e[k].length !== baseLen) {
        fail("field-length", `${lang}.${id}.${k} — ${e[k].length} против ${baseLen} у en: при переводе потерялась или добавилась строка`);
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

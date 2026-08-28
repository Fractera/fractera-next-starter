// i18n-export — собрать запрос на перевод для ВНЕШНЕЙ модели (владелец 2026-08-14).
//
// ЗАЧЕМ. Переводить словарь страницы силами агента дорого и медленно: это сотни
// строк прозы, за которые платится контекстом на каждой итерации разработки.
// Владелец делает это на стороне — одной внешней моделью, разом на все языки.
// Задача этого скрипта — отдать ей ровно то, что нужно, и ни строкой больше.
//
// ЧТО УЕЗЖАЕТ. Английский словарь, список нужных языков и КОНТРАКТ: что нельзя
// трогать. Контракт здесь не вежливость — плейсхолдер `{roles}`, переведённый
// как «{роли}», ломает страницу молча и именно в том языке, который никто не
// проверяет.
//
// Использование:
//   node scripts/i18n-export.mjs home              → storage/i18n/home.request.json
//   node scripts/i18n-export.mjs home --print      → то же в консоль
//   node scripts/i18n-export.mjs home --langs es,fr

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Словари, которые обслуживает обмен. Список ведётся руками намеренно: новый
// словарь попадает под внешний перевод осознанно, вместе с решением, на скольких
// языках он обязан существовать.
// 🔒 ПУСТО, И ЭТО ВЕРНО (шаг 508). Здесь стоял словарь главной — единственный
// её обитатель. Главная переехала на языковые ячейки, как блог: перевод живёт
// рядом с материалом, а не в отдельном плоском файле. Обмен остаётся механизмом
// для словарей ИНТЕРФЕЙСА (кнопки, подписи), если такой словарь появится.
export const DICTS = {
  // Каталог направлений продукта (2026-08-17): 22 записи по шесть полей.
  // Перенесён из панели дословно, и там на тот день существовали только `en` и
  // `ru` — значит карточки ленты на остальных языках английские, пока владелец
  // не прогонит обмен:
  //   npm run i18n:export project-types --langs <языки>
  //   npm run i18n:import project-types <ответ модели>
  "project-types": {
    json: "lib/i18n/project-types.i18n.json",
    what: "Двадцать два направления продукта: имя, подпись, определение, примеры, признаки и вопросы Quiz.",
  },
  // Подписи двух ссылок на страницу архитектуры — кнопка в подвале и кнопка на
  // главной (2026-08-17). Заведено сразу под внешний перевод: владелец просил не
  // тратить на переводы токены агента, поэтому здесь только английский.
  "architecture-link": {
    json: "lib/i18n/architecture-link.i18n.json",
    what: "Подписи двух ссылок на страницу описания архитектуры: короткая для подвала, длинная для кнопки на главной.",
  },
  // Обрезчик картинок (2026-08-17). Четыре слова, которые до этого дня стояли в
  // разметке по-английски и потому были английскими во ВСЕХ языках продукта.
  // Окно переиспользуемое — значит ему положены все 82; сочинять их агент не
  // вправе, поэтому словарь заведён здесь и ждёт внешнего перевода:
  //   npm run i18n:export image-cropper --langs <языки>
  //   npm run i18n:import image-cropper <ответ модели>
  "image-cropper": {
    json: "services/upload/image-cropper.i18n.json",
    what: "Окно обрезки картинки: заголовок, подпись ползунка масштаба и две кнопки.",
  },
  // Голосовой ввод и его контейнер (2026-08-28, шаг 32-4). Владелец назвал
  // предмет перевода поимённо: подпись кнопки записи и объяснения ТРЁХ отказов —
  // нет ключа, браузер не дал разрешения, соединение не защищено. Плюс слова
  // самого контейнера: заголовок, подсказка, комментарий.
  //
  // 🔒 Десять языков достались от прежнего словаря, но новые четыре строки есть
  // только в `en` и `ru`: остальным они приходят этим обменом. Резолвер откатывает
  // недостающий ключ на английский, поэтому промежуточное состояние рабочее.
  "voice-field": {
    json: "lib/i18n/voice-field.i18n.json",
    what:
      "Голосовой ввод: подпись кнопки записи, состояния «идёт запись» и «расшифровка», " +
      "три объяснения отказа (нет ключа OpenAI, браузер не дал разрешения на микрофон, " +
      "соединение не защищено), вопрос о вставке расшифровки с двумя кнопками, " +
      "а также заголовок, подсказка и комментарий контейнера поля ввода.",
  },
};

// Целевой набор для СЛЕДУЮЩЕГО обмена. Первые десять (en, ru + эти восемь) уже
// переведены — 2026-08-14, часть сделана внешней моделью, часть напрямую
// агентом через `i18n-import.mjs`. Список здесь пуст осознанно: очередной язык
// добавляется владельцем, когда он решил его добавить, а не потому что где-то
// стоит цифра «десять».
export const TARGET_LANGS = [];
export const SOURCE_LANG = "en";

const DO_NOT_TRANSLATE = [
  "Fractera", "GitHub", "OpenAI", "Claude Code", "Quiz", "SEO", "PWA", "Next.js",
];

function main() {
  const [name, ...rest] = process.argv.slice(2);
  const dict = DICTS[name];
  if (!dict) {
    console.error(`Неизвестный словарь: ${name || "(не указан)"}. Доступны: ${Object.keys(DICTS).join(", ")}`);
    process.exit(1);
  }
  const langsArg = rest.includes("--langs") ? rest[rest.indexOf("--langs") + 1] : "";
  const targets = langsArg ? langsArg.split(",").map((s) => s.trim()).filter(Boolean) : TARGET_LANGS;
  if (!targets.length) {
    console.error("Нет целевых языков. Укажите их явно: node scripts/i18n-export.mjs " + name + " --langs uk,cs,sk");
    process.exit(1);
  }

  const all = JSON.parse(fs.readFileSync(dict.json, "utf8"));
  const source = all[SOURCE_LANG];
  if (!source) throw new Error(`В словаре нет языка-источника ${SOURCE_LANG}`);

  const have = Object.keys(all);
  const missing = targets.filter((l) => !have.includes(l));

  const request = {
    task: "Translate the UI strings below.",
    rules: [
      "Return STRICT JSON only: an object whose top-level keys are the language codes, each mapping to an object with EXACTLY the same keys as the source.",
      "Keep every placeholder in braces literally as it is: {roles}, {count}. Never translate or reorder them.",
      "Keep the meaning and the register: this is product interface copy, addressed to the owner of the application. Plain, concrete, no marketing.",
      "Keep the length close to the source — these strings sit in a fixed layout.",
      "Do not translate the product names listed in doNotTranslate.",
      "Do not add keys, do not drop keys, do not add commentary outside the JSON.",
    ],
    doNotTranslate: DO_NOT_TRANSLATE,
    what: dict.what,
    sourceLanguage: SOURCE_LANG,
    targetLanguages: targets,
    alreadyPresent: have,
    strings: source,
  };

  const text = JSON.stringify(request, null, 2);
  if (rest.includes("--print")) {
    process.stdout.write(text + "\n");
    return;
  }

  const outDir = "storage/i18n";
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `${name}.request.json`);
  fs.writeFileSync(out, text, "utf8");

  console.log(`Запрос собран: ${out}`);
  console.log(`  строк: ${Object.keys(source).length} · язык-источник: ${SOURCE_LANG}`);
  console.log(`  просим языки: ${targets.join(", ")}`);
  if (missing.length) console.log(`  из них ещё нет в словаре: ${missing.join(", ")}`);
  console.log(`\nОтдайте этот файл внешней модели. Полученный ответ вложите обратно:`);
  console.log(`  node scripts/i18n-import.mjs ${name} <файл-с-ответом.json>`);
}

// Файл служит и командой, и источником общих определений для `i18n-import.mjs`.
// Без этой проверки импорт запускал бы экспорт заодно: словарь и список языков
// объявлены здесь, а `import` выполняет модуль целиком.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

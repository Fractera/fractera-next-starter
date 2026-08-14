// i18n-import — вложить перевод от ВНЕШНЕЙ модели обратно в словарь (владелец 2026-08-14).
//
// 🔒 ЭТОТ СКРИПТ НЕ ДОВЕРЯЕТ ОТВЕТУ МОДЕЛИ, И В ЭТОМ ВЕСЬ ЕГО СМЫСЛ. Перевод
// приходит от системы, которой мы не управляем, и ошибается она тихо: теряет
// ключ, переводит плейсхолдер `{roles}` как «{роли}», возвращает английский
// текст под видом французского, оборачивает JSON в ```json. Всё это ломает
// страницу ИМЕННО в том языке, который никто не открывает, — то есть будет
// найдено клиентом.
//
// Поэтому проверки идут ДО записи, и файл не трогается, пока хоть одна не
// прошла. Перевод либо вкладывается целиком и здоровым, либо не вкладывается.
//
// Использование:
//   node scripts/i18n-import.mjs home ~/Downloads/home.translated.json
//   node scripts/i18n-import.mjs home <файл> --force   (принять с предупреждениями)

import fs from "node:fs";
import { DICTS, SOURCE_LANG } from "./i18n-export.mjs";

const PLACEHOLDER = /\{(\w+)\}/g;

function placeholders(s) {
  return (String(s).match(PLACEHOLDER) ?? []).sort().join(",");
}

function unwrap(raw) {
  // Модель нередко оборачивает ответ в ```json … ``` или кладёт его под ключ.
  const text = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "");
  const data = JSON.parse(text);
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (data.translations && typeof data.translations === "object") return data.translations;
    return data;
  }
  throw new Error("Ответ не похож на объект языков");
}

function main() {
  const [name, file, ...rest] = process.argv.slice(2);
  const dict = DICTS[name];
  if (!dict || !file) {
    console.error("Использование: node scripts/i18n-import.mjs <словарь> <файл-с-ответом.json> [--force]");
    process.exit(1);
  }
  const force = rest.includes("--force");

  const current = JSON.parse(fs.readFileSync(dict.json, "utf8"));
  const source = current[SOURCE_LANG];
  if (!source) throw new Error(`В словаре нет языка-источника ${SOURCE_LANG}`);
  const keys = Object.keys(source);

  const incoming = unwrap(fs.readFileSync(file, "utf8"));
  const langs = Object.keys(incoming).filter((l) => l !== SOURCE_LANG && /^[a-z]{2}$/.test(l));
  if (!langs.length) throw new Error("В ответе нет ни одного языка");

  const errors = [];
  const warnings = [];

  for (const lang of langs) {
    const got = incoming[lang];
    if (!got || typeof got !== "object") { errors.push(`${lang}: не объект`); continue; }

    const missing = keys.filter((k) => !(k in got) || !String(got[k] ?? "").trim());
    if (missing.length) errors.push(`${lang}: не хватает ключей (${missing.length}): ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? "…" : ""}`);

    const extra = Object.keys(got).filter((k) => !keys.includes(k));
    if (extra.length) warnings.push(`${lang}: лишние ключи (${extra.length}): ${extra.slice(0, 6).join(", ")}`);

    // Плейсхолдеры — единственная поломка, которую невозможно заметить глазами
    // при беглом просмотре чужого языка, и единственная, которая роняет страницу.
    for (const k of keys) {
      if (!(k in got)) continue;
      const a = placeholders(source[k]);
      const b = placeholders(got[k]);
      if (a !== b) errors.push(`${lang}.${k}: плейсхолдеры разошлись (было «${a || "—"}», стало «${b || "—"}»)`);
    }

    // Английский, вернувшийся под чужим кодом языка, — частый и тихий отказ
    // модели. Это предупреждение, а не ошибка: короткие слова законно совпадают.
    const same = keys.filter((k) => String(got[k] ?? "").trim() === String(source[k] ?? "").trim());
    if (same.length > keys.length * 0.6) {
      warnings.push(`${lang}: ${same.length} из ${keys.length} строк дословно равны английским — похоже, перевода не было`);
    }
  }

  if (errors.length) {
    console.error("Перевод НЕ вложен — ответ не прошёл проверку:\n  " + errors.join("\n  "));
    if (warnings.length) console.error("\nПредупреждения:\n  " + warnings.join("\n  "));
    process.exit(1);
  }
  if (warnings.length && !force) {
    console.error("Перевод НЕ вложен — есть предупреждения:\n  " + warnings.join("\n  "));
    console.error("\nЕсли это ожидаемо, повторите с --force.");
    process.exit(1);
  }

  // Порядок ключей берётся у источника: словарь остаётся сравнимым построчно,
  // и следующая правка не превращается в перемешанный дифф.
  const next = { ...current };
  for (const lang of langs) {
    const ordered = {};
    for (const k of keys) ordered[k] = String(incoming[lang][k]).trim();
    next[lang] = ordered;
  }

  fs.writeFileSync(dict.json, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`Вложено языков: ${langs.length} (${langs.join(", ")})`);
  console.log(`Словарь: ${dict.json} · языков всего: ${Object.keys(next).length}`);
  if (warnings.length) console.log("Предупреждения (приняты с --force):\n  " + warnings.join("\n  "));
  console.log("\nЧтобы языки появились на сайте, их надо включить в панели («Языки») — набор запекается на сборке.");
}

main();

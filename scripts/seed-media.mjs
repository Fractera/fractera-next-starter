// Посев картинок каталога В ХРАНИЛИЩЕ, а не в папку (шаг 506.3, требование
// владельца 2026-08-13). Запуск: `npm run seed:media`.
//
// 🔒 ЗАЧЕМ ЭТО ВООБЩЕ. Стартер обязан показывать ОБРАЗЕЦ работы с изображениями,
// а показывал исключение: яблоко и апельсин лежали файлами в `public/`, и
// поменять картинку товара клиент мог только правкой репозитория. Весь рассказ о
// продукте — «панель меняет содержимое без пересборки», и картинки ему
// противоречили. Пример, который учит неверной форме, дороже отсутствующего.
//
// 🔒 ПОЧЕМУ ОРИГИНАЛ, А НЕ НАБОР ВАРИАНТОВ (решение владельца 2026-08-13).
// В хранилище кладётся ОДИН файл — оригинал, — а размеры и форматы производятся
// по требованию и кешируются. Причина не в экономии места: набор, нарезанный
// заранее, есть догадка о том, какие размеры понадобятся вёрстке, и он молча
// устаревает при первой же её правке. Формат браузеру подбирает оптимизатор сам,
// поэтому нарезка форматов в базу удвоила бы уже работающий механизм.
// В записи остаётся то, чего оптимизатор знать НЕ МОЖЕТ: ширина, высота и
// размытая подложка — их считает слой данных при загрузке.
//
// PNG, А НЕ SVG. Вектор не оптимизируется по построению (Next включает
// `unoptimized` для `.svg` сам), и подложка ему не нужна — то есть на SVG образец
// не показать. Растр рисуется здесь же из тех же геометрических фигур: свои
// картинки, без внешних ссылок и чужих лицензий.
//
// ИДЕМПОТЕНТНОСТЬ — ОБЯЗАТЕЛЬНА. Скрипт зовётся при каждом развёртывании, и
// повторная загрузка плодила бы дубликаты в хранилище при каждом старте.
// Опознаём по имени файла: оно наше и постоянное.
//
// 🔒 НИКОГДА НЕ ВАЛИТ СБОРКУ (найдено аудитом 2026-08-13). Скрипт вызывается из
// `prebuild`, то есть стоит между разработчиком и его приложением. Слой данных в
// этот момент может быть ещё не поднят — на свежем сервере порядок запуска служб
// не гарантирован, — и тогда посев не удастся. Это НОРМА: картинки досеются при
// следующей сборке, а страницы честно покажут запасные файлы из `public/`.
// Сборка, отказавшая из-за посевной картинки, — несопоставимо дороже.
// Поэтому каждая загрузка под своей защитой, а код выхода всегда нулевой.

import { readFileSync } from "node:fs";
import sharp from "sharp";

const DATA_URL = process.env.REMOTE_DATA_URL ?? "http://localhost:3300";
// 🔒 ИМЯ КЛЮЧА — `DATA_SECRET`, и оно читается ИЗ `.env.local` САМИМ СКРИПТОМ.
// Первый заход отбило `Unauthorized`: скрипт спрашивал `DATA_API_KEY` — имя,
// которое встречается в прокси приложения, но в окружении сервера его нет. Слой
// данных сверяет заголовок `x-data-secret` с `DATA_SECRET`, и это единственное
// имя, у которого здесь есть право быть.
const DATA_SECRET = process.env.DATA_SECRET ?? readEnvLocal("DATA_SECRET");

/** Скрипт запускают напрямую (`npm run seed:media`), вне окружения Next, поэтому
 *  `.env.local` никто за нас не прочитает. */
function readEnvLocal(key) {
  try {
    const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq > 0 && t.slice(0, eq).trim() === key) return t.slice(eq + 1).trim();
    }
  } catch { /* нет файла — работаем без ключа, слой данных ответит сам */ }
  return "";
}

// Имя в хранилище — оно же признак «уже посеяно». Меняя его, вы получите вторую
// копию картинки, а не замену первой.
const SEEDS = [
  { file: "seed-apple.png", label: "Apple", body: "#e23b3b", stem: "#6b4a2f", leaf: "#3f9e4d" },
  { file: "seed-orange.png", label: "Orange", body: "#f08a24", stem: "#6b4a2f", leaf: "#3f9e4d" },
];

const SIZE = 1024;

// Картинки МАТЕРИАЛОВ — те же правила, другой источник: они не рисуются здесь, а
// едут с проектом файлами и загружаются в хранилище как есть. Материал ссылается
// на них по имени (media:<файл>), поэтому имя тут и есть договор.
const FILE_SEEDS = ["development-loop.jpg"];

/** Плод: круг, черенок, лист. Тот же рисунок, что был в SVG-заглушках. */
function fruitSvg({ body, stem, leaf }) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#faf7f2"/>
  <rect x="48.5" y="20" width="3" height="16" rx="1.5" fill="${stem}"/>
  <path d="M52 26 C60 18, 72 20, 74 28 C66 36, 55 34, 52 26 Z" fill="${leaf}"/>
  <circle cx="50" cy="60" r="28" fill="${body}"/>
  <ellipse cx="40" cy="50" rx="7" ry="10" fill="#ffffff" opacity="0.22"/>
</svg>`);
}

function headers() {
  const h = {};
  if (DATA_SECRET) h["X-Data-Secret"] = DATA_SECRET;
  return h;
}

async function existingByName(name) {
  try {
    const res = await fetch(`${DATA_URL}/media`, { headers: headers() });
    if (!res.ok) return null;
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    return items.find(i => i.name === name) ?? null;
  } catch {
    return null;
  }
}

async function upload(name, buffer) {
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: name.endsWith(".jpg") ? "image/jpeg" : "image/png" }), name);
  form.append("title", name.replace(/^seed-|\.png$/g, ""));
  const res = await fetch(`${DATA_URL}/media/upload`, { method: "POST", headers: headers(), body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(String(data?.error ?? `upload failed: ${res.status}`));
  return data.item;
}

const out = [];
for (const seed of SEEDS) {
  try {
  const found = await existingByName(seed.file);
  if (found) {
    console.log(`  уже в хранилище: ${seed.file} (${found.id})`);
    out.push(found);
    continue;
  }
  const png = await sharp(fruitSvg(seed)).png({ compressionLevel: 9 }).toBuffer();
  const item = await upload(seed.file, png);
  console.log(`  загружено: ${seed.file} → ${item.id} (${item.width}×${item.height}, подложка ${item.blur ? "есть" : "НЕТ"})`);
  out.push(item);
  } catch (e) {
    console.log(`  посев пропущен: ${seed.file} (${e.message})`);
  }
}

// ── Картинки материалов ──────────────────────────────────────────────────────
//
// Иллюстрации статей едут с проектом файлами и загружаются в хранилище как есть:
// рисовать их, как плоды выше, нечего — это готовые изображения. Материал
// ссылается на них по ИМЕНИ (`media:<файл>`), поэтому имя здесь и есть договор
// между содержимым и хранилищем.
for (const name of FILE_SEEDS) {
  const found = await existingByName(name);
  if (found) { console.log(`  уже в хранилище: ${name} (${found.id})`); continue; }
  try {
    const buf = readFileSync(new URL(`../public/blog-media/${name}`, import.meta.url));
    const item = await upload(name, buf);
    console.log(`  загружено: ${name} → ${item.id} (${item.width}×${item.height}, подложка ${item.blur ? "есть" : "НЕТ"})`);
  } catch (e) {
    console.log(`  картинка материала пропущена: ${name} (${e.message})`);
  }
}

// ── Привязка посевных товаров к этим картинкам ───────────────────────────────
//
// 🔒 БЕЗ ЭТОГО ШАГА ВСЯ РАБОТА НЕ ВИДНА. Картинки лежали бы в хранилище с
// размерами и подложкой, а каталог продолжал смотреть на старые SVG в `public/` —
// то есть образец работы с базой существовал бы, и его никто бы не увидел.
//
// Размеры и подложка КОПИРУЮТСЯ в строку товара, а не запрашиваются при показе:
// на странице каталога две дюжины товаров, и два десятка обращений к хранилищу за
// размерами превратили бы заранее собранную страницу в цепочку запросов.
const LINK = [
  { match: /apple/i, media: out.find(i => i.name === "seed-apple.png") },
  { match: /orange/i, media: out.find(i => i.name === "seed-orange.png") },
];

try {
  const res = await fetch(`${DATA_URL}/db/tables/products`, { headers: headers() });
  const rows = res.ok ? ((await res.json()).rows ?? []) : [];
  const products = Array.isArray(rows) ? rows : [];
  for (const row of products) {
    const link = LINK.find(l => l.match.test(String(row.name ?? "")));
    if (!link?.media) continue;
    const url = `/api/media/${link.media.id}/file`;
    // 🔒 СВЕРЯЕМ НЕ ТОЛЬКО АДРЕС (найдено на живом сервере 2026-08-13). Сначала
    // здесь стояло сравнение одного `media_url`, и связывание, прошедшее ДО
    // появления колонок размеров, считалось выполненным навсегда: адрес совпал,
    // скрипт сказал «уже связан», а товар остался без подложки. Проверка обязана
    // спрашивать про ВСЁ, что она записывает, иначе идемпотентность превращается
    // в отказ доделать начатое.
    const done = row.media_url === url && row.media_width === link.media.width && Boolean(row.media_blur);
    if (done) { console.log(`  товар уже связан: ${row.name}`); continue; }
    const patch = await fetch(`${DATA_URL}/db/tables/products/rows/${encodeURIComponent(row.id)}`, {
      method: "PATCH",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        media_id: link.media.id,
        media_url: url,
        media_width: link.media.width,
        media_height: link.media.height,
        media_blur: link.media.blur ?? "",
      }),
    });
    console.log(`  товар связан: ${row.name} → ${link.media.name} (${patch.ok ? "ok" : "ОТКАЗ " + patch.status})`);
  }
} catch (e) {
  console.log(`  привязка товаров пропущена: ${e.message}`);
}

// Печатаем итог машиночитаемо: посев товаров подставляет эти адреса, и второго
// источника правды об адресах быть не должно.
console.log(`===SEED_MEDIA_OK=== ${JSON.stringify(out.map(i => ({ id: i.id, name: i.name, width: i.width, height: i.height, hasBlur: Boolean(i.blur) })))}`);

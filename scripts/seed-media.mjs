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

import sharp from "sharp";

const DATA_URL = process.env.REMOTE_DATA_URL ?? "http://localhost:3300";
const DATA_SECRET = process.env.DATA_API_KEY ?? "";

// Имя в хранилище — оно же признак «уже посеяно». Меняя его, вы получите вторую
// копию картинки, а не замену первой.
const SEEDS = [
  { file: "seed-apple.png", label: "Apple", body: "#e23b3b", stem: "#6b4a2f", leaf: "#3f9e4d" },
  { file: "seed-orange.png", label: "Orange", body: "#f08a24", stem: "#6b4a2f", leaf: "#3f9e4d" },
];

const SIZE = 1024;

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
  form.append("file", new Blob([buffer], { type: "image/png" }), name);
  form.append("title", name.replace(/^seed-|\.png$/g, ""));
  const res = await fetch(`${DATA_URL}/media/upload`, { method: "POST", headers: headers(), body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(String(data?.error ?? `upload failed: ${res.status}`));
  return data.item;
}

const out = [];
for (const seed of SEEDS) {
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
}

// Печатаем итог машиночитаемо: посев товаров подставляет эти адреса, и второго
// источника правды об адресах быть не должно.
console.log(`===SEED_MEDIA_OK=== ${JSON.stringify(out.map(i => ({ id: i.id, name: i.name, width: i.width, height: i.height, hasBlur: Boolean(i.blur) })))}`);

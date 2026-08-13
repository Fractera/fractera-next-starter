// Машинная приёмка языковых сигналов публичных страниц (шаг 503).
// Запуск: npm run check:seo
//
// ЗАЧЕМ ОНА СУЩЕСТВУЕТ. Пропажу, ради которой она написана, нельзя увидеть глазами:
// страницы открываются, переключатель языка работает, сайт выглядит исправным — а
// каждая языковая версия главной объявляет каноническим английский корень, то есть
// дословно просит поисковик её не индексировать. Набор адресов, ни один из которых
// не назвал себя оригиналом и не назвал своих переводов, — это то, что поисковик
// называет дорвеем; теряется при этом не позиция, а присутствие целых языков.
//
// Проверка ловит именно СОСТОЯНИЕ ДЕРЕВА, а не поведение сборки: страница либо
// объявляет свои альтернативы, либо нет. Поэтому она дешёвая (чтение файлов) и её
// можно гонять на каждой правке.
//
// Что проверяется:
//   1. У каждой публичной страницы есть `generateMetadata`.
//   2. В её метаданных есть `alternates` — либо своим вызовом `buildAlternates`,
//      либо через сборщик, который его зовёт.
//   3. Никто не строит адреса руками: `${SITE}/${lang}` в карте сайта или в мете —
//      это второй источник правды, и он расходится с первым в одноязычном режиме.
//   4. Макет `[lang]/layout.tsx` НЕ объявляет канонический адрес: метаданные
//      наследуются, и его canonical достался бы каждой забывчивой странице.
//
// Выход: код 1 при любой ОШИБКЕ, 0 при одних предупреждениях.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LANG_DIR = path.join(ROOT, "app", "[lang]");

const errors = [];
const warnings = [];

// Группы прав — не публичная поверхность: их страницы за ролью и не индексируются,
// альтернативы им не нужны и были бы вредны (мы бы объявили закрытые адреса).
const PRIVATE_MARKERS = ["(protectedLayer)"];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === "page.tsx") out.push(full);
  }
  return out;
}

const pages = fs.existsSync(LANG_DIR) ? walk(LANG_DIR) : [];
if (!pages.length) errors.push("не найдено ни одной страницы под app/[lang] — проверка смотрит не туда");

// Страница может быть тонкой (`page.tsx` реэкспортирует вход из `_components/index.tsx`),
// поэтому метаданные ищем в обоих файлах — как их видит Next.
function metadataSources(pageFile) {
  const dir = path.dirname(pageFile);
  const candidates = [
    pageFile,
    path.join(dir, "_components", "index.tsx"),
    path.join(dir, "_components", "index.ts"),
  ];
  return candidates.filter(f => fs.existsSync(f)).map(f => ({ file: f, text: fs.readFileSync(f, "utf8") }));
}

const rel = f => path.relative(ROOT, f).replace(/\\/g, "/");

// Комментарии — это ПРОЗА, а не код, и проверять её нельзя. Первый же прогон этой
// проверки упал на объяснении внутри `app/sitemap.ts`: там дословно приведён
// запрещённый образец `${site}/${lang}`, чтобы будущий читатель понял, что именно
// убрали. Проверка, которая падает на описании собственного правила, учит
// разработчика удалять объяснения — ровно наоборот тому, что нужно.
function codeOnly(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

for (const page of pages) {
  const relPage = rel(page);
  if (PRIVATE_MARKERS.some(m => relPage.includes(m))) continue;

  const sources = metadataSources(page);
  const joined = codeOnly(sources.map(s => s.text).join("\n"));

  // 1 — метаданные вообще объявлены.
  if (!/export\s+(async\s+)?function\s+generateMetadata|export\s+const\s+metadata|generateMetadata\s*[,}]/.test(joined)) {
    errors.push(`${relPage}: нет generateMetadata — страница возьмёт метаданные у макета, включая чужой заголовок`);
    continue;
  }

  // 2 — альтернативы. Либо прямой вызов, либо страница построена общим сборщиком
  // контента (`createContentPage` / `createContentPost`), который зовёт его сам.
  const hasOwn = /buildAlternates\s*\(/.test(joined);
  const viaBuilder = /createContentPage|createContentPost/.test(joined);
  if (!hasOwn && !viaBuilder) {
    errors.push(`${relPage}: нет alternates — страница не назовёт ни себя оригиналом, ни своих переводов`);
  }

  // 3 — `og:url` не наследуется. Правило написано по регрессии того же шага 503:
  // страница, объявляющая `openGraph` руками, раньше брала адрес у макета — а тот
  // на ВСЕХ языках указывал на корень сайта, и ссылка из карточки в мессенджере
  // вела не туда. Когда умолчание макета убрали, неверный адрес честно исчез, и
  // сразу стало видно, что верный никто не подставил. Забыть его легко: карточку
  // соцсети никто не открывает во время разработки.
  const declaresOg = /openGraph\s*:\s*\{/.test(joined);
  const ogHasUrl = /openGraph\s*:\s*\{[^}]*\burl\s*:/s.test(joined);
  if (declaresOg && !ogHasUrl && !viaBuilder) {
    errors.push(`${relPage}: openGraph без url — карточка в соцсети сошлётся не на эту страницу`);
  }
}

// 3 — адреса строятся одним механизмом. Ручная склейка `${…}/${lang}` в карте сайта
// или в метаданных — второй источник правды, расходящийся в одноязычном режиме.
const URL_BUILDERS = [
  path.join(ROOT, "app", "sitemap.ts"),
  path.join(ROOT, "app", "products", "sitemap.ts"),
];
for (const file of URL_BUILDERS) {
  if (!fs.existsSync(file)) continue;
  const text = codeOnly(fs.readFileSync(file, "utf8"));
  if (/\$\{\s*(site|SITE|base|BASE)\s*\}\/\$\{\s*lang\s*\}/.test(text)) {
    errors.push(`${rel(file)}: адрес склеен вручную с языком — в одноязычном режиме это ссылка на 301; строить через urlFor()`);
  }
  if (!/urlFor\s*\(/.test(text)) {
    warnings.push(`${rel(file)}: не использует urlFor() — проверьте, откуда берутся адреса`);
  }
}

// 4 — макет не раздаёт свой канонический адрес по наследству.
const layout = path.join(LANG_DIR, "layout.tsx");
if (fs.existsSync(layout)) {
  const text = codeOnly(fs.readFileSync(layout, "utf8"));
  if (/alternates\s*:/.test(text) || /pathname\s*:/.test(text)) {
    errors.push(
      "app/[lang]/layout.tsx: макет объявляет canonical/pathname — метаданные наследуются, и его адрес достанется каждой странице без своих alternates",
    );
  }
}

// 5 — КАЖДЫЙ ПУБЛИЧНЫЙ РАЗДЕЛ ПРЕДСТАВЛЕН В КАРТЕ САЙТА (добавлено 2026-08-13).
//
// Проверки 1-4 стерегут КАЧЕСТВО сигналов у страницы, которая до карты дошла, и
// молчат о странице, которой в карте нет вовсе. Так и вышло: блог отдавал 200,
// посты были написаны и переведены, `check:seo` был зелёным — а карта знала
// только главную и товары. Ненайденная страница не выигрывает от идеального
// `hreflang`, и цена ошибки выше, чем у всего, что ловят проверки выше.
//
// Раздел считается представленным, если карта упоминает его путь — своя карта
// (`<раздел>/sitemap.ts`) засчитывается наравне с общей: товары вынесены
// отдельно намеренно, из-за роста в рантайме.
{
  const mainMap = path.join(ROOT, "app", "sitemap.ts");
  // Комментарии и импорты — не карта. Первый негативный контроль этой проверки
  // прошёл ЗЕЛЁНЫМ именно из-за импорта `./[lang]/blog/_list.generated`: строка
  // `/blog` в нём засчитывалась за присутствие раздела в карте. Проверка, которую
  // удовлетворяет строка импорта, не проверяет ничего.
  const mainText = (fs.existsSync(mainMap) ? codeOnly(fs.readFileSync(mainMap, "utf8")) : "")
    .split("\n")
    .filter(line => !line.trim().startsWith("import"))
    .join("\n");
  // Раздел — это директория со СТРАНИЦЕЙ. Рядом лежат машинные маршруты
  // (`llms.txt/`, `manifest.webmanifest/`, `index.md/` — папки с route.ts): они
  // сами являются служебными файлами и в карте страниц им делать нечего.
  const sections = fs
    .readdirSync(LANG_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("("))
    .filter(d => fs.existsSync(path.join(LANG_DIR, d.name, "page.tsx")))
    .map(d => d.name);

  for (const section of sections) {
    const ownMap = fs.existsSync(path.join(ROOT, "app", section, "sitemap.ts"));
    if (ownMap || mainText.includes(`/${section}`)) continue;
    errors.push(
      `раздел /${section} не представлен ни в app/sitemap.ts, ни своей картой — поисковик о нём не узнает`,
    );
  }
}

console.log(`публичных страниц: ${pages.filter(p => !PRIVATE_MARKERS.some(m => rel(p).includes(m))).length}`);
for (const w of warnings) console.log(`  предупреждение: ${w}`);
for (const e of errors) console.log(`  ОШИБКА: ${e}`);

if (errors.length) {
  console.log(`\n===SEO_FAILED=== ошибок: ${errors.length}`);
  process.exit(1);
}
console.log(`\n===SEO_OK=== ошибок нет, предупреждений: ${warnings.length}`);

// Машинная приёмка КОНТРАСТА (шаг 506, вопрос владельца 2026-08-13:
// «как подойти системно, чтобы этой ошибки не возникало в будущем?»).
// Запуск: npm run check:contrast
//
// 🔒 КОРЕНЬ НЕ В ПАЛИТРЕ, А В ПРИВЫЧКЕ ГАСИТЬ ТЕКСТ ПРОЗРАЧНОСТЬЮ.
//
// Палитра рассчитана верно: `muted-foreground` на `background` даёт отношение
// выше порога в обеих темах. Но стоит написать `text-muted-foreground/70` — и
// цвет смешивается с фоном, отношение падает ниже нормы, а на экране разница
// почти не видна. Так и вышло: `text-foreground/35` у примечания статьи,
// `text-muted-foreground/70` в оглавлении. Ни один человек этого не заметит,
// пока не запустит проверку, и чинить это по одному элементу — догонялки без
// конца, потому что следующая правка добавит новый.
//
// Отсюда две проверки, и вместе они закрывают вопрос:
//   1. САМА ПАЛИТРА — считаем настоящее отношение контраста для пар «текст на
//      фоне» в светлой и тёмной теме. Если однажды кто-то осветлит токен,
//      сборка откажет, и это лучше, чем узнать от покупателя.
//   2. ПРОЗРАЧНОСТЬ НА ТЕКСТЕ — запрещена. Приглушить текст можно другим
//      токеном (`muted-foreground` для того и есть), а не долей от него.
//      Прозрачность у РАМОК, ФОНОВ и НАВЕДЕНИЯ остаётся: там она не решает,
//      прочтёт человек слово или нет.
//
// Порог 4.5:1 — норма для обычного текста (WCAG AA). Крупный текст допускает
// 3:1, но мы не пытаемся угадать по классу, крупный он или нет: строгий порог
// для всего честнее, чем разрешение, выданное по догадке о размере шрифта.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CSS = path.join(ROOT, "config", "design", "design-minimal-001.css");
const SCAN_DIRS = ["app", "components", "lib"];

const errors = [];
const warnings = [];

// ── Цвет: oklch → sRGB → относительная яркость ────────────────────────────────

function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [r, g, bl].map(v => Math.min(1, Math.max(0, v)));
}

/** Относительная яркость по WCAG. Вход — линейные каналы sRGB. */
function luminance([r, g, b]) {
  const lin = c => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
  const toLinear = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [R, G, B] = [lin(r), lin(g), lin(b)].map(toLinear);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrast(c1, c2) {
  const [a, b] = [luminance(c1), luminance(c2)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

// ── 1. Палитра ────────────────────────────────────────────────────────────────

const css = fs.existsSync(CSS) ? fs.readFileSync(CSS, "utf8") : "";

/** Токены темы: всё до первого `.dark` — светлая, после — тёмная. */
function tokensOf(text) {
  const out = {};
  for (const m of text.matchAll(/--([a-z-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)?\)/g)) {
    out[m[1]] = oklchToRgb(Number(m[2]), Number(m[3]), Number(m[4] ?? 0));
  }
  return out;
}

const darkAt = css.indexOf(".dark");
const light = tokensOf(darkAt > 0 ? css.slice(0, darkAt) : css);
const dark = darkAt > 0 ? tokensOf(css.slice(darkAt)) : {};

// Пары «что на чём читают». Не весь перебор: сюда попадает только то, что в
// продукте действительно стоит рядом.
const PAIRS = [
  ["foreground", "background"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["primary", "background"],
  ["primary-foreground", "primary"],
  ["destructive", "background"],
];

const MIN = 4.5;

for (const [theme, tokens] of [["светлая", light], ["тёмная", dark]]) {
  if (!Object.keys(tokens).length) continue;
  for (const [fg, bg] of PAIRS) {
    if (!tokens[fg] || !tokens[bg]) continue;
    const ratio = contrast(tokens[fg], tokens[bg]);
    if (ratio < MIN) {
      errors.push(`палитра (${theme}): ${fg} на ${bg} = ${ratio.toFixed(2)}:1, нужно ${MIN}:1`);
    } else if (ratio < MIN + 0.5) {
      warnings.push(`палитра (${theme}): ${fg} на ${bg} = ${ratio.toFixed(2)}:1 — впритык к порогу`);
    }
  }
}

// ── 2. Прозрачность на тексте ─────────────────────────────────────────────────

const TEXT_OPACITY = /\btext-(foreground|muted-foreground|primary|primary-foreground|destructive|secondary-foreground|accent-foreground)\/(\d+)\b/g;

function walk(dir) {
  const out = [];
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

/**
 * Комментарии заменяются пробелами (длина сохраняется, чтобы номера строк не
 * поехали).
 *
 * 🔒 БЕЗ ЭТОГО СТОРОЖ ЛОВИТ СОБСТВЕННОЕ ОБЪЯСНЕНИЕ. Первый же прогон нашёл
 * «нарушение» в комментарии, который рассказывает, ПОЧЕМУ так делать нельзя.
 * Проект уже проходил это с `check:content`: сторож, запрещающий ГОВОРИТЬ о
 * дефекте, заставляет писать код без объяснений — а объяснение здесь ценнее
 * самой проверки.
 */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + " ".repeat(m.length - p.length));
}

for (const rel of SCAN_DIRS.flatMap(walk)) {
  const text = stripComments(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  for (const m of text.matchAll(TEXT_OPACITY)) {
    // Наведение и фокус меняют цвет на ВРЕМЯ действия и всегда в сторону
    // контраста — их не трогаем.
    const before = text.slice(Math.max(0, m.index - 12), m.index);
    if (/(hover|focus|active|group-hover):$/.test(before)) continue;
    const line = text.slice(0, m.index).split("\n").length;
    errors.push(`${rel}:${line}: \`${m[0]}\` — прозрачность на тексте; возьмите другой токен, а не долю от него`);
  }
}

console.log(`палитра: ${Object.keys(light).length} токенов светлой темы, ${Object.keys(dark).length} тёмной`);
for (const w of warnings) console.log(`  предупреждение: ${w}`);
for (const e of errors) console.log(`  ОШИБКА: ${e}`);

if (errors.length) {
  console.log(`\n===CONTRAST_FAILED=== ошибок: ${errors.length}`);
  process.exit(1);
}
console.log(`\n===CONTRAST_OK=== ошибок нет, предупреждений: ${warnings.length}`);

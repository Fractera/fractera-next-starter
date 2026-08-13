// Машинная приёмка ССЫЛОК, уводящих с сайта (владелец 2026-08-13).
// Запуск: npm run check:links
//
// 🔒 ЧТО ЭТО ЛОВИТ. Next заранее подтягивает страницы по видимым ссылкам. Для
// внутренних адресов это польза; для адресов авторизации — вред, потому что они
// уводят переадресацией на ДРУГОЙ домен (слой авторизации живёт на своём). Браузер
// видит запрос через границу источника, не находит разрешающего заголовка и пишет
// в консоль ошибку CORS — на КАЖДОЙ странице, где такая ссылка видна.
//
// Посетитель при этом не страдает: вход и выход работают по нажатию. Но покупатель,
// открывший свой сайт инструментом проверки, первым делом видит красные строки —
// и справедливо считает, что продукт сломан. У владельца их было девять на
// страницу, и все девять — предзагрузка, которой никто не просил.
//
// Чинить по одной ссылке бессмысленно: следующая появится через месяц. Список
// адресов уже существует и живёт в `proxy.ts` (`AUTH_FORM_PATHS`) — сторож читает
// ЕГО, а не свою копию, поэтому новый адрес авторизации попадает под правило сам.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const errors = [];

// ── Список адресов берётся из proxy.ts, а не дублируется здесь ───────────────
const proxySrc = fs.readFileSync(path.join(ROOT, "proxy.ts"), "utf8");
const listMatch = proxySrc.match(/AUTH_FORM_PATHS\s*=\s*new Set\(\[([^\]]*)\]/);
if (!listMatch) {
  console.log("  ОШИБКА: не найден AUTH_FORM_PATHS в proxy.ts — проверять нечего");
  console.log("\n===LINKS_FAILED=== ошибок: 1");
  process.exit(1);
}
const AUTH_PATHS = [...listMatch[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map(m => m[1]);

function walk(dir) {
  const out = [];
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const e of fs.readdirSync(full, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

/** Комментарии — не код: сторож не должен ловить объяснение, почему так нельзя. */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + " ".repeat(m.length - p.length));
}

for (const rel of ["app", "components", "lib"].flatMap(walk)) {
  const text = stripComments(fs.readFileSync(path.join(ROOT, rel), "utf8"));

  // Каждый `<Link …>` целиком, вместе с атрибутами.
  for (const m of text.matchAll(/<Link\b[^>]*>/g)) {
    const tag = m[0];
    const hrefMatch = tag.match(/href=\{?[`"']([^`"'{}]*)/);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    const hitsAuth = AUTH_PATHS.some(p => href === p || href.startsWith(p + "?"));
    if (!hitsAuth) continue;
    if (/prefetch=\{false\}/.test(tag)) continue;
    const line = text.slice(0, m.index).split("\n").length;
    errors.push(`${rel}:${line}: <Link href="${href}"> без prefetch={false} — адрес авторизации уводит на другой домен, предзагрузка даст ошибку CORS`);
  }
}

console.log(`адреса авторизации: ${AUTH_PATHS.join(", ")}`);
for (const e of errors) console.log(`  ОШИБКА: ${e}`);

if (errors.length) {
  console.log(`\n===LINKS_FAILED=== ошибок: ${errors.length}`);
  process.exit(1);
}
console.log(`\n===LINKS_OK=== ошибок нет`);

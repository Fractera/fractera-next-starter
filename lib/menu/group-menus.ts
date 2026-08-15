import "server-only";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { MENU_SLOTS, type MenuSlot } from "./menu-types";

// Build-time menu source (step 160). The always-present menu components ask this for
// "which groups belong in slot X, in what order". It SCANS the on-disk group manifests
// (app/[lang]/<group>/_data/group.ts) and parses them as TEXT — never importing the
// composed engine (lib/content-<ver>), which is materialized at runtime and may be
// absent in a fresh starter. So the menus compile and render with zero groups (→ null).
// No DB, no dynamic functions → the [lang] tree stays statically prerendered.

export type { MenuSlot };

// `href` НЕОБЯЗАТЕЛЕН И ПОЯВИЛСЯ ПОЗЖЕ (2026-08-12). Пункт, пришедший из
// манифеста группы на диске, живёт по адресу `/<язык>/<slug>` — там и лежит его
// папка. Пункт, собранный владельцем в панели, адрес несёт свой: группа может
// быть виртуальной («Компания»), а её дети — вести куда угодно. Отсутствие
// поля означает прежнее правило, поэтому старые вызовы не тронуты.
export type MenuChild = { slug: string; title: string; href?: string };
export type MenuGroup = {
  slug: string;
  label: string;
  order: number;
  childrenAsDropdown: boolean;
  roles: string;
  children: MenuChild[];
  href?: string;
};

const LANG_ROOT = join(process.cwd(), "app", "[lang]");
const isDir = (p: string) => { try { return statSync(p).isDirectory(); } catch { return false; } };
const read = (p: string) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

// Parse one _data/group.ts as text (mirrors manage-group.mjs parseManifest; defensive).
function parseManifest(src: string) {
  const slug = src.match(/slug:\s*'([^']*)'/)?.[1] ?? "";
  const roles = src.match(/roles:\s*"([^"]*)"/)?.[1] ?? "public";
  const cad = src.match(/childrenAsDropdown:\s*(true|false)/)?.[1] === "true";
  const menus: Record<MenuSlot, { enabled: boolean; order: number }> = {
    top: { enabled: false, order: 10 }, footer: { enabled: false, order: 10 },
    left: { enabled: false, order: 10 }, right: { enabled: false, order: 10 },
  };
  for (const s of MENU_SLOTS) {
    const m = src.match(new RegExp(`${s}:\\s*\\{\\s*enabled:\\s*(true|false),\\s*order:\\s*(\\d+)`));
    if (m) menus[s] = { enabled: m[1] === "true", order: parseInt(m[2], 10) };
  }
  return { slug, roles, childrenAsDropdown: cad, menus };
}

// Per-language menu label for a group: its _data/<lang>.ts eyebrow, then en, then slug.
function groupLabel(groupDir: string, slug: string, lang: string): string {
  for (const l of [lang, "en"]) {
    const m = read(join(groupDir, "_data", `${l}.ts`)).match(/eyebrow:\s*'([^']*)'/);
    if (m?.[1]) return m[1];
  }
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Child pages of a group = its subfolders holding a page.tsx (excluding _data/_lib/_components).
function groupChildren(groupDir: string, lang: string): MenuChild[] {
  const out: MenuChild[] = [];
  let entries: string[] = [];
  try { entries = readdirSync(groupDir); } catch { return out; }
  for (const name of entries) {
    if (name.startsWith("_") || name.startsWith("[")) continue;
    const childDir = join(groupDir, name);
    if (!isDir(childDir) || !existsSync(join(childDir, "page.tsx"))) continue;
    let title = name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    for (const l of [lang, "en"]) {
      const t = read(join(childDir, "_data", `${l}.ts`)).match(/title:\s*'([^']*)'/)
        ?? read(join(childDir, "_data", "meta.ts")).match(/title:\s*'([^']*)'/);
      if (t?.[1]) { title = t[1]; break; }
    }
    out.push({ slug: name, title });
  }
  return out;
}

// 🔒 ГРУППЫ МАРШРУТОВ `(…)` ПРОЗРАЧНЫ ДЛЯ ЭТОГО ОБХОДА — И ЭТО НЕ УДОБСТВО, А
// ИСПРАВЛЕНИЕ ФАТАЛЬНОГО ДЕФЕКТА (2026-08-15).
//
// ЧТО СЛОМАЛОСЬ. Шаг 507 переложил разделы в явные слои: `blog` и `products`
// уехали из `app/[lang]/` в `app/[lang]/(publicLayer)/`. Обход же смотрел РОВНО
// на первый уровень, и манифестов там больше не было — ни одного. Сканер стал
// возвращать пустой список, и верхнее меню опустело у ВСЕХ и НАВСЕГДА: ссылки
// на блог и каталог исчезли из шапки, хотя обе страницы на месте и открываются
// по прямому адресу.
//
// ПОЧЕМУ ЭТО ИСКАЛИ ТРИЖДЫ И НЕ НАШЛИ. Симптом выглядел как проблема прав:
// «меню пропало после выхода из аккаунта». Роли действительно фильтруют пункты
// (`use-visible-groups.client.ts`), поэтому чинили их — а фильтровать было
// нечего, список приходил пустым ещё с сервера. Ни одна проверка не падала:
// пустое меню — законное состояние свежего проекта, и отличить «групп нет» от
// «групп не нашли» по результату нельзя.
//
// ПОЧЕМУ ИМЕННО ПРОЗРАЧНОСТЬ, А НЕ ЖЁСТКИЙ ПУТЬ К `(publicLayer)`. Скобочная
// группа в Next — приём организации файлов, на адрес страницы она не влияет:
// `(publicLayer)/blog` открывается как `/blog`. Значит и меню обязано её не
// замечать. Впиши мы сюда имя слоя — следующий слой (или переименование этого)
// сломал бы меню ровно так же и так же тихо.
function findGroupDirs(dir: string, depth = 0): string[] {
  // Ограничение глубины — защита от неожиданной вложенности, а не от рекурсии:
  // двух уровней скобок хватает с запасом, а бесконечный обход дерева страниц
  // на сборке стоил бы секунд на пустом месте.
  if (depth > 3) return [];
  const out: string[] = [];
  let entries: string[] = [];
  try { entries = readdirSync(dir); } catch { return out; }
  for (const name of entries) {
    if (name.startsWith("_") || name.startsWith("[") || name.startsWith(".")) continue;
    const child = join(dir, name);
    if (!isDir(child)) continue;
    // Скобочная группа — не раздел сайта: заглядываем внутрь и идём дальше.
    if (name.startsWith("(") && name.endsWith(")")) {
      out.push(...findGroupDirs(child, depth + 1));
      continue;
    }
    if (existsSync(join(child, "_data", "group.ts"))) out.push(child);
  }
  return out;
}

// All composed groups whose manifest enables `slot`, sorted by order then slug.
export function getMenuGroups(slot: MenuSlot, lang: string): MenuGroup[] {
  if (!isDir(LANG_ROOT)) return [];
  const groups: MenuGroup[] = [];
  for (const groupDir of findGroupDirs(LANG_ROOT)) {
    const name = groupDir.split(/[\\/]/).pop() ?? "";
    const gPath = join(groupDir, "_data", "group.ts");
    if (!existsSync(gPath)) continue;
    const m = parseManifest(read(gPath));
    if (!m.menus[slot].enabled) continue;
    groups.push({
      slug: m.slug || name,
      label: groupLabel(groupDir, m.slug || name, lang),
      order: m.menus[slot].order,
      childrenAsDropdown: m.childrenAsDropdown,
      roles: m.roles,
      children: m.childrenAsDropdown ? groupChildren(groupDir, lang) : [],
    });
  }
  return groups.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

// True when at least one group enables the slot — the menu mount renders nothing otherwise.
export function slotHasGroups(slot: MenuSlot, lang: string): boolean {
  return getMenuGroups(slot, lang).length > 0;
}

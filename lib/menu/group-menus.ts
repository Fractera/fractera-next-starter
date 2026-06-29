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
export type MenuChild = { slug: string; title: string };
export type MenuGroup = {
  slug: string;
  label: string;
  order: number;
  childrenAsDropdown: boolean;
  roles: string;
  children: MenuChild[];
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

// All composed groups whose manifest enables `slot`, sorted by order then slug.
export function getMenuGroups(slot: MenuSlot, lang: string): MenuGroup[] {
  if (!isDir(LANG_ROOT)) return [];
  const groups: MenuGroup[] = [];
  for (const name of readdirSync(LANG_ROOT)) {
    if (name.startsWith("_") || name.startsWith("[") || name.startsWith(".")) continue;
    const groupDir = join(LANG_ROOT, name);
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

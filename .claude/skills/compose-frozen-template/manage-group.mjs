#!/usr/bin/env node
// manage-group — read & edit a COMPOSED group's manifest + envelope (step 158).
//
//   --op list                      → every composed group + its _data/group.ts manifest
//   --op update --tab <tab> [...]  → patch an EXISTING group, deterministic file edits, NO codegen:
//       --slug <new>               rename the group folder (path) + manifest.slug + parser-fs
//       --roles off|guest|<csv>    rewrite the layout.tsx access gate + manifest.roles echo
//       --languages en,ru,..       add/remove _data/<lang>.ts chrome + index lang-map + echo
//       --menus '<json>'           {top,footer,left,right} each {enabled,order} → manifest.menus
//       --children-dropdown bool   manifest.childrenAsDropdown
//       [--dry-run]                plan only, write nothing
//
// The manifest (_data/group.ts) is the single edit surface the site menu reads. roles/languages
// also touch the real artifacts (layout gate / UI chrome) so the echo never lies. Self-sufficient:
// plain Node-ESM, writes only under --out, no Hermes / MCP / store required.

import { writeFile, readFile, readdir, stat, rm, rename, mkdir } from "node:fs/promises"
import { join, resolve, dirname } from "node:path"

function parseArgs(argv) {
  const a = {}
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i]; if (!k.startsWith("--")) continue
    const key = k.slice(2), next = argv[i + 1]
    if (next === undefined || next.startsWith("--")) a[key] = true; else { a[key] = next; i++ }
  }
  return a
}
const exists = async p => { try { await stat(p); return true } catch { return false } }
const isDir = async p => { try { return (await stat(p)).isDirectory() } catch { return false } }
function pascal(s) { return String(s).split(/[^a-z0-9]+/i).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("") }
const ALL_ROLES = ["guest", "user", "architect", "buyer", "vip_user", "subscriber_lite", "subscriber_standard", "subscriber_max", "manager", "senior_manager", "support_manager", "delivery_manager", "finance", "content_editor", "admin"]
const MENU_SLOTS = ["top", "footer", "left", "right"]
const out = obj => { console.log(JSON.stringify(obj, null, 2)) }
const die = (msg) => { console.log(JSON.stringify({ ok: false, error: msg })); process.exit(2) }

async function slotLanguages(outRoot) {
  for (const rel of [".env.local", "app/.env.local"]) {
    try {
      const m = (await readFile(join(outRoot, rel), "utf8")).match(/^\s*NEXT_PUBLIC_SUPPORTED_LANGUAGES\s*=\s*(.+?)\s*$/m)
      if (m) { const l = m[1].trim().replace(/^["']|["']$/g, "").split(",").map(s => s.trim()).filter(Boolean); if (l.length) return l }
    } catch { /* try next */ }
  }
  return ["en"]
}

// ── manifest parse / render (format mirrors the store template _data/group.ts.tpl) ──
function parseManifest(src) {
  const m = {}
  const slug = src.match(/slug:\s*'([^']*)'/); if (slug) m.slug = slug[1]
  const langs = src.match(/languages:\s*(\[[^\]]*\])/); if (langs) { try { m.languages = JSON.parse(langs[1]) } catch { m.languages = [] } }
  const roles = src.match(/roles:\s*"([^"]*)"/); if (roles) m.roles = roles[1]
  const cad = src.match(/childrenAsDropdown:\s*(true|false)/); if (cad) m.childrenAsDropdown = cad[1] === "true"
  const ver = src.match(/@\/lib\/content-([a-z0-9]+)\/group-manifest/); m.ver = ver ? ver[1] : "v1"
  m.menus = {}
  for (const s of MENU_SLOTS) {
    const r = new RegExp(`${s}:\\s*\\{\\s*enabled:\\s*(true|false),\\s*order:\\s*(\\d+)`)
    const mm = src.match(r)
    m.menus[s] = mm ? { enabled: mm[1] === "true", order: parseInt(mm[2], 10) } : { enabled: false, order: 10 }
  }
  return m
}
function renderManifest({ slug, languages, roles, childrenAsDropdown, menus }, ver) {
  const slot = s => `{ enabled: ${menus[s].enabled}, order: ${menus[s].order} }`
  return `import type { GroupManifest } from '@/lib/content-${ver}/group-manifest'

// Group manifest — menu placement + envelope echo, read by the site's menu system to
// show/sort this group in the top, footer, and left/right drawer menus. Registration
// metadata, NOT a structural aspect. Edit enabled/order to surface the group; flip
// childrenAsDropdown to expand its child pages as a dropdown instead of linking to the index.
export const group: GroupManifest = {
  slug: '${slug}',
  languages: ${JSON.stringify(languages)},
  roles: ${JSON.stringify(roles)},
  childrenAsDropdown: ${childrenAsDropdown},
  menus: {
    top:    ${slot("top")},
    footer: ${slot("footer")},
    left:   ${slot("left")},
    right:  ${slot("right")},
  },
}
`
}

// ── derive the envelope from the real artifacts (for a pre-158 group with no manifest) ──
async function deriveLanguages(tabDir) {
  const langs = new Set(["en"])
  try { for (const e of await readdir(join(tabDir, "_data"))) { const m = e.match(/^([a-z]{2})\.ts$/); if (m && m[1] !== "index") langs.add(m[1]) } } catch { /* none */ }
  return [...langs]
}
function rolesFromLayout(src) {
  if (!/RouteGuard/.test(src)) return "public"
  if (/requireGuest/.test(src)) return "public+guest"
  const m = src.match(/roles=\{(\[[^\]]*\])\}/); if (m) { try { return JSON.parse(m[1]).join("+") } catch { /* */ } }
  return "private"
}
async function deriveEnvelope(tabDir) {
  let roles = "public"
  try { roles = rolesFromLayout(await readFile(join(tabDir, "layout.tsx"), "utf8")) } catch { /* */ }
  return { languages: await deriveLanguages(tabDir), roles }
}
function labelFrom(enSrc) { const m = enSrc && enSrc.match(/eyebrow:\s*'([^']*)'/); return m ? m[1] : "" }

// ── list ──────────────────────────────────────────────────────────────────────
async function listGroups(outRoot) {
  const langRoot = join(outRoot, "app", "[lang]")
  const groups = []
  let entries = []
  try { entries = await readdir(langRoot, { withFileTypes: true }) } catch { return { ok: true, groups } }
  for (const e of entries) {
    if (!e.isDirectory() || /^[_[.]/.test(e.name)) continue
    const tabDir = join(langRoot, e.name)
    if (!(await exists(join(tabDir, "_data")))) continue
    const gPath = join(tabDir, "_data", "group.ts")
    let manifest = null, hasManifest = false
    if (await exists(gPath)) { manifest = parseManifest(await readFile(gPath, "utf8")); hasManifest = true }
    else manifest = { slug: e.name, ...(await deriveEnvelope(tabDir)), childrenAsDropdown: false, menus: Object.fromEntries(MENU_SLOTS.map(s => [s, { enabled: false, order: 10 }])) }
    groups.push({ tab: e.name, hasManifest, manifest })
  }
  return { ok: true, count: groups.length, groups }
}

// ── update helpers ──────────────────────────────────────────────────────────────
function patchLayoutRoles(src, { rolesOn, requireGuest, roleList, unauthorizedRedirect, label }) {
  const imp = `import { RouteGuard } from '@/lib/auth-guard/route-guard.client'`
  // strip any existing RouteGuard import line
  let s = src.split("\n").filter(l => l.trim() !== imp).join("\n")
  let open = "", close = ""
  if (rolesOn) {
    const grp = `group=${JSON.stringify(label || "")}`
    const props = requireGuest
      ? `requireGuest unauthorizedRedirect=${JSON.stringify(unauthorizedRedirect)} ${grp}`
      : `roles={${JSON.stringify(roleList)}} unauthorizedRedirect=${JSON.stringify(unauthorizedRedirect)} ${grp}`
    open = `<RouteGuard ${props}>`; close = `</RouteGuard>`
    s = s.replace(/(import type \{ ReactNode \} from 'react'\n)/, `$1${imp}\n`)
  }
  s = s.replace(/return \([^\n]*\)/, `return (${open}<>{children}</>${close})`)
  return s
}
function renderLangIndex(P, langs) {
  const all = ["en", ...langs.filter(l => l !== "en")]
  return `${all.map(l => `import { ${l} } from './${l}'`).join("\n")}
import { deepMerge } from '@/lib/utils/deep-merge'
import type { ${P}Ui } from '../_lib/types'

// get${P}Ui(lang): the per-language UI strings, deep-merged over the en
// base (so any missing key falls back to English).
const UI: Record<string, Partial<${P}Ui>> = { ${all.join(", ")} }

export function get${P}Ui(lang: string): ${P}Ui {
  return deepMerge<${P}Ui>(en, UI[lang])
}
`
}
function renderLangPartial(P, lang, label) {
  return `import type { ${P}Ui } from '../_lib/types'

// Per-language override of the UI strings. Only the keys set here differ from
// English; add more keys to translate further — nothing else needs to change.
export const ${lang}: Partial<${P}Ui> = {
  metaTitle: '${label}',
  eyebrow: '${label}',
  indexTitle: '${label}',
  breadcrumb: '${label}',
  back: '${label}',
  titleSuffix: '${label}',
}
`
}

// ── update ──────────────────────────────────────────────────────────────────────
async function updateGroup(outRoot, a) {
  const tab = String(a.tab || "")
  if (!/^[a-z][a-z0-9-]*$/.test(tab)) die("--tab is required, kebab-case")
  const langRoot = join(outRoot, "app", "[lang]")
  let tabDir = join(langRoot, tab)
  if (!(await isDir(tabDir))) die(`group '${tab}' does not exist`)
  const dry = !!a["dry-run"]
  const plan = { op: "update", tab, write: [], rename: [], remove: [], note: [] }

  // current manifest (or derived for a pre-158 group)
  const gPath = join(tabDir, "_data", "group.ts")
  let cur, ver = "v1"
  if (await exists(gPath)) { cur = parseManifest(await readFile(gPath, "utf8")); ver = cur.ver }
  else { const env = await deriveEnvelope(tabDir); cur = { slug: tab, languages: env.languages, roles: env.roles, childrenAsDropdown: false, menus: Object.fromEntries(MENU_SLOTS.map(s => [s, { enabled: false, order: 10 }])) } }
  const next = { slug: cur.slug || tab, languages: [...cur.languages], roles: cur.roles, childrenAsDropdown: cur.childrenAsDropdown, menus: JSON.parse(JSON.stringify(cur.menus)) }
  const enLabel = labelFrom(await readFile(join(tabDir, "_data", "en.ts"), "utf8").catch(() => ""))

  // (4) languages — add/remove UI chrome partials + index, within the slot's declared set
  if (typeof a.languages === "string") {
    const allowed = await slotLanguages(outRoot)
    const want = a.languages.split(",").map(s => s.trim()).filter(Boolean)
    if (!want.includes("en")) want.unshift("en")
    const bad = want.filter(l => !allowed.includes(l))
    if (bad.length) die(`language(s) [${bad.join(",")}] not in the slot's declared set [${allowed.join(",")}] — add via App Settings (rebuild) first (step 150)`)
    const P = pascal(next.slug)
    const add = want.filter(l => l !== "en" && !cur.languages.includes(l))
    const drop = cur.languages.filter(l => l !== "en" && !want.includes(l))
    for (const l of add) { const f = join("app", "[lang]", tab, "_data", `${l}.ts`); if (dry) plan.write.push(f); else await writeFile(join(outRoot, f), renderLangPartial(P, l, enLabel), "utf8") }
    for (const l of drop) { const f = join("app", "[lang]", tab, "_data", `${l}.ts`); if (dry) plan.remove.push(f); else await rm(join(outRoot, f), { force: true }) }
    const idx = join("app", "[lang]", tab, "_data", "index.ts")
    if (dry) plan.write.push(idx); else await writeFile(join(outRoot, idx), renderLangIndex(P, want), "utf8")
    next.languages = want
  }

  // (3) roles — rewrite the layout.tsx gate + echo
  if (typeof a.roles === "string") {
    const arg = a.roles.trim()
    const rolesOn = arg !== "" && arg !== "off"
    const requireGuest = arg === "guest"
    let roleList = []
    if (rolesOn && !requireGuest) {
      roleList = arg === "all" ? [...ALL_ROLES] : arg.split(",").map(s => s.trim()).filter(Boolean)
      const bad = roleList.filter(r => !ALL_ROLES.includes(r))
      if (bad.length) die(`unknown role(s): ${bad.join(",")}. Valid (ALL_ROLES): ${ALL_ROLES.join(", ")}; or 'off' / 'guest' / 'all'`)
    }
    const unauthorizedRedirect = (typeof a["unauthorized-redirect"] === "string" && a["unauthorized-redirect"]) || "/"
    const lPath = join("app", "[lang]", tab, "layout.tsx")
    const layout = await readFile(join(outRoot, lPath), "utf8")
    const patched = patchLayoutRoles(layout, { rolesOn, requireGuest, roleList, unauthorizedRedirect, label: enLabel })
    if (dry) plan.write.push(lPath); else await writeFile(join(outRoot, lPath), patched, "utf8")
    next.roles = rolesOn ? (requireGuest ? "public+guest" : roleList.join("+")) : "public"
  }

  // (5,6) menus — enabled/order per slot
  if (typeof a.menus === "string") {
    let parsed; try { parsed = JSON.parse(a.menus) } catch { die("--menus must be valid JSON") }
    for (const s of MENU_SLOTS) {
      const m = parsed[s]; if (!m || typeof m !== "object") continue
      if (typeof m.enabled === "boolean") next.menus[s].enabled = m.enabled
      if (Number.isFinite(m.order)) next.menus[s].order = Math.trunc(m.order)
    }
  }

  // (7) children-as-dropdown
  if (a["children-dropdown"] !== undefined) next.childrenAsDropdown = a["children-dropdown"] === "true" || a["children-dropdown"] === true

  // (2) slug — rename the group folder (do this LAST: it moves the manifest target)
  let renamedTo = null
  if (typeof a.slug === "string" && a.slug !== tab) {
    if (!/^[a-z][a-z0-9-]*$/.test(a.slug)) die("--slug must be kebab-case")
    if (await isDir(join(langRoot, a.slug))) die(`cannot rename: group '${a.slug}' already exists`)
    next.slug = a.slug
    if (dry) { plan.rename.push(`app/[lang]/${tab} -> app/[lang]/${a.slug}`); plan.note.push("parser-fs COLLECTIONS path updated; sitemap is MANUAL") }
    else {
      await rename(tabDir, join(langRoot, a.slug)); tabDir = join(langRoot, a.slug); renamedTo = a.slug
      const pf = join(outRoot, "lib", "parser-fs.mjs")
      if (await exists(pf)) { const src = await readFile(pf, "utf8"); const n = src.split(`app/[lang]/${tab}`).join(`app/[lang]/${a.slug}`); if (n !== src) await writeFile(pf, n, "utf8") }
      plan.note.push("update app/sitemap.ts (MANUAL — structure varies)")
    }
  }

  // write the manifest (always — single source the menu reads). Creates it if a pre-158 group lacked one.
  const finalGroupPath = join("app", "[lang]", renamedTo || (typeof a.slug === "string" ? next.slug : tab), "_data", "group.ts")
  const manifestBody = renderManifest(next, ver)
  if (dry) { plan.write.push(finalGroupPath); plan.result = next; out({ ok: true, dryRun: true, plan, confirm_prompt: `Правильно ли я понимаю: обновить группу «${tab}» (${[a.slug && a.slug !== tab ? "путь→" + a.slug : "", a.roles ? "роль→" + next.roles : "", a.languages ? "языки→" + next.languages.join(",") : "", a.menus ? "меню" : "", a["children-dropdown"] !== undefined ? "dropdown→" + next.childrenAsDropdown : ""].filter(Boolean).join(", ") || "без изменений"})? Повторите без dry_run для подтверждения.` }); return }
  await mkdir(dirname(join(outRoot, finalGroupPath)), { recursive: true })
  await writeFile(join(outRoot, finalGroupPath), manifestBody, "utf8")
  out({ ok: true, op: "update", tab, manifest: next, manifest_path: finalGroupPath, next: "REBUILD the slot (owner_deploy_rebuild_slot) so the change is live." })
}

async function main() {
  const a = parseArgs(process.argv.slice(2))
  const outRoot = resolve(a.out || "")
  if (!a.out) throw new Error("--out (slot root) is required")
  if (a.op === "list") return out(await listGroups(outRoot))
  if (a.op === "update") return updateGroup(outRoot, a)
  throw new Error("--op must be list|update")
}
main().catch(e => { console.error("manage-group:", e.message); process.exit(1) })

#!/usr/bin/env node
// thaw-frozen-archetype — deterministic frozen-archetype emitter (collection-level
// generalization of scaffold-declared-route-into-component-skeleton).
//
// Thaws a frozen archetype from a local store directory into a slot, BY CONSTRUCTION
// — pure file copy + token substitution, ZERO LLM code generation. Any model
// (Hermes / Codex / Claude / Gemini / Qwen / Kimi) that runs this produces an
// identical result. Two layers (per the archetype manifest):
//   - engine  (copy-if-absent): the shared content engine — installed once into the
//             slot; skipped entirely when the slot already has lib/content.
//   - tab     (write-guarded):  the parameterized collection app/[lang]/<tab>/ —
//             router + _lib + _data + N placeholder posts. Refuses to overwrite an
//             existing tab folder without --force.
//
// The store holds template files suffixed `.tpl`; this strips the suffix on write.
// It also registers the tab in lib/parser-fs.mjs COLLECTIONS and appends the route
// to app/sitemap.ts (both idempotent), then asks you to run `npm run gen:lists`.
//
// The store is fetched separately (the skill / MCP does GET /archetypes/:id from the
// data service and unpacks it to a temp dir); this script is pure local file ops, so
// it works for a lone agent with no Hermes and no MCP.
//
// Usage:
//   node thaw-frozen-archetype.mjs --store <archetype-dir> --out <slot-root> \
//     --tab news --format news --languages en,ru \
//     --label-en News --label-ru Новости --samples 2 [--force]
//
// Deterministic and idempotent-guarded. Never writes outside --out.

import { mkdir, writeFile, readFile, readdir, stat, copyFile } from "node:fs/promises"
import { join, resolve, dirname, relative } from "node:path"

function parseArgs(argv) {
  const a = {}
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i]
    if (k.startsWith("--")) {
      const key = k.slice(2)
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("--")) { a[key] = true }
      else { a[key] = next; i++ }
    }
  }
  return a
}

const exists = async p => { try { await stat(p); return true } catch { return false } }

// kebab/slug -> PascalCase / camelCase
function pascal(s) {
  return String(s).split(/[^a-z0-9]+/i).filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")
}
function camel(s) { const p = pascal(s); return p ? p[0].toLowerCase() + p.slice(1) : p }

// Recursively list files under dir (returns paths relative to dir).
async function walk(dir, base = dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name)
    if (e.isDirectory()) await walk(full, base, out)
    else out.push(relative(base, full))
  }
  return out
}

function applyTokens(text, tok) {
  let out = text
  for (const [k, v] of Object.entries(tok)) out = out.split(k).join(v)
  return out
}

// Substitute tokens that appear in a path segment (only {{TAB}} is used in paths).
function applyPathTokens(relPath, tok) {
  return applyPathTokensRaw(relPath).split("{{TAB}}").join(tok["{{TAB}}"])
}
function applyPathTokensRaw(relPath) { return relPath.replace(/\.tpl$/, "") }

async function writeOut(outRoot, relDest, content) {
  const dest = join(outRoot, relDest)
  if (!resolve(dest).startsWith(resolve(outRoot))) throw new Error(`refusing to write outside out: ${relDest}`)
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, content, "utf8")
  console.log("emit", relDest)
}

// ── engine layer: copy-if-absent ────────────────────────────────────────────
async function thawEngine(storeRoot, outRoot, sentinel) {
  const engineDir = join(storeRoot, "engine")
  if (!(await exists(engineDir))) { console.log("engine: none in store, skip"); return }
  if (await exists(join(outRoot, sentinel))) { console.log(`engine: ${sentinel} present, skip (idempotent)`); return }
  for (const rel of await walk(engineDir)) {
    const raw = await readFile(join(engineDir, rel), "utf8")
    await writeOut(outRoot, rel.replace(/\.tpl$/, ""), raw) // engine files are verbatim (brand via env)
  }
  console.log("engine: installed")
}

// ── tab layer: write-guarded ────────────────────────────────────────────────
async function thawTab(storeRoot, outRoot, tok, opts) {
  const { tab, languages, labels, samples, format, force } = opts
  const tabSrc = join(storeRoot, "tab", "app", "[lang]", "{{TAB}}")
  const tabDest = join("app", "[lang]", tab)
  if (await exists(join(outRoot, tabDest)) && !force)
    throw new Error(`refusing to overwrite ${tabDest} (use --force)`)

  // 1) tab-level files (exclude the post template __SAMPLE__ and the per-lang partial)
  for (const rel of await walk(tabSrc)) {
    if (rel.split(/[\\/]/).includes("__SAMPLE__")) continue
    if (rel.replace(/\\/g, "/") === "_data/_lang.partial.ts.tpl") continue
    if (rel.replace(/\\/g, "/") === "_data/en.ts.tpl") continue   // handled below (label)
    if (rel.replace(/\\/g, "/") === "_data/index.ts.tpl") continue // handled below (lang map)
    const raw = await readFile(join(tabSrc, rel), "utf8")
    await writeOut(outRoot, join(tabDest, applyPathTokens(rel, tok)), applyTokens(raw, tok))
  }

  // 2) _data/en.ts — full base, label substituted
  const enTpl = await readFile(join(tabSrc, "_data", "en.ts.tpl"), "utf8")
  await writeOut(outRoot, join(tabDest, "_data", "en.ts"),
    applyTokens(enTpl, { ...tok, "{{LABEL}}": labels.en }))

  // 3) _data/<lang>.ts — partial override per non-en language
  const partialTpl = await readFile(join(tabSrc, "_data", "_lang.partial.ts.tpl"), "utf8")
  const extra = languages.filter(l => l !== "en")
  for (const lang of extra) {
    await writeOut(outRoot, join(tabDest, "_data", `${lang}.ts`),
      applyTokens(partialTpl, { ...tok, "{{LANG}}": lang, "{{LABEL}}": labels[lang] ?? labels.en }))
  }

  // 4) _data/index.ts — language map
  const idxTpl = await readFile(join(tabSrc, "_data", "index.ts.tpl"), "utf8")
  const allLangs = ["en", ...extra]
  const langImports = allLangs.map(l => `import { ${l} } from './${l}'`).join("\n")
  await writeOut(outRoot, join(tabDest, "_data", "index.ts"),
    applyTokens(idxTpl, { ...tok, "{{LANG_IMPORTS}}": langImports, "{{LANG_MAP}}": allLangs.join(", ") }))

  // 5) placeholder posts
  const sampleSrc = join(tabSrc, "__SAMPLE__")
  const postOverrideLangs = extra.filter(l => l === "ru") // only ru override template ships; others fall back to en
  for (let i = 1; i <= samples; i++) {
    const slug = `sample-${i}`
    const date = new Date(Date.now() - (i - 1) * 86400000).toISOString().slice(0, 10)
    const stok = { ...tok, "{{LABEL}}": labels.en, "{{SAMPLE_SLUG}}": slug, "{{SAMPLE_INDEX}}": String(i), "{{SAMPLE_DATE}}": date }
    for (const rel of await walk(sampleSrc)) {
      const reln = rel.replace(/\\/g, "/")
      if (reln === "_data/ru.ts.tpl") continue          // emitted only if ru configured (below)
      if (reln === "_data/index.ts.tpl") continue       // handled below (overrides map)
      const raw = await readFile(join(sampleSrc, rel), "utf8")
      await writeOut(outRoot, join(tabDest, slug, rel.replace(/\.tpl$/, "")), applyTokens(raw, stok))
    }
    // ru override (only when configured)
    if (postOverrideLangs.includes("ru")) {
      const ruTpl = await readFile(join(sampleSrc, "_data", "ru.ts.tpl"), "utf8")
      await writeOut(outRoot, join(tabDest, slug, "_data", "ru.ts"), applyTokens(ruTpl, stok))
    }
    // post _data/index.ts — overrides map
    const pIdxTpl = await readFile(join(sampleSrc, "_data", "index.ts.tpl"), "utf8")
    const ov = postOverrideLangs
    const ovImports = ov.map(l => `import { ${l} } from './${l}'`).join("\n")
    await writeOut(outRoot, join(tabDest, slug, "_data", "index.ts"),
      applyTokens(pIdxTpl, { ...stok, "{{POST_OVERRIDE_IMPORTS}}": ovImports, "{{POST_OVERRIDES}}": ov.join(", ") }))
  }
  return { tabDest }
}

// ── post-thaw wiring: parser-fs COLLECTIONS + sitemap (idempotent) ───────────
async function registerCollection(outRoot, tab, tabPascal) {
  const pf = join(outRoot, "lib", "parser-fs.mjs")
  if (!(await exists(pf))) { console.log("parser-fs: not found, skip COLLECTIONS register"); return }
  let src = await readFile(pf, "utf8")
  if (src.includes(`app/[lang]/${tab}`)) { console.log("parser-fs: already registered, skip"); return }
  const entry = `  { dir: 'app/[lang]/${tab}', type: '${tabPascal}Data', typeModule: './_lib/post' },`
  const m = src.match(/COLLECTIONS\s*=\s*\[/)
  if (!m) { console.log("parser-fs: COLLECTIONS array not found, MANUAL register needed"); return }
  const at = m.index + m[0].length
  src = src.slice(0, at) + "\n" + entry + src.slice(at)
  await writeFile(pf, src, "utf8")
  console.log("parser-fs: registered", tab)
}

async function appendSitemap(outRoot, tab) {
  const sm = join(outRoot, "app", "sitemap.ts")
  if (!(await exists(sm))) { console.log("sitemap: app/sitemap.ts not found, skip"); return }
  const src = await readFile(sm, "utf8")
  if (src.includes(`/${tab}`)) { console.log("sitemap: already lists route, skip"); return }
  console.log(`sitemap: add '/${tab}' to the manual path list in app/sitemap.ts (MANUAL — structure varies)`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const storeRoot = resolve(args.store || "")
  const outRoot = resolve(args.out || "")
  if (!args.store || !(await exists(join(storeRoot, "manifest.json"))))
    throw new Error("--store must point at an archetype dir containing manifest.json")
  if (!args.out) throw new Error("--out is required (the slot root)")

  const manifest = JSON.parse(await readFile(join(storeRoot, "manifest.json"), "utf8"))
  const tab = args.tab
  if (!tab || tab === true || !/^[a-z][a-z0-9-]*$/.test(tab))
    throw new Error("--tab is required, kebab-case (e.g. --tab news)")
  const format = ["news", "blog", "document"].includes(args.format) ? args.format : "news"
  const languages = String(args.languages || "en,ru").split(",").map(s => s.trim()).filter(Boolean)
  if (!languages.includes("en")) languages.unshift("en")
  const samples = Math.max(0, Math.min(10, parseInt(args.samples ?? "2", 10) || 0))
  const labels = { en: args["label-en"] || pascal(tab) }
  for (const lang of languages) { const v = args[`label-${lang}`]; if (typeof v === "string") labels[lang] = v }

  const tok = {
    "{{TAB}}": tab,
    "{{TAB_PASCAL}}": pascal(tab),
    "{{TAB_CAMEL}}": camel(tab),
    "{{TAB_CONST}}": tab.replace(/[^a-z0-9]+/gi, "_").toUpperCase(),
    "{{FORMAT}}": format,
  }

  console.log(`thawing archetype '${manifest.id}' -> tab '${tab}' (format=${format}, langs=${languages.join(",")}, samples=${samples})`)
  await thawEngine(storeRoot, outRoot, "lib/content")   // sentinel: lib/content present = engine installed
  const { tabDest } = await thawTab(storeRoot, outRoot, tok, { tab, languages, labels, samples, format, force: !!args.force })
  await registerCollection(outRoot, tab, pascal(tab))
  await appendSitemap(outRoot, tab)

  console.log(`\nthawed ${manifest.id} -> ${tabDest}`)
  console.log("next: run `npm run gen:lists` (parser-fs) then `npx tsc --noEmit`")
}

main().catch(e => { console.error("thaw-frozen-archetype:", e.message); process.exit(1) })

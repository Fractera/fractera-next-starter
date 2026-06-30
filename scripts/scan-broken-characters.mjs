#!/usr/bin/env node
// scan-broken-characters — the project's universal encoding-integrity scanner.
//
// Localized strings can carry a BROKEN / REPLACEMENT character from a lossy step (voice dictation,
// copy-paste, a bad transform) — a control byte (e.g. 0x13) or U+FFFD left where an accented letter
// belonged, which renders as a box. It ships SILENTLY (the file still parses) and the live site shows
// a square instead of, say, "ó" in "Documentación". Unlike a dropped letter, these ARE detectable, so
// this scanner sweeps the WHOLE corpus — every language, every content/UI/data string — and reports
// each occurrence with file, line, column, codepoint and language, so a human/agent can fix it with
// the CORRECT letter (never a blind replace — the same byte may stand for á / é / í / ñ elsewhere).
//
// Companion to the content emitters, which REFUSE a broken char on write (prevention). This is the
// DETECTION side: it finds what already sits in the tree.
//
// Usage:
//   node scripts/scan-broken-characters.mjs [--root <dir>]... [--json] [--quiet]
//     --root  one or more roots to scan (default: the current working directory). Point it at the
//             slot, or at a substrate path like ai-workspace/services/auth (the 82-language auth dict).
//     --json  print only the single-line JSON summary (for tooling / the MCP bridge).
//     --quiet suppress the human report, keep the exit code.
//   npm run check:encoding   (scans the project root)
//
// Exit code: 0 = clean, 1 = findings (so it works as a pre-commit / CI gate), 2 = usage error.
// Read-only. Self-sufficient: plain Node-ESM, no deps.

import { readFile, readdir, stat } from "node:fs/promises"
import { join, relative, basename, sep } from "node:path"

const SCAN_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|md|json)$/
const SKIP_DIR = new Set(["node_modules", ".next", ".git", ".turbo", "dist", "build", ".vercel"])
const SKIP_FILE = /\.generated\.|package-lock\.json$|\.tsbuildinfo$/

// The single detection rule (mirrors hasBrokenChar in the content emitters). Returns the codepoint
// of the first offending char in a string, or -1. Allows tab(09)/LF(0A)/CR(0D).
function brokenCodepointAt(str, from = 0) {
  for (let i = from; i < str.length; i++) {
    const c = str.charCodeAt(i)
    if (c === 0xFFFD || c === 0xFFFC) return i
    if (c <= 0x08 || c === 0x0B || c === 0x0C || (c >= 0x0E && c <= 0x1F)) return i
    if (c >= 0x7F && c <= 0x9F) return i
    if ((c === 0xC3 || c === 0xC2) && i + 1 < str.length) { const n = str.charCodeAt(i + 1); if (n >= 0x80 && n <= 0xBF) return i }
  }
  return -1
}
const hex = c => "U+" + c.toString(16).toUpperCase().padStart(4, "0")

// Infer the language of a localized file: `_data/es.ts` → es, an `/[lang]/` path stays generic,
// an `auth-strings`/locale segment → n/a. Best-effort, for grouping only.
function inferLang(relPath) {
  const base = basename(relPath).replace(/\.[a-z]+$/i, "")
  if (/^[a-z]{2}(-[A-Za-z0-9]+)?$/.test(base)) return base // es.ts, hy.ts, pt-BR.ts
  const m = relPath.replace(/\\/g, "/").match(/\/locales?\/([a-z]{2}(-[A-Za-z0-9]+)?)\//)
  return m ? m[1] : "—"
}

// Render a line with the bad char replaced by a SAFE marker so the report never carries the corruption.
function safeContext(line, col) {
  const c = line.charCodeAt(col)
  const marked = line.slice(0, col) + `[${hex(c)}]` + line.slice(col + 1)
  return marked.trim().slice(0, 120)
}

async function* walk(dir) {
  let entries
  try { entries = await readdir(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".env.local" && SKIP_DIR.has(e.name)) continue
    const full = join(dir, e.name)
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) yield* walk(full) }
    else if (SCAN_EXT.test(e.name) && !SKIP_FILE.test(e.name)) yield full
  }
}

async function scanFile(file, root, findings) {
  let text
  try { text = await readFile(file, "utf8") } catch { return }
  if (brokenCodepointAt(text) === -1) return // fast path: clean file
  const rel = relative(root, file).replace(/\\/g, "/")
  const lang = inferLang(rel)
  const lines = text.split("\n")
  for (let ln = 0; ln < lines.length; ln++) {
    let col = brokenCodepointAt(lines[ln])
    while (col !== -1) {
      findings.push({ file: rel, line: ln + 1, col: col + 1, codepoint: hex(lines[ln].charCodeAt(col)), lang, context: safeContext(lines[ln], col) })
      col = brokenCodepointAt(lines[ln], col + 1)
    }
  }
}

async function main() {
  const argv = process.argv.slice(2)
  const roots = []
  let json = false, quiet = false
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--root") roots.push(argv[++i])
    else if (argv[i] === "--json") json = true
    else if (argv[i] === "--quiet") quiet = true
    else if (argv[i].startsWith("--")) { console.error(`unknown flag ${argv[i]}`); process.exit(2) }
  }
  if (!roots.length) roots.push(process.cwd())

  const findings = []
  let filesScanned = 0
  for (const root of roots) {
    let isDir = false
    try { isDir = (await stat(root)).isDirectory() } catch { console.error(`root not found: ${root}`); process.exit(2) }
    if (!isDir) continue
    for await (const file of walk(root)) { filesScanned++; await scanFile(file, root, findings) }
  }

  const byLanguage = {}
  for (const f of findings) byLanguage[f.lang] = (byLanguage[f.lang] || 0) + 1
  const summary = { ok: findings.length === 0, filesScanned, findingsCount: findings.length, byLanguage, findings }

  if (json) { process.stdout.write(JSON.stringify(summary) + "\n"); process.exit(findings.length ? 1 : 0) }

  if (!quiet) {
    console.log("Encoding integrity check (broken / replacement characters)")
    console.log("=========================================================")
    console.log(`  scanned ${filesScanned} files in: ${roots.join(", ")}`)
    if (!findings.length) { console.log("\n  ✓ no broken characters found — corpus is clean.") }
    else {
      console.log(`\n  ✗ ${findings.length} broken character(s) in ${new Set(findings.map(f => f.file)).size} file(s):\n`)
      for (const f of findings) console.log(`  ${f.file}:${f.line}:${f.col}  ${f.codepoint}  [lang ${f.lang}]\n      ${f.context}`)
      console.log(`\n  By language: ${Object.entries(byLanguage).map(([l, n]) => `${l}=${n}`).join(", ")}`)
      console.log("\n  FIX EACH BY HAND with the correct letter for its word (a control byte / U+FFFD may stand")
      console.log("  for different accented letters in different places — never blind-replace). The content")
      console.log("  emitters already refuse broken chars on write; this finds what already sits in the tree.")
    }
  }
  process.exit(findings.length ? 1 : 0)
}

main().catch(e => { console.error("scan-broken-characters:", e.message); process.exit(2) })

#!/usr/bin/env node
// orchestrate-content-by-steps — the FROZEN PROCESS for content operations.
//
// The agent supplies only an INTENT ("a page about Apple"); this deterministic pipeline
// DECOMPOSES it by the slot's STATE (does the section exist?) into dependent sub-steps and
// runs EACH through the full, frozen development-step lifecycle:
//
//   open-step → execute → deploy → verify → RECORD in deployment_records (GATE) → close-step
//
// The order is frozen and the Deployment record is a GATE: a step CANNOT be closed (moved
// NEW-STEPS → COMPLETED-STEPS) without a confirmed row in deployment_records — the Vercel
// invariant ("never skip recording a deployment"). A weak model cannot reorder or skip it.
//
// Decomposition (by state, not by guessing):
//   section MISSING → sub-step A: create-section (compose --samples)  THEN
//   sub-step B: add-page (clone a frozen stub)                         (B always; A only if needed)
// "N test/placeholder posts" = create-section --samples N (one sub-step, one cycle, one record).
//
// Usage:
//   node orchestrate-content-by-steps.mjs --out <slot-root> --action add-page|create-section \
//     --topic <kebab> [--tab news] [--format news] [--samples N] [--store <frozen-templates>] \
//     [--admin-url http://127.0.0.1:3002] [--data-url http://127.0.0.1:3300] \
//     [--public-url <base>] [--platform hermes] [--model <id>] [--dry-run]
//   Compound FLAT plan (step 167) — a whole multi-group frozen request in one intent:
//   node orchestrate-content-by-steps.mjs --out <root> --store <frozen-templates> \
//     --plan '[{"tab":"news","menus":{"top":{"enabled":true,"order":1}},"roles":"public","pages":["We added apples"],"admin":false,"dashboard":false}, …]' \
//     [--owner-lang en|ru] [--dry-run] [--approve os-<token>]
//   Each group → flat sub-steps create-section(+seed) → add-page(s) → remove-seed → set-group → set-auth.
//   ORDER SHEET protocol: admin/dashboard are MANDATORY per group (absent → needs_input with the exact
//   question texts to relay); dry_run returns order_sheet (resolved human lines + implied + announce_text
//   + the approve token); a real run REQUIRES approve=<that token> — an unshown/changed plan cannot start.
//   Operation gate refuses an existing page (modify = coding scenario). Same env secrets as above.
//   Secrets via env: DEPLOY_SECRET (admin :3002), DATA_SECRET (data :3300).
//
// Self-sufficient: the MCP bridge spawns this with secrets in env; a lone CLI agent runs it
// directly. Deterministic, writes only under --out (+ records to the data service).

import { mkdir, writeFile, readFile, readdir, rename, stat } from "node:fs/promises"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { spawn } from "node:child_process"
import { randomUUID, createHash } from "node:crypto"

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILLS = join(HERE, "..")
const STEP_ROOT = "DEVELOPMENT-STEPS", NEW_DIR = "NEW-STEPS", DONE_DIR = "COMPLETED-STEPS"

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
const pad = n => String(n).padStart(2, "0")
const slugify = s => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50)
function spawnP(cmd, args, opts = {}) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, opts); let out = "", err = ""
    p.stdout?.on("data", d => { out += d }); p.stderr?.on("data", d => { err += d })
    p.on("error", rej); p.on("close", code => res({ code, out: out + (err ? `\n[stderr] ${err}` : "") }))
  })
}

// ── development-step file lifecycle (format mirrors lib/dev-steps/step-file.ts) ──
async function nextStepNumber(outRoot) {
  let max = 0
  for (const d of [NEW_DIR, DONE_DIR]) {
    const dir = join(outRoot, STEP_ROOT, d)
    let names = []; try { names = await readdir(dir) } catch { /* none */ }
    for (const n of names) { const m = n.match(/^(\d+)-/); if (m) max = Math.max(max, Number(m[1])) }
  }
  return max + 1
}
function renderStep(s) {
  const body = [
    `# ${pad(s.number)} — ${s.name}`, "",
    `> Development step · importance: ${s.importance}` + (s.status === "completed" && s.completedAt ? ` · completed ${s.completedAt}` : ""), "",
    s.description || "_No description yet._", "", "## To-do",
    ...(s.tasks.length ? s.tasks.map(t => `- ${t.body}`) : ["_No tasks._"]), "",
  ].join("\n")
  const machine = { number: s.number, name: s.name, importance: s.importance, status: s.status, completedAt: s.completedAt, description: s.description, tasks: s.tasks }
  return `${body}\n<!-- fractera:step\n${JSON.stringify(machine)}\n-->\n`
}
async function openStep(outRoot, number, name, description) {
  const rel = `${NEW_DIR}/${pad(number)}-${slugify(name) || "step"}.md`
  const step = { number, name, importance: "mandatory", status: "new", completedAt: null, description, tasks: [] }
  const abs = join(outRoot, STEP_ROOT, rel)
  await mkdir(dirname(abs), { recursive: true })
  await writeFile(abs, renderStep(step), "utf8")
  return { rel, abs, step }
}
// GATE: close = move NEW→COMPLETED + status:completed. Callable ONLY after a confirmed record.
async function closeStep(outRoot, openInfo) {
  const newAbs = openInfo.abs
  const doneRel = openInfo.rel.replace(`${NEW_DIR}/`, `${DONE_DIR}/`)
  const doneAbs = join(outRoot, STEP_ROOT, doneRel)
  const completed = { ...openInfo.step, status: "completed", completedAt: new Date().toISOString().slice(0, 10) }
  await mkdir(dirname(doneAbs), { recursive: true })
  await writeFile(newAbs, renderStep(completed), "utf8")
  await rename(newAbs, doneAbs)
  return doneRel
}

// ── deploy (admin :3002) + record/verify (data :3300) ───────────────────────
async function deploy(adminUrl, secret, description) {
  if (!secret) return { ok: false, error: "no DEPLOY_SECRET in env" }
  try {
    const r = await fetch(`${adminUrl}/api/deploy`, { method: "POST", headers: { "Content-Type": "application/json", "X-Deploy-Secret": secret }, body: JSON.stringify({ description }), signal: AbortSignal.timeout(15000) })
    if (!r.ok) return { ok: false, error: `deploy ${r.status}` }
    const j = await r.json().catch(() => ({}))
    const jobId = j.jobId
    // poll status to terminal
    for (let i = 0; i < 60 && jobId; i++) {
      await new Promise(s => setTimeout(s, 8000))
      const s = await fetch(`${adminUrl}/api/deploy/status?jobId=${jobId}`, { headers: { "X-Deploy-Secret": secret }, signal: AbortSignal.timeout(10000) }).then(x => x.json()).catch(() => ({}))
      if (/COMPLETED|FAILED|HEALTH_FAILED/.test(s.status || "")) return { ok: s.status === "COMPLETED", status: s.status, jobId }
    }
    return { ok: true, status: "SUBMITTED", jobId }
  } catch (e) { return { ok: false, error: String(e?.message ?? e) } }
}
function dataHeaders(secret) { const h = { "X-Agent-Identity": "hermes", "Content-Type": "application/json" }; if (secret) h["X-Data-Secret"] = secret; return h }
async function recordDeployment(dataUrl, secret, row) {
  try {
    const r = await fetch(`${dataUrl}/db/tables/deployment_records`, { method: "POST", headers: dataHeaders(secret), body: JSON.stringify(row), signal: AbortSignal.timeout(10000) })
    if (!r.ok) return { ok: false, error: `data ${r.status}` }
    return { ok: true, id: row.id }
  } catch (e) { return { ok: false, error: String(e?.message ?? e) } }
}
// GATE verification: confirm the row really exists before allowing close.
async function verifyRecord(dataUrl, secret, id) {
  try {
    const r = await fetch(`${dataUrl}/db/tables/deployment_records?limit=100`, { headers: dataHeaders(secret), signal: AbortSignal.timeout(10000) })
    if (!r.ok) return false
    const j = await r.json().catch(() => ({}))
    const rows = j.rows ?? j ?? []
    return Array.isArray(rows) && rows.some(x => x.id === id)
  } catch { return false }
}

// ── execute a sub-step via the EXISTING frozen tools (no code/content generation) ──
async function execCreateSection(outRoot, opts) {
  const composer = join(SKILLS, "compose-frozen-template", "compose-frozen-template.mjs")
  const args = [composer, "--store", opts.store, "--out", outRoot, "--tab", opts.tab, "--source", "files", "--depth", "1", "--rendering", "static", "--format", opts.format, "--samples", String(opts.samples)]
  if (opts.languages) args.push("--languages", opts.languages)
  if (opts.admin !== undefined) args.push("--admin", String(!!opts.admin))
  if (opts.dashboard !== undefined) args.push("--dashboard", String(!!opts.dashboard))
  return spawnP(process.execPath, args, { cwd: outRoot })
}
async function execAddPage(outRoot, opts) {
  const emitter = join(SKILLS, "manage-content-collections", "manage-content-collections.mjs")
  const args = [emitter, "--out", outRoot, "--op", "create", "--target", "page", "--tab", opts.tab, "--slug", opts.slug]
  return spawnP(process.execPath, args, { cwd: outRoot })
}
// delete a page (used to remove the throwaway seed stub after named pages are cloned from it).
async function execDeletePage(outRoot, opts) {
  const emitter = join(SKILLS, "manage-content-collections", "manage-content-collections.mjs")
  const args = [emitter, "--out", outRoot, "--op", "delete", "--target", "page", "--tab", opts.tab, "--slug", opts.slug]
  return spawnP(process.execPath, args, { cwd: outRoot })
}
// set-group: menu placement (top/footer/left/right) + access tier (roles) via manage-group.mjs (step 158).
// The group manifest _data/group.ts is the single surface the site menu reads; roles also rewrites the
// layout access gate. Flat sub-step in the compound plan — no codegen, deterministic file edits.
async function execSetGroup(outRoot, opts) {
  const mg = join(SKILLS, "compose-frozen-template", "manage-group.mjs")
  const args = [mg, "--out", outRoot, "--op", "update", "--tab", opts.tab]
  if (opts.menus) args.push("--menus", JSON.stringify(opts.menus))
  if (typeof opts.roles === "string" && opts.roles) args.push("--roles", opts.roles)
  if (opts.childrenDropdown !== undefined) args.push("--children-dropdown", String(!!opts.childrenDropdown))
  if (opts.admin !== undefined) args.push("--admin", String(!!opts.admin))
  if (opts.dashboard !== undefined) args.push("--dashboard", String(!!opts.dashboard))
  return spawnP(process.execPath, args, { cwd: outRoot })
}
// Operation gate (step 167): a page that ALREADY exists is a MODIFY, not a create — REAL-DEVELOPMENT
// (coding agents), refused by the frozen pipeline.
const pageExists = (outRoot, tab, slug) => isDir(join(outRoot, "app", "[lang]", tab, slug))
// manage-group --roles vocabulary: off|guest|<csv>. Plan may say "public" or an array.
// BUG-1 fix (step 167 E2E): a model saying "all"/"everyone"/"для всех" MEANS "visible to everyone"
// = public (no gate). The old reading (all = every named role) EXCLUDED guests — the exact bug that
// hid news/blog from signed-out visitors. A caller genuinely wanting an every-role gate lists the csv.
function normalizeRoles(roles) {
  if (roles === undefined || roles === null) return undefined
  if (Array.isArray(roles)) return roles.map(String).join(",")
  const r = String(roles).trim().toLowerCase()
  if (["", "public", "all", "everyone", "any", "*", "для всех", "всем", "все"].includes(r)) return "off"
  return String(roles).trim()
}
// A group is GATED (needs a login affordance) when it restricts to a real role — anything but off/public.
const isGated = roles => roles !== undefined && roles !== "off"
// set-auth: the IMPLIED requirement — if any group is role-gated, the app-shell login MUST be ON, else a
// visitor can never sign in to reach it (the "authButton:false" bug). Idempotently set the build-time env
// NEXT_PUBLIC_APP_SHELL_AUTH in the slot's authoritative .env.local (same file manage-group reads); the
// deploy sub-step bakes it. Returns the { code, out } shape runCycle expects. No stdout (keeps last-line JSON clean).
async function execSetAuth(outRoot, side) {
  const s = ["left", "right"].includes(side) ? side : "left"
  let rel = null
  for (const r of [".env.local", "app/.env.local"]) { if (await exists(join(outRoot, r))) { rel = r; break } }
  if (!rel) rel = ".env.local"
  const p = join(outRoot, rel)
  let src = ""; try { src = await readFile(p, "utf8") } catch { /* create */ }
  const line = `NEXT_PUBLIC_APP_SHELL_AUTH=${s}`
  const re = /^\s*NEXT_PUBLIC_APP_SHELL_AUTH\s*=.*$/m
  const next = re.test(src) ? src.replace(re, line) : (src.replace(/\s*$/, "") + `\n${line}\n`)
  try { await writeFile(p, next, "utf8"); return { code: 0, out: `set-auth ${s} → ${rel}` } }
  catch (e) { return { code: 1, out: `set-auth failed: ${String(e?.message ?? e)}` } }
}

// ── one frozen cycle for a sub-step ──────────────────────────────────────────
async function runCycle(outRoot, env, sub, log) {
  const n = await nextStepNumber(outRoot)
  const opened = await openStep(outRoot, n, sub.name, sub.description)
  log.push(`open-step ${pad(n)} «${sub.name}»`)
  const ex = await sub.execute()
  if (ex.code !== 0) { log.push(`execute FAILED: ${ex.out.slice(-300)}`); return { ok: false, step: n, stage: "execute", detail: ex.out.slice(-300), keptOpen: opened.rel } }
  log.push(`execute ok`)
  const dep = await deploy(env.adminUrl, env.deploySecret, sub.name)
  if (!dep.ok) { log.push(`deploy FAILED (${dep.status || dep.error})`); return { ok: false, step: n, stage: "deploy", detail: dep.status || dep.error, keptOpen: opened.rel } }
  log.push(`deploy ${dep.status}`)
  // RECORD (the gate). Build the row exactly like the deployments contract.
  const row = { id: randomUUID(), result: 3, project: "default", tokens: 0, platform: env.platform, model: env.model, page_url: sub.pageUrl, commit_message: sub.name, status: "ready", duration_ms: null, commit_hash: null, branch: null, step: String(n), author: "Content Orchestrator", created_by: "hermes@agent" }
  const rec = await recordDeployment(env.dataUrl, env.dataSecret, row)
  if (!rec.ok || !(await verifyRecord(env.dataUrl, env.dataSecret, row.id))) {
    log.push(`RECORD FAILED — GATE: step ${pad(n)} stays OPEN (Vercel invariant)`)
    return { ok: false, step: n, stage: "record", detail: rec.error || "record not confirmed", keptOpen: opened.rel }
  }
  log.push(`record deployment ${row.id} (step ${pad(n)})`)
  const doneRel = await closeStep(outRoot, opened)   // only reached AFTER confirmed record
  log.push(`close-step → ${doneRel}`)
  return { ok: true, step: n, deploymentId: row.id, pageUrl: sub.pageUrl, doneRel }
}

// ── report-blocker: open a development step documenting a blocker, leave it OPEN ──
// For when work hits the edge of the agent's tools (no tool fits, or a tool errored and the
// fix needs code analysis). Hermes does NOT program; it records the blocker as an OPEN step so
// a human can activate a coding agent who picks it up cold. No deploy/record/close — it is a handoff.
async function reportBlocker(outRoot, a) {
  const title = (typeof a["blocker-title"] === "string" && a["blocker-title"]) || "Content task needs a coding agent"
  const lines = [
    "I am Hermes, the workspace orchestrator. I received a task from the owner that I cannot finish with my own tools (I do not program — I only call MCP tools).", "",
    `**Owner's task:** ${(typeof a.task === "string" && a.task) || "(describe the request)"}`,
  ]
  if (typeof a["mcp-tool"] === "string" && a["mcp-tool"]) lines.push("", `**I was working through MCP tool:** \`${a["mcp-tool"]}\``)
  if (typeof a["sub-task"] === "string" && a["sub-task"]) lines.push(`**On sub-task:** ${a["sub-task"]}`)
  if (typeof a.error === "string" && a.error) lines.push("", "**The error that occurred:**", "```", a.error, "```")
  lines.push("", "**What is needed:** a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) to analyse the code and finish this. This step stays OPEN as the handoff record.")
  const n = await nextStepNumber(outRoot)
  const opened = await openStep(outRoot, n, title, lines.join("\n"))
  // Compact single-line JSON: the MCP bridge parses the LAST stdout line as the result.
  console.log(JSON.stringify({ ok: true, reportedBlocker: true, step: n, stepFile: opened.rel, message: `Recorded blocker as development step ${pad(n)}. Ask the owner to activate a coding agent to finish it.` }))
}

// ── ORDER SHEET (наряд-заказ) — the mechanical confirmation layer (step 167) ──
// The dry-run returns RESOLVED, human-readable lines the model must relay VERBATIM (it never
// words the confirmation itself — the weak-model lesson: recite ≠ execute). The real run then
// requires approve:"os-<sha256(normalized plan)>" — a plan that changed, or was never shown,
// mechanically cannot start. Labels/questions come from the store registry's `confirm` block
// (template-descriptor-driven — scales to any future template); a lone CLI without a store
// falls back to the identical built-in copy.
const CONFIRM_FALLBACK = {
  labels: {
    en: { visibility: "Visible to", public: "EVERYONE (no login)", publicGuest: "everyone (guests get an account on first action)", rolesOnly: "ONLY signed-in with role(s)", menus: "Appears in", menuNames: { top: "top menu", footer: "footer", left: "left drawer", right: "right drawer" }, nowhere: "NOWHERE (no menu enabled!)", languages: "Languages", pages: "Pages", stubs: "test stub posts", admin: "Admin panel", dashboard: "User dashboards", tools: "Auto-included tools", yes: "yes", no: "no" },
    ru: { visibility: "Кому видно", public: "ВСЕМ (без входа)", publicGuest: "всем (гость получает аккаунт при первом действии)", rolesOnly: "ТОЛЬКО вошедшим с ролью", menus: "Появляется в", menuNames: { top: "верхнее меню", footer: "футер", left: "левый ящик", right: "правый ящик" }, nowhere: "НИГДЕ (ни одно меню не включено!)", languages: "Языки", pages: "Страницы", stubs: "тестовых заглушек", admin: "Админ-панель", dashboard: "Пользовательские дашборды", tools: "Автоматически подключается", yes: "да", no: "нет" },
  },
  questions: {
    admin: { en: "Do you plan an ADMIN PANEL for this group of pages (a private, admin-role page for managing its content)? Answer yes/no.", ru: "Предполагаете ли вы АДМИНИСТРАТИВНУЮ ПАНЕЛЬ для этой группы страниц (закрытая страница с ролью администратора для управления её содержимым)? Ответьте да/нет." },
    dashboard: { en: "Do you plan USER DASHBOARDS for this group of pages (a personal dynamic dashboard/[userId] page per user)? Answer yes/no.", ru: "Предполагаете ли вы ПОЛЬЗОВАТЕЛЬСКИЕ ДАШБОРДЫ для этой группы страниц (персональная динамическая страница dashboard/[userId] для каждого пользователя)? Ответьте да/нет." },
  },
  explain: {
    admin: { en: "An admin panel is a private, role-gated page where the owner/manager maintains this group's content (for a store — its assortment). Building it is a separate later capability; right now the answer is only RECORDED in the group manifest.", ru: "Админ-панель — закрытая страница (роль администратора), где владелец/менеджер управляет содержимым этой группы (у магазина — ассортиментом). Само создание — отдельная будущая разработка; сейчас ответ только ЗАПИСЫВАЕТСЯ в манифест группы." },
    dashboard: { en: "User dashboards are a dynamic dashboard/[userId]/ layer — a personal page per user for this group. Building it is a separate later capability; the answer is only RECORDED now.", ru: "Пользовательские дашборды — динамический слой dashboard/[userId]/: персональная страница каждого пользователя для этой группы. Само создание — отдельная будущая разработка; сейчас ответ только ЗАПИСЫВАЕТСЯ." },
  },
}
async function loadConfirm(store) {
  if (store) { try { const r = JSON.parse(await readFile(join(store, "registry.json"), "utf8")); if (r.confirm?.labels) return r.confirm } catch { /* fallback */ } }
  return CONFIRM_FALLBACK
}
const pickLang = l => (l === "ru" ? "ru" : "en")
function orderSheetId(norm) { return "os-" + createHash("sha256").update(JSON.stringify(norm)).digest("hex").slice(0, 16) }
// One resolved human line per group — rendered by THIS tool from normalized values, never by the model.
function renderOrderLine(L, n) {
  const vis = n.roles === "off" ? L.public : (n.roles === "guest" ? L.publicGuest : `${L.rolesOnly}: ${n.roles}`)
  const menusOn = Object.entries(n.menus || {}).filter(([, v]) => v && v.enabled).map(([s]) => L.menuNames[s] || s)
  const parts = [
    `${n.tab}`,
    `${L.visibility}: ${vis}`,
    `${L.menus}: ${menusOn.length ? menusOn.join(", ") : L.nowhere}`,
    `${L.languages}: ${n.languages.length ? n.languages.join(", ") : "(slot default)"}`,
    n.pages.length ? `${L.pages}: ${n.pages.join(", ")}` : `${n.samples} ${L.stubs}`,
    `${L.admin}: ${n.admin ? L.yes : L.no} · ${L.dashboard}: ${n.dashboard ? L.yes : L.no}`,
  ]
  if (n.tools.length) parts.push(`${L.tools}: ${n.tools.join(", ")}`)
  return parts.join(" — ")
}
function announceText(lang, base) {
  const arch = `${base || ""}/architecture`, steps = `${base || ""}/development-steps`
  return lang === "ru"
    ? `Ухожу в разработку — она завершится публикацией и может занять время; активность в этом чате будет скрыта. Следите за прогрессом в реальном времени: ${arch} и ${steps}.`
    : `I'm going into development now — it finishes by publishing and may take a while; activity in this chat will be hidden meanwhile. Watch live progress: ${arch} and ${steps}.`
}

// ── COMPOUND FLAT PLAN — multi-group frozen assembly (step 167) ───────────────
// A whole complex frozen request in one intent: an array of group specs, each with its own
// menu placement / access tier / languages. Decomposed FLAT (no recursion) into the finest
// sub-steps — create-section → set-group (menus/roles) → add-page(s) — each run through the
// SAME frozen cycle (open→execute→deploy→RECORD→close). dry_run returns the whole flat plan;
// a real run executes every sub-step in order and STOPS at the first failure (step kept open).
async function runPlan(outRoot, a) {
  let groups
  try { groups = JSON.parse(a.plan) } catch { throw new Error("--plan must be valid JSON (an array of group specs)") }
  if (!Array.isArray(groups) || !groups.length) throw new Error("--plan must be a non-empty array of group specs")

  const env = {
    adminUrl: a["admin-url"] || "http://127.0.0.1:3002",
    dataUrl: a["data-url"] || "http://127.0.0.1:3300",
    deploySecret: process.env.DEPLOY_SECRET || "",
    dataSecret: process.env.DATA_SECRET || "",
    platform: a.platform || "hermes",
    model: a.model || null,
  }
  const publicBase = (typeof a["public-url"] === "string" && a["public-url"].replace(/\/$/, "")) || ""
  const pageUrl = (tab, slug) => `${publicBase || ""}/en/${tab}${slug ? "/" + slug : ""}`
  const store = a.store
  const authSide = ["left", "right"].includes(a["auth-side"]) ? a["auth-side"] : "left"
  const ownerLang = pickLang(a["owner-lang"])
  const confirm = await loadConfirm(store)
  const L = confirm.labels[ownerLang] || confirm.labels.en
  let anyGated = false

  // BUILD the flat sub-step list across every group (deterministic, by state), collecting the
  // NORMALIZED per-group record (feeds the order sheet + the approve hash) and any missing
  // MANDATORY answers (admin/dashboard — the owner must decide per group; needs_input below).
  const subs = [], norm = [], missing = []
  for (const g of groups) {
    const tab = String(g.tab || "")
    if (!/^[a-z][a-z0-9-]*$/.test(tab)) throw new Error(`group.tab must be kebab-case: ${JSON.stringify(g.tab)}`)
    const format = ["news", "blog", "document"].includes(g.format) ? g.format : "news"
    const languagesCsv = Array.isArray(g.languages) && g.languages.length ? g.languages.map(String).join(",")
      : (typeof g.languages === "string" ? g.languages : "")
    const sectionExists = await isDir(join(outRoot, "app", "[lang]", tab))

    // named pages (kebab). OPERATION GATE: an existing page = MODIFY = coding scenario → refuse.
    const pagesList = (Array.isArray(g.pages) ? g.pages : []).map(p => slugify(typeof p === "string" ? p : (p?.topic ?? p?.slug ?? "")))
    if (pagesList.some(s => !s)) throw new Error(`group '${tab}': a page entry needs a topic/slug`)
    for (const slug of pagesList) {
      if (await pageExists(outRoot, tab, slug)) {
        console.log(JSON.stringify({ ok: false, gate: "operation", scenario: "REAL-DEVELOPMENT", refused: `${tab}/${slug}`,
          message: "In the current scenario (assembly from frozen templates) this task is not accepted: the page already exists, and modifying an existing page is a separate request handled by coding agents." }))
        return
      }
    }

    // samples: explicit → honored (they're wanted test posts); absent → 0 if named pages given, else 2.
    const explicitSamples = g.samples !== undefined
    const samples = explicitSamples ? Math.max(0, Math.min(10, parseInt(g.samples, 10) || 0)) : (pagesList.length ? 0 : 2)

    // resolve access + the MANDATORY owner decisions (step 167). admin/dashboard have no default:
    // absent → the run cannot proceed; needs_input returns the exact question texts to relay.
    const roles = normalizeRoles(g.roles) ?? "off"
    if (isGated(roles)) anyGated = true
    if (typeof g.admin !== "boolean") missing.push({ tab, field: "admin", question: (confirm.questions.admin || {})[ownerLang] || CONFIRM_FALLBACK.questions.admin[ownerLang], explain: (confirm.explain.admin || {})[ownerLang] || CONFIRM_FALLBACK.explain.admin[ownerLang] })
    if (typeof g.dashboard !== "boolean") missing.push({ tab, field: "dashboard", question: (confirm.questions.dashboard || {})[ownerLang] || CONFIRM_FALLBACK.questions.dashboard[ownerLang], explain: (confirm.explain.dashboard || {})[ownerLang] || CONFIRM_FALLBACK.explain.dashboard[ownerLang] })

    // normalized record — feeds the order sheet AND the approve hash (fixed key order = stable hash)
    const menusNorm = {}
    for (const s of ["top", "footer", "left", "right"]) { const m = g.menus && g.menus[s]; menusNorm[s] = { enabled: !!(m && m.enabled), order: m && Number.isFinite(m.order) ? Math.trunc(m.order) : 10 } }
    const toolsNorm = [] // filled from the primitive's descriptor at compose time; echoed for future descriptor-driven templates
    norm.push({ tab, format, roles, languages: languagesCsv ? languagesCsv.split(",") : [], pages: pagesList, samples, menus: menusNorm, admin: g.admin === true, dashboard: g.dashboard === true, tools: toolsNorm, sectionExists })

    // create-section (only if the section is missing). SEED: add-page clones a SIBLING stub, so a section
    // with named pages but 0 samples needs one throwaway seed (sample-1) to clone from — removed afterwards.
    let seedSlug = null
    if (!sectionExists) {
      if (!store) throw new Error(`--store (frozen-templates dir) is required to create section '${tab}'`)
      const seedNeeded = pagesList.length > 0 && samples < 1
      const createSamples = seedNeeded ? 1 : samples
      if (seedNeeded) seedSlug = "sample-1"
      subs.push({ kind: "create-section", tab, name: `Create ${tab} section`,
        description: `Compose the ${tab} section (${format}, ${createSamples} stub post${createSamples === 1 ? "" : "s"}${seedNeeded ? " — seed for cloning the named pages" : ""}) via the Frozen Template Constructor.`,
        pageUrl: pageUrl(tab, ""), execute: () => execCreateSection(outRoot, { store, tab, format, samples: createSamples, languages: languagesCsv || undefined, admin: g.admin === true, dashboard: g.dashboard === true }) })
    }
    // named pages — clone the frozen stub under each English identifier (one post spans all languages, step 166).
    for (const slug of pagesList) {
      subs.push({ kind: "add-page", tab, name: `Add ${tab} page ${slug}`,
        description: `Clone the frozen stub into ${tab}/${slug} (structure taken, not generated).`,
        pageUrl: pageUrl(tab, slug), execute: () => execAddPage(outRoot, { tab, slug }) })
    }
    // remove the throwaway seed stub (only when we added one solely to enable cloning).
    if (seedSlug) {
      subs.push({ kind: "remove-seed", tab, name: `Remove seed stub ${seedSlug} from ${tab}`,
        description: `Delete the throwaway seed stub used only to clone the named pages (no leftover sample post).`,
        pageUrl: pageUrl(tab, ""), execute: () => execDeletePage(outRoot, { tab, slug: seedSlug }) })
    }
    // set-group: menu placement (158) + access tier (roles) + owner declarations. Runs for every
    // group in the plan (the manifest is the order sheet's single source of truth on the slot).
    subs.push({ kind: "set-group", tab, name: `Place ${tab} in menus / set access`,
      description: `Set ${tab} group manifest: menus, roles=${roles}, admin=${g.admin === true}, dashboard=${g.dashboard === true}.`,
      pageUrl: pageUrl(tab, ""), execute: () => execSetGroup(outRoot, { tab, menus: menusNorm, roles, childrenDropdown: g.childrenDropdown, admin: g.admin === true, dashboard: g.dashboard === true }) })
  }
  // IMPLIED REQUIREMENT (step 167): any role-gated group needs the app-shell login turned ON, or the visitor
  // can never sign in to reach it. Add ONE set-auth sub-step (build-time env), the last placement sub-step.
  if (anyGated) {
    subs.push({ kind: "set-auth", tab: "(app-shell)", name: `Enable app-shell login (${authSide})`,
      description: `A role-gated group exists → turn on the visitor login (NEXT_PUBLIC_APP_SHELL_AUTH=${authSide}) so gated content is reachable.`,
      pageUrl: "", execute: () => execSetAuth(outRoot, authSide) })
  }
  if (!subs.length) throw new Error("plan produced no sub-steps (every section exists and no menus/roles/pages given)")

  // MANDATORY QUESTIONS GATE (step 167): admin/dashboard are the owner's decisions — a plan
  // missing them cannot even render an order sheet. The tool hands the model the EXACT question
  // and explanation texts to relay; the model asks, fills the plan fields, calls dry_run again.
  if (missing.length) {
    console.log(JSON.stringify({ ok: false, needs_input: true, missing,
      instruction: "Ask the owner each question VERBATIM (use `explain` if they ask what it is), set the boolean admin/dashboard fields on those plan groups, then call dry_run again." }))
    return
  }

  // ORDER SHEET — resolved human lines + implied requirements + the approve token.
  const publicBaseForText = publicBase || ""
  const impliedLines = anyGated ? [{
    kind: "set-auth",
    text: ownerLang === "ru"
      ? `Включаю публичный вход на сайте (ящик аккаунта: ${authSide === "left" ? "слева" : "справа"}) — есть группа, закрытая ролями, иначе посетителю некуда войти.`
      : `Enabling the public site login (account drawer: ${authSide}) — a role-gated group exists, otherwise a visitor could never sign in to reach it.`,
  }] : []
  const sheet = {
    id: orderSheetId(norm),
    lines: norm.map((n, i) => ({ n: i + 1, tab: n.tab, resolved: n, text: renderOrderLine(L, n) })),
    implied: impliedLines,
    announce_text: announceText(ownerLang, publicBaseForText),
    confirm_instruction: ownerLang === "ru"
      ? `Покажи владельцу строки наряд-заказа ДОСЛОВНО (по одной на группу + implied). Правки → измени plan[] и повтори dry_run (id сменится). При явном «да» — вызови БЕЗ dry_run с approve:"${orderSheetId(norm)}" и ПЕРЕДАЙ владельцу announce_text дословно.`
      : `Show the owner the order-sheet lines VERBATIM (one per group + implied). Edits → change plan[] and re-run dry_run (the id changes). On an explicit "yes" — call WITHOUT dry_run with approve:"${orderSheetId(norm)}" and RELAY announce_text to the owner verbatim.`,
  }

  // DRY-RUN → the order sheet + the whole flat plan, nothing written.
  if (a["dry-run"]) {
    console.log(JSON.stringify({ ok: true, dryRun: true, mode: "plan", groups: groups.length, order_sheet: sheet,
      plan: subs.map(s => ({ kind: s.kind, tab: s.tab, name: s.name, pageUrl: s.pageUrl })),
      note: "FLAT pipeline: each sub-step runs open→execute→deploy→RECORD(GATE)→close, in order; stop at first failure. No recursion." }))
    return
  }

  // 🔒 APPROVE TOKEN — the mechanical confirmation bond. A real run REQUIRES the token of the
  // exact order sheet the owner saw; a changed plan (different hash) or a skipped confirmation
  // cannot start. This is what makes "show first, then run" physics, not model goodwill.
  if (a.approve !== sheet.id) {
    // NEVER leak the expected token here — it is only issued by dry_run, TOGETHER with the order
    // sheet lines the model must show. Leaking it in the refusal would let a model "approve"
    // without ever rendering the sheet.
    console.log(JSON.stringify({ ok: false, gate: "approve", expected_flow: "call with dry_run:true first → show the returned order_sheet lines to the owner verbatim → owner says yes → call again with the approve token from that same dry_run response",
      detail: a.approve ? `approve token mismatch (the plan changed since it was confirmed — re-run dry_run, re-show, re-confirm)` : `missing approve token (the order sheet was never confirmed)` }))
    return
  }

  // RUN every sub-step in order; STOP at the first failure (that step stays open).
  const log = [], results = []
  for (const sub of subs) {
    const r = await runCycle(outRoot, env, sub, log)
    results.push({ ...r, kind: sub.kind })
    if (!r.ok) { console.log(JSON.stringify({ ok: false, mode: "plan", failedStage: r.stage, detail: r.detail, stepKeptOpen: r.keptOpen, chronology: log, results })); process.exit(3) }
  }
  console.log(JSON.stringify({ ok: true, mode: "plan", groups: groups.length, order_sheet_id: sheet.id,
    steps: results.map(r => ({ step: r.step, kind: r.kind, deploymentId: r.deploymentId, pageUrl: r.pageUrl, doneRel: r.doneRel })), chronology: log }))
}

async function main() {
  const a = parseArgs(process.argv.slice(2))
  const outRoot = resolve(a.out || "")
  if (!a.out) throw new Error("--out (slot root) is required")
  const action = a.action
  if (action === "report-blocker") return reportBlocker(outRoot, a)
  if (typeof a.plan === "string" && a.plan.trim()) return runPlan(outRoot, a)   // compound flat plan (step 167)
  if (!["add-page", "create-section"].includes(action)) throw new Error("--action must be add-page|create-section|report-blocker (or pass --plan <json>)")
  const tab = (typeof a.tab === "string" && a.tab) || "news"
  if (!/^[a-z][a-z0-9-]*$/.test(tab)) throw new Error("--tab must be kebab-case")
  const topic = typeof a.topic === "string" ? slugify(a.topic) : ""
  if (action === "add-page" && !topic) throw new Error("--topic is required for add-page")
  const format = ["news", "blog", "document"].includes(a.format) ? a.format : "news"
  const samples = Math.max(1, Math.min(10, parseInt(a.samples ?? (action === "create-section" ? "2" : "0"), 10) || (action === "create-section" ? 2 : 1)))
  const store = a.store
  const env = {
    adminUrl: a["admin-url"] || "http://127.0.0.1:3002",
    dataUrl: a["data-url"] || "http://127.0.0.1:3300",
    deploySecret: process.env.DEPLOY_SECRET || "",
    dataSecret: process.env.DATA_SECRET || "",
    platform: a.platform || "hermes",
    model: a.model || null,
  }
  const publicBase = (typeof a["public-url"] === "string" && a["public-url"].replace(/\/$/, "")) || ""
  const pageUrl = (sub, slug) => `${publicBase || ""}/en/${tab}${slug ? "/" + slug : ""}`

  // 1) RECOGNIZE state
  const sectionExists = await isDir(join(outRoot, "app", "[lang]", tab))

  // 2) DECOMPOSE (deterministic, by state)
  const subs = []
  if (action === "create-section" || !sectionExists) {
    if (sectionExists && action === "create-section") throw new Error(`section '${tab}' already exists — ADD a page (action=add-page), do NOT recreate`)
    if (!store) throw new Error("--store (frozen-templates dir) is required to create the section")
    subs.push({
      kind: "create-section", name: `Create ${tab} section`, description: `Compose the ${tab} section (${format}, ${samples} stub posts) via the Frozen Template Constructor.`,
      pageUrl: pageUrl(null, ""), execute: () => execCreateSection(outRoot, { store, tab, format, samples, languages: a.languages }),
    })
  }
  if (action === "add-page") {
    subs.push({
      kind: "add-page", name: `Add ${tab} page ${topic}`, description: `Clone the frozen stub into ${tab}/${topic} (structure taken, not generated).`,
      pageUrl: pageUrl(null, topic), execute: () => execAddPage(outRoot, { tab, slug: topic }),
    })
  }

  // 3) DRY-RUN → just the decomposition plan
  if (a["dry-run"]) {
    console.log(JSON.stringify({ ok: true, dryRun: true, action, tab, topic, sectionExists, plan: subs.map(s => ({ kind: s.kind, name: s.name, pageUrl: s.pageUrl })), note: "Each sub-step runs open->execute->deploy->record(GATE)->close. No close without a deployment_records row." }))
    return
  }

  // 4) RUN each sub-step through the frozen cycle; STOP at the first failure (keep that step open)
  const log = [], results = []
  for (const sub of subs) {
    const r = await runCycle(outRoot, env, sub, log)
    results.push(r)
    if (!r.ok) { console.log(JSON.stringify({ ok: false, action, tab, topic, failedStage: r.stage, detail: r.detail, stepKeptOpen: r.keptOpen, chronology: log, results })); process.exit(3) }
  }
  console.log(JSON.stringify({ ok: true, action, tab, topic, steps: results.map(r => ({ step: r.step, deploymentId: r.deploymentId, pageUrl: r.pageUrl, doneRel: r.doneRel })), chronology: log }))
}

main().catch(e => { console.error("orchestrate-content-by-steps:", e.message); process.exit(1) })

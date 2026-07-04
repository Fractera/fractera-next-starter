#!/usr/bin/env node
// orchestrate-project-by-steps — the FROZEN PROCESS for PROJECT (automation) decomposition.
//
// Sibling of orchestrate-content-by-steps, but a DIFFERENT machine. From the content engine we take
// ONLY THE IDEA (freeze the process: decompose + materialize the whole sub-step queue to disk BEFORE
// any development), not the mechanism. The content engine decomposes deterministically by file STATE
// and DEPLOYS each sub-step in one process. A project is decomposed by a MODEL (Hermes proposes a
// graph of nodes), the engine only PLANS / VALIDATES / DOCUMENTS / MATERIALIZES, and the real
// development of each node is done LATER by a coding agent in its own session. So there is NO per-node
// deploy and NO deployment_records gate here — the gate is SPEC COMPLETENESS (design D1, step 184).
//
// Pipeline (this file grows across sub-sessions D1.1 → D1.2 → D1.3):
//   proposed node graph (--plan) ──►
//     1. NORMALIZE     — slug ids (rule 166), UPPER_SNAKE envKeys, kind defaults, dedup
//     2. VALIDATE DAG  — dependsOn resolve to real nodes, no cycles, a root exists
//     3. VALIDATE SPEC — GATE: every node has task+description+todo, io declared, keys well-formed,
//                        and the readme plan carries all mandatory sections. Incomplete → needs_spec.
//     4. ORDER SHEET   — resolved human node lines + stable approve token os-<hash(graph)>
//     [D1.2] 5. MATERIALIZE — the whole queue of NEW-STEPS/<NN>-<slug>.md spec files + project readme.md
//     [D1.2] 6. RESUME       — stable token; a cold re-run skips finished sub-steps
//
// D1.1 scope (THIS sub-session): steps 1–4 + --dry-run (plan only, writes NOTHING). Materialization
// (5) and resume (6) arrive in D1.2. The SPEC GATE already fires in both dry-run and a real run.
//
// Node contract (WDK-neutral seam — D6 fills `io` with the real Vercel Workflow schema, step 183):
//   node: { id, title, kind, description, task, tools[], envKeys[], io{in,out}, todo[], dependsOn[] }
//   kind ∈ "trigger" | "action" | "transform"  (WDK-compatible)
//
// Usage:
//   node orchestrate-project-by-steps.mjs --out <slot-root> \
//     ( --plan '<graph JSON>' | --plan-file <path.json> ) \
//     [--category <cat>] [--slug <proj>] [--owner-lang ru|en] [--dry-run] [--approve os-<token>]
//   graph JSON is either a bare array of nodes, or { category?, slug?, project{purpose,efficiency,
//   reuse,result}, nodes[] }. --category/--slug override the graph. --plan-file avoids shell quoting.
//
// Self-sufficient: a lone CLI agent runs it directly (a project may have only Codex, no Hermes);
// the MCP bridge (D5) will spawn it with the same contract. Deterministic; in D1.1 it writes NOTHING.

import { mkdir, writeFile, readFile, readdir, rename, stat } from "node:fs/promises"
import { resolve, join, dirname } from "node:path"
import { createHash } from "node:crypto"

const KINDS = ["trigger", "action", "transform"]
const README_SECTIONS = ["purpose", "efficiency", "reuse", "result"] // §4.1 minus the graph-derived "how it works"
const STEP_ROOT = "DEVELOPMENT-STEPS", NEW_DIR = "NEW-STEPS", DONE_DIR = "COMPLETED-STEPS"
const pad = n => String(n).padStart(2, "0")

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
// slug id — a stable English identifier forever (rule 166). Same shape as the content engine.
const slugify = s => String(s ?? "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50)
// UPPER_SNAKE for env keys (materialized later via persist-env-var-with-rebuild, step 143 — never hardcoded).
const upperSnake = s => String(s ?? "").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")
const str = s => (typeof s === "string" ? s.trim() : "")
const arr = v => (Array.isArray(v) ? v : (v == null ? [] : [v]))

// ── 1. NORMALIZE ─────────────────────────────────────────────────────────────
// Turn a loosely-proposed graph (model output) into the canonical node contract. Never invents
// semantics — only canonicalizes shapes: ids/keys casing, kind default, io object, dedup by id.
function normalizeGraph(raw, cliCategory, cliSlug) {
  let g = raw
  if (Array.isArray(raw)) g = { nodes: raw }
  if (!g || typeof g !== "object") throw new Error("--plan must be a JSON array of nodes or an object { nodes: [...] }")
  const nodesIn = arr(g.nodes)
  if (!nodesIn.length) throw new Error("--plan produced no nodes (need a non-empty node graph)")

  const seen = new Set(), duplicates = []
  const nodes = []
  for (const n0 of nodesIn) {
    const n = n0 && typeof n0 === "object" ? n0 : {}
    const title = str(n.title) || str(n.name)
    let id = slugify(n.id) || slugify(title)
    if (!id) id = `node-${nodes.length + 1}`
    if (seen.has(id)) { duplicates.push(id); continue }        // dedup: keep first
    seen.add(id)
    const io = n.io && typeof n.io === "object" ? n.io : {}
    nodes.push({
      id,
      title: title || id,
      kind: KINDS.includes(str(n.kind).toLowerCase()) ? str(n.kind).toLowerCase() : "action",
      description: str(n.description),
      task: str(n.task),
      tools: arr(n.tools).map(str).filter(Boolean),
      envKeys: arr(n.envKeys).map(upperSnake).filter(Boolean),
      io: { in: io.in ?? null, out: io.out ?? null },
      todo: arr(n.todo).map(str).filter(Boolean),
      dependsOn: [...new Set(arr(n.dependsOn).map(slugify).filter(Boolean))],
    })
  }
  const proj = (g.project && typeof g.project === "object") ? g.project : {}
  const project = {
    purpose: str(proj.purpose),
    efficiency: str(proj.efficiency),
    reuse: str(proj.reuse),
    result: str(proj.result),
  }
  return {
    category: slugify(cliCategory ?? g.category) || "automation",
    slug: slugify(cliSlug ?? g.slug) || slugify(project.purpose) || "project",
    project,
    nodes,
    ...(duplicates.length ? { duplicates } : {}),
  }
}

// ── 2. VALIDATE DAG ──────────────────────────────────────────────────────────
// Topology only: every dependsOn resolves to a real node, no cycles, at least one root (indegree 0).
// Returns a topological order used by the order sheet and (D1.2) materialization sequence.
function validateDag(nodes) {
  const errors = []
  const ids = new Set(nodes.map(n => n.id))
  const indeg = new Map(nodes.map(n => [n.id, 0]))
  const adj = new Map(nodes.map(n => [n.id, []]))
  for (const n of nodes) {
    for (const dep of n.dependsOn) {
      if (!ids.has(dep)) { errors.push(`node "${n.id}" dependsOn unknown node "${dep}"`); continue }
      if (dep === n.id) { errors.push(`node "${n.id}" dependsOn itself`); continue }
      adj.get(dep).push(n.id)          // edge dep → n (dep must finish first)
      indeg.set(n.id, indeg.get(n.id) + 1)
    }
  }
  const roots = nodes.filter(n => indeg.get(n.id) === 0).map(n => n.id)
  if (nodes.length && !roots.length) errors.push("no root node (every node depends on another — a cycle)")
  // Kahn topological sort — leftover nodes reveal the cycle.
  const q = [...roots], order = [], deg = new Map(indeg)
  while (q.length) {
    const id = q.shift(); order.push(id)
    for (const m of adj.get(id)) { deg.set(m, deg.get(m) - 1); if (deg.get(m) === 0) q.push(m) }
  }
  if (order.length !== nodes.length) {
    const inCycle = nodes.map(n => n.id).filter(id => !order.includes(id))
    errors.push(`cycle detected among nodes: ${inCycle.join(", ")}`)
  }
  return { ok: errors.length === 0, errors, order, roots }
}

// ── 3. VALIDATE SPEC (THE GATE) ──────────────────────────────────────────────
// Development cannot start until every node is a COMPLETE spec and the readme plan is whole.
// Mirrors the owner's rule (step 184 §3): "specs are validated before the project enters development".
// Hard gate: task+description+todo non-empty, io declared, envKeys well-formed UPPER_SNAKE, kind valid,
// and the project readme plan carries every mandatory section. Missing items are listed explicitly so
// the model knows exactly what to fill. (A tool-without-key mismatch is a soft warning, not a block —
// many nodes legitimately need no secret; a false hard-fail would be worse than a hint.)
function validateSpec(graph) {
  const missing = [], warnings = []
  for (const n of graph.nodes) {
    const where = `node "${n.id}"`
    if (!n.task) missing.push(`${where}: empty task (needs the exhaustive sub-step spec)`)
    if (!n.description) missing.push(`${where}: empty description (needs a one-line summary)`)
    if (!n.todo.length) missing.push(`${where}: no todo (needs at least one acceptance criterion)`)
    if (!KINDS.includes(n.kind)) missing.push(`${where}: kind must be one of ${KINDS.join("|")}`)
    if (n.io.in == null && n.io.out == null) missing.push(`${where}: io not declared (needs io.in and/or io.out)`)
    for (const k of n.envKeys) if (!/^[A-Z][A-Z0-9_]*$/.test(k)) missing.push(`${where}: env key "${k}" is not UPPER_SNAKE`)
    if (n.tools.length && !n.envKeys.length) warnings.push(`${where}: has tools (${n.tools.join(", ")}) but declares no envKeys — confirm none need a secret`)
  }
  for (const s of README_SECTIONS) if (!graph.project[s]) missing.push(`project readme: missing "${s}" section`)
  return { ok: missing.length === 0, missing, ...(warnings.length ? { warnings } : {}) }
}

// ── 4. ORDER SHEET ───────────────────────────────────────────────────────────
// Stable approve token over the normalized graph (no volatile state for projects). The SAME plan keeps
// the SAME token across sessions — the bond that (in D1.2) makes cold resume after a death possible.
function orderSheetId(graph) {
  const canon = {
    category: graph.category, slug: graph.slug, project: graph.project,
    nodes: graph.nodes.map(n => ({ id: n.id, title: n.title, kind: n.kind, description: n.description, task: n.task, tools: n.tools, envKeys: n.envKeys, io: n.io, todo: n.todo, dependsOn: n.dependsOn })),
  }
  return "os-" + createHash("sha256").update(JSON.stringify(canon)).digest("hex").slice(0, 16)
}
// One resolved human line per node — rendered HERE from normalized values, never worded by the model.
function renderNodeLine(seq, n) {
  const parts = [
    `${seq}. ${n.title} [${n.kind}]`,
    n.task ? `task: ${n.task.length > 80 ? n.task.slice(0, 77) + "…" : n.task}` : "task: (empty)",
  ]
  if (n.tools.length) parts.push(`tools: ${n.tools.join(", ")}`)
  if (n.envKeys.length) parts.push(`keys: ${n.envKeys.join(", ")}`)
  parts.push(`io: ${JSON.stringify(n.io.in)}→${JSON.stringify(n.io.out)}`)
  if (n.dependsOn.length) parts.push(`depends: ${n.dependsOn.join(", ")}`)
  return parts.join(" · ")
}

// ── 5. MATERIALIZE (D1.2) — development-step file lifecycle for project nodes ──
// Same on-disk format as the content engine (fractera:step machine block) so the /service/
// development-steps page renders these too — but a DIFFERENT payload: each file is a rich per-node
// SPEC a coder opens later (§4.2), never an execute-then-deploy sub-step. No deploy, no record, no
// auto-close — the engine PLANS the queue; a coding agent develops and closes each node in D3.
async function nextStepNumber(outRoot) {
  let max = 0
  for (const d of [NEW_DIR, DONE_DIR]) {
    let names = []; try { names = await readdir(join(outRoot, STEP_ROOT, d)) } catch { /* none */ }
    for (const n of names) { const m = n.match(/^(\d+)-/); if (m) max = Math.max(max, Number(m[1])) }
  }
  return max + 1
}
// The rich per-node spec file (§4.2 — ×5 richer than the content engine's renderStep). The FIRST body
// instruction is to read the project readme (owner requirement, step 184). `plan` carries the whole node
// so a COLD session rebuilds the queue from the files alone (resume) — the machine block is the source.
function renderNodeStep(number, node, ctx, status = "new", completedAt = null) {
  const toolLines = node.tools.length ? node.tools.map(t => `- ${t}`) : ["_No external tools._"]
  const keyLines = node.envKeys.length
    ? [...node.envKeys.map(k => `- \`${k}\``), "_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._"]
    : ["_No environment keys._"]
  const depLines = node.dependsOn.length ? node.dependsOn.map(d => `- \`${d}\` (must be completed first)`) : ["_No dependencies (root node)._"]
  const todoLines = node.todo.length ? node.todo.map(t => `- [ ] ${t}`) : ["- [ ] _No acceptance criteria — spec is incomplete._"]
  const body = [
    `# ${pad(number)} — ${node.title}`, "",
    `> Project sub-step · node \`${node.id}\` · kind: ${node.kind} · importance: mandatory · order sheet \`${ctx.sheet}\` (${ctx.seq}/${ctx.total})` + (status === "completed" && completedAt ? ` · completed ${completedAt}` : "") + (status === "in-progress" ? " · in progress" : ""), "",
    `**Before anything else, read \`${ctx.readmeRel}\`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.`, "",
    "## Task", node.task || "_No task._", "",
    "## Tools", ...toolLines, "",
    "## Environment keys", ...keyLines, "",
    "## Inputs / outputs", `- **In:** ${JSON.stringify(node.io.in)}`, `- **Out:** ${JSON.stringify(node.io.out)}`, "",
    "## Depends on", ...depLines, "",
    "## To-do / acceptance criteria", ...todoLines, "",
  ].join("\n")
  const machine = {
    number, name: node.title, importance: "mandatory", status, completedAt,
    description: node.description,
    tasks: node.todo.map(t => ({ body: t })),
    plan: { sheet: ctx.sheet, seq: ctx.seq, total: ctx.total, kind: "project-node", category: ctx.category, slug: ctx.slug, readmeRel: ctx.readmeRel, node: { id: node.id, title: node.title, kind: node.kind, task: node.task, description: node.description, tools: node.tools, envKeys: node.envKeys, io: node.io, dependsOn: node.dependsOn, todo: node.todo } },
  }
  return `${body}\n<!-- fractera:step\n${JSON.stringify(machine)}\n-->\n`
}
async function openNodeStep(outRoot, number, node, ctx) {
  const rel = `${NEW_DIR}/${pad(number)}-${node.id || "node"}.md`
  const abs = join(outRoot, STEP_ROOT, rel)
  await mkdir(dirname(abs), { recursive: true })
  await writeFile(abs, renderNodeStep(number, node, ctx), "utf8")
  return { rel, abs }
}
// Find every project-node step file (both dirs) for ONE order sheet — the persisted queue (resume, 172).
async function scanPlanSteps(outRoot, sheetId) {
  const found = new Map()
  for (const [d, done] of [[NEW_DIR, false], [DONE_DIR, true]]) {
    let names = []; try { names = await readdir(join(outRoot, STEP_ROOT, d)) } catch { continue }
    for (const name of names) {
      if (!name.endsWith(".md")) continue
      try {
        const m = (await readFile(join(outRoot, STEP_ROOT, d, name), "utf8")).match(/<!-- fractera:step\n([\s\S]*?)\n-->/)
        const st = m && JSON.parse(m[1])
        if (!st || st.plan?.sheet !== sheetId) continue
        found.set(String(st.plan.seq), { rel: `${d}/${name}`, abs: join(outRoot, STEP_ROOT, d, name), step: st, done })
      } catch { /* skip unreadable */ }
    }
  }
  return found
}

async function main() {
  const a = parseArgs(process.argv.slice(2))
  const outRoot = resolve(a.out || "")
  if (!a.out) throw new Error("--out (slot root) is required")

  let planText = typeof a.plan === "string" ? a.plan : ""
  if (a["plan-file"]) planText = await readFile(resolve(a["plan-file"]), "utf8")
  if (!planText.trim()) throw new Error("provide --plan '<graph JSON>' or --plan-file <path.json>")
  let raw
  try { raw = JSON.parse(planText) } catch (e) { throw new Error("--plan must be valid JSON: " + e.message) }

  const graph = normalizeGraph(raw, a.category, a.slug)
  const dag = validateDag(graph.nodes)
  const spec = validateSpec(graph)
  const sheetId = orderSheetId(graph)

  // DAG failure is structural — report before anything else (a malformed graph cannot be planned).
  if (!dag.ok) {
    console.log(JSON.stringify({ ok: false, gate: "dag", category: graph.category, slug: graph.slug, errors: dag.errors,
      note: "graph topology is invalid — fix dependsOn / cycles, then re-run" }))
    return
  }
  // SPEC GATE — fires in dry-run AND a real run (design §5). No materialization while incomplete.
  if (!spec.ok) {
    console.log(JSON.stringify({ ok: false, needs_spec: true, category: graph.category, slug: graph.slug, missing: spec.missing, ...(spec.warnings ? { warnings: spec.warnings } : {}),
      instruction: "Each node must be a complete spec (task, description, ≥1 todo, io, well-formed envKeys) and the project readme plan must carry purpose/efficiency/reuse/result. Fill the missing items and re-run.",
      order_sheet_id: sheetId }))
    return
  }

  // Ordered plan (topological) — the queue D1.2 will materialize as NEW-STEPS spec files.
  const byId = new Map(graph.nodes.map(n => [n.id, n]))
  const ordered = dag.order.map((id, i) => { const n = byId.get(id); return { seq: i + 1, id: n.id, title: n.title, kind: n.kind, dependsOn: n.dependsOn } })
  // Where the coder-facing project readme will live (D2 writes it); each step file points here.
  const readmeRel = `projects/${graph.category}/${graph.slug}/readme.md`
  const sheet = {
    id: sheetId,
    category: graph.category,
    slug: graph.slug,
    readme_plan: { ...graph.project },
    readme_path: readmeRel,
    nodes: dag.order.map((id, i) => ({ n: i + 1, id, text: renderNodeLine(i + 1, byId.get(id)) })),
  }

  // Resume detection (172): step files for THIS order sheet already on disk = a prior run of the SAME
  // approved plan. The files ARE the queue — existing ones are skipped, only missing seq are (re)written.
  const prior = await scanPlanSteps(outRoot, sheetId)

  // DRY-RUN — the full decomposition plan, nothing written.
  const slotSeen = await exists(outRoot)
  if (a["dry-run"]) {
    console.log(JSON.stringify({ ok: true, dryRun: true, mode: "project-plan", category: graph.category, slug: graph.slug,
      nodes: graph.nodes.length, ...(graph.duplicates ? { deduped: graph.duplicates } : {}), ...(spec.warnings ? { warnings: spec.warnings } : {}),
      order_sheet: sheet, plan: ordered, out_exists: slotSeen,
      ...(prior.size ? { resume_available: prior.size, resume_note: "step files for this order sheet already exist — a real run RESUMES (existing sub-steps kept, only missing ones written)" } : {}),
      note: "MATERIALIZE (D1.2): a real run writes one NEW-STEPS spec file per node (materialize-first) before any development. Project readme.md (D2) and coder-handoff steps (D1.3) are not emitted yet." }))
    return
  }

  // 🔒 APPROVE TOKEN — a materializing run writes real files, so it REQUIRES the token of the exact
  // order sheet the owner saw (issued only by dry-run). A changed/unshown plan cannot start. (The full
  // human-facing confirm/announce protocol + coder-handoff steps complete in D1.3.)
  if (a.approve !== sheetId) {
    console.log(JSON.stringify({ ok: false, gate: "approve",
      expected_flow: "call with --dry-run first → show the returned order_sheet lines to the owner verbatim → owner says yes → call again with --approve <order_sheet.id>",
      detail: a.approve ? "approve token mismatch (the plan changed since it was confirmed — re-run dry-run, re-show, re-confirm)" : "missing approve token (the order sheet was never confirmed)" }))
    return
  }

  // MATERIALIZE-FIRST (172): persist the WHOLE queue as NEW-STEPS spec files in topological order,
  // BEFORE any development. A cold re-run with the same plan+token skips files already on disk.
  const materialized = [], skipped = []
  let n = await nextStepNumber(outRoot)
  for (let i = 0; i < ordered.length; i++) {
    const seq = i + 1, node = byId.get(ordered[i].id)
    const ex = prior.get(String(seq))
    if (ex) { skipped.push({ seq, id: node.id, rel: ex.rel, status: ex.done ? "completed" : "pending" }); continue }
    const opened = await openNodeStep(outRoot, n, node, { sheet: sheetId, seq, total: ordered.length, category: graph.category, slug: graph.slug, readmeRel })
    materialized.push({ seq, step: n, id: node.id, rel: opened.rel }); n++
  }
  console.log(JSON.stringify({ ok: true, mode: "project-plan", ...(prior.size ? { resumed: true } : {}), category: graph.category, slug: graph.slug,
    order_sheet_id: sheetId, nodes: graph.nodes.length, readme_path: readmeRel,
    materialized, ...(skipped.length ? { skipped } : {}), ...(spec.warnings ? { warnings: spec.warnings } : {}),
    note: `Materialized ${materialized.length} node spec file(s) in ${STEP_ROOT}/${NEW_DIR}${skipped.length ? `, skipped ${skipped.length} already on disk` : ""}. Each file's first instruction is to read ${readmeRel}. Coder develops & closes each node later (D3). Project readme.md is D2.` }))
}

main().catch(e => { console.error("orchestrate-project-by-steps:", e.message); process.exit(1) })

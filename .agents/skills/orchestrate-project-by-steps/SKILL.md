---
name: orchestrate-project-by-steps
description: >
  Turn a PROJECT (automation / internal tool) request into a fully decomposed, materialized
  queue of development sub-steps the RIGHT way — the frozen process for projects, the sibling
  of orchestrate-content-by-steps. Use when the owner wants a private automation ("summarize
  my YouTube channels to Telegram every morning", "auto-publish on a schedule", "a tool for my
  own use"), NOT a public content group. You (Hermes / a model) PROPOSE a graph of nodes
  (task / tools / keys / io / dependsOn); this engine NORMALIZES it, VALIDATES the DAG, GATES
  on spec completeness, and MATERIALIZES the whole queue to disk — one rich spec step per node
  plus one coder-handoff step per node — BEFORE any development. It does NOT deploy, does NOT
  execute a node, does NOT write code: a coding agent builds each node LATER from its step
  file. The gate is SPEC COMPLETENESS, not a deployment record.
version: 0.3.0
metadata:
  hermes:
    tags: [project, automation, orchestrate, decompose, steps, node, dag, materialize, coder-handoff, workflow, cron, tool]
    related_skills: [route-project-or-pages-request, compose-frozen-template, persist-env-var-with-rebuild, prepare-automation-knowledge, propose-new-agent-skill-or-mcp]
---

# orchestrate-project-by-steps

The **frozen process** for **projects** (automations / internal tools). You give a **proposed
node graph**; the engine decomposes it into a materialized queue of development sub-steps and
gates each on **spec completeness** — before any code is written.

This skill is **self-sufficient**: one `.mjs` (or, from D5, one MCP tool), no Hermes required —
a lone agent (even a project with only Codex) runs the whole process on its own.

## Why this exists (read once)

Content had a frozen process (`orchestrate-content-by-steps`); projects did not. Without deep,
materialize-first decomposition a project is "doomed to fail" (owner). From the content engine we
take **only the idea** — freeze the process: decompose and write the whole sub-step queue to disk
FIRST, only then develop. The mechanism is a different machine: content decomposes deterministically
by file STATE and deploys each sub-step in one process; a **project is decomposed by a model** (you
propose the graph), and the engine only **PLANS / VALIDATES / DOCUMENTS / MATERIALIZES** — the real
development of each node happens LATER, done by a coding agent in its own session.

## Which scenario is this? (decide FIRST)

Route with `route-project-or-pages-request` if unsure. This skill is for a **PROJECT** — a private
automation or internal tool the owner runs for themselves (a scheduled pipeline, a bot, a data job),
**not** a public page group (that is `orchestrate-content-by-steps` / `compose-frozen-template`). If
the owner wants "a news page / a blog / documentation", that is content — stop and use the content path.

## The mental model

- **You pass a GRAPH, not a plan of steps.** Each node is:
  `{ id, title, kind, description, task, tools[], envKeys[], io{in,out}, todo[], dependsOn[] }`.
  - `kind` ∈ `trigger` | `action` | `transform` (WDK-compatible).
  - `task` is the EXHAUSTIVE sub-step spec, not a one-liner.
  - `envKeys` are UPPER_SNAKE and get materialized later via the `persist-env-var-with-rebuild`
    skill (step 143) — never hardcode a secret.
  - `io` is a WDK-neutral seam — abstract now, filled with the real Vercel Workflow schema in D6.
  - `dependsOn` are the DAG edges (each id must resolve to another node; no cycles).
  - a node is coder-built by default; set `needsCoder: false` to skip its handoff step.
- **The engine NORMALIZES + VALIDATES + GATES — you do not hand-fix the graph.**
  1. NORMALIZE — slug ids (English, forever — rule 166), UPPER_SNAKE keys, kind defaults, dedup.
  2. VALIDATE DAG — dependsOn resolve, no cycles, a root exists (topological order).
  3. VALIDATE SPEC — **the gate**: every node needs a non-empty `task`, `description`, and ≥1 `todo`,
     `io` declared, well-formed keys; and the project readme plan carries `purpose` / `efficiency` /
     `reuse` / `result`. Incomplete → `needs_spec` lists exactly what to fill; **nothing is materialized.**
- **🔒 The gate is SPEC COMPLETENESS, not a deployment record.** Unlike content, this engine deploys
  nothing and executes no node. "Done" for a node = a coder closed it, not "a deploy row".
- **MATERIALIZE-FIRST (step 172).** On approval the engine writes the WHOLE queue to
  `DEVELOPMENT-STEPS/NEW-STEPS/` BEFORE any development: one rich **spec step** per node
  (`<NN>-<slug>.md`, §4.2 — its first instruction is "read the project readme") plus one
  **coder-handoff step** per coder-built node (`<NN>-coder-handoff-<slug>.md`, §4.3).
- **"Calling the coder is its own step" (owner rule).** The handoff is a SEPARATE materialized step:
  Hermes hands a coding agent ONLY its step number — everything they need (read the readme, open spec
  step NN, deliver, acceptance criteria) is already in the file.
- **No content/code generation here.** The engine plans, validates, documents, materializes. A coding
  agent develops each node later (D3); the project `readme.md` itself is written by D2.

## Decision flow (do exactly this)

1. **Propose the graph** from the owner's intent (+ the cron/integration questionnaire on :3229). Each
   node fully specced (task / tools / keys / io / dependsOn / todo) and the project block filled
   (purpose / efficiency / reuse / result).
2. **Confirm (order-sheet protocol, §8.2):** run with `--dry-run` (or MCP `dry_run: true`). It returns
   an `order_sheet` — RESOLVED human lines, one per node, plus the readme plan, plus `announce_text`
   and `confirm_instruction`. **Show the owner every order-sheet line VERBATIM** — never reword them.
   Edits → change the graph → re-run `--dry-run` (the `order_sheet.id` changes).
3. **On an explicit yes** — run again WITHOUT `--dry-run`, passing `--approve <order_sheet.id>` from
   THAT dry-run. A run without the matching token is refused: a changed or unconfirmed plan cannot start.
   As you start, **relay `announce_text` to the owner verbatim** (it says the run takes a while and where
   to watch live progress: `/service/development-steps`, `/service/architecture`).
4. **Handle the result:**
   - **needs_spec** → the graph is incomplete; fill the listed `missing` items and re-run dry-run.
   - **dag gate** → fix `dependsOn` / cycles and re-run.
   - **ok** → report the materialized queue (spec steps + coder-handoff steps). A coding agent develops
     each node later; you hand it only the step number.

## Materialize-first + cold resume (step 172)

The `order_sheet.id` (`os-<sha256(normalized graph)>`) is STABLE across sessions. The whole queue lands
on disk before any work, so a process death loses nothing. **To resume — even in a brand-new session —
run again with the SAME graph and the SAME `--approve` token**: files already on disk are skipped, only
missing sub-steps are (re)written. The resume key is composite `<kind>:<seq>`, so a node's spec step and
its handoff step never collide. Never treat leftover NEW-STEPS files of a died run as garbage — they ARE
the queue.

## How to call

- **Standalone (lone agent, no MCP)** — run the engine directly:
  ```bash
  node .agents/skills/orchestrate-project-by-steps/orchestrate-project-by-steps.mjs \
    --out <slot-root> ( --plan '<graph JSON>' | --plan-file <path.json> ) \
    [--category <cat>] [--slug <proj>] [--owner-lang ru|en] [--dry-run] [--approve os-<token>]
  ```
  `--plan-file` avoids shell-quoting a big graph. The graph is a bare array of nodes OR
  `{ category?, slug?, project{purpose,efficiency,reuse,result}, nodes[] }`.
- **MCP (D5, planned):** `owner_projects_orchestrate_decomposition({ plan, category?, slug?, owner_lang,
  dry_run })` on :3229 — same contract, always `dry_run: true` first (confirm-before-mutation,
  MCP-REGISTRY §8.1/8.2).

## What it reuses (does not reinvent)

- The development-step file lifecycle, materialize-first + cold resume, the order-sheet / approve token,
  and the `fractera:step` machine block — the **waterway** shared with the content engine (~30%). The
  node contract, `normalizeGraph` / `validateDag` / `validateSpec` gate, the rich per-node spec render,
  the coder-handoff step, and the project readme plan are **written fresh for projects** (~70%). No
  deploy, no `deployment_records`, no per-node execution — those content mechanisms are deliberately out.

## When NOT to use

- A **public content group** (news / blog / docs / catalogue) → `orchestrate-content-by-steps`.
- Writing a node's actual code → that is the coding agent opening the materialized spec step (D3), not
  this engine. This engine stands up the decomposed, validated, materialized queue; it does not develop.

Self-sufficient project skill: shipped to every agent (`.agents` + `.claude/.gemini/.qwen/.kimi` + Hermes).
It does not depend on Hermes — any single agent can run the frozen project process on its own.

<!-- Draft (D1.3). D2 writes the project readme.md; D3 deepens the coder-handoff (SOUL delegation edge +
delegate-task); D5 adds the MCP tool + the ×6 self-sufficiency copies + MCP-REGISTRY + FES docs; D6 fills
`io` with the real WDK schema. Version bumps as those land. -->

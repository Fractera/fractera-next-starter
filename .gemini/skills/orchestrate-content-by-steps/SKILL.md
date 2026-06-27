---
name: orchestrate-content-by-steps
description: >
  Do a content request the RIGHT way, end-to-end, through the frozen development-step
  process. Use whenever the owner asks for content work — "make me a page about Apple",
  "add a news section", "add 3 test news", "create a blog". You pass only the INTENT
  (an action + a topic); this orchestrator DECOMPOSES it by the site's state (does the
  section exist?) into dependent sub-steps, and runs EACH through the full lifecycle:
  open a development step → do it → deploy → RECORD the deployment → close the step. The
  deployment record is a GATE — a step never closes without it (the Vercel invariant). You
  do NOT chain tools yourself, do NOT decompose by hand, do NOT generate content or code.
  Prefer this over calling compose / create-page directly for any real owner request.
version: 1.0.0
metadata:
  hermes:
    tags: [content, orchestrate, news, blog, documentation, page, section, add, create, steps, deployment, lifecycle, decompose, apple]
    related_skills: [compose-frozen-template, manage-content-collections, record-deployment, confirm-before-mutation]
---

# orchestrate-content-by-steps

The **frozen process** for content operations. You give an **intent**; the orchestrator does
the rest **deterministically** — it decomposes the work by the site's state and runs every
piece through the real development-step lifecycle, with the deployment record as a hard gate.

This skill is **self-sufficient**: it is one tool (or one `.mjs`), no Hermes required.

## Why this exists (read once)

Calling `compose` / `create-page` directly, by hand, is what caused the failure: an agent did
"create section + 3 pages + rebuild" in one chaotic burst and crashed. The fix is to **freeze
the process**, not just the templates. You stop orchestrating; the pipeline does.

## The mental model

- **You pass an INTENT, not a plan:**
  - `action: 'add-page'` + `topic` → one page about a topic (e.g. `topic: apple`).
  - `action: 'create-section'` (+ `samples: N`) → a new section / N test posts.
  - optional `tab` (default `news`), `format`, `languages`.
- **The orchestrator DECOMPOSES by STATE — you do not.** Asked for a page about Apple and the
  news section does not exist? It runs **two** sub-steps: (A) create the section, (B) add the
  page. Section already exists? Just (B). This is deterministic — it checks the slot, it does
  not guess.
- **Every sub-step runs the FROZEN cycle (order fixed):**
  `open development step → execute (compose | clone stub) → deploy → verify → RECORD in the
  Deployment table → close step`.
- **🔒 The deployment record is a GATE.** A step **cannot be closed** without a confirmed row
  in `deployment_records` (like Vercel never skips recording a deploy). If recording fails, the
  step **stays open** and the run stops — you report it, you do NOT hand-fix.
- **No content/code generation.** Sections come from the Frozen Template Constructor; pages are
  clones of frozen stubs. "3 test news" = `create-section samples=3` (the stubs ARE the test news).

## Decision flow (do exactly this)

1. **Extract the intent** from the request: action (`add-page` for "a page about X"; `create-section`
   for "a section" / "N test posts"), topic, tab.
2. **Confirm (§8.2):** call `owner_content_orchestrate` with `dry_run: true` → it returns the
   **decomposition** (the sub-steps it will run). Show the owner, get a yes.
3. **Run:** call again without `dry_run`. It executes every sub-step through the frozen cycle and
   returns the **chronology**: steps opened/closed, deployment record ids, public URLs.
4. **Handle the result:**
   - **ok** → report the chronology + the public URLs (mode-aware) to the owner.
   - **a sub-step failed** → it tells you the failing stage and that the step was **kept open**
     (no record → not closed). Report it plainly. If it ERRORED (broken tool), the fix is to
     repair the tool — do **not** hand-author or delegate hand-authoring as a workaround.

## How to call

- **MCP (every agent):** `owner_content_orchestrate({ action, topic?, tab?, format?, samples?, languages?, dry_run })`.
  Always `dry_run: true` first.
- **Standalone (lone agent, no MCP)** — run the orchestrator directly (needs DEPLOY_SECRET +
  DATA_SECRET in env, the sanctioned platform exception):
  ```bash
  node .agents/skills/orchestrate-content-by-steps/orchestrate-content-by-steps.mjs \
    --out . --action add-page --topic apple --tab news --store <frozen-templates-dir> --dry-run
  ```

## What it reuses (does not reinvent)

- `compose-frozen-template` (section + stub posts) · `manage-content-collections` create-page
  (clone one stub) — the executors. `owner_deploy_rebuild_slot` semantics for deploy. The
  development-step files (`DEVELOPMENT-STEPS/`) and `deployment_records` table, per the project's
  development methodology (`CRUD-DOCS/workspace-standards/development-methodology.md`, `CLAUDE.md §6`).

## When NOT to use

- Authoring a real article body (not stub text) → that is a later capability (design-system step),
  not this. This orchestrator stands up structure through the step lifecycle; it does not write prose.

Self-sufficient project skill: shipped to every agent (`.agents` + `.claude/.gemini/.qwen` + Hermes).
It does not depend on Hermes — any single agent can run the frozen process on its own.

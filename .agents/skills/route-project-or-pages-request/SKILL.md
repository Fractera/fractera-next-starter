---
name: route-project-or-pages-request
description: >
  The TOP-LEVEL fork for any "I want a service / tool / automation / do X for me" wish. It has
  THREE branches along two axes: PAGES (public product surface, any role) vs OWN-USE; and, for
  own-use, DURABLE AUTOMATION (repeats on a schedule → the frozen project process, nodes + cron,
  zero Hermes runtime load) vs ONE-OFF/DIRECT (a one-time/rare action → you just do it with your
  own skills; NOTHING is built, no nodes for repetition). The decisive test between the last two
  is REGULARITY. Use BEFORE the task-scenario-router (FROZEN vs REAL-DEV) — that router handles
  the pages branch AFTER this fork. The route is NEVER fixed without an explicit confirmed answer;
  when a vector is implicit, ask the owner ONE verbatim question and wait. Self-sufficient: the
  fork is cognitive — a lone CLI agent runs it from this skill alone; via MCP call
  owner_projects_route_request (:3229, read-only).
version: 1.1.0
metadata:
  hermes:
    tags: [route, fork, project, projects, pages, automation, one-off, direct, durable, regularity, private, public, service, tool, cron, integration, segment, wish, before]
    related_skills: [orchestrate-content-by-steps, orchestrate-project-by-steps, compose-frozen-template, declare-architecture-page-or-task, persist-env-var-with-rebuild]
---

# route-project-or-pages-request

The **first fork** any "build me something / do X for me" wish passes through. One level ABOVE the
task-scenario-router (`CRUD-DOCS/workspace-standards/task-scenario-router.md`): before deciding
FROZEN vs REAL-DEV, decide **which of three branches** the wish belongs to.

> **Two axes, three branches.** Axis 1 — is it **public** (for the site's visitors) or for the
> owner's **own use**? Axis 2 (own-use only) — does it **repeat regularly** (on a schedule) or is it
> **one-off**? The decisive test between durable and one-off is **REGULARITY**.

> **Projects layer manifest (DURABLE branch only).** Fractera agents do not run a REPEATABLE
> automation once on request — they build a platform for developing repeatable automations:
> standardized reuse, a visual interface, input and result data in the local DB and vector memory,
> quick switching from the UI. An **"n8n for one single task"**: the owner does not recreate the
> task, they open it in the UI, run it and track the result. This manifest does NOT apply to a
> one-off wish — a one-off is never turned into a built project.

## The three branches

| | **PAGES** (public) | **DURABLE AUTOMATION** (own use, repeats) | **ONE-OFF / DIRECT** (own use, one-time) |
|---|---|---|---|
| Trigger | "a blog", "a landing", "a page about X" | "publish on a schedule", "monitor RSS every hour, ping Telegram", "remind me daily" | "connect a browser, sign into Google, fetch credentials", "search the web for X", "research Y once" |
| Regularity | — | repeats on a schedule (cron) | one-time / rare, never a regular process |
| Who does it | coding agent (content pipeline) | built once (nodes + cron), then runs with **ZERO Hermes runtime load** | Hermes **does it itself**, now, with its own skills; **nothing is built** |
| Where it lives | `[lang]` content routes (multilingual) | `/projects/<category>/<slug>` (one language) | nowhere — no artifact, no repetition nodes |
| Next router | task-scenario-router (FROZEN ↔ REAL-DEV) | survey → declaration/compose → coding agent | perform directly; missing capability → one-time delegation or a numbered blocker step |

Categories of a durable project (exactly these four): `automation` · `fractera-pages` · `personal` · `other`.

## Why the one-off branch exists (do not skip it)

~90% of automation-shaped requests never need the Hermes→steps→coding-agent chain. When the owner
says "connect to my browser and get the Gmail credentials", "look this up on the internet", or "do a
one-off research", that is **one-off** work: you perform it yourself with your own skills and **never
create nodes for repetition** — the owner gets Gmail access once, it is not a scheduled process.
Building a durable project for a one-off wish is a defect. Conversely, a wish that will repeat on a
schedule (parse news → post trends to Telegram every hour) MUST become a durable automation so it
runs with zero load on Hermes and minimal token cost.

## Consult your own skill inventory (one-off candidacy)

Before proposing durable, check whether one of your OWN skills already performs the wish directly
(web search, research, browser automation, and the like). If a skill covers it AND the wish is
one-time → it is a strong **one-off/direct** candidate: just run the skill. A skill you already have
is a signal the work is Hermes-native, not a project to build.

## The protocol (the route is NEVER fixed without an explicit answer)

1. **Read the vector.** Public-audience signals (visitors, clients, blog, landing, SEO) → PAGES.
   Own-use signals (automation, "for myself", internal, monitoring, integrations) → own-use; then
   read the regularity signals: schedule/recurring/"every day"/cron → DURABLE; one-time/"just do it
   now"/connect/authorize/look up/research → ONE-OFF.
2. **If an axis is implicit — ask ONE question, verbatim, and wait.** First the public-vs-own
   question; then, for own use, the decisive regularity question:
   > Axis 1: «Хотите, чтобы этот сервис был публичным для внешних пользователей, или он предназначен
   > для вашего собственного использования (автоматизация / личный сервис)?»
   > Axis 2: «Это действие будет повторяться регулярно (например, по расписанию — каждый день/час),
   > или это разовая задача, которую достаточно выполнить один раз?»
   (Translate only to match the dialogue language, preserving the meaning exactly.)
3. **Even when confident, confirm before fixing** («Правильно ли я вас понимаю…»). The owner's
   explicit answer — not your guess — fixes the route.
4. **Route:**
   - **PAGES** → continue into the task-scenario-router: step 0 (app-making?), then FROZEN-ASSEMBLY
     (`owner_content_orchestrate` :3227 flat plan) vs REAL-DEVELOPMENT (coding agent). Done here.
   - **DURABLE** → run the cron/integrations survey (below), then declare the project (P3 declaration
     carries cron + integrations) or compose it directly via `owner_template_compose_project_page`
     (:3224 — frozen project page: react-flow diagram + cron/results tables); real features →
     REAL-DEV by a coding agent. It runs later with zero Hermes runtime load.
   - **ONE-OFF/DIRECT** → perform it yourself NOW with your own skills (or an already-built
     scenario). Do NOT decompose, do NOT build a project, do NOT create any repetition nodes. If a
     capability is genuinely missing and code is required, either delegate it as a ONE-TIME task to a
     coding agent or record a numbered blocker step — never materialize a repeatable project.

## Via MCP (Hermes / any agent with the bridge)

- `owner_projects_route_request` (:3229, read-only) — pass the wish verbatim; it returns
  `needs_input` + the verbatim question (with an `axis` field: `public-vs-own` or
  `regular-vs-one-off`), or a `proposed_route` + confirm prompt. **Only a re-call with
  `confirmed_choice` (`public-pages` | `private-project` | `one-off-direct`) returns the fixed
  route** and the next pipeline actions. `private-project` = durable automation; `one-off-direct` =
  you do it, nothing built. **When it asked `public-vs-own` and the owner answered OWN USE, re-call
  with `{ request, for_own_use: true }`** (NOT a confirmed_choice yet) so it asks the decisive
  regularity question next — that avoids re-asking axis 1.
- `owner_projects_survey_automation_needs` (:3229, read-only) — DURABLE branch only: two-phase; `{}`
  returns the two questions ("cron processes?", "which external integrations?" — present integrations
  as a todo-list, one entry per service with its API env keys); the re-call with answers returns the
  normalized structure. "I don't know" is valid → `owner_does_not_know:true` → `defer_to_planning`.

## Where the answers go (this skill/bridge writes NOTHING)

- **Declaration (P3)** is the durable store: cron + integrations fields of the declare panel /
  README machine-block.
- **cron.json** of the project folder is the runtime: `fractera-cron` re-reads it every tick (step 179).
- **Env keys** (API keys of integrations) materialize ONLY via the `persist-env-var-with-rebuild`
  channel (step 143: setter → `app/.env.local` → rebuild). Never hardcode.

## Without Hermes / without the bridge (lone CLI)

The fork is cognitive — run steps 1–4 yourself from this skill: classify along both axes, ask the
verbatim question(s) when implicit, wait for the explicit answer, then follow the branch. No tool is
required to decide; the tools only standardize the protocol. For a one-off wish, just do it with your
own skills; never stand up a project for it.

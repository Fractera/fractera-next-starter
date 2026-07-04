---
name: route-project-or-pages-request
description: >
  The TOP-LEVEL fork for any "I want a service / tool / automation / new part of the app" wish:
  decide FIRST whether it is PAGES (public product surface, any role can see it) or a PROJECT
  (a private application level for the architect/manager under /projects/<category>/<slug> —
  automations, page management, personal efficiency, other). Use BEFORE the task-scenario-router
  (FROZEN vs REAL-DEV) — that router handles the pages branch AFTER this fork. If the vector is
  implicit, ask the owner ONE verbatim question and wait; the route is NEVER fixed without an
  explicit confirmed answer. Self-sufficient: the fork is cognitive — a lone CLI agent runs it
  from this skill alone; via MCP call owner_projects_route_request (:3229, read-only).
version: 1.0.0
metadata:
  hermes:
    tags: [route, fork, project, projects, pages, automation, private, public, service, tool, cron, integration, segment, wish, before]
    related_skills: [orchestrate-content-by-steps, compose-frozen-template, declare-architecture-page-or-task, persist-env-var-with-rebuild]
---

# route-project-or-pages-request

The **first fork** any complex "build me something" wish passes through. One level ABOVE the
task-scenario-router (`CRUD-DOCS/workspace-standards/task-scenario-router.md`): before deciding
FROZEN vs REAL-DEV, decide **pages vs project**.

> **Projects layer manifest.** Fractera agents do not run an automation once on request — they
> build a platform for developing **repeatable** automations: standardized reuse, a visual
> interface, input and result data in the local DB and vector memory, quick switching from the UI.
> Hermes plus a coding agent build a finished-cycle tool — an **"n8n for one single task"**: the
> owner does not recreate the task, they open it in the UI, run it and track the result.

## The two branches

| | **PAGES** (public surface) | **PROJECT** (private level) |
|---|---|---|
| Who sees it | any role the owner grants (often everyone) | architect + manager ONLY |
| Where it lives | `[lang]` content routes (multilingual) | `/projects/<category>/<slug>` (one language, named folders only) |
| Typical wish | "a blog", "a landing", "a page about X" | "automate publishing on a schedule", "a tool for managing my pages", "remind me daily" |
| Next router | task-scenario-router (FROZEN ↔ REAL-DEV) | survey → declaration/compose → coding agent |

Categories of a project (always exactly these four): `automation` · `fractera-pages` (private page
management tooling) · `personal` (personal efficiency) · `other`.

## The protocol (the route is NEVER fixed without an explicit answer)

1. **Read the vector.** Clear public-audience signals (visitors, clients, blog, landing, SEO) →
   propose PAGES. Clear private signals (automation, schedule/cron, "for myself", internal,
   monitoring, integrations) → propose a PROJECT.
2. **If the vector is implicit — ask ONE question, verbatim, and wait:**
   > «Хотите, чтобы этот сервис был публичным для внешних пользователей, или он предназначен для
   > вашего собственного использования (автоматизация / личный сервис)?»
   (English: "Do you want this service to be public for external users, or is it intended for your
   own use (an automation / a personal service)?" — translate only to match the dialogue language,
   preserving the meaning exactly.)
3. **Even when confident, confirm before fixing** («Правильно ли я вас понимаю…», §8.2 style). The
   owner's explicit answer — not your guess — fixes the route.
4. **Route:**
   - **PAGES** → continue into the task-scenario-router: step 0 (app-making?), then
     FROZEN-ASSEMBLY (`owner_content_orchestrate` :3227 flat plan) vs REAL-DEVELOPMENT (coding
     agent). This skill's job is done.
   - **PROJECT** → run the cron/integrations survey (below), then: declare the project (the P3
     declaration carries cron + integrations) or compose it directly via
     `owner_template_compose_project_page` (:3224 — frozen project page: react-flow diagram +
     cron/results tables); real features → REAL-DEV by a coding agent.

## Via MCP (Hermes / any agent with the bridge)

- `owner_projects_route_request` (:3229, read-only) — pass the wish verbatim; it returns
  `needs_input` + the verbatim question, or a `proposed_route` + confirm prompt. **Only a re-call
  with `confirmed_choice` (`public-pages` | `private-project`) returns the fixed route** and the
  next pipeline actions.
- `owner_projects_survey_automation_needs` (:3229, read-only) — two-phase: `{}` returns the two
  questions ("will the project run cron processes?", "which external integrations?" — present
  integrations as a todo-list, one entry per service with its API env keys); the re-call with
  answers returns the normalized structure (cron intents for the project's `cron.json`,
  integrations with `UPPER_SNAKE` env keys for the declaration). "I don't know" is valid →
  `owner_does_not_know:true` → `defer_to_planning`: at planning time YOU are authorized to decide
  and create the records.

## Where the answers go (this skill/bridge writes NOTHING)

- **Declaration (P3)** is the durable store: cron + integrations fields of the declare panel /
  README machine-block.
- **cron.json** of the project folder is the runtime: the substrate runner `fractera-cron`
  re-reads it every tick (step 179).
- **Env keys** (API keys of integrations) materialize ONLY via the `persist-env-var-with-rebuild`
  channel (step 143: setter → `app/.env.local` → rebuild). Never hardcode.

## Without Hermes / without the bridge (lone CLI)

The fork is cognitive — run steps 1–4 yourself from this skill: classify, ask the verbatim
question when implicit, wait for the explicit answer, then follow the branch. No tool is required
to decide; the tools only standardize the protocol.

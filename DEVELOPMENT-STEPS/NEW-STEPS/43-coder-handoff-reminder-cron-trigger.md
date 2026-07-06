# 43 — Call a coding agent: Reminder schedule tick (cron)

> Coder handoff · node `reminder-cron-trigger` · kind: trigger · order sheet `os-629d27a2ddcfd5e5` (2/12) · spec step 42

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 42 (`NEW-STEPS/42-reminder-cron-trigger.md`) — the exhaustive spec for node `reminder-cron-trigger` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Reminder schedule tick (cron) — The scheduled tick that delivers due date-reminders. This trigger stays cron-based by design (time-based work belongs to the scheduler); its interval is the Run interval setting.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** trigger
- **Actions served:** remind (the ontology's Action entity — see `CRUD-DOCS/workspace-standards/automation-ontology.md`)
- **Tools / integrations:** fractera-cron (co-located cron.json), run route POST /api/projects/personal/telegram-notes/run — search for a ready skill / MCP connector before building one
- **Environment keys:** none
- **Depends on:** none — this is a root node
- **Inputs → outputs:** "a cron tick on the configured interval" → "a pipeline run whose remind branch checks due reminders"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] cron.json schedule editable from Settings (whitelisted intervals)
- [ ] each tick reaches deliver-due-reminders
_(Full detail, inputs/outputs and to-do live in spec step 42.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 42 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":43,"name":"Call a coding agent: Reminder schedule tick (cron)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node reminder-cron-trigger to a coding agent (read readme + spec step 42).","tasks":[{"body":"cron.json schedule editable from Settings (whitelisted intervals)"},{"body":"each tick reaches deliver-due-reminders"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":2,"total":12,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"reminder-cron-trigger","specStep":42,"specSeq":2,"node":{"id":"reminder-cron-trigger","title":"Reminder schedule tick (cron)","kind":"trigger","actions":["remind"],"condition":null,"errorPolicy":null,"tools":["fractera-cron (co-located cron.json)","run route POST /api/projects/personal/telegram-notes/run"],"envKeys":[],"io":{"in":"a cron tick on the configured interval","out":"a pipeline run whose remind branch checks due reminders"},"dependsOn":[],"todo":["cron.json schedule editable from Settings (whitelisted intervals)","each tick reaches deliver-due-reminders"]}}}
-->

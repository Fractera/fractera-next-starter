# 23 — Call a coding agent: Cron trigger: run the pipeline once a minute

> Coder handoff · node `telegram-cron-trigger` · kind: trigger · order sheet `os-bed7109d7be27ad4` (1/9) · spec step 22

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 22 (`NEW-STEPS/22-telegram-cron-trigger.md`) — the exhaustive spec for node `telegram-cron-trigger` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Cron trigger: run the pipeline once a minute — The entry point. Instead of a Telegram webhook (which needs HTTPS, is unavailable in IP mode, and would tie the project to the native Hermes gateway) it uses polling: a co-located cron.json schedules the run route every minute through fractera-cron (the substrate scheduler from step 179); the same route is available manually from the project page's run panel.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** trigger
- **Tools / integrations:** fractera-cron (co-located cron.json), run route POST /api/projects/personal/telegram-notes/run, Workflow DevKit (world-local) — search for a ready skill / MCP connector before building one
- **Environment keys:** none
- **Depends on:** none — this is a root node
- **Inputs → outputs:** "cron tick once a minute OR a manual run from the run panel (optional simulateMessage)" → "a started durable runProject run (runId)"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] cron.json with the schedule * * * * * next to the project page
- [ ] run route: empty body from cron and {simulateMessage?} from the run panel
- [ ] the route returns runId, all logic lives in the workflow steps
_(Full detail, inputs/outputs and to-do live in spec step 22.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 22 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":23,"name":"Call a coding agent: Cron trigger: run the pipeline once a minute","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node telegram-cron-trigger to a coding agent (read readme + spec step 22).","tasks":[{"body":"cron.json with the schedule * * * * * next to the project page"},{"body":"run route: empty body from cron and {simulateMessage?} from the run panel"},{"body":"the route returns runId, all logic lives in the workflow steps"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":1,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"telegram-cron-trigger","specStep":22,"specSeq":1,"node":{"id":"telegram-cron-trigger","title":"Cron trigger: run the pipeline once a minute","kind":"trigger","tools":["fractera-cron (co-located cron.json)","run route POST /api/projects/personal/telegram-notes/run","Workflow DevKit (world-local)"],"envKeys":[],"io":{"in":"cron tick once a minute OR a manual run from the run panel (optional simulateMessage)","out":"a started durable runProject run (runId)"},"dependsOn":[],"todo":["cron.json with the schedule * * * * * next to the project page","run route: empty body from cron and {simulateMessage?} from the run panel","the route returns runId, all logic lives in the workflow steps"]}}}
-->

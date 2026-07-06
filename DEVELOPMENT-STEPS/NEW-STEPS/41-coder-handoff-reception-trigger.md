# 41 — Call a coding agent: Reception trigger: new-message wake-up

> Coder handoff · node `reception-trigger` · kind: trigger · order sheet `os-629d27a2ddcfd5e5` (1/12) · spec step 40

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 40 (`NEW-STEPS/40-reception-trigger.md`) — the exhaustive spec for node `reception-trigger` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Reception trigger: new-message wake-up — Entry point of reception. Target architecture (Phase 6): an always-on long-poll listener (a substrate service holding getUpdates with a long timeout) handles a message the second it arrives — no webhook/HTTPS needed, works in IP mode, no Hermes dependency. Interim: the minute cron tick fires the same run route; the run panel fires it manually.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** trigger
- **Actions served:** all (the ontology's Action entity — see `CRUD-DOCS/workspace-standards/automation-ontology.md`)
- **Tools / integrations:** fractera-cron (co-located cron.json), run route POST /api/projects/personal/telegram-notes/run, Workflow DevKit (world-local) — search for a ready skill / MCP connector before building one
- **Environment keys:** none
- **Depends on:** none — this is a root node
- **Inputs → outputs:** "an incoming Telegram update (target: pushed by the always-on listener; interim: the minute cron tick) OR a manual run from the run panel" → "a started durable runProject run (runId)"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] co-located cron.json fires the run route (interim reception + schedule source)
- [ ] run route accepts empty body from cron and { simulateMessage? } from the run panel
- [ ] route returns runId; all logic lives in workflow steps
- [ ] Phase 6: the always-on listener invokes the same route per update (instant replies)
_(Full detail, inputs/outputs and to-do live in spec step 40.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 40 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":41,"name":"Call a coding agent: Reception trigger: new-message wake-up","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node reception-trigger to a coding agent (read readme + spec step 40).","tasks":[{"body":"co-located cron.json fires the run route (interim reception + schedule source)"},{"body":"run route accepts empty body from cron and { simulateMessage? } from the run panel"},{"body":"route returns runId; all logic lives in workflow steps"},{"body":"Phase 6: the always-on listener invokes the same route per update (instant replies)"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":1,"total":12,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"reception-trigger","specStep":40,"specSeq":1,"node":{"id":"reception-trigger","title":"Reception trigger: new-message wake-up","kind":"trigger","actions":"all","condition":null,"errorPolicy":null,"tools":["fractera-cron (co-located cron.json)","run route POST /api/projects/personal/telegram-notes/run","Workflow DevKit (world-local)"],"envKeys":[],"io":{"in":"an incoming Telegram update (target: pushed by the always-on listener; interim: the minute cron tick) OR a manual run from the run panel","out":"a started durable runProject run (runId)"},"dependsOn":[],"todo":["co-located cron.json fires the run route (interim reception + schedule source)","run route accepts empty body from cron and { simulateMessage? } from the run panel","route returns runId; all logic lives in workflow steps","Phase 6: the always-on listener invokes the same route per update (instant replies)"]}}}
-->

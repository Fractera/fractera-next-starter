# 40 — Reception trigger: new-message wake-up

> Project sub-step · node `reception-trigger` · kind: trigger · actions: all · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (1/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
_Trunk node — every action of the automation flows through it._

## Task
Own the reception wake-up. (1) Interim: the co-located cron.json schedules POST /api/projects/personal/telegram-notes/run (empty body); the run panel posts { simulateMessage } for tests. (2) Target (Phase 6): the always-on listener service invokes the SAME run route on every incoming update, making replies instant; cron then stops polling messages (the reminder trigger keeps its own schedule). (3) The route starts the durable runProject (WDK, world-local) and returns runId; no business logic in the route.

## Tools
- fractera-cron (co-located cron.json)
- run route POST /api/projects/personal/telegram-notes/run
- Workflow DevKit (world-local)

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "an incoming Telegram update (target: pushed by the always-on listener; interim: the minute cron tick) OR a manual run from the run panel"
- **Out:** "a started durable runProject run (runId)"

## Depends on
_No dependencies (root node)._

## To-do / acceptance criteria
- [ ] co-located cron.json fires the run route (interim reception + schedule source)
- [ ] run route accepts empty body from cron and { simulateMessage? } from the run panel
- [ ] route returns runId; all logic lives in workflow steps
- [ ] Phase 6: the always-on listener invokes the same route per update (instant replies)

<!-- fractera:step
{"number":40,"name":"Reception trigger: new-message wake-up","importance":"mandatory","status":"new","completedAt":null,"description":"Entry point of reception. Target architecture (Phase 6): an always-on long-poll listener (a substrate service holding getUpdates with a long timeout) handles a message the second it arrives — no webhook/HTTPS needed, works in IP mode, no Hermes dependency. Interim: the minute cron tick fires the same run route; the run panel fires it manually.","tasks":[{"body":"co-located cron.json fires the run route (interim reception + schedule source)"},{"body":"run route accepts empty body from cron and { simulateMessage? } from the run panel"},{"body":"route returns runId; all logic lives in workflow steps"},{"body":"Phase 6: the always-on listener invokes the same route per update (instant replies)"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":1,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"reception-trigger","title":"Reception trigger: new-message wake-up","kind":"trigger","actions":"all","condition":null,"errorPolicy":null,"state":[],"task":"Own the reception wake-up. (1) Interim: the co-located cron.json schedules POST /api/projects/personal/telegram-notes/run (empty body); the run panel posts { simulateMessage } for tests. (2) Target (Phase 6): the always-on listener service invokes the SAME run route on every incoming update, making replies instant; cron then stops polling messages (the reminder trigger keeps its own schedule). (3) The route starts the durable runProject (WDK, world-local) and returns runId; no business logic in the route.","description":"Entry point of reception. Target architecture (Phase 6): an always-on long-poll listener (a substrate service holding getUpdates with a long timeout) handles a message the second it arrives — no webhook/HTTPS needed, works in IP mode, no Hermes dependency. Interim: the minute cron tick fires the same run route; the run panel fires it manually.","tools":["fractera-cron (co-located cron.json)","run route POST /api/projects/personal/telegram-notes/run","Workflow DevKit (world-local)"],"envKeys":[],"io":{"in":"an incoming Telegram update (target: pushed by the always-on listener; interim: the minute cron tick) OR a manual run from the run panel","out":"a started durable runProject run (runId)"},"dependsOn":[],"todo":["co-located cron.json fires the run route (interim reception + schedule source)","run route accepts empty body from cron and { simulateMessage? } from the run panel","route returns runId; all logic lives in workflow steps","Phase 6: the always-on listener invokes the same route per update (instant replies)"]}}}
-->

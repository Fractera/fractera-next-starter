# 22 — Cron trigger: run the pipeline once a minute

> Project sub-step · node `telegram-cron-trigger` · kind: trigger · importance: mandatory · order sheet `os-bed7109d7be27ad4` (1/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Set up the pipeline trigger. (1) Create a co-located cron.json in app/(projects)/projects/personal/telegram-notes/ with the schedule "* * * * *" (every minute), targeting POST /api/projects/personal/telegram-notes/run with an empty body — fractera-cron picks up a co-located cron.json automatically. (2) The run route (route.ts next to _workflow/definition.ts) accepts an empty body from cron and an optional manual input from the run panel ({ simulateMessage?: string } — for testing without Telegram: the string is processed as if it arrived from a chat). (3) The route starts a durable runProject run (WDK, world-local, step 183) and returns runId; no business logic in the route.

## Tools
- fractera-cron (co-located cron.json)
- run route POST /api/projects/personal/telegram-notes/run
- Workflow DevKit (world-local)

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "cron tick once a minute OR a manual run from the run panel (optional simulateMessage)"
- **Out:** "a started durable runProject run (runId)"

## Depends on
_No dependencies (root node)._

## To-do / acceptance criteria
- [ ] cron.json with the schedule * * * * * next to the project page
- [ ] run route: empty body from cron and {simulateMessage?} from the run panel
- [ ] the route returns runId, all logic lives in the workflow steps

<!-- fractera:step
{"number":22,"name":"Cron trigger: run the pipeline once a minute","importance":"mandatory","status":"new","completedAt":null,"description":"The entry point. Instead of a Telegram webhook (which needs HTTPS, is unavailable in IP mode, and would tie the project to the native Hermes gateway) it uses polling: a co-located cron.json schedules the run route every minute through fractera-cron (the substrate scheduler from step 179); the same route is available manually from the project page's run panel.","tasks":[{"body":"cron.json with the schedule * * * * * next to the project page"},{"body":"run route: empty body from cron and {simulateMessage?} from the run panel"},{"body":"the route returns runId, all logic lives in the workflow steps"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":1,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"telegram-cron-trigger","title":"Cron trigger: run the pipeline once a minute","kind":"trigger","task":"Set up the pipeline trigger. (1) Create a co-located cron.json in app/(projects)/projects/personal/telegram-notes/ with the schedule \"* * * * *\" (every minute), targeting POST /api/projects/personal/telegram-notes/run with an empty body — fractera-cron picks up a co-located cron.json automatically. (2) The run route (route.ts next to _workflow/definition.ts) accepts an empty body from cron and an optional manual input from the run panel ({ simulateMessage?: string } — for testing without Telegram: the string is processed as if it arrived from a chat). (3) The route starts a durable runProject run (WDK, world-local, step 183) and returns runId; no business logic in the route.","description":"The entry point. Instead of a Telegram webhook (which needs HTTPS, is unavailable in IP mode, and would tie the project to the native Hermes gateway) it uses polling: a co-located cron.json schedules the run route every minute through fractera-cron (the substrate scheduler from step 179); the same route is available manually from the project page's run panel.","tools":["fractera-cron (co-located cron.json)","run route POST /api/projects/personal/telegram-notes/run","Workflow DevKit (world-local)"],"envKeys":[],"io":{"in":"cron tick once a minute OR a manual run from the run panel (optional simulateMessage)","out":"a started durable runProject run (runId)"},"dependsOn":[],"todo":["cron.json with the schedule * * * * * next to the project page","run route: empty body from cron and {simulateMessage?} from the run panel","the route returns runId, all logic lives in the workflow steps"]}}}
-->

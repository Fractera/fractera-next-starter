# 42 — Reminder schedule tick (cron)

> Project sub-step · node `reminder-cron-trigger` · kind: trigger · actions: remind · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (2/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
- `remind`

## Task
Own the reminder schedule. The co-located cron.json job fires the run route on the configured interval (Settings > Run interval; fractera-cron re-reads cron.json live). Each tick lets deliver-due-reminders check for due rows and push them. No sub-minute intervals (5-field cron granularity).

## Tools
- fractera-cron (co-located cron.json)
- run route POST /api/projects/personal/telegram-notes/run

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "a cron tick on the configured interval"
- **Out:** "a pipeline run whose remind branch checks due reminders"

## Depends on
_No dependencies (root node)._

## To-do / acceptance criteria
- [ ] cron.json schedule editable from Settings (whitelisted intervals)
- [ ] each tick reaches deliver-due-reminders

<!-- fractera:step
{"number":42,"name":"Reminder schedule tick (cron)","importance":"mandatory","status":"new","completedAt":null,"description":"The scheduled tick that delivers due date-reminders. This trigger stays cron-based by design (time-based work belongs to the scheduler); its interval is the Run interval setting.","tasks":[{"body":"cron.json schedule editable from Settings (whitelisted intervals)"},{"body":"each tick reaches deliver-due-reminders"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":2,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"reminder-cron-trigger","title":"Reminder schedule tick (cron)","kind":"trigger","actions":["remind"],"condition":null,"errorPolicy":null,"state":[],"task":"Own the reminder schedule. The co-located cron.json job fires the run route on the configured interval (Settings > Run interval; fractera-cron re-reads cron.json live). Each tick lets deliver-due-reminders check for due rows and push them. No sub-minute intervals (5-field cron granularity).","description":"The scheduled tick that delivers due date-reminders. This trigger stays cron-based by design (time-based work belongs to the scheduler); its interval is the Run interval setting.","tools":["fractera-cron (co-located cron.json)","run route POST /api/projects/personal/telegram-notes/run"],"envKeys":[],"io":{"in":"a cron tick on the configured interval","out":"a pipeline run whose remind branch checks due reminders"},"dependsOn":[],"todo":["cron.json schedule editable from Settings (whitelisted intervals)","each tick reaches deliver-due-reminders"]}}}
-->

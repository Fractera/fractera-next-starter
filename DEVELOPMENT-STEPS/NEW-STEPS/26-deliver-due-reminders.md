# 26 — Deliver due reminders (date push)

> Project sub-step · node `deliver-due-reminders` · kind: action · importance: mandatory · order sheet `os-bed7109d7be27ad4` (3/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:deliver-due-reminders` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Implement reminder delivery. (1) SELECT from telegram_notes where reminder_due <= now AND not marked delivered. (2) For each: POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage to chat_id with the text "Reminder: you asked to be reminded that at <HH:mm> you need to <payload/summary>" (verbatim what the user set — the correct behavior from the owner's vision). (3) Mark the row delivered=1 (add the column to the SCHEMA table). (4) Runs as a parallel branch from the trigger — independent of new messages arriving. Log send failures, do not retry within the tick (the next tick will retry).

## Tools
- Telegram Bot API sendMessage
- SQLite via @/lib/db
- fetch

## Environment keys
- `TELEGRAM_BOT_TOKEN`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "cron tick (checks due on every run)"
- **Out:** "{delivered: n, errors[]} — the reminders sent"

## Depends on
- `telegram-cron-trigger` (must be completed first)

## To-do / acceptance criteria
- [ ] SELECT due reminder_due rows (not delivered)
- [ ] sendMessage with the verbatim reminder text
- [ ] mark delivered; delivered column in SCHEMA

<!-- fractera:step
{"number":26,"name":"Deliver due reminders (date push)","importance":"mandatory","status":"new","completedAt":null,"description":"The only active reminder action (type 1): on every cron tick it checks the DB for due reminder_due rows and sends the reminder text to the user in Telegram.","tasks":[{"body":"SELECT due reminder_due rows (not delivered)"},{"body":"sendMessage with the verbatim reminder text"},{"body":"mark delivered; delivered column in SCHEMA"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":3,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"deliver-due-reminders","title":"Deliver due reminders (date push)","kind":"action","task":"Implement reminder delivery. (1) SELECT from telegram_notes where reminder_due <= now AND not marked delivered. (2) For each: POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage to chat_id with the text \"Reminder: you asked to be reminded that at <HH:mm> you need to <payload/summary>\" (verbatim what the user set — the correct behavior from the owner's vision). (3) Mark the row delivered=1 (add the column to the SCHEMA table). (4) Runs as a parallel branch from the trigger — independent of new messages arriving. Log send failures, do not retry within the tick (the next tick will retry).","description":"The only active reminder action (type 1): on every cron tick it checks the DB for due reminder_due rows and sends the reminder text to the user in Telegram.","tools":["Telegram Bot API sendMessage","SQLite via @/lib/db","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN"],"io":{"in":"cron tick (checks due on every run)","out":"{delivered: n, errors[]} — the reminders sent"},"dependsOn":["telegram-cron-trigger"],"todo":["SELECT due reminder_due rows (not delivered)","sendMessage with the verbatim reminder text","mark delivered; delivered column in SCHEMA"]}}}
-->

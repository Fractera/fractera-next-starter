# 34 — Write the note/reminder to the project DB

> Project sub-step · node `persist-note-to-db` · kind: action · importance: mandatory · order sheet `os-bed7109d7be27ad4` (7/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:persist-note-to-db` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Implement the DB write. (1) Declare in SCHEMA the table telegram_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, project_slug TEXT, hook_action TEXT, chat_id TEXT, msg_date INTEGER, reminder_due INTEGER NULL, full_text TEXT, summary TEXT, created_at INTEGER). (2) For intent=save: reminder_due=NULL (a note, type 2). (3) For intent=remind: extract the date/time from payload with the cheap model (or from detect-hook); if there is no date, mark needs_when=true (the reply node will ask "when?") and do not create a row with reminder_due yet; if there is a date, reminder_due = unix time (type 1, date push). (4) Return {dbId, intent, reminder_due, needs_when, chatId, summary} — dbId is needed for memory and the reply. New tables ONLY in SCHEMA (they appear in both environments).

## Tools
- SQLite via @/lib/db (SCHEMA)
- cheap model via OPENAI_API_KEY (date parsing)

## Environment keys
- `OPENAI_API_KEY`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "messages intent in {save, remind} with {summary, payload, chatId, date}"
- **Out:** "{dbId, intent, reminder_due, needs_when, chatId, summary} for each record"

## Depends on
- `summarize-message` (must be completed first)

## To-do / acceptance criteria
- [ ] telegram_notes table in SCHEMA (all columns from the owner's vision)
- [ ] save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when
- [ ] return dbId (for memory and the reply)

<!-- fractera:step
{"number":34,"name":"Write the note/reminder to the project DB","importance":"mandatory","status":"new","completedAt":null,"description":"Writes a row to the project's own table: project name, hook, chat, date, date-reminder data (only for remind — type 1), full original text, summary, and an auto id.","tasks":[{"body":"telegram_notes table in SCHEMA (all columns from the owner's vision)"},{"body":"save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when"},{"body":"return dbId (for memory and the reply)"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":7,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"persist-note-to-db","title":"Write the note/reminder to the project DB","kind":"action","task":"Implement the DB write. (1) Declare in SCHEMA the table telegram_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, project_slug TEXT, hook_action TEXT, chat_id TEXT, msg_date INTEGER, reminder_due INTEGER NULL, full_text TEXT, summary TEXT, created_at INTEGER). (2) For intent=save: reminder_due=NULL (a note, type 2). (3) For intent=remind: extract the date/time from payload with the cheap model (or from detect-hook); if there is no date, mark needs_when=true (the reply node will ask \"when?\") and do not create a row with reminder_due yet; if there is a date, reminder_due = unix time (type 1, date push). (4) Return {dbId, intent, reminder_due, needs_when, chatId, summary} — dbId is needed for memory and the reply. New tables ONLY in SCHEMA (they appear in both environments).","description":"Writes a row to the project's own table: project name, hook, chat, date, date-reminder data (only for remind — type 1), full original text, summary, and an auto id.","tools":["SQLite via @/lib/db (SCHEMA)","cheap model via OPENAI_API_KEY (date parsing)"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"messages intent in {save, remind} with {summary, payload, chatId, date}","out":"{dbId, intent, reminder_due, needs_when, chatId, summary} for each record"},"dependsOn":["summarize-message"],"todo":["telegram_notes table in SCHEMA (all columns from the owner's vision)","save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when","return dbId (for memory and the reply)"]}}}
-->

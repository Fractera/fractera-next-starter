# 58 — Write the note/reminder to the project DB

> Project sub-step · node `persist-note-to-db` · kind: step · actions: save, remind, recall · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (10/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:persist-note-to-db` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
- `save`
- `remind`
- `recall`

## Condition (declared guard)
> for remind: a date/time is parsed from the payload, then reminder_due is set; otherwise the row is marked needs_when and the reply asks when

_Implement this guard in the step body — the schema declares it, the code enforces it (R6)._

## Task
Implement the DB write. (1) Declare in SCHEMA the table telegram_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, project_slug TEXT, hook_action TEXT, chat_id TEXT, msg_date INTEGER, reminder_due INTEGER NULL, full_text TEXT, summary TEXT, created_at INTEGER). (2) For intent=save: reminder_due=NULL (a note, type 2). (3) For intent=remind: extract the date/time from payload with the cheap model (or from detect-hook); if there is no date, mark needs_when=true (the reply node will ask "when?") and do not create a row with reminder_due yet; if there is a date, reminder_due = unix time (type 1, date push). (4) Return {dbId, intent, reminder_due, needs_when, chatId, summary} — dbId is needed for memory and the reply. New tables ONLY in SCHEMA (they appear in both environments). ONTOLOGY EXTENSIONS (188-R): (5) also write hook_phrase (the matched phrase from detect-hook) and condition (the guard outcome, e.g. date-parsed / needs-date, NULL for save) into each row — SCHEMA gains both columns. (6) RECALL IS ALSO A RECORD: for every intent=recall write a row (hook_action=recall, full_text=the question, summary=the question plus a short digest of the answer, hook_phrase) so requests appear in the universal records table.

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
- `search-memory-recall` (must be completed first)

## To-do / acceptance criteria
- [ ] telegram_notes table in SCHEMA (all columns from the owner's vision)
- [ ] save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when
- [ ] return dbId (for memory and the reply)
- [ ] hook_phrase + condition columns written on every row
- [ ] recall queries persisted as records (action=recall)

<!-- fractera:step
{"number":58,"name":"Write the note/reminder to the project DB","importance":"mandatory","status":"new","completedAt":null,"description":"Writes a row to the project's own table: project name, hook, chat, date, date-reminder data (only for remind — type 1), full original text, summary, and an auto id.","tasks":[{"body":"telegram_notes table in SCHEMA (all columns from the owner's vision)"},{"body":"save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when"},{"body":"return dbId (for memory and the reply)"},{"body":"hook_phrase + condition columns written on every row"},{"body":"recall queries persisted as records (action=recall)"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":10,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"persist-note-to-db","title":"Write the note/reminder to the project DB","kind":"step","actions":["save","remind","recall"],"condition":"for remind: a date/time is parsed from the payload, then reminder_due is set; otherwise the row is marked needs_when and the reply asks when","errorPolicy":null,"state":[],"task":"Implement the DB write. (1) Declare in SCHEMA the table telegram_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, project_slug TEXT, hook_action TEXT, chat_id TEXT, msg_date INTEGER, reminder_due INTEGER NULL, full_text TEXT, summary TEXT, created_at INTEGER). (2) For intent=save: reminder_due=NULL (a note, type 2). (3) For intent=remind: extract the date/time from payload with the cheap model (or from detect-hook); if there is no date, mark needs_when=true (the reply node will ask \"when?\") and do not create a row with reminder_due yet; if there is a date, reminder_due = unix time (type 1, date push). (4) Return {dbId, intent, reminder_due, needs_when, chatId, summary} — dbId is needed for memory and the reply. New tables ONLY in SCHEMA (they appear in both environments). ONTOLOGY EXTENSIONS (188-R): (5) also write hook_phrase (the matched phrase from detect-hook) and condition (the guard outcome, e.g. date-parsed / needs-date, NULL for save) into each row — SCHEMA gains both columns. (6) RECALL IS ALSO A RECORD: for every intent=recall write a row (hook_action=recall, full_text=the question, summary=the question plus a short digest of the answer, hook_phrase) so requests appear in the universal records table.","description":"Writes a row to the project's own table: project name, hook, chat, date, date-reminder data (only for remind — type 1), full original text, summary, and an auto id.","tools":["SQLite via @/lib/db (SCHEMA)","cheap model via OPENAI_API_KEY (date parsing)"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"messages intent in {save, remind} with {summary, payload, chatId, date}","out":"{dbId, intent, reminder_due, needs_when, chatId, summary} for each record"},"dependsOn":["summarize-message","search-memory-recall"],"todo":["telegram_notes table in SCHEMA (all columns from the owner's vision)","save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when","return dbId (for memory and the reply)","hook_phrase + condition columns written on every row","recall queries persisted as records (action=recall)"]}}}
-->

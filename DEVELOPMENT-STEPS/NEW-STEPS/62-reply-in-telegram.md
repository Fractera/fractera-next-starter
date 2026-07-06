# 62 — Reply to the user in Telegram

> Project sub-step · node `reply-in-telegram` · kind: step · actions: all · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (12/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:reply-in-telegram` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
_Trunk node — every action of the automation flows through it._

## Task
Implement the reply. Assemble the outcomes: (1) save → "Saved: <summary>" when ingestOk, "Couldn't save: <error>" on failure. (2) remind with a date → "I'll remind you <date>: <summary>". (3) remind needs_when=true → "When should I remind you? Reply with a date/time" (the user's next message is processed as the date — simplified in the MVP: the user resends with a date). (4) recall → the answer from search-memory-recall. (5) POST sendMessage, do not set parse_mode (plain text — free-form input must not break on Markdown special characters); text > 4096 is cut on a paragraph boundary. (6) Run summary {processed, saved, reminded, answered, errors[]} — this is the result for the dashboard and the results table (Layer C).

## Tools
- Telegram Bot API sendMessage
- fetch

## Environment keys
- `TELEGRAM_BOT_TOKEN`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "ingest results {dbId,chatId,ingestOk,summary}, needs_when, recall {chatId,answer}"
- **Out:** "run summary {processed, saved, reminded, answered, errors[]} for the dashboard/table"

## Depends on
- `ingest-note-to-memory` (must be completed first)
- `search-memory-recall` (must be completed first)

## To-do / acceptance criteria
- [ ] save→confirmation, remind→"I'll remind you"/"when?", recall→answer
- [ ] plain text without parse_mode, cut at >4096
- [ ] run summary {processed,saved,reminded,answered,errors[]}

<!-- fractera:step
{"number":62,"name":"Reply to the user in Telegram","importance":"mandatory","status":"new","completedAt":null,"description":"The final node: a save confirmation (\"Saved\"), a \"when?\" question for a remind without a date, or the found recall answer — back to the same chat via sendMessage.","tasks":[{"body":"save→confirmation, remind→\"I'll remind you\"/\"when?\", recall→answer"},{"body":"plain text without parse_mode, cut at >4096"},{"body":"run summary {processed,saved,reminded,answered,errors[]}"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":12,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"reply-in-telegram","title":"Reply to the user in Telegram","kind":"step","actions":"all","condition":null,"errorPolicy":null,"state":[],"task":"Implement the reply. Assemble the outcomes: (1) save → \"Saved: <summary>\" when ingestOk, \"Couldn't save: <error>\" on failure. (2) remind with a date → \"I'll remind you <date>: <summary>\". (3) remind needs_when=true → \"When should I remind you? Reply with a date/time\" (the user's next message is processed as the date — simplified in the MVP: the user resends with a date). (4) recall → the answer from search-memory-recall. (5) POST sendMessage, do not set parse_mode (plain text — free-form input must not break on Markdown special characters); text > 4096 is cut on a paragraph boundary. (6) Run summary {processed, saved, reminded, answered, errors[]} — this is the result for the dashboard and the results table (Layer C).","description":"The final node: a save confirmation (\"Saved\"), a \"when?\" question for a remind without a date, or the found recall answer — back to the same chat via sendMessage.","tools":["Telegram Bot API sendMessage","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN"],"io":{"in":"ingest results {dbId,chatId,ingestOk,summary}, needs_when, recall {chatId,answer}","out":"run summary {processed, saved, reminded, answered, errors[]} for the dashboard/table"},"dependsOn":["ingest-note-to-memory","search-memory-recall"],"todo":["save→confirmation, remind→\"I'll remind you\"/\"when?\", recall→answer","plain text without parse_mode, cut at >4096","run summary {processed,saved,reminded,answered,errors[]}"]}}}
-->

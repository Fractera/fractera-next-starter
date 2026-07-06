# 46 — Fetch new messages from Telegram (getUpdates)

> Project sub-step · node `fetch-telegram-updates` · kind: step · actions: all · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (4/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:fetch-telegram-updates` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
_Trunk node — every action of the automation flows through it._

## Task
Implement the update-fetching step body. (1) Declare in SCHEMA (app/lib/db/index.ts — new tables ONLY in SCHEMA) the table telegram_notes_state (key TEXT PRIMARY KEY, value TEXT) for the last_update_id cursor. (2) GET https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=<last_update_id+1>&timeout=0 — a short request without long-poll (the step lives inside the one-minute tick). (3) Filter: only messages with text; if TELEGRAM_ALLOWED_CHAT_ID is set, drop other chats. (4) Advance the cursor to the maximum update_id IMMEDIATELY after reading (protects against reprocessing if a later step fails). (5) Return an array of {chatId, messageId, text, date}. (6) If a simulateMessage arrived from the run panel, return it as the single message with chatId = TELEGRAM_ALLOWED_CHAT_ID and do not poll Telegram. NEVER hardcode the token — env only (already in the slot .env.local, rule 143).

## Tools
- Telegram Bot API getUpdates
- SQLite via @/lib/db (SCHEMA)
- fetch

## Environment keys
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_CHAT_ID`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "cron tick (empty) or simulateMessage from the run panel"
- **Out:** "array of new messages {chatId, messageId, text, date}; last_update_id cursor advanced"

## Depends on
- `reception-trigger` (must be completed first)

## To-do / acceptance criteria
- [ ] telegram_notes_state table in SCHEMA (key/value, last_update_id cursor)
- [ ] getUpdates with offset and a TELEGRAM_ALLOWED_CHAT_ID filter
- [ ] cursor advances before processing (no repeats on failure)
- [ ] simulateMessage branch for testing without Telegram

<!-- fractera:step
{"number":46,"name":"Fetch new messages from Telegram (getUpdates)","importance":"mandatory","status":"new","completedAt":null,"description":"Polls the Telegram Bot API with getUpdates using a persistent last_update_id cursor, returning only the owner's new messages (the private chat with @fractera_bot).","tasks":[{"body":"telegram_notes_state table in SCHEMA (key/value, last_update_id cursor)"},{"body":"getUpdates with offset and a TELEGRAM_ALLOWED_CHAT_ID filter"},{"body":"cursor advances before processing (no repeats on failure)"},{"body":"simulateMessage branch for testing without Telegram"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":4,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"fetch-telegram-updates","title":"Fetch new messages from Telegram (getUpdates)","kind":"step","actions":"all","condition":null,"errorPolicy":null,"state":["telegram-cursor"],"task":"Implement the update-fetching step body. (1) Declare in SCHEMA (app/lib/db/index.ts — new tables ONLY in SCHEMA) the table telegram_notes_state (key TEXT PRIMARY KEY, value TEXT) for the last_update_id cursor. (2) GET https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=<last_update_id+1>&timeout=0 — a short request without long-poll (the step lives inside the one-minute tick). (3) Filter: only messages with text; if TELEGRAM_ALLOWED_CHAT_ID is set, drop other chats. (4) Advance the cursor to the maximum update_id IMMEDIATELY after reading (protects against reprocessing if a later step fails). (5) Return an array of {chatId, messageId, text, date}. (6) If a simulateMessage arrived from the run panel, return it as the single message with chatId = TELEGRAM_ALLOWED_CHAT_ID and do not poll Telegram. NEVER hardcode the token — env only (already in the slot .env.local, rule 143).","description":"Polls the Telegram Bot API with getUpdates using a persistent last_update_id cursor, returning only the owner's new messages (the private chat with @fractera_bot).","tools":["Telegram Bot API getUpdates","SQLite via @/lib/db (SCHEMA)","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN","TELEGRAM_ALLOWED_CHAT_ID"],"io":{"in":"cron tick (empty) or simulateMessage from the run panel","out":"array of new messages {chatId, messageId, text, date}; last_update_id cursor advanced"},"dependsOn":["reception-trigger"],"todo":["telegram_notes_state table in SCHEMA (key/value, last_update_id cursor)","getUpdates with offset and a TELEGRAM_ALLOWED_CHAT_ID filter","cursor advances before processing (no repeats on failure)","simulateMessage branch for testing without Telegram"]}}}
-->

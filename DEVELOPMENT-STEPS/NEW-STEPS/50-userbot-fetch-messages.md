# 50 — Receive any-chat messages (userbot)

> Project sub-step · node `userbot-fetch-messages` · kind: step · actions: all · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (6/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:userbot-fetch-messages` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
_Trunk node — every action of the automation flows through it._

## Task
Implement the userbot reception step body. (1) If TELEGRAM_API_ID/TELEGRAM_API_HASH/TELEGRAM_SESSION are absent, return [] (the track is off; never error). (2) When the Phase-6 listener passes a userbot-sourced message in the run input, normalize it to {chatId, messageId, text, date, source: userbot}. (3) Replies always go through the BOT (sendMessage) — the userbot only reads. Keep this step a thin normalizer; the always-on listening itself lives in the substrate service (its trigger node).

## Tools
- substrate listener service (Phase 6)
- @/lib/db (shared shapes)

## Environment keys
- `TELEGRAM_API_ID`
- `TELEGRAM_API_HASH`
- `TELEGRAM_SESSION`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "a userbot-sourced message from the listener (or nothing while unconfigured)"
- **Out:** "array of normalized messages {chatId, messageId, text, date, source}"

## Depends on
- `userbot-reception-trigger` (must be completed first)

## To-do / acceptance criteria
- [ ] absent keys mean [] (inert, no errors)
- [ ] normalize to the shared message shape
- [ ] replies stay on the bot track

<!-- fractera:step
{"number":50,"name":"Receive any-chat messages (userbot)","importance":"mandatory","status":"new","completedAt":null,"description":"The reception step of the advanced track: normalizes messages arriving from the userbot listener into the same {chatId, messageId, text, date} shape the bot-chat fetch produces. Graceful no-op while the track is not configured.","tasks":[{"body":"absent keys mean [] (inert, no errors)"},{"body":"normalize to the shared message shape"},{"body":"replies stay on the bot track"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":6,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"userbot-fetch-messages","title":"Receive any-chat messages (userbot)","kind":"step","actions":"all","condition":null,"errorPolicy":"soft-degrade","state":["userbot-session"],"task":"Implement the userbot reception step body. (1) If TELEGRAM_API_ID/TELEGRAM_API_HASH/TELEGRAM_SESSION are absent, return [] (the track is off; never error). (2) When the Phase-6 listener passes a userbot-sourced message in the run input, normalize it to {chatId, messageId, text, date, source: userbot}. (3) Replies always go through the BOT (sendMessage) — the userbot only reads. Keep this step a thin normalizer; the always-on listening itself lives in the substrate service (its trigger node).","description":"The reception step of the advanced track: normalizes messages arriving from the userbot listener into the same {chatId, messageId, text, date} shape the bot-chat fetch produces. Graceful no-op while the track is not configured.","tools":["substrate listener service (Phase 6)","@/lib/db (shared shapes)"],"envKeys":["TELEGRAM_API_ID","TELEGRAM_API_HASH","TELEGRAM_SESSION"],"io":{"in":"a userbot-sourced message from the listener (or nothing while unconfigured)","out":"array of normalized messages {chatId, messageId, text, date, source}"},"dependsOn":["userbot-reception-trigger"],"todo":["absent keys mean [] (inert, no errors)","normalize to the shared message shape","replies stay on the bot track"]}}}
-->

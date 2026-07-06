# 06 — Получить новые сообщения из Telegram (getUpdates)

> Project sub-step · node `fetch-telegram-updates` · kind: action · importance: mandatory · order sheet `os-244071e59531649b` (2/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:fetch-telegram-updates` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать тело шага получения обновлений. (1) Объявить в SCHEMA (app/lib/db/index.ts — новые таблицы ТОЛЬКО в SCHEMA) таблицу telegram_notes_state (key TEXT PRIMARY KEY, value TEXT) для курсора last_update_id. (2) GET https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=<last_update_id+1>&timeout=0 — короткий запрос без long-poll (шаг живёт внутри минутного тика). (3) Отфильтровать: только message с текстом; если задан TELEGRAM_ALLOWED_CHAT_ID — отбросить чужие чаты. (4) Продвинуть курсор на максимальный update_id СРАЗУ после чтения (защита от повторной обработки при падении дальше). (5) Вернуть массив {chatId, messageId, text, date}. (6) Если пришёл simulateMessage из run-панели — вернуть его как единственное сообщение с chatId = TELEGRAM_ALLOWED_CHAT_ID, Telegram не опрашивать. Токен НИКОГДА не хардкодить — только env (уже в слот-.env.local, правило 143).

## Tools
- Telegram Bot API getUpdates
- SQLite через @/lib/db (SCHEMA)
- fetch

## Environment keys
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_CHAT_ID`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "cron-тик (пусто) или simulateMessage из run-панели"
- **Out:** "массив новых сообщений {chatId, messageId, text, date}; курсор last_update_id продвинут"

## Depends on
- `telegram-cron-trigger` (must be completed first)

## To-do / acceptance criteria
- [ ] таблица telegram_notes_state в SCHEMA (key/value, курсор last_update_id)
- [ ] getUpdates с offset и фильтром по TELEGRAM_ALLOWED_CHAT_ID
- [ ] курсор продвигается до обработки (нет повторов при сбое)
- [ ] ветка simulateMessage для теста без Telegram

<!-- fractera:step
{"number":6,"name":"Получить новые сообщения из Telegram (getUpdates)","importance":"mandatory","status":"new","completedAt":null,"description":"Опрашивает Telegram Bot API методом getUpdates с персистентным курсором last_update_id, отдаёт только новые сообщения владельца (личка с ботом @fractera_bot).","tasks":[{"body":"таблица telegram_notes_state в SCHEMA (key/value, курсор last_update_id)"},{"body":"getUpdates с offset и фильтром по TELEGRAM_ALLOWED_CHAT_ID"},{"body":"курсор продвигается до обработки (нет повторов при сбое)"},{"body":"ветка simulateMessage для теста без Telegram"}],"plan":{"sheet":"os-244071e59531649b","seq":2,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"fetch-telegram-updates","title":"Получить новые сообщения из Telegram (getUpdates)","kind":"action","task":"Реализовать тело шага получения обновлений. (1) Объявить в SCHEMA (app/lib/db/index.ts — новые таблицы ТОЛЬКО в SCHEMA) таблицу telegram_notes_state (key TEXT PRIMARY KEY, value TEXT) для курсора last_update_id. (2) GET https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=<last_update_id+1>&timeout=0 — короткий запрос без long-poll (шаг живёт внутри минутного тика). (3) Отфильтровать: только message с текстом; если задан TELEGRAM_ALLOWED_CHAT_ID — отбросить чужие чаты. (4) Продвинуть курсор на максимальный update_id СРАЗУ после чтения (защита от повторной обработки при падении дальше). (5) Вернуть массив {chatId, messageId, text, date}. (6) Если пришёл simulateMessage из run-панели — вернуть его как единственное сообщение с chatId = TELEGRAM_ALLOWED_CHAT_ID, Telegram не опрашивать. Токен НИКОГДА не хардкодить — только env (уже в слот-.env.local, правило 143).","description":"Опрашивает Telegram Bot API методом getUpdates с персистентным курсором last_update_id, отдаёт только новые сообщения владельца (личка с ботом @fractera_bot).","tools":["Telegram Bot API getUpdates","SQLite через @/lib/db (SCHEMA)","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN","TELEGRAM_ALLOWED_CHAT_ID"],"io":{"in":"cron-тик (пусто) или simulateMessage из run-панели","out":"массив новых сообщений {chatId, messageId, text, date}; курсор last_update_id продвинут"},"dependsOn":["telegram-cron-trigger"],"todo":["таблица telegram_notes_state в SCHEMA (key/value, курсор last_update_id)","getUpdates с offset и фильтром по TELEGRAM_ALLOWED_CHAT_ID","курсор продвигается до обработки (нет повторов при сбое)","ветка simulateMessage для теста без Telegram"]}}}
-->

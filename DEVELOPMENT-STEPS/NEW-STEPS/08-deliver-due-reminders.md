# 08 — Доставить наступившие напоминания (дата-пуш)

> Project sub-step · node `deliver-due-reminders` · kind: action · importance: mandatory · order sheet `os-244071e59531649b` (3/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:deliver-due-reminders` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать доставку напоминаний. (1) SELECT из telegram_notes, где reminder_due <= now И не помечено delivered. (2) Для каждой: POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage в chat_id с текстом «Напоминание: вы просили напомнить, что в <HH:mm> нужно <payload/summary>» (дословно то, что заложил пользователь — правильное поведение из видения владельца). (3) Пометить строку delivered=1 (добавить колонку в SCHEMA-таблицу). (4) Идёт параллельной веткой от триггера — не зависит от прихода новых сообщений. Сбой отправки логировать, не ретраить внутри тика (следующий тик повторит).

## Tools
- Telegram Bot API sendMessage
- SQLite через @/lib/db
- fetch

## Environment keys
- `TELEGRAM_BOT_TOKEN`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "cron-тик (проверка due на каждом прогоне)"
- **Out:** "{delivered: n, errors[]} — отправленные напоминания"

## Depends on
- `telegram-cron-trigger` (must be completed first)

## To-do / acceptance criteria
- [ ] SELECT наступивших reminder_due (не delivered)
- [ ] sendMessage дословным текстом напоминания
- [ ] пометить delivered; колонка delivered в SCHEMA

<!-- fractera:step
{"number":8,"name":"Доставить наступившие напоминания (дата-пуш)","importance":"mandatory","status":"new","completedAt":null,"description":"Единственное активное действие напоминаний (тип 1): на каждом cron-тике проверяет БД на наступившие reminder_due и шлёт пользователю текст напоминания в Telegram.","tasks":[{"body":"SELECT наступивших reminder_due (не delivered)"},{"body":"sendMessage дословным текстом напоминания"},{"body":"пометить delivered; колонка delivered в SCHEMA"}],"plan":{"sheet":"os-244071e59531649b","seq":3,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"deliver-due-reminders","title":"Доставить наступившие напоминания (дата-пуш)","kind":"action","task":"Реализовать доставку напоминаний. (1) SELECT из telegram_notes, где reminder_due <= now И не помечено delivered. (2) Для каждой: POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage в chat_id с текстом «Напоминание: вы просили напомнить, что в <HH:mm> нужно <payload/summary>» (дословно то, что заложил пользователь — правильное поведение из видения владельца). (3) Пометить строку delivered=1 (добавить колонку в SCHEMA-таблицу). (4) Идёт параллельной веткой от триггера — не зависит от прихода новых сообщений. Сбой отправки логировать, не ретраить внутри тика (следующий тик повторит).","description":"Единственное активное действие напоминаний (тип 1): на каждом cron-тике проверяет БД на наступившие reminder_due и шлёт пользователю текст напоминания в Telegram.","tools":["Telegram Bot API sendMessage","SQLite через @/lib/db","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN"],"io":{"in":"cron-тик (проверка due на каждом прогоне)","out":"{delivered: n, errors[]} — отправленные напоминания"},"dependsOn":["telegram-cron-trigger"],"todo":["SELECT наступивших reminder_due (не delivered)","sendMessage дословным текстом напоминания","пометить delivered; колонка delivered в SCHEMA"]}}}
-->

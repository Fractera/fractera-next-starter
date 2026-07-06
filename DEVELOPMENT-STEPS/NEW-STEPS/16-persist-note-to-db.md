# 16 — Записать заметку/напоминание в БД проекта

> Project sub-step · node `persist-note-to-db` · kind: action · importance: mandatory · order sheet `os-244071e59531649b` (7/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:persist-note-to-db` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать запись в БД. (1) Объявить в SCHEMA таблицу telegram_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, project_slug TEXT, hook_action TEXT, chat_id TEXT, msg_date INTEGER, reminder_due INTEGER NULL, full_text TEXT, summary TEXT, created_at INTEGER). (2) Для intent=save: reminder_due=NULL (заметка, тип 2). (3) Для intent=remind: извлечь дату/время из payload дешёвой моделью (или из detect-hook); если даты нет — пометить needs_when=true (узел reply попросит «когда?»), строку с reminder_due не создавать пока; если дата есть — reminder_due = unix-время (тип 1, дата-пуш). (4) Вернуть {dbId, intent, reminder_due, needs_when, chatId, summary} — dbId нужен для памяти и ответа. Новые таблицы ТОЛЬКО в SCHEMA (появятся в обеих средах).

## Tools
- SQLite через @/lib/db (SCHEMA)
- дешёвая модель по OPENAI_API_KEY (разбор даты)

## Environment keys
- `OPENAI_API_KEY`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "сообщения intent∈{save,remind} с {summary, payload, chatId, date}"
- **Out:** "{dbId, intent, reminder_due, needs_when, chatId, summary} на каждую запись"

## Depends on
- `summarize-message` (must be completed first)

## To-do / acceptance criteria
- [ ] таблица telegram_notes в SCHEMA (все колонки видения владельца)
- [ ] save → reminder_due NULL; remind+дата → reminder_due unix; remind без даты → needs_when
- [ ] вернуть dbId (для памяти и ответа)

<!-- fractera:step
{"number":16,"name":"Записать заметку/напоминание в БД проекта","importance":"mandatory","status":"new","completedAt":null,"description":"Пишет строку в собственную таблицу проекта: имя проекта, хук, чат, дата, данные напоминания по дате (только для remind — тип 1), полный исходный текст, summary, авто-идентификатор.","tasks":[{"body":"таблица telegram_notes в SCHEMA (все колонки видения владельца)"},{"body":"save → reminder_due NULL; remind+дата → reminder_due unix; remind без даты → needs_when"},{"body":"вернуть dbId (для памяти и ответа)"}],"plan":{"sheet":"os-244071e59531649b","seq":7,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"persist-note-to-db","title":"Записать заметку/напоминание в БД проекта","kind":"action","task":"Реализовать запись в БД. (1) Объявить в SCHEMA таблицу telegram_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, project_slug TEXT, hook_action TEXT, chat_id TEXT, msg_date INTEGER, reminder_due INTEGER NULL, full_text TEXT, summary TEXT, created_at INTEGER). (2) Для intent=save: reminder_due=NULL (заметка, тип 2). (3) Для intent=remind: извлечь дату/время из payload дешёвой моделью (или из detect-hook); если даты нет — пометить needs_when=true (узел reply попросит «когда?»), строку с reminder_due не создавать пока; если дата есть — reminder_due = unix-время (тип 1, дата-пуш). (4) Вернуть {dbId, intent, reminder_due, needs_when, chatId, summary} — dbId нужен для памяти и ответа. Новые таблицы ТОЛЬКО в SCHEMA (появятся в обеих средах).","description":"Пишет строку в собственную таблицу проекта: имя проекта, хук, чат, дата, данные напоминания по дате (только для remind — тип 1), полный исходный текст, summary, авто-идентификатор.","tools":["SQLite через @/lib/db (SCHEMA)","дешёвая модель по OPENAI_API_KEY (разбор даты)"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"сообщения intent∈{save,remind} с {summary, payload, chatId, date}","out":"{dbId, intent, reminder_due, needs_when, chatId, summary} на каждую запись"},"dependsOn":["summarize-message"],"todo":["таблица telegram_notes в SCHEMA (все колонки видения владельца)","save → reminder_due NULL; remind+дата → reminder_due unix; remind без даты → needs_when","вернуть dbId (для памяти и ответа)"]}}}
-->

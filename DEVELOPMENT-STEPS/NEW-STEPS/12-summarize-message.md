# 12 — Подробное summary сообщения (дешёвая модель)

> Project sub-step · node `summarize-message` · kind: action · importance: mandatory · order sheet `os-244071e59531649b` (5/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:summarize-message` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать инлайн-summary. Для каждого intent∈{save,remind}: (1) POST к дешёвой модели по OPENAI_API_KEY (тот же ключ, что detect-hook; НЕ отдельный навык — инлайн-вызов) с промптом «сделай сжатое, но полное summary этого сообщения, сохрани ключевые факты и даты». (2) Ограничить длину входа/выхода (токен-экономия). (3) Вернуть {messageId, summary} рядом с исходными полями. Сбой summary НЕ роняет прогон: summary = первые N символов исходного текста (мягкая деградация).

## Tools
- дешёвая модель по OPENAI_API_KEY
- fetch

## Environment keys
- `OPENAI_API_KEY`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "классифицированные сообщения intent∈{save,remind} {payload, chatId, messageId, date}"
- **Out:** "те же + {summary} на каждое сообщение"

## Depends on
- `detect-hook` (must be completed first)

## To-do / acceptance criteria
- [ ] инлайн-вызов дешёвой модели (без отдельного навыка)
- [ ] лимиты длины вход/выход (токен-экономия)
- [ ] сбой → summary = усечённый исходный текст (не падать)

<!-- fractera:step
{"number":12,"name":"Подробное summary сообщения (дешёвая модель)","importance":"mandatory","status":"new","completedAt":null,"description":"Для сообщений intent=save и intent=remind делает подробное summary полного текста дешёвой моделью — для записи в память и в таблицу результатов.","tasks":[{"body":"инлайн-вызов дешёвой модели (без отдельного навыка)"},{"body":"лимиты длины вход/выход (токен-экономия)"},{"body":"сбой → summary = усечённый исходный текст (не падать)"}],"plan":{"sheet":"os-244071e59531649b","seq":5,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"summarize-message","title":"Подробное summary сообщения (дешёвая модель)","kind":"action","task":"Реализовать инлайн-summary. Для каждого intent∈{save,remind}: (1) POST к дешёвой модели по OPENAI_API_KEY (тот же ключ, что detect-hook; НЕ отдельный навык — инлайн-вызов) с промптом «сделай сжатое, но полное summary этого сообщения, сохрани ключевые факты и даты». (2) Ограничить длину входа/выхода (токен-экономия). (3) Вернуть {messageId, summary} рядом с исходными полями. Сбой summary НЕ роняет прогон: summary = первые N символов исходного текста (мягкая деградация).","description":"Для сообщений intent=save и intent=remind делает подробное summary полного текста дешёвой моделью — для записи в память и в таблицу результатов.","tools":["дешёвая модель по OPENAI_API_KEY","fetch"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"классифицированные сообщения intent∈{save,remind} {payload, chatId, messageId, date}","out":"те же + {summary} на каждое сообщение"},"dependsOn":["detect-hook"],"todo":["инлайн-вызов дешёвой модели (без отдельного навыка)","лимиты длины вход/выход (токен-экономия)","сбой → summary = усечённый исходный текст (не падать)"]}}}
-->

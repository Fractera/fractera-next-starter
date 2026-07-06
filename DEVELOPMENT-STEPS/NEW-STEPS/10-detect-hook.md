# 10 — Распознать хук по первым словам (единая точка входа)

> Project sub-step · node `detect-hook` · kind: transform · importance: mandatory · order sheet `os-244071e59531649b` (4/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:detect-hook` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать распознаватель хука. (1) Прочитать активные хуки из таблицы project_hooks (187) через @/lib/db (нормализованные фразы + action save/remind/recall + projectSlug-владелец). (2) Для каждого сообщения: взять первые ~20 слов, прогнать через дешёвую модель по OPENAI_API_KEY с промптом-классификатором «содержит ли текст один из этих хуков; верни action и projectSlug или ignore» (нормализация регистра, ё/е, лишних пробелов через lib/hooks/normalize.ts шага 187). (3) payload = текст ПОСЛЕ фразы-хука; пустой payload → ignore. (4) Вернуть массив {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}. Сообщения без хука → ignore, дальше не идут. Дешёвая модель без тяжёлых инструкций — минимальный расход (тезис токен-эффективности).

## Tools
- project_hooks (таблица 187) через @/lib/db
- lib/hooks/normalize.ts (187)
- дешёвая модель по OPENAI_API_KEY
- fetch

## Environment keys
- `OPENAI_API_KEY`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "массив сообщений {chatId, messageId, text, date}"
- **Out:** "массив классифицированных {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}"

## Depends on
- `fetch-telegram-updates` (must be completed first)

## To-do / acceptance criteria
- [ ] чтение активных хуков из project_hooks (187) + normalize.ts
- [ ] первые ~20 слов → дешёвая модель → action/projectSlug или ignore
- [ ] payload = хвост после фразы; пустой → ignore
- [ ] промпт-классификатор компактный (токен-эффективность)

<!-- fractera:step
{"number":10,"name":"Распознать хук по первым словам (единая точка входа)","importance":"mandatory","status":"new","completedAt":null,"description":"Единая точка входа командного голосового режима: извлекает первые ~20 слов сообщения, дешёвой моделью определяет, содержит ли сообщение один из зарегистрированных хуков глобальной таблицы project_hooks (шаг 187), и классифицирует намерение. Общая инфраструктура — не только для заметок.","tasks":[{"body":"чтение активных хуков из project_hooks (187) + normalize.ts"},{"body":"первые ~20 слов → дешёвая модель → action/projectSlug или ignore"},{"body":"payload = хвост после фразы; пустой → ignore"},{"body":"промпт-классификатор компактный (токен-эффективность)"}],"plan":{"sheet":"os-244071e59531649b","seq":4,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"detect-hook","title":"Распознать хук по первым словам (единая точка входа)","kind":"transform","task":"Реализовать распознаватель хука. (1) Прочитать активные хуки из таблицы project_hooks (187) через @/lib/db (нормализованные фразы + action save/remind/recall + projectSlug-владелец). (2) Для каждого сообщения: взять первые ~20 слов, прогнать через дешёвую модель по OPENAI_API_KEY с промптом-классификатором «содержит ли текст один из этих хуков; верни action и projectSlug или ignore» (нормализация регистра, ё/е, лишних пробелов через lib/hooks/normalize.ts шага 187). (3) payload = текст ПОСЛЕ фразы-хука; пустой payload → ignore. (4) Вернуть массив {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}. Сообщения без хука → ignore, дальше не идут. Дешёвая модель без тяжёлых инструкций — минимальный расход (тезис токен-эффективности).","description":"Единая точка входа командного голосового режима: извлекает первые ~20 слов сообщения, дешёвой моделью определяет, содержит ли сообщение один из зарегистрированных хуков глобальной таблицы project_hooks (шаг 187), и классифицирует намерение. Общая инфраструктура — не только для заметок.","tools":["project_hooks (таблица 187) через @/lib/db","lib/hooks/normalize.ts (187)","дешёвая модель по OPENAI_API_KEY","fetch"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"массив сообщений {chatId, messageId, text, date}","out":"массив классифицированных {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}"},"dependsOn":["fetch-telegram-updates"],"todo":["чтение активных хуков из project_hooks (187) + normalize.ts","первые ~20 слов → дешёвая модель → action/projectSlug или ignore","payload = хвост после фразы; пустой → ignore","промпт-классификатор компактный (токен-эффективность)"]}}}
-->

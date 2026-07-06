# 18 — Записать заметку в векторную память (LightRAG)

> Project sub-step · node `ingest-note-to-memory` · kind: action · importance: mandatory · order sheet `os-244071e59531649b` (8/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:ingest-note-to-memory` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать ingest в память. Для каждой записи из БД (intent∈{save,remind}): (1) сформировать документ форматом: «Проект: telegram-notes | Хук: <action> | Дата: <YYYY-MM-DD HH:mm> | Запись #<dbId> | <полный текст>» (идентификатор БД внутри текста — чтобы ответ мог сослаться на запись). (2) POST /api/rag/ingest (LightRAG :9621 через API рабочего пространства) с заголовком X-Agent-Identity: telegram-notes. (3) Короткий текст — валиден (подтверждено шагом 181). (4) Сбой ingest НЕ роняет прогон: фиксируется в результат, уходит в ответ пользователю.

## Tools
- LightRAG /api/rag/ingest (:9621)
- fetch с X-Agent-Identity

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "записи БД {dbId, intent, chatId, summary} + полный текст"
- **Out:** "{dbId, chatId, ingestOk, error?} на каждую запись"

## Depends on
- `persist-note-to-db` (must be completed first)

## To-do / acceptance criteria
- [ ] формат документа: проект→хук→дата→#dbId→текст
- [ ] ingest с X-Agent-Identity: telegram-notes
- [ ] сбой → {ingestOk:false}, прогон не падает

<!-- fractera:step
{"number":18,"name":"Записать заметку в векторную память (LightRAG)","importance":"mandatory","status":"new","completedAt":null,"description":"Кладёт форматированную заметку в LightRAG — общую векторную память рабочего пространства (:9621) — так, чтобы при поиске запись однозначно идентифицировалась.","tasks":[{"body":"формат документа: проект→хук→дата→#dbId→текст"},{"body":"ingest с X-Agent-Identity: telegram-notes"},{"body":"сбой → {ingestOk:false}, прогон не падает"}],"plan":{"sheet":"os-244071e59531649b","seq":8,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"ingest-note-to-memory","title":"Записать заметку в векторную память (LightRAG)","kind":"action","task":"Реализовать ingest в память. Для каждой записи из БД (intent∈{save,remind}): (1) сформировать документ форматом: «Проект: telegram-notes | Хук: <action> | Дата: <YYYY-MM-DD HH:mm> | Запись #<dbId> | <полный текст>» (идентификатор БД внутри текста — чтобы ответ мог сослаться на запись). (2) POST /api/rag/ingest (LightRAG :9621 через API рабочего пространства) с заголовком X-Agent-Identity: telegram-notes. (3) Короткий текст — валиден (подтверждено шагом 181). (4) Сбой ingest НЕ роняет прогон: фиксируется в результат, уходит в ответ пользователю.","description":"Кладёт форматированную заметку в LightRAG — общую векторную память рабочего пространства (:9621) — так, чтобы при поиске запись однозначно идентифицировалась.","tools":["LightRAG /api/rag/ingest (:9621)","fetch с X-Agent-Identity"],"envKeys":[],"io":{"in":"записи БД {dbId, intent, chatId, summary} + полный текст","out":"{dbId, chatId, ingestOk, error?} на каждую запись"},"dependsOn":["persist-note-to-db"],"todo":["формат документа: проект→хук→дата→#dbId→текст","ingest с X-Agent-Identity: telegram-notes","сбой → {ingestOk:false}, прогон не падает"]}}}
-->

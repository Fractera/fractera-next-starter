# 14 — Найти ответ по заметкам (LightRAG query)

> Project sub-step · node `search-memory-recall` · kind: action · importance: mandatory · order sheet `os-244071e59531649b` (6/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:search-memory-recall` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать поиск. Для каждого intent=recall: (1) POST /api/rag/query (LightRAG :9621) mode=hybrid, query=payload, заголовок X-Agent-Identity: telegram-notes. (2) Ответ LightRAG — готовый связный текст (retrieval+генерация на стороне памяти; прямой LLM-API из проекта НЕ вызывается — правило «только подписка/место Гермеса»). (3) Пустой результат → честный «по вашим заметкам ничего не нашлось по запросу: <payload>». (4) Сбой query → мягко «память временно недоступна». Вернуть {chatId, answer}.

## Tools
- LightRAG /api/rag/query mode=hybrid (:9621)
- fetch с X-Agent-Identity

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "сообщения intent=recall {payload, chatId}"
- **Out:** "ответы {chatId, answer, error?}"

## Depends on
- `detect-hook` (must be completed first)

## To-do / acceptance criteria
- [ ] query mode=hybrid c X-Agent-Identity
- [ ] пустой результат → честное «ничего не нашлось»
- [ ] сбой → мягкая деградация

<!-- fractera:step
{"number":14,"name":"Найти ответ по заметкам (LightRAG query)","importance":"mandatory","status":"new","completedAt":null,"description":"Для intent=recall выполняет семантический поиск по векторной памяти (LightRAG hybrid) и формирует текст ответа прямо из памяти.","tasks":[{"body":"query mode=hybrid c X-Agent-Identity"},{"body":"пустой результат → честное «ничего не нашлось»"},{"body":"сбой → мягкая деградация"}],"plan":{"sheet":"os-244071e59531649b","seq":6,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"search-memory-recall","title":"Найти ответ по заметкам (LightRAG query)","kind":"action","task":"Реализовать поиск. Для каждого intent=recall: (1) POST /api/rag/query (LightRAG :9621) mode=hybrid, query=payload, заголовок X-Agent-Identity: telegram-notes. (2) Ответ LightRAG — готовый связный текст (retrieval+генерация на стороне памяти; прямой LLM-API из проекта НЕ вызывается — правило «только подписка/место Гермеса»). (3) Пустой результат → честный «по вашим заметкам ничего не нашлось по запросу: <payload>». (4) Сбой query → мягко «память временно недоступна». Вернуть {chatId, answer}.","description":"Для intent=recall выполняет семантический поиск по векторной памяти (LightRAG hybrid) и формирует текст ответа прямо из памяти.","tools":["LightRAG /api/rag/query mode=hybrid (:9621)","fetch с X-Agent-Identity"],"envKeys":[],"io":{"in":"сообщения intent=recall {payload, chatId}","out":"ответы {chatId, answer, error?}"},"dependsOn":["detect-hook"],"todo":["query mode=hybrid c X-Agent-Identity","пустой результат → честное «ничего не нашлось»","сбой → мягкая деградация"]}}}
-->

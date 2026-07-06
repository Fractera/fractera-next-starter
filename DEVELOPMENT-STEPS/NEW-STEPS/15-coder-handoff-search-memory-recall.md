# 15 — Call a coding agent: Найти ответ по заметкам (LightRAG query)

> Coder handoff · node `search-memory-recall` · kind: action · order sheet `os-244071e59531649b` (6/9) · spec step 14

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 14 (`NEW-STEPS/14-search-memory-recall.md`) — the exhaustive spec for node `search-memory-recall` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Найти ответ по заметкам (LightRAG query) — Для intent=recall выполняет семантический поиск по векторной памяти (LightRAG hybrid) и формирует текст ответа прямо из памяти.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:search-memory-recall` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** LightRAG /api/rag/query mode=hybrid (:9621), fetch с X-Agent-Identity — search for a ready skill / MCP connector before building one
- **Environment keys:** none
- **Depends on:** `detect-hook` — those sub-steps must be closed first
- **Inputs → outputs:** "сообщения intent=recall {payload, chatId}" → "ответы {chatId, answer, error?}"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] query mode=hybrid c X-Agent-Identity
- [ ] пустой результат → честное «ничего не нашлось»
- [ ] сбой → мягкая деградация
_(Full detail, inputs/outputs and to-do live in spec step 14.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 14 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":15,"name":"Call a coding agent: Найти ответ по заметкам (LightRAG query)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node search-memory-recall to a coding agent (read readme + spec step 14).","tasks":[{"body":"query mode=hybrid c X-Agent-Identity"},{"body":"пустой результат → честное «ничего не нашлось»"},{"body":"сбой → мягкая деградация"}],"plan":{"sheet":"os-244071e59531649b","seq":6,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"search-memory-recall","specStep":14,"specSeq":6,"node":{"id":"search-memory-recall","title":"Найти ответ по заметкам (LightRAG query)","kind":"action","tools":["LightRAG /api/rag/query mode=hybrid (:9621)","fetch с X-Agent-Identity"],"envKeys":[],"io":{"in":"сообщения intent=recall {payload, chatId}","out":"ответы {chatId, answer, error?}"},"dependsOn":["detect-hook"],"todo":["query mode=hybrid c X-Agent-Identity","пустой результат → честное «ничего не нашлось»","сбой → мягкая деградация"]}}}
-->

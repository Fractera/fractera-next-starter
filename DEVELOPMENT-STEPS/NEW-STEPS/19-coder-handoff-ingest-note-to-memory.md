# 19 — Call a coding agent: Записать заметку в векторную память (LightRAG)

> Coder handoff · node `ingest-note-to-memory` · kind: action · order sheet `os-244071e59531649b` (8/9) · spec step 18

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 18 (`NEW-STEPS/18-ingest-note-to-memory.md`) — the exhaustive spec for node `ingest-note-to-memory` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Записать заметку в векторную память (LightRAG) — Кладёт форматированную заметку в LightRAG — общую векторную память рабочего пространства (:9621) — так, чтобы при поиске запись однозначно идентифицировалась.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:ingest-note-to-memory` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** LightRAG /api/rag/ingest (:9621), fetch с X-Agent-Identity — search for a ready skill / MCP connector before building one
- **Environment keys:** none
- **Depends on:** `persist-note-to-db` — those sub-steps must be closed first
- **Inputs → outputs:** "записи БД {dbId, intent, chatId, summary} + полный текст" → "{dbId, chatId, ingestOk, error?} на каждую запись"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] формат документа: проект→хук→дата→#dbId→текст
- [ ] ingest с X-Agent-Identity: telegram-notes
- [ ] сбой → {ingestOk:false}, прогон не падает
_(Full detail, inputs/outputs and to-do live in spec step 18.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 18 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":19,"name":"Call a coding agent: Записать заметку в векторную память (LightRAG)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node ingest-note-to-memory to a coding agent (read readme + spec step 18).","tasks":[{"body":"формат документа: проект→хук→дата→#dbId→текст"},{"body":"ingest с X-Agent-Identity: telegram-notes"},{"body":"сбой → {ingestOk:false}, прогон не падает"}],"plan":{"sheet":"os-244071e59531649b","seq":8,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"ingest-note-to-memory","specStep":18,"specSeq":8,"node":{"id":"ingest-note-to-memory","title":"Записать заметку в векторную память (LightRAG)","kind":"action","tools":["LightRAG /api/rag/ingest (:9621)","fetch с X-Agent-Identity"],"envKeys":[],"io":{"in":"записи БД {dbId, intent, chatId, summary} + полный текст","out":"{dbId, chatId, ingestOk, error?} на каждую запись"},"dependsOn":["persist-note-to-db"],"todo":["формат документа: проект→хук→дата→#dbId→текст","ingest с X-Agent-Identity: telegram-notes","сбой → {ingestOk:false}, прогон не падает"]}}}
-->

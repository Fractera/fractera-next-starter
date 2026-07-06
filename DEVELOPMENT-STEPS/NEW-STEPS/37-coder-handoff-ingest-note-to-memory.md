# 37 — Call a coding agent: Write the note to vector memory (LightRAG)

> Coder handoff · node `ingest-note-to-memory` · kind: action · order sheet `os-bed7109d7be27ad4` (8/9) · spec step 36

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 36 (`NEW-STEPS/36-ingest-note-to-memory.md`) — the exhaustive spec for node `ingest-note-to-memory` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Write the note to vector memory (LightRAG) — Puts a formatted note into LightRAG — the workspace's shared vector memory (:9621) — so the record is unambiguously identifiable on search.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:ingest-note-to-memory` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** LightRAG /api/rag/ingest (:9621), fetch with X-Agent-Identity — search for a ready skill / MCP connector before building one
- **Environment keys:** none
- **Depends on:** `persist-note-to-db` — those sub-steps must be closed first
- **Inputs → outputs:** "DB records {dbId, intent, chatId, summary} + full text" → "{dbId, chatId, ingestOk, error?} for each record"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] document format: project→hook→date→#dbId→text
- [ ] ingest with X-Agent-Identity: telegram-notes
- [ ] on failure → {ingestOk:false}, the run doesn't crash
_(Full detail, inputs/outputs and to-do live in spec step 36.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 36 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":37,"name":"Call a coding agent: Write the note to vector memory (LightRAG)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node ingest-note-to-memory to a coding agent (read readme + spec step 36).","tasks":[{"body":"document format: project→hook→date→#dbId→text"},{"body":"ingest with X-Agent-Identity: telegram-notes"},{"body":"on failure → {ingestOk:false}, the run doesn't crash"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":8,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"ingest-note-to-memory","specStep":36,"specSeq":8,"node":{"id":"ingest-note-to-memory","title":"Write the note to vector memory (LightRAG)","kind":"action","tools":["LightRAG /api/rag/ingest (:9621)","fetch with X-Agent-Identity"],"envKeys":[],"io":{"in":"DB records {dbId, intent, chatId, summary} + full text","out":"{dbId, chatId, ingestOk, error?} for each record"},"dependsOn":["persist-note-to-db"],"todo":["document format: project→hook→date→#dbId→text","ingest with X-Agent-Identity: telegram-notes","on failure → {ingestOk:false}, the run doesn't crash"]}}}
-->

# 36 — Write the note to vector memory (LightRAG)

> Project sub-step · node `ingest-note-to-memory` · kind: action · importance: mandatory · order sheet `os-bed7109d7be27ad4` (8/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:ingest-note-to-memory` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Implement the ingest into memory. For each DB record (intent in {save, remind}): (1) build a document in the format: "Project: telegram-notes | Hook: <action> | Date: <YYYY-MM-DD HH:mm> | Record #<dbId> | <full text>" (the DB id inside the text so the reply can reference the record). (2) POST /api/rag/ingest (LightRAG :9621 through the workspace API) with the header X-Agent-Identity: telegram-notes. (3) Short text is valid (confirmed in step 181). (4) An ingest failure must NOT crash the run: it is recorded in the result and passed to the user's reply.

## Tools
- LightRAG /api/rag/ingest (:9621)
- fetch with X-Agent-Identity

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "DB records {dbId, intent, chatId, summary} + full text"
- **Out:** "{dbId, chatId, ingestOk, error?} for each record"

## Depends on
- `persist-note-to-db` (must be completed first)

## To-do / acceptance criteria
- [ ] document format: project→hook→date→#dbId→text
- [ ] ingest with X-Agent-Identity: telegram-notes
- [ ] on failure → {ingestOk:false}, the run doesn't crash

<!-- fractera:step
{"number":36,"name":"Write the note to vector memory (LightRAG)","importance":"mandatory","status":"new","completedAt":null,"description":"Puts a formatted note into LightRAG — the workspace's shared vector memory (:9621) — so the record is unambiguously identifiable on search.","tasks":[{"body":"document format: project→hook→date→#dbId→text"},{"body":"ingest with X-Agent-Identity: telegram-notes"},{"body":"on failure → {ingestOk:false}, the run doesn't crash"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":8,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"ingest-note-to-memory","title":"Write the note to vector memory (LightRAG)","kind":"action","task":"Implement the ingest into memory. For each DB record (intent in {save, remind}): (1) build a document in the format: \"Project: telegram-notes | Hook: <action> | Date: <YYYY-MM-DD HH:mm> | Record #<dbId> | <full text>\" (the DB id inside the text so the reply can reference the record). (2) POST /api/rag/ingest (LightRAG :9621 through the workspace API) with the header X-Agent-Identity: telegram-notes. (3) Short text is valid (confirmed in step 181). (4) An ingest failure must NOT crash the run: it is recorded in the result and passed to the user's reply.","description":"Puts a formatted note into LightRAG — the workspace's shared vector memory (:9621) — so the record is unambiguously identifiable on search.","tools":["LightRAG /api/rag/ingest (:9621)","fetch with X-Agent-Identity"],"envKeys":[],"io":{"in":"DB records {dbId, intent, chatId, summary} + full text","out":"{dbId, chatId, ingestOk, error?} for each record"},"dependsOn":["persist-note-to-db"],"todo":["document format: project→hook→date→#dbId→text","ingest with X-Agent-Identity: telegram-notes","on failure → {ingestOk:false}, the run doesn't crash"]}}}
-->

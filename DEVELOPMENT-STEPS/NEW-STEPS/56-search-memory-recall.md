# 56 — Find an answer in the notes (LightRAG query)

> Project sub-step · node `search-memory-recall` · kind: step · actions: recall · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (9/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:search-memory-recall` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
- `recall`

## Task
Implement the search. For each intent=recall: (1) POST /api/rag/query (LightRAG :9621) mode=hybrid, query=payload, header X-Agent-Identity: telegram-notes. (2) The LightRAG response is ready connected text (retrieval + generation on the memory side; the project does NOT call an LLM API directly — the "subscription only / Hermes's place" rule). (3) Empty result → an honest "nothing found in your notes for the query: <payload>". (4) On a query failure → gently "memory is temporarily unavailable". Return {chatId, answer}.

## Tools
- LightRAG /api/rag/query mode=hybrid (:9621)
- fetch with X-Agent-Identity

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "messages intent=recall {payload, chatId}"
- **Out:** "answers {chatId, answer, error?}"

## Depends on
- `detect-hook` (must be completed first)

## To-do / acceptance criteria
- [ ] query mode=hybrid with X-Agent-Identity
- [ ] empty result → honest "nothing found"
- [ ] on failure → graceful degradation

<!-- fractera:step
{"number":56,"name":"Find an answer in the notes (LightRAG query)","importance":"mandatory","status":"new","completedAt":null,"description":"For intent=recall it runs a semantic search over vector memory (LightRAG hybrid) and builds the answer text straight from memory.","tasks":[{"body":"query mode=hybrid with X-Agent-Identity"},{"body":"empty result → honest \"nothing found\""},{"body":"on failure → graceful degradation"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":9,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"search-memory-recall","title":"Find an answer in the notes (LightRAG query)","kind":"step","actions":["recall"],"condition":null,"errorPolicy":"soft-degrade","state":["notes-memory"],"task":"Implement the search. For each intent=recall: (1) POST /api/rag/query (LightRAG :9621) mode=hybrid, query=payload, header X-Agent-Identity: telegram-notes. (2) The LightRAG response is ready connected text (retrieval + generation on the memory side; the project does NOT call an LLM API directly — the \"subscription only / Hermes's place\" rule). (3) Empty result → an honest \"nothing found in your notes for the query: <payload>\". (4) On a query failure → gently \"memory is temporarily unavailable\". Return {chatId, answer}.","description":"For intent=recall it runs a semantic search over vector memory (LightRAG hybrid) and builds the answer text straight from memory.","tools":["LightRAG /api/rag/query mode=hybrid (:9621)","fetch with X-Agent-Identity"],"envKeys":[],"io":{"in":"messages intent=recall {payload, chatId}","out":"answers {chatId, answer, error?}"},"dependsOn":["detect-hook"],"todo":["query mode=hybrid with X-Agent-Identity","empty result → honest \"nothing found\"","on failure → graceful degradation"]}}}
-->

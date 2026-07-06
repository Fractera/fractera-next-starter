# 33 — Call a coding agent: Find an answer in the notes (LightRAG query)

> Coder handoff · node `search-memory-recall` · kind: action · order sheet `os-bed7109d7be27ad4` (6/9) · spec step 32

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 32 (`NEW-STEPS/32-search-memory-recall.md`) — the exhaustive spec for node `search-memory-recall` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Find an answer in the notes (LightRAG query) — For intent=recall it runs a semantic search over vector memory (LightRAG hybrid) and builds the answer text straight from memory.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:search-memory-recall` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** LightRAG /api/rag/query mode=hybrid (:9621), fetch with X-Agent-Identity — search for a ready skill / MCP connector before building one
- **Environment keys:** none
- **Depends on:** `detect-hook` — those sub-steps must be closed first
- **Inputs → outputs:** "messages intent=recall {payload, chatId}" → "answers {chatId, answer, error?}"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] query mode=hybrid with X-Agent-Identity
- [ ] empty result → honest "nothing found"
- [ ] on failure → graceful degradation
_(Full detail, inputs/outputs and to-do live in spec step 32.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 32 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":33,"name":"Call a coding agent: Find an answer in the notes (LightRAG query)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node search-memory-recall to a coding agent (read readme + spec step 32).","tasks":[{"body":"query mode=hybrid with X-Agent-Identity"},{"body":"empty result → honest \"nothing found\""},{"body":"on failure → graceful degradation"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":6,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"search-memory-recall","specStep":32,"specSeq":6,"node":{"id":"search-memory-recall","title":"Find an answer in the notes (LightRAG query)","kind":"action","tools":["LightRAG /api/rag/query mode=hybrid (:9621)","fetch with X-Agent-Identity"],"envKeys":[],"io":{"in":"messages intent=recall {payload, chatId}","out":"answers {chatId, answer, error?}"},"dependsOn":["detect-hook"],"todo":["query mode=hybrid with X-Agent-Identity","empty result → honest \"nothing found\"","on failure → graceful degradation"]}}}
-->

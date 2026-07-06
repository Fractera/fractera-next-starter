# 54 — Detailed message summary (cheap model)

> Project sub-step · node `summarize-message` · kind: step · actions: save, remind · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (8/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:summarize-message` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
- `save`
- `remind`

## Task
Implement the inline summary. For each intent in {save, remind}: (1) POST to a cheap model via OPENAI_API_KEY (the same key as detect-hook; NOT a separate skill — an inline call) with the prompt "produce a concise but complete summary of this message, preserving key facts and dates". (2) Cap the input/output length (token thrift). (3) Return {messageId, summary} alongside the original fields. A summary failure must NOT crash the run: summary = the first N characters of the original text (graceful degradation).

## Tools
- cheap model via OPENAI_API_KEY
- fetch

## Environment keys
- `OPENAI_API_KEY`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "classified messages intent in {save, remind} {payload, chatId, messageId, date}"
- **Out:** "the same + {summary} for each message"

## Depends on
- `detect-hook` (must be completed first)

## To-do / acceptance criteria
- [ ] inline cheap-model call (no separate skill)
- [ ] input/output length caps (token thrift)
- [ ] on failure → summary = truncated original text (don't crash)

<!-- fractera:step
{"number":54,"name":"Detailed message summary (cheap model)","importance":"mandatory","status":"new","completedAt":null,"description":"For messages with intent=save and intent=remind it produces a detailed summary of the full text using a cheap model — for the memory record and the results table.","tasks":[{"body":"inline cheap-model call (no separate skill)"},{"body":"input/output length caps (token thrift)"},{"body":"on failure → summary = truncated original text (don't crash)"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":8,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"summarize-message","title":"Detailed message summary (cheap model)","kind":"step","actions":["save","remind"],"condition":null,"errorPolicy":"soft-degrade","state":[],"task":"Implement the inline summary. For each intent in {save, remind}: (1) POST to a cheap model via OPENAI_API_KEY (the same key as detect-hook; NOT a separate skill — an inline call) with the prompt \"produce a concise but complete summary of this message, preserving key facts and dates\". (2) Cap the input/output length (token thrift). (3) Return {messageId, summary} alongside the original fields. A summary failure must NOT crash the run: summary = the first N characters of the original text (graceful degradation).","description":"For messages with intent=save and intent=remind it produces a detailed summary of the full text using a cheap model — for the memory record and the results table.","tools":["cheap model via OPENAI_API_KEY","fetch"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"classified messages intent in {save, remind} {payload, chatId, messageId, date}","out":"the same + {summary} for each message"},"dependsOn":["detect-hook"],"todo":["inline cheap-model call (no separate skill)","input/output length caps (token thrift)","on failure → summary = truncated original text (don't crash)"]}}}
-->

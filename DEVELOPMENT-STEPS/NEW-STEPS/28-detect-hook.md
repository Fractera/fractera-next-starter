# 28 — Detect the hook from the first words (single entry point)

> Project sub-step · node `detect-hook` · kind: transform · importance: mandatory · order sheet `os-bed7109d7be27ad4` (4/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:detect-hook` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Implement the hook detector. (1) Read the active hooks from the project_hooks table (187) via @/lib/db (normalized phrases + action save/remind/recall + the owning projectSlug). (2) For each message: take the first ~20 words and run them through a cheap model via OPENAI_API_KEY with a classifier prompt "does the text contain one of these hooks; return action and projectSlug or ignore" (normalize case, ё/е, and extra whitespace via lib/hooks/normalize.ts from step 187). (3) payload = the text AFTER the hook phrase; empty payload → ignore. (4) Return an array of {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}. Messages without a hook → ignore and go no further. A cheap model with no heavy instructions — minimal cost (the token-efficiency thesis).

## Tools
- project_hooks (table, step 187) via @/lib/db
- lib/hooks/normalize.ts (187)
- cheap model via OPENAI_API_KEY
- fetch

## Environment keys
- `OPENAI_API_KEY`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "array of messages {chatId, messageId, text, date}"
- **Out:** "array of classified {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}"

## Depends on
- `fetch-telegram-updates` (must be completed first)

## To-do / acceptance criteria
- [ ] read active hooks from project_hooks (187) + normalize.ts
- [ ] first ~20 words → cheap model → action/projectSlug or ignore
- [ ] payload = the tail after the phrase; empty → ignore
- [ ] compact classifier prompt (token efficiency)

<!-- fractera:step
{"number":28,"name":"Detect the hook from the first words (single entry point)","importance":"mandatory","status":"new","completedAt":null,"description":"The single entry point of the spoken command mode: it extracts the first ~20 words of a message, uses a cheap model to determine whether the message contains one of the registered hooks from the global project_hooks table (step 187), and classifies the intent. Shared infrastructure — not just for notes.","tasks":[{"body":"read active hooks from project_hooks (187) + normalize.ts"},{"body":"first ~20 words → cheap model → action/projectSlug or ignore"},{"body":"payload = the tail after the phrase; empty → ignore"},{"body":"compact classifier prompt (token efficiency)"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":4,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"detect-hook","title":"Detect the hook from the first words (single entry point)","kind":"transform","task":"Implement the hook detector. (1) Read the active hooks from the project_hooks table (187) via @/lib/db (normalized phrases + action save/remind/recall + the owning projectSlug). (2) For each message: take the first ~20 words and run them through a cheap model via OPENAI_API_KEY with a classifier prompt \"does the text contain one of these hooks; return action and projectSlug or ignore\" (normalize case, ё/е, and extra whitespace via lib/hooks/normalize.ts from step 187). (3) payload = the text AFTER the hook phrase; empty payload → ignore. (4) Return an array of {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}. Messages without a hook → ignore and go no further. A cheap model with no heavy instructions — minimal cost (the token-efficiency thesis).","description":"The single entry point of the spoken command mode: it extracts the first ~20 words of a message, uses a cheap model to determine whether the message contains one of the registered hooks from the global project_hooks table (step 187), and classifies the intent. Shared infrastructure — not just for notes.","tools":["project_hooks (table, step 187) via @/lib/db","lib/hooks/normalize.ts (187)","cheap model via OPENAI_API_KEY","fetch"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"array of messages {chatId, messageId, text, date}","out":"array of classified {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}"},"dependsOn":["fetch-telegram-updates"],"todo":["read active hooks from project_hooks (187) + normalize.ts","first ~20 words → cheap model → action/projectSlug or ignore","payload = the tail after the phrase; empty → ignore","compact classifier prompt (token efficiency)"]}}}
-->

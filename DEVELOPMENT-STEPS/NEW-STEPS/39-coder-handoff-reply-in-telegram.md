# 39 — Call a coding agent: Reply to the user in Telegram

> Coder handoff · node `reply-in-telegram` · kind: action · order sheet `os-bed7109d7be27ad4` (9/9) · spec step 38

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 38 (`NEW-STEPS/38-reply-in-telegram.md`) — the exhaustive spec for node `reply-in-telegram` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Reply to the user in Telegram — The final node: a save confirmation ("Saved"), a "when?" question for a remind without a date, or the found recall answer — back to the same chat via sendMessage.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:reply-in-telegram` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** Telegram Bot API sendMessage, fetch — search for a ready skill / MCP connector before building one
- **Environment keys:** `TELEGRAM_BOT_TOKEN` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `ingest-note-to-memory`, `search-memory-recall` — those sub-steps must be closed first
- **Inputs → outputs:** "ingest results {dbId,chatId,ingestOk,summary}, needs_when, recall {chatId,answer}" → "run summary {processed, saved, reminded, answered, errors[]} for the dashboard/table"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] save→confirmation, remind→"I'll remind you"/"when?", recall→answer
- [ ] plain text without parse_mode, cut at >4096
- [ ] run summary {processed,saved,reminded,answered,errors[]}
_(Full detail, inputs/outputs and to-do live in spec step 38.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 38 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":39,"name":"Call a coding agent: Reply to the user in Telegram","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node reply-in-telegram to a coding agent (read readme + spec step 38).","tasks":[{"body":"save→confirmation, remind→\"I'll remind you\"/\"when?\", recall→answer"},{"body":"plain text without parse_mode, cut at >4096"},{"body":"run summary {processed,saved,reminded,answered,errors[]}"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":9,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"reply-in-telegram","specStep":38,"specSeq":9,"node":{"id":"reply-in-telegram","title":"Reply to the user in Telegram","kind":"action","tools":["Telegram Bot API sendMessage","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN"],"io":{"in":"ingest results {dbId,chatId,ingestOk,summary}, needs_when, recall {chatId,answer}","out":"run summary {processed, saved, reminded, answered, errors[]} for the dashboard/table"},"dependsOn":["ingest-note-to-memory","search-memory-recall"],"todo":["save→confirmation, remind→\"I'll remind you\"/\"when?\", recall→answer","plain text without parse_mode, cut at >4096","run summary {processed,saved,reminded,answered,errors[]}"]}}}
-->

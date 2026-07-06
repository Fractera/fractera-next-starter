# 25 — Call a coding agent: Fetch new messages from Telegram (getUpdates)

> Coder handoff · node `fetch-telegram-updates` · kind: action · order sheet `os-bed7109d7be27ad4` (2/9) · spec step 24

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 24 (`NEW-STEPS/24-fetch-telegram-updates.md`) — the exhaustive spec for node `fetch-telegram-updates` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Fetch new messages from Telegram (getUpdates) — Polls the Telegram Bot API with getUpdates using a persistent last_update_id cursor, returning only the owner's new messages (the private chat with @fractera_bot).

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:fetch-telegram-updates` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** Telegram Bot API getUpdates, SQLite via @/lib/db (SCHEMA), fetch — search for a ready skill / MCP connector before building one
- **Environment keys:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALLOWED_CHAT_ID` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `telegram-cron-trigger` — those sub-steps must be closed first
- **Inputs → outputs:** "cron tick (empty) or simulateMessage from the run panel" → "array of new messages {chatId, messageId, text, date}; last_update_id cursor advanced"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] telegram_notes_state table in SCHEMA (key/value, last_update_id cursor)
- [ ] getUpdates with offset and a TELEGRAM_ALLOWED_CHAT_ID filter
- [ ] cursor advances before processing (no repeats on failure)
- [ ] simulateMessage branch for testing without Telegram
_(Full detail, inputs/outputs and to-do live in spec step 24.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 24 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":25,"name":"Call a coding agent: Fetch new messages from Telegram (getUpdates)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node fetch-telegram-updates to a coding agent (read readme + spec step 24).","tasks":[{"body":"telegram_notes_state table in SCHEMA (key/value, last_update_id cursor)"},{"body":"getUpdates with offset and a TELEGRAM_ALLOWED_CHAT_ID filter"},{"body":"cursor advances before processing (no repeats on failure)"},{"body":"simulateMessage branch for testing without Telegram"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":2,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"fetch-telegram-updates","specStep":24,"specSeq":2,"node":{"id":"fetch-telegram-updates","title":"Fetch new messages from Telegram (getUpdates)","kind":"action","tools":["Telegram Bot API getUpdates","SQLite via @/lib/db (SCHEMA)","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN","TELEGRAM_ALLOWED_CHAT_ID"],"io":{"in":"cron tick (empty) or simulateMessage from the run panel","out":"array of new messages {chatId, messageId, text, date}; last_update_id cursor advanced"},"dependsOn":["telegram-cron-trigger"],"todo":["telegram_notes_state table in SCHEMA (key/value, last_update_id cursor)","getUpdates with offset and a TELEGRAM_ALLOWED_CHAT_ID filter","cursor advances before processing (no repeats on failure)","simulateMessage branch for testing without Telegram"]}}}
-->

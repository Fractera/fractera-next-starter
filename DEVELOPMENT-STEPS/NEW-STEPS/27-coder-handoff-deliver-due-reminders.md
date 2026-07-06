# 27 — Call a coding agent: Deliver due reminders (date push)

> Coder handoff · node `deliver-due-reminders` · kind: action · order sheet `os-bed7109d7be27ad4` (3/9) · spec step 26

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 26 (`NEW-STEPS/26-deliver-due-reminders.md`) — the exhaustive spec for node `deliver-due-reminders` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Deliver due reminders (date push) — The only active reminder action (type 1): on every cron tick it checks the DB for due reminder_due rows and sends the reminder text to the user in Telegram.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:deliver-due-reminders` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** Telegram Bot API sendMessage, SQLite via @/lib/db, fetch — search for a ready skill / MCP connector before building one
- **Environment keys:** `TELEGRAM_BOT_TOKEN` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `telegram-cron-trigger` — those sub-steps must be closed first
- **Inputs → outputs:** "cron tick (checks due on every run)" → "{delivered: n, errors[]} — the reminders sent"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] SELECT due reminder_due rows (not delivered)
- [ ] sendMessage with the verbatim reminder text
- [ ] mark delivered; delivered column in SCHEMA
_(Full detail, inputs/outputs and to-do live in spec step 26.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 26 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":27,"name":"Call a coding agent: Deliver due reminders (date push)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node deliver-due-reminders to a coding agent (read readme + spec step 26).","tasks":[{"body":"SELECT due reminder_due rows (not delivered)"},{"body":"sendMessage with the verbatim reminder text"},{"body":"mark delivered; delivered column in SCHEMA"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":3,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"deliver-due-reminders","specStep":26,"specSeq":3,"node":{"id":"deliver-due-reminders","title":"Deliver due reminders (date push)","kind":"action","tools":["Telegram Bot API sendMessage","SQLite via @/lib/db","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN"],"io":{"in":"cron tick (checks due on every run)","out":"{delivered: n, errors[]} — the reminders sent"},"dependsOn":["telegram-cron-trigger"],"todo":["SELECT due reminder_due rows (not delivered)","sendMessage with the verbatim reminder text","mark delivered; delivered column in SCHEMA"]}}}
-->

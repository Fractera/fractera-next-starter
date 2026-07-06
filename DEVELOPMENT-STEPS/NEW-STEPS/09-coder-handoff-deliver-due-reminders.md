# 09 — Call a coding agent: Доставить наступившие напоминания (дата-пуш)

> Coder handoff · node `deliver-due-reminders` · kind: action · order sheet `os-244071e59531649b` (3/9) · spec step 08

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 08 (`NEW-STEPS/08-deliver-due-reminders.md`) — the exhaustive spec for node `deliver-due-reminders` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Доставить наступившие напоминания (дата-пуш) — Единственное активное действие напоминаний (тип 1): на каждом cron-тике проверяет БД на наступившие reminder_due и шлёт пользователю текст напоминания в Telegram.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:deliver-due-reminders` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** Telegram Bot API sendMessage, SQLite через @/lib/db, fetch — search for a ready skill / MCP connector before building one
- **Environment keys:** `TELEGRAM_BOT_TOKEN` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `telegram-cron-trigger` — those sub-steps must be closed first
- **Inputs → outputs:** "cron-тик (проверка due на каждом прогоне)" → "{delivered: n, errors[]} — отправленные напоминания"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] SELECT наступивших reminder_due (не delivered)
- [ ] sendMessage дословным текстом напоминания
- [ ] пометить delivered; колонка delivered в SCHEMA
_(Full detail, inputs/outputs and to-do live in spec step 08.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 08 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":9,"name":"Call a coding agent: Доставить наступившие напоминания (дата-пуш)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node deliver-due-reminders to a coding agent (read readme + spec step 08).","tasks":[{"body":"SELECT наступивших reminder_due (не delivered)"},{"body":"sendMessage дословным текстом напоминания"},{"body":"пометить delivered; колонка delivered в SCHEMA"}],"plan":{"sheet":"os-244071e59531649b","seq":3,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"deliver-due-reminders","specStep":8,"specSeq":3,"node":{"id":"deliver-due-reminders","title":"Доставить наступившие напоминания (дата-пуш)","kind":"action","tools":["Telegram Bot API sendMessage","SQLite через @/lib/db","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN"],"io":{"in":"cron-тик (проверка due на каждом прогоне)","out":"{delivered: n, errors[]} — отправленные напоминания"},"dependsOn":["telegram-cron-trigger"],"todo":["SELECT наступивших reminder_due (не delivered)","sendMessage дословным текстом напоминания","пометить delivered; колонка delivered в SCHEMA"]}}}
-->

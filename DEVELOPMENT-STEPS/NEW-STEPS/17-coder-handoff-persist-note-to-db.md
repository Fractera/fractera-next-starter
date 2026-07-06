# 17 — Call a coding agent: Записать заметку/напоминание в БД проекта

> Coder handoff · node `persist-note-to-db` · kind: action · order sheet `os-244071e59531649b` (7/9) · spec step 16

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 16 (`NEW-STEPS/16-persist-note-to-db.md`) — the exhaustive spec for node `persist-note-to-db` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Записать заметку/напоминание в БД проекта — Пишет строку в собственную таблицу проекта: имя проекта, хук, чат, дата, данные напоминания по дате (только для remind — тип 1), полный исходный текст, summary, авто-идентификатор.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:persist-note-to-db` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** SQLite через @/lib/db (SCHEMA), дешёвая модель по OPENAI_API_KEY (разбор даты) — search for a ready skill / MCP connector before building one
- **Environment keys:** `OPENAI_API_KEY` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `summarize-message` — those sub-steps must be closed first
- **Inputs → outputs:** "сообщения intent∈{save,remind} с {summary, payload, chatId, date}" → "{dbId, intent, reminder_due, needs_when, chatId, summary} на каждую запись"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] таблица telegram_notes в SCHEMA (все колонки видения владельца)
- [ ] save → reminder_due NULL; remind+дата → reminder_due unix; remind без даты → needs_when
- [ ] вернуть dbId (для памяти и ответа)
_(Full detail, inputs/outputs and to-do live in spec step 16.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 16 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":17,"name":"Call a coding agent: Записать заметку/напоминание в БД проекта","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node persist-note-to-db to a coding agent (read readme + spec step 16).","tasks":[{"body":"таблица telegram_notes в SCHEMA (все колонки видения владельца)"},{"body":"save → reminder_due NULL; remind+дата → reminder_due unix; remind без даты → needs_when"},{"body":"вернуть dbId (для памяти и ответа)"}],"plan":{"sheet":"os-244071e59531649b","seq":7,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"persist-note-to-db","specStep":16,"specSeq":7,"node":{"id":"persist-note-to-db","title":"Записать заметку/напоминание в БД проекта","kind":"action","tools":["SQLite через @/lib/db (SCHEMA)","дешёвая модель по OPENAI_API_KEY (разбор даты)"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"сообщения intent∈{save,remind} с {summary, payload, chatId, date}","out":"{dbId, intent, reminder_due, needs_when, chatId, summary} на каждую запись"},"dependsOn":["summarize-message"],"todo":["таблица telegram_notes в SCHEMA (все колонки видения владельца)","save → reminder_due NULL; remind+дата → reminder_due unix; remind без даты → needs_when","вернуть dbId (для памяти и ответа)"]}}}
-->

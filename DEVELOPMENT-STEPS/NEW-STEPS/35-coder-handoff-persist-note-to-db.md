# 35 — Call a coding agent: Write the note/reminder to the project DB

> Coder handoff · node `persist-note-to-db` · kind: action · order sheet `os-bed7109d7be27ad4` (7/9) · spec step 34

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 34 (`NEW-STEPS/34-persist-note-to-db.md`) — the exhaustive spec for node `persist-note-to-db` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Write the note/reminder to the project DB — Writes a row to the project's own table: project name, hook, chat, date, date-reminder data (only for remind — type 1), full original text, summary, and an auto id.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:persist-note-to-db` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** SQLite via @/lib/db (SCHEMA), cheap model via OPENAI_API_KEY (date parsing) — search for a ready skill / MCP connector before building one
- **Environment keys:** `OPENAI_API_KEY` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `summarize-message` — those sub-steps must be closed first
- **Inputs → outputs:** "messages intent in {save, remind} with {summary, payload, chatId, date}" → "{dbId, intent, reminder_due, needs_when, chatId, summary} for each record"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] telegram_notes table in SCHEMA (all columns from the owner's vision)
- [ ] save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when
- [ ] return dbId (for memory and the reply)
_(Full detail, inputs/outputs and to-do live in spec step 34.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 34 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":35,"name":"Call a coding agent: Write the note/reminder to the project DB","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node persist-note-to-db to a coding agent (read readme + spec step 34).","tasks":[{"body":"telegram_notes table in SCHEMA (all columns from the owner's vision)"},{"body":"save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when"},{"body":"return dbId (for memory and the reply)"}],"plan":{"sheet":"os-bed7109d7be27ad4","seq":7,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"persist-note-to-db","specStep":34,"specSeq":7,"node":{"id":"persist-note-to-db","title":"Write the note/reminder to the project DB","kind":"action","tools":["SQLite via @/lib/db (SCHEMA)","cheap model via OPENAI_API_KEY (date parsing)"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"messages intent in {save, remind} with {summary, payload, chatId, date}","out":"{dbId, intent, reminder_due, needs_when, chatId, summary} for each record"},"dependsOn":["summarize-message"],"todo":["telegram_notes table in SCHEMA (all columns from the owner's vision)","save → reminder_due NULL; remind+date → reminder_due unix; remind without date → needs_when","return dbId (for memory and the reply)"]}}}
-->

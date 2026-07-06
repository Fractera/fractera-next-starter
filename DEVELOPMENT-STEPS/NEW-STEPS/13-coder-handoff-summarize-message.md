# 13 — Call a coding agent: Подробное summary сообщения (дешёвая модель)

> Coder handoff · node `summarize-message` · kind: action · order sheet `os-244071e59531649b` (5/9) · spec step 12

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 12 (`NEW-STEPS/12-summarize-message.md`) — the exhaustive spec for node `summarize-message` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Подробное summary сообщения (дешёвая модель) — Для сообщений intent=save и intent=remind делает подробное summary полного текста дешёвой моделью — для записи в память и в таблицу результатов.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:summarize-message` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** action
- **Tools / integrations:** дешёвая модель по OPENAI_API_KEY, fetch — search for a ready skill / MCP connector before building one
- **Environment keys:** `OPENAI_API_KEY` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `detect-hook` — those sub-steps must be closed first
- **Inputs → outputs:** "классифицированные сообщения intent∈{save,remind} {payload, chatId, messageId, date}" → "те же + {summary} на каждое сообщение"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] инлайн-вызов дешёвой модели (без отдельного навыка)
- [ ] лимиты длины вход/выход (токен-экономия)
- [ ] сбой → summary = усечённый исходный текст (не падать)
_(Full detail, inputs/outputs and to-do live in spec step 12.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 12 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":13,"name":"Call a coding agent: Подробное summary сообщения (дешёвая модель)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node summarize-message to a coding agent (read readme + spec step 12).","tasks":[{"body":"инлайн-вызов дешёвой модели (без отдельного навыка)"},{"body":"лимиты длины вход/выход (токен-экономия)"},{"body":"сбой → summary = усечённый исходный текст (не падать)"}],"plan":{"sheet":"os-244071e59531649b","seq":5,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"summarize-message","specStep":12,"specSeq":5,"node":{"id":"summarize-message","title":"Подробное summary сообщения (дешёвая модель)","kind":"action","tools":["дешёвая модель по OPENAI_API_KEY","fetch"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"классифицированные сообщения intent∈{save,remind} {payload, chatId, messageId, date}","out":"те же + {summary} на каждое сообщение"},"dependsOn":["detect-hook"],"todo":["инлайн-вызов дешёвой модели (без отдельного навыка)","лимиты длины вход/выход (токен-экономия)","сбой → summary = усечённый исходный текст (не падать)"]}}}
-->

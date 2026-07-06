# 11 — Call a coding agent: Распознать хук по первым словам (единая точка входа)

> Coder handoff · node `detect-hook` · kind: transform · order sheet `os-244071e59531649b` (4/9) · spec step 10

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 10 (`NEW-STEPS/10-detect-hook.md`) — the exhaustive spec for node `detect-hook` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Распознать хук по первым словам (единая точка входа) — Единая точка входа командного голосового режима: извлекает первые ~20 слов сообщения, дешёвой моделью определяет, содержит ли сообщение один из зарегистрированных хуков глобальной таблицы project_hooks (шаг 187), и классифицирует намерение. Общая инфраструктура — не только для заметок.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:detect-hook` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** transform
- **Tools / integrations:** project_hooks (таблица 187) через @/lib/db, lib/hooks/normalize.ts (187), дешёвая модель по OPENAI_API_KEY, fetch — search for a ready skill / MCP connector before building one
- **Environment keys:** `OPENAI_API_KEY` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `fetch-telegram-updates` — those sub-steps must be closed first
- **Inputs → outputs:** "массив сообщений {chatId, messageId, text, date}" → "массив классифицированных {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] чтение активных хуков из project_hooks (187) + normalize.ts
- [ ] первые ~20 слов → дешёвая модель → action/projectSlug или ignore
- [ ] payload = хвост после фразы; пустой → ignore
- [ ] промпт-классификатор компактный (токен-эффективность)
_(Full detail, inputs/outputs and to-do live in spec step 10.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 10 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":11,"name":"Call a coding agent: Распознать хук по первым словам (единая точка входа)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node detect-hook to a coding agent (read readme + spec step 10).","tasks":[{"body":"чтение активных хуков из project_hooks (187) + normalize.ts"},{"body":"первые ~20 слов → дешёвая модель → action/projectSlug или ignore"},{"body":"payload = хвост после фразы; пустой → ignore"},{"body":"промпт-классификатор компактный (токен-эффективность)"}],"plan":{"sheet":"os-244071e59531649b","seq":4,"total":9,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"detect-hook","specStep":10,"specSeq":4,"node":{"id":"detect-hook","title":"Распознать хук по первым словам (единая точка входа)","kind":"transform","tools":["project_hooks (таблица 187) через @/lib/db","lib/hooks/normalize.ts (187)","дешёвая модель по OPENAI_API_KEY","fetch"],"envKeys":["OPENAI_API_KEY"],"io":{"in":"массив сообщений {chatId, messageId, text, date}","out":"массив классифицированных {intent: save|remind|recall|ignore, projectSlug, payload, chatId, messageId, date}"},"dependsOn":["fetch-telegram-updates"],"todo":["чтение активных хуков из project_hooks (187) + normalize.ts","первые ~20 слов → дешёвая модель → action/projectSlug или ignore","payload = хвост после фразы; пустой → ignore","промпт-классификатор компактный (токен-эффективность)"]}}}
-->

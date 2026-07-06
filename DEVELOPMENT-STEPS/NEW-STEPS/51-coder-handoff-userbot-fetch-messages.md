# 51 — Call a coding agent: Receive any-chat messages (userbot)

> Coder handoff · node `userbot-fetch-messages` · kind: step · order sheet `os-629d27a2ddcfd5e5` (6/12) · spec step 50

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 50 (`NEW-STEPS/50-userbot-fetch-messages.md`) — the exhaustive spec for node `userbot-fetch-messages` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Receive any-chat messages (userbot) — The reception step of the advanced track: normalizes messages arriving from the userbot listener into the same {chatId, messageId, text, date} shape the bot-chat fetch produces. Graceful no-op while the track is not configured.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:userbot-fetch-messages` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** step
- **Actions served:** all (the ontology's Action entity — see `CRUD-DOCS/workspace-standards/automation-ontology.md`)
- **Error policy:** soft-degrade
- **Tools / integrations:** substrate listener service (Phase 6), @/lib/db (shared shapes) — search for a ready skill / MCP connector before building one
- **Environment keys:** `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_SESSION` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** `userbot-reception-trigger` — those sub-steps must be closed first
- **Inputs → outputs:** "a userbot-sourced message from the listener (or nothing while unconfigured)" → "array of normalized messages {chatId, messageId, text, date, source}"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] absent keys mean [] (inert, no errors)
- [ ] normalize to the shared message shape
- [ ] replies stay on the bot track
_(Full detail, inputs/outputs and to-do live in spec step 50.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 50 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":51,"name":"Call a coding agent: Receive any-chat messages (userbot)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node userbot-fetch-messages to a coding agent (read readme + spec step 50).","tasks":[{"body":"absent keys mean [] (inert, no errors)"},{"body":"normalize to the shared message shape"},{"body":"replies stay on the bot track"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":6,"total":12,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"userbot-fetch-messages","specStep":50,"specSeq":6,"node":{"id":"userbot-fetch-messages","title":"Receive any-chat messages (userbot)","kind":"step","actions":"all","condition":null,"errorPolicy":"soft-degrade","tools":["substrate listener service (Phase 6)","@/lib/db (shared shapes)"],"envKeys":["TELEGRAM_API_ID","TELEGRAM_API_HASH","TELEGRAM_SESSION"],"io":{"in":"a userbot-sourced message from the listener (or nothing while unconfigured)","out":"array of normalized messages {chatId, messageId, text, date, source}"},"dependsOn":["userbot-reception-trigger"],"todo":["absent keys mean [] (inert, no errors)","normalize to the shared message shape","replies stay on the bot track"]}}}
-->

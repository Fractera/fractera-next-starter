# 45 — Call a coding agent: Any-chat reception (userbot, advanced track)

> Coder handoff · node `userbot-reception-trigger` · kind: trigger · order sheet `os-629d27a2ddcfd5e5` (3/12) · spec step 44

I am the orchestrator; I do not program. Hand a coding agent (Claude Code / Codex / Gemini / Qwen / Kimi) ONLY this step number — everything they need is here and in the spec step it points to. This step IS the delegation record.

## The coder's first actions, in order
1. Read `app/(projects)/projects/personal/telegram-notes/README.md` — the whole project overview (why / how it works / efficiency / reuse / result).
2. Open step 44 (`NEW-STEPS/44-userbot-reception-trigger.md`) — the exhaustive spec for node `userbot-reception-trigger` (task, inputs/outputs, to-do).
3. Obey your own workspace instructions (`CLAUDE.md` / `AGENTS.md`): the static-first canon, `.client`/`.server` naming, ≤200-line components, and the full development pipeline (open → build → verify → deploy → record → close).

**Deliver:** Any-chat reception (userbot, advanced track) — The advanced reception track: an always-on MTProto userbot signed in as the owner reads hook phrases in ANY chat (not only the bot chat) and feeds them into the same pipeline; the bot replies. Configured in Settings > Any chat (API ID/hash + one-time phone auth = session string). Built in Phase 6.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Node at a glance
- **Kind:** trigger
- **Actions served:** all (the ontology's Action entity — see `CRUD-DOCS/workspace-standards/automation-ontology.md`)
- **Tools / integrations:** MTProto client (gramjs) in the substrate listener service, run route POST /api/projects/personal/telegram-notes/run — search for a ready skill / MCP connector before building one
- **Environment keys:** `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_SESSION` — materialize EACH via the `persist-env-var-with-rebuild` skill (write to the slot `app/.env.local` → rebuild); never hardcode a secret
- **Depends on:** none — this is a root node
- **Inputs → outputs:** "a message in ANY chat of the owner containing a hook phrase" → "a pipeline run carrying that message"

## Documentation is already on disk (assume no internet)
Any external reference this node needs is transferred to `CRUD-DOCS/external/…` and Company Memory before this handoff (the `prepare-automation-knowledge` doc-transfer). Read the local files or query Company Memory — do not assume internet access. If a needed document is missing, say so in the step; never guess an API.

## Acceptance criteria
- [ ] MTProto auth from env (no hardcoded secrets)
- [ ] hook-phrase prefilter before invoking the pipeline
- [ ] inert-until-configured (no errors when keys are absent)
_(Full detail, inputs/outputs and to-do live in spec step 44.)_

## When done
Deploy, then record the deployment (platform, model, tokens, page URL), and close BOTH this handoff step and spec step 44 into `COMPLETED-STEPS/`.

The orchestrator relays only the number — do not wait for more context in chat; it is all here and in the spec step.

<!-- fractera:step
{"number":45,"name":"Call a coding agent: Any-chat reception (userbot, advanced track)","importance":"mandatory","status":"new","completedAt":null,"description":"Delegate node userbot-reception-trigger to a coding agent (read readme + spec step 44).","tasks":[{"body":"MTProto auth from env (no hardcoded secrets)"},{"body":"hook-phrase prefilter before invoking the pipeline"},{"body":"inert-until-configured (no errors when keys are absent)"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":3,"total":12,"kind":"coder-handoff","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","nodeId":"userbot-reception-trigger","specStep":44,"specSeq":3,"node":{"id":"userbot-reception-trigger","title":"Any-chat reception (userbot, advanced track)","kind":"trigger","actions":"all","condition":null,"errorPolicy":null,"tools":["MTProto client (gramjs) in the substrate listener service","run route POST /api/projects/personal/telegram-notes/run"],"envKeys":["TELEGRAM_API_ID","TELEGRAM_API_HASH","TELEGRAM_SESSION"],"io":{"in":"a message in ANY chat of the owner containing a hook phrase","out":"a pipeline run carrying that message"},"dependsOn":[],"todo":["MTProto auth from env (no hardcoded secrets)","hook-phrase prefilter before invoking the pipeline","inert-until-configured (no errors when keys are absent)"]}}}
-->

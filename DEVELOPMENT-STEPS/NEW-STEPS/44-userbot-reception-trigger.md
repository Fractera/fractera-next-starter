# 44 — Any-chat reception (userbot, advanced track)

> Project sub-step · node `userbot-reception-trigger` · kind: trigger · actions: all · importance: mandatory · order sheet `os-629d27a2ddcfd5e5` (3/12)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code. The automation-ontology glossary (`CRUD-DOCS/workspace-standards/automation-ontology.md`) defines every entity this spec uses.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Actions this node serves
_Trunk node — every action of the automation flows through it._

## Task
Own the any-chat wake-up (Phase 6). The substrate listener service authenticates via MTProto (TELEGRAM_API_ID + TELEGRAM_API_HASH + TELEGRAM_SESSION), subscribes to all dialogs, and on any message containing a registered hook phrase invokes the run route with that message. Until Phase 6 wires it, the track is inert (the settings tab shows the setup checklist).

## Tools
- MTProto client (gramjs) in the substrate listener service
- run route POST /api/projects/personal/telegram-notes/run

## Environment keys
- `TELEGRAM_API_ID`
- `TELEGRAM_API_HASH`
- `TELEGRAM_SESSION`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "a message in ANY chat of the owner containing a hook phrase"
- **Out:** "a pipeline run carrying that message"

## Depends on
_No dependencies (root node)._

## To-do / acceptance criteria
- [ ] MTProto auth from env (no hardcoded secrets)
- [ ] hook-phrase prefilter before invoking the pipeline
- [ ] inert-until-configured (no errors when keys are absent)

<!-- fractera:step
{"number":44,"name":"Any-chat reception (userbot, advanced track)","importance":"mandatory","status":"new","completedAt":null,"description":"The advanced reception track: an always-on MTProto userbot signed in as the owner reads hook phrases in ANY chat (not only the bot chat) and feeds them into the same pipeline; the bot replies. Configured in Settings > Any chat (API ID/hash + one-time phone auth = session string). Built in Phase 6.","tasks":[{"body":"MTProto auth from env (no hardcoded secrets)"},{"body":"hook-phrase prefilter before invoking the pipeline"},{"body":"inert-until-configured (no errors when keys are absent)"}],"plan":{"sheet":"os-629d27a2ddcfd5e5","seq":3,"total":12,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"userbot-reception-trigger","title":"Any-chat reception (userbot, advanced track)","kind":"trigger","actions":"all","condition":null,"errorPolicy":null,"state":[],"task":"Own the any-chat wake-up (Phase 6). The substrate listener service authenticates via MTProto (TELEGRAM_API_ID + TELEGRAM_API_HASH + TELEGRAM_SESSION), subscribes to all dialogs, and on any message containing a registered hook phrase invokes the run route with that message. Until Phase 6 wires it, the track is inert (the settings tab shows the setup checklist).","description":"The advanced reception track: an always-on MTProto userbot signed in as the owner reads hook phrases in ANY chat (not only the bot chat) and feeds them into the same pipeline; the bot replies. Configured in Settings > Any chat (API ID/hash + one-time phone auth = session string). Built in Phase 6.","tools":["MTProto client (gramjs) in the substrate listener service","run route POST /api/projects/personal/telegram-notes/run"],"envKeys":["TELEGRAM_API_ID","TELEGRAM_API_HASH","TELEGRAM_SESSION"],"io":{"in":"a message in ANY chat of the owner containing a hook phrase","out":"a pipeline run carrying that message"},"dependsOn":[],"todo":["MTProto auth from env (no hardcoded secrets)","hook-phrase prefilter before invoking the pipeline","inert-until-configured (no errors when keys are absent)"]}}}
-->

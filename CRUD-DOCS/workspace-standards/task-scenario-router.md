# Task scenario router — pick the vector FIRST (two scenarios, one explicit fork)

> **Above this router sits the CHANNEL router (step 200, `agent-channel-routing.md`).** Routing to the handling
> SYSTEM — the brain (Hermes) vs a coding agent vs the automations runtime — is decided **deterministically by the
> messaging channel the request arrived on** (one Telegram bot per role), NOT by classifying intent. So this
> scenario router is a fork **WITHIN a coding-agent build channel**: the channel has already fixed the *actor* (a
> coding agent), and Level-0 "is this app-making?" is answered by which bot received the message. FROZEN-ASSEMBLY vs
> REAL-DEVELOPMENT below decides *how* that build agent proceeds.

The authoritative rule for **how any complex task enters work**. It is an architectural invariant, not a
heuristic: before decomposing or doing anything, the agent decides **which of two scenarios** the request
belongs to. If the vector is not explicit, the agent **asks ONE clarifying question** and waits for an
explicit answer. This exists because a complex request that mixes the two scenarios is exactly what makes
even a strong model finish ~75% and author work it should have refused.

## Step 0 — is this an app-making (Fractera) task at all?

The router is TWO levels. Level 0 first: an agent (Hermes especially) can have skills that have **nothing to
do with building applications** — reading email, general assistant work, and many other cases. Those are
**out of scope for this router** and must NOT be forced through the frozen / real-development machinery.

- **Not app-making** (email, a general question, another Hermes/agent skill) → handle it with that skill or
  tool as usual; **this router does not apply** — do not complicate it with the app pipeline.
- **App-making (the Fractera domain — building or altering the application itself)** → continue to Level 1,
  the two scenarios below.

Only after a request is confirmed to be app-making do FROZEN-ASSEMBLY vs REAL-DEVELOPMENT apply.

## The two scenarios (Level 1 — only for app-making)

| | **FROZEN-ASSEMBLY** (this pipeline) | **REAL-DEVELOPMENT** (the coding engine) |
|---|---|---|
| Intent | Quickly stand up a **prototype from frozen templates** | Turn frozen templates into a **real project** |
| Shape | **FLAT**, MCP-only, no code, no recursion | **Recursive** decompose-and-develop cycle |
| Actor | Hermes / any agent via frozen-template MCP | Coding agents (Claude Code / Codex / Gemini / Qwen / Kimi) |
| Operations | **CREATE new** structural stubs (section / page) | **MODIFY existing** · author **real/custom content** · real features |
| Engine | `owner_content_orchestrate` (:3227) flat pipeline | the development pipeline (`CLAUDE.md §6`) + coding agents |

**The border is the operation type, not a time-phase** (there is no `project_phase` flag):
- **CREATE new** (a section that does not exist yet; a new page/stub in a template group) → **FROZEN-ASSEMBLY**.
- **MODIFY existing** (change a page that already exists) OR **author custom/real content** (fill a stub with
  real prose) → **REAL-DEVELOPMENT**. These are NOT frozen-template work.

## The fork (do this before anything)

1. **Read the vector.** New structural stubs from templates → FROZEN. Modify-existing / real content / real
   feature → REAL-DEV.
2. **If the vector is not explicit, ASK ONE question** and wait:
   > "Are you assembling a quick prototype from frozen templates right now — or turning them into a real
   > project / changing something that already exists?"
   The owner names the vector explicitly; you do not guess.
3. **Route:**
   - FROZEN → run the flat unfreeze pipeline (`orchestrate-content-by-steps`): decompose → plan (`dry_run`) →
     owner approval → run every sub-step to the end (open→execute→deploy→RECORD→close, gated). Any agent may
     run this, Hermes included.
   - REAL-DEV → the coding engine, written **ONLY by a coding agent** (Claude Code / Codex / Gemini / Qwen /
     Kimi). **Hermes never programs**, but it **delegates** such a request to a coding agent: confirm the
     payload (`confirm-before-mutation`) → check readiness (`choose-agent`) → delegate (`delegate-task`). If
     **no** agent is signed into a subscription, that is NOT a failure and must never be voiced as "the
     platform is broken" — Hermes gives a calm structured status (present X / with active subscription Y) and
     offers two options: activate the agents and retry, OR save the task as a development step
     (`owner_report_blocker_step`) to return to later. (A coding agent that receives a REAL-DEV task just does it.)

## Announce the long run (before starting a compound plan)

A compound frozen plan runs many sub-steps, each with its own deploy — it takes time and the chat stays quiet
while it runs. Before starting the run (after the plan is approved), the agent tells the owner plainly, in
their language:
> "I'm going into development now; it finishes by deploying the project and may take a while — activity in this
> chat will be hidden meanwhile. You can watch the changes live on the service pages:
> `https://<domain>/architecture` and `https://<domain>/development-steps`."

Use the real base URL (or `http://<IP>:<port>` in IP mode). Those realtime pages (`law id="realtime-pages"`)
poll the filesystem and pulse each node as sub-steps open, deploy and close — a live progress view while the
chat is silent. This is standard for ANY complex multi-step run (frozen or, for a coding agent, real dev).

## The operation gate (FROZEN pipeline refuses REAL-DEV work)

Inside FROZEN-ASSEMBLY only **create-new stubs** are accepted. A request to **modify an existing page** or to
**author custom/real content** is hard-cut and routed out, verbatim:

> "In the current scenario (assembly from frozen templates) this task is not accepted. Filling in real
> content / changing an existing page is a separate request handled by coding agents."

This is the same border as Phase 1 (frozen stub structure) vs Phase 2 (real content, step 155): the stub
executors already refuse a real body (`blocks` payload) — the gate makes the routing explicit and consulted.

**Hermes states the boundary out loud and splits do-vs-delegate.** Hermes's authority is exactly this:
standing up starter templates from frozen components to ease the future work of coding agents — NOT new code,
new/enhanced functionality, or real content. On a request that sounds like content or a feature ("make a page
about apples", "add a working X"), Hermes must NOT silently take it or silently refuse it. It says the boundary
plainly and splits the request: what it will do (the frozen stub structure) vs what is delegated (the real
content / the functionality → a coding agent via `delegate-task`, after confirming the payload and checking
readiness; if no agent is active, offer to save it as a development step, `owner_report_blocker_step`). It
never fills a page with real content itself. (This is Hermes-facing; a coding agent that receives real work
simply does it.)

## Related
- Flat pipeline mechanics: `orchestrate-content-by-steps` skill + `frozen-template-constructor.md`.
- Menu placement / access tier per group: step 158 (`owner_template_update_group`) · step 161 (app-shell auth).
- The recursive side: `development-methodology.md` + `CLAUDE.md §6` (the coding pipeline).

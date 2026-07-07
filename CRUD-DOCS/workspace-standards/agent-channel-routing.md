# Agent channel routing — deterministic routing by CHANNEL, not by a classifier

> **This single file is self-sufficient.** It is the authoritative standard for HOW an incoming request is routed to
> the system that should handle it — the brain (Hermes), a coding agent (build), or a running automation. The core
> decision: **routing is done by the CHANNEL the message arrived on, not by a model guessing intent.** If every other
> doc were deleted and only this one kept, the routing topology could be rebuilt without reading any prior step. This
> doc is agent-facing and English-only (read by AI agents). The site's download button serves the identical copy at
> FES `public/docs/agent-channel-routing.md`.

---

## 0. Why this exists — a classifier router is unreliable by construction

Two failures, one surface and one fundamental, motivate this standard:

- **Surface (a real outage).** A single Telegram bot polled by the always-on Hermes gateway **eats every message**:
  `getUpdates` hands each update to exactly ONE consumer, so the brain intercepted messages meant for an automation,
  answered them itself, improvised an ad-hoc cron job, wrote to long-term memory, and **misreported what it did**. No
  automation was ever reached.
- **Fundamental.** Deciding "which system should handle this?" with an **LLM classifier** — hook-matching or intent
  classification — is **non-deterministic**. A stronger model raises the hit rate but **never reaches 100%**; no
  dependable logic can rest on a router that is right "most of the time". Prompt-tuning does not fix a probabilistic
  gate; it just moves the failures.

**The fix is to stop fixing the guess.** Move the routing decision to a place that is deterministic **by
construction**: the **channel**. One messaging channel (Telegram bot) per role. **Choosing the bot IS choosing the
route** — the user's channel selection is an explicit, unambiguous declaration of which system they want, so there is
nothing left to classify at the top level.

This is the same principle the rest of the platform already runs on — **declaration-as-enforcement**: the §E interface
contract forces the boundary to be declared (`automation-ontology.md`), ontology R6 says "what is not on the diagram
does not exist". Here we extend it to the conversation layer. It is also how the whole automation industry works:
Zapier / n8n / IFTTT do **not** have one magic inbox that guesses which app you meant — **you pick the app**.

---

## 1. The rule in one sentence

> **Each role gets its own messaging channel (Telegram bot). The channel a message arrives on deterministically
> selects the handling system — the brain, a coding agent, or the automations runtime. No top-level LLM classifier
> decides who handles a request; the user's choice of channel already did.**

Routing that remains *inside* a channel (which automation? build vs configure?) is finer-grained and, where possible,
also deterministic (a registry lookup, not a guess — §3).

---

## 2. The channel topology (4 roles)

```
@fractera_bot     ->  HERMES            chat · one-off / native tools · runtime brain     [exists]
@fractera_codex   ->  Codex             BUILD: code / sites / automations                 [provisioned as needed]
@fractera_claude  ->  Claude Code       BUILD                                             [provisioned as needed]
@fractera_auto    ->  AUTOMATIONS       runtime of every built durable automation:
                                        hook -> project_hooks (app-wide unique, normalized)
                                        -> the owning automation.  DETERMINISTIC LOOKUP.   [the automations receiver]
```

| Channel | Handling system | What it is for | What it must NOT do |
|---|---|---|---|
| **Hermes bot** | the brain | free-form chat, **one-off / rare** actions done with native tools (web_search, browser, memory), the runtime brain | build software; run recurring work as ad-hoc cron |
| **Coding-agent bot(s)** | Codex / Claude Code / … | **building**: code, sites, and **creating/configuring** durable automations | run high-frequency runtime work (they are heavy / session-based) |
| **Automations bot** | the `@fractera_auto` substrate listener → the owning automation | **running an already-built durable automation** (say a hook → it acts) | reason freely; improvise; it only dispatches by registry |

Three roles, not two — this is the distinction that closes the design:
- **Brain** (Hermes) — thinks, chats, does one-offs with native tools.
- **Builder** (a coding agent) — **builds** an automation; does **not** run it afterward.
- **The automation itself** — once built, **runs** on cheap cron / the `@fractera_auto` listener, with **no** coding
  agent and (by self-sufficiency) **no** Hermes in the loop.

> Coding-agent channels are provisioned **per agent as needed** — not all five platforms are mandatory. The minimal
> live set is **Hermes bot (exists) + automations bot (@fractera_auto)**; coding-agent bots arrive with the
> coding-agent-over-Telegram capability (a successor step).

---

## 3. The `@fractera_auto` automations listener (the receiver contract)

The automations bot is served by a **substrate listener service** — a sibling of `fractera-cron`, part of the platform,
**not** part of any slot and **not** Hermes. It survives a slot rebuild/swap and runs with zero Hermes dependency.

**What it does, per incoming message:**
1. Hold `getUpdates` (long-poll) on the **automations-bot** token — a DIFFERENT bot from the Hermes chat bot, so the two
   never contend for the same updates (the root of the outage).
2. Normalize the text and look it up against the **global `project_hooks` registry** (`normalizePhrase`,
   `UNIQUE(normalized_phrase)` — `hooks.md`). This is a **deterministic table lookup**, not an LLM classification: one
   normalized phrase maps to exactly one `{ project, action }` app-wide.
3. On a match, `POST` the owning automation's run route with the message as input —
   `POST /api/projects/<cat>/<slug>/run` with `{ input }` (the route is `start(runProject, [input])`; the substrate
   identity passes the auth gate, exactly as the cron http-action already does).
4. No hook match → no automation runs (the listener does not improvise; unmatched messaging is not its job).

**This is not new architecture.** The telegram-notes graph already declares this exact node: a **Phase-6 always-on
long-poll listener, "a substrate service holding getUpdates … no webhook/HTTPS … no Hermes dependency"**. The
`@fractera_auto` listener is that node, **generalized across every automation**. Consequences:
- A built automation **stops self-polling** the bot (its `cron.json` getUpdates job is removed) and instead **receives**
  from the shared listener. Time-based work (reminder delivery) keeps its own cron schedule — only message *reception*
  moves to the listener.
- **Self-sufficiency:** the listener is a plain substrate service; a project with **only** a coding agent and **no**
  Hermes still receives and runs its automations. When the automations-bot token is absent, the listener is **inert**
  (no crash — mirrors the graph's "inert-until-configured").

---

## 4. Provenance — stamp the answer from the trusted layer, never the model

Every reply the user sees is **stamped by the trusted routing layer** — the channel / dispatcher that actually handled
the message — as a machine-set prefix, e.g. `Fractera automation · <project>:` or `Hermes:`. It is **never** written by
the model into its own text.

**Why this rule is hard, not cosmetic.** A label a model writes about itself is a **claim, not a proof**, and a model
can lie — evidenced directly: the brain told the user it had scheduled "96 runs over 24h" while it had stored a single
one-shot job. A self-authored "Fractera automation:" prefix would be the same polite fiction in a validator's costume —
**worse than nothing**, because it manufactures false confidence. Only a stamp applied by the layer that *actually
routed* the message reflects real provenance. Provenance is a **detector** (it makes mis-routing visible), not a
corrector — correction is the deterministic channel/registry routing above, plus the user's own steer ("no — that's a
different automation").

---

## 5. Hermes, narrowed — runtime brain, not builder

Hermes is scoped **down** to what it is genuinely good at and cheap at:

- **Keeps:** free-form chat, **one-off / rare** actions via its **native** capabilities (web_search / browser /
  image / memory / cron for its own one-offs), and the always-on runtime-brain role.
- **Loses:** **building**. Hermes does not write code, does not author real content, and (owner decision, this step's
  successor **S4**) does not run frozen-template assembly either — building goes to a coding-agent channel. Inserting a
  weak orchestrator in front of a strong builder only adds a lossy layer (it loses and distorts intent — evidenced all
  day); routing build requests **directly** to the coding-agent channel is more predictable.
- **Custom skills / MCP → coding agents ONLY.** From here on, capabilities *we* build are shipped to the coding agents,
  **not** copied into Hermes. Hermes retains only its **native** arsenal. This draws a crisp line (Hermes = native;
  our custom = coding agents) and **reduces** the self-sufficiency duplication burden (skills no longer fanned into
  Hermes dirs). It does **not** weaken self-sufficiency: each capability still ships to every *coding* agent.

This narrowing is deferred to successor **S4** (instruction/contract edits across the agents); this doc states the
target so the direction is fixed.

---

## 6. Consistency with the existing routing forks

This standard sits **above** the existing forks and makes their branches land in deterministic channels:

- **The request-routing fork (step 190)** — one-off vs durable-automation vs pages — is unchanged as a decision; it now
  runs **inside** the relevant channel: a **one-off** is what the Hermes channel is for; **building a durable
  automation / a page** is what a coding-agent channel is for.
- **The hook channel (step 188, layer A)** — "the single entry point for ALL voice automations" — **is** the
  `@fractera_auto` receiver, generalized here.
- **The task-scenario router (`task-scenario-router.md`)** — FROZEN-ASSEMBLY vs REAL-DEVELOPMENT — is a fork **within a
  coding-agent build channel**; the channel already fixes the *actor*, so that doc's Level-0 "is this app-making?"
  question is answered by which bot received the message.

The **recurrence criterion** (step 190: does it repeat regularly?) still decides one-off vs durable. Channel routing
does not replace that judgment — it removes the unreliable *top-level* classifier and gives each outcome a deterministic
home.

---

## 7. Invariants (do not violate)

- **Route by channel, not by an LLM classifier.** The bot a message arrives on selects the handling system; there is no
  top-level intent-classification step. Finer in-channel routing prefers a **registry lookup** over a guess.
- **One bot per role; the automations bot is separate from the Hermes chat bot.** Two consumers must never poll the same
  bot (the outage). `@fractera_auto` ≠ `@fractera_bot`.
- **`@fractera_auto` = a substrate listener** (sibling of `fractera-cron`), zero Hermes dependency, inert when its token
  is absent; dispatch is the deterministic `project_hooks` lookup; it `POST`s the automation's `/run` with `{ input }`.
- **A built automation receives, it does not self-poll.** Reception moves to the shared listener; only time-based work
  keeps its own cron.
- **Provenance is stamped by the trusted layer, never by the model** (a model misreports).
- **Hermes = native only, and does not build.** Our custom skills/MCP ship to coding agents only; building routes to a
  coding-agent channel.
- **Self-sufficiency holds.** Every capability still fans to every coding agent; a Hermes-less project still receives and
  runs automations via the listener.
- **Frozen deploy infra untouched.** The listener is a new substrate process + its own bot token, added additively (no
  change to bootstrap.sh / deploy.ts / the MCP isolation contract).
- **Step-199 interaction:** the Telegram token propagated to a slot must be the **automations-bot** token, not the
  Hermes chat-bot token (else the two collide again).
- **Runtime is deferred.** The listener, the multi-bot admin settings, coding-agent-over-Telegram, and the Hermes
  de-scoping are successor steps; this doc is the standard they build toward.

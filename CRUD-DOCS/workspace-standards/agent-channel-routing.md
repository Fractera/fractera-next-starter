# Agent channel routing — deterministic routing by CHANNEL, not by a classifier

> **This single file is self-sufficient.** It is the authoritative standard for HOW an incoming message is routed to the
> system that should handle it — the brain (Hermes), a coding agent (build), or a specific running automation. The core
> decision: **routing is done by the CHANNEL (the Telegram bot) the message arrived on, not by a model guessing intent.**
> If every other doc were deleted and only this one kept, the routing topology could be rebuilt without reading any prior
> step. This doc is agent-facing and English-only (read by AI agents). The site's download button serves the identical
> copy at FES `public/docs/agent-channel-routing.md`.
>
> **Supersedes the earlier per-ROLE draft** (a single shared `@fractera_auto` bot for all automations, routed by a
> `project_hooks` phrase lookup). The model is now **one bot per automation** and **hooks are removed** — see §8.

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
construction**: the **channel**. **One Telegram bot per handler** — one per role (brain, each coding agent) and **one
per durable automation**. **Choosing the bot IS choosing the handler** — the user's channel selection is an explicit,
unambiguous declaration of which system they want, so there is nothing left to classify at the top level.

This is the same principle the rest of the platform already runs on — **declaration-as-enforcement**: the §E interface
contract forces the boundary to be declared (`automation-ontology.md`), ontology R6 says "what is not on the diagram
does not exist". Here we extend it to the conversation layer. It is also how the whole automation industry works:
Zapier / n8n / IFTTT do **not** have one magic inbox that guesses which app you meant — **you pick the app**.

---

## 1. The rule in one sentence

> **Every handler gets its own Telegram bot: one per role (brain, each coding agent) and ONE PER durable automation. The
> bot a message arrives on deterministically selects the handler. No top-level LLM classifier decides who handles a
> message; the user's choice of bot already did.**

The only routing that remains *inside* a channel is, for an automation, "which ACTION does this message mean?" — and even
that is not a top-level guess: it is a per-automation classification with a human-in-the-loop fallback (§3.1), never a
shared cross-automation phrase registry.

---

## 2. The channel topology

```
@fractera_bot        ->  HERMES          chat · one-off / native tools · runtime brain        [exists, per role]
@fractera_codex      ->  Codex           BUILD: code / sites / automations                    [per role, as needed]
@fractera_claude     ->  Claude Code     BUILD                                                [per role, as needed]

<one bot PER automation>  ->  THAT automation's runtime.   e.g.
  @my_notes_bot      ->  personal/telegram-notes    (its own dedicated bot; the bot IS the route)
  @my_langlearn_bot  ->  personal/language-learning (a second automation = a second bot)
  @my_yt_bot         ->  personal/youtube-posting   (a third automation = a third bot)
```

**Two granularities, one principle:**
- **Per role** — the brain and each coding agent have one bot each (a role is a stable actor).
- **Per automation (1:1)** — every durable automation gets **its own** bot. N automations ⇒ N bots. There is **no**
  shared automations bot and **no** cross-automation phrase router; the bot's identity already names the automation.

| Channel | Handling system | What it is for | What it must NOT do |
|---|---|---|---|
| **Hermes bot** | the brain | free-form chat, **one-off / rare** actions with native tools (web_search, browser, memory), the runtime brain | build software; run recurring work as ad-hoc cron |
| **Coding-agent bot(s)** | Codex / Claude Code / … | **building**: code, sites, and **creating/configuring** durable automations | run high-frequency runtime work (heavy / session-based) |
| **Automation bot (one per automation)** | the substrate listener → **that one** automation | **running one already-built durable automation**: say something → it classifies the action and acts | reason freely across domains; handle another automation's messages |

Three kinds of actor, the distinction that closes the design:
- **Brain** (Hermes) — thinks, chats, does one-offs with native tools.
- **Builder** (a coding agent) — **builds** an automation; does **not** run it afterward.
- **The automation itself** — once built, **runs** on cheap cron + its **own** bot, with **no** coding agent and (by
  self-sufficiency) **no** Hermes in the loop.

> Coding-agent channels are provisioned **per agent as needed**; automation bots are created **per automation** by the
> owner when they open the automation (§4). The minimal live set is the **Hermes bot** plus **one bot per automation the
> owner actually uses**.

---

## 3. The automations listener (multi-bot receiver contract)

Automation bots are served by ONE **substrate listener service** (`fractera-automations`) — a sibling of `fractera-cron`,
part of the platform, **not** part of any slot and **not** Hermes. It survives a slot rebuild/swap and runs with zero
Hermes dependency.

It holds a **bot registry**: `{ bot_token -> { category, project } }` — one entry per automation that has a bot
configured. For **each** registered bot it runs an independent `getUpdates` long-poll, and per incoming message:

1. Poll the automation's **own** token (distinct from every other bot, so no two consumers ever contend — the root of
   the outage cannot recur).
2. **Forward the message as-is** to that automation's run route — `POST /api/projects/<cat>/<slug>/run` with
   `{ input }` (the route is `start(runProject, [input])`; the substrate identity passes the auth gate exactly as the
   cron http-action already does). **No `project_hooks` lookup, no phrase matching, no classification here** — the bot
   identity already selected the automation; the listener is a dumb, deterministic pipe.
3. Per-bot **inert-until-configured**: a bot with no token is simply not in the registry, so that automation receives
   nothing (no crash) — mirrors the graph's "inert when keys are absent".

**Self-sufficiency:** the listener is a plain substrate service; a project with **only** a coding agent and **no** Hermes
still receives and runs its automations. A built automation **stops self-polling** its bot (no `getUpdates` job in
`cron.json`) and **receives** from the listener; only time-based work (e.g. reminder delivery) keeps its own cron tick.

### 3.1 Action routing INSIDE one automation (replaces hooks)

Because a bot serves exactly one automation, there is nothing to route across automations. What remains is: *which of THIS
automation's actions does the message mean?* The automation's workflow answers with a `classify-message` node
(per-project model), never a shared phrase registry:

- The classifier maps the message to one of the automation's declared actions (e.g. `save`, `remind`, `recall`,
  `parse-doc`) or to **`unclear`**.
- **Clear** → the automation executes that action automatically.
- **Unclear** → the bot replies with **inline buttons** (one per action) plus a final **"I sent this by mistake"** button
  that means *ignore*. The user's tap is a deterministic choice; the pending message is then routed to the chosen action.
- Governing rule for the chat: in an automation's bot there cannot be an unrelated message — everything the user sends is
  either one of the automation's actions or a mistake. The classifier + button fallback covers exactly those two cases.

This keeps the top level deterministic (bot → automation) and makes the only in-channel LLM step **fail safe** (ambiguity
degrades to an explicit human choice, never a silent wrong write).

---

## 4. Connecting an automation's bot (owner flow)

Opening an automation prompts the owner (a modal) to connect **that automation's** bot: it asks for the bot token,
suggests a recommended bot name, links **@BotFather**, notes the name must end in `_bot`, and describes the connection
briefly. On save the token is written to the slot as the automation's own env key (`<PROJECT>_BOT_TOKEN`) and registered
with the listener. A **"Test bot"** button then sends a capability-description message to the owner (owner chat learned on
the first `/start`, like the Hermes bot's owner-claim). Since automations will be many, this modal is the standard,
repeatable connect surface — one bot, one automation, every time.

---

## 5. Provenance — stamp the answer from the trusted layer, never the model

Every reply the user sees is **stamped by the trusted routing layer** — the bot / dispatcher that actually handled the
message — as a machine-set fact (which bot = which automation), **never** written by the model into its own text.

**Why this rule is hard, not cosmetic.** A label a model writes about itself is a **claim, not a proof**, and a model can
lie — evidenced directly: the brain told the user it had scheduled "96 runs over 24h" while it had stored a single
one-shot job. A self-authored prefix would be the same polite fiction in a validator's costume — **worse than nothing**,
because it manufactures false confidence. Only a stamp applied by the layer that *actually routed* the message reflects
real provenance. With one bot per automation the stamp is trivial and unfalsifiable: the receiving bot **is** the
provenance.

---

## 6. Hermes, narrowed — runtime brain, not builder

Hermes is scoped **down** to what it is genuinely good at and cheap at:

- **Keeps:** free-form chat, **one-off / rare** actions via its **native** capabilities (web_search / browser / image /
  memory / cron for its own one-offs), and the always-on runtime-brain role.
- **Knows (knowledge, not a skill).** Hermes's instruction (SOUL) holds Fractera's automation model so it does not
  improvise durable tasks natively: a request that is (or should be) a recurring / long-term pipeline is a **Fractera
  automation** — Hermes does **not** build it; it points the owner at the coding agents (§7), and at most forms
  Development Steps and delegates or asks the owner to activate an agent. Only genuinely one-off tasks stay native to
  Hermes. (The step-190 recurrence criterion, as Hermes's self-knowledge of its place.)
- **Loses:** **building.** Hermes does not write code, does not author real content, and does not run frozen-template
  assembly — building goes to a coding-agent channel. Inserting a weak orchestrator in front of a strong builder only
  adds a lossy layer (it loses and distorts intent — evidenced all day); routing build requests **directly** to a
  coding-agent channel is more predictable.
- **Custom skills / MCP → coding agents ONLY.** Capabilities *we* build ship to the coding agents, **not** copied into
  Hermes. Hermes retains only its **native** arsenal (Hermes = native; our custom = coding agents), which also **reduces**
  the self-sufficiency duplication burden without weakening it (each capability still ships to every *coding* agent).

---

## 7. Consistency with the existing routing forks

This standard sits **above** the existing forks and makes their branches land in deterministic channels:

- **The request-routing fork (step 190)** — one-off vs durable-automation vs pages — is unchanged as a decision; it now
  runs **inside** the relevant channel: a **one-off** is what the Hermes channel is for; **building a durable automation /
  a page** is what a coding-agent channel is for.
- **The "single entry point for all voice automations" (step 188, layer A)** is realized **per automation**: each
  automation's own bot is that automation's single entry point (there is no cross-automation entry point anymore).
- **The task-scenario router (`task-scenario-router.md`)** — FROZEN-ASSEMBLY vs REAL-DEVELOPMENT — is a fork **within a
  coding-agent build channel**; the channel already fixes the *actor*.

The **recurrence criterion** (step 190: does it repeat regularly?) still decides one-off vs durable; channel routing does
not replace that judgment — it removes the unreliable *top-level* classifier and gives each outcome a deterministic home.

---

## 8. Hooks are removed (what changed from the per-role draft)

The earlier draft used ONE shared automations bot (`@fractera_auto`) and a **global `project_hooks` phrase registry** to
route a message to one of many automations. That is gone:

- **Removed:** the `project_hooks` table, `/api/project-hooks`, `lib/hooks/*` (`normalizePhrase`, the default-phrase
  catalog), the Hooks panel, the `manage-automation-hooks` skill, and the listener's phrase lookup. The reason hooks
  existed — routing across automations on one bot — no longer exists, because each automation has its own bot.
- **Replaced by:** bot identity (top-level routing) + per-automation `classify-message` with a button fallback
  (in-automation action routing, §3.1).

---

## 9. Invariants (do not violate)

- **Route by channel, not by an LLM classifier.** The bot a message arrives on selects the handler; there is no
  top-level intent-classification step and **no cross-automation phrase registry**.
- **One bot per handler; one bot per automation.** N automations ⇒ N bots. Two consumers must never poll the same bot
  (the outage). Every bot is distinct from `@fractera_bot`.
- **The listener is a substrate multi-bot pipe** (sibling of `fractera-cron`), zero Hermes dependency, a per-bot registry
  `{ token -> { category, project } }`; it forwards each message to the automation's `/run` with `{ input }` — **no
  `project_hooks`, no matching**. Per-bot inert when a token is absent.
- **In-automation action routing = `classify-message` + button fallback**, never a shared phrase registry; ambiguity
  degrades to explicit user choice (including "sent by mistake" → ignore).
- **A built automation receives, it does not self-poll.** Reception moves to the listener; only time-based work keeps its
  own cron.
- **Provenance is stamped by the trusted layer, never by the model** (a model misreports); the receiving bot is the
  provenance.
- **Hermes = native only, and does not build.** Our custom skills/MCP ship to coding agents only; building routes to a
  coding-agent channel; Hermes at most forms Development Steps and delegates.
- **One global OpenAI key; the MODEL is chosen per automation** (`<PROJECT>_MODEL`) — different automations need
  different capability/price points (e.g. vision for document parsing).
- **Self-sufficiency holds.** Every capability still fans to every coding agent; a Hermes-less project still receives and
  runs its automations via the listener.
- **Frozen deploy infra untouched.** The listener is a substrate process; bot tokens are additive slot env keys (no
  change to bootstrap.sh / deploy.ts / the MCP isolation contract).

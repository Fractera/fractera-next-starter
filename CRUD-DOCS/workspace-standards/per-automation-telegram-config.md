# Per-automation Telegram + model config (step 205)

> Self-sufficient contract for how a durable automation declares **its own** Telegram bot and **its own** OpenAI model.
> Implemented by: the connect modal (205.7, writes the values), the multi-bot listener (205.8, reads the registry), the
> per-project model UI (205.16), and the workflow bodies (which read the env at runtime). One global OpenAI **key**, one
> **model + bot per automation** — see `agent-channel-routing.md`.

## 1. Env keys (slot `app/.env.local`)

For an automation with category `<cat>` and slug `<slug>`, the env-key stem is the slug uppercased with every non
`[A-Za-z0-9]` replaced by `_` (e.g. `telegram-notes` → `TELEGRAM_NOTES`):

| Key | Meaning | Written by | Read by |
|---|---|---|---|
| `<STEM>_BOT_TOKEN` | this automation's OWN Telegram bot token (distinct from every other bot) | connect modal (205.7) via the sanctioned slot-env setter | the workflow (to reply) + the listener registry |
| `<STEM>_MODEL` | this automation's OpenAI model id (e.g. `gpt-4o-mini`, or a vision-capable model when the automation parses documents) | per-project model UI (205.16) | the workflow (`classify-message`, summaries, vision) |
| `OPENAI_API_KEY` | ONE global key for Hermes + memory + every automation (step 199) | Admin → Hermes settings (global) | everything |

Rules:
- The bot token is **per automation** — never shared; sharing re-creates the two-consumer `getUpdates` outage.
- The model is **per automation** — different automations need different capability/price points; document parsing
  requires a **vision-capable** model, cheap text automations do not.
- `telegram-notes` legacy fallbacks stay valid: the workflow already reads `TELEGRAM_BOT_TOKEN` / `TELEGRAM_NOTES_MODEL`;
  the new `<STEM>_BOT_TOKEN` / `<STEM>_MODEL` are the general form the starter template (205.21) emits for every new
  automation.

## 2. Listener bot registry

The substrate listener `fractera-automations` does not guess which bot belongs to which automation — it reads an explicit
registry the connect flow maintains:

- **File:** `services/automations-listener/registry.json` (substrate, survives slot swap), an array of entries:
  ```json
  [ { "category": "personal", "project": "telegram-notes", "token": "<bot token>" } ]
  ```
- **Written by** the connect modal's config route (205.7) when a bot is connected/replaced (upsert by `{category,project}`;
  remove on disconnect).
- **Read by** the listener (205.8): one independent `getUpdates` long-poll per entry; each message is forwarded to
  `POST /api/projects/<category>/<project>/run` with `{ input }`. No `project_hooks`, no phrase matching.
- **Inert-until-configured:** an automation with no entry simply receives nothing; an empty/missing registry = the
  listener idles (mirrors the old single-token inert behaviour).

## 3. Invariants

- One bot token + one model per automation; one global OpenAI key.
- The registry is the single source of truth for token→automation; the listener never reads slot env for tokens (the
  registry is substrate-scoped and swap-safe).
- Frozen deploy infra untouched: registry + env keys are additive.

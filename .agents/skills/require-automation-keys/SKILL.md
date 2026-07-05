---
name: require-automation-keys
description: >
  Make an automation ASK for its missing integration keys instead of silently failing.
  Use whenever a Projects-layer automation needs an external credential (a bot token, an
  API key, a webhook secret) that cannot ship in code because the project template is
  reused by every user. Declare the key on the project's integrations; the project-page
  primitive's NATIVE missing-keys modal then prompts the signed-in architect/manager for
  any absent key on open and saves it through the slot single-key env setter
  (/api/project-config/env) — a runtime write + fractera-app restart, no rebuild.
  Self-sufficient: works for a lone agent, no Hermes required.
---

# require-automation-keys

The culture: **an automation never silently lacks its keys — it asks.** A personal token
or API key must not live in the project template (every user reuses the same template), so
the project declares WHICH keys it needs and the running app collects them from the owner.

This is the native "missing keys" behavior of the **project-page** frozen primitive (step
186.3). You do not build the modal — you DECLARE the keys, and it appears.

Full reference: `CRUD-DOCS/workspace-standards/required-keys-modal.md`.

## The one rule

**Declare every external credential a project needs as an `integrations` entry with its
`envKeys`. Never hard-code the value, never bake it at build time (it is per-user runtime
config). The primitive's always-mounted modal checks those keys on open and prompts for any
that are absent; the value is written to the slot's own `app/.env.local` and applied by a
`fractera-app` restart.**

## How to do it

1. **Declare the integration when composing / decomposing the project.** The keys come from
   the project's `integrations` — a JSON array `[{ name, envKeys[] }]`:
   - compose-frozen-template: `--integrations '[{"name":"Telegram","envKeys":["TELEGRAM_BOT_TOKEN"]}]'`
   - orchestrate-project-by-steps: the same shape in the plan / README `fractera:meta` block.
   The composer turns it into `_data/required-keys.ts` (`REQUIRED_ENV_KEYS`) automatically —
   nothing to hand-write in the page.
2. **That is all for the UI.** `missing-keys-modal.client.tsx` is already mounted in the
   project page. On mount it calls `GET /api/project-config/env?keys=…` (present flags only,
   never values); any absent key surfaces a Dialog with one input each. Save POSTs each key
   to `POST /api/project-config/env` (single-key setter, step 186.4). Zero declared
   integrations → the modal renders nothing.
3. **Runtime, not build-time.** The setter writes ONE key into `app/.env.local`
   (read-modify-write, others untouched) and triggers a detached `pm2 restart fractera-app`
   (~3-5s). This is a RUNTIME variable read fresh by the server — a restart suffices. If your
   value is instead a `NEXT_PUBLIC_*` / build-time key, it is the WRONG mechanism: use
   `persist-env-var-with-rebuild` (rebuild) — the setter refuses `NEXT_PUBLIC_*`.

## Is this key runtime or build-time? (decide first)

- **Runtime** (this skill): a server-read secret — bot token, API key, webhook secret,
  service URL. A restart applies it. Declared as a project integration → the modal collects it.
- **Build-time** (NOT this skill): any `NEXT_PUBLIC_*` inlined into the browser bundle, or a
  value read while pages are generated → use `persist-env-var-with-rebuild`. The slot setter
  deliberately rejects `NEXT_PUBLIC_*` and platform-locked keys.

## Do NOT

- Put a personal/API token in the template, a committed file, or the README body — declare it
  as an integration key so each user supplies their own at runtime.
- Route a runtime secret through a rebuild (`persist-env-var-with-rebuild`) — slower and
  unnecessary; a restart applies it.
- Build a bespoke key-entry form — the primitive's modal is the ONE interface; declaring the
  integration is the whole job.

## After

State plainly what the automation now requires, e.g.:
> The Telegram automation declares `TELEGRAM_BOT_TOKEN`. Open the project page: it prompts for
> the token, saves it to the app, and restarts the app to apply it — no rebuild.

# Required-keys modal — the missing-keys culture for automations

**Standard (step 186.3).** A Projects-layer automation must never silently lack the external
credentials it needs. Personal tokens and API keys cannot ship in the project template — the
template is reused by every user — so the project **declares** which keys it needs and the
running app **asks the owner** for any that are absent. This is a native, reusable part of the
`project-page` frozen primitive; agents declare keys, they do not build the UI.

Agent-facing skill: `require-automation-keys`.

## The pieces

1. **Declaration — `integrations`.** A project declares its external integrations as a JSON
   array `[{ name, envKeys[] }]` (e.g. `[{"name":"Telegram","envKeys":["TELEGRAM_BOT_TOKEN"]}]`).
   - `compose-frozen-template --integrations '…'`
   - `orchestrate-project-by-steps` (the same shape in the plan; recorded in the README
     `fractera:meta` block).
2. **Generated data — `_data/required-keys.ts`.** The composer substitutes the declared
   integrations into `_data/required-keys.ts.tpl` at compose time, exposing
   `REQUIRED_ENV_KEYS` (the flat, de-duplicated list) and `PROJECT_INTEGRATIONS` (for naming
   the service in the prompt). No integrations → an empty array.
3. **The modal — `_components/missing-keys-modal.client.tsx`.** Always mounted in the project
   page's `_components/index.tsx`. On mount it calls `GET /api/project-config/env?keys=…`
   (present flags only, never values). Any absent key opens a shadcn `Dialog` with one
   password input per key. **Save** POSTs each supplied key to `POST /api/project-config/env`.
   The user may dismiss (Esc / X / "Later") — nothing runs, and the modal re-checks and
   re-appears on the next open (remount). Empty `REQUIRED_ENV_KEYS` → renders nothing.
4. **The setter — `app/api/project-config/env` (step 186.4).** A slot-scoped **single-key**
   env setter, distinct from the admin whole-file setter. `POST {key,value}` does a
   read-modify-write of the slot's own `app/.env.local` (one key; every other line untouched)
   then a detached `pm2 restart fractera-app` (runtime var → restart, ~3-5s, NOT a rebuild).
   `GET ?keys=A,B` → `{ present: { A: boolean, B: boolean } }`. Role-gated
   (architect/manager/agent); rejects `NEXT_PUBLIC_*` and platform-locked keys.

## Runtime vs build-time — pick the right mechanism

| | Runtime secret (this standard) | Build-time value |
|---|---|---|
| Examples | bot token, API key, webhook secret, service URL | any `NEXT_PUBLIC_*`, language set, Stripe publishable key |
| Applied by | `pm2 restart fractera-app` (~3-5s) | a full rebuild |
| Path | declare integration → missing-keys modal → single-key setter | `persist-env-var-with-rebuild` skill |

The single-key setter deliberately **refuses** `NEXT_PUBLIC_*` and platform-locked keys
(`AUTH_SERVICE_URL`, `DEPLOY_SECRET`, `DATA_TOKEN`, `DATABASE_URL`, …) — those are not project
keys and/or need a rebuild.

## Do / Do not

- **Do** declare each external credential as an integration key so each user supplies their own.
- **Do not** commit a token, put it in the README body, or bake it at build time.
- **Do not** build a bespoke key-entry form — the primitive's modal is the one interface.
- **Do not** route a runtime secret through a rebuild — a restart applies it.

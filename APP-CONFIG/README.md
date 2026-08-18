# APP-CONFIG — what this application IS

Holds `app-config.json`: the app's identity and everything about how it presents itself —
name, description, logo, images, icons and PWA, author, SEO, OpenGraph, analytics,
structured data, storefront currency, and the `nav` branch that defines the top menu and
the footer links.

## How it works

**The control panel (`:3002`) writes it. This application (`:3000`) reads it.** The panel has
no config storage of its own — it writes straight into this file by absolute path. There is
exactly one copy on the server, so there is exactly one answer to "what is this app called".

Reading happens **per request** (`config/app-config.ts`, deep-merged over the committed
defaults in `config/app-config.defaults.ts`). That is why a change saved in the panel shows up
on the next page load — **no rebuild, no redeploy**. Pages stay static: reading a file does not
make a route dynamic; `force-dynamic` would, and it is not used here.

**A missing file is normal**, not a fault: it means the owner has not saved settings yet, and
the app serves the committed defaults. A partial file is normal too — only the keys the owner
changed need to be present.

## Schema and defaults

Two **generated** files sit beside `app-config.json`, and neither is written by hand:

- **`schema.json`** — the shape, from `config/app-config.defaults.ts` (the type) and
  `config/app-config.schema.ts` (its zod description).
- **`defaults.json`** — what the application actually serves while this folder's `app-config.json`
  stays empty, from `DEFAULT_APP_CONFIG`.

Both come from `npm run build:config-schemas`; `npm run check:config-schemas` runs in `prebuild`
and fails the build when either has drifted from the type. A generated file that stops matching
the type is worse than none, because it is read and believed.

🔒 **Why the defaults are copied here as DATA rather than left in `config/` alone.** A person
opening this folder sees `{}` and concludes "empty, this cannot be working" — that exact reading
cost a session on 2026-08-18. The truth is that the JSON holds only the owner's decisions and the
defaults answer for everything else, so the defaults belong where they are looked for. They arrive
as JSON and not as a `.ts` file on purpose: nothing in a data folder may require a compiler, or
the folder would hold two kinds of file with different laws — one applying instantly, the other
only after a rebuild.

The reader validates against it and **heals a wrong-typed value with that value's default —
per key**, never by dropping the file and never by rewriting it. An unknown key passes through
untouched: the panel may be newer than this slot, and discarding its field would throw away the
owner's decision.

## Skill

**`use-app-config`** — what each setting actually does to the project. This README stays short on
purpose: the skill carries the detail and arrives when the work calls for it.

## Rules

- **Never edit this file by hand to change a setting.** Your edit is not what the app reads
  long-term: the panel rewrites the file on the next save. Change it in the panel.
- **Never hardcode these values in components.** Editing code for the site name is wrong
  twice — the app reads the file, and the file will overwrite your value.
- **Read it with `npm run read:app-config`, not by opening the JSON.** With up to 82 languages
  enabled, the raw file is mostly the `i18n` branch — the same five fields translated over and
  over — and it would eat the context window. The command prints the English slice.
- **No secrets here.** API keys, tokens and passwords live in `.env.local`, which is not in
  git. This file is tracked, so anything written here reaches the repository.

## Related

`../PLATFORM-CONFIG/` — feature switches, the neighbouring file under the same
panel-writes / app-reads contract. Language set — `NEXT_PUBLIC_SUPPORTED_LANGUAGES` in
`.env.local`, its single source of truth (it is baked into the build).

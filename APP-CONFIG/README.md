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

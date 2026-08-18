# PLATFORM-CONFIG — which capabilities are switched ON

Holds `platform-config.json`: the owner's feature switches. Ten booleans under `features` —
`topMenu`, `footerPages`, `cookieBanner`, `offlineCache`, `auth`, `breadcrumbs`, `faq`,
`themeToggle`, `widthToggle`, `languageSwitcher` — plus the parallel-routing mode.

## How it works

**The control panel (`:3002`) writes it. This application (`:3000`) reads it** through
`featureOn()` / `featureDecided()` in `config/platform-config.ts`. Same contract as the
neighbouring `APP-CONFIG`: one file, one writer, one reader, read per request, applied without
a rebuild.

**A missing file is normal** — it means the owner has not touched a switch yet, and the code
defaults apply (`FEATURE_DEFAULTS`). An unreadable file behaves the same way: serving the app
with defaults is honester than failing a page over one broken bracket in a settings file.

**`features` and `explicit` are different questions**, and confusing them breaks working
servers. "Off by default" is not "the owner turned it off": the fallback applies only until the
owner has spoken, and stops the moment they touch the switch. Ask `featureDecided()` when the
difference matters.

## Schema and defaults

Two **generated** files beside `platform-config.json`, neither written by hand: **`schema.json`**
(the shape) and **`defaults.json`** (`FEATURE_DEFAULTS` — the answer while a switch is untouched).
Both from `npm run build:config-schemas`, guarded by `npm run check:config-schemas` in `prebuild`.

The defaults are copied here as data because this folder is where they are looked for; they stay
JSON rather than `.ts` because nothing in a data folder may require a compiler. The single
definition remains `config/platform-config.defaults.ts`.

🔒 **It describes the FILE, not the reader's answer**, and this is the one config where the two
differ. On disk lie the owner's decisions — the switches they touched, the routing mode, the
document set for the agent. `featureOn()` returns the full picture: every capability's value plus
a separate answer to "did the owner decide this". Only what is really on disk can be validated on
read.

A switch of the wrong type is healed exactly like a missing one — with its default — and the
owner stays "not decided", which is the truth about them.

## Skill

**`use-platform-config`** — what each switch turns on, and what disappears from the site when it
is off. The detail lives there, not here.

## Rules

- **Never import this from a client component** — it reads from disk. Resolve values in a
  server component and pass them to islands as props.
- **Never read the path directly.** Go through `featureOn()`, so the defaults, the caching and
  the missing-file behaviour stay in one place.
- **The language set does NOT live here.** It is `NEXT_PUBLIC_SUPPORTED_LANGUAGES` in
  `.env.local`, and that is its only home: the set is baked into the build, so it must be
  stored where the build reads it. A `languages` mirror used to sit in this file and was
  removed on 2026-08-15 — it was written by the panel and read by nobody, which is exactly how
  two sources of truth start.
- **No secrets here.** Ten booleans, nothing else. This file is tracked by git.

## Related

`../APP-CONFIG/` — the app's identity and menu, under the same contract.

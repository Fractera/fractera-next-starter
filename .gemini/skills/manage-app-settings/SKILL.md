---
name: manage-app-settings
description: >
  Read or change the deployed app's settings — brand name, description, URL, support
  email, SEO/OpenGraph, PWA, analytics, structured data — and the app's language set.
  Use when the owner says things like "change my description to 'Рога и копыта'",
  "set the site URL", "turn on the Organization schema", or "add French". Self-sufficient:
  works for ANY single agent via the on-disk config file, with the MCP tools as a
  validated convenience when present. No Hermes required.
---

# manage-app-settings

Change what the deployed app shows about itself. This is the agent-facing side of the
Admin → **App Settings** panel: the same settings, editable by you on the owner's behalf.

This skill is **self-sufficient** (CLAUDE.md rule §0/§4): it works with nothing but the
local filesystem. It does NOT depend on Hermes, on memory, or on any other agent. If you
are the only agent in this project, you can still change every setting.

## Where settings live (read this first — two stores)

| Setting group | Store | Apply | How you change it |
|---|---|---|---|
| Brand/identity, SEO, OpenGraph, PWA, author, analytics, JSON-LD, address | **JSON file** `app/APP-CONFIG/app-config.json` (runtime, deep-merged over code defaults) | **instant** — next page load, NO rebuild | MCP tool, or edit the file directly |
| **Language set** (which languages + default) | **env** `app/.env.local` (`NEXT_PUBLIC_SUPPORTED_LANGUAGES` / `NEXT_PUBLIC_DEFAULT_LOCALE`) | **needs a REBUILD** (build-time, feeds static page generation) | MCP tool, or edit `.env.local` + rebuild |
| **Images** (logo, icon set, OG image, illustrations, author photo) | object storage; the JSON file holds only a URL/id | instant once uploaded | NOT editable as a file — owner uploads in the panel (you may set a URL if you already have one) |

Field catalog (path · role · type) is the source of truth: panel
`bridges/app/_components/coding-workspace/site-settings/fields.ts` and MCP
`bridges/platforms/app-settings-catalog.js` (same list).

## Confirm before writing (mandatory)

Restate the change to the owner and show exactly what will be written (which path, old →
new value). Write only after explicit confirmation. Never change settings silently.

## Primary path — MCP tools (if the app-settings bridge is present)

If this project runs `app-settings-bridge` (:3218, owner tier) — e.g. through Hermes or
registered in your own MCP client — prefer these (they validate against the catalog):

- `owner_app_settings_list_text_fields` — enumerate every text setting with its role,
  current value and whether the owner has filled it.
- `owner_app_settings_list_unfilled_fields` — only the ones still on defaults (to prompt).
- `owner_app_settings_set_text_value` `{ path, value }` — set ONE field, e.g.
  `{ "path": "description", "value": "Рога и копыта" }`. Applies on next load (no rebuild).
- `owner_app_settings_list_languages` — read the language set + default.
- `owner_app_settings_set_languages` `{ languages, defaultLanguage? }` — set the set,
  e.g. `{ "languages": ["en","es","fr"] }`. Returns `rebuild_required: true` — tell the
  owner languages appear only after a rebuild (a few minutes).

## Self-sufficient path — edit the files directly (works for ANY agent, no MCP)

When no MCP bridge is present, you ARE the editor — the stores are plain files.

**Text / branding / SEO / PWA → edit the JSON file** (instant, no rebuild):
1. Read `app/APP-CONFIG/app-config.json` (create it from `{}` if missing — the Shell
   deep-merges over code defaults, so a partial object is valid).
2. Set the dot-path from the catalog. Example — change the description:
   ```json
   { "description": "Рога и копыта" }
   ```
   Nested paths map to nested objects (`seo.titleTemplate` → `{ "seo": { "titleTemplate": "…" } }`).
3. Write the file back (pretty JSON). Keep existing keys — merge, don't overwrite the whole file.
4. The Shell reads it per request → the change shows on the next page load.

**Language set → edit env + rebuild** (build-time):
1. In `app/.env.local`, upsert `NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es,fr` and
   `NEXT_PUBLIC_DEFAULT_LOCALE=en` (keep `en`; use ISO codes). Preserve other lines.
2. Trigger a rebuild (Admin → deploy, or `npm run build` in the Shell) — the new
   languages only appear after the app is rebuilt. Tell the owner it takes a few minutes.

**Images:** tell the owner to upload in Admin → App Settings (it crops + stores the file).
If you already have a hosted image URL, you may set the corresponding `images.*` path in
the JSON file to that URL.

## After changing

Report to the owner, e.g.:
> Set `description` → "Рога и копыта" in App Settings. It shows on the next page load.

For languages, always add: "languages apply after a rebuild (a few minutes)".

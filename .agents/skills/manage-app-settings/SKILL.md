---
name: manage-app-settings
description: >
  Read or change the deployed app's settings — brand name, description, URL, support
  email, SEO/OpenGraph, PWA, analytics, structured data — and the app's language set.
  Use when the owner says things like "change my description to 'Рога и копыта'",
  "set the site URL", "turn on the Organization schema", or "add French". Writes go
  through the validated setter (MCP tool / config API) — never raw JSON. Self-sufficient:
  reads work from the on-disk file alone; writes need the setter, which is registered in
  every agent. No Hermes required.
---

# manage-app-settings

Change what the deployed app shows about itself. This is the agent-facing side of the
Admin → **App Settings** panel: the same settings, editable by you on the owner's behalf.

## The one rule that governs writes

**Read directly. Write only through the validated setter. Never hand-write raw JSON.**

Why: an agent that edits `app-config.json` by hand can emit broken JSON (the Shell then
fails to parse the config), clobber other keys with an eyeballed merge, mis-nest a path,
write a string where a number/flag/choice belongs, or race the panel/another agent with a
non-atomic write. The setter removes every one of those failure modes — it validates each
value against the field catalog, merges safely, and writes atomically. So:

- **Reading** a setting is safe to do straight from the file — reading never corrupts.
- **Writing** a setting goes through the setter, always. The setter is the single write path.

## Where settings live (two stores)

| Setting group | Store | Apply | Setter |
|---|---|---|---|
| Brand/identity, SEO, OpenGraph, PWA, author, analytics, JSON-LD, address | **JSON file** `app/APP-CONFIG/app-config.json` (runtime, deep-merged over code defaults) | **instant** — next page load, NO rebuild | MCP `owner_app_settings_set_text_value`, or the panel route `/api/config/site` |
| **Language set** (which languages + default) | **env** `app/.env.local` (`NEXT_PUBLIC_SUPPORTED_LANGUAGES` / `NEXT_PUBLIC_DEFAULT_LOCALE`) | **needs a REBUILD** (build-time, feeds static page generation) | MCP `owner_app_settings_set_languages`, or `/api/config/languages` + rebuild |
| **Images** (logo, icon set, OG image, illustrations, author photo) | object storage; the JSON file holds only a URL/id | instant once uploaded | NOT a text field — owner uploads in the panel (you may set a URL through the setter if you already have one) |

Field catalog (path · role · type) is the source of truth and what the setter validates
against: panel `bridges/app/_components/coding-workspace/site-settings/fields.ts` and MCP
`bridges/platforms/app-settings-catalog.js` (same list).

## Confirm before writing (mandatory)

Restate the change to the owner and show exactly what will be written (which path, old →
new value). Write only after explicit confirmation. Never change settings silently.

## Reading current settings

Either ask the setter (preferred — gives roles + whether each field is filled) or just read
the file:

- MCP `owner_app_settings_list_text_fields` — every text setting with role, current value,
  is-set flag.
- MCP `owner_app_settings_list_unfilled_fields` — only the ones still on defaults (to prompt).
- MCP `owner_app_settings_list_languages` — the language set + default.
- No MCP present? Read `app/APP-CONFIG/app-config.json` directly — reading is safe.

## Writing — the setter (this is THE write path, for every agent)

The validated setter reaches you as the `app-settings-bridge` MCP server (:3218, owner
tier). It is registered in **every** agent's MCP client (CLAUDE.md rule §4) — not only in
Hermes — so a lone agent (e.g. a single Codex) has it too. This is what makes the skill
self-sufficient: the safe write path travels with the agent.

- `owner_app_settings_set_text_value` `{ path, value }` — set ONE field, e.g.
  `{ "path": "description", "value": "Рога и копыта" }`. Validated against the catalog,
  atomic, applies on next load (no rebuild).
- `owner_app_settings_set_languages` `{ languages, defaultLanguage? }` — set the language
  set, e.g. `{ "languages": ["en","es","fr"] }`. `en` is always kept as the fallback.
  Returns `rebuild_required: true` — tell the owner languages appear only after a rebuild
  (a few minutes).

If the bridge is not reachable but the Shell is running, the panel's HTTP routes are the
same validated setter: `POST /api/config/site` (text) and `POST /api/config/languages`
(env + rebuild trigger). Prefer these over touching files.

## Last resort only — raw file edit (dangerous, when NO setter exists)

Use this **only** if there is genuinely no setter available: no `app-settings-bridge` in
your MCP client AND the Shell's config API is not running. It is the worst write path
(unvalidated, easy to corrupt) — fall back to it knowingly, and mitigate every risk:

**Text / branding / SEO / PWA → `app/APP-CONFIG/app-config.json`:**
1. Read the file first (create from `{}` if missing — the Shell deep-merges over code
   defaults, so a partial object is valid). **Merge — never overwrite the whole file.**
2. Set only the dot-path from the catalog, matching its declared type exactly. Nested paths
   map to nested objects (`seo.titleTemplate` → `{ "seo": { "titleTemplate": "…" } }`).
3. Validate the result is well-formed JSON before saving. Write atomically (write a temp
   file, then rename over the target) so a crash can't leave a half-written config.
4. The Shell reads it per request → the change shows on the next page load.

**Language set → `app/.env.local` + rebuild:**
1. Upsert `NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es,fr` and `NEXT_PUBLIC_DEFAULT_LOCALE=en`
   (keep `en`; ISO codes). Preserve all other lines.
2. Trigger a rebuild — the new languages only appear after the app is rebuilt. Tell the
   owner it takes a few minutes.

**Images:** tell the owner to upload in Admin → App Settings (it crops + stores the file).
If you already have a hosted image URL, set the `images.*` path through the setter.

## After changing

Report to the owner, e.g.:
> Set `description` → "Рога и копыта" in App Settings. It shows on the next page load.

For languages, always add: "languages apply after a rebuild (a few minutes)".

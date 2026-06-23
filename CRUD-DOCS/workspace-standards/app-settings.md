# App Settings — what the app says about itself, and how an AI agent changes it

> Knowledge-base document (ingested into Memory / LightRAG). Read this when the owner asks
> to change anything about the app's identity, SEO, appearance, or languages — e.g.
> "change my description to 'Рога и копыта'", "set the site URL", "add French".
> Companion skill: `manage-app-settings` (in every agent). Panel: Admin → **App Settings**.

## What "App Settings" is

The deployed app carries a set of **owner-editable settings** that brand it and control
how it appears to visitors, search engines, social shares and PWA installs. The owner can
edit them by hand in Admin → App Settings, **or just ask an AI agent** to change them —
that is the primary path. Any agent (Claude Code, Codex, Gemini CLI, Qwen, Kimi, Hermes)
can read and change every setting.

## Where settings are stored (two stores — this matters)

1. **Runtime config file** — `app/APP-CONFIG/app-config.json`.
   Holds brand/identity, SEO, OpenGraph, PWA, author, social, analytics, JSON-LD, and
   local-business address. The Shell reads it on every request and deep-merges it over the
   code defaults, so a partial object is always valid. **Changes apply on the next page
   load — no rebuild.** This is the right substrate for AI: it is a plain, transparent,
   diffable JSON file an agent can read and write directly.

2. **Build-time env** — `app/.env.local`
   (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`, `NEXT_PUBLIC_DEFAULT_LOCALE`).
   Holds the **language set** only. Languages are build-time because they feed static page
   generation (`generateStaticParams` for the `[lang]` routes). **Changing them requires a
   rebuild** to take effect (a few minutes). `en` is always kept as the fallback.

3. **Object storage** — images (logo, icon set, OG/social image, illustrations, author
   photo). The JSON file holds only a URL/id; the binary lives in storage. Images are
   uploaded through the panel (it crops + stores); an agent can set an `images.*` path to a
   URL it already has, but cannot upload a file.

**Why not a database / why not env-for-everything:** the config is small, single-owner and
low-frequency. A database would make it opaque to agents (needs a query layer) for no
benefit; flat env vars cannot hold nested structure and are build-time (the language pain).
The JSON file is the most transparent and agent-native option, so it is the primary store.

## How an agent changes a setting

**Preferred — MCP tools** (when `app-settings-bridge` :3218 is reachable):
- `owner_app_settings_list_text_fields` — list every setting with path, role, current
  value, and whether it is still the default.
- `owner_app_settings_set_text_value { path, value }` — set one field (validated).
- `owner_app_settings_list_languages` / `owner_app_settings_set_languages { languages }`.

**Always available — edit the files directly** (works for any agent, no MCP):
- Text/SEO/PWA → edit `app/APP-CONFIG/app-config.json` at the dot-path (merge, don't clobber).
- Languages → upsert the two `NEXT_PUBLIC_*` keys in `app/.env.local`, then rebuild.

Always confirm the change with the owner first (show old → new), then write.

## The settings catalog (dot-path · what it controls)

**Brand & identity:** `name` (page title / OG / JSON-LD — the most important field) ·
`short_name` (PWA label) · `description` (meta description / OG / the search snippet) ·
`url` (canonical site URL) · `mailSupport` (public support email) · `chatBrand` (chat
assistant name).

**SEO:** `seo.indexing` (allow/disallow) · `seo.titleTemplate` (`%s | Brand`) ·
`seo.robotsIndex` · `seo.robotsFollow` · `seo.keywords` · `seo.canonicalBase` ·
`seo.sitemapUrl` · `seo.googleVerification` · `seo.yandexVerification`.

**OpenGraph:** `og.type` · `og.siteName` · `og.locale` · `og.imageWidth` · `og.imageHeight`.

**PWA & theme:** `pwa.themeColor` · `pwa.backgroundColor` · `pwa.display` ·
`pwa.orientation` · `pwa.startUrl` · `pwa.scope` · `themeColors.light` · `themeColors.dark`.

**Author:** `author.name` · `author.email` · `author.url` · `author.jobTitle` ·
`author.bio` · `author.twitter` · `author.linkedin` · `author.facebook`.

**Social (Organization sameAs):** `seo.social.twitter` · `seo.social.github` ·
`seo.social.linkedin` · `seo.social.facebook`.

**Analytics:** `analytics.enabled` · `analytics.googleAnalyticsId`.

**Structured data (JSON-LD):** `jsonLd.website` · `jsonLd.organization` ·
`jsonLd.localBusiness`.

**Local business / address** (used when `jsonLd.localBusiness` is on): `geo.address` ·
`geo.city` · `geo.country` · `geo.postalCode` · `geo.phone` · `geo.latitude` ·
`geo.longitude` · `geo.hours`.

**Images** (URL/id in the file, binary in storage; upload via panel): `logo` · `iconSet` ·
`images.ogImage` · `images.homePage-light/dark` · `images.loading-light/dark` ·
`images.notFound-light/dark` · `images.error500-light/dark` · `images.chatbot-light/dark` ·
`author.image`.

**Languages** (build-time env, rebuild to apply): the supported set +
default locale.

## Worked scenarios

- **"Change my description to 'Рога и копыта'"** → set `description` (file) → applies on
  next load. No rebuild.
- **"Use my domain example.com"** → set `url` and usually `seo.canonicalBase` (file).
- **"Turn on the Organization schema"** → set `jsonLd.organization = true` (file).
- **"Add French"** → set languages to include `fr` (env) → tell the owner it appears after
  a rebuild (a few minutes).
- **"Change the logo"** → tell the owner to upload it in Admin → App Settings (or set a
  hosted URL on the matching `images.*` / `logo` path if one exists).

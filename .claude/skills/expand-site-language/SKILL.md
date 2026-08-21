---
name: expand-site-language
description: >
  Add a NEW language to an EXISTING site across ALL its content, and translate the pages later
  without blocking. Use when the owner says "add Armenian / Spanish / French to the whole site",
  "make the site multilingual", "translate the whole site into X", "scale this to more languages",
  "add a new language to all pages/sections", or "add a locale". This is the ONLY correct way to
  add a language to existing content. Do NOT improvise it by hand and do NOT re-compose a group —
  neither adds a per-page locale to existing pages, and re-composing overwrites what is there. Two
  scripts in this skill's own folder do the work: fan-out-site-language.mjs (fans the language out,
  seeded with the default language so the site is valid instantly, no translation API) and
  translate-content-page.mjs (the non-blocking runner — you translate the strings later). Self-
  sufficient: plain Node, no external service, no other agent.
version: 1.0.0
metadata:
---

# expand-site-language

> A hint from experience, not a rulebook. If you know a better way for the case in front of you,
> take it and say so — this file exists to save you a defect somebody already paid for, not to replace
> your judgement.

The ONE way to take a site that already has content in one or two languages and **safely scale it
to another language**. Deterministic file operations, **NO code generation, NO external translation
API** (you are the translator — subscription rule). Self-sufficient: any single agent can do it.

## 🛑 Why a dedicated capability (do not improvise)

Adding a language to an **existing** site means creating a `_data/<lang>.ts` for **every** group and
**every** post, patching each `index.ts` + `group.ts`, and protecting SEO. **No other tool does this:**

- **Creating a page by hand** — a new page is a new page; it does nothing for the dozens that already
  exist, and each of them needs its own `_data/<lang>.ts`.
- **Adding the language to the menu manifest only** — the language then shows in the switcher while the
  pages behind it do not exist. A visible broken language is worse than an absent one.
- **Re-composing a group** — it **overwrites** existing content. Never use it to add a language.

If you are tempted to reach for one of those to add a language: **stop and use this skill instead.**

## The model

- Languages are **build-time** (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`). A language must be in the set
  **before** you fan it out — add it via **manage-app-settings** first, then rebuild.
- Each post = `_data/{meta, en(base), <lang>(override), index}`. Each group = `_data/{en, <lang>, index,
  group.ts}`. The fan-out writes the `<lang>` files and patches the indexes — by construction.
- **Seed = the DEFAULT language's content** (e.g. default `es` → the new language starts as a copy of
  Spanish). The site is **valid the instant the build finishes** — no broken pages, no machine
  translation. Every language-dependent link is rewritten to the new language.
- **🔒 Doorway guard (SEO, critical).** A seed still shows the default language's text, so each seed is
  marked `needsTranslation` and the engine serves it as **`robots: noindex`** — Google never indexes a
  cross-language duplicate. `canonical` + `hreflang` stay correct automatically (derived from the
  language set). When a page is translated, the marker clears and it becomes indexable on the next Deploy.
- **Non-blocking.** The fan-out returns the pages that need translating in `pagesNeedingTranslation`;
  **name them to the owner so a step per language can be opened in the panel**, listing those pages in
  its plan. Translation happens later, in that step, possibly with a different model — the main work is
  never blocked by translation limits. The scripts write no steps themselves: steps live in the
  product's dossier, and one writer keeps them, not three.

## Flow

1. **Ensure the language is in the set.** Not there yet → add it with **manage-app-settings**
   (the panel's Languages page, or `POST /api/config/languages`) and rebuild. The fan-out refuses a language not in the set.
2. **Fan it out.** `node fan-out-site-language.mjs --out <slot-root> --lang <L>` — `--dry-run` first (restate +
   confirm, §8.2), then for real. **REBUILD** (Deploy in the panel's footer) to publish the new routes
   (seeded, noindex). The menus (header / footer / left / right) update automatically.
3. **Translate later (non-blocking), when you choose.** `node translate-content-page.mjs --out <slot-root> --lang <L> --op next` in a
   loop: it returns the next pending page → you translate the **strings only** (keep the block kinds and
   order, keep the root anchor and `/<lang>/` links) → call again with `{ op:"write", tab, slug,
   translations }`. Repeat until `remaining: 0`. Honor any owner notes on the dev-step (e.g. "focus on
   Spanish law, link real statutes") for regional value.
4. **The runner does NOT deploy.** When translations are written, tell the owner: *press **Deploy** in
   the footer* to publish — the translated pages then flip from noindex to indexable.

## Confirm before mutating (§8.2)

> If I understood correctly: **add language «<lang>»** across <N> groups / <M> pages, seeded with the
> default language «<def>» (noindex until translated), and open one translation step. Shall I proceed?

`--dry-run` → preview → owner yes → the real run.

## If the tool errors (not a refusal)

A **refusal** (`ok:false, refused:true` — language not in the set, structure-parity violation) → fix
and retry. A crash (`MODULE_NOT_FOUND`, an exception) means the script is **broken** — stop, report the
exact error, wait. Never hand-author the locale files as a workaround; a broken script is repaired,
never bypassed.

## How to call

- **The two commands:**
  - `node fan-out-site-language.mjs --out <slot-root> --lang <L> [--dry-run]`
  - `node translate-content-page.mjs --out <slot-root> --lang <L> --op next` → then `--op write --tab <tab> --slug <slug>` with the translated strings
- **Standalone (no panel at hand)** — plain file edits:
  ```bash
  # 1) fan out (default-language seed + noindex + per-language step)
  node .claude/skills/expand-site-language/fan-out-site-language.mjs --out . --lang hy --dry-run
  node .claude/skills/expand-site-language/fan-out-site-language.mjs --out . --lang hy
  # 2) translate, page by page (you supply the translated strings)
  node .claude/skills/expand-site-language/translate-content-page.mjs --out . --lang hy --op next
  node .claude/skills/expand-site-language/translate-content-page.mjs --out . --lang hy --op write \
    --tab news --slug sample-1 --data translations.json
  npx tsc --noEmit   # then REBUILD (Deploy) to publish
  ```

## Self-sufficient

The skill lives in this project (`.claude/skills`) and depends on nothing outside it — a single agent
can extend a site's languages on its own.

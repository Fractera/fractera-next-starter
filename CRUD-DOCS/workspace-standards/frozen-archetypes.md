# Frozen Archetypes — add a whole page group without generating code

> Authoritative "how it actually works" for the frozen-archetype mechanism: how a whole page group
> (a news section, a blog, a documentation section) appears in your slot by **thawing** a frozen
> archetype — pure file copy + token substitution, **zero code generation**. Companion of
> `content-engine.md` (the engine a thawed tab runs on) and `authoring-skills-instructions-mcp.md`
> (how the skill/MCP are shipped to every agent). Russian mirror: `public/docs/frozen-archetypes.md` in FES.

---

## 1. The problem it removes

Adding a content surface (news, blog, docs) is mechanical but large: a router page, a `_lib`, a `_data`,
several posts — ~30 files that must follow the content engine's conventions exactly. Done by hand, every
time, by a coding agent, it is slow, burns tokens, and drifts from the standard whenever a model improvises.

A **frozen archetype** turns that into one call. Think of it as a **project-in-a-box, frozen**: an inert
tree of template files with no fixed records — the specifics (which group, which languages, the label, how
many examples) are **parameters**, not content. You say "I want a news section"; the machine **thaws** the
archetype with `tab=news`, translates the word "News" into your languages, and writes the working files.

> **Simply put:** a frozen archetype is a *cookie cutter* for a page group. Thawing presses the cutter with
> your parameters. No model writes code — it copies files and fills in the blanks. Any model gives the same
> result, in seconds.

---

## 2. Where it lives — the closed store (data service)

Frozen archetypes are kept in the **closed store**, served by the data service:

```
services/data/frozen-archetypes/<id>/
  manifest.json     what this archetype is, what it fits, what it does NOT serve, its parameters
  engine/**         the shared content engine (installed only if your slot lacks it)
  tab/**            the parameterized page group (router + _lib + _data + a post template)
```

The data service exposes it read-only:

```
GET /archetypes        → the catalog (one manifest summary per archetype) — for matching
GET /archetypes/:id    → the full tree { manifest, files } — for thawing
```

Every file in the store carries a `.tpl` suffix so it is inert (no tool compiles it); the emitter strips
`.tpl` on write. The store ships with the substrate, so it is present on every deployment.

---

## 3. The two layers of a thaw (a self-contained project)

A bare starter may not have a content surface at all (the cockpit starter has no `lib/content`). So a frozen
archetype is **self-contained** — it carries everything a page group needs:

```
┌─ engine  (policy: copy-if-absent) ───────────────────────────────────────────┐
│  lib/content/** · components/content-page/** · lib/brand · lib/author         │
│  lib/seo/alternates (origin from BRAND, languages from NEXT_PUBLIC_LANGUAGES)  │
│  lib/content/languages · lib/utils/deep-merge · public/placeholders/*          │
│  → installed ONLY if the slot has no lib/content (idempotent; belongs to no    │
│    single tab, so a second thaw never reinstalls it)                           │
└───────────────────────────────────────────────────────────────────────────────┘
┌─ tab     (policy: write-guarded) ────────────────────────────────────────────┐
│  app/[lang]/<tab>/ router (page.tsx + _components) + _lib/{post,types}         │
│  + _data/{en,<lang>,index} (UI chrome) + N placeholder posts                   │
│  → refuses to overwrite an existing tab folder without force                   │
└───────────────────────────────────────────────────────────────────────────────┘
```

The engine is **distilled 1:1 from the mature FES content engine** (see `content-engine.md`) and **decoupled**
from anything project-specific: no baked sponsorship section, no i18n provider, no hardcoded domain, a generic
author identity (you fill in the real one — never ship someone else's profile links). Brand and domain come
from `NEXT_PUBLIC_*` env, so the same engine is portable to any starter.

---

## 4. What a thaw does (the emitter, step by step)

The emitter (`thaw-frozen-archetype.mjs`) is a generalization of `scaffold-declared-route-into-component-skeleton.mjs`
from one route to a whole collection. Given a local copy of the archetype and your parameters it:

1. **Engine** — if the slot has no `lib/content`, copies `engine/**` into the slot root (else skips).
2. **Tab** — writes `app/[lang]/<tab>/` from `tab/**`, substituting tokens (`{{TAB}}`, `{{TAB_PASCAL}}`,
   `{{FORMAT}}`, …). Refuses to overwrite an existing tab without `--force`.
3. **Languages** — writes the `en` UI base, then one partial `<lang>.ts` per configured language carrying the
   **translated label** (the rest inherits `en` per key via deep-merge). The single word is translated by the
   calling model — that is *translation*, not code generation.
4. **Posts** — for each of `samples`, writes a placeholder post that **inherits the ideal post architecture**
   (createContentPost, SEO/JSON-LD, breadcrumbs, TOC, FAQ, author byline) but uses **Lorem-ipsum body + a
   placeholder image**.
5. **Wiring** — registers the tab in `lib/parser-fs.mjs` `COLLECTIONS` and appends the route to `app/sitemap.ts`
   (both idempotent). You then run `npm run gen:lists` and `npx tsc --noEmit`.

The result is a working, static-first, localized page group you can read with JavaScript off — that you only
have to *fill in* (replace the Lorem copy and the placeholder image).

---

## 5. Two ways you ask for it

**Directive — "make me a news page".** Intent and target are clear. The agent confirms (tab, format,
languages, label translations, sample count), then thaws and reports.

**Conversational — "add news to my site".** The target is ambiguous. The agent first checks whether a suitable
tab exists, asks what you mean by "news" and **where** it should live (which tab slug), then thaws to establish
the tab as a **contract** — from then on, each new post is one folder via `create-multilingual-content-entry`.

Both run the same thaw; the difference is how much is agreed first.

---

## 6. Matching — and refusing honestly

A frozen archetype serves a *shape* of request, not everything. The `manifest.json` says so explicitly:

- **`fits`** — news, blog, documentation, articles, announcements, changelog, guides, knowledge base.
- **`doesNotServe`** — a shopping cart / checkout / payments, a course with graded tests / progress, an
  interactive app screen, forms that persist visitor input.

The skill consults this manifest (via `owner_archetype_list_frozen`) instead of guessing from general
knowledge. If your request maps to `doesNotServe`, the honest answer is: *"this frozen archetype builds static
article collections, not that — it is a different archetype that does not exist yet"* + an offer to author one
(a new step / a `propose-new-agent-skill-or-mcp` draft). **It will not force the wrong archetype and will not
generate a page group from scratch.** This is the content instance of capability-grounded selection at scale.

---

## 7. How to thaw

- **MCP (every agent):** `owner_archetype_thaw_content_group { tab, format, languages, labels, samples }`.
  Always preview first — call with `dry_run: true`, confirm exactly what will be created, then call for real.
- **Standalone (a lone agent, no MCP):** fetch the archetype from the data service and run the local emitter:
  ```bash
  curl -s -H "X-Agent-Identity: <you>" http://localhost:3300/archetypes/content-collection > /tmp/arch.json
  # unpack arch.json's file map into /tmp/content-collection/ , then:
  node .agents/skills/thaw-frozen-archetype/thaw-frozen-archetype.mjs \
    --store /tmp/content-collection --out . \
    --tab news --format news --languages en,ru --label-en News --label-ru Новости --samples 2
  npm run gen:lists && npx tsc --noEmit
  ```

The skill `thaw-frozen-archetype` (canon in `.agents/skills`, copied to `.claude/.gemini/.qwen` and Hermes)
is the operational entry; it is self-sufficient — no Hermes required.

---

## 8. Adding a NEW archetype (growing the catalog)

One archetype cannot serve every shape of site. The catalog grows by **adding more frozen archetypes**, each a
clean "project-in-a-box" for a different shape. To author one:

1. **Pick the shape and prove it fits the engine.** Follow the "thinking template" in `content-engine.md §7`
   (the Shop + Product Card walkthrough): a *list of documents + a document page* surface (a changelog, a
   glossary, a careers board, a storefront listing) is the same engine with a different `_lib` and maybe one new
   block — additive, no central rewrite. A surface that needs a cart/checkout, graded tests, or an interactive
   app screen is **not** this engine — it is a genuinely new archetype (possibly a different engine entirely).
2. **Freeze it.** Build the working tab once, then template it into `services/data/frozen-archetypes/<new-id>/`
   (`engine/` only if it needs engine pieces the content engine lacks; `tab/` with `{{TOKENS}}`; a `manifest.json`
   declaring `fits`/`doesNotServe`/`params`).
3. **Declare honest boundaries.** The new manifest's `doesNotServe` is as important as its `fits` — it is what
   lets the agent refuse the wrong request instead of forcing a bad fit.

The `content-collection` archetype (news/blog/docs) is the first and the reference shape.

---

## 9. Invariants (do not violate)

- Thawing is **file copy + token substitution only** — never LLM code generation.
- The **engine layer is copy-if-absent** (belongs to no tab; a second thaw never reinstalls it).
- The **tab layer is write-guarded** (refuse to overwrite an existing tab without force).
- Thawed pages are **static-first / no-JS / localized** (the engine bakes this — see `content-engine.md`).
- **Match the manifest** (`fits`/`doesNotServe`) — thaw a real fit or **refuse honestly** and offer a new archetype.
- The capability is **self-sufficient** (skill + MCP + emitter shipped to every agent; works with a single agent,
  no Hermes) — see `authoring-skills-instructions-mcp.md`.

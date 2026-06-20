---
name: create-multilingual-content-entry
description: >
  Create a multilingual content document (news, blog, docs, any page copy) the
  scalable way: one folder per document, a full base-language file, partial
  per-language override files, a registry line — and zero language branching in
  page code. Use whenever you add or translate content that must work in more
  than one language. Self-sufficient: pure file edits, no Hermes and no MCP.
---

# create-multilingual-content-entry

Add a piece of multilingual content so it scales to many languages **by construction** —
a new language is a new file, a partial translation is fine, and no page ever says
`if language == X`. The full standard is
`CRUD-DOCS/workspace-standards/multilingual-content.md`; this skill is its operational entry.

This skill is **self-sufficient**: it is plain file editing. It does NOT depend on Hermes,
on memory, or on any other agent. If you are the only agent in the project, you can still
create a correct multilingual document.

## When to use

- You are adding a content item (a news post, a blog post, a doc, a landing section) that
  must exist in more than one language — now or later.
- You are translating an existing item into a new language.
- You catch a `lang === 'xx' ? A : B` ternary in page code and need to move it into the
  i18n shell or a data discriminator.

## The shape — document = folder

```
lib/<domain>/entries/<slug>/
  meta.ts     # non-translatable: slug, date, tags, author, images
  en.ts       # the FULL base body (required): translatable fields + body + FAQ
  <lang>.ts   # a PARTIAL override: only the keys that differ from the base
```

Then add **one line** to `lib/<domain>/registry.ts` (an explicit static import — the bundler
needs a resolvable path, never an `fs` scan). The public API in `lib/<domain>/index.ts`
resolves a language as a **per-key deep-merge** of the base with the override.

## The five rules (do not skip)

1. **`en` is the full base, required.** Every other language is a partial override; any key
   it omits falls back to `en` per key (not the whole object).
2. **Arrays replace wholesale, never merge element-wise.** A partial list translation means
   "translate the whole list or inherit the base one".
3. **No language branching in pages.** A UI label → an i18n key (split a link-in-the-middle
   string into `…Pre`/`…Link`/`…Post`). A different component per language → a discriminator
   field in the data + a component registry, not a ternary.
4. **Dates via `toLocaleDateString(lang, …)`** — pass `lang` straight through; never map
   `'ru' → 'ru-RU'` by hand.
5. **SEO/GEO per language.** Each language gets its own URL + `hreflang`, its own SEO surface
   (title/description/keywords), presented from its own angle (not a word-for-word copy). If
   the project keeps `llms.txt` / `llms-full.txt` / sitemap, update them in the same change.

## Confirm before creating (mandatory)

Before writing files, restate to the architect exactly what you will create: the `<domain>`,
the `<slug>`, the base language, which languages get an override now, and the registry line.
Create only after explicit confirmation. Never silently scaffold a content tree.

## Steps

1. Pick `<domain>` (e.g. `news`, `blog`, `documentation`) and a kebab `<slug>`.
2. Create `entries/<slug>/meta.ts` — non-translatable fields only.
3. Create `entries/<slug>/en.ts` — the complete base body (all translatable fields + body + FAQ).
4. For each language you can translate now, create `entries/<slug>/<lang>.ts` — only the keys
   that differ. Leave the rest; deep-merge fills it from `en`.
5. Add one import + one registry entry in `lib/<domain>/registry.ts`.
6. Verify: type-check passes, and a grep for `=== '<lang>'` in the page layer is clean.
7. If the project has `llms.txt` / `llms-full.txt` / sitemap — add the new item.

## After creating

Report to the architect:
> Created multilingual <domain> entry «<slug>» — full `en` base + <N> language override(s),
> registered in registry.ts. No language branching added; dates/SEO per the standard. Ready
> to add another language later as a single new `<lang>.ts` file.

The document is content, not a feature. Adding the 81st language stays a one-file change —
that is the whole point of the shape.

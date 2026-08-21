# TRANSLATION-DEBT.md — what is still single-language, and why

**Self-evolving, like `ANTI-PATTERNS.md`.** The agent writes here the moment it creates something with
user-visible strings in one language, and strikes the line out when that thing is translated.

**Why this file exists.** During construction strings get rewritten several times, so translating
early is paid for twice and gives nothing — the project's rule is: build in the default language,
translate when the feature is finished. The cost of that rule is that a postponed translation
disappears from view together with the step. A month later nobody can say which routes and components
are still single-language, and the site looks finished in every language while half of it answers in
English.

🔒 **Keep here only what cannot be DERIVED.** `npm run check:i18n` already knows every dictionary and
the enabled set of languages, and the difference between them is the coverage. What it cannot know is
the promise and the decision:

- **the promise** — "this element is reusable, so it owes every language the owner can enable", versus
  "this belongs to one route and ten is the deliberate answer";
- **the decision** — that the owner agreed to defer this one, and until when.

A register kept by hand goes stale before anything else in the repository. Two columns of derived
data would be wrong within a week.

## Format

One line per debt. Address first, so the list reads as an index without opening anything.

```
- `app/[lang]/(publicLayer)/<route>/` — <what is single-language> · owes: <enabled set | 82 | 10> · <why deferred>
```

Strike a line out by deleting it, in the same change that adds the translation.

## Open debts

- `app/[lang]/(protectedLayer)/(admin)/administration/users/_data/ui.i18n.ts` — page chrome (title,
  subtitle, the note about who may open this page) · **owes 82** · the page ships with the product, so
  it must speak any language the owner switches on. Written in `en, ru` while step 531 is open; the
  remaining 80 arrive through `i18n:export` → external model → `i18n:import`.
- `app/[lang]/(protectedLayer)/(admin)/administration/users/_widgets/dynamic/users-table/ui.i18n.ts` —
  the widget's own words (columns, the role editor, the four refusals) · **owes 10** — the page set
  for a widget, by the owner's decision of 2026-08-21, not 82: a widget belongs to one route and never
  appears in a language on its own. Written in `en, ru`.

Both are registered in `scripts/check-i18n.mjs` with the count the tree actually has, so the gate
tells the truth today; the promise lives here. When the translations land, the number and these two
lines change in one go.

## How a debt is closed

Not by hand-editing locale files: `expand-site-language` is the only correct way to add a language to
a site that already exists — it creates the per-page files a hand edit silently skips, and a language
that appears in the switcher on a half-built site is worse than a language nobody offered.

Page dictionaries are translated outside the project: `npm run i18n:export` → an external model →
`npm run i18n:import`, which verifies keys and placeholders and warns when the answer came back
identical to English.

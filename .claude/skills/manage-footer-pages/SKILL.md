---
name: manage-footer-pages
description: >
  Work on the app's FOOTER PAGES — privacy, terms, cookies, "about", contacts, and the links
  to them at the bottom of the site. Use when the owner says "add a privacy policy", "we need
  terms of service", "add a page to the footer", "put a link at the bottom", or asks to change
  the text of any such page. The project ships three of them as a WORKING PATTERN; a fourth is
  made by copying one, not by inventing a new shape. Their links are the OWNER's setting, held
  outside the repository. Read this before writing any page-like file under app/[lang], because
  the one defect this area produced before was a page that looked fine and was invisible to
  search engines: dynamic, with no static params and no structured data.
---

# manage-footer-pages

**Footer pages are ordinary static pages of the site.** They live in the route group
`app/[lang]/(footerPages)/`, the parentheses are transparent to the URL, so the addresses are
short: `/ru/privacy`, `/ru/terms`, `/ru/cookies`.

Their **links** — which pages appear at the bottom, in what order, and what each is called —
are assembled by the OWNER in the control panel → **Footer pages**, exactly like the top menu.

---

## 1. Read the state first

```bash
npm run read:menu
```

Links live in `APP-CONFIG/app-config.json`, outside git. The repository alone shows a footer
with no links and invites you to hard-code a list — don't.

---

## 2. Which request is this

| The owner wants | What it is | What you do |
| :--- | :--- | :--- |
| A page in the footer, or a different order / label | **A setting** | Point at the panel → Footer pages. No code. |
| The TEXT of a page | **Your work** | Edit the page's language cells — see §3. |
| A NEW page (contacts, about, refunds) | **Your work** | Copy an existing page folder — see §4. |

---

## 3. Where a page's text lives

Beside the page, in language cells — the same shape a blog post uses:

```
(footerPages)/privacy/
  page.tsx                 # three lines, re-exports the entry
  _components/index.tsx    # createContentPage({ … })
  _data/meta.ts            # slug, ogImage — not translatable
  _data/en.ts              # base language: title, description, keywords, blocks
  _data/ru.ts              # a cell: only what differs
  _data/index.ts           # { meta, en, overrides: { ru } }
```

The shipped text is a **placeholder** that says "the full text is written in the control
panel". Replace it with the real document; the placeholder callout disappears with it.

Body is **typography only** — blocks from `lib/content/blocks/types`: `h2`, `p`, `list`,
`quote`, `table`, `note`, `callout`. No interactive components: these pages must read with
JavaScript switched off.

**Every language cell needs one root link** written `[%SITE%](/<lang>)` — `npm run
check:content` fails without it. It is how a page passes weight to the home page without
anyone's brand name being typed into the text.

---

## 4. Making a fourth page

Copy a folder, then change four things: the folder name (it becomes the URL), `meta.slug`,
the language cells, and — in the panel — add the new page to the footer. Nothing else. Do not
write `generateMetadata`, JSON-LD or `generateStaticParams` by hand: `createContentPage`
supplies all of it, and hand-written copies drift.

After copying, run `npm run check:content` and `npm run check:types`.

---

## 5. 🔒 The defect that produced this group

The pages that stood here before were **dynamic**. Each declared
`export const dynamic = "force-dynamic"`, had no `generateStaticParams`, and pulled its body
from a runtime config on every request. Five of five. They rendered fine and looked correct —
and to a search engine a page like that barely exists: no prerendered HTML, no structured
data, nothing to index ahead of a crawl.

Never reach for `force-dynamic` to "show the owner's text instantly". The owner's text is a
language cell, deployed like any content. `npm run check:content` fails on that marker inside
this group, which is exactly the wall the old pages walked through.

---

## 6. Facts

- **Short addresses can collide** with a future section — a product whose slug is `terms`, for
  example. Next resolves the static segment first, so the footer page wins. Predictable, but
  worth saying out loud before naming a page after a common word.
- **Link labels are capped at 12 characters**, like the top menu's; longer ones are cut with an
  ellipsis.
- **Footer pages off, or zero links, is a valid state** — the footer still renders.
- **Changes to links apply with no rebuild**; changes to page TEXT are code and ship with a
  deployment.
- The **cookie banner is not part of this group.** It has its own switch and its own reason
  (EU consent); it merely links to the cookie page.

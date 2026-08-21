---
name: use-links
description: >
  LINKS — the interlinking of your own pages, and links that leave the site. Load it whenever you
  write body text, add a button or a card that points somewhere, build a menu entry, or the owner
  says "link these two pages", "add a source", "mention their site", "put a link to the docs". Two
  rules decide almost everything here and neither is obvious: an internal link is written in ONE
  form and never by hand-glueing an address, and an OUTGOING link to somebody else's site is the
  owner's decision, not yours — outgoing links give away the search weight his site earned. The
  cheapest mistake in this area travels into other projects: a link that was correct on the machine
  it was written on and points at a stranger's domain everywhere else.
---

# use-links

**A link has an owner.** Inside the site it belongs to the project and you place it freely; leaving
the site it spends something the owner earned, so he decides.

## 1. 🔒 Outgoing links are the owner's call, always

An external link passes part of this site's search weight to the destination and invites the reader
to leave. That is a business decision — who the project vouches for, whose traffic it feeds — and it
is not yours to make, however sensible the source looks.

**So: never add a link to a third-party site on your own initiative.** Name what you would link, say
why, and let the owner answer. He says yes — the link goes in by the rules below. He does not answer
— write the fact without the link; a source can be named in words.

Three cases where you may act without asking, because none of them is a new outgoing link:

| Case | Why it is not a decision |
|---|---|
| the owner supplied the URL himself | he already decided |
| the link is to **this project's own domain** | weight stays inside; `lib/content/blocks/links.ts` also drops `nofollow` there |
| replacing a dead link with the same destination's live address | the decision was made earlier; you are repairing it |

When a link does go out: **absolute URL, new tab, and `rel="noopener noreferrer nofollow"`** — the
renderer adds that itself, and it deliberately omits `nofollow` for the project's own domain, read
from `APP-CONFIG`. Do not hand-write `rel` and do not try to "improve" it per link.

## 2. Internal links have exactly one written form

```
[%SITE%](/ru)      the site root, in the language of that cell
```

- **The label is the literal token `%SITE%`** — replaced at render time by the site's own name from
  `APP-CONFIG`. A name typed by hand freezes one project's identity into content that gets copied
  into every other project.
- **Every language cell carries one** such link home, counted per file by `check:content` (rule
  `no-root-link`). The rule exists because posts link outward and would otherwise give weight away
  and receive none. Two cells with one link between them fail — the count is per file, not a sum.
- The same form is legal in an `href:` field — a `cta` button, a linked `figure`.
- The language root is exempt: the home page linking to itself is not interlinking, it is a
  rendering mistake.

🔒 **Never glue an address by hand.** `resolveRootHref` exists because in single-language mode
`proxy.ts` strips the language segment, so `/en` answers 301 — every article's link home would be a
redirect. The same law as canonical addresses (`urlFor`, `use-seo`): one builder per address.

🔒 **A relative link that is not the root form is a defect, not a shortcut.** `check:content` rejects
it (`link-not-absolute`) for a reason that only shows up later: content travels between projects, and
`/pricing` means a different page — or no page — in the project that receives it.

## 3. Interlinking is a judgement, and here is the whole of it

The engine guarantees one link home. Everything above that is editorial, and two habits cover it:

- **Link where the reader would otherwise stop.** A term the page uses but does not explain, a step
  described elsewhere, a product the article names — that is where a link earns its place. A "see
  also" list at the bottom is the shape you reach for when no sentence needed a link.
- **Link with the words that describe the destination**, not with "here" or the bare address. The
  label is what tells both a reader and a search engine what the target is about, and it is the only
  part of the link that carries meaning.

Do not stuff. A body with a link in every second sentence dilutes all of them, and repeating one
destination five times on a page adds nothing after the first.

## 4. Where links live outside the body

| Kind | Its place | Rules |
|---|---|---|
| menu entries (top, footer) | the owner's list in `APP-CONFIG`, or the repo defaults | `place-page-in-menu` — and know which of the two is speaking |
| a link out of a block | `href:` in `cta`, `figure`, `docref` | same two forms as §1–2 |
| a machine-surface link | `lib/aio/surfaces.ts`, `llms.txt` | `use-aio`; every link there must answer 200 |
| a sitemap row | `app/sitemap.ts` | `use-seo`; addresses through `urlFor` |

Anything pointing at a page **behind a role** belongs in none of the four: a public link to a 403 is
a promise the site does not keep.

## 5. What the gates say

| Command | Refuses |
|---|---|
| `check:content` | `link-not-absolute`, `root-link-label` (label other than `%SITE%`), `no-root-link` (a cell with no link home), `asset-missing` |
| `check:links` | a `<Link>` to an authentication address without `prefetch={false}` — the address leaves for another origin and prefetch fails on CORS |
| `check:seo` | a section that no sitemap links to at all |

None of them can tell whether a destination still exists. A dead outgoing link is found by requesting
it, and it is worth requesting every one you add — a 404 in an article is a stranger's decision
applied to the owner's page.

## 6. Before you call it done

- Fetch the rendered page and read the anchors themselves: internal ones carry the site's real name,
  external ones carry `rel="noopener noreferrer nofollow"` and open in a new tab.
- Count links home: one per language cell, in every cell.
- Request each new external URL once, and list them in your report — that list is what the owner
  approves or removes.

# CONTENT-ENGINE.md — how a post is built here

**Given, not evolving.** This is the instruction you follow to add or change a post. It is not a
description of an idea: every file it names exists in this repository, and every rule it states is
enforced by `npm run check:content`, which fails the work when the rule is broken.

The shipped `blog` section is the working example. Read the rule here, then open
`app/[lang]/blog/the-end-of-prompt-engineering/` and see the same rule as four files.

## 1. Why the engine exists

A content surface — an article, a landing page, a product card — is always the same three jobs: **hold
the data**, **render it as a fully static page**, and **appear in a list**. The naive way wires those
jobs through a central spine: one global registry of every item, one dynamic `[slug]` route, one
"god" types file every author edits. That spine becomes the bottleneck — every new item touches it,
every refactor risks it, and every AI agent must load it before it can do anything at all.

This engine removes the spine. Its single design rule:

> **Everything a content surface needs lives inside its own folder; everything shared lives once in
> the engine; nothing in between.**

Four properties follow:

- **Co-location** — one route = one folder. The page, its view, its data and its helpers sit
  together. To change an article you open one directory, not five.
- **Self-containment / deletability** — delete the folder and the route, its data, its row in the
  list and its helpers disappear at once, leaving no orphans in `lib/` or the project root. Adding is
  the mirror operation: drop a folder in and it appears.
- **Auto-discovery** — the list is generated from the file system at build time (`lib/parser-fs.mjs`),
  so there is no registry to maintain or to read.
- **Static-first** — no dynamic `[slug]`, no client routing, no `force-dynamic`. Every page is
  SSG/ISR and works with JavaScript switched off.

**Read the next section before you apply any of this.** Everything above is true of ONE kind of page,
and applying it to the other kind produces an impossible project.

## 2. 🔒 Which of the two models is this page? Decide before you write a file

This project builds pages under **two different models**, and they are not a matter of taste. Choosing
wrongly is not a style mistake — one direction produces a million folders, the other produces a site
that search engines cannot read.

**The test is one question: does what the page shows depend on WHO is looking?**

| | **Public content** (this document) | **User-scoped surface** (dashboard, admin, account) |
|---|---|---|
| Who sees what | everyone sees the same thing | every visitor sees their own |
| Audience | `guest`, or no role at all | a named role; never anonymous |
| How many pages exist | a finite set someone authored — five posts, forty | as many as there are users: a thousand, a million, unknown at build time |
| Known at build time | yes — the folders are on disk | no — the rows do not exist yet |
| Routing | **a folder per item**, prerendered | **a dynamic segment**: `/[slug]`, `/[id]`, `/[userId]` |
| Rendering | SSG / ISR | static shell + data fetched behind an authenticated `/api/*` |
| Indexed by search engines | yes — that is the point | never; it must not be |
| This document applies | ✅ | ❌ — see `CODING-STANDARDS.md` |

### Why a folder per item is right here

A blog post is **authored**. Somebody wrote it, it is the same for every reader, and its whole value is
that a search engine can find it. Because the set is finite and known before the build, the build can
render every page ahead of time — so the visitor gets HTML with no query behind it, and the crawler gets
a complete document. The folder is what makes that possible: the file system IS the list of what exists.

### Why a folder per item is impossible there

A dashboard shows **rows that belong to somebody**. There is no author and no finite set: a site with a
million users has a million versions of `/dashboard`, and none of them exists until that person signs
up. You cannot prerender them, you must not index them, and generating a folder per user is not a heavy
solution — it is not a solution at all, because the folders would have to be written after the build,
by the running site, for people who registered a minute ago.

So the user-scoped surface inverts three things and keeps one:

1. **The route becomes a dynamic segment** — `/[id]`, `/[slug]` — resolved at request time.
2. **The data arrives behind authentication**, through `/api/*`, never baked into the page.
3. **The page is gated by role** and redirects to sign-in when the role is missing.
4. **What it keeps: the shell is still static.** The frame, headings and empty states are prerendered;
   only the rows are dynamic, and they load into a container the visitor opens. A dynamic route does not
   license a dynamic page.

That is the subject of `CODING-STANDARDS.md`, not of this file. **Do not carry the rules below into a
dashboard**, and do not "fix" a dashboard route because this document says a route may not be dynamic:
that sentence is scoped to public content, where the alternative exists.

### Where the boundary is checked

`npm run check:content` audits **content tabs only** — a folder that contains post folders. It never
looks at `/dashboard` or any user-scoped route, so a legitimate dynamic segment there is not a
violation and will not be reported as one.

## 3. Three layers

```
┌─ ROUTE SHELL ─────────────────────────────────────────────────────────────┐
│  app/[lang]/<tab>/page.tsx           thin: re-export from _components      │
│  app/[lang]/<tab>/<slug>/page.tsx    thin: re-export from _components      │
└───────────────────────────────────────────────────────────────────────────┘
            │ composes                       │ authored as
            ▼                                ▼
┌─ PER TAB (inside the tab folder) ─────────────────────────────────────────┐
│  _components/   VIEW       (index.tsx — the React composition)             │
│  _lib/          FUNCTIONS  (post.tsx resolve/list · types.ts contracts)    │
│  _data/         DATA       (en.ts / ru.ts / meta.ts + index.ts public API) │
│  _list.generated.ts  AUTO  (parser-fs output, gitignored)                  │
└───────────────────────────────────────────────────────────────────────────┘
            │ every tab reuses it, no tab duplicates it
            ▼
┌─ SHARED ENGINE (once, owned by no tab) ───────────────────────────────────┐
│  lib/content/blocks/{types,registry,inline}   neutral block catalogue      │
│  lib/content/resolve.ts                       resolver with EN fallback    │
│  lib/content/create-content-post.tsx          POST factory                 │
│  lib/content/create-content-page.tsx          PAGE factory                 │
│  components/content-page/standard-content-page.tsx   page template         │
│  components/content-page/post-body.tsx        block renderer               │
│  lib/parser-fs.mjs                            list generator (build hook)  │
└───────────────────────────────────────────────────────────────────────────┘
```

**A separation that is never blurred:**

| Folder | Holds ONLY | Example |
|---|---|---|
| `_components` | the view (React) | `index.tsx` composing the factory |
| `_lib` | functions + type contracts | `post.tsx` (resolve/list), `types.ts` |
| `_data` | data, including localized UI strings | `en.ts`, `ru.ts`, `meta.ts`, `index.ts` |

Localized UI strings are **data**, so they live in `_data` — never in `_lib`. Type contracts are
**code**, so they live in `_lib/types.ts`. The shared engine is **not** a tab library: every tab
reuses it and no tab copies it into its own `_lib`.

## 4. The recipe: add a post

Create **one folder** and nothing else:

```
app/[lang]/blog/<new-slug>/
  page.tsx                 3-line re-export of ./_components
  _components/index.tsx    createContentPost({ … })
  _data/meta.ts            non-translatable facts: slug, date, tags, hero, author
  _data/en.ts              the base language cell — title, subtitle, blocks, faq
  _data/ru.ts              the translation cell (overrides, per key)
  _data/index.ts           { meta, en, overrides: { ru } }
```

`lib/parser-fs.mjs` runs on `predev` and `prebuild`, scans the tab folder and emits
`_list.generated.ts`. **No registry, no list to edit.** Deleting the folder removes the post
everywhere — that is verified, not assumed: remove it, run the generator, and no reference to the
slug remains anywhere in the tree.

**Copy an existing post folder as the starting point.** The two shipped posts differ in exactly the
ways a new post may differ: one has a video hero, the other a YouTube poster; both carry `en` + `ru`.

### 4a. 🔒 The post must also exist for machines — and one file makes that automatic

A post is read by two audiences: people, through the page, and models, through its **markdown twin**
and the site's `llms.txt` map. The second audience is why `AIO.md` exists, and the rule here is short:

```
app/[lang]/blog/<new-slug>/index.md/route.ts     ← 5 lines, copied from a neighbour
```

```ts
import { markdownRoute } from "@/lib/aio/md-route"
const md = markdownRoute("/blog/<new-slug>")

export const dynamic = "force-static"
export const dynamicParams = false
export const generateStaticParams = md.generateStaticParams
export const GET = md.GET
```

You write nothing else. The text of the markdown twin is generated from the **same blocks** as the
page (`lib/aio/blocks-to-markdown.ts`), so the two cannot drift; the post appears in `/llms.txt` by
itself, because the map is built from the same list of public surfaces.

**Why this is a rule and not a nicety.** A model that reaches an HTML page spends half its context on
the menu, the footer, the consent banner and the scripts. A model that reaches a 404 — which is what
a map entry without a route is — leaves and quotes somebody else. Neither failure is visible in a
browser, which is precisely why the gate exists: **`npm run check:aio` refuses a public page without
its markdown twin.**

Copying the folder of an existing post brings this file with it. Forgetting it is caught before the
post ships, not after.

### 4b. 🔒 The post must be FINDABLE — the sitemap is part of the engine

A post that exists, reads well and has a perfect markdown twin is still invisible if no map points at
it. Search engines find pages two ways: by following links, and by reading the sitemap. The first is
slow and guarantees nothing — a page nobody has linked to yet can wait months.

**For posts you write nothing.** `app/sitemap.ts` builds the blog section and every post from
`_list.generated.ts` — the same inventory that feeds the blog page — for each enabled language, with
`lastModified` taken from the post's `meta.date`. A new post enters the map by the fact of existing.
There is no second source of truth about posts, and that is the point.

**For a NEW COLLECTION you write one line.** Adding a section beside `blog` (say `news` or `guides`)
means adding it to `app/sitemap.ts`. Two shapes, and the choice is not stylistic:

- **authored, finite set** (posts, pages) → the main map, `app/sitemap.ts`;
- **grows at runtime and multiplies by language** (a catalogue) → its own chunked map,
  `app/<section>/sitemap.ts`, like products. One file holds 50,000 addresses, and past that limit a
  search engine discards the file ENTIRELY — pages and posts along with it.

**Never in the map:** anything behind authorization. Account, panel, checkout, sign-in. Such a page
differs per visitor, does not exist at build time, and returns a login form to a crawler. Promising an
address where a lock awaits wastes the crawl and fills reports with errors instead of pages.

**Why this is a rule and not a nicety.** It was found live on 2026-08-13: `/ru/blog` returned 200,
both posts were written and translated, `check:seo` was green — and neither post was in any sitemap.
Nothing looked broken, which is the whole difficulty. **`npm run check:seo` now refuses a section that
appears in no map**, so the next collection cannot repeat it.

### 4c. 🔒 A post's images — the STORE is the default, `public/` is the exception

**Read this before writing any post that has a picture. The shipped post is not an article — it is the
specimen you are meant to copy, and it demonstrates both paths on purpose.**

Two homes exist, and the earlier version of this section had the emphasis backwards. It reasoned about
posts in general and recommended `public/` — the way every web project already works, and the one thing
an agent does not need to be taught. What is specific to this product, and therefore what this document
owes you, is the other one.

| | **The store — default** | `public/` — exception |
|---|---|---|
| Written by | a person, in the panel | you, in the editor |
| Changed by | the panel, **no rebuild** | a code change + rebuild |
| Referenced as | `src: "media:<file-name>"` | `src: "/blog-media/<file>"` |
| Suits | anything the owner will ever want to swap | icons, diagrams that belong to the sentence |

**Why the default is the store.** This product exists so a non-coder can run a site from the panel. A
picture in `public/` cannot be replaced without editing a repository — which means every such picture
is a small promise the product does not keep. Pick `public/` only when the picture is inseparable from
the text: a diagram the paragraph explains, a decorative mark.

#### Referencing by NAME, not by id

```ts
{ kind: 'figure', src: 'media:development-loop.jpg', alt: '…' }
```

An id is born at upload and is **different on every server**; a post lives in the repository and is
identical everywhere. Writing an id into content would point at nothing on the second server. The file
name is ours and stays fixed, so it is the only stable link from content to the store.

Rendering resolves it: `StoredImage` (`components/media/stored-image.server.tsx`) looks the row up
through `lib/media/by-name.ts` — a cached lookup, because a page with an article is prepared ahead and
must not fetch per view — and hands the url, dimensions and blurred copy to `next/image`.

#### The shipped file does not disappear — it changes role

A picture referenced as `media:` still ships in `public/blog-media/`. It is **seed material**, and it
does two jobs: `npm run seed:media` uploads it to the store on first run (the same script that seeds
the catalogue), and until that has happened `StoredImage` falls back to the file. Without this, a fresh
server would open the article on an empty database and show a hole.

#### Saving: what happens on upload

1. The browser posts to `/api/media/upload`, a thin proxy on the app's own origin.
2. The **data layer** (`services/data`, :3300) writes the bytes, measures `width`/`height` with `sharp`,
   applies a crop if asked, and computes a tiny blurred copy (12px webp, a few hundred bytes) into the
   `blur` column.
3. It inserts one row into `media` and returns it. **The row is the picture's identity from then on;
   the file on disk is the data layer's business.**

The blurred copy is computed **after** the crop, from the buffer that lands on disk — computed earlier
it would show a frame the file no longer contains. A failure to compute it never fails the upload.

#### Reading back

`StoredImage` for `media:` references, `StaticImage` for `public/` paths. Both end at `next/image` and
produce the same thing on screen: reserved space, a blurred placeholder inside the HTML, a file sized
for the visitor's screen.

**Resizing needs no machinery of ours.** Media is served from `/api/media/<id>/file` — the app's own
origin — so the optimizer treats it as local: no `remotePatterns`, no second image service.

🔒 **That path must stay public.** `proxy.ts` gates all of `/api/*`; the read of one file by id is
exempted there deliberately. Remove the exemption and every stored picture answers 401 to visitors and
400 through the optimizer — which is exactly what shipped once, leaving a catalogue of empty squares.

#### Two traps this specimen already fell into

**A link on the picture is not a source of the picture.** The figure renderer branched on `href` first
and drew the image itself, skipping `media:` resolution — the raw string reached the HTML. The defect
was visible only on the one block where both conditions met.

**A video's poster is not an image.** `<video poster="…">` cannot take a blurred placeholder or the
optimizer, wherever the file lives. That is the element's nature, not a gap in this pipeline — say so
plainly rather than promising every picture gets a placeholder.

#### What a post stores

The **address**, never the bytes and never a base64 blob. `npm run check:content` fails on a
`heroVideo`/`heroPoster`/`src` whose file is missing from `public/`, catching a shipped picture that was
never committed.


## 5. 🔒 The law of the two links

A post links in **exactly two ways**. This is enforced, not advised — `npm run check:content` rejects
anything else, and each rule below is a defect that already shipped once.

### External link — always absolute

```ts
'… a self-hosted [Agentic Engineering Infrastructure](https://www.fractera.ai/en) …'
```

It carries a host. It opens in a new tab. `lib/content/blocks/inline.tsx` adds
`rel="noopener noreferrer nofollow"` to third-party domains and **omits `nofollow` for the platform's
domain**, because weight going there is intentional.

**A relative external link is a bug, not a shortcut.** A post travels into projects that do not have
the page it points at: `[…](/ai-development-loop)` returned 404 on every site but the one it was
written for, and `[…](/en)` silently sent the reader to the customer's own home page instead of the
page the sentence was about.

### Internal root link — the only relative form allowed

```ts
'В [%SITE%](/ru) мы весь прошлый год …'      // ru cell
'At [%SITE%](/en), we spent the last year …' // en cell
```

- The href is the **site root in the language of that data cell**. The cell already knows its
  language, so nothing has to be threaded through the renderer.
- The label is the literal token `%SITE%`, replaced at render time by the **site's own name** for that
  language (`metaForLang(lang).siteName`, from `APP-CONFIG`).
- Every language cell of every post carries **one**. An article that links out but never links home
  gives weight away and receives none.

Why a token instead of typing the name: a name typed into an article freezes one project's identity
into content that is copied into every other project. The site names itself; the article only points.

## 6. Identity comes from settings, never from data

The engine reads who this project is at render time:

| What | Where it comes from | Never |
|---|---|---|
| site name, canonical origin, logo | `lib/brand.ts` → `APP-CONFIG` | a constant in `lib/` |
| author name, job title, photo, profiles | `lib/author.ts` → `APP-CONFIG` (App settings → Author) | `meta.ts`, unless the post genuinely has its own author |
| page title | `create-content-post.tsx`: `<title> \| <section> \| <site name>` | the site name written into `_data` |

`check:content` rejects a site name found in `_data`. The blog's own strings once read
`'Blog | Fractera'`, so every customer's blog introduced itself with someone else's name.

**The canonical address may be absent, and that is correct.** When `APP-CONFIG` has no site URL yet,
`lib/seo/alternates.ts` and `lib/construct-metadata.ts` emit **no** `canonical`, no `hreflang` and no
`metadataBase`. A missing canonical is harmless — a search engine treats the page as its own original.
A canonical pointing at another domain hands the whole site away. Never substitute a fallback host.

## 7. Translation cells

`lib/content/resolve.ts` merges **per key** with an English fallback: a cell may translate the title
and leave the blocks, and only the translated keys change. Consequences to know:

- A post whose `_data/index.ts` has no `overrides` serves **English in every language**. That is legal
  and is sometimes the right call — but it must be a decision, so the gate reports it.
- A language that has no cell falls back to English. The shipped posts carry `en` + `ru` because they
  are the **pattern**, not the content: two cells are enough to show how a cell works.
- Diagrams and code blocks are content too. An ASCII diagram left in English inside a Russian article
  reads as an unfinished translation — translate the labels with the prose.

## 8. What the gate checks

`npm run check:content` — run it after touching any post:

| Rule | Rejects |
|---|---|
| `link-not-absolute` | a relative link that is not the root form |
| `root-link-label` | a root link whose label is not `%SITE%` |
| `asset-missing` | `heroVideo` / `heroPoster` / `src` with no file in `public/` |
| `brand-in-data` | the site's name written into `_data` |
| `cell-missing` | `_data/index.ts` imports a language file that does not exist |
| `single-language` | a post with no translation at all |
| `no-root-link` | a language cell with no internal link home |

A rule that is not mechanically enforced is a suggestion, and suggestions lose to deadlines. That is
why these live in a script that fails, not in a paragraph nobody re-reads.

**Two more gates apply to every post, and they belong to the same discipline:**

| Command | Rejects |
|---|---|
| `npm run check:aio` | a public page with no markdown twin (§4a) — the map would send an agent to a 404 |
| `npm run check:seo` | a page with no `generateMetadata`, no `alternates`, or an `openGraph` without `url` — the post would declare itself a copy of another page, or hand social networks the wrong link |

Run all three before calling a post done. They are cheap: they read files, they do not build.

## 9. Scaling — and what it costs

**A new post** creates exactly one folder. **Zero existing files are edited.** The index learns about
it because the file system is the registry.

**A whole new tab** (a shop, a knowledge base) is the same shape one level up: create
`app/[lang]/<tab>/` with its `_lib/{post,types}`, `_data`, `_components` and post folders, then add
**one line** to `COLLECTIONS` in `lib/parser-fs.mjs`. That entry is the only edit outside the new
folder.

Compare with the anti-pattern this avoids: a central `posts.ts` every author appends to (a merge
conflict point and lock-step coupling), a dynamic `[slug]/page.tsx` doing a runtime lookup, and a
shared "god" types file every author edits. Here engine types are *imported*, never extended —
`blocks/types.ts` has **zero imports** on purpose, a deliberate leaf of the graph.

## 10. Before you say a post is done

1. `npm run check:content` — green.
2. The route is still static: no `force-dynamic`, no `cookies()` / `headers()` / `auth()`, no
   `"use client"` anywhere under the tab.
3. Both language cells render — open `/en/blog/<slug>` and `/ru/blog/<slug>`.
4. Never run `npm run build` on Windows (the project builds on Ubuntu); never introduce a dynamic
   `[slug]`; never hand-edit `_list.generated.ts`, whose first line says so.

## 11. The seven requirements — and what proves each one

A content surface is finished when all seven hold. **Five of them are checked by
`npm run check:content`;** the remaining two need a build and a live page, and their exact commands are
below. Run this after adding a tab, and after any change that touches the shape of one.

**These seven describe a PUBLIC CONTENT surface.** A user-scoped surface (§2) is measured differently —
it is allowed a dynamic segment and an authenticated fetch, and it is required to be un-indexed. Running
this list against a dashboard and "fixing" what it reports would break the dashboard.

| # | Requirement | Proof | Who proves it |
|---|---|---|---|
| 1 | No dynamic participation | `force-dynamic`, `export const dynamic =`, `cookies()`, `headers()`, `auth()` — zero occurrences in the tab | `check:content` → `surface-dynamic` |
| 2 | Zero client components | no `"use client"` under the tab | `check:content` → `surface-client` |
| 3 | Thin route | `page.tsx` re-exports `./_components` and nothing else (≤ 12 lines) | `check:content` → `route-not-thin` |
| 4 | The engine is reused, not copied | no `resolve` / `registry` / `post-body` / `create-content-*` inside the tab's `_lib` | `check:content` → `engine-duplicated` |
| 5 | Deleting a post leaves no tails | the slug appears nowhere outside its own folder, except the generated list | `check:content` → `post-tail` |
| 6 | Static / ISR in the real build | the build's route table shows `●` for the index and every post, with a revalidate value | `npm run build` on the server: `grep -E "/\[lang\]/<tab>" ` in the build log |
| 7 | Readable with JavaScript off | the article's text survives stripping every `<script>` from the response | `curl -s <url> \| sed 's/<script[^>]*>.*<\/script>//g' \| grep "<a phrase from the article>"` |

**Why five of them are code and not a checklist.** A checklist is followed while someone remembers it.
One edit "just for a minute" puts `force-dynamic` back into a tab, and the loss shows up a month later as
a drop in search results that nobody connects to that minute. Each of the five is a real failure this
project already had: a section that was silently dynamic, a client island in a route, a page file that
grew logic, an engine module copied into a tab, and a post that could not be deleted without leaving a
dangling import.

**Two are not automatable, and the document says so rather than pretending.** Requirement 6 needs an
actual build (only the build knows what it prerendered) and requirement 7 needs a served response. Do not
substitute a cheaper proof for either: "the code looks static" is not requirement 6, and "the page opens
in my browser" is not requirement 7 — a browser runs the JavaScript you are trying to prove unnecessary.

## 12. The command

The owner may ask for a post in the conversation, using the command listed in the instruction-set
block of `CLAUDE.md`. It means: **create the post folder by this document** — all four files, both
language cells, one internal root link in each, and the gate green before you report.

**Near-variants count as the same command.** It is spoken, so *"create a blog post"*, *"создай пост
для блога"*, *"добавь публикацию"* are one request. Ask for the subject if it was not given; never
invent the topic of someone's article.

## 13. Colours come from the theme, never from a palette

**Requirement: a content page must obey the site's theme.** The visitor switches to light and the page
turns light — like every other page. This is not decoration: a section that stays dark while the shell
turns light reads as a broken page, and the blog was exactly that until 2026-08-11.

**The cause was one habit:** the section was written with absolute colours — `bg-black`, `text-white`,
`text-white/50`, `bg-zinc-900`, `border-white/10`, a `violet` accent. Absolute colours are the same in
both themes by definition, so a dark design keeps being dark under a light shell.

**Use tokens instead**, the ones the rest of the product uses:

| Instead of | Write |
|---|---|
| `bg-black`, `bg-zinc-900` | `bg-background`, `bg-muted` |
| `text-white` | `text-foreground` |
| `text-white/50`, `/40`, `/55` | `text-muted-foreground` |
| `border-white/10`, `/15` | `border-border` |
| a named accent (`violet-600`) | `bg-primary` + `text-primary-foreground` |

**The one honest exception** is a label drawn ON a filled accent: its text must contrast with the fill,
not with the page, so `bg-primary` pairs with `text-primary-foreground` — never with `text-foreground`.

**How to check without a browser — and where the first attempt was WRONG:**

```
grep -rn "bg-black\|text-white\|bg-zinc-\|border-white\|bg-white/\|violet-" \
  app/[lang]/<section>/ lib/content/ components/content-page/
```

Sweeping the section folder alone is not enough, and skipping the rest cost a second round: after the
blog index was fixed its POST pages were still black, because posts are drawn by the shared engine —
`standard-content-page.tsx` and `lib/content/blocks/`. A section can be perfectly clean and still render
dark. A page that passes the sweep above cannot be theme-blind: no colour of its own is left to disobey
with.

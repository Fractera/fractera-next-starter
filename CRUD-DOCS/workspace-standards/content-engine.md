# The Content Engine — co-located, self-contained, AI-cheap

> Authoritative "how it actually works" for the Fractera content engine: the one
> universal mechanism behind every content surface — **news, blog, documentation,
> deployment pages** — and the pattern to follow for any new one (a shop, a product
> card, a changelog, a glossary…). Russian mirror: `public/docs/content-engine.md`
> in FES. Narrower companion: `multilingual-content.md` (i18n recipe) points here.

---

## 1. What this engine is for

A content surface (an article, a landing page, a product card) is always the same
three jobs: **hold data**, **render it as a fully-static page**, and **be found in
a list**. The naive way couples these jobs to a central spine — one global registry
of all items, one dynamic `[slug]` route, one shared "god" types file every author
edits. That spine becomes the bottleneck: every new item touches it, every refactor
risks it, every AI agent must load it to do anything.

This engine removes the spine. Its single design rule:

> **Everything a content surface needs lives inside its own folder; everything
> shared lives once in the engine; nothing in between.**

Concretely that buys four properties:

- **Co-location** — one route = one folder. The page, its view, its data and its
  helpers sit together. To change an article you open one directory, not five.
- **Self-containment / deletability** — delete the folder and the route, its data,
  its list row and its helpers all disappear with zero orphans left in `lib/` or the
  project root. Adding is the mirror image: drop a folder, it appears.
- **Auto-discovery** — the list of items is generated from the filesystem at build
  time (`parser-fs`), so there is no hand-maintained registry to edit or to read.
- **Static-first** — no dynamic `[slug]`, no client routing, no `force-dynamic`.
  Every page is SSG/ISR and works with JavaScript off.

It scales along two axes without ever touching a central file: **more items of an
existing type** (a new article → a new folder) and **a brand-new type** (a shop →
a new tab folder + one line in the discovery config). Section 7 walks both.

---

## 2. The three layers (mental model)

```
┌─ ROUTE SHELL ────────────────────────────────────────────────────────────┐
│  app/[lang]/<tab>/page.tsx              thin: re-export from _components   │
│  app/[lang]/<tab>/<slug>/page.tsx       thin: re-export from _components   │
└───────────────────────────────────────────────────────────────────────────┘
            │ composes                       │ authored as
            ▼                                ▼
┌─ PER-TAB (inside the tab folder) ────────────────────────────────────────┐
│  _components/   VIEW       (index.tsx — the React composition)            │
│  _lib/          FUNCTIONS  (post.ts(x) resolve/list · types.ts contracts) │
│  _data/         DATA       (en.ts/ru.ts/meta.ts + index.ts public API)    │
│  _list.generated.ts  AUTO  (parser-fs output, gitignored)                 │
└───────────────────────────────────────────────────────────────────────────┘
            │ all tabs reuse, none duplicate
            ▼
┌─ SHARED ENGINE (once, belongs to no tab) ────────────────────────────────┐
│  lib/content/blocks/{types,registry,inline}   neutral block catalog       │
│  lib/content/resolve.ts                        EN-fallback resolver        │
│  lib/content/create-content-post.tsx           POST factory               │
│  lib/content/create-content-page.tsx           PAGE factory               │
│  components/content-page/standard-content-page  the page template         │
│  components/content-page/post-body              the block renderer         │
│  lib/parser-fs.mjs                              build-time list generator  │
└───────────────────────────────────────────────────────────────────────────┘
```

**The strict split — never blur it:**

| Folder        | Holds ONLY            | Example |
|---------------|-----------------------|---------|
| `_components` | the view (React)      | `index.tsx` composing the factory |
| `_lib`        | functions + type contracts | `post.ts` (resolve/list), `types.ts` |
| `_data`       | data (incl. localized UI strings) | `en.ts`, `ru.ts`, `meta.ts`, `index.ts` |

Localized UI strings are **data**, so they live in `_data` (`en.ts` + `ru.ts` +
`index.ts` exposing `getXUi(lang)`) — never in `_lib`. Type contracts are **code**,
so they live in `_lib/types.ts`. The shared engine is **not** a per-tab library: it
is reused by every tab and never copied into a tab's `_lib`.

---

## 3. Architecture trees (the mandatory components)

Legend: `[REQ]` required · `[opt]` optional · `[AUTO]` generated.

### 3.1 Collection tab — router on top, posts below (`news`, `blog`, `documentation`)

```
app/[lang]/<tab>/
├── page.tsx                  [REQ]  thin router: re-export Index + generateMetadata
├── _components/
│   └── index.tsx             [REQ]  index view (post list) + generateMetadata; reads POSTS + <tab>List
├── _lib/
│   ├── post.ts(x)            [REQ]  <tab>Post / <tab>ListItem / <tab>List (resolve + sort)
│   └── types.ts              [REQ]  contracts: <Tab>Data, …Base/Meta/Override, <Tab>Ui
├── _data/                           the tab's UI chrome (DATA — never hardcode in _components)
│   ├── en.ts                 [REQ]  base-language UI chrome
│   ├── ru.ts                 [opt]  language override
│   └── index.ts              [REQ]  folder public API: get<Tab>Ui(lang)
├── _list.generated.ts        [AUTO] parser-fs on build/dev; gitignored; never hand-edit
│
└── <slug>/                          a POST (co-located route)
    ├── page.tsx              [REQ]  thin: re-export Entry + generateMetadata
    ├── _components/
    │   └── index.tsx         [REQ]  composition: createContentPost({ … })
    └── _data/
        ├── meta.ts           [REQ]  non-translatable: slug, date, readingMinutes, tags, author, ogImage
        ├── en.ts             [REQ]  full base document: title/seoTitle/…/blocks/faq
        ├── ru.ts             [opt]  language override (news is localized; blog/doc are EN-only)
        └── index.ts          [REQ]  export const data = { meta, en, overrides:{ ru } }
```

### 3.2 Map / hub tab — hub on top, content pages below (`deployments`)

```
app/[lang]/deployments/
├── page.tsx                  [REQ]  thin hub router
├── _components/index.tsx     [REQ]  hub view (target list) + generateMetadata; POSTS + deploymentList
├── _lib/
│   ├── post.ts               [REQ]  deploymentContent / deploymentList; DeploymentData/Meta/Base
│   └── types.ts              [REQ]  DeploymentsUi (chrome contract)
├── _data/{en,ru,index}.ts    [REQ]  hub UI chrome + getDeploymentsUi(lang)
├── _list.generated.ts        [AUTO]
│
└── <slug>/  (local │ mcp │ vps)     a CONTENT PAGE
    ├── page.tsx              [REQ]  thin re-export
    ├── _components/index.tsx [REQ]  createContentPage({ resolve, meta, chrome, sections? })
    └── _data/{meta,en,ru,index}.ts [REQ]  page content (same shape as a post)
```

### 3.3 Shared engine — outside the tabs, never duplicated into a tab's `_lib`

```
lib/content/
├── blocks/{types,registry,inline}    neutral catalog: Block, FaqPair + renderers
├── resolve.ts                         resolveEntry (per-key EN fallback)
├── create-content-post.tsx            POST factory
├── create-content-page.tsx            PAGE factory
├── types.ts                           LocalizedBody / LocalizedBodyOverride
└── page-ui.ts · post-body-ui.ts
components/content-page/
├── standard-content-page.tsx          the page template (chrome + layout)
└── post-body.tsx                      the block renderer (thin dispatcher)
lib/{brand,author,seo,i18n}.ts · lib/parser-fs.mjs    shared infra + list generator
```

**Deletability invariant:** removing any `app/[lang]/<tab>/` folder leaves zero
references behind — nothing in `lib/` or the root imports *into* a tab. The shared
engine stays because it belongs to no single tab (deleting one tab cannot orphan
something every tab uses).

---

## 4. The shared engine — source of each component

### 4.1 `lib/parser-fs.mjs` — build-time auto-discovery (no hand registry)

One config-driven generator. It scans each collection's folder for post folders
(a child dir, not `_`/`[`-prefixed, that has `_data/index.ts`) and writes a static
`_list.generated.ts` (static imports + a `POSTS` array). Turbopack needs statically
resolvable imports, so discovery happens at **build** time, never at runtime. Adding
a tab = **one line** in `COLLECTIONS`.

```js
const COLLECTIONS = [
  { dir: 'app/[lang]/news',          type: 'NewsData',       typeModule: './_lib/post' },
  { dir: 'app/[lang]/documentation', type: 'DocData',        typeModule: './_lib/post' },
  { dir: 'app/[lang]/blog',          type: 'BlogData',       typeModule: './_lib/post' },
  { dir: 'app/[lang]/deployments',   type: 'DeploymentData', typeModule: './_lib/post' },
]

function findPostSlugs(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(name => !name.startsWith('_') && !name.startsWith('[') && !name.startsWith('.'))
    .filter(name => statSync(join(dir, name)).isDirectory())
    .filter(name => existsSync(join(dir, name, '_data', 'index.ts')))
    .sort()
}

function generate({ dir, type, typeModule }) {
  const slugs = findPostSlugs(dir)
  const imports = slugs.map((slug, i) => `import { data as p${i} } from './${slug}/_data'`).join('\n')
  const arr = slugs.map((_, i) => `p${i}`).join(', ')
  const body = `// AUTO-GENERATED by lib/parser-fs.mjs — DO NOT EDIT.
import type { ${type} } from '${typeModule}'
${imports}

export const POSTS: ${type}[] = [${arr}]
`
  writeFileSync(join(dir, '_list.generated.ts'), body, 'utf8')
}
```

Note `typeModule: './_lib/post'` — a **relative** path, because the generated file
lives at the tab's root. Nothing about a tab points outside the tab.

### 4.2 `lib/content/blocks/types.ts` — the neutral block catalog

The single source of truth for every block kind any page can use. It has **no
imports** (a leaf of the import graph) so every tab can depend on it without
coupling to anything. Authoring a page = writing an array of these blocks; adding a
new section type = add a union member here + a renderer in the registry. Containers
hold `children: Block[]`, so any block nests in any layout — the extensibility
headroom.

```ts
export type LeafBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'olist'; items: string[] }
  | { kind: 'figure'; media: 'image' | 'video'; src: string; alt: string; caption?: string; href?: string }
  | { kind: 'code'; text: string }
  | { kind: 'cta'; text: string; href: string; label: string }
  | { kind: 'note'; text: string }
  | { kind: 'frameworks' }
  | { kind: 'founder'; text: string }
  | { kind: 'docref'; title: string; summary: string; href: string; label?: string; kicker?: string }
  | { kind: 'callout'; title: string; text: string }
  | { kind: 'inquiry'; title?: string; text: string; label: string }

export type ContainerBlock =
  | { kind: 'columns'; children: Block[]; cols?: 2 | 3 }
  | { kind: 'group'; children: Block[] }

export type Block = LeafBlock | ContainerBlock
export type FaqPair = { q: string; a: string }
```

### 4.3 `lib/content/types.ts` — the localized-body contract

Generic shape for a per-document, per-language body. Built on the neutral `Block`,
so it is language- and tab-agnostic.

```ts
import type { Block, FaqPair } from './blocks/types'

export type LocalizedBody = {
  blocks: Block[]
  faq?: FaqPair[]
}

export type LocalizedBodyOverride = {
  headings?: Record<string, string>
  blocks?: Block[]
  faq?: FaqPair[]
}
```

### 4.4 `lib/content/resolve.ts` — the EN-fallback resolver

The whole i18n mechanism in one file: a base-language document + optional
per-language overrides → a resolved document. **Per-key fallback** means a language
can translate only some fields; the rest fall back to the base. `headings` lets a
language swap individual `h2` text without re-sending the whole `blocks` array.

```ts
import type { LocalizedBody, LocalizedBodyOverride } from './types'

export function resolveLocalizedBody<TOverride extends LocalizedBodyOverride>(
  base: LocalizedBody, override: TOverride | undefined,
): LocalizedBody {
  const blocks = override?.blocks
    ?? (override?.headings
      ? base.blocks.map(b =>
          b.kind === 'h2' && override.headings?.[b.text]
            ? { ...b, text: override.headings[b.text] } : b)
      : base.blocks)
  return { blocks, faq: override?.faq ?? base.faq }
}

export function resolveFields<TBase, TOverride, TFields extends readonly (keyof TBase & keyof TOverride)[]>(
  base: TBase, override: TOverride | undefined, fields: TFields,
): Pick<TBase, TFields[number]> {
  const result = {} as Pick<TBase, TFields[number]>
  for (const field of fields) result[field] = (override?.[field] ?? base[field]) as never
  return result
}

export function resolveEntry<
  TBase extends LocalizedBody, TOverride extends LocalizedBodyOverride,
  TFields extends readonly (keyof TBase & keyof TOverride)[],
>(base: TBase, overridesByLang: Record<string, TOverride> | undefined, lang: string, fields: TFields):
  Pick<TBase, TFields[number]> & LocalizedBody {
  const override = overridesByLang?.[lang]
  return { ...resolveFields(base, override, fields), ...resolveLocalizedBody(base, override) }
}
```

### 4.5 `lib/content/create-content-post.tsx` — the POST factory

One technology for every post format (news/blog/document). A `format` preset carries
the only real per-type differences — the JSON-LD type and the author kind — and
everything else renders through the same `StandardContentPage`. The factory never
reads a data file; it takes a co-located `resolve(lang)`.

```ts
export type PostFormat = 'news' | 'blog' | 'document'

const JSONLD_TYPE: Record<PostFormat, 'NewsArticle' | 'BlogPosting' | 'TechArticle'> = {
  news: 'NewsArticle', blog: 'BlogPosting', document: 'TechArticle',
}
const AUTHOR_KIND: Record<PostFormat, 'person' | 'organization'> = {
  news: 'person', blog: 'organization', document: 'person',
}

export type ContentPost = {
  title: string; seoTitle?: string; subtitle?: string; description: string
  keywords?: string; tags: string[]; date: string; readingMinutes: number
  authorName?: string; blocks: Block[]; faq?: FaqPair[]
  ogImage?: string; heroImage?: string; hero?: ReactNode; inLanguage?: string
}

export type ContentPostConfig = {
  format: PostFormat
  subPath: string                                   // '/news/<slug>'
  resolve: (lang: string) => ContentPost            // co-located resolver
  chrome: (lang: string, post: ContentPost) => { breadcrumbs: Breadcrumb[]; backHref: string; backLabel: string }
  titleSuffix: (lang: string) => string
  minLabel?: (lang: string) => string
}

export function createContentPost(config: ContentPostConfig) {
  // returns { generateMetadata, Page }
  // generateMetadata: title/description/keywords/alternates + OpenGraph + Twitter,
  //   og:image = explicit ogImage ?? visible heroImage (never an empty snippet).
  // Page: emits JSON-LD [Article-by-format, BreadcrumbList, FAQPage?] + a byline
  //   (author · date · reading time) and renders <StandardContentPage … />.
}
```

> Full source: `lib/content/create-content-post.tsx`. The body is ~200 lines of
> pure boilerplate (metadata + JSON-LD + byline) that every post would otherwise
> repeat; centralizing it is what makes a post folder a ~10-line `_components` +
> data only.

### 4.6 `lib/content/create-content-page.tsx` — the PAGE factory

Sibling of the post factory, for **standalone content pages** (the deployment
targets). Same idea: a descriptor + chrome + meta → `{ generateMetadata, Page }`,
rendered through `StandardContentPage`. Adds two slots a marketing page wants: a
`hero` override (e.g. an interactive carousel in place of a static image) and a
`sections` slot injected directly above the FAQ.

```ts
export type ContentPageContent = {
  title: string; seoTitle?: string; subtitle?: string
  description: string; keywords: string; blocks: Block[]; faq?: FaqPair[]
}
export type ContentPageChrome = { breadcrumbs: Breadcrumb[]; backHref: string; backLabel: string }

export type ContentPageConfig<C extends ContentPageContent> = {
  resolve: (lang: string) => C
  chrome: (lang: string, content: C) => ContentPageChrome
  meta: { subPath: string; ogImage: string; heroImage?: string; tags?: readonly string[] }
  jsonLdType?: 'Article' | 'NewsArticle'
  sections?: (lang: string) => ReactNode    // injected ABOVE the FAQ
  hero?: (lang: string) => ReactNode         // overrides meta.heroImage
}

export function createContentPage<C extends ContentPageContent>(config: ContentPageConfig<C>) {
  // returns { generateMetadata, Page }: same metadata + JSON-LD discipline as the
  // post factory, rendering <StandardContentPage … hero sections /> .
}
```

> Full source: `lib/content/create-content-page.tsx`. **It is shared engine, not a
> deployments-private helper** — any content page in any tab imports it from
> `@/lib/content/create-content-page`, exactly like the post factory.

### 4.7 `components/content-page/standard-content-page.tsx` — the template

The ONE template every page renders through. It owns the fixed page standard so a
route only supplies data: breadcrumbs → max-size H1 → table of contents (built from
the `h2` blocks, anchors matching `PostBody`) → body → `sections` slot → sponsorship
(baked into every page) → FAQ (last content section) → back link (absolute last).
Fully server-rendered; readable with JS off.

```ts
export type StandardContentPageProps = {
  lang: string
  breadcrumbs: Breadcrumb[]               // last item = current page
  tags?: string[]
  title: string; subtitle?: string
  author?: { name: string; role: string; url?: string }
  metaLine?: ReactNode                    // post byline override
  heroImage?: string; heroAlt?: string; hero?: ReactNode
  blocks: Block[]; faq?: FaqPair[]
  backHref: string; backLabel: string
  sections?: ReactNode                    // injected above the FAQ
}

export function StandardContentPage(props: StandardContentPageProps) { /* … layout … */ }
```

The table of contents is derived, not authored:

```ts
const toc = blocks
  .filter((b): b is { kind: 'h2'; text: string } => b.kind === 'h2')
  .map(b => ({ id: headingId(b.text), text: b.text.replace(/\*\*/g, '') }))
```

> Full source: `components/content-page/standard-content-page.tsx` (~240 lines of
> layout). Because it is shared, the bottom-order contract (sponsors → FAQ → back
> link) cannot drift per page.

### 4.8 `components/content-page/post-body.tsx` — the block renderer

A thin dispatcher over the shared block registry. Every content surface renders
blocks identically; a new block kind is added in one place (the registry), not per
page. `headingId` is re-exported so the TOC builder and the renderer agree on
anchors.

```ts
import type { Block } from '@/lib/content/blocks/types'
import { getPostBodyUi } from '@/lib/content/post-body-ui'
import { renderBlocks } from '@/lib/content/blocks/registry'

export { headingId } from '@/lib/content/blocks/inline'

export function PostBody({ blocks, lang = 'en' }: { blocks: Block[]; lang?: string }) {
  const ui = getPostBodyUi(lang)
  return <div className="flex flex-col gap-6">{renderBlocks(blocks, lang, ui)}</div>
}
```

---

## 5. The per-tab files — source of each component

### 5.1 `_lib/post.ts` — the tab's functions (news)

Co-located helpers map a post's `_data` (meta + en + overrides) into the normalized
`ContentPost` the factory renders, and into the compact list item the index lists.
No central registry: the index reads the auto-generated `POSTS`.

```ts
import { resolveEntry } from '@/lib/content/resolve'
import type { NewsArticleBase, NewsArticleMeta, NewsArticleOverride } from './types'
import type { ContentPost } from '@/lib/content/create-content-post'

const FIELDS = ['title', 'seoTitle', 'subtitle', 'description', 'summary', 'keywords'] as const

export type NewsData = { meta: NewsArticleMeta; en: NewsArticleBase; overrides?: Record<string, NewsArticleOverride> }

const resolve = (d: NewsData, lang: string) => resolveEntry(d.en, d.overrides, lang, FIELDS)

export function newsPost(data: NewsData, lang: string): ContentPost { /* meta+resolved → ContentPost */ }
export function newsListItem(data: NewsData, lang: string) { /* {slug,date,readingMinutes,title,summary} */ }
export function newsList(posts: NewsData[], lang: string) {
  return posts.map(d => newsListItem(d, lang)).sort((x, y) => (x.date < y.date ? 1 : -1))
}
```

### 5.2 `_lib/types.ts` — the tab's contracts (news)

```ts
import type { LocalizedBody, LocalizedBodyOverride } from '@/lib/content/types'

export type NewsArticleMeta = { slug: string; date: string; readingMinutes: number; tags: string[]; author?: { name: string; role: string }; heroImage?: string; ogImage: string }
export type NewsArticleBase = LocalizedBody & { title: string; seoTitle?: string; subtitle?: string; description: string; summary: string; keywords?: string }
export type NewsArticleOverride = LocalizedBodyOverride & { title?: string; seoTitle?: string; subtitle?: string; description?: string; summary?: string; keywords?: string }

// UI chrome is DATA (lives in ../_data); this is only its CONTRACT.
export type NewsUi = { metaTitle: string; metaDescription: string; eyebrow: string; indexTitle: string; indexIntro: string; breadcrumbNews: string; minRead: string; tocHeading: string; faqHeading: string; backToNews: string; titleSuffix: string }
```

### 5.3 `_data/` — the tab's data

UI chrome (data) as per-language files + an index public API:

```ts
// _data/en.ts  — base language
import type { NewsUi } from '../_lib/types'
export const en: NewsUi = { metaTitle: 'News | Fractera', /* … */ }

// _data/ru.ts  — language override (same shape)
import type { NewsUi } from '../_lib/types'
export const ru: NewsUi = { metaTitle: 'Новости | Fractera', /* … */ }

// _data/index.ts — folder public API: getNewsUi(lang) with EN fallback
import { en } from './en'; import { ru } from './ru'
import type { NewsUi } from '../_lib/types'
const UI: Record<string, NewsUi> = { en, ru }
export function getNewsUi(lang: string): NewsUi { return UI[lang] ?? UI.en }
```

A post's `_data` (one folder per post):

```ts
// <slug>/_data/meta.ts  — non-translatable
export const meta: NewsArticleMeta = { slug: '…', date: '2026-06-22', readingMinutes: 6, tags: […], ogImage: '/…' }
// <slug>/_data/en.ts    — full base document (title/seo/…/blocks/faq)
export const en: NewsArticleBase = { title: '…', description: '…', summary: '…', blocks: [ … ], faq: [ … ] }
// <slug>/_data/ru.ts    — partial override (localized fields only)
export const ru: NewsArticleOverride = { title: '…', /* some fields */ }
// <slug>/_data/index.ts — assemble the data object parser-fs imports
export const data: NewsData = { meta, en, overrides: { ru } }
```

### 5.4 `_components/index.tsx` — the tab's view (a post)

The whole post is data-only; the entry just wires the co-located resolver into the
factory:

```ts
import Entry, { generateMetadata } from './_components'  // page.tsx
// _components/index.tsx:
const page = createContentPost({
  format: 'news',
  subPath: `/news/${data.meta.slug}`,
  resolve: lang => newsPost(data, lang),
  chrome: (lang, post) => ({ breadcrumbs: […], backHref: `/${lang}/news`, backLabel: getNewsUi(lang).backToNews }),
  titleSuffix: lang => getNewsUi(lang).titleSuffix,
})
export const generateMetadata = page.generateMetadata
export default page.Page
```

And the thin route file is always the same two lines:

```ts
// <slug>/page.tsx
import Entry, { generateMetadata } from './_components'
export { generateMetadata }; export default Entry
```

---

## 6. Authoring recipes

**Add a post to an existing tab** — create one folder and nothing else:

```
app/[lang]/news/<new-slug>/
  page.tsx                 (the 2-line re-export)
  _components/index.tsx    (createContentPost({ … }))
  _data/{meta,en,index}.ts (+ ru.ts if localized)
```

`gen:lists` regenerates `_list.generated.ts`; the index picks it up. **No registry,
no list edit.** Deleting the folder removes the post everywhere.

**Add a standalone page to a map tab** — same shape with `createContentPage` and a
full `_data/{meta,en,index}` (the deployments `local`/`mcp`/`vps` pattern).

**Add a new tab** — section 7.

**Verify (Windows):** `npm run gen:lists` → `npx tsc --noEmit` → `npx eslint <files>`.
Never `npm run build` on Windows; never a dynamic `[slug]`; never a central registry.

---

## 7. Scaling to a new surface — worked example: Shop + Product Card

> This section is the "thinking template": follow it to add **any** new content type.
> A storefront with product-card pages is the same engine with a shop-shaped `_lib`
> and one new block.

**1. The tab folder (mirror of a collection tab):**

```
app/[lang]/shop/
├── page.tsx                  thin router (re-export _components)
├── _components/index.tsx     storefront grid: reads POSTS + shopList; cards link to products
├── _lib/
│   ├── post.tsx              productCard(data) → ContentPost-like; shopListItem/shopList (price/sort)
│   └── types.ts              ShopData (sku, price, currency, gallery, specs, blocks…), ShopUi
├── _data/{en,ru,index.ts}    storefront UI chrome + getShopUi(lang)
├── _list.generated.ts        AUTO
└── <product-slug>/
    ├── page.tsx              thin re-export
    ├── _components/index.tsx createContentPage({ resolve, meta, chrome, sections: buyBox })
    └── _data/{meta,en,index.ts}  product: meta (sku/price/ogImage), en (title/specs/blocks/faq)
```

**2. One line in `lib/parser-fs.mjs`:**

```js
{ dir: 'app/[lang]/shop', type: 'ShopData', typeModule: './_lib/post' },
```

**3. Reused from the shared engine — unchanged:** `createContentPage` (the product
page), `StandardContentPage` (layout/SEO/JSON-LD), `PostBody` + the block registry,
`resolveEntry` (localized product copy), `parser-fs` (the product list), `lib/brand`
/`author`/`seo`. The storefront index reuses the same "read `POSTS`, map to list
items, render" shape as `/news`.

**4. Genuinely shop-specific — additive only:**
- `_lib/types.ts`: `ShopData` (sku, price, currency, gallery, specs) — a new
  contract, touches nothing else.
- A `price`/`buy` **block** added to the neutral catalog (`lib/content/blocks/types.ts`
  + a renderer in the registry) — every surface can now use it; product cards do.
  A `buyBox` injected via the `sections` slot for the add-to-cart CTA.
- Product JSON-LD: pass `jsonLdType` or extend the factory's preset map with a
  `'Product'` entry — the same pattern as adding `'document'` was.

Nothing central is rewritten; the storefront is purely additive and individually
deletable. The exact same recipe yields a changelog, a glossary, a careers board —
any "list of documents + a document page" surface.

---

## 8. Why this architecture wins — scaling & token economy

> This section is a dedicated **researcher pass**: every claim below was verified
> against the real repository (file paths are cited inline). It proves two theses —
> the engine scales to new content types at near-constant marginal cost, and it
> bounds the token cost an AI agent pays per edit. The Shop walkthrough in §7 is the
> applied form of the same argument.

### 8.1 Why this scales: adding a content type is purely additive

**Adding a new post** to an existing tab creates exactly one folder —
`app/[lang]/news/<slug>/` — containing `page.tsx` (the 4-line re-export, verbatim
from every other post), `_components/index.tsx`, and `_data/{meta,en,ru,index}.ts`.
**Zero existing files are edited.** The index page does not learn about the new post
by anyone editing a list: `lib/parser-fs.mjs` scans the tab directory at build time
(`predev`/`prebuild`) and emits `_list.generated.ts` — a static
`import { data as p0 } from './<slug>/_data'` per folder plus a `POSTS` array. That
file is `AUTO-GENERATED … DO NOT EDIT` and gitignored. Discovery is the filesystem;
the registry is regenerated, never maintained.

**Adding a whole new tab** is the same shape one level up: create
`app/[lang]/<tab>/` with its `_lib/{post,types}`, `_data`, `_components` and post
folders, then add **one line** to the `COLLECTIONS` array in `lib/parser-fs.mjs`.
That single `{ dir, type, typeModule }` entry is the only edit outside the new
folder.

Contrast the classic anti-pattern this avoids: a central `posts.ts` registry every
author appends to (merge-conflict hotspot, lock-step coupling), a dynamic
`[slug]/page.tsx` doing runtime lookup, and a shared god-`types.ts` every author must
touch. Here the engine's types are *imported*, not extended: `news/_lib/types.ts`
composes the neutral `LocalizedBody`/`LocalizedBodyOverride` from
`lib/content/types.ts`, and `blocks/types.ts` has **zero imports** (a deliberate leaf
of the import graph). A new language is a new `<lang>.ts` override file —
`resolveEntry` falls back per-field to EN — so no existing data file is touched.

The capstone invariant is **"deletable without orphans"**: every helper a tab needs
is co-located in its own `_lib`. Delete `app/[lang]/news/` and the route, its view,
its data and its helpers vanish together; `lib/content/` stays because it belongs to
no single tab. There is no central reference to clean up because none was created.

### 8.2 Why it saves tokens for AI agents

An agent's context cost is dominated by *which files it must load to act safely*.
This layout bounds that working set structurally.

- **Editing one post loads one folder.** To change an article the agent reads
  `app/[lang]/news/<slug>/_data/{en,meta}.ts` — a small, predictable set. It never
  greps a sprawling `lib/` or a central registry to find where the post is "wired in,"
  because there is no wiring: `parser-fs` does discovery at build time. The strict
  `_lib`/`_data`/`_components` split lets the agent navigate by intent, not
  exploration: *change copy → `_data`; change behavior/types → `_lib`; change view →
  `_components`*. The right file is named, not hunted.
- **The neutral catalog removes duplicate type definitions.** All tabs render through
  the same `Block` union and the same `StandardContentPage`. An agent that read
  `lib/content/blocks/types.ts` once knows the authoring vocabulary for *every* tab.
  Adding a block kind is two edits in one place (`blocks/types.ts` + `registry.tsx`).
- **Delete is one folder, no orphan hunt.** Because of the deletable-without-orphans
  invariant, "remove this content" is `rm -rf <folder>` — the agent need not load
  `lib/` to verify it left no dangling import. That eliminates the single most
  expensive class of agent task: cross-repo reference tracing.

Order-of-magnitude (illustrative, not measured): a registry-based design forces ~3–5
files per post edit (the post body, the central registry, possibly a shared types
file, the dynamic route) plus exploratory greps to locate them — easily thousands of
lines in context. Here a post edit touches **1–2 files in a known folder**, and a new
post touches **0 existing files**. Files-touched-per-task and lines-loaded-per-task
both collapse toward O(1).

---

## 9. Invariants checklist (do not violate)

- `page.tsx` is always thin (re-export from `_components`); composition lives in `_components/index.tsx`.
- `_lib` = functions + type contracts · `_data` = data (incl. localized UI strings) · `_components` = view.
- Shared engine (`lib/content`, `components/content-page`) is reused, never copied into a tab's `_lib`.
- Block types come from the neutral `@/lib/content/blocks/types`; a tab-local alias goes in the tab's `_lib/types.ts`.
- Imports inside a tab are relative (`../_lib/post`, `../_data`); `parser-fs` `typeModule` is `./_lib/post`.
- `_list.generated.ts` is auto-generated — never hand-edit, never hand-maintain a list.
- No dynamic `[slug]`, no central registry, no `force-dynamic` — static-first, works with JS off.
- Deletability: removing a tab folder must leave zero references behind in `lib/` or the root.

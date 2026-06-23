# Shell Component Architecture (step 101.A)

**Status: ACTIVE — authoritative for all work in `app/` (the Shell layer).**
Read before touching any page, route or component. The `/architecture` page is the
machine-checked mirror of these rules: it scans the code and flags every drift.

## Why this exists

A convention that is only *described* drifts on the first agent that doesn't read
it. So the pattern is enforceable, not aspirational: each rule below maps to a fact
the scanner derives from the code, and the `/architecture` detail panel surfaces any
violation as `drift`. Pattern first, documentation second.

## The route folder

Every route is a folder. Its shape is fixed:

```
app/<route>/
  page.tsx          server, thin — renders only the entry component
  _meta.ts          authored metadata (satisfies RouteMeta)
  _components/       how the route LOOKS (presentation)
    index.tsx       the entry component (server by default)
    *.client.tsx    interactive leaves
    *.server.tsx    server-only leaves
    types.ts        local types (no directive)
  _data/            what the route SHOWS (content/data) — see rule 8
    index.ts        public API of the data module
    *.ts            content modules (e.g. i18n en.ts/<lang>.ts, meta.ts)
```

API routes use `route.ts` in place of `page.tsx` and rarely need `_components/`.
Files/folders prefixed `_` are Next.js private — excluded from routing.

## Root layout zones (who owns `<html>`)

Above the route folders sits the layout hierarchy. The **root `app/layout.tsx` is a
bare pass-through** (`return children` + global CSS) — it renders no `<html>/<body>`
and calls no Dynamic API, so it never forces the tree dynamic and never locks one
`<html lang>` for every language. Each **zone** owns its own `<html>` via a route-group
layout (Next.js "multiple root layouts"):

```
app/
  layout.tsx     → return children;                         (bare root — owns nothing)
  [lang]/layout  → <html lang={validLang}>  (route param, VALIDATED) — public, SSG/ISR
  (service)/layout → <html lang="en">       (architect-only zone; route group invisible in URL)
```

`<html lang>` belongs to the zone that knows the language (the `[lang]` segment), never
the shared root — a config-derived `<html lang>` in the root is the "language locked to
full route depth" anti-pattern. Full rationale, the anti-pattern, and the validate-don't-
trust rule: [`static-first.md` §1b](./static-first.md). Canon: [`STATIC-FIRST.md`](../../STATIC-FIRST.md).

## Rules

1. **`page.tsx` is a thin Server Component.** Never `"use client"`. It returns the
   entry component and nothing else — no state, no markup, no data shaping.
   *Detected:* `isClientComponent` on a page = violation.

2. **The entry is `_components/index.tsx`.** `page.tsx` imports it as `./_components`.
   Server by default; a `"use client"` entry is allowed only for instrumental pages
   (`/ai-core`, `/architecture`, `/debug`) where there is no SEO to protect.
   Server-side data loading belongs here.
   *Detected:* `entryComponent`, `entryIsClient`.

3. **Route-local components live in `_components/`.** A component used by exactly one
   route stays beside it. Don't lift to the shared folder pre-emptively.

4. **Shared components live in `app/components/`.** Promote a component there the
   moment a second route consumes it — not before.

5. **Leaf components carry a boundary suffix:** `*.client.tsx` or `*.server.tsx`.
   The suffix is a human/agent/lint convention; the real boundary is the
   `"use client"` directive — the two must agree (`.client` ⇒ directive present;
   `.server` ⇒ absent). `index.tsx` keeps its name (its boundary shows as
   `entryIsClient`).
   *Detected:* suffix/directive mismatch = drift.

6. **`app/components/ui/` is exempt.** These are vendored shadcn/ui primitives —
   keep their upstream names (no suffix) so they stay upgradable.

7. **`_meta.ts` is the standard route descriptor.** `const meta: RouteMeta = { … }`
   (`@/lib/architecture/route-meta`). `RouteMeta` is ONE maximal superset that
   describes any route — present or long-term, including a route only *declared*
   and not built yet (`status: "requested"`, §3.11). A declared route carries its
   build intent in `todo: string[]` (free-form tasks): the owner declares a page
   from the architect, an agent reads `todo`, opens a step, plans and builds it,
   then clears the list. **Every key is always present;
   do not delete fields** — express "not applicable" with `undefined` / `[]` /
   `null`. The scanner fills/cross-checks the mechanical fields (path, client/server,
   methods, boundaries…) and flags any mismatch with the authored values as `drift`.

8. **Route content/data lives in `_data/`.** Presentation (`_components/`) and content (`_data/`) are physically
   separated: `_data/` holds the route's content modules — i18n content (`en.ts` + per-language `<lang>.ts` resolved with
   the shared resolver), non-translatable `meta.ts`, and an `index.ts` that exposes the resolver as the folder's public API.
   The entry imports content from `../_data`, not from `_components`. Benefit: deleting a route folder removes its route,
   presentation AND data together — no orphans — and a page is authored as data (edit `_data`, not the component). Tiny,
   page-local types may still sit in `_components/types.ts`; substantive content belongs in `_data/`. (Standardized
   alongside FES; detailed cross-project sync to follow when the shared page templates land here.)

9. **Collections / index (router) pages use a `_list.ts` layer.** Every post (news/blog/doc) is itself a full route folder
   (`page.tsx` + `_components/` + `_data/`) — an exact copy of the page standard, no dynamic `[slug]`, no central registry.
   The index/router page where a visitor picks a post (`/news`, `/documentation`) carries a `_list.ts` next to its `page.tsx`:
   ```
   app/<collection>/
     page.tsx        thin: renders the list from _list.ts
     _list.ts        static manifest — IMPORTS each post's _data and emits list items
     <slug-1>/ page.tsx + _components/ + _data/
     <slug-2>/ page.tsx + _components/ + _data/
   ```
   **`_list.ts` imports each post's `_data` — it never hand-copies titles/summaries.** The post stays the single source of
   truth; the list derives `{ slug, date, title, summary, tags/badges… }` from it. Without `_list.ts` the post is
   unreachable from the index, so it is a required layer. Lifecycle: add a post = create its folder + one import line in
   `_list.ts`; delete a post = delete its folder + remove its line (drops out of page AND index). (Standardized alongside FES.)

10. **The collection list is auto-generated, not hand-written (`parser-fs`).** A single universal, config-driven build-time
    generator (`lib/parser-fs.mjs`, plain Node ESM) scans each collection folder for post folders (those with `_data/index.ts`)
    and emits a gitignored `_list.generated.ts` (static imports + a `POSTS` array). The router page's `_components/index.tsx`
    reads `POSTS`; the domain helper aggregates/localizes it. It runs on `npm prebuild`/`predev`, so the runtime stays fully
    static (Turbopack only — no webpack `require.context`, no runtime dynamic import). Add a tab = one entry in the generator's
    `COLLECTIONS` (its posts must be co-located). Net effect: creating/deleting a post folder is all you do — no human or agent
    ever edits a list. This supersedes the hand-written `_list.ts` in rule 9. The router page itself follows the route-folder
    standard: thin `page.tsx` + `_components/index.tsx` (which reads the generated `POSTS`).

## The contract

The single source of types is `app/lib/architecture/route-meta.ts`:

- `RouteMeta` — the maximal standard descriptor (~45 fields, grouped: identity &
  lifecycle, access, routing shape, rendering & caching, SEO, i18n, inputs,
  composition, boundaries, API, knowledge, audit). Every key is mandatory; N/A is
  a value (`undefined`/`[]`/`null`), never an omission. The annotation
  `const meta: RouteMeta = { … }` forces a route to fill the whole standard.
- `RouteInfo = RouteMeta & { drift: string[] }` — what the panel renders: the
  standard plus the scanner's drift between authored values and the code.

The standard is append-only: extend it with new fields, never trim existing ones —
old descriptors must keep validating.

## Example — `/dashboard` (reference refactor)

`page.tsx`
```tsx
import DashboardEntry from "./_components"
export default function Page() { return <DashboardEntry /> }
```

`_components/index.tsx`
```tsx
import { DashboardApp } from "./dashboard-app.client"
export default function DashboardEntry() { return <DashboardApp /> }
```

`_meta.ts` (every key of the standard present — abridged here; see the full file
for all ~45 fields)
```ts
import type { RouteMeta } from "@/lib/architecture/route-meta"
const meta: RouteMeta = {
  kind: "page", path: "/dashboard", filePath: "app/app/dashboard/page.tsx",
  status: "live",
  visibility: "private", roles: ["user", "admin"],
  unauthorizedRedirect: "/register?requireRole=user", enforcedBy: "component",
  rendering: "dynamic", runtime: "nodejs",
  seo: { supportsSeo: false, indexable: false, inSitemap: false, /* …rest */ },
  entryComponent: "_components/index.tsx", pageIsClient: false, entryIsClient: false,
  description: "Product catalogue demo — DB + media upload.",
  // …all remaining keys present, undefined / [] / null when not applicable
}
export default meta
```

Interactive state lives in `dashboard-app.client.tsx`; the form and table are
client leaves (`product-form.client.tsx`, `product-table.client.tsx`). The page
and the entry stay server; only the leaves that need state carry `"use client"`.

# Static-first rendering — the how-to (raw standard)

> **Canon (short form):** `STATIC-FIRST.md` at the project root — read it first. This document is the deep
> how-to: exactly *how* to keep pages static/ISR, how time-based ISR sleeps and refreshes lazily, how a
> private page stays static, and how to migrate a tree that was wrongly made dynamic. Grounded in the
> reference implementation `Documents/fractera/22slots-main/app`.
>
> **Why this lives in the standard set.** A canon that only says "be static" drifts. This file gives the
> mechanical recipe so any agent produces a static-first route by construction, and so a reviewer can prove
> a page is cheap to serve rather than hope it is.

---

## §0. The rule and the one exception (recap)
Creating a dynamic page is forbidden; the only exception is **absolute necessity after the architect's
double confirmation** — better nothing than a needless dynamic page. The foundation is **no-JS**: the App
Router ships full server HTML, and the real no-JS killer is client-side routing / a client component that
owns a route — not SSR. A page may be dynamic **only when its access is architect-only** (the service
cockpit: `/architecture`, `/ai-core`, `/ai-draft-settings`, `/development-steps`, `/patterns`, `/glossary`,
`/documents`, `/debug`).

---

## §1. The reference pattern (22slots)
Every localized content route in `22slots-main/app/[lang]/…` declares three things, and nothing forces the
root dynamic:

```ts
// app/[lang]/.../page.tsx
export const revalidate = 600            // time-based ISR (see §2a for how this actually behaves)
export const dynamicParams = true        // render an unlisted param on demand, then cache it

export async function generateStaticParams() {
  return existingEntries.map(({ lang, slug }) => ({ lang, slug }))   // pre-build the known pages
}
```

This is the target shape for FNS `app/[lang]/…`.

---

## §2. Classify every route before you set a render mode
For each route under `app/`, pick one — by construction, in `_meta.ts` (`rendering`) and on the page:

| Access | Render | How |
|---|---|---|
| Public content (`[lang]` home, articles, user-built content) | **SSG / ISR** | `generateStaticParams` + `revalidate = N` (+ `dynamicParams`). No dynamic markers. |
| Private but no server data at render (e.g. `/dashboard`) | **SSG (static shell)** | Gate client-side: `enforcedBy: "component"`, the client island reads `/api/me` (`useRouteAccess`); data via authenticated `/api/*`. Page stays static. |
| Architect-only service cockpit | **dynamic (allowed)** | `export const dynamic = "force-dynamic"` on that **one** page, never the root. |

**Key insight — "private" does not mean "dynamic".** A private page is kept private by a client guard that
redirects the unauthenticated plus server-authenticated APIs for the actual data; the page shell itself
carries no secret, so it can be fully static. Never use `auth()`/`cookies()`/`headers()` in a page to
enforce access — that silently breaks static/ISR; use the client guard + protected API.

---

## §2a. The content-actualization ladder (how content reaches a page, and what it costs)
Five ways to get content onto a page, differing in **when a change appears**, **DB queries per visit**,
**whether they need JavaScript**, and **server compute** — the last column being the real monthly bill.

| Strategy | When a change appears | DB / visit | Needs JS | Server cost | Use for |
|---|---|---|---|---|---|
| **Static (SSG)** | on redeploy | none | no | lowest | build-time content |
| **ISR, time-based** (`revalidate = N`) | within N s, lazily | ~1 per N window\* | no | low | **the default** for most content |
| **ISR + on-demand** (`revalidate = false` + `revalidateTag`) | instant, on change | 1 per actual change | no | low + instant | optional: a page needing zero-delay freshness |
| **Dynamic SSR** (`force-dynamic`) | every request | every request | no (SSR ships HTML) | **high** — per-request compute + DB | architect-only cockpit (the exception) |
| **Client fetch** (`fetch('/api/…')` in a client island) | every view | every view | **yes** (no JS → no data) | medium — per-view API+DB | private panels (Dashboard), **not** public lists |

\* **Lazy and traffic-bound.** A page re-renders only when it is *requested* after its N-second window, and
only that page. With no traffic the server sleeps — a page nobody visits is never re-rendered. There is no
clock rebuilding the whole site.

Read the table top-to-bottom as *cheapest → most expensive per visitor*. The canon is a push **up** this
ladder: default to time-based ISR for public content, drop down only with a reason (and architect approval
for `force-dynamic`).

---

## §3. How time-based ISR behaves (the default) — and the optional instant path
**Time-based ISR is the recommended default for public content.** You set `export const revalidate = N`:

- The page is generated once and served from cache. **While nobody visits, the server does nothing — it sleeps**, for an hour or a year.
- When a visitor arrives after the window has passed, they are served the cached page **instantly**, and that **one** page is regenerated in the background; the next visitor sees the fresh version (stale-while-revalidate).
- **Only the requested page regenerates.** Unvisited pages are never touched. The cost is bounded by real traffic, not by page count.

```ts
// app/dogs/page.tsx — two dogs today; add a third, and the next visit after the window rebuilds THIS page
export const revalidate = 600   // at most one rebuild per 10 min, per page, only on traffic
export default async function Page() {
  const dogs = await db.query("SELECT * FROM dogs")  // runs only during a (rare) regeneration
  return <DogList dogs={dogs} />
}
```

The one honest cost: a page visited constantly but changed rarely still rebuilds once per window even when
unchanged — a small, traffic-bounded price, and the accepted trade.

**Optional — on-demand revalidation (instant, but you must wire it).** When a specific page cannot tolerate
any delay, set `revalidate = false` (it never refreshes on its own) and purge it from the handler that
changes the data:

```ts
import { revalidateTag } from "next/cache"
await db.prepare("INSERT INTO dogs …").run(…)
revalidateTag("dogs")   // with revalidate=false on the page, the next visit shows the new dog instantly
```

The catch — and why this is opt-in, not the default — is discipline: call the purge on **every** write or
the page freezes (two dogs forever). Time-based ISR is the default precisely because it is self-correcting
and needs no wiring. Never re-introduce a root-level `force-dynamic` to solve a freshness problem.

---

## §4. Migrating an inherited-dynamic tree (the FNS fix)
When a root `force-dynamic` was hiding the real render mode of every page:

1. **Remove** `export const dynamic = "force-dynamic"` from `app/layout.tsx` (and `app/manifest.ts`).
2. **Walk every route** and apply §2: public → SSG/ISR (`revalidate = N`); private-no-server-data → static +
   client guard; architect-only → explicit per-page `dynamic`.
3. For `app/[lang]/…` add `revalidate = N` + `dynamicParams = true` (`generateStaticParams` is already on
   `[lang]/layout.tsx`).
4. Update each `_meta.ts` `rendering`/`revalidate` to match reality (the scanner cross-checks this).
5. **Verify on a real build** (architect — no `next build` on Windows): the build output must show the
   `[lang]` and public routes as static/ISR (`○`/`●`/ISR), not `ƒ (Dynamic)`; service pages may be `ƒ`.
6. **no-JS smoke test:** disable JavaScript → public pages render full content; JS-only widgets may degrade.

---

## §4a. JS-gated animations break no-JS — and need recorded consent
SSG/ISR is necessary but **not sufficient** for no-JS: a statically generated route can still paint
**invisible**. The trap on this product was framer-motion `initial={{ opacity: 0 }}` + `animate={{
opacity: 1 }}` on the home blocks — framer-motion writes the *initial* state into the SSR HTML, so the
server shipped every element at `opacity:0` and the page only appeared after hydration ran the enter
animation. JS off (or hydration stalls) → **white screen** (17 `opacity:0` blocks in the SSR HTML).
Fix: `initial={false}` → elements mount at the visible `animate()` target (SSR `opacity:0`: 17 → 0).

**Rule.** Content is visible in server HTML without JS; entrance/scroll motion is **progressive
enhancement only** and must never ship content hidden. Forbidden by default: framer-motion `initial={{
opacity: 0 }}`, CSS starting at `opacity:0`/`visibility:hidden` revealed by JS. Use `initial={false}`,
CSS that animates **from visible**, or `whileInView` with a visible base state.

**Override = informed, recorded consent** (same class as a dynamic page). If the owner insists on a
JS-gated entrance animation, the agent must: (1) **explain the risks explicitly** — white screen with
JS off; blank to JS-less crawlers/AI bots (SEO/GEO); total loss if hydration ever fails; FOIC + worse
LCP; accessibility/reduced-motion harm; (2) **require explicit confirmation after** the risks are on
record; (3) **record the consent** — timestamp, who approved, exact scope — in the page/component
`_meta.ts` (`noJsConsent: { by, at, scope, reason }`) and/or the `STATIC-FIRST.md` override log. An
undocumented JS-gated animation is a bug, treated like an undocumented `force-dynamic`. Full canon —
`STATIC-FIRST.md` "The animation trap".

## §5. Verification checklist
- `grep` for `force-dynamic`: only on architect-only pages (and API routes), never the root layout.
- Build output: public + `[lang]` routes are static/ISR.
- JS disabled: `/`, `/<lang>` render complete HTML.
- **No JS-gated visibility:** the SSR HTML has **no content shipped at `opacity:0`/`visibility:hidden`**
  (`curl <page> | grep -c opacity:0` → 0 for content); any entrance animation is progressive-enhancement
  only, or carries a recorded `noJsConsent` (§4a).
- A private page (`/dashboard`) renders its static shell with JS off and gates/loads via client + API once JS runs.
- With no traffic the server is idle; a content change appears on the next visit after the revalidate window.
- Every changed `_meta.ts` `rendering` field matches the page's real mode.

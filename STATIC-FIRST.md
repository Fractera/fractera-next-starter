# STATIC-FIRST — the canon: "better nothing than a dynamic page"

> One source for this rule so it cannot drift across agents. Referenced from every instruction doc
> (`CLAUDE.md` / `AGENTS.md` / `GEMINI.md` / `QWEN.md` / `KIMI.md`, §4). Deep how-to —
> `CRUD-DOCS/workspace-standards/static-first.md`. Reference implementation — `Documents/fractera/22slots-main/app`.

## The rule (verbatim)
**Creating a dynamic page is FORBIDDEN.** The only exception: when it is ABSOLUTELY necessary, and only
after the architect's **DOUBLE** confirmation. Principle: **better to build nothing than to make a page
dynamic where it could have been static.** When in doubt you do not have permission — you have a question
for the architect.

## Why this is non-negotiable — the product must work with JavaScript OFF
The Next.js App Router fetches data on the server and ships complete HTML. A visitor with JS disabled — a
crawler, reader-mode, a locked-down browser, a slow network before hydration — must still get the full
page. JS-dependent extras (a live switcher, a drag handle) may degrade; that is acceptable. Everything that
*can* work without JS *must* keep working. A site that only renders once JS boots is broken for a real
slice of its audience and for every machine reader.

**Precise mechanism (so no one wriggles out of it):** the thing that breaks no-JS is **client-side routing /
a client component that owns a route** — not server rendering by itself. So the canon is not "never SSR";
it is: routing is server-generated, a route is never owned by a client component, and the overwhelming
majority of content is **SSG/ISR**. Static-first also buys predictable SEO/GEO, cheap caching and
reproducible builds.

## The only exception — architect-only pages may be dynamic
A page may stay dynamic **only when its access is architect-only.** That is exactly the service cockpit —
`/architecture`, `/ai-core`, `/ai-draft-settings`, `/development-steps`, `/patterns`, `/glossary`,
`/documents`, `/debug`. These MAY and are RECOMMENDED to be dynamic: internal tooling, never the public
product surface. The canon binds the public surface (`[lang]` home + user-built content pages); the
architect's cockpit is free.

## The trap that caused this — never repeat it
A root-level `export const dynamic = "force-dynamic"` on `app/layout.tsx` forces the **whole subtree**
dynamic — every page under it, public content included, silently loses static rendering. **Never** put
`force-dynamic` on the root layout to "reflect Site Settings without a rebuild." Use **ISR (`revalidate`)**
instead; if one page truly needs runtime config, scope `dynamic` to that single architect-only page, never
the root. Other silent static/ISR breakers in a layout/page: `auth()`, `cookies()`, `headers()`.

## The root layout must be a BARE pass-through — `<html lang>` belongs to the zone that knows the language
The root `app/layout.tsx` must be exactly `return children` (plus the global CSS import). It must **not**
render `<html>/<body>`, must **not** call a Dynamic API, and must **not** set `<html lang>` from a single
config value. Reason: the root wraps **every** route, so anything it does leaks to the whole tree.

- **Anti-pattern — English locked to the full route depth.** A root `<html lang={getConfig().lang}>` (one
  constant) ships the SAME `lang` for every page. `/es` then serves Spanish content inside
  `<html lang="en">` — the language is locked across the entire route depth because the root layout sits
  **above** the `[lang]` segment and never sees the route param. (Same class of bug as `headers()` in the
  root: a single shared decision poisoning the whole tree — here the SEO/a11y `lang`, there the rendering
  mode.)
- **Correct — each zone owns its own `<html>` (Next.js "multiple root layouts" via route groups):**
  - `app/[lang]/layout.tsx` → `<html lang={validLang}>`, where `validLang` is the **route param**, and it is
    **VALIDATED first** (`if (!SUPPORTED_LANGUAGES.includes(lang)) notFound()`). The 22slots rule: never
    just *extract* the segment — **always validate it** before it reaches `<html lang>` or any render.
  - `app/(service)/layout.tsx` → `<html lang="en">` for the architect-only English zone (service cockpit).
  - The route group `(service)` is invisible in the URL, so service pages keep their unprefixed paths and
    `proxy.ts` is untouched.

Reference implementations: `Documents/fractera/22slots-main/app` and FES (the platform shell). Deep how-to
with the full zone tree and code — `CRUD-DOCS/workspace-standards/static-first.md`.

## The animation trap — JS-gated visibility breaks no-JS (recorded consent required)
A real regression on this product: the home landing wrapped every block in framer-motion
`initial={{ opacity: 0 }}` + `animate={{ opacity: 1 }}`. Framer-motion ships the **initial** state
into the SSR HTML, so the server sent every element at `opacity:0` and the page only became visible
**after** client hydration ran the enter animation. With JS off — or before/if hydration stalls — the
**entire page was a white screen.** This is a no-JS canon violation even though the route itself was
SSG/ISR: the HTML was complete but **painted invisible**. (It predated the multilingual work; the
fix was `initial={false}` so elements mount at the visible `animate()` target. Verified: SSR
`opacity:0` count went 17 → 0, content visible without JS.)

**The rule.** Content MUST be visible in server HTML **without JavaScript**. An entrance/scroll
animation is **progressive enhancement only** — it may add motion when JS runs, but it must NEVER ship
the content hidden. Forbidden by default: framer-motion `initial={{ opacity: 0, … }}`, CSS that starts
at `opacity:0`/`visibility:hidden` and reveals via JS, any "reveal on hydrate" pattern. Correct
patterns: `initial={false}` (mount at the visible state), CSS keyframes that animate **from visible**,
or `whileInView` guarded so the base state is visible.

**The override — only with informed, recorded consent.** If the owner insists on an animation that
hides content until JS runs, this is the SAME class of decision as making a page dynamic: the agent
**must not just do it.** The agent is REQUIRED to:
1. **Explain the concrete risks, explicitly** — do not gloss them:
   - **White screen without JS** — visitors with JS disabled, locked-down browsers, or a slow network
     before hydration see a blank page.
   - **Invisible to machine readers** — crawlers and AI bots that do not execute JS index a blank page;
     direct SEO/GEO damage.
   - **Total loss on any hydration failure** — one JS error anywhere unmounts the tree and the page
     stays permanently white; without the animation the content would still be there.
   - **Flash of invisible content (FOIC)** + worse perceived performance and Largest-Contentful-Paint.
   - **Accessibility** — reduced-motion users, screen readers, and low-power devices are penalised.
2. **Require explicit confirmation** from the owner after the risks are stated (a single "ok" to a
   risk-free pitch does not count — the risks must be on the record first).
3. **Record the consent** — the moment the owner agreed, **with timestamp, who approved, and the exact
   scope** (which page/component is allowed to gate visibility on JS). Write it where the override
   lives: the page/component `_meta.ts` (a `noJsConsent: { by, at, scope, reason }` field) and/or this
   doc's override log. An undocumented JS-gated animation is a bug, not a feature — treat it like an
   undocumented `force-dynamic`.

This mirrors the dynamic-page rule: the default is non-negotiable, the exception exists only behind an
**explicit, informed, recorded** owner decision.

## How to do it right (summary)
- **Public `[lang]` routes:** `generateStaticParams()` + `export const dynamicParams = true` +
  `export const revalidate = N` (e.g. 600) — **no root `force-dynamic`**.
- **Time-based ISR is the default.** A page is generated once; with no traffic the server **sleeps**. After
  the window, the first visitor to a page triggers a lazy background rebuild of **that one page** — only
  requested pages regenerate, never the whole site on a timer. Cost is bounded by real traffic.
- **Need zero-delay freshness on a specific page?** Optional: `revalidate = false` + call `revalidateTag`
  in the write handler (instant, but you must purge on every write or it freezes). Not the default.
- **Architect-only pages:** explicit per-page `export const dynamic = "force-dynamic"` (the exception).

The content-actualization ladder (SSG → time-based ISR → optional on-demand → dynamic → client-fetch),
per-route classification, the dog example and code — deep how-to
`CRUD-DOCS/workspace-standards/static-first.md`. Reference flow — `Documents/fractera/22slots-main/app`.

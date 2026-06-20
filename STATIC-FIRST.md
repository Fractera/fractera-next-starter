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

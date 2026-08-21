# ANTI-PATTERNS.md — approaches that cost time here, and must not be repeated

**Self-evolving.** The agent appends to this file: whenever an approach turned out to be a dead end,
the entry is written the moment it is understood, not at the end of the session — an unwritten lesson
dies with the context.

**The value is in the second half of every entry.** Not *what* failed, but *why*, in enough detail
that a similar idea can be recognised BEFORE it is built again. An entry that only says "do not do X"
gets rediscovered as "but my case is different".

Format: a heading, one line of context, the mechanism of the failure, and what to do instead.

🔒 **KEEP EVERY ENTRY SHORT — this file is not a place for reports.** One paragraph of mechanism, one
small code block, and stop. Budget: **about 700 characters, never more than twelve lines of prose.**
An agent loads this file WHOLE while it has a task to do; it is not documentation somebody sits down to
read. An entry that grows into a report page stops being read, and the law inside it dies together with
the attention it lost. If a case genuinely needs pages, those pages belong to its step — this file keeps
only the one-paragraph law that came out of it.

---

# Premature Reset

> Anti-pattern · stable

Resetting or redeploying the server before the source deploy (git push -> auto build) has finished delivers a stale bootstrap, which is a guaranteed bug. Confirm the new commit is actually live before touching the server.

## Source code example

```
git log -1 --oneline origin/main   # confirm the new commit is live before redeploying
```

## Steps
_No tasks._

<!-- fractera:pattern
{"kind":"anti","category":"","number":2,"name":"Premature Reset","status":"stable","description":"Resetting or redeploying the server before the source deploy (git push -> auto build) has finished delivers a stale bootstrap, which is a guaranteed bug. Confirm the new commit is actually live before touching the server.","code":"git log -1 --oneline origin/main   # confirm the new commit is live before redeploying","tasks":[]}
-->

---

# No middleware.ts

> Anti-pattern · stable

This project runs Next.js 16 (Turbopack) and uses **`proxy.ts`** for middleware — never
`middleware.ts`. Creating a `middleware.ts` file is wrong: keep the `proxy()` function plus
`export const config` convention inside `proxy.ts`. This is a deliberate project convention, not a
mistake to "fix". An empty `middleware-manifest.json` is **not** a sign that `proxy.ts` is broken, so
do not add `middleware.ts` in response to it.

## Source code example

```ts
// proxy.ts — correct. Do NOT create middleware.ts.
export function proxy(request: Request) {
  // ...request gate / rewrite logic...
}
export const config = { matcher: [/* ... */] }
```

## Steps
_No tasks._

<!-- fractera:pattern
{"kind":"anti","category":"","number":3,"name":"No middleware.ts","status":"stable","description":"This project runs Next.js 16 (Turbopack) and uses proxy.ts for middleware, never middleware.ts. Creating a middleware.ts file is wrong: keep the proxy() function plus export const config convention inside proxy.ts. It is a deliberate project convention. An empty middleware-manifest.json is not a sign proxy.ts is broken — do not add middleware.ts in response to it.","code":"// proxy.ts — correct. Do NOT create middleware.ts.\nexport function proxy(request: Request) { /* request gate / rewrite */ }\nexport const config = { matcher: [/* ... */] }","tasks":[]}
-->

---

# Styling disappears when .git does

> Anti-pattern · draft

**Tailwind 4 finds classes on its own, but it uses the GIT REPOSITORY ROOT as the boundary of that
search.** Remove the `.git` folder — most easily by rebuilding the project into a sibling directory and
dropping the repository on the way — and there is nowhere left to scan.

**The mechanism, and why nothing catches it.** The build does not fail. It succeeds, and it emits a
stylesheet: a valid one, simply empty of utilities — roughly 9 KB where a working build produces about
120 KB. The site turns into a white page with unstyled black text, and every guard stays green at the
same time: types pass, dictionaries are full, the encoding scan is clean, the build exit code is `0`.
No step in the pipeline treats a valid-but-empty stylesheet as a failure, so the first thing that
notices is a human looking at the page.

**Recognise it by the size, not by the error** — there is no error. A main CSS chunk in the single-digit
kilobytes means the source scan found nothing, whatever the build said.

**What to do instead.** Name the source directories explicitly with `@source` in `styles/globals.css`, so
styling never depends on the presence of git at all. And if the slot itself lost its `.git`, restore it:
it is the user's project repository, and the panel's Pull and Push buttons are bound to it — losing it
breaks more than the stylesheet.

## Source code example

```css
/* styles/globals.css — do not rely on automatic detection */
@import "tailwindcss";

@source "../app";
@source "../components";
@source "../lib";
@source "../config";
```

## Steps
_No tasks._

<!-- fractera:pattern
{"kind":"anti","category":"","number":4,"name":"Styling disappears when .git does","status":"draft","description":"Tailwind 4 finds classes on its own, but it uses the GIT REPOSITORY ROOT as the boundary of that search. Remove the .git folder — most easily by rebuilding the project into a sibling directory and dropping the repository on the way — and there is nowhere left to scan. The build does not fail: it succeeds and emits a valid stylesheet that is simply empty of utilities, roughly 9 KB where a working build produces about 120 KB. The site turns into a white page with unstyled black text while every guard stays green: types pass, dictionaries are full, the encoding scan is clean, the build exit code is 0. No step treats a valid-but-empty stylesheet as a failure, so the first thing that notices is a human looking at the page. Recognise it by size, not by an error — there is none: a main CSS chunk in the single-digit kilobytes means the source scan found nothing. Fix it by naming the source directories explicitly with @source in styles/globals.css, so styling never depends on git. If the slot lost its .git, restore it too: it is the user's project repository and the panel's Pull and Push buttons are bound to it.","code":"/* styles/globals.css — do not rely on automatic detection */\n@import \"tailwindcss\";\n\n@source \"../app\";\n@source \"../components\";\n@source \"../lib\";\n@source \"../config\";","tasks":[]}
-->

---

# Deleting dependencies that nothing imports

> Anti-pattern · stable

After the chat-interface components were removed (`components/ai-elements/`, 19 files), thirteen packages
were left with zero imports anywhere in the tree: `@xterm/xterm`, `@xterm/addon-fit`, `streamdown` and its
four modules, `ai`, `react-markdown`, `use-stick-to-bottom`, `@xyflow/react`, `react-rnd`, `motion`.

Every mechanical check agrees they are dead weight, and the conclusion is wrong. **They are kept on
purpose** — the owner's decision of 2026-08-15: the starter's capability examples will be built on them.
A terminal, a diagram canvas, streamed markdown, drag-and-resize, animation — these are the demonstrations
the starter still owes, and re-adding a package later costs a lockfile churn plus a version that no longer
matches what the example was written against.

The trap is that the evidence looks conclusive. `grep` over the whole tree returns nothing, the build
succeeds without them, and a task worded as "make the starter lighter" or "remove the junk" points
straight at them. Intent is not recoverable from a repository: nothing in the code says "waiting for an
example". So the rule cannot be derived — it has to be read.

**Instead:** leave them. When the weight of the starter or `npm ci` time genuinely comes up, name these
packages as a deliberate reserve, not as debt, and let the owner decide. This covers PACKAGES only —
orphaned FILES are cleaned normally, as those 19 were.

## Steps
_No tasks._

<!-- fractera:pattern
{"kind":"anti","category":"","number":5,"name":"Deleting dependencies that nothing imports","status":"draft","description":"After the chat-interface components were removed (components/ai-elements/, 19 files), thirteen packages were left with zero imports anywhere in the tree: @xterm/xterm, @xterm/addon-fit, streamdown and its four modules, ai, react-markdown, use-stick-to-bottom, @xyflow/react, react-rnd, motion. Every mechanical check agrees they are dead weight, and the conclusion is wrong: they are kept on purpose by the owner's decision of 2026-08-15, because the starter's capability examples will be built on them. The trap is that the evidence looks conclusive - grep over the whole tree returns nothing, the build succeeds without them, and a task worded as 'make the starter lighter' points straight at them. Intent is not recoverable from a repository: nothing in the code says 'waiting for an example', so the rule cannot be derived, it has to be read. Instead: leave them; when the weight of the starter or npm ci time genuinely comes up, name these packages as a deliberate reserve rather than debt and let the owner decide. This covers PACKAGES only - orphaned FILES are cleaned normally, as those 19 were.","code":"","tasks":[]}
-->

---

# headers() or cookies() on a public page

> Anti-pattern · stable

Calling `headers()`, `cookies()` or `draftMode()` inside a page or layout opts that route out of static
generation — Next must then render it on every request. Nothing fails and no gate complains: the page
still works, it simply stopped being prerendered, and if the call sits in a LAYOUT the whole subtree
under it goes dynamic with it. Do not reach for them to read a language, a theme or a session on a
public page: the language is already in the `[lang]` segment, and identity belongs to a client island
asking `/api/me`. A page that truly cannot be static is an architect's decision, not a convenience.

## Source code example

```tsx
// ❌ makes this page — and everything under a layout that does it — dynamic
import { cookies } from "next/headers"
const theme = (await cookies()).get("theme")

// ✅ language from the address, identity from an island
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <Body lang={lang} />   // <AccountButton /> asks /api/me in the browser
}
```

## Steps
_No tasks._

<!-- fractera:pattern
{"kind":"anti","category":"","number":6,"name":"headers() or cookies() on a public page","status":"stable","description":"Calling headers(), cookies() or draftMode() inside a page or layout opts that route out of static generation - Next must then render it on every request. Nothing fails and no gate complains: the page still works, it simply stopped being prerendered, and if the call sits in a LAYOUT the whole subtree under it goes dynamic with it. Do not reach for them to read a language, a theme or a session on a public page: the language is already in the [lang] segment, and identity belongs to a client island asking /api/me. A page that truly cannot be static is an architect decision, not a convenience.","code":"// dynamic — do not\nimport { cookies } from \"next/headers\"\nconst theme = (await cookies()).get(\"theme\")\n\n// language from the address, identity from an island\nexport default async function Page({ params }) {\n  const { lang } = await params\n  return <Body lang={lang} />\n}","tasks":[]}
-->


---

# Motion on the page instead of inside an island

> Anti-pattern · stable

**Motion renders its `initial` state on the server.** `initial={{opacity: 0}}` ships **`opacity:0`
inside the prerendered HTML** — the markup is there, the content is invisible until hydration. Google
crawls, queues, then renders, and its rule is blunt: *"If the content isn't visible in the rendered
HTML, Google won't be able to index it."* Readers that never run JavaScript see nothing, and no
crawler's documentation promises that they do.

**Name the mechanism precisely.** A client component does NOT make a route dynamic — `cookies()`,
`headers()` and `searchParams` do (entry above). What motion breaks is not the route, it is the
CONTENT of the HTML. Both end the same way in search; the cure is different.

**Instead:** the server prints a visible static twin; an island swaps in the animated version after the
first click, `motion` loaded lazily, both versions sharing one markup file so the swap is 1:1.
Specimen — `app/[lang]/(publicLayer)/_widgets/static/security-orbit/`.

## Source code example

```tsx
// ❌ ships opacity:0 to the crawler and to everyone without JS
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>…</motion.div>

// ✅ twin first, movement after the first click (widgets/static/security-orbit)
<SecuritySwap ui={ui}><SecurityStatic ui={ui} /></SecuritySwap>
```

## Steps
_No tasks._

<!-- fractera:pattern
{"kind":"anti","category":"","number":7,"name":"Motion on the page instead of inside an island","status":"stable","description":"Motion renders its initial state on the SERVER: initial={{opacity: 0}} ships opacity:0 inside the prerendered HTML, and the text exists only after hydration. Google crawls, queues, then renders, and its own rule is blunt - if the content isn't visible in the rendered HTML, Google won't be able to index it; readers that never run JavaScript see nothing at all, and no crawler's docs promise that they do. Note the mechanism precisely: a client component does NOT make the route dynamic - cookies(), headers() and searchParams do, see the entry above. What motion breaks is not the route, it is the CONTENT of the HTML. Instead: the server prints a visible static twin, and an island swaps in the animated version after the first click, with motion loaded lazily and both versions sharing one markup file so the swap is 1:1.","code":"// ❌ ships opacity:0 to the crawler and to everyone without JS\n<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>…</motion.div>\n\n// ✅ twin first, movement after the first click (widgets/static/security-orbit)\n<SecuritySwap ui={ui}><SecurityStatic ui={ui} /></SecuritySwap>","tasks":[]}
-->


---

# Measuring the page through a service worker

> Anti-pattern · stable

**The app registers a service worker (PWA) that serves `pages-v1` / `assets-v1` from a PREVIOUS
build, and an ordinary reload does not bypass it.** The build is fresh, the rule is in the CSS on disk,
and the browser still shows the old layout — the measurement describes a build that no longer exists,
and code gets "fixed" for a defect it does not have. Cost here: half an hour spent proving a widget's
breakpoints were broken when only the cache was.

**Recognise it by the stylesheet, not by the page:** far fewer rules than the built chunk, or a media
query missing in the browser that you can grep in `.next/static/chunks/*.css`.

**Before measuring anything in a browser** — unregister the workers, delete the caches, reload with a
fresh query string.

## Source code example

```js
// paste in the console BEFORE trusting any measurement
for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister()
for (const n of await caches.keys()) await caches.delete(n)
location.href = location.pathname + "?fresh=" + Date.now()
```

## Steps
_No tasks._

<!-- fractera:pattern
{"kind":"anti","category":"","number":8,"name":"Measuring the page through a service worker","status":"stable","description":"The app registers a service worker (PWA) that serves pages-v1 / assets-v1 from a PREVIOUS build, and an ordinary reload does not bypass it. Symptom: the build is fresh, the rule is in the CSS on disk, and the browser still shows the old layout - so the measurement describes a build that no longer exists, and the code gets 'fixed' for a defect it does not have. Cost here: half an hour spent proving a widget's breakpoints were broken when only the cache was. Recognise it by the stylesheet rather than by the page: far fewer rules than the built chunk, or a media query missing that you can grep in .next/static/chunks/*.css. Before measuring anything in a browser - unregister the workers, delete the caches, reload with a fresh query string.","code":"// paste in the console BEFORE trusting any measurement\nfor (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister()\nfor (const n of await caches.keys()) await caches.delete(n)\nlocation.href = location.pathname + \"?fresh=\" + Date.now()","tasks":[]}
-->

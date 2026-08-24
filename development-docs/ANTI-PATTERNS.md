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

---

# An island importing a server module

> Anti-pattern · stable

`Module not found: Can't resolve 'fs'` at build time, and the import trace points at your
`*.client.tsx`. A client island pulled in a `lib/` module that touches the filesystem, the database or
a secret — and the bundler follows imports, not intentions. **It happened twice in one day here**, the
second time after a comment had been written against it: a rule inside one file does not survive.

Read data in the server component and hand the island **plain props**; if the island genuinely needs
something at runtime, it asks `/api/*` after hydration. When in doubt, check what your `lib/` import
imports — one level down is enough to catch it.

# Secure-context APIs die on IP mode

> Anti-pattern · stable

`crypto.randomUUID()`, clipboard, `getUserMedia` and friends exist **only in a secure context** —
HTTPS or `localhost`. In IP mode the site is served over plain `http://<ip>:3000`, so the call is
`undefined`, the click throws, and the page dies with a browser-level "page failed to load". Server
logs stay clean and SSR returns 200, which sends you hunting on the wrong side.

The trap is that the same code works on a domain, so it never shows up in secure mode.

```ts
const genId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
```

# A relative auth path picks up a language prefix

> Anti-pattern · stable

A server guard redirected to `"/register?requireRole=architect"` — a relative path on the app's own
domain. But `/register` belongs to the **auth service**, not to the app. The language router sees a
path with no language prefix, sends `308` to `/<lang>/register`, the app has no such page, and the
owner meets a white screen where the first account was supposed to be created.

Redirect to auth by its **absolute** address, built from the auth origin, never by a bare path.

# State seeded from a prop never re-seeds

> Anti-pattern · stable

`useState(() => [...suggested])` runs its initialiser **exactly once, at mount**. The owner switches
the project structure, the parent re-renders with new suggestions — and the editor still shows the
previous ones until a manual reload. It reads as "the switch does not work".

Either derive the value during render instead of storing it, or reset deliberately on a changing
`key`, or sync explicitly when the source prop changes. Silent staleness is the default; opting out is
your job.

# A silent database fallback splits users across two files

> Anti-pattern · stable

The owner registered and could not log in. The agent looked at the database, reported "no accounts",
the owner insisted he had just registered — and both were telling the truth: the records existed, in
**another file**. A `catch` around opening the database fell back to a second path, and from then on
one process wrote here and another read there.

A fallback that changes *where the truth lives* must be loud: log it, surface it, or refuse to start.
Silent recovery turns a configuration error into missing data with no error anywhere.

# A swallowed error turns a wrong path into "no data"

> Anti-pattern · stable

```ts
try { entries = fs.readdirSync(dir, { withFileTypes: true }) }
catch { return [] }        // ← "the folder is absent, and that is legal"
```

The folder was not absent — the path was wrong. The empty array is indistinguishable from an honest
empty result, so the page renders "nothing here" and nobody looks further.

Catch the case you actually mean (`ENOENT`) and let everything else through. A `catch` with no
condition is a decision that every possible failure is legal.

# A panel switch is invisible until ISR expires

> Anti-pattern · stable

The owner turns authentication off, the header still shows the login button; turns it on and off
again — nothing. The obvious conclusion is that the switch is broken. It is not: the switch works, the
**delivery to the visitor** lags, because static pages are revalidated on their own schedule.

Say this out loud before he reports it as a defect, and give the number: "the page is regenerated
within N minutes". If a setting must be visible immediately, that page is the one that reads the
config per request — a deliberate exception, not a default.

# Two caches, and only one was cleared

> Anti-pattern · stable

The image exists in the media library and the catalogue shows a dash. Everything you suspect turns
out healthy — the row, the file, the permissions — because the defect is not in the data path but in
the **second** cache nobody remembered: one in the data layer, one in Next's own fetch/route cache.

When a value is cached twice, invalidation is a pair. Write down both places the moment you add the
second one; it is invisible from either side alone.

# An identifier derived from a mutable field lies forever

> Anti-pattern · stable

A product registry used ids like `store-1`, `landing-2` — readable, and correct until the owner
changes the structure on the screen built precisely for that. Result: a `landing` product carrying the
id `store-1`, with `lib/products/store-1/` behind it. Three defects of one family within an hour of
building it.

An id is meaningless and eternal (`p1`, `p2`); everything human — name, type, structure — is a field
next to it. Anything derived from a field the owner can edit will disagree with reality on his first
edit.

# A default value destroys "absent" versus "empty"

> Anti-pattern · stable

A resolver distinguished three states — the branch is missing, the branch is present and empty, the
branch has values — and a well-meaning default collapsed the first two into one. Both decisions were
right on their own; together they deleted the only signal that said "nothing was configured here".

Before giving a default, ask whether the caller can tell "not set" from "set to nothing". If that
difference carries meaning anywhere, the default belongs at the point of use, not at the point of
read.

# A random id defeats the seed guard and duplicates rows

> Anti-pattern · stable

"Every so often a deployment leaves duplicated products." The seeding routine guards against a repeat
run by checking whether the row already exists — by id. The id was generated randomly at seed time, so
the guard compared this run's fresh id against the previous run's fresh id and never matched.

A seed guard needs a **stable natural key**: the slug, the external id, anything the source itself
carries. If the source has no such key, the guard is decorative.

# `SQLITE_BUSY` during the build

> Anti-pattern · stable

The build fails with `SQLITE_BUSY`. Two prerender workers opened the database eagerly at module load,
one of them ran a migration, and neither was willing to wait: SQLite serialises writers, and without
`busy_timeout` the loser fails instead of retrying.

Open the database lazily, inside the function that needs it, and set a `busy_timeout`. Migrations run
before the build as a separate command, never as a side effect of importing a module.

# A cookie from the previous server locks the owner out

> Anti-pattern · stable

The server is redeployed on the same domain, the owner tries to log in, and the dialog returns the
same message forever. Another browser works fine — which is the tell: the state is on his machine, not
on the server. The session cookie was signed by the previous installation's secret; the new one cannot
verify it and answers "not authenticated" to a browser that keeps sending it.

An unverifiable session cookie must be **cleared** in the same response that rejects it, not merely
rejected. Otherwise the loop has no exit from inside.

# A public door stays closed until the domain reveals it

> Anti-pattern · stable

The gate in `proxy.ts` closes `/api/*` **as a whole**, with a short list of exceptions. A new route
that must answer a guest works perfectly in IP mode — where the login is bypassed — and returns `401`
the moment the site runs on a domain. That is, at the customer.

Every door meant for guests is named in `PUBLIC_API_PREFIXES` in the same edit that creates it. Test
it with the bypass off, or you are testing the bypass.

# A production process that builds its own frontend at startup

> Anti-pattern · stable

A service answered `502` and went into an endless restart loop after a harmless update. It built its
own interface on start; a Node version mismatch made the build fail, so the process never came up, so
it was restarted, so the build failed again.

Building happens **before** starting, as its own command. A production process only starts. If start
and build are one command, every build-time problem becomes an outage that looks like a crash.

# A schema change belongs in one constant, not in a migration file

> Pattern · stable

Tables live in the `SCHEMA` constant in `lib/db/index.ts`. Both `makeLocalDb()` and
`initRemoteSchema()` execute it at startup, so a table added there appears in the local file database
and in the remote data layer without a migration file, a script or a button.

Writing a migration by hand here is not extra safety — it creates a second source of truth that the
two environments will drift apart on. → `use-database`

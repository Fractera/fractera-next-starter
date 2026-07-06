# Build-time environment variables & production redeploy

**Standard. The slot's own `app/.env.local` is authoritative for every key it declares. A production
redeploy must bake exactly those values into the slot — for languages, Stripe keys, feature flags, or any
custom build-time variable. Getting this wrong fails silently.**

> One-line contract: **whatever the app declares in its `app/.env.local`, the build bakes — every time,
> on every redeploy, with no leakage from the layer that triggers the build.**

---

## 1. Why this matters (the class of problem)

A Next.js app reads two kinds of environment values:

- **Build-time values** — anything inlined at `next build`: every `NEXT_PUBLIC_*` variable (inlined into the
  client bundle) and anything read while pages are statically generated (`generateStaticParams`, server
  components rendered at build). Examples: the language set (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`), a Stripe
  publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`), feature flags, analytics IDs.
- **Runtime values** — read fresh on each request by the running server.

Build-time values are **frozen at `next build`**. Changing the file afterwards does nothing until a rebuild.
So any feature whose configuration is build-time MUST be applied by a rebuild — and the rebuild MUST read
the app's current `.env.local`. If the rebuild reads the wrong (or no) env file, the value is baked as
**missing**, and the failure is silent: the build still says `COMPLETED`, but the app ships with the value
gone (a dead language switcher, an uninitialised Stripe.js, a flag stuck off).

This is a **class**, not a single bug. The first instance we hit was the language switcher disappearing
after adding a language; the exact same mechanism would have silently dropped Stripe keys, custom DB/API
URLs, or any other build-time variable a future app declares.

---

## 2. The trap (root cause — proven, not a guess)

The platform has **two Next.js apps**: the **Admin** cockpit (`bridges/app`, :3002) and the **App slot**
(`app`, :3000). When the owner changes a setting, the Admin route `POST /api/deploy` **spawns** a
`next build` for the slot.

`@next/env` (the loader Next uses for `.env*`) does two things on its first run **and records a
cross-process marker** `__NEXT_PROCESSED_ENV` in `process.env`:

1. it sets that sentinel, and
2. once the sentinel is present, it **does not load `.env` again** — not in the same process, and (the
   killer) **not in a child process that inherited the sentinel**.

The Admin process already ran `@next/env` at its own `next start` (loading `bridges/app/.env.local`, which
does NOT contain the slot's variables). So if the deploy route spawns the slot build with
`env: { ...process.env }`, the child `next build` inherits `__NEXT_PROCESSED_ENV` and **skips loading the
slot's `app/.env.local` entirely**. Every variable the slot declares there resolves to `undefined`. For the
language set that means the parser falls back to `["en"]`, single-language mode turns on, and the switcher
renders nothing.

Why it hid for so long: a **fresh** wipe+bootstrap builds the slot from a clean shell (no sentinel), so a
brand-new server starts correct. The bug only bites on the **second and later** changes — the owner's
self-service "change a setting → rebuild" path, which is the common real-world case.

Secondary note: even with the sentinel gone, `@next/env` never **overrides** a variable already present in
the process env. So an inherited copy of a key would still shadow the slot's value. The contract handles
both problems.

---

## 3. The contract (the fix)

**The slot build runs with a slot-scoped environment.** Concretely, when the deploy pipeline spawns
`next build` for the slot it builds the child env like this:

1. drop `__NEXT_PROCESSED_ENV` — so the child's `@next/env` loads `app/.env.local` fresh; and
2. drop every key the slot declares in its own `app/.env.local` — so no inherited copy shadows the slot's
   value (`@next/env` never overrides an already-set key).

Everything else (PATH, HOME, and variables genuinely provisioned from outside — e.g. a per-server
`NEXT_PUBLIC_SERVER_ID` the slot does NOT declare) is kept.

Result: **the slot's own `app/.env.local` wins for every key it declares**, on every rebuild, regardless of
what the Admin process carries. General by construction — languages, Stripe keys, feature flags, custom
vars all behave the same.

Reference implementation: `slotBuildEnv()` in `bridges/app/app/api/deploy/route.ts` (the spawned
`next build` uses it instead of a raw `{ ...process.env }`).

---

## 4. What you (an agent) must do when a feature needs a build-time env var

1. **Write the value to the slot's `app/.env.local` through the proper setter, never raw.** For app
   settings/languages use the validated setter (the App Settings MCP / config API; see the
   `manage-app-settings` skill). For a brand-new variable, add it to `app/.env.local` and document it.
2. **Trigger a rebuild.** Build-time values only take effect after `next build`. The deploy pipeline
   (`POST /api/deploy`) rebuilds the slot and reloads it; with the contract above it bakes the current
   `.env.local`. A `pm2 restart` alone does NOT help — it re-reads an already-built bundle.
3. **Expect a rebuild cost (~2-4 min) and say so honestly.** This is the price of build-time config; it is
   correct, not a regression.
4. **Do not reach for `force-dynamic`.** Making a public page dynamic to "reflect a value instantly"
   violates the static-first canon (see `static-first.md`). Build-time values change by **rebuild**; text
   content that must update without a rebuild uses **ISR / on-demand revalidate**, a different mechanism —
   do not conflate them.

### Worked examples

- **Add a language.** Setter writes `NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es,ru` to `app/.env.local` →
  rebuild → `generateStaticParams` enumerates all languages, the switcher renders on every route including
  the default.
- **Add Stripe.** Owner saves `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (+ product ids) and the secret to
  `app/.env.local` → rebuild → the publishable key is inlined into the client bundle, Stripe.js initialises.
- **Custom app var / feature flag.** Declared in `app/.env.local` → rebuild → baked. The contract
  guarantees it survives the redeploy.

---

## 5. How to verify (fast, no full build)

`@next/env` resolution is observable in under a second, so you can prove correctness before a real build:

- **Wrong (old) behaviour:** load the Admin env first (sets the sentinel), then in a child with
  `{ ...process.env }` call `loadEnvConfig(<slot dir>)` → the slot's keys come back `undefined`.
- **Correct (contract) behaviour:** drop `__NEXT_PROCESSED_ENV` and the slot-declared keys from the child
  env, then `loadEnvConfig(<slot dir>)` → the slot's values are present.

End-to-end on a live server: trigger the deploy route, then check the build log has **zero**
`Using default ["en"]` warnings and the route table prerenders **all** declared languages; the served
default route contains the switcher.

---

## 6. Invariants (do not regress)

- The slot build is spawned by the Admin Next process — **always hand it a slot-scoped env**, never a raw
  `{ ...process.env }`. This is the single point that protects the whole class.
- A **fresh** wipe+bootstrap builds the slot from a clean shell and is unaffected; the contract matters for
  the **owner-triggered redeploy** path.
- Build-time set ≠ runtime config. Languages and other inlined values are build-time **by design**; do not
  try to make them "live" with `force-dynamic`.

---

*Origin: this standard was extracted from a real incident (the language switcher vanishing after adding a
language) once it was understood to be a general env-baking class. The fix is the `slotBuildEnv()` contract
in the deploy pipeline.*

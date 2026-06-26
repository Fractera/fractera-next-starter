# 03 — Architecture page: derive the route tree from the filesystem + `_meta` (kill the hardcode, show real `(service)` grouping)

> Development step · importance: mandatory

## The problem (confirmed by reading the code — not a guess)

The `/architecture` service page is meant to be "the map of every route mirrored from the code on disk."
In reality its route map is **hand-maintained**, so a freshly created route group (e.g. a `/news` or `/blog`
composed by the Frozen Template Constructor) does **not** show up with its records, and the page does **not**
reflect the real `(service)` route-group structure. Three independent root causes were verified:

### A. The route tree is hand-coded, not derived
- `lib/architecture/routes.ts` → `ROUTES_TREE`: every page/endpoint is a hand-written `page(...)` / `api(...)`
  call with **hand-typed** roles / rendering / method strings. The file's own comment admits it:
  *"Curated for v1 (honestly hand-kept); a later step can derive it from the route manifest so it never drifts."*
- `lib/architecture/tree.ts` → `ARCHITECTURE_TREE`: the L2 workspace lens, hand-coded, including a hand-made
  "Service Pages" group whose page nodes carry hardcoded `meta`.
- `lib/architecture/route-manifest.ts` → `ROUTE_MANIFEST`: ~24 **explicit** `import xMeta from "@/app/.../_meta"`
  lines, keyed by path. The detail panel renders real `RouteMeta` **only** for these hand-listed routes. Comment:
  *"Hand-maintained manifest … a later codegen can glob these."*
- ⇒ A new route (composed group, scaffolded page) is in none of these → it appears with **no records**, or not at all.

### B. The filesystem scan exists but is shallow and Next-convention-naive
- `lib/architecture/fs-scan.ts` `scanTree()` walks `app/`, but only: (1) finds DECLARED entities (a folder with
  `README.md` and no built `page`/`route`) → `requested`; (2) counts README tasks → `tasksByPath`; (3) surfaces a
  freshly-built **page** outside the curated seed as `builtExtra` — but only a **bare** `{ href, kind: "page" }`
  with **zero `_meta.ts` extraction** (no roles/rendering/method/access-shape), and it explicitly does **not**
  surface built API endpoints.
- `toPath()` does **not** strip Next.js route groups `(...)` nor normalize dynamic segments `[...]`. `SKIP`
  excludes `(auth)` but **not** `(service)`. So scanning `app/(service)/dashboard` yields the path
  `/(service)/dashboard` (wrong — the real URL is `/dashboard`), and `app/[lang]/news` yields `/[lang]/news`.
- ⇒ A composed group surfaces (if at all) as a bare, record-less, **mis-pathed** node; the components inside the
  group (`layout.tsx`, `_components`, `_lib`, `_data`, each item route) are invisible.

### C. The real `(service)` route-group grouping is not reflected
- On disk **all** service pages live under `app/(service)/` (verified: ai-core, ai-draft-settings, architecture,
  dashboard, debug, development-steps, documents, glossary, patterns, project).
- The displayed tree groups pages under **hand-made** buckets ("Pages" / "Service Pages"), not under the real
  `(service)` route group from the code. As the owner observed on GitHub, the code groups routes with `(...)`;
  the page throws that real structure away and shows a curated one instead.

## Desired outcome
Make the `/architecture` route map **derive from the real filesystem + each route's typed `_meta.ts`** (single
source of truth, no drift), so that:
1. **Every route — including newly composed groups — appears automatically** with its real records (roles,
   rendering, method, access shape) read from its `_meta.ts`, with no hand edits to `routes.ts` /
   `route-manifest.ts`.
2. **The tree reflects the real route-group structure**: a `(group)` folder (e.g. `(service)`) becomes a real
   group node; route groups `(...)` are transparent to the URL (stripped from `href`); dynamic segments
   (`[lang]`, `[id]`) are normalized/labelled, not leaked as literal paths.
3. **A composed route GROUP shows its full composition**: the group node + its item routes, each carrying the
   accompanying records the route declares.

## Implementation direction (for the building agent)
- Generalize `lib/architecture/fs-scan.ts` into a real **route deriver**: while walking `app/`, for each folder
  that has `page.tsx`/`route.ts`, read the sibling `_meta.ts` (typed `RouteMeta`) and build the node from the
  **real** record. Compute the URL by **stripping `(group)` segments** and use those segments for grouping/nesting;
  normalize `[seg]`.
- Retire / shrink the hand-coded sources the comments already flag as temporary: derive `ROUTES_TREE` and
  `ROUTE_MANIFEST` from disk (glob `_meta.ts`) instead of hand-listing — exactly the "later codegen can glob these"
  the files promise. Keep the L2 workspace lens (`tree.ts`) as the high-level overview, but its ROUTES portion
  comes from disk.
- Add a route-group node type (or reuse the existing `kind: "group"`) so `(service)` and future content groups
  render as real nested groups.
- **Preserve the existing UI contract** (`ScanResult` / `ArchNode` shapes consumed by
  `app/(service)/architecture/_components/architecture-app.client.tsx` and the `/api/project/default/architecture/*`
  endpoints) — change the **data source**, not the client. The page is architect-only and already dynamic
  (`requireAdmin()`), so reading `_meta.ts` at request time is allowed (no static-first conflict).

## Known constraints / do-not-break
- The page is architect-only + dynamic (`requireAdmin()`); static-first does not apply here (sanctioned exception).
- Keep the DECLARED(README)→LIVE transition (`requested` entities), the task-count polling, and the live signature
  poll (`/api/project/default/architecture/signature`) working — `/development-steps` and `/patterns` rely on the
  same scan plumbing.
- Do not change the `RouteMeta` schema (`lib/architecture/route-meta.ts`) in this step; only read it.
- Out of scope: the Frozen Template Constructor work (step 147 sub-step), and any change to how routes are composed.

## To-do
- [x] Make the route manifest read each route's real `_meta.ts` (roles/rendering/method/access) — via codegen
- [x] Strip `(group)` segments from the URL + leading `[lang]`; normalize so paths match the real route shape
- [x] Derive `ROUTE_MANIFEST` from disk (glob `_meta.ts`); retire the ~24 hand-listed imports
- [x] Surface composed route GROUPS with their item routes (path fix so `/news` + `/news/sample-1` nest)
- [x] Reflect the real `(service)` route group as a nested group node, matching the GitHub folder structure
- [x] Keep DECLARED→LIVE, task-count and signature polling intact; UI contract (`ScanResult`/`ArchNode`) unchanged
- [ ] DEPLOY-VERIFY (architect, rule 2/18): `tsc` + `next build` + live `/architecture` renders the new grouping/records
- [ ] FOLLOW-UP (step 147 tie-in): constructor emits a `_meta.ts` per composed route so composed groups get RICH records

## Progress (implemented this session — scratch-verified; deploy-verify pending)
**Approach: codegen, mirroring the proven `parser-fs` pattern** (the "later codegen can glob these" the files promised).
- **`lib/architecture/parser-routes.mjs`** (NEW) — globs every `app/**/_meta.ts`, computes the URL the Next way
  (strip `(group)`, strip leading `[lang]`, keep `[id]`), reads `kind` from the sibling `page`/`route` file, and
  emits **`lib/architecture/routes.generated.ts`**: `GENERATED_ROUTES[]` (path · kind · group · meta) +
  `GENERATED_ROUTE_META` (path→RouteMeta). **Verified by execution: 28 routes** (vs 24 hand-listed — it found the
  ones the hardcode MISSED: `/development-steps`, `/patterns`, `/documents`, `/ai-draft-settings`, media/icons…),
  every `(service)` page captured as `group:"(service)"`, `[lang]→/`, dynamic `[id]` kept. All 28 `_meta.ts`
  default-export (imports safe).
- **`lib/architecture/route-manifest.ts`** — now `ROUTE_MANIFEST = GENERATED_ROUTE_META`; the ~24 hand imports are
  retired. The detail panel's records are now derived from disk for EVERY route with a `_meta.ts` → kills the
  hardcode behind "new/existing routes show no records".
- **`lib/architecture/fs-scan.ts`** — `toPath()` now strips `(group)` + leading `[lang]` (parity-checked against the
  codegen). So a composed group maps to `/news` (not the orphaning `/[lang]/news`); `buildMergedTree` then nests
  `/news` under Pages and `/news/sample-1` under `/news` — composed GROUPS appear with their item routes. Also skips
  `_lib`/`_data` while walking.
- **`lib/architecture/routes.ts`** — service pages nested under a real `(service)` subgroup node, mirroring the
  on-disk route group (as on GitHub), instead of a flat list. (Tree structure stays curated for the Projects-vs-
  Service semantics; records come from `_meta` via the manifest.)
- **`package.json`** — `gen:routes` + `predev`/`prebuild` run the codegen (regenerated every build; the generated
  file is also committed so the import resolves without a build).

**Verified (scratch / static):** codegen output (paths/groups/imports), `toPath` parity, all `_meta` default-export,
generated file tracked. **NOT verified (needs Ubuntu deploy, rule 2):** `tsc`/`next build`, live `/architecture`
render. **Known gap:** a constructor-composed group has no `_meta.ts` yet, so it appears as a built node but without
`_meta`-derived records until the step-147 tie-in lands.

<!-- fractera:step
{"number":3,"name":"Architecture page: derive the route tree from the filesystem + _meta","importance":"mandatory","status":"new","completedAt":null,"description":"The /architecture page claims to mirror the routes from disk but its map is hand-maintained, so newly composed route groups (e.g. a constructor-built /news or /blog) appear with no records or not at all, and the real (service) route-group grouping is not shown. Three verified root causes: (A) the route tree is hardcoded — lib/architecture/routes.ts ROUTES_TREE hand-types every page/api with roles/rendering/method, tree.ts ARCHITECTURE_TREE hand-codes a Service Pages group, and route-manifest.ts hand-imports ~24 _meta.ts keyed by path (the detail panel only shows RouteMeta for hand-listed routes); the files' own comments admit a later step should derive these from disk. (B) fs-scan.ts scanTree() is shallow and Next-convention-naive — it only finds README-declared entities, counts tasks, and surfaces freshly-built pages as bare {href,kind} nodes with NO _meta extraction (and skips built APIs); toPath() does not strip route groups (...) nor normalize [seg], and SKIP excludes (auth) but not (service), so app/(service)/dashboard becomes /(service)/dashboard and app/[lang]/news becomes /[lang]/news. (C) all service pages live under app/(service)/ on disk but the page groups them under hand-made buckets, discarding the real (service) route-group structure visible on GitHub. Outcome: derive the route map from the real filesystem + each route's typed _meta.ts (single source of truth, no drift) so every route incl. composed groups appears automatically with real records; route groups (...) become real nested group nodes transparent to the URL; dynamic segments normalized; a composed GROUP shows its item routes + records. Preserve the ScanResult/ArchNode UI contract (change the data source, not the client); keep DECLARED->LIVE, task-count and signature polling working; do not change the RouteMeta schema. Out of scope: the Frozen Template Constructor work (step 147).","tasks":[{"id":"7a1c0de1-1111-4a11-8a11-aaaaaaaa0001","body":"Make the filesystem scan read each route's real _meta.ts and build nodes from it (roles/rendering/method/access)"},{"id":"7a1c0de1-2222-4a22-8a22-aaaaaaaa0002","body":"Strip (group) segments from the URL but use them to nest a real group node; normalize [seg] dynamic segments"},{"id":"7a1c0de1-3333-4a33-8a33-aaaaaaaa0003","body":"Derive ROUTES_TREE / ROUTE_MANIFEST from disk (glob _meta.ts); retire the hand-listed entries"},{"id":"7a1c0de1-4444-4a44-8a44-aaaaaaaa0004","body":"Surface composed route GROUPS with their item routes + records (verify with a constructor-composed /news)"},{"id":"7a1c0de1-5555-4a55-8a55-aaaaaaaa0005","body":"Reflect the real (service) route group as a nested group node, matching the GitHub folder structure"},{"id":"7a1c0de1-6666-4a66-8a66-aaaaaaaa0006","body":"Keep DECLARED->LIVE, task-count and signature polling intact; do not change the client UI contract"}]}
-->

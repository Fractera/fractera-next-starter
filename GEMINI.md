# GEMINI.md

## 1. Evolving pipeline coding agent

Work sequentially, validating every stage, strictly per the presented pipeline. Parallel agents are not
launched — except by special need and with the user's agreement. Development runs in production mode. At
every necessary stage — dense dialogue with the user. Strict control over adherence to the development
standard. On reaching the defined criteria, stops for refactoring are mandatory. Control over the launch,
execution and completion of deployment.

---

## 2. Dialogue format

You hold a critical dialogue format with the user: impartial, no sycophancy — you exist to amplify the
user's expertise. Answers reveal and justify the essence; every choice is backed by evidence.

You always assume the user may misspeak, so every dialogue begins by rephrasing them:
> If I understood correctly, this is about: {subject}, and you mean: {my reading of the essence}.
> And if I understood you correctly, the result should be: {expected outcome}.
> To get there I intend to do the following: {decomposition of the solution and the result}.

You use `GLOSSARY.md`: read it at session start and extend it whenever you detect divergences in
understanding, new abbreviations, or redefined terms.

At task start you ask whether the user wants a brainstorm, and run the survey until the questions run out
or the user stops you. You keep the main thread of the task: at each new stage you refocus on the original
goal. On stage changes you explicitly announce the move to a new pipeline phase. You create, visualize and
record the task checklist; deepening sub-tasks during decomposition is allowed.

---

## 3. Environment & scope

Your project is the App Shell (`fractera-app :3000`): the open layer where you write and edit code. Around
it is the Fractera environment (the layer above): you call it by ports/API but never edit its system code
without a special requirement from the architect. Everything sits behind nginx (`:80/:443`, absent in IP
mode) and the auth gate (`fractera-auth :3001`).

Environment map (number = nesting depth):

1. **App** — `fractera-app :3000` ← your project, editable
   - 1.1 Service pages (role architect, dynamic): `/ai-core` · `/architecture` · `/development-steps` ·
     `/patterns` · `/glossary` · `/documents` · `/ai-draft-settings` · `/debug`
2. **Data** — `fractera-data :3300` (token-auth)
   - 2.1 SQLite — `app.db` + `media.db` (`products`, `deployment_records`, `projects`, `site_settings`)
   - 2.2 Object Storage / Media — uploads, thumbnails, crop, PWA-icon generation
3. **Admin** — `fractera-admin :3002` (cockpit)
   - 3.1 Bridges — 5 platforms over WebSocket, each = an MCP server `:3210–3214`; + system terminal
   - 3.2 Tools — Deploy (`POST /api/deploy`) · GitHub · Upload Image · Skills · Product Loop
   - 3.3 LightRAG — Company Memory `:9621` (shared memory; `/api/rag/{status,query,ingest}`)
   - 3.4 Hermes — Brain
     - 3.4.1 Hermes Agent `:9119` (`config.yaml`, `SOUL.md`, skills, 7 MCP bridges `:3210–3216`:
       deployments `:3215`, readiness `:3216`)
     - 3.4.2 Chat Web UI `:9120`
     - 3.4.3 Telegram gateway
   - 3.5 Domain settings — domain connection + certificate

**Environment calls.** Reach a service by its port/endpoint: memory — `/api/rag/*`, deploy — `/api/deploy`,
media — `:3300`, orchestration — Hermes `:9119`. Every API call carries `-H "X-Agent-Identity: <you>"` —
without it DB changes are attributed to a generic agent and auditability is lost.

**Boundary.** App `:3000` is your domain of authority. The layer above you read and call, but never change
without the rights-escalation protocol (the architect's double confirmation).

---

## 4. Code output format

**Data & storage.** The project works with a local DB (SQLite) and local object storage (media; built-in
image crop and PWA-icon generation). DB access goes through one layer `import { db } from "@/lib/db"`; new
tables are declared once in `SCHEMA` (`lib/db/index.ts`) and appear in every environment automatically. Any
logic uses the minimum of DB queries; on static pages — zero queries at render time (data comes from
build-time or from a user action via `/api/*`).

**Authorization.** The project is covered by authorization: every page must check the user's role for
access. So access is built into development from the start — the access shape is decided before the code.
Details in the next block, "Authorization".

**Static-first (SSG/ISR) — CANON: "better nothing than a dynamic page".** Creating a dynamic page is
FORBIDDEN; exception only when ABSOLUTELY necessary and only after the architect's DOUBLE confirmation —
better to build nothing than to make a page dynamic where it could be static. Foundation: the product MUST
work with JavaScript OFF (the App Router ships server HTML; the real no-JS killer is client-side routing /
a client component owning a route, not SSR). So routing is server-generated, client components in routes
are forbidden, content is SSG/ISR. A root `force-dynamic` (e.g. on `app/layout.tsx`) silently forces the
WHOLE subtree dynamic — never do it; use ISR (`revalidate`). Exception: architect-only pages (the service
cockpit) MAY and SHOULD stay dynamic. Next traps: `auth()`, `cookies()`, `headers()` in a layout/page.
**Full canon + how-to → [`STATIC-FIRST.md`](STATIC-FIRST.md)** (deep recipe: `CRUD-DOCS/workspace-standards/static-first.md`).

**Build-time env vars that must survive a redeploy** (any `NEXT_PUBLIC_*`, the language set, Stripe keys + product ids, custom app vars) → use the **`persist-env-var-with-rebuild`** skill + read `CRUD-DOCS/workspace-standards/build-time-env-and-redeploy.md`. Write the value into the slot's `app/.env.local` through the proper setter, then trigger a rebuild (the slot-scoped build bakes the slot's own `.env.local`). Never hand-wait a `pm2 restart` for a build-time value, never `force-dynamic` to "show it instantly".

**File naming (mandatory).** Every JSX file ends in `.client.tsx` or `.server.tsx`.
Format: `[domain]-[entity]-[detail]-[role].suffix`
- `breadcrumb-trail.server.tsx` ✅
- `header-action-bar.client.tsx` ✅
- `breadcrumb-nav.tsx` ❌ (no domain, no role suffix)

**Size limit.** Max 200 lines of code in one component (excluding imports/exports). Does not apply to data
and CSS — there size is not line-limited.

**Co-location of entity-owned data — lowest common ancestor.** Data used by ONE entity and nothing else
(its translations, constants, config, schema, styles) lives INSIDE that entity's folder. Shared data rises
only to the **lowest common ancestor** of its real users — never higher; a global/shared module is only for
data genuinely reused across the tree (the language catalogue, design tokens). Test: deleting an entity's
folder leaves ZERO orphaned data. Placement by location:
- **route** (under `app/`): `foo/page.tsx`, `foo/_components/…`, private data `foo/_shared/…` (the leading
  `_` is mandatory — Next excludes it from routing).
- **component** (under `components/`): `foo/foo-menu.tsx`, private data `foo/shared/…` (no `_` needed).
- A `shared/` subfolder earns its place only at **≥2 internal consumers** — with a single consumer keep the
  file flat in the entity folder (no empty `shared/`).
Derive placement from the architecture and apply by default — DO NOT ask where to store entity-private data;
co-locate it.

**Next.js 16+.** `middleware.ts` is forbidden — use `proxy.ts` as its analog (the `proxy()` function +
`export const config`).

> Full route-skeleton standard — `shell-component-architecture.md` (thin `page.tsx`,
> `_components/index.tsx`, `.client`/`.server` suffixes, typed `_meta.ts`).

---

## 5. Authorization

NextAuth v5, two providers (credentials + guest); coverage via the `fractera-auth :3001` gate.
Authorization is a closed layer outside `app/`: you don't go there or explore anything there — you work
only with what is listed here.

Hooks & functions:
- `getSession(req?)` (`lib/auth/get-session.ts`) — server-side identity read → `{ userId, email, roles }`.
  Honors the `X-Agent-Identity` header (role `agent`); dev-bypass → `architect`; otherwise proxies
  `:3001/api/session`.
- `/api/me` — client-side identity read (`fetch('/api/me')`).
- Client guard (inline `/api/me`, no hook): in a `.client.tsx`, `fetch('/api/me')` + the route's `_meta.ts`
  to apply public / public+guest / private; redirect via `registerRedirectUrl`. Never `auth()` in a page.
  Reference: `app/(service)/dashboard/_components/dashboard-app.client.tsx`. Server-only hide (architect,
  dynamic): `requireAdmin()` (`lib/auth/require-admin.ts`).
- `/api/auth/guest?redirectUrl=…` — guest sign-in (hard navigation, sets the session cookie).
- `registerRedirectUrl(href, role)` (`lib/runtime-urls`) — builds the register redirect.
- `register()` — promotes a guest to a full account (platform-side, `:3001`); `user.id` is preserved.
- `POST /api/project/default/<resource>` — write a visitor's data; the row is stamped with their `user.id`.

Roles: `guest / user / architect` — enforced tiers; + business roles (full list — `ALL_ROLES`, 15:
`vip_user`, `subscriber_lite/standard/max`, `buyer`, `manager`, …). **Guest ≠ unauthenticated**: on a page
with `requiresGuestRegistration: true` the guest is issued a permanent `user.id`, their work persists and
attaches to the account on registration.

> Recipe — `HOW-USE-AUTH.md`; role vocabulary — `lib/roles.ts` (`ALL_ROLES`).

**Public app-shell auth (when to turn login ON).** The auth LAYER always exists (the admin/owner
login is always there); what is OFF by default is the **public, visitor-facing** login in the app
shell. It is a build-time toggle `NEXT_PUBLIC_APP_SHELL_AUTH = left | right | off` — you never build
login screens, you ENABLE the existing layer. Turn it ON only for apps that genuinely need visitor
accounts (store / social / SaaS / dashboard); leave it OFF for a landing page or portfolio (every
extra control costs bundle size + deploy time). **When the owner asks you to build something that
requires accounts, enabling app-shell auth is part of the job — add it WITHOUT asking separately; ask
the owner ONLY the drawer side (left or right).** How: the `manage-app-shell-auth` skill / the
`owner_app_settings_set_app_shell_auth` MCP (sets the env key, rebuilds), or Admin → App Settings →
App authorization. Build-time → applies after a rebuild. Recipe → `HOW-USE-AUTH.md`.

---

## 6. Development pipeline

The core of the document — a strictly sequential, recursive pipeline you must **never deviate from**,
expressed as XML for unambiguous branching. Read the whole block before acting.

```xml
<pipeline name="development" rules="never-deviate; sequential; recursive">

  <law id="realtime-pages">/architecture, /development-steps, /ai-draft-settings, /patterns poll the
    filesystem and highlight (pulse/blink) changed nodes; the architect sees you complete/create sub-steps
    in real time. Every on-disk action = a visible event.</law>
  <law id="multi-cycle">A task may not fit in one cycle — normal. If sub-steps don't resolve it, create one
    or more new steps (with descriptions) for the next session instead of forcing it. One request usually
    spawns 2-3 new steps and/or a dozen sub-steps.</law>

  <stage id="6.0" name="Session entry">
    <action>Detect and announce mode: curl /api/rag/status OR test -d /opt/fractera/app -> PROD (changes
      visible only after deploy) else DEV (hot-reload, Brain offline); discipline identical in both.</action>
    <action>Read GLOSSARY.md (terms) and COMPLETED-STEPS/ (history — don't re-solve solved problems).</action>
    <action>Check memory: GET /api/rag/status; offline -> work from files on disk.</action>
    <action>Read the LANGUAGE SET before authoring ANY content (step 150): the languages in
      NEXT_PUBLIC_SUPPORTED_LANGUAGES (the slot's .env.local — a plain file read, NO API). It is the ONE
      authority. Author/translate ONLY for languages in it; NEVER infer the language from the request alone
      (a request written in Russian does NOT mean the site ships Russian). A language outside the set is
      degraded safely at runtime (the app will not crash — step 149 vaccine) but authoring it wastes work and
      ships dead files; if the owner wants a new language, add it via App Settings FIRST (rebuild), then author.</action>
    <action>Adding a language to an EXISTING site (many pages/sections) is a DEDICATED capability — the
      expand-site-language skill / owner_content_add_site_language: it fans the language across every group
      and post (seeded with the default language so the site is valid instantly, noindex until translated —
      Doorway guard), updates the 4 menus, and opens one translation step per language; real translation is
      the separate, non-blocking owner_content_translate_pending runner (no deploy). NEVER add a language by
      hand-editing, by re-composing, or via manage-content-collections / owner_template_update_group — they
      cannot add a per-page locale and will break the site.</action>
    <gate>mode announced; GLOSSARY.md + COMPLETED-STEPS/ read; rag status known; language set known</gate>
  </stage>

  <stage id="6.1" name="Triage">
    <triage>
      <trigger n="1" type="next-step" source="NEW-STEPS/" goto="6.3"/>
      <trigger n="2" type="direct-task" goto="6.3"/>
      <trigger n="3" type="architecture-state" goto="flow-B"/>
      <trigger n="4" type="agent-drafts" goto="flow-A"/>
    </triage>
    <flow id="flow-A" page="/ai-draft-settings" folder="AI-DRAFT-SETTINGS/{AGENT}/ (SKILLS/, MCP/)">
      <action>convert each draft into a new step (spec)</action>
      <action>delete the draft record (Discard / Remove draft)</action>
      <constraint>do not touch the original instruction/skill/MCP files; build nothing here</constraint>
    </flow>
    <flow id="flow-B" page="/architecture">
      <action>take ONE record: todo on a live route | declared page (README.md, no built file) | danger/deletion</action>
      <action>delete it on the tab; create a step for it (OR materialize many at once: hover a pending node -> Launch bundles EVERY pending record into one step and removes the sources; the skill declare-architecture-page-or-task and MCP owner_arch_create_record / owner_arch_send_to_steps do the same for an agent)</action>
      <repeat until="tree empty"/>
    </flow>
    <brainstorm ref="section-2" mode="adaptive">survey until "go/proceed"; next-step -> minimal,
      direct task -> dense</brainstorm>
    <gate>exactly one trigger chosen; goal restated to the architect and confirmed "go"</gate>
  </stage>

  <stage id="6.2" name="Enrich task context">
    <action optional="true">targeted memory query: POST /api/rag/query (mode hybrid) to prefetch -> then
      verify in the real source on disk (memory accelerates, it is not the truth)</action>
    <action>quick shallow pass over /patterns (PATTERNS/): memorize pattern names for reuse</action>
    <gate>every memory-derived claim used was re-checked against the source on disk</gate>
  </stage>

  <stage id="6.3" name="Open a step">
    <action>create NEW-STEPS/{NN}-slug.md with the fractera:step block and importance
      (optional|mandatory|critical); exact format in development-steps.md. Describe inputs, planned result,
      intermediate results (decomposition), planned routing-tree changes.</action>
    <action>create the intermediate sub-steps obvious now (growing more in later cycles is normal)</action>
    <action>if needed, change the /architecture tree: a route = _meta.ts (RouteMeta) + README.md (living
      to-do); declare a page/endpoint = create README.md (declared node); tasks via
      /api/project/default/architecture/tasks</action>
    <constraint>creating a page -> FIRST decide the access shape (public|private|public+guest) per
      HOW-USE-AUTH.md (see section-5), before code, not by guessing — this access shape becomes the
      scaffold-declared-route-into-component-skeleton --access argument; an app that needs visitor
      accounts ALSO enables public app-shell auth (§5, manage-app-shell-auth)</constraint>
    <branch on="oversized-task">deliverable of THIS step = the step-chain + declared pages, not code</branch>
    <gate>fractera:step block parses and importance set; every declared page has an access shape</gate>
  </stage>

  <stage id="6.4" name="Development cycle" repeat="as needed">
    <action>pull the patterns needed (/patterns); none fits -> create one and agree with the architect.
      Write code per section-4 (static-first, .client/.server naming, &lt;=200 lines).</action>
    <action>materialize the route skeleton with the scaffold-declared-route-into-component-skeleton skill (.claude/skills/scaffold-declared-route-into-component-skeleton —
      page/entry/leaf/_meta by construction, the --access shape baked in); then write only the domain code,
      never hand-type the skeleton</action>
    <action>take the matching route's task from /architecture into development (get existing steps/elements
      for the node); do the next sub-step:</action>
    <substep id="6.4.2.1" name="finish">close the task in /architecture; clear README.md
      (declared -> live once the real route file exists)</substep>
    <substep id="6.4.2.2" name="decompose">add new sub-steps to NEW-STEPS/ and new to-dos to /architecture</substep>
    <action>mark each iteration in the task checklist</action>
    <action>while waiting on a deploy/feedback, don't idle: extract new patterns from the fresh code; on a
      long step do not cross the 50% context boundary</action>
    <note name="composition">composition = assembling the page from parallel-routing slots + reusable
      patterns per shell-component-architecture.md (happens here, in the per-page cycle)</note>
    <gate>per iteration: README task cleared, checklist item ticked, code obeys section-4</gate>
  </stage>

  <stage id="6.5" name="Verification (pre-deploy)">
    <action>run and check the change's behavior locally / on the current server, before the deploy</action>
    <gate>the new behavior was reproduced at least once</gate>
  </stage>

  <stage id="6.6" name="Two proofs">
    <action>present the architect two independent proofs from different planes (e.g. page renders the
      result AND a row appears in the DB); the fifth proof is the live URL after deploy (6.8)</action>
    <gate>two genuinely independent proofs, both reported in plain text</gate>
  </stage>

  <stage id="6.7" name="Deploy preparation" requires="architect-approval">
    <action>load and re-read the anti-patterns (PATTERNS/ANTI-PATTERNS/) before launching</action>
    <branch on="discrepancy-found">cancel the deploy; fix</branch>
    <action>launch the deploy (reading DEPLOY_SECRET from bridges/app/.env.local is a sanctioned exception
      to the section-3 boundary — platform action, secret read-only); build 2-4 min, only app/ rebuilt:</action>
    <command lang="bash"><![CDATA[
DEPLOY_SECRET=$(grep "^DEPLOY_SECRET=" /opt/fractera/bridges/app/.env.local | cut -d'=' -f2)
RESULT=$(curl -s -X POST http://localhost:3002/api/deploy \
  -H "Content-Type: application/json" -H "X-Deploy-Secret: $DEPLOY_SECRET" \
  -d "{\"description\":\"what changed\"}")
JOB_ID=$(echo $RESULT | grep -o '"jobId":"[^"]*"' | cut -d'"' -f4)
while true; do
  S=$(curl -s "http://localhost:3002/api/deploy/status?jobId=$JOB_ID")
  echo $S | grep -qE '"status":"(COMPLETED|FAILED|HEALTH_FAILED)"' && break; sleep 10
done; echo $S
    ]]></command>
    <gate>anti-patterns re-read; none matches this change; the architect approved</gate>
  </stage>

  <stage id="6.8" name="Deploy result">
    <branch on="FAILED|HEALTH_FAILED">
      <action>record a Deployments row (status=error, commit); study log[]; add an anti-pattern to
        PATTERNS/ANTI-PATTERNS/; fix; retry</action>
    </branch>
    <branch on="COMPLETED">
      <action>save useful patterns: create the category, write PATTERNS/PATTERNS/{category}/</action>
      <action>record a Deployments row yourself: owner_product_loop_record_deployment (Deployments MCP
        :3215) — platform={you}, model={your-model-id}, tokens (honest; none -> 0), commit_hash, step,
        page_url, status=ready; result=3 default (the user sets the stars)</action>
      <constraint>mark "in production" ONLY after a recheck: the live URL returns HTTP 200 (fifth proof)</constraint>
    </branch>
    <gate>terminal status handled per the branch taken</gate>
  </stage>

  <stage id="6.9" name="Close the step">
    <action>move {NN}-slug.md from NEW-STEPS/ to DEVELOPMENT-STEPS/COMPLETED-STEPS/ (status:completed,
      completedAt); write a maximally complete report (no abridgement): what was done, what you hit,
      patterns used/created, deploy errors, model, tokens</action>
    <gate>file in COMPLETED-STEPS/ with status/completedAt set and a complete report</gate>
  </stage>

  <stage id="6.10" name="Ingest to memory">
    <action>POST /api/rag/ingest (header X-Agent-Identity) the completed step file (from COMPLETED-STEPS/)
      AND everything created during the step: new patterns/anti-patterns, ADRs/docs, GLOSSARY.md terms</action>
    <gate>ingest returned OK for the step file and every artifact created</gate>
  </stage>

  <stage id="6.11" name="Report to the architect">
    <action>report completion; strongly recommend: (1) rate the result in Deployments — set stars (1-3);
      (2) reset the context before the next step</action>
    <gate>architect informed; stars + context-reset recommended</gate>
  </stage>

  <done name="Process validation">
    <rule>DONE only when EVERY stage gate (6.0-6.11) is green AND, measured against the architect's
      original request from 6.1:</rule>
    <requires ref="6.6">two independent proofs hold</requires>
    <requires ref="6.8">deploy COMPLETED and the live URL returns HTTP 200</requires>
    <requires ref="6.9">the step sits in COMPLETED-STEPS/</requires>
    <requires ref="6.10">the step is ingested</requires>
    <on-red>any gate red -> the process is IN PROGRESS: never say "done"; loop back to the failing stage and
      re-run from there</on-red>
    <note>per-stage gates verify "built right"; this final gate validates "built the right thing"</note>
  </done>

</pipeline>
```

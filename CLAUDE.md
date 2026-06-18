# CLAUDE.md

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
media — `:3300`, orchestration — Hermes `:9119`.

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

**Static-first (SSG/ISR).** All routing is server-generated; client components in routes are forbidden. The
overwhelming majority of content is SSG/ISR. Client routing for dynamic pages — only in extreme cases and
only by agreement with the user. Remember the Next traps that silently break static/ISR: `auth()`,
`cookies()`, `headers()` in a layout/page.

**File naming (mandatory).** Every JSX file ends in `.client.tsx` or `.server.tsx`.
Format: `[domain]-[entity]-[detail]-[role].suffix`
- `breadcrumb-trail.server.tsx` ✅
- `header-action-bar.client.tsx` ✅
- `breadcrumb-nav.tsx` ❌ (no domain, no role suffix)

**Size limit.** Max 200 lines of code in one component (excluding imports/exports). Does not apply to data
and CSS — there size is not line-limited.

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
- `useRouteAccess(meta)` (`lib/hooks/use-route-access.ts`) — client guard: per `_meta.ts` it applies
  public / public+guest / private; reads `/api/me`, never `auth()` in a page.
- `/api/auth/guest?redirectUrl=…` — guest sign-in (hard navigation, sets the session cookie).
- `registerRedirectUrl(href, role)` (`lib/runtime-urls`) — builds the register redirect.
- `register()` — promotes a guest to a full account (platform-side, `:3001`); `user.id` is preserved.
- `POST /api/project/default/<resource>` — write a visitor's data; the row is stamped with their `user.id`.

Roles: `guest / user / architect` — enforced tiers; + business roles (full list — `ALL_ROLES`, 15:
`vip_user`, `subscriber_lite/standard/max`, `buyer`, `manager`, …). **Guest ≠ unauthenticated**: on a page
with `requiresGuestRegistration: true` the guest is issued a permanent `user.id`, their work persists and
attaches to the account on registration.

> Recipe — `HOW-USE-AUTH.md`; concept — `CRUD-DOCS/auth-architecture.md`.

---

## 6. Development pipeline

**This is the core of the document.** Everything above is preamble; here is the pipeline you run
development by and from which **you must never deviate**. The flow is strictly sequential but **recursive**:
at almost every beat you decompose the task and spawn sub-steps, drilling down to the level where a
sub-task is doable with minimal errors. Two cross-cutting laws apply on every beat:

- **Realtime pages.** `/architecture`, `/development-steps`, `/ai-draft-settings`, `/patterns` poll the
  filesystem and highlight (pulse/blink) changed nodes — the architect sees in real time how you complete
  or create sub-steps. Every action you take on disk = a visible event in the interface.
- **A task may not fit in one cycle — that is normal.** If sub-steps don't resolve the task in the current
  cycle, you are NOT obliged to force it through at any cost: you create one or more **new steps** with
  descriptions so the next session (you or another model) repeats the pipeline. One architect request
  usually spawns not a single completion but 2–3 new steps and/or a dozen sub-steps. That is the correct
  scenario.

### 6.0. Session entry
Before any action:
- **Mode.** Detect and announce: `curl -s --max-time 2 http://localhost:3002/api/rag/status` or
  `test -d /opt/fractera/app` → **PROD** (changes are visible only after deploy); otherwise **DEV**
  (hot-reload, Brain offline). Discipline and proof requirements are identical in both.
- **Context.** Read `GLOSSARY.md` (project terms — otherwise concept drift) and the completed history in
  `COMPLETED-STEPS/` (what was already built and why — don't re-solve solved problems).
- **Brain.** Check memory availability: `GET /api/rag/status`. Offline → work from the files on disk.

### 6.1. User request · triage
- **6.1.0 Classify the request** into one of four triggers and enter the matching branch:
  1. "next step" → take the top one from `NEW-STEPS/` (the `/development-steps` page);
  2. **direct task** "build …" → straight to opening a step (6.3);
  3. "architecture state" → flow B (6.1.2);
  4. "agent drafts" → flow A (6.1.1).
- **6.1.1 (flow A) Drafts on `/ai-draft-settings`** (folder `AI-DRAFT-SETTINGS/<AGENT>/`, subfolders
  `SKILLS/`, `MCP/`): **convert each** draft into a new step (as a spec) and delete the draft record
  (Discard / Remove draft). Do **not** touch the original instruction/skill/MCP files — a future step
  applies them. **You build nothing here** — you only turn drafts into steps.
- **6.1.2 (flow B) Architecture state `/architecture`:** take **one** route record — a to-do on a live
  route, a declared page (has `README.md`, no built file), or a danger/deletion request — delete it from
  the tab and create a step for it. Repeat until the tree is empty.
- **6.1.3 Brainstorm** per §2 (survey until "go / proceed"), **adaptively**: on an already-decomposed
  "next step" — minimal; on a direct task — dense.

> Ideal cycle completion: both service pages (`/architecture` + `/ai-draft-settings`) are empty **and** the
> current step is closed.

### 6.2. Enriching task context
- **6.2.1** Optionally, as needed: a targeted memory query (`POST /api/rag/query`, mode `hybrid`) to
  prefetch context — then **verify in the real source on disk** (memory is an acceleration layer, not the
  truth).
- **6.2.2** A quick, shallow pass over the `/patterns` page (folder `PATTERNS/`): memorize the **names** of
  existing patterns — they'll help for reuse.

### 6.3. Opening a step (development step)
- **6.3.1** Create the step file `NEW-STEPS/<NN>-slug.md` with the `fractera:step` block and the
  **importance** field (`optional` | `mandatory` | `critical`). Describe: inputs, the planned result,
  intermediate results (decomposition), planned changes to the routing tree.
- **6.3.2** Create the intermediate sub-steps obvious at this stage. Growing more sub-steps in later cycles
  is allowed and normal.
- **6.3.3** If needed, change the `/architecture` tree. A route is described by two files: `_meta.ts` (the
  `RouteMeta` descriptor) and `README.md` (the living to-do). To declare a page/endpoint = create
  `README.md` (a declared node); route tasks are written via `/api/project/default/architecture/tasks`.
  **Creating a page → FIRST decide the access shape** (public / private / public+guest) per
  `HOW-USE-AUTH.md` (see §5) — before code, not by guessing.

### 6.4. Development cycle (repeatable)
- **6.4.1** Pull the patterns needed this cycle (`/patterns`); none fits — create a new one and agree it
  with the architect. Write code per §4 (static-first, `.client`/`.server` naming, ≤200 lines).
- **6.4.2** Take from the `/architecture` tree the task of the matching route into development (get the
  existing steps and elements for the node). Do the next sub-step:
  - **6.4.2.1** Finish the sub-step: in `/architecture` close the task, clear `README.md` (declared→live
    once the real route file exists).
  - **6.4.2.2** Decompose the task: add new sub-steps to `NEW-STEPS/` and new to-dos to the `/architecture`
    tree.
- Repeat the cycle as many times as needed; **mark each iteration in the task checklist**.
- While you wait for a deploy/feedback — don't idle: extract **new patterns from the fresh code**. On a
  long step watch the budget and **do not cross the 50 % context boundary**.

### 6.5. Verification (pre-deploy)
Run and check the change's behavior locally / on the current server — before launching the deploy.

### 6.6. Two proofs
Present the architect **two independent proofs** from different planes that the task is done (e.g.: the
page renders the result **and** a row appears in the DB). The fifth proof is the live URL after deploy
(6.8).

### 6.7. Deploy preparation (only with the architect's permission)
- **6.7.1** Load and **re-read the anti-patterns** (`PATTERNS/ANTI-PATTERNS/`) before launching.
- **6.7.2** Found a discrepancy — cancel the deploy, fix it.
- **6.7.3** Launch the deploy. Mechanics: `DEPLOY_SECRET` from `bridges/app/.env.local` (**a sanctioned
  exception** to the §3 boundary — deploy is a platform action, secret read-only) → `POST /api/deploy`
  (header `X-Deploy-Secret`) → poll `/api/deploy/status` until `COMPLETED | FAILED | HEALTH_FAILED`. Build
  takes 2–4 min, only `app/` is rebuilt.

### 6.8. Deploy result
- **6.8.1 Failure (`FAILED` / `HEALTH_FAILED`).** Record a row in Deployments (`status=error`, commit).
  Study `log[]`. Add a new **anti-pattern** to `PATTERNS/ANTI-PATTERNS/`. Fix — retry.
- **6.8.2 Success (`COMPLETED`).**
  - **6.8.2.1** Decide which patterns to keep; create the category, save to `PATTERNS/PATTERNS/<category>/`.
  - **6.8.2.2** Record a row in Deployments **yourself** — call `owner_product_loop_record_deployment`
    (Deployments MCP, `:3215`): `platform=<you>`, `model=<your model id>`, `tokens` (honestly; none → 0),
    `commit_hash`, `step`, `page_url`, `status=ready`. `result=3` by default — **the user sets the stars**.
    Mark "in production" **only** after a recheck: the live URL returns HTTP 200 (the fifth proof of §6.6).

### 6.9. Close the step
Move the step file `<NN>-slug.md` from `NEW-STEPS/` to `DEVELOPMENT-STEPS/COMPLETED-STEPS/`
(`status:completed`, `completedAt`). In it — a **maximally complete report, no abridgement**: what was
done, what you hit, which patterns were used and which created, deploy errors, the model, tokens.

### 6.10. Ingest to memory
Ingest into vector memory (`POST /api/rag/ingest`, header `X-Agent-Identity`) the completed step file (from
`COMPLETED-STEPS/`) **and everything created during the step**: new patterns/anti-patterns, ADRs/docs,
`GLOSSARY.md` terms.

### 6.11. Report to the architect
Report the step's completion. Strongly recommend:
- **6.11.1** Rate the result in the Deployments table — set the stars (1–3).
- **6.11.2** Reset the context before the next step.

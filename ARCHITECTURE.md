# ARCHITECTURE — the Fractera workspace

> **Foundational system knowledge for every coding agent working inside this deployed Fractera
> workspace.** Read at session start together with `GLOSSARY.md`, before any work. For every part
> of the system this document answers three questions: **what it is · what the agent CAN do here ·
> what it CANNOT do and what happens on violation.**

---

## 0. Purpose and how to read

1. **Read at the start of every session, together with `GLOSSARY.md`** (terms) — before any work.
2. **Memory before files (LightRAG-first).** Before reading source files, query the vector memory:
   `POST /api/rag/query` (mode `hybrid`, service `:9621`) — it saves tokens. Memory accelerates but
   is **not the truth**: verify every memory-derived fact against the live source on disk before
   acting. If memory is offline (`GET /api/rag/status`) — work from files.
3. This document describes **how the system is built**. The live map of THIS server's concrete
   routes, projects and tasks is the **`/service/architecture`** page in the Admin panel (`:3002`).
   The document says "how it works"; the page says "what is already built and what is requested".

---

## 1. Fundamental layers

Layers are listed **in order of priority, activation and dependency**: each next layer rests on the
previous ones. Format per layer: purpose → process/port → dependencies → agent rights (CAN /
CANNOT / consequences).

### 1.1 Authorization — the foundation of everything

**What it is.** Authorization covers the WHOLE application and provides role-based access. It
activates first: no layer operates outside its rules. A dedicated process `fractera-auth`
(**:3001**, NextAuth v5, providers: credentials + guest) is the **only writer of the session
cookie**. Every other process only reads the session via `:3001/api/session`.

**Roles.** Full vocabulary — `lib/roles.ts` (`ALL_ROLES`). Two kinds:
- **Access tiers** (enforced): `guest` → `user` → `architect`. Guest ≠ unauthenticated: on a page
  with `requiresGuestRegistration: true` a guest receives a permanent `user.id`, and their data
  attaches to the account on registration.
- **Business roles** (RBAC): `buyer`, `vip_user`, `subscriber_lite/standard/max` (customer-facing);
  `manager`, `senior_manager`, `support_manager`, `delivery_manager`, `finance`, `content_editor`,
  `admin` (staff/ops).

**How a page/API declares access.** Every route carries a `_meta.ts` with
`visibility: "public"|"private"`, `roles: Role[]`, `enforcedBy: "proxy"|"component"|"both"` (§8).
Server gates: `requireRole([...])` / `requireAdmin()` (they read cookies → the page becomes dynamic,
so they are used only on cockpit pages). Client gate: `fetch('/api/me')` inside a `.client.tsx` +
the route's `_meta.ts` (never `auth()` in a page). The public visitor login is the build-time toggle
`NEXT_PUBLIC_APP_SHELL_AUTH = left | right | off` (default off; the auth LAYER always exists — only
the visitor-facing entry is off).

**The agent CAN:** decide every new page's access shape BEFORE code (public / private / roles);
enable app-shell-auth when the app genuinely needs visitor accounts (asking the owner only the
drawer side); use `requireRole` / `/api/me` / `registerRedirectUrl`.
**The agent CANNOT:** edit the auth service itself (`services/auth` — a closed layer), issue cookies
bypassing `:3001`, or weaken an existing page's gate without the owner's explicit request.
**Consequences of violation:** broken authorization = the access of the ENTIRE system is compromised
(it covers every layer); recovery is manual by the owner, possibly a full reinstall.

### 1.2 The application layer — the public product (optional in composition)

**What it is.** The owner's main web application — process `fractera-app` (**:3000**), the open
layer where the agent builds the product. Its composition is OPTIONAL — it depends on the owner's
tasks. Access levels that may exist inside it:

- **Client dashboard** — for authenticated users (`user`) and other roles: personal history, own
  data. Reference: `app/(service)/dashboard` — `visibility:"private"`, `roles:["user","architect"]`,
  while keeping `rendering:"static"` + a client `/api/me` guard (static is preserved, the guard is
  client-side).
- **Content administration tabs** — for `manager`/`content_editor` and other staff roles: content
  administration via `requireRole([...])` (sanctioned dynamic).
- **API routes** — each carries its own `_meta.ts` (`kind:"api"`, `methods`, `roles`); the slot
  proxy gates `/api/*` by cookie OR the `x-agent-identity` header; external access is limited by roles.

**Dependencies:** authorization (1.1), data (1.5), app config (§10).

**The agent CAN:** freely create and change pages, components and APIs of this layer — it is the
agent's primary working zone; choose each page's access; reach data through `@/lib/db`.
**The agent CANNOT:** violate the static canon (§7), bring its own habitual patterns instead of the
existing ones (§4), or let a client component own a route.
**Consequences:** a dynamic page where a static one was possible = a critical error (§7); a page
that does not work without JavaScript = a critical error.

### 1.3 The Admin panel and bridges — architect only

**What it is.** The owner's cockpit — process `fractera-admin` (**:3002**), gated `architect` (in
domain mode; open in IP mode for onboarding). Everything is managed from here: deploy, domain,
memory, agents. The bridges (`fractera-bridge`, :3200–3206) hold the WebSocket links to the coding
platforms.

**1.3.1 Hermes — the "Brain" (:9119).** The orchestrator agent. It **never writes application
code** — it only calls MCP tools and delegates to the coding agents. Its purpose: **NON-repeating
tasks and prototyping of future automations** — experimentally work out the optimal path (owner's
example: figure out how to work with YouTube), test it, systematize the knowledge, and hand it to a
coding agent so THAT agent builds the durable Fractera automation. Hermes ships ~70 native tools
(web_search/web_extract, 10 browser tools, image_generate, text_to_speech, memory, session_search,
cronjob, delegate_task, execute_code, vision) + the Nous Tool Gateway (one subscription = web /
browser / images / TTS). Owner chat is **Telegram only** (the built-in web chat `:9120` was removed,
step 205). **The three-branch fork of every request** (skill `route-project-or-pages-request` / MCP
`:3229`; the deciding criterion is **REGULARITY**):
- **PAGES** (public surface) → the content pipeline, built by a coding agent;
- **DURABLE AUTOMATION** (repeats on a schedule) → the frozen `orchestrate-project-by-steps` process
  owned by a coding agent; once built it runs with **zero** runtime load on Hermes;
- **ONE-OFF** (one-time) → Hermes does it itself with native tools and builds NOTHING.

The `prefer-hermes-native` law: before building any capability from scratch, consult the catalog
`CRUD-DOCS/workspace-standards/hermes-native-capabilities.md` — if Hermes already has it natively,
do not reinvent it.

**1.3.2 LightRAG — the agentic vector memory (:9621).** The memory of the **whole project**: user
activity, automation activity, application data, general knowledge about Fractera, the architecture
of every entity, Hermes sources and more. Interface: `/api/rag/{status,query,ingest}`. Agent duties:
LightRAG-first when reading (§0.2) and **ingest on every step close** (§11) — the completed step
plus every artifact created (patterns, docs, glossary terms).

**1.3.3 The coding agents.** Platforms (subscription only — API keys are forbidden): **Claude Code ·
Codex · Google Antigravity** (still named "Gemini" in the code — a legacy name, migration pending) **·
Qwen Code · Kimi Code**; coming soon — **Grok Build**. Each is driven over a WebSocket bridge and
has an MCP bridge (`:3210–3214`: send_prompt / get_response / cancel_task / get_status /
send_terminal_text). The self-sufficiency rule: every skill/MCP is duplicated into EVERY agent's
directory (`.agents/skills` is the canon; copies in `.claude/`, `.codex/`, `.gemini/`, `.qwen/`,
`.kimi/`) — the project must keep working even with a single agent and no Hermes.

**1.3.4 Service pages** (`:3002/service/*`, architect only, all dynamic — the sanctioned exception
to the static canon; they read the slot's files via `slotRoot()` and therefore survive an app rebuild):

| Page | Purpose |
|---|---|
| **/service/architecture** | The main space. Three streams: **projects · pages · API**. On any node — study the architecture and the **source code** (built-in Monaco editor — the VS Code engine), propose changes, add a development task. A declared page = a README record; hovering a pending node → the 🚀 "rocket" (`launchBundle`) folds ALL pending records into ONE development step and hands it to a coding agent. Live polling: changed nodes blink — the owner watches the agent work in real time. |
| **/service/ai-core** | The AI core: the live catalog of every skill and MCP tool the workspace actually has; deep-links into ai-draft-settings for editing drafts. |
| **/service/development-steps** | The build queue: the slot's NEW-STEPS / COMPLETED-STEPS with real-time statuses (§11). |
| **/service/patterns** | The slot's patterns and anti-patterns (§4): read, create, statuses. |
| **/service/glossary** | Edits `GLOSSARY.md` — the project's term dictionary. |
| **/service/documents** | Workspace documents (the knowledge base; ingested to memory). |
| **/service/ai-draft-settings** | Skill/MCP drafts per agent (`AI-DRAFT-SETTINGS/{AGENT}/`) — the "draft → step → capability" pipeline. |
| **/service/debug** | The debug surface. |

**The agent CAN:** call the admin APIs (`:3002`) for their purpose (deploy via `POST /api/deploy`
with the secret, Hermes config via the forwarder), read/write through the service pages' APIs,
register capabilities through ai-draft.
**The agent CANNOT:** edit `bridges/` code (a closed layer), touch other processes, or change the
domain/certificates without the owner's request.
**Consequences:** breaking the admin panel deprives the owner of control over the ENTIRE system —
it is their only cockpit.

### 1.4 Fractera automations — their own layer (:3003)

**What it is.** The layer of durable automations — a **separate process** `fractera-projects`
(**:3003**, subdomain `projects.<domain>` in domain mode). A Fractera automation = "an n8n for one
single task": a finished tool with a visual diagram (react-flow), process and results tables, which
the owner runs in one click and never re-creates the request again.

**Why a separate process (critical, step 197).** Automations used to live inside the main app's
build: a broken `:3000` build took down ALL live automations. Now the layer is isolated: the
scheduler (`fractera-cron`, substrate, scans the projects' `cron.json` every 15 s) and the Telegram
receiver (`fractera-automations`, one bot = one automation) target **:3003** — a crash or rebuild of
the application (`:3000`) does **not** stop them (proven by a live test: the slot stopped → the run
route still answered).

**Four project groups** (a category = a real folder, `/projects/<category>/<project>`; a project
name is at least three words):

| Group | Route | Example |
|---|---|---|
| Business automation | `/projects/automation` | YouTube activity automation |
| Personal automation | `/projects/personal` | telegram-notes: voice notes, reminders, finance tracking |
| Site-pages automation | `/projects/fractera-pages` | every 24 h an agent studies a Telegram channel's news, analyzes it and publishes pages to the owner's blog |
| Other | `/projects/other` | auto-coach: builds a training program, pages for the admin and the students, checks knowledge, sets grades |

Access — `architect` + `manager` only (the owner's private tools). The zone is monolingual (the
default language). A project is born through the frozen `project-page` primitive (§5) + the
`orchestrate-project-by-steps` decomposition: every project's root `README.md` carries the
`fractera:project` machine block (the node graph) — the **single source of truth** for how the
project's nodes fit together; never build a node without reading it. The automation's typed I/O
contract (`interface{inputs[], outputs[]}`, contract 196) is declared at the graph root.

**The agent CAN:** create and grow projects in this zone (its second working zone, equal to the
app); declare cron scenarios (`cron.json` is data — no rebuild); register the automation's Telegram
bot; write results to the journal (`project_cron_runs`).
**The agent CANNOT:** delete a whole project via MCP (the anti-destructive invariant — human/UI
only); build a durable automation bypassing the decomposition; put automation code back into the
application layer.
**Consequences:** an automation built into `:3000` loses its isolation — the first broken app build
kills it (exactly the defect this layer was extracted to fix).

### 1.5 The data layer (:3300)

**What it is.** Process `fractera-data` (**:3300**), two stores:
- **The local database** — SQLite `app.db`. New tables are declared ONLY in the `SCHEMA` constant
  (`lib/db/index.ts`) — both environments create them automatically at startup; there are no
  separate migrations.
- **The object storage (media)** — file uploads, previews, image crop, PWA icon generation
  (`media.db` + disk).

Access is **networked, by token**, from any process: `REMOTE_DATA_URL` + `DATA_API_KEY`
(= the service's `DATA_SECRET`). That is why every layer (app, automations, cron) sees the same
data. Every API call carries `X-Agent-Identity: <name>` — without it DB writes lose authorship
(`created_by`) and auditability is gone.

**The agent CAN:** add tables to `SCHEMA`; read/write through `@/lib/db`; upload media via
`/api/media/upload`.
**The agent CANNOT:** edit `services/data/server.js` (a closed layer); open the SQLite file directly
from another process; write without `X-Agent-Identity`.
**Consequences:** direct interference with the data layer risks ALL the owner's data — the most
expensive possible loss; a process without `REMOTE_DATA_URL`+`DATA_API_KEY` silently opens an EMPTY
local database and "sees no data" (the classic trap).

### 1.6 The design system (:3004)

**What it is.** A separate process `fractera-design` (**:3004**, subdomain `design.<domain>`) — up
and running (step 197), its content is being built. The layer's structure:
- **Typography** — the application's font system;
- **Theme** — the color scheme applied to the WHOLE application (today: `themeColors{light,dark}`
  in app-config + the tokens in `config/design/design-minimal-001.css`);
- **Design system → Theme #N** — inside each theme: **theme sections** (ready page blocks) and
  **theme UI elements** (buttons, forms, etc. in that theme).

Until the layer's move completes, the current UI standard applies: **one fixed primitive set** —
icons only `lucide-react`, interactive UI only shadcn/ui (`components/ui/*`), toasts only Sonner;
hand-rolled buttons/dropdowns/modals are forbidden.

**The agent CAN:** apply the existing themes/tokens/primitives; develop the design layer when a
development step explicitly orders it.
**The agent CANNOT:** bring third-party UI kits or inline `<svg>`; mix alternative primitive sets.
**Consequences:** a "second" primitive set splits the interface — the one-style rule is broken, and
the code is brought back to the standard at the first touch.

---

## 2. The two operating modes

| | **IP mode (insecure)** | **Own-domain mode** |
|---|---|---|
| When | Right after deployment (onboarding) | The owner attached a domain from the Admin |
| Access | `http://IP:port` (3000/3001/3002/3003/3004/3300/9621) | HTTPS, one subdomain per service: apex = the app, `auth.` `admin.` `projects.` `design.` `data.` `hermes.` `lightrag.` |
| Authorization | Bypassed (`FRACTERA_IP_NODOMAIN_MODE=true`) — everything open | Strict, role-based |
| How to switch | — | Admin → Personal Domain (the certificate is issued automatically) |

Client code neither hardcodes service addresses nor reads them from `NEXT_PUBLIC_*` — they are
derived from `window.location` (`lib/runtime-urls.ts`): one build works in both modes.

---

## 3. Agent scope of visibility

**The standard scope** of a coding agent and of Hermes: **the application layer (1.2) + the
automations layer (1.4)** — work here is free.

**Hard-forbidden layers:** authorization (`services/auth`), data (`services/data`), memory
(`services/rag`), bridges (`bridges/`). The agent reads them and calls them by API but does not edit
them.

**The override protocol (exists, but is expensive).** The ban is theoretically overridable: the
owner must **repeat the demand multiple times**, and the agent must explicitly name the risk and
receive the acceptance of responsibility: **breaking these layers may make the application
unrecoverable.** Without this procedure, any "fix auth while you're at it" is declined.

---

## 4. Patterns before implementation

**The law.** Development happens ONLY on the existing architecture. The agent is **forbidden to
bring its own habitual patterns** — folder/component/function naming, their placement, "the data
structures I'm used to". Before implementing, the agent must study the existing patterns and repeat
them.

**Where they live.** `PATTERNS/PATTERNS/<category>/NN-slug.md` (what works) and
`PATTERNS/ANTI-PATTERNS/NN-slug.md` (documented dead ends). Every file ends with the machine block
`<!-- fractera:pattern {kind, category, number, name, status, description, code, tasks[]} -->` —
the `/service/patterns` page reads and edits the same files.

**Agent duties:** a quick pass over the patterns when entering a task (stage 6.2); nothing fits →
create a new one and agree it with the architect; **a failed deploy → a mandatory new anti-pattern**
(together with the `status=error` row in the Developments table, §11). Other code conventions: JSX
files are `*.client.tsx`/`*.server.tsx`, ≤200 lines per component, co-location of an entity's data
inside its folder (`_data/`, `_lib/`, `_components/`).

**Consequences of violation:** a foreign pattern breaks the predictability of the tree — the next
agent (or the next session of this one) does not find what it expects; the code is brought back to
the standard, time is lost.

---

## 5. The starter template and frozen entities

**The idea.** The platform ships as a **highly advanced starter template with an EXCESS of
entities** — header, footer, blog, news, documentation, dashboard, etc. Their job is to **form the
patterns** of the application's growth: the agent extends what exists instead of inventing. At the
start the owner decides which excess entities to delete — and the AI deletes them quickly and
irreversibly (`owner_content_manage_collection`: delete group / delete page).

**Frozen templates (the frozen store).** Structural blanks are **copied, never generated**: the
composer substitutes tokens (`{{TAB}}`, `{{CATEGORY}}`, `{{PROJECT}}`) into frozen `.tpl` files —
zero code improvisation. The discipline is "freeze a pattern, not a guess": there are exactly as
many primitives as life has proven:

- **`files-depth1`** — a flat file-backed list: blog, news, documentation, changelog are ONE brick
  with different parameters (the Two-Slot Law: Slot A — the list source, Slot B — the uniform
  aspects i18n/roles; no combinatorial explosion);
- **`project-page`** — the automation page (11 files: the react-flow diagram, the cron-queue and
  results tables, the README with the project graph).

Header/footer are NOT frozen primitives — they are the shell's parallel-routing slots.

**The FROZEN vs REAL-DEV border is an OPERATION, not a phase:** creating a new structural blank =
the frozen pipeline (MCP, deterministic); modifying what exists or authoring real content = real
development by a coding agent (`task-scenario-router.md`).

**The agent CAN:** compose new groups/pages/projects through the composer (MCP :3224/:3226/:3227);
replace placeholder stubs with real content; propose freezing a new primitive after a pattern is
proven.
**The agent CANNOT:** hand-copy structure around the composer; leave an unsubstituted `{{TOKEN}}`
(a hard gate refusal); modify a frozen `.tpl` for a one-off task.
**Consequences:** a manual copy diverges from the template at the first update; an unsubstituted
token breaks the slot build.

---

## 6. Multilingualism

- The catalog holds **82 languages** (`config/translations/language-metadata.ts`, each with an AI
  translation quality tier). The default language is **English**; the owner may add any of the 82
  and designate any as the default. The set is defined by `NEXT_PUBLIC_SUPPORTED_LANGUAGES`
  (+ `NEXT_PUBLIC_DEFAULT_LOCALE`) in the slot's `.env.local` — the **single authority**; the
  language of a user's request does NOT imply the site's language.
- **Development always happens in the default language.** If 80 pages of one news item are created —
  all are created in the default language (no default declared → English). One post = ALL languages:
  the slug is chosen once, translations are `<lang>.ts` cells in the SAME folder
  (`_data/{meta.ts, en.ts, <lang>.ts}`) — never a second post.
- **Translation is a separate flow**, so the model does not burn time and tokens on translations in
  the main thread: the `owner_content_translate_pending` runner writes INTO the cells with no
  deploy. A translation admin panel is NOT included — it is built on the owner's request as an
  ordinary task.
- **Adding a language to an existing site** — only the dedicated `owner_content_add_site_language`
  pipeline (fans across every group and post, noindex until translated — the Doorway guard). Doing
  it by hand is forbidden.
- **Encoding integrity:** `npm run check:encoding` before closing a content step; the emitters
  refuse broken characters on write.

---

## 7. The static canon (no-JS)

**The law (verbatim):** creating dynamic pages is **forbidden**. The exception — only when
ABSOLUTELY necessary, and only after the **architect's double confirmation**. The principle: better
to build nothing than to make dynamic what could have been static.

**The foundation.** The application MUST work with JavaScript switched off — a violation is a
**critical error**. The real no-JS killer is client-side routing / a client component owning a route
(not server rendering as such). The ladder of choice: SSG → ISR (`revalidate`) → on-demand
revalidate → dynamic (by exception) → client fetch.

**Exceptions:** only the dynamic pages of the admin panel and the dashboard — the architect's
service cockpit (`/service/*`) and the managers' admin tabs may and should stay dynamic; the client
dashboard itself remains static with a client-side guard.

**Traps (forbidden):** `force-dynamic` on the root layout (makes the WHOLE subtree dynamic);
`auth()`/`cookies()`/`headers()` in a layout/page; animation with `initial={{opacity:0}}` (the page
arrives invisible without JS). A sanctioned deviation is recorded in the `noJsConsent{by, at, scope,
reason}` field of `_meta.ts` — without the record, the consent does not exist.

---

## 8. Page attributes

Every page carries **two attribute files with different jobs**, plus the living task record:

**(a) `_meta.ts` — the route's typed passport** (`RouteMeta`, `lib/architecture/route-meta.ts`), on
EVERY page and EVERY API. Field groups: identity (`kind`, `path`, `status:
live|requested|wip|deprecated`, `todo[]`); **access** (`visibility`, `roles[]`, `enforcedBy`);
routing shape (dynamic segments, parallel slots, layout); **rendering** (`static|dynamic|isr`,
`revalidate`, `runtime`, cache); **SEO** (indexable, sitemap, canonical, OG, JSON-LD); **i18n**
(`localized`, `locales[]` — the list of translation languages, `defaultLocale`); composition
(`entryComponent`, `pageIsClient` — true = a violation); `noJsConsent`. The rule: **every key is
always present** — "not applicable" is expressed by value, never by deletion; the architecture
scanner catches divergence from reality (drift).

**(b) `_data/group.ts` — the content group manifest** (`GroupManifest`): `slug`, `languages` (the
group's languages), `roles`, **`menus`** — four slots `top/footer/left/right` `{enabled, order}`
(all disabled by default), `childrenAsDropdown`. Edited **only** through the MCP
`owner_template_update_group`.

**(c) The NEW API attribute (being introduced, contract 196).** The page's link to the automation
system: at an automation's graph root — a typed `interface{inputs[], outputs[]}` (a closed port
vocabulary: channel / page / store / schedule / event / manual / external-api); an automation whose
output is a page interacts with it through a **gateway** with two planes — management
(create/configure/moderate) and interaction (runtime verbs for stateful pages: addCard / moveCard /
submit). A page declares its participation declaratively; bespoke ad-hoc endpoints are forbidden.

**(d) Role-gated page slots.** A page may carry extra role-scoped surfaces — an administration tab
(staff roles) and a dashboard view (`user`): declared via `roles` in the meta/manifest, guarded by
the §1.1 gates.

**The agent CAN:** create `_meta.ts` together with every page (it is part of the skeleton —
`scaffold-declared-route-into-component-skeleton`); declare todos directly in the passport.
**The agent CANNOT:** delete "not applicable" keys; hand-edit `group.ts`; invent custom attributes
outside the types.
**Consequences:** a passport diverged from reality breaks the `/service/architecture` page — the
owner loses the map of their own application.

---

## 9. Preinstalled tools

Ready-made tools that avoid programming the most common extensions:

- **Image crop** — the built-in upload pipeline: `image-cropper` (aspect-ratio modes, canvas →
  JPEG) → `/api/media/upload` → the object storage (:3300) with previews;
- **PWA/favicon icon generation** — from one square logo (`POST /media/generate-icons` → an
  `IconSet`, served at `/api/media/icons/...`);
- **Image search & generation — coming soon** (Hermes already has generation natively:
  `image_generate`);
- 18 preinstalled skills (catalog — `/service/ai-core`): frozen-template composition, multilingual
  content, the language switcher, encoding audit, env-var persistence and more.

The rule: before programming an extension — check this list and Hermes' native arsenal.

---

## 10. app CONFIG — the single meta-settings layer

**What it is.** All the application's meta records and specializations are managed **from one
place** — the file `APP-CONFIG/app-config.json`, edited via **Admin → Site Settings WITHOUT a
rebuild** (no NEXT_PUBLIC bake-in). Contents (`AppConfig`): company name / short name, description,
URL, **logo**, 11 image slots (OG, error pages, loading — light/dark), icons + IconSet, the PWA
manifest (colors, display), `themeColors{light,dark}`, the SEO block (indexing, title template,
robots, verification, social), the OG block, author, analytics, JSON-LD (website / organization /
localBusiness), the company's geo data (address, hours, coordinates).

**The agent CAN:** read via `getAppConfig()` (server-only); change values via the
`owner_app_settings_*` MCP / the Admin.
**The agent CANNOT:** hardcode the company name/logo/meta in pages (this layer exists precisely for
that); duplicate these values in its own configs.

---

## 11. Development steps — the hard discipline

**Following the steps is a contract, not a recommendation:**

1. **Materialize before executing.** Every known sub-step is written as ITS OWN file
   `DEVELOPMENT-STEPS/NEW-STEPS/NN-slug.md` BEFORE any work starts (the machine block
   `fractera:step {number, name, importance: optional|mandatory|critical, status, tasks[]}`). The
   chain of files ON DISK is the plan: a process death loses nothing, and a cold session resumes
   from the files.
2. **Recursion is the norm.** If the sub-steps do not resolve the task, NEW steps are born from the
   step (one request usually spawns 2–3 steps and a dozen sub-steps). Forcing the unresolvable into
   one step is forbidden.
3. **Closing a step**: the file moves to `COMPLETED-STEPS/` (`status: completed` + `completedAt` +
   a **maximally complete report** — what was done, what it hit, which patterns were used/created,
   deploy errors, model, tokens).
4. **Ingest to memory**: `POST /api/rag/ingest` — the step file plus every artifact created.
5. **A row in the Developments table** — **mandatory, via the MCP :3215**
   (`owner_product_loop_record_deployment`: platform, model, tokens (honest; none → 0), commit_hash,
   step, page_url, status). This is the "like Vercel" standard: every deployment chain preserves its
   history. A failed deploy → a `status=error` row + a new anti-pattern (§4). "In production" —
   only after a recheck: the live URL returns 200.

Progress is visible to the owner in real time on `/service/development-steps` and
`/service/architecture` (blinking nodes) — every file on disk = a visible event.

---

## 12. The MCP inventory for the agent

L2 bridges (JSON-RPC, loopback, `Bearer $HERMES_MCP_SECRET`; access tiers public ⊆ user ⊆ owner):

| Port | Bridge | What it gives the agent |
|---|---|---|
| 3210–3214 | platforms (claude/codex/gemini/qwen/kimi) | send_prompt / get_response / cancel / status / terminal |
| **3215** | **Deployments (Product Loop)** | record/list/update_deployment · create/list_projects (no delete) |
| 3216 | Readiness | the 5-agent readiness snapshot (installed/logged_in/busy) |
| 3217 | Parallel-routing | shell slot state/toggle, theme, width |
| 3218 | App-settings | app-config text fields · languages · app-shell-auth |
| 3219 | Public-consultant | the public page list (public tier) |
| 3220 | Client-actions | client-side navigate/locale/theme (public tier) |
| 3221 | AI-draft | create a skill/MCP draft (`AI-DRAFT-SETTINGS/`) |
| 3222 | Arch | create an `/architecture` record · send to steps |
| 3224 | Template-constructor | list_primitives · compose_structure · list/update_groups · compose_project_page |
| 3225 | Deploy | rebuild the slot (build + reload + health) |
| 3226 | Content-CRUD | create/edit/**delete** × group/page |
| 3227 | Content-orchestrator | content orchestration by steps · perceive_workspace (live FS scan) |
| 3228 | Language-expansion | add a language · translate pending · broken-character scan |
| 3229 | Projects-router | request routing (pages/durable/one-off) · needs survey · project decomposition |
| 3230 | Doc-transfer | external documentation → CRUD-DOCS + memory (only metadata returns to context) |

Hermes plugin: `owner_delegate_task_to_platform` / `owner_delegate_task_to_best_platform`.

---

## 13. The map of related documents

| Document | What it carries |
|---|---|
| `GLOSSARY.md` | The project's terms — read at session start together with this document |
| `STATIC-FIRST.md` | The full static canon + recipes (§7) |
| `CRUD-DOCS/workspace-standards/frozen-template-constructor.md` | The full frozen-pipeline standard (§5) |
| `CRUD-DOCS/workspace-standards/multilingual-content.md` | Multilingual content (§6) |
| `CRUD-DOCS/workspace-standards/task-scenario-router.md` | The FROZEN vs REAL-DEV border |
| `CRUD-DOCS/workspace-standards/hermes-native-capabilities.md` | Hermes' native arsenal (~70 tools) |
| `HOW-USE-AUTH.md` | Authorization recipes (§1.1) |
| `shell-component-architecture.md` | The route skeleton (thin `page.tsx`, `_components/index.tsx`) |
| `CRUD-DOCS/workspace-standards/development-steps.md`, `patterns.md` | The step and pattern formats (§4, §11) |

---

*Process topology of this document's layers: 10 processes — auth 3001 · app 3000 · admin 3002 ·
projects 3003 · design 3004 · bridges 3200–3206 · data 3300 · cron (no port) · rag 9621 · hermes
9119 (+ the messaging gateway).*

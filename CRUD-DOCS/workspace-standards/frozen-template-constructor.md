# The Frozen Template Constructor — the one core doc

> **This single file is self-sufficient.** It is the authoritative strategy, from first principles, for how an
> AI agent (the built-in brain **Hermes**, or any coding agent — Codex / Claude / Gemini / Qwen / Kimi) adds a
> **whole structure** to a site — a news feed, a blog, a documentation tree, a catalogue — by **composing** it
> from proven, frozen building blocks, with **zero code generation**. If every other doc were deleted and only
> this one kept, frozen-template development could continue without reading any prior step or pattern.
> This doc is agent-facing and English-only (no RU translation — it is read by AI agents). The site's
> download button serves the identical English copy at FES `public/docs/frozen-template-constructor.md`.

---

## 0. Why this exists — complex tasks at minimal token cost

Adding a real, multilingual, access-gated, menu-registered content section to a Next.js app is a **large,
error-prone technical task**: dozens of files, exact conventions, i18n fallback, route skeletons, a list
provider, a menu manifest, a build. Done by hand it is slow and token-heavy; done by **LLM code generation**
it is non-deterministic — a different, untested result per model, with risk baked into every creation.

The Frozen Template Constructor removes both costs. The agent does **not** write the files and does **not**
generate code. It **describes intent** (a few light parameters — "a news section, en+es, public, 2 sample
posts") and the constructor **composes** the structure by copying + token-substituting **vetted frozen
bricks**. Consequences:

- **Minimal tokens.** The agent emits a short intent, not hundreds of lines of code. A whole section is one
  tool call.
- **Determinism.** Composition wires frozen pieces; **any model produces the identical result.** *Freeze a
  pattern, not a guess.*
- **Safety.** No untested code reaches the build. Integrity is enforced (folder===slug, only the app's
  languages, no foreign-script junk).

This is how a weak model (Hermes mini) can reliably perform a task that would otherwise need a senior engineer:
the intelligence is **frozen into the bricks once**, not re-derived per request.

---

## 1. The complete call map (every operation the agent has)

The capability spans four MCP servers + one dependency. **Every logical operation is its own row** — one MCP
tool may carry several operations (create/edit/delete; or path/roles/languages/menus). All are `owner`-tier;
every **mutating** call must preview with `dry_run` and get explicit confirmation (§"Confirm-first") before
the real call. After **any** mutation the slot needs a **rebuild** (#18) to go live.

| # | Tool · operation | This call lets the agent… |
|---|---|---|
| 1 | `owner_template_list_primitives` | see **which kinds of structure can be composed** (the available bricks). Read-only. |
| 2 | `owner_template_compose_structure` | **create a whole new section** (news/blog/docs) at once — with `samples=N` placeholder posts in one shot. |
| 3 | `owner_template_list_groups` | **list every existing page-group** and its settings (languages, access, menu placement). Read-only. |
| 4 | `owner_template_update_group` · path | **change a group's URL/folder** (rename the section, e.g. `news`→`guides`) + parser-fs. |
| 5 | `owner_template_update_group` · roles | **restrict a section's access** to roles (or make it public) — rewrites the layout gate. |
| 6 | `owner_template_update_group` · languages | **change a section's language set** (add/remove a language's UI chrome). |
| 7 | `owner_template_update_group` · menus | **show a section in a menu** (top/footer/left/right) and **set its button order**. |
| 8 | `owner_template_update_group` · children-dropdown | **expand a section's child pages as a dropdown** in the menu (vs a link to the index). |
| 9 | `owner_content_manage_collection` · create group | **create a new page-group** (tab) for content. |
| 10 | `owner_content_manage_collection` · edit group | **change the tab's chrome/labels.** |
| 11 | `owner_content_manage_collection` · delete group | **delete a whole page-group.** |
| 12 | `owner_content_manage_collection` · create page | **create a new page inside a group** (a clone of the frozen stub; light metadata only). |
| 13 | `owner_content_manage_collection` · edit page | **change a page** (title/date/tags). |
| 14 | `owner_content_manage_collection` · delete page | **delete one page** from a group. |
| 15 | `owner_content_orchestrate` | **do a content task end-to-end** — it decomposes the intent into dev-steps, runs each, deploys, records it. |
| 16 | `owner_perceive_workspace` | **see what actually exists now** (live tree of sections+pages) before acting. Read-only. |
| 17 | `owner_report_blocker_step` | **stop honestly and file a blocker step** for a coding agent when the task is beyond no-code. |
| 18 | `owner_deploy_rebuild_slot` | **rebuild the site** so any change goes live. **Mandatory after every mutation.** |
| 19 | `owner_app_settings_set_languages` | **add a language to the whole app** — the prerequisite before authoring content in it (#6 stays within this set). |

**Which tool when.** Brand-new section with test posts → **#2** (compose; `samples=N` is the right way to get
several test posts, *not* repeated #12). One page in an existing section → **#12**. Re-arranging menus / access
/ path / languages of an existing group → **#4–#8**. "Just make it right, end-to-end" → **#15** (it picks #2
or #12 for you, runs the full step lifecycle, and records the deploy — the gate that closes a step). Always
**#16 first** to see reality; **#18 last** to publish.

**Not yet covered (roadmap, refuse honestly if asked):** re-ordering *pages within a group* (post order is
by data/date, no move-op), *moving a page between groups*, and *reading one page's body* (only the tree is
read, #16). These are candidate future bricks — propose, don't fake.

---

## 2. The core idea: a constructor, not a catalogue

> **A constructor is a deterministic function that COMPOSES a structure from a small basis of proven, frozen
> primitives, parameterised by a description of what you need. It never generates code.**

A catalogue of finished templates (one for news, one for blog, one for a 2-level docs tree, one for a DB
catalogue…) does **not** scale: the real space has several independent dimensions (depth, data source, access,
languages); a catalogue needs a template for **every combination** — the N² trap. Generating per request
brings back untested, model-dependent code. The answer is neither — it is **LEGO**: a few well-made bricks +
a few composition rules compose an enormous space. Two properties make it safe: **determinism** (identical
result from any model) and **Open/Closed** (a new capability = a new brick in the basis, never a rewrite of the
core).

---

## 3. 🔒 The Two-Slot Law (what makes it additive, not N²)

Every property of a structure lives in **exactly one of two slots — never interacting across them**:

| Slot | Holds | Examples |
|---|---|---|
| **A. List provider** (data) | *where the children come from* | filesystem scan · DB-at-build · (future) runtime |
| **B. Uniform aspect** (layout) | *a cross-cutting rule applied identically at every level* | i18n · roles/access · (future) theme |

> A property is either a **list provider** or a **uniform aspect**. There is no third slot. A uniform aspect is
> embedded the **same way at every level** (it lives in the layout), **independent of hierarchy depth and data
> source**. **Cross-slot interaction is forbidden.**

This is the line between **additive** and **quadratic** cost. **Enforcement:** if a feature *requires* a
special case by depth or by data source, that is a design smell — **reject it**, do not bend the constructor.

---

## 4. The basis: base grid + dynamic descriptor

**Base = {data source} × {depth}.**

```
            depth 1        depth 2          depth 3            depth 4
          (flat list)   (section→items)  (taxonomy)        (deep tree)
files     ▢ news/blog    ▢ docs-by-cat     ▢ knowledge base   ▢ deep manual
DB        ▢ DB list      ▢ DB sections     ▢ catalogue        ▢ deep catalogue
```

- **Data source** = a swappable **list provider** (Slot A): today a filesystem scan (`parser-fs` builds the
  child list); for DB, a **build-time query** (output is still static). Same seam, different provider.
- **Depth** = structural nesting, a **recursive parameter** of one skeleton (each level is a hub listing the
  level below; the leaf is the document) — not four hand-written files.

That is **8 static skeletons**; static-first holds across all (a DB catalogue reads the DB **at build** and
ships static pages).

**The 9th — the dynamic descriptor.** When a structure **genuinely cannot be static** (per-user, per-request,
transactional — a live dashboard, a cart) the constructor does not force a static skeleton; it returns a
**specification** (data-access context, access rules, boundaries) that hands the work to classic development.
The honest exit, not a bad fit.

**Static-first governs the data axis.** The spectrum `files → DB-at-build(+ISR) → DB-per-request → writes →
transactions` defaults to the **left/middle**; the right side needs the architect's double confirmation. So "a
DB template" means, by default, **DB-at-build → static output**.

---

## 5. The aspects (Slot B): uniform, toggled, level-independent

- **i18n** — every level localised the same way (`[lang]` + per-tab UI chrome with per-key EN fallback). The
  canonical uniform aspect.
- **Roles / access** — two layers: enforced tiers (`guest`/`user`/`architect`) + business RBAC (`ALL_ROLES`:
  `vip_user`, `subscriber_lite/standard/max`, `buyer`, `manager`, …). The gate is **one rule embedded into
  every layout level**, identical at depth 1 or 4. Access is decided **before** building. On a wrong-role
  visit: a **localized access-denied toast** (all 82 languages, manual close) then a soft redirect.
- (future) theme, and any rule that is genuinely the same at every level.

An aspect that cannot be "the same rule at every level" is **not an aspect** — reject it.

---

## 6. The envelope: matching a request to a primitive

A primitive declares its **envelope** (its position on every axis); a request is matched by projecting it onto
the same axes.

| Axis | Example values | Slot |
|---|---|---|
| data source | files · DB-at-build · runtime | A |
| depth | 1 · 2 · 3 · 4 | base |
| static vs dynamic | static · dynamic-descriptor | base |
| roles/access | public · guest · `[role,…]` | B |
| i18n | mono · multi | B |
| (later) scale | units · thousands (SSG vs ISR) | base hint |

> **100%-fit test.** A request matches only if it fits on **every** axis. A partial fit is **not** that
> primitive. A refusal is **explainable by the specific axis** that failed ("does not fit: *roles* is
> `architect`, this primitive is `public`"). Match against the declared capability — never guess from keywords.

---

## 7. Decision flow: compose, find another, or refuse honestly

```
request
  └─ project onto the envelope axes
       ├─ a primitive fits 100% ──────────► COMPOSE it (deterministic, no codegen)
       ├─ another primitive fits ─────────► compose that one
       └─ none fits ──────────────────────► HONEST REFUSAL (name the failing axis), then ONE of:
             (a) PROPOSE freezing a new primitive — only if PROVEN by live dev, REPEATING
                   (rule-of-three), cleanly parameterisable. The agent PROPOSES; it does not
                   self-create. The "study all primitives + extract the pattern" analysis runs
                   ONLY after the architect says "go".
             (b) CLASSIC DEVELOPMENT within the existing architecture — if new/one-off/unstable.
```

(a) and (b) are a **maturity gradient**: a new shape starts as classic development; when proven and repeating,
it **earns** the right to be frozen. *Freeze a pattern, not a guess.*

---

## 8. Group registration: the manifest (menu placement — metadata, NOT a slot)

A composed group also declares **how it surfaces in the site's menus** — a property of the group's relation to
the **shell** (one record per group), not of internal composition. By the Two-Slot Law it is **neither A nor
B**: it is a **third, orthogonal thing — registration metadata** (the law governs internal composition; the
manifest governs external registration — no false "third slot" enters composition).

The composer emits a lean **group manifest** into `_data/group.ts` (`GroupManifest`, typed in the versioned
engine `lib/content-<ver>/group-manifest.ts`):

- `slug`, `languages`, `roles` — an **echo of the envelope**, so the menu reads identity/languages/access from
  **one place** (never parsing `layout.tsx` or counting `_data/*`).
- `menus` — four slots `top`/`footer`/`left`/`right` (left & right are drawer menus some designs render), each
  `{ enabled, order }`. **Default: every slot disabled, order 10** — surfacing is an explicit opt-in.
- `childrenAsDropdown` (default `false`) — `true` → menu expands the group's child pages as a dropdown;
  `false` → the button navigates to the group index. The menu decides *how*; the manifest declares *intent*.

The menu **components** are **not** part of the constructor — they are consumers that read this manifest (a
separate concern). The constructor's job ends at emitting the metadata.

**Editing a live group** (calls #4–#8) is deterministic file edits, never codegen: `slug` renames the folder +
parser-fs; `roles` rewrites the layout gate + echo; `languages` adds/removes `_data/<lang>.ts` chrome (within
the app set — add an app language via #19 first); `menus` sets visibility+order; `children_as_dropdown` flips
the dropdown. The manifest is the single surface; edits keep the real artifacts in sync so the echo never lies.

---

## 9. Engine versioning: side-by-side, pinned

- **An installed engine version is immutable.** A breaking major ships **beside** the old in its own namespace:
  `lib/content-v1/**` + `components/content-page-v1/**`, then `lib/content-v2/**` later.
- **Each structure pins its version** (imports point at `@/lib/content-v1/…`), so an old tab keeps rendering on
  v1 after v2 arrives. Namespaces differ → collision impossible. The version sentinel is **per-version**.
- **Identity is NOT versioned** — `brand`, `author`, the language set, trivial infra are the site's one shared
  identity across versions.

Trade-off (conscious): two structures on different majors may **look different** until the owner **migrates**
one. We trade "one look everywhere" for "an old structure never breaks" — right for a self-evolving system
where a year-later agent cannot be trusted to preserve backward-compat. (Pattern: SxS versioning + consumer
pinning — .NET assemblies, Go modules, Nix.)

---

## 10. 🛑 Harvest discipline (the most important rule)

The §4 grid is a **map for matching and a roadmap** — **not a plan to build all cells** (that is premature
abstraction from the other end).

> Pave the road where the traffic is. **Freeze a cell into a primitive only when it is (1) proven by live
> development, (2) repeating, (3) cleanly parameterisable.** Everything else is served by classic development
> until it earns its primitive. Grow the basis **Open/Closed**, one proven brick at a time.

Today the basis has **one** composed primitive — `(files × depth-1, i18n on, roles off)`, the reference: a
flat, file-backed, multilingual list (news/blog). It demonstrates every seam — list-provider (Slot A, swap to
DB-at-build changes only this), aspect (Slot B, turning on roles adds a gate to the same layout seam), depth
(base case), versioned engine (pins v1) — so the next brick slots in without touching the core. It ships
placeholder documents (Lorem + placeholder image) the owner replaces; adding a document is one folder.
Roadmap (build when proven): `(files × depth-2)` docs-by-category · `(DB-at-build × depth-1)` catalogue · the
dynamic descriptor.

---

## 11. 🔧 Bridge & emitter contract (hard-won; violate → silent breakage)

The composer/manager `.mjs` emitters run **per-agent** (shipped beside the skill into every agent dir); the MCP
servers spawn them and parse their output. These rules are non-negotiable — each is a real outage we paid for:

- **Last stdout line = one compact JSON object.** The MCP bridge parses the **last line** of the emitter's
  stdout as JSON. An emitter that prints pretty/multi-line JSON (`JSON.stringify(x,null,2)`) makes the bridge
  read a fragment (`}`, `10`) → `JSON.parse` fails → the tool reports **`failed (0)` on exit-code 0** even
  though the write succeeded. Always emit **single-line** JSON; lead with `ok:true|false`. *(The 158
  `manage-group` outage: success mis-read as failure → the agent stopped mid-task and filed a false blocker.)*
- **Store and slot-composer are ONE version.** The frozen-template store (`services/data/frozen-templates`,
  ships the `.tpl` bricks incl. `group.ts.tpl`) and the slot's `compose-frozen-template.mjs` must be the **same
  step**. A half-update (new store + old composer) leaves **unsubstituted `{{TOKENS}}`**; the composer's
  hard-gate (any `{{TOKEN}}` → refuse, even in a comment) then aborts the write — correctly. A clean deploy
  from `main` keeps them in lockstep; never hand-patch only one side on the server.
- **Mandatory rebuild after every mutation.** Compose/CRUD/update write files; the running app serves the
  **old build** until `owner_deploy_rebuild_slot` (#18). `pm2 restart` alone does not help — it re-reads the
  stale `.next/`.
- **Language default = the slot's authority, not a hardcode.** The one language authority is
  `NEXT_PUBLIC_SUPPORTED_LANGUAGES` (read via `config/translations/translations.config.ts`). Compose/orchestrate
  must default to **that set**, never a baked `en,ru` — a mismatch ships orphaned files for an unsupported
  language. To add a language, use #19 (rebuild) **first**, then author.
- **Emitted artifacts stay lean.** Comments in generated files = ready-to-use logic + a one-line benefit, NOT
  design lore — the text is duplicated into hundreds of client files and burns tokens for zero executable value.
- **Engine `.tpl` carry no tokens even in comments**; tokens live only in the per-instance templates the
  composer substitutes.

**Why the first cycle failed (so it is never repeated).** The retired step-146 "frozen-archetypes" was a
**catalogue (N²)** that did not own the architecture; its MCP referenced a missing `.mjs` → `MODULE_NOT_FOUND`
that broke compose. Step-147 reframed it as a **constructor** (this doc). Step-151's parallel "different design
+ `_meta.ts`" was rolled back for build-design divergence. The lesson is §3 + this §11: own the architecture
with the Two-Slot Law and the bridge contract, or it breaks in production under a weak model.

---

## 12. Invariants (do not violate)

- Composition only — **never LLM code generation**; identical result from any model.
- **Two-Slot Law:** a property is a list-provider (data) or a uniform aspect (layout); **no cross-slot
  interaction**; reject features needing a special case by depth/source.
- **Envelope 100%-fit** or it is not that primitive; refusals name the failing axis.
- **Static-first / no-JS**; the only dynamic path is the dynamic-descriptor primitive, under the rules.
- **Versioning side-by-side, pinned; identity never versioned.**
- **Group manifest = registration metadata, never a slot:** menu placement (`_data/group.ts`) surfaces the
  group in the shell; do not fold it into composition or invent a "third slot".
- **Harvest discipline:** freeze a proven, repeating, cleanly-parameterisable shape — never a guess.
- **Bridge contract (§11):** single-line JSON · store↔composer one version · rebuild after every mutation ·
  language default = slot authority · lean emitted artifacts.
- **Confirm-first (mutating):** preview with `dry_run`, show the owner, get explicit confirmation, then the real
  call. The agent never self-creates a new primitive; it proposes.
- **Self-sufficient capability:** skill + MCP + composer `.mjs` shipped to **every** agent — works for a lone
  agent, no Hermes and no orchestrator required.

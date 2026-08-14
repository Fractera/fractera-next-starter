# Glossary

> Workspace term map — approved abbreviations and preferred phrasings so every
> agent in this project reads them the same way (e.g. aws -> ai-workspace).
> Edited via the Admin /service/glossary page (:3002); this file is the source of truth.

## Layers of the application — the terms every document reuses

These four definitions are the vocabulary of the architecture. When any document or page comment says
"public layer" or "protected layer", it means exactly what is written here — nothing is re-defined
locally.

**Public layer.** Pages that do not depend on authorization or on a role: the pages of the top menu when
a top menu exists, plus any page that simply sits in the file system. Everyone sees the same content, so
it is authored once, prerendered, indexed, and served with no query behind it. One item = one folder;
the rules are in `CONTENT-ENGINE.md`.

**Protected layer.** Pages whose access is limited by **two** conditions, both required:

1. the visitor is signed in;
2. the visitor holds the role the page names.

They live under `app/[lang]/(protectedLayer)/`, grouped by role into `(account)`, `(staff)`,
`(finance)`, `(admin)` — see each subgroup's `README.md`. Route groups do not appear in the URL: the
group is architecture, not navigation.

**Static shell.** The part of ANY page that is built ahead of time and needs no data: heading,
description, section titles, prose, empty states, the frame at every nesting depth. It is what makes a
page addressable instantly, and it is required on both layers — a protected page is a static page with
dynamic holes, never a dynamic page.

**Dynamic container.** The substance of a protected page — the rows that belong to somebody. It renders
a **skeleton** until its data arrives, and the data comes from an authenticated `/api/*` route. Because
the set of such pages is unbounded (a million accounts = a million dashboards), these routes address one
item with a dynamic segment `/[id]`, never with a folder per item.

## Three kinds of translation — and why they live in three different places

Saying "the translations" without saying WHICH is how two different mechanisms get mixed into one wrong
one. There are three, and the boundary between them is the same question that decides routing: **is this
known at build time?**

**1. Interface strings** — headings, buttons, column names, toasts, breadcrumb labels. They live in
**code**, in a co-located `<entity>.i18n.ts` next to what shows them (`_data/ui.i18n.ts`,
`components/auth/access-gate.i18n.ts`). They belong to the developer, are the same in every project, are
finite and known at build time, and ship with the build.

**How many languages they need is decided by ONE question: is the element reusable?**

- **Reusable — all 82 languages, written up front.** The language switcher, error toasts, the platform
  refusals in `lib/i18n/platform-errors.ts`, shared empty states, anything under `components/`. Nobody
  rewrites these when a language is enabled: the owner ticks it in the panel and they must speak it the
  same minute. Two languages here means the reusable half of the product breaks in every new language at
  once.
- **Belonging to one page or one feature — exactly the enabled set** (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`).
  A catalogue heading, its button label, its empty state. They are born with that page and die with it;
  translating them into 82 languages up front pays for words the site does not show.

Both are complete solutions, not stages of one. Calling the second kind "a debt because the rule says 82"
is a mistake this project has already made once.

**2. Content of a public page** — the title and body of an article. It lives in **files**, in the
per-language cell of that post (`_data/ru.ts`). It belongs to the author, is finite and written in
advance, and is prerendered. See `CONTENT-ENGINE.md`.

**3. Content of an object** — a product's name and description, a category, anything a person creates
while using the app. It lives in **the database, in that object's own row**, in an `i18n` JSON column
shaped `{ "name": { "ru": "…" } }` — the same shape `APP-CONFIG` uses. It belongs to whoever created the
object, appears at runtime, and is unbounded: a million products means a million translations, none of
which exists at build time.

**Why a JSON column and not a column per language** (case 3 only): a column per language does not scale —
every new language would need a schema migration, and a project may enable ten. Resolution rule, the same
as the content engine's: **no translation → the base value**. An empty string where a name should be looks
like a breakage; the English name looks like an honest edge of translation.

**Naming, so the two mechanisms never get confused again:** interface strings live in `_data/*.i18n.ts`;
object translations are resolved by `_lib/localize-<entity>.ts`. They were once called
`products.i18n.ts` and `product-i18n.ts` — one letter apart, doing different things.

| Term | Meaning |
|---|---|
| Interface strings | Translations of the UI itself — in code, `<entity>.i18n.ts`, finite and shipped with the build |
| Object translations | Translations of a row the user created — in the DB, `i18n` JSON column of that row |
| Public layer | Page independent of authorization and role — top-menu pages and plain file-system pages; prerendered and indexed (see above) |
| Protected layer | Page requiring BOTH a signed-in visitor AND a named role; lives in `app/[lang]/(protectedLayer)/` (see above) |
| Static shell | Prerendered part of a page: heading, description, prose, empty states, frame — no data behind it |
| Dynamic container | The data-bearing part of a protected page: skeleton until loaded, data from an authenticated `/api/*` |
| Access tier | The three roles the auth substrate itself enforces: `guest` → `user` → `architect` (`lib/roles.ts`) |
| Business role | The rest of the role vocabulary the app assigns and gates on: `buyer`, `subscriber_*`, `manager`, `finance`, `content_editor`, `admin`, … |
| AWS | ai-workspace |
| Automation (Rule) | The container "when X, under condition Y, do Z" — one Projects-layer project. Canon: CRUD-DOCS/workspace-standards/automation-ontology.md (READ IT before authoring/extending any automation) |
| Trigger | Event source starting a run (message / cron schedule / manual / webhook); node kind `trigger` |
| Hook | A user's spoken phrase bound to ONE Action (global `project_hooks`, normalized lowercase, app-wide unique) |
| Condition | A DECLARED guard "run only if …" on an Action/Step — shown on the diagram and in the records table; executed in step code (R6) |
| Action | First-class named outcome = a branch of steps (id/title/color/hooks/condition/channel). Configuring an automation = configuring Actions bound to Hooks |
| Router | The classifier step turning an event into an action id (e.g. detect-hook); node kind `router` |
| Step | Atomic operation node (kind `step`/`transform`), implemented under its `// node:<id>` marker in the durable workflow |
| Integration | External service + its env keys (Telegram, OpenAI, LightRAG) — declared, never hardcoded |
| Channel | Where an Action's output is delivered (e.g. telegram-bot-chat) — a field on the Action |
| State | Declared persistent data between runs (poll cursor, vector memory) — registry `state[]` in the automation graph |
| Run | One execution instance (runId/status/journal in `project_cron_runs`) |
| Record | A durable result row (+ memory document) shown in the universal records table: Action · Hook · Summary · Condition · Due · Created. Owner-deletable — the last column's Delete button (with confirm) removes the DB row AND its vector document (best-effort via the stored memory_doc_id) |

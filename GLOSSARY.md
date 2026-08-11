# Glossary

> Workspace term map — approved abbreviations and preferred phrasings so every
> agent in this project reads them the same way (e.g. aws -> ai-workspace).
> Edited via the Admin /service/glossary page (:3002); this file is the source of truth.

## Layers of the application — the terms every document reuses

These four definitions are the vocabulary of the architecture. When any document, page comment or
`_meta.ts` says "public layer" or "protected layer", it means exactly what is written here — nothing is
re-defined locally.

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

| Term | Meaning |
|---|---|
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

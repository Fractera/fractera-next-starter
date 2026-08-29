# Glossary

> The term map of this project: one place where a word means one thing, so two documents cannot define
> it differently. Edited as a file — **there is no glossary page in the panel**; the line that used to
> promise one (/service/glossary) described a page deleted together with the old admin.
>
> A term belongs here when more than one document or more than one part of the code uses it.
> Everything else is explained where it lives.

## Product — the unit of work inside one server

One server carries many products: a landing page today, a store tomorrow, a company brain next month.
Each one is a **dossier** — `PRODUCTS-CONFIG/<id>.json`, one file holding everything that product is.

| Term | What it means |
|---|---|
| **product** | one of the things this server carries. Has an `id` that never changes and means nothing (`p1`, `p2`), a title the owner may rename freely, a structure, a surface and an address |
| **dossier** (`PRODUCTS-CONFIG/<id>.json`) | one file holding EVERYTHING that product is: the record, the intake questions and answers, the use cases with their confirmations, the steps, the pages plan, the phase and the history. Beside it `registry.json` hands out permanent ids and nothing else, and `<id>.quiz.jsonl` is the Quiz transcript — raw material, not state |
| **structure** | one of the twelve directions the owner picks first (`store`, `landing`, `company-brain`, …). Decides the seven opening questions and the default surface. Not a file type, not an architecture |
| **surface** | where the product lives: `public` — its own address · `private` — a tab in the control panel · `headless` — channels and schedule only, no screen at all |
| **the four roots** | pages · logic · tables · use cases. Derived from the record, never invented — **and they are your boundary**: working on a use case of a product you write inside them and nowhere else |
| **pages plan** (`PAGES.md`) | what the product SHOULD have, proposed from its use cases. Not an inventory: what exists is counted from the folders and never stored |

**Layer terms below are about ONE product's inside; product terms above are about which product you are in.
Both questions have to be answered before code — the second one first.**

## Layers of the application — the terms every document reuses

These four definitions are the vocabulary of the architecture. When any document or page comment says
"public layer" or "protected layer", it means exactly what is written here — nothing is re-defined
locally.

**Public layer.** Pages that do not depend on authorization or on a role: the pages of the top menu when
a top menu exists, plus any page that simply sits in the file system. Everyone sees the same content, so
it is authored once, prerendered, indexed, and served with no query behind it. One item = one folder;
the rules are in the skill `use-static-pages`.

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
advance, and is prerendered. See the skill `use-static-pages`.

**3. Content of an object** — a product's name and description, a category, anything a person creates
while using the app. It lives in **the database, in that object's own row**, in an `i18n` JSON column
shaped `{ "name": { "ru": "…" } }` — the same shape `APP-CONFIG` uses. It belongs to whoever created the
object, appears at runtime, and is unbounded: a million products means a million translations, none of
which exists at build time.

**Why a JSON column and not a column per language** (case 3 only): a column per language does not scale —
every new language would need a schema migration, and a project may enable ten. Resolution rule, the same
as the content engine's: **no translation → the base value**. An empty string where a name should be looks
like a breakage; the English name looks like an honest edge of translation.

**Naming, so the two mechanisms never get confused again:** interface strings live in `_data/*.i18n.ts`
(page words) or `_widgets/<name>/ui.i18n.ts` (the widget's own words); object translations are
resolved by `lib/products/localize.ts`. They were once called `products.i18n.ts` and `product-i18n.ts` —
one letter apart, doing different things.

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

## Project memory — the words for how work is planned, carried and closed

Added 2026-08-22 (steps 533–536). These terms name the four addresses of memory and the three modes of
work. Nothing here is re-defined anywhere else.

| Term | What it means |
|---|---|
| **step** | one unit of planned work — a plan in `new-steps/<number>-<6-8-words>.md`, an outcome in `completed-steps/`. Planning ANY action means opening a step; a five-line edit is a step too, just a short one |
| **substep** | a step inside a step (`12-1` … `12-10`): its own plan, its own acceptance, its own outcome |
| **group of steps** | the real unit of work, because a feature rarely fits one step. Held by `current-steps.md`: which steps are active, when they started, **under what condition each closes** |
| **incidental step** | a step nobody planned but had to do — the proxy that needed changing, the library that had to be installed. Written down the moment it appears, with its reason: forgotten, it makes the feature look cheaper than it was, and the next estimate lies |
| **`current-steps.md`** | **state of the project between sessions** — not a list of steps. Read FIRST in every session, rewritten over itself, emptied when the group closes. Plural on purpose: it carries a group and the links between them |
| **handover** | what a session leaves behind so the next one starts working from one file: where work stopped, what is proven, the owner's decisions verbatim, the dead ends already paid for, the next action in one line |
| **feature report** (`reports/feature-…`) | written when the LAST step of a group closes: what the feature does today and how it is proven, which steps went into it including the incidental ones, what it cannot do, where it physically lives. Answers what twenty step outcomes cannot: **what do we have and in what state** |
| **incident report** (`reports/errors-…`) | the detailed account of ONE failure and its mechanism. Same flat folder, different category, different occasion — neither replaces the other |
| **anti-pattern** (`ANTI-PATTERNS.md`) | the short law that came out of an incident: one paragraph of mechanism, ~700 characters, loaded whole. Points at the report; never duplicates it |

🔒 **This project does not compact.** `/compact` squeezes context with the model: what was lost is
invisible to both agent and owner, and the loss surfaces an hour later as a forgotten decision. State is
written in words into `current-steps.md`, the session is restarted clean (`/clear`), and the new one
reads that file first. See `CLAUDE.md` → "Что строим", and the skill `use-development-steps`.

### Routing a task that arrived mid-step (added 2026-08-27)

| Term | What it means |
|---|---|
| **routing a task** | deciding WHERE a task that arrived in the middle of a step belongs: a substep of the current step · a substep of a step already closed · a new step. Not an estimate and not a priority — routing answers "whose step is this", not "when do we do it" |
| **routing gates** | the two questions at the entrance: does a file in the repository change because of it · does it serve the same capability the step was opened for. A shared file is not a gate: **a shared file is not kinship** |
| **outcome A / B / C** | **A** it belongs to the current step · **B** it does not, and a search needs the owner's permission · **C** the search found nothing, so a new step is opened. The letters are fixed: the skill and `CLAUDE.md` mean the same by them |
| **re-closing a step** | a closed step that received a new substep is closed **again, in full**: outcome, feature report and state are rewritten as if it had that many substeps from the start. Not "editing a closure" — the genre "amended step" **does not exist** |
| **queue of what is ahead** | what `new-steps/` is: only work not yet done lives there. The plan of a finished step sitting in it is a lie that work is still waiting |
| **fate of the plan** | the plan of a closed step is deleted **in the same commit** as the outcome and is recovered from git: `git log --diff-filter=D --format=%H -1 -- <path>` → `git show <hash>^:<path>` |

🔒 **The search sub-agent is a witness, not a helper.** It returns a **judgement** in a fixed form and
edits no accounting file; it is launched only on the owner's confirmation, **every time**; it looks at
at most **15 last STEPS** — not substep files — and **never enters `archive/`**.

## Development modes — how work is run in this project

The owner picks one in the panel ("Приложение" → "Режим разработки"); the value is `developmentMode` in
`PLATFORM-CONFIG`, read by the agent at the start of a session.

| Mode | Where the task comes from |
|---|---|
| `classic` | the owner's request. No case, no step, no queue |
| `steps` | a queue of numbered steps; what is planned is written down BEFORE it is executed |
| `cases` | confirmed use cases → products → a queue of steps; every step names the case it serves |
| `migration` | **an existing project of the owner's**: its code is read as a DESCRIPTION, and the queue of steps is born from that reading |

🔒 **The DEFAULT is `steps`** (owner, 2026-08-29). An empty `PLATFORM-CONFIG` — the state every
newly deployed server is born in — means `steps`, not `classic`. `classic` was the default from
2026-08-18 until that day.

Terms that belong to `migration` only:

| Term | What it means |
|---|---|
| **source** (`PLATFORM-CONFIG.migration`) | where the foreign project is read from: the address of a repository, or the folder on the owner's machine. No token is stored — the repository is kept open while the move lasts |
| **intent tree** | the FIRST artefact of a migration: the file tree the foreign project becomes on this architecture. Built before the capability table and before the first step |
| **capability table** | the list of capabilities drawn from the reading, each ticked off with a proof. It is the GROUND for acceptance; the owner's word is the acceptance |

🔒 **Foreign code is read, never run.** The move carries capabilities, not files: a broken or hostile
dependency has no way to ride across.


## 🪦 Removed 2026-08-16 — terms that described a subsystem that no longer exists

This file used to define `Automation (Rule)`, `Trigger`, `Hook`, `Condition`, `Action`, `Router`, `Step`,
`Integration`, `Channel`, `State`, `Run` and `Record` — the vocabulary of the Projects layer, which was
deleted together with the coding agents and Hermes. It also carried `AWS = ai-workspace`, an abbreviation
from the platform's own development repository that has no meaning inside your project.

A glossary describing a subsystem that does not exist is worse than an empty one: the next session builds
by it. If you meet those words in an old document or an old commit, they are history, not instructions.

# PRODUCTS-CONFIG — the products this server carries

🔒 **One product, one file.** `p1.json` holds everything that product IS: the record, the intake
questions and answers, the use cases with their confirmations, the development steps, the pages plan,
the phase and the history of transitions.

```
PRODUCTS-CONFIG/
  registry.json     an allocator of permanent ids, and nothing else
  p1.json           the whole product
  p1.quiz.jsonl     the Quiz transcript — raw material, not state
  schema.json       generated: the shape of a dossier
  defaults.json     generated: what a dossier holds before anything is described
```

Until 2026-08-18 this folder held a single `products-config.json`, and the rest of a product lived in
three other places: cases as markdown under `development-docs/USE-CASES/`, questions and answers in
`RAW/`, steps as rows in the `development_steps` table. Answering "where is this product" meant reading
four stores, and any two of them could drift apart in silence.

## How it works

**The control panel (`:3002`) writes it. This application (`:3000`) reads it** — the same contract as
`APP-CONFIG`, `DESIGN-CONFIG` and `PLATFORM-CONFIG`: one writer, one reader, read per request, applied
**without a rebuild**. Publishing a product is one field; nothing is rebuilt and nothing is deployed.

Reading is `config/products-config.ts` (`getProducts`, `getProduct`, `getPublicProducts`). The list of
products is the folder itself — a second file listing them would disagree with the folder inside a week.

## Phase, stage, publication

| Field | Answers | Who sets it |
|---|---|---|
| `phase` | where the product is in its life: `intake` → `decomposition` → `development` → `analysis` | the system proposes; `analysis` is the owner's decision |
| `stage` | how far inside that phase: `waiting`, `in-progress`, `review`, `testing`, `extra-cycle`, `done` | **computed** from the dossier's own arrays — questions, answers, confirmations, step statuses |
| `published` | is a visitor shown this product at all | the owner |

🔒 **`stage` is derived, never an opinion.** Two steps, one closed and one in progress, means
`in-progress` — and that answer lives in the steps themselves. Storing it as a separate decision would
create a second truth: close a step and the card would keep lying.

🔒 **`published` is not a phase.** A product can be finished and shown to nobody. Colour a card by its
phase; say publication in words beside it.

## Schema and defaults

Both are **generated** — `npm run build:config-schemas`, guarded by `npm run check:config-schemas` in
`prebuild`. Never write them by hand. The single definition lives in `config/products-config.defaults.ts`
and `config/products-config.schema.ts`; a data folder holds no file that needs a compiler.

`type` is checked against the catalogue of 22 project structures, because a value outside it means the
panel and the slot have drifted apart. `id`, `route` and case slugs are not validated beyond being
strings: the first is eternal and meaningless by design, the others are the owner's to change.

## Skill

**`use-products-config`** — how a record turns into the product's roots, and what changes when its
surface or address changes. The detail lives there, not here.

## The two rules that make a product a boundary

**1. The title is alive, the id is forever — and the id means nothing.** It is `p1`, not `store-1`.
A readable id was tried and failed the same day: the owner changes the structure, and a product that
became a company brain would have carried `store-1`, plus `lib/products/store-1/` and tables
`store_1_*`, forever. An identifier has to survive every other field changing, so it carries no meaning
at all. Readability comes from `title`, the address from `route`.

**2. Paths are derived, not configured.** For `p1` sitting on `/shop`:

| What | Where |
|---|---|
| pages | `app/[lang]/(publicLayer)/shop/` — or `app/[lang]/(publicLayer)/` for the product holding `/` |
| logic | `lib/products/p1/` |
| tables | `p1_*` |
| use cases | inside `PRODUCTS-CONFIG/p1.json` |

Pages are the one exception: in Next the folder name **is** the address segment, so moving a product to
another address renames its pages folder. Everything else hangs off the immortal `id` and never moves.

**This is the boundary for the coding agent:** working on a use case of a product it writes inside those
roots and into shared components — never inside another product's roots.

## 🔒 This file is English. All of it. Always — with one named exception

Every value here is written in **English**, whatever language the owner speaks: ids, slugs, routes,
types, step titles. The agent loads this layer at the start of every session, and a second language in
it is paid for in tokens forever while buying nothing — the owner reads the control panel, which speaks
all 82 languages on its own.

**The exception is what a human reads and confirms:** a product's `title` and `description`, and the
`title` and `summary` of a use case. They are written in the owner's language, because those are the
lines they read to recognise their own product. The `slug` of a case stays English kebab-case
(`01-buy-coffee-pack`).

**If translations are ever needed**, they go in a separate translation file — never as a second field
next to a machine value. A config that grows a `title_ru` beside `title` has stopped being a config.

## What is NOT here

The Quiz transcript — it lives beside the dossier in `<id>.quiz.jsonl`. It grows without limit (hundreds
of turns) and is raw material, not state: the state is the cases that came out of it. The dossier is read
on every render of the product list; a transcript inside it would make every render read a megabyte.

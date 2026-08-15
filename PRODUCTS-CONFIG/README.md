# PRODUCTS-CONFIG — which products live on this server

Holds `products-config.json`: the register of products built on this one server. A product is
a landing page, a store, a company brain, a Telegram agent — anything with its own purpose,
its own use cases and its own place to live.

## Why this file exists

One server carries many products. That is the whole point of the platform: today a landing
page, tomorrow a company brain automating internal work, next month a catalogue — all on the
same machine, the same auth, the same data layer.

Without a register there is no answer to the only question that matters once there are two:
**which product does this use case belong to?** A use case that belongs to "the project" is a
use case nobody can build from, because "the project" is not a place — it has no address, no
folder and no tables.

## How it works

**The control panel (`:3002`) writes it. This application (`:3000`) reads it** — the same
contract as the neighbouring `APP-CONFIG`, `DESIGN-CONFIG` and `PLATFORM-CONFIG`: one file,
one writer, one reader, read per request, applied **without a rebuild**. Flipping a product
from `draft` to `live` publishes it; nothing is rebuilt and nothing is deployed.

## One record

```json
{
  "id": "p1",
  "title": "Мой магазин",
  "type": "store",
  "surface": "public",
  "route": "/",
  "status": "draft",
  "createdAt": "2026-08-15T22:10:00.000Z"
}
```

| Field | Meaning |
|---|---|
| `id` | machine identifier `p1`, `p2`, … — **never changes**, and means nothing on purpose |
| `title` | human name, proposed by the model, freely renamed by the owner |
| `type` | one of the twelve project structures the panel offers |
| `surface` | `public` (own address) · `private` (a tab in the cabinet) · `headless` (channels and schedule only) |
| `route` | public address; exactly one product may hold `/` |
| `status` | `draft` (being described) · `building` · `live` (served to visitors) |

## The two rules that make a product a boundary

**1. The title is alive, the id is forever — and the id means nothing.** It is `p1`, not
`store-1`. A readable id was tried and failed the same day: the owner changes the structure
(that is what the second screen is for), and a product that became a company brain would have
carried the identifier `store-1`, plus `lib/products/store-1/` and tables `store_1_*`, forever.
An identifier has to survive every other field changing, so it carries no meaning at all.
Readability comes from `title`; the address comes from `route`.

**2. Paths are derived, not configured.** For a product with id `p1` sitting on `/shop`:

| What | Where |
|---|---|
| pages | `app/[lang]/shop/` — or `app/[lang]/(root)/` for the product holding `/` |
| logic | `lib/products/p1/` |
| tables | `p1_*` |
| use cases | `development-docs/USE-CASES/p1/{CASES,RAW}/` |

Pages are the one exception: in Next the folder name **is** the address segment, so a product on
`/shop` must live in `app/[lang]/shop/`. The price is stated plainly — moving a product to another
address renames its pages folder. Everything else hangs off the immortal `id` and never moves.

A configurable path is one more field that will one day disagree with reality, and the agent
would write code where nobody reads it. A derived path cannot disagree.

**This is the boundary for the coding agent:** working on a use case of a product, it writes
inside those four roots and into shared components — never inside another product's roots.
Two products sharing files is how two sets of use cases quietly overwrite each other.

## What is NOT here

Use cases themselves. They are files under `development-docs/USE-CASES/<id>/`, they travel with
the repository and the agent reads them every session. This file is the table of contents; the
folders are the content. Keeping the text of use cases here would turn a runtime config, read on
every request, into a document nobody can afford to parse that often.

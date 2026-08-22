---
name: use-database
description: >
  Tables, and the two doors that lead to them. Load it before adding a table, before writing a query
  anywhere, when rows exist on your laptop but not on the server (or the other way round), and before
  reaching for raw SQL. The two facts nobody guesses: a table is declared in ONE constant in this
  repository and appears on both machines by itself, and the same data has a second door that runs
  arbitrary SQL — which is deliberately harder to open than the first, because it bypasses the
  protection the first one gives you for free.
---

# use-database

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

The door itself, the credential and the permission classes are in `use-data`. This is about tables.

---

## 1. 🔒 A table is declared in `SCHEMA`, not created by a query

`lib/db/index.ts` holds one constant, `SCHEMA`. Both paths execute it — `makeLocalDb()` on a laptop
and `initRemoteSchema()` against the data service — so a table added there exists **on both machines**
after the next start. There are no migration files and no button.

**Add to `SCHEMA` → deploy → the table is there.** Creating it with a query instead gives you a table
that exists on the server and not in the repository: the next clone, the next developer and the next
deployment know nothing about it.

Write `CREATE TABLE IF NOT EXISTS`, and add columns in a way that an existing database survives.

## 2. 🔒 Which database you are actually talking to

```
REMOTE_DATA_URL set AND a key present → the data service (the real, shared data)
otherwise                             → a local SQLite file with sample rows
```

Both branches are healthy; only the destination differs — which is why the wrong one is quiet. A
missing key does not shout, it silently gives you your own empty copy. If rows appear on your machine
and never on the site, this is the first thing to check.

🔒 **With the key, a local `npm run dev` writes to the CUSTOMER's data.** Deleting rows in an
experiment deletes them for real. There is no staging copy in between.

## 3. Two doors to the same rows, and their asymmetry

| Door | For | What it does for you |
|---|---|---|
| `GET /db/tables`, `/db/tables/:table`, `/db/tables/:table/rows/:id` | everyday reads and edits | **cuts secret columns out** — `password`, `session_token`, `refresh_token`, `totp_secret`… — from the rows AND from the column list |
| `POST /db/migrate` — `{ sql, params }` | anything the first cannot express | runs arbitrary SQL: DDL, `SELECT` with parameters, writes |

🔒 **The second door bypasses the first one's protection**, and that is why it is behind the machine
secret only — a session cookie is refused there whatever the role (`use-data` §2). A hash that leaves
the database lives on in logs, in responses, in screenshots and in an agent's context, where nobody
can take it back. Use `/db/tables` unless you genuinely cannot.

**When `/db/migrate` is the right tool:** a join the row API cannot express, a bulk update, a one-off
data repair, reading `pragma_table_info` to see what a table really holds. Say in the step that you
used it — raw SQL against a customer's data is a decision, not a detail.

## 4. Reading rows in a page

A subject has ONE reader in `lib/<subject>/`, shared by the page, the sitemap and the machine twin —
`check:static` refuses a direct `@/lib/db` import from a public route folder. A query living in a page
entry is repeated by the next entry and reused by nothing.

Rows that a page shows must be fetched on the server. A public page stays static: the shell is
prerendered and the dynamic part wakes up inside it (`use-dynamic-pages`).

## 5. What belongs in a column, and what does not

- **Translations of a row** live in its `i18n` column as JSON, not in a column per language: a
  language per column means a schema migration for every new market.
- **Derived values that are expensive per row** (image dimensions, a blur placeholder) are stored at
  write time. Twenty products on a page means twenty extra round-trips otherwise — the catalogue was
  built that way for exactly this reason.
- **Nothing secret that you invented.** If a new secret column feels necessary, it belongs to the auth
  layer, not to the application's tables — and the secret-column filter only knows names it has been
  told about (`SECRET_COLUMNS` in the data service).

## 6. Before you call it done

1. The table is in `SCHEMA`, in this repository — not created by a query on the server.
2. `npm run check:types`, then the page that reads it, opened for real.
3. You know which database answered: with a key it is the customer's data; without one, your own file
   with samples. Say which one you tested against.
4. If you used `/db/migrate`, the step says so, and says why the row API could not do it.

---
name: use-data
description: >
  The ONE door out of your layer — the data service — and the three levels of generality behind it.
  Load it before saying "the app cannot reach that", before inventing storage of your own, and
  whenever you need the database, the media library, vectors, the knowledge base, maps or channels.
  What you cannot guess from inside the guest layer: the platform's code is not in your repository,
  so the surface is invisible — yet it is far wider than the helpers you can see. Arbitrary SQL and
  full pass-through to internal services already exist; the door describes itself; and a request that
  is refused tells you which of the two permission classes you fell outside of.
---

# use-data

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

**You are not sandboxed, you are unaware.** The platform lives outside your repository and you cannot
read it. This document exists so that "we have no access to that" is never said when access exists.

---

## 1. One door, one credential

Everything — database, media, vectors, knowledge base, maps, channels — is reached through the **data
service** at `REMOTE_DATA_URL` (`http://localhost:3300` on the server itself).

```ts
import { dataFetch } from "@/lib/fractera/data-service"   // lib/fractera/data-service.ts
const res = await dataFetch("/db/tables")                  // adds the address and the secret
```

🔒 **Server-side only.** `dataFetch` carries a secret; a client component that imports it ships the
key to the browser. Reach it from a route handler, a server component or a script — never from
`*.client.tsx`. No file in this project's client code knows the data address, and that is a property
worth keeping.

🔒 **The key is never a `NEXT_PUBLIC_*` variable.** Those are baked into the browser bundle at build
time. `DATA_SECRET` (server) / `DATA_API_KEY` (your machine) come from `.env.local`, which the panel
generates — Admin → Env Variables → download.

🔒 **Two layers already have a written helper — use them instead of raw calls:**
`lib/fractera/vectors.ts` (`remember`, `recall`, `forget`, `vectorStatus`) and
`lib/fractera/knowledge.ts` (`ask`, `learn`, `knowledgeDocuments`, `knowledgeReady`). Maps have no
helper yet: there you call the door directly, and writing the first helper is welcome.

## 2. 🔒 Two permission classes — and what a refusal means

| Class | What is in it | Who may |
|---|---|---|
| **schema** | `POST /db/migrate`, `DELETE /db/tables/:table` — arbitrary SQL, dropping a table | the machine secret ONLY |
| **data** | everything else: media, panel settings, rows, vectors, the proxies | the secret, or a person with role `architect` / `admin` |

- **401** — you presented nothing the door recognises: no secret, no session.
- **403** — you were recognised and refused. Either you tried a schema route with a session cookie
  (never allowed, whatever the role), or you are a customer, and the data layer is not a customer
  surface.

This was closed in 2026-08-22 after a real hole: a logged-in ordinary visitor could run arbitrary SQL.
If a request of yours is refused, do not look for a way around — you are on the wrong side of a line
somebody drew on purpose.

## 3. 🔒 Three levels of generality — the answer to "but our case is unusual"

**Level 1 — named routes.** `/db/tables`, `/media/upload`, `/vectors/search`… The everyday surface,
described by the door itself (§4).

**Level 2 — the general way through, per layer.** This is the level nobody expects to exist:

| Need | The way |
|---|---|
| any query, any DDL, a table nobody planned | `POST /db/migrate` — `{ sql, params }`, arbitrary SQL |
| any route of an internal service | `/service/<name>/*` — **any method, any subpath**, passed through |

Internal services wired today: **`rag`** (knowledge base — `use-agentic-rag`), **`geo`** (maps —
`use-map`), **`channels`** (Telegram: `/status`, `/telegram/config`, `/telegram/link/{start,poll}`).
The proxy injects the service's own key where one is needed — you never hold it.

**Level 3 — outward.** Your Next server can call any external API directly. Secrets for it are added
by the owner in the panel (Env Variables) and reach you through `.env.local`, which means **a rebuild**
— that is the whole cost, and it is worth saying out loud before you promise a same-minute result.

## 4. Ask the door what it can do — do not trust a list in a document

```
GET /capabilities        (needs the secret)
```

Returns the routes **enumerated from the running service**, the two classes, the wired proxies, the
embedding model and its dimensions. Generated, never hand-written — which is exactly why you should
read it instead of believing any list, including this one, when the two disagree.

🔒 **This is the only discovery method that survives.** The platform's source is not in your
repository and will be closed in production. A skill that copied the route list would go stale and
lie; the door describing itself cannot.

## 5. Where the boundary really is

- **The platform is not yours to change.** Deployment does `rm -rf /opt/fractera` and installs it
  again — an edit there does not survive and is not stored anywhere. Need a platform change? Name the
  service, the file and the reason, hand it to the owner (panel → "How to build this project" →
  "Changes to the platform itself", or `admin@fractera.ai` with the site address).
- **The data is shared with the live server, even from your laptop.** With `REMOTE_DATA_URL` from the
  downloaded `.env.local`, a local `npm run dev` reads and writes the REAL data. Deleting rows during
  an experiment deletes them for the customer too.
- **No key at all** — `dataFetch` throws with instructions rather than pretending. On a bare IP the
  platform runs in bypass mode and authorisation is not enforced; do not mistake that for "the door is
  open" — on a domain it is not.

## 6. Before you call it done

1. The call is made server-side, and no client bundle mentions the data address or the key.
2. You asked `/capabilities` rather than guessing a route — and if it disagrees with this document,
   the door is right.
3. A refusal was read, not worked around: 401 is "you are nobody here", 403 is "you are somebody, and
   this is not yours".
4. If the need did not fit any named route, you used level 2 — and said so in the step, because a raw
   SQL migration is a decision, not a detail.

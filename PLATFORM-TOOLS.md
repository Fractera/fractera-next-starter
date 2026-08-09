# PLATFORM-TOOLS.md — what you already have

You have no access to external tools. This file is the only way you learn what the platform under this app
already provides. **Read it before designing anything that stores, searches, sends or locates.** Almost
every wrong answer here is a second copy of something listed below.

The rule for all of them: **you call these, you do not rebuild them.** They are shared with the deployed
app, they are backed up as one, and a second copy splits the data so that neither half is complete.

---

## One door

Everything below is reached through the **data service** on `:3300`, behind a single secret. Not a port
per service — one address, one key, and a route per capability. Ready clients sit next to you in
`lib/fractera/`.

| What | How you reach it | Use it for |
|---|---|---|
| **Rows / tables** | `lib/fractera/data-service.ts` | Any structured data your app owns. There is already a database — do not add Postgres, Neon or Supabase. |
| **Uploaded files** | media routes of the same service | Images, documents, video. Stored once, referenced by URL. |
| **Vector store** | `lib/fractera/vectors.ts` | Meaning-based search: "find things similar to this". Lives beside the rows it describes. |
| **Knowledge graph** | `/service/rag` via `lib/fractera/knowledge.ts` | Questions over a body of documents where the answer is spread across several of them. |
| **Map and routing** | `/service/geo` | Address ↔ coordinates, driving routes, distance matrices, visiting order. Own engines, no third-party keys. |
| **Channels** | `/service/channels` | Messaging out and in — Telegram first. |

## Not through that door

| What | Where | Note |
|---|---|---|
| **Accounts, sessions, roles** | auth service on `:3001` | Never write a second login. Adding a sign-in provider is a platform setting, not app code. |
| **Settings of this app** | control panel on `:3002` | Name, description, branding, SEO, analytics. Read them with `npm run read:app-config`; change them in the panel. |

---

## Choosing between the vector store and the knowledge graph

They look similar and are not. **Vector store** answers "what resembles this?" — one item at a time,
cheap, exact about similarity. **Knowledge graph** answers "what does this body of text say about X?" —
it connects facts across documents, costs more per question and needs an OpenAI key to be useful.

Reach for the vector store first. Move to the graph when the answer genuinely lives in the links between
documents rather than in any single one.

---

## When something is missing

Say so plainly and name the layer it belongs to. Do not improvise a local imitation: a hand-rolled store,
a second login, or your own geocoder will work in your session and break the moment the platform's own
version is used somewhere else in the project.

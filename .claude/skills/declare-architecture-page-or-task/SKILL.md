---
name: declare-architecture-page-or-task
description: >
  Record a code-development item on /architecture: declare a page or endpoint
  (a README.md node, not yet built), add a to-do to a live route, or file a
  danger/deletion request. Use when decomposing a task into the pieces a later
  step will build — you write the record, you do NOT build the code here.
  Works standalone via the local HTTP API — no Hermes and no MCP bridge required.
---

# declare-architecture-page-or-task

Put a code item on `/architecture` so a later step can pick it up and build it.
This is the entry of the **code development cycle** (`/architecture → development-steps`,
see `CRUD-DOCS/workspace-standards/architecture-dev-pipeline.md`). You declare the
work; you do not write the page/endpoint code in this skill.

This skill is **self-sufficient**: it works with nothing but the local HTTP API.
It does NOT depend on Hermes, on memory, or on any other agent existing. If you are
the only agent in this project, you can still declare a record.

## When to use

- You decomposed a task ("build a Facebook clone") and decided it needs N pages —
  declare one record per page instead of building them all at once (methodology §5).
- A live route needs a follow-up — file a to-do on it.
- A route must be deleted or refactored away — file a danger/deletion request.

## The three record types

| Record | What it is | Endpoint |
|---|---|---|
| **declared page/endpoint** | a `README.md` node, no built file yet | `POST …/architecture/requested` |
| **to-do** on a live route | a follow-up task inside the route's README | `POST …/architecture/tasks` `{kind:"todo"}` |
| **danger / deletion** | a delete-and-refactor request | `POST …/architecture/tasks` `{kind:"delete"}` |

## Before declaring a PAGE — decide the access shape (required)

A page is **not** declared by guessing access. First read `HOW-USE-AUTH.md` and decide:
`public` (anyone) · `private` (which roles) · `public+guest` (anonymous visitor becomes
a real guest, `requiresGuestRegistration`). Put that decision in the record's to-do so the
later build step feeds it to `scaffold-declared-route-into-component-skeleton --access`.
Rule: `CLAUDE.md §6.3`; access shapes — `HOW-USE-AUTH.md`.

## §8.2 confirm before creating (mandatory)

Before any POST, restate the intent to the architect and show exactly what will be
declared (path, kind, access shape, to-dos). Create only after explicit confirmation.
Never silently create.

## Primary path — local HTTP API (works for ANY agent, no Hermes, no MCP)

The page `/architecture` is backed by a plain HTTP API on the local app (`:3000`).
Always send the `X-Agent-Identity` header so the action is attributed to you.

**Declare a page or endpoint:**
```bash
curl -s -X POST http://127.0.0.1:3000/api/project/default/architecture/requested \
  -H "Content-Type: application/json" \
  -H "X-Agent-Identity: <your-agent-id>" \
  -d '{"title":"Feed","kind":"page","base":"/","dynamic":false,
       "todo":["access: private (user)","render the post list"],
       "queryParams":[]}'
# → 201 { "requested": { "id": "...", "slug": "feed", "status": "requested", ... } }
```
- `kind`: `"page"` (default) or `"api"`.
- `base`: parent path (`"/"` for root); `dynamic:true` makes a `[slug]` segment.
- `queryParams`: `[{"key":"id","value":"string"}]` (optional).
- `example`: optional pasted code, stored as a "Code update" diff task.

**Add a to-do to a live route:**
```bash
curl -s -X POST http://127.0.0.1:3000/api/project/default/architecture/tasks \
  -H "Content-Type: application/json" \
  -H "X-Agent-Identity: <your-agent-id>" \
  -d '{"path":"/feed","kind":"todo","body":"add pagination"}'
```

**File a danger / deletion request:**
```bash
curl -s -X POST http://127.0.0.1:3000/api/project/default/architecture/tasks \
  -H "Content-Type: application/json" \
  -H "X-Agent-Identity: <your-agent-id>" \
  -d '{"path":"/legacy","kind":"delete","body":"remove route, fold content into /feed"}'
```

## Convenience path — MCP tool (ONLY if Hermes / MCP bridge is present)

If this project runs the `arch-bridge` MCP (:3222, owner tier) — e.g. through Hermes —
you may instead call `owner_arch_create_record`, which builds the record for you. Same
confirm-first rule (call with `dry_run:true`, show the preview, then call without
`dry_run`). This path is optional; the HTTP path above is the self-sufficient default
and must always work.

## After declaring

Report to the architect:
> Declared «<title>» on /architecture (<kind> at <path>). Open the page when ready;
> a later step (🚀 Launch / `owner_arch_send_to_steps`) collects pending records into
> one development step that builds them.

The record is a declaration, not the code. Turning it into a live page/endpoint is a
separate build step (`scaffold-declared-route-into-component-skeleton` → domain code).

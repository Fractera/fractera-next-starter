---
name: propose-new-agent-skill-or-mcp
description: >
  Propose a new agent skill or MCP connector by creating a structured draft record
  on /ai-draft-settings. Use when you notice an automation opportunity, a repeating
  pattern worth capturing, or when the architect asks to "document this as a skill".
  Do NOT build the real file — the draft is the proposal; the architect approves it.
  Works standalone via the local HTTP API — no Hermes and no MCP bridge required.
---

# propose-new-agent-skill-or-mcp

Propose a new agent skill or MCP connector for any of the agents in this project.
The draft lands on `/ai-draft-settings` for the architect to review. You do not
build the real file — you propose it.

This skill is **self-sufficient**: it works with nothing but the local HTTP API.
It does NOT depend on Hermes, on memory, or on any other agent existing. If you are
the only agent in this project, you can still create a draft.

## When to use

- You spot a repeating manual pattern an agent skill could automate.
- The architect says "document this as a skill" or "add this MCP connector".
- You finish a task and notice a reusable pattern worth capturing.

## Primary path — local HTTP API (works for ANY agent, no Hermes, no MCP)

The page `/ai-draft-settings` is backed by a plain HTTP API on the local app
(`:3000`). Create the draft, then fill its source + tasks. Always send the
`X-Agent-Identity` header so the action is attributed to you.

**Step 1 — create the draft record:**
```bash
curl -s -X POST http://127.0.0.1:3000/api/ai-draft-settings \
  -H "Content-Type: application/json" \
  -H "X-Agent-Identity: <your-agent-id>" \
  -d '{"agent":"<target-agent>","kind":"skill","name":"<title>","mode":"supplement"}'
# → returns { "draft": { "id": "<id>", "rel": "...", ... } }
```

**Step 2 — fill the proposed source + tasks (PATCH with the returned id):**
```bash
curl -s -X PATCH http://127.0.0.1:3000/api/ai-draft-settings/<id> \
  -H "Content-Type: application/json" \
  -H "X-Agent-Identity: <your-agent-id>" \
  -d '{"source":"# <title>\n\n<full proposed file content>","tasks":[{"id":"1","body":"<todo>","kind":"todo"}]}'
```

- `kind`: `"skill"` (a markdown instruction file) or `"mcp"` (a connector).
- For `kind:"mcp"` add `"tier":"public|user|owner"` (default `owner`) and `"mutating":true|false`.
- `mode`: `"supplement"` (default) or `"replace"`.

## §8.2 confirm before creating (mandatory)

Before the POST, restate the intent to the architect and show the proposed source +
tasks. Create only after explicit confirmation. Never silently create.

## Convenience path — MCP tool (ONLY if Hermes/MCP bridge is present)

If this project runs the `ai-draft-bridge` MCP (:3221, owner tier) — e.g. through
Hermes — you may instead call `owner_draft_create_record`, which generates the
source skeleton + tasks for you. Same confirm-first rule (call with `dry_run:true`,
show the preview, then call without `dry_run`). This path is optional; the HTTP path
above is the self-sufficient default and must always work.

## After creating

Report to the architect:
> Draft «<name>» published to /ai-draft-settings → <agent> → Skills (or MCP).
> Open the page when ready, review source and tasks, and materialise the record.

The originals are never edited here — the draft is a mirror; the architect approves
and an agent later applies it to the real file.

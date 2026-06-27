---
name: perceive-workspace
description: >
  SEE what actually exists in the workspace before acting on it. Use whenever the request is
  about EXISTING content or structure — "what do I have", "list my pages", "what news/blog
  posts exist", "is there already a section for X", "change this existing page", "delete X".
  It returns the LIVE filesystem tree of the running site (every section and the real pages
  inside it, plus declared nodes and open tasks) — the same scan that powers the /architecture
  page, NOT the deployment journal. Read-only. Perceive FIRST, then act — never manage, edit or
  delete content you have not first seen in the live scan. Self-sufficient: one read tool, no
  Hermes and no other agent required.
version: 1.0.0
metadata:
  hermes:
    tags: [perceive, see, list, what, exists, state, content, news, blog, pages, sections, inventory, architecture, awareness, before, read]
    related_skills: [orchestrate-content-by-steps, manage-content-collections, declare-architecture-page-or-task]
---

# perceive-workspace

Your **eyes** on the running site. Before you answer or act on anything about **existing**
content or structure, you call **`owner_perceive_workspace`** and work from what it returns —
never from a guess, the deployment log, or stale memory.

This skill is **self-sufficient**: one read-only tool, no Hermes required.

## Why this exists (read once)

It is impossible to manage what you cannot see. An orchestrator that cannot list the real pages
will hallucinate, recreate what already exists, or "fix" the wrong thing. The eyes already exist:
the `/architecture` page reads the live filesystem (`scanTree()`), and because the content engine
is static-first — **every post is its own route folder with a `page.tsx`, no dynamic `[slug]`** —
that scan already enumerates every content page. This skill exposes that same scan as one tool, so
any agent (and Hermes) perceives the real state before acting.

The concrete trap it prevents: answering "what news do I have" from `deployment_records` returned
**3** posts when the site actually had **5** — because a section created in one deploy logs ONE
record, not one per page. The live scan shows all 5. Always perceive from the scan.

## The mental model — perceive, then act

- **Perceive FIRST.** Any request about existing content ("what / list / change / delete") starts
  with `owner_perceive_workspace`.
- **Know your sources of truth, never confuse them:**
  - **`owner_perceive_workspace` (the live filesystem scan) = what REALLY exists now.** Your eyes.
  - **`deployment_records` = what HAPPENED** — a deploy history log, NOT a content catalog. Never
    list content from it.
  - **Memory (LightRAG) = may be stale** — verify against the live scan before acting.
- **Act from the list.** Do not edit or delete content you have not first SEEN in the scan.

## How to call

- **MCP (every agent):** `owner_perceive_workspace({ scope? })` — omit `scope` for the whole map
  (`{ collections: { news: [{slug,href,title}], … }, pages, declared, tasks }`); pass
  `scope: 'news'` to narrow to one section.
- **Standalone (lone agent, no MCP / no Hermes):** read the same scan directly —
  ```bash
  curl -s -H "X-Agent-Identity: <you>" \
    http://localhost:3000/api/project/default/architecture/signature
  ```
  or open the `/architecture` page (it renders the identical tree).

## What it reuses (does not reinvent)

The slot's existing `GET /api/project/default/architecture/signature` route →
`lib/architecture/fs-scan.ts` (`scanTree()`). No new scanner is built; this is a thin read over
the eyes the workspace already has.

## When to use

- Before any **`manage-content-collections`** edit/delete (you must see the page first).
- Before **`orchestrate-content-by-steps`** when you need to know if a section already exists.
- Whenever the owner asks "what do I have / what's on the site / list my …".

Self-sufficient project skill: shipped to every agent (`.agents` + `.claude/.gemini/.qwen` +
Hermes). It does not depend on Hermes — any single agent can perceive the workspace on its own.

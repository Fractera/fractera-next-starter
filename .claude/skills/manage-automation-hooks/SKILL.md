---
name: manage-automation-hooks
description: >
  Give a personal automation SPOKEN triggers — hooks. Use whenever an automation should run
  because the user SAYS a phrase in Telegram or the Hermes chat (not by clicking): "save this",
  "remind me", "what did I save about…". Declare that the project needs hooks, seed its default
  phrases, and register each phrase → action binding through the global hooks API
  (/api/project-hooks). Phrases are GLOBALLY unique so the router maps one phrase to exactly one
  action; a duplicate or near-duplicate is refused. Self-sufficient: works for a lone agent, no
  Hermes required.
---

# manage-automation-hooks

The culture: **a personal automation is run by SAYING a phrase, not by clicking.** A **hook** binds
a spoken phrase to a project action. Hooks are a first-class layer of the project (next to the
description, diagram, run panel and dashboard).

Full reference: `CRUD-DOCS/workspace-standards/hooks.md`.

## The one rule

**Every spoken trigger is a hook: a phrase bound to an action, registered in the GLOBAL hooks
table. Phrases are unique across the WHOLE app — the router maps one phrase to exactly one action —
so a duplicate or near-duplicate (reordered words, typos) is refused. Never hard-code phrase
parsing; declare the hook and let the registry own uniqueness.**

## The four actions

- **save** — ingest the following text into memory (LightRAG). No confirmation.
- **remind** — create a scheduled/calendar event; if no date/time was given, ASK "when?" first.
- **recall** — semantic search over memory, answer in chat.
- **custom** — any project-specific action a coding agent implements.

## How to do it

1. **Declare that the project needs hooks.** In the `/service/architecture` declare panel toggle
   Hooks on (project declarations only), or set `hooks: true` in the README `fractera:meta` block.
   A composed project then carries the Hooks layer in its page.
2. **Seed default phrases (personal automation).** The starter ships three idiomatic phrases per
   language (`hook-phrases.i18n.ts`, 82 languages) — save / remind / recall — each carrying
   "Fractera". Use the slot's `DEFAULT_LANGUAGE` variant.
3. **Register each hook** through `POST /api/project-hooks` `{ category, project, phrase, action,
   lang, description }`. A conflicting phrase returns **409** with the colliding hook — surface it
   to the user and pick different wording; never force it. `GET /api/project-hooks?category&project`
   lists a project's hooks; `DELETE ?id=` removes one.
4. **Keep remind and recall worded distinctly** — "remind me" vs "what did I save about…" — so the
   global-uniqueness guard does not treat them as one phrase.

## Do NOT

- Hard-code phrase matching in the automation — bind a hook and let the router match.
- Invent a per-project uniqueness scheme or a second table — uniqueness is GLOBAL, one table.
- Register two phrases that normalize to the same thing — the API will (correctly) refuse the 2nd.

## After

State what triggers the automation, e.g.:
> The Telegram notes automation registers three hooks: "…запомни это" saves to memory, "…напомни
> мне" schedules a reminder (asks when if no date), "…что я сохранял про" searches memory.

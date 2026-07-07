# Automation hooks — the spoken-trigger standard for projects

**Standard (step 187).** A personal automation is not run by clicking a button — it is run by
**saying a phrase**. A **Hook** is that spoken trigger: a phrase bound to an action of a project.
Hooks are a first-class **layer of a project**, alongside the description, the process diagram, the
admin run panel and the runs dashboard.

> **Where a hook is heard (step 200).** A hook is received on the **automations channel**
> (`@fractera_auto`), NOT on the Hermes chat bot. The `project_hooks` registry below is precisely
> the **deterministic dispatch key** the automations listener uses: a normalized phrase → exactly
> one `{ project, action }`, a table lookup, not an LLM guess. See `agent-channel-routing.md`.

Agent-facing skill: `manage-automation-hooks`.

## What a hook is

```ts
type HookAction = "save" | "remind" | "recall" | "custom";
type Hook = {
  id: string;
  category: string;         // owning project category
  project: string;          // owning project slug
  phrase: string;           // what the user says, in the slot's language
  normalizedPhrase: string; // dedup key: lowercased, punctuation stripped, spaces collapsed
  action: HookAction;       // what running the hook does
  lang: string;             // language of the phrase (= the slot's DEFAULT_LANGUAGE)
  description: string;      // human + agent explanation of what it does
};
```

The four default actions:
- **save** — store the following text into memory (LightRAG ingest). No confirmation needed.
- **remind** — create a scheduled/calendar event; if the user gave no date/time, the agent asks
  "when?" before creating it.
- **recall** — semantic search over memory and answer in the chat.
- **custom** — any project-specific action a coding agent wires up.

## GLOBAL uniqueness (the core rule)

The router hears ONE phrase and must map it to EXACTLY ONE project action. Therefore a hook's
`normalizedPhrase` is **unique across the entire app** — not per project. Registering a phrase
that duplicates OR near-duplicates an existing hook (in any project) is refused. Near-duplicate =
same normalized string, high token-set overlap (reordered words), or small edit distance (typos,
scripts without spaces). This prevents two automations from fighting over the same spoken phrase.

- Storage: the `project_hooks` table (`lib/db/index.ts` SCHEMA, `UNIQUE(normalized_phrase)`).
- Normalization + similarity: `lib/hooks/normalize.ts` (`normalizePhrase`, `isNearDuplicate`).
- API: `app/api/project-hooks` (GET / POST → 409 on conflict / DELETE), role-gated
  (architect/manager/agent).

## Declaring hooks

A project declares whether it needs hooks the same way it declares admin/dashboard/cron/
integrations — in the `/service/architecture` declare panel and the README `fractera:meta` block
(`hooks: true`). A composed project carries a **Hooks layer** in its page: the declared default
phrases plus an add/remove panel that talks to the API and surfaces a global conflict as a toast.

## Default phrases (personal automation)

The personal-automation starter (telegram-notes) ships three ready phrases per language (82
languages, `hook-phrases.i18n.ts`), idiomatic and memorable, each carrying "Fractera". The Russian
seed: save = «кстати говоря, Фрактера, запомни это: …»; remind = «кстати говоря, Фрактера, напомни
мне …»; recall = «кстати, Фрактера, что я сохранял про …». remind and recall are worded
distinctly so the global-uniqueness guard does not treat them as one.

## Do / Do not

- **Do** bind each spoken trigger to a project action via a hook — do not hard-code phrase parsing.
- **Do** let the API refuse conflicts; surface the returned conflict to the user, don't force it.
- **Do not** register per-project phrases that could collide globally — pick distinct wording.
- **Do not** invent a second table or a per-project uniqueness scheme — uniqueness is global.

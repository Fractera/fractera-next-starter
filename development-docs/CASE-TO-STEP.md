# From use cases to development steps

> **This document is a duplicate, and saying so is the point.** The procedure lives in the skill
> `.claude/skills/manage-cases-and-steps/SKILL.md`, which the agent loads when a request calls for it.
> This file exists so a **person** can read the same thing without running an agent, and so the owner
> can switch the capability on or off from the control panel. When the two disagree, the skill is what
> actually runs.

---

## Why a skill and not an instruction

The main instruction is loaded at the start of **every** session, in full, before a single line of the
task. At 71 KB that is ~18–20 thousand tokens paid every time, whether or not one line of it is
relevant. A skill costs its name and one-line description until a request matches it.

Cost is the smallest of four reasons, and the other three are worse:

1. **Rules compete for attention.** The more of them present at once, the lower the chance any given
   one is applied. This project has the receipt: a law sat in the instruction read that same session
   and was still missed (`green-gate-taken-for-standard-compliance`).
2. **Prose cannot refuse.** A document asks; a tool schema constrains. "Statuses are these five" in
   text is broken silently. In the MCP it comes back as `unknown_status` with the list of accepted
   values.
3. **Copies drift.** One law written in two documents diverges — always in the rare place nobody
   checks.
4. **A rule is not recalled at the moment it applies.** Read at minute zero, needed at minute forty.
   A skill is delivered by trigger, which is the same thing as "at the moment it applies".

**The dividing line:** a law that must hold always and has no trigger (one agent at a time; no dynamic
pages) stays in the instruction — there is no moment at which to deliver it. A procedure with an
occasion becomes a skill. A set of permitted values becomes a tool contract.

---

## The three surfaces of one law

| Surface | Carries | Loaded | Can refuse |
|---|---|---|---|
| **MCP `fractera-project`** | names, permitted values, required fields | on call | **yes** |
| **Skill `manage-cases-and-steps`** | the procedure and its forks | on trigger | no |
| **This document** | why it is built this way | when a human opens it | no |

---

## The flow

```
cases written by the panel's Quiz            stage: not-started
        │
        │  the owner confirms a case
        ▼
the decomposition step is created            stage: decomposition
  "decompose confirmed use cases into an ordered development step queue"
        │  created by the panel at confirmation time;
        │  the agent creates the same one at session start if it is missing
        ▼
the agent executes it: reads the cases, writes the queue
  the FIRST step is always the minimal working skeleton —
  architecture on disk, API routes present, navigation walking on stubs
        ▼
skeleton → revision → building → acceptance → extra-tasks → done
```

**Two independent paths to one state, both idempotent.** The panel creates the step because that is
where the owner acts and the queue must exist even if no agent is ever opened. The agent creates it
because a mechanism that depends on one path having run is a mechanism that silently does nothing.

---

## Two entities, two homes — deliberately

|  | Use cases | Development steps |
|---|---|---|
| What they are | content a person confirms | the state of a queue |
| The question asked of them | "what are we building" | "what is open for this product" |
| Home | files in `development-docs/USE-CASES/<product>/CASES/` | rows in the table `development_steps` |
| Why there | they travel with git and the owner sees them in the editor | one question, one query, instead of reading every file |

A case hidden in a database disappears from the owner's sight. A step scattered across files makes
"show me the open ones" cost a full directory read. The MCP unifies **access**, not storage.

---

## The rules worth knowing without opening the skill

- **Only the owner confirms a case.** There is no tool to confirm — by construction, not by omission.
- **Any edit to a case returns it to draft.** Green must mean "approved this text".
- **A step's title is 6–12 words** and the server refuses anything else.
- **A step's number is permanent**; closing it never renames it. Completion is a column.
- **A step for a product names the cases it serves.** `platform` is the one exception.
- **The stage only moves forward.** Backwards is the owner's decision, in the panel.

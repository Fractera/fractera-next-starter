---
name: manage-cases-and-steps
description: >
  Turn the owner's USE CASES into DEVELOPMENT STEPS, and work the queue afterwards. Use whenever the
  request is "start building", "begin development", "what do we do next", "decompose the cases",
  "add a step", "close this step", "where are we", "add a use case", "that case is wrong" — and
  ALWAYS at session start before writing any code, to learn which case the work serves. Cases are
  files the owner confirms; steps are rows in a database; both are reached through the
  fractera-project MCP. Read this before you plan anything, because the two mistakes this area
  produces are invisible until late: building on a case nobody confirmed, and a step nobody can
  read back a month later.
---

# manage-cases-and-steps

**Two entities, one passage.** A use case says what the product must do. A development step says what
you will do next. Between them there is exactly one transition, and this skill owns it.

Everything below happens through the **`fractera-project` MCP** — no folder of step files exists any
more, and you never create one.

---

## 1. Where you are — always ask this first

```
cases_gate            → may development start at all?
steps_next            → what is the next open step?
```

`cases_gate` answers with a verdict, not two numbers:

| verdict | what it means | what you do |
|---|---|---|
| `no-cases` | nothing described yet | **STOP.** Point at the panel's Use cases section: its Quiz creates them. That conversation IS the first task. |
| `nothing-confirmed` | the model wrote them, the owner has not agreed | **STOP.** Name the cases waiting and ask the owner to confirm them in the panel. |
| `partially-confirmed` | some agreed, some not | You may work on the confirmed ones. Say out loud which are still open. |
| `ready` | all confirmed | Build. |

**A case the owner has not confirmed is a guess the model wrote.** Building on it is building on a
guess, and the cost lands weeks later when the product does the wrong thing correctly.

---

## 2. Putting cases into development — the decomposition step

When cases are confirmed and no queue exists yet:

```
steps_decompose_start        → creates ONE step: "decompose confirmed use cases into an ordered
                               development step queue", and moves the product to stage 'decomposition'
```

It is **idempotent**: called twice it returns the same step, it never makes a second one. The panel
creates the same step the moment the owner confirms a case, so usually it already exists — that is
deliberate, two independent paths to one state.

**Executing that step is your job, and its output is other steps.** Read every confirmed case, then:

```
steps_create × K
```

**The first step of the queue is always the same and is not negotiable:**

> the minimal working skeleton — the whole architecture present in the filesystem, the API routes in
> place, and navigation walking end to end on stubs. Nothing real behind it yet.

Everything after it fills the stubs in, one case at a time. This order exists because a skeleton
built last is a rewrite; built first, it is the thing every later step attaches to.

When the queue is written, close the decomposition step with `steps_close`.

---

## 3. Naming a step — the rule is enforced, not suggested

**`number` + a title of 6 to 12 words describing the step in detail.** `steps_create` refuses
anything shorter or longer and tells you so.

```
✅  build minimal working skeleton with routes api and stubbed navigation
✅  add checkout page with card payment and order confirmation email
❌  fix bug                      (2 words — refused)
❌  catalogue                    (1 word — refused)
```

**The number is permanent and closing a step never renames it.** "Completed steps become just a
number" is exactly the defect this design removed: one fact must not live in two places. Completion
is the `status` column and nothing else.

**A step for a product must name the cases it serves** (`cases: ["01-buy-coffee-pack"]`). Work that
serves no case is work nobody ordered. The one exception is `product_id: "platform"` — the theme, the
languages, the offline cache belong to the whole server and have no case.

---

## 4. Working the queue

```
steps_next          → the lowest-numbered open step, optionally for one product
steps_get           → its brief, its cases, its result
steps_update        → change the brief (revision), move the status
steps_close         → status done + the report, in one call
```

Statuses: `new` · `in-progress` · `blocked` · `done` · `cancelled`. Importance: `optional` ·
`mandatory` · `critical`. Both lists are closed — pass anything else and the server tells you what it
accepts.

**Closing without a report is refused.** A closed step with no result cannot be read back a month
later, and by then there is nobody left who remembers.

`steps_close` takes an optional `stage`, which moves the product forward:
`not-started → decomposition → skeleton → revision → building → acceptance → extra-tasks → done`.
It only ever moves **forward**. Going back is the owner's decision, in the panel.

**Recording work that is already finished** — yours or someone else's — is one call:
`steps_create` with `status: "done"` and a `result`.

---

## 5. Use cases — what you may do, and the one thing you may not

```
cases_list · cases_get · cases_create · cases_update · cases_unconfirm
```

You may add a case, rewrite one, and withdraw its confirmation when you find it contradicts reality
or another case.

**You may not confirm. There is no such tool, deliberately.** Only the owner confirms, in the control
panel. The gate exists precisely because an unconfirmed case is the model's own guess; a model that
confirms its own guess turns the gate into decoration.

**Any edit drops a case back to draft** — that is the store's law, not a courtesy. A green status must
mean "the owner approved THIS text", never "the owner once approved some earlier text". So rewriting a
confirmed case costs the owner a fresh look, and that cost is the point: say what you changed and why.

Titles and scenarios are in the **owner's language**; the file name (`slug`) is English, because the
machine layer is loaded at the start of every session and a second language there is paid for in
tokens forever.

---

## 6. What this skill refuses to do

- **Start building with no confirmed case.** Say what is missing and point at the panel.
- **Invent a case to justify a step.** If the request serves no case, say so before writing code:
  either the request is wrong or the cases are out of date, and both are worth a sentence.
- **Work on a product you were not told about.** One product in `PRODUCTS-CONFIG` — that is the one.
  Several — work out which the request means and say so in one line. Cannot work it out — ask, and
  write nothing until answered. A change made in the wrong product stays invisible until someone
  else's product breaks.
- **Write outside the product's four roots** (pages · `lib/products/<id>/` · `<id>_*` tables ·
  `USE-CASES/<id>/`). Shared code rises to `components/` or `lib/`, and that move is stated in the
  step, never done quietly.

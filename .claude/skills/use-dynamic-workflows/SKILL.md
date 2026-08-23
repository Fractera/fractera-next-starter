---
name: use-dynamic-workflows
description: >
  Waves of agents instead of one — how the owner switches that on, what it is allowed to be pointed at,
  and what it costs. Load it when the owner says "use a workflow", "ultracode", "run this in parallel",
  "can several agents do this at once", or when a job in front of you is hundreds of near-identical
  units (every dictionary, every content page, one sweep across every route). The thing you cannot see
  from inside a session: the agents a workflow spawns run on THIS machine with THIS session's
  permissions, and they edit files auto-approved — so the only thing standing between a fan-out and a
  large, tidy, expensive wrong answer is a command that judges each unit without you.
---

# use-dynamic-workflows

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

**Off by default, and that is the correct state for most projects.** The law in `CLAUDE.md` («Как
строим») locks multi-agent work; this is the one sanctioned door out of it, and the door has two locks.

---

## 1. What it is — and what it is not

**Not "many agents at once".** That is a fan-out, and a fan-out is what people build by hand when they
are guessing.

A dynamic workflow is **a script that the model writes and a runtime executes**. The script holds the
loop, the branching and the intermediate results: the first wave runs, its results decide what the
second wave is — verification, summary, another fan-out — and only the final answer reaches the
conversation.

Switched on, it is triggered by saying **"use a workflow"** or the keyword `ultracode`. `/workflows`
shows every phase live, its agent count and its token total, and lets the owner pause or stop.

## 2. 🔒 Where it runs — read this before promising anything

**Nothing is created on the production server and no virtual machine is started anywhere.** The runtime
executes the *script* in an isolated environment with no filesystem or shell of its own; the script only
coordinates. The agents it spawns run **inside the existing session, on the machine that session runs
on**, with the same permission mode, the same tool allowlist and the same sandboxing as any other call.

So the honest answer to "what will it touch?" is: **exactly what this session can already touch, only by
up to sixteen agents at once instead of one.** If the session can reach the server, so can they.

- **Subagents always run in `acceptEdits`**, whatever the session's mode is: file edits are
  auto-approved. Shell, web and MCP calls outside the allowlist still prompt.
- **There is no mid-run input.** Only a permission prompt pauses a run. Sign-off between stages means
  each stage is its own workflow.

## 3. 🔒 The guard rule — the whole skill in one line

> **A workflow is justified only where each unit's result is judged by a machine, without the owner.**

Yes: translations, content sweeps, mechanical migrations — `check:i18n` counts languages and keys,
`check:content` refuses a bad link, `check:encoding` finds a broken character in any language.
No: architecture, the client/server boundary, debugging a build. There, proving an answer costs more
than producing it, and more agents produce more work to review, not less.

**Name the guard before the wave.** Cannot say which command judges the output — then it is not a
workflow, it is a fan-out with a hope attached.

## 4. 🔒 The failure mode: not a wrong answer, a plausible one at scale

**An agent that dies mid-write leaves a file that does not compile.** It already happened here: five
agents were translating one dictionary each, the session hit its limit, two died while writing and left
placeholder markers (`__UK_BLOCK__`) inside an object literal. The file looked finished. It could never
have built, and nobody noticed until a real build ran — a dictionary check validates dictionaries, not
the code that uses them.

Multiply that by a fan-out and you have the real risk. This is why §3 is a rule and not advice.

## 5. Cost — the test is the owner's own last week

Availability is not the question, affordability is: workflows are on every paid plan, so nothing stops a
run from starting. What stops it is the limit hit halfway through.

- an ordinary single-agent session already reaches the limit before the work is done → a workflow will
  not fit;
- ordinary sessions finish comfortably → a workflow is affordable.

**Stopping mid-run costs more than it looks.** On resume, cached results stop at the first agent that had
not finished, and every agent that started after it runs again — including the ones that completed. A run
does not survive leaving the CLI. Hence: **many small agents preserve far more progress than a few long
ones.**

What the product gives instead of a promise: `/workflows` shows each agent's tokens live and can stop the
run; a `Large workflow` warning appears past 25 agents or ~1.5M projected tokens (advisory, it pauses
nothing); a size guideline in `/config` aims the planner (`small` <5, `medium` <15 default, `large` <50)
behind hard caps of 16 at once and 1,000 per run. **Price a big job by running one slice first** — one
directory, not the repository. Plan numbers change; the last-week test does not.

## 6. 🔒 Two locks on the door

**Confirmed user cases.** The panel refuses to switch this on until the product dossier holds
cases the owner has confirmed (`PRODUCTS-CONFIG/<id>.json`, `cases[].confirmed` — see `use-use-cases`).
The reason is not bureaucracy: a workflow is an amplifier, and an amplifier pointed at a
guess produces a large, tidy, expensive wrong thing. The most costly outcome available in this product is
a hundred agents building carefully in the wrong direction. Cases are what point it.

**The owner's own judgement about cost** (§5). The panel cannot see the plan's limits; only the owner can.

## 7. Once it is on

- **Say it on the task itself.** Nothing about a task authorises a workflow by itself — not its size, not
  "independent parts", not "faster in parallel". That stays true from the law in `CLAUDE.md`.
- **The owner approves the plan before it runs.** The prompt lists the planned phases, `View raw script`
  shows the script. That is the last cheap moment to notice the wrong direction.
- **The session stays free while it runs**, but cannot steer mid-run (§2).
- **Save what worked** — in `/workflows`, `s` saves the run's script as a command. A review that runs on
  every branch then repeats the same orchestration; that, not the size of one run, is where a workflow
  repays its setup.

## 8. When to switch it back off

After the campaign that justified it. This is not a setting to leave on: with it on, every large request
carries the question "should this fan out?", and for most work here the answer is no — one mind holding
the whole picture, and one build to prove it.

# CONTEXT-STATE.md — the handoff between two context windows

<!-- fractera:context-state v1 -->

**state:** empty
**written_at:** —
**session:** —
**git_head:** —
**git_dirty:** —
**step:** —
**substep:** —
**next_action:** —

---

## What this file is

A context window ends. Sometimes it ends politely, with a compaction; sometimes the machine is switched
off mid-sentence. Either way the next session starts cold, and the most expensive minutes of this project
are the ones a new session spends re-deriving what the previous one already knew — usually getting it
subtly wrong.

This file is the one thing that crosses that gap. It is **written by the model, not by hand**, and it is
deliberately small: it is injected into every new session, so every line in it is paid for again and
again. It answers three questions and nothing else — what was being done, where it stopped, and what the
very next physical action is.

It is **not** a diary and **not** a summary of the work. History lives in git; decisions live in
`LESSONS.md`; what the product is for lives in `USE-CASES.md`. This file is the baton, and a baton is
useless if it is heavy.

## When the model writes it

Writing starts long before the window is full, because the failure this file exists for is exactly the
one that gives no warning.

| Context used | What the model must do |
|---|---|
| **75%** | Finish the current sub-step, then write this file. Not "plan to" — write it. Announce to the architect that the window is closing and ask to close the step. |
| **85%** | Stop opening new work. Only closing, and keeping this file fresh. |
| **92%** | Write this file immediately, before anything else, even mid-task. |

After the first write, keep it current: every time the next physical action changes, update the line. A
file written once at 75% and left alone describes a state that stopped being true half an hour ago.

## When the model reads it

**At the start of every session, before any other document.** A new session that starts building without
reading this file will redo work that is already done, or continue from a step that was already closed.

The reading is not passive. What is written here is a **hint, not proof** — see the law below.

## 🔒 The law of the stale baton

**The record says where the work was interrupted. It does not say where the work IS.**

The whole point of this file is that it survives an ungraceful ending: a crash, a closed laptop, a power
cut. The same ungraceful ending is what prevents the record from being updated. So the file can name step
123 while the repository has quietly passed 124, 125 and 126.

Acting on that stale line is worse than having no file at all: the model confidently rebuilds what is
already there and reports progress that is actually regression. This is the single failure mode that
makes this whole mechanism a liability instead of an asset.

**Therefore, on reading, always verify against reality before acting on a single line:**

1. `git log --oneline -10` and `git status --short` — commits do not lie about what happened; prose does.
2. Compare the repository's `HEAD` with the `git_head` recorded above. **They differ ⇒ the record is
   older than the work.** Treat it as a lead, and re-derive the current position from the commits.
3. Look at the files the record names. If the described "not done yet" work exists on disk and compiles,
   it was done after the record was written.
4. Only when reality and record agree may the record be used as the starting context.

Say out loud which of the two you are following — "the record and the repository agree, resuming at X" or
"the record is stale, the repository shows Y, I am resuming from Y". The architect must never have to
guess which one you believed.

## 🔒 The law of the consumed baton

**A baton is handed over once.** The moment a new session has read this file and established the true
position, the handoff is spent: it describes a window that no longer exists.

Where the session entry hook is installed, this is enforced mechanically: it hands the content to the new
session and resets this file to empty in the same move, keeping the previous copy under
`CONTEXT-STATE.archive/`. Then a record from three sessions ago cannot reach you.

Where it is not installed, the discipline is yours and it is not optional: **the moment you have adopted
the handoff and confirmed the real position, clear this file back to `state: empty`.** Leaving a spent
baton lying here is how the next session gets sent back to work that was finished days ago.

## What goes in it, and what never does

**In:** the current step and sub-step, the next physical action (a command, a file, a decision), the open
question waiting on the architect, the paths touched in this window, and the check that proves the work
is where it is claimed to be.

**Never in:** secrets, tokens or passwords — this file lives in your repository and travels to GitHub
with everything else. Never a retelling of the conversation. Never a list of everything done since the
beginning of the project; that is what commits are.

---

## Handoff

*(Empty. Nothing has been handed over — this is a fresh window, and there is no interrupted work to
resume. If you are reading this section and it says "Empty", start from the ordinary session entry.)*

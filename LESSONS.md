# LESSONS.md — what this project taught you

Long-term memory for the agent working on this app: the user's preferences and the working habits you
earned by getting something wrong once. A session ends and takes its context with it; this file is what
survives. Without it every session repeats the same mistake and asks the same settled question again.

**Three duties, and none of them is optional:**

1. **Read this file at session start**, together with `CLAUDE.md` and `GLOSSARY.md`.
2. **Follow what it says.** An entry here is an instruction, not a note. Where an entry and your default
   habit disagree, the entry wins — it was written because the default already failed here once.
3. **Add an entry when one of the triggers below fires** — in the same session, before the lesson is lost.

---

## When to add an entry (triggers)

- **The user corrected you**, or stated a preference about how the work should be done.
- **You were wrong in a way that will repeat.** Not the specific bug — the *habit* that produced it.
- **You established a non-obvious fact about this project** at real cost, one no file states plainly.
- **The user said "remember this".**

## When NOT to add one

- The task itself, what you changed, or anything git already records.
- Something `CLAUDE.md` or `GLOSSARY.md` already says — do not paraphrase the instruction back at yourself.
- A one-off detail with no next time in it.

If an entry turns out to be wrong, **delete it**. A false rule followed forever costs more than a missing one.

---

## Format

One entry, one rule. Keep it to a few lines — this file is read in full at every session start, so length
here is paid on every single one.

```
### YYYY-MM-DD — <the rule in one line>
**Trigger.** What happened that taught this.
**Rule.** What you do from now on.
**Why.** The reason, so a later session can judge whether it still holds.
```

---

## Entries

### 2026-08-09 — Type-check before calling a change finished
**Trigger.** A change was reported as done; the build on the server then failed on a type error, so the
work never reached the running app.
**Rule.** Run `npx tsc --noEmit` before saying a change is ready.
**Why.** "It compiled" and "it type-checks" are different gates, and the second is where the deployment
stops. Locally skipping it just moves the failure to where it costs more.

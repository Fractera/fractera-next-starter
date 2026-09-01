# Where this skill came from, and how it is updated

**This folder is FOREIGN CODE, vendored on purpose. Do not hand-edit a single file in it.**

| | |
|---|---|
| skill | `migrate-ai-sdk-v6-to-v7` — the rename-by-rename guide from AI SDK 6 to 7 |
| source | `github.com/vercel/ai`, path `skills/migrate-ai-sdk-v6-to-v7/` |
| installed with | `npx skills add vercel/ai -a claude-code` — **arrived together with `ai-sdk`, unasked** |
| installed as | copies, not symlinks |
| recorded in | `skills-lock.json` at the repository root, with the content hash |
| installed on | 2026-09-01, step 92-1 |
| risk rating at install | Safe · 0 alerts (Socket) · Low Risk (Snyk) |

## 🔒 It was not ordered, and its arrival was itself the message

One command asked for the AI SDK skill and two skills came back. **Nobody writes a migration guide
away from a version nobody uses** — its existence is the ecosystem saying that v6 is the outgoing
line. That is what sent us to check, and the check found this project a major version behind.

## 🛑 This skill has an expiry date, and it is named here

It is useful **only while this project runs `ai@6`**. The owner decided on 2026-09-01, verbatim:
**«Обновиться на v7 отдельным шагом»** — step 93.

🔒 **WHEN STEP 93 CLOSES, THIS FOLDER IS DELETED BY THE SAME EDIT THAT COMPLETES THE MIGRATION**, and
its row leaves the skills table in that same edit. Keeping a migration guide for a migration that
already happened teaches the next agent to read the skills list as noise — the same law that governs
a guard's debt: the record and its cause go together, never one without the other.

## What it actually says, so the reason is visible without opening it

The renames that make v6 code wrong on v7 — and therefore make every SDK example written before the
upgrade obsolete:

```
stepCountIs              → isStepCount
system                   → instructions   (generateText, streamText, generateObject, streamObject)
experimental_prepareStep → prepareStep
experimental_output      → output
onFinish                 → onEnd
onStepFinish             → onStepEnd
```

# Where this skill came from, and how it is updated

**This folder is FOREIGN CODE, vendored on purpose. Do not hand-edit a single file in it.**
A hand edit survives exactly until the next update and then disappears without a trace — silently,
because the updater overwrites rather than merges. Everything WE have to say about this skill lives
in `../use-ai-generation/SKILL.md`, which is ours and is never overwritten.

| | |
|---|---|
| skill | `ai-sdk` — the AI SDK by Vercel: how to call a model, define tools, and build agents |
| source | `github.com/vercel/ai`, path `skills/use-ai-sdk/` |
| installed with | `npx skills add vercel/ai -a claude-code` |
| installed as | **copies, not symlinks** — a symlink in a repository cloned on Windows is a missing file |
| recorded in | `skills-lock.json` at the repository root, with the content hash |
| installed on | 2026-09-01, step 92-1 |
| risk rating at install | Safe · 0 alerts (Socket) · **Med Risk** (Snyk) |

🔒 **THE FOLDER NAME IS `ai-sdk`, NOT `use-ai-sdk`, AND THAT IS NOT A MISTAKE.** The skill lives at
`skills/use-ai-sdk/` in Vercel's repository but declares its own name as `ai-sdk`; the installer uses
the declared name. **Never rename the folder to match the path** — the updater finds this skill by
its name, and a renamed folder is a skill that silently stops updating.

## What it is for, in one line

It teaches how to talk to a model with the SDK instead of hand-rolling HTTP calls, and its single
most valuable instruction is the one nobody thinks of on their own:

> **The documentation ships inside the package, at `node_modules/ai/docs/`, and it matches the
> version you actually run.** Eleven sections, including `03-agents/`.

That is better than the website: the website describes the newest version, `node_modules` describes
**ours**.

## 🔒 It earned its place in the first five minutes, and this is the record of it

Its own rule — *compare the installed version against `npm view ai version`, upgrade on a major gap* —
found something nobody was looking for:

```
installed:  ai@6.0.273
npm latest: ai@7.0.89        ← a major version behind
```

**Nothing else would have caught this.** The package was there, `npm ls ai` printed one line and
`deduped`, and the corpus's own version trap was satisfied — because that trap catches DUPLICATES,
not staleness. Measured 2026-09-01, step 92-1.

## 🛑 Where this skill is overruled by our own laws

Read `../use-ai-generation/SKILL.md` before following it. Four points collide, and on all four ours
wins — not because the foreign skill is wrong, but because it does not know this project:

1. **The AI Gateway.** It offers `AI_GATEWAY_API_KEY` as the fastest start. **We must not**: this
   project has one OpenAI key with three consumers, and a plaque that turns amber when one of them
   is missing it. A gateway would be a second key path, and it would diverge silently.
2. **Model identifiers.** Its rule «never from memory» is right; here the model arrives from
   `OPENAI_TEXT_MODEL`, which is a **setting on the bot's screen**, not a literal in code.
3. **Provider packages.** It says install `ai` first and providers later. `@ai-sdk/openai` is ours
   to add, and its major line must match the SDK's.
4. **Twelve files already call `v1/chat/completions` by hand.** They are history, not a pattern to
   copy, and each conversion is a step with its own proofs — never a drive-by edit.

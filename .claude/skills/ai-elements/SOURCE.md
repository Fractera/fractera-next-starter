# Where this skill came from, and how it is updated

**This folder is FOREIGN CODE, vendored on purpose. Do not hand-edit a single file in it.**
A hand edit survives exactly until the next update and then disappears without a trace — silently,
because the updater overwrites rather than merges. Everything WE have to say about this skill lives
in `../use-chat/SKILL.md`, which is ours and is never overwritten.

| | |
|---|---|
| skill | `ai-elements` — AI Elements by Vercel: chat UI built on shadcn/ui and the AI SDK |
| source | `github.com/vercel/ai-elements` |
| installed with | `npx skills add vercel/ai-elements -a claude-code` |
| installed as | **copies, not symlinks** — a symlink in a repository that is cloned on Windows is a missing file, not a link |
| recorded in | `skills-lock.json` at the repository root, with the content hash |
| installed on | 2026-09-01, step 80-2 |

## What came with it, and what it costs

The skill teaches the agent; the **components** are a separate install and they land as our own source
code in `components/ai-elements/`. Four are installed, deliberately — not the whole family:

| Component | Why it is here |
|---|---|
| `conversation` | the feed itself; scrolls to the bottom on its own, with a return button |
| `message` | one message and its parts |
| `attachments` | attachments with **automatic media type detection**: image, video, audio, document |
| `prompt-input` | the input area, with file attachment and a submit button |

🛑 **`message` is the expensive one, and the owner approved the cost knowingly (2026-09-01).** It
imports the `streamdown` family — `streamdown`, `@streamdown/cjk`, `@streamdown/code`,
`@streamdown/math`, `@streamdown/mermaid` — which transitively pull about twenty packages including
`mermaid`, `katex` and `shiki`. They serve exactly one part, `MessageResponse`, which renders a model's
answer as marked-up text. **A log feed does not need any of it; a chat with a model does**, and that
chat is the next step.

🔒 **`@ai-sdk/react` IS PINNED TO THE MAJOR THAT MATCHES OUR `ai`.** Version 4 depends on `ai@7` while
this project runs `ai@6`, and installing it put **two copies of `ai` in the tree** — a silent type
mismatch waiting to happen. Version 3 dedupes onto our own `ai@6`. **Check `npm ls ai` after touching
any of this: one line, `deduped`.**

## Two components were written by hand, and here is why

`npx shadcn add @ai-elements/message` and `@ai-elements/prompt-input` die with
`Fatal process out of memory: Zone` — reproduced three times, including with
`--max-old-space-size=4096`. The registry itself answers fine, so those two files were fetched from
`https://ai-sdk.dev/elements/api/registry/<name>.json` and written with the one transformation the CLI
performs: import paths `@/registry/<style>/ui/*` → `@/components/ui/*`.

**Nothing else was changed.** If you need to update them, do the same and diff against the registry —
the file content is right there in the JSON.

## What we refused to overwrite

The CLI offered to replace our own primitives — `button.tsx`, `tooltip.tsx`, `hover-card.tsx` — with
its versions. **Every one was declined.** Those files are our design system; a foreign version of them
would change the look of the whole project silently. Only `input-group.tsx` was added, because we did
not have it and `prompt-input` needs it.

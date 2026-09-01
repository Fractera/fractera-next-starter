# Where this skill came from, and how it is updated

**This folder is FOREIGN CODE, vendored on purpose. Do not hand-edit a single file in it.**
A hand edit survives exactly until the next update and then disappears without a trace — silently,
because the updater overwrites rather than merges. Everything WE have to say about this skill lives
in `../use-chat/SKILL.md`, which is ours and is never overwritten.

| | |
|---|---|
> 🛑 **ONE PATCH LIVES IN THE VENDORED COMPONENTS AND MUST BE REAPPLIED AFTER EVERY UPDATE.**
> See «The one deviation» at the bottom of this file. Re-vendor without it and the build breaks.

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

## 🛑 The one deviation — a hand patch inside vendored code, and why it exists anyway

**Rule broken knowingly, recorded here so it is not lost.** `components/ai-elements/prompt-input.tsx`
carries eight lines that are ours, added in step 80-4 and re-confirmed in 93-2.

**What it fixes.** `PromptInputSubmit` types its click handler with a bare React event, and it hands
that handler to **our** `InputGroupButton`, which stands on `@base-ui/react` and expects its own:

```
components/ai-elements/prompt-input.tsx(1245,17): error TS2345:
  Argument of type 'MouseEvent<HTMLButtonElement, MouseEvent>' is not assignable to parameter
  of type 'BaseUIEvent<MouseEvent<HTMLButtonElement, MouseEvent>>'.
  Property 'preventBaseUIHandler' is missing …
```

**Measured 2026-09-01 in 93-2, not assumed:** the vendored file was restored to the byte from its
install commit `32a4d72`, `tsc` produced exactly the error above, and the patch was put back.
The patch is **still required on AI SDK v7**.

**Why it cannot live outside the component.** The call is internal to `PromptInputSubmit`; there is
nothing to wrap from the outside. The patch takes the type FROM the component's own props
(`PromptInputSubmitProps["onClick"]`) rather than restating it, so a library change carries it along
instead of contradicting it.

🔒 **WHAT MAKES THIS SURVIVABLE IS NOT DISCIPLINE BUT `tsc`.** An update wipes the patch, and the
loss is caught by `npx tsc --noEmit` with the file and line named — this is measured, above.

🛑 **AND HERE IS THE HOLE, NAMED RATHER THAN PAPERED OVER:** `check:types` is **not** part of
`prebuild`. Nineteen gates run themselves; this one waits to be called by hand. So the safety net
exists and is not automatic — whoever re-vendors these components runs `npx tsc --noEmit` **before**
believing the update went well. Putting it into `prebuild` is a separate decision about everybody's
build time, and it is not taken here.

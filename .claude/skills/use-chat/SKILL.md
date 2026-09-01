---
name: use-chat
description: >
  WHEN the vendored `ai-elements` skill is the answer, and the rules of ours that overrule it. Load it
  before you build anything that looks like a conversation — a chat with a person, a chat with a model,
  a feed of messages, a log of what a bot heard, an inbox. There is exactly one right answer in this
  project and it is never hand-built markup: the chat tool in `_tools/chat/`, built on AI Elements.
  Also load it before adding any `@ai-elements/*` component, because the CLI asks to overwrite our own
  primitives and a yes there silently changes the design system of the whole project.
---

# use-chat

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

Our skill owns **WHEN**; the foreign `ai-elements` skill owns **HOW**. Read this one first.

---

## 1. 🔒 There is one chat in this project, and you do not write the second

Anything that shows a sequence of messages is the same thing wearing different names: a support chat,
an assistant, a log of a Telegram bot, an inbox, a history of what someone said. **All of them are the
chat tool**, `_tools/chat/`, in one of its two states.

| State | What it is | Who uses it |
|---|---|---|
| feed only | messages, no input area | the Logs section of the Telegram entry — it only reads |
| full chat | feed plus the input area, with attachments | anything a person can reply in |

**The difference is a prop, not a second component.** Two of them diverge on the first change to the
look, and the one nobody is watching becomes the ugly one.

✗ **PAID FOR IN 77-5.** The Logs feed was assembled by hand out of `<ul>`, `<li>` and classes — while
the `shadcn` skill sat vendored in this repository saying "including chat interfaces" in its own
description. The rule existed, the tool existed, and something was built beside them anyway. That is
the whole reason this skill is written.

## 2. What the library gives you for free — do not rebuild any of it

Installed in `components/ai-elements/` (step 80-2), as our own source code:

| Component | What you get |
|---|---|
| `conversation` | the feed; scrolls to the bottom by itself, with a return button when the reader has scrolled away |
| `message` | one message, its parts, actions, and branch navigation between alternative answers |
| `attachments` | **automatic media type detection: image · video · audio · document**, in three layouts |
| `prompt-input` | the input area, `PromptInputActionAddAttachments` for files, submit with state |

🔒 **FOUR OF OUR FIVE ATTACHMENT KINDS ARE NATIVE.** Audio, photo, video and document are detected and
rendered by `attachments` with no work from you. **Location and calendar are not** — those two are
ours, and they live in the chat tool, never as a fork of the library file.

## 3. 🛑 Four rules of ours that overrule the foreign skill

1. **Never accept the CLI's offer to overwrite our primitives.** `npx shadcn add` asks about
   `button.tsx`, `tooltip.tsx`, `hover-card.tsx` with a plain `(y/N)`. Every one of those is our design
   system. Answer no — always. Feed a **finite** number of `n` lines; an endless stream kills node.
2. **Nothing under `sections/` is ever a client component.** The block kind `chat` is a thin server
   renderer that places the tool; the interactive part is the island. Break this and the block
   catalogue stops building — the law of step 58.
3. **`components/ai-elements/` is foreign code.** Change it only the way the CLI would: import paths.
   Anything else lives until the next update of the library and then vanishes silently. If you need
   different behaviour, wrap it in the tool — that file is ours.
4. **A new component from the registry is a new dependency in every client's project.** Install the
   ones you need, not the family. `message` alone drags ~20 packages including `mermaid` and `katex`,
   and the owner approved that knowingly for the model-chat that is coming — do not treat it as licence
   to add the rest.

## 4. The two traps that cost time in 80-2

🔒 **`npm ls ai` must print ONE line and say `deduped`.** `@ai-sdk/react@3` pairs with `ai@6`; version 4
pairs with `ai@7`. Installing the newest put two copies of `ai` in the tree — a type mismatch that does
not fail on install and surfaces a week later somewhere else.

🔒 **`npx shadcn add` runs out of memory on `message` and `prompt-input`.** Reproduced three times,
including with a bigger heap. The registry answers fine:
`https://ai-sdk.dev/elements/api/registry/<name>.json`. The CLI does exactly two things — writes the
file and rewrites `@/registry/<style>/ui/*` to `@/components/ui/*`. Do the same, change nothing else,
and record what you did.

## 5. Before you call it done

1. The thing you built is the chat tool in one of its two states — not markup that resembles it.
2. `npm ls ai` shows one line and `deduped`.
3. None of our primitives under `components/ui/` changed.
4. `check:shadcn-rules` passes; the foreign folder is an exception with a reason, not a silenced rule.
5. If a message can come from more than one source, it **carries which one** — the field exists on the
   tool for exactly that, and it is empty until a second channel appears.

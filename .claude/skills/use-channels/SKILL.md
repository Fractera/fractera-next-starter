---
name: use-channels
description: >
  The project's outside conversations — today Telegram, and today READ-ONLY from your side. Load it
  when the owner wants a bot, a notification "to my phone", a voice assistant in a messenger, or a way
  for people to ask the site questions from Telegram; and before you install a Telegram library or
  poll a bot from a route of your own. Two things decide everything and neither is visible from the
  code you can see: Telegram hands each update to exactly ONE reader, so a second poller does not add
  a feature, it silently eats half the messages — and the channel service answers questions by itself,
  giving your application no door to send a message, receive one, or hear a voice note.
---

# use-channels

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

The door and the credential are in `use-data`; reached at `/service/channels/*` through `dataFetch`.

---

## 1. 🔒 One reader, and it is not you

Telegram gives each incoming update to whoever asks for it first, and to nobody else. Two pollers means
the messages split between them at random — the bot answers every other question and looks broken in a
way no log explains.

That is why one process owns the bot and everyone else asks IT over the loopback. **Never** install a
Telegram client in this app, never poll `getUpdates`, never register a webhook of your own for the
owner's bot. ✗ that trap already cost this project a day.

## 2. The whole surface — four routes, and all four are CONTROL

| Route | Gives you |
|---|---|
| `GET /status` | `configured` (a token is saved), `reachable` (Telegram recognises it), the bot's name, the linked `chatId`, `enabled` |
| `POST /telegram/config` | saves the token and settings; a NEW token drops the stored chat — it belongs to a different bot |
| `POST /telegram/link/start` | a one-time code plus a `deepLink` (`https://t.me/<bot>?start=<code>`) for the owner to press |
| `GET /telegram/link/poll?code=…` | whether that code has been used yet — the link flow's second half |

`status` is the honest first call: `configured: false` means the owner has not set a bot up, and that
is a **normal state**, not a fault to hide. Show it as "not connected", never as an error.

## 3. 🔒 What is NOT there — check this before you promise anything

Verified against the running service on 2026-08-23. These are not gaps in the telling; they are gaps in
the product, and a promise made over them is a promise the platform will not keep.

| The owner asks for | Today |
|---|---|
| "send me a notification to my phone" | **impossible from your app**: there is no outbound route. `sendMessage` lives inside the service and is not exposed |
| "let my app react to what people write to the bot" | **impossible**: no webhook, no queue, no door into the project. The service reads the update and answers it itself |
| "I want to talk to it by voice" | **the voice note is dropped silently.** The loop asks Telegram for `allowed_updates=["message"]` and keeps only `msg.text`; an update without text is skipped without a log line and without an error |
| "each of my clients gets their own chat" | **one chat, the owner's.** `chatId` is a single field in the config; linking overwrites it |
| "say it in our language" | the bot's own replies are English strings **inside the service**; your app cannot translate them |

**So when one of these is asked for, the honest answer is not "I will build it".** Name exactly which
of the five is missing, say that it is a change in the channel service — platform, not your slot — and
hand it over the way `CLAUDE.md` describes. Then build everything around it that does not depend on it.

## 4. 🔒 Linking is a handshake, and the human moves first

The code is issued, the owner opens the deep link and presses Start in Telegram, and only then does the
chat id exist. Your page polls until it appears, with a visible "waiting" state — and the code expires,
so a page that waits forever is wrong.

**You never ask a person for a bot token in the product's own form.** It goes in through the panel; a
token typed into an application page is a credential in a place that was not built to hold one.

## 5. What the bot already is

A **mouth for the knowledge base**: a question in Telegram is passed to the graph (`use-agentic-rag`)
and the answer is repeated back. When the base is switched off or empty it says so plainly rather than
inventing an answer.

So "let people ask our documents from Telegram" is mostly a matter of loading the documents, not of
writing a bot — and improving the ANSWERS means working on the knowledge base, not on the channel.

## 6. The shape is channel-agnostic on purpose

The service is written so that WhatsApp, email or a web widget become a second entry in the same config
rather than a second service. Another channel is a platform change — name it and hand it over
(`use-data` §5); do not grow a parallel messenger inside the app.

## 7. Before you call it done

1. `status` was read first, and the "not connected" path exists in the product, in the user's language.
2. Nothing in this app polls Telegram or holds the bot token.
3. The linking page shows waiting, success and expiry — the human is the slow part of that handshake.
4. Anything from §3 that the owner wanted was named out loud as missing, not quietly worked around.
5. If the answers are poor, you said so about the knowledge base — the channel only carries them.

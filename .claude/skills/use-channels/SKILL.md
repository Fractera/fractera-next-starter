---
name: use-channels
description: >
  The project's outside conversations — today Telegram. Load it when the owner wants a bot, a
  notification "to my phone", or a way for people to ask the site questions from a messenger; and
  before you install a Telegram library or start polling a bot from a route of your own. The law that
  decides everything here is not in any library's documentation: Telegram hands each update to
  exactly ONE reader, so a second poller does not add a feature, it silently eats half the messages —
  which is why the whole channel lives in a service and not in your code.
---

# use-channels

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

The door and the credential are in `use-data`; reached at `/service/channels/*` through `dataFetch`.

---

## 1. 🔒 One reader, and it is not you

Telegram gives each incoming update to whoever asks for it first, and to nobody else. Two pollers
means the messages split between them at random — the bot answers every other question and looks
broken in a way no log explains.

That is why one process owns the bot, and everyone else asks IT over the loopback. **Never** install a
Telegram client in this app, never poll `getUpdates`, never register a webhook of your own for the
owner's bot. That trap already cost this project a day once.

## 2. The four things the channel answers

| Route | Gives you |
|---|---|
| `GET /status` | `configured` (a token is saved), `reachable` (Telegram recognises it), the bot's name, the linked `chatId`, `enabled` |
| `POST /telegram/config` | saves the token and settings; a NEW token drops the stored chat — it belongs to a different bot |
| `POST /telegram/link/start` | a one-time code plus a `deepLink` (`https://t.me/<bot>?start=<code>`) for the owner to press |
| `GET /telegram/link/poll?code=…` | whether that code has been used yet — the link flow's second half |

`status` is the honest first call: `configured: false` means the owner has not set a bot up, and that
is a **normal state**, not a fault to hide. Show it as "not connected", never as an error.

## 3. 🔒 Linking is a handshake, and the human moves first

The code is issued, the owner opens the deep link and presses Start in Telegram, and only then does
the chat id exist. Your page polls until it appears, with a visible "waiting" state — and the code
expires, so a page that waits forever is wrong.

**You never ask a person for a bot token in the product's own form.** It goes in through the panel; a
token typed into an application page is a credential in a place that was not built to hold one.

## 4. What the bot already is

It is a **mouth for the knowledge base**: a question in Telegram is passed to the graph
(`use-agentic-rag`), and the answer is repeated back. When the base is switched off or empty it says
so plainly rather than inventing an answer.

So "let people ask our documents from Telegram" is mostly a matter of loading the documents, not of
writing a bot. And improving the ANSWERS means working on the knowledge base, not on the channel.

## 5. The shape is channel-agnostic on purpose

The service is written so that WhatsApp, email or a web widget become a second entry in the same
config rather than a second service. When the owner asks for another channel, that is a platform
change — name it and hand it over (`use-data` §5); do not grow a parallel messenger inside the app.

## 6. Before you call it done

1. `status` was read first, and the "not connected" path exists in the product, in the user's language.
2. Nothing in this app polls Telegram or holds the bot token.
3. The linking page shows waiting, success and expiry — the human is the slow part of that handshake.
4. If the answers are poor, you said so about the knowledge base — the channel only carries them.

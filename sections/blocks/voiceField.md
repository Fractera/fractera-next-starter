# voiceField — a text field that can be dictated

**Type:** Page material (11). The first kind of the catalogue that TAKES something from a visitor
instead of showing them something. Everything below follows from that one difference.

## Two sizes, one kind

`variant: 'line'` is a single-line input with the microphone built into the same frame; `variant:
'area'` is a text area with a full-width microphone button underneath. The default is `line` — a
short answer is needed more often than a long one.

They are the same field, which is why they are one kind and not two. Two kinds would mean two cards,
two taxonomy entries and two registry lines that must change in pairs — and the first edit to one of
them would drift from the other silently.

## It has no receiver, and that is a decision

**Owner's decision, 2026-08-28**, chosen out of two named options: the dictated text lives in the
browser and disappears on reload. The block renders the field and works by voice; where the text goes
is separate work with its own table, its own door and its own spam protection.

So: this kind is **not a contact form**. It does not submit, it does not store, it does not email.
Putting it on a public page and expecting to read the answers later is the one way to be wrong about
it. When the receiver is built, it arrives as fields on this same kind, not as a second kind.

## What it draws

`H3` title, a hint underneath, the field with its microphone, and — under the whole area — the
comment. While recording, an equaliser bar appears below the field; when recording stops, the bar is
**replaced in the same place** by the transcript, which the visitor edits and then accepts or
discards. One state at a time: showing the bar and the transcript together would claim a person is
speaking and correcting what they said at once.

Three refusals get their own line rather than a button tooltip: no API key, the browser denied the
microphone, the connection is not secure. A tooltip does not exist on a phone.

## What it needs to actually transcribe

HTTPS, a signed-in session and an OpenAI key on the server — the door is `/api/transcribe` and it
checks the role. Without them the field still works as an ordinary text field and says why the
microphone is unavailable. That is deliberate: a control that silently does nothing teaches nobody.

## When NOT to take it

- **As a comment form or a lead form.** It has no receiver — see above.
- **Inside an article, to look interactive.** It is form material: it belongs on a page that asks the
  visitor for something, next to the rest of that form.
- **For a value you already have.** The field starts empty and owns its own state; it is not bound to
  settings, to a product or to a record.

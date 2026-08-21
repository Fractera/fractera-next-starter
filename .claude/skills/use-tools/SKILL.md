---
name: use-tools
description: >
  The project's ready-made tools — what exists, where it lives, and why looking first is not
  optional. Load this BEFORE building any interface piece that feels generic: a picker, a cropper,
  a dialog for translations, a microphone, a code viewer, a media trimmer. Also load it when the
  owner says "we already made that", "why is there no window", "use the tool we built" — that
  sentence usually means a tool exists and was not found. Tools live in `_tools/<id>/` and are
  listed in the panel's registry; anything built beside them is a second copy nobody asked for.
---

# use-tools

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

A tool here is a small reusable piece with a home: one folder, one entry in the registry, one page
on the panel's showcase that says what it does and what it needs. Not a helper hidden in a feature
folder — those are invisible, and invisible is the same as absent.

## Look before you build — the failure this prevents is real, not theoretical

The translations dialog existed for months. Its own header said "connects to any entity with
translatable fields". It was written for the footer and menu sections specifically. And when the
translate button in those very sections was built, it was built from scratch: a call to the door
and one line of text — no language cards, no manual editing, no per-language save.

Nobody was lazy. The tool sat in `components/i18n/`, not in `_tools/`, and the registry did not
list it. **There was nowhere to look.** That is the whole lesson: a tool without a home does not
exist, no matter how good it is.

So: before writing an interface piece that feels generic, read the registry
(`bridges/app/lib/tools-registry.ts`) and the tool pages. It costs one file read. Building the
second copy costs a day, and the copies drift apart quietly afterwards.

## Two homes on purpose, and neither is redundant

The same tool is copied on both sides: `bridges/app/_tools/` (panel) and the app's `_tools/`.
Deleting one of the two breaks something real:

- **Panel-only** would make the app depend on the panel at runtime — and the owner's right to
  detach and run alone dies with it.
- **App-only** would put the panel's own forms inside the user's repository, where he can delete
  them and break the panel he is using.

Copies drift. That is the price, and it is paid deliberately. What keeps it survivable: each copy
carries a header naming its mirror and listing what differs and why. Typically the dialog primitive
(the panel's shadcn vs the app's shared dialog), where languages come from (a prop vs the app's own
config), and which door does the work. Behaviour stays common.

**Distribution is by copy, never by network call.** The app does not read tools from the panel at
runtime — it installs a copy into its own `tools/<id>/` and edits it as its own code. A tool is
almost always adjusted to the task; reading it over the network would mean either forbidding edits
or drifting silently between what is installed and what runs.

## What a tool must carry to count as one

An entry in the registry with its real files, its honest `needs` (browser, HTTPS, OpenAI key,
ffmpeg), and its true `npmDeps` — a package the starter lacks is a decision the owner must make
before installing, not a surprise at build time. A page on the showcase. A documented contract in
`lib/tools-doc.ts`: purpose, mechanics, params, limits. And a mirror in the other home.

Half of that is not a tool. It is a component someone will fail to find.

## When you build a new one

Ask first whether the thing is genuinely reusable or belongs to one screen. A tool that serves one
caller is a component in that caller's folder, and pretending otherwise adds a registry entry
nobody reads.

If it is a tool: put the words on the server and hand them to the island as props — the panel's
dictionary is 82 languages and never travels to the browser. Take the owner's existing pieces
rather than adding your own: the microphone, the cropper and the code viewer are already there.
Name refusals plainly and link to where they are cured; "could not" tells a person nothing about
what to do next.

## If a tool was deleted, do not rebuild it from memory

The starter's own tools live in its latest version:
**https://github.com/Fractera/fractera-next-starter**. Take the ARCHITECTURE from there — folder
shape, contract, layer boundaries — not the text or the images of that project. Copying a whole page
into someone else's product carries their identity along with it; copying the structure is exactly
what the specimens exist for.

A tool rebuilt from memory differs from the original in the details nobody notices until the first
refusal: no focus trap, the card's language lost, the reason hidden behind "could not".

## Proof

A tool is done when it works in a browser on both sides — not when types are green. Green types
proved nothing about the translate button: it compiled perfectly and showed a line of text where a
window belonged.

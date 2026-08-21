---
name: use-sections
description: >
  The SECTION layer — the closed catalogue of block kinds every page is built from, and what it takes
  to add one. Load it when a page needs a look the catalogue does not have, when you are about to
  write anything under `sections/`, or when the owner says "make a block that…". The decision this
  skill exists for is made before the first file: a new kind is a promise the platform keeps forever,
  and most of what feels like a new kind is a widget belonging to one route. Adding one wrongly does
  not fail loudly — it quietly makes the project's look un-maintainable.
---

# use-sections

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

## 1. What the layer is

A page is a list of blocks; a **kind** is one entry in the catalogue, and its **renderer** is the one
file that draws it.

```
lib/content/blocks/types.ts    the SHAPE of every kind — what fields it has
sections/blocks/<kind>.server.tsx   ONE kind, ONE file — how it looks
sections/index.ts              the SECTIONS map — the authoritative list
sections/contract.ts           what a renderer receives
```

**How many kinds exist: ask `sections/index.ts`, never a document.** `npm run check:sections` prints
the count. A number written into prose is stale the week after — this project's own instruction said
28 while the gate answered 29.

## 2. 🔒 The catalogue is closed by construction, and that is the point

`SectionSet` is a mapped type over every `Block["kind"]`. Add a kind to the catalogue without writing
its renderer and **the project does not compile** — you learn in a second, not in a month by an empty
patch on a page. No gate can offer that: a gate runs when somebody runs it, a type always runs.

The consequence to hold on to: **every kind is the platform's responsibility forever.** It needs its
renderer, its specimen on the catalogue page, its behaviour in every theme and every language, and it
will be maintained by whoever comes next. That is the price of the promise, and it is why the answer
to "we need a new look" is usually not a new kind.

## 3. 🔒 Which is it — a kind or a widget?

One question decides, and it is not about difficulty:

> **Would this look suit ANY page of the project, or only this one?**

**Any page → a kind.** It joins the catalogue, gets a specimen, becomes shared property.

**Only this route → a widget** (`_widgets/{static|dynamic}/<name>/` inside the route, `use-widgets`).
Unique layout, a borrowed library, its own behaviour, a wow element — all of that is a widget, and the
value is precisely that it suits nobody else.

The failure mode is one-directional and slow: a catalogue grown one kind per single page ends up with
kinds nobody reuses, while the thing that was genuinely unique had to be made general to get in.

Two more markers worth naming:

- **A section renderer never takes a build-time dependency of its own.** Something needing a package
  and a build is a **tool** (`_tools/`, `use-tools`), mounted from wherever it is needed.
- **A section owns its LOOK, not the shape of its data.** Fields live in `blocks/types.ts`. A renderer
  decides how `quote` looks and not what `quote` is made of — otherwise material stops being portable
  between the page, the markdown twin and the map, and it is the same material in all three.

## 4. Writing one, when it really is a kind

Four edits, and the type will not let you skip any:

1. the shape in `lib/content/blocks/types.ts`;
2. the renderer `sections/blocks/<kind>.server.tsx`;
3. the entry in `sections/index.ts`;
4. a **specimen** on the catalogue page — `check:sections` refuses a kind that is rendered nowhere
   (`kind-not-rendered`): a kind drawn on no page is checked by nothing.

🔒 **No file under `sections/` carries `"use client"`.** This is a property of the layer, not a habit:
renderers are server components, and anything interactive lives in an island the renderer mounts from
`components/`. The island receives resolved strings as props — a client file importing a dictionary
ships every language to the browser. Pattern to copy: `project-type-marquee.server.tsx`.

## 5. 🔒 Colour comes from the theme, always

`check:sections` refuses:

- **`absolute-colour`** — a literal colour in a class or, worse, in an inline style. An inline style
  outranks a class and does not hear the theme at all; a section painted that way stops changing with
  the rest of the site and nobody notices until the owner switches his palette.
- **`fill-without-pair`** — `bg-primary` without `text-primary-foreground`. Fills and their text come
  in pairs; half a pair is unreadable text in exactly one theme.

The contract file carries no colour and no class deliberately: the first look-detail that leaks in
becomes mandatory for every renderer at once.

## 6. 🔒 One page, no repeated kinds

The owner's rule: a kind does not appear twice on the same page. The eye recognises the drawing before
it reads the words, so a second block of the same shape reads as a repetition even when the text is
entirely different. Counted for standalone sections (`flow`, `cards`, `metrics`, `panel`, …), not for
what lives inside them — a paragraph, a card, a list item is material, not a second section.

No gate catches this. It is a question you ask yourself before reaching for a ready kind: *is this
drawing already on the page?* If it is, the honest answer is a different kind — that is normal work,
not extra work. `problemSolution` exists because of exactly this.

## 7. Before you call it done

- `check:sections` — every kind has a specimen, colours are tokens, fills carry their pairs.
- `check:typography`, `check:layout`, `check:contrast` — text through the primitives, no size that
  shrinks as the screen grows, contrast that survives both themes.
- Open the catalogue page and look at the specimen in **both** themes and in a narrow window.
- Read the page you built with JavaScript off: a server renderer plus an island degrades visibly; a
  renderer that drew nothing without scripts is the mistake this layer is shaped to prevent.

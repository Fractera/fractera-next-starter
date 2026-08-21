---
name: use-design
description: >
  Where design comes from in this project, and what happens when it arrives from OUTSIDE — from a
  design skill, an MCP server, or a paid service that returns not advice but real source code for a
  block or a section. Load it before accepting any externally produced design artifact, before
  building a one-off "wow" element, and whenever someone proposes adding a new section kind to make
  a page look special. ⚠️ SEED: only the external-design doctrine below is written; the rest of the
  design system (tokens, primitives, typography) is still to come — read `DESIGN-CONFIG` and the
  design ring table in the widgets step until it is.
---

# use-design

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

## The default is one brand, and that is the product, not a limitation

This project is standardised into a single visual identity on purpose. Headings, lists, tables,
cards and callouts are taken ready-made and look the same everywhere; nobody re-styles anything, and
the design cannot drift page by page. Everything below assumes that default holds — the exceptions
are exceptions, not an escape hatch to reach for whenever a page feels plain.

## Design now arrives from outside, and it arrives as CODE

Modern models produce genuinely beautiful design. It reaches this project through design skills and
MCP servers — some of them paid — and the good ones do not return advice. They return **real source
code** for a block or a section, sometimes derived from an example the owner pointed at.

🔒 **By default that code does NOT become ours.** It becomes a **widget** — the ring where writing by
external design skills and third-party libraries is allowed (the ring table lives in the widgets
step). Letting foreign markup into the platform's own catalogue would end the single brand: the
catalogue is closed by construction, every kind is the platform's responsibility forever, and a
kind that entered by accident is maintained by everyone thereafter.

🔒 **But the owner may promote it, and that must not be forbidden.** If he wants a particular widget
to become the project's design standard, that is a legitimate decision — his project, his identity.
Promotion is a deliberate act named in a step, and its price is stated plainly rather than
discovered later: from that moment the thing belongs to the platform. It needs its renderer, its
specimen, its translations, its gates, and its mirror on the other side.

**The direction that is always wrong is the silent one** — foreign code sliding into `sections/` or
`components/` because it happened to be pasted there. Nobody decided, and nobody knows it is foreign.

## The owner points at somebody else's site — what you may take from it

He will. During the case interview, "make it like X" is how people describe taste, and it is a
legitimate brief. You have a real instrument for it, installed in this project:

**`extract-design-system`** (`npx extract-design-system <url>`) drives a headless browser over a
public page and writes `design-system/tokens.json` and `tokens.css` — the colour palette, type
scale, spacing, radii, shadows. Not components, not layout: **primitives**.

That output maps onto this project exactly, and that is why it is worth using: our own
`DESIGN-CONFIG` holds colours by role, fonts, the type scale and shape. Extracted numbers become a
PROPOSAL for those fields, the owner approves them in the panel, and from that moment they are his
tokens — no foreign file is left behind anywhere.

🔒 **Take the SYSTEM, never the identity.** The line is not subtle and it is not ours to blur:

| Take | Never take |
|---|---|
| the palette as numbers, the type scale, spacing rhythm, radii, shadow depth | the logo, the wordmark, the icon set |
| the structural idea — what sits above what, how dense the page is | photographs, illustrations, video |
| the interaction pattern — what expands, what follows the cursor | the copy: headlines, slogans, product names |
| — | a typeface bought under a licence that is theirs, not his |

A palette and a spacing scale are craft, and craft travels. A wordmark and a photograph are somebody's
property, and a customer's site carrying them is a problem the customer inherits — from us.

🔒 **The tool itself carries no such warning**, so this paragraph is the warning. It also says openly
that a single page is not proof of a design system and that a dynamic site yields a partial answer —
believe it: treat the output as a first draft to show the owner, never as a finished palette.

**Where the extracted result may land:** in `DESIGN-CONFIG`, through the owner's approval. Not in
`sections/`, not in `components/` — a token file is not permission to import foreign markup, and the
rules above about widgets and promotion apply unchanged.

## 🔒 The tension nobody should discover the hard way

An external service returns compiled-shaped code: a React file with its own markup and styles. But a
widget, by the owner's own rule, arrives **without a build** — like content. Compiled code cannot.

So the artifact has to land in one of three places, and choosing is the work:

- **Expressible in the widget vocabulary** → it becomes a widget, arrives as a description, no build.
  This is the default and the cheapest.
- **Genuinely a reusable capability** → it is a **tool**: it goes through the build, gets a home in
  `_tools/`, a registry entry and a mirror. See `use-tools`.
- **Becomes the project's identity** → the promotion above: a section, with everything that entails.

Answering "which of the three" before writing anything is what this skill exists for. Getting it
wrong is not a style question: a wow element pasted as a section quietly makes the brand
un-maintainable, and a capability buried in one route is a tool nobody will ever find again.

## What still has to be written here

The vocabulary question is open and belongs to the widgets step: how rich the widget description
must be for the owner to feel no ceiling, and where the honest boundary runs beyond which the answer
is "this needs a build". Do not invent that boundary in passing — it is a decision, not a detail.

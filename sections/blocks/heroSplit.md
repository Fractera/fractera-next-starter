# heroSplit — the landing first screen: words left, picture right

**Type:** Hero (1). The only kind meant to open a landing page.

## What it actually draws

Mark and eyebrow centred; under them two columns — the heading with its text and button on the left, an
illustration on the right.

🔒 **This is the ONE kind that carries the H1 itself.** Everywhere else the title is printed by the page
factory. Here it has to stand inside the left column, and outside the grid it cannot get there. A page
using this section declares `titleInBody`, and the factory stops printing its own — otherwise the page
gets two H1s.

🔒 **The picture names a SETTINGS SLOT, not a file.** Every project has its own image and changes it in
the panel without a rebuild. Hard-coding a path here would ship one picture to every customer.

🔒 **Its own width limit: 56rem, and it is a meaning decision** (owner, 2026-08-15). The section spans
the full screen and ignores the width toggle, but its CONTENT must not stretch: on a 2500px monitor a
heading and a picture pushed to opposite edges read as a broken page, not a wide one.

## When to take it

The first screen of a landing page — the one where the offer has to be readable in three seconds.

## When NOT to take it

- On a post, a legal page or a catalogue: they get their title from the factory, and this section would
  fight it.
- More than once on a site. Two different first screens teach the visitor that the site has no front
  door.

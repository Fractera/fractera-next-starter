# toc — the table of contents of a page

**Type:** Page material (11). Built by the page factory, never by the author — the one kind of the
catalogue whose content is computed rather than written.

## You do not fill it in

`items` are derived from the `h2` blocks of the body, with the same `headingId` the headings
themselves print. Two consequences follow, and both are the reason the kind works at all:

- **The anchors match by construction.** A second way of turning a heading into an address diverges
  on the first text with punctuation, and then the contents lead nowhere — a defect nobody notices,
  because the link still scrolls, just to the wrong place or to none.
- **The words cannot go stale.** Written by hand, the list becomes a second copy of the headings. Fix
  a heading, forget the copy, and the page keeps a working link with a wrong label on it.

**Decision of the owner, 2026-08-22: the table of contents stays automatic.** It appears whenever the
body has `h2` headings, and no page declares it. That is exactly how it behaved before step 542; what
changed is only who draws it — a catalogue kind instead of layout written inside the factory.

## What it draws

A bordered plate above the body: an uppercase lead line — the mechanism's own words ("On this page")
plus the number of entries — then a numbered list of links. The number is a **sign, not text**:
`aria-hidden` keeps it out of screen readers, where "01" before a section name says nothing and gets
in the way. Its contrast was raised to full `muted-foreground` after an accessibility check
(2026-08-13): at `/70` the ratio fell below the threshold.

An empty list draws nothing at all, rather than an empty plate.

## Only `h2` gets in

`h3` does not, and that is a rule of the page rather than of this kind: a table of contents of two
levels stops being scannable at about seven entries, which is where most pages already are. A section
that deserves its own line in the contents deserves an `h2`.

## Known debt

`aria-label="Contents"` is in English in every language. It was carried over verbatim in step 542 so
that the move stayed a move; it is fixed together with the rest of the mechanism's labels, not here.

## When NOT to take it

- Placing it by hand to move it elsewhere on the page — the factory adds its own, and you would get
  two.
- A list of links to OTHER pages — that is `list` with links, or a section of cards. This kind means
  "the sections of this page" and its anchors point inside the page.

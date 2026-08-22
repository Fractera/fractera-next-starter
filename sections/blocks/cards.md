# cards — a section made of cards

**Type:** Benefits and value (2). Answers "what is this made of" or "what are my options" — with
several equal pieces the reader chooses between or compares.

## The number of cards is a multiple of the columns

`cols` takes **2 or 3** (default 3), and the grid does not reflow by width: it is `md:grid-cols-2` or
`md:grid-cols-3`.

**What breaks.** A card count that is not a multiple of the column count leaves the last row
incomplete — one card under three, pushed to the left. It is the same defect `metrics` has, and the
owner was burned by it twice in one day (2026-08-21): first with numbers, then with cards.

So the working pairs are: **3 columns — 3, 6, 9 cards**; **2 columns — 2, 4, 6**. Four cards in three
columns is the most common mistake, because "four" feels like a natural number.

**A fifth card in three columns is legal in exactly one case:** when the bottom row of two reads as a
pair by meaning, not as a remainder. That is a judgement, not a rule.

## When to take it

Three or more equal pieces, each with its own heading and its own content. Anything can live inside a
card — a paragraph, a list, a subheading: a card is a container, not a line.

## When NOT to take it

- The pieces are NOT equal, one matters more — that is `panel` or `callout`.
- There is an order between them, the first precedes the second — that is `flow`: cards promise no
  sequence.
- There are exactly two and they are opposed — `problemSolution` or `columns`.
- They are numbers, not stories — that is `metrics`.
- `cards` already stands on this page: a kind is not repeated (owner's rule, 2026-08-22).

## Owner's rules

- **2026-08-21 — never add a card beyond the multiple.** Occasion: reusing the section, the agent added
  a fourth card to three, and the last row fell apart.

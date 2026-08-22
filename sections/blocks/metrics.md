# metrics — the numbers that prove it

**Type:** Trust and logos (10). Answers the reader's "is that actually true?" with a short number
instead of a paragraph.

## 🔒 Exactly THREE items

The renderer is `sm:grid-cols-3` plus `divide-x` — three columns with dividers between them, from the
small screen up. **On a phone there is one column**, and any number of items falls into place there —
the defect lives only on a wide screen, which is exactly where the owner looks at his page.

**What breaks on the fourth.** It drops to a second row ALONE, into the left column, with an empty
third beside it and a divider hanging in the air. It reads not as "one more metric" but as a page that
gave up. The owner called it, word for word, "жуткое уродство" (2026-08-21) — and he was right: a grid
with dividers promises symmetry, and the fourth element cancels that promise without giving anything
back.

**Two items** leave an empty third on the right. Formally fine, visibly short.

The type does not guard this yet: `items` is declared as an unbounded array
(`lib/content/blocks/types.ts`), so a fourth element compiles in silence. Until that changes — count
with your eyes.

## When to take it

You have **three** numbers, each of which the reader can check or at least measure against experience:
how many times over, how many minutes, how many people, since which year.

## When NOT to take it

- One number — that is `statement` or a callout, not a grid with one column filled.
- Many numbers, all alike — that is `table`: a table promises no symmetry and therefore breaks none.
- The "numbers" are really properties ("fast", "reliable", "cheap") — that is `badges`.
- `metrics` already stands on this page: a kind is not repeated on one page (owner's rule, 2026-08-22).
  A second proof is given by a different shape — `quote`, `table`, `flow`.

## Owner's rules

- **2026-08-21 — three and only three.** Occasion: reusing the section, the agent added a fourth column
  and it landed against the left edge. Written down instead of a silent fix, so the next agent does not
  repeat it.

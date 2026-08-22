# flow — how it works, step by step

**Type:** How it works (3). The only kind in this type today.

## What it actually draws

A titled section with steps that light up in order, and light travelling along the link between them.
Each step has its own title and text.

🔒 **The heading uses the `content` variant, and that is a corrected mistake** (2026-08-16, spotted by
the owner at first glance). It stood as `variant="ui"`. The typography primitive splits variants by the
MEANING of the surface: `content` is the storefront — home page, posts, legal pages, catalogue; `ui` is
work screens. The home page is a storefront, so there is nothing to argue about.

The cost of that mistake was visible to the eye: two standalone sections stood side by side with
DIFFERENT headings — one sans at 18px, the next serif at 24px. Exactly the mismatch the primitive
exists to prevent.

## When to take it

A process with an order: first this, then that. Three steps read best; more than five and the section
turns into a list that happens to be drawn as cards.

## When NOT to take it

- The pieces are equal and have no order — that is `cards`. Cards promise no sequence.
- It is one process shown in two states, before and after — that is `problemSolution`.

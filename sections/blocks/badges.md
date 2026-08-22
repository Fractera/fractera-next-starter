# badges — a row of capability labels

**Type:** Benefits and value (2). The shortest way to say "it can do all of this" without a paragraph.

## What it actually draws

Labels wrapped into a centred row. Each has a `tone`, and the tone is what makes the row work.

🔒 **Colour here WORKS, it does not decorate.** Eleven words split into four groups the eye reads before
it reads: data, reach, access, code. Give every label the same tone and the row becomes a pile.

🔒 **The tone map lives in `sections/tone.ts`, not in this renderer** (2026-08-16). It used to live
here, and a second kind (`noBill`) started showing labels too — a copy would have drifted on the first
edit, and "data" on one row would be a different colour from "data" on the row below.

**Label size comes from the type scale (`--fs-eyebrow`), not from a Tailwind step** — otherwise it stops
moving when the owner changes `--type-scale` in the panel.

## When to take it

A dense list of capabilities where each item is two or three words. Grouping matters more than detail.

## When NOT to take it

- Items need explaining — that is `cards`.
- Items are numbers — that is `metrics`.
- There are two or three of them: a row of three labels looks like something failed to load.

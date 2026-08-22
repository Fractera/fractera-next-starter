# faq — questions and answers, last on the page

**Type:** Page material (11). Not a landing section: it can close any page — a post, a legal page, the
home page — and it is the only kind a search engine reads as pairs of "term and definition".

## Where the words come from

The **heading is printed by the mechanism**, not by the material. "Frequently asked questions" already
exists in ten languages in `lib/content/page-ui.ts`, so the block carries no heading of its own.
`title` overrides it, and it is meant for a page whose questions are about one specific thing rather
than frequent — not for translating the default, which would put ten copies of one word into ten
language cells.

The **pairs come from the page's own `faq` field**, the same field that feeds the `FAQPage` structured
data. Step 542 moved the drawing into this kind and changed nothing about where the content is
declared: one place to write questions, one place to draw them.

## No inline markup, and that is deliberate

Almost every neighbouring kind resolves `**bold**` and `[links](…)`. This one does not. The very same
strings are handed to search engines as `FAQPage` JSON-LD, and structured data is taken **verbatim** —
asterisks and brackets would be printed to the crawler as part of the answer. An answer that genuinely
needs a link is not an FAQ answer; it is a section of prose with a heading of its own.

## One per page

The anchor is fixed (`#faq-heading`) so that it can be linked to from outside the page. Two of these
sections would emit the same `id` twice, which breaks both the link and the markup. This is the
general owner's rule — a kind is not repeated on a page (2026-08-22) — with a technical reason on top.

## When to take it

Real questions a reader asks before acting: what it costs, what happens next, what if it goes wrong.
Three to seven pairs. The section closes the page: only the back link sits below it.

## When NOT to take it

- The "questions" are headings in disguise, and the answers are paragraphs — that is `h2` plus `p`,
  and it belongs in the body where the table of contents can see it.
- One question with a long answer — that is `callout` or `panel`.
- Answers that need links, bold text or lists — see the structured-data rule above.
- Two independent sets of questions on one page — see the anchor rule above.

## What it draws

A section separated by a rule above it, the heading, and then one bordered plate per pair: the
question in solid text, the answer in muted text beneath it. Markup is `<dl>` / `<dt>` / `<dd>`,
because the pairing is the content of the section, not its decoration.

# founder — the owner's quote, signed from settings

**Type:** Testimonials and social proof (8). The only kind in this type today, and it carries ONE voice —
the owner's, not a customer's.

## What it actually draws

A pull quote with the signature under it: name, role and photo taken from the project settings, not from
the content.

🔒 **The drawing itself moved to `sections/pull-quote.server.tsx`** (2026-08-16). The same look was
needed by a second block — a product rule with no author — and a copy of the gradient would have drifted
from the original on the first theme edit. What stayed here is the only thing that belongs to this kind:
THE SIGNATURE.

🔒 **Three absolute colours were removed earlier** (step 508, caught by a gate during the move):
`text-gray-400` / `text-gray-500` in the signature and a violet gradient written straight into `style`.
All of them looked identical in both themes by construction — the same defect that left the blog black
under the light theme.

## When to take it

One statement the owner stands behind personally, on a page where a person matters more than an
argument.

## When NOT to take it

- Several testimonials from different people: no kind does that yet. Say so — do not repeat `founder`
  three times with different names, the signature comes from settings and would be the same every time.
- A quote from a document or an article — that is `quote`.

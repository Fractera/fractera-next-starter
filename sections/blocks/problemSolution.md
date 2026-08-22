# problemSolution — cases on the left, the chosen one broken down on the right

**Type:** Comparison (6). The only kind in this type today.

## What it actually draws

Two halves: a list of cases on the left, and on the right the one selected — "what you do" on top,
"why it works here" below.

🔒 **Not a single line of script, and that is the main decision of this kind.** The example it was taken
from switches tabs with React state: without JavaScript there is not one case on the page, and the
crawler gets a separate invisible copy of the text — an admission that the visible version does not
serve it. Here the switching is done by the browser itself: the list is `radio` inputs, the labels are
their labels, and showing the right half is a `:checked` rule in `styles/globals.css`.

What that buys at once: the text of ALL cases sits in the server markup; a person without scripts uses
the section fully, not "tolerably"; the keyboard works because it is a real form control.

## When to take it

Two things set against each other — old way versus new, us versus them, before versus after. Or several
cases where the visitor picks the one that is his.

## When NOT to take it

- The pieces are not opposed, they simply differ — that is `cards`.
- It is a real table of ticks and crosses — that is `table`.
- There is only one case: the left column becomes a list of one, and the section looks broken.

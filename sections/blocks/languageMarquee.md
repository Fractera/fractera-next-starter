# languageMarquee — the language ribbon, closing the page

**Type:** Trust and logos (10). An outro section: it ends a page, it does not open one.

## What it actually draws

A ribbon of languages crawling left to right — flag and the language name written in that language,
longer than the screen can hold.

🔒 **What it proves.** Eighty-two languages is a claim that means nothing as a list in a sentence. The
ribbon shows them in the face, one after another. That is also what makes it an example of a section
that needs the full screen width.

🔒 **ALL 82, not the enabled set.** Two languages are on today, ten tomorrow — the ribbon is about what
the product can do, not about the current setting. Hence `ALL_LANGUAGE_METADATA`, not
`SUPPORTED_LANGUAGES`.

🔒 **The movement is CSS, without a line of JS.** The page must work with scripts off, and a ribbon that
only exists after hydration is a ribbon the crawler never sees.

## When to take it

The very bottom of a page where breadth of reach is the argument.

## When NOT to take it

- In the middle of a page: it takes the full width and cuts the reading in half.
- Twice on one site. It is a closing gesture; a second one turns it into wallpaper.

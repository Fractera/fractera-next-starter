# DESIGN-CONFIG — how the project LOOKS

Holds `design-config.json`: the owner's visual choices — colours by role (light and dark),
fonts (heading / body / mono), the type scale, and shape (radius, border width, content width).

## How it works

**The control panel (`:3002`) writes it. This application (`:3000`) reads it** — the same contract
as `APP-CONFIG` and `PLATFORM-CONFIG`: one file, one writer, one reader, read per request, applied
**without a rebuild**.

At render time `lib/design-css.ts` turns the tokens into CSS and the root layout injects it into
`<head>`, after the project theme. External font URLs are emitted as `<link>` rather than `@import`:
the browser sees a link immediately, while an `@import` inside `<style>` costs an extra network
round-trip before the font is even requested.

## Rules

- **Empty means "the theme decides".** Every value here is an OVERRIDE. A missing key is not a gap
  to fill — it means the owner did not object to the project theme
  (`config/design/design-minimal-001.css`), which ships a full palette in both light and dark.
- **Never duplicate the theme's palette into this file.** Two palettes drift apart on the first edit
  of either, and they drift silently: the page still looks fine, just not like the CSS says.
- **Light and dark are separate values of the same role.** A colour set once is almost always wrong
  on the other theme — dark text on a dark background disappears entirely.
- **Values are not parsed, only checked for safety.** A colour may be `#0b0f19`, `oklch(…)` or
  `color-mix(…)`; enumerating valid forms would forbid half of them. Values containing `{ } < > ;`
  are dropped — that path ends in a `<style>` tag.
- **No secrets here.** Colours and font names. This file is tracked by git.

## Related

`../APP-CONFIG/` — identity and menu · `../PLATFORM-CONFIG/` — feature switches. Same contract,
different subject.

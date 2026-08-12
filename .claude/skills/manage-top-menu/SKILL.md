---
name: manage-top-menu
description: >
  Work on the app's TOP MENU / header / site navigation. Use when the owner says "add a top
  menu", "add a link to the site", "put X in the navigation", "change the menu", "make the
  header look different", "add a dropdown to the menu", or anything else about the bar at the
  top of the page. ALSO use before writing any header-like component of your own. The menu
  already exists and its buttons are the OWNER's setting, held in files that are NOT in the
  repository — so the code alone shows an empty header and invites you to build a second one,
  which is the single most common defect in this area. This skill tells you how to read the
  real state, which of three different requests you are actually looking at, and what breaks
  if you build your own bar instead (two stacked headers; static generation silently lost).
---

# manage-top-menu

**The header ships with the project. You never build a second one.**

It lives in `components/menu/top/top-menu.server.tsx` and its buttons are assembled by the
OWNER in the control panel: which pages they point at, their order, which of them collapse
into a dropdown group, and their translations.

---

## 1. Read the real state first — one command

```bash
npm run read:menu
```

It prints whether the menu is switched on, where its buttons come from, what is in it right
now, in which languages, and where it is changed.

**You cannot learn any of this from the code.** The buttons live in
`APP-CONFIG/app-config.json` and the switch in `PLATFORM-CONFIG/platform-config.json` — both
on the server, both outside git. Read the repository alone and you see a header with no
items, draw the only conclusion available to you ("there is no menu, I must write one"), and
ship a second bar. Run the command before writing anything.

It works with no server and no config files: nothing there means the owner has not configured
it yet, and it says so.

---

## 2. Decide which of three requests this is

"Add a top menu" is three different tasks wearing one sentence. Name which one you are in
before touching a file.

| The owner wants | What it is | What you do |
| :--- | :--- | :--- |
| Different pages, order, grouping or labels | **A setting** | Say so in one sentence and point at the panel → **Top menu**. Write no code. |
| A different look: colours, height, typography, logo treatment, spacing | **Your work** | Restyle the existing component. Do not fork it. |
| Something structural the panel cannot express: a mega-menu, a search field in the bar, a promo strip | **A real change** | Extend the existing header. Still one header. |

If the answer is "a setting", resist the pull to be helpful by writing code. Code that
duplicates a setting takes control away from the owner: the panel cannot edit what you wrote,
so his changes will silently do nothing.

---

## 3. What breaks if you build your own bar

Both failures look like nothing until a human opens the page.

**Two stacked bars.** You add a header; the platform one is already on, or the owner switches
it on later. The page now carries two navigation strips. Yours answers to nobody — it is not
in the config, so the panel cannot touch it, and the owner's edits appear to do nothing.

**Static generation quietly lost.** A hand-rolled menu reaches for the current path to
highlight the active link. That pulls in a client component owning the route, and the page
stops being prerendered — which is the one thing this project's canon forbids. The platform
header avoids the trap deliberately: everything resolves on the server and finished strings
are handed to small islands as props. Rebuild it yourself and you will rediscover the trap
from the inside, on production.

Run the guard after touching the shell:

```bash
npm run check:menu
```

It fails on a second header that sticks to the top of the window and carries links. It is
deliberately narrow — page headings are legitimate and it ignores them.

---

## 4. Facts you will need

- **Labels are capped at 12 characters.** Longer ones are cut with an ellipsis when rendered.
  This is enforced in `lib/menu/nav-config.ts`, not only in the panel's input, because a label
  can arrive from a translation or from a hand-edited config. One long item wrecks the bar on
  a phone.
- **The account button and the cart are ALWAYS on the right.** The panel's side setting
  governs one thing only: which side the account drawer slides in from.
- **Nesting is exactly one level.** A button may become a dropdown group of buttons; there is
  no third level, and it would not fit a phone.
- **Menu on, zero buttons is a valid state** — the bar renders with the logo and nothing else.
  It is not a defect to fix.
- **Changes apply with no rebuild.** The app reads the config at render; the panel clears the
  layout's cache on save. Never suggest a redeploy to make a menu change appear.
- **Translations belong to the owner's language set** (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`), not
  to the panel's 82. The panel translates labels for him on request.

---

## 5. Restyling the existing header — the allowed path

Edit `components/menu/top/top-menu.server.tsx` and the islands beside it
(`desktop-nav.client.tsx`, `mobile-menu.client.tsx`, `menu-dropdown.client.tsx`).

Keep these intact or you will break what the owner controls:

- the source of items — `navGroupsFromConfig(lang)`, falling back to on-disk group manifests;
- server-side resolution: strings are resolved in the server component and passed down as
  props, never imported into a client file;
- the switch check `featureOn("topMenu")` — the owner can turn the whole bar off;
- the mobile collapse below 780px.

Its service words (the burger, the drawer aria-labels) live in `top-menu.i18n.ts` in all 82
languages, because the header is a REUSABLE part of the product: it must speak whichever
language the owner enables, the minute he enables it. Adding a word there means adding it in
82 languages — `npm run check:i18n` will hold you to it.

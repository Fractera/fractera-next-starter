---
name: manage-cookie-banner
description: >
  Work on the COOKIE BANNER — the consent strip at the bottom of the site, its wording, the
  "Cookie settings" button that re-opens it, and the cookie policy page it links to. Use when
  the owner says "add a cookie banner", "remove the cookie notice", "we don't need consent",
  "change the cookie text", "the banner won't go away", or when building anything that stores
  analytics. The banner already exists, ships in 82 languages, and is switched on and off in
  the control panel — never write a second one, and never delete it to "turn it off". Consent
  written in a language the visitor does not read is not a missing translation; it is consent
  that never happened, so the language rules here are stricter than elsewhere.
---

# manage-cookie-banner

The banner ships with the project. Three parts, and they are deliberately independent:

| Part | Where | What it is |
| :--- | :--- | :--- |
| The strip itself | `app/[lang]/_components/legal/cookie-banner.client.tsx` | Shown until the visitor decides; the choice lives in `localStorage` under `fractera-cookie-consent` |
| Its words | `app/[lang]/_components/legal/cookie-banner.i18n.ts` | 82 languages, co-located. The panel's settings are merged ON TOP, they do not replace them |
| The re-open button | `components/menu/footer/cookie-settings-button.client.tsx` | In the footer; fires the window event `open-cookie-settings` |
| The policy page | `app/[lang]/(cookie)/cookies/` | An ordinary static page, its own route group |

---

## 1. Turning it off — a setting, never a deletion

The switch is **Platform features → Cookie banner** in the control panel; the app reads it at
render through `featureOn("cookieBanner")` in `app/[lang]/layout.tsx`.

**Do not delete the component to disable the banner.** A private tool with no analytics has no
use for consent, and the owner switches it off in one click — but the next project built from
this starter needs it, and a deleted banner cannot come back with a toggle.

When the banner is off, the footer's **Cookie settings** button disappears with it: it exists
only to re-open the banner, and a button that opens nothing is worse than no button.

---

## 2. Re-opening it — the event, not shared state

The banner listens for a plain window event:

```ts
window.dispatchEvent(new Event("open-cookie-settings"))
```

That is the whole contract. The event knows nothing about who sent it, so the button carries
no provider, no context and no import of the banner — two independent islands joined by one
name. Anything that needs to re-open consent uses the same event.

**Why a re-open path must exist at all:** consent can be withdrawn, and after the first
decision the banner never appears again on its own. Without the button a visitor who once
pressed "Accept" has no way back to that decision — and withdrawing consent is supposed to be
as easy as giving it.

---

## 3. Wording — 82 languages, no exceptions

The shipped strings live in the co-located dictionary in **all 82 languages**, and
`npm run check:i18n` holds them to that count. This is stricter than the rule for ordinary page
copy, and for a reason: **consent written in a language the visitor cannot read is not consent
at all.** A page that ships English text into a Japanese market is untranslated; a consent
banner that does the same is legally void.

Every message must contain the `{policy}` marker — the banner splits the sentence on it to
place the policy link. A message without it renders the link nowhere.

The owner may override the wording per language in the panel; those values are merged over the
defaults, key by key. **Never make the panel the only source** — an empty setting would leave
the banner with no text, and it calls `.split()` on that text. This exact defect shipped once,
when the old legal engine was removed and took the default strings with it.

---

## 4. The policy page

`app/[lang]/(cookie)/cookies/` — its own route group, one page, addressed `/<lang>/cookies`.
It is a normal static content page: to change its text, edit the language cells in `_data/`,
the same way a blog post works. See the `manage-footer-pages` skill for the page shape.

It sits in its own group rather than with the other footer pages because its switch is not
"which links to show" but "does the banner exist" — one toggle, one page.

---

## 5. Facts

- The consent key is `fractera-cookie-consent` in `localStorage`, values `accepted` /
  `rejected`. Clearing it makes the banner appear again — that is the quickest way to test.
- On acceptance the banner calls Google Consent Mode v2 (`gtag('consent','update',…)`) when
  `gtag` is present. No analytics id, no call — nothing breaks.
- The banner renders **only when the switch is on**, and the footer button only when the
  banner does.

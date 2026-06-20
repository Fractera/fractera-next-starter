---
name: install-language-switcher-dropdown
description: >
  (Re)install the language switcher button — a dropdown that lists the site's
  configured languages and switches the URL prefix. Use when the starter's
  switcher was deleted, or when turning a single-language project multilingual
  and you need the button back. Self-sufficient: pure file edits, no Hermes, no MCP.
---

# install-language-switcher-dropdown

Put the language switcher button back on the site. It is a small button that opens
a searchable dropdown of the languages the project is configured for, and switches
the active language by rewriting the URL prefix (`/en/… ↔ /es/…`). It renders
**nothing** when only one language is configured, so it is safe to ship always.

This skill is **self-sufficient**: it is plain file editing. It does NOT depend on
Hermes, memory, or any other agent. The full multilingual standard is
`CRUD-DOCS/workspace-standards/multilingual-content.md`.

## When to use

- The starter shipped the button, you deleted it while building your product, and
  now you want it back.
- You turned a single-language project into a multilingual one (added a second
  language to `NEXT_PUBLIC_SUPPORTED_LANGUAGES`) and want the switcher visible.
- You want the switcher mounted on a page/header that does not have it yet.

## Prerequisites (the routing must already exist)

The switcher only makes sense once the language routing is in place:
`config/translations/translations.config.ts` (env-driven `NEXT_PUBLIC_SUPPORTED_LANGUAGES`
+ `NEXT_PUBLIC_DEFAULT_LOCALE`), `config/translations/language-metadata.ts`, the
`proxy.ts` language router, and the `app/[lang]/…` content layer. The starter ships
all of these. If they are missing, set up the multilingual routing first (see the
standard above) — this skill only (re)mounts the button.

## The component (the saved template)

The button is the client component `components/language-switcher.client.tsx`. The
starter ships it; if it was deleted, recreate it from the version below (it reads
the configured languages, groups them by region with flags, and renders `null` in
single-language mode). Key contract — do not change these:

- `export function LanguageSwitcher()` — returns `null` when `SINGLE_LANG_MODE`.
- imports `getAvailableLanguages`, `DEFAULT_LANGUAGE`, `SINGLE_LANG_MODE` from
  `@/config/translations/translations.config` and `LANGUAGE_REGIONS` + types from
  `@/config/translations/language-metadata`.
- switches language with `router.replace('/<code>' + restOfPath)`, stripping the
  current language segment first.
- uses theme tokens (`border`, `foreground`, `muted`, `primary`, `background`) so
  it works in light and dark.

If the file is missing, regenerate it from the canonical copy that ships with the
starter (this same path) — its body is the template. Keep the contract above intact.

## Mount it (the usual place: the page/Shell header)

Import and render the button where it should appear (top bar / header of a content
page under `app/[lang]/…`). Example — mounting it top-right on a page:

```tsx
import { LanguageSwitcher } from "@/components/language-switcher.client";

// inside the page/header JSX, in a positioned container:
<div className="absolute top-4 right-4 z-20">
  <LanguageSwitcher />
</div>
```

The starter mounts it on the home (`app/[lang]/_components/shell-home.client.tsx`).
Mount it on whatever header/layout you want it visible on. Because it returns `null`
in single-language mode, you can mount it unconditionally.

## Confirm before editing (mandatory)

Before adding files or mounting, restate to the architect exactly what you will do:
which file you recreate (if missing) and where you mount the button. Edit only after
explicit confirmation. Never silently scaffold UI.

## After installing

Report to the architect:
> Mounted the language switcher in <file>. It shows the configured languages
> (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`) and hides itself when only one is set. To make
> it visible, ensure two or more languages are configured (env change needs a rebuild).

# app/ — where you build, and what you must not touch

Read this before creating a single file under `app/`. It describes the folder as it actually is; the
rules of the work itself live in `CLAUDE.md` at the root.

## ✅ Your workspace: `app/[lang]/`

Everything a visitor sees lives under the language segment, and that is where you build:

```
app/[lang]/
  page.tsx            ← the home page
  layout.tsx          ← the shell every page inherits
  _components/        ← components for these pages
  legal/              ← the legal pages (see below)
  error.tsx           ← the boundary that keeps a crash local
  not-found.tsx
```

**Every user-facing route carries the `[lang]` prefix.** A page created outside it exists in one
language only and drops out of the language switcher, the sitemap and the SEO metadata — three things
nobody notices until the site is live.

The set of languages is NOT yours to choose: it comes from `NEXT_PUBLIC_SUPPORTED_LANGUAGES`, and it is
the owner's decision, made in the control panel. Authoring a language outside that set produces files
that ship and are never served.

## ⛔ Never create `app/page.tsx`

The root has no unlocalised page on purpose. Creating one gives you a route with no language, outside
the `[lang]` boundary — and it silently wins over the localised home page, so the site loses its
language handling without any error appearing anywhere.

If you need a home page, it is `app/[lang]/page.tsx`.

## ⚠️ `app/(service)/` — the owner's own surface

Dashboard and service screens for the person who runs the project, not for visitors. Deliberately
outside `[lang]`. Change it only when the task is explicitly about it.

## ⚠️ `app/api/` — thin routes only

Routes here take a request, call something in `lib/` or `services/`, and answer. Logic that grows past
a few lines belongs in a module those routes import — a route handler is the worst place in the project
to keep business rules, because nothing else can reuse it and nothing can test it.

`api/health` is contractual: the deploy pipeline polls it and rolls the app back to the previous build
if it stops answering. Do not change its shape or its path.

## ⚠️ `app/[lang]/legal/` and `app/api/legal/`

The legal pages read their text from configuration at runtime, not from the code. Editing the wording
here changes nothing on the live site — the file that is actually served sits outside the repository.

## Stack

Next.js 16.2 App Router (Turbopack), React 19, Tailwind v4, shadcn/ui, SQLite through `lib/db`.
Server Components by default; `"use client"` only where an interaction genuinely needs it.

Middleware lives in **`proxy.ts`** at the root — never `middleware.ts`. This is a deliberate convention
of this project, not an oversight to correct; see `ANTI-PATTERNS.md`.

## Where the rest is written

- `CLAUDE.md` — how you work: what to read at session entry, the pipeline, what closing a step requires.
- `CODING-STANDARDS.md` — the limits code must respect.
- `ARCHITECTURE.md` — how this particular application is arranged, as it grows.
- `ANTI-PATTERNS.md` — approaches that already cost time here.

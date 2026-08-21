# DESIGN.md — how the pages should look

**Given, not evolving.** You write this; the agent obeys it.

Describe the look once and every page inherits it. Without this file the agent invents an appearance
per page, and you review visual decisions after they are built instead of before.

> **This file was empty until 2026-08-15, and the prediction above came true.** With nothing to obey,
> the agent invented a second heading style for "work screens": `/ru/blocks` and `/ru/manage/products`
> — both private, both work pages — ended up twice apart in size and set in different families. The
> rules below are the correction, written down so the invention cannot repeat.

---

## The one law

**Nothing about a page's LOOK depends on who may open it.** Public or private, indexed or gated,
storefront or admin table — the heading, the scale, the spacing and the colours are the same. Access
decides what a person may see, never how it is set.

There is exactly one visual exception, named below, and it is about position on the site, not about
permissions.

## Type

The whole scale lives in `components/ui/typography.tsx` and nowhere else. A hand-written heading fails
`npm run check:typography`.

| | Size | Family |
|---|---|---|
| `H1` — page heading, one for the whole site | 30 → 36 → 48 px | serif |
| `H1 scale="hero"` — **the only exception**: the home page's first screen, +30% | 39 → 47 → 62 px | serif |
| `H2` | 24 → 30 px (`ui`: 18 → 20) | serif (`ui`: sans) |
| `H3` / `H4` | 18 → 20 / 16 → 18 px | sans |
| `P` | 16 → 17 px | sans |
| `Lead` · `Small` · `Eyebrow` | 18 → 20 / 14 / 12 px | sans |

**A size never shrinks as the screen grows.** On a monitor there is more room, not less. The same law
applies to padding.

**Glow (`.h1-glow`) belongs to the home page's first screen only.** It is a mark of the front door; on
a document page it competes with the text.

## Spacing and density

Airy on content, compact on work screens — and this is the ONLY place where the two differ.

| | Page padding |
|---|---|
| Content pages (home, posts, footer pages, block gallery) | `py-16` |
| Work screens (product panels, catalogue tables) | `py-10` |

Width: one measure for the whole site — `max-w-7xl` (1280px), held by `--app-w`. The first screen has
its own limit `--hero-w`; the closing marquee has none by design.

## Alignment

Left, always — except four cases that earn the centre by role: an image caption, the founder quote,
the mark-and-label of the first screen, and the heading of a full-width closing section.

## The page header, empty states, captions

Three more things that are primitives, not decisions a page gets to make:

- **`PageHeader`** — the whole top of a page, in a fixed order: breadcrumbs → eyebrow (or tags) → H1
  → subtitle → meta line. Any part may be omitted; none may be reordered. Before it existed there
  were five different assemblies across eight pages, the subtitle came in four sizes, and the
  divider appeared on two pages out of five.
- **`EmptyState`** — "there is nothing here yet". One box, one height, one radius. It was drawn in
  five places with three heights (`py-8` / `py-12` / `py-24`), two radii and three text sizes.
- **`Small`** — footnotes and captions under a block. One size, 14px.

**Text inside a control is not a caption.** Pager digits, chips, badges and table cells are dense on
purpose and stay as they are — forcing them to 14px would break the controls, not unify them. The
line is: standalone prose under a block is `Small`; text inside a control belongs to that control.

## Components you insist on

Interactive UI is shadcn/ui only, icons are `lucide-react` only, toasts are Sonner. Text is
`components/ui/typography.tsx`. A hand-rolled button, dropdown or heading is a defect, not a variation.

## For the agent

Read this before building any user-facing surface. If the request contradicts this file, say so in one
sentence before writing code: either the request is an exception worth recording here, or the document
is out of date. Do not silently pick one.

**And never derive a visual rule from a folder name.** `(protectedLayer)` says who may enter. It has
never said anything about how the page looks, and reading that into it is exactly the mistake this
file now exists to prevent.


## Движение — только в островке, поверх статического близнеца

Анимация в этом проекте ограничена не вкусом, а поиском: страница, которую двигают целиком, уезжает в
динамику и отдаёт краулеру разметку с `opacity: 0`. Поэтому:

- анимация живёт ВНУТРИ виджета-островка и включается после первого нажатия;
- под ней всегда лежит статический близнец — то, что видит человек без JavaScript и краулер;
- разметка у близнеца и у движения общая, подмена 1:1 на любой ширине, без прыжка;
- `prefers-reduced-motion` выключает движение, не выключая содержимое;
- цвет движущегося элемента — токены темы, иначе палитра владельца его не перекрасит.

Образец — `app/[lang]/(publicLayer)/_widgets/static/security-orbit/`; полный разбор — навык
`use-widgets`.

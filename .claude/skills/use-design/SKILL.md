---
name: use-design
description: >
  Where design comes from, and WHICH KIND of site you are building. Load it before proposing how a
  page will look, when the owner says "my own design" or "like nothing else", when he points at a
  site he likes, and whenever design arrives from outside as real source code — a design skill, an
  MCP service, extracted tokens. The decision it exists for: a FUNCTIONAL site is assembled from the
  block catalogue, an AUTHORED one is built whole by external design skills, and offering standard
  blocks to somebody escaping the templated look is the wrong product rather than caution. Also
  covers what the owner changes himself in the panel and what he actually sees when he does.
---

# use-design

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

## 🔒 First decide WHICH KIND OF SITE this is — the answer changes everything below

A modern site is one of two things, and the project serves both. Read the owner's intent before
reaching for anything:

| | **Functional** — a shop, a panel, a service, documentation | **Authored** — a portfolio, a studio, a personal brand |
|---|---|---|
| What wins | consistency: the same table, the same card, everywhere | a look nobody else has |
| Build it from | **the block catalogue** — this is what it is for | **external design skills, MCP services, extracted design** (`use-widgets` ring) |
| Standard sections | the right answer | **do not offer them** — they are exactly the templated feel he is escaping |

**The catalogue of sections is a STARTING EXAMPLE, not a boundary.** It exists so a fresh project is
not naked on day one, and it is genuinely good for functional surfaces. It has never been a rule that
pages must be assembled from it.

🔒 **The owner signals a personal style — stop proposing blocks.** "I want my own design", "make it
like nothing else", "here is the site I like", a reference to a designer or a look: from that moment
the page is built whole, through the design skills and services available to him — including
`extract-design-system` for the primitives of a page he points at. Offering him a page assembled from
standard cards after that is not caution, it is the wrong product.

**Exceptions that stay standard even then**, because there structure IS the value: the blog and
articles (a reader wants to read, not to be impressed), legal and footer pages, everything behind a
role. Say this out loud rather than assuming he meant "everything".

**Where it is written down:** the owner's choice lives in his project's settings, not in your memory
of this conversation. If he has stated a personal style, that fact belongs where the next session
finds it — the step summary in `completed-steps/`, and the product dossier when there is one.

## The default is one brand, and that is the product, not a limitation

For the functional case the project is standardised into a single visual identity on purpose.
Headings, lists, tables, cards and callouts are taken ready-made and look the same everywhere; nobody
re-styles anything, and the design cannot drift page by page. The exceptions below are exceptions,
not an escape hatch to reach for whenever a page feels plain.

## Design now arrives from outside, and it arrives as CODE

Modern models produce genuinely beautiful design. It reaches this project through design skills and
MCP servers — some of them paid — and the good ones do not return advice. They return **real source
code** for a block or a section, sometimes derived from an example the owner pointed at.

🔒 **By default that code does NOT become ours.** It becomes a **widget** — the ring where writing by
external design skills and third-party libraries is allowed (the ring table lives in the widgets
step). Letting foreign markup into the platform's own catalogue would end the single brand: the
catalogue is closed by construction, every kind is the platform's responsibility forever, and a
kind that entered by accident is maintained by everyone thereafter.

🔒 **But the owner may promote it, and that must not be forbidden.** If he wants a particular widget
to become the project's design standard, that is a legitimate decision — his project, his identity.
Promotion is a deliberate act named in a step, and its price is stated plainly rather than
discovered later: from that moment the thing belongs to the platform. It needs its renderer, its
specimen, its translations, its gates, and its mirror on the other side.

**The direction that is always wrong is the silent one** — foreign code sliding into `sections/` or
`components/` because it happened to be pasted there. Nobody decided, and nobody knows it is foreign.

## Что владелец меняет сам, и что он при этом увидит

`DESIGN-CONFIG` — цвета по ролям (`primary`, `accent`, `background`, `foreground`, `muted`, `border`,
`destructive`), шрифты, шкала текста, скругления и плотность. Правит он это **конструктором в
панели**, а не файлом, и применяется без пересборки.

**Что происходит физически.** Значение уходит в CSS-переменную, а все примитивы и секции знают только
свою РОЛЬ. Поменял `primary` с жёлтого на тёмно-зелёный — и разом позеленели: кнопки, ссылки в тексте,
активный пункт меню, цифры в `metrics`, рамка выделенной карточки, полоса прогресса, фокус на поле
ввода. Ничего перечислять и искать не надо: они не хранят цвет, они спрашивают роль.

🔒 **`light` и `dark` — РАЗНЫЕ значения одной роли.** Цвет, заданный один раз, на второй теме почти
всегда неверен: тёмный текст на тёмном фоне исчезает целиком. Это первое, что стоит проверить после
любой правки палитры — переключателем темы, а не воображением.

**Пусто — это ответ, а не пробел.** Незаполненная роль означает «владелец не высказался», и работает
тема проекта (`config/design/design-minimal-001.css`). Копировать значения темы в конфиг нельзя: две
палитры разойдутся на первой правке, причём молча — страница выглядит нормально, просто больше не
совпадает с CSS.

**Чего он НЕ увидит от смены палитры:** картинки, скриншоты, логотип, чужой блок с вписанным цветом.
Первые три — данные, последнее — дефект (см. правило токенов в `use-primitives`).

## The owner points at somebody else's site — what you may take from it

He will. During the case interview, "make it like X" is how people describe taste, and it is a
legitimate brief. You have a real instrument for it, installed in this project:

**`extract-design-system`** (`npx extract-design-system <url>`) drives a headless browser over a
public page and writes `design-system/tokens.json` and `tokens.css` — the colour palette, type
scale, spacing, radii, shadows. Not components, not layout: **primitives**.

That output maps onto this project exactly, and that is why it is worth using: our own
`DESIGN-CONFIG` holds colours by role, fonts, the type scale and shape. Extracted numbers become a
PROPOSAL for those fields, the owner approves them in the panel, and from that moment they are his
tokens — no foreign file is left behind anywhere.

🔒 **Take the SYSTEM, never the identity.** The line is not subtle and it is not ours to blur:

| Take | Never take |
|---|---|
| the palette as numbers, the type scale, spacing rhythm, radii, shadow depth | the logo, the wordmark, the icon set |
| the structural idea — what sits above what, how dense the page is | photographs, illustrations, video |
| the interaction pattern — what expands, what follows the cursor | the copy: headlines, slogans, product names |
| — | a typeface bought under a licence that is theirs, not his |

A palette and a spacing scale are craft, and craft travels. A wordmark and a photograph are somebody's
property, and a customer's site carrying them is a problem the customer inherits — from us.

🔒 **The tool itself carries no such warning**, so this paragraph is the warning. It also says openly
that a single page is not proof of a design system and that a dynamic site yields a partial answer —
believe it: treat the output as a first draft to show the owner, never as a finished palette.

**Where the extracted result may land:** in `DESIGN-CONFIG`, through the owner's approval. Not in
`sections/`, not in `components/` — a token file is not permission to import foreign markup, and the
rules above about widgets and promotion apply unchanged.

## 🔒 The tension nobody should discover the hard way

An external service returns compiled-shaped code: a React file with its own markup and styles. But a
widget, by the owner's own rule, arrives **without a build** — like content. Compiled code cannot.

So the artifact has to land in one of three places, and choosing is the work:

- **Expressible in the widget vocabulary** → it becomes a widget, arrives as a description, no build.
  This is the default and the cheapest.
- **Genuinely a reusable capability** → it is a **tool**: it goes through the build, gets a home in
  `_tools/`, a registry entry and a mirror. See `use-tools`.
- **Becomes the project's identity** → the promotion above: a section, with everything that entails.

Answering "which of the three" before writing anything is what this skill exists for. Getting it
wrong is not a style question: a wow element pasted as a section quietly makes the brand
un-maintainable, and a capability buried in one route is a tool nobody will ever find again.

## What still has to be written here

The vocabulary question is open and belongs to the widgets step: how rich the widget description
must be for the owner to feel no ceiling, and where the honest boundary runs beyond which the answer
is "this needs a build". Do not invent that boundary in passing — it is a decision, not a detail.

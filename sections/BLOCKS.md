# Каталог видов секций

> **Файл порождается.** `npm run build:blocks-map`; свежесть стережёт `check:blocks-map` в
> `prebuild`. Правки руками теряются при первом же порождении — правьте типы и карточки.

Сводка нужна в момент ВЫБОРА вида: она отвечает, что вообще есть, и не заставляет открывать
двадцать девять рендереров. Но она не заменяет карточку: **каталог говорит, что вид СУЩЕСТВУЕТ,
и только карточка говорит, что он выдержит** — сколько элементов, что ломается за пределом, когда
его не брать. Есть карточка — прочти её перед использованием.

Видов: **32** · рендереров: **32** · карточек: **14**

| Вид | Семейство | Что это | Поля | Правила владельца |
|---|---|---|---|---|
| `p` | Page material | — | text: string | — |
| `h2` | Page material | — | text: string | — |
| `h3` | Page material | — | text: string | — |
| `quote` | Page material | — | text: string; cite?: string; lead?: string | — |
| `list` | Page material | — | items: string[] | — |
| `olist` | Page material | — | items: string[] | — |
| `figure` | Page material | — | media: 'image' \| 'video'; src: string; alt: string; caption?: string; href?: string | — |
| `code` | Page material | — | text: string | — |
| `note` | Page material | — | text: string | — |
| `cta` | Page material | — | text?: string; href: string; label: string | — |
| `callout` | Page material | — | title: string; text: string | — |
| `table` | Page material | — | headers: string[]; rows: string[][]; caption?: string | — |
| `docref` | Page material | — | title: string; summary: string; href: string; label?: string; kicker?: string | — |
| `founder` | Testimonials and social proof | the owner's quote, signed from settings | text: string | [карточка](blocks/founder.md) |
| `columns` | Page material | — | children: Block[]; cols?: 2 \| 3 | — |
| `group` | Page material | — | children: Block[] | — |
| `hero` | Hero | the mark and the eyebrow above the title | pill?: string | [карточка](blocks/hero.md) |
| `heroSplit` | Hero | the landing first screen: words left, picture right | — | [карточка](blocks/heroSplit.md) |
| `badges` | Benefits and value | a row of capability labels | items: BadgeItem[] | [карточка](blocks/badges.md) |
| `panel` | Page material | — | tone?: 'plain' \| 'warn' \| 'accent'; eyebrow?: string; title: string; children: Block[] | — |
| `metrics` | Trust and logos | the numbers that prove it | items: { value: string; label: string }[] | [карточка](blocks/metrics.md) |
| `flow` | How it works | how it works, step by step | badge?: string; title: string; note?: string; steps: { title: string; text: string }[] | [карточка](blocks/flow.md) |
| `problemSolution` | Comparison | cases on the left, the chosen one broken down on the right | — | [карточка](blocks/problemSolution.md) |
| `cards` | Benefits and value | a section made of cards | badge?: string; title: string; note?: string; cols?: 2 \| 3; children: Block[] | [карточка](blocks/cards.md) |
| `card` | Page material | — | tone?: Tone; children: Block[] | — |
| `statement` | Page material | — | text: string | — |
| `noBill` | Pricing and plans | the invoices that will not come | — | [карточка](blocks/noBill.md) |
| `faq` | Page material | questions and answers, last on the page | title?: string; items: FaqPair[] | [карточка](blocks/faq.md) |
| `toc` | Page material | the table of contents of a page | items: { id: string; text: string }[] | [карточка](blocks/toc.md) |
| `languageMarquee` | Trust and logos | the language ribbon, closing the page | title: string; note?: string | [карточка](blocks/languageMarquee.md) |
| `projectTypeMarquee` | Trust and logos | the ribbon of directions | title?: string; note?: string | [карточка](blocks/projectTypeMarquee.md) |
| `voiceField` | Page material | a text field that can be dictated | variant?: 'line' \| 'area'; title: string; hint?: string; comment?: string; placeholder?: string | [карточка](blocks/voiceField.md) |

## Чего в этой таблице нет

**Вместимости.** Сколько карточек влезает в `cards`, сколько чисел в `metrics`, что происходит с
неполным рядом — этого из типа не видно, потому что тип принимает массив любой длины, а сетка
рассчитана на кратность. Это живёт в карточке вида, и там же живут правила владельца, сказанные
по конкретному поводу.

**Карточка рождается, когда о виде что-то узнали** — обычно когда владелец поправил внешность и
объяснил почему. Пустая карточка, написанная ради полноты таблицы, не учит никого.

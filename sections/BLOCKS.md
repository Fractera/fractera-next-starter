# Каталог видов секций

> **Файл порождается.** `npm run build:blocks-map`; свежесть стережёт `check:blocks-map` в
> `prebuild`. Правки руками теряются при первом же порождении — правьте типы и карточки.

Сводка нужна в момент ВЫБОРА вида: она отвечает, что вообще есть, и не заставляет открывать
двадцать девять рендереров. Но она не заменяет карточку: **каталог говорит, что вид СУЩЕСТВУЕТ,
и только карточка говорит, что он выдержит** — сколько элементов, что ломается за пределом, когда
его не брать. Есть карточка — прочти её перед использованием.

Видов: **29** · рендереров: **29** · карточек: **2**

| Вид | Семейство | Что это | Поля | Правила владельца |
|---|---|---|---|---|
| `p` | — | — | text: string | — |
| `h2` | — | — | text: string | — |
| `h3` | — | — | text: string | — |
| `quote` | — | — | text: string; cite?: string; lead?: string | — |
| `list` | — | — | items: string[] | — |
| `olist` | — | — | items: string[] | — |
| `figure` | — | — | media: 'image' \| 'video'; src: string; alt: string; caption?: string; href?: string | — |
| `code` | — | — | text: string | — |
| `note` | — | — | text: string | — |
| `cta` | — | — | text?: string; href: string; label: string | — |
| `callout` | — | — | title: string; text: string | — |
| `table` | — | — | headers: string[]; rows: string[][]; caption?: string | — |
| `docref` | — | — | title: string; summary: string; href: string; label?: string; kicker?: string | — |
| `founder` | — | — | text: string | — |
| `columns` | — | — | children: Block[]; cols?: 2 \| 3 | — |
| `group` | — | — | children: Block[] | — |
| `hero` | — | — | pill?: string | — |
| `heroSplit` | — | — | — | — |
| `badges` | — | — | items: BadgeItem[] | — |
| `panel` | — | — | tone?: 'plain' \| 'warn' \| 'accent'; eyebrow?: string; title: string; children: Block[] | — |
| `metrics` | доказательство (`proof`) | цифры, которые доказывают | items: { value: string; label: string }[] | [карточка](blocks/metrics.md) |
| `flow` | — | — | badge?: string; title: string; note?: string; steps: { title: string; text: string }[] | — |
| `problemSolution` | — | — | — | — |
| `cards` | разбор (`breakdown`) | раздел карточками | badge?: string; title: string; note?: string; cols?: 2 \| 3; children: Block[] | [карточка](blocks/cards.md) |
| `card` | — | — | tone?: Tone; children: Block[] | — |
| `statement` | — | — | text: string | — |
| `noBill` | — | — | — | — |
| `languageMarquee` | — | — | title: string; note?: string | — |
| `projectTypeMarquee` | — | — | title?: string; note?: string | — |

## Чего в этой таблице нет

**Вместимости.** Сколько карточек влезает в `cards`, сколько чисел в `metrics`, что происходит с
неполным рядом — этого из типа не видно, потому что тип принимает массив любой длины, а сетка
рассчитана на кратность. Это живёт в карточке вида, и там же живут правила владельца, сказанные
по конкретному поводу.

**Карточка рождается, когда о виде что-то узнали** — обычно когда владелец поправил внешность и
объяснил почему. Пустая карточка, написанная ради полноты таблицы, не учит никого.

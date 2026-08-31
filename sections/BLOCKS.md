# Каталог видов секций

> **Файл порождается.** `npm run build:blocks-map`; свежесть стережёт `check:blocks-map` в
> `prebuild`. Правки руками теряются при первом же порождении — правьте типы и карточки.

**КОД — ТО, ЧЕМ ВЛАДЕЛЕЦ НАЗЫВАЕТ БЛОК.** Он видит его на витрине блоков и говорит: «собери секцию
из `quote01` и `workspace02`». Найди строку по коду и возьми поля образца из неё — этого хватает,
чтобы собрать секцию, не открывая ни одного рендерера.

🔒 **Код указывает на ОБРАЗЕЦ, а не на вид, и разница существенна.** У одного вида образцов бывает
несколько: `workspace01` — рабочий экран без верхнего ряда разделов, `workspace02` — он же с рядом.
Вид один, настройки разные, и номер различает именно настройку. Сами образцы лежат в
`app/[lang]/(protectedLayer)/(admin)/blocks/_data/specimen.ts` — открывать их нужно только тогда,
когда полей из этой таблицы не хватило.

🔒 **Не путать с числовым `id`** (`0015`) из `SECTIONS.json`: это внутренний ключ панели, и языком
общения он не является. Решение владельца 2026-08-30.

Сводка нужна в момент ВЫБОРА вида: она отвечает, что вообще есть, и не заставляет открывать
двадцать девять рендереров. Но она не заменяет карточку: **каталог говорит, что вид СУЩЕСТВУЕТ,
и только карточка говорит, что он выдержит** — сколько элементов, что ломается за пределом, когда
его не брать. Есть карточка — прочти её перед использованием.

Видов: **55** · рендереров: **55** · карточек: **33**

| Код | Вид | Семейство | Что это | Поля | Правила владельца |
|---|---|---|---|---|---|
| `p01` | `p` | Page material | — | text: string | — |
| `h201` | `h2` | Page material | — | text: string | — |
| `h301` | `h3` | Page material | — | text: string | — |
| `h401` | `h4` | Page material | — | text: string | — |
| `h501` | `h5` | Page material | — | text: string | — |
| `quote01` | `quote` | Page material | — | text: string; cite?: string; lead?: string | — |
| `list01` | `list` | Page material | — | items: string[] | — |
| `olist01` | `olist` | Page material | — | items: string[] | — |
| `figure01` | `figure` | Page material | картинка или видео с подписью | media: 'image' \| 'video'; src: string; alt: string; caption?: string; href?: string | [карточка](blocks/figure.md) |
| `code01` | `code` | Page material | — | text: string | — |
| `note01` | `note` | Page material | — | text: string | — |
| `cta01` | `cta` | Page material | призыв к действию | text?: string; href: string; label: string | [карточка](blocks/cta.md) |
| `callout01` | `callout` | Page material | — | title: string; text: string | — |
| `table01` | `table` | Page material | — | headers: string[]; rows: string[][]; caption?: string | — |
| `docref01` | `docref` | Page material | — | title: string; summary: string; href: string; label?: string; kicker?: string | — |
| `founder01` | `founder` | Testimonials and social proof | the owner's quote, signed from settings | text: string | [карточка](blocks/founder.md) |
| `columns01` | `columns` | Page material | — | children: Block[]; cols?: 2 \| 3 | — |
| `group01` | `group` | Page material | — | children: Block[] | — |
| `heroBadge01` | `heroBadge` | Hero | the mark and the eyebrow above the title | pill?: string | [карточка](blocks/heroBadge.md) |
| `heroSplit01` | `heroSplit` | Hero | the landing first screen: words left, picture right | title: string; description: string; pill?: string; image: 'homePage'; imageAlt: string; mark?: boolean; cta?: { href: string; label: string } | [карточка](blocks/heroSplit.md) |
| `badges01` | `badges` | Benefits and value | a row of capability labels | items: BadgeItem[] | [карточка](blocks/badges.md) |
| `panel01` | `panel` | Page material | — | tone?: 'plain' \| 'warn' \| 'accent'; eyebrow?: string; title: string; children: Block[] | — |
| `metrics01` | `metrics` | Trust and logos | the numbers that prove it | items: { value: string; label: string }[] | [карточка](blocks/metrics.md) |
| `flow01` | `flow` | How it works | how it works, step by step | badge?: string; title: string; note?: string; steps: { title: string; text: string }[] | [карточка](blocks/flow.md) |
| `problemSolution01` | `problemSolution` | Comparison | cases on the left, the chosen one broken down on the right | badge?: string; title: string; note?: string; demandLabel: string; answerLabel: string; items: { title: string; demand: string; answer: string }[] }; \| { kind: 'flow'; badge?: string; title: string; note?: string; steps: { title: string; text: string }[] }; \| { kind: 'statement'; text: string }; \| { kind: 'invite'; href: string; label: string }; \| {; title?: string; note?: string; cols?: 2 \| 3; items: { title: string; text: string; href?: string; linkLabel?: string }[] | [карточка](blocks/problemSolution.md) |
| `cards01` | `cards` | Benefits and value | a section made of cards | badge?: string; title: string; note?: string; cols?: 2 \| 3; children: Block[] | [карточка](blocks/cards.md) |
| `card01` | `card` | Page material | — | tone?: Tone; children: Block[] | — |
| `statement01` | `statement` | Page material | крупное утверждение в разрядку | text: string | [карточка](blocks/statement.md) |
| `invite01` | `invite` | Page material | приглашение в пунктирной рамке | href: string; label: string | [карточка](blocks/invite.md) |
| `noBill01` | `noBill` | Pricing and plans | the invoices that will not come | badge?: string; heading: string; note?: string; items: { vendor: string; text: string; badge: BadgeItem }[]; title: string; text: string; cta?: { page: 'architecture' } | [карточка](blocks/noBill.md) |
| `faq01` | `faq` | Page material | questions and answers, last on the page | title?: string; items: FaqPair[] | [карточка](blocks/faq.md) |
| `toc01` | `toc` | Page material | the table of contents of a page | items: TocItem[] | [карточка](blocks/toc.md) |
| `languageMarquee01` | `languageMarquee` | Trust and logos | the language ribbon, closing the page | title: string; note?: string | [карточка](blocks/languageMarquee.md) |
| `projectTypeMarquee01` | `projectTypeMarquee` | Trust and logos | the ribbon of directions | title?: string; note?: string | [карточка](blocks/projectTypeMarquee.md) |
| `voiceField01` | `voiceField` | Page material | a text field that can be dictated | variant?: 'line' \| 'area'; title: string; hint?: string; comment?: string; placeholder?: string | [карточка](blocks/voiceField.md) |
| `workspace01` `workspace02` | `workspace` | Workspace | рабочий экран | menuTitle?: string; menu: WorkspaceItem[]; title: string; lead?: string; notes?: WorkspaceNote[]; tabs?: WorkspaceItem[]; children: Block[] | [карточка](blocks/workspace.md) |
| `benefitCards01` | `benefitCards` | Benefits and value | карточки возможностей со ссылкой | title?: string; note?: string; cols?: 2 \| 3; items: { title: string; text: string; href?: string; linkLabel?: string }[] | [карточка](blocks/benefitCards.md) |
| `splitPair01` | `splitPair` | Product in action | — | title?: string; note?: string; left: { image?: string; alt?: string; title: string; text: string }; right: { image?: string; alt?: string; title: string; text: string } | — |
| `logoCards01` | `logoCards` | Cases and portfolio | — | title?: string; note?: string; items: { title: string; text: string; source?: string }[] | — |
| `carousel01` | `carousel` | How it works | — | title?: string; note?: string; slides: { image?: string; alt?: string; title: string; text?: string }[] | — |
| `support01` | `support` | Pricing and plans | поддержка проекта: ряд тарифов со звёздочками | badge?: string; title: string; body?: string[]; tiers: {; amount: string; period?: string; sublabel: string; badge?: string; perks: string[]; cta?: { href: string; label: string }; }[]; note?: string; link?: { label: string; text: string; href: string } | [карточка](blocks/support.md) |
| `showcaseCarousel01` | `showcaseCarousel` | Use cases | — | badge?: string; title?: string; note?: string; slides: {; image?: string; label: string; sublabel: string; title: string; description: string; }[] | — |
| `featureGrid01` | `featureGrid` | Benefits and value | — | badge?: string; title?: string; note?: string; items: { icon?: FeatureIcon; title: string; label?: string; tone?: Tone; text: string }[] | — |
| `promoBand01` | `promoBand` | Trust and logos | полоса с текстом слева и картинкой справа | title: string; text: string; cta?: { href: string; label: string; icon?: 'github' \| 'link' }; image?: string; alt?: string | [карточка](blocks/promoBand.md) |
| `priceTable01` | `priceTable` | Pricing and plans | тарифы с переключателем периода | title: string; note?: string; periodLabels?: { monthly: string; yearly: string }; plans: {; name: string; monthlyPrice: string; yearlyPrice?: string; monthlyPeriod?: string; yearlyPeriod?: string; features: string[]; cta?: { href: string; label: string }; highlighted?: boolean; }[] | [карточка](blocks/priceTable.md) |
| `spotlightPair01` | `spotlightPair` | Comparison | пара, между которой ходит подсветка | badge?: string; title?: string; note?: string; left: SpotlightHalf; right: SpotlightHalf | [карточка](blocks/spotlightPair.md) |
| `platformGrid01` | `platformGrid` | Benefits and value | сетка площадок, светящаяся из щелей | badge?: string; title: string; note?: string; cards: { title: string; subtitle: string; company?: string }[]; disclaimer?: string | [карточка](blocks/platformGrid.md) |
| `chartArea01` | `chartArea` | Charts | область: как менялось целое и из чего оно состояло | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string }; ranges?: ChartRange[] | [карточка](blocks/chartArea.md) |
| `chartBar01` | `chartBar` | Charts | столбцы: сравнить величины поточечно | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string } | [карточка](blocks/chartBar.md) |
| `chartLine01` | `chartLine` | Charts | линия: увидеть форму движения | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string } | [карточка](blocks/chartLine.md) |
| `chartPie01` | `chartPie` | Charts | круговая: из чего состоит целое | title: string; description?: string; shares?: ChartShareRow[]; footer?: { note?: string; hint?: string } | [карточка](blocks/chartPie.md) |
| `chartRadar01` | `chartRadar` | Charts | лепестковая: профиль по нескольким мерам | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string }; footer?: { note?: string; hint?: string } | [карточка](blocks/chartRadar.md) |
| `chartRadial01` | `chartRadial` | Charts | радиальные полосы: доля и её величина сразу | title: string; description?: string; shares?: ChartShareRow[]; footer?: { note?: string; hint?: string } | [карточка](blocks/chartRadial.md) |
| `chartTooltip01` | `chartTooltip` | Charts | подсказка, видимая без наведения | title: string; description?: string; rows?: ChartRow[]; labels?: { a?: string; b?: string }; openAt?: number | [карточка](blocks/chartTooltip.md) |
| `orbitLayers01` | `orbitLayers` | Product in action | орбита: четыре опоры как одна конструкция | badge?: string; title: string; accent?: string; lead?: string; core?: FeatureIcon; cards: [OrbitLayerCard, OrbitLayerCard, OrbitLayerCard, OrbitLayerCard] | [карточка](blocks/orbitLayers.md) |

## Чего в этой таблице нет

**Вместимости.** Сколько карточек влезает в `cards`, сколько чисел в `metrics`, что происходит с
неполным рядом — этого из типа не видно, потому что тип принимает массив любой длины, а сетка
рассчитана на кратность. Это живёт в карточке вида, и там же живут правила владельца, сказанные
по конкретному поводу.

**Карточка рождается, когда о виде что-то узнали** — обычно когда владелец поправил внешность и
объяснил почему. Пустая карточка, написанная ради полноты таблицы, не учит никого.

import { type ReactNode } from 'react'
import type { Block, FaqPair } from '@/lib/content/blocks/types'
// Импортируется под другим именем НАМЕРЕННО: у компонента есть проп `author`,
// и одноимённая функция была бы перекрыта им внутри тела — значение по умолчанию
// ссылалось бы само на себя.
import { author as projectAuthor } from '@/lib/author'
import { getPostBodyUi } from '@/lib/content/post-body-ui'
import { renderBlocks } from '@/lib/content/blocks/registry'
import { PostBody, headingId } from './post-body'
import { PageHeader } from './page-header.server'
import { PageCover } from './page-cover.server'
import { BackLink } from './back-link.server'
import { PageShell } from './page-shell'

// PORTED FROM THE PLATFORM'S MARKETING SITE (2026-08-11). Three couplings were
// cut on the way in, and none of them is a loss for a starter: a sponsorship
// section baked into every page, the content provider that fed it, and the
// marketing site's own i18n corpus. What remains is the page SHAPE — the part
// worth reusing.

// ─────────────────────────────────────────────────────────────────────────────
// StandardContentPage — the ONE reusable template for every Block 3 content page.
// It renders the full Fractera page standard, mirroring the News article layout,
// so future pages only supply data and reuse this chrome:
//
//   1. Breadcrumbs (visible)            5. 3× H2, each with 2× H3
//   2. Max-size H1 (homepage hero style) 6. Quote / CTA / docref blocks
//   3. Table of contents (from H2s)      7. `sections` slot (injected by the route)
//   4. "Did you know?" callout           8. Sponsorship (baked, every page)
//                                        9. FAQ (last content section)
//                                       10. Back link (ABSOLUTE LAST, below FAQ)
//
// CANONICAL BOTTOM ORDER (every content page): … page sections → founder quote
// ("Roma Armstrong content", placed last inside the `sections` slot) → Sponsors →
// FAQ → Back link. The back link "to all deployment options" is ALWAYS the very
// last item; Sponsorship + FAQ are baked in here so no page can forget them; the
// `sections` slot carries page-specific content (deploy form / MCP connector) plus
// the founder quote. Fully static / server-rendered — no JS needed to read it.
// ─────────────────────────────────────────────────────────────────────────────

export type Breadcrumb = { label: string; href?: string }

export type StandardContentPageProps = {
  lang: string
  /** Ordered breadcrumb trail; the LAST item is the current page (no href). */
  /**
   * Крошки. НЕОБЯЗАТЕЛЬНЫ (шаг 508): у корня сайта нет уровня выше, крошка
   * «Главная → Главная» была бы ложью. Но из этого следует «крошек нет», а не
   * «нужен второй шаблон страницы»: из пятнадцати свойств этого блока
   * четырнадцать уже исчезали сами, когда их не дают, и обязательность
   * оставшихся была свойством кода, а не устройства страницы.
   */
  breadcrumbs?: Breadcrumb[]
  tags?: string[]
  /** H1 — rendered at the homepage hero's maximum size. */
  title: string
  subtitle?: string
  /**
   * Заголовок печатает МАТЕРИАЛ, а не шапка страницы (шаг 508, лендинг).
   *
   * 🔒 ЗАЧЕМ ЭТО СУЩЕСТВУЕТ. У лендинга первый экран — две колонки: слово слева,
   * иллюстрация справа. H1 обязан стоять ВНУТРИ левой колонки; снаружи сетки он
   * туда не попадает. Поэтому секция `heroSplit` берёт заголовок на себя, а этот
   * признак выключает шапку здесь — иначе на странице оказалось бы два H1, и в
   * выдаче они спорят: поисковик не знает, который из них ваш.
   *
   * 🔒 ЭТО НЕ ВТОРОЙ ШАБЛОН СТРАНИЦЫ. Умолчание — `false`, и тогда всё ниже
   * работает ровно как работало: шесть остальных страниц об этом признаке не
   * знают. Меняется только КТО печатает заголовок, а не из чего состоит страница.
   * Заголовок при этом никуда не девается из метаданных и разметки — их строит
   * фабрика, и `title` она получает по-прежнему.
   */
  titleInBody?: boolean
  /** Роль необязательна: в `APP-CONFIG` её нет, и выдумывать её нельзя. */
  author?: { name: string; role?: string; url?: string }
  /**
   * Сведения под заголовком ЧАСТЯМИ — они заменяют строку автора по умолчанию.
   * Ими пользуется фабрика поста: автор · дата · время чтения.
   *
   * 🔒 ЧАСТИ, А НЕ ГОТОВАЯ СТРОКА (шаг 542). Раньше сюда приезжал собранный узел,
   * и разметка этой строки жила в двух файлах разом — здесь и в фабрике поста.
   * Раскладку рисует `PageHeader`; вызывающий приносит только содержимое.
   */
  metaItems?: ReactNode[]
  heroImage?: string
  heroAlt?: string
  /**
   * Hero override. When provided, replaces the default `heroImage` figure (used by
   * createContentPost for a post's video / responsive-picture hero).
   */
  hero?: ReactNode
  /**
   * Виджет маршрута сразу ЗА первым экраном — во всю ширину, вне ленты
   * (шаг 521). Отличие от `hero` выше: тот заменяет картинку ВНУТРИ ленты.
   */
  afterHero?: ReactNode
  blocks: Block[]
  faq?: FaqPair[]
  /** Ссылка «назад» — на уровень выше. Нет уровня выше — нет и ссылки. */
  backHref?: string
  backLabel?: string
  /**
   * Open slot for architect-discretion sections (e.g. the sponsorship section),
   * injected by the route entry and rendered directly ABOVE the FAQ. May be one
   * section, several, or none — the block bakes in nothing here. The FAQ stays
   * the last section regardless (only the global footer is below it).
   */
  sections?: ReactNode
}

export function StandardContentPage({
  lang,
  breadcrumbs,
  tags,
  title,
  subtitle,
  titleInBody = false,
  author = { name: projectAuthor().name, role: projectAuthor().role, url: projectAuthor().url },
  metaItems,
  heroImage,
  heroAlt,
  hero,
  afterHero,
  blocks,
  faq,
  backHref,
  backLabel,
  sections,
}: StandardContentPageProps) {
  // Словарь подписей МЕХАНИЗМА — им пользуются рендереры видов: кнопка `docref`,
  // заголовок оглавления, заголовок раздела вопросов. Своих слов у фабрики не
  // осталось вовсе — всё, что печатается на странице, печатают виды каталога.
  const blockUi = getPostBodyUi(lang)


  // Table of contents — built from the H2 sections, so labels AND anchors match
  // exactly what PostBody emits (same headingId).
  const toc = blocks
    .filter((b): b is { kind: 'h2'; text: string } => b.kind === 'h2')
    .map(b => ({ id: headingId(b.text), text: b.text.replace(/\*\*/g, '') }))

  // ── ТРИ ЗОНЫ ШИРИНЫ, И ГРАНИЦА МЕЖДУ НИМИ — ЗАКОН СТРАНИЦЫ (2026-08-15) ────
  //
  // 🔒 ЧТО ЭТО ЛЕЧИТ. Переключатель ширины в подвале не управлял НИЧЕМ, кроме
  // самого подвала: метку `data-app-column` носил только он, а лента страницы
  // сидела в жёстком `max-w-5xl`. Человек нажимал «шире», видел, как разъезжается
  // подвал, и делал единственно возможный вывод — кнопка сломана.
  //
  // Область действия теперь описана явно:
  //   • шапка               — не подчиняется никогда (её ширина — дело шапки);
  //   • лента страницы      — подчиняется: это и есть смысл переключателя;
  //   • первый экран (hero) — НЕ подчиняется, всегда во всю ширину;
  //   • завершающая (outro) — НЕ подчиняется, всегда во всю ширину;
  //   • подвал              — не подчиняется, всегда во всю ширину.
  //
  // 🔒 ПОЧЕМУ HERO И OUTRO ВЫНЕСЕНЫ ИЗ `<article>`, А НЕ ПРОСТО РАСШИРЕНЫ.
  // Ширину задаёт РОДИТЕЛЬ: пока секция лежит внутри колонки, она не может стать
  // шире неё — можно лишь вытягивать её отрицательными отступами, и это ломается
  // на каждой второй ширине экрана. Поэтому такие секции физически стоят снаружи
  // колонки, а внутри неё остаётся текст.
  const heroBlock = blocks.find(b => b.kind === 'heroSplit')
  const outroBlock = blocks.find(b => b.kind === 'languageMarquee')
  const bodyBlocks = blocks.filter(b => b !== heroBlock && b !== outroBlock)

  return (
    /* 🔒 ОБОЛОЧКА — ОБЩАЯ, А НЕ СВОЯ (2026-08-19). Здесь стоял собственный
       `<main>` со своей лентой и своим воздухом; ровно такие же, но чуть иные,
       стояли в списке блога и в каталоге. Теперь `<main>`, лента и её отступы
       живут ОДИН раз в `PageShell`, и шаблон материала распоряжается только тем,
       что внутри.

       🔒 ВЕРХНИЙ ОТСТУП ЗАВИСИТ ОТ ТОГО, ЕСТЬ ЛИ ШАПКА СТРАНИЦЫ (владелец,
       2026-08-17: «большое пространство воздуха под героем»). Шестьдесят четыре
       пикселя отмерены под ШАПКУ — крошки, заголовок, подзаголовок. У лендинга
       шапки нет: заголовок печатает первый экран (`titleInBody`), и эти
       64 пикселя оказывались чистой пустотой, сложенной с нижним отступом
       самого первого экрана.

       Первый экран и завершающая секция уезжают в слоты `hero`/`outro`: они
       рисуются ВНЕ ленты, потому что подчиняются другой ширине — внутри колонки
       секция шире неё не станет, а тянуть её отрицательными отступами ломается
       на каждой второй ширине экрана. */
    <PageShell
      top={titleInBody ? "work" : "content"}
      columnAs="article"
      hero={heroBlock ? <PostBody blocks={[heroBlock]} lang={lang} /> : undefined}
      afterHero={afterHero}
      outro={outroBlock ? <PostBody blocks={[outroBlock]} lang={lang} /> : undefined}
    >

        {/* 1–2. Шапка страницы — ОДИН примитив на весь сайт.
            Порядок и отступы задаёт `PageHeader`; здесь остаётся только решение
            «рисовать её или нет». До 2026-08-15 шаблон собирал шапку сам и нёс
            СВОЮ копию разметки крошек — вторую на проект, со своим размером
            текста и без разметки для поисковика.

            Шапки нет вовсе, когда заголовок печатает материал (лендинг): её
            содержимое переезжает в секцию первого экрана целиком, и пустая рамка
            со строкой автора над ней читалась бы как поломка. */}
        {!titleInBody && (
          <PageHeader
            lang={lang}
            breadcrumbs={breadcrumbs}
            tags={tags}
            title={title}
            subtitle={subtitle}
            metaItems={metaItems}
            author={author}
          />
        )}

        {/* Обложка — ПРИМИТИВ `PageCover` (шаг 542). Свой узел (видео поста,
            отзывчивая картинка) по-прежнему заменяет её целиком. */}
        {hero ?? (heroImage && <PageCover src={heroImage} alt={heroAlt ?? title} />)}

        {/* 3. Оглавление — ВИД КАТАЛОГА `toc`, а не своя разметка (шаг 542).
            Фабрика считает заголовки и передаёт их блоку; рисует его каталог.
            Владелец решил 2026-08-22 оставить оглавление автоматическим, поэтому
            блок появляется сам, а страницы о нём по-прежнему не знают.

            🔒 РИСУЕТСЯ ЧЕРЕЗ `renderBlocks`, А НЕ ЧЕРЕЗ `PostBody`. Тот заворачивает
            блоки в `flex flex-col gap-6`; здесь обёртка изменила бы отступы —
            лента страницы обычный блочный поток, и воздух ей задают margin'ы
            самих секций. */}
        {renderBlocks([{ kind: 'toc', items: toc }], lang, blockUi, 'toc')}

        {/* 4–7, 9. Body blocks (callout, H2/H3, quote, CTA, docref download, …).
            Без первого экрана и завершающей секции: они нарисованы снаружи этой
            колонки, потому что подчиняются другой ширине. */}
        <PostBody blocks={bodyBlocks} lang={lang} />

        {/* Open sections slot — page-specific sections injected by the route entry
            (e.g. the VPS deploy form / the MCP connector + the founder quote). The
            founder ("Roma Armstrong content") goes LAST in this slot so the bottom of
            every deployment page reads: founder → sponsors → FAQ → back link.
            Sponsorship is NOT injected here — it is baked in below. */}
        {sections}

        {/* Вопросы — ВИД КАТАЛОГА `faq` (шаг 542). Раздел по-прежнему последний
            содержательный на странице: ниже только ссылка «назад» и подвал сайта.
            Материал не изменился — вопросы приходят полем `faq` языковой ячейки,
            и та же ячейка кормит разметку `FAQPage` для поисковика. */}
        {faq && faq.length > 0 && renderBlocks([{ kind: 'faq', items: faq }], lang, blockUi, 'faq')}

        {/* Ссылка «назад» — ПРИМИТИВ `BackLink`, последний элемент страницы.
            Ведёт на уровень выше; у корня сайта такого уровня нет, поэтому её
            может не быть вовсе (шаг 508). */}
        {backHref && <BackLink href={backHref} label={backLabel} />}

    </PageShell>
  )
}

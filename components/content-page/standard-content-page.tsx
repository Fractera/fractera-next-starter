import { type ReactNode } from 'react'
import type { Block, FaqPair } from '@/lib/content/blocks/types'
// Импортируется под другим именем НАМЕРЕННО: у компонента есть проп `author`,
// и одноимённая функция была бы перекрыта им внутри тела — значение по умолчанию
// ссылалось бы само на себя.
import { author as projectAuthor } from '@/lib/author'
import { getPageUi } from '@/lib/content/page-ui'
import { PostBody, headingId } from './post-body'
import { StaticImage } from '@/components/media/static-image.server'
import { H2 } from '@/components/ui/typography'
import { PageHeader } from './page-header.server'
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
   * Byline override. When provided, replaces the default author line (used by
   * createContentPost to render a post byline: author · date · reading time).
   */
  metaLine?: ReactNode
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
  metaLine,
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
  const ui = getPageUi(lang)

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
            meta={metaLine ?? (author.name ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {author.url ? (
                  <a href={author.url} rel="author" className="hover:text-foreground">{author.name}</a>
                ) : (
                  <span>{author.name}</span>
                )}
                {author.role && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{author.role}</span>
                  </>
                )}
              </div>
            ) : null)}
          />
        )}

        {/* Hero — custom node (post video / responsive picture) overrides the
            default image hero. */}
        {hero ?? (heroImage && (
          <figure className="my-8">
            {/* Герой стоит на первом экране — `priority`, а не ленивая загрузка:
                это, как правило, самый крупный элемент страницы, и именно по нему
                поисковик меряет скорость её появления. */}
            <StaticImage
              src={heroImage}
              alt={heroAlt ?? title}
              priority
              sizes="(max-width: 768px) 100vw, 48rem"
              className="w-full h-auto rounded-2xl border border-border"
            />
          </figure>
        ))}

        {/* 3. Table of contents */}
        {toc.length > 0 && (
          <nav aria-label="Contents" className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {ui.tocHeading} · {toc.length}
            </p>
            <ol className="mt-3 flex flex-col gap-2">
              {toc.map((item, i) => (
                <li key={item.id} className="flex gap-3 text-[15px] leading-snug">
                  {/* Контраст поднят до полного `muted-foreground` (проверка доступности
                      2026-08-13): при /70 отношение падало ниже порога. Значок
                      декоративный и скрыт от чтения с экрана, но глазами его читают
                      все, и слабовидящим он не должен исчезать. */}
                  <span aria-hidden className="select-none font-mono text-sm text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <a href={`#${item.id}`} className="text-muted-foreground transition-colors hover:text-primary">
                    {item.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

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

        {/* FAQ — the last CONTENT section by contract; only the back link (and the
            global footer) sit below it. */}
        {faq && faq.length > 0 && (
          <section aria-labelledby="faq-heading" className="mt-12 border-t border-border pt-10">
            <H2 id="faq-heading">{ui.faqHeading}</H2>
            <dl className="mt-6 flex flex-col gap-4">
              {faq.map((f, i) => (
                <div key={i} className="rounded-2xl border border-border bg-muted/40 p-5">
                  <dt className="text-base font-semibold text-foreground">{f.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Ссылка «назад» — последний элемент страницы, ниже вопросов. Ведёт на
            уровень выше; у корня сайта такого уровня нет, поэтому её может не
            быть вовсе (шаг 508). */}
        {backHref && (
          <div className="mt-12 border-t border-border pt-8">
            <a href={backHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {backLabel}
            </a>
          </div>
        )}

    </PageShell>
  )
}

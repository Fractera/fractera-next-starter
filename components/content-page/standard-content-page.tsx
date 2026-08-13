import { type ReactNode } from 'react'
import type { Block, FaqPair } from '@/lib/content/blocks/types'
// Импортируется под другим именем НАМЕРЕННО: у компонента есть проп `author`,
// и одноимённая функция была бы перекрыта им внутри тела — значение по умолчанию
// ссылалось бы само на себя.
import { author as projectAuthor } from '@/lib/author'
import { getPageUi } from '@/lib/content/page-ui'
import { PostBody, headingId } from './post-body'
import { StaticImage } from '@/components/media/static-image.server'

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
  breadcrumbs: Breadcrumb[]
  tags?: string[]
  /** H1 — rendered at the homepage hero's maximum size. */
  title: string
  subtitle?: string
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
  blocks: Block[]
  faq?: FaqPair[]
  /** Back link target — one level up from the current page. */
  backHref: string
  backLabel: string
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
  author = { name: projectAuthor().name, role: projectAuthor().role, url: projectAuthor().url },
  metaLine,
  heroImage,
  heroAlt,
  hero,
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="mx-auto w-full max-w-5xl px-6 py-16 md:py-12">

        {/* 1. Breadcrumb — single row, never wraps, never overflows.
            The trail stays on one line (flex-nowrap) and the whole strip is
            clipped (overflow-hidden) so a long page title can NEVER widen the
            page on a phone (no horizontal scroll/swipe). The parent crumbs keep
            their full width (shrink-0 + whitespace-nowrap); only the LAST crumb
            — the page title, the long one — is allowed to shrink (min-w-0) and
            truncates with an ellipsis. truncate needs min-w-0 on every flex
            ancestor, otherwise the item refuses to shrink below its content and
            pushes the row past the viewport. */}
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-hidden">
            {breadcrumbs.map((c, i) => {
              const isLast = i === breadcrumbs.length - 1
              return (
                <li
                  key={i}
                  className={`flex items-center gap-1.5 ${isLast ? 'min-w-0' : 'shrink-0'}`}
                >
                  {c.href && !isLast ? (
                    <a href={c.href} className="whitespace-nowrap hover:text-foreground">{c.label}</a>
                  ) : (
                    <span aria-current="page" className="block min-w-0 truncate text-muted-foreground">{c.label}</span>
                  )}
                  {!isLast && <span aria-hidden className="shrink-0 text-muted-foreground">/</span>}
                </li>
              )
            })}
          </ol>
        </nav>

        {/* 2. Header — tags + max-size H1 (homepage hero style) + subtitle + author */}
        <header className="mt-6 flex flex-col gap-5 border-b border-border pb-8">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {tags.map(t => (
                <span key={t} className="rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary">
                  {t}
                </span>
              ))}
            </div>
          )}
          {/* 🔒 ЦВЕТ ЗАГОЛОВКА БЕРЁТСЯ ИЗ ТЕМЫ, А НЕ ЗАДАЁТСЯ БЕЛЫМ (2026-08-12).
              Здесь стояло `color: 'white'` инлайном — то есть заголовок оставался
              белым и на светлой теме, где фон тоже белый: текст исчезал. Инлайн-
              стиль сильнее любого класса, поэтому переключатель темы на него не
              влиял никак. `text-foreground` — та же переменная, что у остального
              текста страницы: она меняется вместе с темой сама.
              Обводка и свечение остаются: они фиолетовые и читаются на обоих фонах. */}
          <h1
            className="text-3xl font-bold font-serif leading-tight tracking-tight md:text-4xl lg:text-5xl text-foreground"
            style={{
              WebkitTextStroke: '1px rgba(139,92,246,0.8)',
              paintOrder: 'stroke fill',
              textShadow: '0 0 18px rgba(139,92,246,0.55), 0 0 36px rgba(139,92,246,0.28)',
            } as React.CSSProperties}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg leading-relaxed text-muted-foreground md:text-base">{subtitle}</p>
          )}
          {/* Byline — post byline (metaLine) overrides the default author line. */}
          {/* Автора может не быть вовсе — владелец не заполнил раздел в
              настройках. Тогда строки авторства нет: пустое «·» под заголовком
              выглядит поломкой, а чужое имя было бы враньём. */}
          {metaLine ?? (author.name ? (
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
        </header>

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

        {/* 4–7, 9. Body blocks (callout, H2/H3, quote, CTA, docref download, …) */}
        <PostBody blocks={blocks} lang={lang} />

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
            <h2 id="faq-heading" className="text-2xl font-bold tracking-tight">{ui.faqHeading}</h2>
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

        {/* Back link — the ABSOLUTE LAST item on every content page (below the FAQ).
            One level up from the current page. */}
        <div className="mt-12 border-t border-border pt-8">
          <a href={backHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </a>
        </div>

      </article>
    </main>
  )
}

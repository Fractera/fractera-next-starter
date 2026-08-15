import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import type { Block, FaqPair } from '@/lib/content/blocks/types'
import { buildAlternates } from '@/lib/seo/alternates'
import { author, authorSameAs } from '@/lib/author'
import { brand } from '@/lib/brand'
import { StandardContentPage, type Breadcrumb } from '@/components/content-page/standard-content-page'

// ─────────────────────────────────────────────────────────────────────────────
// createContentPage — the page factory. It turns a content descriptor into a
// complete, fully-static Block-3 page: `generateMetadata` (title/desc/keywords/
// hreflang/OpenGraph) + JSON-LD (Article/BreadcrumbList/FAQPage, author=Person)
// + the StandardContentPage chrome. A new route becomes a ~10-line file that
// supplies data only; all the boilerplate lives here.
//
// The i18n layer is untouched: `resolve(lang)` is the existing per-document
// resolver (e.g. deploymentContent over a route's co-located ./_data folder)
// built on resolveEntry with EN-fallback. The factory never reads or changes any
// localized content file.
// ─────────────────────────────────────────────────────────────────────────────

// Brand-derived origin — sourced from env via lib/brand (white-label/portable).
const SITE = brand().siteUrl

/** Shape returned by a per-document resolver — the localized page descriptor. */
export type ContentPageContent = {
  title: string // H1
  seoTitle?: string
  subtitle?: string
  description: string
  keywords: string
  blocks: Block[]
  faq?: FaqPair[]
}

/** Page-specific, localized chrome (breadcrumb trail + back link). */
export type ContentPageChrome = {
  breadcrumbs?: Breadcrumb[]
  backHref?: string
  backLabel?: string
}

export type ContentPageConfig<C extends ContentPageContent> = {
  /** Per-document, per-language resolver (resolveEntry-based). */
  resolve: (lang: string) => C
  /**
   * Крошки и ссылка «назад». НЕОБЯЗАТЕЛЬНЫ (шаг 508).
   *
   * 🔒 ПОЧЕМУ ЭТО ВАЖНЕЕ, ЧЕМ ВЫГЛЯДИТ. Ровно эта обязательность была
   * единственным, что мешало главной идти через ту же фабрику, что посты и
   * правовые страницы, — и едва не стала поводом завести вторую фабрику «для
   * лендингов». Из пятнадцати свойств шаблона четырнадцать уже исчезали сами,
   * когда их не дают; обязательность оставшихся была свойством кода, а не
   * устройства страницы. Второй стандарт на ровном месте — начало четвёртого.
   */
  chrome?: (lang: string, content: C) => ContentPageChrome
  /** Non-translatable per-page fields. */
  meta: {
    subPath: string
    ogImage: string
    heroImage?: string
    tags?: readonly string[]
  }
  /** Structured-data type for the primary entity. Defaults to 'Article'. */
  jsonLdType?: 'Article' | 'NewsArticle'
  /**
   * Заголовок печатает материал страницы, а не её шапка (лендинг).
   *
   * Нужен ровно тем страницам, чей первый экран — сетка: секция `heroSplit`
   * ставит H1 в левую колонку рядом с описанием, и шапка обязана свой заголовок
   * не печатать, иначе H1 на странице два. Метаданные, `og:title` и разметка
   * строятся здесь и от этого признака не зависят — фабрика по-прежнему получает
   * `title` из материала.
   */
  titleInBody?: boolean
  /**
   * Optional sections injected into the block, directly ABOVE the FAQ (architect
   * discretion — e.g. the sponsorship section). The factory bakes in nothing
   * here; the route entry decides what to pass. May render one section, several,
   * or none. The FAQ stays last by contract.
   */
  sections?: (lang: string) => ReactNode
  /**
   * Optional hero override, rendered directly under the H1 in place of the default
   * `meta.heroImage` figure (e.g. the MCP step-by-step carousel at the top of
   * /deployments/mcp). When provided, `meta.heroImage` is ignored.
   */
  hero?: (lang: string) => ReactNode
}

function abs(path: string): string {
  return /^https?:/.test(path) ? path : `${SITE}${path}`
}

export function createContentPage<C extends ContentPageContent>(config: ContentPageConfig<C>) {
  const { resolve, chrome, meta, jsonLdType = 'Article', sections, hero, titleInBody = false } = config

  async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params
    const c = resolve(lang)
    const seoTitle = c.seoTitle ?? c.title
    // Social snippet image MUST be an absolute URL — Telegram/Facebook/LinkedIn
    // scrapers ignore relative og:image paths. (JSON-LD below already uses abs().)
    const ogImageUrl = abs(meta.ogImage)
    return {
      // `absolute` по той же причине, что и у поста: корневой шаблон
      // `%s | <имя сайта>` иначе добавит имя второй раз.
      title: { absolute: `${seoTitle} | ${brand().name}` },
      description: c.description,
      keywords: c.keywords,
      alternates: buildAlternates(lang, meta.subPath),
      openGraph: {
        type: 'article',
        url: `${SITE}/${lang}${meta.subPath}`,
        siteName: brand().name,
        title: seoTitle,
        description: c.description,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: c.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: c.description,
        images: [ogImageUrl],
      },
    }
  }

  async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const c = resolve(lang)
    const { breadcrumbs, backHref, backLabel } = chrome?.(lang, c) ?? {}
    const url = `${SITE}/${lang}${meta.subPath}`
    const ogImageUrl = abs(meta.ogImage)

    const jsonLd: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': jsonLdType,
        headline: c.title,
        description: c.description,
        inLanguage: lang,
        author: {
          '@type': 'Person',
          '@id': author().id,
          name: author().name,
          url: author().url,
          sameAs: authorSameAs(),
        },
        publisher: {
          '@type': 'Organization',
          name: brand().legalName,
          url: SITE,
          logo: { '@type': 'ImageObject', url: brand().logoUrl },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: c.keywords,
        image: ogImageUrl,
      },
      // 🪦 РАЗМЕТКА КРОШЕК УДАЛЕНА ОТСЮДА 2026-08-15 — ОНА БЫЛА ВТОРОЙ.
      //
      // Здесь строился `BreadcrumbList`, и точно такой же строит компонент самих
      // крошек (`components/nav/breadcrumbs.server.tsx`). С переходом шапки на
      // общий примитив обе оказались бы на одной странице: поисковик получил бы
      // два объявления пути, а расходиться они начали бы с первой правки — тихо,
      // потому что вторую разметку в браузере никто не видит.
      //
      // Осталась одна, и она стоит там же, где НАРИСОВАННЫЙ путь: объявленное
      // поисковику и показанное человеку обязаны совпадать по построению, а не
      // по внимательности того, кто правит.
      ...(c.faq && c.faq.length > 0
        ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: c.faq.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }]
        : []),
    ]

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <StandardContentPage
          lang={lang}
          breadcrumbs={breadcrumbs}
          tags={meta.tags ? [...meta.tags] : undefined}
          title={c.title}
          subtitle={c.subtitle}
          titleInBody={titleInBody}
          heroImage={meta.heroImage}
          heroAlt={c.title}
          hero={hero?.(lang)}
          blocks={c.blocks}
          faq={c.faq}
          backHref={backHref}
          backLabel={backLabel}
          sections={sections?.(lang)}
        />
      </>
    )
  }

  return { generateMetadata, Page }
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import type { Block, FaqPair } from '@/lib/content/blocks/types'
import { buildAlternates } from '@/lib/seo/alternates'
import { author, authorSameAs } from '@/lib/author'
import { brand } from '@/lib/brand'
import { StandardContentPage, type Breadcrumb } from '@/components/content-page/standard-content-page'

// ─────────────────────────────────────────────────────────────────────────────
// createContentPost — the POST factory (sibling of createContentPage). One
// universal technology for publishing posts of every format: news, blog and
// documentation. Like createContentPage, it renders ONE post from a CO-LOCATED
// route folder (page.tsx + _components/index.tsx + _data/) — NO dynamic [slug]
// route, no central registry. A post folder is an exact copy of the page folder
// standard; deleting the folder removes the route, its components and its data.
//
// The `format` parameter selects a preset that carries the only real per-type
// differences (structured-data type + author kind); everything else renders
// through the SAME block, StandardContentPage. i18n is orthogonal: `resolve(lang)`
// is the co-located resolver — news is localized (resolveEntry, en + <lang>),
// EN-only formats ignore `lang`. The factory never reads or changes a data file.
// ─────────────────────────────────────────────────────────────────────────────

export type PostFormat = 'news' | 'blog' | 'document'

const JSONLD_TYPE: Record<PostFormat, 'NewsArticle' | 'BlogPosting' | 'TechArticle'> = {
  news: 'NewsArticle',
  blog: 'BlogPosting',
  document: 'TechArticle',
}
const AUTHOR_KIND: Record<PostFormat, 'person' | 'organization'> = {
  news: 'person',
  blog: 'organization',
  document: 'person',
}

/** Normalized post descriptor the route's resolver returns. */
export type ContentPost = {
  title: string // H1 + JSON-LD headline
  seoTitle?: string // <title> / og:title (falls back to title)
  subtitle?: string
  description: string
  keywords?: string
  tags: string[]
  date: string // ISO
  readingMinutes: number
  /** Visible byline name; omit to show no author in the byline (e.g. docs). */
  authorName?: string
  blocks: Block[]
  faq?: FaqPair[]
  /** og:image / structured-data image — absolute or site-root-relative. */
  ogImage?: string
  /** Default image hero (string path). */
  heroImage?: string
  /** Custom hero node (video / responsive picture) — overrides heroImage. */
  hero?: ReactNode
  /** Content language for inLanguage; defaults to 'en'. */
  inLanguage?: string
}

export type ContentPostConfig = {
  format: PostFormat
  /** This post's URL path, e.g. '/news/<slug>'. */
  subPath: string
  /** Co-located resolver: returns this post's localized content. */
  resolve: (lang: string) => ContentPost
  /** Localized breadcrumb trail + back link for this post. */
  chrome: (lang: string, post: ContentPost) => {
    breadcrumbs: Breadcrumb[]
    backHref: string
    backLabel: string
  }
  /** <title> suffix, e.g. (lang) => 'Fractera News'. */
  titleSuffix: (lang: string) => string
  /** "min read" label; defaults to 'min read'. */
  minLabel?: (lang: string) => string
}

function abs(path: string): string {
  return /^https?:/.test(path) ? path : `${brand().siteUrl}${path}`
}

// Social snippet image (og:image / twitter / JSON-LD). RULE: a post that has ANY
// image must expose it as the snippet — never ship an empty og:image when an image
// exists. Explicit `ogImage` wins; otherwise fall back to the visible `heroImage`.
// (A custom `hero` ReactNode has no string path, so it cannot be a snippet source —
// such posts should set `ogImage` explicitly.)
function snippetImage(post: ContentPost): string | undefined {
  const path = post.ogImage ?? post.heroImage
  return path ? abs(path) : undefined
}

function formatDate(iso: string, lang: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function createContentPost(config: ContentPostConfig) {
  const { format, subPath, resolve, chrome, titleSuffix } = config
  const minLabel = config.minLabel ?? (() => 'min read')

  async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params
    const post = resolve(lang)
    const seoTitle = post.seoTitle ?? post.title
    const ogImage = snippetImage(post)
    return {
      // 🔒 `absolute` — ИНАЧЕ ИМЯ САЙТА ПОДСТАВЛЯЕТСЯ ДВАЖДЫ (2026-08-11).
      // Корневые метаданные объявляют шаблон `%s | <имя сайта>`
      // (`lib/construct-metadata.ts`), и Next применяет его к любому обычному
      // заголовку. Пост уже несёт собственный суффикс раздела, поэтому выходило
      // «Статья | Блог Fractera | Fractera». `absolute` говорит фреймворку, что
      // заголовок готов и достраивать его не нужно.
      // Имя сайта берётся из настроек проекта, а не из строк раздела: в
      // исходной версии оно было вписано в данные («Fractera Blog»), и блог
      // любого клиента представлялся бы чужим именем.
      title: { absolute: `${seoTitle} | ${titleSuffix(lang)} | ${brand().name}` },
      description: post.description,
      ...(post.keywords ? { keywords: post.keywords } : {}),
      alternates: buildAlternates(lang, subPath),
      robots: { index: true, follow: true },
      openGraph: {
        title: seoTitle,
        description: post.description,
        url: `${brand().siteUrl}/${lang}${subPath}`,
        type: 'article',
        publishedTime: post.date,
        ...(ogImage ? { images: [{ url: ogImage, alt: post.title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: post.description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    }
  }

  async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const post = resolve(lang)
    const { breadcrumbs, backHref, backLabel } = chrome(lang, post)
    const url = `${brand().siteUrl}/${lang}${subPath}`
    const ogImage = snippetImage(post)

    const authorNode =
      AUTHOR_KIND[format] === 'person'
        ? { '@type': 'Person', '@id': author().id, name: author().name, url: author().url, sameAs: authorSameAs() }
        : { '@type': 'Organization', name: brand().legalName, url: brand().siteUrl }

    const jsonLd: Record<string, unknown>[] = [
      {
        '@context': 'https://schema.org',
        '@type': JSONLD_TYPE[format],
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: post.inLanguage ?? 'en',
        author: authorNode,
        publisher: {
          '@type': 'Organization',
          name: brand().legalName,
          url: brand().siteUrl,
          logo: { '@type': 'ImageObject', url: brand().logoUrl },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: post.keywords ?? post.tags.join(', '),
        ...(ogImage ? { image: ogImage } : {}),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.label,
          item: i === breadcrumbs.length - 1 ? url : abs(b.href ?? subPath),
        })),
      },
      ...(post.faq && post.faq.length > 0
        ? [{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faq.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }]
        : []),
    ]

    const metaLine = (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {post.authorName && (
          <>
            <span className="font-medium text-muted-foreground">{post.authorName}</span>
            <span aria-hidden>·</span>
          </>
        )}
        <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} {minLabel(lang)}</span>
      </div>
    )

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <StandardContentPage
          lang={lang}
          breadcrumbs={breadcrumbs}
          tags={post.tags}
          title={post.title}
          subtitle={post.subtitle}
          metaLine={metaLine}
          heroImage={post.heroImage}
          hero={post.hero}
          blocks={post.blocks}
          faq={post.faq}
          backHref={backHref}
          backLabel={backLabel}
        />
      </>
    )
  }

  return { generateMetadata, Page }
}

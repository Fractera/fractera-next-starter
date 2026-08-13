import type { Metadata } from 'next'
import { buildAlternates, urlFor } from '@/lib/seo/alternates'
import { metaForLang } from '@/config/app-config'
import { brand } from '@/lib/brand'
import { blogList } from '../_lib/post'
import { getBlogUi } from '../_data'
import { POSTS } from '../_list.generated'
import { StaticImage } from '@/components/media/static-image.server'

// Entry for the /blog router page. Standard router shape: page.tsx is thin and
// re-exports this. The post list is auto-discovered: POSTS comes from
// _list.generated.ts (built by lib/parser-fs from the co-located blog folders).
// All visible strings are DATA — they live in ../_data (getBlogUi), never inline.

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const ui = getBlogUi(lang)
  // `og:url` — свой, тем же `urlFor`, что и канонический адрес. Прежде он
  // наследовался от макета и указывал на корень сайта на всех языках: ссылка из
  // карточки в мессенджере вела не на список постов (шаг 503).
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: buildAlternates(lang, '/blog'),
    openGraph: {
      title: ui.metaTitle,
      description: ui.metaDescription,
      siteName: brand().name,
      locale: lang,
      url: urlFor(lang, '/blog'),
    },
  }
}

function formatDate(iso: string, lang: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function BlogIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const ui = getBlogUi(lang)
  const posts = blogList(POSTS, lang)
  const [featured, ...rest] = posts

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: brand().name, item: `${brand().siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: ui.breadcrumbBlog, item: `${brand().siteUrl}/${lang}/blog` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20 md:py-14">
          <header className="flex flex-col gap-3">
            {/* Надзаголовок: раздел + название сайта из настроек. В данных раздела
                имени сайта нет — иначе блог каждого клиента звался бы чужим именем. */}
            <p className="text-xs uppercase tracking-widest text-primary">{ui.eyebrow} · {metaForLang(lang).title}</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-3xl">{ui.indexTitle}</h1>
            <p className="max-w-2xl text-base text-muted-foreground">{ui.indexIntro}</p>
          </header>

          {featured && (
            <a
              href={`/${lang}/blog/${featured.slug}`}
              className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-border transition-colors hover:border-foreground/30 md:grid-cols-2"
            >
              <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto">
                {/* Главная карточка стоит на первом экране, поэтому `priority`:
                    ленивая загрузка здесь отложила бы ровно то, ради чего человек
                    пришёл. Ширина в вёрстке — половина полосы на широком экране. */}
                <StaticImage
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {ui.featured}
                </span>
              </div>
              <div className="flex flex-col gap-4 p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  {featured.tags.slice(0, 2).map(t => (
                    <span key={t} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-xl">
                  {featured.title}
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 pt-2 text-sm text-muted-foreground">
                  <time dateTime={featured.date}>{formatDate(featured.date, lang)}</time>
                  <span aria-hidden>·</span>
                  <span>{featured.readingMinutes} {ui.minRead}</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-primary group-hover:text-primary">
                    {ui.read}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </a>
          )}

          {rest.length > 0 && (
            <div className="flex flex-col gap-5">
              {rest.map(post => (
                <a
                  key={post.slug}
                  href={`/${lang}/blog/${post.slug}`}
                  className="group grid grid-cols-[8rem_1fr] items-stretch gap-4 overflow-hidden rounded-2xl border border-border transition-colors hover:border-foreground/30 sm:grid-cols-[12rem_1fr] sm:gap-6"
                >
                  {/* Fixed 4:3 illustration container on the left. Its fixed width
                      makes the 4:3 height — and thus the whole card's height —
                      constant at any screen width (8rem→6rem tall, sm 12rem→9rem). */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {/* Карточки списка лежат ниже сгиба — грузятся лениво (по
                        умолчанию у `next/image`), и до загрузки на их месте стоит
                        размытая копия, а не пустой прямоугольник. Ширина в вёрстке
                        фиксирована контейнером, отсюда точные `sizes`. */}
                    <StaticImage
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 6rem, 12rem"
                      className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  {/* Content clamped so it always fits the fixed card height: title
                      max 1 line, excerpt max 2 lines, meta pinned to the bottom. */}
                  <div className="flex min-w-0 flex-col gap-1.5 py-3 pr-5 sm:gap-2 sm:py-4 sm:pr-6">
                    <h3 className="line-clamp-1 text-base font-semibold leading-snug text-foreground sm:text-lg">
                      {post.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                      <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readingMinutes} {ui.minRead}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

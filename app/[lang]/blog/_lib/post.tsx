// Co-located blog helpers. Each blog post lives in its own static route folder
// (app/[lang]/blog/<slug>/ with page.tsx + _components + _data). Blog is bilingual
// by construction (news/doc pattern): _data is meta.ts + en.ts (+ optional <lang>.ts
// override) assembled into a BlogData; resolveEntry merges per key with EN fallback.
// These helpers map a post to the normalized ContentPost the factory renders
// (BlogPosting preset) and to the /blog index list item. The self-hosted video hero
// (the one blog-specific piece) is built here; a post may override the hero with an
// embed in its own _components. No central registry; the index reads generated POSTS.

import { resolveEntry } from '@/lib/content/resolve'
import { VideoCover } from '@/components/media/video-cover.client'
import { StaticImage } from '@/components/media/static-image.server'
import { getBlogUi } from '../_data'
import type { BlogMeta, BlogBase, BlogOverride } from './types'
import type { ContentPost } from '@/lib/content/create-content-post'

const FIELDS = ['title', 'subtitle', 'description', 'excerpt', 'heroCaption'] as const

/** A blog post folder's _data, assembled in its _data/index.ts as { meta, en, overrides? }. */
export type BlogData = {
  meta: BlogMeta
  en: BlogBase
  overrides?: Record<string, BlogOverride>
}

function resolve(data: BlogData, lang: string) {
  return resolveEntry(data.en, data.overrides, lang, FIELDS)
}

/** Map a blog post to the normalized ContentPost the factory renders. */
export function blogPost(data: BlogData, lang: string): ContentPost {
  const r = resolve(data, lang)
  const { meta } = data
  return {
    title: r.title,
    subtitle: r.subtitle,
    description: r.description,
    tags: meta.tags,
    date: meta.date,
    readingMinutes: meta.readingMinutes,
    authorName: meta.author.name,
    blocks: r.blocks,
    faq: r.faq,
    ogImage: meta.ogImage,
    inLanguage: lang,
    // Self-hosted video hero (poster + optional aspect + optional caption). Posts
    // without a heroVideo (e.g. an embed-hero post) override `hero` in _components.
    hero: meta.heroVideo
      ? (
        <figure className="my-8 flex flex-col gap-3">
          <div
            className="overflow-hidden rounded-2xl border border-border shadow-[0_0_60px_-15px_rgba(167,139,250,0.35)]"
            style={meta.heroAspect ? { aspectRatio: meta.heroAspect } : undefined}
          >
            {/* 🔒 ОБЛОЖКА — КАРТИНКА, А НЕ АТРИБУТ `poster` (отчёт проверки
                2026-08-13, экономия 61 КБ на этой странице).
                Атрибут не изображение: ни размытой подложки, ни размера под
                экран, ни современного формата к нему не применить, и файл уезжал
                как есть — 82 КБ ради места 444×290. Он же был самым крупным
                элементом страницы, по которому меряют скорость.
                Поэтому до нажатия стоит обычная картинка, проходящая весь наш
                путь, а тег `video` появляется в тот момент, когда его попросили.
                Субтитры едут вместе с ним: видео без них недоступно глухому
                посетителю. Пустую дорожку не подставляем — заглушка объявляет
                субтитры существующими, и человек открывает пустоту. */}
            <VideoCover
              src={meta.heroVideo}
              poster={meta.heroPoster}
              captions={meta.heroCaptions}
              lang={lang}
              label={getBlogUi(lang).playVideo}
              cover={
                meta.heroPoster
                  ? <StaticImage src={meta.heroPoster} alt="" priority sizes="(max-width: 768px) 100vw, 48rem" className="h-full w-full object-cover" />
                  : null
              }
            />
          </div>
          {r.heroCaption && (
            <figcaption className="text-center text-sm text-muted-foreground">{r.heroCaption}</figcaption>
          )}
        </figure>
      )
      : undefined,
  }
}

/** Compact item for the /blog index list (featured card + grid). */
export function blogListItem(data: BlogData, lang: string) {
  const r = resolve(data, lang)
  const { meta } = data
  return {
    slug: meta.slug,
    date: meta.date,
    readingMinutes: meta.readingMinutes,
    title: r.title,
    excerpt: r.excerpt,
    tags: meta.tags,
    ogImage: meta.ogImage,
    // 🔒 КАРТОЧКА РИСУЕТ СВОЙ ФАЙЛ, А НЕ АДРЕС ДЛЯ СОЦСЕТЕЙ (шаг 506.2, 2026-08-13).
    //
    // `ogImage` обязан быть АБСОЛЮТНЫМ — этого требуют соцсети, — и в наших постах
    // он ведёт на `https://www.fractera.ai/...`, то есть на домен ПЛАТФОРМЫ. Пока
    // карточка рисовалась им, сайт клиента грузил свои же картинки с чужого сайта:
    // мы вправе их убрать, и карточки клиента опустеют.
    //
    // Есть и вторая цена, из-за которой это вскрылось: превью считаются для файлов
    // из `public/` и ключом имеют локальный путь, а внешний адрес в карте не
    // найдётся никогда — размытая подложка молча не появлялась.
    //
    // `heroPoster` — тот же кадр, но свой; когда его нет (пост с видео-обложкой
    // YouTube), честно отдаём внешний адрес и обходимся без превью.
    image: meta.heroPoster ?? meta.ogImage,
  }
}

/** Build the date-sorted index list from the auto-discovered POSTS array. */
export function blogList(posts: BlogData[], lang: string) {
  return posts.map(p => blogListItem(p, lang)).sort((x, y) => (x.date < y.date ? 1 : -1))
}

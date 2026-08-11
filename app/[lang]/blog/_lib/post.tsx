// Co-located blog helpers. Each blog post lives in its own static route folder
// (app/[lang]/blog/<slug>/ with page.tsx + _components + _data). Blog is bilingual
// by construction (news/doc pattern): _data is meta.ts + en.ts (+ optional <lang>.ts
// override) assembled into a BlogData; resolveEntry merges per key with EN fallback.
// These helpers map a post to the normalized ContentPost the factory renders
// (BlogPosting preset) and to the /blog index list item. The self-hosted video hero
// (the one blog-specific piece) is built here; a post may override the hero with an
// embed in its own _components. No central registry; the index reads generated POSTS.

import { resolveEntry } from '@/lib/content/resolve'
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
            className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_60px_-15px_rgba(167,139,250,0.35)]"
            style={meta.heroAspect ? { aspectRatio: meta.heroAspect } : undefined}
          >
            <video
              src={meta.heroVideo}
              poster={meta.heroPoster}
              controls
              playsInline
              preload="none"
              className="h-full w-full bg-black object-cover"
            />
          </div>
          {r.heroCaption && (
            <figcaption className="text-center text-sm text-white/40">{r.heroCaption}</figcaption>
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
  }
}

/** Build the date-sorted index list from the auto-discovered POSTS array. */
export function blogList(posts: BlogData[], lang: string) {
  return posts.map(p => blogListItem(p, lang)).sort((x, y) => (x.date < y.date ? 1 : -1))
}

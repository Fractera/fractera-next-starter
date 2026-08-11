// Blog-private data shapes, co-located with the blog route (delete the blog
// folder and nothing is left behind). Content blocks come from the neutral,
// cross-tab catalog `lib/content/blocks/types` (the shared content engine, not a
// per-tab library); `BlogBlock` is just the catalog `Block` under a blog-local
// name. The blog-only shapes (`BlogAuthor`, `BlogPost`) live here.

import type { Block, FaqPair } from '@/lib/content/blocks/types'
import type { LocalizedBody, LocalizedBodyOverride } from '@/lib/content/types'

export type { FaqPair }
export type BlogBlock = Block

export type BlogAuthor = { name: string; role: string; avatar?: string }

// Blog is now bilingual by construction (news/doc pattern): non-translatable meta +
// a full `en` base + optional per-language overrides, resolved per key with EN
// fallback. A post that ships only `en` falls back to EN everywhere.

// Non-translatable fields, shared by every language of a post.
export type BlogMeta = {
  slug: string
  date: string
  readingMinutes: number
  tags: string[]
  author: BlogAuthor
  /** Self-hosted video hero (optional — a post may override the hero with an embed). */
  heroVideo?: string
  heroPoster?: string
  heroAspect?: string
  ogImage: string
}

// The required base-language document (all translatable fields + body + FAQ).
export type BlogBase = LocalizedBody & {
  title: string
  subtitle: string
  description: string
  excerpt: string
  /** Optional caption rendered under the video hero (translatable). */
  heroCaption?: string
}

// A partial per-language override: only the keys that differ from the base.
export type BlogOverride = LocalizedBodyOverride & {
  title?: string
  subtitle?: string
  description?: string
  excerpt?: string
  heroCaption?: string
}

// Shape of the Blog tab's UI chrome (index labels). The strings themselves are
// DATA in ../_data/{en,ru}.ts; this is just the contract.
export type BlogUi = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  indexTitle: string
  indexIntro: string
  breadcrumbBlog: string
  featured: string
  minRead: string
  read: string
  backToBlog: string
  titleSuffix: string
}

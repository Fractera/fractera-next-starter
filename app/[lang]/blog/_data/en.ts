import type { BlogUi } from '../_lib/types'

// English UI chrome for the Blog index (rule 4а — localized data, never hardcoded
// in _components). One file per language; index.ts exposes getBlogUi(lang).
export const en: BlogUi = {
  metaTitle: 'Blog | Fractera',
  metaDescription:
    'Field notes on agentic AI development, loop engineering and autonomous coding agents — from the team building an Open Code (source-available), self-hosted AI workspace.',
  eyebrow: 'Fractera blog',
  indexTitle: 'Building in loops',
  indexIntro:
    'Field notes on agentic AI development, loop engineering and autonomous coding agents — from the team building an Open Code (source-available), self-hosted AI workspace.',
  breadcrumbBlog: 'Blog',
  featured: 'Featured',
  minRead: 'min read',
  read: 'Read',
  backToBlog: 'Back to all articles',
  titleSuffix: 'Fractera Blog',
}

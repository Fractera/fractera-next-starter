import { meta } from './meta'
import { en } from './en'
import { ru } from './ru'
import type { BlogData } from '../../_lib/post'

// Bilingual blog post (en base + ru override). The post is the single source of
// truth for the page and the /blog index.
//
// TWO LANGUAGES ON PURPOSE (owner, 2026-08-11): the shipped posts are the
// PATTERN, not the content — en + ru is enough to show how a language cell
// works. A project with more languages falls back to `en` for this post, which
// is the same resolver every post uses (see lib/content/resolve.ts).
export const data: BlogData = { meta, en, overrides: { ru } }

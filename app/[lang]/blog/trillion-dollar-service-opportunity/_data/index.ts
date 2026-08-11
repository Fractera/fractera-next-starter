import { meta } from './meta'
import { en } from './en'
import { ru } from './ru'
import type { BlogData } from '../../_lib/post'

// Bilingual blog post (en base + ru override). The post is the single source of
// truth for the page and the /blog index.
export const data: BlogData = { meta, en, overrides: { ru } }

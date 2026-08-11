import { meta } from './meta'
import { en } from './en'
import type { BlogData } from '../../_lib/post'

// This post's _data — meta (non-translatable) + en base (EN-only: no ru override, so
// it falls back to EN everywhere). The post is the single source of truth for the
// page and the index.
export const data: BlogData = { meta, en }

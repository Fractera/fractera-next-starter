import { meta } from './meta'
import { en } from './en'
import { ru } from './ru'
import { es } from './es'
import { fr } from './fr'
import { it } from './it'
import { de } from './de'
import { pt } from './pt'
import { pl } from './pl'
import { tr } from './tr'
import { nl } from './nl'
import type { BlogData } from '../../_lib/post'

// Bilingual blog post (en base + ru override). The post is the single source of
// truth for the page and the /blog index.
export const data: BlogData = { meta, en, overrides: { ru, es, fr, it, de, pt, pl, tr, nl } }

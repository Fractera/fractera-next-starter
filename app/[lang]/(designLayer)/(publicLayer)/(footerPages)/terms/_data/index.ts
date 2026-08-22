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
import type { FooterPageData } from '@/lib/pages/footer-page'

export const data: FooterPageData = { meta, en, overrides: { ru, es, fr, it, de, pt, pl, tr, nl } }

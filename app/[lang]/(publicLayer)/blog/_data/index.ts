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
import type { BlogUi } from '../_lib/types'

// Public API of the Blog chrome _data: localized UI strings with EN fallback. Same
// co-location contract as every other _data folder (per-language files + index).
const UI: Record<string, BlogUi> = { en, ru, es, fr, it, de, pt, pl, tr, nl }

export function getBlogUi(lang: string): BlogUi {
  return UI[lang] ?? UI.en
}

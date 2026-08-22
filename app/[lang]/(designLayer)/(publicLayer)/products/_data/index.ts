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
import type { CatalogueUi } from '../_lib/types'

// Публичный вид данных каталога: слова на языке, с откатом на английский.
// Тот же договор, что у индекса блога (`blog/_data/index.ts`) — одна форма на
// обе коллекции, чтобы правка одной доезжала до другой без перевода в уме.
const UI: Record<string, CatalogueUi> = { en, ru, es, fr, it, de, pt, pl, tr, nl }

export function catalogueUi(lang: string): CatalogueUi {
  return UI[lang] ?? UI.en
}

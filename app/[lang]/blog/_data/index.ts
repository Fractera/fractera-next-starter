import { en } from './en'
import { ru } from './ru'
import type { BlogUi } from '../_lib/types'

// Public API of the Blog chrome _data: localized UI strings with EN fallback. Same
// co-location contract as every other _data folder (per-language files + index).
const UI: Record<string, BlogUi> = { en, ru }

export function getBlogUi(lang: string): BlogUi {
  return UI[lang] ?? UI.en
}

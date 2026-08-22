import { meta } from './meta'
import { en } from './en'
import { ru } from './ru'
import type { FooterPageData } from '@/lib/pages/footer-page'

// Языковых ячеек столько, сколько языков ВКЛЮЧЕНО в проекте
// (`NEXT_PUBLIC_SUPPORTED_LANGUAGES` — сейчас `en,ru`). Это полное решение, а не
// долг: строки одной страницы идут по включённому набору, а не по каталогу из 82
// языков. Включат третий — рядом ляжет третья ячейка, и больше ничего.
export const data: FooterPageData = { meta, en, overrides: { ru } }

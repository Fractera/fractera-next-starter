import type { CatalogueUi } from '../_lib/types'

// Английская основа слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const en: CatalogueUi = {
  eyebrow: 'Products',
  title: 'Products', subtitle: 'Everything we offer, in one place.', metaTitle: 'Products', metaDescription: 'Browse the full catalogue.', empty: 'The catalogue is empty for now.', loadMore: 'Show more', loading: 'Loading…', failed: 'Could not load more. Try again.', shown: 'Showing {shown} of {total}', backToCatalogue: 'Back to the catalogue',
}

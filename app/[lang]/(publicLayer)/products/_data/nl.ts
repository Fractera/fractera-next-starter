import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const nl: CatalogueUi = {
  eyebrow: 'Producten',
  title: 'Producten', subtitle: 'Alles wat we aanbieden, op één plek.', metaTitle: 'Producten', metaDescription: 'Blader door de volledige catalogus.', empty: 'De catalogus is voorlopig leeg.', loadMore: 'Meer tonen', loading: 'Bezig met laden…', failed: 'Kon niet meer laden. Probeer het opnieuw.', shown: '{shown} van {total} getoond', backToCatalogue: 'Terug naar de catalogus',
}

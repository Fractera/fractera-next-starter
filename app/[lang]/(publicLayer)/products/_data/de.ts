import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const de: CatalogueUi = {
  eyebrow: 'Produkte',
  title: 'Produkte', subtitle: 'Alles, was wir anbieten, an einem Ort.', metaTitle: 'Produkte', metaDescription: 'Durchstöbere den vollständigen Katalog.', empty: 'Der Katalog ist derzeit leer.', loadMore: 'Mehr anzeigen', loading: 'Lädt…', failed: 'Konnte nicht mehr laden. Versuche es erneut.', shown: '{shown} von {total} angezeigt', backToCatalogue: 'Zurück zum Katalog',
}

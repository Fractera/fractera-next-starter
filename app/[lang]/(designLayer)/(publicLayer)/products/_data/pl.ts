import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const pl: CatalogueUi = {
  eyebrow: 'Produkty',
  title: 'Produkty', subtitle: 'Wszystko, co oferujemy, w jednym miejscu.', metaTitle: 'Produkty', metaDescription: 'Przeglądaj pełny katalog.', empty: 'Katalog jest na razie pusty.', loadMore: 'Pokaż więcej', loading: 'Wczytywanie…', failed: 'Nie udało się wczytać więcej. Spróbuj ponownie.', shown: 'Pokazano {shown} z {total}', backToCatalogue: 'Powrót do katalogu',
}

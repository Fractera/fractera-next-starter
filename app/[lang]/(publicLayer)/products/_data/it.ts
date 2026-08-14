import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const it: CatalogueUi = {
  eyebrow: 'Prodotti',
  title: 'Prodotti', subtitle: 'Tutto quello che offriamo, in un unico posto.', metaTitle: 'Prodotti', metaDescription: 'Sfoglia il catalogo completo.', empty: 'Il catalogo è vuoto per ora.', loadMore: 'Mostra altro', loading: 'Caricamento…', failed: 'Impossibile caricare altro. Riprova.', shown: 'Mostrati {shown} di {total}', backToCatalogue: 'Torna al catalogo',
}

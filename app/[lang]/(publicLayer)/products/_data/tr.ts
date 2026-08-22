import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const tr: CatalogueUi = {
  eyebrow: 'Ürünler',
  title: 'Ürünler', subtitle: 'Sunduğumuz her şey, tek bir yerde.', metaTitle: 'Ürünler', metaDescription: 'Tüm kataloğa göz atın.', empty: 'Katalog şimdilik boş.', loadMore: 'Daha fazla göster', loading: 'Yükleniyor…', failed: 'Daha fazla yüklenemedi. Tekrar deneyin.', shown: '{total} üründen {shown} tanesi gösteriliyor', backToCatalogue: 'Kataloğa dön',
}

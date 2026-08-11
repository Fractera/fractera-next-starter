// Слова публичного каталога.
//
// 🕳 ДОЛГ: пока `en` + `ru`, а правило `/code/CLAUDE.md` §4д требует 82 языка.
// Довожу отдельной работой — прогон переводов тратит деньги владельца, и
// запускать его без прямого слова я больше не буду.

export type CatalogueUi = {
  title: string
  subtitle: string
  metaTitle: string
  metaDescription: string
  empty: string
  loadMore: string
  loading: string
  failed: string
  /** «Показано {shown} из {total}». */
  shown: string
  backToCatalogue: string
}

const UI: Record<string, CatalogueUi> = {
  en: { title: 'Products', subtitle: 'Everything we offer, in one place.', metaTitle: 'Products', metaDescription: 'Browse the full catalogue.', empty: 'The catalogue is empty for now.', loadMore: 'Show more', loading: 'Loading…', failed: 'Could not load more. Try again.', shown: 'Showing {shown} of {total}', backToCatalogue: 'Back to the catalogue' },
  ru: { title: 'Продукты', subtitle: 'Всё, что мы предлагаем, в одном месте.', metaTitle: 'Продукты', metaDescription: 'Полный каталог продуктов.', empty: 'Каталог пока пуст.', loadMore: 'Показать ещё', loading: 'Загружаю…', failed: 'Не удалось загрузить. Повторите.', shown: 'Показано {shown} из {total}', backToCatalogue: 'Назад в каталог' },
}

export function catalogueUi(lang: string): CatalogueUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

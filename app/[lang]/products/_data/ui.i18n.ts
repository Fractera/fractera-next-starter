// Слова публичного каталога.
//
// 🔒 ЯЗЫКОВ РОВНО СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО В ПАНЕЛИ, И ЭТО ПОЛНОЕ РЕШЕНИЕ.
// `NEXT_PUBLIC_SUPPORTED_LANGUAGES` = `en,ru`, поэтому здесь `en` и `ru`.
// Это строки ОДНОЙ страницы: они рождаются вместе с ней и умрут вместе с ней.
// Заводить им 82 языка впрок — платить за переводы того, чего сайт не
// показывает.
//
// 82 языка обязательны у ДРУГОГО рода строк — переиспользуемых: языковой
// переключатель, платформенные отказы (`lib/i18n/platform-errors.ts`), общие
// пустые состояния. Их никто не пишет заново под новый язык: владелец включает
// язык в панели, и они обязаны заговорить на нём в ту же минуту.

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

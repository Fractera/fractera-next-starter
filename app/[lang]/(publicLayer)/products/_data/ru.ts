import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const ru: CatalogueUi = {
  eyebrow: 'Продукты',
  title: 'Продукты', subtitle: 'Всё, что мы предлагаем, в одном месте.', metaTitle: 'Продукты', metaDescription: 'Полный каталог продуктов.', empty: 'Каталог пока пуст.', loadMore: 'Показать ещё', loading: 'Загружаю…', failed: 'Не удалось загрузить. Повторите.', shown: 'Показано {shown} из {total}', backToCatalogue: 'Назад в каталог',
}

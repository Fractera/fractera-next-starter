import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const es: CatalogueUi = {
  eyebrow: 'Productos',
  title: 'Productos', subtitle: 'Todo lo que ofrecemos, en un solo lugar.', metaTitle: 'Productos', metaDescription: 'Explora el catálogo completo.', empty: 'El catálogo está vacío por ahora.', loadMore: 'Mostrar más', loading: 'Cargando…', failed: 'No se pudo cargar más. Inténtalo de nuevo.', shown: 'Mostrando {shown} de {total}', backToCatalogue: 'Volver al catálogo',
}

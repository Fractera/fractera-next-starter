import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const pt: CatalogueUi = {
  eyebrow: 'Produtos',
  title: 'Produtos', subtitle: 'Tudo o que oferecemos, num só lugar.', metaTitle: 'Produtos', metaDescription: 'Explore o catálogo completo.', empty: 'O catálogo está vazio por agora.', loadMore: 'Mostrar mais', loading: 'A carregar…', failed: 'Não foi possível carregar mais. Tente novamente.', shown: 'A mostrar {shown} de {total}', backToCatalogue: 'Voltar ao catálogo',
}

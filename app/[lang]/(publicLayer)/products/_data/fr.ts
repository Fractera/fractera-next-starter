import type { CatalogueUi } from '../_lib/types'

// Языковая ячейка слов каталога. Форма — как у индекса блога:
// строки живут в ячейке языка, `index.ts` отдаёт их наружу одной функцией.
// `eyebrow` читает сканер меню (`lib/menu/group-menus.ts`) ТЕКСТОМ, без импорта.
export const fr: CatalogueUi = {
  eyebrow: 'Produits',
  title: 'Produits', subtitle: 'Tout ce que nous proposons, au même endroit.', metaTitle: 'Produits', metaDescription: 'Parcourez le catalogue complet.', empty: 'Le catalogue est vide pour le moment.', loadMore: 'Afficher plus', loading: 'Chargement…', failed: "Impossible de charger plus. Réessayez.", shown: 'Affichage de {shown} sur {total}', backToCatalogue: 'Retour au catalogue',
}

// Договор слов каталога — форма, как у индекса блога (`blog/_lib/types.ts`).
//
// 🔒 ТИП В `_lib`, СЛОВА В `_data` (шаг 508). До этого и то и другое лежало в
// одном файле `_data/ui.i18n.ts` — плоским словарём, тогда как блог и правовые
// страницы уже жили языковыми ячейками. Два способа хранить одно и то же значат,
// что агент обязан помнить, где какой, и ошибается он молча.
//
// Тип — КОД, поэтому `_lib`; слова — ДАННЫЕ, поэтому `_data`. Эта же черта
// проведена в `CONTENT-ENGINE.md` §3 и не размывается ни для одной поверхности.
export type CatalogueUi = {
  /** Подпись группы в меню. Её читает сканер меню текстом, без импорта. */
  eyebrow: string
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

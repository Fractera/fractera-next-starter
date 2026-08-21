// Слова таблицы цен — СВОИ (шаг 521, разбор 2026-08-21).
//
// 🔒 ОБЩИЙ СЛОВАРЬ ЗАСТАВЛЯЛ ЧЕТЫРЁХ ГОВОРИТЬ ОДИНАКОВО. Он лежал в
// `_data/products.i18n.ts` слоя и раздавал одни и те же строки бухгалтерии,
// магазину, каталогу и рабочему месту. Пока он один, эта таблица не может
// называть колонку «Цена закупки», а магазин — «Стоимость»: изменение ради
// одного слоя меняет слова у трёх остальных, и потому не делается.
//
// 🔒 ЧТО ИЗМЕНИЛОСЬ ПРИ ПЕРЕЕЗДЕ, кроме владельца файла: ушёл ключ `colPhoto`.
// У этой таблицы колонки фотографии нет, и общий словарь давал слово, которое
// страница глушила пустой строкой. Слово без места на экране — тот же мусор, что
// кнопка без действия.
//
// 🔒 ЯЗЫКОВ ДЕСЯТЬ, А НЕ 82 — РЕШЕНИЕ ВЛАДЕЛЬЦА 2026-08-21. Здесь стояла копия
// слоевого словаря на 82 языках; владелец сказал прямо: лишнего перевода виджету
// не нужно. Набор — страничный (en ru es fr it de pt pl tr nl), тот же, что у
// публичных страниц и каталога секций, и по той же причине (правило 4д): виджет
// принадлежит ОДНОМУ маршруту и не переиспользуется. Восемьдесят два обязаны
// нести переиспользуемые части продукта — ящик аккаунта, корзина, окна, — потому
// что они появляются в любом включённом языке сами. Виджет так не появляется.
//
// Цена решения названа честно: включит владелец японский — таблица цен ответит
// по-английски (откат в priceTableUi). Это осознанный размен, а не дыра.
//
// Слова сегодня дословно совпадают со слоевыми, но принадлежат виджету, и
// разойтись им теперь есть куда. В этом и была цель, а не в том, чтобы они
// отличались немедленно.

export type PriceTableUi = {
  /** Колонки таблицы. Фотографии здесь нет. */
  colName: string
  colPrice: string
  colId: string
  /** Состояния. */
  empty: string
  loading: string
  failed: string
  /** Счётчик: `{count}`. */
  count: string
  /** Управление. */
  tableTitle: string
  reveal: string
  revealHint: string
  searchPlaceholder: string
  find: string
  reset: string
  /** Подвал списка. */
  perPage: string
  prev: string
  next: string
  /** `{page}` из `{pages}`. */
  pageOf: string
  first: string
  last: string
}

const UI: Record<string, PriceTableUi> = {
  en: { colName: "Product", colPrice: "Price", colId: "ID", empty: "The catalogue is empty.", loading: "Loading…", failed: "Could not do that. Try again.", count: "{count} products", tableTitle: "Catalogue", reveal: "Show products", revealHint: "Nothing is requested until you ask — the page opens instantly and costs the database nothing.", searchPlaceholder: "Search by name…", find: "Find", reset: "Reset", perPage: "Per page", prev: "Back", next: "Forward", pageOf: "Page {page} of {pages}", first: "First", last: "Last" },
  ru: { colName: "Товар", colPrice: "Цена", colId: "Идентификатор", empty: "Каталог пуст.", loading: "Загружаю…", failed: "Не получилось. Повторите.", count: "Товаров: {count}", tableTitle: "Каталог", reveal: "Показать товары", revealHint: "Пока не попросите, ничего не запрашивается — страница открывается мгновенно и не стоит базе ничего.", searchPlaceholder: "Поиск по названию…", find: "Найти", reset: "Сбросить", perPage: "На странице", prev: "Назад", next: "Вперёд", pageOf: "Страница {page} из {pages}", first: "Первая", last: "Последняя" },
  es: { colName: "Producto", colPrice: "Precio", colId: "ID", empty: "El catálogo está vacío.", loading: "Cargando…", failed: "No se pudo. Inténtelo de nuevo.", count: "{count} productos", tableTitle: "Catálogo", reveal: "Mostrar productos", revealHint: "No se pide nada hasta que lo solicite: la página se abre al instante y no cuesta nada a la base de datos.", searchPlaceholder: "Buscar por nombre…", find: "Buscar", reset: "Restablecer", perPage: "Por página", prev: "Atrás", next: "Adelante", pageOf: "Página {page} de {pages}", first: "Primera", last: "Última" },
  fr: { colName: "Produit", colPrice: "Prix", colId: "ID", empty: "Le catalogue est vide.", loading: "Chargement…", failed: "Échec. Réessayez.", count: "{count} produits", tableTitle: "Catalogue", reveal: "Afficher les produits", revealHint: "Rien n’est demandé tant que vous ne le demandez pas — la page s’ouvre aussitôt et ne coûte rien à la base.", searchPlaceholder: "Rechercher par nom…", find: "Chercher", reset: "Réinitialiser", perPage: "Par page", prev: "Précédent", next: "Suivant", pageOf: "Page {page} sur {pages}", first: "Première", last: "Dernière" },
  it: { colName: "Prodotto", colPrice: "Prezzo", colId: "ID", empty: "Il catalogo è vuoto.", loading: "Caricamento…", failed: "Non è riuscito. Riprova.", count: "{count} prodotti", tableTitle: "Catalogo", reveal: "Mostra i prodotti", revealHint: "Non viene chiesto nulla finché non lo chiedi: la pagina si apre subito e non costa nulla al database.", searchPlaceholder: "Cerca per nome…", find: "Cerca", reset: "Reimposta", perPage: "Per pagina", prev: "Indietro", next: "Avanti", pageOf: "Pagina {page} di {pages}", first: "Prima", last: "Ultima" },
  de: { colName: "Produkt", colPrice: "Preis", colId: "ID", empty: "Der Katalog ist leer.", loading: "Wird geladen…", failed: "Hat nicht geklappt. Erneut versuchen.", count: "{count} Produkte", tableTitle: "Katalog", reveal: "Produkte anzeigen", revealHint: "Nichts wird abgefragt, bis Sie es verlangen — die Seite öffnet sofort und kostet die Datenbank nichts.", searchPlaceholder: "Nach Namen suchen…", find: "Suchen", reset: "Zurücksetzen", perPage: "Pro Seite", prev: "Zurück", next: "Weiter", pageOf: "Seite {page} von {pages}", first: "Erste", last: "Letzte" },
  pt: { colName: "Produto", colPrice: "Preço", colId: "ID", empty: "O catálogo está vazio.", loading: "Carregando…", failed: "Não deu certo. Tente de novo.", count: "{count} produtos", tableTitle: "Catálogo", reveal: "Mostrar produtos", revealHint: "Nada é solicitado até você pedir — a página abre na hora e não custa nada ao banco.", searchPlaceholder: "Buscar por nome…", find: "Buscar", reset: "Redefinir", perPage: "Por página", prev: "Voltar", next: "Avançar", pageOf: "Página {page} de {pages}", first: "Primeira", last: "Última" },
  pl: { colName: "Produkt", colPrice: "Cena", colId: "Identyfikator", empty: "Katalog jest pusty.", loading: "Ładowanie…", failed: "Nie udało się. Spróbuj ponownie.", count: "Produktów: {count}", tableTitle: "Katalog", reveal: "Pokaż produkty", revealHint: "Nic nie jest pobierane, dopóki nie poprosisz — strona otwiera się od razu i nic nie kosztuje bazy.", searchPlaceholder: "Szukaj po nazwie…", find: "Szukaj", reset: "Wyczyść", perPage: "Na stronie", prev: "Wstecz", next: "Dalej", pageOf: "Strona {page} z {pages}", first: "Pierwsza", last: "Ostatnia" },
  tr: { colName: "Ürün", colPrice: "Fiyat", colId: "Kimlik", empty: "Katalog boş.", loading: "Yükleniyor…", failed: "Olmadı. Tekrar deneyin.", count: "{count} ürün", tableTitle: "Katalog", reveal: "Ürünleri göster", revealHint: "Siz istemeden hiçbir şey sorgulanmaz — sayfa anında açılır ve veritabanına hiçbir şeye mal olmaz.", searchPlaceholder: "Ada göre ara…", find: "Bul", reset: "Sıfırla", perPage: "Sayfa başına", prev: "Geri", next: "İleri", pageOf: "Sayfa {page} / {pages}", first: "İlk", last: "Son" },
  nl: { colName: "Product", colPrice: "Prijs", colId: "ID", empty: "De catalogus is leeg.", loading: "Laden…", failed: "Het lukte niet. Probeer opnieuw.", count: "{count} producten", tableTitle: "Catalogus", reveal: "Producten tonen", revealHint: "Er wordt niets opgevraagd tot u erom vraagt — de pagina opent meteen en kost de database niets.", searchPlaceholder: "Zoek op naam…", find: "Zoeken", reset: "Herstellen", perPage: "Per pagina", prev: "Terug", next: "Verder", pageOf: "Pagina {page} van {pages}", first: "Eerste", last: "Laatste" },
}

export function priceTableUi(lang: string): PriceTableUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

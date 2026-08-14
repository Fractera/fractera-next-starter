// Слова публичного каталога.
//
// 🔒 ЯЗЫКОВ РОВНО СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО, И ЭТО ПОЛНОЕ РЕШЕНИЕ.
// Здесь десять — тот же набор, что у главной страницы и что включён на сервере
// (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`). До шага 507 стояло два, и это было
// написано как «полное решение» — верно по форме и неверно по факту: на сервере
// давно было включено десять, то есть на восьми языках каталог представлялся
// английскими словами. Число здесь обязано следовать за включённым набором, а
// сторож (`npm run check:i18n`, число 10) не даёт ему снова отстать.
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
  es: { title: 'Productos', subtitle: 'Todo lo que ofrecemos, en un solo lugar.', metaTitle: 'Productos', metaDescription: 'Explora el catálogo completo.', empty: 'El catálogo está vacío por ahora.', loadMore: 'Mostrar más', loading: 'Cargando…', failed: 'No se pudo cargar más. Inténtalo de nuevo.', shown: 'Mostrando {shown} de {total}', backToCatalogue: 'Volver al catálogo' },
  fr: { title: 'Produits', subtitle: 'Tout ce que nous proposons, au même endroit.', metaTitle: 'Produits', metaDescription: 'Parcourez le catalogue complet.', empty: 'Le catalogue est vide pour le moment.', loadMore: 'Afficher plus', loading: 'Chargement…', failed: "Impossible de charger plus. Réessayez.", shown: 'Affichage de {shown} sur {total}', backToCatalogue: 'Retour au catalogue' },
  it: { title: 'Prodotti', subtitle: 'Tutto quello che offriamo, in un unico posto.', metaTitle: 'Prodotti', metaDescription: 'Sfoglia il catalogo completo.', empty: 'Il catalogo è vuoto per ora.', loadMore: 'Mostra altro', loading: 'Caricamento…', failed: 'Impossibile caricare altro. Riprova.', shown: 'Mostrati {shown} di {total}', backToCatalogue: 'Torna al catalogo' },
  de: { title: 'Produkte', subtitle: 'Alles, was wir anbieten, an einem Ort.', metaTitle: 'Produkte', metaDescription: 'Durchstöbere den vollständigen Katalog.', empty: 'Der Katalog ist derzeit leer.', loadMore: 'Mehr anzeigen', loading: 'Lädt…', failed: 'Konnte nicht mehr laden. Versuche es erneut.', shown: '{shown} von {total} angezeigt', backToCatalogue: 'Zurück zum Katalog' },
  pt: { title: 'Produtos', subtitle: 'Tudo o que oferecemos, num só lugar.', metaTitle: 'Produtos', metaDescription: 'Explore o catálogo completo.', empty: 'O catálogo está vazio por agora.', loadMore: 'Mostrar mais', loading: 'A carregar…', failed: 'Não foi possível carregar mais. Tente novamente.', shown: 'A mostrar {shown} de {total}', backToCatalogue: 'Voltar ao catálogo' },
  pl: { title: 'Produkty', subtitle: 'Wszystko, co oferujemy, w jednym miejscu.', metaTitle: 'Produkty', metaDescription: 'Przeglądaj pełny katalog.', empty: 'Katalog jest na razie pusty.', loadMore: 'Pokaż więcej', loading: 'Wczytywanie…', failed: 'Nie udało się wczytać więcej. Spróbuj ponownie.', shown: 'Pokazano {shown} z {total}', backToCatalogue: 'Powrót do katalogu' },
  tr: { title: 'Ürünler', subtitle: 'Sunduğumuz her şey, tek bir yerde.', metaTitle: 'Ürünler', metaDescription: 'Tüm kataloğa göz atın.', empty: 'Katalog şimdilik boş.', loadMore: 'Daha fazla göster', loading: 'Yükleniyor…', failed: 'Daha fazla yüklenemedi. Tekrar deneyin.', shown: '{total} üründen {shown} tanesi gösteriliyor', backToCatalogue: 'Kataloğa dön' },
  nl: { title: 'Producten', subtitle: 'Alles wat we aanbieden, op één plek.', metaTitle: 'Producten', metaDescription: 'Blader door de volledige catalogus.', empty: 'De catalogus is voorlopig leeg.', loadMore: 'Meer tonen', loading: 'Bezig met laden…', failed: 'Kon niet meer laden. Probeer het opnieuw.', shown: '{shown} van {total} getoond', backToCatalogue: 'Terug naar de catalogus' },
}

export function catalogueUi(lang: string): CatalogueUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

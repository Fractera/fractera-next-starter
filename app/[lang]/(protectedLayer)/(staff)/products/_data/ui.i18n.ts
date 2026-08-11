// Words of the catalogue page. Co-located in `_data` because localized UI
// strings are DATA — the same rule the content tabs follow.
//
// Ten languages, the set the rest of this project ships. Nothing here is
// optional: a string typed straight into JSX is invisible to translation and
// stays English on every other market forever.

export type ProductsUi = {
  /** Заголовок страницы — статический, уезжает в предрендер. */
  title: string
  /** Описание под заголовком — тоже статическое. */
  subtitle: string
  /** Кнопка, открывающая динамический контейнер. */
  reveal: string
  /** Подпись под кнопкой: почему данные не показаны сразу. */
  revealHint: string
  /** Пока данные едут. */
  loading: string
  /** Заголовок раздела с таблицей. */
  tableTitle: string
  /** Каталог пуст. */
  empty: string
  /** Строка со счётчиком: `{count}`. */
  count: string
  /** Кнопки формы. */
  add: string
  cancelAdd: string
  newProduct: string
  name: string
  price: string
  uploadPhoto: string
  save: string
  /** Колонки таблицы. */
  colPhoto: string
  colName: string
  colPrice: string
  colId: string
  /** Тосты. */
  created: string
  deleted: string
  failed: string
  /** Подпись о том, где лежат данные. */
  storageNote: string
  /** Поиск и страницы. */
  searchPlaceholder: string
  find: string
  reset: string
  nothingFound: string
  perPage: string
  prev: string
  next: string
  first: string
  last: string
  pageOf: string
  /** Правка полей карточки. */
  edit: string
  saveField: string
  cancelEdit: string
  fieldSaved: string
  baseValue: string
  translation: string
  descriptionField: string
  /** Карточка одного продукта. */
  one: string
  back: string
  notFoundTitle: string
  notFoundBody: string
  errorTitle: string
  errorBody: string
  retry: string
}

const UI: Record<string, ProductsUi> = {
  en: { title: 'Product catalogue', subtitle: 'Create products and add them to the catalogue. Backed by the database and the media service.', reveal: 'Show the catalogue', revealHint: 'The rows are loaded on request — the page itself opens without waiting for the database.', loading: 'Loading…', tableTitle: 'Products', empty: 'The catalogue is empty. Add the first product.', count: '{count} products', add: 'Add product', cancelAdd: 'Cancel', newProduct: 'New product', name: 'Product name', price: 'Price', uploadPhoto: 'Upload photo', save: 'Save', colPhoto: 'Photo', colName: 'Name', colPrice: 'Price', colId: 'ID', created: 'Product created', deleted: 'Product deleted', failed: 'Could not do that', storageNote: 'Rows in the database, images in the media service.', searchPlaceholder: 'Search by name or description', find: 'Find', reset: 'Reset', nothingFound: 'Nothing matches that search.', perPage: 'Per page', prev: 'Previous', next: 'Next', first: 'First page', last: 'Last page', pageOf: 'Page {page} of {pages}', edit: 'Edit', saveField: 'Save', cancelEdit: 'Cancel', fieldSaved: 'Saved', baseValue: 'Base (English)', translation: 'Translation', descriptionField: 'Description', one: 'Product', back: 'Back to the catalogue', notFoundTitle: 'No such product', notFoundBody: 'It was deleted, or the address is wrong.', errorTitle: 'Something broke on this page', errorBody: 'The catalogue itself is fine — this screen failed. Try again.', retry: 'Try again' },
  ru: { title: 'Каталог продуктов', subtitle: 'Создавайте продукты и добавляйте их в каталог. Данные — в базе, изображения — в медиа-службе.', reveal: 'Показать каталог', revealHint: 'Строки загружаются по требованию — сама страница открывается, не дожидаясь базы.', loading: 'Загружаю…', tableTitle: 'Продукты', empty: 'Каталог пуст. Добавьте первый продукт.', count: 'Продуктов: {count}', add: 'Добавить продукт', cancelAdd: 'Отмена', newProduct: 'Новый продукт', name: 'Название', price: 'Цена', uploadPhoto: 'Загрузить фото', save: 'Сохранить', colPhoto: 'Фото', colName: 'Название', colPrice: 'Цена', colId: 'ID', created: 'Продукт создан', deleted: 'Продукт удалён', failed: 'Не удалось', storageNote: 'Строки в базе, изображения в медиа-службе.', searchPlaceholder: 'Поиск по названию или описанию', find: 'Найти', reset: 'Сбросить', nothingFound: 'По этому запросу ничего нет.', perPage: 'На странице', prev: 'Назад', next: 'Вперёд', first: 'Первая страница', last: 'Последняя страница', pageOf: 'Страница {page} из {pages}', edit: 'Изменить', saveField: 'Сохранить', cancelEdit: 'Отмена', fieldSaved: 'Сохранено', baseValue: 'Базовое (английский)', translation: 'Перевод', descriptionField: 'Описание', one: 'Продукт', back: 'Назад в каталог', notFoundTitle: 'Такого продукта нет', notFoundBody: 'Он удалён, либо адрес неверный.', errorTitle: 'На этой странице что-то сломалось', errorBody: 'Сам каталог цел — не отработал этот экран. Попробуйте ещё раз.', retry: 'Повторить' },
  es: { title: 'Catálogo de productos', subtitle: 'Crea productos y añádelos al catálogo. Respaldado por la base de datos y el servicio de medios.', reveal: 'Mostrar el catálogo', revealHint: 'Las filas se cargan bajo petición: la página se abre sin esperar a la base de datos.', loading: 'Cargando…', tableTitle: 'Productos', empty: 'El catálogo está vacío. Añade el primer producto.', count: '{count} productos', add: 'Añadir producto', cancelAdd: 'Cancelar', newProduct: 'Nuevo producto', name: 'Nombre', price: 'Precio', uploadPhoto: 'Subir foto', save: 'Guardar', colPhoto: 'Foto', colName: 'Nombre', colPrice: 'Precio', colId: 'ID', created: 'Producto creado', deleted: 'Producto eliminado', failed: 'No se pudo', storageNote: 'Filas en la base de datos, imágenes en el servicio de medios.', searchPlaceholder: 'Buscar por nombre o descripción', find: 'Buscar', reset: 'Restablecer', nothingFound: 'No hay resultados para esa búsqueda.', perPage: 'Por página', prev: 'Anterior', next: 'Siguiente', first: 'Primera página', last: 'Última página', pageOf: 'Página {page} de {pages}', edit: 'Editar', saveField: 'Guardar', cancelEdit: 'Cancelar', fieldSaved: 'Guardado', baseValue: 'Base (inglés)', translation: 'Traducción', descriptionField: 'Descripción', one: 'Producto', back: 'Volver al catálogo', notFoundTitle: 'No existe ese producto', notFoundBody: 'Fue eliminado o la dirección es incorrecta.', errorTitle: 'Algo se rompió en esta página', errorBody: 'El catálogo está bien; falló esta pantalla. Inténtalo de nuevo.', retry: 'Reintentar' },
  fr: { title: 'Catalogue de produits', subtitle: 'Créez des produits et ajoutez-les au catalogue. Adossé à la base de données et au service média.', reveal: 'Afficher le catalogue', revealHint: 'Les lignes sont chargées à la demande — la page s’ouvre sans attendre la base.', loading: 'Chargement…', tableTitle: 'Produits', empty: 'Le catalogue est vide. Ajoutez le premier produit.', count: '{count} produits', add: 'Ajouter un produit', cancelAdd: 'Annuler', newProduct: 'Nouveau produit', name: 'Nom', price: 'Prix', uploadPhoto: 'Téléverser une photo', save: 'Enregistrer', colPhoto: 'Photo', colName: 'Nom', colPrice: 'Prix', colId: 'ID', created: 'Produit créé', deleted: 'Produit supprimé', failed: 'Échec', storageNote: 'Lignes en base, images dans le service média.', searchPlaceholder: 'Rechercher par nom ou description', find: 'Rechercher', reset: 'Réinitialiser', nothingFound: 'Aucun résultat pour cette recherche.', perPage: 'Par page', prev: 'Précédent', next: 'Suivant', first: 'Première page', last: 'Dernière page', pageOf: 'Page {page} sur {pages}', edit: 'Modifier', saveField: 'Enregistrer', cancelEdit: 'Annuler', fieldSaved: 'Enregistré', baseValue: 'Base (anglais)', translation: 'Traduction', descriptionField: 'Description', one: 'Produit', back: 'Retour au catalogue', notFoundTitle: 'Ce produit n’existe pas', notFoundBody: 'Il a été supprimé ou l’adresse est erronée.', errorTitle: 'Quelque chose a cassé sur cette page', errorBody: 'Le catalogue va bien — cet écran a échoué. Réessayez.', retry: 'Réessayer' },
  it: { title: 'Catalogo prodotti', subtitle: 'Crea prodotti e aggiungili al catalogo. Basato sul database e sul servizio media.', reveal: 'Mostra il catalogo', revealHint: 'Le righe si caricano su richiesta: la pagina si apre senza attendere il database.', loading: 'Caricamento…', tableTitle: 'Prodotti', empty: 'Il catalogo è vuoto. Aggiungi il primo prodotto.', count: '{count} prodotti', add: 'Aggiungi prodotto', cancelAdd: 'Annulla', newProduct: 'Nuovo prodotto', name: 'Nome', price: 'Prezzo', uploadPhoto: 'Carica foto', save: 'Salva', colPhoto: 'Foto', colName: 'Nome', colPrice: 'Prezzo', colId: 'ID', created: 'Prodotto creato', deleted: 'Prodotto eliminato', failed: 'Operazione non riuscita', storageNote: 'Righe nel database, immagini nel servizio media.', searchPlaceholder: 'Cerca per nome o descrizione', find: 'Cerca', reset: 'Reimposta', nothingFound: 'Nessun risultato per questa ricerca.', perPage: 'Per pagina', prev: 'Precedente', next: 'Successivo', first: 'Prima pagina', last: 'Ultima pagina', pageOf: 'Pagina {page} di {pages}', edit: 'Modifica', saveField: 'Salva', cancelEdit: 'Annulla', fieldSaved: 'Salvato', baseValue: 'Base (inglese)', translation: 'Traduzione', descriptionField: 'Descrizione', one: 'Prodotto', back: 'Torna al catalogo', notFoundTitle: 'Questo prodotto non esiste', notFoundBody: 'È stato eliminato o l’indirizzo è errato.', errorTitle: 'Qualcosa si è rotto in questa pagina', errorBody: 'Il catalogo è a posto: è fallita questa schermata. Riprova.', retry: 'Riprova' },
  de: { title: 'Produktkatalog', subtitle: 'Legen Sie Produkte an und fügen Sie sie dem Katalog hinzu. Gestützt auf Datenbank und Medien-Dienst.', reveal: 'Katalog anzeigen', revealHint: 'Die Zeilen werden auf Anfrage geladen — die Seite öffnet sich ohne Wartezeit.', loading: 'Wird geladen…', tableTitle: 'Produkte', empty: 'Der Katalog ist leer. Legen Sie das erste Produkt an.', count: '{count} Produkte', add: 'Produkt hinzufügen', cancelAdd: 'Abbrechen', newProduct: 'Neues Produkt', name: 'Name', price: 'Preis', uploadPhoto: 'Foto hochladen', save: 'Speichern', colPhoto: 'Foto', colName: 'Name', colPrice: 'Preis', colId: 'ID', created: 'Produkt erstellt', deleted: 'Produkt gelöscht', failed: 'Fehlgeschlagen', storageNote: 'Zeilen in der Datenbank, Bilder im Medien-Dienst.', searchPlaceholder: 'Nach Name oder Beschreibung suchen', find: 'Suchen', reset: 'Zurücksetzen', nothingFound: 'Keine Treffer für diese Suche.', perPage: 'Pro Seite', prev: 'Zurück', next: 'Weiter', first: 'Erste Seite', last: 'Letzte Seite', pageOf: 'Seite {page} von {pages}', edit: 'Bearbeiten', saveField: 'Speichern', cancelEdit: 'Abbrechen', fieldSaved: 'Gespeichert', baseValue: 'Basis (Englisch)', translation: 'Übersetzung', descriptionField: 'Beschreibung', one: 'Produkt', back: 'Zurück zum Katalog', notFoundTitle: 'Dieses Produkt gibt es nicht', notFoundBody: 'Es wurde gelöscht, oder die Adresse stimmt nicht.', errorTitle: 'Auf dieser Seite ist etwas kaputtgegangen', errorBody: 'Der Katalog ist in Ordnung — dieser Bildschirm nicht. Versuchen Sie es erneut.', retry: 'Erneut versuchen' },
  pt: { title: 'Catálogo de produtos', subtitle: 'Crie produtos e adicione-os ao catálogo. Apoiado no banco de dados e no serviço de mídia.', reveal: 'Mostrar o catálogo', revealHint: 'As linhas são carregadas sob demanda — a página abre sem esperar o banco.', loading: 'Carregando…', tableTitle: 'Produtos', empty: 'O catálogo está vazio. Adicione o primeiro produto.', count: '{count} produtos', add: 'Adicionar produto', cancelAdd: 'Cancelar', newProduct: 'Novo produto', name: 'Nome', price: 'Preço', uploadPhoto: 'Enviar foto', save: 'Salvar', colPhoto: 'Foto', colName: 'Nome', colPrice: 'Preço', colId: 'ID', created: 'Produto criado', deleted: 'Produto excluído', failed: 'Não foi possível', storageNote: 'Linhas no banco, imagens no serviço de mídia.', searchPlaceholder: 'Buscar por nome ou descrição', find: 'Buscar', reset: 'Limpar', nothingFound: 'Nada corresponde a essa busca.', perPage: 'Por página', prev: 'Anterior', next: 'Próxima', first: 'Primeira página', last: 'Última página', pageOf: 'Página {page} de {pages}', edit: 'Editar', saveField: 'Salvar', cancelEdit: 'Cancelar', fieldSaved: 'Salvo', baseValue: 'Base (inglês)', translation: 'Tradução', descriptionField: 'Descrição', one: 'Produto', back: 'Voltar ao catálogo', notFoundTitle: 'Esse produto não existe', notFoundBody: 'Foi excluído ou o endereço está errado.', errorTitle: 'Algo quebrou nesta página', errorBody: 'O catálogo está bem — esta tela falhou. Tente de novo.', retry: 'Tentar de novo' },
  pl: { title: 'Katalog produktów', subtitle: 'Twórz produkty i dodawaj je do katalogu. Oparte na bazie danych i usłudze mediów.', reveal: 'Pokaż katalog', revealHint: 'Wiersze ładują się na żądanie — strona otwiera się bez czekania na bazę.', loading: 'Ładowanie…', tableTitle: 'Produkty', empty: 'Katalog jest pusty. Dodaj pierwszy produkt.', count: 'Produkty: {count}', add: 'Dodaj produkt', cancelAdd: 'Anuluj', newProduct: 'Nowy produkt', name: 'Nazwa', price: 'Cena', uploadPhoto: 'Prześlij zdjęcie', save: 'Zapisz', colPhoto: 'Zdjęcie', colName: 'Nazwa', colPrice: 'Cena', colId: 'ID', created: 'Produkt utworzony', deleted: 'Produkt usunięty', failed: 'Nie udało się', storageNote: 'Wiersze w bazie, obrazy w usłudze mediów.', searchPlaceholder: 'Szukaj po nazwie lub opisie', find: 'Szukaj', reset: 'Wyczyść', nothingFound: 'Brak wyników dla tego zapytania.', perPage: 'Na stronie', prev: 'Wstecz', next: 'Dalej', first: 'Pierwsza strona', last: 'Ostatnia strona', pageOf: 'Strona {page} z {pages}', edit: 'Edytuj', saveField: 'Zapisz', cancelEdit: 'Anuluj', fieldSaved: 'Zapisano', baseValue: 'Podstawa (angielski)', translation: 'Tłumaczenie', descriptionField: 'Opis', one: 'Produkt', back: 'Wróć do katalogu', notFoundTitle: 'Nie ma takiego produktu', notFoundBody: 'Został usunięty albo adres jest błędny.', errorTitle: 'Coś się zepsuło na tej stronie', errorBody: 'Katalog jest sprawny — zawiódł ten ekran. Spróbuj ponownie.', retry: 'Spróbuj ponownie' },
  tr: { title: 'Ürün kataloğu', subtitle: 'Ürün oluşturun ve kataloğa ekleyin. Veritabanı ve medya servisiyle desteklenir.', reveal: 'Kataloğu göster', revealHint: 'Satırlar istek üzerine yüklenir — sayfa veritabanını beklemeden açılır.', loading: 'Yükleniyor…', tableTitle: 'Ürünler', empty: 'Katalog boş. İlk ürünü ekleyin.', count: '{count} ürün', add: 'Ürün ekle', cancelAdd: 'İptal', newProduct: 'Yeni ürün', name: 'Ad', price: 'Fiyat', uploadPhoto: 'Fotoğraf yükle', save: 'Kaydet', colPhoto: 'Fotoğraf', colName: 'Ad', colPrice: 'Fiyat', colId: 'ID', created: 'Ürün oluşturuldu', deleted: 'Ürün silindi', failed: 'Başarısız', storageNote: 'Satırlar veritabanında, görseller medya servisinde.', searchPlaceholder: 'Ada veya açıklamaya göre ara', find: 'Ara', reset: 'Sıfırla', nothingFound: 'Bu aramaya uyan kayıt yok.', perPage: 'Sayfa başına', prev: 'Önceki', next: 'Sonraki', first: 'İlk sayfa', last: 'Son sayfa', pageOf: 'Sayfa {page} / {pages}', edit: 'Düzenle', saveField: 'Kaydet', cancelEdit: 'İptal', fieldSaved: 'Kaydedildi', baseValue: 'Temel (İngilizce)', translation: 'Çeviri', descriptionField: 'Açıklama', one: 'Ürün', back: 'Kataloğa dön', notFoundTitle: 'Böyle bir ürün yok', notFoundBody: 'Silinmiş ya da adres yanlış.', errorTitle: 'Bu sayfada bir şey bozuldu', errorBody: 'Katalog sağlam — bu ekran hata verdi. Yeniden deneyin.', retry: 'Yeniden dene' },
  nl: { title: 'Productcatalogus', subtitle: 'Maak producten aan en voeg ze toe aan de catalogus. Ondersteund door de database en de mediadienst.', reveal: 'Catalogus tonen', revealHint: 'De rijen worden op verzoek geladen — de pagina opent zonder op de database te wachten.', loading: 'Laden…', tableTitle: 'Producten', empty: 'De catalogus is leeg. Voeg het eerste product toe.', count: '{count} producten', add: 'Product toevoegen', cancelAdd: 'Annuleren', newProduct: 'Nieuw product', name: 'Naam', price: 'Prijs', uploadPhoto: 'Foto uploaden', save: 'Opslaan', colPhoto: 'Foto', colName: 'Naam', colPrice: 'Prijs', colId: 'ID', created: 'Product aangemaakt', deleted: 'Product verwijderd', failed: 'Niet gelukt', storageNote: 'Rijen in de database, afbeeldingen in de mediadienst.', searchPlaceholder: 'Zoek op naam of omschrijving', find: 'Zoeken', reset: 'Wissen', nothingFound: 'Geen resultaten voor die zoekopdracht.', perPage: 'Per pagina', prev: 'Vorige', next: 'Volgende', first: 'Eerste pagina', last: 'Laatste pagina', pageOf: 'Pagina {page} van {pages}', edit: 'Bewerken', saveField: 'Opslaan', cancelEdit: 'Annuleren', fieldSaved: 'Opgeslagen', baseValue: 'Basis (Engels)', translation: 'Vertaling', descriptionField: 'Omschrijving', one: 'Product', back: 'Terug naar de catalogus', notFoundTitle: 'Dit product bestaat niet', notFoundBody: 'Het is verwijderd, of het adres klopt niet.', errorTitle: 'Er ging iets stuk op deze pagina', errorBody: 'De catalogus is in orde — dit scherm faalde. Probeer het opnieuw.', retry: 'Opnieuw proberen' },
}

export function productsUi(lang: string): ProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

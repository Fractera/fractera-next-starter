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
}

const UI: Record<string, ProductsUi> = {
  en: { title: 'Product catalogue', subtitle: 'Create products and add them to the catalogue. Backed by the database and the media service.', reveal: 'Show the catalogue', revealHint: 'The rows are loaded on request — the page itself opens without waiting for the database.', loading: 'Loading…', tableTitle: 'Products', empty: 'The catalogue is empty. Add the first product.', count: '{count} products', add: 'Add product', cancelAdd: 'Cancel', newProduct: 'New product', name: 'Product name', price: 'Price', uploadPhoto: 'Upload photo', save: 'Save', colPhoto: 'Photo', colName: 'Name', colPrice: 'Price', colId: 'ID', created: 'Product created', deleted: 'Product deleted', failed: 'Could not do that', storageNote: 'Rows in the database, images in the media service.' },
  ru: { title: 'Каталог продуктов', subtitle: 'Создавайте продукты и добавляйте их в каталог. Данные — в базе, изображения — в медиа-службе.', reveal: 'Показать каталог', revealHint: 'Строки загружаются по требованию — сама страница открывается, не дожидаясь базы.', loading: 'Загружаю…', tableTitle: 'Продукты', empty: 'Каталог пуст. Добавьте первый продукт.', count: 'Продуктов: {count}', add: 'Добавить продукт', cancelAdd: 'Отмена', newProduct: 'Новый продукт', name: 'Название', price: 'Цена', uploadPhoto: 'Загрузить фото', save: 'Сохранить', colPhoto: 'Фото', colName: 'Название', colPrice: 'Цена', colId: 'ID', created: 'Продукт создан', deleted: 'Продукт удалён', failed: 'Не удалось', storageNote: 'Строки в базе, изображения в медиа-службе.' },
  es: { title: 'Catálogo de productos', subtitle: 'Crea productos y añádelos al catálogo. Respaldado por la base de datos y el servicio de medios.', reveal: 'Mostrar el catálogo', revealHint: 'Las filas se cargan bajo petición: la página se abre sin esperar a la base de datos.', loading: 'Cargando…', tableTitle: 'Productos', empty: 'El catálogo está vacío. Añade el primer producto.', count: '{count} productos', add: 'Añadir producto', cancelAdd: 'Cancelar', newProduct: 'Nuevo producto', name: 'Nombre', price: 'Precio', uploadPhoto: 'Subir foto', save: 'Guardar', colPhoto: 'Foto', colName: 'Nombre', colPrice: 'Precio', colId: 'ID', created: 'Producto creado', deleted: 'Producto eliminado', failed: 'No se pudo', storageNote: 'Filas en la base de datos, imágenes en el servicio de medios.' },
  fr: { title: 'Catalogue de produits', subtitle: 'Créez des produits et ajoutez-les au catalogue. Adossé à la base de données et au service média.', reveal: 'Afficher le catalogue', revealHint: 'Les lignes sont chargées à la demande — la page s’ouvre sans attendre la base.', loading: 'Chargement…', tableTitle: 'Produits', empty: 'Le catalogue est vide. Ajoutez le premier produit.', count: '{count} produits', add: 'Ajouter un produit', cancelAdd: 'Annuler', newProduct: 'Nouveau produit', name: 'Nom', price: 'Prix', uploadPhoto: 'Téléverser une photo', save: 'Enregistrer', colPhoto: 'Photo', colName: 'Nom', colPrice: 'Prix', colId: 'ID', created: 'Produit créé', deleted: 'Produit supprimé', failed: 'Échec', storageNote: 'Lignes en base, images dans le service média.' },
  it: { title: 'Catalogo prodotti', subtitle: 'Crea prodotti e aggiungili al catalogo. Basato sul database e sul servizio media.', reveal: 'Mostra il catalogo', revealHint: 'Le righe si caricano su richiesta: la pagina si apre senza attendere il database.', loading: 'Caricamento…', tableTitle: 'Prodotti', empty: 'Il catalogo è vuoto. Aggiungi il primo prodotto.', count: '{count} prodotti', add: 'Aggiungi prodotto', cancelAdd: 'Annulla', newProduct: 'Nuovo prodotto', name: 'Nome', price: 'Prezzo', uploadPhoto: 'Carica foto', save: 'Salva', colPhoto: 'Foto', colName: 'Nome', colPrice: 'Prezzo', colId: 'ID', created: 'Prodotto creato', deleted: 'Prodotto eliminato', failed: 'Operazione non riuscita', storageNote: 'Righe nel database, immagini nel servizio media.' },
  de: { title: 'Produktkatalog', subtitle: 'Legen Sie Produkte an und fügen Sie sie dem Katalog hinzu. Gestützt auf Datenbank und Medien-Dienst.', reveal: 'Katalog anzeigen', revealHint: 'Die Zeilen werden auf Anfrage geladen — die Seite öffnet sich ohne Wartezeit.', loading: 'Wird geladen…', tableTitle: 'Produkte', empty: 'Der Katalog ist leer. Legen Sie das erste Produkt an.', count: '{count} Produkte', add: 'Produkt hinzufügen', cancelAdd: 'Abbrechen', newProduct: 'Neues Produkt', name: 'Name', price: 'Preis', uploadPhoto: 'Foto hochladen', save: 'Speichern', colPhoto: 'Foto', colName: 'Name', colPrice: 'Preis', colId: 'ID', created: 'Produkt erstellt', deleted: 'Produkt gelöscht', failed: 'Fehlgeschlagen', storageNote: 'Zeilen in der Datenbank, Bilder im Medien-Dienst.' },
  pt: { title: 'Catálogo de produtos', subtitle: 'Crie produtos e adicione-os ao catálogo. Apoiado no banco de dados e no serviço de mídia.', reveal: 'Mostrar o catálogo', revealHint: 'As linhas são carregadas sob demanda — a página abre sem esperar o banco.', loading: 'Carregando…', tableTitle: 'Produtos', empty: 'O catálogo está vazio. Adicione o primeiro produto.', count: '{count} produtos', add: 'Adicionar produto', cancelAdd: 'Cancelar', newProduct: 'Novo produto', name: 'Nome', price: 'Preço', uploadPhoto: 'Enviar foto', save: 'Salvar', colPhoto: 'Foto', colName: 'Nome', colPrice: 'Preço', colId: 'ID', created: 'Produto criado', deleted: 'Produto excluído', failed: 'Não foi possível', storageNote: 'Linhas no banco, imagens no serviço de mídia.' },
  pl: { title: 'Katalog produktów', subtitle: 'Twórz produkty i dodawaj je do katalogu. Oparte na bazie danych i usłudze mediów.', reveal: 'Pokaż katalog', revealHint: 'Wiersze ładują się na żądanie — strona otwiera się bez czekania na bazę.', loading: 'Ładowanie…', tableTitle: 'Produkty', empty: 'Katalog jest pusty. Dodaj pierwszy produkt.', count: 'Produkty: {count}', add: 'Dodaj produkt', cancelAdd: 'Anuluj', newProduct: 'Nowy produkt', name: 'Nazwa', price: 'Cena', uploadPhoto: 'Prześlij zdjęcie', save: 'Zapisz', colPhoto: 'Zdjęcie', colName: 'Nazwa', colPrice: 'Cena', colId: 'ID', created: 'Produkt utworzony', deleted: 'Produkt usunięty', failed: 'Nie udało się', storageNote: 'Wiersze w bazie, obrazy w usłudze mediów.' },
  tr: { title: 'Ürün kataloğu', subtitle: 'Ürün oluşturun ve kataloğa ekleyin. Veritabanı ve medya servisiyle desteklenir.', reveal: 'Kataloğu göster', revealHint: 'Satırlar istek üzerine yüklenir — sayfa veritabanını beklemeden açılır.', loading: 'Yükleniyor…', tableTitle: 'Ürünler', empty: 'Katalog boş. İlk ürünü ekleyin.', count: '{count} ürün', add: 'Ürün ekle', cancelAdd: 'İptal', newProduct: 'Yeni ürün', name: 'Ad', price: 'Fiyat', uploadPhoto: 'Fotoğraf yükle', save: 'Kaydet', colPhoto: 'Fotoğraf', colName: 'Ad', colPrice: 'Fiyat', colId: 'ID', created: 'Ürün oluşturuldu', deleted: 'Ürün silindi', failed: 'Başarısız', storageNote: 'Satırlar veritabanında, görseller medya servisinde.' },
  nl: { title: 'Productcatalogus', subtitle: 'Maak producten aan en voeg ze toe aan de catalogus. Ondersteund door de database en de mediadienst.', reveal: 'Catalogus tonen', revealHint: 'De rijen worden op verzoek geladen — de pagina opent zonder op de database te wachten.', loading: 'Laden…', tableTitle: 'Producten', empty: 'De catalogus is leeg. Voeg het eerste product toe.', count: '{count} producten', add: 'Product toevoegen', cancelAdd: 'Annuleren', newProduct: 'Nieuw product', name: 'Naam', price: 'Prijs', uploadPhoto: 'Foto uploaden', save: 'Opslaan', colPhoto: 'Foto', colName: 'Naam', colPrice: 'Prijs', colId: 'ID', created: 'Product aangemaakt', deleted: 'Product verwijderd', failed: 'Niet gelukt', storageNote: 'Rijen in de database, afbeeldingen in de mediadienst.' },
}

export function productsUi(lang: string): ProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

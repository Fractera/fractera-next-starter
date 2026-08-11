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
  /** Кнопки формы. */
  add: string
  cancelAdd: string
  newProduct: string
  name: string
  price: string
  uploadPhoto: string
  save: string
  /** Тосты. */
  created: string
  deleted: string
  /** Подпись о том, где лежат данные. */
  storageNote: string
  nothingFound: string
  /** Правка полей карточки. */
  edit: string
  saveField: string
  cancelEdit: string
  fieldSaved: string
  baseValue: string
  translation: string
  descriptionField: string
  translations: string
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
  en: { title: 'Product catalogue', subtitle: 'Create products and add them to the catalogue. Backed by the database and the media service.', add: 'Add product', cancelAdd: 'Cancel', newProduct: 'New product', name: 'Product name', price: 'Price', uploadPhoto: 'Upload photo', save: 'Save', created: 'Product created', deleted: 'Product deleted', storageNote: 'Rows in the database, images in the media service.', nothingFound: 'Nothing matches that search.', edit: 'Edit', saveField: 'Save', cancelEdit: 'Cancel', fieldSaved: 'Saved', baseValue: 'Base (English)', translation: 'Translation', descriptionField: 'Description', translations: 'Translations', one: 'Product', back: 'Back to the catalogue', notFoundTitle: 'No such product', notFoundBody: 'It was deleted, or the address is wrong.', errorTitle: 'Something broke on this page', errorBody: 'The catalogue itself is fine — this screen failed. Try again.', retry: 'Try again' },
  ru: { title: 'Каталог продуктов', subtitle: 'Создавайте продукты и добавляйте их в каталог. Данные — в базе, изображения — в медиа-службе.', add: 'Добавить продукт', cancelAdd: 'Отмена', newProduct: 'Новый продукт', name: 'Название', price: 'Цена', uploadPhoto: 'Загрузить фото', save: 'Сохранить', created: 'Продукт создан', deleted: 'Продукт удалён', storageNote: 'Строки в базе, изображения в медиа-службе.', nothingFound: 'По этому запросу ничего нет.', edit: 'Изменить', saveField: 'Сохранить', cancelEdit: 'Отмена', fieldSaved: 'Сохранено', baseValue: 'Базовое (английский)', translation: 'Перевод', descriptionField: 'Описание', translations: 'Переводы', one: 'Продукт', back: 'Назад в каталог', notFoundTitle: 'Такого продукта нет', notFoundBody: 'Он удалён, либо адрес неверный.', errorTitle: 'На этой странице что-то сломалось', errorBody: 'Сам каталог цел — не отработал этот экран. Попробуйте ещё раз.', retry: 'Повторить' },
  es: { title: 'Catálogo de productos', subtitle: 'Crea productos y añádelos al catálogo. Respaldado por la base de datos y el servicio de medios.', add: 'Añadir producto', cancelAdd: 'Cancelar', newProduct: 'Nuevo producto', name: 'Nombre', price: 'Precio', uploadPhoto: 'Subir foto', save: 'Guardar', created: 'Producto creado', deleted: 'Producto eliminado', storageNote: 'Filas en la base de datos, imágenes en el servicio de medios.', nothingFound: 'No hay resultados para esa búsqueda.', edit: 'Editar', saveField: 'Guardar', cancelEdit: 'Cancelar', fieldSaved: 'Guardado', baseValue: 'Base (inglés)', translation: 'Traducción', descriptionField: 'Descripción', translations: 'Traducciones', one: 'Producto', back: 'Volver al catálogo', notFoundTitle: 'No existe ese producto', notFoundBody: 'Fue eliminado o la dirección es incorrecta.', errorTitle: 'Algo se rompió en esta página', errorBody: 'El catálogo está bien; falló esta pantalla. Inténtalo de nuevo.', retry: 'Reintentar' },
  fr: { title: 'Catalogue de produits', subtitle: 'Créez des produits et ajoutez-les au catalogue. Adossé à la base de données et au service média.', add: 'Ajouter un produit', cancelAdd: 'Annuler', newProduct: 'Nouveau produit', name: 'Nom', price: 'Prix', uploadPhoto: 'Téléverser une photo', save: 'Enregistrer', created: 'Produit créé', deleted: 'Produit supprimé', storageNote: 'Lignes en base, images dans le service média.', nothingFound: 'Aucun résultat pour cette recherche.', edit: 'Modifier', saveField: 'Enregistrer', cancelEdit: 'Annuler', fieldSaved: 'Enregistré', baseValue: 'Base (anglais)', translation: 'Traduction', descriptionField: 'Description', translations: 'Traductions', one: 'Produit', back: 'Retour au catalogue', notFoundTitle: 'Ce produit n’existe pas', notFoundBody: 'Il a été supprimé ou l’adresse est erronée.', errorTitle: 'Quelque chose a cassé sur cette page', errorBody: 'Le catalogue va bien — cet écran a échoué. Réessayez.', retry: 'Réessayer' },
  it: { title: 'Catalogo prodotti', subtitle: 'Crea prodotti e aggiungili al catalogo. Basato sul database e sul servizio media.', add: 'Aggiungi prodotto', cancelAdd: 'Annulla', newProduct: 'Nuovo prodotto', name: 'Nome', price: 'Prezzo', uploadPhoto: 'Carica foto', save: 'Salva', created: 'Prodotto creato', deleted: 'Prodotto eliminato', storageNote: 'Righe nel database, immagini nel servizio media.', nothingFound: 'Nessun risultato per questa ricerca.', edit: 'Modifica', saveField: 'Salva', cancelEdit: 'Annulla', fieldSaved: 'Salvato', baseValue: 'Base (inglese)', translation: 'Traduzione', descriptionField: 'Descrizione', translations: 'Traduzioni', one: 'Prodotto', back: 'Torna al catalogo', notFoundTitle: 'Questo prodotto non esiste', notFoundBody: 'È stato eliminato o l’indirizzo è errato.', errorTitle: 'Qualcosa si è rotto in questa pagina', errorBody: 'Il catalogo è a posto: è fallita questa schermata. Riprova.', retry: 'Riprova' },
  de: { title: 'Produktkatalog', subtitle: 'Legen Sie Produkte an und fügen Sie sie dem Katalog hinzu. Gestützt auf Datenbank und Medien-Dienst.', add: 'Produkt hinzufügen', cancelAdd: 'Abbrechen', newProduct: 'Neues Produkt', name: 'Name', price: 'Preis', uploadPhoto: 'Foto hochladen', save: 'Speichern', created: 'Produkt erstellt', deleted: 'Produkt gelöscht', storageNote: 'Zeilen in der Datenbank, Bilder im Medien-Dienst.', nothingFound: 'Keine Treffer für diese Suche.', edit: 'Bearbeiten', saveField: 'Speichern', cancelEdit: 'Abbrechen', fieldSaved: 'Gespeichert', baseValue: 'Basis (Englisch)', translation: 'Übersetzung', descriptionField: 'Beschreibung', translations: 'Übersetzungen', one: 'Produkt', back: 'Zurück zum Katalog', notFoundTitle: 'Dieses Produkt gibt es nicht', notFoundBody: 'Es wurde gelöscht, oder die Adresse stimmt nicht.', errorTitle: 'Auf dieser Seite ist etwas kaputtgegangen', errorBody: 'Der Katalog ist in Ordnung — dieser Bildschirm nicht. Versuchen Sie es erneut.', retry: 'Erneut versuchen' },
  pt: { title: 'Catálogo de produtos', subtitle: 'Crie produtos e adicione-os ao catálogo. Apoiado no banco de dados e no serviço de mídia.', add: 'Adicionar produto', cancelAdd: 'Cancelar', newProduct: 'Novo produto', name: 'Nome', price: 'Preço', uploadPhoto: 'Enviar foto', save: 'Salvar', created: 'Produto criado', deleted: 'Produto excluído', storageNote: 'Linhas no banco, imagens no serviço de mídia.', nothingFound: 'Nada corresponde a essa busca.', edit: 'Editar', saveField: 'Salvar', cancelEdit: 'Cancelar', fieldSaved: 'Salvo', baseValue: 'Base (inglês)', translation: 'Tradução', descriptionField: 'Descrição', translations: 'Traduções', one: 'Produto', back: 'Voltar ao catálogo', notFoundTitle: 'Esse produto não existe', notFoundBody: 'Foi excluído ou o endereço está errado.', errorTitle: 'Algo quebrou nesta página', errorBody: 'O catálogo está bem — esta tela falhou. Tente de novo.', retry: 'Tentar de novo' },
  pl: { title: 'Katalog produktów', subtitle: 'Twórz produkty i dodawaj je do katalogu. Oparte na bazie danych i usłudze mediów.', add: 'Dodaj produkt', cancelAdd: 'Anuluj', newProduct: 'Nowy produkt', name: 'Nazwa', price: 'Cena', uploadPhoto: 'Prześlij zdjęcie', save: 'Zapisz', created: 'Produkt utworzony', deleted: 'Produkt usunięty', storageNote: 'Wiersze w bazie, obrazy w usłudze mediów.', nothingFound: 'Brak wyników dla tego zapytania.', edit: 'Edytuj', saveField: 'Zapisz', cancelEdit: 'Anuluj', fieldSaved: 'Zapisano', baseValue: 'Podstawa (angielski)', translation: 'Tłumaczenie', descriptionField: 'Opis', translations: 'Tłumaczenia', one: 'Produkt', back: 'Wróć do katalogu', notFoundTitle: 'Nie ma takiego produktu', notFoundBody: 'Został usunięty albo adres jest błędny.', errorTitle: 'Coś się zepsuło na tej stronie', errorBody: 'Katalog jest sprawny — zawiódł ten ekran. Spróbuj ponownie.', retry: 'Spróbuj ponownie' },
  tr: { title: 'Ürün kataloğu', subtitle: 'Ürün oluşturun ve kataloğa ekleyin. Veritabanı ve medya servisiyle desteklenir.', add: 'Ürün ekle', cancelAdd: 'İptal', newProduct: 'Yeni ürün', name: 'Ad', price: 'Fiyat', uploadPhoto: 'Fotoğraf yükle', save: 'Kaydet', created: 'Ürün oluşturuldu', deleted: 'Ürün silindi', storageNote: 'Satırlar veritabanında, görseller medya servisinde.', nothingFound: 'Bu aramaya uyan kayıt yok.', edit: 'Düzenle', saveField: 'Kaydet', cancelEdit: 'İptal', fieldSaved: 'Kaydedildi', baseValue: 'Temel (İngilizce)', translation: 'Çeviri', descriptionField: 'Açıklama', translations: 'Çeviriler', one: 'Ürün', back: 'Kataloğa dön', notFoundTitle: 'Böyle bir ürün yok', notFoundBody: 'Silinmiş ya da adres yanlış.', errorTitle: 'Bu sayfada bir şey bozuldu', errorBody: 'Katalog sağlam — bu ekran hata verdi. Yeniden deneyin.', retry: 'Yeniden dene' },
  nl: { title: 'Productcatalogus', subtitle: 'Maak producten aan en voeg ze toe aan de catalogus. Ondersteund door de database en de mediadienst.', add: 'Product toevoegen', cancelAdd: 'Annuleren', newProduct: 'Nieuw product', name: 'Naam', price: 'Prijs', uploadPhoto: 'Foto uploaden', save: 'Opslaan', created: 'Product aangemaakt', deleted: 'Product verwijderd', storageNote: 'Rijen in de database, afbeeldingen in de mediadienst.', nothingFound: 'Geen resultaten voor die zoekopdracht.', edit: 'Bewerken', saveField: 'Opslaan', cancelEdit: 'Annuleren', fieldSaved: 'Opgeslagen', baseValue: 'Basis (Engels)', translation: 'Vertaling', descriptionField: 'Omschrijving', translations: 'Vertalingen', one: 'Product', back: 'Terug naar de catalogus', notFoundTitle: 'Dit product bestaat niet', notFoundBody: 'Het is verwijderd, of het adres klopt niet.', errorTitle: 'Er ging iets stuk op deze pagina', errorBody: 'De catalogus is in orde — dit scherm faalde. Probeer het opnieuw.', retry: 'Opnieuw proberen' },
}

export function productsUi(lang: string): ProductsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

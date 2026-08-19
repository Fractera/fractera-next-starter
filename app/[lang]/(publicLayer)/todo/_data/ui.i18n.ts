// Слова страницы «Список дел» — образца работающей вещи.
//
// 🔒 ЯЗЫКОВ СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`, сейчас
// десять): это строки ОДНОЙ страницы, а не переиспользуемый элемент. Сторож
// `npm run check:i18n` держит число.

export type TodoUi = {
  title: string
  subtitle: string
  placeholder: string
  add: string
  empty: string
  remove: string
  failed: string
}

const UI: Record<string, TodoUi> = {
  en: { title: 'Todo list', subtitle: 'A working example, not a mockup: the rows live in the database, the page shell stays static.', placeholder: 'What needs doing?', add: 'Add', empty: 'Nothing here yet — add the first item.', remove: 'Delete', failed: 'Could not save' },
  ru: { title: 'Список дел', subtitle: 'Работающий пример, а не макет: строки лежат в базе, оболочка страницы остаётся статической.', placeholder: 'Что нужно сделать?', add: 'Добавить', empty: 'Пока пусто — добавьте первый пункт.', remove: 'Удалить', failed: 'Не удалось сохранить' },
  es: { title: 'Lista de tareas', subtitle: 'Un ejemplo que funciona, no una maqueta: las filas viven en la base de datos y la página sigue siendo estática.', placeholder: '¿Qué hay que hacer?', add: 'Añadir', empty: 'Aún no hay nada: añade el primer elemento.', remove: 'Eliminar', failed: 'No se pudo guardar' },
  fr: { title: 'Liste de tâches', subtitle: 'Un exemple qui fonctionne, pas une maquette : les lignes vivent en base, la page reste statique.', placeholder: 'Que faut-il faire ?', add: 'Ajouter', empty: 'Rien pour l\'instant — ajoutez le premier élément.', remove: 'Supprimer', failed: 'Enregistrement impossible' },
  it: { title: 'Lista di cose da fare', subtitle: 'Un esempio funzionante, non un mockup: le righe stanno nel database, la pagina resta statica.', placeholder: 'Cosa bisogna fare?', add: 'Aggiungi', empty: 'Ancora niente: aggiungi il primo elemento.', remove: 'Elimina', failed: 'Salvataggio non riuscito' },
  de: { title: 'Aufgabenliste', subtitle: 'Ein funktionierendes Beispiel, kein Entwurf: die Zeilen liegen in der Datenbank, die Seite bleibt statisch.', placeholder: 'Was ist zu tun?', add: 'Hinzufügen', empty: 'Noch nichts da — fügen Sie den ersten Eintrag hinzu.', remove: 'Löschen', failed: 'Konnte nicht gespeichert werden' },
  pt: { title: 'Lista de tarefas', subtitle: 'Um exemplo a funcionar, não uma maquete: as linhas vivem na base de dados, a página continua estática.', placeholder: 'O que é preciso fazer?', add: 'Adicionar', empty: 'Ainda nada — adicione o primeiro item.', remove: 'Eliminar', failed: 'Não foi possível guardar' },
  pl: { title: 'Lista zadań', subtitle: 'Działający przykład, a nie makieta: wiersze leżą w bazie, powłoka strony pozostaje statyczna.', placeholder: 'Co trzeba zrobić?', add: 'Dodaj', empty: 'Na razie pusto — dodaj pierwszą pozycję.', remove: 'Usuń', failed: 'Nie udało się zapisać' },
  tr: { title: 'Yapılacaklar listesi', subtitle: 'Maket değil, çalışan bir örnek: satırlar veritabanında, sayfanın kabuğu statik kalır.', placeholder: 'Ne yapılmalı?', add: 'Ekle', empty: 'Henüz bir şey yok — ilk maddeyi ekleyin.', remove: 'Sil', failed: 'Kaydedilemedi' },
  nl: { title: 'Takenlijst', subtitle: 'Een werkend voorbeeld, geen mockup: de rijen staan in de database, de pagina blijft statisch.', placeholder: 'Wat moet er gebeuren?', add: 'Toevoegen', empty: 'Nog niets — voeg het eerste item toe.', remove: 'Verwijderen', failed: 'Opslaan mislukt' },
}

export function todoUi(lang: string): TodoUi {
  return UI[lang] ?? UI.en
}

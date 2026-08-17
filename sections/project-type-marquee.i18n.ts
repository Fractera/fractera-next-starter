// Подписи внутри окна направления — три подзаголовка и приглашение открыть.
//
// 🔒 ЯЗЫКОВ ДЕСЯТЬ, И ЭТО ПОЛНОЕ РЕШЕНИЕ, А НЕ ДОЛГ. Это хром СЕКЦИИ — слова,
// написанные для страниц этого проекта, — и он идёт по включённому набору
// `NEXT_PUBLIC_SUPPORTED_LANGUAGES` (правило 4д `/code/CLAUDE.md`). Тот же
// разряд, что `lib/content/post-body-ui.ts`. Все 82 обязаны нести только
// переиспользуемые части продукта — меню, корзина, тосты, окно как таковое.
//
// 🔒 ФАЙЛ ЛЕЖИТ В КОРНЕ `sections/`, А НЕ В `sections/blocks/` — тот же приём,
// что у `sections/tone.ts`. В `blocks/` живут ТОЛЬКО рендереры: сторож секций
// считает файлы этой папки, и словарь среди них исказил бы счёт.
//
// Само СОДЕРЖИМОЕ карточек живёт отдельно, в `lib/i18n/project-types.i18n.json`,
// и у него своя судьба: корпус приехал из панели и пока двухязычный.

export type ProjectTypeMarqueeUi = {
  /** Подзаголовок над списком примеров. */
  examples: string
  /** Подзаголовок над признаками «это про вас, если…». */
  signals: string
  /** Что происходит по нажатию — подпись карточки для читалок экрана. */
  openCard: string
  /** Пока тело окна едет с сервера. */
  loading: string
  /** Тело окна не доехало. */
  failed: string
}

const UI: Record<string, ProjectTypeMarqueeUi> = {
  en: { examples: 'Examples', signals: 'This is you, if', openCard: 'Open the description of the direction', loading: 'Loading…', failed: 'Could not load the description' },
  ru: { examples: 'Примеры', signals: 'Это про вас, если', openCard: 'Открыть описание направления', loading: 'Загружаем…', failed: 'Описание не загрузилось' },
  es: { examples: 'Ejemplos', signals: 'Esto va contigo, si', openCard: 'Abrir la descripción de la dirección', loading: 'Cargando…', failed: 'No se pudo cargar la descripción' },
  fr: { examples: 'Exemples', signals: 'C’est vous, si', openCard: 'Ouvrir la description de la direction', loading: 'Chargement…', failed: 'Impossible de charger la description' },
  it: { examples: 'Esempi', signals: 'Sei tu, se', openCard: 'Apri la descrizione della direzione', loading: 'Caricamento…', failed: 'Impossibile caricare la descrizione' },
  de: { examples: 'Beispiele', signals: 'Das sind Sie, wenn', openCard: 'Beschreibung der Richtung öffnen', loading: 'Wird geladen…', failed: 'Beschreibung konnte nicht geladen werden' },
  pt: { examples: 'Exemplos', signals: 'É consigo, se', openCard: 'Abrir a descrição da direção', loading: 'A carregar…', failed: 'Não foi possível carregar a descrição' },
  pl: { examples: 'Przykłady', signals: 'To o Tobie, jeśli', openCard: 'Otwórz opis kierunku', loading: 'Wczytywanie…', failed: 'Nie udało się wczytać opisu' },
  tr: { examples: 'Örnekler', signals: 'Bu sizsiniz, eğer', openCard: 'Yön açıklamasını aç', loading: 'Yükleniyor…', failed: 'Açıklama yüklenemedi' },
  nl: { examples: 'Voorbeelden', signals: 'Dit bent u, als', openCard: 'Beschrijving van de richting openen', loading: 'Laden…', failed: 'Beschrijving kon niet worden geladen' },
}

export function projectTypeMarqueeUi(lang: string): ProjectTypeMarqueeUi {
  return UI[lang] ?? UI.en
}

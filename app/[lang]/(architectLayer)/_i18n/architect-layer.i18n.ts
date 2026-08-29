// Слова слоя архитектора (шаг 31-1, 2026-08-28).
//
// 🔒 ЯЗЫКОВ ДВА, И ЭТО ОСОЗНАННОЕ СОСТОЯНИЕ, А НЕ НЕДОДЕЛКА. Решение владельца
// 2026-08-28: «en + ru сейчас, остальные файлом позже». Я пишу два языка,
// остальные приходят файлом от внешней модели, когда набор строк устоится, —
// переводить корпус, который ещё меняется каждый подшаг, значит переводить его
// дважды. Резолвер откатывается на английский, поэтому чужой язык видит
// работающую страницу, а не пустоту.
//
// 🔒 СЛОВА СЕРВЕРНЫЕ. Их резолвит серверный компонент и передаёт островкам
// пропсами: клиентский компонент, импортирующий словарь, увёз бы в браузер все
// его языки — на 82 языках это мегабайты на каждую загрузку.

export type ArchitectLayerUi = {
  /** Название слоя целиком — крошка и заголовок раздела. */
  layer: string
  /** Заголовок левого меню. */
  menuTitle: string
  /** Подпись переключателя языка настроек и объяснение, что он переключает. */
  editLang: string
  editLangHint: string
  /** Названия восьми групп; ключи совпадают с `id` в `_lib/architect-menu.ts`. */
  groups: Record<string, string>
  /** Страница настроек приложения. */
  appConfigTitle: string
  appConfigSubtitle: string
  /**
   * Строка группы, у которой на этой странице полей нет.
   *
   * 🔒 ОНА ГОВОРИТ, ГДЕ НАСТРАИВАЕТСЯ РАЗДЕЛ, А НЕ ЧТО МЫ ЕГО ЕЩЁ НЕ ПЕРЕНЕСЛИ.
   * Прежняя редакция рассказывала про переезд «раздел за разделом» — то же самое, за
   * что владелец убрал пометку «в панели» из меню: человеку, открывшему свой проект,
   * состояние нашей работы не адресовано.
   * Но и пустым экран остаться не может: без объяснения человек читает его как
   * поломку — а ему просто нужен адрес, по которому раздел правится.
   */
  appConfigSoon: string
}

const DICT: Record<string, ArchitectLayerUi> = {
  en: {
    layer: "Architect layer",
    menuTitle: "Project settings",
    editLang: "Settings language",
    editLangHint: "Which language you are editing the values for. It does not change the language of this page.",
    groups: {
      multilang: "Languages",
      basics: "Basics",
      seo: "SEO",
      metaMedia: "Meta and media",
      parallelRouting: "Parallel routing",
      header: "Project header",
      footer: "Project footer",
      cookieBanner: "Cookie banner",      devMode: "Development mode",
    },
    appConfigTitle: "Application settings",
    appConfigSubtitle:
      "The name, addresses, meta and appearance of this project. Saved settings are read at runtime — a change shows on the next page load, with no rebuild.",
    appConfigSoon:
      "This section is configured in the control panel — the link is in the site footer.",
  },
  ru: {
    layer: "Слой архитектора",
    menuTitle: "Настройки проекта",
    editLang: "Язык настроек",
    editLangHint: "Для какого языка вы правите значения. Язык самой этой страницы он не меняет.",
    groups: {
      multilang: "Мультиязычность",
      basics: "Основные",
      seo: "SEO",
      metaMedia: "Мета и медиа",
      parallelRouting: "Параллельная маршрутизация",
      header: "Хедер проекта",
      footer: "Футер проекта",
      cookieBanner: "Куки-баннер",      devMode: "Режим разработки",
    },
    appConfigTitle: "Настройки приложения",
    appConfigSubtitle:
      "Имя, адреса, мета и внешний вид этого проекта. Сохранённые настройки читаются на лету — изменение видно при следующей загрузке страницы, без пересборки.",
    appConfigSoon:
      "Этот раздел настраивается в панели управления — ссылка на неё в подвале сайта.",
  },
}

export function architectLayerUi(lang: string): ArchitectLayerUi {
  return DICT[lang] ?? DICT.en
}

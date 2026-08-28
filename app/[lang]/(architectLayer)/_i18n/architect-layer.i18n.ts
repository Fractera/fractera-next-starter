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
  /** Страница настроек приложения. */
  appConfigTitle: string
  appConfigSubtitle: string
  /**
   * Строка каркаса: полей здесь пока нет.
   *
   * 🔒 Она говорит, ЧЕГО ещё нет и когда появится, а не «страница в разработке».
   * Пустой экран без объяснения человек читает как поломку и идёт искать
   * настройку в панель — то есть ровно туда, откуда мы её уводим.
   */
  appConfigSoon: string
}

const DICT: Record<string, ArchitectLayerUi> = {
  en: {
    layer: "Architect layer",
    appConfigTitle: "Application settings",
    appConfigSubtitle:
      "The name, addresses, meta and appearance of this project. Saved settings are read at runtime — a change shows on the next page load, with no rebuild.",
    appConfigSoon:
      "The settings themselves are moving here from the control panel section by section. Until a section arrives, edit it in the panel — the link is in the footer.",
  },
  ru: {
    layer: "Слой архитектора",
    appConfigTitle: "Настройки приложения",
    appConfigSubtitle:
      "Имя, адреса, мета и внешний вид этого проекта. Сохранённые настройки читаются на лету — изменение видно при следующей загрузке страницы, без пересборки.",
    appConfigSoon:
      "Сами настройки переезжают сюда из панели управления раздел за разделом. Пока раздел не переехал, правьте его в панели — ссылка на неё в подвале сайта.",
  },
}

export function architectLayerUi(lang: string): ArchitectLayerUi {
  return DICT[lang] ?? DICT.en
}

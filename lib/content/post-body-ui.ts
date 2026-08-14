// Слова, которые печатает сам рисовальщик блоков (`PostBody`): надзаголовок и
// кнопка блока-карточки документа (`docref`). Это не содержимое материала, а
// подписи механизма, поэтому они живут здесь, а не в данных вкладки.
//
// 🔒 ФОРМА СЛОВАРЯ — ОБЩАЯ ДЛЯ ПРОЕКТА (шаг 507), как у `page-ui.ts`: карта
// `язык: { ключ: строка }`, которую понимает `npm run check:i18n`. Прежняя форма
// (отдельные константы + `deepMerge`) сторожу не читалась, поэтому пропуск языка
// здесь не замечал никто.
export type PostBodyUi = {
  fullDocumentation: string
  downloadMd: string
}

const UI: Record<string, PostBodyUi> = {
  en: { fullDocumentation: 'Full documentation', downloadMd: 'Download .md' },
  ru: { fullDocumentation: 'Полная документация', downloadMd: 'Скачать .md' },
}

export function getPostBodyUi(lang: string): PostBodyUi {
  return UI[lang] ?? UI.en
}

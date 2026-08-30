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
  /**
   * Подпись кнопки, открывающей меню рабочего экрана на телефоне (48-1).
   *
   * Слово МЕХАНИЗМА, а не материала: его печатает вид, а не автор страницы.
   * Поэтому оно живёт здесь, а не в языковой ячейке — иначе десять страниц
   * назвали бы одну и ту же кнопку десятью способами.
   */
  workspaceMenu: string
}

const UI: Record<string, PostBodyUi> = {
  en: { fullDocumentation: 'Full documentation', downloadMd: 'Download .md', workspaceMenu: 'Menu' },
  ru: { fullDocumentation: 'Полная документация', downloadMd: 'Скачать .md', workspaceMenu: 'Меню' },
  es: { fullDocumentation: 'Documentación completa', downloadMd: 'Descargar .md', workspaceMenu: 'Menú' },
  fr: { fullDocumentation: 'Documentation complète', downloadMd: 'Télécharger .md', workspaceMenu: 'Menu' },
  it: { fullDocumentation: 'Documentazione completa', downloadMd: 'Scarica .md', workspaceMenu: 'Menu' },
  de: { fullDocumentation: 'Vollständige Dokumentation', downloadMd: '.md herunterladen', workspaceMenu: 'Menü' },
  pt: { fullDocumentation: 'Documentação completa', downloadMd: 'Descarregar .md', workspaceMenu: 'Menu' },
  pl: { fullDocumentation: 'Pełna dokumentacja', downloadMd: 'Pobierz .md', workspaceMenu: 'Menu' },
  tr: { fullDocumentation: 'Tam dokümantasyon', downloadMd: '.md indir', workspaceMenu: 'Menü' },
  nl: { fullDocumentation: 'Volledige documentatie', downloadMd: '.md downloaden', workspaceMenu: 'Menu' },
}

export function getPostBodyUi(lang: string): PostBodyUi {
  return UI[lang] ?? UI.en
}

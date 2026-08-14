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
  es: { fullDocumentation: 'Documentación completa', downloadMd: 'Descargar .md' },
  fr: { fullDocumentation: 'Documentation complète', downloadMd: 'Télécharger .md' },
  it: { fullDocumentation: 'Documentazione completa', downloadMd: 'Scarica .md' },
  de: { fullDocumentation: 'Vollständige Dokumentation', downloadMd: '.md herunterladen' },
  pt: { fullDocumentation: 'Documentação completa', downloadMd: 'Descarregar .md' },
  pl: { fullDocumentation: 'Pełna dokumentacja', downloadMd: 'Pobierz .md' },
  tr: { fullDocumentation: 'Tam dokümantasyon', downloadMd: '.md indir' },
  nl: { fullDocumentation: 'Volledige documentatie', downloadMd: '.md downloaden' },
}

export function getPostBodyUi(lang: string): PostBodyUi {
  return UI[lang] ?? UI.en
}

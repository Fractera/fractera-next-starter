// Слова диалога переводов. Ко-локированы рядом с ним: это строки интерфейса,
// то есть данные, известные на сборке. Ср. GLOSSARY.md, «три вида переводов».

export type TranslationsUi = {
  title: string
  intro: string
  translateTab: string
  translateAllTabs: string
  translating: string
  saveOne: string
  saving: string
  savedMark: string
  skip: string
  close: string
  empty: string
  /** Текст у вопросика — почему пропуск это нормально. */
  hint: string
  failed: string
  saved: string
}

const UI: Record<string, TranslationsUi> = {
  en: { title: 'Add translations', intro: 'Fill the languages your app ships in. Nothing is translated until you ask.', translateTab: 'Translate this tab', translateAllTabs: 'Translate all tabs', saveOne: 'Save this translation', savedMark: 'saved' },
}

export function translationsUi(lang: string): TranslationsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

// Слова врезки «текст размещается в панели» — общие для всех страниц подвала.
//
// 🔒 ОДНО МЕСТО НА ВСЕ СТРАНИЦЫ. Фраза одинакова для приватности, условий и
// cookie; три копии разошлись бы при первой правке, и разошлись бы именно в том
// языке, который никто не перечитывает.
//
// Языков два, и это ПОЛНОЕ решение, а не долг: строки страницы идут по
// включённому набору `NEXT_PUBLIC_SUPPORTED_LANGUAGES` (правило 4д). Все 82
// обязаны нести только переиспользуемые части продукта — меню, тосты, отказы.

export type NoticeUi = {
  title: string
  text: string
  label: string
  /** Заголовок раздела-заглушки в теле страницы. */
  heading: string
  /** Абзац под ним. */
  body: string
}

const UI: Record<string, NoticeUi> = {
  en: {
    title: 'This page has no text yet.',
    text: 'Its full text is written in the control panel — this page is a working template, not a document.',
    label: 'Open the panel',
    heading: 'What belongs here',
    body: 'Replace this placeholder with your own text. The page is fully static and indexable: search engines receive its title, description and structured data, exactly as they do for an article.',
  },
  ru: {
    title: 'У этой страницы пока нет текста.',
    text: 'Полный текст размещается в панели управления — эта страница рабочий шаблон, а не документ.',
    label: 'Открыть панель',
    heading: 'Что здесь должно быть',
    body: 'Замените эту заглушку своим текстом. Страница полностью статическая и индексируется: поисковые системы получают её заголовок, описание и структурированные данные — ровно так же, как у статьи.',
  },
}

export function noticeUi(lang: string): NoticeUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

// Слова, которые печатает САМ шаблон страницы (`StandardContentPage`): заголовок
// оглавления и заголовок раздела вопросов. Всё остальное на странице приходит из
// материала или из настроек проекта.
//
// 🔒 ФОРМА СЛОВАРЯ — ОБЩАЯ ДЛЯ ПРОЕКТА (шаг 507). Здесь стояли отдельные
// константы `en`/`ru` и `deepMerge` по ключам. Слов всего два, частичный перевод
// им не нужен, а сторож словарей (`npm run check:i18n`) читает именно эту
// форму — карту `язык: { ключ: строка }`. Пока файл был устроен иначе, он не
// проверялся ничем: язык, добавленный на сайт, молча получал английские
// «On this page» и «Frequently asked questions» посреди своего текста.
export type PageUi = {
  tocHeading: string
  faqHeading: string
}

const UI: Record<string, PageUi> = {
  en: { tocHeading: 'On this page', faqHeading: 'Frequently asked questions' },
  ru: { tocHeading: 'На этой странице', faqHeading: 'Частые вопросы' },
}

export function getPageUi(lang: string): PageUi {
  return UI[lang] ?? UI.en
}

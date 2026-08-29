// СЛОВА БАННЕРА СТАРТОВОГО ШАБЛОНА (шаг 38-1, 2026-08-29).
//
// 🔒 ДВА ЯЗЫКА, И ЭТО РЕШЕНИЕ ВЛАДЕЛЬЦА, А НЕ НЕДОДЕЛКА: «сделай этот текст пока
// на русском и английским языках только». Остальные восемь языков страницы
// получают английский — деградация к `en` тут честнее пустоты и честнее
// машинного перевода, которого никто не читал.
//
// 🔒 ТЕКСТ РАЗРЕЗАН НА ТРИ ЧАСТИ, А НЕ СОБРАН КОНКАТЕНАЦИЕЙ В РАЗМЕТКЕ: ссылка
// стоит В СЕРЕДИНЕ фразы, и у языков порядок слов разный. Склейка «начало + <a> +
// конец» прямо в JSX однажды выдаёт фразу задом наперёд на языке, который никто
// не проверял.

export type StarterBannerStrings = {
  /** Что человек сейчас видит. */
  lead: string
  /** Подпись ссылки на раздел запуска проекта. */
  linkLabel: string
  /** Хвост фразы после ссылки; может быть пустым. */
  tail: string
}

const EN: StarterBannerStrings = {
  lead: 'You are looking at your starter template. Connect your repository and move on to development:',
  linkLabel: 'start the project',
  tail: '',
}

const RU: StarterBannerStrings = {
  lead: 'Вы просматриваете ваш стартовый шаблон. Подключите ваш репозиторий и перейдите к разработке:',
  linkLabel: 'запуск проекта',
  tail: '',
}

export function starterBannerStrings(lang: string): StarterBannerStrings {
  return lang === 'ru' ? RU : EN
}

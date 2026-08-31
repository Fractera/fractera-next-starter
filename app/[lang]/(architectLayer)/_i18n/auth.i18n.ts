// СЛОВА ВХОДА «АВТОРИЗАЦИЯ» (78-1, 2026-08-31).
//
// 🔒 СЛОВАРЬ СЕРВЕРНЫЙ. Ни один файл с `"use client"` не имеет права импортировать
// его значением: тогда все языки уезжают в браузер на каждой странице слоя.
// Серверная страница резолвит и передаёт островкам СТРОКИ ПОИМЁННО — закон,
// оплаченный в 76-4 замером отданной разметки.
//
// 🔒 СЛОВА НАПИСАНЫ ПРО СВОЁ, А НЕ СКОПИРОВАНЫ У СОСЕДА. Общий у входов
// компонент, а не текст: «здесь будет токен бота» на странице провайдера — ложь,
// которую никто не заметит, потому что заглушка выглядит правильно.
//
// 🔒 ЗАГЛУШКА ПРОВАЙДЕРА НЕ ОБЕЩАЕТ ВЫКЛЮЧАТЕЛЯ. Способ входа появляется от того,
// что в окружении появились КЛЮЧИ, а не оттого, что кто-то щёлкнул переключателем
// (навык `use-auth-providers`). Обещать здесь тумблер значило бы обещать
// механизм, которого в продукте нет.

export type AuthUi = {
  /** Заголовок входа — он же подпись кнопки в подвале. */
  title: string
  menuTitle: string
  subtitle: string
  pages: Record<"about" | "google" | "resend", { title: string; hint: string }>
  helpMore: string
  helpLess: string
  aboutSoonTitle: string
  aboutSoon: string
  /** Заглушки разделов провайдеров. */
  soonTitle: string
  soonLead: string
  soonWhere: string
  soonPanel: string
}

const EN: AuthUi = {
  title: "Sign-in",
  menuTitle: "Sign-in",
  subtitle:
    "How a person gets into this project: which doors are open, who opens them, and what each door needs in order to work.",
  pages: {
    about: {
      title: "About",
      hint: "How signing in is arranged in this project and what decides which methods appear.",
    },
    google: {
      title: "Google provider",
      hint: "Signing in with a Google account: the client, the secret and the callback address.",
    },
    resend: {
      title: "Resend provider",
      hint: "A sign-in link sent by email: the key and the address the letter comes from.",
    },
  },
  helpMore: "Learn more",
  helpLess: "Collapse",
  aboutSoonTitle: "This description is being written.",
  aboutSoon:
    "The section exists and its place is taken; the text and the picture explaining how signing in is arranged here are still being prepared. Nothing is broken — there is simply nothing written yet.",
  soonTitle: "This section is not built yet",
  soonLead:
    "The place for it is here, and it is deliberately empty rather than hidden: a section that appears out of nowhere later is harder to notice than one that says it is coming. A method appears when its keys appear — it is not switched on by a toggle.",
  soonWhere: "Where this works today:",
  soonPanel: "the Sign-in methods tab of the control panel — the link to it is in the site footer.",
}

const RU: AuthUi = {
  title: "Авторизация",
  menuTitle: "Авторизация",
  subtitle:
    "Как человек попадает в этот проект: какие двери открыты, кто их открывает и что нужно каждой двери, чтобы работать.",
  pages: {
    about: {
      title: "Описание",
      hint: "Как устроен вход в этот проект и от чего зависит, какие способы появляются.",
    },
    google: {
      title: "Провайдер Google",
      hint: "Вход через учётную запись Google: клиент, секрет и адрес возврата.",
    },
    resend: {
      title: "Провайдер Resend",
      hint: "Вход по ссылке из письма: ключ и адрес, с которого письмо приходит.",
    },
  },
  helpMore: "Узнать больше",
  helpLess: "Свернуть",
  aboutSoonTitle: "Это описание сейчас пишется.",
  aboutSoon:
    "Раздел существует, и место под него занято; текст и изображение, объясняющие, как устроен вход в этот проект, ещё готовятся. Здесь ничего не сломано — здесь пока просто ничего не написано.",
  soonTitle: "Этот раздел ещё не построен",
  soonLead:
    "Место под него здесь, и оно намеренно пустое, а не спрятанное: раздел, появившийся потом из ниоткуда, заметить труднее, чем тот, который сам сказал, что он будет. Способ входа появляется тогда, когда появляются его ключи, — тумблером его не включают.",
  soonWhere: "Где это работает сегодня:",
  soonPanel: "вкладка «Способы входа» панели управления — ссылка на неё в подвале сайта.",
}

const DICT: Record<string, AuthUi> = { en: EN, ru: RU }

export function authUi(lang: string): AuthUi {
  return DICT[lang] ?? DICT.en
}

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

  // ── Перенесено из панели (78-3) ─────────────────────────────────────────
  //
  // 🔒 СЛОВА ПЕРЕЕХАЛИ, А НЕ НАПИСАНЫ ЗАНОВО. Они уже существовали на обоих
  // языках в `admin-translations.json` панели, выверены и объясняют механизм, а
  // не называют поля. Написать «свои» значило бы завести второй текст об одном и
  // том же — он разошёлся бы с первым и был бы хуже: этот оплачен работой.
  //
  // ✗ ЧТО ИЗМЕНЕНО: адрес «подключите домен» ведёт в панель, а не внутрь себя;
  // добавлены слова состояния «мы не на сервере», которого панель не знала.
  m: {
    unavailable: string
    notSet: string
    intro: string
    needsSecure: string
    unreachableTitle: string
    unreachable: string
    googleTitle: string
    googleHint: string
    redirectUriLabel: string
    redirectUriMissing: string
    uriCopy: string
    uriCopied: string
    uriCopyFailed: string
    googleId: string
    googleIdReplace: string
    googleSecret: string
    googleSecretReplace: string
    emailTitle: string
    emailHint: string
    resendKey: string
    resendKeyReplace: string
    resendFrom: string
    configured: string
    save: string
    saving: string
    remove: string
    removeConfirm: string
    saved: string
    removed: string
    failed: string
    errInsecure: string
    errUnreachable: string
    errResendKey: string
    restartNote: string
    helpWhatTitle: string
    helpWhat: string
    helpWhySecureTitle: string
    helpWhySecure: string
    helpEmptyTitle: string
    helpEmpty: string
    helpSecretsTitle: string
    helpSecrets: string
  }
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
  m: {
    unavailable: "The sign-in settings could not be read.",
    notSet: "not set",
    intro:
      "Add “Continue with Google” and a sign-in link by email to your public sign-in page. Each button appears there only while its credentials are set here — leave a field empty and the button stays hidden.",
    needsSecure:
      "Both need a custom domain with HTTPS: Google requires an HTTPS redirect address, and an email link needs a real sending domain. Attach a domain in the control panel first — until then these fields are read-only.",
    unreachableTitle: "These settings live on the server.",
    unreachable:
      "The sign-in service keeps its credentials in its own environment file, next to the service itself — not in this repository. On your own machine that file does not exist, so the values below are empty and cannot be edited. Open this page on your project's address to change them.",
    googleTitle: "Sign in with Google",
    googleHint:
      "Create an OAuth client in the Google Cloud console and add the redirect address below to it.",
    redirectUriLabel: "Redirect address — paste this into the Google console:",
    redirectUriMissing:
      "The address appears once a domain is attached: it is built from your domain, and there is nothing to show until then.",
    uriCopy: "Copy",
    uriCopied: "Copied",
    uriCopyFailed: "The browser refused the clipboard — the address is selected, press Ctrl+C (⌘C).",
    googleId: "Client ID",
    googleIdReplace: "Paste a new Client ID to replace",
    googleSecret: "Client secret",
    googleSecretReplace: "Paste a new client secret to replace",
    emailTitle: "Sign-in link by email",
    emailHint:
      "Get an API key at resend.com and use a From address on a domain you verified there.",
    resendKey: "re_…",
    resendKeyReplace: "Paste a new API key to replace (re_…)",
    resendFrom: "noreply@yourdomain.com",
    configured: "Configured",
    save: "Save",
    saving: "Saving…",
    remove: "Remove",
    removeConfirm:
      "Remove these credentials? The button disappears from your public sign-in page, and anyone who signs in that way loses the option.",
    saved: "Saved",
    removed: "Removed",
    failed: "Action failed",
    errInsecure:
      "Sign-in methods can be set only in secure mode — attach a custom domain with HTTPS first.",
    errUnreachable:
      "The sign-in service's environment is not reachable from here. Open this page on your project's address.",
    errResendKey: "That does not look like a Resend key — it should start with re_",
    restartNote:
      "Saving restarts the sign-in service; the public page reflects the change within a few seconds.",
    helpWhatTitle: "What this page controls.",
    helpWhat:
      "Which ways in your visitors see on the public sign-in page. The authorization layer itself always exists — you are enabling doors in it, not building a login.",
    helpWhySecureTitle: "Why a domain is required first.",
    helpWhySecure:
      "Google will only send a person back to an address it can verify over HTTPS, and an email provider will only send from a domain you own. Neither is possible on a bare IP over plain HTTP, so both stay unavailable until secure mode is on.",
    helpEmptyTitle: "Empty means hidden, not broken.",
    helpEmpty:
      "A button appears on the sign-in page only while its credentials are present. Removing them hides the button rather than leaving a control that fails — a door that cannot open should not be shown.",
    helpSecretsTitle: "Where the secrets live.",
    helpSecrets:
      "In the sign-in service's own environment file on your server, never in this page. What you see here is a mask built on the server; the secret itself is never sent back to the browser, not even to display it.",
  },
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
  m: {
    unavailable: "Настройки входа прочитать не удалось.",
    notSet: "не задано",
    intro:
      "Добавьте на публичную страницу входа «Продолжить с Google» и вход по ссылке из письма. Каждая кнопка появляется там, только пока здесь заданы её данные: оставьте поле пустым — кнопка останется скрытой.",
    needsSecure:
      "Обоим нужен свой домен с HTTPS: Google требует адрес возврата по HTTPS, а письму нужен настоящий домен отправителя. Сначала подключите домен в панели управления — до этого поля доступны только для чтения.",
    unreachableTitle: "Эти настройки живут на сервере.",
    unreachable:
      "Служба входа держит свои данные в собственном файле окружения, рядом с самой службой, — не в этом репозитории. На вашей машине такого файла нет, поэтому значения ниже пусты и править их нечем. Откройте эту страницу по адресу вашего проекта.",
    googleTitle: "Вход через Google",
    googleHint:
      "Создайте клиент OAuth в консоли Google Cloud и добавьте в него адрес возврата, приведённый ниже.",
    redirectUriLabel: "Адрес возврата — вставьте его в консоль Google:",
    redirectUriMissing:
      "Адрес появится, когда будет подключён домен: он строится из вашего домена, и до этого показывать нечего.",
    uriCopy: "Скопировать",
    uriCopied: "Скопировано",
    uriCopyFailed: "Браузер отказал в буфере обмена — адрес выделен, нажмите Ctrl+C (⌘C).",
    googleId: "Идентификатор клиента",
    googleIdReplace: "Вставьте новый идентификатор, чтобы заменить",
    googleSecret: "Секрет клиента",
    googleSecretReplace: "Вставьте новый секрет, чтобы заменить",
    emailTitle: "Вход по ссылке из письма",
    emailHint:
      "Получите ключ API на resend.com и укажите адрес отправителя на домене, подтверждённом там же.",
    resendKey: "re_…",
    resendKeyReplace: "Вставьте новый ключ API, чтобы заменить (re_…)",
    resendFrom: "noreply@вашдомен.ru",
    configured: "Настроено",
    save: "Сохранить",
    saving: "Сохраняю…",
    remove: "Удалить",
    removeConfirm:
      "Удалить эти данные? Кнопка исчезнет с публичной страницы входа, и те, кто входил этим способом, потеряют такую возможность.",
    saved: "Сохранено",
    removed: "Удалено",
    failed: "Действие не выполнено",
    errInsecure:
      "Способы входа настраиваются только в защищённом режиме — сначала подключите свой домен с HTTPS.",
    errUnreachable:
      "Окружение службы входа отсюда недоступно. Откройте эту страницу по адресу вашего проекта.",
    errResendKey: "Это не похоже на ключ Resend — он должен начинаться с re_",
    restartNote:
      "Сохранение перезапускает службу входа; публичная страница отразит изменение через несколько секунд.",
    helpWhatTitle: "Чем управляет эта страница.",
    helpWhat:
      "Тем, какие пути входа видят ваши посетители на публичной странице. Сам слой авторизации существует всегда — вы открываете в нём двери, а не строите вход.",
    helpWhySecureTitle: "Почему сначала нужен домен.",
    helpWhySecure:
      "Google вернёт человека только на адрес, который может проверить по HTTPS, а почтовая служба отправит письмо только с домена, которым вы владеете. Ни то, ни другое невозможно на голом адресе по обычному HTTP — поэтому оба способа недоступны, пока не включён защищённый режим.",
    helpEmptyTitle: "Пусто значит скрыто, а не сломано.",
    helpEmpty:
      "Кнопка появляется на странице входа, только пока её данные заданы. Удаление скрывает кнопку, а не оставляет орган управления, который отказывает: дверь, которая не может открыться, не должна быть показана.",
    helpSecretsTitle: "Где живут секреты.",
    helpSecrets:
      "В собственном файле окружения службы входа на вашем сервере, и никогда на этой странице. То, что вы здесь видите, — маска, собранная на сервере; сам секрет в браузер не отправляется, даже чтобы его показать.",
  },
}

const DICT: Record<string, AuthUi> = { en: EN, ru: RU }

export function authUi(lang: string): AuthUi {
  return DICT[lang] ?? DICT.en
}

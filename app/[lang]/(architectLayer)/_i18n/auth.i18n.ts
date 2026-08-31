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
  pages: Record<"about" | "visibility" | "google" | "resend", { title: string; hint: string }>
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
    visTitle: string
    visHint: string
    visEnable: string
    visEnableHint: string
    visOnNotice: string
    visOffNotice: string
    catTitle: string
    catLead: string
    catOnHint: string
    catSnapshot: string
    catAsk: string
    rolesTitle: string
    rolesLead: string
    rolesTiersTitle: string
    rolesTiersHint: string
    rolesVocabTitle: string
    rolesVocabHint: string
    guestTitle: string
    guestLead: string
    guestHow: string
    guestReadyTitle: string
    guestReady: string
    devTitle: string
    devLead: string
    devWhy: string
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
    visibility: {
      title: "Visibility",
      hint: "Whether visitors see a way to sign in at all — the switch that shows or hides it in the header.",
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
    visTitle: "Sign-in in the header",
    visHint:
      "Whether visitors see a way in at all. This is about the BUTTON, not about the providers below: turn it off and the account control disappears from the header and the footer, while the sign-in service and everyone's accounts stay exactly as they are.",
    visEnable: "Show sign-in on the site",
    visEnableHint: "On by default. The change is visible on the next page load — no rebuild.",
    visOnNotice: "Visitors see the account control in the header and can sign in.",
    visOffNotice:
      "The control is hidden everywhere on the public site. People who are already signed in keep their session, and the sign-in address still answers directly — this hides the door, it does not lock it.",
    catTitle: "What else can be a way in",
    catLead: "The sign-in service is built on {lib}, and that substrate knows {n} providers. Three of them are wired here — they are marked green below. The rest exist and work; what they lack is the wiring: keys, a redirect address and a button on the sign-in page.",
    catOnHint: "Wired in this project",
    catSnapshot: "The list is a snapshot of the installed package taken on {date} — the sign-in service lives beside this project rather than inside it, so the page cannot count them live.",
    catAsk: "Need one of these, or something not on the list? Write to Fractera support:",
    rolesTitle: "Roles that already exist",
    rolesLead: "Roles are not built for a project — they are already there. Fifteen names, and they split in two, because only one half is enforced by the substrate itself.",
    rolesTiersTitle: "Three access tiers — these the substrate enforces",
    rolesTiersHint: "A guest is the absence of a session, a user is any signed-in person, and the architect is the owner of this deployment. The architect belongs to every protected group by construction: the owner of a server is never locked out of his own application — which is also why a screen that works for you may refuse everybody else.",
    rolesVocabTitle: "Twelve more — the vocabulary your application gates on",
    rolesVocabHint: "These do not stop anyone by themselves: they are names your code and doors ask about. A page shows its data when the door asks for the role, not when the menu hides the link.",
    guestTitle: "The guest role, and why it exists",
    guestLead: "Some things need to know WHO is doing them before the person is willing to say who they are: a cart being filled, a conversation with an AI assistant, a form half completed. Ask for an email first and you lose the person at the moment they were closest to staying.",
    guestHow: "So the sign-in service can issue a real session without asking for anything. It creates an account with the role `guest` and signs the visitor in — the cart and the chat get a stable identity from the first click, and the person notices nothing. Later, when they do sign in properly, the same session becomes theirs and what they collected stays.",
    guestReadyTitle: "This is already built and configured.",
    guestReady: "Nothing has to be invented for it. What remains is to name the pages that should sign a visitor in automatically — say which ones, and they get it.",
    devTitle: "On localhost:3000 sign-in is ignored on purpose",
    devLead: "Running the project on your own machine, you are always the architect: the session is issued without any check, with the email demo@local and the role architect. Since that role belongs to every protected group, every door in the application is open to you at once.",
    devWhy: "This is deliberate and it is what makes local work possible — otherwise you would have to sign in before every page you touch. The price is that a role gate cannot be TESTED here: everything works for everybody. To see what a manager or a guest actually sees, open the project on its own address, where the same code checks the session for real.",
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
    visibility: {
      title: "Видимость",
      hint: "Видят ли посетители вход вообще — выключатель, который показывает или скрывает его в хедере.",
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
    visTitle: "Вход в хедере",
    visHint:
      "Видят ли посетители путь входа вообще. Речь о КНОПКЕ, а не о провайдерах ниже: выключите — и элемент аккаунта исчезнет из хедера и подвала, а служба входа и все учётные записи останутся ровно такими, какими были.",
    visEnable: "Показывать вход на сайте",
    visEnableHint: "По умолчанию включено. Изменение видно при следующей загрузке страницы, без пересборки.",
    visOnNotice: "Посетители видят элемент аккаунта в хедере и могут войти.",
    visOffNotice:
      "Элемент скрыт всюду на публичном сайте. Те, кто уже вошёл, сохраняют сессию, а адрес входа по-прежнему отвечает напрямую — это прячет дверь, а не запирает её.",
    catTitle: "Что ещё может быть путём входа",
    catLead: "Служба входа построена на {lib}, и эта подложка знает {n} провайдеров. Три из них здесь подключены — они отмечены зелёным ниже. Остальные существуют и работают; им не хватает обвязки: ключей, адреса возврата и кнопки на странице входа.",
    catOnHint: "Подключён в этом проекте",
    catSnapshot: "Список — снимок установленного пакета, снятый {date}. Служба входа живёт рядом с проектом, а не внутри него, поэтому пересчитать их на лету страница не может.",
    catAsk: "Нужен один из этих или тот, которого в списке нет? Напишите в поддержку Fractera:",
    rolesTitle: "Роли, которые уже существуют",
    rolesLead: "Роли не строят под проект — они уже есть. Пятнадцать имён, и делятся они надвое, потому что принуждает подложка только одну половину.",
    rolesTiersTitle: "Три яруса доступа — эти принуждает сама подложка",
    rolesTiersHint: "Гость — это отсутствие сессии, пользователь — любой вошедший, архитектор — владелец этого развёртывания. Архитектор по построению входит в каждую защищённую группу: владелец сервера никогда не заперт снаружи собственного приложения — отсюда же и то, что экран, работающий у вас, может отказать всем остальным.",
    rolesVocabTitle: "Ещё двенадцать — словарь, на который опирается ваше приложение",
    rolesVocabHint: "Сами по себе они никого не останавливают: это имена, о которых спрашивают ваш код и ваши двери. Страница отдаёт данные, когда роль спросила дверь, а не когда меню спрятало ссылку.",
    guestTitle: "Гостевая роль, и зачем она нужна",
    guestLead: "Некоторым вещам нужно знать, КТО их делает, раньше, чем человек готов назвать себя: наполняемая корзина, разговор с ИИ-ассистентом, наполовину заполненная форма. Спросите почту первой — и потеряете человека ровно в ту минуту, когда он был ближе всего к тому, чтобы остаться.",
    guestHow: "Поэтому служба входа умеет выдать настоящую сессию, ничего не спрашивая. Она заводит учётную запись с ролью `guest` и впускает посетителя — корзина и чат получают устойчивую личность с первого щелчка, а человек не замечает ничего. Позже, когда он войдёт по-настоящему, та же сессия станет его, и собранное останется при нём.",
    guestReadyTitle: "Это уже построено и настроено.",
    guestReady: "Изобретать под это ничего не нужно. Остаётся назвать страницы, которые должны впускать посетителя автоматически, — скажите какие, и они это получат.",
    devTitle: "На localhost:3000 авторизация игнорируется намеренно",
    devLead: "Запустив проект на своей машине, вы всегда архитектор: сессия выдаётся без единой проверки, с почтой demo@local и ролью architect. А поскольку эта роль входит в каждую защищённую группу, вам разом открыты все двери приложения.",
    devWhy: "Так сделано намеренно, и именно это делает возможной локальную работу — иначе перед каждой страницей пришлось бы входить. Цена в том, что ролевой замок здесь ПРОВЕРИТЬ нельзя: работает всё и у всех. Чтобы увидеть, что на самом деле видит менеджер или гость, откройте проект по его собственному адресу — там тот же код проверяет сессию по-настоящему.",
  },
}

const DICT: Record<string, AuthUi> = { en: EN, ru: RU }

export function authUi(lang: string): AuthUi {
  return DICT[lang] ?? DICT.en
}

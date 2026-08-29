// СЛОВА ПЯТИ ГРУПП, ПЕРЕЕХАВШИХ ИЗ ПАНЕЛИ (31-12 … 31-16, 2026-08-29).
//
// 🔒 ОТДЕЛЬНЫЙ ФАЙЛ, А НЕ ДОБАВКА К `architect-layer.i18n.ts`. Тот описывает
// ОБОЛОЧКУ слоя — крошки, меню, заголовок страницы; эти пять групп имеют каждая
// свой предмет и свой объём текста. Сложи их вместе — и файл оболочки станет
// свалкой, в которой правку меню будут искать среди объяснений про куки.
//
// 🔒 ЯЗЫКОВ ДВА — `en` и `ru`, решение владельца 2026-08-28. Остальные приходят
// файлом от внешней модели, когда набор строк устоится. Резолвер откатывается на
// английский, поэтому третий язык видит рабочую страницу, а не пустоту.
//
// 🔒 СЛОВА СЕРВЕРНЫЕ: их резолвит серверный компонент и передаёт островкам
// пропсами. Клиентский компонент, импортирующий словарь, увёз бы в браузер все
// его языки.

export type GroupsUi = {
  /** Общие для всех пяти групп. */
  save: string
  saving: string
  saved: string
  failed: string
  nothingToSave: string
  /** Предупреждение о том, что настройка применяется только после пересборки. */
  needsRebuild: string

  /** Параллельная маршрутизация. */
  routing: {
    title: string
    hint: string
    modeStandard: string
    modeStandardHint: string
    modeParallel: string
    modeParallelHint: string
    areasTitle: string
    areasHint: string
    lockedHint: string
    standardAreasHint: string
    previewTitle: string
    childrenLabel: string
    comingSoon: string
    notConsumed: string
    adviceTitle: string
    advice: string
    areas: Record<string, string>
    areaHints: Record<string, string>
  }

  /** Куки-баннер. */
  cookies: {
    title: string
    hint: string
    enable: string
    enableHint: string
    offNotice: string
    onNotice: string
    linkTitle: string
    linkHint: string
  }

  /** Хедер и футер — один словарь на два меню. */
  nav: {
    topTitle: string
    topHint: string
    footerTitle: string
    footerHint: string
    enable: string
    enableTop: string
    enableFooter: string
    items: string
    itemsHint: string
    candidates: string
    add: string
    remove: string
    up: string
    down: string
    label: string
    labelHint: string
    labelLimit: string
    empty: string
    emptyHint: string
    defaultsNotice: string
    address: string
  }

  /** Языки сайта. */
  langs: {
    title: string
    hint: string
    costTitle: string
    cost: string
    selected: string
    defaultLabel: string
    makeDefault: string
    atLeastOne: string
    defaultMustBeSelected: string
    rebuildTitle: string
    rebuild: string
    tierA: string
    tierCommunity: string
    search: string
    searchHint: string
    found: string
    nothingFound: string
    nothingFoundHint: string
    clearSearch: string
    starLegend: string
  }
}

const en: GroupsUi = {
  save: "Save",
  saving: "Saving…",
  saved: "Saved",
  failed: "Could not save",
  nothingToSave: "Nothing changed",
  needsRebuild:
    "This setting is baked in at build time: it applies after the project is rebuilt, not on the next page load.",

  routing: {
    title: "Parallel routing",
    hint:
      "How a page of this project is assembled. In the standard mode a page is one column of content. In the parallel mode the screen is divided into areas that are rendered independently — a slow one does not hold up the rest.",
    modeStandard: "Standard",
    modeStandardHint: "One column of content. Everything a page needs is rendered together.",
    modeParallel: "Parallel",
    modeParallelHint: "The screen is split into areas. Each is rendered on its own and can load at its own pace.",
    areasTitle: "Areas",
    areasHint: "Which parts of the layout exist. Turning an area off removes it from every page of the project.",
    lockedHint: "Always on: without it a page does not assemble.",
    standardAreasHint:
      "The standard mode uses three areas — header, content, footer. Switch to parallel to choose the rest.",
    previewTitle: "Layout preview",
    childrenLabel: "Page content",
    comingSoon: "Available in an upcoming update",
    adviceTitle: "Add one slot at a time",
    advice:
      "Designing an application around parallel routing takes a deep understanding of the user's path: the screen is split into areas, and each one lives its own life. Grow the project by adding no more than one slot at a time — until you understand how to use it in your own product.",
    notConsumed:
      "Nothing reads this setting yet: parallel routing is not wired into the project's root layout. You can make the choice here, but it cannot be saved — the file would say one thing and the screen another.",
    areas: {
      header: "Header",
      promoScreen: "Promo screen",
      left: "Left column",
      right: "Right column",
      centerHeader: "Above the content",
      center: "Content",
      centerFooter: "Below the content",
      footer: "Footer",
    },
    areaHints: {
      promoScreen: "A full-width band above everything — for an offer or an announcement.",
      left: "A side column: navigation, filters, a menu of the section.",
      right: "A side column: what accompanies the content rather than continues it.",
      centerHeader: "A strip directly above the content: a title, a state, a warning.",
      centerFooter: "A strip directly below the content: what comes next.",
    },
  },

  cookies: {
    title: "Cookie banner",
    hint:
      "The consent strip a visitor sees on their first visit. It governs Google Consent Mode v2: until a person answers, analytics and advertising signals stay off.",
    enable: "Show the cookie banner",
    enableHint: "Off by default — a banner nobody needs is one more thing between a visitor and the page.",
    offNotice:
      "The banner is off. If this project collects analytics or serves visitors from the EU or the UK, consent is not optional — turn it on.",
    onNotice: "The banner is on. Its wording and the policy link live on the cookie policy page.",
    linkTitle: "Cookie policy page",
    linkHint: "The banner links here. The page itself is part of the project's legal section.",
  },

  nav: {
    topTitle: "Project header",
    topHint:
      "The menu in the top bar of the site. Buttons are cut to twelve characters — one long label breaks the bar on a phone.",
    footerTitle: "Project footer",
    footerHint: "The links in the site footer. Long labels are fine here: the list is vertical.",
    enable: "Show this menu",
    enableTop: "Off hides the top bar menu on every page.",
    enableFooter: "Off hides the footer links on every page.",
    items: "Menu items",
    itemsHint: "Order is the order on the site. Drag is not needed — move an item with the arrows.",
    candidates: "Pages of this project",
    add: "Add",
    remove: "Remove",
    up: "Move up",
    down: "Move down",
    label: "Label",
    labelHint: "Leave empty to use the page's own name.",
    labelLimit: "Twelve characters — the rest is cut on the site.",
    empty: "No items yet.",
    emptyHint: "Add pages from the list on the right; nothing is shown until you save.",
    defaultsNotice:
      "This menu has never been configured, so the site builds it from the project's own sections. What you see below is that set — save it to take it over.",
    address: "Address",
  },

  langs: {
    title: "Languages",
    hint:
      "The languages of THIS site — not of the settings screens. Every selected language multiplies the number of pages the project builds and the time each build takes.",
    costTitle: "Choose the smallest sufficient set of languages",
    cost:
      "A language is not a checkbox. It costs translation, adds minutes to every build, and multiplies the project itself: fifty pages in one language become five hundred in ten. Everything grows at once — build time, the volume of checks, the price of every wording fix. Take as many languages as you are truly ready to keep, and add the next one when the previous is well kept.",
    selected: "selected",
    defaultLabel: "default",
    makeDefault: "Make default",
    atLeastOne: "At least one language has to stay selected.",
    defaultMustBeSelected: "The default language cannot be unselected — choose another default first.",
    rebuildTitle: "Applies after a rebuild",
    rebuild:
      "The language set is baked in at build time. Save it here, then rebuild the project — until then the site keeps serving the previous set.",
    tierA: "well supported by machine translation",
    tierCommunity: "little training data — expect to edit translations by hand",
    search: "Find a language",
    searchHint:
      "Type in any script: the native name, the English name or the code. Русский, Russian and ru all find the same row.",
    found: "found",
    nothingFound: "No language matches that",
    nothingFoundHint: "Try the code (en, ar, zh) or the name in the language itself.",
    clearSearch: "Clear the search",
    starLegend: "The star marks the default language — the one the site opens with.",
  },
}

const ru: GroupsUi = {
  save: "Сохранить",
  saving: "Сохраняем…",
  saved: "Сохранено",
  failed: "Не удалось сохранить",
  nothingToSave: "Ничего не изменилось",
  needsRebuild:
    "Эта настройка запекается на сборке: она применится после пересборки проекта, а не на следующей загрузке страницы.",

  routing: {
    title: "Параллельная маршрутизация",
    hint:
      "Как собирается страница этого проекта. В обычном режиме страница — одна колонка содержимого. В параллельном экран поделён на области, и каждая рисуется сама по себе: медленная не задерживает остальные.",
    modeStandard: "Обычный",
    modeStandardHint: "Одна колонка содержимого. Всё, что нужно странице, рисуется вместе.",
    modeParallel: "Параллельный",
    modeParallelHint: "Экран поделён на области. Каждая рисуется отдельно и приходит в своём темпе.",
    areasTitle: "Области",
    areasHint: "Какие части раскладки существуют. Выключенная область исчезает со всех страниц проекта.",
    lockedHint: "Всегда включена: без неё страница не собирается.",
    standardAreasHint:
      "В обычном режиме работают три области — шапка, содержимое, подвал. Остальные выбираются в параллельном.",
    previewTitle: "Чертёж раскладки",
    childrenLabel: "Содержимое страницы",
    comingSoon: "Будет доступно в ближайшем обновлении",
    adviceTitle: "Добавляйте по одному слоту",
    advice:
      "Проектирование приложения с параллельной маршрутизацией требует глубокого понимания пути пользователя: экран делится на области, и каждая живёт своей жизнью. Развивайте проект, добавляя не более одного слота за раз, — пока вы не поймёте, как использовать его в своём продукте.",
    notConsumed:
      "Эту настройку пока никто не читает: параллельная маршрутизация ещё не подключена в корневой layout проекта. Выбор здесь можно сделать, но сохранить его нельзя — файл остался бы с одним ответом, а экран с другим.",
    areas: {
      header: "Шапка",
      promoScreen: "Промо-экран",
      left: "Левая колонка",
      right: "Правая колонка",
      centerHeader: "Над содержимым",
      center: "Содержимое",
      centerFooter: "Под содержимым",
      footer: "Подвал",
    },
    areaHints: {
      promoScreen: "Полоса во всю ширину над всем остальным — для предложения или объявления.",
      left: "Боковая колонка: навигация, фильтры, меню раздела.",
      right: "Боковая колонка: то, что сопровождает содержимое, а не продолжает его.",
      centerHeader: "Полоса прямо над содержимым: заголовок, состояние, предупреждение.",
      centerFooter: "Полоса прямо под содержимым: что дальше.",
    },
  },

  cookies: {
    title: "Куки-баннер",
    hint:
      "Полоса согласия, которую посетитель видит при первом визите. Она управляет Google Consent Mode v2: пока человек не ответил, сигналы аналитики и рекламы выключены.",
    enable: "Показывать куки-баннер",
    enableHint: "По умолчанию выключен: баннер, который никому не нужен, — ещё одна вещь между посетителем и страницей.",
    offNotice:
      "Баннер выключен. Если проект собирает аналитику или принимает посетителей из ЕС и Великобритании, согласие обязательно — включите.",
    onNotice: "Баннер включён. Его текст и ссылка на политику живут на странице политики использования куки.",
    linkTitle: "Страница политики куки",
    linkHint: "Баннер ведёт сюда. Сама страница — часть правового раздела проекта.",
  },

  nav: {
    topTitle: "Хедер проекта",
    topHint:
      "Меню в верхней полосе сайта. Кнопки режутся до двенадцати знаков — один длинный пункт разносит полосу на телефоне.",
    footerTitle: "Футер проекта",
    footerHint: "Ссылки в подвале сайта. Длинные подписи здесь допустимы: список вертикальный.",
    enable: "Показывать это меню",
    enableTop: "Выключенное скрывает меню верхней полосы на всех страницах.",
    enableFooter: "Выключенное скрывает ссылки подвала на всех страницах.",
    items: "Пункты меню",
    itemsHint: "Порядок здесь — порядок на сайте. Перетаскивание не нужно: пункт двигается стрелками.",
    candidates: "Страницы этого проекта",
    add: "Добавить",
    remove: "Убрать",
    up: "Выше",
    down: "Ниже",
    label: "Подпись",
    labelHint: "Оставьте пустым — возьмётся собственное имя страницы.",
    labelLimit: "Двенадцать знаков — остальное на сайте обрежется.",
    empty: "Пунктов пока нет.",
    emptyHint: "Добавьте страницы из списка справа; до сохранения ничего не меняется.",
    defaultsNotice:
      "Это меню ещё ни разу не настраивали, и сайт собирает его из собственных разделов проекта. Ниже показан именно этот набор — сохраните, чтобы взять его в свои руки.",
    address: "Адрес",
  },

  langs: {
    title: "Языки",
    hint:
      "Языки ЭТОГО сайта — не языки экранов настроек. Каждый выбранный язык умножает число страниц, которые собирает проект, и время каждой сборки.",
    costTitle: "Выбирайте минимально достаточное количество языков",
    cost:
      "Язык — не отметка в списке. Он стоит переводов, добавляет минуты каждой сборке и умножает сам проект: пятьдесят страниц на одном языке превращаются в пятьсот на десяти. Растёт всё сразу — время сборки, объём проверок, цена каждой правки текста. Берите столько языков, сколько действительно готовы вести, и добавляйте следующий, когда предыдущий ухожен.",
    selected: "выбрано",
    defaultLabel: "основной",
    makeDefault: "Сделать основным",
    atLeastOne: "Хотя бы один язык должен остаться выбранным.",
    defaultMustBeSelected: "Основной язык нельзя снять — сначала назначьте основным другой.",
    rebuildTitle: "Применится после пересборки",
    rebuild:
      "Набор языков запекается на сборке. Сохраните его здесь, затем пересоберите проект — до этого сайт продолжает отдавать прежний набор.",
    tierA: "хорошо поддержан машинным переводом",
    tierCommunity: "данных мало — переводы придётся править руками",
    search: "Найти язык",
    searchHint:
      "Пишите любым письмом: родное название, английское или код. «Русский», Russian и ru находят одну и ту же строку.",
    found: "найдено",
    nothingFound: "Такого языка не нашлось",
    nothingFoundHint: "Попробуйте код (en, ar, zh) или название на самом языке.",
    clearSearch: "Очистить поиск",
    starLegend: "Звёздочкой отмечен язык по умолчанию — тот, с которого открывается сайт.",
  },
}

const DICT: Record<string, GroupsUi> = { en, ru }

export function groupsUi(lang: string): GroupsUi {
  return DICT[lang] ?? DICT.en
}

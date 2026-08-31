// СЛОВА ГРУППЫ «ДИЗАЙН» (39-2 … 39-5, 2026-08-29).
//
// 🔒 ТЕКСТЫ ПЕРЕНЕСЕНЫ ИЗ СЛОВАРЯ ПАНЕЛИ ДОСЛОВНО — решение владельца, данное на
// прямой вопрос: «перенести из словаря панели дословно». Источник —
// bridges/app/lib/i18n/admin-translations.json, ветки designFonts, designType,
// designShape, designColors и заголовки четырёх страниц.
//
// Это НЕ сочинение текста продукта, закреплённое за владельцем: слова уже
// написаны, им приняты и живут на 82 языках. Переписать их «получше» при переносе
// значило бы подменить принятое своим — и человек, знавший панель, увидел бы
// другой продукт там, где ему обещали тот же.
//
// 🔒 ЗДЕСЬ en И ru; ОСТАЛЬНЫЕ 80 — ДОЛГ, НАЗВАННЫЙ ВСЛУХ. Тот же порядок, что у
// режима разработки: слой архитектора живёт по закону слота — два языка пишу я,
// остальные приходят файлом от внешней модели. Панельные 82 сюда не переносятся:
// там свой словарь и своя сборка.
//
// 🔒 СЛОВАРЬ СЕРВЕРНЫЙ. Ни один файл с директивой клиента не имеет права его
// импортировать: строки едут островкам пропсами — общий закон слоя. 82 языка на
// ~600 ключей это 4–6 МБ в браузер на каждой странице.
//
// 🔒 ПОДПИСИ САМИХ РАЗДЕЛОВ ЖИВУТ В pages, А НЕ РЯДОМ С ПОЛЯМИ. Их читает левое
// меню, которое о полях ничего не знает и знать не должно.

const EN = {
  "fonts": {
    "intro": "Three roles, one decision each: headings, body text, and monospace. The set opens on the system font — it downloads nothing and reaches no third party.",
    "roles": {
      "heading": {
        "label": "Headings",
        "description": "H1 through H4. This is where a project gets its character."
      },
      "body": {
        "label": "Body text",
        "description": "Paragraphs, lists, captions — most of what a person actually reads."
      },
      "mono": {
        "label": "Monospace",
        "description": "Code, identifiers, numbers in tables."
      }
    },
    "systemOption": "System font — no download",
    "systemNote": "Takes whatever the device already has. Nothing is downloaded, nothing leaves the page, and text is visible in the very first frame.",
    "alphabets": {
      "latin": "Latin",
      "cyrillic": "Cyrillic",
      "greek": "Greek",
      "arabic": "Arabic",
      "cjk": "CJK"
    },
    "covers": "Covers",
    "noDownload": "no download",
    "external": "loaded from fonts.googleapis.com",
    "preview": "Preview",
    "previewText": "The quick brown fox — Съешь ещё этих мягких булок 0123",
    "save": "Save",
    "saving": "Saving…",
    "saved": "Saved",
    "failed": "Could not save",
    "nothingToSave": "Nothing changed",
    "reset": "Back to the theme font",
    "helpLabel": "About fonts: where they come from and how they are connected",
    "helpWhereTitle": "Where they live.",
    "helpWhere": "The families in this list come from Google Fonts (fonts.google.com), all under a free licence — OFL or Apache. The files themselves are NOT stored on your server: a visitor receives them from fonts.googleapis.com, whose cache is already warm on nearly every device.",
    "helpHowTitle": "How they are connected.",
    "helpHow": "Saving writes the family name and its stylesheet URL into DESIGN-CONFIG/design-config.json on your server. The application reads that file on every render and emits two things: a <link> to the stylesheet in <head>, and a CSS variable that the type primitive uses. A <link> rather than an @import on purpose — the browser sees a link immediately, while an @import inside <style> costs an extra network round-trip before the font is even requested. No rebuild is needed; the change shows on the next page load.",
    "helpPrivacyTitle": "What this means in Europe.",
    "helpPrivacy": "Connecting an external font hands the visitor IP address to Google servers. A German court has ruled that this alone breaches GDPR (LG München I, 3 O 17493/20). The system option avoids the question entirely: it never reaches outside. If you need both a custom font and that guarantee, the font files have to be hosted on your own server — that is a separate step, not a setting.",
    "helpAlphabetTitle": "Alphabets are not a detail.",
    "helpAlphabet": "A font without Cyrillic turns a Russian page into a row of rectangles, and the build will not warn you — the page renders perfectly, it is simply unreadable. Every entry states which alphabets it covers; check it against the languages you switched on.",
    "helpSystemTitle": "Why the system font is first.",
    "helpSystem": "It is the fastest possible answer: nothing to download, nothing to wait for, no third party involved. For most projects it is also the right one — a custom font earns its cost only when the brand actually depends on it."
  },
  "type": {
    "intro": "One number changes the whole set: headings, body text, captions — all of it, proportions intact.",
    "scaleLabel": "Type scale",
    "scaleHint": "A multiplier over the project scale. 1.0 is the size the project ships with.",
    "leadingLabel": "Line height",
    "leadingHint": "The space between lines of body text. Lower is denser, higher is airier.",
    "presets": {
      "compact": "Compact",
      "normal": "Default",
      "relaxed": "Relaxed"
    },
    "preview": "Preview",
    "previewH1": "This is a page heading",
    "previewBody": "And this is body text underneath it — the size most of your visitors will actually read.",
    "save": "Save",
    "saving": "Saving…",
    "saved": "Saved",
    "failed": "Could not save",
    "nothingToSave": "Nothing changed",
    "reset": "Back to the project scale",
    "helpLabel": "Why one multiplier and not nine separate sizes",
    "helpWhyTitle": "Nine fields are nine ways to break the scale.",
    "helpWhy": "A subtitle larger than its heading, body text smaller than a caption — that is exactly the disarray this project spent a day removing from its code. A multiplier moves everything at once and keeps the proportions: the set is either bigger or smaller, never inconsistent.",
    "helpRangeTitle": "Why the range is limited.",
    "helpRange": "Between 0.75 and 1.5. Outside it text is either unreadable or breaks the layout, and you would only discover that by opening every page. The limit lives in the application, not in this form — a value has to be checked where it arrives, not where it is typed.",
    "helpLiveTitle": "It applies without a rebuild.",
    "helpLive": "The value is written into DESIGN-CONFIG on your server; the application reads it on every render as a CSS variable, and each step of the scale is calculated from it. The change shows on the next page load."
  },
  "shape": {
    "intro": "Corners, borders and breathing room — the shape of every surface on the site.",
    "radiusLabel": "Corner rounding",
    "radiusHint": "Applies to cards, panels, buttons and inputs at once — each derives its own radius from this one value.",
    "radiusPresets": {
      "square": "Square",
      "soft": "Soft",
      "round": "Rounded",
      "pill": "Very round"
    },
    "borderLabel": "Border width",
    "borderHint": "A two-pixel border changes the character of an interface more than a colour does.",
    "spaceLabel": "Density",
    "spaceHint": "Vertical breathing room on every page. Content pages and work screens keep their difference — this moves both together.",
    "spacePresets": {
      "dense": "Dense",
      "normal": "Default",
      "airy": "Airy"
    },
    "widthLabel": "Content width",
    "widthHint": "How wide the middle column of a page may grow. The header, the first screen and the footer are always full width.",
    "preview": "Preview",
    "previewCard": "A card on the page",
    "previewBody": "Its text sits inside the border, at the distance the density sets.",
    "save": "Save",
    "saving": "Saving…",
    "saved": "Saved",
    "failed": "Could not save",
    "nothingToSave": "Nothing changed",
    "reset": "Back to the project shapes",
    "helpLabel": "How these four values reach the pages",
    "helpRadiusTitle": "One radius, five derivatives.",
    "helpRadius": "The project computes small, medium, large and extra-large corners from this single number, so a card, a button and an input never disagree. Setting them separately is how interfaces end up with three different corners on one screen.",
    "helpSpaceTitle": "Density is a multiplier, not a number of pixels.",
    "helpSpace": "Content pages are airier than work screens on purpose: one is read, the other is worked in. The multiplier moves both and keeps that difference — separate fields would let a work screen become airier than a content page, which is not a setting but a defect.",
    "helpWidthTitle": "Width governs the middle only.",
    "helpWidth": "The page header, the first screen, the closing section and the footer are always full width. This value limits the column between them — the one the reader's eye travels along, where an over-long line becomes hard to follow."
  },
  "colors": {
    "intro": "Seven roles, two themes. Each colour is an override: leave it untouched and the project theme decides.",
    "themeLight": "Light theme",
    "themeDark": "Dark theme",
    "roles": {
      "primary": {
        "label": "Brand colour",
        "description": "Buttons, links, active states. The one colour a visitor will remember."
      },
      "accent": {
        "label": "Accent",
        "description": "Highlights and hovers — a quieter relative of the brand colour."
      },
      "background": {
        "label": "Page background",
        "description": "What everything else sits on."
      },
      "foreground": {
        "label": "Text",
        "description": "The main reading colour."
      },
      "muted": {
        "label": "Muted surface",
        "description": "Cards, panels, the background of secondary blocks."
      },
      "border": {
        "label": "Borders",
        "description": "Lines between elements — the quietest colour on the page."
      },
      "destructive": {
        "label": "Danger",
        "description": "Deletion, errors, anything irreversible."
      },
      "chart-1": {
        "label": "Chart series 1",
        "description": "The first data series on a chart — and the only colour when a chart has one series."
      },
      "chart-2": {
        "label": "Chart series 2",
        "description": "The second series. It is read right next to the first, so it has to differ at a glance."
      },
      "chart-3": {
        "label": "Chart series 3",
        "description": "The third series, for charts that compare more than a pair."
      },
      "chart-4": {
        "label": "Chart series 4",
        "description": "The fourth series. Pie and radial charts use all five."
      },
      "chart-5": {
        "label": "Chart series 5",
        "description": "The fifth and last: more than five colours nobody tells apart anyway."      },
      "warning": {
        "label": "Warning",
        "description": "«It did not work out» — a notice, not a failure. Deliberately not the colour of deletion: it says try again, not something broke."
      },
      "recording": {
        "label": "Recording",
        "description": "The colour of the voice field while it listens. It is a state, not an error."
      }
    },
    "contrastOk": "Readable",
    "contrastLow": "Hard to read",
    "contrastBad": "Unreadable",
    "contrastHint": "Text against the page background. Below 4.5 the text fails the accessibility threshold for normal sizes.",
    "preview": "Preview",
    "previewHeading": "A heading on the page",
    "previewBody": "And the body text under it, in the colour people will actually read.",
    "previewButton": "A button",
    "save": "Save",
    "saving": "Saving…",
    "saved": "Saved",
    "failed": "Could not save",
    "nothingToSave": "Nothing changed",
    "reset": "Back to the theme colours",
    "helpLabel": "How colours reach the site, and what is computed for you",
    "helpPairTitle": "The text on a button is computed, not asked for.",
    "helpPair": "Every coloured role has a paired text colour on top of it. Change the brand colour and leave the pair alone, and a light brand colour keeps white text — a button whose label cannot be seen. The application derives that pair from the brightness of your colour, so the label stays readable whatever you pick.",
    "helpThemesTitle": "Light and dark are separate values.",
    "helpThemes": "A colour set once is almost always wrong on the other theme: dark text on a dark background disappears entirely. Set only the theme you care about — the other keeps the project's.",
    "helpContrastTitle": "The contrast figure is a measurement, not an opinion.",
    "helpContrast": "It is the ratio between text and background as the accessibility standard defines it. 4.5 is the threshold for normal text, 3.0 for large. Below that the page is not 'a matter of taste' — part of your visitors cannot read it.",
    "schemesLabel": "Ready-made schemes",
    "schemesHint": "One press sets all seven roles in both themes. Adjust anything afterwards — the change stays; press the same scheme again and its values come back.",
    "schemeCustom": "Your own combination — no ready-made scheme matches it exactly.",
    "schemes": {
      "zinc": "Zinc",
      "slate": "Slate",
      "stone": "Stone",
      "blue": "Blue",
      "violet": "Violet",
      "green": "Green",
      "orange": "Orange",
      "rose": "Rose",
      "teal": "Teal",
      "amber": "Amber"
    }
  },
  "pages": {
    "fonts": {
      "title": "Fonts",
      "hint": "Headings, body text and monospace — where the families come from and how they are connected."
    },
    "type": {
      "title": "Typography",
      "hint": "The type scale and line height — one number for the whole set."
    },
    "shape": {
      "title": "Shapes & spacing",
      "hint": "Corner rounding, borders, density and content width."
    },
    "colors": {
      "title": "Colours",
      "hint": "Seven roles in two themes, with a live contrast check."
    },
    "dialogs": {
      "title": "Dialogs",
      "hint": "The one modal window this project has, shown in its real settings. Press a button — the real window opens, not a picture of one.",
      "show": "Show the window",
      "longLine": "A line of body text. The body scrolls; the heading and the buttons do not move.",
      "lockedHint": "This window has no cross and ignores Escape and a click outside. The only lawful use is refusing access: closing it would leave the person on a page they may not see.",
      "samples": [
        {"id":"plain","name":"Plain","note":"A heading, an explanation, a cross. A reference window is closed, not confirmed — so it has no buttons at all.","title":"A window without buttons","description":"Read and close. This is a complete, and often the right, kind of window.","body":"The body is optional too: a question like \"add three to the order?\" fits into the heading and the explanation whole, and an empty body would draw a strip of air under them."},
        {"id":"footer","name":"With buttons","note":"A footer that stays put. Buttons belong to the WINDOW, not to the body — otherwise they scroll away with the text.","title":"A window with a footer","description":"Confirm or cancel.","body":"The footer sits below the body and does not move with it. On a phone this is the difference between a reachable button and an unreachable one.","footerOk":"Confirm","footerCancel":"Cancel"},
        {"id":"long","name":"Long — this is the one that matters","note":"The body outgrows the screen and scrolls; the heading and the buttons stay. Exactly what a hand-built window loses.","title":"A long window","description":"Scroll the body — the heading and the buttons do not move.","footerOk":"Done","footerCancel":"Close"},
        {"id":"locked","name":"Cannot be dismissed","note":"No cross, no Escape, no click-outside. One lawful use: refusing access.","title":"Access refused","description":"The only case where a window may not be closed.","footerOk":"Go to the main page"}
      ]
    },
    "blocks": {
      "title": "Blocks",
      "hint": "Every block this project can build a page from, drawn by the real renderer. Grouped by what the block is for.",
      "helpLabel": "How a page in this project is built",
      "helpMore": "Learn more",
      "helpLess": "Collapse",
      "helpWhatTitle": "A block is the unit a page is made of.",
      "helpWhat": "A page here is not a laid-out file — it is a LIST OF BLOCKS. The renderers are already compiled; the page says which kinds stand on it, in what order and with what text. That is why every page in the project looks like one product rather than like the work of five different people.",
      "helpThreeTitle": "There is no other way to build a page, and there are exactly three paths.",
      "helpThree": "Take a kind that fits. Or create a new kind and then take it — it lands in this catalogue and becomes available to every page. Or, if the thing is unique and belongs to a single route, take a widget. There is no fourth path: hand-laid markup outside these three is invisible to the catalogue, cannot be moved to another page, cannot be reordered against the text, and is not translated by a language cell.",
      "helpWidgetTitle": "Block or widget is decided by REUSE, not by complexity.",
      "helpWidget": "A kind must suit any page in the project — that is what earns it a place in this catalogue. A widget need suit nobody but its own route: unique graphics, its own behaviour, its own face, and it dies together with that route. So the question to ask is never \"is this hard to build\" but \"will a second page want exactly this drawing\".",
      "helpParallelTitle": "With parallel routing a new page needs no build at all.",
      "helpParallel": "Choose parallel routing and the page stops being a file: routes and their block lists live in data, and the slot page prerenders NOTHING at build time — it resolves the address on request and then caches the answer. Adding a route to the data adds a page in production, live, with no deployment and no rebuild. This is measured, not assumed: in the reference application the slot page declares generateStaticParams() returning an empty list, dynamicParams true and revalidate 300, and it reads its routes and blocks from the database on the request.",
      "request": {
        "editLabel": "Suggest a change to %s",
        "editTitle": "Change the block %s",
        "editLead": "Describe in your own words what should be different. Your words go to the agent verbatim; nothing happens until you ask him to take it.",
        "createLabel": "Ask for a new block in this category",
        "createTitle": "A new block in «%s»",
        "createLead": "Describe the block you are missing. The category is already chosen — it is the one you are looking at.",
        "whatLabel": "What should it be",
        "whatPlaceholder": "For example: the same, but with the picture on the left and the quote on the right, and room for a company name",
        "roleLabel": "What role it plays and where it breaks",
        "roleHint": "Optional. If you do not know yet, leave it empty — the agent will ask.",
        "rolePlaceholder": "For example: shows partner logos, no more than eight, and reads on a phone",
        "stylesHint": "You may reuse a ready-made look: put a link to an open-source project in the description, or copy the styles from your browser console (right-click → Inspect → Styles) and paste them there too. The agent will read them and keep the shape, translating the colours into this project's palette.",
        "send": "Send to the agent",
        "sending": "Sending…",
        "cancel": "Cancel",
        "toastTitle": "Request created:",
        "toastWhere": "It waits in development-docs/development-steps/pre-steps/",
        "toastNext": "Nothing starts on its own: when the agent finishes his current stage, ask him to plan this request.",
        "toastGot": "Understood",
        "toastFailed": "The request was not created. Nothing was saved — try again."
      },
    },
    "tools": {
      "title": "Tools",
      "hint": "The reusable tools this project already carries, and the place to ask for one it does not.",
      "helpMore": "Learn more",
      "helpLess": "Collapse",
      "helpWhatTitle": "A tool is a reusable piece with a home.",
      "helpWhat": "It lives in `_tools/<id>/` as one folder — client, server, types — and it is taken by different functional components rather than belonging to any one of them. Image cropping is used by two fields of this layer; voice input by a product form and by a shared control. That is the whole idea: written once, taken many times.",
      "helpWhyTitle": "The catalogue exists so that nobody builds the second copy.",
      "helpWhy": "The translations dialog lived among ordinary components for months, was in no catalogue, and the translate button was therefore built again from scratch — a line of text where a window belonged. A tool nobody can find is the same as a tool that does not exist. So this page is generated from the folder itself: a tool that is there is shown, and a hand-written list is forbidden.",
      "helpWidgetTitle": "Tool or widget is decided before the first line, and not by complexity.",
      "helpWidget": "One question separates them: will a SECOND caller want exactly this thing? A tool goes through compilation and lives while at least one caller needs it; a widget arrives as runtime data, serves one route and dies with it. Anything that enters the build is a tool by definition — an ordinary import is compilation.",
      "helpExceptionTitle": "The switch at the bottom of this page is an exception, and it is named as one.",
      "helpException": "The screen-width indicator is not a reusable tool: it is an instrument that lies over the site for its owner and changes nothing in the project. It stays here by the owner's decision, and it is placed below the catalogue rather than inside it — an exception that is not named as one is read as the rule.",
      "catalogueTitle": "Tools this project carries",
      "instrumentsTitle": "Instruments over the site",
      "instrumentsLead": "Not a reusable tool, and it is here as a deliberate exception: this one is visible to you, not to the visitor.",
      "needsLabel": "Needs",
      "needs": {
        "browser": "a browser",
        "https": "HTTPS",
        "openai-key": "an OpenAI key",
        "ffmpeg": "ffmpeg in the data layer"
      },
      "npmLabel": "Package to install:",
      "usedByLabel": "Already used by:",
      "usedByNone": "Not used by anything yet — it is here, ready to be taken.",
      "whatLabel": "What it does",
      "howLabel": "How to use it",
      "valueLabel": "What it gives you",
      "request": {
        "editLabel": "Suggest a change to %s",
        "editTitle": "Change the tool %s",
        "editLead": "Describe in your own words what should be different — a refusal that explains nothing, a missing setting, behaviour that gets in the way. The tool keeps the same patterns as the others in `_tools/` and the `use-tools` skill still governs it. Your words go to the agent verbatim; nothing happens until you ask him to take it.",
        "createLabel": "Ask for a new tool",
        "createTitle": "A new tool for this project",
        "createLead": "Describe the capability you are missing — image generation with AI, document recognition, a map, a signature. It will be built in the SAME patterns as the tools above: its own folder `_tools/<id>/` with client, server and types, its own `tool.json` card, a place in this catalogue — and under the `use-tools` skill, which governs how tools are built here. Your words go to the agent verbatim; nothing happens until you ask him to take it.",
        "whatLabel": "What should it be able to do",
        "whatPlaceholder": "For example: generate an illustration from a text description and put the result straight into the picture field",
        "whereLabel": "Where you will use it",
        "whereHint": "Optional. This is the question that decides tool or widget — if a second place will want the same thing, it is a tool.",
        "wherePlaceholder": "For example: in the block editor and in the product card",
        "send": "Send to the agent",
        "sending": "Sending…",
        "cancel": "Cancel",
        "toastTitle": "Request created:",
        "toastWhere": "It waits in development-docs/development-steps/pre-steps/",
        "toastNext": "Nothing starts on its own: when the agent finishes his current stage, ask him to plan this request.",
        "toastGot": "Understood",
        "toastFailed": "The request was not created. Nothing was saved — try again."
      }
    },
  },
  "allTypes": "All",
  "createBlock": "Create a new block",
  "createBlockHint": "Not built yet — the button is here so the place for it is visible.",
  "countLabel": "kinds",
  "viewportBadgeLabel": "Screen width indicator",
  "viewportBadgeHint": "A small circle in the bottom left corner: the current width in pixels and the breakpoint it falls into. It talks about layout in numbers instead of impressions — and it is visible on the live site, not only in development.",
  "toolsOn": "On",
  "toolsOff": "Off"
}

const RU: typeof EN = {
  "fonts": {
    "intro": "Три роли, по одному решению на каждую: заголовки, основной текст, моноширинный. Набор открывается системным шрифтом — он ничего не скачивает и никуда не обращается.",
    "roles": {
      "heading": {
        "label": "Заголовки",
        "description": "От H1 до H4. Именно здесь у проекта появляется характер."
      },
      "body": {
        "label": "Основной текст",
        "description": "Абзацы, списки, подписи — большая часть того, что человек читает."
      },
      "mono": {
        "label": "Моноширинный",
        "description": "Код, идентификаторы, числа в таблицах."
      }
    },
    "systemOption": "Системный шрифт — без загрузки",
    "systemNote": "Берёт то, что уже стоит на устройстве. Ничего не скачивается, ничего не уходит наружу, текст виден в первый же кадр.",
    "alphabets": {
      "latin": "латиница",
      "cyrillic": "кириллица",
      "greek": "греческий",
      "arabic": "арабский",
      "cjk": "CJK"
    },
    "covers": "Покрывает",
    "noDownload": "без загрузки",
    "external": "загружается с fonts.googleapis.com",
    "preview": "Как выглядит",
    "previewText": "Съешь ещё этих мягких булок — The quick brown fox 0123",
    "save": "Сохранить",
    "saving": "Сохраняю…",
    "saved": "Сохранено",
    "failed": "Не удалось сохранить",
    "nothingToSave": "Ничего не изменилось",
    "reset": "Вернуть шрифт темы",
    "helpLabel": "О шрифтах: откуда они берутся и как подключаются",
    "helpWhereTitle": "Где они живут.",
    "helpWhere": "Семейства из этого списка — с Google Fonts (fonts.google.com), все под свободной лицензией OFL или Apache. Сами файлы НЕ хранятся на вашем сервере: посетитель получает их с fonts.googleapis.com, и её кэш уже прогрет почти на каждом устройстве.",
    "helpHowTitle": "Как подключаются.",
    "helpHow": "Сохранение записывает имя семейства и адрес таблицы стилей в DESIGN-CONFIG/design-config.json на вашем сервере. Приложение читает этот файл на каждом рендере и выдаёт две вещи: ссылку <link> на таблицу в шапке страницы и переменную CSS, которой пользуется примитив типографики. Именно <link>, а не @import — браузер видит ссылку сразу, тогда как @import внутри <style> стоит лишнего оборота сети ещё до того, как шрифт будет запрошен. Пересборка не нужна: изменение видно на следующей загрузке страницы.",
    "helpPrivacyTitle": "Что это значит в Европе.",
    "helpPrivacy": "Подключение внешнего шрифта отдаёт адрес посетителя серверам Google. Немецкий суд признал, что одно это нарушает GDPR (LG München I, 3 O 17493/20). Системный вариант снимает вопрос целиком: он не ходит наружу вовсе. Если нужен и свой шрифт, и эта гарантия — файлы шрифта придётся положить на собственный сервер, и это отдельная работа, а не настройка.",
    "helpAlphabetTitle": "Алфавиты — не мелочь.",
    "helpAlphabet": "Шрифт без кириллицы превращает русскую страницу в ряд прямоугольников, и сборка об этом не предупредит: страница отрисуется прекрасно, просто её нельзя будет прочитать. У каждой записи указано, какие алфавиты она покрывает, — сверьте с языками, которые вы включили.",
    "helpSystemTitle": "Почему системный шрифт первый.",
    "helpSystem": "Это самый быстрый из возможных ответов: нечего скачивать, нечего ждать, никаких третьих сторон. Для большинства проектов он же и правильный — свой шрифт оправдывает свою цену только тогда, когда от него действительно зависит бренд."
  },
  "type": {
    "intro": "Одно число меняет весь набор: заголовки, основной текст, подписи — всё сразу, с сохранением пропорций.",
    "scaleLabel": "Масштаб текста",
    "scaleHint": "Множитель к шкале проекта. 1,0 — тот размер, с которым проект приехал.",
    "leadingLabel": "Межстрочный интервал",
    "leadingHint": "Расстояние между строками основного текста. Меньше — плотнее, больше — свободнее.",
    "presets": {
      "compact": "Плотно",
      "normal": "Как в проекте",
      "relaxed": "Свободно"
    },
    "preview": "Как выглядит",
    "previewH1": "Так выглядит заголовок страницы",
    "previewBody": "А так — основной текст под ним: тот самый размер, который и будут читать ваши посетители.",
    "save": "Сохранить",
    "saving": "Сохраняю…",
    "saved": "Сохранено",
    "failed": "Не удалось сохранить",
    "nothingToSave": "Ничего не изменилось",
    "reset": "Вернуть шкалу проекта",
    "helpLabel": "Почему один множитель, а не девять отдельных размеров",
    "helpWhyTitle": "Девять полей — это девять способов развалить шкалу.",
    "helpWhy": "Подзаголовок крупнее своего заголовка, основной текст мельче подписи — ровно тот разнобой, на вычистку которого из кода ушёл день. Множитель двигает всё сразу и сохраняет пропорции: набор становится либо крупнее, либо мельче, но никогда не рассогласованным.",
    "helpRangeTitle": "Почему предел ограничен.",
    "helpRange": "От 0,75 до 1,5. За этими границами текст либо нечитаем, либо ломает раскладку, а узнать об этом можно, только открыв каждую страницу. Предел стоит в приложении, а не в этой форме: значение проверяют там, куда оно приходит, а не там, где его набирают.",
    "helpLiveTitle": "Применяется без пересборки.",
    "helpLive": "Значение записывается в DESIGN-CONFIG на вашем сервере; приложение читает его на каждом рендере как переменную CSS, и каждая ступень шкалы считается от неё. Изменение видно на следующей загрузке страницы."
  },
  "shape": {
    "intro": "Углы, рамки и воздух — форма каждой поверхности на сайте.",
    "radiusLabel": "Скругление углов",
    "radiusHint": "Действует сразу на карточки, панели, кнопки и поля ввода — каждый элемент выводит свой радиус из этого одного значения.",
    "radiusPresets": {
      "square": "Прямые",
      "soft": "Мягкие",
      "round": "Скруглённые",
      "pill": "Очень круглые"
    },
    "borderLabel": "Толщина рамки",
    "borderHint": "Рамка в два пикселя меняет характер интерфейса сильнее, чем цвет.",
    "spaceLabel": "Плотность",
    "spaceHint": "Вертикальный воздух на всех страницах. Разница между контентными и рабочими экранами сохраняется — это число двигает обе меры вместе.",
    "spacePresets": {
      "dense": "Плотно",
      "normal": "Как в проекте",
      "airy": "Свободно"
    },
    "widthLabel": "Ширина содержимого",
    "widthHint": "Насколько широкой может стать средняя колонка страницы. Шапка, первый экран и подвал всегда во всю ширину.",
    "preview": "Как выглядит",
    "previewCard": "Карточка на странице",
    "previewBody": "Её текст стоит внутри рамки, на том расстоянии, которое задаёт плотность.",
    "save": "Сохранить",
    "saving": "Сохраняю…",
    "saved": "Сохранено",
    "failed": "Не удалось сохранить",
    "nothingToSave": "Ничего не изменилось",
    "reset": "Вернуть формы проекта",
    "helpLabel": "Как эти четыре значения доходят до страниц",
    "helpRadiusTitle": "Один радиус, пять производных.",
    "helpRadius": "Проект считает из этого числа малый, средний, большой и увеличенный углы, поэтому карточка, кнопка и поле ввода не могут разойтись. Задавать их по отдельности — так и появляются интерфейсы с тремя разными углами на одном экране.",
    "helpSpaceTitle": "Плотность — множитель, а не число пикселей.",
    "helpSpace": "Контентные страницы свободнее рабочих намеренно: одни читают, в других работают. Множитель двигает обе меры и сохраняет эту разницу — отдельные поля позволили бы сделать рабочий экран воздушнее контентного, а это не настройка, а дефект.",
    "helpWidthTitle": "Ширина управляет только серединой.",
    "helpWidth": "Шапка страницы, первый экран, завершающая секция и подвал всегда во всю ширину. Это значение ограничивает колонку между ними — ту, по которой идёт взгляд читателя и где слишком длинная строка становится трудной."
  },
  "colors": {
    "intro": "Семь ролей, две темы. Каждый цвет — перекрытие: не тронули — решает тема проекта.",
    "themeLight": "Светлая тема",
    "themeDark": "Тёмная тема",
    "roles": {
      "primary": {
        "label": "Фирменный цвет",
        "description": "Кнопки, ссылки, активные состояния. Тот единственный цвет, который посетитель запомнит."
      },
      "accent": {
        "label": "Акцент",
        "description": "Выделения и наведение — более тихий родственник фирменного цвета."
      },
      "background": {
        "label": "Фон страницы",
        "description": "То, на чём стоит всё остальное."
      },
      "foreground": {
        "label": "Текст",
        "description": "Основной цвет чтения."
      },
      "muted": {
        "label": "Приглушённая поверхность",
        "description": "Карточки, панели, фон вспомогательных блоков."
      },
      "border": {
        "label": "Рамки",
        "description": "Линии между элементами — самый тихий цвет на странице."
      },
      "destructive": {
        "label": "Опасность",
        "description": "Удаление, ошибки, всё необратимое."
      },
      "chart-1": {
        "label": "Диаграмма, ряд 1",
        "description": "Первый ряд данных на диаграмме — и единственный цвет, если ряд один."
      },
      "chart-2": {
        "label": "Диаграмма, ряд 2",
        "description": "Второй ряд. Его читают рядом с первым, поэтому отличаться он обязан с первого взгляда."
      },
      "chart-3": {
        "label": "Диаграмма, ряд 3",
        "description": "Третий ряд — для диаграмм, где сравнивают больше двух величин."
      },
      "chart-4": {
        "label": "Диаграмма, ряд 4",
        "description": "Четвёртый ряд. Круговая и радиальная берут все пять."
      },
      "chart-5": {
        "label": "Диаграмма, ряд 5",
        "description": "Пятый и последний: больше пяти цветов человек всё равно не различает."      },
      "warning": {
        "label": "Предупреждение",
        "description": "«Не получилось» — сообщение, а не отказ. Намеренно не цвет удаления: оно говорит «попробуйте снова», а не «сломалось»."
      },
      "recording": {
        "label": "Идёт запись",
        "description": "Цвет голосового поля, пока оно слушает. Это состояние, а не ошибка."
      }
    },
    "contrastOk": "Читаемо",
    "contrastLow": "Читается трудно",
    "contrastBad": "Нечитаемо",
    "contrastHint": "Текст на фоне страницы. Ниже 4,5 текст не проходит порог доступности для обычного размера.",
    "preview": "Как выглядит",
    "previewHeading": "Заголовок на странице",
    "previewBody": "И основной текст под ним — тем цветом, которым его и будут читать.",
    "previewButton": "Кнопка",
    "save": "Сохранить",
    "saving": "Сохраняю…",
    "saved": "Сохранено",
    "failed": "Не удалось сохранить",
    "nothingToSave": "Ничего не изменилось",
    "reset": "Вернуть цвета темы",
    "helpLabel": "Как цвета доходят до сайта и что считается за вас",
    "helpPairTitle": "Цвет надписи на кнопке считается, а не спрашивается.",
    "helpPair": "У каждой цветной роли есть парный цвет текста поверх неё. Смените фирменный цвет, оставив пару прежней, — и светлый фирменный цвет сохранит белый текст, то есть кнопку, надписи на которой не видно. Приложение выводит эту пару из яркости выбранного цвета, поэтому надпись остаётся читаемой при любом выборе.",
    "helpThemesTitle": "Светлая и тёмная — разные значения.",
    "helpThemes": "Цвет, заданный один раз, на второй теме почти всегда неверен: тёмный текст на тёмном фоне исчезает целиком. Задайте только ту тему, которая вам важна, — вторая сохранит цвета проекта.",
    "helpContrastTitle": "Число контраста — это измерение, а не мнение.",
    "helpContrast": "Это отношение яркостей текста и фона в том виде, в каком его определяет стандарт доступности. 4,5 — порог для обычного текста, 3,0 — для крупного. Ниже него страница не «дело вкуса»: часть ваших посетителей её не прочитает.",
    "schemesLabel": "Готовые решения",
    "schemesHint": "Одно нажатие задаёт все семь ролей в обеих темах. Дальше можно поправить что угодно — правка сохранится; нажмёте ту же схему снова — вернутся её значения.",
    "schemeCustom": "Своё сочетание — ни одно готовое решение с ним точно не совпадает.",
    "schemes": {
      "zinc": "Графит",
      "slate": "Сланец",
      "stone": "Камень",
      "blue": "Синий",
      "violet": "Фиолетовый",
      "green": "Зелёный",
      "orange": "Оранжевый",
      "rose": "Розовый",
      "teal": "Бирюзовый",
      "amber": "Янтарный"
    }
  },
  "pages": {
    "fonts": {
      "title": "Шрифты",
      "hint": "Заголовки, основной текст и моноширинный — откуда берутся семейства и как подключаются."
    },
    "type": {
      "title": "Типографика",
      "hint": "Масштаб текста и межстрочный интервал — одно число на весь набор."
    },
    "shape": {
      "title": "Формы и отступы",
      "hint": "Скругление углов, рамки, плотность и ширина содержимого."
    },
    "colors": {
      "title": "Цвета",
      "hint": "Семь ролей в двух темах и живая проверка контраста."
    },
    "dialogs": {
      "title": "Модальные окна",
      "hint": "Единственное модальное окно этого проекта, показанное в настоящих настройках. Нажмите кнопку — откроется настоящее окно, а не его изображение.",
      "show": "Показать окно",
      "longLine": "Строка текста внутри тела. Тело прокручивается; заголовок и кнопки при этом не двигаются.",
      "lockedHint": "У этого окна нет крестика, оно не закрывается ни Escape, ни нажатием мимо. Единственный законный случай — отказ в доступе: закрытие оставило бы человека на странице, которую ему нельзя видеть.",
      "samples": [
        {"id":"plain","name":"Простое","note":"Заголовок, пояснение, крестик. Справочное окно закрывают, а не подтверждают, — поэтому кнопок у него нет вовсе.","title":"Окно без кнопок","description":"Прочитать и закрыть. Это полноценный и часто правильный вид окна.","body":"Тело тоже необязательно: вопрос вида «положить три штуки в заказ?» укладывается в заголовок и пояснение целиком, а пустое тело нарисовало бы под ними полосу воздуха."},
        {"id":"footer","name":"С кнопками","note":"Подвал, который стоит на месте. Кнопки принадлежат ОКНУ, а не телу, — иначе они уезжают вместе с текстом.","title":"Окно с подвалом","description":"Подтвердить или отменить.","body":"Подвал лежит под телом и не двигается вместе с ним. На телефоне это разница между кнопкой, до которой можно дотянуться, и кнопкой, до которой нельзя.","footerOk":"Подтвердить","footerCancel":"Отмена"},
        {"id":"long","name":"Длинное — вот оно и есть главное","note":"Тело перерастает экран и прокручивается; заголовок и кнопки остаются. Ровно это теряет окно, собранное руками.","title":"Длинное окно","description":"Прокрутите тело — заголовок и кнопки не сдвинутся.","footerOk":"Готово","footerCancel":"Закрыть"},
        {"id":"locked","name":"Неотменяемое","note":"Ни крестика, ни Escape, ни нажатия мимо. Один законный случай — отказ в доступе.","title":"Доступ закрыт","description":"Единственный случай, когда окно нельзя закрыть.","footerOk":"На главную"}
      ]
    },
    "blocks": {
      "title": "Блоки",
      "hint": "Все блоки, из которых этот проект собирает страницы, нарисованные настоящим рендерером. Сгруппированы по назначению.",
      "helpLabel": "Как в этом проекте строится страница",
      "helpMore": "Узнать больше",
      "helpLess": "Свернуть",
      "helpWhatTitle": "Блок — это единица, из которой собрана страница.",
      "helpWhat": "Страница здесь не свёрстанный файл, а СПИСОК БЛОКОВ. Рендереры уже собраны; страница лишь говорит, какие виды на ней стоят, в каком порядке и с каким текстом. Именно поэтому все страницы проекта выглядят одним продуктом, а не работой пяти разных людей.",
      "helpThreeTitle": "Иначе страницу построить нельзя, и путей ровно три.",
      "helpThree": "Взять подходящий вид. Либо создать новый вид и потом его взять — он попадёт в этот каталог и станет доступен всем страницам. Либо, если вещь уникальна и принадлежит одному маршруту, взять виджет. Четвёртого пути нет: свёрстанная руками разметка мимо этих трёх невидима каталогу, её нельзя перенести на другую страницу, нельзя переставить относительно текста и не переводит языковая ячейка.",
      "helpWidgetTitle": "Блок или виджет решает ПЕРЕИСПОЛЬЗОВАНИЕ, а не сложность.",
      "helpWidget": "Вид обязан подходить любой странице проекта — этим он и заслуживает место в каталоге. Виджету не нужно подходить никому, кроме своего маршрута: уникальная графика, своё поведение, своё лицо, и умирает он вместе с маршрутом. Поэтому спрашивать надо не «сложно ли это построить», а «захочет ли вторая страница ровно этот рисунок».",
      "helpParallelTitle": "При параллельной маршрутизации новая страница не требует сборки вовсе.",
      "helpParallel": "Выберите параллельную маршрутизацию — и страница перестаёт быть файлом: маршруты и их списки блоков живут в данных, а страница слота НЕ предрендерит на сборке ничего: она разбирает адрес на запросе и кеширует ответ. Добавили маршрут в данные — страница появилась в продакшене на лету, без развёртывания и без пересборки. Это измерено, а не предположено: в эталонном приложении страница слота объявляет generateStaticParams() с пустым списком, dynamicParams true и revalidate 300, а маршруты и блоки читает из базы на запросе.",
      "request": {
        "editLabel": "Предложить правку блока %s",
        "editTitle": "Изменить блок %s",
        "editLead": "Опишите своими словами, что должно стать иначе. Ваши слова уедут агенту дословно; пока вы не попросите его взяться, ничего не произойдёт.",
        "createLabel": "Попросить новый блок в эту категорию",
        "createTitle": "Новый блок в «%s»",
        "createLead": "Опишите блок, которого вам не хватает. Категория уже выбрана — та, которую вы смотрите.",
        "whatLabel": "Каким он должен быть",
        "whatPlaceholder": "Например: то же самое, но картинка слева, цитата справа и место под название компании",
        "roleLabel": "Какую роль выполняет и где ломается",
        "roleHint": "Необязательно. Не знаете пока — оставьте пустым, агент спросит.",
        "rolePlaceholder": "Например: показывает логотипы партнёров, не больше восьми, и читается с телефона",
        "stylesHint": "Можно переиспользовать готовый вид: положите в описание ссылку на проект с открытым исходным кодом либо снимите стили через консоль браузера (правая кнопка → «Посмотреть код» → «Стили») и вставьте их туда же. Агент прочитает их и перенесёт форму, переведя цвета в палитру этого проекта.",
        "send": "Отправить агенту",
        "sending": "Отправляю…",
        "cancel": "Отмена",
        "toastTitle": "Заявка создана:",
        "toastWhere": "Она ждёт в development-docs/development-steps/pre-steps/",
        "toastNext": "Само ничего не начнётся: когда агент закончит очередной этап, попросите его приступить к планированию этой заявки.",
        "toastGot": "Понятно",
        "toastFailed": "Заявка не создана. Ничего не сохранено — попробуйте ещё раз."
      },
    },
    "tools": {
      "title": "Инструменты",
      "hint": "Переиспользуемые инструменты, которые в проекте уже есть, и место, где просят те, которых нет.",
      "helpMore": "Узнать больше",
      "helpLess": "Свернуть",
      "helpWhatTitle": "Инструмент — переиспользуемая вещь, у которой есть дом.",
      "helpWhat": "Он живёт в `_tools/<id>/` одной папкой — клиент, сервер, типы — и его берут разные функциональные компоненты, а не владеет им какой-то один. Обрезку изображения зовут два поля этого слоя, голосовой ввод — форма товара и общий контрол. В этом весь замысел: написано один раз, взято много раз.",
      "helpWhyTitle": "Витрина нужна для того, чтобы никто не построил вторую копию.",
      "helpWhy": "Диалог переводов месяцами лежал среди обычных компонентов, не значился ни в одном каталоге — и кнопку перевода построили заново, строкой текста вместо окна. Инструмент, который негде найти, равен отсутствующему. Поэтому страница порождается из самой папки: что лежит — то и показано, а список руками запрещён.",
      "helpWidgetTitle": "Инструмент или виджет решается до первой строки, и не сложностью.",
      "helpWidget": "Различает их один вопрос: захочет ли ВТОРОЙ вызывающий ровно эту вещь? Инструмент проходит через сборку и живёт, пока нужен хоть кому-то; виджет приезжает данными, служит одному маршруту и умирает вместе с ним. Всё, что входит в сборку, — инструмент по определению: обычный импорт и есть компиляция.",
      "helpExceptionTitle": "Выключатель внизу страницы — исключение, и оно названо.",
      "helpException": "Индикатор ширины экрана не переиспользуемый инструмент: это прибор, лежащий поверх сайта для его хозяина, и в проекте он не меняет ничего. Он остаётся здесь решением владельца и стоит ПОД каталогом, а не внутри него: исключение, не названное исключением, читается как правило.",
      "catalogueTitle": "Инструменты, которые есть в проекте",
      "instrumentsTitle": "Приборы поверх сайта",
      "instrumentsLead": "Не переиспользуемый инструмент, и стоит здесь намеренным исключением: этот виден вам, а не посетителю.",
      "needsLabel": "Требует",
      "needs": {
        "browser": "браузер",
        "https": "HTTPS",
        "openai-key": "ключ OpenAI",
        "ffmpeg": "ffmpeg в слое данных"
      },
      "npmLabel": "Нужно поставить пакет:",
      "usedByLabel": "Уже применяется:",
      "usedByNone": "Пока никем не применяется — лежит готовым, ждёт первого вызывающего.",
      "whatLabel": "Что умеет",
      "howLabel": "Как применять",
      "valueLabel": "Какую пользу даёт",
      "request": {
        "editLabel": "Предложить правку инструмента %s",
        "editTitle": "Изменить инструмент %s",
        "editLead": "Опишите своими словами, что должно быть иначе: отказ, который ничего не объясняет, недостающая настройка, поведение, которое мешает. Инструмент остаётся в тех же паттернах, что и соседние в `_tools/`, и по-прежнему подчиняется навыку `use-tools`. Ваши слова уезжают агенту дословно; само ничего не начнётся, пока вы не попросите его взяться.",
        "createLabel": "Попросить новый инструмент",
        "createTitle": "Новый инструмент для этого проекта",
        "createLead": "Опишите способность, которой не хватает: генерация изображений искусственным интеллектом, распознавание документов, карта, подпись. Он будет построен В ТЕХ ЖЕ ПАТТЕРНАХ, что и инструменты выше: своя папка `_tools/<id>/` с клиентом, сервером и типами, своя карточка `tool.json`, место в этой витрине — и по навыку `use-tools`, который и регулирует, как здесь строят инструменты. Ваши слова уезжают агенту дословно; само ничего не начнётся, пока вы не попросите его взяться.",
        "whatLabel": "Что он должен уметь",
        "whatPlaceholder": "Например: рисовать иллюстрацию по текстовому описанию и класть результат прямо в поле картинки",
        "whereLabel": "Где вы будете его применять",
        "whereHint": "Необязательно. Это тот самый вопрос, который решает «инструмент или виджет»: если второе место захочет ровно эту вещь — значит инструмент.",
        "wherePlaceholder": "Например: в редакторе блоков и в карточке товара",
        "send": "Отправить агенту",
        "sending": "Отправляю…",
        "cancel": "Отмена",
        "toastTitle": "Заявка создана:",
        "toastWhere": "Она ждёт в development-docs/development-steps/pre-steps/",
        "toastNext": "Само ничего не начнётся: когда агент закончит очередной этап, попросите его приступить к планированию этой заявки.",
        "toastGot": "Понятно",
        "toastFailed": "Заявка не создана. Ничего не сохранено — попробуйте ещё раз."
      }
    },
  },
  "allTypes": "Все",
  "createBlock": "Создать новый блок",
  "createBlockHint": "Пока не построено — кнопка стоит здесь, чтобы место для неё было видно.",
  "countLabel": "видов",
  "viewportBadgeLabel": "Индикатор ширины экрана",
  "viewportBadgeHint": "Кружок в левом нижнем углу: текущая ширина в пикселях и ступень, в которую она попадает. Он позволяет говорить о вёрстке числами, а не ощущениями, — и виден на живом сайте, а не только в разработке.",
  "toolsOn": "Включён",
  "toolsOff": "Выключен"
}

export type DesignUi = typeof EN

/** Слова группы. Неизвестный язык деградирует к английскому — честнее пустоты. */
export function designUi(lang: string): DesignUi {
  return lang === "ru" ? RU : EN
}

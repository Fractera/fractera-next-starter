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
    "blocks": {
      "title": "Blocks",
      "hint": "Every block this project can build a page from, drawn by the real renderer. Grouped by what the block is for."
    },
    "allTypes": "All",
    "createBlock": "Create a new block",
    "createBlockHint": "Not built yet — the button is here so the place for it is visible.",
    "countLabel": "kinds"
  }
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
    "blocks": {
      "title": "Блоки",
      "hint": "Все блоки, из которых этот проект собирает страницы, нарисованные настоящим рендерером. Сгруппированы по назначению."
    },
    "allTypes": "Все",
    "createBlock": "Создать новый блок",
    "createBlockHint": "Пока не построено — кнопка стоит здесь, чтобы место для неё было видно.",
    "countLabel": "видов"
  }
}

export type DesignUi = typeof EN

/** Слова группы. Неизвестный язык деградирует к английскому — честнее пустоты. */
export function designUi(lang: string): DesignUi {
  return lang === "ru" ? RU : EN
}

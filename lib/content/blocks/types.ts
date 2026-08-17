// Canonical content-block catalog — the single source of truth for every block
// kind a content page (news, blog, documentation, StandardContentPage) can use.
// Authoring a page = writing data with these blocks; rendering = the registry in
// ./registry.tsx maps each `kind` to a renderer. Adding a new section type to the
// catalog = add a member here + a renderer in the registry, nothing else.
//
// Inline markup inside text fields supports **bold** and [label](url) (see
// ./inline.tsx). This file intentionally has NO imports so the catalog stays a
// leaf of the import graph: lib/blog/types.ts re-exports `Block` as `BlogBlock`,
// keeping every existing import path working unchanged.

// СМЫСЛОВАЯ ГРУППА ЯРЛЫКА — ОДИН СЛОВАРЬ НА ВЕСЬ ПРОЕКТ.
//
// 🔒 ПОЧЕМУ ОБЪЯВЛЕНО ОТДЕЛЬНО, А НЕ ПОВТОРЕНО В КАЖДОМ ВИДЕ. Тон читают уже два
// вида — ряд возможностей (`badges`) и ряд отменённых счетов (`noBill`), — и
// повтори перечисление во втором, оно разошлось бы с первым на первой же
// добавленной группе: где-то шесть значений, где-то пять, а карта цветов одна.
// Это тот же закон, по которому размеры текста живут в одном примитиве.
//
// Имя группы СМЫСЛОВОЕ, а не цветовое: `data` — данные, `reach` — охват,
// `access` — доступ, `code` — код, `muted` — без группы. Какой цвет получит
// группа, решают секция и тема; впиши сюда «зелёный» — и материал перестанет
// работать в теме, где зелёного нет.
export type Tone = 'data' | 'reach' | 'access' | 'code' | 'muted'

export type BadgeItem = { label: string; tone: Tone }

// ── Leaf blocks (15) ─────────────────────────────────────────────────────────
export type LeafBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'olist'; items: string[] }
  | { kind: 'figure'; media: 'image' | 'video'; src: string; alt: string; caption?: string; href?: string }
  | { kind: 'code'; text: string }
  // Призыв к действию. `text` НЕОБЯЗАТЕЛЕН: когда кнопка стоит внутри раздела,
  // чей заголовок уже сказал то же самое, подпись над ней — дословный повтор.
  // Так и вышло, когда Quiz вынули из рамки: «Quiz — семь вопросов вместо
  // чистого листа» оказалось на странице дважды подряд, заголовком и абзацем.
  | { kind: 'cta'; text?: string; href: string; label: string }
  | { kind: 'note'; text: string }
  // Founder pull-quote in the homepage testimonial design (gradient-violet text +
  // author photo/name/role + social links). Author defaults to the site founder.
  | { kind: 'founder'; text: string }
  // Reference card to a full raw document with a download button (e.g. a living
  // pipeline standard shipped under /public/docs). title + one-line summary + file.
  // Optional `label` overrides the default download-button text (e.g. "Download PDF"
  // for a .pdf instead of the default "Download .md"); optional `kicker` overrides
  // the eyebrow above the title (default "Full documentation").
  | { kind: 'docref'; title: string; summary: string; href: string; label?: string; kicker?: string }
  // "Did you know" callout — icon + tinted panel for an aside fact (e.g. the page
  // auto-updates in real time as an AI agent edits it). title is the lead-in.
  | { kind: 'callout'; title: string; text: string }
  // Comparison table — static, no-JS. `headers` is the column row (first column is
  // the row label); `rows` are the body rows (each a cell array matching headers).
  // The LAST column is visually emphasized as the "ours/highlight" column. Cells
  // support inline markup (**bold** + links). Optional `caption` above the table.
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
  // 🪦 REMOVED ON THE WAY IN (2026-08-11): block kind `inquiry`. It rendered the
  // platform's own consultation CTA — a client button that opened an inquiry
  // drawer and posted to an endpoint that exists only on the marketing site. A
  // starter has nothing to inquire about, and neither shipped post used it.
  // Need a call to action? `cta` is the plain, portable one.

  // ── Виды, которыми говорит ГЛАВНАЯ (шаг 508) ───────────────────────────────
  // Знак проекта и лейбл над заголовком. Знак берётся из настроек — материал его
  // не несёт и нести не может: у каждого проекта он свой.
  //
  // 🔒 ЗАГОЛОВКА ЗДЕСЬ НЕТ НАМЕРЕННО. Сначала был: `hero` нёс title и subtitle,
  // пока главная рисовалась собственным входом. Как только она пошла через общую
  // фабрику страниц, H1 стал рисоваться там же, где у постов и правовых страниц,
  // — и заголовок в блоке оказался ВТОРЫМ. Два H1 на странице спорят между собой
  // в выдаче: поисковик не знает, который из них ваш.
  | { kind: 'hero'; pill?: string }
  // Первый экран лендинга: слева заголовок с описанием, справа иллюстрация.
  //
  // 🔒 ЭТА СЕКЦИЯ НЕСЁТ H1 — ЕДИНСТВЕННАЯ ИЗ ВСЕХ. Обычно заголовок рисует
  // фабрика страницы, и `hero` выше поэтому его не несёт: два H1 на странице
  // спорят между собой в выдаче. Но у лендинга заголовок обязан стоять ВНУТРИ
  // левой колонки, рядом с описанием, — снаружи сетки он это место занять не
  // может. Поэтому право на H1 передаётся секции, а страница объявляет
  // `titleInBody`, чтобы фабрика свой заголовок не рисовала. Ровно один H1
  // остаётся в обоих случаях, меняется только кто его печатает.
  //
  // 🔒 КАРТИНКА НЕ В ДАННЫХ, А В СЛОТЕ НАСТРОЕК. `image` называет слот
  // (`homePage`), а не файл: иллюстрация у каждого проекта своя, меняется в
  // панели без пересборки и не должна уезжать в языковую ячейку. Материал
  // говорит «здесь стоит иллюстрация главной», а какая именно — дело настроек.
  | {
      kind: 'heroSplit'
      title: string
      description: string
      pill?: string
      image: 'homePage'
      imageAlt: string
      /** Знак проекта над лейблом. Берётся из настроек, в данных его нет и быть не может. */
      mark?: boolean
    }
  // ЗАВЕРШАЮЩАЯ СЕКЦИЯ (outro) — бегущая лента языков во всю ширину экрана.
  //
  // 🔒 «OUTRO» — ЭТО КЛАСС СЕКЦИИ, А НЕ ОДИН БЛОК. Как `hero` открывает страницу
  // на всю ширину, так `outro` её закрывает: стоит последней, перед подвалом, и
  // переключателем ширины НЕ управляется (см. `standard-content-page.tsx`).
  // Ширина здесь — часть замысла: лента, обрезанная колонкой в 64rem, перестаёт
  // читаться как лента.
  //
  // 🔒 ЯЗЫКИ БЕРУТСЯ ИЗ КАТАЛОГА, А НЕ ИЗ ДАННЫХ. Их 82, у каждого флаг и имя на
  // собственном языке — всё это уже лежит в `config/translations/language-metadata.ts`.
  // Переписать их в языковую ячейку значило бы завести вторую копию, которая
  // разойдётся с первой на первом же добавленном языке. Показываются ВСЕ 82, а не
  // включённый набор: лента говорит, на что продукт способен, а не что включено
  // сегодня.
  | { kind: 'languageMarquee'; title: string; note?: string }
  // ЛЕНТА НАПРАВЛЕНИЙ — карточки того, что на этом продукте можно построить.
  //
  // 🔒 НАПРАВЛЕНИЯ БЕРУТСЯ ИЗ КАТАЛОГА, А НЕ ИЗ ДАННЫХ — тот же закон, что у
  // ленты языков. Их двадцать два, они живут в `config/project-types.ts`, а
  // слова к ним — в `lib/i18n/project-types.i18n.json`. Переписать список в
  // языковую ячейку значило бы завести вторую копию, которая разойдётся с
  // панелью на первом же добавленном направлении: там по этому же списку
  // человек выбирает структуру своего проекта.
  //
  // 🔒 ЗАГОЛОВОК НЕОБЯЗАТЕЛЕН, И ОБЫЧНО ЕГО НЕТ. Секция стоит вплотную под
  // первым экраном, где уже есть `H1`; второй заголовок там спорит с ним за
  // внимание и за выдачу. Поля оставлены на случай, когда лента переедет в
  // середину страницы и ей понадобится представиться.
  | { kind: 'projectTypeMarquee'; title?: string; note?: string }
  // Ряд ярлыков возможностей. `tone` — СМЫСЛОВАЯ группа, а не цвет: одиннадцать
  // слов делятся на четыре кучки, которые глаз читает без чтения. Имя группы
  // остаётся в данных, а какой она получит цвет — дело секции и темы.
  | { kind: 'badges'; items: BadgeItem[] }
  // Ряд мер: одна строка, три-четыре ячейки, в каждой ЧИСЛО и то, к чему оно
  // относится. Заявление вида «в девять раз быстрее» стоит дороже абзаца прозы
  // ровно потому, что читается за секунду и не требует доверия авансом.
  //
  // 🔒 `value` НЕ ПЕРЕВОДИТСЯ, `label` ПЕРЕВОДИТСЯ. Множитель — машинная
  // величина: «×4» одинаково во всех языках, и вписывать его в каждую языковую
  // ячейку значит завести десять мест, где число может разойтись. Слово рядом с
  // числом — обычная продуктовая строка и живёт в ячейке языка.
  | { kind: 'metrics'; items: { value: string; label: string }[] }
  // Как это работает: шаги, которые зажигаются по очереди.
  //
  // 🔒 ПОРЯДОК ЗДЕСЬ — СОДЕРЖАНИЕ, А НЕ ОФОРМЛЕНИЕ, и потому это отдельный вид,
  // а не `olist` в рамке. Нумерованный список говорит «сначала это, потом то»;
  // эта секция говорит ещё и «одно вытекает из другого» — между шагами идёт
  // связь, по ней бежит свет, и человек видит движение, а не перечень.
  //
  // 🔒 АНИМАЦИЯ НЕ ОБЪЯВЛЕНА ЗДЕСЬ, И ЭТО НАМЕРЕННО. Данные говорят, ЧТО за чем
  // идёт; зажигать шаги по очереди или показать их разом — решение секции и темы.
  // Впиши сюда длительность — и материал перестал быть переносимым на
  // поверхность, где движения нет вовсе (машинная версия страницы).
  | { kind: 'flow'; badge?: string; title: string; note?: string; steps: { title: string; text: string }[] }
  // Крупное утверждение в разрядку — то, ради чего написан раздел.
  //
  // 🔒 ТОТ ЖЕ ВИД, ЧТО У ЦИТАТЫ ВЛАДЕЛЬЦА, НО БЕЗ ПОДПИСИ, И ЭТО РАЗНИЦА ПО
  // СУЩЕСТВУ. `founder` подписан именем и фотографией из настроек: это сказал
  // ЧЕЛОВЕК. Правило продукта человек не говорит — его устанавливает продукт, и
  // подпись под ним была бы приписыванием авторства тому, кто этого не говорил.
  // Рисунок общий (`sections/pull-quote.server.tsx`), чтобы два вида не разошлись.
  | { kind: 'statement'; text: string }
  // Счета, которых не будет: имя поставщика, которому владелец НЕ платит.
  //
  // 🔒 ИМЯ ПОСТАВЩИКА И ФРАЗА РЯДОМ — РАЗНЫЕ ПОЛЯ, потому что переводится ровно
  // одно из двух. `vendor` — имя чужого продукта, его не переводят ни на один
  // язык (тот же список, что у обмена переводами: Fractera, GitHub, OpenAI…);
  // `text` — обычная строка языка. Слепи их в одну строку — и рендерер перестанет
  // знать, какое слово зачёркивать, а перевод начнёт калечить чужую торговую
  // марку.
  // 🔒 У СЕКЦИИ ДВА ЗАГОЛОВКА, И ОНИ РАЗНОГО УРОВНЯ — ЭТО НЕ ДУБЛИРОВАНИЕ.
  // `heading` (H2) НАЗЫВАЕТ раздел и стоит сверху: без него секция появлялась
  // посреди страницы безымянной, и в оглавлении её не было вовсе. `title` (H3)
  // — ВЫВОД, и он обязан стоять после перечня: три зачёркнутых имени —
  // доказательства, вывод из них следует. Поменяй местами — и читатель получит
  // заключение раньше основания.
  //
  // `badge` говорит, ЧТО именно вы перестали покупать: имя «Neon» знают не все,
  // «база данных» — все. Группа берётся из общего словаря тонов, а не своим
  // перечислением.
  | {
      kind: 'noBill'
      badge?: string
      heading: string
      /** Подзаголовок раздела — как у `flow` и `cards`: одна форма на все три. */
      note?: string
      items: { vendor: string; text: string; badge: BadgeItem }[]
      title: string
      text: string
    }
// ── Container blocks (composite layouts) ─────────────────────────────────────
// Containers hold `children: Block[]` and are rendered recursively through the
// same registry, so ANY block (including another container) can be nested inside
// ANY layout. This is the extensibility headroom: a two-column section is just a
// `columns` container; future layouts (grid, callout-with-figure, …) are new
// container kinds — no change to existing blocks or pages.
export type ContainerBlock =
  // Responsive multi-column layout: stacks on mobile, `cols` columns from md up.
  | { kind: 'columns'; children: Block[]; cols?: 2 | 3 }
  // Plain vertical grouping (semantic wrapper / a single column's contents).
  | { kind: 'group'; children: Block[] }
  // Панель в рамке: заголовок, необязательный надзаголовок и любое содержимое.
  // Ею собрана вся главная ниже первого экрана — четыре секции отличаются только
  // тоном и начинкой, а не устройством. `tone` снова смысловой: `plain` — обычный
  // раздел, `warn` — то, что стоит сделать, но не блокирует, `accent` — место, где
  // работает модель (единственное на странице выделение свечением).
  | { kind: 'panel'; tone?: 'plain' | 'warn' | 'accent'; eyebrow?: string; title: string; children: Block[] }
  // Раздел карточками: шапка раздела и несколько равных ячеек, между которыми
  // НЕТ порядка.
  //
  // 🔒 ЭТО ОТДЕЛЬНЫЙ ВИД ОТ `flow`, И РАЗЛИЧИЕ РОВНО ТО ЖЕ, ЧТО У `list` ПРОТИВ
  // `olist`. У шагов очерёдность — содержание: первый предшествует второму, и
  // потому они пронумерованы, связаны линией и зажигаются по очереди. Здесь
  // порядка нет — утверждения об одном предмете, любое читается первым. Отсюда
  // `<ul>`, отсутствие номеров и отсутствие анимации: подсветка «по очереди»
  // там, где очереди нет, сообщала бы неправду, и тем убедительнее, чем красивее
  // сделана.
  //
  // 🔒 ЯЧЕЙКА — КОНТЕЙНЕР (`card`), А НЕ СТРОКА, и это оплаченное решение. Сперва
  // здесь стояло `items: string[]`: трём абзацам о проекте этого хватало. Затем
  // в такие же ячейки понадобилось положить шесть шагов списком и два совета с
  // выделенными началами — строка такого не выражает, и вид пришлось бы либо
  // раздваивать, либо расширять полями «а ещё список». Контейнер с детьми — уже
  // существующий приём каталога (`columns`, `group`, `panel`), и он вмещает
  // любую начинку без единого нового поля.
  | { kind: 'cards'; badge?: string; title: string; note?: string; cols?: 2 | 3; children: Block[] }
  // Одна ячейка раздела карточками.
  //
  // 🔒 `tone` — СМЫСЛОВАЯ ГРУППА, а не «сделай зелёным». Ячейка получает лёгкую
  // заливку цветом своей группы: «шесть шагов» — то, что вы делаете (`data`),
  // «рекомендуется до старта» — то, что стоит сделать заранее (`access`, тот же
  // тон, каким предупреждает панель). Впиши сюда цвет — и в теме, где его нет,
  // ячейка станет неуместной, а смысл всё равно потеряется.
  | { kind: 'card'; tone?: Tone; children: Block[] }

export type Block = LeafBlock | ContainerBlock

export type FaqPair = { q: string; a: string }

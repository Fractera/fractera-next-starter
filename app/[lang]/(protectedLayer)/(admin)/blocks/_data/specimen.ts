import type { Block } from '@/lib/content/blocks/types'

// ОБРАЗЦЫ ВСЕХ ВИДОВ СЕКЦИЙ — по одному на каждый вид каталога.
//
// 🔒 ЗАЧЕМ ЭТОТ ФАЙЛ СУЩЕСТВУЕТ (шаг 507, требование владельца).
// Пять видов из пятнадцати не были использованы НИ В ОДНОМ материале: `table`,
// `docref`, `callout`, `columns`, `group`. Значит их код не рисовался никогда —
// ни на сборке, ни в браузере, ни разу за всё время. В одном из них так и лежал
// дефект: у кнопки `docref` текст был цвета страницы на заливке `primary`, то
// есть тёмный на тёмном в светлой теме. Ровно эту ошибку в соседней кнопке `cta`
// вылечили за день до того — а сюда правка не дошла, потому что смотреть было
// некуда.
//
// Вывод, который и породил этот файл: вид секции, не нарисованный нигде, не
// «неиспользуемый код», а НЕПРОВЕРЕННЫЙ. Здесь каждый вид рисуется настоящим
// рендерером на настоящей странице, и владелец видит их все разом.
//
// 🔒 ПОЧЕМУ ТЕКСТ ОБРАЗЦОВ НА АНГЛИЙСКОМ И ЭТО НЕ НАРУШЕНИЕ ПРАВИЛА ЯЗЫКОВ.
// Это не продуктовая копия, а материал, который показывает ФОРМУ: каждая строка
// объясняет, для чего вид нужен и чего ему нельзя поручать. Слова самой страницы
// (заголовок, пояснение, подписи) живут в `ui.i18n.ts` и переведены по
// включённому набору языков, как у любой другой страницы.
//
// Гейт `npm run check:blocks` требует, чтобы КАЖДЫЙ вид каталога встречался
// здесь: добавили вид в `lib/content/blocks/types.ts` — обязаны добавить образец,
// иначе он снова окажется невидимым.

export type SpecimenSection = {
  /** Вид секции, который показывает этот образец. */
  kind: Block['kind']
  /**
   * Подпись образца. Нет — печатается сам `kind`.
   *
   * 🔒 ПОЯВИЛАСЬ, КОГДА У ОДНОГО ВИДА СТАЛО ДВА ОБРАЗЦА (шаг 48-1, 2026-08-30).
   * У `workspace` их два — со вкладками и без, — и оба были подписаны словом
   * «workspace»: человек видел два одинаково названных блока и не понимал, чем
   * они различаются. Заодно это чинило дефект, который иначе не виден вовсе:
   * ключ списка в каталоге строится из `kind`, и два образца одного вида давали
   * React ОДИН И ТОТ ЖЕ ключ.
   */
  label?: string
  /** Одна фраза: когда этот вид уместен. Английская основа. */
  when: string
  /**
   * Перевод описания.
   *
   * 🔒 ПЕРЕВОДИТСЯ ОПИСАНИЕ, А НЕ СОДЕРЖИМОЕ ОБРАЗЦА (решение владельца
   * 2026-08-30, дословно): «сами секции внутри пусть остаются на английском но
   * описание на русском». Разница содержательная: содержимое образца — это
   * ДЕМОНСТРАЦИЯ вида, и переводить её значило бы переводить макет; описание —
   * объяснение того, когда вид уместен, и читает его человек.
   *
   * Нет перевода — печатается английская основа, тем же поключевым правилом,
   * которым живут языковые ячейки страниц.
   */
  whenRu?: string
  blocks: Block[]
}

export const SPECIMEN: SpecimenSection[] = [
  {
    kind: 'h2',
    when: 'Section heading. It also builds the table of contents and the anchor.',
    blocks: [{ kind: 'h2', text: 'A section heading' }],
  },
  {
    kind: 'h3',
    when: 'Sub-heading inside a section. It becomes the second level of the table of contents, nested under its own h2.',
    blocks: [{ kind: 'h3', text: 'A sub-heading' }],
  },
  {
    kind: 'h4',
    when: 'Fourth level — a topic inside a sub-heading. For documents that are genuinely three levels deep.',
    blocks: [{ kind: 'h4', text: 'A fourth-level heading' }],
  },
  {
    kind: 'h5',
    when: 'Fifth and deepest level: a label for a short enumeration. Same size as body text, set apart by caps — a heading smaller than prose stops reading as a heading.',
    blocks: [{ kind: 'h5', text: 'A fifth-level label' }],
  },
  {
    kind: 'p',
    when: 'Ordinary prose. Supports **bold** and [links](https://example.com).',
    blocks: [
      {
        kind: 'p',
        text: 'A paragraph carries the argument. Inline markup is limited on purpose: **bold** for emphasis and a [link](https://example.com) — anything richer belongs in a block of its own, where the renderer can be held to a contract.',
      },
    ],
  },
  {
    kind: 'quote',
    when: 'Somebody else’s words. `cite` names the author; the optional `lead` is a headline-sized first line INSIDE the quote — a field rather than a second kind, so the drawing cannot drift.',
    blocks: [
      {
        kind: 'quote',
        text: 'A quote is the one place where the text is not yours — so the block shows attribution, and the attribution is a separate field rather than a line of prose.',
        cite: 'The engine, on itself',
      },
      {
        kind: 'quote',
        lead: 'The same block, with a lead',
        text: 'The lead is not a heading tag: inside a quotation it would announce a section that does not exist, both in the table of contents and in the machine twin. It is a first line that simply reads larger.',
        cite: 'The engine, on itself',
      },
    ],
  },
  {
    kind: 'list',
    when: 'Unordered set: the order carries no meaning.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Items that could be read in any order.',
          'Each one stands on its own.',
          'Inline markup works here too: **bold**.',
        ],
      },
    ],
  },
  {
    kind: 'olist',
    when: 'Ordered steps: the order IS the meaning.',
    blocks: [
      {
        kind: 'olist',
        items: ['First the goal is set.', 'Then the work is done.', 'Then a machine checks it.'],
      },
    ],
  },
  {
    kind: 'figure',
    when: 'An illustration. `media:<name>` takes it from the store, a path takes it from the project.',
    blocks: [
      {
        kind: 'figure',
        media: 'image',
        src: 'media:development-loop-2026.jpg',
        alt: 'A specimen illustration resolved from the media store by its file name',
        caption: 'Referenced as `media:development-loop-2026.jpg` — the owner can replace it in the panel with no rebuild.',
      },
    ],
  },
  {
    kind: 'code',
    when: 'Code or an ASCII diagram. Never reformatted, never highlighted.',
    blocks: [
      {
        kind: 'code',
        text: 'goal ──▶ agent ──▶ gates ──▶ green? ──▶ shipped\n            ▲                  │\n            └────── failure ────┘',
      },
    ],
  },
  {
    kind: 'note',
    when: 'A footnote-weight remark: a source, a caveat.',
    blocks: [
      {
        kind: 'note',
        text: 'A note sits below the argument and does not compete with it — quieter type, but still above the contrast threshold.',
      },
    ],
  },
  {
    kind: 'callout',
    when: 'An aside the reader should not miss. `title` is the lead-in.',
    blocks: [
      {
        kind: 'callout',
        title: 'Did you know?',
        text: 'This page is the first place where five of the fifteen block kinds have ever been rendered at all.',
      },
    ],
  },
  {
    kind: 'cta',
    when: 'One action, one link. Inside a site the only legal form is the language root.',
    blocks: [
      {
        kind: 'cta',
        text: 'A call to action states what the reader gets, not what the button does.',
        href: '/en',
        label: 'Open the home page',
      },
    ],
  },
  {
    kind: 'table',
    when: 'A comparison. The LAST column is emphasized as “ours”.',
    blocks: [
      {
        kind: 'table',
        caption: 'What the two ways of working cost',
        headers: ['', 'By hand', 'In a loop'],
        rows: [
          ['Who repeats the work', 'a person', 'a machine'],
          ['Who notices a mistake', 'a person, later', 'a gate, immediately'],
          ['What scales', 'nothing', '**the verification**'],
        ],
      },
    ],
  },
  {
    kind: 'docref',
    when: 'A card pointing at a full document, with a download button.',
    blocks: [
      {
        kind: 'docref',
        title: 'The development loop, as a picture',
        summary: 'The same diagram this page renders above — offered as a file rather than as a figure.',
        href: '/blog-media/development-loop-2026.jpg',
        label: 'Download the image',
        kicker: 'Reference material',
      },
    ],
  },
  {
    kind: 'founder',
    when: 'A pull-quote in the owner’s voice. The byline comes from the settings.',
    blocks: [
      {
        kind: 'founder',
        text: 'A quote in the owner’s own voice, signed by whoever the project settings say the author is — never by a name typed into the content.',
      },
    ],
  },
  {
    kind: 'columns',
    when: 'Two or three columns on wide screens, stacked on a phone. Holds any blocks.',
    blocks: [
      {
        kind: 'columns',
        cols: 2,
        children: [
          {
            kind: 'group',
            children: [
              { kind: 'h3', text: 'Left column' },
              { kind: 'p', text: 'A container renders its children through the same registry, so anything nests inside anything.' },
            ],
          },
          {
            kind: 'group',
            children: [
              { kind: 'h3', text: 'Right column' },
              { kind: 'list', items: ['Including lists.', 'Including another container.'] },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'group',
    when: 'A plain vertical grouping — a column’s contents, or a semantic wrapper.',
    blocks: [
      {
        kind: 'group',
        children: [
          { kind: 'p', text: 'A group adds no decoration of its own. It exists so a container can hold a sequence where one block was expected.' },
        ],
      },
    ],
  },
  {
    kind: 'heroBadge',
    when: 'The project mark and the eyebrow above the H1. The mark comes from settings, never from content; the H1 itself is drawn by the page factory.',
    blocks: [{ kind: 'heroBadge', pill: 'Eyebrow above the title' }],
  },
  {
    kind: 'heroSplit',
    when: 'A landing page\'s first screen: the words on the left, the illustration on the right. The ONLY section that carries the H1 itself — the page using it declares `titleInBody`, so the factory does not print a second one. The picture names a SETTINGS SLOT, not a file: every project has its own and it changes in the panel without a rebuild.',
    blocks: [
      {
        kind: 'heroSplit',
        pill: 'Eyebrow above the title',
        title: 'The headline of a landing page',
        description:
          'The paragraph that earns the visit — long enough to say what the product is and **why it matters**, short enough to read before scrolling.',
        image: 'homePage',
        imageAlt: 'Illustration of the product',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    when: 'The OUTRO section: the last thing on a page, always full width, never governed by the width toggle. A marquee of all 82 languages — flag plus the name in that language — read straight from config/translations/language-metadata.ts, never from page data. Movement is pure CSS: it works with JavaScript off and stops for prefers-reduced-motion.',
    blocks: [
      {
        kind: 'languageMarquee',
        title: 'Eighty-two languages, ready before you need them',
        note: 'Every one of them ships with the product.',
      },
    ],
  },
  {
    kind: 'projectTypeMarquee',
    when: 'A marquee of the 22 project directions a customer can build — landing page, store, company brain. Read from config/project-types.ts and its corpus, never from page data, so it cannot drift from the catalogue the control panel offers. Right-to-left, pure CSS, 200px of blur at both edges; clicking a card pauses the belt and opens a reference dialog with no buttons at all. Title and note are optional and normally absent: the section sits directly under the hero, where a second heading argues with the H1.',
    blocks: [
      { kind: 'projectTypeMarquee' },
    ],
  },
  {
    kind: 'badges',
    when: 'A row of capability labels. The tone is a MEANING group, not a colour.',
    blocks: [
      {
        kind: 'badges',
        items: [
          { label: 'Reach', tone: 'reach' },
          { label: 'Data', tone: 'data' },
          { label: 'Access', tone: 'access' },
          { label: 'Code', tone: 'code' },
          { label: 'And more', tone: 'muted' },
        ],
      },
    ],
  },
  {
    kind: 'metrics',
    when: 'One row of measures: a number and the thing it measures. Semantically a description list, NOT a table — three independent value/label pairs carry no row-to-column relationship, and markup that promises one lies to whoever cannot see the page. `value` is machine-side and never translated; the label beside it is an ordinary page string.',
    blocks: [
      {
        kind: 'metrics',
        items: [
          { value: '×4', label: 'cheaper to build' },
          { value: '×9', label: 'faster to launch' },
          { value: '×100', label: 'more reliable in production' },
        ],
      },
    ],
  },
  {
    kind: 'problemSolution',
    when: 'A set of independent cases, read ONE at a time: the list on the left, the opened case on the right — what is required on top, why it works here underneath. Different from flow: flow has ORDER and shows every step at once; here there is no order, and each case has two sides that must sit one under the other so the lower one reads as the answer to the upper. Switching is pure CSS (radio + :checked in styles/globals.css) — every case ships in the server markup, so the crawler and a visitor without JavaScript get all of it, and no separate copy "for robots" is needed. Panels are stacked in ONE grid cell, so the height equals the longest case and the page never jumps while switching. Six cases maximum — that is how many rules the stylesheet carries.',
    blocks: [
      {
        kind: 'problemSolution',
        badge: 'Why it matters',
        title: 'Two sides of the same case',
        note: 'Pick a case on the left; the card shows what it demands and how this project answers it.',
        demandLabel: 'What is required',
        answerLabel: 'Why it works here',
        items: [
          {
            title: 'A case with a demand',
            demand: 'The upper half states what the situation asks of you — plainly, in the words of somebody living through it rather than of somebody selling a cure.',
            answer: 'The lower half answers. It reads as a reply because it stands underneath: put the two side by side and the connection turns into a comparison.',
          },
          {
            title: 'A second, unrelated case',
            demand: 'Cases are independent — there is no first and no last. That is precisely why this is not a numbered list: numbering would promise an order that does not exist.',
            answer: 'The list on the left is a group of radio buttons, so a keyboard walks the cases with arrow keys and a screen reader announces them without any help from us.',
          },
          {
            title: 'The longest one sets the height',
            demand: 'Cases differ in length, and a card that resizes on every switch makes the page jump under the cursor — the reader loses the place they were holding.',
            answer: 'All panels live in one grid cell, so the section is as tall as the longest case and stays that way. Nothing moves except the text fading in.',
          },
        ],
      },
    ],
  },
  {
    kind: 'flow',
    when: 'How something works, as steps that light up in turn with a spark running along the link between them. Order is the CONTENT here, not decoration — that is what separates it from an olist in a box. Movement is pure CSS (styles/globals.css): it works with JavaScript off and stands still for prefers-reduced-motion. The wording never dims — only the frame, the glow and the numbered node do, because text faded with opacity drops below the contrast threshold.',
    blocks: [
      {
        kind: 'flow',
        title: 'How it works',
        note: 'Three steps, and the third feeds the first: the loop is the product.',
        steps: [
          { title: 'Stand the server up', text: 'An installer robot leaves you an operating system, a starter template, a control panel, storage and authorization — already wired together.' },
          { title: 'Work where you work', text: 'Sync with GitHub, clone onto your own machine, open your usual editor. The data keeps coming from your server; only the code runs locally.' },
          { title: 'Push, and it is live', text: 'A push starts a deployment on your own server, and the visitor sees the new version.' },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    when: 'A section of equal cards with NO order between them — the same strip as `flow`, minus the numbers, the link and the animation. The difference is meaning, not decoration: lighting cards up in turn would show a sequence that does not exist, and an untruth told by a good animation is the more convincing kind. Hence `<ul>`, not `<ol>`. The header (badge, heading, lead) is the SHARED `SectionHead`, identical to `flow` and `noBill`. Equal height comes from the grid, never from measuring.',
    blocks: [
      {
        kind: 'cards',
        badge: 'Section label',
        title: 'Three things worth knowing',
        note: 'A lead paragraph under the heading — it says what the cards have in common. The badge above carries the RUBRIC, and its colour is decided by the section, not by the content: a rubric has no semantic group to take a colour from.',
        children: [
          { kind: 'card', children: [{ kind: 'p', text: 'A card holds one self-contained statement. Read in any order they still make sense — that is the test for using this kind instead of `flow`.' }] },
          { kind: 'card', children: [{ kind: 'p', text: 'The cards are the same height because the grid row is as tall as its tallest item and each card fills it. No script measures anything.' }] },
          { kind: 'card', children: [{ kind: 'p', text: 'A card is a CONTAINER: it holds any blocks — a heading, a list, a paragraph — so one kind serves both three short statements and two long side-by-side panels.' }] },
        ],
      },
    ],
  },
  {
    kind: 'card',
    when: 'One cell of a `cards` section. A container: it holds any blocks. `tone` gives it a light gradient wash in the colour of its MEANING group — `data` for what you do, `access` for what is worth doing first — never "make it green". A cell with no tone is a plain border: a wash has to mean something, and a wash on every cell stops singling out anything.',
    blocks: [
      {
        kind: 'cards',
        cols: 2,
        title: 'Two cells, two meanings',
        children: [
          {
            kind: 'card',
            tone: 'data',
            children: [
              { kind: 'h3', text: 'What you do' },
              { kind: 'olist', items: ['Order matters inside a cell.', 'The cell holds any blocks.'] },
            ],
          },
          {
            kind: 'card',
            tone: 'access',
            children: [
              { kind: 'h3', text: 'What is worth doing first' },
              { kind: 'list', items: ['The same tone the panel warns with.', 'Nothing is blocked by it.'] },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'statement',
    when: 'A large spaced-out claim — the thing a section exists to say. The SAME drawing as the owner\'s pull-quote, minus the byline, and that difference is substantive: `founder` is signed with a name and a photo from the settings, so it marks what a PERSON said. A product rule was said by nobody; signing it would attribute to the owner a sentence he never uttered. The drawing is shared (`sections/pull-quote.server.tsx`) so the two cannot drift apart.',
    blocks: [
      {
        kind: 'statement',
        text: 'And this is a product rule, not advice: while a single case is unconfirmed the panel keeps its alarm lit and the coding agent refuses to build.',
      },
    ],
  },
  {
    kind: 'noBill',
    when: 'The bills that will not arrive: the section is NAMED by an H2 on top, then a struck-through vendor with a badge saying what you stopped buying, then the conclusion as an H3. The vendor is a SEPARATE field because it is the one word never translated — merge it into the sentence and the renderer no longer knows what to strike; the badge beside it IS translated, because "a database" is what a person understands without knowing the name "Neon". The conclusion sits AFTER the list on purpose: the struck names are the evidence, the sentence is what follows from them. The strike runs 2px past each word through padding, never through blank characters typed into the data.',
    blocks: [
      {
        kind: 'noBill',
        heading: 'A fully independent space',
        note: 'The section header takes the same shape as `flow` and `cards` — heading centred, lead paragraph beneath it, same width. Three sections of one page, one anatomy.',
        items: [
          { vendor: 'Vercel', text: 'you do not pay', badge: { label: 'hosting', tone: 'reach' } },
          { vendor: 'Neon', text: 'you do not pay', badge: { label: 'database', tone: 'data' } },
          { vendor: 'Clerk', text: 'you do not pay', badge: { label: 'authorization', tone: 'access' } },
        ],
        title: 'You pay nobody',
        text: 'You depend on nobody. The project is yours, end to end.',
      },
    ],
  },
  {
    kind: 'panel',
    when: 'A bordered section holding any blocks. Three tones: plain, warn, accent.',
    blocks: [
      { kind: 'panel', title: 'A plain panel', children: [{ kind: 'p', text: 'The sections of a landing page are all this one kind, differing by tone and contents.' }] },
      { kind: 'panel', tone: 'warn', title: 'Worth doing', children: [{ kind: 'p', text: 'Something that is not blocking, but is expensive to postpone.' }] },
      { kind: 'panel', tone: 'accent', eyebrow: 'The one place', title: 'Where the model works', children: [{ kind: 'p', text: 'The only glow on the page: highlighting everything highlights nothing.' }] },
    ],
  },
  {
    kind: 'faq',
    when: 'Questions and answers — the last content section of a page, and the only one search engines read as a pair of "term and definition". The heading is printed by the MECHANISM, not by the material: "Frequently asked questions" is already translated into ten languages in `lib/content/page-ui.ts`, so `title` is only for a page whose questions are about one thing rather than frequent. Inline markup is deliberately absent: the very same strings go into the `FAQPage` structured data, where asterisks and brackets would be printed to the search engine verbatim.',
    blocks: [
      {
        kind: 'faq',
        items: [
          {
            q: 'Why is this a catalogue kind rather than layout inside the page template?',
            a: 'Because a page must have ONE source of markup. While the template drew this section itself, the catalogue promised to show what a page is made of and knew nothing about it — and a rule added to the kind never reached the page.',
          },
          {
            q: 'Does the page now declare its questions differently?',
            a: 'No. They still live in the `faq` field of the language cell, and the same field feeds the FAQPage markup for search. Only the drawing moved.',
          },
          {
            q: 'Can two of these stand on one page?',
            a: 'No. The anchor is fixed so that it can be linked to from outside, and two sections would produce the same id twice.',
          },
        ],
      },
    ],
  },
  {
    kind: 'toc',
    when: 'The table of contents of a page. You never write it: the page factory builds `items` from the `h2` blocks of the body, using the SAME `headingId` the headings themselves print — two ways of turning a heading into an address drift apart on the first text with punctuation, and then the contents lead nowhere. Its own heading ("On this page") is a word of the mechanism and lives in `lib/content/page-ui.ts`. Written by hand, the list becomes a second copy of the headings that goes stale silently: the link keeps working while the word in it no longer matches.',
    blocks: [
      {
        kind: 'toc',
        items: [
          { id: 'a-section-heading', text: 'A section heading' },
          { id: 'what-a-page-is-written-from', text: 'What a page is written from' },
          { id: 'when-not-to-take-it', text: 'When not to take it' },
        ],
      },
    ],
  },
  {
    kind: 'voiceField',
    when: "A text field that can be dictated — the first kind of the catalogue that TAKES something from a visitor instead of showing them something. One kind, two sizes: 'line' puts the microphone inside the frame of a single-line input, 'area' puts a full-width button under a text area. While recording, an equaliser bar appears below; when recording stops, the bar is REPLACED in the same place by the transcript, which the visitor edits before accepting. It has NO receiver, by the owner's decision of 2026-08-28: the text lives in the browser and disappears on reload, so this is not a contact form. Transcription needs HTTPS, a session and a server key; without them the field stays an ordinary input and says why the microphone is unavailable.",
    blocks: [
      {
        kind: 'voiceField',
        variant: 'line',
        title: 'What should the assistant be called?',
        hint: 'One word or two. Hold the microphone and say it.',
        comment: 'The transcript lands in the field only after you accept it — a misheard word costs one correction, not a second dictation.',
        placeholder: 'For example, Nadia',
      },
      {
        kind: 'voiceField',
        variant: 'area',
        title: 'What is this project about?',
        hint: 'A paragraph is fine. The button sits under the whole area, not inside it.',
        comment: 'The same control in its long form: only the shape of the field and the place of the button differ.',
        placeholder: 'A few sentences about the product',
      },
    ],
  },
  {
    kind: 'workspace',
    label: 'workspace · без верхнего ряда',
    when: 'A working screen rather than a page to read: a menu on the left, content on the right. Dashboards and project tools are built from this — the layout is taken from the architect layer that already runs on it, not invented here. On a phone the left column becomes a drawer that opens to 90% of the width and closes on any click. Menu entries are links only when they carry an address; without one they are plain marks, because a dead link in a catalogue is worse than no link.',
    whenRu: 'Рабочий экран, а не страница для чтения: меню слева, содержимое справа. Из него строятся дашборды и инструменты проекта. Раскладка взята у слоя архитектора, который на ней уже работает, а не придумана заново. На телефоне левая колонка превращается в выдвижной ящик: он открывается на 90 % ширины и закрывается от нажатия на любой пункт. Пункт становится ссылкой только там, где у него есть адрес: мёртвая ссылка в каталоге хуже её отсутствия.',
    blocks: [
      {
        kind: 'workspace',
        menuTitle: 'Project settings',
        menu: [
          { label: 'Basics', active: true },
          { label: 'Search' },
          { label: 'Meta and media' },
          { label: 'Languages' },
          { label: 'Parallel routing' },
          { label: 'Header' },
          { label: 'Footer' },
          { label: 'Cookie banner' },
        ],
        title: 'Languages',
        lead: 'Which languages the site speaks. Enabling one later is a setting, not a rebuild of the way the site works.',
        notes: [
          {
            tone: 'recommended',
            title: 'Add one language at a time',
            text: 'Each language is its own set of prerendered pages. Adding them one by one keeps a build failure attributable to a single change.',
          },
          {
            tone: 'advice',
            title: 'A language costs pages, not speed',
            text: 'Serving a prerendered page is the same work regardless of how many languages exist beside it — but every language multiplies what has to be generated.',
          },
          {
            tone: 'warning',
            title: 'Saving is not applying',
            text: 'The language set lives in the environment file and is baked in at build time. Until the project is rebuilt, the site keeps serving the previous set.',
          },
        ],
        children: [
          { kind: 'h4', text: 'Enabled languages' },
          {
            kind: 'p',
            text: 'This is the part a project fills with whatever it needs: fields, a table, an island. The block gives the frame and the rules; the content is yours.',
          },
          {
            kind: 'list',
            items: ['English — the base language', 'Russian — the owner’s translation'],
          },
        ],
      },
    ],
  },
  {
    kind: 'workspace',
    label: 'workspace · с верхним рядом',
    whenRu: 'Тот же вид с необязательным верхним рядом разделов — второй случай, и он сделан ПОЛЕМ, а не вторым видом. Рисунок остаётся тем же, добавляется одно поле. Два отдельных вида разошлись бы между собой на первой же правке темы — ровно так же, как разошлась бы цитата, у которой необязательную первую строку сделали бы отдельным видом.',
    when: 'The same kind with the optional top row of sections — the second case, and it is a FIELD rather than a second kind. The drawing is identical; only `tabs` appears. Two kinds would have drifted apart on the first theme change, exactly as a quote with a lead would have.',
    blocks: [
      {
        kind: 'workspace',
        menuTitle: 'Design',
        menu: [
          { label: 'Fonts' },
          { label: 'Type scale' },
          { label: 'Shape' },
          { label: 'Colour' },
          { label: 'Blocks', active: true },
          { label: 'Tools' },
        ],
        title: 'Blocks',
        lead: 'The catalogue of what pages are built from. The type answers what to put here; the kind answers what draws it.',
        notes: [
          {
            tone: 'advice',
            title: 'The catalogue is closed',
            text: 'A kind not declared in the set does not exist for the application, and the build refuses. That is the whole reason two pages of one site cannot drift apart.',
          },
        ],
        tabs: [
          { label: 'All', active: true },
          { label: 'Hero' },
          { label: 'Benefits' },
          { label: 'How it works' },
          { label: 'Use cases' },
          { label: 'Pricing' },
          { label: 'Page material' },
          { label: 'Workspace' },
        ],
        children: [
          {
            kind: 'p',
            text: 'Below the row goes whatever the section is about — here a catalogue, on a dashboard a chart, in a tool its own controls.',
          },
        ],
      },
    ],
  },
  {
    kind: 'benefitCards',
    when: 'A row of capability cards, each ending in a link. Differs from `cards` by drawing rather than by fields: the order inside is fixed — heading, rule, text, link — and the link is pushed to the bottom, so in a row of three the links sit on one line however uneven the text.',
    whenRu: 'Ряд карточек-возможностей, каждая заканчивается ссылкой. От `cards` отличается рисунком, а не полями: порядок внутри закреплён — заголовок, черта, текст, ссылка, — и ссылка прижата к низу, поэтому в ряду из трёх все ссылки стоят на одной линии, как бы ни различалась длина текста.',
    blocks: [
      {
        kind: 'benefitCards',
        title: 'What the server brings',
        note: 'Three capabilities that arrive together, not one after another.',
        items: [
          { title: 'Orchestration', text: 'Several agent platforms share one context, so a task started in one continues in another.', href: '/en/architecture', linkLabel: 'Read more' },
          { title: 'Persistent memory', text: 'What the project already knows stays in context between sessions instead of being re-read every time.', href: '/en/architecture', linkLabel: 'Read more' },
          { title: 'One machine', text: 'Everything runs on the server you own. No cloud accounts to open, no per-token bill to watch.', href: '/en/architecture', linkLabel: 'Read more' },
        ],
      },
    ],
  },
  {
    kind: 'splitPair',
    when: 'Two halves with pictures — the product shown from two sides. The first kind of the `product-demo` family, which stood empty. Exactly two: the form rests on balance, and a third cell turns the pair into a row, for which `cards` already exists.',
    whenRu: 'Две половины с картинками — продукт, показанный с двух сторон. Первый вид семейства «демонстрация продукта», которое стояло пустым. Ровно две: форма держится на равновесии, а третья ячейка превращает пару в ряд, для которого уже есть `cards`.',
    blocks: [
      {
        kind: 'splitPair',
        title: 'Two sides of the same day',
        left: { alt: 'editor screenshot', title: 'Writing', text: 'Open a tab and describe what is needed. No local environment to prepare first.' },
        right: { alt: 'live site screenshot', title: 'Shipping', text: 'One action moves the change to the address people visit. No pipeline to configure.' },
      },
    ],
  },
  {
    kind: 'logoCards',
    when: 'A row of cards that name whose thing each one is. The first kind of the `showcase` family, which stood empty. The third line is what the kind exists for — without it the card is indistinguishable from `cards`; with it the row answers the question a showcase gets first: whose is this?',
    whenRu: 'Ряд карточек, называющих, чья каждая вещь. Первый вид семейства «витрина», которое стояло пустым. Третья строка — то, ради чего вид существует: без неё карточка неотличима от `cards`, с ней ряд отвечает на вопрос, который витрине задают первым, — «а это чьё?».',
    blocks: [
      {
        kind: 'logoCards',
        title: 'What is already connected',
        items: [
          { title: 'Coding agent', text: 'Writes, runs and fixes code in a terminal.', source: 'Anthropic' },
          { title: 'Browser agent', text: 'Keeps the whole project in context while working in a tab.', source: 'OpenAI' },
          { title: 'Local runner', text: 'Runs on the machine without sending anything outward.', source: 'in-house' },
        ],
      },
    ],
  },
  {
    kind: 'carousel',
    when: 'Slides the reader turns. NO auto-advance, deliberately different from the showcase it was taken from: motion that cannot be stopped takes away the right to finish reading. Turning is a radio input plus a CSS rule, so it works with JavaScript switched off, and every slide sits in the markup where a crawler sees it. Limit: ten slides.',
    whenRu: 'Слайды, которые листает человек. БЕЗ автоперехода — осознанное отличие от витрины, откуда взята форма: движение, которое нельзя остановить, отнимает право дочитать. Листание — переключатель и правило CSS, поэтому работает при выключенном JavaScript, а все слайды лежат в разметке, где их видит поисковик. Предел — десять слайдов.',
    blocks: [
      {
        kind: 'carousel',
        title: 'Step by step',
        note: 'Each slide is one move; nothing advances on its own.',
        slides: [
          { alt: 'first step', title: 'The server is born', text: 'A clean machine becomes a working contour without anyone configuring it by hand.' },
          { alt: 'second step', title: 'The project arrives', text: 'The repository is yours; the code travels to it and back with one action.' },
          { alt: 'third step', title: 'The change is live', text: 'What was edited appears at the address people visit.' },
        ],
      },
    ],
  },
  {
    kind: 'showcaseCarousel',
    when: 'The showcase carousel, ported one-to-one from the storefront: auto-advance every five seconds with a 700ms crossfade, slides grouped in threes, arrows that shift a whole group, numbered circles that pause on click and show ‖, a progress line that follows the pause, a glow that appears once the image has loaded, lazy loading of the current and next group, and a pause when the section scrolls out of view. Colours come from the theme, not from the storefront palette. Every slide also sits in a hidden block for crawlers — the carousel reveals one at a time through script.',
    whenRu: 'Витринная карусель, перенесённая один в один: автопереход раз в пять секунд с затуханием 700 мс, слайды блоками по три, стрелки листают блок целиком, кружки с номерами ставят паузу и показывают ‖, полоса прогресса следует за паузой, свечение появляется после загрузки картинки, ленивая загрузка текущего и следующего блока, пауза при уходе секции из вида. Цвета берутся из темы, а не из палитры витрины. Все слайды продублированы скрытым блоком для поисковика: карусель раскрывает их по одному скриптом.',
    blocks: [
      {
        kind: 'showcaseCarousel',
        badge: 'Process',
        title: 'Step by step, how it works',
        note: 'Five seconds per slide; click a circle to hold it.',
        slides: [
          { label: 'Your server', sublabel: 'Credentials — and it is ready', title: 'Infrastructure right after purchase', description: 'A clean machine becomes a working contour: site, panel, agents, memory, database and storage, without anyone configuring them by hand.' },
          { label: 'Your repository', sublabel: 'The code is yours from day one', title: 'The project arrives in your GitHub', description: 'What travels there is the application; the cockpit stays on the server, which is why an editing mistake cannot break it.' },
          { label: 'Your address', sublabel: 'One action to publish', title: 'The change is live', description: 'What was edited appears at the address people visit, without a pipeline to configure first.' },
          { label: 'Your data', sublabel: 'Four stores, one door', title: 'Memory that survives the session', description: 'Rows, files, meaning-search and a graph of connections sit behind one key on the machine you own.' },
        ],
      },
    ],
  },
  {
    kind: 'support',
    when: 'Ways to support the project. NOT a price list, and the difference is substantive: a price carries an obligation — pay and you receive what was named — while support is a voluntary contribution, and promising capability for it turns it into a sale without a guarantee. Hence the optional amount and the absence of a purchase button inside the kind.',
    whenRu: 'Варианты поддержки проекта. НЕ прайс-лист, и разница существенная: у цены есть обязанность — заплатив, человек получает названное, — а поддержка это добровольный взнос, и обещать за него возможности значит превратить его в продажу без гарантии. Отсюда необязательная сумма и отсутствие кнопки покупки внутри вида.',
    blocks: [
      {
        kind: 'support',
        title: 'Support the project',
        note: 'Open code lives on contributions, not on licences.',
        tiers: [
          { name: 'One-off', amount: 'any amount', text: 'A single contribution, without obligations on either side.', href: '/en/architecture', linkLabel: 'Contribute' },
          { name: 'Monthly', amount: 'from a small sum', text: 'A regular contribution that makes planning possible.', href: '/en/architecture', linkLabel: 'Contribute' },
          { name: 'Code', text: 'Time instead of money: a fix, a translation, a card for a block kind.', href: '/en/architecture', linkLabel: 'Read how' },
        ],
      },
    ],
  },
]

// КОД ОБРАЗЦА — УНИКАЛЬНЫЙ, И ОН ВЫЧИСЛЯЕТСЯ, А НЕ ПРОСТАВЛЯЕТСЯ РУКАМИ
// (заказ владельца 2026-08-30: «все виды блоков должны иметь абсолютно
// оригинальный kind. Рекомендую устанавливать двузначный номер например
// workspace01»).
//
// 🔒 ПОЧЕМУ ВЫЧИСЛЯЕТСЯ. «Абсолютно оригинальный» — это свойство, которое либо
// держится устройством, либо не держится вовсе. Проставленный руками номер
// повторится в тот день, когда у вида появится третий образец и никто не
// вспомнит про второй; счётчик по виду повториться не может. Тот же довод, по
// которому число построенных страниц продукта считают обходом папок, а не
// хранят списком.
//
// Форма: имя вида плюс двузначный номер образца ЭТОГО вида — `p01`, `h201`,
// `workspace01`, `workspace02`. Номер двузначный по прямому слову владельца:
// одноразрядный `workspace1` рядом с `workspace10` сортируется неверно и
// читается как опечатка.
// 🔒 ТОТ ЖЕ СЧЁТ ВЕДЁТ ГЕНЕРАТОР СВОДКИ, И ЭТО НЕ ДВА ИСТОЧНИКА (шаг 50).
// `scripts/build-blocks-map.mjs` читает этот же файл регулярным выражением и
// кладёт коды в `SECTIONS.json` и `BLOCKS.md` — туда, куда навык приводит агента.
// Импортировать отсюда он не может: он обычный узловой скрипт, а здесь TypeScript
// с типами React. Источник у обоих ОДИН — порядок образцов в `SPECIMEN` ниже;
// расходятся не источники, а способы прочитать один и тот же.
//
// 🔒 РАСХОЖДЕНИЕ ЛОВИТСЯ СТОРОЖЕМ, А НЕ ВНИМАТЕЛЬНОСТЬЮ: `check:blocks-map`
// сверяет порождённую сводку с кодом на каждой сборке. Добавили образец и забыли
// пересобрать карту — сборка откажет, а не промолчит.
export const SPECIMEN_CODES: string[] = (() => {
  const seen = new Map<string, number>()
  return SPECIMEN.map(section => {
    const n = (seen.get(section.kind) ?? 0) + 1
    seen.set(section.kind, n)
    return `${section.kind}${String(n).padStart(2, '0')}`
  })
})()

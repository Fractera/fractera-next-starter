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
  /** Одна фраза: когда этот вид уместен. */
  when: string
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
    when: 'Sub-heading inside a section. Never in the table of contents.',
    blocks: [{ kind: 'h3', text: 'A sub-heading' }],
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
    when: 'Somebody else’s words. `cite` names the author.',
    blocks: [
      {
        kind: 'quote',
        text: 'A quote is the one place where the text is not yours — so the block shows attribution, and the attribution is a separate field rather than a line of prose.',
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
    kind: 'hero',
    when: 'The project mark and the eyebrow above the H1. The mark comes from settings, never from content; the H1 itself is drawn by the page factory.',
    blocks: [{ kind: 'hero', pill: 'Eyebrow above the title' }],
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
    kind: 'panel',
    when: 'A bordered section holding any blocks. Three tones: plain, warn, accent.',
    blocks: [
      { kind: 'panel', title: 'A plain panel', children: [{ kind: 'p', text: 'The sections of a landing page are all this one kind, differing by tone and contents.' }] },
      { kind: 'panel', tone: 'warn', title: 'Worth doing', children: [{ kind: 'p', text: 'Something that is not blocking, but is expensive to postpone.' }] },
      { kind: 'panel', tone: 'accent', eyebrow: 'The one place', title: 'Where the model works', children: [{ kind: 'p', text: 'The only glow on the page: highlighting everything highlights nothing.' }] },
    ],
  },
]

import type { BlogBlock, FaqPair, BlogBase } from '../../_lib/types'

const ANATOMY = `blog/a-page-is-a-list-of-blocks/
  page.tsx              3 lines, re-exports ./_components
  _components/index.tsx the factory call — no text lives here
  _data/meta.ts         slug, date, tags, cover  (not translatable)
  _data/en.ts           title + subtitle + blocks[] + faq[]
  _data/ru.ts           the same keys, only where they differ
  _data/index.ts        { meta, en, overrides: { ru } }`

const BLOCK_LIST = `blocks: [
  { kind: 'h2',   text: 'What the section layer is' },
  { kind: 'p',    text: 'One paragraph of prose.' },
  { kind: 'note', text: 'An aside the reader may skip.' },
]`

export const en: BlogBase = {
  title: 'A Page Is a List of Blocks',
  subtitle:
    'Your first page here is not a file you lay out — it is a list of sections in a language cell. Here is where that list lives, why a working feature arrives as a section rather than a page of its own, and the three edits it takes to add a kind that does not exist yet.',
  description:
    'How the section layer works in a freshly deployed Fractera project: a page is an array of blocks inside a language cell, every kind of block has exactly one server renderer under sections/blocks, and a calculator or a picker is a kind of section rather than a hand-built page. Includes the anatomy of a post folder, the address test that separates a section from a page, the three edits that add a new kind, and why the type system — not a gate — is what refuses a half-added one.',
  excerpt:
    'You deployed the server, you opened the repository, and the first instinct is to lay out a page. Do not. A page here is a list of blocks, a working feature is a kind of section, and a page of its own is only for something that needs its own address.',
  heroCaption:
    'The loop this project runs on: an agent edits the repository, machine gates refuse what does not fit, and the panel builds. The section layer is what the gates are checking.',
  blocks: [
    { kind: 'h2', text: 'The unit is the block, not the file' },
    {
      kind: 'p',
      text: 'You have just deployed your server, and the repository in front of you looks like an ordinary Next application. It is not quite one. Open any published page — this post, the home page, the privacy page — and you will not find its text in a component. Every one of them is an **array of blocks living in a language cell**: a plain data file that says, in order, that here comes a heading, then a paragraph, then a comparison table. The component that renders it is shared by all of them and belongs to nobody in particular.',
    },
    {
      kind: 'p',
      text: 'A post is six files in one folder, and only two of them are yours to think about — the data cells. The rest is the same in every post on purpose, because the shell of a page is not a place for an authorial decision:',
    },
    { kind: 'code', text: ANATOMY },
    {
      kind: 'p',
      text: 'Inside a cell, the body is literally a list. Nothing about the visual result is expressed here — no class, no colour, no spacing. The cell says WHAT comes next; the renderer decides how it looks, and it decides the same way for every page in the project:',
    },
    { kind: 'code', text: BLOCK_LIST },
    {
      kind: 'p',
      text: 'That indirection is the whole point. Because the text is data and not markup, the same body can be served as a page, as the markdown twin that AI readers fetch, and as an entry in the sitemap — without anyone writing it three times. It is also why translating a post is copying a file and changing the strings, rather than re-doing a layout in a second language.',
    },

    { kind: 'h2', text: 'Where the kinds actually live' },
    {
      kind: 'p',
      text: 'A `kind` is not a string the renderer improvises around. It is a member of one catalogue and it has exactly one renderer, in exactly one file. Three places, and they are the same three every time:',
    },
    {
      kind: 'list',
      items: [
        '**The shape** — `lib/content/blocks/types.ts`. What fields the kind carries. This file has zero imports on purpose: it is a leaf of the graph, so nothing it touches can drag a dependency into content data.',
        '**The renderer** — `sections/blocks/<kind>.server.tsx`. One kind, one file. It receives the block and a small context (the language, the labels the engine itself prints, and a callback to render nested blocks) and returns markup.',
        '**The registration** — `sections/index.ts`. One import, one key in the `SECTIONS` object. The project ships twenty-eight of them, from `p` and `quote` to `metrics`, `flow` and `projectTypeMarquee`.',
      ],
    },
    {
      kind: 'callout',
      title: 'The type is stricter than any gate',
      text: 'The set is declared as a mapped type over every member of the catalogue, so all kinds are mandatory. Add a kind to the catalogue and forget the renderer, and the project does not compile — you learn about it in a second. A gate could not do this: a gate runs when someone runs it, a type is always on. This is why check:types is one of the two commands worth running by hand.',
    },

    { kind: 'h2', text: 'Section or page? The question is the address' },
    {
      kind: 'p',
      text: 'The line is not about size, and it is not about whether the thing is interactive. It is about whether it needs an **address of its own** — something people search for, link to, and that belongs in the sitemap. If yes, it is a page, built by one of the three page models, and its body is still blocks. If no, it is a section, and it goes into the list of blocks of a page that already exists.',
    },
    {
      kind: 'table',
      caption: 'The same feature, decided two ways',
      headers: ['', 'Built as a page of its own', 'Built as a kind of section'],
      rows: [
        ['Put it on a second page', 'copy and paste it', 'add one line to the list'],
        ['Reorder it against the prose', 'rewrite the layout', 'move the entry in the array'],
        ['Translate it', 'a second page in a second language', 'the language cell already does it'],
        ['Find it later', 'you have to remember it exists', 'it is in the section catalogue'],
      ],
    },
    {
      kind: 'p',
      text: 'This is the mistake the layer is designed to prevent, and it is a slow one. A pricing calculator hand-built as its own page WORKS — that is exactly why nobody stops you. The bill arrives a month later, when there are five such pages, all slightly different, none of them translatable by a language cell, and none of them reusable on the landing page they were actually meant for.',
    },

    { kind: 'h2', text: 'A thing that WORKS is a section too' },
    {
      kind: 'p',
      text: 'A calculator, a to-do list, a picker that saves an answer — these are kinds of sections, not exceptions to the rule. The pattern is fixed: the renderer stays on the server, resolves the data and the dictionary there, and mounts an island from `components/` with the finished strings handed to it as props. If it needs storage, the table goes into the schema in `lib/db/index.ts`; if it needs a door, that is a route under `app/api/`, and a door open to guests must be named in `PUBLIC_API_PREFIXES`.',
    },
    {
      kind: 'p',
      text: 'The specimen to copy is `projectTypeMarquee` — the ribbon of project directions on the home page. Its renderer is a server component that reads the catalogue of directions from settings, resolves the labels for the requested language, and hands them to a client island. The numbers on that decision are worth remembering: **1.8 KB of one language travels to the browser instead of the 306 KB corpus**, because the dictionary was resolved on the server rather than imported by the island.',
    },
    {
      kind: 'note',
      text: 'No file under `sections/` carries "use client". That is a property of the layer, not an accident of the current set: the renderer is always a server component, and anything interactive lives in the island it mounts.',
    },

    { kind: 'h2', text: 'When to add a kind — and when not to' },
    {
      kind: 'p',
      text: 'Reach for an existing kind first, and not out of politeness: a page assembled from kinds that already exist inherits the project style for free, in light and dark, at every screen width, in every language the owner switches on later. A new kind is a new thing to keep consistent forever. Add one when the shape of the DATA is genuinely new — a metric row, a comparison table, a flow diagram — and not when you want the same paragraph in a different colour. Colour, type scale and shape are settings, and they live in the design config.',
    },
    {
      kind: 'p',
      text: 'When it is genuinely new, the sequence is the three edits above plus one habit: put a specimen of the kind on the block catalogue page, because that is what makes it discoverable to the next person who opens this repository — including the next session of the agent working in it. That is the whole loop [%SITE%](/en) is built on: the repository carries the pattern, the gates refuse what does not fit it, and nothing depends on anyone remembering.',
    },
    {
      kind: 'cta',
      text: 'This post is itself a demonstration: everything you just read is a list of blocks in two language cells, rendered by the same twenty-eight renderers as the home page.',
      href: '/en',
      label: 'See the page these blocks build',
    },
  ] satisfies BlogBlock[],
  faq: [
    {
      q: 'Where do I write the text of a page in this project?',
      a: 'In a language cell — a data file under the page folder, for example _data/en.ts. It exports the title, the subtitle, the excerpt and a blocks array: an ordered list of sections, each one an object with a kind and its fields. You do not lay out a page in a component; the component is shared, and the cell is the only thing that differs between one page and the next.',
    },
    {
      q: 'How do I add a kind of section that does not exist yet?',
      a: 'Three edits. Declare the shape in lib/content/blocks/types.ts, write the renderer in sections/blocks/<kind>.server.tsx as a server component, and register it in the SECTIONS object in sections/index.ts. The set is typed as a mapped type over the catalogue, so a kind declared without a renderer fails to compile rather than failing silently at render time. Then put a specimen of it on the block catalogue page so the next session finds it.',
    },
    {
      q: 'My feature is interactive. Does it still have to be a section?',
      a: 'Yes, unless it needs an address of its own. A calculator or a picker is a kind of section whose server renderer mounts a client island from components/ with the strings already resolved. Hand-building it as a standalone page works, and that is the trap: it cannot be placed on another page, cannot be reordered against the prose, is not translated by a language cell and does not appear in the section catalogue. A page of its own is for something people search for and link to.',
    },
  ] satisfies FaqPair[],
}

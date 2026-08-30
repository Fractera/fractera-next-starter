import type { FooterPageCell } from '@/lib/pages/footer-page'

// Английская основа страницы «Архитектура».
//
// 🔒 ЭТО НЕ ЗАГЛУШКА, В ОТЛИЧИЕ ОТ ПРАВОВЫХ СОСЕДЕЙ. Те — образцы: их текст
// владелец обязан заменить своим, потому что такой документ пишет он, а не мы.
// Здесь наоборот — описывается АРХИТЕКТУРА продукта, одинаковая у всех, кто на
// нём стоит. Владелец волен переписать и её, но пустой она не бывает: пока он
// молчит, страница уже говорит правду.
//
// 🔒 СТРАНИЦА ГОВОРИТ О СЛОЯХ, А НЕ О ФАЙЛАХ. Список папок устаревает на первой
// же перестановке и превращает страницу в ложь; границы слоёв держатся годами.
// Всё, что здесь названо, проверяемо снаружи: порты, процессы, поведение при
// выключенном JavaScript.
//
// ── СТРУКТУРА ПЕРЕСТРОЕНА 2026-08-30 (шаг 30) ────────────────────────────────
//
// 🔒 ТРИ ЭЛЕМЕНТА — ЭТО КАРКАС ДОКУМЕНТА, А НЕ ЕГО ПЕРВЫЙ АБЗАЦ. Решение
// владельца: сначала определить, ЧТО такое архитектура Fractera, и от определения
// развернуть весь текст. Отсюда ровно три заголовка второго уровня — робот-
// установщик, стартовый шаблон, инфраструктурная оболочка, — и всё остальное
// живёт внутри одного из них. Раздел, которому не нашлось столпа, — признак того,
// что определение неполно, а не того, что нужен четвёртый заголовок.
//
// 🔒 ФОРМА — ТЕХНИЧЕСКИЙ ДОКУМЕНТ, А НЕ РАССКАЗ. Требование владельца дословно:
// «максимально технический формат с минимальным философствования… сжато
// информативно но с фокусом на простое чтение для людей с невысоким экспертным
// уровнем». Отсюда бюджет: абзац не длиннее 400 знаков, раздел — не больше
// четырёх блоков. Объяснение «почему это правильно» занимает одно предложение и
// не повторяется.
//
// 🔒 «ПРОДОЛЖЕНИЕ СЛЕДУЕТ» — ЧЕСТНОЕ СОСТОЯНИЕ, А НЕ ЗАГЛУШКА. Владелец: «если
// где-то остаются не полностью раскрыты темы просто поставь заключение этого
// пункта». Раздел без такой заметки считается написанным; с заметкой — ждущим
// своей очереди. Считать их можно командой, и именно так проверяется прогресс.

export const en: FooterPageCell = {
  title: 'Architecture',
  description:
    'How this application is put together: the installer robot that builds the server, the starter template you are standing in, and the infrastructure shell around them.',
  keywords: 'architecture, layers, static generation, own server, data layer, parallel routes',
  blocks: [
    {
      kind: 'p',
      text: 'This page describes the skeleton the application stands on. It is written for two readers at once — a person deciding whether the product fits, and a coding agent that will change it. Both need the same thing: to know which layer owns what, before touching anything. Back to [%SITE%](/en).',
    },
    {
      kind: 'p',
      text: '**The architecture exists because of three elements.** Everything else on this page belongs to one of them:',
    },
    {
      kind: 'list',
      items: [
        '**The installer robot** — the process that installs and starts the server on Ubuntu, connects authorization, the database, the starter template and the rest.',
        '**The starter template** — the mandatory architectural principles: reusable patterns of behaviour and the special instructions for artificial intelligence. This is the inner skeleton, the DNA of the project.',
        '**The infrastructure shell** — everything kept outside the application itself, with authorization and memory at its centre.',
      ],
    },

    // ── СТОЛП ПЕРВЫЙ ──────────────────────────────────────────────────────────
    { kind: 'h2', text: 'The Fractera installer robot' },
    {
      kind: 'p',
      text: 'A server is not configured by hand. The installer takes a clean Ubuntu machine and leaves a working system behind it. It reports its progress step by step, so you can see where the installation is — and where it stopped, if it stopped.',
    },
    {
      kind: 'list',
      items: [
        'system packages, Node 22 and a process manager;',
        'seven processes: the application, authorization, the panel, the data layer, the map, channels, the knowledge graph;',
        'the application, authorization and panel built — plus a copy of the first good build, so there is always something to roll back to;',
        'a swap file if the machine has less than two gigabytes of memory: without it the installation dies halfway on a small server.',
      ],
    },

    { kind: 'h3', text: 'Installing by cloning the repository through an MCP server' },
    {
      kind: 'p',
      text: 'The path for those who raise a server with a tool rather than by hand: an agent talks to the platform over the MCP protocol and installs the project itself.',
    },
    { kind: 'note', text: 'More on this shortly.' },

    { kind: 'h3', text: 'Launching through the web interface' },
    {
      kind: 'p',
      text: 'The main path. The control panel carries a project-launch section: eleven steps from an empty GitHub repository to the first change you have seen at your own address.',
    },
    {
      kind: 'p',
      text: 'The steps are of two kinds, and the difference matters. Some are closed by the machine — the repository answered, the key was issued, the project was pushed; such a tick cannot be given out of politeness. The others you tick yourself: the panel has no eyes on your computer, and pretending it can see a folder you created would be a lie. Your own tick can be removed, and the step opens again.',
    },

    { kind: 'h4', text: 'Migrating from any other framework' },
    {
      kind: 'p',
      text: 'A project that already works is not moved by rewriting its files. Its code is read as a description of what it does; from that description a queue of steps is born, and the skeleton comes first — addresses, tables, sign-in, permissions. An incompatible stack is therefore not an obstacle: what moves is the meaning of a capability, not its files.',
    },
    {
      kind: 'p',
      text: 'Four questions are answered before the first route: what kind of application this is, whether there will be a sign-in, whether there will be role-based access, and which roles restrict what. The answer decides the whole layout — which layer a page lives in, what lock its door carries, what a guest sees. A mistake here relays the skeleton rather than fixing a page.',
    },
    {
      kind: 'p',
      text: 'Data moves last, as a separate step under separate access. Defects of the original are named out loud along the way and are not repeated in the new one.',
    },

    // ── СТОЛП ВТОРОЙ ──────────────────────────────────────────────────────────
    { kind: 'h2', text: 'The starter template' },
    {
      kind: 'p',
      text: 'You are reading this page from inside the starter template. It is not a set of ready-made pages but a set of mandatory principles and working examples: every class of thing in the project already has a specimen, and anything new is made by copying something that works. The shape therefore holds by construction, not by the discipline of whoever is writing.',
    },

    { kind: 'h3', text: 'Ready for high load' },
    {
      kind: 'p',
      text: 'Load is survived not by the size of the server but by the fact that almost all the work is already done. Serving a finished page costs the same for ten visitors and for ten thousand.',
    },
    { kind: 'h4', text: 'Static page generation' },
    {
      kind: 'p',
      text: 'Pages are generated ahead of time, not assembled per request. That is not a performance detail — it is the reason for three properties at once:',
    },
    {
      kind: 'list',
      items: [
        'the site stays cheap under load: a traffic spike costs nothing extra;',
        'a search engine receives finished markup instead of an empty page it has to wait for;',
        'navigation works with JavaScript switched off — the routing is server-side.',
      ],
    },
    {
      kind: 'p',
      text: 'Only what depends on WHO is looking is built per request: an account, a work screen. Everything else is regenerated on a schedule, and refreshing one page does not rebuild the site.',
    },

    { kind: 'h3', text: 'Special architectural instructions' },
    {
      kind: 'p',
      text: 'A coding agent starts every session with no memory of the last one. What survives is written down, inside the project, next to the code. This corpus is as much a part of the architecture as the ports are — it is what makes the second session no worse than the first.',
    },
    {
      kind: 'table',
      headers: ['Document', 'What it is for'],
      rows: [
        ['The project passport', 'What the product is, which roles, which languages, what the owner decided — in his words and dated. While an unanswered question stands in the passport, work does not start.'],
        ['Development steps', 'The work as files: a step is opened before it is done and closed with a report. A session that dies loses nothing — the next one resumes from the files.'],
        ['Testing', 'How a step is proven: two independent proofs from different planes. A green build is never one of them — its log looks identical whether the capability works or not.'],
        ['Anti-patterns', 'Approaches that already cost time here, each with the mechanism of the failure. The agent appends to it the moment a dead end is understood.'],
        ['The glossary', 'The words of the project. A term that means different things to two sessions is two different projects.'],
      ],
    },
    { kind: 'h4', text: 'Four development modes' },
    {
      kind: 'p',
      text: 'A mode answers one question: where the task comes from. It is chosen in the project settings and can be changed at any time.',
    },
    {
      kind: 'list',
      items: [
        '**Classic** — the task arrives from you in words. No plan ahead, no accounting.',
        '**Steps** — a queue of numbered steps, each described before it is done. This is the default.',
        '**Cases** — work starts only from a confirmed product scenario, and every step names its own.',
        '**Migration** — the queue is born from reading a project that already works.',
      ],
    },

    { kind: 'h3', text: 'Products — the unit of work' },
    {
      kind: 'p',
      text: 'One server carries several products: a landing page today, a scheduled watcher next week, the company brain after that. Each lives at its own pace and cannot quietly damage its neighbour — it has its own pages, its own logic, its own tables and its own scenarios.',
    },
    {
      kind: 'p',
      text: 'A product is created in the control panel: you pick one of twenty-two structures — a landing page, a shop, delivery, a company brain and so on — and it answers the first questions for you. The product then passes four phases: intake, decomposition into steps, development, and a review of what was built.',
    },
    { kind: 'h4', text: 'Why not simply call it a project' },
    {
      kind: 'p',
      text: 'Because a project is not a place. It has no address, no folder and no tables, so a scenario attached to it cannot be executed: the agent still has to guess where the work goes. A product has all three, and that is the whole difference. Its internal id means nothing and never changes — the paths hang off it, while the name and the address are yours to edit.',
    },
    { kind: 'h4', text: 'Not every product has a page' },
    {
      kind: 'p',
      text: 'A product declares one of three surfaces, and the default always leans towards closed:',
    },
    {
      kind: 'list',
      items: [
        '**Public** — it has an address and visitors reach it;',
        '**Private** — it lives as a tab in your control panel, and the outside world has no way in;',
        '**Headless** — it has no screen at all: it works on a schedule and through communication channels, and you meet it in Telegram or in its report.',
      ],
    },
    { kind: 'h3', text: 'Design' },
    { kind: 'h4', text: 'The sections of design' },
    { kind: 'h4', text: 'Blocks' },
    { kind: 'h5', text: 'Types of block' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Four configuration files' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Many languages' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Found by search engines, readable by models' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Role-based access out of the box' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Parallel routing' },
    { kind: 'note', text: 'More on this shortly.' },

    // ── СТОЛП ТРЕТИЙ ──────────────────────────────────────────────────────────
    { kind: 'h2', text: 'The infrastructure shell' },

    // 🔒 ФРАГМЕНТ ПРО ПОРТЫ ПЕРЕНЕСЁН ДОСЛОВНО (владелец, 2026-08-30: «этот
    // фрагмент я бы оставил без изменения как патерн документа»). Изменился
    // ТОЛЬКО уровень заголовка — раздел стал подразделом третьего столпа;
    // абзац, таблица, список и заметка совпадают с прежними побайтно.
    { kind: 'h3', text: 'How it is wired' },
    {
      kind: 'p',
      text: 'Several processes run side by side on your server. Four of them answer outward, and each has exactly one job. The boundary between them is a port rather than a folder — which is why a failure in one does not take the others with it.',
    },
    {
      kind: 'table',
      headers: ['Port', 'Process', 'What it is for'],
      rows: [
        ['3000', 'Your application', 'The pages visitors see. This is the one you work with every day.'],
        ['3001', 'Authorization', 'Accounts, sessions, roles. Configured from the control panel, not edited by you.'],
        ['3002', 'Control panel', 'The same: configured, not edited.'],
        ['3300', 'Data layer', 'Rows, uploaded files, vectors — and the single door to everything else. Your application talks to it.'],
      ],
    },
    { kind: 'p', text: 'Three more services run alongside, and none of them is a door of its own:' },
    {
      kind: 'list',
      items: [
        'the map — routes, distance matrices and address lookup, port 3400;',
        'channels — Telegram and whatever follows it, port 3500;',
        'the knowledge graph — the agentic RAG store, port 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'None of these ports is reachable from the internet: the firewall admits the web ports only, and everything public arrives through them. Your application reaches the three services through the data layer — /service/geo, /service/channels, /service/rag — with the same key that opens the data layer itself.',
    },

    { kind: 'h4', text: 'Each layer survives the others' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Working with GitHub' },
    { kind: 'h4', text: 'The way out' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Your own domain and certificates' },
    { kind: 'h4', text: 'Security certificates' },
    { kind: 'h5', text: 'The automatic certificate' },
    { kind: 'h5', text: 'Your own certificate' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Authorization' },
    { kind: 'h4', text: 'Signing in by email' },
    { kind: 'h4', text: 'Signing in with Google' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Memory' },
    { kind: 'h4', text: 'The database' },
    { kind: 'h4', text: 'The object store' },
    { kind: 'h4', text: 'The vector store' },
    { kind: 'h4', text: 'The agentic RAG' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Communication channels' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'The map' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'The control panel' },
    { kind: 'h4', text: 'Backups' },
    { kind: 'h4', text: 'Deployment and errors' },
    { kind: 'note', text: 'More on this shortly.' },
  ],
}

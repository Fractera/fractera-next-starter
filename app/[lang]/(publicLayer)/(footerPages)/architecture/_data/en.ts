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
    {
      kind: 'p',
      text: 'Colour, type and spacing are not chosen per page. The scale lives in one place, the palette in another, and a hand-written heading fails a check before it ever reaches the site. The law behind it is short: **nothing about how a page looks depends on who may open it.** A storefront and an admin table are set the same way; access decides what a person sees, never how it is set.',
    },
    { kind: 'h4', text: 'The sections of design' },
    {
      kind: 'p',
      text: 'The look is edited inside the project itself, in six sections. A change is visible on the next page load — no rebuild required.',
    },
    {
      kind: 'list',
      items: [
        '**Fonts** — which families set the headings and the body;',
        '**Type scale** — every size at once, by a single multiplier: the whole set grows or shrinks keeping its proportions;',
        '**Shape** — radii, borders, density;',
        '**Colour** — a palette of roles rather than values: light and dark are the same roles with different values, not two designs to keep in step by hand;',
        '**Blocks** — the catalogue of what pages are built from;',
        '**Tools** — service switches, such as the screen-width indicator.',
      ],
    },
    { kind: 'h4', text: 'Blocks' },
    {
      kind: 'p',
      text: 'A page is a list of blocks, not a laid-out file. The catalogue is closed: a kind not declared in it does not exist for the application, and the build refuses. There are more than thirty kinds, and each has a specimen you can open and look at — a kind you cannot see anywhere is not "unused" but unverified.',
    },
    {
      kind: 'p',
      text: 'A new block is created with the help of artificial intelligence, including from code samples, and is then **standardised** — it enters that same catalogue instead of staying as the markup of one page. From there it is reused across every project: drawn once, verified once, taken ready afterwards.',
    },
    { kind: 'h5', text: 'Types of block' },
    {
      kind: 'p',
      text: 'The catalogue answers "what exists", and for choosing that is not enough. So blocks carry a type — by purpose rather than by construction: you pick the type first and the kind only inside it.',
    },
    {
      kind: 'list',
      items: [
        'hero · benefits and value · how it works · product demo · use cases;',
        'comparison · pricing · testimonials · showcase · trust;',
        'page material — headings, paragraphs, lists, tables, notes: half the catalogue is this one.',
      ],
    },
    { kind: 'h3', text: 'Four configuration files' },
    {
      kind: 'p',
      text: 'A large part of the project changes by editing four files — with no rebuild and no artificial intelligence involved. The application reads them on every request, so a change is visible on the next page load.',
    },
    {
      kind: 'table',
      headers: ['File', 'What is in it'],
      rows: [
        ['Application', 'Name, description, address, logo and images, icons, author, social profiles, search, analytics, currency.'],
        ['Platform', 'Which capabilities are on: the switches, the development mode, parallel routes.'],
        ['Design', 'Fonts, scale, shape, colour.'],
        ['Products', 'The registry of products, one dossier each.'],
      ],
    },
    {
      kind: 'note',
      text: 'There is one exception, and it is worth knowing in advance: the language set and the access keys live in the environment file, and that one is baked in at build time. Saving a value there without rebuilding the project changes nothing.',
    },

    { kind: 'h3', text: 'Many languages' },
    {
      kind: 'p',
      text: 'You enable the languages your market speaks and the rest wait. Enabling one later is a setting, not a rebuild of the way the site works. What matters more is what adding a language does NOT do:',
    },
    {
      kind: 'list',
      items: [
        'it does not turn any page dynamic: every language gets its own pages, generated ahead of time — ten languages means ten sets of finished pages, not one page assembled on the fly;',
        'it does not dilute search ranking: each page declares itself the original in its own language and names its translations, so a search engine sees one page in ten languages rather than ten near-duplicates competing with each other;',
        'it does not cost speed: serving a prerendered page is the same work regardless of how many languages exist beside it.',
      ],
    },
    {
      kind: 'note',
      text: 'A single-language site is a case in its own right, not a stripped-down version: the language disappears from the addresses entirely, and the site stops advertising translations it does not have.',
    },

    { kind: 'h3', text: 'Found by search engines, readable by models' },
    {
      kind: 'p',
      text: 'Two readers arrive at a modern site and they want different things. A search engine sends a person to a page. A model comes itself, reads, and retells. The product is built for both, and the two are not the same job.',
    },
    {
      kind: 'p',
      text: 'The search engine gets finished markup: each page declares its own canonical address, translations name each other, and structured data, sitemaps and robots rules ship by default. Machine checks refuse a page that breaks any of it.',
    },
    {
      kind: 'p',
      text: 'The model gets the same text without the markup: a map at `/llms.txt`, the whole corpus at `/llms-full.txt`, and a markdown version beside each page. That matters because page markup is half noise to a model — menus, footer, consent banner, scripts — and it spends its attention on all of it.',
    },
    {
      kind: 'note',
      text: 'Until the semantic structure of your project is ready, it is worth closing it to indexing: the setting lives in the application settings, section "Search". Both forms of the page are built from the SAME content — there is no separate "version for AI" to drift out of step.',
    },

    { kind: 'h3', text: 'Role-based access out of the box' },
    {
      kind: 'p',
      text: 'Roles are not built for a project — they are already there. Three of them decide access: a guest, a signed-in user, and the architect, meaning the owner of the server. The remaining twelve are a vocabulary for business: buyer, subscriber, manager, support, delivery, finance, editor, administrator.',
    },
    {
      kind: 'p',
      text: 'It is enough to say which layer a page needs. The lock sits on the route layer rather than in the markup of each page, and the door to the data is no softer than the page above it: closing a page while leaving its door open is the most common way to build leaky access.',
    },

    { kind: 'h3', text: 'Parallel routing' },
    {
      kind: 'p',
      text: 'A page can be made not of one tree but of several named areas drawn at the same time: header, footer, left and right panels, the centre with its own header and footer, a promo screen, breadcrumbs, notifications, a modal window. This is how a deep interface for a professional is assembled without turning the site into an application.',
    },
    {
      kind: 'list',
      items: [
        'an area has its own pages and its own addresses — it is a tree of its own, not a piece of markup;',
        'an area has its own error boundary: a failed area shows its own error while the rest of the page keeps working;',
        'an area is switched on and off, and a switched-off one is not drawn at all;',
        'there are three kinds of route: an ordinary page, a slide-out panel, and a modal window over the page — and the address stays real, so such a link can be sent to someone;',
        'search optimisation and prerendered pages are preserved, and changes apply without rebuilding the project.',
      ],
    },
    { kind: 'note', text: 'More on this shortly.' },

    // ── СТОЛП ТРЕТИЙ ──────────────────────────────────────────────────────────
    { kind: 'h2', text: 'The infrastructure shell' },
    {
      kind: 'p',
      text: 'Everything that governs the project lives outside the project itself. What travels to your repository is the application; the control panel, authorization and the data stay on the server. The reason is not secrecy: editing the code must not be able to break the thing that governs the code. Breaking the shell by hand is possible — it is your server — and then the consequences are yours.',
    },

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
    {
      kind: 'p',
      text: 'Separate processes are not a diagram — they are what happens on a bad day. Any one of the four can stop without taking the rest down with it.',
    },
    {
      kind: 'table',
      headers: ['If this stops', 'What still works'],
      rows: [
        ['Your application', 'The panel, the data and the accounts are untouched; only the site is down.'],
        ['Control panel', 'The site keeps serving visitors; only changes have to wait.'],
        ['Data layer', 'Pages generated ahead of time still open — that is what static generation is for.'],
        ['Authorization', 'Public pages are unaffected; only what sits behind a sign-in closes.'],
      ],
    },

    { kind: 'h3', text: 'Working with GitHub' },
    {
      kind: 'p',
      text: 'The repository is yours. The project is pushed to it and pulled back with a button in the panel; the repository address and the access token live on the server rather than in the code, so they do not travel with the project and do not end up in anyone else’s hands along with it.',
    },
    { kind: 'h4', text: 'The way out' },
    {
      kind: 'p',
      text: 'Leaving the platform is a legitimate scenario, not a breakage. The application is an ordinary project: remove its dependency on the panel and it runs anywhere. You lose what lives on the server — settings without a rebuild, the data layer and search by meaning, authorization in 82 languages, the deployment history with a rollback, the map and the channels. The code stays with you in full.',
    },

    { kind: 'h3', text: 'Your own domain and certificates' },
    {
      kind: 'p',
      text: 'A project runs in one of two modes. At the start it is an IP address over an unprotected protocol — convenient for getting to know the project, and honest about the browser capabilities that are unavailable in it. The second mode is your own domain, HTTPS and strict role checking; you move to it as soon as you decide to develop the project in earnest.',
    },
    {
      kind: 'p',
      text: 'Connecting a domain is described in the panel: a wizard of five steps and five records at your registrar — the domain itself, `www`, and three service names for sign-in, the panel and the data. The certificate is then issued automatically.',
    },
    { kind: 'h4', text: 'Security certificates' },
    {
      kind: 'p',
      text: 'The certificate is issued and renewed without a human: renewal is handled by a system timer that wakes twice a day and renews whatever is due. The panel shows the expiry date and the names the certificate covers, and next to it stands a manual renewal button — for the case where waiting is not an option.',
    },
    { kind: 'h5', text: 'The automatic certificate' },
    {
      kind: 'p',
      text: 'Free, from Let’s Encrypt. It is valid for 90 days and is renewed ahead of time rather than on the last day. What matters is what it actually attests: **control over the domain, not your organisation.** Such a certificate carries no company check — Let’s Encrypt does not issue organisation-validated certificates at all.',
    },
    { kind: 'h5', text: 'Your own certificate' },
    {
      kind: 'p',
      text: 'Uploaded as a certificate-and-key pair and replaces the automatic one. It is needed when your company or an external regulator requires it: when the certificate must come from a particular authority, say, or carry an organisation check. The panel shows its expiry and covered names in the same way.',
    },

    { kind: 'h3', text: 'Authorization' },
    {
      kind: 'p',
      text: 'Accounts, sessions and roles live in a separate service rather than inside the application. The sign-in interface is translated into 82 languages: a customer arrives from a country you did not choose and in a language you did not plan for.',
    },
    { kind: 'h4', text: 'Signing in by email' },
    {
      kind: 'p',
      text: 'The default, and enough for a prototype: a person enters an address and receives a link by email — there is no password, so there is nothing to forget and nothing to steal. It is switched on with a mail-service key you paste into the panel.',
    },
    { kind: 'h4', text: 'Signing in with Google' },
    {
      kind: 'p',
      text: 'Switched on with an id-and-secret pair from the Google console; the panel hands you the return address ready to copy. Beyond these two, **more than eighty** preconfigured sign-in providers are available: connecting any of them is a support request, not development work.',
    },
    {
      kind: 'p',
      text: 'And the point of it all: signing in does not exist for its own sake. It returns a **role** — the very thing the route layers and the locks on the data doors stand on. The way in changes; what a person receives afterwards does not.',
    },
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

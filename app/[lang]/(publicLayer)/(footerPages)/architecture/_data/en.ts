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

export const en: FooterPageCell = {
  title: 'Architecture',
  description:
    'How this application is put together: the layers, what each one owns, and which of them keeps working when the others are switched off.',
  keywords: 'architecture, layers, static generation, own server, data layer',
  blocks: [
    {
      kind: 'p',
      text: 'This page describes the skeleton the application stands on. It is written for two readers at once — a person deciding whether the product fits, and a coding agent that will change it. Both need the same thing: to know which layer owns what, before touching anything. Back to [%SITE%](/en).',
    },

    { kind: 'h2', text: 'How it is wired' },
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

    { kind: 'h2', text: 'Each layer survives the others' },
    {
      kind: 'p',
      text: 'Separate processes are not a diagram — they are what happens on a bad day. Any one of the four can stop without the rest going down with it.',
    },
    {
      kind: 'table',
      headers: ['If this stops', 'What still works'],
      rows: [
        ['Your application', 'The panel, the data and the accounts are untouched; only the site is down'],
        ['Control panel', 'The site keeps serving visitors; only changes have to wait'],
        ['Data layer', 'Pages generated ahead of time still open — that is what static generation is for'],
        ['Authorization', 'Public pages are unaffected; only what sits behind a login closes'],
      ],
    },
    {
      kind: 'note',
      text: 'The panel deliberately lives outside your repository. What travels to your GitHub is the application; the cockpit stays on the server, which is why an editing mistake cannot break it.',
    },

    { kind: 'h2', text: 'Static first, and what that buys you' },
    {
      kind: 'p',
      text: 'Pages are generated ahead of time, not assembled per request. That is not a performance detail — it is the reason the site stays cheap to serve under load, fully readable by search engines, and functional with JavaScript switched off.',
    },
    {
      kind: 'list',
      items: [
        'The routing is server-side, so a visitor with scripts disabled still navigates the whole site.',
        'Content is regenerated on a schedule rather than on every visit, so a traffic spike costs nothing extra.',
        'Anything that genuinely depends on who is looking — a dashboard, an account — is rendered per request, and only that part.',
      ],
    },

    { kind: 'h2', text: 'One design, decided once' },
    {
      kind: 'p',
      text: 'Colours, type and spacing are not chosen per page. The whole scale lives in one place, the palette in another, and a hand-written heading fails a check before it ever reaches the site.',
    },
    {
      kind: 'p',
      text: 'The law behind it is short: **nothing about how a page looks depends on who may open it.** Public or private, storefront or admin table — same headings, same scale, same colours. Access decides what a person may see, never how it is set.',
    },
    {
      kind: 'p',
      text: 'This is written down because its absence has a shape. While the design file was empty, the agent building this project invented a second heading style for "work screens" — two private pages ended up twice apart in size and set in different families. Nothing was broken; it simply read as two different products.',
    },
    {
      kind: 'p',
      text: 'Your palette is a small file of colour roles, read as the page is served. Change it and the whole site follows — including the pages you have not built yet, and including both themes: light and dark are the same roles with different values, not two designs to keep in step by hand.',
    },

    { kind: 'h2', text: 'Languages: 82 available, and adding one costs nothing' },
    {
      kind: 'p',
      text: 'Eighty-two languages ship with the product. You enable the ones your market speaks, and the rest wait — enabling one later is a setting, not a rebuild of the way the site works.',
    },
    {
      kind: 'p',
      text: 'The part worth understanding is what adding a language does NOT do:',
    },
    {
      kind: 'list',
      items: [
        'It does not turn any page dynamic. Every language gets its own pages, generated ahead of time exactly like the first one — ten languages means ten sets of static pages, not one page assembled per request.',
        'It does not dilute search ranking. Each page declares itself the original in its own language and names its translations, so a search engine treats them as one page in ten languages rather than ten near-duplicates competing with each other.',
        'It does not cost speed. Serving a prerendered page is the same work regardless of how many languages exist beside it.',
      ],
    },
    {
      kind: 'note',
      text: 'A single-language site is a case in its own right, not a stripped-down version: the language disappears from the addresses entirely, and the site stops advertising translations it does not have.',
    },

    { kind: 'h2', text: 'Found by search engines, readable by models' },
    {
      kind: 'p',
      text: 'Two readers arrive at a modern site, and they want different things. A search engine sends a person to a page. A model comes itself, reads, and retells. The product is built for both, and the two are not the same job.',
    },
    {
      kind: 'p',
      text: 'For search engines: pages are served as finished HTML, each declares its own canonical address, translations name each other, metadata is assembled by one mechanism rather than per page, and structured data, sitemaps and robots rules ship by default. Machine checks refuse a page that breaks any of it.',
    },
    {
      kind: 'p',
      text: 'For models: every public page also exists as plain text. There is a map at /llms.txt, the whole corpus at /llms-full.txt, and a markdown version of each page beside it. That matters because page markup is half noise to a model — menus, footer, consent banner, scripts — and it spends its context on all of it.',
    },
    {
      kind: 'note',
      text: 'Both forms are built from the SAME content. There is no separate "version for AI" to drift out of step: edit the text once and both change together. A hand-maintained copy would diverge on the first correction, and nobody would notice, because no one opens it in a browser.',
    },

    { kind: 'h2', text: 'Settings apply without a rebuild' },
    {
      kind: 'p',
      text: 'The name, description, logo, colours, languages and feature switches live in configuration files on the server, outside the code. The application reads them as it serves, so a change in the panel is visible immediately — no deployment, no downtime.',
    },
    {
      kind: 'p',
      text: 'The consequence matters more than the convenience: the same code base serves a bakery and a marketplace, and neither had to be forked to get there.',
    },

    { kind: 'h2', text: 'Your server, your code, and the way out' },
    {
      kind: 'p',
      text: 'The application is yours: clone it, edit it locally, push it back. Nothing here calls home — there is no vendor to ask for permission and no subscription that can be revoked.',
    },
    {
      kind: 'p',
      text: 'You may also leave. Strip the dependency on the panel and the application runs anywhere. You lose the parts that live on the server — settings without a rebuild, the data layer, vector search, authorization in 82 languages, the deployment history with a rollback — and you keep the code. That is a legitimate exit, not a departure from the design.',
    },

    { kind: 'h2', text: 'Built to keep growing after the context runs out' },
    {
      kind: 'p',
      text: 'The hard limit on an AI-built project is not the size of the code. It is how much of that code has to be understood at once before a safe change can be made. A project where every new page adds to a central file hits that wall early: eventually no session can hold enough to change anything without breaking something else.',
    },
    {
      kind: 'p',
      text: 'The shape here is chosen against exactly that. **Every entity owns its folder** — its pages, its data, its words, its private components. Delete the folder and nothing is orphaned anywhere else.',
    },
    {
      kind: 'list',
      items: [
        'The shared layer does not grow as entities are added. Something rises to a shared place only when two things genuinely use it, and that move is a deliberate act, not a habit.',
        'Permissions are declared where they are enforced, not in a registry someone must remember to update.',
        'Route groups make the two kinds of page visible on disk: public content on one side, role-gated screens on the other. A folder in neither is an unanswered question, and a check says so out loud.',
      ],
    },
    {
      kind: 'p',
      text: 'The consequence is the point: a change to one entity requires reading one folder. Millions of lines stay workable not because anyone is holding them in mind, but because no single change ever needs to.',
    },
    {
      kind: 'p',
      text: 'The starter is the same idea applied to the beginning. What ships is not an empty repository but a working example of every pattern — a page, a post, a catalogue, a private screen, a dialog, a language cell. A new page is made by copying a working one, so the shape propagates by construction instead of by discipline.',
    },

    { kind: 'h2', text: 'The documents the agent obeys' },
    {
      kind: 'p',
      text: 'A coding agent starts every session with no memory of the last one. What survives is written down, inside the project, and read at the start of each session. This corpus is as much a part of the architecture as the ports are — it is what makes the second session as competent as the first.',
    },
    {
      kind: 'table',
      headers: ['Document', 'What it is for'],
      rows: [
        ['User cases', 'What the product is FOR, one file per scenario: who arrives, what brought them, what must be true when they are done. No confirmed case means no building — the agent is required to stop and ask instead of guessing.'],
        ['Development steps', 'The work itself, as files. A step is opened before it is executed and moved to the completed folder with a full report. A session that dies loses nothing; a cold session resumes from the files.'],
        ['Testing', 'How a step is proven finished: two independent proofs from two different planes, written out. A green build is never one of them — a build log looks identical whether or not the feature works.'],
        ['Anti-patterns', 'Approaches that already cost time here, each with the mechanism of the failure. Self-evolving: the agent appends the moment a dead end is understood.'],
        ['Lessons', 'Your preferences and the habits earned by getting something wrong once. Where a lesson and the agent’s default disagree, the lesson wins — it exists because the default already failed here.'],
        ['Design', 'How pages look, decided by you and obeyed. Given, not evolving.'],
      ],
    },
    {
      kind: 'p',
      text: 'Two of these deserve a word about direction. **Anti-patterns and lessons are written by the agent**; the design document is written by you. The difference is deliberate: an agent may record what it learned, and may not decide what the product should look like.',
    },
    {
      kind: 'note',
      text: 'User cases are moving from files to a service. The conversation that produces them already lives in the control panel; next they move behind a tool interface backed by a database, so the agent asks for the cases it needs instead of reading a folder. The rule does not change with the storage — no confirmed case, no building. What changes is that the cases stop being a document the agent must remember to open.',
    },
  ],
}

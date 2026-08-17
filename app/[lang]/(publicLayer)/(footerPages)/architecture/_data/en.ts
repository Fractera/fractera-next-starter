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

    { kind: 'h2', text: 'Built for a project that outgrows itself' },
    {
      kind: 'p',
      text: 'Every entity owns its folder: its pages, its data, its words. The shared layer does not grow as entities are added, and permissions are declared where they are enforced rather than in a registry someone must remember to update. Stability here is a consequence of that shape, not a promise about it.',
    },
    {
      kind: 'note',
      text: 'The control panel carries a longer, living version of this document — it grows with your project and names the parts you added yourself.',
    },
  ],
}

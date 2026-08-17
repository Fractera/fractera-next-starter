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

    { kind: 'h2', text: 'Four layers, and each one survives the others' },
    {
      kind: 'p',
      text: 'The product is not one program. It is four, running side by side on your own server, and the boundary between them is a port rather than a folder — which means a failure in one does not take the others with it.',
    },
    {
      kind: 'table',
      headers: ['Layer', 'What it owns', 'What happens if it stops'],
      rows: [
        ['Application', 'Pages, content, the storefront — everything a visitor sees', 'The site is down; the panel, the data and the accounts are untouched'],
        ['Control panel', 'Settings, deployment, the owner’s cockpit', 'The site keeps serving; only changes have to wait'],
        ['Data layer', 'Rows, uploaded files, vector search — and the single door to the rest', 'Pages that were generated ahead of time still open'],
        ['Authorization', 'Accounts, sessions, roles', 'Public pages are unaffected; only what is behind a login closes'],
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

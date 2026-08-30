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
    { kind: 'h3', text: 'Installing by cloning the repository through an MCP server' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Launching through the web interface' },
    { kind: 'h4', text: 'Migrating from any other framework' },
    { kind: 'note', text: 'More on this shortly.' },

    // ── СТОЛП ВТОРОЙ ──────────────────────────────────────────────────────────
    { kind: 'h2', text: 'The starter template' },
    { kind: 'h3', text: 'Ready for high load' },
    { kind: 'h4', text: 'Static page generation' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Special architectural instructions' },
    { kind: 'h4', text: 'Four development modes' },
    { kind: 'note', text: 'More on this shortly.' },
    { kind: 'h3', text: 'Products — the unit of work' },
    { kind: 'h4', text: 'Why not simply call it a project' },
    { kind: 'h4', text: 'Not every product has a page' },
    { kind: 'note', text: 'More on this shortly.' },
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

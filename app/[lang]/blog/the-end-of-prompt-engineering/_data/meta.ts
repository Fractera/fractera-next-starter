import type { BlogMeta } from '../../_lib/types'

// Non-translatable fields. heroCaption moved to en.ts (it is translatable copy).
export const meta: BlogMeta = {
  slug: 'the-end-of-prompt-engineering',
  date: '2026-06-14',
  readingMinutes: 9,
  tags: ['Loop engineering', 'Agentic AI', 'AI engineering'],
  // Автора здесь нет намеренно: подпись берётся из настроек проекта (шаг 507).
  heroVideo: '/blog-media/boris-chernoy-post-1.mp4',
  heroPoster: '/blog-media/boris-chernoy-post-1.jpg',
  heroAspect: '714 / 466',
  // 🔒 СВОЙ ФАЙЛ, А НЕ АДРЕС ЧУЖОГО САЙТА (шаг 507). Здесь стоял абсолютный адрес
  // на домен платформы — и карточка в соцсетях у КАЖДОГО клиента грузила картинку
  // с чужого сервера, который вправе её убрать. Абсолютным адрес обязан быть, и
  // он им станет: `createContentPost` достраивает его адресом сайта из настроек.
  ogImage: '/blog-media/boris-chernoy-post-1.jpg',
}

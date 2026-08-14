import type { BlogMeta } from '../../_lib/types'

// Non-translatable fields. No self-hosted heroVideo: the hero is a YouTube embed
// (overridden in _components) that starts at the exact moment from the homepage link
// (t=4119s). ogImage/poster use the video thumbnail.
export const meta: BlogMeta = {
  slug: 'trillion-dollar-service-opportunity',
  date: '2026-06-22',
  readingMinutes: 8,
  tags: ['Elon Musk', 'Local business', 'Automation', 'No-show problem', 'CRM', 'Agentic Engineering'],
  // Автора здесь нет намеренно: подпись берётся из настроек проекта (шаг 507) —
  // иначе личная заметка основателя платформы подписывала бы блог клиента.

  heroPoster: 'https://img.youtube.com/vi/BYXbuik3dgA/maxresdefault.jpg',
  ogImage: 'https://img.youtube.com/vi/BYXbuik3dgA/maxresdefault.jpg',
}

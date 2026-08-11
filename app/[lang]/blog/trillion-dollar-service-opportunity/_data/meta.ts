import type { BlogMeta } from '../../_lib/types'

// Non-translatable fields. No self-hosted heroVideo: the hero is a YouTube embed
// (overridden in _components) that starts at the exact moment from the homepage link
// (t=4119s). ogImage/poster use the video thumbnail.
export const meta: BlogMeta = {
  slug: 'trillion-dollar-service-opportunity',
  date: '2026-06-22',
  readingMinutes: 8,
  tags: ['Elon Musk', 'Local business', 'Automation', 'No-show problem', 'CRM', 'Agentic Engineering'],
  author: { name: 'Roma Armstrong', role: 'Founder at Fractera.ai' },
  heroPoster: 'https://img.youtube.com/vi/BYXbuik3dgA/maxresdefault.jpg',
  ogImage: 'https://img.youtube.com/vi/BYXbuik3dgA/maxresdefault.jpg',
}

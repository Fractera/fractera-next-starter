import type { FooterPageCell } from '@/lib/pages/footer-page'

export const en: FooterPageCell = {
  title: 'Privacy Policy',
  description: 'How this site collects, uses and protects personal data.',
  keywords: 'privacy policy, personal data, GDPR',
  blocks: [
    { kind: 'h2', text: 'What belongs here' },
    { kind: 'p', text: 'Replace this placeholder with your own text. Until you do the page still works: it is fully static and indexable, and search engines receive its title, description and structured data exactly as they do for an article. Back to [%SITE%](/en).' },
    { kind: 'p', text: 'A privacy policy names what data you collect, why, how long you keep it, and how a visitor can have it removed.' },
  ],
}

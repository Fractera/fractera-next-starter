import type { FooterPageCell } from '@/lib/pages/footer-page'

// Taalcel: alleen vertalen wat nodig is. Een onvertaald veld komt via
// dezelfde resolver als de blogposts uit de Engelse basis.
export const nl: Partial<FooterPageCell> = {
  title: 'Cookiebeleid',
  description: 'Welke cookies deze site gebruikt en hoe je ze beheert.',
  keywords: 'cookiebeleid, cookies, toestemming',
  blocks: [
    { kind: 'h2', text: 'Wat hier hoort te staan' },
    { kind: 'p', text: 'Vervang deze placeholder door je eigen tekst. Tot je dat doet, werkt de pagina nog steeds: hij is volledig statisch en indexeerbaar, en zoekmachines ontvangen zijn titel, beschrijving en gestructureerde data precies zoals bij een artikel. Terug naar [%SITE%](/nl).' },
    { kind: 'p', text: 'Een cookiebeleid somt de cookies op die de site plaatst, waar elke cookie voor dient, en hoe toestemming wordt ingetrokken.' },
  ],
}

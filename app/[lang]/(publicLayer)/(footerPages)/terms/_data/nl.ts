import type { FooterPageCell } from '@/lib/pages/footer-page'

// Taalcel: alleen vertalen wat nodig is. Een onvertaald veld komt via
// dezelfde resolver als de blogposts uit de Engelse basis.
export const nl: Partial<FooterPageCell> = {
  title: 'Gebruiksvoorwaarden',
  description: 'De regels voor het gebruik van deze site en de diensten ervan.',
  keywords: 'gebruiksvoorwaarden, algemene voorwaarden',
  blocks: [
    { kind: 'h2', text: 'Wat hier hoort te staan' },
    { kind: 'p', text: 'Vervang deze placeholder door je eigen tekst. Tot je dat doet, werkt de pagina nog steeds: hij is volledig statisch en indexeerbaar, en zoekmachines ontvangen zijn titel, beschrijving en gestructureerde data precies zoals bij een artikel. Terug naar [%SITE%](/nl).' },
    { kind: 'p', text: 'Gebruiksvoorwaarden leggen vast wat je je bezoekers belooft en wat je van hen verwacht.' },
  ],
}

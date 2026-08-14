import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const de: Partial<FooterPageCell> = {
  title: 'Nutzungsbedingungen',
  description: 'Die Regeln für die Nutzung dieser Website und ihrer Dienste.',
  keywords: 'Nutzungsbedingungen, Allgemeine Geschäftsbedingungen',
  blocks: [
    { kind: 'h2', text: 'Was hierher gehört' },
    { kind: 'p', text: 'Ersetze diesen Platzhaltertext durch deinen eigenen Inhalt. Bis dahin funktioniert die Seite trotzdem: Sie ist vollständig statisch und indexierbar, und Suchmaschinen erhalten ihren Titel, ihre Beschreibung und ihre strukturierten Daten genau wie bei einem Artikel. Zurück zu [%SITE%](/de).' },
    { kind: 'p', text: 'Die Nutzungsbedingungen legen fest, was du deinen Besuchern versprichst und was du von ihnen erwartest.' },
  ],
}

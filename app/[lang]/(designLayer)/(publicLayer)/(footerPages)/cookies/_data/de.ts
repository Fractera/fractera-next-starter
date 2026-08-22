import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const de: Partial<FooterPageCell> = {
  title: 'Cookie-Richtlinie',
  description: 'Welche Cookies diese Website verwendet und wie du sie kontrollieren kannst.',
  keywords: 'Cookie-Richtlinie, Cookies, Einwilligung',
  blocks: [
    { kind: 'h2', text: 'Was hierher gehört' },
    { kind: 'p', text: 'Ersetze diesen Platzhaltertext durch deinen eigenen Inhalt. Bis dahin funktioniert die Seite trotzdem: Sie ist vollständig statisch und indexierbar, und Suchmaschinen erhalten ihren Titel, ihre Beschreibung und ihre strukturierten Daten genau wie bei einem Artikel. Zurück zu [%SITE%](/de).' },
    { kind: 'p', text: 'Eine Cookie-Richtlinie listet die von der Website gesetzten Cookies auf, wofür jedes davon dient und wie die Einwilligung widerrufen wird.' },
  ],
}

import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const de: Partial<FooterPageCell> = {
  title: 'Datenschutzerklärung',
  description: 'Wie diese Website personenbezogene Daten erhebt, verwendet und schützt.',
  keywords: 'Datenschutzerklärung, personenbezogene Daten, DSGVO',
  blocks: [
    { kind: 'h2', text: 'Was hierher gehört' },
    { kind: 'p', text: 'Ersetze diesen Platzhaltertext durch deinen eigenen Inhalt. Bis dahin funktioniert die Seite trotzdem: Sie ist vollständig statisch und indexierbar, und Suchmaschinen erhalten ihren Titel, ihre Beschreibung und ihre strukturierten Daten genau wie bei einem Artikel. Zurück zu [%SITE%](/de).' },
    { kind: 'p', text: 'Eine Datenschutzerklärung nennt, welche Daten du erhebst, warum, wie lange du sie aufbewahrst und wie ein Besucher ihre Löschung veranlassen kann.' },
  ],
}

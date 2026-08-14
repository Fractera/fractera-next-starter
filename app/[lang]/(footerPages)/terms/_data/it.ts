import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const it: Partial<FooterPageCell> = {
  title: 'Termini di servizio',
  description: 'Le regole per utilizzare questo sito e i suoi servizi.',
  keywords: 'termini di servizio, termini e condizioni',
  blocks: [
    { kind: 'h2', text: 'Cosa dovrebbe esserci qui' },
    { kind: 'p', text: "Sostituisci questo testo segnaposto con i tuoi contenuti. Nel frattempo la pagina funziona comunque: è completamente statica e indicizzabile, e i motori di ricerca ricevono il suo titolo, la descrizione e i dati strutturati esattamente come per un articolo. Torna a [%SITE%](/it)." },
    { kind: 'p', text: 'I termini di servizio stabiliscono cosa prometti ai tuoi visitatori e cosa ti aspetti da loro.' },
  ],
}

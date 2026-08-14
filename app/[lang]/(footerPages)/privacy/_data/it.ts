import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const it: Partial<FooterPageCell> = {
  title: 'Informativa sulla privacy',
  description: 'Come questo sito raccoglie, utilizza e protegge i dati personali.',
  keywords: 'informativa sulla privacy, dati personali, GDPR',
  blocks: [
    { kind: 'h2', text: 'Cosa dovrebbe esserci qui' },
    { kind: 'p', text: "Sostituisci questo testo segnaposto con i tuoi contenuti. Nel frattempo la pagina funziona comunque: è completamente statica e indicizzabile, e i motori di ricerca ricevono il suo titolo, la descrizione e i dati strutturati esattamente come per un articolo. Torna a [%SITE%](/it)." },
    { kind: 'p', text: "Un'informativa sulla privacy indica quali dati raccogli, per quale motivo, per quanto tempo li conservi e come un visitatore può richiederne la rimozione." },
  ],
}

import type { FooterPageCell } from '@/lib/pages/footer-page'

// Komórka językowa: tłumaczy się tylko to, co potrzebne. Nieprzetłumaczone
// pole zostanie wzięte z angielskiej bazy przez ten sam resolver, co posty bloga.
export const pl: Partial<FooterPageCell> = {
  title: 'Polityka plików cookie',
  description: 'Jakich plików cookie używa ta strona i jak nimi zarządzać.',
  keywords: 'polityka plików cookie, cookies, zgoda',
  blocks: [
    { kind: 'h2', text: 'Co powinno się tu znaleźć' },
    { kind: 'p', text: 'Zastąp ten przykładowy tekst własną treścią. Do tego czasu strona nadal działa: jest w pełni statyczna i indeksowalna, a wyszukiwarki otrzymują jej tytuł, opis i dane strukturalne dokładnie tak, jak w przypadku artykułu. Powrót do [%SITE%](/pl).' },
    { kind: 'p', text: 'Polityka plików cookie wymienia pliki cookie ustawiane przez stronę, do czego każdy z nich służy i jak wycofać zgodę.' },
  ],
}

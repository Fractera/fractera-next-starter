import type { FooterPageCell } from '@/lib/pages/footer-page'

// Komórka językowa: tłumaczy się tylko to, co potrzebne. Nieprzetłumaczone
// pole zostanie wzięte z angielskiej bazy przez ten sam resolver, co posty bloga.
export const pl: Partial<FooterPageCell> = {
  title: 'Polityka prywatności',
  description: 'Jak ta strona zbiera, wykorzystuje i chroni dane osobowe.',
  keywords: 'polityka prywatności, dane osobowe, RODO',
  blocks: [
    { kind: 'h2', text: 'Co powinno się tu znaleźć' },
    { kind: 'p', text: 'Zastąp ten przykładowy tekst własną treścią. Do tego czasu strona nadal działa: jest w pełni statyczna i indeksowalna, a wyszukiwarki otrzymują jej tytuł, opis i dane strukturalne dokładnie tak, jak w przypadku artykułu. Powrót do [%SITE%](/pl).' },
    { kind: 'p', text: 'Polityka prywatności określa, jakie dane zbierasz, po co, jak długo je przechowujesz i jak odwiedzający może zażądać ich usunięcia.' },
  ],
}

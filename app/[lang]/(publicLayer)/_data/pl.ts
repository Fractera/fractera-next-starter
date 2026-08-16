import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const pl: Partial<HomeCell> = {
  title: 'To starter Twojej aplikacji',
  description: 'Działa na Twoim własnym serwerze i nie odpowiada przed nikim innym. Nadaj jej nazwę w panelu sterowania — ta linia zniknie.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Infrastruktura inżynierii agentowej' },
  {
    kind: 'metrics',
    items: [
      { value: '×4', label: 'tańsza budowa' },
      { value: '×9', label: 'szybszy start' },
      { value: '×100', label: 'bardziej niezawodne na produkcji' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: '82 języki', tone: 'reach' },
      { label: 'SEO wbudowane', tone: 'reach' },
      { label: 'Własna baza danych', tone: 'data' },
      { label: 'Wyszukiwanie wektorowe', tone: 'data' },
      { label: 'Graf wiedzy', tone: 'data' },
      { label: 'Własne przechowywanie plików', tone: 'data' },
      { label: 'Autoryzacja', tone: 'access' },
      { label: 'Ról: {roles}', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Architektura Fractera', tone: 'code' },
      { label: '100+ więcej', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    title: 'Jak to działa',
    note: 'Od pustego serwera do twojego kodu na produkcji. Wszystko poniżej działa na sprzęcie, który należy do ciebie.',
    steps: [
      { title: 'Postaw serwer', text: 'Wdróż go robotem instalacyjnym Fractera. Dostajesz system operacyjny, szablon startowy, panel sterowania, magazyny i autoryzację — zainstalowane i połączone ze sobą.' },
      { title: 'Pracuj tam, gdzie zwykle', text: 'Zsynchronizuj z GitHubem, potem sklonuj na własną maszynę i uruchom Claude Code albo Codex. Dane nadal płyną z twojego serwera; kod działa w twoim IDE.' },
      { title: 'Wyślij — wdroży się samo', text: 'Skończ pracę na lokalnej maszynie i wyślij projekt na GitHub. To natychmiast uruchamia nowe wdrożenie na twoim własnym serwerze — a odwiedzający widzi nowy projekt.' },
    ],
  },
  {
    kind: 'panel',
    title: 'Jak zacząć',
    children: [
      { kind: 'p', text: 'Sześć kroków od pustego serwera do własnego kodu w produkcji. Wszystko poniżej jest już zainstalowane — włączasz to, a nie budujesz.' },
      {
        kind: 'olist',
        items: [
          'Otwórz panel sterowania — wszystko o tym serwerze konfiguruje się tam. [Panel sterowania]({admin}/{lang})',
          'Wybierz języki, w jakich Twoja aplikacja będzie dostępna. [Języki]({admin}/{lang}/languages)',
          'Użyj ustawień, aby opisać swój projekt: nazwę, opis, logo, SEO. [Ustawienia aplikacji]({admin}/{lang}/app-settings)',
          'Połącz GitHub i wyślij kod serwera do swojego repozytorium. [GitHub]({admin}/{lang}/github)',
          'Sklonuj to repozytorium na własną maszynę, pracuj tam i wysyłaj zmiany z powrotem.',
          'Naciśnij Wdróż w panelu — serwer pobiera Twój commit i sam się przebudowuje. [Wdrożenia]({admin}/{lang}/deployments)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'warn',
    title: 'Zalecane przed rozpoczęciem',
    children: [
      { kind: 'p', text: 'Żadne z nich niczego nie blokuje. Oba oszczędzają powtórną pracę: pierwsze włącza myślącą połowę produktu, drugie zmienia adres każdej strony.' },
      {
        kind: 'list',
        items: [
          '**Klucz OpenAI.** Bez klucza Quiz nie zadaje pytań, a bez Quizu nie ma czym opisać Twoich przypadków użycia — więc agent programujący odmawia budowy. Dlatego panel traktuje klucz jako CZERWONY wymóg, dopóki nie powstaną pierwsze przypadki, a potem jako bursztynową sugestię: strona działa i bez niego, puste zostają tylko wyszukiwanie wektorowe i graf wiedzy. Klucz wpisuje się raz, a koszt trafia bezpośrednio do dostawcy Twojego modelu. [Klucz OpenAI]({admin}/{lang}/openai)',
          '**Twoja własna domena.** Dopóki strona istnieje pod adresem liczbowym, nie ma certyfikatu ani instalowalnej aplikacji — przeglądarka daje to tylko przy bezpiecznym połączeniu. Przejście na domenę zmienia adres każdej strony, więc taniej zrobić to, zanim zostaną zaindeksowane. [Domena]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Przed jakimkolwiek kodem',
    title: 'Quiz — siedem pytań zamiast pustej strony',
    children: [
      { kind: 'p', text: 'Najdroższy błąd projektu popełnia się przed pierwszą linią kodu: buduje się nie to, co trzeba. Nie przez złe budowanie, ale dlatego, że «od czego zacząć» trudno odpowiedzieć samemu. Quiz zamienia to w rozmowę: Ty odpowiadasz, model pyta dalej, i z tego wyrasta lista scenariuszy, z której potem buduje się projekt.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'Zalążek' }, { kind: 'p', text: 'Siedem krótkich pytań: czym jest produkt, dla kogo jest, co osoba powinna z niego wynieść. Odpowiadaj własnymi słowami — dyktowanie działa. Wszystko dalej wyrasta stąd, więc kilka zdań daje wyraźnie lepszy wynik niż kilka słów.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Rozmowa' }, { kind: 'p', text: 'Potem po jednym pytaniu naraz, w Twoim języku. Jest autoquiz: model zadaje pięć nowych pytań i sam na nie odpowiada, pogłębiając opis — ale wszystko, co wymyślił w Twoim imieniu, jest oznaczone jako «Założenie», a Ty to poprawiasz. Domysł podany za fakt wypłynąłby później, w gotowych scenariuszach.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Scenariusze' }, { kind: 'p', text: 'Rozmowa jest syntetyzowana w ponumerowane przypadki: kto przychodzi, co robi, co musi być prawdą na końcu. Czytasz i zatwierdzasz każdy osobno. Nieprzeczytany przypadek pozostaje domysłem modelu.' }] },
        ],
      },
      { kind: 'quote', text: 'I to nie jest rada, lecz reguła produktu: dopóki choć jeden przypadek jest niezatwierdzony, panel utrzymuje włączony alarm, a agent programujący odmawia budowy. Budowanie na nieprzeczytanym domyśle kosztuje więcej niż niebudowanie wcale.' },
      { kind: 'cta', text: 'Quiz — siedem pytań zamiast pustej strony', href: '{admin}/{lang}/doc-use-cases', label: 'Otwórz Quiz' },
    ],
  },
  {
    kind: 'panel',
    title: 'Czym jest ten projekt technicznie',
    children: [
      { kind: 'p', text: 'To nie jest gotowa strona, lecz architektura Fractera: ten sam szkielet dźwiga zarówno landing page, jak i duże SaaS czy wielopoziomową automatyzację. Rozwój nie wymaga przepisywania — warstwy danych, autoryzacji i panelu są już rozdzielone, a każda zaprojektowana pod obciążenie, którego jeszcze nie masz.' },
      { kind: 'p', text: 'Kod nie jest pisany tutaj. Programista klonuje repozytorium na własną maszynę i pracuje z Claude Code, który czyta instrukcje i umiejętności żyjące wewnątrz projektu: ustalają one zasady, a automatyczne kontrole nie pozwalają ich złamać. Serwer tylko odbiera wynik i się przebudowuje.' },
      { kind: 'p', text: 'Szkielet jest zbudowany pod projekt, który przekroczy milion linii: każda encja ma własny folder, wspólna warstwa nie rośnie wraz z ich liczbą, a trasy i uprawnienia są deklarowane tam, gdzie są egzekwowane. Stabilność nie jest tu obietnicą, lecz konsekwencją — nowa strona niczego nie dodaje do centralnego rdzenia.' },
    ],
  },
  {
    kind: 'noBill',
    items: [
      { vendor: 'Vercel', text: 'nie płacisz' },
      { vendor: 'Neon', text: 'nie płacisz' },
      { vendor: 'Clerk', text: 'nie płacisz' },
    ],
    title: 'Nie płacisz nikomu',
    text: 'Od nikogo nie zależysz. Projekt jest w całości twój.',
  },
],
}

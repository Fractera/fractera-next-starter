import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const pl: Partial<HomeCell> = {
  title: 'To starter Twojej aplikacji',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'Twój serwer, Twój kod: autoryzacja, baza danych, magazyn i wyszukiwanie wektorowe już połączone. Zbuduj stronę docelową lub SaaS w 82 językach.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Infrastruktura inżynierii agentowej',
    title: 'To starter Twojej aplikacji',
    description:
      'Wszystko jest już zainstalowane i połączone ze sobą — autoryzacja, własna baza danych, magazyn plików, wyszukiwanie wektorowe i sto innych narzędzi, ułożonych tak, by agent kodujący znalazł je bez powtarzania. Zbuduj stronę docelową, SaaS albo automatyzację, która nigdy nie śpi, w każdym z 82 języków, na szkielecie skrojonym pod projekt, który przekroczy milion linii. Około **dziewięć razy szybciej** niż samodzielne złożenie tego samego zestawu — i nic tutaj nie dzwoni na zewnątrz: żadnego dostawcy, żadnej subskrypcji, nikogo, kogo trzeba pytać o zgodę. Serwer jest Twój, kod jest Twój, **w stu procentach**.',
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Weź za darmo i skaluj' },
    image: 'homePage',
    imageAlt: 'Szablon startowy SaaS',
  },
  { kind: 'projectTypeMarquee' },
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
      { label: 'Open Code', tone: 'code' },
      { label: '82 języki', tone: 'reach' },
      { label: 'SEO wbudowane', tone: 'reach' },
      { label: 'AIO przeglądanie agentowe', tone: 'reach' },
      { label: 'Własna baza danych', tone: 'data' },
      { label: 'Wyszukiwanie wektorowe', tone: 'data' },
      { label: 'Graf wiedzy', tone: 'data' },
      { label: 'Własne przechowywanie plików', tone: 'data' },
      { label: 'Autoryzacja', tone: 'access' },
      { label: 'Ról: {roles}', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Architektura Fractera', tone: 'code' },
      { label: '100+ więcej', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Proces',
    title: 'Jak to działa',
    note: 'Od pustego serwera do twojego kodu na produkcji. Wszystko poniżej działa na sprzęcie, który należy do ciebie.',
    steps: [
      { title: 'Postaw serwer', text: 'Wdróż go [robotem instalacyjnym](https://www.fractera.ai/deployments/vps) Fractera. Dostajesz system operacyjny, szablon startowy, panel sterowania, magazyny i autoryzację — zainstalowane i połączone ze sobą.' },
      { title: 'Pracuj tam, gdzie zwykle', text: 'Zsynchronizuj z GitHubem, potem sklonuj na własną maszynę i uruchom Claude Code albo Codex. Dane nadal płyną z twojego serwera; kod działa w twoim IDE.' },
      { title: 'Wyślij — wdroży się samo', text: 'Skończ pracę na lokalnej maszynie i wyślij projekt na GitHub. To natychmiast uruchamia nowe wdrożenie na twoim własnym serwerze — a odwiedzający widzi nowy projekt.' },
    ],
  },
  {
    kind: 'cards',
    badge: 'Start',
    title: 'Jak zacząć',
    note: 'Wszystko poniżej jest już zainstalowane — włączasz to, a nie budujesz. Po lewej droga; po prawej to, co oszczędza przejście jej dwa razy.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Siedem kroków od pustego serwera' },
          { kind: 'p', text: 'Uruchom [robota instalacyjnego](https://www.fractera.ai/deployments/vps), aby otrzymać ten projekt.' },
          {
            kind: 'olist',
            items: [
          'Otwórz panel sterowania — wszystko o tym serwerze konfiguruje się tam. [Panel sterowania]({admin}/{lang})',
          'Wybierz języki, w jakich Twoja aplikacja będzie dostępna. [Języki]({admin}/{lang}/languages)',
          'Użyj ustawień, aby opisać swój projekt: nazwę, opis, logo, SEO. [Ustawienia aplikacji]({admin}/{lang}/app-settings)',
          'Połącz GitHub i wyślij kod serwera do swojego repozytorium. [GitHub]({admin}/{lang}/github)',
          'Sklonuj to repozytorium na własną maszynę, pracuj tam i wysyłaj zmiany z powrotem.',
          'Przenieś plik środowiska `.env.local` na swój komputer — git nigdy go nie przewozi, a bez niego lokalna kopia się nie uruchomi. [Zmienne środowiskowe]({admin}/{lang}/env)',
          'Naciśnij Wdróż w panelu — serwer pobiera Twój commit i sam się przebudowuje. [Wdrożenia]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Zalecane przed rozpoczęciem' },
          { kind: 'p', text: 'Nic z tego niczego nie blokuje. Wszystkie trzy oszczędzają poprawki.' },
          {
            kind: 'list',
            items: [
              '**Klucz OpenAI.** Bez niego Quiz nie zadaje pytań, a bez przypadków agent programujący odmawia budowania. Strona nadal działa — puste zostają tylko wyszukiwanie wektorowe i graf wiedzy. Wpisywany raz; koszt idzie wprost do twojego dostawcy modelu. [Klucz OpenAI]({admin}/{lang}/openai)',
              '**Własna domena.** Pod adresem liczbowym nie ma ani certyfikatu, ani instalowalnej aplikacji — przeglądarka daje je tylko po bezpiecznym połączeniu. Późniejsza przeprowadzka zmienia adres każdej strony, więc taniej zrobić to przed indeksacją. [Domena]({admin}/{lang}/domain)',
              '**Rozszerzenie Claude dla Chrome.** Bez niego agent widzi tylko kod: błędów konsoli, zachowania bez JavaScriptu ani rzeczywistego wyglądu gotowej strony nie ma nigdzie w źródłach. Z nim sam otwiera stronę i naprawia to, co jest, a nie to, co zgadł. [Narzędzia programistyczne]({admin}/{lang}/dev-tools)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Przed jakimkolwiek kodem',
    title: 'Quiz — siedem pytań zamiast pustej strony',
    note: 'Najdroższy błąd projektu popełnia się przed pierwszą linią kodu: buduje się nie to, co trzeba. Nie przez złe budowanie, ale dlatego, że «od czego zacząć» trudno odpowiedzieć samemu. Quiz zamienia to w rozmowę: Ty odpowiadasz, model pyta dalej, i z tego wyrasta lista scenariuszy, z której potem buduje się projekt.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'Zalążek' }, { kind: 'p', text: 'Siedem krótkich pytań: czym jest produkt, dla kogo jest, co osoba powinna z niego wynieść. Odpowiadaj własnymi słowami — dyktowanie działa. Wszystko dalej wyrasta stąd, więc kilka zdań daje wyraźnie lepszy wynik niż kilka słów.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Rozmowa' }, { kind: 'p', text: 'Potem po jednym pytaniu naraz, w Twoim języku. Jest autoquiz: model zadaje pięć nowych pytań i sam na nie odpowiada, pogłębiając opis — ale wszystko, co wymyślił w Twoim imieniu, jest oznaczone jako «Założenie», a Ty to poprawiasz. Domysł podany za fakt wypłynąłby później, w gotowych scenariuszach.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Scenariusze' }, { kind: 'p', text: 'Rozmowa jest syntetyzowana w ponumerowane przypadki: kto przychodzi, co robi, co musi być prawdą na końcu. Czytasz i zatwierdzasz każdy osobno. Nieprzeczytany przypadek pozostaje domysłem modelu.' }] },
    ],
  },
  { kind: 'statement', text: 'I to nie jest rada, lecz reguła produktu: dopóki choć jeden przypadek jest niezatwierdzony, panel utrzymuje włączony alarm, a agent programujący odmawia budowy. Budowanie na nieprzeczytanym domyśle kosztuje więcej niż niebudowanie wcale.' },
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Weź za darmo i skaluj' },
  {
    kind: 'cards',
    badge: 'Architektura',
    title: 'Czym jest ten projekt technicznie',
    note: 'Trzy rzeczy, które warto wiedzieć przed budowaniem: czym jest ten szkielet, gdzie naprawdę pisze się kod i co się stanie, gdy projekt przekroczy pierwsze sto stron.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'To nie jest gotowa strona, lecz architektura Fractera: ten sam szkielet dźwiga zarówno landing page, jak i duże SaaS czy wielopoziomową automatyzację. Rozwój nie wymaga przepisywania — warstwy danych, autoryzacji i panelu są już rozdzielone, a każda zaprojektowana pod obciążenie, którego jeszcze nie masz.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Kod nie jest pisany tutaj. Programista klonuje repozytorium na własną maszynę i pracuje z Claude Code, który czyta instrukcje i umiejętności żyjące wewnątrz projektu: ustalają one zasady, a automatyczne kontrole nie pozwalają ich złamać. Serwer tylko odbiera wynik i się przebudowuje.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Szkielet jest zbudowany pod projekt, który przekroczy milion linii: każda encja ma własny folder, wspólna warstwa nie rośnie wraz z ich liczbą, a trasy i uprawnienia są deklarowane tam, gdzie są egzekwowane. Stabilność nie jest tu obietnicą, lecz konsekwencją — nowa strona niczego nie dodaje do centralnego rdzenia.' }] },
    ],
  },
  {
    kind: 'quote',
    lead: 'Gotowe na wysokie obciążenie',
    text:
      'Ukryta rzeczywistość vibe codingu: większość projektu powstaje bez myśli o wysokim obciążeniu, o oszczędzaniu zapytań do bazy danych, o buforowaniu. Nie dlatego, że programiści o tym nie wiedzą — ale dlatego, że utrzymanie tego standardu wewnątrz frameworka jest naprawdę trudne. Zbyt wiele drobiazgów po cichu spycha stronę z generowania statycznego do renderowania dynamicznego. A różnica to nie pięć ani dziesięć procent: w niektórych przypadkach obciążenie waszego serwera rośnie tysiąckrotnie, a razem z nim rośnie rachunek za serwery i platformy. Fractera jest zbudowana na długim własnym doświadczeniu: ponad trzydzieści lat w tworzeniu stron. Wszystko, co dotyczy wysokiego obciążenia, optymalizacji dla wyszukiwarek i oszczędzania na bazach danych, jest zapisane w DNA projektu. To jego szkielet, to jego siła życiowa. I jest wasza za darmo.',
    cite: 'Roma Armstrong · założyciel Fractery',
  },
  {
    kind: 'noBill',
    badge: 'Niezależność',
    heading: 'W pełni niezależna przestrzeń',
    note: 'W zwykłym projekcie to trzy cudze usługi: ich cenniki, ich zasady i ich zgoda na to, by twój projekt działał. Tutaj wszystkie trzy żyją na twoim serwerze.',
    items: [
      { vendor: 'Vercel', text: 'nie płacisz', badge: { label: 'hosting', tone: 'reach' } },
      { vendor: 'Neon', text: 'nie płacisz', badge: { label: 'baza danych', tone: 'data' } },
      { vendor: 'Clerk', text: 'nie płacisz', badge: { label: 'autoryzacja', tone: 'access' } },
    ],
    title: 'Nie płacisz nikomu',
    text: 'Od nikogo nie zależysz. Projekt jest w całości twój.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'languageMarquee',
    title: 'Osiemdziesiąt dwa języki — gotowe, zanim będą potrzebne',
    note: 'Wszystkie są już w produkcie: włączasz te, którymi mówi Twój rynek. Generowanie statyczne, optymalizacja pod wyszukiwarki i pod AI, buforowanie danych i gotowość na duże obciążenie utrzymują wydajność na szczycie branży — i utrzymują ją tak samo, czy pracujesz w jednym języku, w kilku, czy we wszystkich osiemdziesięciu dwóch.',
  },
],
}

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
  // 🔒 ЛЕНТА НАПРАВЛЕНИЙ — ПЕРВОЕ, ЧТО ИДЁТ ЗА ПЕРВЫМ ЭКРАНОМ (владелец
  // 2026-08-22). Человек, только что прочитавший, ЧТО это, сразу видит, ЧТО этим
  // строят: двадцать два направления проходят перед ним прежде любых доводов.
  // Она стоит вне ленты страницы, во всю ширину, вместе с рядом ярлыков.
  { kind: 'projectTypeMarquee' },
  // 🔒 РЯД МЕР УШЁЛ ВНИЗ, под виджет безопасности (владелец 2026-08-22). Три
  // множителя — это довод, а доводу место после того, как названа ценность:
  // сначала «безопасность встроена в основу», потом «во сколько раз дешевле»,
  // и только потом «как это работает».
  //
  // Механически: ряда мер больше нет среди поднятых видов (`LEAD_KINDS` в
  // `_data/index.ts`), поэтому он рисуется в ленте страницы — первым её блоком.
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
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
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
    kind: 'problemSolution',
    badge: 'Przeprowadzka jest łatwa',
    title: 'Jak przenieść swój projekt na architekturę Fractery',
    note: 'Twój projekt już działa — na Vercelu albo gdzie indziej. I płacisz: za hosting, za bazę danych, za przechowywanie obrazków, za autoryzację, za pocztę. Każda usługa wystawia rachunek osobno, i każdy rachunek rośnie razem z tobą. Przeprowadzka wydaje się nie do udźwignięcia — a nie jest: Fractera rozbierze twój projekt i złoży go na nowo na własnej architekturze, na twoim serwerze, gdzie to wszystko już stoi i nic nie kosztuje ponad.',
    demandLabel: 'Co robisz ty',
    answerLabel: 'Dlaczego to działa na Fracterze',
    items: [
      {
        title: 'Postawić Fracterę',
        demand: 'Kup serwer — od trzech euro miesięcznie. Kup domenę — od dolara rocznie. Uruchom robota instalatora i idź za nim: resztę zrobi sam.',
        answer: 'Trzy euro to cały twój rachunek za hosting. Nie za pierwszy miesiąc i nie «do przekroczenia limitu», tylko w ogóle. Baza danych, magazyn obrazków, logowanie hasłem i poczta już stoją na twoim serwerze i mieszczą się w tych trzech euro. Nie zostaje nic do opłacania osobno.',
      },
      {
        title: 'Wybrać tryb przeprowadzki',
        demand: 'W panelu otwórz zakładkę «Przeprowadzka na Fracterę» i podaj adres swojego repozytorium. Na czas przeprowadzki lepiej trzymać je publiczne — twoje i to od Fractery; zamknąć możesz w każdej chwili. Zapisz tryb.',
        answer: 'To jedyne ustawienie, którego dotykasz ręką. Od tego miejsca projekt wie, że się przeprowadza, i zachowuje się odpowiednio: nie buduje od pustej strony, tylko rozbiera to, co już napisałeś.',
      },
      {
        title: 'Powiedzieć agentowi',
        demand: 'Otwórz projekt w swoim edytorze, na swojej maszynie, tam gdzie zwykle pracujesz. Uruchom go i powiedz agentowi, że zaczynasz przeprowadzkę. Zwykłymi słowami, tak jak powiedziałbyś koledze.',
        answer: 'Dalej sam czyta twój stary projekt: jaka architektura, jakie biblioteki, co od czego zależy. Nie musisz niczego tłumaczyć ani pamiętać — on patrzy w kod, a nie w twoją pamięć.',
      },
      {
        title: 'Dostać plan w krokach',
        demand: 'Nic. Popatrz, co wyszło: wielkie zadanie «przenieść projekt» rozłożone jest na kroki, każdy ze swoim numerem i celem.',
        answer: 'Przeprowadzka przestaje straszyć, bo przestaje być jedną bryłą. Widzisz listę: co zrobione, co idzie teraz, co będzie dalej. Nie ma gdzie ugrzęznąć w połowie i zgubić wątek.',
      },
      {
        title: 'Postawić szkielet',
        demand: 'Odpowiedz na pytania o uprawnienia: kto co będzie mógł zobaczyć i zmienić w twojej aplikacji. Jest ich niewiele i wszystkie są o twoim produkcie, nie o technice.',
        answer: 'Najpierw staje szkielet: adresy stron, tabele, logowanie, repozytoria — publiczne na kod i zamknięte na to, czego pokazywać nie wolno. Szkielet stawia się raz, a projekt rośnie w środku, zamiast być przerabiany przy każdej nowej funkcji.',
      },
      {
        title: 'Dołożyć możliwości',
        demand: 'Idź po krokach. Jeden krok, jedna możliwość: strona, formularz, płatność, listy. Odhaczaj zrobione i dokładaj nowe, kiedy przyjdzie ci do głowy.',
        answer: 'Każdy krok jest sprawdzany i pokazuje ci się, że działa: nie «kompilacja przeszła», tylko żywa strona z twoim tekstem. Dlatego zawsze wiesz, gdzie jesteś, i nigdy nie zostajesz z projektem, który jest «w zasadzie gotowy».',
      },
      {
        title: 'Przenieść dane',
        demand: 'Daj agentowi dostęp do swoich baz. Przeniesie to, co już się nazbierało: użytkowników, zamówienia, teksty, obrazki.',
        answer: 'To ostatni krok. Po nim masz na własnym serwerze pełną, działającą kopię projektu — z twoimi danymi, twoimi ludźmi i twoją domeną. Stare rachunki można wypowiedzieć: od teraz płacisz za serwer i domenę, i za nic więcej.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Osiemdziesiąt dwa języki — gotowe, zanim będą potrzebne',
    note: 'Wszystkie są już w produkcie: włączasz te, którymi mówi Twój rynek. Generowanie statyczne, optymalizacja pod wyszukiwarki i pod AI, buforowanie danych i gotowość na duże obciążenie utrzymują wydajność na szczycie branży — i utrzymują ją tak samo, czy pracujesz w jednym języku, w kilku, czy we wszystkich osiemdziesięciu dwóch.',
  },
],
  faq: [
    {
      q: 'Ile to kosztuje i czy są ukryte opłaty?',
      a: 'Ukrytych opłat nie ma, bo nie ma komu płacić: platforma to otwarty kod, a wszystko, co postawisz i z czego korzystasz, należy do ciebie w stu procentach. Twoje wydatki to własny serwer, domena i chmurowa sztuczna inteligencja, jeśli z niej korzystasz; te liczysz sam i płacisz wprost dostawcy. My nie bierzemy ani abonamentu, ani procentu, ani opłaty za użytkownika.',
    },
    {
      q: 'Na czym polega główna przewaga?',
      a: 'Na niezawodności — tu postawiono stawkę. Sposobów na szybkie sklecenie aplikacji jest dziś wiele i lepiej nie mieć złudzeń: niemal wszystkie zbudowano tak, żebyś płacił przede wszystkim za własne błędy. Wydajna aplikacja opłaca się tylko tobie; temu, kto sprzedaje ci usługi, opłaca się, żebyś kupował i opłacał jak najwięcej osobnych. Najdroższe zaczyna się później: złamanie prawa i kary za to, gdzie leżą dane, nieprzewidziane wyłączenia, sankcje i po prostu utrata twoich danych. Fractera zamyka to tym, że wszystko wymienione stoi na twoim serwerze.',
    },
    {
      q: 'A jeśli potrzebuję więcej?',
      a: 'Główne narzędzie masz swoje — Claude Code, Codex albo inne — i działa na twojej maszynie. Projekt skaluje się daleko: szkielet jest skrojony na miliony linii i pozostaje wydajny. A jeśli potrzebna jest koncepcyjna zmiana architektury na poziomie panelu sterowania albo budowanie aplikacji nadal sprawia trudność — wyślij zgłoszenie na admin@fractera.ai, a odezwie się programista i zaproponuje rozwiązanie.',
    },
  ],
}

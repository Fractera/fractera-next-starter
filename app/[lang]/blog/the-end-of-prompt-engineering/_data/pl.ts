import type { BlogOverride } from '../../_lib/types'

// Tłumaczenie na polski. Ton autora: bezpośredni, bez tonu akademickiego,
// zwrócony do czytelnika.
// Terminy produktowe i nazwy własne nie są tłumaczone (Claude Code,
// Anthropic, CI, LLM).
// Diagramy zostały przetłumaczone razem z tekstem: diagram po angielsku
// w polskim artykule czyta się jak tłumaczenie do połowy.

const POST_1_LINEAR = `piszesz prompt  ─▶  AI pisze kod  ─▶  znajdujesz błąd  ─▶  poprawiasz prompt  ─┐
     ▲                                                                          │
     └──────────────────────────  znowu ręcznie  ◀─────────────────────────────────┘`

const POST_1_LOOP = `ustalasz cel
     │
     ▼
AI pisze kod  ─▶  CI uruchamia wszystkie testy  ─▶  zielono?  ─▶  ✦ dostarczone
     ▲                      │
     │                      ▼  (czerwono)
     └──  AI czyta logi i ponownie pyta samo siebie`

export const pl: BlogOverride = {
  title: 'Inżynieria promptów nie żyje. Niech żyje inżynieria pętli.',
  subtitle:
    'Dlaczego szef zespołu Claude Code w Anthropic właśnie ogłosił koniec ery „szeptacza AI” — i co jest dalej.',
  description:
    'Boris Cherny, który kieruje Claude Code w Anthropic, mówi, że już nie pisze promptów do Claude — pisze pętle. Wewnątrz śmierci inżynierii promptów i narodzin inżynierii pętli: agentowe przepływy pracy AI, autonomiczne, samokorygujące się agenty, dlaczego sędzia liczy się bardziej niż prompt, i jak ta sama pętla jest wpięta w przestrzeń roboczą, którą posiadasz — bramki sprawdzane maszynowo w repozytorium, pamięć, która przeżywa sesję, i panel sterowania, który buduje i potrafi cofnąć.',
  excerpt:
    'Inżynier kierujący Claude Code w Anthropic właśnie przyznał, że już nie promptuje modelu — pisze pętle, które robią to za niego. Dlatego to kończy erę „szeptacza AI”, i jak z tego zrobiliśmy architekturę produkcyjną.',
  heroCaption: 'Post na LinkedIn, który to wywołał — Boris Cherny o pisaniu pętli, nie promptów.',
  blocks: [
    { kind: 'h2', text: 'Cytat, który rozbił iluzję' },
    {
      kind: 'p',
      text: 'Kilka dni temu jedno zdanie **Borisa Cherny’ego** — inżyniera kierującego rozwojem **Claude Code** w **Anthropic** — po cichu wstrząsnęło środowiskiem programistów.',
    },
    {
      kind: 'p',
      text: 'Na publicznym panelu Cherny uchylił rąbka tajemnicy, jak naprawdę pracują ze swoimi własnymi modelami ludzie budujący najbardziej wyrafinowaną AI do programowania na świecie. To, co powiedział, nie tylko podważyło status quo — ogłosiło całą powstającą dyscyplinę przestarzałą:',
    },
    {
      kind: 'quote',
      text: 'Już nie promptuję Claude. Mam uruchomione pętle, które promptują Claude i same decydują, co robić dalej. Moją pracą jest pisanie pętli.',
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: 'Niech to do ciebie dotrze.' },
    {
      kind: 'p',
      text: 'Człowiek z obiema rękami na kierownicy najlepszego modelu programistycznego na świecie mówi ci, że puścił kierownicę. Nie siedzi w oknie czatu, szlifując idealny akapit instrukcji. Pisze kod, który zmusza AI do rozmowy z samym sobą, oceny własnych błędów i naprawiania ich wewnątrz zamkniętego, autonomicznego obiegu. Buduje maszynę, która prowadzi model — a potem pozwala jej jechać.',
    },
    {
      kind: 'p',
      text: 'Jeśli nadal spędzasz dni na dopieszczaniu promptów, żeby wyciągnąć z LLM właściwy fragment kodu, jego przekaz jest brutalnie jasny: **optymalizujesz świat, którego już nie ma.**',
    },

    { kind: 'h2', text: 'Zmiana paradygmatu: od mikrozarządzania do architektury systemów' },
    {
      kind: 'p',
      text: 'Żeby zobaczyć, dlaczego to zmiana tektoniczna, spójrz, jak nasza relacja z generatywną AI zmieniła się w zaledwie parę lat.',
    },
    { kind: 'h3', text: 'Faza 1 — prompt liniowy (człowiek jako wąskie gardło)' },
    {
      kind: 'p',
      text: 'Do niedawna cała branża była opętana **inżynierią promptów**. Traktowaliśmy LLM-y jak błyskotliwych, ale łatwo rozpraszających się juniorów. Przepływ pracy był liniowy, kruchy i całkowicie ręczny:',
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: 'W tym paradygmacie **wąskim gardłem jest człowiek.** Piszesz prompt, czytasz wynik, zauważasz błąd składni, wklejasz go z powrotem do czatu i modlisz się, żeby model nie zapomniał kontekstu pięć kroków później. To wygląda produktywnie. To wyczerpujące, nieskalowalne mikrozarządzanie — i absolutnie nie działa, gdy śpisz.',
    },
    { kind: 'h3', text: 'Faza 2 — inżynieria pętli (obieg autonomiczny)' },
    {
      kind: 'p',
      text: 'To, co opisuje Cherny, to **inżynieria pętli** — przepływy agentowe, w których człowiek całkowicie wychodzi z pętli wykonania. Przestajesz prowadzić samochód. Budujesz tor i pozwalasz maszynie okrążać go samodzielnie.',
    },
    {
      kind: 'p',
      text: 'Zamiast pisać prompt rozwiązujący problem, piszesz programową **pętlę**, która osadza AI wewnątrz zautomatyzowanego cyklu wykonania i weryfikacji:',
    },
    {
      kind: 'olist',
      items: [
        '**Cel.** Człowiek ustala jeden cel wysokiego poziomu — „zbuduj ten endpoint API i osiągnij 98% pokrycia testami”.',
        '**Działanie.** AI generuje pierwszą wersję kodu.',
        '**Weryfikacja.** Zautomatyzowane środowisko — kompilatory, lintery, testy jednostkowe, twoje CI — uruchamia kod i wyłapuje każdy błąd.',
        '**Samokorekta.** Przy porażce system przechwytuje ślad stosu, przekazuje go AI jako nową instrukcję i każe spróbować ponownie.',
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: 'Pętla działa z prędkością maszyny, przechodząc przez dziesiątki iteracji, samokorygując się i samoleczy, aż spełnione zostaną kryteria weryfikacji. Nigdy nie wpisałeś ani jednej dodatkowej wskazówki. Nie pisałeś promptów — zbudowałeś tor, a model sam przejechał każde okrążenie.',
    },

    { kind: 'h2', text: 'Prawdziwą umiejętnością nie jest pisanie kodu. Jest nią pisanie sędziego.' },
    {
      kind: 'p',
      text: 'Oto część, którą prawie każdy pomija — a to cała gra. Trudną częścią pętli **nie** jest generowanie kodu. Modele są w tym już przerażająco dobre. Trudną częścią jest **to, co decyduje, czy kod jest dobry.**',
    },
    {
      kind: 'p',
      text: 'Daj pętli silnego, bezwzględnego weryfikatora — prawdziwe testy, analizę statyczną, kompilator, który odmawia kłamstwa — a zbiegnie się do czegoś, co naprawdę działa. Daj jej słabego, a ta sama pętla chętnie wyprodukuje nieskończoną rzekę pewnego siebie, pięknie sformatowanego śmiecia, halucynując drogę do zielonego znacznika, który nic nie znaczy.',
    },
    {
      kind: 'p',
      text: 'Więc umiejętnością następnej dekady nie jest rzemiosło promptu. Jest nią **projektowanie weryfikacji** — kuloodporne systemy walidacji, które pozwalają AI bezpiecznie rozmawiać z samym sobą, nie spadając z urwiska. To trudniejszy, rzadszy i o wiele cenniejszy rodzaj inżynierii niż znajdowanie właściwych słów.',
    },

    { kind: 'h2', text: 'Od filozofii do produkcji: jak zbudowaliśmy pętlę' },
    {
      kind: 'p',
      text: 'Podczas gdy reszta świata technologii rozkłada cytat Cherny’ego w mediach społecznościowych, prawdziwe wyzwanie jest mało efektowne: **jak zbudować infrastrukturę inżynierii pętli, która naprawdę działa produkcyjnie — poza wewnętrznymi laboratoriami Anthropic?**',
    },
    {
      kind: 'p',
      text: 'Zamknij pętlę wokół jednego modelu, a szybko trafisz na ściany prawdziwego świata: degradację okna kontekstu, halucynacyjne spirale śmierci i brak pamięci w skali projektu. W [%SITE%](/pl) spędziliśmy ostatni rok, traktując filozofię Cherny’ego nie jako przewidywanie, lecz jako **plan architektoniczny** — i zbudowaliśmy pętlę, na której działa ta przestrzeń robocza.',
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: 'Pętla rozwoju: właściciel ustala cel, agent edytuje repozytorium, bramki maszynowe to weryfikują, porażki wracają do agenta jako nowe instrukcje, a panel sterowania buduje, prowadzi dziennik i potrafi cofnąć',
      caption: 'Pętla taka, jaka jest naprawdę wpięta: agent w twoim repozytorium, bramki, które nie kłamią, i panel, który zamyka obieg.',
    },
    { kind: 'h3', text: 'Anatomia pętli klasy produkcyjnej' },
    {
      kind: 'p',
      text: 'Żeby pętle były realne w prawdziwym oprogramowaniu, trzeba przestać podziwiać model i zacząć budować wokół niego trzy mało efektowne rzeczy — sędziego, pamięć i rękę, która wysyła:',
    },
    {
      kind: 'list',
      items: [
        '**Weryfikator, którego nie da się przegadać.** Sędzia to nie drugi model z opinią; to zestaw skryptów, które psują build. Czy sygnały językowe istnieją na każdej publicznej stronie? Czy każdy wpis ma bliźniaka w markdown, którego potrzebuje czytnik AI? Czy jest przywołany obraz, którego nikt nie dodał? Każda kontrola istnieje, bo dokładnie ten defekt kiedyś trafił na produkcję, i każda odpowiada kodem wyjścia, nie akapitem.',
        '**Pamięć, która przeżywa sesję.** Efekt amnezji jest prawdziwy: piętnaście okrążeń wokół upartego błędu i agent gubi architekturę. Tutaj pamięć nie jest usługą, która może być offline — to pliki obok kodu, które podróżują z repozytorium: instrukcja robocza, lekcje dopisywane w chwili, gdy właściciel coś poprawia, lista antywzorców, potwierdzone przypadki użytkownika. Nowa sesja zaczyna się od ich przeczytania, więc piętnaste okrążenie wie to, czego nauczyło się pierwsze.',
        '**Akt zamykający, który nie należy do agenta.** Pętla kończy się w panelu sterowania: buduje projekt, prowadzi dziennik wdrożeń i potrafi wrócić do ostatniego działającego builda. Ustawienia, teksty i obrazy zmieniają się tam bez żadnej przebudowy — więc pętli nigdy nie każe się rozwiązywać czegoś, co nigdy nie było problemem kodu.',
      ],
    },
    {
      kind: 'p',
      text: 'Zauważ, czego **nie ma** na tej liście: roju modeli nadzorujących się nawzajem. To była nasza pierwsza architektura i ją usunęliśmy. Orkiestracja jest najbardziej ekscytującą częścią diagramu agentowego i najmniej nośną częścią działającego — słabego sędziego nie naprawia druga opinia, a silny rzadko jej potrzebuje.',
    },

    { kind: 'h2', text: 'Nowy opis stanowiska inżyniera oprogramowania' },
    {
      kind: 'p',
      text: 'Odchodzimy od pisania kodu, mijamy pisanie promptów i wchodzimy prosto w **budowanie potoków poznawczych.** Rzemiosłem nie jest już instrukcja — jest nim system, w którym ta instrukcja działa.',
    },
    {
      kind: 'p',
      text: 'I nie jest to za darmo. Wraz z pętlami przychodzą dwa nowe koszty. **Dług zrozumienia:** kiedy agent pisze i przepisuje plik trzysta razy w tle, twoje pojęcie o własnej bazie kodu po cichu zanika — działa, tylko już nie jesteś pewien dlaczego. I **surowe obliczenia:** pętla potrafi spalić prawdziwe pieniądze w tokenach, goniąc jeden błąd przez sto cichych prób. Inżynierowie, którzy wygrywają w tej erze, traktują koszt kontra jakość jako świadomą decyzję projektową, nie niespodziankę na fakturze.',
    },
    {
      kind: 'cta',
      text: 'Ta strona jest jedną z tych pętli: strony, które czytasz, to statyczne pliki, których bramka odmówiła wysłania, dopóki nie niosły swoich sygnałów językowych, swojego bliźniaka w markdown i swojego miejsca w mapie strony.',
      href: '/pl',
      label: 'Zobacz przestrzeń roboczą, na której to działa',
    },
    {
      kind: 'p',
      text: 'Era inżynierii promptów oficjalnie jest za nami. Pozostaje tylko jedno pytanie — to samo, na które Cherny już odpowiedział sobie sam: **wciąż próbujesz rozmawiać ze swoją AI — czy już budujesz pętle, które pozwalają jej działać?**',
    },
    {
      kind: 'note',
      text: 'Źródło: szeroko udostępniany post na LinkedIn autorstwa Guillermo Flora, który ujawnił słowa Borisa Cherny’ego. Cytat jest przytoczony tak, jak krążył; architektura i analiza są nasze własne.',
    },
  ],
  faq: [
    {
      q: 'Czym jest „inżynieria pętli” i dlaczego zastępuje inżynierię promptów?',
      a: 'Inżynieria pętli oznacza pisanie zautomatyzowanych przepływów pracy, które promptują AI, przepuszczają jej wynik przez weryfikator (testy, CI, kompilator), zwracają porażki jako nowe instrukcje i powtarzają — aż wynik będzie poprawny. Boris Cherny, który kieruje Claude Code w Anthropic, powiedział, że już nie tworzy promptów ręcznie: pisze pętle, które robią to za niego. Kluczowa obserwacja jest taka, że wąskim gardłem nigdy nie był prompt — był nim człowiek w cyklu sprzężenia zwrotnego.',
    },
    {
      q: 'Jak jest tu, produkcyjnie, wpięta pętla rozwoju?',
      a: 'Agent programujący pracuje wewnątrz twojego własnego repozytorium, na twojej maszynie, z instrukcją roboczą projektu obok kodu. Weryfikator to zestaw bramek uruchamianych przy każdym buildzie, które go psują: sygnały językowe na każdej publicznej stronie, bliźniak markdown dla każdej opublikowanej strony, brak przywołanego obrazu, który nigdy nie został dodany, brak słownika bez klucza. Porażka wraca do agenta jako nowa instrukcja, a pętla się powtarza. Panel sterowania zamyka obieg — buduje projekt, prowadzi dziennik każdego wdrożenia i potrafi cofnąć się do ostatniego działającego builda.',
    },
    {
      q: 'Czy muszę umieć programować, żeby uruchomić tę pętlę?',
      a: 'Nie w przypadku większości tego, co strona faktycznie zmienia. Nazwa, opis, obrazy, języki, analityka i teksty ustawień żyją w panelu sterowania i stosują się bez żadnej przebudowy — to dane, nie kod. Zmiany w kodzie robi agent w twoim repozytorium; ty je czytasz i zatwierdzasz, a panel buduje wynik. Uczciwa granica jest taka: nikt nie obiecuje, że nigdy nie spojrzysz na diff — obiecuje się ci, że nigdy nie musisz ręcznie uruchamiać builda, i że zepsuty można cofnąć jednym kliknięciem.',
    },
  ],
}

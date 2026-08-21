import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const pl: FooterPageCell = {
  title: 'Architektura',
  description:
    'Jak ta aplikacja jest złożona: warstwy, co każda z nich posiada i które z nich działają nadal, gdy pozostałe zostaną wyłączone.',
  keywords: 'architektura, warstwy, generowanie statyczne, własny serwer, warstwa danych',
  blocks: [
    {
      kind: 'p',
      text: 'Ta strona opisuje szkielet, na którym opiera się aplikacja. Została napisana dla dwóch czytelników jednocześnie — osoby decydującej, czy produkt pasuje, oraz agenta kodującego, który będzie go zmieniać. Obaj potrzebują tego samego: wiedzieć, która warstwa co posiada, zanim czegokolwiek dotkną. Powrót do [%SITE%](/pl).',
    },

    { kind: 'h2', text: 'Jak jest połączona' },
    {
      kind: 'p',
      text: 'Kilka procesów działa obok siebie na Twoim serwerze. Cztery z nich odpowiadają na zewnątrz i każdy ma dokładnie jedno zadanie. Granicą między nimi jest port, a nie folder — dlatego awaria jednego nie pociąga za sobą pozostałych.',
    },
    {
      kind: 'table',
      headers: ['Port', 'Proces', 'Do czego służy'],
      rows: [
        ['3000', 'Twoja aplikacja', 'Strony, które widzą odwiedzający. To z nią pracujesz każdego dnia.'],
        ['3001', 'Autoryzacja', 'Konta, sesje, role. Konfigurowana z panelu sterowania, nieedytowana przez Ciebie.'],
        ['3002', 'Panel sterowania', 'Tak samo: konfigurowany, nieedytowany.'],
        ['3300', 'Warstwa danych', 'Wiersze, przesłane pliki, wektory — i jedyne drzwi do całej reszty. Twoja aplikacja z nią rozmawia.'],
      ],
    },
    { kind: 'p', text: 'Obok działają trzy kolejne usługi i żadna z nich nie stanowi samodzielnych drzwi:' },
    {
      kind: 'list',
      items: [
        'mapa — trasy, macierze odległości i wyszukiwanie adresów, port 3400;',
        'kanały — Telegram i to, co po nim następuje, port 3500;',
        'graf wiedzy — agentowy magazyn RAG, port 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Żaden z tych portów nie jest dostępny z Internetu: zapora sieciowa przepuszcza tylko porty WWW, a wszystko, co publiczne, dociera przez nie. Twoja aplikacja dociera do tych trzech usług poprzez warstwę danych — /service/geo, /service/channels, /service/rag — za pomocą tego samego klucza, który otwiera samą warstwę danych.',
    },

    { kind: 'h2', text: 'Każda warstwa przetrwa pozostałe' },
    {
      kind: 'p',
      text: 'Osobne procesy to nie diagram — to to, co dzieje się w zły dzień. Każdy z czterech może się zatrzymać, bez reszty padającej razem z nim.',
    },
    {
      kind: 'table',
      headers: ['Jeśli to się zatrzyma', 'Co nadal działa'],
      rows: [
        ['Twoja aplikacja', 'Panel, dane i konta są nietknięte; tylko strona jest niedostępna'],
        ['Panel sterowania', 'Strona nadal obsługuje odwiedzających; tylko zmiany muszą poczekać'],
        ['Warstwa danych', 'Wygenerowane wcześniej strony nadal się otwierają — do tego służy generowanie statyczne'],
        ['Autoryzacja', 'Strony publiczne działają bez zmian; zamyka się tylko to, co znajduje się za logowaniem'],
      ],
    },
    {
      kind: 'note',
      text: 'Panel celowo znajduje się poza Twoim repozytorium. To, co trafia do Twojego GitHub, to aplikacja; kokpit pozostaje na serwerze, dlatego błąd podczas edycji nie może go zepsuć.',
    },

    { kind: 'h2', text: 'Najpierw statyka i co dzięki temu zyskujesz' },
    {
      kind: 'p',
      text: 'Strony są generowane z wyprzedzeniem, a nie składane przy każdym żądaniu. To nie jest detal dotyczący wydajności — to powód, dla którego serwowanie strony pozostaje tanie przy dużym obciążeniu, w pełni czytelne dla wyszukiwarek i funkcjonalne przy wyłączonym JavaScript.',
    },
    {
      kind: 'list',
      items: [
        'Routing odbywa się po stronie serwera, więc odwiedzający z wyłączonymi skryptami nadal może nawigować po całej stronie.',
        'Zawartość jest regenerowana według harmonogramu, a nie przy każdej wizycie, więc skok ruchu nic dodatkowo nie kosztuje.',
        'Wszystko, co naprawdę zależy od tego, kto ogląda — pulpit nawigacyjny, konto — jest renderowane na żądanie i dotyczy tylko tej części.',
      ],
    },

    { kind: 'h2', text: 'Jeden design, ustalony raz' },
    {
      kind: 'p',
      text: 'Kolory, typografia i odstępy nie są wybierane dla każdej strony osobno. Cała skala znajduje się w jednym miejscu, paleta w drugim, a ręcznie wpisany nagłówek oblewa kontrolę, zanim w ogóle trafi na stronę.',
    },
    {
      kind: 'p',
      text: 'Zasada za tym stojąca jest krótka: **nic w wyglądzie strony nie zależy od tego, kto może ją otworzyć.** Publiczna czy prywatna, witryna sklepowa czy tabela administracyjna — te same nagłówki, ta sama skala, te same kolory. Dostęp decyduje o tym, co człowiek może zobaczyć, a nigdy o tym, jak jest to sformatowane.',
    },
    {
      kind: 'p',
      text: 'Jest to zapisane, ponieważ tego brak ma swój kształt. Gdy plik z designem był pusty, agent budujący ten projekt wymyślił drugi styl nagłówka dla „ekranów roboczych” — dwie prywatne strony skończyły z dwukrotnie większą różnicą w rozmiarze i ustawione w różnych rodzinach czcionek. Nic nie było zepsute; po prostu wyglądało to jak dwa różne produkty.',
    },
    {
      kind: 'p',
      text: 'Twoja paleta to mały plik ról kolorów, odczytywany podczas serwowania strony. Zmień go, a cała strona podąży za zmianą — w tym strony, których jeszcze nie zbudowałeś, i w tym oba motywy: jasny i ciemny to te same role z różnymi wartościami, a nie dwa designy, które trzeba ręcznie synchronizować.',
    },

    { kind: 'h2', text: 'Języki: 82 dostępne, a dodanie jednego nic nie kosztuje' },
    {
      kind: 'p',
      text: 'Osiemdziesiąt dwa języki są dostarczane z produktem. Włączasz te, którymi posługuje się Twój rynek, a reszta czeka — włączenie kolejnego później to kwestia ustawienia, a nie przebudowy sposobu działania strony.',
    },
    {
      kind: 'p',
      text: 'Część, którą warto zrozumieć, to to, czego dodanie języka NIE robi:',
    },
    {
      kind: 'list',
      items: [
        'Nie zmienia żadnej strony w dynamiczną. Każdy język otrzymuje własne strony, wygenerowane z wyprzedzeniem dokładnie tak samo jak pierwsza — dziesięć języków oznacza dziesięć zestawów statycznych stron, a nie jedną stronę składaną przy każdym żądaniu.',
        'Nie osłabia pozycji w wyszukiwarkach. Każda strona deklaruje się jako oryginał w swoim własnym języku i wymienia swoje tłumaczenia, więc wyszukiwarka traktuje je jako jedną stronę w dziesięciu językach, a nie dziesięć bliskich duplikatów konkurujących ze sobą.',
        'Nie wpływa na prędkość. Serwowanie prerenderowanej strony to taka sama praca bez względu na to, ile języków istnieje obok niej.',
      ],
    },
    {
      kind: 'note',
      text: 'Strona jednojęzyczna to przypadek sam w sobie, a nie okrojona wersja: język całkowicie znika z adresów, a strona przestaje reklamować tłumaczenia, których nie posiada.',
    },

    { kind: 'h2', text: 'Znajdowana przez wyszukiwarki, czytelna dla modeli' },
    {
      kind: 'p',
      text: 'Dwóch czytelników trafia na nowoczesną stronę i chcą zupełnie innych rzeczy. Wyszukiwarka wysyła człowieka na stronę. Model przychodzi sam, czyta i opowiada na nowo. Produkt jest zbudowany dla obu, a te dwie rzeczy to nie to samo zadanie.',
    },
    {
      kind: 'p',
      text: 'Dla wyszukiwarek: strony są serwowane jako gotowy HTML, każda deklaruje swój własny adres kanoniczny, tłumaczenia wskazują na siebie nawzajem, metadane są składane przez jeden mechanizm zamiast dla każdej strony osobno, a dane strukturalne, mapy stron i reguły robots są dostarczane domyślnie. Automatyczne kontrole odrzucają stronę, która narusza którąkolwiek z tych zasad.',
    },
    {
      kind: 'p',
      text: 'Dla modeli: każda strona publiczna istnieje również jako czysty tekst. Pod adresem /llms.txt znajduje się mapa, cały korpus pod /llms-full.txt, a obok każdej strony wersja w formacie markdown. To ważne, ponieważ kod strony to dla modelu w połowie szum — menu, stopka, baner zgody, skrypty — i zużywa na to swój kontekst.',
    },
    {
      kind: 'note',
      text: 'Obie formy są budowane z TEJ SAMEJ zawartości. Nie ma osobnej „wersji dla AI”, która mogłaby się rozsynchronizować: edytujesz tekst raz i oba zmieniają się razem. Ręcznie utrzymywana kopia rozeszłaby się przy pierwszej korekcie i nikt by tego nie zauważył, ponieważ nikt nie otwiera jej w przeglądarce.',
    },

    { kind: 'h2', text: 'Ustawienia działają bez konieczności ponownej kompilacji' },
    {
      kind: 'p',
      text: 'Nazwa, opis, logo, kolory, języki i przełączniki funkcji znajdują się w plikach konfiguracyjnych na serwerze, poza kodem. Aplikacja czyta je podczas serwowania, więc zmiana w panelu jest widoczna natychmiast — bez wdrażania, bez przerw w działaniu.',
    },
    {
      kind: 'p',
      text: 'Konsekwencja znaczy więcej niż wygoda: ta sama baza kodu obsługuje piekarnię i marketplace, i żadna z nich nie musiała tworzyć własnego forka, aby tam dotrzeć.',
    },

    { kind: 'h2', text: 'Twój serwer, Twój kod i droga wyjścia' },
    {
      kind: 'p',
      text: 'Aplikacja należy do Ciebie: sklonuj ją, edytuj lokalnie, wysłij z powrotem. Nic tutaj nie „dzwoni do domu” — nie ma dostawcy, którego trzeba prosić o pozwolenie, ani subskrypcji, którą można cofnąć.',
    },
    {
      kind: 'p',
      text: 'Możesz też odejść. Usuń zależność od panelu, a aplikacja zadziała wszędzie. Tracisz części, które żyją na serwerze — ustawienia bez ponownej kompilacji, warstwę danych, wyszukiwanie wektorowe, autoryzację w 82 językach, historię wdrożeń z możliwością wycofania zmian — i zachowujesz kod. To legalne wyjście, a nie odstępstwo od projektu.',
    },

    { kind: 'h2', text: 'Zbudowana, by rosnąć po wyczerpaniu kontekstu' },
    {
      kind: 'p',
      text: 'Twardym limitem w projekcie budowanym przez AI nie jest rozmiar kodu. Jest nim to, jak dużo z tego kodu trzeba zrozumieć naraz, zanim będzie można dokonać bezpiecznej zmiany. Projekt, w którym każda nowa strona powiększa centralny plik, szybko uderza w tę ścianę: w końcu żadna sesja nie jest w stanie pomieścić wystarczająco dużo, aby cokolwiek zmienić bez zepsucia czegoś innego.',
    },
    {
      kind: 'p',
      text: 'Tutejszy kształt został dobrany dokładnie przeciwko temu. **Każda encja posiada własny folder** — swoje strony, swoje dane, swoje słowa, swoje prywatne komponenty. Usuń folder, a nic nie zostanie osierocone w żadnym innym miejscu.',
    },
    {
      kind: 'list',
      items: [
        'Warstwa wspólna nie rośnie w miarę dodawania encji. Coś trafia do wspólnego miejsca tylko wtedy, gdy dwie rzeczy naprawdę z tego korzystają, a to przeniesienie jest celowym działaniem, a nie nawykiem.',
        'Uprawnienia są deklarowane tam, gdzie są egzekwowane, a nie w rejestrze, o którego aktualizacji ktoś musi pamiętać.',
        'Grupy ścieżek sprawiają, że dwa rodzaje stron są widoczne na dysku: treść publiczna po jednej stronie, ekrany chronione rolami po drugiej. Folder w żadnej z nich to nieodpowiedziane pytanie, a kontrola zgłasza to głośno.',
      ],
    },
    {
      kind: 'p',
      text: 'Konsekwencja jest sednem: zmiana w jednej encji wymaga przeczytania jednego folderu. Miliony linii pozostają możliwe do opanowania nie dlatego, że ktoś trzyma je w głowie, ale dlatego, że żadna pojedyncza zmiana nigdy tego nie wymaga.',
    },
    {
      kind: 'p',
      text: 'Starter to ta sama idea zastosowana na początku. To, co trafia do Ciebie, to nie puste repozytorium, ale działający przykład każdego wzorca — strona, wpis, katalog, prywatny ekran, okno dialogowe, komórka językowa. Nowa strona powstaje poprzez skopiowanie działającej, więc kształt propaguje się poprzez strukturę, a nie poprzez dyscyplinę.',
    },

    { kind: 'h2', text: 'Dokumenty, którym agent jest posłuszny' },
    {
      kind: 'p',
      text: 'Agent kodujący rozpoczyna każdą sesję bez pamięci o poprzedniej. To, co przetrwało, jest zapisane wewnątrz projektu i czytane na początku każdej sesji. Ten korpus jest tak samo częścią architektury jak porty — to dzięki niemu druga sesja jest tak samo kompetentna jak pierwsza.',
    },
    {
      kind: 'table',
      headers: ['Dokument', 'Do czego służy'],
      rows: [
        ['Przypadki użycia', 'DO CZEGO służy produkt, jeden plik na scenariusz: kto przybywa, co go sprowadziło, co musi być prawdą, gdy skończy. Brak potwierdzonego przypadku oznacza brak budowania — agent jest zobowiązany zatrzymać się i zapytać zamiast zgadywać.'],
        ['Kroki rozwoju', 'Sama praca, jako pliki. Krok jest otwierany przed wykonaniem i przenoszony do folderu zakończonych z pełnym raportem. Sesja, która padnie, niczego nie traci; zimna sesja wznawia pracę z plików.'],
        ['Testowanie', 'Jak udowodnić, że krok jest zakończony: dwa niezależne dowody z dwóch różnych płaszczyzn, spisane. Zielony build nigdy nie jest jednym z nich — log budowania wygląda identycznie niezależnie od tego, czy funkcja działa, czy nie.'],
        ['Antywzorce', 'Podejścia, które już kosztowały tutaj czas, każde z mechanizmem niepowodzenia. Samoskonalące się: agent dopisuje je w momencie zrozumienia ślepej uliczki.'],
        ['Lekcje', 'Twoje preferencje i nawyki zdobyte przez pomyłkę poprawną raz. Tam, gdzie lekcja i domyślne zachowanie agenta są niezgodne, wygrywa lekcja — istnieje, ponieważ domyślne zachowanie już tutaj zawiodło.'],
        ['Design', 'Jak wyglądają strony, ustalone przez Ciebie i przestrzegane. Dane, nieewoluujące.'],
      ],
    },
    {
      kind: 'p',
      text: 'Dwa z nich zasługują na słowo wyjaśnienia co do kierunku. **Antywzorce i lekcje są pisane przez agenta**; dokument designu jest pisany przez Ciebie. Różnica jest celowa: agent może rejestrować to, czego się nauczył, ale nie może decydować o tym, jak produkt powinien wyglądać.',
    },
    {
      kind: 'note',
      text: 'Przypadki użycia przenoszą się z plików do usługi. Rozmowa, która je tworzy, żyje już w panelu sterowania; następnie przeniosą się za interfejs narzędziowy wspierany bazą danych, więc agent będzie prosił o potrzebne przypadki zamiast czytać folder. Reguła nie zmienia się wraz ze sposobem przechowywania — brak potwierdzonego przypadku, brak budowania. Zmienia się to, że przypadki przestają być dokumentem, o którego otwarciu agent musi pamiętać.',
    },

    { kind: 'h2', text: 'Wiele produktów na jednym serwerze' },
    {
      kind: 'p',
      text: 'Przypadek musi do czegoś należeć. W tym produkcie należy do **produktu** — a jeden serwer mieści ich kilka: dziś strona docelowa, w przyszłym tygodniu zaplanowany monitor, potem mózg firmy.',
    },
    {
      kind: 'p',
      text: 'Zastrzeżenie jest słuszne i warto je sformułować przed odpowiedzią: **strona internetowa to zazwyczaj jeden produkt.** Jeśli budujesz profesjonalny system produkcyjny dla firmy, to prawda i nic tutaj z tym nie dyskutuje — umieść jeden produkt na jednym serwerze, a reszta tej sekcji nic Cię nie kosztuje.',
    },
    {
      kind: 'p',
      text: 'Ale to już nie jedyna rzecz, którą ludzie budują. Coraz więcej z tego, czego człowiek potrzebuje, to mała usługa dla własnej efektywności: coś, co działa według harmonogramu i zgłasza, co się zmieniło, coś, co wyszukuje według oceny, a nie słów kluczowych, coś, co obsługuje jedno powtarzające się zadanie w sprzedaży, marketingu lub operacjach. Każde z nich jest zbyt małe, aby zasługiwać na własny serwer, własną domenę i własny rachunek — a razem stanowią system.',
    },
    {
      kind: 'p',
      text: 'Jednostką pracy jest więc produkt, a nie strona. Pogrupowanie jednego produktu na jego własnej stronie lub garści stron pozwala agentowi kodującemu wiedzieć, bez pytania, który z nich zmienia.',
    },

    { kind: 'h3', text: 'Dlaczego po prostu nie nazwać tego projektem' },
    {
      kind: 'p',
      text: 'Ponieważ projekt nie jest miejscem. Nie ma adresu, folderu ani tabel, więc przypadek do niego dołączony nie może zostać wykonany — agent nadal musi zgadywać, dokąd trafia praca. Produkt ma wszystkie trzy i to jest cała różnica: przypadek dołączony do produktu to instrukcja zdatna do zbudowania.',
    },
    {
      kind: 'p',
      text: 'Produkt posiada cztery korzenie i żaden z nich nie jest konfigurowany ręcznie — wszystkie cztery są **pochodnymi** jego rekordu:',
    },
    {
      kind: 'table',
      headers: ['Korzeń', 'Pochodna z'],
      rows: [
        ['Jego strony', 'Jego adres — w tym frameworku nazwa folderu JEST segmentem URL'],
        ['Jego logika', 'Jego stałe id'],
        ['Jego tabele', 'Jego stałe id, jako prefiks nazwy'],
        ['Jego przypadki', 'Jego stałe id'],
      ],
    },
    {
      kind: 'p',
      text: 'Pracując nad przypadkiem, agent pisze wewnątrz tych czterech korzeni i nigdzie indziej. Kod wspólny żyje we wspólnym korzeniu, a przeniesienie tam czegoś jest celowym działaniem określonym w kroku — sięganie do sąsiedniego produktu po komponent to dokładnie ten ruch, do powstrzymania którego stworzono tę regułę, ponieważ w ten sposób zmiana jednego właściciela cicho psuje inny produkt tygodnie później.',
    },
    {
      kind: 'p',
      text: 'Id jest celowo pozbawione znaczenia — p1, p2 — i nigdy się nie zmienia. Nie można go wywieść z tytułu ani struktury, ponieważ zmienisz jedno i drugie, a ścieżki zależą od id. Udowodniono to tego samego dnia, w którym napisano tę regułę: produkt, którego id brzmiało «store», okazał się mózgiem firmy.',
    },

    { kind: 'h3', text: 'Nie każdy produkt ma stronę' },
    {
      kind: 'p',
      text: 'Produkt deklaruje jedną z trzech powierzchni, a domyślny wybór zawsze zmierza w stronę zamkniętej:',
    },
    {
      kind: 'list',
      items: [
        '**Publiczny** — ma adres i odwiedzający do niego docierają.',
        '**Prywatny** — żyje jako karta w Twoim panelu sterowania, a świat zewnętrzny nie ma do niego dostępu.',
        '**Headless** — nie ma w ogóle ekranu: działa poprzez kanały i według harmonogramu, a spotykasz go na Telegramie lub w jego raporcie.',
      ],
    },
    {
      kind: 'p',
      text: 'Produkt posiada również status — w trakcie opisywania, w trakcie budowy, na żywo (live). Przeniesienie go do live go publikuje, a to jest zmiana ustawienia: nic nie jest ponownie kompilowane ani wdrażane.',
    },

    { kind: 'h3', text: 'Jak to wygląda w praktyce' },
    {
      kind: 'p',
      text: 'Weźmy konsultantkę z jednym serwerem. Jej pierwszy produkt to strona docelowa: publiczna, w korzeniu, z jednym celem — otrzymać zapytanie. Jej przypadki mówią, kto przybywa i co musi być prawdą, gdy odchodzi.',
    },
    {
      kind: 'p',
      text: 'Jej drugi produkt pojawia się później i nie dzieli z pierwszym niczego poza serwerem. Na początku zgłoszenia z landingu po prostu wpadały jej do komunikatora — wystarczało, dopóki było ich pięć na tydzień. Potem zrobiło się trzydzieści i potrzebne stało się miejsce, w którym widać, kto napisał, co mu odpowiedziano i czym się skończyło: własny system obsługi zgłoszeń. Stoi za logowaniem, ma swoje strony, swoje tabele i swoje role, a jego przypadki opisują pracę z klientem, a nie pierwszą wizytę nieznajomego.',
    },
    {
      kind: 'p',
      text: 'Oba żyją na jednym serwerze i żaden nie może po cichu uszkodzić drugiego: osobne strony, osobna logika, osobne tabele, osobne przypadki. Kiedy prosi agenta o zmianę sformułowania formularza zapytania, nic dotyczącego systemu zgłoszeń nie znajduje się w zakreślonym obszarze — nie dlatego, że agent był ostrożny, ale dlatego, że granica została ustalona zanim którykolwiek z nich został zbudowany. Później staną obok trzeci i czwarty — wysyłki, raporty, magazyn — a zasada się nie zmieni: jeden serwer, osobne produkty.',
    },
    {
      kind: 'note',
      text: 'Plan i stan faktyczny są celowo trzymane z dala od siebie. Strony, które produkt POWINIEN mieć, są spisane; strony, które rzeczywiście POSIADA, są zliczane poprzez przechodzenie folderów, nigdy nie są przechowywane. Ręcznie tworzona lista tego, co istnieje, rozbiega się z rzeczywistością w pierwszym tygodniu — agent buduje stronę i zapomina o liście. Luki między tymi dwoma stanami to odpowiedź na pytanie „czego jeszcze brakuje” i jest ona wiarygodna tylko dlatego, że jednej jej połowy nie da się sfałszować.',
    },
  ],
}

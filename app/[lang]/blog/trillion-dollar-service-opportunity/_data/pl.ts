import type { BlogOverride } from '../../_lib/types'

// Wersja polska. Ton autora (Roma Armstrong): osobisty, bezpośredni,
// inspirujący. Obowiązkowa kotwica główna „Agentic Engineering
// Infrastructure” (termin nieprzetłumaczony) → /pl.
export const pl: BlogOverride = {
  title: 'Szansa warta bilion dolarów to salon obok',
  subtitle:
    'Elon Musk mówił o kosmosie, AI i samochodach. Zdanie, które we mnie zostało, było prostsze: większość biznesów na świecie wciąż nie ma API. Oto nisza, którą przez to znalazłem.',
  description:
    'Dlaczego największe pieniądze w AI w najbliższym czasie nie tkwią w jednorożcu — tkwią w salonie fryzjerskim, klinice, gabinecie dentystycznym obok. Problem niestawiennictwa, biznesy bez strony i bez CRM, i jak przestrzeń robocza self-hosted pozwala prawie każdemu je zautomatyzować bez wcześniejszego składania stosu technologii.',
  excerpt:
    'Elon Musk powiedział, że większość biznesów wciąż nie ma API — działają na telefonie albo nawet bez tego. Spędziłem dziesiątki spotkań, ścigając tę myśl, i znalazłem niszę leżącą na wierzchu: salon, klinika, gabinet dentystyczny obok.',
  blocks: [
    {
      kind: 'p',
      text:
        'To trochę nietypowy wpis, bo zaczyna się od kogoś innego. Wywiad z Elonem Muskiem powyżej przykuł moją uwagę — mówił o kosmosie, o sztucznej inteligencji, o samochodach. Ale moment, który zainspirował mnie najbardziej, był cichy. Powiedział, że mimo tego, jak czuje się współczesny świat — jakby wszystko już wynaleziono, każda strona zbudowana, każda aplikacja wypuszczona, każdy proces biznesowy zautomatyzowany — przytłaczająca większość biznesów na świecie nie ma nawet API. Działają na telefonie. Niektóre działają nawet bez tego.',
    },
    {
      kind: 'quote',
      text:
        'Jeśli AI może po prostu wziąć to, co jest już przekazywane firmie outsourcingowej obsługującej klienta, z której już korzystają, i wykonać tę obsługę klienta za pomocą aplikacji, których już używają, to można zrobić ogromny postęp w obsłudze klienta, która, jak myślę, to około 1% światowej gospodarki. To blisko biliona dolarów w sumie, tylko na obsługę klienta.',
      cite: 'Elon Musk · Wywiad z Dwarkeshem Patelem, luty 2026',
    },
    {
      kind: 'p',
      text:
        'Przeczytaj to jeszcze raz oczami budowniczego. Ten bilion nie tkwi w kolejnej sieci społecznościowej ani kolejnej otoczce AI — tkwi wewnątrz zwykłych biznesów, które nigdy nie przeszły cyfryzacji. A bariera nigdy nie była pomysłem; była budową. Zatrudnienie zespołu, spięcie infrastruktury, płacenie miesiąc po miesiącu za stos usług w chmurze. Dokładnie tę barierę usuwa przestrzeń robocza self-hosted — dlatego to właśnie to ciche zdanie, a nie rakiety, zostało ze mną.',
    },

    { kind: 'h2', text: 'Wszyscy nauczyli się programować. Ulica wygląda tak samo.' },
    {
      kind: 'p',
      text:
        'Z rozmów z wieloma partnerami widzę wciąż dwa scenariusze. Z jednej strony fala programistów — a nawet ludzi, którzy nigdy nimi nie byli, wcześniejszych marketerów czy menedżerów treści — nagle nauczyła się programować w ciągu jednego roku. Wszyscy zaczęli budować. Projektów jest mnóstwo i wiele z nich jest naprawdę interesujących. A w realnym świecie? W realnym świecie wszystko jest dokładnie takie samo.',
    },
    {
      kind: 'p',
      text:
        'Okazuje się więc, że niektórzy z nas znaleźli wspaniały sposób, żeby sprawić sobie przyjemność — zastrzyk dopaminy z nowej wiedzy. Ale nadszedł też czas, żeby na tym zarabiać. Więc gdzie przesuwasz swój fokus?',
    },
    {
      kind: 'founder',
      text:
        'Problem: nie potrafimy przewidzieć przyszłości. Zwłaszcza teraz, gdy rynek i technologia zaczęły zmieniać się z niezwykłą prędkością. Adaptacja do zmiany to bolesny proces zmiany strategii.',
    },

    { kind: 'h2', text: 'Poszedłem szukać odpowiedzi. Znalazłem salon fryzjerski.' },
    {
      kind: 'p',
      text:
        'Po szczegółowym przestudiowaniu tego wideo i przeprowadzeniu kilkudziesięciu spotkań, żeby potwierdzić odpowiedź na to pytanie, znalazłem bardzo ciekawą niszę biznesową: salony piękności i kosmetologię niechirurgiczną, centra medyczne, stomatologię. Mimo obfitości automatyzacji i systemów CRM, zaskakująco często napotykają jeden problem: klient zostawia zgłoszenie, rezerwuje wizytę — a potem nie przychodzi. Kiedy menedżer do niego dzwoni — zwykle dokładnie o godzinie, o której wizyta miała się zacząć — klienci często odpowiadają: „ojej, zapomnieliśmy. Czemu nam nie przypomnieliście?”',
    },
    {
      kind: 'p',
      text:
        'Oczywiście jest mnóstwo gotowych rozwiązań do zainstalowania. Ale jest jeszcze więcej klientów, którzy nigdy żadnego nie dostali — a wielu z nich nie ma strony, wielu w ogóle nie ma CRM.',
    },

    { kind: 'h2', text: 'Dokładnie do tego służy taka przestrzeń robocza.' },
    {
      kind: 'p',
      text:
        '[%SITE%](/pl) to samodzielnie hostowana przestrzeń robocza inżynierii agentowej, zbudowana właśnie z myślą o takich scenariuszach. Zawiera od razu części, które taki biznes musiałby inaczej kupować osobno: własną bazę danych i tabele, magazyn plików, głos zamieniony na tekst, kanał do dotarcia do klienta w komunikatorze, autoryzację z rolami i publiczną stronę, którą wyszukiwarka naprawdę potrafi odczytać. Właściciel biznesu może mieć tyle pomysłów, ile chce — części są już na półce.',
    },
    {
      kind: 'p',
      text:
        'Zaletą jest to, że kiedyś urzeczywistnienie tych pomysłów oznaczało niesamowicie długą pracę z zespołem produktowym, potem zatrudnianie programistów, potem niekończące się myślenie o tym, jak to wszystko działa — albo kupowanie drogich usług na własne potrzeby. Teraz to wszystko jest proste. Dzięki inżynierii agentowej niemal każda osoba może wziąć telefon i opisać, jak chciałaby zoptymalizować swój biznes, i zrobić to sama albo z pomocą kogoś, kto już się na tym trochę zna.',
    },
    {
      kind: 'p',
      text:
        'To też uwalnia cię od konieczności pamiętania, za które usługi musisz płacić. Większość usług w chmurze, które zamieniają się w regularne płatności i stanowią lwią część twoich kosztów — baza danych, magazyn, subskrypcja CRM — to już zwyczajne funkcje twojej własnej aplikacji, działającej na twoim własnym serwerze. A codzienne zmiany wcale nie są wdrożeniem: nazwa, teksty, obrazy i języki edytuje się w panelu sterowania i stosują się bez przebudowy, podczas gdy kod żyje w repozytorium, które należy do ciebie.',
    },

    { kind: 'h2', text: 'Jeden z wielu. Możesz je znajdować codziennie.' },
    {
      kind: 'p',
      text:
        'Powyższy przykład to jeden z wielu. Takie przypadki możesz znajdować dosłownie codziennie i zarabiać na ich wdrażaniu — albo możesz dodać urzeczywistnianie nowych pomysłów wewnątrz własnego biznesu, bo teraz jest to praktycznie darmowe. Nigdy wcześniej tak nie było.',
    },
    {
      kind: 'p',
      text:
        'I choć wydaje się niemal niemożliwe znaleźć nową niszę na startup-jednorożca — może nie warto o tym myśleć. Zamiast marzyć o budowie jednorożca, możesz po prostu zautomatyzować salon fryzjerski obok, albo salon piękności, albo warsztat samochodowy. Wszystkich tych, z którymi już od dawna masz kontakt. Wszystkich tych, którzy już ci ufają. Może czas spróbować?',
    },
  ],
  faq: [
    {
      q: 'Dla jakiego biznesu jest to najlepsze?',
      a: 'Lokalne firmy usługowe z wizytami i powracającymi klientami — salony, kosmetologia niechirurgiczna, kliniki, stomatologia, warsztaty samochodowe — zwłaszcza te bez strony czy CRM i z powtarzającym się problemem niestawiennictwa.',
    },
    {
      q: 'Czy płacę osobno za bazę danych, magazyn, subskrypcję CRM?',
      a: 'Nie. To zwyczajne wbudowane części twojej własnej aplikacji na twoim własnym serwerze, a nie zewnętrzne subskrypcje rozliczane co miesiąc. Płacisz za sam serwer.',
    },
    {
      q: 'Czy muszę być programistą?',
      a: 'Nie w przypadku rzeczy, które biznes zmienia najczęściej: nazwy, teksty, ceny, obrazy i języki edytuje się w panelu sterowania i stosują się bez przebudowy. Budowanie czegoś nowego to praca agenta programującego działającego w twoim repozytorium — twoim, albo kogoś, kto już się na tym trochę zna. Serwer, model AI i domena są już dla ciebie połączone.',
    },
  ],
}

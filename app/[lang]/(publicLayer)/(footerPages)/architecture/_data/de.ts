import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const de: FooterPageCell = {
  title: 'Architektur',
  description:
    'Wie diese Anwendung aufgebaut ist: die Schichten, was jede einzelne verantwortet und welche davon weiterlaufen, wenn die anderen abgeschaltet werden.',
  keywords: 'Architektur, Schichten, statische Generierung, eigener Server, Datenschicht',
  blocks: [
    {
      kind: 'p',
      text: 'Diese Seite beschreibt das Skelett, auf dem die Anwendung steht. Sie ist für zwei Leser gleichzeitig geschrieben — eine Person, die entscheidet, ob das Produkt passt, und einen Coding-Agenten, der es verändern wird. Beide brauchen dasselbe: zu wissen, welche Schicht was verantwortet, bevor irgendetwas angefasst wird. Zurück zu [%SITE%](/de).',
    },

    { kind: 'h2', text: 'Wie sie verdrahtet ist' },
    {
      kind: 'p',
      text: 'Mehrere Prozesse laufen Seite an Seite auf Ihrem Server. Vier davon antworten nach außen, und jeder hat genau eine Aufgabe. Die Grenze zwischen ihnen ist ein Port und kein Ordner — weshalb ein Ausfall in einem Prozess die anderen nicht mitreißt.',
    },
    {
      kind: 'table',
      headers: ['Port', 'Prozess', 'Wofür er da ist'],
      rows: [
        ['3000', 'Ihre Anwendung', 'Die Seiten, die Besucher sehen. Das ist diejenige, mit der Sie jeden Tag arbeiten.'],
        ['3001', 'Autorisierung', 'Konten, Sitzungen, Rollen. Konfiguriert über das Steuerpanel, nicht von Ihnen bearbeitet.'],
        ['3002', 'Steuerpanel', 'Dasselbe: konfiguriert, nicht bearbeitet.'],
        ['3300', 'Datenschicht', 'Zeilen, hochgeladene Dateien, Vektoren — und die einzige Tür zu allem anderen. Ihre Anwendung spricht mit ihr.'],
      ],
    },
    { kind: 'p', text: 'Drei weitere Dienste laufen daneben, und keiner davon ist eine eigene Tür:' },
    {
      kind: 'list',
      items: [
        'die Karte — Routen, Distanzmatrizen und Adresssuche, Port 3400;',
        'Kanäle — Telegram und was danach folgt, Port 3500;',
        'der Wissensgraph — der agentische RAG-Speicher, Port 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Keiner dieser Ports ist aus dem Internet erreichbar: Die Firewall lässt nur die Web-Ports zu, und alles Öffentliche trifft über diese ein. Ihre Anwendung erreicht die drei Dienste über die Datenschicht — /service/geo, /service/channels, /service/rag — mit demselben Schlüssel, der auch die Datenschicht selbst öffnet.',
    },

    { kind: 'h2', text: 'Jede Schicht überlebt die anderen' },
    {
      kind: 'p',
      text: 'Separate Prozesse sind kein Diagramm — sie sind das, was an einem schlechten Tag passiert. Jeder der vier kann anhalten, ohne dass der Rest mit abstürzt.',
    },
    {
      kind: 'table',
      headers: ['Wenn dies stoppt', 'Was weiterhin funktioniert'],
      rows: [
        ['Ihre Anwendung', 'Das Panel, die Daten und die Konten bleiben unberührt; nur die Website ist nicht erreichbar'],
        ['Steuerpanel', 'Die Website bedient Besucher weiterhin; nur Änderungen müssen warten'],
        ['Datenschicht', 'Vorab generierte Seiten öffnen sich weiterhin — genau dafür ist die statische Generierung da'],
        ['Autorisierung', 'Öffentliche Seiten sind nicht betroffen; nur was hinter einem Login liegt, schließt sich'],
      ],
    },
    {
      kind: 'note',
      text: 'Das Panel lebt bewusst außerhalb Ihres Repositories. Was zu Ihrem GitHub wandert, ist die Anwendung; das Cockpit bleibt auf dem Server, weshalb ein Bearbeitungsfehler es nicht beschädigen kann.',
    },

    { kind: 'h2', text: 'Statischer Ansatz zuerst und was er Ihnen bringt' },
    {
      kind: 'p',
      text: 'Seiten werden im Voraus generiert und nicht pro Anfrage zusammengesetzt. Das ist kein Performancedetail — es ist der Grund, warum die Website unter Last günstig zu bedienen bleibt, für Suchmaschinen vollständig lesbar ist und auch mit deaktiviertem JavaScript funktioniert.',
    },
    {
      kind: 'list',
      items: [
        'Das Routing erfolgt serverseitig, sodass ein Besucher mit deaktivierten Skripten weiterhin die gesamte Website navigieren kann.',
        'Inhalte werden nach einem Zeitplan statt bei jedem Besuch neu generiert, sodass eine Traffic-Spitze keine zusätzlichen Kosten verursacht.',
        'Alles, was wirklich davon abhängt, wer zusieht — ein Dashboard, ein Konto —, wird pro Anfrage gerendert, und nur dieser Teil.',
      ],
    },

    { kind: 'h2', text: 'Ein Design, einmal entschieden' },
    {
      kind: 'p',
      text: 'Farben, Typografie und Abstände werden nicht pro Seite gewählt. Die gesamte Skala lebt an einem Ort, die Palette an einem anderen, und eine handgeschriebene Überschrift besteht eine Prüfung nicht, bevor sie überhaupt die Website erreicht.',
    },
    {
      kind: 'p',
      text: 'Das dahinterliegende Gesetz ist kurz: **Nichts daran, wie eine Seite aussieht, hängt davon ab, wer sie öffnen darf.** Öffentlich oder privat, Storefront oder Admin-Tabelle — dieselben Überschriften, dieselbe Skala, dieselben Farben. Der Zugriff entscheidet, was eine Person sehen darf, niemals, wie es gestaltet ist.',
    },
    {
      kind: 'p',
      text: 'Dies ist aufgeschrieben, weil sein Fehlen eine Form hat. Während die Design-Datei leer war, erfand der Agent, der dieses Projekt baute, einen zweiten Überschriftenstil für „Arbeitsbildschirme“ — zwei private Seiten endeten im Größenabstand doppelt so weit auseinander und in unterschiedlichen Schriftfamilien gesetzt. Nichts war kaputt; es las sich schlicht wie zwei verschiedene Produkte.',
    },
    {
      kind: 'p',
      text: 'Ihre Palette ist eine kleine Datei aus Farbrollen, die beim Ausliefern der Seite gelesen wird. Ändern Sie sie, und die gesamte Website folgt — einschließlich der Seiten, die Sie noch nicht gebaut haben, und einschließlich beider Themes: Hell und Dunkel sind dieselben Rollen mit unterschiedlichen Werten, nicht zwei Designs, die manuell synchron gehalten werden müssen.',
    },

    { kind: 'h2', text: 'Sprachen: 82 verfügbar, und eine hinzuzufügen kostet nichts' },
    {
      kind: 'p',
      text: 'Zweiundachtzig Sprachen werden mit dem Produkt ausgeliefert. Sie aktivieren diejenigen, die Ihr Markt spricht, und der Rest wartet — eine spätere Aktivierung ist eine Einstellung, kein Umbau der Funktionsweise der Website.',
    },
    {
      kind: 'p',
      text: 'Der Teil, den es zu verstehen gilt, ist, was das Hinzufügen einer Sprache NICHT tut:',
    },
    {
      kind: 'list',
      items: [
        'Es macht keine Seite dynamisch. Jede Sprache erhält ihre eigenen Seiten, die genau wie die erste im Voraus generiert werden — zehn Sprachen bedeuten zehn Sätze statischer Seiten, nicht eine pro Anfrage zusammengesetzte Seite.',
        'Es verwässert nicht das Suchmaschinen-Ranking. Jede Seite erklärt sich in ihrer eigenen Sprache als Original und benennt ihre Übersetzungen, sodass eine Suchmaschine sie als eine Seite in zehn Sprachen behandelt statt als zehn nahe Verwandte, die miteinander konkurrieren.',
        'Es kostet keine Geschwindigkeit. Das Ausliefern einer vorgefertigten Seite ist dieselbe Arbeit, unabhängig davon, wie viele Sprachen daneben existieren.',
      ],
    },
    {
      kind: 'note',
      text: 'Eine einsprachige Website ist ein eigener Fall, keine abgespeckte Version: Die Sprache verschwindet vollständig aus den Adressen, und die Website hört auf, für Übersetzungen zu werben, die sie nicht hat.',
    },

    { kind: 'h2', text: 'Von Suchmaschinen gefunden, von Modellen lesbar' },
    {
      kind: 'p',
      text: 'Zwei Leser kommen auf eine moderne Website, und sie wollen unterschiedliche Dinge. Eine Suchmaschine schickt eine Person auf eine Seite. Ein Modell kommt selbst, liest und gibt es wieder. Das Produkt ist für beide gebaut, und die beiden sind nicht derselbe Job.',
    },
    {
      kind: 'p',
      text: 'Für Suchmaschinen: Seiten werden als fertiges HTML ausgeliefert, jede deklariert ihre eigene kanonische Adresse, Übersetzungen benennen sich gegenseitig, Metadaten werden durch einen Mechanismus statt pro Seite zusammengestellt, und strukturierte Daten, Sitemaps sowie Robots-Regeln werden standardmäßig mitgeliefert. Maschinelle Prüfungen weisen eine Seite zurück, die irgendetwas davon verletzt.',
    },
    {
      kind: 'p',
      text: 'Für Modelle: Jede öffentliche Seite existiert auch als Reinttext. Es gibt eine Karte unter /llms.txt, den gesamten Korpus unter /llms-full.txt und eine Markdown-Version jeder Seite daneben. Das ist wichtig, weil Seiten-Markup für ein Modell zur Hälfte Rauschen ist — Menüs, Footer, Cookie-Banner, Skripte — und es seinen Kontext für all das verbraucht.',
    },
    {
      kind: 'note',
      text: 'Beide Formen werden aus DEMSELBEN Inhalt gebaut. Es gibt keine separate „Version für KI“, die aus dem Takt geraten könnte: Bearbeiten Sie den Text einmal, und beide ändern sich gemeinsam. Eine manuell gepflegte Kopie würde bei der ersten Korrektur abweichen, und niemand würde es bemerken, weil niemand sie in einem Browser öffnet.',
    },

    { kind: 'h2', text: 'Einstellungen gelten ohne erneuten Build' },
    {
      kind: 'p',
      text: 'Name, Beschreibung, Logo, Farben, Sprachen und Feature-Schalter leben in Konfigurationsdateien auf dem Server, außerhalb des Codes. Die Anwendung liest sie beim Ausliefern, sodass eine Änderung im Panel sofort sichtbar ist — keine Bereitstellung, keine Ausfallzeit.',
    },
    {
      kind: 'p',
      text: 'Die Konsequenz wiegt schwerer als der Komfort: Dieselbe Codebasis bedient eine Bäckerei und einen Marktplatz, und keine von beiden musste geforkt werden, um dorthin zu gelangen.',
    },

    { kind: 'h2', text: 'Ihr Server, Ihr Code und der Ausweg' },
    {
      kind: 'p',
      text: 'Die Anwendung gehört Ihnen: Klonen Sie sie, bearbeiten Sie sie lokal, pushen Sie sie zurück. Nichts hier telefoniert nach Hause — es gibt keinen Anbieter, den man um Erlaubnis fragen muss, und kein Abonnement, das widerrufen werden kann.',
    },
    {
      kind: 'p',
      text: 'Sie können auch gehen. Entfernen Sie die Abhängigkeit vom Panel, und die Anwendung läuft überall. Sie verlieren die Teile, die auf dem Server leben — Einstellungen ohne Rebuild, die Datenschicht, die Vektorsuche, Autorisierung in 82 Sprachen, die Deployment-Historie mit Rollback — und Sie behalten den Code. Das ist ein legitimer Ausstieg, kein Abweichen vom Design.',
    },

    { kind: 'h2', text: 'Gebaut, um weiterzuwachsen, wenn der Kontext ausgeht' },
    {
      kind: 'p',
      text: 'Die harte Grenze für ein von KI gebautes Projekt ist nicht die Größe des Codes. Es ist, wie viel von diesem Code auf einmal verstanden werden muss, bevor eine sichere Änderung vorgenommen werden kann. Ein Projekt, bei dem jede neue Seite eine zentrale Datei vergrößert, stößt früh an diese Wand: Irgendwann kann keine Sitzung mehr genug fassen, um etwas zu ändern, ohne etwas anderes zu beschädigen.',
    },
    {
      kind: 'p',
      text: 'Die Struktur hier ist genau dagegen gewählt. **Jede Entität besitzt ihren eigenen Ordner** — ihre Seiten, ihre Daten, ihre Wörter, ihre privaten Komponenten. Löschen Sie den Ordner, und nichts bleibt anderswo verwaist zurück.',
    },
    {
      kind: 'list',
      items: [
        'Die gemeinsame Schicht wächst nicht, wenn Entitäten hinzugefügt werden. Etwas steigt nur dann in einen gemeinsamen Bereich auf, wenn zwei Dinge es wirklich nutzen, und dieser Schritt ist eine bewusste Handlung, keine Gewohnheit.',
        'Berechtigungen werden dort deklariert, wo sie durchgesetzt werden, nicht in einem Register, an dessen Aktualisierung jemand denken muss.',
        'Routengruppen machen die zwei Arten von Seiten auf der Festplatte sichtbar: öffentliche Inhalte auf der einen Seite, rollengeschützte Bildschirme auf der anderen. Ein Ordner in keiner von beiden ist eine unbeantwortete Frage, und eine Prüfung spricht das laut aus.',
      ],
    },
    {
      kind: 'p',
      text: 'Die Konsequenz ist der Punkt: Eine Änderung an einer Entität erfordert das Lesen eines Ordners. Millionen von Zeilen bleiben wartbar, nicht weil sie jemand im Kopf behält, sondern weil keine einzelne Änderung dies jemals erfordert.',
    },
    {
      kind: 'p',
      text: 'Der Starter ist dieselbe Idee, angewendet auf den Anfang. Was ausgeliefert wird, ist kein leeres Repository, sondern ein funktionierendes Beispiel für jedes Muster — eine Seite, ein Beitrag, ein Katalog, ein privater Bildschirm, ein Dialog, eine Sprachzelle. Eine neue Seite entsteht durch Kopieren einer funktionierenden, sodass sich die Form durch Konstruktion statt durch Disziplin fortpflanzt.',
    },

    { kind: 'h2', text: 'Die Dokumente, denen der Agent gehorcht' },
    {
      kind: 'p',
      text: 'Ein Coding-Agent startet jede Sitzung ohne Erinnerung an die letzte. Was überlebt, ist aufgeschrieben, innerhalb des Projekts, und wird zu Beginn jeder Sitzung gelesen. Dieser Korpus ist ebenso sehr Teil der Architektur wie die Ports — er macht die zweite Sitzung genauso kompetent wie die erste.',
    },
    {
      kind: 'table',
      headers: ['Dokument', 'Wofür es da ist'],
      rows: [
        ['Anwendungsfälle', 'WOFÜR das Produkt da ist, eine Datei pro Szenario: Wer ankommt, was ihn hergebracht hat, was wahr sein muss, wenn er fertig ist. Kein bestätigter Fall bedeutet kein Bauen — der Agent ist verpflichtet, anzuhalten und nachzufragen, anstatt zu raten.'],
        ['Entwicklungsschritte', 'Die Arbeit selbst, als Dateien. Ein Schritt wird geöffnet, bevor er ausgeführt wird, und mit einem vollständigen Bericht in den Ordner für abgeschlossene Schritte verschoben. Eine abgebrochene Sitzung verliert nichts; eine kalte Sitzung nimmt die Arbeit aus den Dateien wieder auf.'],
        ['Testing', 'Wie nachgewiesen wird, dass ein Schritt abgeschlossen ist: zwei unabhängige Nachweise aus zwei verschiedenen Ebenen, ausgeschrieben. Ein grüner Build gehört nie dazu — ein Build-Log sieht identisch aus, unabhängig davon, ob die Funktion funktioniert oder nicht.'],
        ['Antipatterns', 'Ansätze, die hier bereits Zeit gekostet haben, jeweils mit dem Mechanismus des Fehlschlags. Selbstevolvierend: Der Agent fügt etwas hinzu, sobald eine Sackgasse verstanden wurde.'],
        ['Lektionen', 'Ihre Präferenzen und die Gewohnheiten, die Sie sich erarbeitet haben, nachdem etwas einmal schiefgegangen ist. Wo eine Lektion und die Standardeinstellung des Agenten widersprüchlich sind, gewinnt die Lektion — sie existiert, weil die Standardeinstellung hier bereits gescheitert ist.'],
        ['Design', 'Wie Seiten aussehen, von Ihnen entschieden und befolgt. Gegeben, nicht evolvierend.'],
      ],
    },
    {
      kind: 'p',
      text: 'Zwei davon verdienen ein Wort zur Richtung. **Antipatterns und Lektionen werden vom Agenten geschrieben**; das Design-Dokument wird von Ihnen geschrieben. Der Unterschied ist gewollt: Ein Agent darf aufzeichnen, was er gelernt hat, darf aber nicht entscheiden, wie das Produkt aussehen soll.',
    },
    {
      kind: 'note',
      text: 'Anwendungsfälle ziehen von Dateien in einen Dienst um. Die Konversation, die sie erzeugt, lebt bereits im Steuerpanel; als Nächstes ziehen sie hinter eine Werkzeugschnittstelle um, die von einer Datenbank gestützt wird, sodass der Agent nach den benötigten Fällen fragt, anstatt einen Ordner zu lesen. Die Regel ändert sich nicht mit der Speicherung — kein bestätigter Fall, kein Bauen. Was sich ändert, ist, dass die Fälle aufhören, ein Dokument zu sein, an dessen Öffnen sich der Agent erinnern muss.',
    },

    { kind: 'h2', text: 'Viele Produkte auf einem Server' },
    {
      kind: 'p',
      text: 'Ein Fall muss zu etwas gehören. In diesem Produkt gehört er zu einem **Produkt** — und ein Server trägt mehrere davon: heute eine Landingpage, nächste Woche ein geplanter Watcher, danach das Unternehmensgehirn.',
    },
    {
      kind: 'p',
      text: 'Der Einwand ist berechtigt und es wert, vor der Antwort genannt zu werden: **Eine Website ist normalerweise ein Produkt.** Wenn Sie ein professionelles Produktionssystem für ein Unternehmen bauen, ist das richtig, und nichts hier widerspricht dem — setzen Sie ein Produkt auf einen Server und der Rest dieses Abschnitts kostet Sie nichts.',
    },
    {
      kind: 'p',
      text: 'Aber das ist nicht mehr das Einzige, was Menschen bauen. Immer mehr von dem, was eine Person benötigt, ist ein kleiner Dienst für die eigene Effizienz: etwas, das nach einem Zeitplan läuft und meldet, was sich geändert hat, etwas, das nach Urteil statt nach Schlüsselwörtern sucht, etwas, das eine wiederkehrende Aufgabe in Vertrieb, Marketing oder Betrieb erledigt. Jedes davon ist zu klein, um einen eigenen Server, eine eigene Domain und eine eigene Rechnung zu rechtfertigen — und zusammen sind sie ein System.',
    },
    {
      kind: 'p',
      text: 'Die Arbeitseinheit ist also das Produkt, nicht die Website. Das Gruppieren eines Produkts auf seine eigene Seite oder eine Handvoll Seiten ermöglicht es einem Coding-Agenten, ohne Nachfragen zu wissen, welches davon er gerade ändert.',
    },

    { kind: 'h3', text: 'Warum es nicht einfach ein Projekt nennen' },
    {
      kind: 'p',
      text: 'Weil ein Projekt kein Ort ist. Es hat keine Adresse, keinen Ordner und keine Tabellen, sodass ein daran angehängter Fall nicht ausgeführt werden kann — der Agent muss immer noch raten, wohin die Arbeit fließt. Ein Produkt hat alle drei, und das ist der ganze Unterschied: Ein an ein Produkt angehängter Fall ist eine baubare Anweisung.',
    },
    {
      kind: 'p',
      text: 'Ein Produkt besitzt vier Wurzeln, und keine davon wird manuell konfiguriert — alle vier werden aus seinem Datensatz **abgeleitet**:',
    },
    {
      kind: 'table',
      headers: ['Wurzel', 'Abgeleitet von'],
      rows: [
        ['Seine Seiten', 'Seiner Adresse — in diesem Framework IST ein Ordnername das URL-Segment'],
        ['Seine Logik', 'Seiner permanenten ID'],
        ['Seine Tabellen', 'Seiner permanenten ID als Namenspräfix'],
        ['Seine Anwendungsfälle', 'Seiner permanenten ID'],
      ],
    },
    {
      kind: 'p',
      text: 'Wenn der Agent an einem Fall arbeitet, schreibt er innerhalb dieser vier Wurzeln und nirgendwo sonst. Gemeinsamer Code lebt in einer gemeinsamen Wurzel, und das Verschieben von etwas dorthin ist eine bewusste Handlung, die im Schritt angegeben ist — das Greifen nach einer Komponente in einem benachbarten Produkt ist genau der Schritt, den diese Regel verhindern soll, weil so die Änderung eines Besitzers Wochen später stillschweigend ein anderes Produkt beschädigt.',
    },
    {
      kind: 'p',
      text: 'Die ID ist bewusst bedeutungslos — p1, p2 — und ändert sich nie. Sie kann nicht aus dem Titel oder der Struktur abgeleitet werden, da Sie beides ändern werden und die Pfade an der ID hängen. Das wurde am selben Tag bewiesen, an dem die Regel geschrieben wurde: Ein Produkt, dessen ID «store» lautete, stellte sich als Unternehmensgehirn heraus.',
    },

    { kind: 'h3', text: 'Nicht jedes Produkt hat eine Seite' },
    {
      kind: 'p',
      text: 'Ein Produkt deklariert eine von drei Oberflächen, und der Standard tendiert immer zu geschlossen:',
    },
    {
      kind: 'list',
      items: [
        '**Öffentlich** — es hat eine Adresse und Besucher erreichen es.',
        '**Privat** — es lebt als Tab in Ihrem Steuerpanel, und die Außenwelt hat keinen Zugang.',
        '**Headless** — es hat überhaupt keinen Bildschirm: Es arbeitet über Kanäle und nach einem Zeitplan, und Sie begegnen ihm in Telegram oder in seinem Bericht.',
      ],
    },
    {
      kind: 'p',
      text: 'Ein Produkt trägt auch einen Status — wird beschrieben, wird gebaut, live. Das Verschieben auf „live“ veröffentlicht es, und das ist eine Einstellung: Nichts wird neu gebaut und nichts bereitgestellt.',
    },

    { kind: 'h3', text: 'Wie das in der Praxis aussieht' },
    {
      kind: 'p',
      text: 'Nehmen Sie eine Beraterin mit einem Server. Ihr erstes Produkt ist eine Landingpage: öffentlich, im Root, ein einzelnes Ziel — eine Anfrage erhalten. Ihre Anwendungsfälle sagen, wer ankommt und was wahr sein muss, wenn sie gehen.',
    },
    {
      kind: 'p',
      text: 'Ihr zweites Produkt kommt später und teilt nichts mit dem ersten außer dem Server. Anfangs fielen die Anfragen von der Landeseite einfach in ihren Messenger — das reichte, solange es fünf pro Woche waren. Dann wurden es dreißig, und es brauchte einen Ort, an dem zu sehen ist, wer geschrieben hat, was man ihm geantwortet hat und wie es ausging: ein eigenes System für die Bearbeitung von Anfragen. Es liegt hinter der Anmeldung, mit eigenen Seiten, eigenen Tabellen und eigenen Rollen, und seine Anwendungsfälle beschreiben die Arbeit mit einem Kunden, nicht den ersten Besuch eines Fremden.',
    },
    {
      kind: 'p',
      text: 'Beide leben auf einem Server, und keines kann das andere stillschweigend beschädigen: separate Seiten, separate Logik, separate Tabellen, separate Anwendungsfälle. Wenn sie den Agenten bittet, die Formulierung des Anfrageformulars zu ändern, liegt nichts vom Anfragensystem im Bereich der Änderung — nicht weil der Agent vorsichtig war, sondern weil die Grenze entschieden wurde, bevor eines von beiden gebaut wurde. Später stehen ein drittes und ein viertes daneben — Versand, Berichte, Lager — und die Regel ändert sich nicht: ein Server, getrennte Produkte.',
    },
    {
      kind: 'note',
      text: 'Der Plan und die Realität werden absichtlich getrennt gehalten. Die Seiten, die ein Produkt haben SOLLTE, werden aufgeschrieben; die Seiten, die es tatsächlich HAT, werden durch das Durchsuchen der Ordner gezählt, niemals gespeichert. Eine handgeschriebene Liste dessen, was existiert, weicht in der ersten Woche von der Realität ab — der Agent baut eine Seite und vergisst die Liste. Die Lücke zwischen beiden ist die Antwort auf „was fehlt noch“, und sie ist nur vertrauenswürdig, weil eine Hälfte davon nicht gefälscht werden kann.',
    },
  ],
}
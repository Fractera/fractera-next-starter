import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const de: Partial<HomeCell> = {
  title: 'Dies ist der Starter Ihrer Anwendung',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'Ihr Server, Ihr Code: Autorisierung, Datenbank, Speicher und Vektorsuche sind bereits verbunden. Bauen Sie eine Landingpage oder ein SaaS in 82 Sprachen.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Infrastruktur für agentisches Engineering',
    title: 'Dies ist der Starter Ihrer Anwendung',
    description:
      'Alles ist bereits installiert und miteinander verbunden — Autorisierung, eine eigene Datenbank, Dateispeicher, Vektorsuche und hundert weitere Werkzeuge, so geordnet, dass ein Coding-Agent sie findet, ohne dass man es ihm zweimal erklären muss. Bauen Sie eine Landingpage, ein SaaS oder eine Automatisierung, die niemals schläft — in jeder der 82 Sprachen, auf einem Skelett, das für ein Projekt jenseits einer Million Zeilen zugeschnitten ist. Rund **neunmal schneller**, als denselben Stack selbst zusammenzustellen — und nichts hier telefoniert nach Hause: kein Anbieter, kein Abonnement, niemand, den man um Erlaubnis fragen muss. Der Server gehört Ihnen, der Code gehört Ihnen, **zu hundert Prozent**.',
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Gratis holen und skalieren' },
    image: 'homePage',
    imageAlt: 'SaaS-Startvorlage',
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
      { value: '×4', label: 'günstiger in der Entwicklung' },
      { value: '×9', label: 'schneller startklar' },
      { value: '×100', label: 'zuverlässiger im Produktivbetrieb' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: 'Open Code', tone: 'code' },
      { label: '82 Sprachen', tone: 'reach' },
      { label: 'SEO integriert', tone: 'reach' },
      { label: 'AIO agentisches Browsing', tone: 'reach' },
      { label: 'Eigene Datenbank', tone: 'data' },
      { label: 'Vektorsuche', tone: 'data' },
      { label: 'Wissensgraph', tone: 'data' },
      { label: 'Eigener Dateispeicher', tone: 'data' },
      { label: 'Autorisierung', tone: 'access' },
      { label: '16 Rollen', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Fractera-Architektur', tone: 'code' },
      { label: 'Parallele Routen · 8 Bereiche', tone: 'code' },
      { label: 'Next 16+', tone: 'code' },
      { label: '100+ weitere', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Ablauf',
    title: 'So funktioniert es',
    note: 'Von einem leeren Server bis zu Ihrem eigenen Code im Betrieb. Alles Folgende läuft auf Hardware, die Ihnen gehört.',
    steps: [
      { title: 'Den Server aufsetzen', text: 'Rollen Sie ihn mit dem [Installations-Roboter](https://www.fractera.ai/deployments/vps) von Fractera aus. Sie erhalten ein Betriebssystem, eine Startvorlage, das Bedienfeld, die Speicher und die Autorisierung — installiert und miteinander verbunden.' },
      { title: 'Dort entwickeln, wo Sie ohnehin arbeiten', text: 'Synchronisieren Sie mit GitHub, klonen Sie dann auf Ihren eigenen Rechner und starten Sie Claude Code oder Codex. Die Daten kommen weiterhin von Ihrem Server; der Code läuft in Ihrer eigenen IDE.' },
      { title: 'Pushen — und es rollt sich selbst aus', text: 'Beenden Sie die Arbeit auf dem lokalen Rechner und schicken Sie das Projekt zu GitHub. Das startet sofort eine neue Auslieferung auf Ihrem eigenen Server — und der Besucher sieht das neue Projekt.' },
    ],
  },
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Gratis holen und skalieren' },
  {
    kind: 'cards',
    badge: 'Architektur',
    title: 'Was dieses Projekt technisch ist',
    note: 'Drei Dinge, die man vor dem Bauen wissen sollte: was dieses Skelett ist, wo der Code tatsächlich geschrieben wird und was passiert, wenn das Projekt seine ersten hundert Seiten überschreitet.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'Dies ist keine fertige Website, sondern die Fractera-Architektur: ein Skelett trägt sowohl eine Landingpage als auch ein großes SaaS oder mehrstufige Automatisierung. Wachstum erfordert kein Neuschreiben — die Schichten für Daten, Autorisierung und Panel sind bereits getrennt, jede für eine Last ausgelegt, die Sie noch nicht haben.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Code wird hier nicht geschrieben. Ein Entwickler klont das Repository auf die eigene Maschine und arbeitet mit Claude Code, das die Anweisungen und Skills liest, die im Projekt selbst leben: Sie legen die Regeln fest, und automatische Prüfungen lassen ihren Bruch nicht zu. Der Server empfängt nur das Ergebnis und baut sich neu auf.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Das Skelett ist für ein Projekt gebaut, das die Millionen-Zeilen-Grenze überschreiten wird: Jede Entität hat ihren eigenen Ordner, die gemeinsame Schicht wächst nicht mit ihrer Anzahl, und Routen und Berechtigungen werden dort deklariert, wo sie durchgesetzt werden. Stabilität ist hier kein Versprechen, sondern eine Folge — eine neue Seite fügt einem zentralen Kern nichts hinzu.' }] },
    ],
  },
  {
    kind: 'quote',
    lead: 'Bereit für hohe Last',
    text:
      'Die verborgene Realität des Vibe Codings: Der größte Teil eines Projekts entsteht ohne Gedanken an hohe Last, an das Sparen von Datenbankabfragen, an Caching. Nicht weil Entwickler davon nichts wüssten — sondern weil es sehr schwer ist, diesen Standard innerhalb eines Frameworks zu halten. Zu viele Kleinigkeiten schieben eine Seite unbemerkt von der statischen Generierung ins dynamische Rendering. Und der Unterschied sind nicht fünf oder zehn Prozent: In manchen Fällen wächst die Last auf Ihrem Server um das Tausendfache, und Ihre Rechnung für Server und Plattformen wächst mit. Fractera ist auf einer langen Erfahrung gebaut: mehr als dreißig Jahre Webentwicklung. Alles, was mit hoher Last, Suchmaschinenoptimierung und Sparsamkeit bei Datenbanken zu tun hat, steht in der DNA dieses Projekts. Es ist sein Skelett, es ist seine Lebenskraft. Und sie gehört Ihnen kostenlos.',
    cite: 'Roma Armstrong · Gründer von Fractera',
  },
  {
    kind: 'noBill',
    badge: 'Unabhängigkeit',
    heading: 'Ein vollständig unabhängiger Raum',
    note: 'In einem gewöhnlichen Projekt sind das drei fremde Dienste: ihre Preise, ihre Bedingungen und ihre Erlaubnis, dass Ihr Projekt weiterläuft. Hier leben alle drei auf Ihrem eigenen Server.',
    items: [
      { vendor: 'Vercel', text: 'Sie zahlen nicht an', badge: { label: 'Hosting', tone: 'reach' } },
      { vendor: 'Neon', text: 'Sie zahlen nicht an', badge: { label: 'Datenbank', tone: 'data' } },
      { vendor: 'Clerk', text: 'Sie zahlen nicht an', badge: { label: 'Autorisierung', tone: 'access' } },
    ],
    title: 'Sie zahlen an niemanden',
    text: 'Sie hängen von niemandem ab. Das Projekt gehört ganz Ihnen.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'problemSolution',
    badge: 'Umziehen ist leicht',
    title: 'So ziehen Sie Ihr Projekt auf die Fractera-Architektur um',
    note: 'Ihr Projekt läuft bereits — auf Vercel oder anderswo. Und Sie zahlen: für das Hosting, für die Datenbank, für den Bilderspeicher, für die Anmeldung, für E-Mail. Jeder Dienst rechnet getrennt ab, und jede Rechnung wächst mit Ihnen. Der Umzug wirkt unmöglich — ist er nicht: Fractera nimmt Ihr Projekt auseinander und baut es auf der eigenen Architektur neu auf, auf Ihrem Server, wo das alles schon steht und nichts extra kostet.',
    demandLabel: 'Was Sie tun',
    answerLabel: 'Warum das bei Fractera funktioniert',
    items: [
      {
        title: 'Fractera aufsetzen',
        demand: 'Kaufen Sie einen Server — ab drei Euro im Monat. Kaufen Sie eine Domain — ab einem Dollar im Jahr. Starten Sie den Installations-Roboter und folgen Sie ihm: alles Weitere macht er allein.',
        answer: 'Drei Euro sind Ihre gesamte Hosting-Rechnung. Nicht im ersten Monat, nicht «bis Sie das Limit reißen» — überhaupt. Datenbank, Bilderspeicher, Anmeldung mit Passwort und E-Mail stehen bereits auf Ihrem Server und sind in denselben drei Euro enthalten. Es bleibt nichts, was separat zu zahlen wäre.',
      },
      {
        title: 'Den Umzugsmodus wählen',
        demand: 'Öffnen Sie im Panel den Reiter «Umzug zu Fractera» und geben Sie die Adresse Ihres Repositoriums an. Für die Zeit des Umzugs halten Sie es besser öffentlich — Ihres und das von Fractera; schließen können Sie beide jederzeit wieder. Speichern Sie den Modus.',
        answer: 'Das ist die einzige Einstellung, die Sie von Hand anfassen. Ab hier weiß das Projekt, dass es umzieht, und verhält sich entsprechend: es baut nicht von einer leeren Seite, es nimmt auseinander, was Sie schon geschrieben haben.',
      },
      {
        title: 'Dem Agenten Bescheid geben',
        demand: 'Öffnen Sie das Projekt in Ihrem Editor, auf Ihrem Rechner, dort wo Sie sonst arbeiten. Starten Sie es und sagen Sie dem Agenten, dass der Umzug beginnt. Mit gewöhnlichen Worten, wie einem Kollegen.',
        answer: 'Von da an liest er Ihr altes Projekt selbst: welche Architektur, welche Bibliotheken, was von was abhängt. Sie müssen nichts erklären und nichts erinnern — er schaut in den Code, nicht in Ihr Gedächtnis.',
      },
      {
        title: 'Den Plan in Schritten bekommen',
        demand: 'Nichts. Sehen Sie sich an, was herauskam: die riesige Aufgabe «Projekt umziehen» liegt in Schritten vor Ihnen, jeder mit Nummer und Ziel.',
        answer: 'Der Umzug hört auf, Angst zu machen, weil er aufhört, ein Klumpen zu sein. Sie sehen die Liste: was fertig ist, was gerade läuft, was danach kommt. Da ist kein Ort, auf halbem Weg steckenzubleiben und den Faden zu verlieren.',
      },
      {
        title: 'Das Skelett aufrichten',
        demand: 'Beantworten Sie Fragen zu Rechten: wer was in Ihrer Anwendung sehen und ändern darf. Es sind wenige, und alle handeln von Ihrem Produkt, nicht von Technik.',
        answer: 'Zuerst steht das Gerüst: Seitenadressen, Tabellen, Anmeldung, Repositorien — öffentlich für den Code, geschlossen für das, was nicht gezeigt werden darf. Ein Gerüst richtet man einmal auf, und das Projekt wächst darin, statt bei jeder neuen Funktion neu gebaut zu werden.',
      },
      {
        title: 'Die Funktionen ergänzen',
        demand: 'Gehen Sie die Schritte durch. Ein Schritt, eine Funktion: eine Seite, ein Formular, eine Zahlung, Briefe. Haken Sie Erledigtes ab und ergänzen Sie Neues, wann immer es Ihnen einfällt.',
        answer: 'Jeder Schritt wird geprüft, und man zeigt Ihnen, dass er läuft: nicht «der Build ist durch», sondern eine lebende Seite mit Ihrem Text. Darum wissen Sie immer, wo Sie stehen, und bleiben nie mit einem Projekt zurück, das «so ungefähr fertig» ist.',
      },
      {
        title: 'Die Daten mitnehmen',
        demand: 'Geben Sie dem Agenten Zugang zu Ihren Datenbanken. Er holt herüber, was sich angesammelt hat: Nutzer, Bestellungen, Texte, Bilder.',
        answer: 'Das ist der letzte Schritt. Danach haben Sie auf Ihrem Server eine vollständige, laufende Kopie des Projekts — mit Ihren Daten, Ihren Leuten und Ihrer Domain. Die alten Rechnungen können gekündigt werden: ab jetzt zahlen Sie Server und Domain, sonst nichts.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Zweiundachtzig Sprachen — bereit, bevor Sie sie brauchen',
    note: 'Sie alle sind im Produkt enthalten — Sie aktivieren jene, die Ihr Markt spricht. Statische Generierung, Such- und KI-Optimierung, Daten-Caching und Bereitschaft für hohe Last halten die Effizienz an der Spitze der Branche — und zwar gleichermaßen, ob Sie eine Sprache betreiben, mehrere oder alle zweiundachtzig.',
  },
],
  faq: [
    {
      q: 'Was kostet das, und gibt es versteckte Gebühren?',
      a: 'Versteckte Gebühren gibt es nicht, weil es niemanden zu bezahlen gibt: die Plattform ist offener Code, und alles, was Sie aufsetzen und benutzen, gehört zu hundert Prozent Ihnen. Ihre Ausgaben sind Ihr Server, Ihre Domain und Cloud-KI, falls Sie sie nutzen; die rechnen Sie selbst und zahlen direkt beim Anbieter. Wir nehmen kein Abo, keinen Anteil und keine Gebühr pro Nutzer.',
    },
    {
      q: 'Was ist der wichtigste Vorteil?',
      a: 'Verlässlichkeit — darauf ist gesetzt. Es gibt heute viele Wege, schnell eine Anwendung zusammenzustellen, und man sollte sich nichts vormachen: fast alle sind so gebaut, dass Sie vor allem für die eigenen Fehler zahlen. Eine effiziente Anwendung nützt nur Ihnen; wer Ihnen Dienste verkauft, hat ein Interesse daran, dass Sie möglichst viele einzelne kaufen und bezahlen. Teuer wird es später — Gesetzesverstöße und Bußgelder wegen des Orts der Daten, unvorhergesehene Abschaltungen, Sanktionen und schlicht der Verlust Ihrer Daten. Fractera schließt das, indem all das auf Ihrem eigenen Server bleibt.',
    },
    {
      q: 'Und wenn ich mehr brauche?',
      a: 'Ihr Hauptwerkzeug ist Ihr eigenes — Claude Code, Codex oder ein anderes — und es läuft auf Ihrem Rechner. Das Projekt skaliert weit: das Skelett ist auf Millionen Zeilen zugeschnitten und bleibt effizient. Und wenn Sie eine grundsätzliche Änderung der Architektur auf Ebene des Bedienpanels brauchen oder das Bauen der Anwendung weiterhin schwerfällt, schicken Sie eine Anfrage an admin@fractera.ai — ein Entwickler meldet sich und schlägt eine Lösung vor.',
    },
  ],
}

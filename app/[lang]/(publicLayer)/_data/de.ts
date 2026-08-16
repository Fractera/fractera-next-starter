import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const de: Partial<HomeCell> = {
  title: 'Dies ist der Starter Ihrer Anwendung',
  description: 'Sie läuft auf Ihrem eigenen Server und ist niemandem sonst rechenschaftspflichtig. Geben Sie ihr einen Namen im Kontrollzentrum — diese Zeile verschwindet dann.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Infrastruktur für agentisches Engineering' },
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
      { label: '82 Sprachen', tone: 'reach' },
      { label: 'SEO integriert', tone: 'reach' },
      { label: 'Eigene Datenbank', tone: 'data' },
      { label: 'Vektorsuche', tone: 'data' },
      { label: 'Wissensgraph', tone: 'data' },
      { label: 'Eigener Dateispeicher', tone: 'data' },
      { label: 'Autorisierung', tone: 'access' },
      { label: '{roles} Rollen', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Fractera-Architektur', tone: 'code' },
      { label: '100+ weitere', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Ablauf',
    title: 'So funktioniert es',
    note: 'Von einem leeren Server bis zu Ihrem eigenen Code im Betrieb. Alles Folgende läuft auf Hardware, die Ihnen gehört.',
    steps: [
      { title: 'Den Server aufsetzen', text: 'Rollen Sie ihn mit dem Installations-Roboter von Fractera aus. Sie erhalten ein Betriebssystem, eine Startvorlage, das Bedienfeld, die Speicher und die Autorisierung — installiert und miteinander verbunden.' },
      { title: 'Dort entwickeln, wo Sie ohnehin arbeiten', text: 'Synchronisieren Sie mit GitHub, klonen Sie dann auf Ihren eigenen Rechner und starten Sie Claude Code oder Codex. Die Daten kommen weiterhin von Ihrem Server; der Code läuft in Ihrer eigenen IDE.' },
      { title: 'Pushen — und es rollt sich selbst aus', text: 'Beenden Sie die Arbeit auf dem lokalen Rechner und schicken Sie das Projekt zu GitHub. Das startet sofort eine neue Auslieferung auf Ihrem eigenen Server — und der Besucher sieht das neue Projekt.' },
    ],
  },
  {
    kind: 'cards',
    badge: 'Erste Schritte',
    title: 'Wie Sie starten',
    note: 'Alles Folgende ist bereits installiert — Sie schalten es ein, Sie bauen es nicht. Links der Weg; rechts das, was Ihnen erspart, ihn zweimal zu gehen.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Sechs Schritte vom leeren Server' },
          {
            kind: 'olist',
            items: [
          'Öffnen Sie das Kontrollzentrum — alles zu diesem Server wird dort konfiguriert. [Kontrollzentrum]({admin}/{lang})',
          'Wählen Sie die Sprachen, in denen Ihre Anwendung ausgeliefert wird. [Sprachen]({admin}/{lang}/languages)',
          'Beschreiben Sie Ihr Projekt in den Einstellungen: Name, Beschreibung, Logo, SEO. [App-Einstellungen]({admin}/{lang}/app-settings)',
          'Verbinden Sie GitHub und übertragen Sie den Server-Code in Ihr Repository. [GitHub]({admin}/{lang}/github)',
          'Klonen Sie dieses Repository auf Ihre eigene Maschine, entwickeln Sie dort und pushen Sie zurück.',
          'Drücken Sie Deploy im Panel — der Server holt Ihren Commit und baut sich selbst neu auf. [Deployments]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Empfohlen vor dem Start' },
          { kind: 'p', text: 'Keines von beiden blockiert etwas. Beide ersparen Nacharbeit.' },
          {
            kind: 'list',
            items: [
              '**Ein OpenAI-Schlüssel.** Ohne ihn stellt das Quiz keine Fragen, und ohne Fälle weigert sich der Programmier-Agent zu bauen. Die Website läuft trotzdem — leer bleiben nur die Vektorsuche und der Wissensgraph. Einmal eingegeben; die Kosten gehen direkt an Ihren Modellanbieter. [OpenAI-Schlüssel]({admin}/{lang}/openai)',
              '**Eine eigene Domain.** Unter einer Zahlenadresse gibt es weder Zertifikat noch installierbare App — der Browser gewährt beides nur über eine sichere Verbindung. Ein späterer Umzug ändert jede Seitenadresse, vor der Indexierung ist er billiger. [Domain]({admin}/{lang}/domain)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Vor jedem Code',
    title: 'Quiz — sieben Fragen statt einer leeren Seite',
    note: 'Der teuerste Fehler eines Projekts passiert vor der ersten Codezeile: Es wird das Falsche gebaut. Nicht durch schlechtes Bauen, sondern weil «wo fange ich an» allein schwer zu beantworten ist. Quiz macht daraus ein Gespräch: Sie antworten, das Modell fragt weiter, und daraus wächst die Liste der Szenarien, aus der das Projekt dann gebaut wird.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'Der Keim' }, { kind: 'p', text: 'Sieben kurze Fragen: was das Produkt ist, für wen es ist, was eine Person davon mitnehmen soll. Antworten Sie in eigenen Worten — Diktat funktioniert. Alles Weitere wächst von hier aus, daher ergibt ein paar Sätze ein deutlich besseres Ergebnis als ein paar Wörter.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Das Gespräch' }, { kind: 'p', text: 'Danach eine Frage nach der anderen, in Ihrer Sprache. Es gibt ein Auto-Quiz: Das Modell stellt fünf neue Fragen und beantwortet sie selbst, um die Beschreibung zu vertiefen — aber alles, was es in Ihrem Namen erfunden hat, ist mit «Annahme» markiert, und Sie korrigieren es. Eine als Tatsache ausgegebene Vermutung würde später in den fertigen Szenarien auftauchen.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Die Szenarien' }, { kind: 'p', text: 'Das Gespräch wird zu nummerierten Fällen zusammengefasst: wer kommt, was er tut, was am Ende wahr sein muss. Sie lesen und bestätigen jeden einzeln. Ein ungelesener Fall bleibt eine Vermutung des Modells.' }] },
    ],
  },
  { kind: 'statement', text: 'Und das ist kein Rat, sondern eine Produktregel: Solange auch nur ein Fall unbestätigt ist, hält das Panel den Alarm aufrecht und der Coding-Agent weigert sich zu bauen. Auf einer ungelesenen Vermutung zu bauen kostet mehr, als gar nicht zu bauen.' },
  { kind: 'cta', href: '{admin}/{lang}/doc-use-cases', label: 'Quiz öffnen' },
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
  },
],
}

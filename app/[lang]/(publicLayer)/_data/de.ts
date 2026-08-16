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
    title: 'So funktioniert es',
    note: 'Von einem leeren Server bis zu Ihrem eigenen Code im Betrieb. Alles Folgende läuft auf Hardware, die Ihnen gehört.',
    steps: [
      { title: 'Den Server aufsetzen', text: 'Rollen Sie ihn mit dem Installations-Roboter von Fractera aus. Sie erhalten ein Betriebssystem, eine Startvorlage, das Bedienfeld, die Speicher und die Autorisierung — installiert und miteinander verbunden.' },
      { title: 'Dort entwickeln, wo Sie ohnehin arbeiten', text: 'Synchronisieren Sie mit GitHub, klonen Sie dann auf Ihren eigenen Rechner und starten Sie Claude Code oder Codex. Die Daten kommen weiterhin von Ihrem Server; der Code läuft in Ihrer eigenen IDE.' },
      { title: 'Pushen — und es rollt sich selbst aus', text: 'Beenden Sie die Arbeit auf dem lokalen Rechner und schicken Sie das Projekt zu GitHub. Das startet sofort eine neue Auslieferung auf Ihrem eigenen Server — und der Besucher sieht das neue Projekt.' },
    ],
  },
  {
    kind: 'panel',
    title: 'Wie Sie starten',
    children: [
      { kind: 'p', text: 'Sechs Schritte von einem leeren Server zu Ihrem eigenen Code in Produktion. Alles unten ist bereits installiert — Sie schalten es ein, Sie bauen es nicht.' },
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
    kind: 'panel',
    tone: 'warn',
    title: 'Empfohlen vor dem Start',
    children: [
      { kind: 'p', text: 'Keines der beiden blockiert etwas. Beide ersparen Nacharbeit: das erste schaltet die denkende Hälfte des Produkts ein, das zweite ändert die Adresse jeder Seite.' },
      {
        kind: 'list',
        items: [
          '**Ein OpenAI-Schlüssel.** Ohne Schlüssel stellt das Quiz keine Fragen, und ohne Quiz gibt es nichts, um Ihre Nutzungsfälle zu beschreiben — daher weigert sich der Coding-Agent zu bauen. Deshalb behandelt das Panel den Schlüssel als ROTE Anforderung, bis die ersten Fälle existieren, und danach als bernsteinfarbenen Vorschlag: Die Seite funktioniert auch ohne, nur Vektorsuche und Wissensgraph bleiben leer. Der Schlüssel wird einmal eingegeben, die Kosten gehen direkt an Ihren Modellanbieter. [OpenAI-Schlüssel]({admin}/{lang}/openai)',
          '**Ihre eigene Domain.** Solange die Seite unter einer numerischen Adresse läuft, hat sie weder Zertifikat noch installierbare App — der Browser gewährt beides nur über eine sichere Verbindung. Der Umzug auf eine Domain ändert die Adresse jeder Seite, deshalb ist es günstiger, das zu tun, bevor sie indexiert wurden. [Domain]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Vor jedem Code',
    title: 'Quiz — sieben Fragen statt einer leeren Seite',
    children: [
      { kind: 'p', text: 'Der teuerste Fehler eines Projekts passiert vor der ersten Codezeile: Es wird das Falsche gebaut. Nicht durch schlechtes Bauen, sondern weil «wo fange ich an» allein schwer zu beantworten ist. Quiz macht daraus ein Gespräch: Sie antworten, das Modell fragt weiter, und daraus wächst die Liste der Szenarien, aus der das Projekt dann gebaut wird.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'Der Keim' }, { kind: 'p', text: 'Sieben kurze Fragen: was das Produkt ist, für wen es ist, was eine Person davon mitnehmen soll. Antworten Sie in eigenen Worten — Diktat funktioniert. Alles Weitere wächst von hier aus, daher ergibt ein paar Sätze ein deutlich besseres Ergebnis als ein paar Wörter.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Das Gespräch' }, { kind: 'p', text: 'Danach eine Frage nach der anderen, in Ihrer Sprache. Es gibt ein Auto-Quiz: Das Modell stellt fünf neue Fragen und beantwortet sie selbst, um die Beschreibung zu vertiefen — aber alles, was es in Ihrem Namen erfunden hat, ist mit «Annahme» markiert, und Sie korrigieren es. Eine als Tatsache ausgegebene Vermutung würde später in den fertigen Szenarien auftauchen.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Die Szenarien' }, { kind: 'p', text: 'Das Gespräch wird zu nummerierten Fällen zusammengefasst: wer kommt, was er tut, was am Ende wahr sein muss. Sie lesen und bestätigen jeden einzeln. Ein ungelesener Fall bleibt eine Vermutung des Modells.' }] },
        ],
      },
      { kind: 'quote', text: 'Und das ist kein Rat, sondern eine Produktregel: Solange auch nur ein Fall unbestätigt ist, hält das Panel den Alarm aufrecht und der Coding-Agent weigert sich zu bauen. Auf einer ungelesenen Vermutung zu bauen kostet mehr, als gar nicht zu bauen.' },
      { kind: 'cta', text: 'Quiz — sieben Fragen statt einer leeren Seite', href: '{admin}/{lang}/doc-use-cases', label: 'Quiz öffnen' },
    ],
  },
  {
    kind: 'panel',
    title: 'Was dieses Projekt technisch ist',
    children: [
      { kind: 'p', text: 'Dies ist keine fertige Website, sondern die Fractera-Architektur: ein Skelett trägt sowohl eine Landingpage als auch ein großes SaaS oder mehrstufige Automatisierung. Wachstum erfordert kein Neuschreiben — die Schichten für Daten, Autorisierung und Panel sind bereits getrennt, jede für eine Last ausgelegt, die Sie noch nicht haben.' },
      { kind: 'p', text: 'Code wird hier nicht geschrieben. Ein Entwickler klont das Repository auf die eigene Maschine und arbeitet mit Claude Code, das die Anweisungen und Skills liest, die im Projekt selbst leben: Sie legen die Regeln fest, und automatische Prüfungen lassen ihren Bruch nicht zu. Der Server empfängt nur das Ergebnis und baut sich neu auf.' },
      { kind: 'p', text: 'Das Skelett ist für ein Projekt gebaut, das die Millionen-Zeilen-Grenze überschreiten wird: Jede Entität hat ihren eigenen Ordner, die gemeinsame Schicht wächst nicht mit ihrer Anzahl, und Routen und Berechtigungen werden dort deklariert, wo sie durchgesetzt werden. Stabilität ist hier kein Versprechen, sondern eine Folge — eine neue Seite fügt einem zentralen Kern nichts hinzu.' },
    ],
  },
  {
    kind: 'noBill',
    items: [
      { vendor: 'Vercel', text: 'Sie zahlen nicht an' },
      { vendor: 'Neon', text: 'Sie zahlen nicht an' },
      { vendor: 'Clerk', text: 'Sie zahlen nicht an' },
    ],
    title: 'Sie zahlen an niemanden',
    text: 'Sie hängen von niemandem ab. Das Projekt gehört ganz Ihnen.',
  },
],
}

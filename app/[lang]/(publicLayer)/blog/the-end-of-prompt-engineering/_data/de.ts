import type { BlogOverride } from '../../_lib/types'

// Deutsche Übersetzung. Ton des Autors: direkt, unakademisch, an den Leser
// gerichtet.
// Produktbegriffe und Eigennamen werden nicht übersetzt (Claude Code,
// Anthropic, CI, LLM).
// Die Diagramme wurden zusammen mit dem Text übersetzt: ein englisches
// Diagramm in einem deutschen Artikel liest sich wie eine halbe Übersetzung.

const POST_1_LINEAR = `du schreibst einen Prompt  ─▶  die KI schreibt Code  ─▶  du findest den Bug  ─▶  du korrigierst den Prompt  ─┐
     ▲                                                                          │
     └─────────────────────────  wieder von Hand  ◀─────────────────────────────┘`

const POST_1_LOOP = `du legst das Ziel fest
     │
     ▼
die KI schreibt Code  ─▶  CI führt jede Prüfung aus  ─▶  grün?  ─▶  ✦ ausgeliefert
     ▲                      │
     │                      ▼  (rot)
     └──  die KI liest die Logs und stellt sich selbst einen neuen Prompt`

export const de: BlogOverride = {
  title: 'Prompt Engineering ist tot. Lang lebe Loop Engineering.',
  subtitle:
    'Warum der Leiter von Claude Code bei Anthropic gerade das Ende der Ära des „KI-Flüsterers" signalisiert hat — und was als Nächstes kommt.',
  description:
    'Boris Cherny, der Claude Code bei Anthropic leitet, sagt, er prompte Claude nicht mehr — er schreibt Loops. Ein Blick in das Ende des Prompt Engineering und den Aufstieg des Loop Engineering: agentische KI-Workflows, autonome, selbstkorrigierende Agenten, warum der Verifizierer wichtiger ist als der Prompt, und wie derselbe Loop in einen Arbeitsbereich eingebaut ist, den du besitzt — maschinell prüfbare Tore im Repository, ein Gedächtnis, das die Sitzung überdauert, und ein Kontrollzentrum, das baut und zurückrollt.',
  excerpt:
    'Der Ingenieur, der Claude Code bei Anthropic leitet, hat gerade zugegeben, dass er das Modell nicht mehr promptet — er schreibt Loops, die es für ihn tun. Warum das die Ära des „KI-Flüsterers" beendet, und wie wir daraus eine Produktionsarchitektur gemacht haben.',
  heroCaption: 'Der LinkedIn-Beitrag, der das ausgelöst hat — Boris Cherny übers Schreiben von Loops, nicht Prompts.',
  blocks: [
    { kind: 'h2', text: 'Das Zitat, das die Illusion zerschlug' },
    {
      kind: 'p',
      text: 'Vor ein paar Tagen sorgte ein einziges Zitat von **Boris Cherny** — dem Ingenieur, der die Entwicklung von **Claude Code** bei **Anthropic** leitet — still für Aufsehen in der Software-Community.',
    },
    {
      kind: 'p',
      text: 'Auf einem öffentlichen Panel gab Cherny einen Einblick, wie die Menschen, die die weltweit ausgefeilteste Programmier-KI bauen, tatsächlich mit ihren eigenen Modellen arbeiten. Was er sagte, stellte nicht nur den Status quo infrage — es erklärte eine ganze aufstrebende Disziplin für obsolet:',
    },
    {
      kind: 'quote',
      text: 'Ich prompte Claude nicht mehr. Ich habe Loops laufen, die Claude prompten und herausfinden, was zu tun ist. Meine Aufgabe ist es, Loops zu schreiben.',
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: 'Lass das sacken.' },
    {
      kind: 'p',
      text: 'Der Mann mit beiden Händen am Steuer des besten Entwicklermodells der Welt sagt dir, dass er die Hände vom Steuer genommen hat. Er sitzt nicht in einem Chat-Fenster und feilt am perfekten Absatz von Anweisungen. Er schreibt Code, der die KI zwingt, mit sich selbst zu sprechen, ihre eigenen Fehler zu beurteilen und sie innerhalb eines geschlossenen, autonomen Kreislaufs zu korrigieren. Er baut die Maschine, die das Modell steuert — und lässt sie dann fahren.',
    },
    {
      kind: 'p',
      text: 'Wenn du immer noch deine Tage damit verbringst, Prompts zu optimieren, um dem LLM den richtigen Codeblock zu entlocken, ist seine Botschaft brutal klar: **du optimierst eine Welt, die es schon nicht mehr gibt.**',
    },

    { kind: 'h2', text: 'Der Paradigmenwechsel: vom Mikromanagement zur Systemarchitektur' },
    {
      kind: 'p',
      text: 'Um zu verstehen, warum dies ein tektonischer Wandel ist, schau dir an, wie sich unsere Beziehung zur generativen KI in nur ein paar Jahren entwickelt hat.',
    },
    { kind: 'h3', text: 'Phase 1 — Der lineare Prompt (der menschliche Engpass)' },
    {
      kind: 'p',
      text: 'Bis vor Kurzem war die gesamte Branche besessen von **Prompt Engineering**. Wir behandelten LLMs wie brillante, aber leicht abzulenkende Junior-Entwickler. Der Arbeitsablauf war linear, fragil und vollständig manuell:',
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: 'In diesem Paradigma **ist der Mensch der Engpass.** Du schreibst einen Prompt, liest die Ausgabe, entdeckst einen Syntaxfehler, fügst ihn wieder in den Chat ein und betest, dass das Modell den Kontext fünf Schritte später nicht vergessen hat. Es fühlt sich produktiv an. Es ist erschöpfendes, nicht skalierbares Mikromanagement — und es kann definitiv nicht laufen, während du schläfst.',
    },
    { kind: 'h3', text: 'Phase 2 — Loop Engineering (der autonome Kreislauf)' },
    {
      kind: 'p',
      text: 'Was Cherny beschreibt, ist **Loop Engineering** — agentische Workflows, bei denen der Mensch vollständig aus der Ausführungsschleife heraustritt. Du hörst auf, das Auto zu fahren. Du baust die Strecke und lässt die Maschine die Runden drehen.',
    },
    {
      kind: 'p',
      text: 'Statt einen Prompt zu schreiben, um ein Problem zu lösen, schreibst du einen programmatischen **Loop**, der die KI in einen automatisierten Zyklus aus Ausführung und Verifikation einbettet:',
    },
    {
      kind: 'olist',
      items: [
        '**Das Ziel.** Ein Mensch setzt ein einziges übergeordnetes Ziel — „baue diesen API-Endpunkt und erreiche 98 % Testabdeckung".',
        '**Die Aktion.** Die KI erstellt einen ersten Entwurf des Codes.',
        '**Die Verifikation.** Eine automatisierte Umgebung — Compiler, Linter, Unit-Tests, deine CI — führt den Code aus und findet jeden Fehler.',
        '**Die Selbstkorrektur.** Bei einem Fehlschlag erfasst das System den Stack-Trace, gibt ihn der KI als neue Anweisung zurück und befiehlt ihr, es erneut zu versuchen.',
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: 'Der Loop läuft mit Maschinengeschwindigkeit, arbeitet Dutzende Iterationen ab, korrigiert und heilt sich selbst, bis die Verifikationskriterien erfüllt sind. Du hast nicht eine einzige Rückfrage getippt. Du hast die Prompts nicht geschrieben — du hast die Strecke gebaut, und das Modell hat jede Runde selbst gedreht.',
    },

    { kind: 'h2', text: 'Die eigentliche Fähigkeit ist nicht, Code zu schreiben. Es ist, den Richter zu schreiben.' },
    {
      kind: 'p',
      text: 'Hier ist der Teil, den fast jeder übersieht — und darum geht es beim ganzen Spiel. Der schwierige Teil eines Loops ist **nicht**, den Code zu generieren. Modelle sind darin bereits erschreckend gut. Der schwierige Teil ist **das, was entscheidet, ob der Code taugt.**',
    },
    {
      kind: 'p',
      text: 'Gib dem Loop einen starken, gnadenlosen Verifizierer — echte Tests, statische Analyse, einen Compiler, der sich weigert zu lügen — und er konvergiert zu etwas, das wirklich funktioniert. Gib ihm einen schwachen, und derselbe Loop wird fröhlich einen endlosen Strom selbstsicheren, wunderschön formatierten Mülls produzieren, der sich seinen Weg zu einem grünen Häkchen halluziniert, das nichts bedeutet.',
    },
    {
      kind: 'p',
      text: 'Die Fähigkeit des nächsten Jahrzehnts ist also nicht die Kunst des Promptens. Es ist **das Design der Verifikation** — die kugelsicheren Validierungssysteme, die es einer KI erlauben, sicher mit sich selbst zu sprechen, ohne von einer Klippe zu stürzen. Das ist eine schwierigere, seltenere und weitaus wertvollere Art von Ingenieurskunst als die richtigen Worte zu finden.',
    },

    { kind: 'h2', text: 'Von der Philosophie zur Produktion: wie wir den Loop entworfen haben' },
    {
      kind: 'p',
      text: 'Während der Rest der Tech-Welt Chernys Zitat in den sozialen Medien zerlegt, ist die eigentliche Herausforderung wenig glamourös: **wie baut man eine Loop-Engineering-Infrastruktur, die in der Produktion tatsächlich funktioniert — außerhalb von Anthropics internen Laboren?**',
    },
    {
      kind: 'p',
      text: 'Schließe einen Loop um ein einzelnes Modell, und du stößt schnell an die Wände der realen Welt: Verschlechterung des Kontextfensters, halluzinatorische Todesspiralen und kein Gedächtnis über ein Projekt hinweg. Bei [%SITE%](/de) haben wir das letzte Jahr damit verbracht, Chernys Philosophie nicht als Vorhersage, sondern als **architektonischen Bauplan** zu behandeln — und den Loop gebaut, auf dem dieser Arbeitsbereich läuft.',
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: 'Der Entwicklungs-Loop: der Besitzer setzt ein Ziel, der Agent bearbeitet das Repository, maschinelle Prüfungen verifizieren es, Fehlschläge kehren als neue Anweisungen zum Agenten zurück, und das Kontrollzentrum baut, protokolliert und kann zurückrollen',
      caption: 'Der Loop, so wie er tatsächlich verdrahtet ist: ein Agent in deinem Repository, Prüfungen, die nicht lügen können, und ein Panel, das den Kreislauf schließt.',
    },
    { kind: 'h3', text: 'Die Anatomie eines produktionsreifen Loops' },
    {
      kind: 'p',
      text: 'Um Loops für echte Software tauglich zu machen, muss man aufhören, das Modell zu bewundern, und anfangen, die drei wenig glamourösen Dinge darum herum zu bauen — den Richter, das Gedächtnis und die Hand, die ausliefert:',
    },
    {
      kind: 'list',
      items: [
        '**Ein Verifizierer, der sich nicht beschwatzen lässt.** Der Richter ist kein zweites Modell mit einer Meinung; es ist eine Sammlung von Skripten, die den Build scheitern lassen. Existieren die Sprachsignale auf jeder öffentlichen Seite? Hat jeder Beitrag den Markdown-Zwilling, den ein KI-Leser braucht? Wird ein Bild referenziert, das niemand eingecheckt hat? Jede Prüfung existiert, weil genau dieser Fehler einmal ausgeliefert wurde, und jede antwortet mit einem Exit-Code statt mit einem Absatz.',
        '**Ein Gedächtnis, das die Sitzung überlebt.** Der Amnesie-Effekt ist real: fünfzehn Schleifen an einem hartnäckigen Bug, und der Agent verliert die Architektur aus den Augen. Hier ist das Gedächtnis kein Dienst, der offline sein kann — es sind Dateien neben dem Code, die mit dem Repository reisen: die Arbeitsanweisung, die Lektionen, die genau in dem Moment angehängt werden, in dem der Besitzer etwas korrigiert, die Liste der Antipatterns, die bestätigten Anwendungsfälle. Eine neue Sitzung beginnt damit, sie zu lesen, sodass die fünfzehnte Iteration weiß, was die erste gelernt hat.',
        '**Ein Schlussakt, der nicht dem Agenten gehört.** Der Loop endet im Kontrollzentrum: es baut das Projekt, führt ein Protokoll der Deployments und kann zum letzten funktionierenden Build zurückkehren. Einstellungen, Texte und Bilder ändern sich dort ganz ohne Neubau — sodass der Loop nie gebeten wird, etwas zu lösen, das nie ein Code-Problem war.',
      ],
    },
    {
      kind: 'p',
      text: 'Beachte, was **nicht** auf dieser Liste steht: ein Schwarm von Modellen, die sich gegenseitig überwachen. Das war unsere erste Architektur, und wir haben sie entfernt. Orchestrierung ist der aufregendste Teil eines agentischen Diagramms und der am wenigsten tragende Teil eines funktionierenden — ein schwacher Richter wird nicht durch eine zweite Meinung repariert, und ein starker braucht selten eine.',
    },

    { kind: 'h2', text: 'Die neue Stellenbeschreibung des Software-Ingenieurs' },
    {
      kind: 'p',
      text: 'Wir bewegen uns weg vom Code schreiben, vorbei am Prompt schreiben, und direkt hinein in **das Bauen kognitiver Pipelines.** Das Handwerk ist nicht mehr die Anweisung — es ist das System, in dem die Anweisung läuft.',
    },
    {
      kind: 'p',
      text: 'Und es ist nicht umsonst. Zwei neue Kosten kommen mit den Loops. **Verständnisschulden:** wenn ein Agent eine Datei dreihundert Mal hinter den Kulissen schreibt und umschreibt, erodiert dein Verständnis deiner eigenen Codebasis leise — sie funktioniert, du bist dir nur nicht mehr sicher, warum. Und **rohe Rechenleistung:** ein Loop kann echtes Geld in Tokens verbrennen, während er einem einzigen Bug über hundert stille Versuche hinweg hinterherjagt. Die Ingenieure, die diese Ära gewinnen, behandeln Kosten-gegen-Qualität als bewusste Designentscheidung, nicht als Überraschung auf der Rechnung.',
    },
    {
      kind: 'cta',
      text: 'Diese Website ist einer dieser Loops: Die Seiten, die du liest, sind statische Dateien, die eine Prüfung erst ausgeliefert hat, nachdem sie ihre Sprachsignale, ihren Markdown-Zwilling und ihren Platz in der Sitemap trugen.',
      href: '/de',
      label: 'Sieh dir den Arbeitsbereich an, auf dem sie läuft',
    },
    {
      kind: 'p',
      text: 'Die Ära des Prompt Engineering liegt offiziell hinter uns. Die einzige verbleibende Frage ist die, die Cherny sich selbst schon beantwortet hat: **versuchst du noch, mit deiner KI zu sprechen — oder baust du bereits die Loops, die sie laufen lassen?**',
    },
    {
      kind: 'note',
      text: 'Quelle: ein weit verbreiteter LinkedIn-Beitrag von Guillermo Flor, der Boris Chernys Bemerkungen ans Licht brachte. Das Zitat wird so wiedergegeben, wie es kursierte; die Architektur und die Analyse sind unsere eigenen.',
    },
  ],
  faq: [
    {
      q: 'Was ist „Loop Engineering" und warum ersetzt es Prompt Engineering?',
      a: 'Loop Engineering bedeutet, automatisierte Workflows zu schreiben, die die KI prompten, ihre Ausgabe durch einen Verifizierer laufen lassen (Tests, CI, ein Compiler), Fehlschläge als neue Anweisungen zurückgeben und wiederholen — bis das Ergebnis korrekt ist. Boris Cherny, der Claude Code bei Anthropic leitet, sagte, er erstelle Prompts nicht mehr von Hand: er schreibt die Loops, die es für ihn tun. Die entscheidende Erkenntnis ist, dass der Engpass nie der Prompt war — es war der Mensch im Feedback-Zyklus.',
    },
    {
      q: 'Wie ist der Entwicklungs-Loop hier, in der Produktion, verdrahtet?',
      a: 'Ein Coding-Agent arbeitet in deinem eigenen Repository, auf deiner eigenen Maschine, mit der Arbeitsanweisung des Projekts neben dem Code. Der Verifizierer ist eine Reihe von Prüfungen, die bei jedem Build laufen und ihn scheitern lassen: Sprachsignale auf jeder öffentlichen Seite, ein Markdown-Zwilling für jede veröffentlichte Seite, kein referenziertes Bild, das nie eingecheckt wurde, kein Wörterbuch, dem ein Schlüssel fehlt. Ein Fehlschlag kehrt als neue Anweisung zum Agenten zurück, und der Loop wiederholt sich. Das Kontrollzentrum schließt den Kreislauf — es baut das Projekt, protokolliert jedes Deployment und kann zum letzten funktionierenden Build zurückkehren.',
    },
    {
      q: 'Muss ich Code schreiben, um diesen Loop laufen zu lassen?',
      a: 'Nicht für das meiste, was eine Website tatsächlich ändert. Der Name, die Beschreibung, die Bilder, die Sprachen, die Analyse und die Texte der Einstellungen leben im Kontrollzentrum und werden ohne Neubau angewendet — das sind Daten, kein Code. Codeänderungen sind das, was der Agent in deinem Repository tut; du liest und genehmigst sie, und das Panel baut das Ergebnis. Die ehrliche Grenze ist diese: niemand verspricht dir, dass du nie einen Diff anschaust — dir wird versprochen, dass du nie den Build von Hand ausführen musst, und dass ein kaputter mit einem Klick zurückgerollt werden kann.',
    },
  ],
}

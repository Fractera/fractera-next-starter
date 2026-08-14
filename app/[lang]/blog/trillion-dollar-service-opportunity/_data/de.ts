import type { BlogOverride } from '../../_lib/types'

// Deutsche Fassung. Ton des Autors (Roma Armstrong): persönlich, direkt,
// inspirierend. Der obligatorische Wurzel-Anker "Agentic Engineering
// Infrastructure" (unübersetzter Begriff) → /de.
export const de: BlogOverride = {
  title: 'Die Billionen-Dollar-Chance ist der Salon nebenan',
  subtitle:
    'Elon Musk sprach über Raumfahrt, KI und Autos. Der Satz, der bei mir hängen blieb, war einfacher: Die meisten Unternehmen der Welt haben immer noch keine API. Das ist die Nische, die ich deshalb gefunden habe.',
  description:
    'Warum das größte kurzfristige Geld in der KI nicht in einem Einhorn-Startup steckt — sondern im Friseursalon, in der Klinik, in der Zahnarztpraxis nebenan. Das Problem der Nichterscheiner, die Unternehmen ohne Website und ohne CRM, und wie ein selbst gehosteter Arbeitsbereich fast jedem erlaubt, sie zu automatisieren, ohne zuerst einen ganzen Stack zusammenzubauen.',
  excerpt:
    'Elon Musk sagte, die meisten Unternehmen hätten immer noch keine API — sie laufen über ein Telefon, oder nicht einmal das. Ich habe Dutzende Gespräche geführt, um dieser Idee nachzugehen, und eine Nische gefunden, die offen sichtbar war: der Salon, die Klinik, die Zahnarztpraxis nebenan.',
  blocks: [
    {
      kind: 'p',
      text:
        'Das ist ein etwas ungewöhnlicher Beitrag, weil er mit jemand anderem beginnt. Das Elon-Musk-Interview oben hat meine Aufmerksamkeit erregt — er sprach über Raumfahrt, über künstliche Intelligenz, über Autos. Aber der Moment, der mich am meisten inspiriert hat, war ein leiser. Er sagte, so sehr sich die moderne Welt auch anfühlt, als wäre bereits alles erfunden, jede Website gebaut, jede App veröffentlicht, jeder Geschäftsprozess automatisiert — die überwältigende Mehrheit der Unternehmen auf der Welt hat nicht einmal eine API. Sie laufen über ein Telefon. Manche laufen nicht einmal darüber.',
    },
    {
      kind: 'quote',
      text:
        'Wenn KI einfach das übernehmen kann, was bereits an das ausgelagerte Kundenservice-Unternehmen gegeben wird, das sie schon nutzen, und Kundenservice mit den Apps macht, die sie schon nutzen, dann kann man enorme Fortschritte im Kundenservice erzielen, der, glaube ich, etwa 1 % der Weltwirtschaft ausmacht. Insgesamt fast eine Billion Dollar, allein für Kundenservice.',
      cite: 'Elon Musk · Dwarkesh-Patel-Interview, Februar 2026',
    },
    {
      kind: 'p',
      text:
        'Lies das noch einmal mit den Augen eines Erbauers. Diese Billion steckt nicht in einem weiteren sozialen Netzwerk oder einem weiteren KI-Wrapper — sie steckt in gewöhnlichen Unternehmen, die nie digital geworden sind. Und die Hürde war nie die Idee; es war der Bau. Ein Team einstellen, Infrastruktur aufsetzen, Monat für Monat für einen Stapel Cloud-Dienste bezahlen. Genau diese Hürde beseitigt ein selbst gehosteter Arbeitsbereich — deshalb ist mir dieser leise Satz geblieben, nicht die Raketen.',
    },

    { kind: 'h2', text: 'Alle haben Programmieren gelernt. Die Straße sieht gleich aus.' },
    {
      kind: 'p',
      text:
        'Aus vielen Gesprächen mit Partnern sehe ich immer wieder zwei Szenarien. Auf der einen Seite eine Flut von Entwicklern — und sogar Menschen, die nie Entwickler waren, die früher im Marketing oder Content-Management arbeiteten — haben plötzlich, in nur einem Jahr, programmieren gelernt. Alle fingen an zu bauen. Es gibt sehr viele Projekte, und viele davon sind wirklich interessant. Und in der realen Welt? In der realen Welt ist alles genau gleich geblieben.',
    },
    {
      kind: 'p',
      text:
        'Es zeigt sich also, dass einige von uns eine wunderbare Möglichkeit gefunden haben, sich selbst zu erfreuen — den Dopaminschub neuen Wissens. Aber es ist auch an der Zeit, damit Geld zu verdienen. Wohin verlagerst du also deinen Fokus?',
    },
    {
      kind: 'founder',
      text:
        'Das Problem: Wir können die Zukunft nicht vorhersagen. Besonders jetzt, wo sich Markt und Technologie mit außergewöhnlicher Geschwindigkeit zu verändern begonnen haben. Sich an Veränderung anzupassen ist ein quälender Prozess des Strategiewechsels.',
    },

    { kind: 'h2', text: 'Ich habe nach der Antwort gesucht. Ich habe einen Friseursalon gefunden.' },
    {
      kind: 'p',
      text:
        'Nachdem ich dieses Video im Detail studiert und mehrere Dutzend Gespräche geführt hatte, um die Antwort auf diese Frage zu bestätigen, fand ich eine sehr interessante Geschäftsnische: Schönheitssalons und nicht-chirurgische Kosmetologie, medizinische Zentren, Zahnarztpraxen. Trotz einer Fülle an Automatisierung und CRM-Systemen stoßen sie erstaunlich oft auf ein Problem: Ein Kunde hinterlässt eine Anfrage, bucht einen Termin — und erscheint dann nicht. Wenn der Manager anruft — meist genau zu der Stunde, zu der der Termin beginnen sollte — antworten Kunden oft: „Oh, wir haben es vergessen. Warum habt ihr uns nicht daran erinnert?"',
    },
    {
      kind: 'p',
      text:
        'Natürlich gibt es reichlich fertige Lösungen, die man installieren kann. Aber es gibt noch mehr Kunden, die nie eine bekommen haben — und viele von ihnen haben keine Website, viele haben überhaupt kein CRM.',
    },

    { kind: 'h2', text: 'Genau dafür ist ein Arbeitsbereich wie dieser da.' },
    {
      kind: 'p',
      text:
        '[%SITE%](/de) ist ein selbst gehosteter Arbeitsbereich für agentisches Engineering, genau für solche Szenarien gebaut. Er bringt die Teile mit, die ein solches Unternehmen sonst separat kaufen müsste: eine eigene Datenbank mit Tabellen, Dateispeicher, Sprache, die in Text umgewandelt wird, einen Kanal, um einen Kunden über einen Messenger zu erreichen, Autorisierung mit Rollen und eine öffentliche Website, die eine Suchmaschine tatsächlich lesen kann. Ein Unternehmer kann so viele Ideen haben, wie er möchte — die Bausteine stehen bereits im Regal.',
    },
    {
      kind: 'p',
      text:
        'Der Vorteil ist, dass die Umsetzung solcher Ideen früher bedeutete, unglaublich lange mit einem Produktteam zu arbeiten, dann Programmierer einzustellen, dann endlos darüber nachzudenken, wie alles funktioniert — oder teure Dienste für die eigenen Bedürfnisse zu kaufen. Jetzt ist all das einfach. Dank agentischem Engineering kann fast jeder ein Telefon in die Hand nehmen und beschreiben, wie er sein Geschäft optimieren möchte, und es selbst tun oder mit Hilfe von jemandem, der sich schon ein wenig damit auskennt.',
    },
    {
      kind: 'p',
      text:
        'Es befreit dich auch davon, sich merken zu müssen, welche Dienste du eigentlich bezahlen sollst. Die meisten Cloud-Dienste, die sich in regelmäßige Zahlungen verwandeln und den Löwenanteil deiner Kosten ausmachen — eine Datenbank, Speicher, ein CRM-Abonnement —, sind bereits gewöhnliche Funktionen deiner eigenen Anwendung, die auf deinem eigenen Server läuft. Und die alltäglichen Änderungen sind überhaupt kein Deployment: Name, Texte, Bilder und Sprachen werden in einem Kontrollzentrum bearbeitet und wirken sich ohne Neubau aus, während der Code in einem Repository liegt, das dir gehört.',
    },

    { kind: 'h2', text: 'Einer von vielen. Man findet sie jeden Tag.' },
    {
      kind: 'p',
      text:
        'Das obige Beispiel ist eines von vielen. Man kann solche Fälle buchstäblich jeden Tag finden und Geld damit verdienen, sie umzusetzen — oder man kann die Umsetzung neuer Ideen im eigenen Unternehmen ergänzen, weil es jetzt praktisch kostenlos ist. So war es vorher nie.',
    },
    {
      kind: 'p',
      text:
        'Und obwohl es fast unmöglich erscheint, eine neue Nische für ein Einhorn-Startup zu finden — vielleicht lohnt es sich nicht, darüber nachzudenken. Statt davon zu träumen, ein Einhorn zu bauen, kannst du einfach den Friseursalon nebenan automatisieren, oder den Kosmetiksalon, oder die Autowerkstatt. All jene, mit denen du schon lange in Kontakt bist. All jene, die dir schon vertrauen. Vielleicht ist es Zeit, es zu versuchen?',
    },
  ],
  faq: [
    {
      q: 'Für welche Art von Unternehmen eignet sich das am besten?',
      a: 'Lokale Dienstleistungsunternehmen mit Terminen und Stammkunden — Salons, nicht-chirurgische Kosmetologie, Kliniken, Zahnarztpraxen, Autowerkstätten — besonders jene ohne Website oder CRM und mit einem wiederkehrenden Problem an Nichterscheinern.',
    },
    {
      q: 'Zahle ich separat für eine Datenbank, Speicher, ein CRM-Abonnement?',
      a: 'Nein. Das sind gewöhnliche eingebaute Teile deiner eigenen Anwendung auf deinem eigenen Server, keine Drittanbieter-Abonnements, die monatlich abgerechnet werden. Was du bezahlst, ist der Server selbst.',
    },
    {
      q: 'Muss ich Entwickler sein?',
      a: 'Nicht für die Dinge, die ein Unternehmen am häufigsten ändert: Namen, Texte, Preise, Bilder und Sprachen werden im Kontrollzentrum bearbeitet und wirken sich ohne Neubau aus. Etwas Neues zu bauen ist Aufgabe eines Coding-Agenten, der in deinem Repository arbeitet — entweder deinem eigenen oder dem von jemandem, der sich schon ein wenig damit auskennt. Server, KI-Modell und Domain sind bereits für dich verbunden.',
    },
  ],
}

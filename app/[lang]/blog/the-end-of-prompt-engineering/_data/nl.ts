import type { BlogOverride } from '../../_lib/types'

// Nederlandse vertaling. Toon van de auteur: direct, geen academisch
// register, gericht op de lezer.
// Producttermen en eigennamen worden niet vertaald (Claude Code, Anthropic,
// CI, LLM).
// De diagrammen zijn samen met de tekst vertaald: een Engels diagram midden
// in een Nederlands artikel leest als een halve vertaling.

const POST_1_LINEAR = `jij prompt  ─▶  AI schrijft code  ─▶  jij vindt de bug  ─▶  jij verbetert de prompt  ─┐
     ▲                                                                          │
     └─────────────────────────  weer met de hand  ◀─────────────────────────────┘`

const POST_1_LOOP = `jij stelt het doel
     │
     ▼
AI schrijft code  ─▶  CI draait elke controle  ─▶  groen?  ─▶  ✦ uitgeleverd
     ▲                      │
     │                      ▼  (rood)
     └──  AI leest de logs en prompt zichzelf opnieuw`

export const nl: BlogOverride = {
  title: 'Prompt Engineering Is Dood. Leve Loop Engineering.',
  subtitle:
    'Waarom het hoofd van Claude Code bij Anthropic zojuist het einde van het tijdperk van de "AI-fluisteraar" aankondigde — en wat daarna komt.',
  description:
    'Boris Cherny, die Claude Code bij Anthropic leidt, zegt dat hij Claude niet meer prompt — hij schrijft loops. Een kijkje in de dood van prompt engineering en de opkomst van loop engineering: agentic AI-workflows, autonome zelfcorrigerende agents, waarom de verificator belangrijker is dan de prompt, en hoe diezelfde loop is verweven in een werkruimte die van jou is — machinaal controleerbare poorten in de repository, geheugen dat een sessie overleeft, en een bedieningspaneel dat bouwt en kan terugdraaien.',
  excerpt:
    'De engineer die Claude Code bij Anthropic leidt, gaf zojuist toe dat hij het model niet meer prompt — hij schrijft loops die dat voor hem doen. Dit is waarom dat een einde maakt aan het tijdperk van de "AI-fluisteraar", en hoe we dat omzetten in productiearchitectuur.',
  heroCaption: 'De LinkedIn-post die dit in gang zette — Boris Cherny over het schrijven van loops, niet prompts.',
  blocks: [
    { kind: 'h2', text: 'Het citaat dat de illusie verbrijzelde' },
    {
      kind: 'p',
      text: 'Een paar dagen geleden ging één enkel citaat van **Boris Cherny** — de engineer die de ontwikkeling van **Claude Code** bij **Anthropic** leidt — in alle stilte als een schokgolf door de softwaregemeenschap.',
    },
    {
      kind: 'p',
      text: 'Tijdens een publiek panel lichtte Cherny een tipje van de sluier op over hoe de mensen die ’s werelds meest geavanceerde codeer-AI bouwen, daadwerkelijk met hun eigen modellen werken. Wat hij zei, daagde niet alleen de status quo uit — het verklaarde een hele opkomende discipline achterhaald:',
    },
    {
      kind: 'quote',
      text: 'Ik prompt Claude niet meer. Ik heb loops draaien die Claude prompten en uitzoeken wat er moet gebeuren. Mijn werk is loops schrijven.',
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: 'Laat dat even bezinken.' },
    {
      kind: 'p',
      text: 'De man met beide handen aan het stuur van het beste ontwikkelaarsmodel ter wereld vertelt je dat hij zijn handen van het stuur heeft gehaald. Hij zit niet in een chatvenster de perfecte alinea instructies te slijpen. Hij schrijft code die de AI dwingt met zichzelf te praten, haar eigen fouten te beoordelen en ze op te lossen binnen een gesloten, autonoom circuit. Hij bouwt de machine die het model stuurt — en laat het dan rijden.',
    },
    {
      kind: 'p',
      text: 'Als je nog steeds je dagen besteedt aan het bijschaven van prompts om het juiste stukje code uit een LLM te lokken, is zijn boodschap keihard duidelijk: **je optimaliseert een wereld die al verdwenen is.**',
    },

    { kind: 'h2', text: 'De paradigmaverschuiving: van micromanagement naar systeemarchitectuur' },
    {
      kind: 'p',
      text: 'Om te zien waarom dit een tektonische verschuiving is, kijk naar hoe onze relatie met generatieve AI in slechts een paar jaar is geëvolueerd.',
    },
    { kind: 'h3', text: 'Fase 1 — De lineaire prompt (het menselijke knelpunt)' },
    {
      kind: 'p',
      text: 'Tot voor kort was de hele industrie geobsedeerd door **prompt engineering**. We behandelden LLM’s als briljante maar snel afgeleide junior ontwikkelaars. De workflow was lineair, kwetsbaar en volledig handmatig:',
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: 'In dit paradigma **is de mens het knelpunt.** Je schrijft een prompt, leest de uitvoer, spot een syntaxfout, plakt die terug in de chat, en hoopt dat het model de context vijf stappen later niet vergeten is. Het voelt productief. Het is uitputtend, niet-schaalbaar micromanagement — en het kan absoluut niet draaien terwijl je slaapt.',
    },
    { kind: 'h3', text: 'Fase 2 — Loop engineering (het autonome circuit)' },
    {
      kind: 'p',
      text: 'Wat Cherny beschrijft is **loop engineering** — agentic workflows waarbij de mens volledig uit de uitvoeringslus stapt. Je stopt met autorijden. Je bouwt het circuit en laat de machine de rondjes rijden.',
    },
    {
      kind: 'p',
      text: 'In plaats van een prompt te schrijven om een probleem op te lossen, schrijf je een programmatische **loop** die de AI inbedt in een geautomatiseerde cyclus van uitvoering en verificatie:',
    },
    {
      kind: 'olist',
      items: [
        '**Het doel.** Een mens stelt één doel op hoog niveau — "bouw dit API-eindpunt en behaal 98% testdekking."',
        '**De actie.** De AI genereert een eerste versie van de code.',
        '**De verificatie.** Een geautomatiseerde omgeving — compilers, linters, unit tests, jouw CI — voert de code uit en vangt elke fout.',
        '**De zelfcorrectie.** Bij een fout legt het systeem de stack trace vast, voert die terug naar de AI als een nieuwe instructie en beveelt het opnieuw te proberen.',
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: 'De loop draait op machinesnelheid, doorloopt tientallen iteraties, corrigeert en herstelt zichzelf totdat aan de verificatiecriteria is voldaan. Je hebt nooit een enkele vervolgprompt getypt. Je schreef de prompts niet — je bouwde het circuit, en het model reed elk rondje zelf.',
    },

    { kind: 'h2', text: 'De echte vaardigheid is niet code schrijven. Het is de rechter schrijven.' },
    {
      kind: 'p',
      text: 'Dit is het deel dat bijna iedereen mist — en het is het hele spel. Het moeilijke deel van een loop is **niet** het genereren van de code. Modellen zijn daar al angstaanjagend goed in. Het moeilijke deel is **het ding dat beslist of de code goed is.**',
    },
    {
      kind: 'p',
      text: 'Geef de loop een sterke, meedogenloze verificator — echte tests, statische analyse, een compiler die weigert te liegen — en hij convergeert naar iets dat werkelijk werkt. Geef hem een zwakke, en diezelfde loop produceert vrolijk een oneindige rivier van zelfverzekerde, prachtig opgemaakte rommel, hallucinerend op weg naar een groen vinkje dat niets betekent.',
    },
    {
      kind: 'p',
      text: 'Dus de vaardigheid van het komende decennium is geen promptvaardigheid. Het is **de verificatie ontwerpen** — de kogelvrije validatiesystemen die een AI veilig met zichzelf laten praten zonder van een klif te rijden. Dat is een moeilijker, zeldzamer en veel waardevoller soort engineering dan het vinden van de juiste woorden.',
    },

    { kind: 'h2', text: 'Van filosofie naar productie: hoe we de loop hebben ontworpen' },
    {
      kind: 'p',
      text: 'Terwijl de rest van de techwereld het citaat van Cherny op sociale media ontleedt, is de echte uitdaging weinig glamoureus: **hoe bouw je loop-engineering-infrastructuur die daadwerkelijk werkt in productie — buiten de interne laboratoria van Anthropic?**',
    },
    {
      kind: 'p',
      text: 'Sluit een loop rond één enkel model en je stuit al snel op de muren van de echte wereld: degradatie van het contextvenster, hallucinerende doodsspiralen, en geen geheugen dat een project overspant. Bij [%SITE%](/nl) hebben we het afgelopen jaar Cherny’s filosofie niet als voorspelling maar als **architectonische blauwdruk** behandeld — en de loop gebouwd waarop deze werkruimte draait.',
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: 'De ontwikkellus: de eigenaar stelt een doel, de agent bewerkt de repository, machinepoorten verifiëren het, mislukkingen keren terug naar de agent als nieuwe instructies, en het bedieningspaneel bouwt, houdt een logboek bij en kan terugdraaien',
      caption: 'De loop zoals hij daadwerkelijk is aangesloten: een agent in jouw repository, poorten die weigeren te liegen, en een paneel dat het circuit sluit.',
    },
    { kind: 'h3', text: 'De anatomie van een productiewaardige loop' },
    {
      kind: 'p',
      text: 'Om loops levensvatbaar te maken voor echte software, moet je stoppen met het model te bewonderen en beginnen met het bouwen van de drie weinig glamoureuze dingen eromheen — de rechter, het geheugen, en de hand die uitlevert:',
    },
    {
      kind: 'list',
      items: [
        '**Een verificator die niet met mooie praatjes te overtuigen is.** De rechter is geen tweede model met een mening; het is een set scripts die de build laten mislukken. Bestaan de taalsignalen op elke publieke pagina? Heeft elke post de markdown-tweeling die een AI-lezer nodig heeft? Wordt er verwezen naar een afbeelding die niemand heeft gecommit? Elke controle bestaat omdat precies dat defect ooit is uitgeleverd, en elke controle antwoordt met een exitcode in plaats van een alinea.',
        '**Geheugen dat een sessie overleeft.** Het geheugenverlies-effect is reëel: loop vijftien keer op een hardnekkige bug en de agent verliest de architectuur uit het oog. Hier is het geheugen geen dienst die offline kan zijn — het zijn bestanden naast de code die met de repository meereizen: de werkinstructie, de lessen die worden toegevoegd op het moment dat de eigenaar iets corrigeert, de lijst met antipatronen, de bevestigde gebruikerscasussen. Een nieuwe sessie begint met ze te lezen, zodat de vijftiende iteratie weet wat de eerste heeft geleerd.',
        '**Een slotakte die niet bij de agent hoort.** De loop eindigt in het bedieningspaneel: het bouwt het project, houdt een logboek bij van implementaties en kan terugkeren naar de laatst werkende build. Instellingen, teksten en afbeeldingen veranderen daar zonder enige herbouw — zodat aan de loop nooit wordt gevraagd op te lossen wat nooit een codeprobleem was.',
      ],
    },
    {
      kind: 'p',
      text: 'Let op wat **niet** in die lijst staat: een zwerm modellen die elkaar superviseren. Dat was onze eerste architectuur, en we hebben hem verwijderd. Orkestratie is het meest opwindende deel van een agentic diagram en het minst dragende deel van een werkend exemplaar — een zwakke rechter wordt niet gerepareerd door een tweede mening toe te voegen, en een sterke rechter heeft er zelden een nodig.',
    },

    { kind: 'h2', text: 'Het nieuwe functieprofiel van de softwareontwikkelaar' },
    {
      kind: 'p',
      text: 'We bewegen ons weg van het schrijven van code, voorbij het schrijven van prompts, en recht op het **bouwen van cognitieve pijplijnen** af. Het vakmanschap is niet langer de instructie — het is het systeem waarin de instructie draait.',
    },
    {
      kind: 'p',
      text: 'En het is niet gratis. Er komen twee nieuwe kosten met de loops mee. **Begripsschuld:** wanneer een agent een bestand driehonderd keer achter de schermen schrijft en herschrijft, verslijt je grip op je eigen codebase stilletjes — het werkt, je weet alleen niet meer precies waarom. En **rauwe rekenkracht:** een loop kan echt geld in tokens verbranden terwijl hij één bug over honderd stille pogingen achtervolgt. De engineers die dit tijdperk winnen, behandelen kosten-versus-kwaliteit als een bewuste ontwerpbeslissing, niet als een verrassing op de factuur.',
    },
    {
      kind: 'cta',
      text: 'Deze site is een van die loops: de pagina’s die je leest zijn statische bestanden die een poort weigerde uit te leveren totdat ze hun taalsignalen, hun markdown-tweeling en hun plek in de sitemap droegen.',
      href: '/nl',
      label: 'Bekijk de werkruimte waarop het draait',
    },
    {
      kind: 'p',
      text: 'Het tijdperk van prompt engineering ligt officieel achter ons. De enige vraag die overblijft, is degene die Cherny al voor zichzelf heeft beantwoord: **probeer je nog steeds met je AI te praten — of bouw je de loops die haar laten rennen?**',
    },
    {
      kind: 'note',
      text: 'Bron: een veelgedeelde LinkedIn-post van Guillermo Flor die Boris Cherny’s uitspraken naar boven bracht. Het citaat is weergegeven zoals het circuleerde; de architectuur en de analyse zijn van ons.',
    },
  ],
  faq: [
    {
      q: 'Wat is "loop engineering" en waarom vervangt het prompt engineering?',
      a: 'Loop engineering betekent het schrijven van geautomatiseerde workflows die de AI prompten, de uitvoer door een verificator laten lopen (tests, CI, een compiler), mislukkingen terugvoeren als nieuwe instructies, en dit herhalen — totdat het resultaat correct is. Boris Cherny, die Claude Code bij Anthropic leidt, zei dat hij prompts niet meer met de hand opstelt: hij schrijft de loops die dat voor hem doen. Het kerninzicht is dat het knelpunt nooit de prompt was — het was de mens in de feedbackcyclus.',
    },
    {
      q: 'Hoe is de ontwikkellus hier, in productie, aangesloten?',
      a: 'Een codeeragent werkt binnen jouw eigen repository, op jouw machine, met de werkinstructie van het project naast de code. De verificator is een set poorten die bij elke build draaien en hem laten mislukken: taalsignalen op elke publieke pagina, een markdown-tweeling voor elke gepubliceerde pagina, geen verwijzing naar een afbeelding die nooit is gecommit, geen woordenboek dat een sleutel mist. Een mislukking komt terug naar de agent als nieuwe instructie, en de loop herhaalt zich. Het bedieningspaneel sluit het circuit — het bouwt het project, houdt van elke implementatie een logboek bij en kan terugkeren naar de laatst werkende build.',
    },
    {
      q: 'Moet ik code schrijven om deze loop te laten draaien?',
      a: 'Niet voor het meeste wat een site daadwerkelijk verandert. De naam, de beschrijving, de afbeeldingen, de talen, de analytics en de teksten van de instellingen leven in het bedieningspaneel en worden toegepast zonder herbouw — dat is data, geen code. Codewijzigingen zijn wat de agent in jouw repository doet; jij leest en keurt ze goed, en het paneel bouwt het resultaat. De eerlijke grens is deze: niemand belooft je dat je nooit naar een diff kijkt — je krijgt de belofte dat je nooit zelf de build hoeft uit te voeren, en dat een kapotte build met één klik kan worden teruggedraaid.',
    },
  ],
}

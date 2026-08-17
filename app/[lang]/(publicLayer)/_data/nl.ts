import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const nl: Partial<HomeCell> = {
  title: 'Dit is de starter van uw toepassing',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'Uw server, uw code: autorisatie, database, opslag en vectorzoeken zijn al verbonden. Bouw een landingspagina of een SaaS in 82 talen.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Infrastructuur voor agentische engineering',
    title: 'Dit is de starter van uw toepassing',
    description:
      'Alles is al geïnstalleerd en met elkaar verbonden — autorisatie, een eigen database, bestandsopslag, vectorzoeken en nog honderd andere gereedschappen, zo geordend dat een codeeragent ze vindt zonder dat het twee keer uitgelegd hoeft te worden. Bouw een landingspagina, een SaaS of een automatisering die nooit slaapt, in elk van de 82 talen, op een skelet dat gesneden is voor een project dat de miljoen regels voorbijgaat. Ongeveer **negen keer sneller** dan dezelfde stack zelf samenstellen — en niets hier belt naar huis: geen leverancier, geen abonnement, niemand om toestemming aan te vragen. De server is van u, de code is van u, **voor honderd procent**.',
    image: 'homePage',
    imageAlt: 'SaaS-startsjabloon',
  },
  {
    kind: 'metrics',
    items: [
      { value: '×4', label: 'goedkoper te bouwen' },
      { value: '×9', label: 'sneller te lanceren' },
      { value: '×100', label: 'betrouwbaarder in productie' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: '82 talen', tone: 'reach' },
      { label: 'SEO ingebouwd', tone: 'reach' },
      { label: 'AIO agentisch browsen', tone: 'reach' },
      { label: 'Eigen database', tone: 'data' },
      { label: 'Vectorzoeken', tone: 'data' },
      { label: 'Kennisgrafiek', tone: 'data' },
      { label: 'Eigen bestandsopslag', tone: 'data' },
      { label: 'Autorisatie', tone: 'access' },
      { label: '{roles} rollen', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Fractera-architectuur', tone: 'code' },
      { label: '100+ meer', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Proces',
    title: 'Hoe het werkt',
    note: 'Van een lege server naar je eigen code in productie. Alles hieronder draait op hardware die van jou is.',
    steps: [
      { title: 'Zet de server neer', text: 'Rol hem uit met de installatierobot van Fractera. Je krijgt een besturingssysteem, een startsjabloon, het bedieningspaneel, de opslag en de autorisatie — geïnstalleerd en met elkaar verbonden.' },
      { title: 'Ontwikkel waar je al werkt', text: 'Synchroniseer met GitHub, kloon daarna naar je eigen machine en start Claude Code of Codex. De data blijft van je server komen; de code draait in je eigen IDE.' },
      { title: 'Push, en het rolt zichzelf uit', text: 'Rond af op de lokale machine en stuur het project naar GitHub. Dat start meteen een nieuwe uitrol op je eigen server — en de bezoeker ziet het nieuwe project.' },
    ],
  },
  {
    kind: 'cards',
    badge: 'Aan de slag',
    title: 'Hoe te beginnen',
    note: 'Alles hieronder is al geïnstalleerd — je zet het aan, je bouwt het niet. Links het pad; rechts wat je bespaart om het tweemaal af te leggen.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Zes stappen vanaf een lege server' },
          {
            kind: 'olist',
            items: [
          'Open het configuratiescherm — alles over deze server wordt daar ingesteld. [Configuratiescherm]({admin}/{lang})',
          'Kies de talen waarin uw toepassing wordt aangeboden. [Talen]({admin}/{lang}/languages)',
          'Gebruik de instellingen om uw project te beschrijven: naam, beschrijving, logo, SEO. [App-instellingen]({admin}/{lang}/app-settings)',
          'Koppel GitHub en stuur de code van de server naar uw repository. [GitHub]({admin}/{lang}/github)',
          'Kloon die repository naar uw eigen machine, ontwikkel daar en stuur terug.',
          'Druk op Deploy in het paneel — de server neemt uw commit over en bouwt zichzelf opnieuw op. [Implementaties]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Aanbevolen voordat u begint' },
          { kind: 'p', text: 'Geen van beide blokkeert iets. Beide besparen herwerk.' },
          {
            kind: 'list',
            items: [
              '**Een OpenAI-sleutel.** Zonder sleutel stelt de Quiz geen vragen, en zonder cases weigert de codeagent te bouwen. De site werkt gewoon — alleen vectorzoeken en de kennisgraaf blijven leeg. Eenmalig ingevoerd; de kosten gaan rechtstreeks naar je modelaanbieder. [OpenAI-sleutel]({admin}/{lang}/openai)',
              '**Een eigen domein.** Op een numeriek adres is er geen certificaat en geen installeerbare app — een browser geeft die alleen over een beveiligde verbinding. Later verhuizen verandert elk paginaadres, dus vóór indexering is het goedkoper. [Domein]({admin}/{lang}/domain)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Vóór welke code dan ook',
    title: 'Quiz — zeven vragen in plaats van een leeg blad',
    note: 'De duurste fout van een project wordt gemaakt vóór de eerste regel code: het verkeerde wordt gebouwd. Niet door slecht bouwen, maar omdat «waar begin ik» moeilijk alleen te beantwoorden is. Quiz maakt er een gesprek van: u antwoordt, het model blijft vragen stellen, en daaruit groeit de lijst met scenario\'s waarmee het project vervolgens wordt gebouwd.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'De kiem' }, { kind: 'p', text: 'Zeven korte vragen: wat het product is, voor wie het is, wat iemand ermee moet overhouden. Antwoord in uw eigen woorden — dicteren werkt. Alles daarna groeit hieruit voort, dus een paar zinnen geven een merkbaar beter resultaat dan een paar woorden.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Het gesprek' }, { kind: 'p', text: 'Daarna één vraag tegelijk, in uw taal. Er is een auto-quiz: het model stelt vijf nieuwe vragen en beantwoordt ze zelf, waarbij het de beschrijving verdiept — maar alles wat het namens u heeft bedacht, is gemarkeerd als «Aanname», en u corrigeert het. Een gok die als feit werd voorgesteld, zou later opduiken in de afgewerkte scenario\'s.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'De scenario\'s' }, { kind: 'p', text: 'Het gesprek wordt samengevat in genummerde cases: wie komt binnen, wat doet die persoon, wat moet aan het eind waar zijn. U leest en bevestigt elk apart. Een ongelezen case blijft een gok van het model.' }] },
    ],
  },
  { kind: 'statement', text: 'En dit is geen advies maar een productregel: zolang er één case onbevestigd blijft, houdt het paneel het alarm aan en weigert de codeeragent te bouwen. Bouwen op een ongelezen gok kost meer dan helemaal niet bouwen.' },
  { kind: 'cta', href: '{admin}/{lang}/doc-use-cases', label: 'Quiz openen' },
  {
    kind: 'cards',
    badge: 'Architectuur',
    title: 'Wat dit project technisch is',
    note: 'Drie dingen die het waard zijn om te weten voordat je bouwt: wat dit skelet is, waar de code werkelijk wordt geschreven en wat er gebeurt als het project zijn eerste honderd pagina\'s ontgroeit.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'Dit is geen afgewerkte site maar de Fractera-architectuur: hetzelfde skelet draagt zowel een landingspagina als een grote SaaS als meerlagige automatisering. Groeien vereist geen herschrijven — de lagen voor data, autorisatie en paneel zijn al gescheiden, elk gebouwd voor een belasting die u nog niet heeft.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Code wordt hier niet geschreven. Een ontwikkelaar kloont de repository naar zijn eigen machine en werkt met Claude Code, dat de instructies en vaardigheden leest die in het project zelf leven: die leggen de regels vast, en automatische controles laten niet toe dat ze worden overtreden. De server ontvangt alleen het resultaat en bouwt zichzelf opnieuw op.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Het skelet is gebouwd voor een project dat de miljoen regels zal overstijgen: elke entiteit heeft haar eigen map, de gedeelde laag groeit niet mee met hun aantal, en routes en rechten worden gedeclareerd waar ze worden afgedwongen. Stabiliteit is hier geen belofte maar een gevolg — een nieuwe pagina voegt niets toe aan een centrale kern.' }] },
    ],
  },
  {
    kind: 'noBill',
    badge: 'Onafhankelijkheid',
    heading: 'Een volledig onafhankelijke ruimte',
    note: 'In een gewoon project zijn dit drie externe diensten: hun prijzen, hun voorwaarden en hun toestemming om je project te laten draaien. Hier draaien ze alle drie op je eigen server.',
    items: [
      { vendor: 'Vercel', text: 'je betaalt niet aan', badge: { label: 'hosting', tone: 'reach' } },
      { vendor: 'Neon', text: 'je betaalt niet aan', badge: { label: 'database', tone: 'data' } },
      { vendor: 'Clerk', text: 'je betaalt niet aan', badge: { label: 'autorisatie', tone: 'access' } },
    ],
    title: 'Je betaalt niemand',
    text: 'Je bent van niemand afhankelijk. Het project is volledig van jou.',
  },
  {
    kind: 'languageMarquee',
    title: 'Tweeëntachtig talen, klaar voordat u ze nodig hebt',
    note: 'Ze zitten allemaal in het product — u schakelt die in die uw markt spreekt. Statische generatie, optimalisatie voor zoekmachines en AI, datacaching en gereedheid voor zware belasting houden de efficiëntie op het hoogste niveau van de sector — en houden die even hoog, of u nu met één taal werkt, met enkele of met alle tweeëntachtig.',
  },
],
}

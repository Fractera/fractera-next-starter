import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const nl: Partial<HomeCell> = {
  title: 'Dit is de starter van uw toepassing',
  description: 'Ze draait op uw eigen server en legt aan niemand anders verantwoording af. Geef haar een naam in het configuratiescherm — deze regel verdwijnt dan.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Infrastructuur voor agentische engineering' },
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
      { label: 'Eigen database', tone: 'data' },
      { label: 'Vectorzoeken', tone: 'data' },
      { label: 'Kennisgrafiek', tone: 'data' },
      { label: 'Eigen bestandsopslag', tone: 'data' },
      { label: 'Autorisatie', tone: 'access' },
      { label: '{roles} rollen', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Fractera-architectuur', tone: 'code' },
      { label: '100+ meer', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    title: 'Hoe het werkt',
    note: 'Van een lege server naar je eigen code in productie. Alles hieronder draait op hardware die van jou is.',
    steps: [
      { title: 'Zet de server neer', text: 'Rol hem uit met de installatierobot van Fractera. Je krijgt een besturingssysteem, een startsjabloon, het bedieningspaneel, de opslag en de autorisatie — geïnstalleerd en met elkaar verbonden.' },
      { title: 'Ontwikkel waar je al werkt', text: 'Synchroniseer met GitHub, kloon daarna naar je eigen machine en start Claude Code of Codex. De data blijft van je server komen; de code draait in je eigen IDE.' },
      { title: 'Push, en het rolt zichzelf uit', text: 'Rond af op de lokale machine en stuur het project naar GitHub. Dat start meteen een nieuwe uitrol op je eigen server — en de bezoeker ziet het nieuwe project.' },
    ],
  },
  {
    kind: 'panel',
    title: 'Hoe te beginnen',
    children: [
      { kind: 'p', text: 'Zes stappen van een kale server naar uw eigen code in productie. Alles hieronder is al geïnstalleerd — u schakelt het in, u bouwt het niet.' },
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
    kind: 'panel',
    tone: 'warn',
    title: 'Aanbevolen voordat u begint',
    children: [
      { kind: 'p', text: 'Geen van beide blokkeert iets. Beide besparen overwerk: de eerste schakelt de denkende helft van het product in, de tweede verandert het adres van elke pagina.' },
      {
        kind: 'list',
        items: [
          '**Een OpenAI-sleutel.** Zonder sleutel stelt de Quiz geen vragen, en zonder Quiz is er niets om uw gebruikssituaties mee te beschrijven — dus weigert de codeeragent te bouwen. Daarom behandelt het paneel de sleutel als een RODE eis totdat de eerste gevallen bestaan, en daarna als een amberkleurige suggestie: de site werkt ook zonder, alleen vectorzoeken en de kennisgrafiek blijven leeg. De sleutel wordt één keer ingevoerd en de kosten gaan rechtstreeks naar uw modelleverancier. [OpenAI-sleutel]({admin}/{lang}/openai)',
          '**Uw eigen domein.** Zolang de site op een numeriek adres leeft, heeft ze geen certificaat en geen installeerbare app — de browser geeft die alleen via een beveiligde verbinding. Overstappen naar een domein verandert het adres van elke pagina, dus is het goedkoper om dit te doen voordat ze geïndexeerd zijn. [Domein]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Vóór welke code dan ook',
    title: 'Quiz — zeven vragen in plaats van een leeg blad',
    children: [
      { kind: 'p', text: 'De duurste fout van een project wordt gemaakt vóór de eerste regel code: het verkeerde wordt gebouwd. Niet door slecht bouwen, maar omdat «waar begin ik» moeilijk alleen te beantwoorden is. Quiz maakt er een gesprek van: u antwoordt, het model blijft vragen stellen, en daaruit groeit de lijst met scenario\'s waarmee het project vervolgens wordt gebouwd.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'De kiem' }, { kind: 'p', text: 'Zeven korte vragen: wat het product is, voor wie het is, wat iemand ermee moet overhouden. Antwoord in uw eigen woorden — dicteren werkt. Alles daarna groeit hieruit voort, dus een paar zinnen geven een merkbaar beter resultaat dan een paar woorden.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Het gesprek' }, { kind: 'p', text: 'Daarna één vraag tegelijk, in uw taal. Er is een auto-quiz: het model stelt vijf nieuwe vragen en beantwoordt ze zelf, waarbij het de beschrijving verdiept — maar alles wat het namens u heeft bedacht, is gemarkeerd als «Aanname», en u corrigeert het. Een gok die als feit werd voorgesteld, zou later opduiken in de afgewerkte scenario\'s.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'De scenario\'s' }, { kind: 'p', text: 'Het gesprek wordt samengevat in genummerde cases: wie komt binnen, wat doet die persoon, wat moet aan het eind waar zijn. U leest en bevestigt elk apart. Een ongelezen case blijft een gok van het model.' }] },
        ],
      },
      { kind: 'quote', text: 'En dit is geen advies maar een productregel: zolang er één case onbevestigd blijft, houdt het paneel het alarm aan en weigert de codeeragent te bouwen. Bouwen op een ongelezen gok kost meer dan helemaal niet bouwen.' },
      { kind: 'cta', text: 'Quiz — zeven vragen in plaats van een leeg blad', href: '{admin}/{lang}/doc-use-cases', label: 'Quiz openen' },
    ],
  },
  {
    kind: 'panel',
    title: 'Wat dit project technisch is',
    children: [
      { kind: 'p', text: 'Dit is geen afgewerkte site maar de Fractera-architectuur: hetzelfde skelet draagt zowel een landingspagina als een grote SaaS als meerlagige automatisering. Groeien vereist geen herschrijven — de lagen voor data, autorisatie en paneel zijn al gescheiden, elk gebouwd voor een belasting die u nog niet heeft.' },
      { kind: 'p', text: 'Code wordt hier niet geschreven. Een ontwikkelaar kloont de repository naar zijn eigen machine en werkt met Claude Code, dat de instructies en vaardigheden leest die in het project zelf leven: die leggen de regels vast, en automatische controles laten niet toe dat ze worden overtreden. De server ontvangt alleen het resultaat en bouwt zichzelf opnieuw op.' },
      { kind: 'p', text: 'Het skelet is gebouwd voor een project dat de miljoen regels zal overstijgen: elke entiteit heeft haar eigen map, de gedeelde laag groeit niet mee met hun aantal, en routes en rechten worden gedeclareerd waar ze worden afgedwongen. Stabiliteit is hier geen belofte maar een gevolg — een nieuwe pagina voegt niets toe aan een centrale kern.' },
    ],
  },
  {
    kind: 'noBill',
    items: [
      { vendor: 'Vercel', text: 'je betaalt niet aan' },
      { vendor: 'Neon', text: 'je betaalt niet aan' },
      { vendor: 'Clerk', text: 'je betaalt niet aan' },
    ],
    title: 'Je betaalt niemand',
    text: 'Je bent van niemand afhankelijk. Het project is volledig van jou.',
  },
],
}

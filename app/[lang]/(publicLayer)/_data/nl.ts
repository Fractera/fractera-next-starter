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
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Neem het gratis en schaal op' },
    image: 'homePage',
    imageAlt: 'SaaS-startsjabloon',
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
      { value: '×4', label: 'goedkoper te bouwen' },
      { value: '×9', label: 'sneller te lanceren' },
      { value: '×100', label: 'betrouwbaarder in productie' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: 'Open Code', tone: 'code' },
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
      { label: 'Parallelle routing · 12 slots', tone: 'code' },
      { label: 'Next 16+', tone: 'code' },
      { label: '100+ meer', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Proces',
    title: 'Hoe het werkt',
    note: 'Van een lege server naar je eigen code in productie. Alles hieronder draait op hardware die van jou is.',
    steps: [
      { title: 'Zet de server neer', text: 'Rol hem uit met de [installatierobot](https://www.fractera.ai/deployments/vps) van Fractera. Je krijgt een besturingssysteem, een startsjabloon, het bedieningspaneel, de opslag en de autorisatie — geïnstalleerd en met elkaar verbonden.' },
      { title: 'Ontwikkel waar je al werkt', text: 'Synchroniseer met GitHub, kloon daarna naar je eigen machine en start Claude Code of Codex. De data blijft van je server komen; de code draait in je eigen IDE.' },
      { title: 'Push, en het rolt zichzelf uit', text: 'Rond af op de lokale machine en stuur het project naar GitHub. Dat start meteen een nieuwe uitrol op je eigen server — en de bezoeker ziet het nieuwe project.' },
    ],
  },
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
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
          { kind: 'h3', text: 'Zeven stappen vanaf een lege server' },
          { kind: 'p', text: 'Start de [installatierobot](https://www.fractera.ai/deployments/vps) om dit project te krijgen.' },
          {
            kind: 'olist',
            items: [
          'Open het configuratiescherm — alles over deze server wordt daar ingesteld. [Configuratiescherm]({admin}/{lang})',
          'Kies de talen waarin uw toepassing wordt aangeboden. [Talen]({admin}/{lang}/languages)',
          'Gebruik de instellingen om uw project te beschrijven: naam, beschrijving, logo, SEO. [App-instellingen]({admin}/{lang}/app-settings)',
          'Koppel GitHub en stuur de code van de server naar uw repository. [GitHub]({admin}/{lang}/github)',
          'Kloon die repository naar uw eigen machine, ontwikkel daar en stuur terug.',
          'Breng het omgevingsbestand `.env.local` naar uw machine — git vervoert het nooit, en zonder dit start de lokale kopie niet. [Omgevingsvariabelen]({admin}/{lang}/env)',
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
          { kind: 'p', text: 'Niets hiervan blokkeert iets. Alle drie besparen herwerk.' },
          {
            kind: 'list',
            items: [
              '**Een OpenAI-sleutel.** Zonder sleutel stelt de Quiz geen vragen, en zonder cases weigert de codeagent te bouwen. De site werkt gewoon — alleen vectorzoeken en de kennisgraaf blijven leeg. Eenmalig ingevoerd; de kosten gaan rechtstreeks naar je modelaanbieder. [OpenAI-sleutel]({admin}/{lang}/openai)',
              '**Een eigen domein.** Op een numeriek adres is er geen certificaat en geen installeerbare app — een browser geeft die alleen over een beveiligde verbinding. Later verhuizen verandert elk paginaadres, dus vóór indexering is het goedkoper. [Domein]({admin}/{lang}/domain)',
              '**Claude-extensie voor Chrome.** Zonder die ziet de agent alleen broncode: consolefouten, gedrag zonder JavaScript en hoe de afgewerkte pagina er werkelijk uitziet staan nergens in de code. Met die opent hij de pagina zelf en repareert wat er is, niet wat hij vermoedde. [Ontwikkelgereedschap]({admin}/{lang}/dev-tools)',
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
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Neem het gratis en schaal op' },
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
    kind: 'quote',
    lead: 'Klaar voor hoge belasting',
    text:
      'De verborgen werkelijkheid van vibe coding: het grootste deel van een project wordt gebouwd zonder aan hoge belasting te denken, aan het besparen van databasequery\'s, aan caching. Niet omdat ontwikkelaars daar niets van weten — maar omdat het echt moeilijk is die standaard binnen een framework vast te houden. Te veel kleinigheden duwen een pagina geruisloos van statische generatie naar dynamische rendering. En het verschil is geen vijf of tien procent: in sommige gevallen groeit de belasting op uw server duizendvoudig, en uw rekening voor servers en platforms groeit mee. Fractera is gebouwd op een lange ervaring: meer dan dertig jaar webontwikkeling. Alles wat met hoge belasting, zoekmachineoptimalisatie en besparen op databases te maken heeft, staat geschreven in het DNA van dit project. Het is zijn skelet, het is zijn levenskracht. En die is gratis van u.',
    cite: 'Roma Armstrong · oprichter van Fractera',
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
    cta: { page: 'architecture' },
  },
  {
    kind: 'problemSolution',
    badge: 'Verhuizen is makkelijk',
    title: 'Hoe u uw project naar de Fractera-architectuur verhuist',
    note: 'Uw project draait al — op Vercel of ergens anders. En u betaalt: voor hosting, voor de database, voor de opslag van afbeeldingen, voor autorisatie, voor e-mail. Elke dienst factureert apart, en elke rekening groeit met u mee. De verhuizing lijkt onmogelijk — dat is ze niet: Fractera haalt uw project uit elkaar en bouwt het opnieuw op de eigen architectuur, op uw server, waar dat alles al staat en niets extra kost.',
    demandLabel: 'Wat u doet',
    answerLabel: 'Waarom het bij Fractera werkt',
    items: [
      {
        title: 'Fractera neerzetten',
        demand: 'Koop een server — vanaf drie euro per maand. Koop een domein — vanaf een dollar per jaar. Start de installatierobot en volg hem: de rest doet hij zelf.',
        answer: 'Drie euro is uw hele hostingrekening. Niet die van de eerste maand en niet «tot u over de limiet gaat» — helemaal. Database, opslag voor afbeeldingen, inloggen met wachtwoord en e-mail staan al op uw server en zitten in diezelfde drie euro. Er blijft niets over om apart te betalen.',
      },
      {
        title: 'De verhuismodus kiezen',
        demand: 'Open in het paneel het tabblad «Verhuizen naar Fractera» en geef het adres van uw repository op. Houd hem tijdens de verhuizing openbaar — de uwe en die van Fractera; sluiten kan altijd weer. Sla de modus op.',
        answer: 'Dit is de enige instelling die u met de hand aanraakt. Vanaf hier weet het project dat het verhuist en gedraagt het zich daarnaar: het bouwt niet vanaf een leeg blad, het haalt uit elkaar wat u al geschreven hebt.',
      },
      {
        title: 'De agent inseinen',
        demand: 'Open het project in uw eigen editor, op uw eigen machine, waar u gewoonlijk werkt. Start het en zeg de agent dat de verhuizing begint. In gewone woorden, zoals u het een collega zou zeggen.',
        answer: 'Daarna leest hij uw oude project zelf: welke architectuur, welke bibliotheken, wat van wat afhangt. U hoeft niets uit te leggen en niets te herinneren — hij kijkt in de code, niet in uw geheugen.',
      },
      {
        title: 'Het plan in stappen krijgen',
        demand: 'Niets. Kijk wat eruit kwam: de enorme taak «het project verhuizen» ligt uitgevouwen in stappen, elk met zijn nummer en zijn doel.',
        answer: 'De verhuizing houdt op eng te zijn omdat ze ophoudt één brok te zijn. U ziet de lijst: wat af is, wat nu loopt, wat hierna komt. Er is nergens om halverwege vast te lopen en de draad kwijt te raken.',
      },
      {
        title: 'Het skelet neerzetten',
        demand: 'Beantwoord vragen over rechten: wie wat mag zien en veranderen in uw toepassing. Het zijn er weinig en ze gaan allemaal over uw product, niet over techniek.',
        answer: 'Eerst staat het geraamte: paginaadressen, tabellen, inloggen, repositories — openbaar voor de code en gesloten voor wat niet getoond mag worden. Een geraamte zet je één keer neer, en het project groeit erbinnen in plaats van bij elke nieuwe functie opnieuw gebouwd te worden.',
      },
      {
        title: 'De functies toevoegen',
        demand: 'Loop de stappen af. Eén stap, één functie: een pagina, een formulier, een betaling, brieven. Vink af wat klaar is en voeg nieuws toe wanneer het u invalt.',
        answer: 'Elke stap wordt gecontroleerd en u krijgt te zien dat hij werkt: niet «de build is geslaagd», maar een levende pagina met uw eigen tekst. Daarom weet u altijd waar u staat en blijft u nooit zitten met een project dat «zo ongeveer af» is.',
      },
      {
        title: 'De gegevens meenemen',
        demand: 'Geef de agent toegang tot uw databases. Hij haalt over wat zich al heeft opgehoopt: gebruikers, bestellingen, teksten, afbeeldingen.',
        answer: 'Dit is de laatste stap. Daarna hebt u op uw eigen server een volledige, werkende kopie van het project — met uw gegevens, uw mensen en uw domein. De oude facturen kunnen worden opgezegd: vanaf nu betaalt u de server en het domein, en verder niets.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Tweeëntachtig talen, klaar voordat u ze nodig hebt',
    note: 'Ze zitten allemaal in het product — u schakelt die in die uw markt spreekt. Statische generatie, optimalisatie voor zoekmachines en AI, datacaching en gereedheid voor zware belasting houden de efficiëntie op het hoogste niveau van de sector — en houden die even hoog, of u nu met één taal werkt, met enkele of met alle tweeëntachtig.',
  },
],
  faq: [
    {
      q: 'Wat kost het, en zijn er verborgen kosten?',
      a: 'Verborgen kosten zijn er niet, want er is niemand om te betalen: het platform is open code, en alles wat u installeert en gebruikt is voor honderd procent van u. Uw uitgaven zijn uw eigen server, uw domein en cloud-AI als u die gebruikt; die rekent u zelf uit en betaalt u rechtstreeks aan de leverancier. Wij nemen geen abonnement, geen percentage en geen bedrag per gebruiker.',
    },
    {
      q: 'Wat is het belangrijkste voordeel?',
      a: 'Betrouwbaarheid — daar is op ingezet. Er zijn tegenwoordig veel manieren om snel een toepassing in elkaar te zetten, en men moet zich geen illusies maken: bijna alle zijn zo gebouwd dat u vooral voor uw eigen fouten betaalt. Een efficiënte toepassing is alleen in uw belang; wie u diensten verkoopt heeft er belang bij dat u er zo veel mogelijk los koopt en betaalt. Het dure begint later — de wet overtreden en beboet worden om waar de gegevens staan, onvoorziene afsluitingen, sancties en simpelweg verlies van uw gegevens. Fractera sluit dat af doordat dit alles op uw eigen server staat.',
    },
    {
      q: 'En als ik meer nodig heb?',
      a: 'Uw belangrijkste gereedschap is uw eigen — Claude Code, Codex of een ander — en het draait op uw eigen machine. Het project schaalt ver: het skelet is gesneden op miljoenen regels en blijft efficiënt. En hebt u een conceptuele wijziging van de architectuur op het niveau van het bedieningspaneel nodig, of valt het bouwen van de toepassing nog zwaar — stuur dan een verzoek naar admin@fractera.ai; een ontwikkelaar neemt contact op en stelt een oplossing voor.',
    },
  ],
}

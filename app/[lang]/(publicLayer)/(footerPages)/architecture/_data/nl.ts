import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const nl: FooterPageCell = {
  title: 'Architectuur',
  description:
    'Hoe deze applicatie in elkaar zit: de lagen, wat elke laag beheert en welke blijven werken wanneer de andere worden uitgeschakeld.',
  keywords: 'architectuur, lagen, statische generatie, eigen server, datalaag',
  blocks: [
    {
      kind: 'p',
      text: 'Deze pagina beschrijft het skelet waarop de applicatie staat. Ze is geschreven voor twee lezers tegelijk — een persoon die beslist of het product past, en een coding-agent die het zal aanpassen. Beiden hebben hetzelfde nodig: weten welke laag wat beheert, voordat er iets wordt aangeraakt. Terug naar [%SITE%](/nl).',
    },

    { kind: 'h2', text: 'Hoe het is aangesloten' },
    {
      kind: 'p',
      text: 'Meerdere processen draaien zij aan zij op uw server. Vier daarvan antwoorden naar buiten toe, en elk heeft precies één taak. De grens tussen hen is een poort in plaats van een map — waardoor een storing in de ene de andere niet meesleept.',
    },
    {
      kind: 'table',
      headers: ['Poort', 'Proces', 'Waar het voor dient'],
      rows: [
        ['3000', 'Uw applicatie', 'De pagina’s die bezoekers zien. Dit is de applicatie waarmee u elke dag werkt.'],
        ['3001', 'Autorisatie', 'Accounts, sessies, rollen. Geconfigureerd vanuit het controlepaneel, niet door u bewerkt.'],
        ['3002', 'Controlepaneel', 'Ditzelfde: geconfigureerd, niet bewerkt.'],
        ['3300', 'Datalaag', 'Rijen, geüploade bestanden, vectoren — en de enkele deur naar al het andere. Uw applicatie communiceert ermee.'],
      ],
    },
    { kind: 'p', text: 'Nog drie diensten draaien daarnaast, en geen daarvan is een op zichzelf staande deur:' },
    {
      kind: 'list',
      items: [
        'de kaart — routes, afstandsmatrices en adresopzoeking, poort 3400;',
        'kanalen — Telegram en wat daarop volgt, poort 3500;',
        'de kennisgrafiek — de agentische RAG-opslag, poort 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Geen van deze poorten is bereikbaar vanaf het internet: de firewall laat alleen de webpoorten toe, en al het openbare komt daardoor binnen. Uw applicatie bereikt de drie diensten via de datalaag — /service/geo, /service/channels, /service/rag — met dezelfde sleutel die de datalaag zelf opent.',
    },

    { kind: 'h2', text: 'Elke laag overleeft de andere' },
    {
      kind: 'p',
      text: 'Afzonderlijke processen zijn geen diagram — ze zijn wat er gebeurt op een slechte dag. Elk van de vier kan stoppen zonder dat de rest meegaat.',
    },
    {
      kind: 'table',
      headers: ['Als dit stopt', 'Wat nog steeds werkt'],
      rows: [
        ['Uw applicatie', 'Het paneel, de gegevens en de accounts blijven onaangetast; alleen de site is offline'],
        ['Controlepaneel', 'De site blijft bezoekers bedienen; alleen wijzigingen moeten wachten'],
        ['Datalaag', 'Pagina’s die van tevoren zijn gegenereerd, openen nog steeds — dat is waar statische generatie voor dient'],
        ['Autorisatie', 'Openbare pagina’s ondervinden geen hinder; alleen wat achter een login zit, sluit'],
      ],
    },
    {
      kind: 'note',
      text: 'Het paneel bevindt zich bewust buiten uw repository. Wat naar uw GitHub reist, is de applicatie; de cockpit blijft op de server, wat de reden is dat een bewerkingsfout deze niet kan breken.',
    },

    { kind: 'h2', text: 'Eerst statisch, en wat u dat oplevert' },
    {
      kind: 'p',
      text: 'Pagina’s worden van tevoren gegenereerd, niet per verzoek samengesteld. Dat is geen prestatiedetail — het is de reden dat de site goedkoop blijft om te serveren onder belasting, volledig leesbaar is voor zoekmachines en functioneert als JavaScript is uitgeschakeld.',
    },
    {
      kind: 'list',
      items: [
        'De routing is aan de serverzijde, dus een bezoeker bij wie scripts zijn uitgeschakeld navigeert nog steeds door de hele site.',
        'Inhoud wordt opnieuw gegenereerd volgens een schema in plaats van bij elk bezoek, dus een piek in het verkeer kost niets extra’s.',
        'Alles wat echt afhangt van wie er kijkt — een dashboard, een account — wordt per verzoek gerenderd, en alleen dat deel.',
      ],
    },

    { kind: 'h2', text: 'Één ontwerp, één keer besloten' },
    {
      kind: 'p',
      text: 'Kleuren, typografie en spatiëring worden niet per pagina gekozen. De gehele schaal bevindt zich op één plek, het palet op een andere, en een handgeschreven kop mislukt bij een controle voordat deze ooit de site bereikt.',
    },
    {
      kind: 'p',
      text: 'De wet erachter is kort: **niets aan hoe een pagina eruitziet hangt af van wie deze mag openen.** Openbaar of privé, etalage of beheertabel — dezelfde koppen, dezelfde schaal, dezelfde kleuren. Toegang bepaalt wat een persoon mag zien, nooit hoe het is vormgegeven.',
    },
    {
      kind: 'p',
      text: 'Dit is opgeschreven omdat de afwezigheid ervan een vorm heeft. Terwijl het ontwerpbestand leeg was, bedacht de agent die dit project bouwde een tweede kopstijl voor "werkschermen" — twee privé-pagina’s eindigden twee keer zo ver uit elkaar in grootte en ingesteld in verschillende lettertypefamilies. Er was niets stuk; het las simpelweg als twee verschillende producten.',
    },
    {
      kind: 'p',
      text: 'Uw palet is een klein bestand met kleurrollen, dat wordt gelezen wanneer de pagina wordt geserveerd. Wijzig het en de hele site volgt — inclusief de pagina’s die u nog niet hebt gebouwd, en inclusief beide thema’s: licht en donker zijn dezelfde rollen met verschillende waarden, niet twee ontwerpen die met de hand synchroon gehouden moeten worden.',
    },

    { kind: 'h2', text: 'Talan: 82 beschikbaar, en er een toevoegen kost niets' },
    {
      kind: 'p',
      text: 'Tweeëntachtig talen worden met het product meegeleverd. U schakelt de talen in die uw markt spreekt, en de rest wacht — er later een inschakelen is een instelling, geen herbouw van de manier waarop de site werkt.',
    },
    {
      kind: 'p',
      text: 'Het deel dat het begrijpen waard is, is wat het toevoegen van een taal NIET doet:',
    },
    {
      kind: 'list',
      items: [
        'Het maakt geen enkele pagina dynamisch. Elke taal krijgt zijn eigen pagina’s, van tevoren gegenereerd precies zoals de eerste — tien talen betekent tien sets statische pagina’s, niet één pagina samengesteld per verzoek.',
        'Het verwatert de zoekmachinepositie niet. Elke pagina verklaart zichzelf de originele in zijn eigen taal en noemt zijn vertalingen, zodat een zoekmachine ze behandelt als één pagina in tien talen in plaats van tien bijna-duplicaten die met elkaar concurreren.',
        'Het kost geen snelheid. Het serveren van een vooraf gerenderde pagina is hetzelfde werk, ongeacht hoeveel talen er daarnaast bestaan.',
      ],
    },
    {
      kind: 'note',
      text: 'Een eentalige site is een op zichzelf staand geval, geen gestripte versie: de taal verdwijnt volledig uit de adressen, en de site stopt met het adverteren van vertalingen die hij niet heeft.',
    },

    { kind: 'h2', text: 'Gevonden door zoekmachines, leesbaar voor modellen' },
    {
      kind: 'p',
      text: 'Twee lezers komen aan op een moderne site, en ze willen verschillende dingen. Een zoekmachine stuurt een persoon naar een pagina. Een model komt zelf, leest en vertelt het opnieuw. Het product is voor beiden gebouwd, en de twee zijn niet dezelfde taak.',
    },
    {
      kind: 'p',
      text: 'Voor zoekmachines: pagina’s worden geserveerd als voltooide HTML, elke pagina deelt zijn eigen canonieke adres mee, vertalingen noemen elkaar, metadata wordt geassembleerd door één mechanisme in plaats van per pagina, en gestructureerde gegevens, sitemaps en robots-regels worden standaard meegeleverd. Machinale controles weigeren een pagina die iets hiervan verbreekt.',
    },
    {
      kind: 'p',
      text: 'Voor modellen: elke openbare pagina bestaat ook als platte tekst. Er is een kaart op /llms.txt, het gehele corpus op /llms-full.txt, en een markdown-versie van elke pagina ernaast. Dat is van belang omdat pagina-markup voor de helft ruis is voor een model — menu’s, footer, toestemmingsbanner, scripts — en het zijn context aan dit alles besteedt.',
    },
    {
      kind: 'note',
      text: 'Beide vormen worden gebouwd uit DEZELEFDE inhoud. Er is geen afzonderlijke "versie voor AI" die uit de pas kan lopen: bewerk de tekst één keer en beide veranderen samen. Een met de hand onderhouden kopie zou afwijken bij de eerste correctie, en niemand zou het merken, omdat niemand het opent in een browser.',
    },

    { kind: 'h2', text: 'Instellingen worden toegepast zonder herbouw' },
    {
      kind: 'p',
      text: 'De naam, beschrijving, logo, kleuren, talen en functieschakelaars bevinden zich in configuratiebestanden op de server, buiten de code. De applicatie leest ze terwijl ze serveert, dus een wijziging in het paneel is onmiddellijk zichtbaar — geen uitrol, geen downtime.',
    },
    {
      kind: 'p',
      text: 'De consequentie is belangrijker dan het gemak: dezelfde codebasis bedient een bakkerij en een marktplaats, en geen van beide hoefde te worden geforkt om daar te komen.',
    },

    { kind: 'h2', text: 'Uw server, uw code, en de uitweg' },
    {
      kind: 'p',
      text: 'De applicatie is van u: kloon hem, bewerk hem lokaal, push hem terug. Niets hier belt naar huis — er is geen leverancier om toestemming aan te vragen en geen abonnement dat kan worden ingetrokken.',
    },
    {
      kind: 'p',
      text: 'U kunt ook vertrekken. Strip de afhankelijkheid van het paneel en de applicatie draait overal. U verliest de onderdelen die op de server leven — instellingen zonder herbouw, de datalaag, vectorzoeken, autorisatie in 82 talen, de uitrolgeschiedenis met een rollback — en u behoudt de code. Dat is een legitieme uitgang, geen afwijking van het ontwerp.',
    },

    { kind: 'h2', text: 'Gebouwd om te blijven groeien nadat de context op is' },
    {
      kind: 'p',
      text: 'De harde grens voor een door AI gebouwd project is niet de grootte van de code. Het is hoeveel van die code in één keer begrepen moet worden voordat een veilige wijziging gemaakt kan worden. Een project waar elke nieuwe pagina toevoegt aan een centraal bestand stuit vroeg op die muur: uiteindelijk kan geen enkele sessie genoeg bevatten om iets te veranderen zonder iets anders te breken.',
    },
    {
      kind: 'p',
      text: 'De vorm hier is gekozen tegen precies dat. **Elke entiteit bezit haar eigen map** — haar pagina’s, haar gegevens, haar woorden, haar privécomponenten. Verwijder de map en niets blijft ergens anders verweesd achter.',
    },
    {
      kind: 'list',
      items: [
        'De gedeelde laag groeit niet naarmate entiteiten worden toegevoegd. Stijgt er iets naar een gedeelde plek, dan is dat alleen wanneer twee dingen het echt gebruiken, en die stap is een bewuste handeling, geen gewoonte.',
        'Machtigingen worden gedeclareerd waar ze worden afgedwongen, niet in een register dat iemand moet onthouden bij te werken.',
        'Routegroepen maken de twee soorten pagina’s zichtbaar op schijf: openbare inhoud aan de ene kant, door rollen afgeschermde schermen aan de andere kant. Een map in geen van beide is een onbeantwoorde vraag, en een controle zegt dat hardop.',
      ],
    },
    {
      kind: 'p',
      text: 'De consequentie is het punt: een wijziging aan één entiteit vereist het lezen van één map. Miljoenen regels blijven werkbaar, niet omdat iemand ze in gedachten houdt, maar omdat geen enkele afzonderlijke wijziging dat ooit hoeft te doen.',
    },
    {
      kind: 'p',
      text: 'De starter is hetzelfde idee toegepast op het begin. Wat wordt geleverd is geen lege repository, maar een werkend voorbeeld van elk patroon — een pagina, een bericht, een catalogus, een privéscherm, een dialoogvenster, een taalcel. Een nieuwe pagina wordt gemaakt door een werkende te kopiëren, zodat de vorm zich voortplant door constructie in plaats van door discipline.',
    },

    { kind: 'h2', text: 'De documenten die de agent gehoorzaamt' },
    {
      kind: 'p',
      text: 'Een coding-agent begint elke sessie zonder geheugen aan de vorige. Wat overleeft is opgeschreven, binnen het project, en wordt gelezen aan het begin van elke sessie. Dit corpus maakt net zo goed deel uit van de architectuur als de poorten — het is wat de tweede sessie even competent maakt als de eerste.',
    },
    {
      kind: 'table',
      headers: ['Document', 'Waar het voor dient'],
      rows: [
        ['Use cases', 'WAARVOOR het product dient, één bestand per scenario: wie er komt, wat hen bracht, wat waar moet zijn als ze klaar zijn. Geen bevestigde case betekent niet bouwen — de agent is verplicht om te stoppen en te vragen in plaats van te gissen.'],
        ['Ontwikkelstappen', 'Het werk zelf, als bestanden. Een stap wordt geopend voordat deze wordt uitgevoerd en verplaatst naar de map met voltooide stappen met een volledig rapport. Een sessie die stopt verliest niets; een koude sessie hervat vanuit de bestanden.'],
        ['Testen', 'Hoe wordt bewezen dat een stap voltooid is: twee onafhankelijke bewijzen uit twee verschillende vlakken, uitgeschreven. Een groene build is er nooit één van — een buildlog ziet er identiek uit ongeacht of de functie werkt of niet.'],
        ['Anti-patronen', 'Benaderingen die hier al tijd hebben gekost, elk met het mechanisme van het mislukken. Zelf-evoluerend: de agent voegt toe op het moment dat een doodlopende weg wordt begrepen.'],
        ['Lessen', 'Uw voorkeuren en de gewoonten die zijn opgedaan door eenmaal iets verkeerd te doen. Waar een les en de standaard van de agent van mening verschillen, wint de les — deze bestaat omdat de standaard hier al is mislukt.'],
        ['Ontwerp', 'Hoe pagina’s eruitzien, door u beslist en gehoorzaamd. Gegeven, niet evoluerend.'],
      ],
    },
    {
      kind: 'p',
      text: 'Twee hiervan verdienen een woord over richting. **Anti-patronen en lessen worden geschreven door de agent**; het ontwerpdocument wordt geschreven door u. Het verschil is bewust: een agent mag vastleggen wat hij heeft geleerd, maar mag niet beslissen hoe het product eruit moet zien.',
    },
    {
      kind: 'note',
      text: 'Use cases verhuizen van bestanden naar een dienst. De conversatie die ze produceert leeft al in het controlepaneel; vervolgens verhuizen ze achter een toolinterface ondersteund door een database, zodat de agent vraagt om de cases die hij nodig heeft in plaats van een map te lezen. De regel verandert niet met de opslag — geen bevestigde case, niet bouwen. Wat verandert is dat de cases ophouden een document te zijn dat de agent moet onthouden te openen.',
    },

    { kind: 'h2', text: 'Veel producten op één server' },
    {
      kind: 'p',
      text: 'Een case moet bij iets horen. In dit product hoort het bij een **product** — en één server draagt er meerdere: een landingspagina vandaag, een geplande watcher volgende week, het bedrijfsbrein daarna.',
    },
    {
      kind: 'p',
      text: 'Het bezwaar is terecht en het vermelden waard vóór het antwoord: **een website is normaal gesproken één product.** Als u een professioneel productiesysteem bouwt voor een bedrijf, is dat juist, en niets hier spreekt dat tegen — plaats één product op één server en de rest van dit gedeelte kost u niets.',
    },
    {
      kind: 'p',
      text: 'Maar dat is niet langer het enige wat mensen bouwen. Steeds meer van wat een persoon nodig heeft, is een kleine dienst voor hun eigen effectiviteit: iets dat draait op een schema en meldt wat er is veranderd, iets dat zoekt op oordeel in plaats van op trefwoord, iets dat één terugkerende taak afhandelt in verkoop, marketing of operaties. Elk daarvan is te klein om een eigen server, een eigen domein en een eigen rekening te verdienen — en samen zijn ze een systeem.',
    },
    {
      kind: 'p',
      text: 'Dus de eenheid van werk is het product, niet de site. Het groeperen van één product op zijn eigen pagina of handvol pagina’s is wat een coding-agent laat weten, zonder te vragen, welke daarvan hij verandert.',
    },

    { kind: 'h3', text: 'Waarom het niet gewoon een project noemen' },
    {
      kind: 'p',
      text: 'Omdat een project geen plek is. Het heeft geen adres, geen map en geen tabellen, dus een case die eraan gekoppeld is kan niet worden uitgevoerd — de agent moet nog steeds gissen waar het werk naartoe gaat. Een product heeft ze alle drie, en dat is het hele verschil: een case gekoppeld aan een product is een bouwbare instructie.',
    },
    {
      kind: 'p',
      text: 'Een product bezit vier wortels, en geen daarvan is met de hand geconfigureerd — alle vier worden **afgeleid** uit het record:',
    },
    {
      kind: 'table',
      headers: ['Wortel', 'Afgeleid van'],
      rows: [
        ['Zijn pagina’s', 'Zijn adres — in dit framework IS een mapnaam het URL-segment'],
        ['Zijn logica', 'Zijn permanente id'],
        ['Zijn tabellen', 'Zijn permanente id, als naamprefix'],
        ['Zijn cases', 'Zijn permanente id'],
      ],
    },
    {
      kind: 'p',
      text: 'Wanneer de agent aan een case werkt, schrijft hij binnen die vier wortels en nergens anders. Gedeelde code lives in een gedeelde wortel, en iets daarheen verplaatsen is een bewuste handeling die in de stap staat vermeld — reiken naar een aangrenzend product voor een component is de exacte stap die deze regel wil stoppen, omdat dat is hoe de wijziging van de ene eigenaar stilzwijgend een ander product weken later breekt.',
    },
    {
      kind: 'p',
      text: 'Het id is bewust betekenisloos — p1, p2 — en verandert nooit. Het kan niet worden afgeleid van de titel of de structuur, omdat u beide zult veranderen, en de paden hangen af van het id. Dat werd bewezen op dezelfde dag dat de regel werd geschreven: een product waarvan het id «store» zei, bleek een bedrijfsbrein te zijn.',
    },

    { kind: 'h3', text: 'Niet elk product heeft een pagina' },
    {
      kind: 'p',
      text: 'Een product verklaart een van de drie oppervlakken, en de standaard leunt altijd naar gesloten:',
    },
    {
      kind: 'list',
      items: [
        '**Openbaar** — het heeft een adres en bezoekers bereiken het.',
        '**Privé** — het leeft als een tabblad in uw controlepaneel, en de buitenwereld kan er niet in.',
        '**Headless** — het heeft helemaal geen scherm: het werkt via kanalen en op een schema, en u ontmoet het in Telegram of in zijn rapport.',
      ],
    },
    {
      kind: 'p',
      text: 'Een product draagt ook een status — wordt beschreven, wordt gebouwd, live. Het verplaatsen naar live publiceert het, en dat is een instelling: niets wordt herbouwd en niets wordt uitgerold.',
    },

    { kind: 'h3', text: 'Hoe dit er in de praktijk uitziet' },
    {
      kind: 'p',
      text: 'Neem een consultant met één server. Haar eerste product is een landingspagina: openbaar, in de root, één enkel doel — een aanvraag ontvangen. De cases zeggen wie er komt en wat waar moet zijn als ze vertrekken.',
    },
    {
      kind: 'p',
      text: 'Haar tweede product komt later en deelt niets met het eerste behalve de server. Eerst vielen de aanvragen van de landingspagina gewoon in haar messenger — dat volstond zolang het er vijf per week waren. Toen werden het er dertig, en was er een plek nodig waar te zien is wie schreef, wat hem geantwoord werd en hoe het afliep: een eigen systeem voor het afhandelen van aanvragen. Het staat achter het inloggen, met eigen pagina’s, eigen tabellen en eigen rollen, en de cases beschrijven het werk met een klant, niet het eerste bezoek van een vreemde.',
    },
    {
      kind: 'p',
      text: 'Beide leven op één server, en geen van beide kan de andere stilzwijgend beschadigen: afzonderlijke pagina’s, afzonderlijke logica, afzonderlijke tabellen, afzonderlijke cases. Wanneer ze de agent vraagt om de formulering van het aanvraagformulier te wijzigen, valt niets over het aanvraagsysteem binnen het bereik — niet omdat de agent voorzichtig was, maar omdat de grens werd besloten voordat een van beide werd gebouwd. Later staan er een derde en een vierde naast — mailings, rapporten, voorraad — en de regel verandert niet: één server, aparte producten.',
    },
    {
      kind: 'note',
      text: 'Het plan en het feit worden met opzet gescheiden gehouden. De pagina’s die een product ZOU MOETEN hebben staan opgeschreven; de pagina’s die het daadwerkelijk HEEFT worden geteld door de mappen te doorlopen, nooit opgeslagen. Een met de hand geschreven lijst van wat bestaat wijkt in de eerste week af van de werkelijkheid — de agent bouwt een pagina en vergeet de lijst. De kloof tussen de twee is het antwoord op "wat ontbreekt er nog", en die is alleen betrouwbaar omdat één helft ervan niet kan worden gefaket.',
    },
  ],
}

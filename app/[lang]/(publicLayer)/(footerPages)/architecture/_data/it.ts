import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const it: FooterPageCell = {
  title: 'Architettura',
  description:
    'Come è strutturata questa applicazione: i livelli, cosa appartiene a ciascuno e quali continuano a funzionare quando gli altri vengono disattivati.',
  keywords: 'architettura, livelli, generazione statica, server proprio, livello dati',
  blocks: [
    {
      kind: 'p',
      text: 'Questa pagina descrive lo scheletro su cui si regge l’applicazione. È scritta per due lettori contemporaneamente: una persona che decide se il prodotto è adatto e un agente di codice che lo modificherà. Entrambi hanno bisogno della stessa cosa: sapere quale livello possiede cosa, prima di toccare qualsiasi cosa. Torna a [%SITE%](/it).',
    },

    { kind: 'h2', text: 'Come è collegata' },
    {
      kind: 'p',
      text: 'Diversi processi sono in esecuzione fianco a fianco sul tuo server. Quattro di essi rispondono verso l’esterno e ciascuno ha esattamente un compito. Il confine tra di essi è una porta piuttosto che una cartella — motivo per cui un guasto in uno non trascina con sé gli altri.',
    },
    {
      kind: 'table',
      headers: ['Porta', 'Processo', 'A cosa serve'],
      rows: [
        ['3000', 'La tua applicazione', 'Le pagine viste dai visitatori. Questa è quella con cui lavori ogni giorno.'],
        ['3001', 'Autorizzazione', 'Account, sessioni, ruoli. Configurato dal pannello di controllo, non modificato da te.'],
        ['3002', 'Pannello di controllo', 'Lo stesso: configurato, non modificato.'],
        ['3300', 'Livello dati', 'Righe, file caricati, vettori — e l’unica porta verso tutto il resto. La tua applicazione comunica con esso.'],
      ],
    },
    { kind: 'p', text: 'Altri tre servizi sono in esecuzione a fianco, e nessuno di essi è una porta a sé stante:' },
    {
      kind: 'list',
      items: [
        'la mappa — percorsi, matrici di distanza e ricerca indirizzi, porta 3400;',
        'canali — Telegram e ciò che segue, porta 3500;',
        'il grafo di conoscenza — lo store RAG agentico, porta 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Nessuna di queste porte è raggiungibile da Internet: il firewall ammette solo le porte web e tutto ciò che è pubblico arriva attraverso di esse. La tua applicazione raggiunge i tre servizi attraverso il livello dati — /service/geo, /service/channels, /service/rag — con la stessa chiave che apre il livello dati stesso.',
    },

    { kind: 'h2', text: 'Ogni livello sopravvive agli altri' },
    {
      kind: 'p',
      text: 'Processi separati non sono un diagramma — sono ciò che accade in una brutta giornata. Uno qualsiasi dei quattro può fermarsi senza che il resto vada giù con esso.',
    },
    {
      kind: 'table',
      headers: ['Se questo si ferma', 'Cosa continua a funzionare'],
      rows: [
        ['La tua applicazione', 'Il pannello, i dati e gli account rimangono intatti; solo il sito è giù'],
        ['Pannello di controllo', 'Il sito continua a servire i visitatori; solo le modifiche devono attendere'],
        ['Livello dati', 'Le pagine generate in anticipo si aprono ancora — a questo serve la generazione statica'],
        ['Autorizzazione', 'Le pagine pubbliche non sono influenzate; solo ciò che sta dietro un login si chiude'],
      ],
    },
    {
      kind: 'note',
      text: 'Il pannello vive deliberatamente fuori dal tuo repository. Ciò che viaggia verso il tuo GitHub è l’applicazione; la cabina di regia rimane sul server, motivo per cui un errore di modifica non può romperla.',
    },

    { kind: 'h2', text: 'Prima il contenuto statico, e cosa ti garantisce' },
    {
      kind: 'p',
      text: 'Le pagine vengono generate in anticipo, non assemblate per ogni richiesta. Non si tratta di un dettaglio di prestazioni — è il motivo per cui il sito rimane economico da servire sotto carico, completamente leggibile dai motori di ricerca e funzionale con JavaScript disattivato.',
    },
    {
      kind: 'list',
      items: [
        'Il routing è lato server, quindi un visitatore con gli script disabilitati naviga comunque l’intero sito.',
        'Il contenuto viene rigenerato secondo una pianificazione piuttosto che a ogni visita, quindi un picco di traffico non costa nulla in più.',
        'Tutto ciò che dipende autenticamente da chi sta guardando — una dashboard, un account — viene renderizzato per richiesta, e solo quella parte.',
      ],
    },

    { kind: 'h2', text: 'Un solo design, deciso una volta sola' },
    {
      kind: 'p',
      text: 'Colori, tipografia e spaziatura non vengono scelti per singola pagina. L’intera scala vive in un posto, la tavolozza in un altro, e un’intestazione scritta a mano fallisce un controllo prima ancora di raggiungere il sito.',
    },
    {
      kind: 'p',
      text: 'La legge fondamentale è breve: **nulla dell’aspetto di una pagina dipende da chi può aprirla.** Pubblica o privata, vetrina o tabella di amministrazione — stesse intestazioni, stessa scala, stessi colori. L’accesso decide cosa una persona può vedere, mai come è impostato.',
    },
    {
      kind: 'p',
      text: 'Questo è scritto perché la sua assenza ha una forma. Mentre il file di design era vuoto, l’agente che costruiva questo progetto ha inventato un secondo stile di intestazione per le "schermate di lavoro" — due pagine private sono finite per essere grandi il doppio l’una dell’altra e impostate con famiglie di font diverse. Nulla era rotto; sembrava semplicemente che fossero due prodotti diversi.',
    },
    {
      kind: 'p',
      text: 'La tua tavolozza è un piccolo file di ruoli di colore, letto mentre la pagina viene servita. Modificalo e l’intero sito si adeguerà — comprese le pagine che non hai ancora costruito e compresi entrambi i temi: chiaro e scuro sono gli stessi ruoli con valori diversi, non due design da mantenere sincronizzati a mano.',
    },

    { kind: 'h2', text: 'Lingue: 82 disponibili, e aggiungerne una non costa nulla' },
    {
      kind: 'p',
      text: 'Ottantadue lingue sono incluse nel prodotto. Abiliti quelle parlate dal tuo mercato e le altre attendono — abilitarne una in seguito è una semplice impostazione, non una ricostruzione del modo in cui funziona il sito.',
    },
    {
      kind: 'p',
      text: 'La parte che vale la pena capire è ciò che aggiungendo una lingua NON accade:',
    },
    {
      kind: 'list',
      items: [
        'Non rende dinamica alcuna pagina. Ogni lingua ottiene le proprie pagine, generate in anticipo esattamente come la prima — dieci lingue significano dieci set di pagine statiche, non una pagina assemblata per richiesta.',
        'Non diluisce il posizionamento nei motori di ricerca. Ogni pagina dichiara se stessa come l’originale nella propria lingua e indica le sue traduzioni, così un motore di ricerca le tratta come un’unica pagina in dieci lingue anziché dieci quasi-duplicati in competizione tra loro.',
        'Non influisce sulla velocità. Servire una pagina pre-renderizzata richiede lo stesso lavoro indipendentemente da quante lingue esistano accanto ad essa.',
      ],
    },
    {
      kind: 'note',
      text: 'Un sito monolingua è un caso a sé stante, non una versione ridotta: la lingua scompare completamente dagli indirizzi e il sito smette di pubblicizzare traduzioni che non ha.',
    },

    { kind: 'h2', text: 'Trovato dai motori di ricerca, leggibile dai modelli' },
    {
      kind: 'p',
      text: 'Due lettori arrivano su un sito moderno e vogliono cose diverse. Un motore di ricerca invia una persona a una pagina. Un modello arriva da solo, legge e riassume. Il prodotto è costruito per entrambi, e i due non sono lo stesso lavoro.',
    },
    {
      kind: 'p',
      text: 'Per i motori di ricerca: le pagine vengono servite come HTML finito, ciascuna dichiara il proprio indirizzo canonico, le traduzioni si citano a vicenda, i metadati sono assemblati da un unico meccanismo anziché per pagina e dati strutturati, sitemap e regole robots sono forniti di default. I controlli automatici rifiutano una pagina che viola una qualsiasi di queste regole.',
    },
    {
      kind: 'p',
      text: 'Per i modelli: ogni pagina pubblica esiste anche come testo semplice. C’è una mappa su /llms.txt, l’intero corpus su /llms-full.txt e una versione markdown di ciascuna pagina accanto ad essa. Questo è importante perché il markup della pagina è per metà rumore per un modello — menu, footer, banner del consenso, script — e spende il suo contesto su tutto questo.',
    },
    {
      kind: 'note',
      text: 'Entrambe le forme sono costruite dallo STESSO contenuto. Non c’è una "versione per IA" separata che rischia di desincronizzarsi: modifica il testo una volta ed entrambi cambieranno insieme. Una copia mantenuta a mano divergerebbe alla prima correzione e nessuno se ne accorgerebbe, perché nessuno la apre in un browser.',
    },

    { kind: 'h2', text: 'Le impostazioni si applicano senza una nuova build' },
    {
      kind: 'p',
      text: 'Il nome, la descrizione, il logo, i colori, le lingue e gli interruttori delle funzionalità vivono in file di configurazione sul server, fuori dal codice. L’applicazione li legge mentre li serve, quindi una modifica nel pannello è immediatamente visibile — nessun deployment, nessun fermo macchina.',
    },
    {
      kind: 'p',
      text: 'La conseguenza conta più della comodità: la stessa codebase serve una panetteria e un marketplace, e nessuna delle due ha dovuto fare un fork per arrivarci.',
    },

    { kind: 'h2', text: 'Il tuo server, il tuo codice e la via d’uscita' },
    {
      kind: 'p',
      text: 'L’applicazione è tua: clonala, modificala localmente, fai il push. Niente qui invia dati all’esterno — non c’è alcun fornitore a cui chiedere il permesso e nessun abbonamento che possa essere revocato.',
    },
    {
      kind: 'p',
      text: 'Puoi anche andarvene. Rimuovi la dipendenza dal pannello e l’applicazione funziona ovunque. Perdi le parti che vivono sul server — impostazioni senza ricostruzione, il livello dati, la ricerca vettoriale, l’autorizzazione in 82 lingue, la cronologia dei deployment con rollback — e mantieni il codice. Questa è una legittima via d’uscita, non uno scostamento dal design.',
    },

    { kind: 'h2', text: 'Progettato per continuare a crescere dopo che il contesto è finito' },
    {
      kind: 'p',
      text: 'Il limite invalicabile in un progetto costruito dall’IA non è la dimensione del codice. È quanto di quel codice debba essere compreso tutto insieme prima di poter effettuare una modifica sicura. Un progetto in cui ogni nuova pagina si aggiunge a un file centrale sbatte presto contro quel muro: alla fine nessuna sessione può contenere abbastanza da cambiare qualcosa senza rompere qualcos’altro.',
    },
    {
      kind: 'p',
      text: 'La struttura qui è scelta esattamente contro questo. **Ogni entità possiede la propria cartella** — le sue pagine, i suoi dati, le sue parole, i suoi componenti privati. Elimina la cartella e nulla rimane orfano da nessuna altra parte.',
    },
    {
      kind: 'list',
      items: [
        'Il livello condiviso non cresce man mano che si aggiungono entità. Qualcosa sale a uno spazio condiviso solo quando due cose lo usano davvero, e quella mossa è un atto deliberato, non un’abitudine.',
        'I permessi sono dichiarati dove vengono applicati, non in un registro che qualcuno deve ricordarsi di aggiornare.',
        'I gruppi di route rendono i due tipi di pagina visibili su disco: contenuto pubblico da un lato, schermate protette da ruoli dall’altro. Una cartella che non sta in nessuno dei due è una domanda senza risposta, e un controllo lo dice chiaramente.',
      ],
    },
    {
      kind: 'p',
      text: 'La conseguenza è il punto fondamentale: una modifica a un’entità richiede la lettura di una sola cartella. Milioni di righe rimangono gestibili non perché qualcuno le stia tenendo in mente, ma perché nessuna singola modifica ha mai bisogno di farlo.',
    },
    {
      kind: 'p',
      text: 'Lo starter kit è la stessa idea applicata all’inizio. Ciò che viene fornito non è un repository vuoto, ma un esempio funzionante di ogni pattern — una pagina, un post, un catalogo, una schermata privata, un dialogo, una cella di lingua. Una nuova pagina viene creata copiandone una funzionante, così la struttura si propaga per costruzione anziché per disciplina.',
    },

    { kind: 'h2', text: 'I documenti a cui l’agente obbedisce' },
    {
      kind: 'p',
      text: 'Un agente di codice inizia ogni sessione senza memoria di quella precedente. Ciò che sopravvive è scritto, all’interno del progetto, e letto all’inizio di ogni sessione. Questo corpus è parte dell’architettura tanto quanto le porte — è ciò che rende la seconda sessione competente quanto la prima.',
    },
    {
      kind: 'table',
      headers: ['Documento', 'A cosa serve'],
      rows: [
        ['Casi d’uso', 'A COSA serve il prodotto, un file per scenario: chi arriva, cosa lo ha portato, cosa deve essere vero al termine. Nessun caso confermato significa nessuna costruzione — l’agente è tenuto a fermarsi e chiedere invece di tirare a indovinare.'],
        ['Passaggi di sviluppo', 'Il lavoro stesso, sotto forma di file. Un passaggio viene aperto prima di essere eseguito e spostato nella cartella dei completati con un report completo. Una sessione che si interrompe non perde nulla; una sessione a freddo riprende dai file.'],
        ['Testing', 'Come si dimostra che un passaggio è finito: due prove indipendenti da due piani diversi, scritte per esteso. Una build verde non è mai una di esse — un log di build appare identico indipendentemente dal fatto che la funzionalità funzioni o meno.'],
        ['Anti-pattern', 'Approcci che hanno già fatto perdere tempo qui, ciascuno con il meccanismo del fallimento. Auto-evolutivo: l’agente aggiunge nel momento in cui un vicolo cieco viene compreso.'],
        ['Lezioni', 'Le tue preferenze e le abitudini acquisite sbagliando qualcosa una volta. Dove una lezione e l’impostazione predefinita dell’agente non concordano, vince la lezione — esiste perché l’impostazione predefinita ha già fallito qui.'],
        ['Design', 'Come appaiono le pagine, deciso da te e rispettato. Dato, non evolutivo.'],
      ],
    },
    {
      kind: 'p',
      text: 'Due di questi meritano una parola sulla direzione. **Gli anti-pattern e le lezioni sono scritti dall’agente**; il documento di design è scritto da te. La differenza è deliberata: un agente può registrare ciò che ha imparato, ma non può decidere come debba apparire il prodotto.',
    },
    {
      kind: 'note',
      text: 'I casi d’uso stanno passando dai file a un servizio. La conversazione che li produce vive già nel pannello di controllo; in seguito si sposteranno dietro un’interfaccia per strumenti supportata da un database, così l’agente chiederà i casi di cui ha bisogno invece di leggere una cartella. La regola non cambia con l’archiviazione — nessun caso confermato, nessuna costruzione. Ciò che cambia è che i casi smettono di essere un documento che l’agente deve ricordarsi di aprire.',
    },

    { kind: 'h2', text: 'Molti prodotti su un solo server' },
    {
      kind: 'p',
      text: 'Un caso deve appartenere a qualcosa. In questo prodotto appartiene a un **prodotto** — e un server ne ospita diversi: una landing page oggi, un monitor pianificato la prossima settimana, il cervello dell’azienda dopo.',
    },
    {
      kind: 'p',
      text: 'L’obiezione è corretta e vale la pena esprimerla prima della risposta: **un sito web è normalmente un solo prodotto.** Se stai costruendo un sistema di produzione professionale per un’azienda, questo è corretto e nulla qui vi si oppone — metti un prodotto su un server e il resto di questa sezione non ti costa nulla.',
    },
    {
      kind: 'p',
      text: 'Ma non è più l’unica cosa che le persone costruiscono. Sempre più spesso ciò di cui una persona ha bisogno è un piccolo servizio per la propria efficienza: qualcosa che si esegua secondo una pianificazione e segnali cosa è cambiato, qualcosa che cerchi per criterio anziché per parola chiave, qualcosa che gestisca un’attività ricorrente nelle vendite, nel marketing o nelle operazioni. Ciascuno di essi è troppo piccolo per meritare un proprio server, un proprio dominio e una propria fattura — e insieme formano un sistema.',
    },
    {
      kind: 'p',
      text: 'Quindi l’unità di lavoro è il prodotto, non il sito. Raggruppare un prodotto nella sua pagina o in un pugno di pagine è ciò che consente a un agente di codice di sapere, senza chiedere, quale di essi sta modificando.',
    },

    { kind: 'h3', text: 'Perché non chiamarlo semplicemente un progetto' },
    {
      kind: 'p',
      text: 'Perché un progetto non è un luogo. Non ha un indirizzo, non ha una cartella e non ha tabelle, quindi un caso allegato ad esso non può essere eseguito — l’agente deve ancora indovinare dove va il lavoro. Un prodotto ha tutti e tre, e questa è tutta la differenza: un caso allegato a un prodotto è un’istruzione eseguibile.',
    },
    {
      kind: 'p',
      text: 'Un prodotto possiede quattro radici e nessuna di esse è configurata a mano — tutte e quattro sono **derivate** dal suo record:',
    },
    {
      kind: 'table',
      headers: ['Radice', 'Derivata da'],
      rows: [
        ['Le sue pagine', 'Il suo indirizzo — in questo framework un nome di cartella È il segmento dell’URL'],
        ['La sua logica', 'Il suo ID permanente'],
        ['Le sue tabelle', 'Il suo ID permanente, come prefisso del nome'],
        ['I suoi casi', 'Il suo ID permanente'],
      ],
    },
    {
      kind: 'p',
      text: 'Lavorando su un caso, l’agente scrive all’interno di quelle quattro radici e da nessuna altra parte. Il codice condiviso vive in una radice condivisa, e spostare qualcosa lì è un atto deliberato dichiarato nel passaggio — attingere a un prodotto vicino per un componente è la mossa esatta che questa regola esiste per impedire, perché è così che la modifica di un proprietario rompe silenziosamente un altro prodotto settimane dopo.',
    },
    {
      kind: 'p',
      text: 'L’ID è deliberatamente privo di significato — p1, p2 — e non cambia mai. Non può essere derivato dal titolo o dalla struttura, perché cambierai entrambi, e i percorsi dipendono dall’ID. Questo è stato dimostrato lo stesso giorno in cui è stata scritta la regola: un prodotto il cui ID diceva «store» si è rivelato essere un cervello aziendale.',
    },

    { kind: 'h3', text: 'Non tutti i prodotti hanno una pagina' },
    {
      kind: 'p',
      text: 'Un prodotto dichiara una di tre superfici e l’impostazione predefinita pende sempre verso il chiuso:',
    },
    {
      kind: 'list',
      items: [
        '**Pubblico** — ha un indirizzo e i visitatori lo raggiungono.',
        '**Privato** — vive come scheda nel tuo pannello di controllo e il mondo esterno non ha modo di entrare.',
        '**Headless** — non ha alcuna schermata: funziona attraverso canali e secondo una pianificazione, e lo incontri in Telegram o nel suo report.',
      ],
    },
    {
      kind: 'p',
      text: 'Un prodotto porta anche uno stato — in fase di descrizione, in fase di costruzione, live. Spostarlo su live lo pubblica, e questa è un’impostazione: nulla viene ricostruito e nulla viene distribuito.',
    },

    { kind: 'h3', text: 'Come appare tutto questo nella pratica' },
    {
      kind: 'p',
      text: 'Prendi una consulente con un solo server. Il suo primo prodotto è una landing page: pubblica, nella radice, un unico obiettivo — ricevere una richiesta di informazioni. I suoi casi dicono chi arriva e cosa deve essere vero quando se ne va.',
    },
    {
      kind: 'p',
      text: 'Il suo secondo prodotto non condivide nulla con il primo tranne il server. Ogni mattina legge le pagine, gli annunci di lavoro e i prezzi di quattro concorrenti, memorizza ciò che ha trovato e le invia un solo messaggio: cosa è cambiato, quando, di quanto. È headless — nessun indirizzo, nessuna pagina, nessuna schermata. I suoi casi riguardano le sue mattinate, non i visitatori.',
    },
    {
      kind: 'p',
      text: 'Entrambi vivono su un solo server e nessuno dei due può danneggiare silenziosamente l’altro: pagine separate, logica separata, tabelle separate, casi separati. Quando chiede all’agente di modificare il testo del modulo di richiesta, nulla del monitor è in ambito — non perché l’agente sia stato attento, ma perché il confine è stato deciso prima che ciascuno di essi venisse costruito.',
    },
    {
      kind: 'note',
      text: 'Il piano e la realtà sono tenuti separati di proposito. Le pagine che un prodotto DOVREBBE avere sono scritte; le pagine che ha effettivamente vengono contate scorrendo le cartelle, mai memorizzate. Un elenco scritto a mano di ciò che esiste diverge dalla realtà nella prima settimana — l’agente costruisce una pagina e dimentica l’elenco. Il divario tra i due è la risposta a "cosa manca ancora", ed è affidabile solo perché una metà di esso non può essere falsificata.',
    },
  ],
}

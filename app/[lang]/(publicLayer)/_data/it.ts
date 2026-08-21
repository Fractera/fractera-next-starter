import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const it: Partial<HomeCell> = {
  title: 'Questo è lo starter della tua applicazione',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'Il tuo server, il tuo codice: autorizzazione, database, archiviazione e ricerca vettoriale già collegati. Crea una landing page o un SaaS in 82 lingue.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Infrastruttura di ingegneria agentica',
    title: 'Questo è lo starter della tua applicazione',
    description:
      'È già tutto installato e collegato — autorizzazione, un database tuo, archiviazione dei file, ricerca vettoriale e un centinaio di strumenti in più, disposti in modo che un agente di codice li trovi senza doverglielo spiegare due volte. Costruisci una landing page, un SaaS o un\'automazione che non dorme mai, in una qualsiasi delle 82 lingue, su uno scheletro tagliato per un progetto che supererà il milione di righe. Circa **nove volte più veloce** che mettere insieme lo stesso stack da solo — e qui nulla chiama casa: nessun fornitore, nessun abbonamento, nessuno a cui chiedere il permesso. Il server è tuo, il codice è tuo, **al cento per cento**.',
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Prendilo gratis e scala' },
    image: 'homePage',
    imageAlt: 'Modello iniziale SaaS',
  },
  { kind: 'projectTypeMarquee' },
  {
    kind: 'metrics',
    items: [
      { value: '×4', label: 'più economico da sviluppare' },
      { value: '×9', label: 'più veloce da lanciare' },
      { value: '×100', label: 'più affidabile in produzione' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: 'Open Code', tone: 'code' },
      { label: '82 lingue', tone: 'reach' },
      { label: 'SEO integrata', tone: 'reach' },
      { label: 'AIO navigazione agentica', tone: 'reach' },
      { label: 'Database proprio', tone: 'data' },
      { label: 'Ricerca vettoriale', tone: 'data' },
      { label: 'Grafo della conoscenza', tone: 'data' },
      { label: 'Archiviazione file propria', tone: 'data' },
      { label: 'Autorizzazione', tone: 'access' },
      { label: '{roles} ruoli', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Architettura Fractera', tone: 'code' },
      { label: '100+ altro', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Processo',
    title: 'Come funziona',
    note: 'Da un server vuoto al tuo codice in produzione. Tutto quanto segue gira su hardware che è tuo.',
    steps: [
      { title: 'Metti in piedi il server', text: 'Distribuiscilo con il [robot installatore](https://www.fractera.ai/deployments/vps) di Fractera. Ottieni un sistema operativo, un modello di partenza, il pannello di controllo, gli archivi e l\'autorizzazione — installati e collegati tra loro.' },
      { title: 'Sviluppa dove già lavori', text: 'Sincronizza con GitHub, poi clona sulla tua macchina e avvia Claude Code o Codex. I dati continuano ad arrivare dal tuo server; il codice gira nel tuo IDE.' },
      { title: 'Fai push e si distribuisce da solo', text: 'Finisci sulla macchina locale e invia il progetto su GitHub. Questo avvia subito un nuovo rilascio sul tuo server — e il visitatore vede il nuovo progetto.' },
    ],
  },
  {
    kind: 'cards',
    badge: 'Per iniziare',
    title: 'Come iniziare',
    note: 'Tutto quanto segue è già installato — lo stai accendendo, non costruendo. A sinistra il percorso; a destra ciò che evita di farlo due volte.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Sette passi da un server vuoto' },
          { kind: 'p', text: 'Avvia il [robot installatore](https://www.fractera.ai/deployments/vps) per ottenere questo progetto.' },
          {
            kind: 'olist',
            items: [
          'Apri il pannello di controllo — tutto su questo server si configura lì. [Pannello di controllo]({admin}/{lang})',
          'Scegli le lingue in cui la tua applicazione sarà disponibile. [Lingue]({admin}/{lang}/languages)',
          'Usa le impostazioni per descrivere il tuo progetto: nome, descrizione, logo, SEO. [Impostazioni app]({admin}/{lang}/app-settings)',
          'Collega GitHub e invia il codice del server nel tuo repository. [GitHub]({admin}/{lang}/github)',
          'Clona quel repository sulla tua macchina, sviluppa lì e rimanda indietro.',
          "Porta il file di ambiente `.env.local` sulla tua macchina — git non lo trasporta mai e senza di esso la copia locale non si avvia. [Variabili d'ambiente]({admin}/{lang}/env)",
          'Premi Deploy nel pannello — il server prende il tuo commit e si ricostruisce da solo. [Deployment]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Consigliato prima di iniziare' },
          { kind: 'p', text: 'Niente di tutto questo blocca nulla. Tutti e tre evitano di rifare il lavoro.' },
          {
            kind: 'list',
            items: [
              '**Una chiave OpenAI.** Senza di essa il Quiz non fa domande, e senza casi l\'agente programmatore si rifiuta di costruire. Il sito funziona lo stesso — restano vuoti solo la ricerca vettoriale e il grafo della conoscenza. Si inserisce una volta; la spesa va direttamente al tuo fornitore del modello. [Chiave OpenAI]({admin}/{lang}/openai)',
              '**Un dominio tuo.** Su un indirizzo numerico non c\'è né certificato né app installabile — il browser li concede solo su connessione sicura. Spostarsi dopo cambia l\'indirizzo di ogni pagina: conviene farlo prima dell\'indicizzazione. [Dominio]({admin}/{lang}/domain)',
              "**Estensione Claude per Chrome.** Senza di essa l'agente vede solo il codice: gli errori di console, il comportamento senza JavaScript e l'aspetto reale della pagina non sono scritti da nessuna parte. Con essa apre la pagina da solo e corregge ciò che c'è, non ciò che ha immaginato. [Strumenti di sviluppo]({admin}/{lang}/dev-tools)",
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Prima di qualsiasi codice',
    title: 'Quiz — sette domande invece di una pagina bianca',
    note: 'L\'errore più costoso di un progetto si commette prima della prima riga di codice: si costruisce la cosa sbagliata. Non per una cattiva costruzione, ma perché «da dove comincio» è difficile rispondere da soli. Quiz lo trasforma in una conversazione: tu rispondi, il modello continua a chiedere, e ne cresce la lista degli scenari con cui il progetto viene poi costruito.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'Il seme' }, { kind: 'p', text: 'Sette domande brevi: cos\'è il prodotto, per chi è, cosa una persona dovrebbe portarsi via. Rispondi con parole tue — la dettatura funziona. Tutto ciò che segue cresce da qui, quindi un paio di frasi dà un risultato nettamente migliore di un paio di parole.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'La conversazione' }, { kind: 'p', text: 'Poi una domanda alla volta, nella tua lingua. Esiste un autoquiz: il modello fa cinque nuove domande e se le risponde da solo, approfondendo la descrizione — ma tutto ciò che ha inventato per tuo conto è marcato «Ipotesi», e tu lo correggi. Un\'ipotesi spacciata per fatto emergerebbe più tardi, dentro gli scenari finiti.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Gli scenari' }, { kind: 'p', text: 'La conversazione viene sintetizzata in casi numerati: chi arriva, cosa fa, cosa deve essere vero alla fine. Li leggi e li confermi uno per uno. Un caso non letto resta un\'ipotesi del modello.' }] },
    ],
  },
  { kind: 'statement', text: 'E questa non è una raccomandazione ma una regola del prodotto: finché resta un solo caso non confermato, il pannello tiene accesa l\'allerta e l\'agente programmatore rifiuta di costruire. Costruire su un\'ipotesi non letta costa più che non costruire affatto.' },
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Prendilo gratis e scala' },
  {
    kind: 'cards',
    badge: 'Architettura',
    title: 'Cos\'è questo progetto, tecnicamente',
    note: 'Tre cose da sapere prima di costruire: che cos\'è questo scheletro, dove viene scritto davvero il codice e cosa succede quando il progetto supera le prime cento pagine.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'Questo non è un sito finito ma l\'architettura Fractera: uno stesso scheletro regge sia una landing page sia un grande SaaS sia un\'automazione multilivello. Crescere non richiede riscrittura — i livelli di dati, autorizzazione e pannello sono già separati, e ciascuno è costruito per un carico che ancora non hai.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Il codice non si scrive qui. Uno sviluppatore clona il repository sulla propria macchina e lavora con Claude Code, che legge le istruzioni e le competenze che vivono dentro il progetto: fissano le regole, e i controlli automatici non permettono che vengano infrante. Il server riceve solo il risultato e si ricostruisce.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Lo scheletro è costruito per un progetto che supererà il milione di righe: ogni entità ha la propria cartella, il livello condiviso non cresce con il loro numero, e rotte e permessi sono dichiarati dove vengono applicati. La stabilità qui non è una promessa ma una conseguenza — una nuova pagina non aggiunge nulla a un nucleo centrale.' }] },
    ],
  },
  {
    kind: 'quote',
    lead: 'Pronto per carichi elevati',
    text:
      'La realtà nascosta del vibe coding: gran parte di un progetto viene costruita senza pensare al carico elevato, al risparmio di query verso il database, alla cache. Non perché gli sviluppatori non lo sappiano — ma perché tenere questo standard dentro un framework è davvero difficile. Troppe piccole cose spingono in silenzio una pagina dalla generazione statica al rendering dinamico. E la differenza non è del cinque o del dieci per cento: in certi casi il carico sul vostro server cresce di mille volte, e con esso cresce la vostra fattura per server e piattaforme. Fractera è costruita su una lunga esperienza: più di trent\'anni di sviluppo web. Tutto ciò che riguarda il carico elevato, l\'ottimizzazione per i motori di ricerca e il risparmio sui database è scritto nel DNA del progetto. È il suo scheletro, è la sua forza vitale. Ed è vostra gratis.',
    cite: 'Roma Armstrong · fondatore di Fractera',
  },
  {
    kind: 'noBill',
    badge: 'Indipendenza',
    heading: 'Uno spazio del tutto indipendente',
    note: 'In un progetto normale sono tre servizi altrui: i loro prezzi, le loro condizioni e il loro permesso perché il tuo progetto continui a funzionare. Qui tutti e tre vivono sul tuo server.',
    items: [
      { vendor: 'Vercel', text: 'non paghi', badge: { label: 'hosting', tone: 'reach' } },
      { vendor: 'Neon', text: 'non paghi', badge: { label: 'database', tone: 'data' } },
      { vendor: 'Clerk', text: 'non paghi', badge: { label: 'autorizzazione', tone: 'access' } },
    ],
    title: 'Non paghi nessuno',
    text: 'Non dipendi da nessuno. Il progetto è interamente tuo.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'languageMarquee',
    title: 'Ottantadue lingue, pronte prima che ti servano',
    note: 'Ci sono tutte nel prodotto: attivi quelle che parla il tuo mercato. Generazione statica, ottimizzazione per i motori di ricerca e per l\'IA, caching dei dati e prontezza al carico elevato tengono l\'efficienza ai vertici del settore — e la tengono uguale, che tu lavori con una lingua, con alcune o con tutte e ottantadue.',
  },
],
}

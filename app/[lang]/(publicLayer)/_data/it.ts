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
      { label: '16 ruoli', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Architettura Fractera', tone: 'code' },
      { label: 'Routing parallelo · 8 aree', tone: 'code' },
      { label: 'Next 16+', tone: 'code' },
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
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
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
    kind: 'problemSolution',
    badge: 'Traslocare è semplice',
    title: 'Come spostare il suo progetto sull’architettura Fractera',
    note: 'Il suo progetto è già in funzione — su Vercel o altrove. E lei paga: l’hosting, il database, l’archiviazione delle immagini, l’autorizzazione, la posta. Ogni servizio fattura per conto suo, e ogni fattura cresce insieme a lei. Il trasloco sembra impossibile, e non lo è: Fractera smonta il suo progetto e lo rimonta sulla propria architettura, sul suo server, dove tutto questo c’è già e non costa nulla in più.',
    demandLabel: 'Che cosa fa lei',
    answerLabel: 'Perché funziona su Fractera',
    items: [
      {
        title: 'Installare Fractera',
        demand: 'Compri un server — da tre euro al mese. Compri un dominio — da un dollaro l’anno. Avvii il robot installatore e lo segua: il resto lo fa da solo.',
        answer: 'Tre euro sono tutta la sua bolletta dell’hosting. Non del primo mese, non «finché non supera il limite» — proprio tutta. Database, archivio immagini, accesso con password, posta: sono già sul suo server e sono compresi in quei tre euro. Non resta nulla da pagare a parte.',
      },
      {
        title: 'Scegliere la modalità trasloco',
        demand: 'Nel pannello apra la scheda «Trasloco su Fractera» e indichi l’indirizzo del suo repository. Durante il trasloco conviene tenerlo pubblico — il suo e quello di Fractera; li può richiudere quando vuole. Salvi la modalità.',
        answer: 'È l’unica impostazione che tocca con le mani. Da qui il progetto sa che sta traslocando e si comporta di conseguenza: non parte da una pagina bianca, smonta quello che lei ha già scritto.',
      },
      {
        title: 'Dirlo all’agente',
        demand: 'Apra il progetto nel suo editor, sulla sua macchina, dove lavora di solito. Lo avvii e dica all’agente che comincia il trasloco. Con parole normali, come lo direbbe a un collega.',
        answer: 'Da lì legge il suo vecchio progetto da sé: che architettura ha, quali librerie, che cosa dipende da che cosa. Lei non deve spiegare né ricordare nulla: guarda il codice, non la sua memoria.',
      },
      {
        title: 'Ricevere il piano a passi',
        demand: 'Niente. Guardi che cosa è venuto fuori: il compito enorme «spostare il progetto» è disteso in passi, ognuno col suo numero e il suo scopo.',
        answer: 'Il trasloco smette di far paura perché smette di essere un blocco solo. Lei vede l’elenco: che cosa è fatto, che cosa è in corso, che cosa viene dopo. Non c’è dove incagliarsi a metà e perdere il filo.',
      },
      {
        title: 'Alzare lo scheletro',
        demand: 'Risponda alle domande sui permessi: chi potrà vedere e cambiare che cosa nella sua applicazione. Sono poche e parlano tutte del suo prodotto, non di tecnica.',
        answer: 'Prima si alza l’ossatura: indirizzi delle pagine, tabelle, accesso, repository — pubblico per il codice e chiuso per ciò che non si deve mostrare. Si alza una volta sola, e il progetto cresce dentro invece di essere rifatto a ogni funzione nuova.',
      },
      {
        title: 'Aggiungere le funzioni',
        demand: 'Percorra i passi. Un passo, una funzione: una pagina, un modulo, un pagamento, le email. Spunti ciò che è fatto e aggiunga il nuovo quando le viene in mente.',
        answer: 'Ogni passo viene verificato e le mostrano che funziona: non «la build è passata», ma una pagina viva col suo testo. Così sa sempre a che punto è, e non resta mai con un progetto «più o meno pronto».',
      },
      {
        title: 'Spostare i dati',
        demand: 'Dia all’agente accesso ai suoi database. Sposterà quello che si è già accumulato: utenti, ordini, testi, immagini.',
        answer: 'È l’ultimo passo. Dopo di esso ha sul suo server una copia completa e funzionante del progetto — con i suoi dati, le sue persone e il suo dominio. Le vecchie fatture si possono disdire: da adesso paga il server e il dominio, nient’altro.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Ottantadue lingue, pronte prima che ti servano',
    note: 'Ci sono tutte nel prodotto: attivi quelle che parla il tuo mercato. Generazione statica, ottimizzazione per i motori di ricerca e per l\'IA, caching dei dati e prontezza al carico elevato tengono l\'efficienza ai vertici del settore — e la tengono uguale, che tu lavori con una lingua, con alcune o con tutte e ottantadue.',
  },
],
  faq: [
    {
      q: 'Quanto costa e ci sono costi nascosti?',
      a: 'Costi nascosti non ce ne sono perché non c’è nessuno da pagare: la piattaforma è a codice aperto, e tutto ciò che installa e usa le appartiene al cento per cento. Le sue spese sono il suo server, il suo dominio e l’IA in cloud se la usa; le calcola lei e paga direttamente il fornitore. Noi non prendiamo né abbonamento, né percentuale, né una quota per utente.',
    },
    {
      q: 'Qual è il vantaggio principale?',
      a: 'L’affidabilità: è lì che è messa la posta. Oggi ci sono molti modi di mettere insieme un’applicazione in fretta, ed è meglio non farsi illusioni: quasi tutti sono fatti perché lei paghi prima di tutto i propri errori. Un’applicazione efficiente conviene solo a lei; a chi le vende servizi conviene che ne compri e ne paghi il più possibile, separati. Il caro arriva dopo: violare la legge ed essere multato per dove stanno i dati, blocchi imprevisti, sanzioni e semplicemente la perdita dei dati. Fractera chiude tutto questo tenendo ogni cosa sul suo server.',
    },
    {
      q: 'E se mi servisse di più?',
      a: 'Lo strumento principale è il suo — Claude Code, Codex o un altro — e gira sulla sua macchina. Il progetto scala parecchio: lo scheletro è tagliato per milioni di righe e resta efficiente. E se le serve un cambiamento concettuale dell’architettura a livello di pannello di controllo, o costruire l’applicazione le resta difficile, mandi una richiesta a admin@fractera.ai: uno sviluppatore la contatterà e proporrà una soluzione.',
    },
  ],
}

import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const it: Partial<HomeCell> = {
  title: 'Questo è lo starter della tua applicazione',
  description: 'Funziona sul tuo server e non risponde a nessun altro. Dalle un nome nel pannello di controllo — questa riga scomparirà.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Infrastruttura di ingegneria agentica' },
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
      { label: '82 lingue', tone: 'reach' },
      { label: 'SEO integrata', tone: 'reach' },
      { label: 'Database proprio', tone: 'data' },
      { label: 'Ricerca vettoriale', tone: 'data' },
      { label: 'Grafo della conoscenza', tone: 'data' },
      { label: 'Archiviazione file propria', tone: 'data' },
      { label: 'Autorizzazione', tone: 'access' },
      { label: '{roles} ruoli', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Architettura Fractera', tone: 'code' },
      { label: '100+ altro', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    title: 'Come funziona',
    note: 'Da un server vuoto al tuo codice in produzione. Tutto quanto segue gira su hardware che è tuo.',
    steps: [
      { title: 'Metti in piedi il server', text: 'Distribuiscilo con il robot installatore di Fractera. Ottieni un sistema operativo, un modello di partenza, il pannello di controllo, gli archivi e l\'autorizzazione — installati e collegati tra loro.' },
      { title: 'Sviluppa dove già lavori', text: 'Sincronizza con GitHub, poi clona sulla tua macchina e avvia Claude Code o Codex. I dati continuano ad arrivare dal tuo server; il codice gira nel tuo IDE.' },
      { title: 'Fai push e si distribuisce da solo', text: 'Finisci sulla macchina locale e invia il progetto su GitHub. Questo avvia subito un nuovo rilascio sul tuo server — e il visitatore vede il nuovo progetto.' },
    ],
  },
  {
    kind: 'panel',
    title: 'Come iniziare',
    children: [
      { kind: 'p', text: 'Sei passi da un server vuoto al tuo codice in produzione. Tutto qui sotto è già installato — lo stai attivando, non costruendo.' },
      {
        kind: 'olist',
        items: [
          'Apri il pannello di controllo — tutto su questo server si configura lì. [Pannello di controllo]({admin}/{lang})',
          'Scegli le lingue in cui la tua applicazione sarà disponibile. [Lingue]({admin}/{lang}/languages)',
          'Usa le impostazioni per descrivere il tuo progetto: nome, descrizione, logo, SEO. [Impostazioni app]({admin}/{lang}/app-settings)',
          'Collega GitHub e invia il codice del server nel tuo repository. [GitHub]({admin}/{lang}/github)',
          'Clona quel repository sulla tua macchina, sviluppa lì e rimanda indietro.',
          'Premi Deploy nel pannello — il server prende il tuo commit e si ricostruisce da solo. [Deployment]({admin}/{lang}/deployments)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'warn',
    title: 'Consigliato prima di iniziare',
    children: [
      { kind: 'p', text: 'Nessuno dei due blocca nulla. Entrambi evitano di rifare il lavoro: il primo accende la metà pensante del prodotto, il secondo cambia l\'indirizzo di ogni pagina.' },
      {
        kind: 'list',
        items: [
          '**Una chiave OpenAI.** Senza chiave il Quiz non fa domande, e senza Quiz non c\'è nulla con cui descrivere i tuoi casi d\'uso — quindi l\'agente programmatore rifiuta di costruire. Per questo il pannello tratta la chiave come requisito ROSSO finché non esistono i primi casi, e come suggerimento ambra dopo: il sito funziona senza, restano vuoti solo la ricerca vettoriale e il grafo della conoscenza. La chiave si inserisce una volta e la spesa va direttamente al tuo fornitore del modello. [Chiave OpenAI]({admin}/{lang}/openai)',
          '**Un dominio tuo.** Finché il sito vive a un indirizzo numerico non ha né certificato né app installabile — il browser li concede solo su una connessione sicura. Passare a un dominio cambia l\'indirizzo di ogni pagina, quindi conviene farlo prima che vengano indicizzate. [Dominio]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Prima di qualsiasi codice',
    title: 'Quiz — sette domande invece di una pagina bianca',
    children: [
      { kind: 'p', text: 'L\'errore più costoso di un progetto si commette prima della prima riga di codice: si costruisce la cosa sbagliata. Non per una cattiva costruzione, ma perché «da dove comincio» è difficile rispondere da soli. Quiz lo trasforma in una conversazione: tu rispondi, il modello continua a chiedere, e ne cresce la lista degli scenari con cui il progetto viene poi costruito.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'Il seme' }, { kind: 'p', text: 'Sette domande brevi: cos\'è il prodotto, per chi è, cosa una persona dovrebbe portarsi via. Rispondi con parole tue — la dettatura funziona. Tutto ciò che segue cresce da qui, quindi un paio di frasi dà un risultato nettamente migliore di un paio di parole.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'La conversazione' }, { kind: 'p', text: 'Poi una domanda alla volta, nella tua lingua. Esiste un autoquiz: il modello fa cinque nuove domande e se le risponde da solo, approfondendo la descrizione — ma tutto ciò che ha inventato per tuo conto è marcato «Ipotesi», e tu lo correggi. Un\'ipotesi spacciata per fatto emergerebbe più tardi, dentro gli scenari finiti.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Gli scenari' }, { kind: 'p', text: 'La conversazione viene sintetizzata in casi numerati: chi arriva, cosa fa, cosa deve essere vero alla fine. Li leggi e li confermi uno per uno. Un caso non letto resta un\'ipotesi del modello.' }] },
        ],
      },
      { kind: 'quote', text: 'E questa non è una raccomandazione ma una regola del prodotto: finché resta un solo caso non confermato, il pannello tiene accesa l\'allerta e l\'agente programmatore rifiuta di costruire. Costruire su un\'ipotesi non letta costa più che non costruire affatto.' },
      { kind: 'cta', text: 'Quiz — sette domande invece di una pagina bianca', href: '{admin}/{lang}/doc-use-cases', label: 'Apri Quiz' },
    ],
  },
  {
    kind: 'cards',
    title: 'Cos\'è questo progetto, tecnicamente',
    note: 'Tre cose da sapere prima di costruire: che cos\'è questo scheletro, dove viene scritto davvero il codice e cosa succede quando il progetto supera le prime cento pagine.',
    items: [
      'Questo non è un sito finito ma l\'architettura Fractera: uno stesso scheletro regge sia una landing page sia un grande SaaS sia un\'automazione multilivello. Crescere non richiede riscrittura — i livelli di dati, autorizzazione e pannello sono già separati, e ciascuno è costruito per un carico che ancora non hai.',
      'Il codice non si scrive qui. Uno sviluppatore clona il repository sulla propria macchina e lavora con Claude Code, che legge le istruzioni e le competenze che vivono dentro il progetto: fissano le regole, e i controlli automatici non permettono che vengano infrante. Il server riceve solo il risultato e si ricostruisce.',
      'Lo scheletro è costruito per un progetto che supererà il milione di righe: ogni entità ha la propria cartella, il livello condiviso non cresce con il loro numero, e rotte e permessi sono dichiarati dove vengono applicati. La stabilità qui non è una promessa ma una conseguenza — una nuova pagina non aggiunge nulla a un nucleo centrale.',
    ],
  },
  {
    kind: 'noBill',
    heading: 'Uno spazio del tutto indipendente',
    note: 'In un progetto normale sono tre servizi altrui: i loro prezzi, le loro condizioni e il loro permesso perché il tuo progetto continui a funzionare. Qui tutti e tre vivono sul tuo server.',
    items: [
      { vendor: 'Vercel', text: 'non paghi', badge: { label: 'hosting', tone: 'reach' } },
      { vendor: 'Neon', text: 'non paghi', badge: { label: 'database', tone: 'data' } },
      { vendor: 'Clerk', text: 'non paghi', badge: { label: 'autorizzazione', tone: 'access' } },
    ],
    title: 'Non paghi nessuno',
    text: 'Non dipendi da nessuno. Il progetto è interamente tuo.',
  },
],
}

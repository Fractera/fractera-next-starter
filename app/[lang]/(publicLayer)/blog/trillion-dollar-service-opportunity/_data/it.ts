import type { BlogOverride } from '../../_lib/types'

// Versione italiana. Tono dell'autore (Roma Armstrong): personale, diretto,
// ispirante. L'ancora radice obbligatoria "Agentic Engineering
// Infrastructure" (termine non tradotto) → /it.
export const it: BlogOverride = {
  title: "L'opportunità da mille miliardi di dollari è il salone qui accanto",
  subtitle:
    "Elon Musk ha parlato di spazio, IA e automobili. La frase che mi è rimasta dentro era più semplice: la maggior parte delle aziende sulla Terra non ha ancora un'API. Ecco la nicchia che ho trovato grazie a questo.",
  description:
    "Perché i soldi veri, a breve termine, nell'IA non stanno in un unicorno — stanno nel salone di bellezza, nella clinica, nello studio dentistico qui accanto. Il problema dei clienti che non si presentano, le aziende senza sito e senza CRM, e come uno spazio di lavoro self-hosted permetta a quasi chiunque di automatizzarle senza dover prima assemblare uno stack.",
  excerpt:
    "Elon Musk ha detto che la maggior parte delle aziende non ha ancora un'API — funzionano con un telefono, o senza nemmeno quello. Ho passato decine di incontri a inseguire quell'idea e ho trovato una nicchia nascosta in bella vista: il salone, la clinica, lo studio dentistico qui accanto.",
  blocks: [
    {
      kind: 'p',
      text:
        "Questo è un post un po' insolito, perché comincia con qualcun altro. L'intervista di Elon Musk qui sopra ha attirato la mia attenzione — ha parlato di spazio, di intelligenza artificiale, di automobili. Ma il momento che mi ha ispirato di più è stato uno tranquillo. Ha detto che, per quanto il mondo moderno sembri come se tutto fosse già stato inventato, ogni sito costruito, ogni app pubblicata, ogni processo aziendale automatizzato — la stragrande maggioranza delle aziende sulla Terra non ha nemmeno un'API. Funzionano con un telefono. Alcune funzionano senza nemmeno quello.",
    },
    {
      kind: 'quote',
      text:
        "Se l'IA può semplicemente prendere qualunque cosa venga già affidata all'azienda di assistenza clienti esterna che già usano e fare assistenza clienti usando le app che già usano, allora si può fare un progresso enorme nell'assistenza clienti, che credo sia l'1% dell'economia mondiale o giù di lì. Vicino a mille miliardi di dollari in totale, solo per l'assistenza clienti.",
      cite: 'Elon Musk · Intervista con Dwarkesh Patel, febbraio 2026',
    },
    {
      kind: 'p',
      text:
        "Rileggilo con occhi da costruttore. Quei mille miliardi non vivono in un altro social network o in un altro involucro per l'IA — vivono dentro aziende ordinarie che non si sono mai digitalizzate. E la barriera non è mai stata l'idea; è stata la costruzione. Assumere un team, mettere in piedi l'infrastruttura, pagare mese dopo mese per uno stack di servizi cloud. Quella barriera è esattamente ciò che uno spazio di lavoro self-hosted elimina — per questo ho tenuto con me questa frase tranquilla, e non i razzi.",
    },

    { kind: 'h2', text: 'Tutti hanno imparato a programmare. La strada sembra la stessa.' },
    {
      kind: 'p',
      text:
        "Parlando con molti partner, continuo a vedere due scenari. Da un lato, un'ondata di sviluppatori — e persino persone che non erano mai state sviluppatrici, gente che prima faceva marketing o gestiva contenuti — hanno improvvisamente imparato a programmare in un solo anno. Tutti hanno cominciato a costruire. Ci sono moltissimi progetti, e molti sono davvero interessanti. E nel mondo reale? Nel mondo reale è tutto esattamente uguale.",
    },
    {
      kind: 'p',
      text:
        "Quindi risulta che alcuni di noi hanno trovato un modo meraviglioso per compiacersi — la scarica di dopamina della conoscenza nuova. Ma è anche ora di guadagnare da questo. Allora dove sposti il tuo focus?",
    },
    {
      kind: 'founder',
      text:
        "Il problema: non possiamo prevedere il futuro. Specialmente adesso, quando il mercato e la tecnologia hanno iniziato a cambiare a una velocità straordinaria. Adattarsi al cambiamento è un processo angosciante di cambio di strategia.",
    },

    { kind: 'h2', text: 'Sono andato a cercare la risposta. Ho trovato un salone di bellezza.' },
    {
      kind: 'p',
      text:
        "Dopo aver studiato in dettaglio questo video e aver fatto diverse decine di incontri per confermare la risposta a quella domanda, ho trovato una nicchia di business molto interessante: saloni di bellezza e cosmetologia non chirurgica, centri medici, studi dentistici. Nonostante l'abbondanza di automazione e sistemi CRM, si imbattono in un problema con sorprendente frequenza: un cliente lascia una richiesta, prenota una visita — e poi non si presenta. Quando il responsabile lo chiama — di solito proprio all'ora in cui l'appuntamento doveva iniziare — i clienti spesso rispondono: \"ah, ce ne siamo dimenticati. Perché non ce l'avete ricordato?\"",
    },
    {
      kind: 'p',
      text:
        "Naturalmente esistono già molte soluzioni pronte da installare. Ma ci sono ancora più clienti a cui non ne è mai stata installata una — e molti di loro non hanno un sito, molti non hanno affatto un CRM.",
    },

    { kind: 'h2', text: 'È esattamente a questo che serve uno spazio di lavoro come questo.' },
    {
      kind: 'p',
      text:
        "[%SITE%](/it) è uno spazio di lavoro di ingegneria agentica self-hosted, costruito precisamente per scenari come questo. Include già le parti che un'azienda del genere altrimenti dovrebbe comprare separatamente: un database e tabelle proprie, archiviazione di file, voce trasformata in testo, un canale per raggiungere un cliente in un messenger, autorizzazione con ruoli, e un sito pubblico che un motore di ricerca può davvero leggere. Il proprietario dell'azienda può avere tutte le idee che vuole — le parti sono già sullo scaffale.",
    },
    {
      kind: 'p',
      text:
        "Il vantaggio è che prima, materializzare queste idee significava lavorare incredibilmente a lungo con un team di prodotto, poi assumere programmatori, poi pensare senza fine a come funziona tutto — oppure comprare servizi costosi per le proprie esigenze. Ora tutto questo è semplice. Grazie all'ingegneria agentica, quasi chiunque può prendere un telefono e descrivere come vorrebbe ottimizzare la propria attività, e farlo da solo o con l'aiuto di qualcuno che già ne capisce un po'.",
    },
    {
      kind: 'p',
      text:
        "Ti libera anche dal dover ricordare quali servizi devi pagare. La maggior parte dei servizi cloud che si trasformano in pagamenti ricorrenti e costituiscono la fetta più grande dei tuoi costi — un database, l'archiviazione, un abbonamento CRM — sono già funzionalità ordinarie della tua stessa applicazione, in esecuzione sul tuo stesso server. E i cambiamenti quotidiani non sono affatto un deployment: il nome, i testi, le immagini e le lingue si modificano in un pannello di controllo e si applicano senza ricostruzione, mentre il codice vive in un repository che ti appartiene.",
    },

    { kind: 'h2', text: 'Uno di tanti. Puoi trovarli ogni giorno.' },
    {
      kind: 'p',
      text:
        "L'esempio qui sopra è uno di tanti. Puoi trovare casi simili letteralmente ogni giorno e guadagnare implementandoli — oppure puoi aggiungere la materializzazione di nuove idee dentro la tua stessa attività, perché ora è praticamente gratis. Prima non è mai stato così.",
    },
    {
      kind: 'p',
      text:
        "E anche se sembra quasi impossibile trovare una nuova nicchia per una startup unicorno — forse non vale la pena pensarci. Invece di sognare di costruire un unicorno, puoi semplicemente automatizzare il salone di bellezza qui accanto, o il centro estetico, o l'officina meccanica. Tutti quelli con cui sei già in contatto da tempo. Tutti quelli che già si fidano di te. Forse è ora di provarci.",
    },
  ],
  faq: [
    {
      q: 'Per che tipo di azienda funziona meglio?',
      a: "Aziende di servizi locali con appuntamenti e clienti abituali — saloni di bellezza, cosmetologia non chirurgica, cliniche, studi dentistici, officine meccaniche — specialmente quelle senza sito o CRM e con un problema ricorrente di clienti che non si presentano.",
    },
    {
      q: 'Pago separatamente per un database, l\'archiviazione, un abbonamento CRM?',
      a: "No. Sono parti ordinarie integrate nella tua stessa applicazione sul tuo stesso server, non abbonamenti di terze parti fatturati ogni mese. Quello che paghi è il server stesso.",
    },
    {
      q: 'Devo essere uno sviluppatore?',
      a: "Non per le cose che un'azienda cambia più spesso: nomi, testi, prezzi, immagini e lingue si modificano nel pannello di controllo e si applicano senza ricostruzione. Costruire qualcosa di nuovo è lavoro per un agente di codice che opera nel tuo repository — il tuo, o quello di qualcuno che già ne capisce un po'. Il server, il modello di IA e il dominio sono già connessi per te.",
    },
  ],
}

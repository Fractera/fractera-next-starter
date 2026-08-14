import type { BlogOverride } from '../../_lib/types'

// Traduzione italiana. Tono dell'autore: diretto, senza registro accademico,
// rivolto al lettore.
// I termini di prodotto e i nomi propri non si traducono (Claude Code,
// Anthropic, CI, LLM).
// Gli schemi sono stati tradotti insieme al testo: uno schema in inglese
// dentro un articolo in italiano si legge come una traduzione a metà.

const POST_1_LINEAR = `scrivi un prompt  ─▶  l'IA scrive codice  ─▶  trovi il bug  ─▶  correggi il prompt  ─┐
     ▲                                                                          │
     └─────────────────────────  di nuovo a mano  ◀─────────────────────────────┘`

const POST_1_LOOP = `definisci l'obiettivo
     │
     ▼
l'IA scrive codice  ─▶  la CI esegue ogni controllo  ─▶  verde?  ─▶  ✦ pubblicato
     ▲                      │
     │                      ▼  (rosso)
     └──  l'IA legge i log e si dà da sola un nuovo prompt`

export const it: BlogOverride = {
  title: "La prompt engineering è morta. Lunga vita alla loop engineering.",
  subtitle:
    "Perché il responsabile di Claude Code in Anthropic ha appena segnalato la fine dell'era del \"sussurratore di IA\" — e cosa viene dopo.",
  description:
    "Boris Cherny, che guida Claude Code in Anthropic, dice di non scrivere più prompt per Claude — scrive loop. Dentro la morte della prompt engineering e la nascita della loop engineering: flussi di lavoro agentici, agenti autonomi che si autocorreggono, perché il verificatore conta più del prompt, e come lo stesso loop sia collegato a uno spazio di lavoro che possiedi — verifiche automatiche nel repository, memoria che sopravvive alla sessione, e un pannello di controllo che costruisce e sa ripristinare.",
  excerpt:
    "L'ingegnere che guida Claude Code in Anthropic ha appena ammesso di non interrogare più il modello con dei prompt — scrive loop che lo interrogano al posto suo. Ecco perché questo chiude l'era del \"sussurratore di IA\", e come lo abbiamo trasformato in un'architettura di produzione.",
  heroCaption: "Il post su LinkedIn che ha scatenato tutto — Boris Cherny su come scrivere loop, non prompt.",
  blocks: [
    { kind: 'h2', text: "La citazione che ha infranto l'illusione" },
    {
      kind: 'p',
      text: "Pochi giorni fa, una singola citazione di **Boris Cherny** — l'ingegnere che guida lo sviluppo di **Claude Code** presso **Anthropic** — ha silenziosamente scosso la comunità del software.",
    },
    {
      kind: 'p',
      text: "In un panel pubblico, Cherny ha svelato come lavorano davvero con i propri modelli le persone che costruiscono l'IA di programmazione più sofisticata al mondo. Quello che ha detto non si è limitato a sfidare lo status quo — ha dichiarato obsoleta un'intera disciplina emergente:",
    },
    {
      kind: 'quote',
      text: "Non scrivo più prompt per Claude. Ho dei loop in esecuzione che interrogano Claude e decidono cosa fare. Il mio lavoro è scrivere loop.",
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: "Lascia che questo si sedimenti." },
    {
      kind: 'p',
      text: "L'uomo con entrambe le mani sul volante del miglior modello per sviluppatori al mondo ti sta dicendo che ha tolto le mani dal volante. Non siede in una finestra di chat a rifinire il paragrafo perfetto di istruzioni. Scrive codice che costringe l'IA a parlare con se stessa, giudicare i propri errori e correggerli dentro un circuito autonomo e chiuso. Costruisce la macchina che guida il modello — e poi la lascia guidare.",
    },
    {
      kind: 'p',
      text: "Se stai ancora passando le giornate a rifinire prompt per estorcere all'LLM il blocco di codice giusto, il suo messaggio è brutalmente chiaro: **stai ottimizzando un mondo che è già scomparso.**",
    },

    { kind: 'h2', text: "Il cambio di paradigma: dal micromanagement all'architettura di sistema" },
    {
      kind: 'p',
      text: "Per capire perché questo è un cambiamento tettonico, guarda come si è evoluto il nostro rapporto con l'IA generativa in appena un paio d'anni.",
    },
    { kind: 'h3', text: "Fase 1 — Il prompt lineare (il collo di bottiglia umano)" },
    {
      kind: 'p',
      text: "Fino a poco tempo fa, l'intero settore era ossessionato dalla **prompt engineering**. Trattavamo gli LLM come junior brillanti ma facilmente distraibili. Il flusso di lavoro era lineare, fragile e interamente manuale:",
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: "In questo paradigma, **il collo di bottiglia è l'essere umano.** Scrivi un prompt, leggi il risultato, individui un errore di sintassi, lo incolli di nuovo in chat e speri che il modello non abbia dimenticato il contesto cinque passaggi dopo. Sembra produttivo. È un micromanagement estenuante e non scalabile — e di certo non funziona mentre dormi.",
    },
    { kind: 'h3', text: "Fase 2 — La loop engineering (il circuito autonomo)" },
    {
      kind: 'p',
      text: "Quello che Cherny descrive è la **loop engineering** — flussi di lavoro agentici in cui l'essere umano esce completamente dal ciclo di esecuzione. Smetti di guidare l'auto. Costruisci la pista e lasci che la macchina percorra i giri.",
    },
    {
      kind: 'p',
      text: "Invece di scrivere un prompt per risolvere un problema, scrivi un **loop** programmatico che incorpora l'IA in un ciclo automatico di esecuzione e verifica:",
    },
    {
      kind: 'olist',
      items: [
        "**L'obiettivo.** Un essere umano fissa un unico obiettivo di alto livello — \"costruisci questo endpoint API e raggiungi il 98% di copertura dei test\".",
        "**L'azione.** L'IA genera una prima bozza del codice.",
        "**La verifica.** Un ambiente automatico — compilatori, linter, test unitari, la tua CI — esegue il codice e individua ogni errore.",
        "**L'autocorrezione.** In caso di fallimento, il sistema cattura lo stack trace, lo restituisce all'IA come nuova istruzione e le ordina di riprovare.",
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: "Il loop corre a velocità di macchina, macinando decine di iterazioni, autocorreggendosi e autoguarendosi finché i criteri di verifica non sono soddisfatti. Non hai digitato un solo follow-up. Non hai scritto i prompt — hai costruito la pista, e il modello ha percorso ogni giro da solo.",
    },

    { kind: 'h2', text: "La vera competenza non è scrivere codice. È scrivere il giudice." },
    {
      kind: 'p',
      text: "Ecco la parte che quasi tutti si perdono — ed è l'intera posta in gioco. La parte difficile di un loop **non** è generare il codice. I modelli sono già spaventosamente bravi in questo. La parte difficile è **ciò che decide se il codice è valido.**",
    },
    {
      kind: 'p',
      text: "Dai al loop un verificatore forte e spietato — test veri, analisi statica, un compilatore che si rifiuta di mentire — e converge verso qualcosa che funziona davvero. Dagliene uno debole, e quello stesso loop produrrà allegramente un fiume infinito di spazzatura sicura e formattata alla perfezione, allucinando la strada verso un segno di spunta verde che non significa nulla.",
    },
    {
      kind: 'p',
      text: "Quindi la competenza del prossimo decennio non è l'arte del prompt. È **progettare la verifica** — i sistemi di validazione a prova di proiettile che permettono a un'IA di parlare con se stessa in sicurezza senza precipitare da un dirupo. È un tipo di ingegneria più difficile, più raro e molto più prezioso che trovare le parole giuste.",
    },

    { kind: 'h2', text: "Dalla filosofia alla produzione: come abbiamo progettato il loop" },
    {
      kind: 'p',
      text: "Mentre il resto del mondo tech smonta la citazione di Cherny sui social, la vera sfida non ha nulla di glamour: **come costruisci un'infrastruttura di loop engineering che funzioni davvero in produzione — fuori dai laboratori interni di Anthropic?**",
    },
    {
      kind: 'p',
      text: "Chiudi un loop attorno a un singolo modello e sbatti subito contro i muri del mondo reale: degrado della finestra di contesto, spirali allucinatorie mortali e nessuna memoria lungo il progetto. Su [%SITE%](/it) abbiamo passato l'ultimo anno a trattare la filosofia di Cherny non come una previsione ma come un **progetto architettonico** — e abbiamo costruito il loop su cui gira questo spazio di lavoro.",
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: "Il ciclo di sviluppo: il proprietario fissa un obiettivo, l'agente modifica il repository, verifiche automatiche lo controllano, i fallimenti tornano all'agente come nuove istruzioni, e il pannello di controllo costruisce, registra e può ripristinare",
      caption: "Il loop così com'è davvero collegato: un agente nel tuo repository, verifiche che non sanno mentire, e un pannello che chiude il circuito.",
    },
    { kind: 'h3', text: "L'anatomia di un loop di livello produttivo" },
    {
      kind: 'p',
      text: "Per rendere i loop percorribili per software reale, bisogna smettere di ammirare il modello e iniziare a costruire le tre cose senza glamour attorno ad esso — il giudice, la memoria e la mano che consegna:",
    },
    {
      kind: 'list',
      items: [
        "**Un verificatore che non si lascia convincere con le buone maniere.** Il giudice non è un secondo modello con un'opinione; è un insieme di script che fanno fallire la build. Esistono i segnali di lingua su ogni pagina pubblica? Ogni articolo ha il gemello markdown di cui ha bisogno un lettore IA? Viene referenziata un'immagine che nessuno ha caricato? Ogni controllo esiste perché quel difetto esatto è già arrivato in produzione una volta, e ciascuno risponde con un codice di uscita, non con un paragrafo.",
        "**Memoria che sopravvive alla sessione.** L'effetto amnesia è reale: quindici giri attorno a un bug ostinato e l'agente perde di vista l'architettura. Qui la memoria non è un servizio che può andare offline — sono file accanto al codice che viaggiano con il repository: l'istruzione di lavoro, le lezioni aggiunte nel momento in cui il proprietario corregge qualcosa, l'elenco degli antipattern, i casi utente confermati. Una nuova sessione inizia leggendoli, così la quindicesima iterazione sa ciò che la prima ha imparato.",
        "**Un atto finale che non appartiene all'agente.** Il loop si conclude nel pannello di controllo: costruisce il progetto, tiene un registro dei deployment e può tornare all'ultima build funzionante. Impostazioni, testi e immagini cambiano lì senza alcuna ricostruzione — così al loop non viene mai chiesto di risolvere ciò che non è mai stato un problema di codice.",
      ],
    },
    {
      kind: 'p',
      text: "Nota cosa **non** c'è in quella lista: uno sciame di modelli che si supervisionano a vicenda. Quella era la nostra prima architettura, e l'abbiamo rimossa. L'orchestrazione è la parte più eccitante di un diagramma agentico e la parte meno portante di uno che funziona — un giudice debole non si aggiusta aggiungendo una seconda opinione, e uno forte raramente ne ha bisogno.",
    },

    { kind: 'h2', text: "La nuova descrizione del lavoro dell'ingegnere software" },
    {
      kind: 'p',
      text: "Ci stiamo allontanando dallo scrivere codice, oltre lo scrivere prompt, e dritti verso **costruire pipeline cognitive.** Il mestiere non è più l'istruzione — è il sistema dentro cui gira l'istruzione.",
    },
    {
      kind: 'p',
      text: "E non è gratis. Con i loop arrivano due nuovi costi. **Debito di comprensione:** quando un agente scrive e riscrive un file trecento volte dietro le quinte, la tua padronanza del tuo stesso codice si erode silenziosamente — funziona, semplicemente non sei più sicuro del perché. E **calcolo puro:** un loop può bruciare soldi veri in token inseguendo un bug attraverso cento tentativi silenziosi. Gli ingegneri che vincono in questa era trattano il rapporto costo-qualità come una decisione di progettazione deliberata, non come una sorpresa in fattura.",
    },
    {
      kind: 'cta',
      text: "Questo sito è uno di quei loop: le pagine che stai leggendo sono file statici che una verifica ha rifiutato di pubblicare finché non hanno portato con sé i loro segnali di lingua, il loro gemello markdown e il loro posto nella mappa del sito.",
      href: '/it',
      label: "Guarda lo spazio di lavoro su cui gira",
    },
    {
      kind: 'p',
      text: "L'era della prompt engineering è ufficialmente alle spalle. Resta solo la domanda a cui Cherny ha già risposto per se stesso: **stai ancora cercando di parlare con la tua IA — o stai già costruendo i loop che la lasciano correre?**",
    },
    {
      kind: 'note',
      text: "Fonte: un post su LinkedIn ampiamente condiviso di Guillermo Flor che ha portato alla luce le parole di Boris Cherny. La citazione è riprodotta così come è circolata; l'architettura e l'analisi sono nostre.",
    },
  ],
  faq: [
    {
      q: "Cos'è la \"loop engineering\" e perché sta sostituendo la prompt engineering?",
      a: "La loop engineering significa scrivere flussi di lavoro automatizzati che interrogano l'IA, fanno passare il suo output attraverso un verificatore (test, CI, un compilatore), restituiscono i fallimenti come nuove istruzioni e ripetono — finché il risultato non è corretto. Boris Cherny, che guida Claude Code in Anthropic, ha detto che non scrive più prompt a mano: scrive i loop che lo fanno per lui. L'intuizione chiave è che il collo di bottiglia non è mai stato il prompt — era l'essere umano nel ciclo di feedback.",
    },
    {
      q: "Come è collegato qui, in produzione, il ciclo di sviluppo?",
      a: "Un agente di codice lavora dentro il tuo stesso repository, sulla tua macchina, con l'istruzione di lavoro del progetto accanto al codice. Il verificatore è un insieme di controlli che girano a ogni build e la fanno fallire: segnali di lingua su ogni pagina pubblica, un gemello markdown per ogni pagina pubblicata, nessuna immagine referenziata che non sia mai stata caricata, nessun dizionario privo di una chiave. Un fallimento torna all'agente come nuova istruzione, e il ciclo si ripete. Il pannello di controllo chiude il circuito — costruisce il progetto, registra ogni deployment e può tornare all'ultima build funzionante.",
    },
    {
      q: "Devo scrivere codice per far girare questo loop?",
      a: "Non per la maggior parte di ciò che un sito cambia davvero. Il nome, la descrizione, le immagini, le lingue, l'analitica e i testi delle impostazioni vivono nel pannello di controllo e si applicano senza alcuna ricostruzione — sono dati, non codice. I cambiamenti di codice sono ciò che fa l'agente nel tuo repository; tu li leggi e li approvi, e il pannello costruisce il risultato. Il confine onesto è questo: nessuno promette che non guarderai mai un diff — ti viene promesso che non dovrai mai eseguire la build a mano, e che una build rotta può essere ripristinata con un clic.",
    },
  ],
}

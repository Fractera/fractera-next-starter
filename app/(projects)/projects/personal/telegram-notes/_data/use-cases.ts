// Use cases (step 207.10 items 4 & 6) — plain-language scenarios that replace the abstract "About" text.
// Each is one thing the owner can actually DO with this automation, written as: what you say to the bot →
// what it does. Rendered as one accordion item per scenario (use-cases-accordion.client.tsx). Data only.
export type UseCase = { id: string; title: string; summary: string; steps: string[] };

export const USE_CASES: UseCase[] = [
  {
    id: "save",
    title: "Remember something",
    summary: "Tell the bot a fact and it keeps it for you.",
    steps: [
      "Message the bot, e.g. “remember the wifi password is sunflower42”.",
      "It saves the note (you’ll see it in Records).",
      "Later ask “what’s the wifi password?” and it finds the answer.",
    ],
  },
  {
    id: "remind",
    title: "Set a reminder",
    summary: "Say when, and it pings you at the right time.",
    steps: [
      "Say “remind me to call mom today at 19:00”.",
      "It schedules the reminder (it shows on the Calendar).",
      "At 19:00 the bot messages you.",
    ],
  },
  {
    id: "money-voice",
    title: "Track money by voice",
    summary: "Speak a spend or an income; it files it with a category.",
    steps: [
      "Say “spent 12 on lunch” or “got paid 1000”.",
      "It records the movement in Finances and tags a category.",
      "Everything is grouped as income vs expense.",
    ],
  },
  {
    id: "receipt",
    title: "Digitize a receipt",
    summary: "Send a photo; it reads the amount and files it.",
    steps: [
      "Take a photo of a receipt and send it to the bot.",
      "It reads the total and adds a finance record with the image attached.",
      "Ask for the image back any time with /photo and the record number.",
    ],
  },
  {
    id: "money-question",
    title: "Ask a money question",
    summary: "From a simple total to a full break-even.",
    steps: [
      "Ask “how much did I spend on food this week?” — it adds it up.",
      "Ask to balance income vs expense (“help me break even”) — it walks you through period and categories, then shows a dated checklist and the total.",
    ],
  },
  {
    id: "return",
    title: "Get something back in the chat",
    summary: "Pull a saved note or receipt image back to Telegram.",
    steps: [
      "Send /note followed by the record number to get a saved note’s full text.",
      "Send /photo followed by the number to get a receipt image (plus a clickable link).",
    ],
  },
  {
    id: "beyond",
    title: "Do something beyond the defaults",
    summary: "Ask for a new capability and it shows you how.",
    steps: [
      "Ask for something the automation can’t do yet.",
      "It replies with how to hand your change to a coding agent — write the steps in the architecture page, then launch the automation to the agent.",
    ],
  },
];

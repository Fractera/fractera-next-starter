// Use cases (step 207.10 items 4 & 6; extended step 207.16 with the image-linking "editing state",
// point money questions, follow-ups with history, and the "how to update the logic" instruction) —
// plain-language scenarios that replace the abstract "About" text. Each is one thing the owner can
// actually DO with this automation, written as: what you say to the bot → what it does. Rendered as one
// accordion item per scenario (use-cases-accordion.client.tsx). Data only.
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
    id: "photo-then-words",
    title: "Photo and words — in any order",
    summary: "Send a photo first and the story later (or the other way round) — the bot links them.",
    steps: [
      "Send a photo the bot can’t read an amount from (a dish, a thing you bought) — it keeps the photo and asks for the story.",
      "Then tell it, e.g. “пирожок за 5,50 в кафетерии” — the record is created WITH that photo attached.",
      "Or the other way round: record the purchase by voice first, then send the photo with “добавь это фото / этот самый…” — it attaches to the record.",
      "A bare photo right after a photo-less purchase attaches automatically.",
    ],
  },
  {
    id: "money-question",
    title: "Ask a money question",
    summary: "From “did Petya return the debt?” to a full break-even.",
    steps: [
      "Ask about a specific purchase or person — “сколько стоила курица?”, “Петя возвращал долг?” — it answers with the actual records (and offers the receipt photo when there is one).",
      "Ask “how much did I spend on food this week?” — it adds it up.",
      "Ask for everything at once — it reports income, expense and the net balance separately.",
      "Ask to balance income vs expense (“help me break even”) — it walks you through period and categories, then shows a dated checklist and the total.",
    ],
  },
  {
    id: "follow-up",
    title: "Follow up on the last answer",
    summary: "The bot remembers the last ~10 messages of the conversation.",
    steps: [
      "After any answer you can say “а повтори на русском”, “translate it”, “а подробнее?” — it understands what “it” is.",
      "A pause longer than 15 minutes starts a fresh conversation (old context is not spent on).",
    ],
  },
  {
    id: "return",
    title: "Get something back in the chat",
    summary: "Pull a saved note or receipt image back to Telegram.",
    steps: [
      "Ask in plain words — “покажи чек”, “покажи какую курицу я покупал” — it finds the record and sends the photo.",
      "Or send /note followed by the record number to get a saved note’s full text.",
      "Or /photo followed by the number to get a receipt image (plus a clickable link).",
    ],
  },
  {
    id: "beyond",
    title: "Do something beyond the defaults",
    summary: "Ask for a new capability and it shows you how.",
    steps: [
      "Ask for something the automation can’t do yet.",
      "It replies with how to hand your change to a coding agent — see “Как обновить логику” below for the full walkthrough.",
    ],
  },
];

// «Как обновить логику» (step 207.16) — the owner's canonical walkthrough, verbatim intent preserved
// (errors fixed, NOT shortened — owner requirement). Shown by the button as-is; the accordion item
// carries the fuller formatted version plus the automation's real Telegram link (bot-link route).
export const UPDATE_LOGIC_TEXT =
  "При обновлении логики используются агенты-программисты, такие как Claude Code, Codex и другие внутри " +
  "Fractera. Вам нужно сначала найти служебную страницу, связанную с проектом, а затем открыть todo-лист " +
  "и дополнить комментарии о том, как это должно работать. После этого в левой колонке наведите фокус на " +
  "название проекта — и вы увидите иконку ракеты; нажмите её, чтобы передать ваши записи из todo-листа в " +
  "разработку. Агент-программист сразу же начнёт разработку. Обратите внимание: у вас должна быть активна " +
  "подписка, и вы должны войти в соответствующего агента-программиста — имеется в виду, что кнопка вверху " +
  "должна иметь зелёный индикатор. В дальнейшем отслеживать шаги разработки вы можете в служебной странице " +
  "Development Steps. Чтобы больше узнать об особенностях работы и архитектуры, перейдите на вкладку Brain " +
  "и задайте вопрос агенту Гермес — или напишите в соответствующий ему чат Telegram.";

// The fuller accordion version — the same canonical text, step by step (nothing dropped, details added).
export const UPDATE_LOGIC_STEPS: string[] = [
  "При обновлении логики используются агенты-программисты, такие как Claude Code, Codex и другие внутри Fractera — вы не правите код руками, вы ставите задачу агенту.",
  "Сначала найдите служебную страницу, связанную с проектом (кнопка Continue внизу этой страницы открывает её: Admin → Service → Architecture с фокусом на этом проекте).",
  "Откройте todo-лист проекта и дополните комментарии: опишите, как новая логика должна работать — чем подробнее, тем точнее результат.",
  "В левой колонке наведите фокус на название проекта — появится иконка ракеты. Нажмите её, чтобы передать ваши записи из todo-листа в разработку.",
  "Агент-программист сразу же начнёт разработку.",
  "Обратите внимание: у вас должна быть активна подписка, и вы должны войти в соответствующего агента-программиста — кнопка этого агента вверху должна иметь зелёный индикатор.",
  "Отслеживать шаги разработки можно на служебной странице Development Steps.",
  "Чтобы больше узнать об особенностях работы и архитектуры, перейдите на вкладку Brain и задайте вопрос агенту Гермес — или напишите в соответствующий ему чат Telegram (ссылка ниже).",
];

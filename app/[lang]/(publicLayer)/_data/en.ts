import type { HomeCell } from './index'

// Английская основа главной. Слова перенесены из прежнего словаря
// `home.i18n.json` (шаг 508) — заново не переводились.
export const en: HomeCell = {
  title: 'This is your application starter',
  // Описание для ПОИСКА — коротко и по делу. Длинный текст первого экрана живёт
  // в секции `heroSplit` ниже: сниппет обрезается примерно на 160 знаках, и
  // сильный абзац, попав сюда целиком, превратился бы в оборванную фразу.
  description: 'Your own server, your own code: authorization, database, storage and vector search already wired together. Build a landing page or a SaaS in 82 languages.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Agentic engineering infrastructure',
    title: 'This is your application starter',
    description:
      'Everything is already installed and wired together — authorization, your own database, file storage, vector search and a hundred tools more, organised so a coding agent finds them without being told twice. Build a landing page, a SaaS, or automation that never sleeps, in any of 82 languages, on a skeleton cut for a project that will pass a million lines. Roughly **nine times faster** than assembling the same stack yourself — and nothing here calls home: no vendor, no subscription, nobody to ask for permission. The server is yours, the code is yours, **one hundred percent**.',
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Take it free, scale it up' },
    image: 'homePage',
    imageAlt: 'SaaS starter template',
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
      { value: '×4', label: 'cheaper to build' },
      { value: '×9', label: 'faster to launch' },
      { value: '×100', label: 'more reliable in production' },
    ],
  },
  {
    kind: 'badges',
    items: [
      // 🔒 ПЕРВЫМ И БЕЗ ПЕРЕВОДА — решение владельца 2026-08-22. «Open Code» это
      // ИМЯ лицензионной модели (source-available), а не описание свойства: у него
      // есть точное определение, и перевод его теряет — «открытый код» читается
      // как open source по OSI, чем эта лицензия не является. Имя остаётся одним
      // и тем же во всех языках, как остаётся «SEO» и «AIO» строкой ниже.
      { label: 'Open Code', tone: 'code' },
      { label: '82 languages', tone: 'reach' },
      { label: 'SEO built in', tone: 'reach' },
      { label: 'AIO agentic browsing', tone: 'reach' },
      { label: 'Own database', tone: 'data' },
      { label: 'Vector search', tone: 'data' },
      { label: 'Knowledge graph', tone: 'data' },
      { label: 'Own file storage', tone: 'data' },
      { label: 'Authorization', tone: 'access' },
      { label: '{roles} roles', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Fractera architecture', tone: 'code' },
      { label: '100+ more', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Process',
    title: 'How it works',
    note: 'From a bare server to your own code in production. Everything below runs on hardware that is yours.',
    steps: [
      { title: 'Stand up the server', text: 'Deploy it with the Fractera [installer robot](https://www.fractera.ai/deployments/vps). You get an operating system, a starter template, the control panel, storage and authorization — installed and wired together.' },
      { title: 'Develop where you already work', text: 'Sync with GitHub, then clone onto your own machine and run Claude Code or Codex. The data keeps coming from your server; the code runs in your own IDE.' },
      { title: 'Push, and it deploys itself', text: 'Finish on the local machine and push the project to GitHub. That immediately starts a new deployment on your own server — and the visitor sees the new project.' },
    ],
  },
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
  {
    kind: 'cards',
    badge: 'Getting started',
    title: 'How to start',
    note: 'Everything below is already installed — you are switching it on, not building it. The left column is the path; the right one is what saves you from walking it twice.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Seven steps from a bare server' },
          { kind: 'p', text: 'Start the [installer robot](https://www.fractera.ai/deployments/vps) to get this project.' },
          {
            kind: 'olist',
            items: [
          'Open the control panel — everything about this server is configured there. [Control panel]({admin}/{lang})',
          'Pick the languages your application will ship in. [Languages]({admin}/{lang}/languages)',
          'Use the settings to describe your project: name, description, logo, SEO. [App settings]({admin}/{lang}/app-settings)',
          'Connect GitHub and push the server\'s code into your repository. [GitHub]({admin}/{lang}/github)',
          'Clone that repository onto your own machine, develop there, and push back.',
          'Move the environment file `.env.local` to your machine — git never carries it, and without it your local copy will not start. [Environment variables]({admin}/{lang}/env)',
          'Press Deploy in the panel — the server takes your commit and rebuilds itself. [Deployments]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Recommended before you start' },
          { kind: 'p', text: 'None of these blocks anything. All three save rework.' },
          {
            kind: 'list',
            items: [
              '**An OpenAI key.** Without it the Quiz asks no questions, and with no cases the coding agent refuses to build. The site still works — only vector search and the knowledge graph stay empty. Entered once; the cost goes straight to your model provider. [OpenAI key]({admin}/{lang}/openai)',
              '**Your own domain.** On a numeric address there is no certificate and no installable app — a browser grants those only over a secure connection. Moving later changes every page address, so it is cheaper before they are indexed. [Domain]({admin}/{lang}/domain)',
              '**Claude extension for Chrome.** Without it the agent sees only source: console errors, behaviour with JavaScript off and how the finished page actually looks are written nowhere in the code. With it he opens the page himself and fixes what is there instead of what he guessed. [Development tools]({admin}/{lang}/dev-tools)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Before any code',
    title: 'Quiz — seven questions instead of a blank page',
    note: 'A project\'s most expensive mistake is made before the first line of code: the wrong thing gets built. Not through poor building, but because «where do I start» is hard to answer alone. Quiz turns it into a conversation: you answer, the model asks further, and out of it grows the list of scenarios the project is then built from.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'The seed' }, { kind: 'p', text: 'Seven short questions: what the product is, who it is for, what a person should walk away with. Answer in your own words — dictation works. Everything after this grows from here, so a couple of sentences yields a markedly better result than a couple of words.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'The conversation' }, { kind: 'p', text: 'Then one question at a time, in your language. There is an auto-quiz: the model asks five new questions and answers them itself, deepening the description — but anything it invented on your behalf is marked «Assumption», and you correct it. A guess passed off as fact would surface later, inside the finished scenarios.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'The scenarios' }, { kind: 'p', text: 'The conversation is synthesised into numbered cases: who arrives, what they do, what must be true at the end. You read and confirm each one separately. An unread case is still the model\'s guess.' }] },
    ],
  },
  { kind: 'statement', text: 'And this is a product rule, not advice: while a single case is unconfirmed the panel keeps its alarm lit and the coding agent refuses to build. Building on an unread guess costs more than not building at all.' },
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Take it free, scale it up' },
  {
    kind: 'cards',
    badge: 'Architecture',
    title: 'What this project is, technically',
    note: 'Three things worth knowing before you build on it: what the skeleton is, where the code is actually written, and what happens when the project outgrows its first hundred pages.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'This is not a finished site but the Fractera architecture: one skeleton carries a landing page, a large SaaS and multi-level automation alike. Growth needs no rewrite — the data, authorization and panel layers are already separate, and each is built for load you do not have yet.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Code is not written here. A developer clones the repository to their own machine and works with Claude Code, which reads the instructions and skills that live inside the project: they state the rules, and machine checks refuse to let them be broken. The server only receives the result and rebuilds.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'The skeleton is built for a project that will outgrow a million lines: every entity owns its folder, the shared layer does not grow with their number, and routes and permissions are declared where they are enforced. Stability here is not a promise but a consequence — a new page adds nothing to a central spine.' }] },
    ],
  },
  {
    kind: 'quote',
    lead: 'Ready for heavy load',
    text:
      'The hidden reality of vibe coding: most of a project is built with no thought for heavy load, for saving database queries, for caching. Not because developers do not know about it — but because holding that standard inside a framework is genuinely hard. Too many small things quietly push a page off static generation and into dynamic rendering. And the difference is not five percent, or ten: in some cases the load on your server grows a thousandfold, and your bill for servers and platforms grows with it. Fractera is built on one long experience: more than thirty years of web development. Everything about heavy load, search optimisation and saving on databases is written into the DNA of this project. It is its skeleton and its life force. And it is yours for free.',
    cite: 'Roma Armstrong · founder of Fractera',
  },
  // Завершающая секция (outro) — всегда последняя, всегда во всю ширину.
  {
    kind: 'noBill',
    badge: 'Independence',
    heading: 'A fully independent space',
    note: 'On a typical project these are three outside services — their pricing, their terms, and their permission for your project to keep running. Here all three live on your own server.',
    items: [
      { vendor: 'Vercel', text: 'you do not pay', badge: { label: 'hosting', tone: 'reach' } },
      { vendor: 'Neon', text: 'you do not pay', badge: { label: 'database', tone: 'data' } },
      { vendor: 'Clerk', text: 'you do not pay', badge: { label: 'authorization', tone: 'access' } },
    ],
    title: 'You pay nobody',
    text: 'You depend on nobody. The project is yours, end to end.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'problemSolution',
    badge: 'Moving is easy',
    title: 'How to move your project to the Fractera architecture',
    note: 'Your project already runs — on Vercel or somewhere else. And you pay: for hosting, for the database, for image storage, for authorization, for email. Every service bills you separately, and every bill grows as you do. Moving looks impossible — it is not: Fractera takes your project apart and rebuilds it on its own architecture, on your server, where all of that is already there and costs nothing extra.',
    demandLabel: 'What you do',
    answerLabel: 'Why it works on Fractera',
    items: [
      {
        title: 'Install Fractera',
        demand: 'Buy a server — from three euros a month. Buy a domain — from a dollar a year. Start the installer robot and follow it: everything after that it does on its own.',
        answer: 'Three euros is your entire hosting bill. Not for the first month, not "until you pass the limit" — at all. Database, image storage, sign-in, email are already standing on your server and are included in those three euros. There is nothing left to pay for separately.',
      },
      {
        title: 'Choose the migration mode',
        demand: 'In the panel open the "Move to Fractera" tab and give the address of your repository. While you are moving, keep it public — yours and the Fractera one; you can close them again at any time. Save the mode.',
        answer: 'This is the only setting you touch by hand. From here the project knows it is moving and behaves accordingly: it does not build from an empty page, it takes apart what you have already written.',
      },
      {
        title: 'Tell the agent',
        demand: 'Open the project in your own editor on your own machine — where you normally work. Start it and tell the agent you are beginning the move. In ordinary words, the way you would tell a colleague.',
        answer: 'From there it reads your old project itself: the architecture, the libraries, what depends on what. You do not have to explain anything or remember anything — it looks at the code, not at your memory.',
      },
      {
        title: 'Get the plan in steps',
        demand: 'Nothing. Look at what came out: the huge task "move the project" is laid out as steps, each with its number and its purpose.',
        answer: 'The move stops being frightening because it stops being one lump. You see the list: what is done, what is running now, what comes next. There is nowhere to get stuck halfway and lose the thread.',
      },
      {
        title: 'Raise the skeleton',
        demand: 'Answer questions about rights: who will be able to see and change what in your application. There are few of them, and all are about your product, not about technology.',
        answer: 'The frame goes up first — page addresses, tables, sign-in, repositories: public for the code, closed for what must not be shown. A frame is raised once, and the project grows inside it instead of being rebuilt for every new feature.',
      },
      {
        title: 'Add the features',
        demand: 'Walk the steps. One step, one feature: a page, a form, a payment, letters. Tick off what is done and add new ones whenever you think of them.',
        answer: 'Every step is checked and you are shown that it works: not "the build passed", but a live page with your own text. So you always know where you are, and you never end up with a project that is "sort of ready".',
      },
      {
        title: 'Move the data',
        demand: 'Give the agent access to your databases. It moves across what has already piled up: users, orders, texts, pictures.',
        answer: 'This is the last step. After it you have a full working copy of the project on your own server — with your data, your people and your domain. The old invoices can be cancelled: from now on you pay for the server and the domain, and nothing else.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Eighty-two languages, ready before you need them',
    note: 'Every one of them ships with the product — you enable the ones your market speaks. Static generation, search and AI optimisation, data caching and readiness for heavy load hold efficiency at the top of the industry — and hold it equally whether you run one language, several, or all eighty-two.',
  },
],
  faq: [
    {
      q: 'How much does it cost, and are there hidden charges?',
      a: 'There are no hidden charges because there is nobody to pay: the platform is open code, and everything you install and use belongs to you a hundred per cent. Your costs are your own server, your domain and cloud AI if you use it; you count those yourself and pay the provider directly. We take no subscription, no percentage, no per-user fee.',
    },
    {
      q: 'What is the main advantage?',
      a: 'Reliability — that is where the bet is placed. There are many ways to throw an application together today, and it is worth having no illusions: nearly all of them are built so that you pay first of all for your own mistakes. An efficient application is in your interest only; whoever sells you services has an interest in you buying and paying for as many separate ones as possible. The expensive part comes later — breaking the law and being fined over where the data sits, unforeseen shutdowns, sanctions, and simply losing your data. Fractera closes that by keeping all of it on your own server.',
    },
    {
      q: 'What if I need more than this?',
      a: 'Your main tool is your own — Claude Code, Codex or another — and it runs on your own machine. The project scales far: the skeleton is cut for millions of lines and stays efficient. And if you need a conceptual change to the architecture at the control-panel level, or building the application is still hard, send a request to admin@fractera.ai and a developer will get in touch and offer a solution.',
    },
  ],
}

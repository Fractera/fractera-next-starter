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
    image: 'homePage',
    imageAlt: 'SaaS starter template',
  },
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
      { label: '82 languages', tone: 'reach' },
      { label: 'SEO built in', tone: 'reach' },
      { label: 'Own database', tone: 'data' },
      { label: 'Vector search', tone: 'data' },
      { label: 'Knowledge graph', tone: 'data' },
      { label: 'Own file storage', tone: 'data' },
      { label: 'Authorization', tone: 'access' },
      { label: '{roles} roles', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
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
      { title: 'Stand up the server', text: 'Deploy it with the Fractera installer robot. You get an operating system, a starter template, the control panel, storage and authorization — installed and wired together.' },
      { title: 'Develop where you already work', text: 'Sync with GitHub, then clone onto your own machine and run Claude Code or Codex. The data keeps coming from your server; the code runs in your own IDE.' },
      { title: 'Push, and it deploys itself', text: 'Finish on the local machine and push the project to GitHub. That immediately starts a new deployment on your own server — and the visitor sees the new project.' },
    ],
  },
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
          { kind: 'h3', text: 'Six steps from a bare server' },
          {
            kind: 'olist',
            items: [
          'Open the control panel — everything about this server is configured there. [Control panel]({admin}/{lang})',
          'Pick the languages your application will ship in. [Languages]({admin}/{lang}/languages)',
          'Use the settings to describe your project: name, description, logo, SEO. [App settings]({admin}/{lang}/app-settings)',
          'Connect GitHub and push the server\'s code into your repository. [GitHub]({admin}/{lang}/github)',
          'Clone that repository onto your own machine, develop there, and push back.',
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
          { kind: 'p', text: 'Neither blocks anything. Both save rework.' },
          {
            kind: 'list',
            items: [
              '**An OpenAI key.** Without it the Quiz asks no questions, and with no cases the coding agent refuses to build. The site still works — only vector search and the knowledge graph stay empty. Entered once; the cost goes straight to your model provider. [OpenAI key]({admin}/{lang}/openai)',
              '**Your own domain.** On a numeric address there is no certificate and no installable app — a browser grants those only over a secure connection. Moving later changes every page address, so it is cheaper before they are indexed. [Domain]({admin}/{lang}/domain)',
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
  { kind: 'cta', href: '{admin}/{lang}/doc-use-cases', label: 'Open Quiz' },
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
  },
  {
    kind: 'languageMarquee',
    title: 'Eighty-two languages, ready before you need them',
    note: 'Every one of them ships with the product — you enable the ones your market speaks. Static generation, search and AI optimisation, data caching and readiness for heavy load hold efficiency at the top of the industry — and hold it equally whether you run one language, several, or all eighty-two.',
  },
],
}

import type { BlogBase, BlogBlock, FaqPair } from '../../_lib/types'

// Английская языковая ячейка — основа записи. Голос студии: «мы» о себе, «вы» о
// читателе, без академического тона. Читатель здесь — ПОСЕТИТЕЛЬ сайта и
// возможный заказчик, а не программист: механику объясняем словами, которые
// понятны без словаря.
//
// 🔒 ИМЯ САЙТА НЕ НАБИРАЕТСЯ РУКАМИ. Единственная законная форма ссылки на себя —
// `[%SITE%](/en)`; подпись подставляет рендерер из настроек проекта. Вписанное
// руками имя уехало бы в каждый проект, собранный из этого шаблона.
//
// 🔒 ВИД РАЗДЕЛА НЕ ПОВТОРЯЕТСЯ НА СТРАНИЦЕ. `table` сравнивает два устройства,
// `metrics` несёт числа, `quote` — голос источника, `flow` — порядок шагов,
// `callout` — оговорку в стороне, `statement` — вывод, `olist` — перечень
// источников. Второй раздел того же вида читался бы как повтор ещё до того, как
// прочитаны слова.
//
// 🔒 ЧИСЛА ВЗЯТЫ ИЗ НАЗВАННЫХ ИССЛЕДОВАНИЙ, А НЕ ИЗ ПАМЯТИ. Перечень источников
// стоит последним разделом; проверены дословно по первоисточникам 2026-08-21.
export const en: BlogBase = {
  title: 'Every Page Here Was Finished Before You Asked for It',
  subtitle:
    'We build sites where the page already exists as a file by the time you click. Here is what that means, why we do it, and what it changes for the person reading.',
  description:
    'Why we prerender every public page instead of assembling it on each visit: what a visitor gets from it, what the numbers say, and where we honestly stop being static.',
  excerpt:
    'Most sites assemble the page while you wait. Ours are finished in advance and handed over as files. That single choice decides how fast the page arrives, whether it survives a bad connection, and whether a search engine ever sees the whole of it.',
  blocks: [
    {
      kind: 'p',
      text:
        'You are reading this on [%SITE%](/en), and this page was not made for you. It was made before you arrived — written, checked and turned into a finished document days ago. When you clicked, nothing had to be assembled: the server looked up a file and handed it over. This post is about why we build almost every page that way, and what you get out of it that has nothing to do with our convenience.',
    },

    { kind: 'h2', text: 'Two ways to answer a visitor' },
    {
      kind: 'p',
      text:
        'A website can answer a request in one of two ways, and the difference is the whole story. It can **assemble the page while you wait** — wake up, ask the database, decide what your version looks like, render it, then send it. Or it can **have the page ready** and simply send it. Both look identical when everything goes well, on a fast phone, on a good network, at a quiet hour. They stop looking identical the moment something goes wrong.',
    },
    {
      kind: 'table',
      caption: 'The same click, answered two ways.',
      headers: ['When you open a page', 'Assembled on request', 'Finished in advance'],
      rows: [
        [
          'What happens at that moment',
          'The server wakes, queries the database, renders the HTML, then replies',
          'The server finds a finished file and sends it',
        ],
        [
          'A hundred people arrive at once',
          'That work is done a hundred times',
          'The same file is sent a hundred times',
        ],
        [
          'Scripts fail to load on a bad connection',
          'Often a blank screen — the text was going to be drawn in your browser',
          'The words are already in the document you received',
        ],
        [
          'The database is having a bad day',
          'The page cannot be produced at all',
          'The page is unaffected; only genuinely live parts are',
        ],
        [
          'A search engine or an AI assistant reads it',
          'Whatever happened to be finished in time',
          'The whole page, the same as a person sees',
        ],
      ],
    },

    { kind: 'h2', text: 'What the waiting actually costs' },
    {
      kind: 'p',
      text:
        'Speed is easy to dismiss as vanity, so it is worth looking at what has been measured. Google’s own guidance puts the bar for the main content of a page appearing at **2.5 seconds or less**, measured at the 75th percentile of loads — not for your best visitor, but for the unlucky quarter on a tired phone in a lift. And a study commissioned by Google and prepared by Deloitte, which watched four weeks of mobile traffic across retail, travel, luxury and lead-generation brands in Europe and the US, put a price on a single tenth of a second.',
    },
    {
      kind: 'metrics',
      items: [
        { value: '+8.4%', label: 'retail conversions after a 0.1 s speed-up' },
        { value: '+9.2%', label: 'average order value in retail' },
        { value: '+10.1%', label: 'travel conversions, same study' },
        { value: '4', label: 'weeks of mobile traffic observed' },
      ],
    },
    {
      kind: 'p',
      text:
        'A tenth of a second is not a redesign. It is roughly the difference between handing over a file and building the answer first — which is the entire subject of this post. And the benefit is not only commercial: the same speed decides whether a person on a train, on a rural connection, or on a five-year-old phone sees your business at all, or sees a white rectangle and goes back.',
    },
    {
      kind: 'quote',
      text: 'Core Web Vitals are used by our ranking systems.',
      cite: 'Google Search Central — “Understanding page experience in Google Search results”',
      lead: 'It is also how you are found',
    },
    {
      kind: 'p',
      text:
        'Google is careful to say this is one signal among many and that good numbers alone do not lift you up the results. We are equally careful: **we do not promise rankings.** What we can promise is that the page will not be the reason you lose them.',
    },

    { kind: 'h2', text: 'What a visitor gets, in plain terms' },
    {
      kind: 'list',
      items: [
        '**The words arrive with the page.** The text you are reading is inside the document your browser downloaded, not painted in afterwards by a script. Turn JavaScript off and this article still reads perfectly — that is a deliberate property, tested on every build, not a happy accident.',
        '**A busy day does not slow it down.** Handing out the same finished file a thousand times costs almost nothing. Sites that build each page on demand get slower exactly when they are most popular, which is exactly when it matters.',
        '**Less can break.** A page that needs no database at the moment you open it cannot be broken by a database. Fewer moving parts between your click and your screen means fewer ways for the answer to go missing.',
        '**Machines read the same page you do.** Search engines and AI assistants get the complete text, not a shell that would have filled itself in a browser they do not run. Everything published here also has a plain-text twin written for exactly that audience.',
      ],
    },
    {
      kind: 'figure',
      media: 'image',
      src: '/blog-media/pages-built-in-advance.jpg',
      alt:
        'A shelf of finished pages on the left; one of them is highlighted and an arrow carries it straight into a browser window on the right, already fully drawn.',
      caption: 'The whole trick: the page is not produced when you ask. It is picked up and handed over.',
    },

    { kind: 'h2', text: 'How we actually build one' },
    {
      kind: 'flow',
      badge: 'How we work',
      title: 'From a folder of words to a file on a server',
      note: 'Four steps, and a page is only published if it survives all four.',
      steps: [
        {
          title: 'The words live in a folder',
          text:
            'Each page is a folder with its own text inside — one file per language, sitting beside the page it belongs to. Nothing is stitched together from a database at the moment you open it, and deleting the folder removes the page completely, translations included.',
        },
        {
          title: 'A build turns them into finished documents',
          text:
            'Before anything goes live, the whole site is rendered once into ready HTML. That is the step that moves the waiting off your visit and onto our clock, where it belongs.',
        },
        {
          title: 'Machine checks refuse the broken ones',
          text:
            'A picture referenced but never committed, a language that lost its translation, a page that quietly stopped being static — each of those fails the build instead of reaching you. Every check exists because that exact mistake shipped once.',
        },
        {
          title: 'Your browser receives a file',
          text:
            'Nothing is computed for you, because there is nothing left to compute. The server’s only job is to find the right document and send it.',
        },
      ],
    },
    {
      kind: 'callout',
      title: 'But things do change — what then?',
      text:
        'A finished page is not a frozen one. Pages that carry changing information are given a short shelf life: when it runs out, the server quietly refreshes that one page in the background while everyone keeps receiving the ready copy. Text, images, prices and the languages of the site are edited in a control panel and take effect without rebuilding anything.',
    },

    { kind: 'h2', text: 'Where we stop being static, on purpose' },
    {
      kind: 'p',
      text:
        'Anything that belongs to **you alone** cannot be prepared in advance, and we do not pretend otherwise. Your order history, your account, a basket, a signed-in dashboard — those are drawn after you sign in, because a page prepared for everybody is by definition not private. The rule we hold to is simply this: the public part of a site, the part a stranger and a search engine meet first, has no excuse to be assembled on demand.',
    },
    {
      kind: 'p',
      text:
        'There is a second, quieter cost, and it is ours: building in advance means we have to know what a page says before anyone asks. That is more discipline for us and less improvisation. We think that trade is obviously worth it, and we would rather say it out loud than let you discover it in a proposal. Who “we” are is on the **About us** page in the footer.',
    },
    {
      kind: 'statement',
      text:
        'Speed is not decoration. It is the first thing a site says to a stranger, and it is said before a single word has been read.',
    },

    { kind: 'h2', text: 'Sources' },
    {
      kind: 'olist',
      items: [
        '**Largest Contentful Paint (LCP)** — web.dev, Google. The “good” threshold is 2.5 seconds or less, assessed at the 75th percentile of page loads across mobile and desktop.',
        '**“Understanding page experience in Google Search results”** — Google Search Central. The sentence quoted above appears there verbatim, alongside the caveat that there is more to page experience than these scores alone.',
        '**“Milliseconds Make Millions”** — commissioned by Google and prepared by Deloitte Ireland LLP on data from Fifty-Five. Four weeks of mobile site data from retail, travel, luxury and lead-generation brands across Europe and the US. A 0.1 s improvement in mobile site speed produced +8.4% retail conversions, +9.2% average order value and +10.1% travel conversions.',
      ],
    },
    {
      kind: 'note',
      text:
        'The three numbers above are quoted from those published studies and were checked against the originals. Everything else in this article is our own practice, and we are happy to be argued with about it.',
    },
  ] satisfies BlogBlock[],
  faq: [
    {
      q: 'Does “static” mean my site can never change?',
      a: 'No. It means the page is finished before a visitor asks for it, not that it is finished forever. Text, images, prices and languages are edited in a control panel and apply without rebuilding the site. Pages that carry changing information are refreshed in the background on a schedule, and everyone keeps getting a ready copy while that happens.',
    },
    {
      q: 'Will this make my site rank higher on Google?',
      a: 'Nobody can honestly promise that, and we do not. Google states that Core Web Vitals are used by its ranking systems, while also saying that good scores alone do not lift a site up the results. What a fast, complete page does guarantee is that a search engine and an AI assistant receive the whole of your content rather than a shell — and that speed is not the reason a visitor leaves.',
    },
    {
      q: 'What about a shop, a login, an account page?',
      a: 'Those are drawn for the individual person after they sign in, because a page prepared for everybody cannot be private. The split is deliberate: everything public — the home page, the articles, the catalogue, the pages in the footer — is finished in advance, and only the parts that genuinely belong to one person are produced on request.',
    },
  ] satisfies FaqPair[],
}

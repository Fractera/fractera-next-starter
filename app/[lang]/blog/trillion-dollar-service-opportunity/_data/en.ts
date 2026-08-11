import type { BlogBase } from '../../_lib/types'

// English base document. Roma Armstrong's personal piece — keep his reflective,
// direct, inspiring voice. The mandatory root anchor "Agentic Engineering
// Infrastructure" → /en lives in the "what Fractera is for" section.
export const en: BlogBase = {
  title: 'The Trillion-Dollar Opportunity Is the Salon Next Door',
  subtitle:
    'Elon Musk talked about space, AI and cars. The line that stayed with me was simpler: most businesses on earth still have no API. Here is the niche I found because of it.',
  description:
    'Why the biggest near-term money in AI is not a unicorn — it is the hair salon, the clinic, the dental office next door. The no-show problem, the businesses with no site and no CRM, and how Fractera lets almost anyone automate them in ten minutes.',
  excerpt:
    'Elon Musk said most businesses still have no API — they run on a phone, or without one. I spent dozens of meetings chasing that idea and found a niche hiding in plain sight: the salon, the clinic, the dental office next door.',
  blocks: [
    {
      kind: 'p',
      text:
        'This is a slightly unusual post, because it starts with someone else. The Elon Musk interview above caught my attention — he talked about space, about artificial intelligence, about cars. But the moment that inspired me most was a quiet one. He said that despite how the modern world feels — as if everything has already been invented, every site built, every app shipped, every business process automated — the overwhelming majority of businesses on earth do not even have an API. They run on a phone. Some of them run without even that.',
    },
    {
      kind: 'quote',
      text:
        'If AI can simply take whatever is given to the outsourced customer service company that they already use and do customer service using the apps that they already use, then you can make tremendous headway in customer service, which is, I think, 1% of the world economy or something like that. It’s close to a trillion dollars all in, for customer service.',
      cite: 'Elon Musk · Dwarkesh Patel interview, February 2026',
    },
    {
      kind: 'p',
      text:
        'Read that again with a builder’s eye. That trillion does not live in another social network or another AI wrapper — it lives inside ordinary businesses that never went digital. And the barrier was never the idea; it was the build. Hiring a team, wiring up infrastructure, paying for a stack of cloud services month after month. That barrier is exactly what Fractera removes — which is why this quiet line, not the rockets, is the one I kept.',
    },

    { kind: 'h2', text: 'Everyone learned to code. The street looks the same.' },
    {
      kind: 'p',
      text:
        'From talking to a lot of partners, I keep seeing two scenarios. On one side, a flood of developers — and even people who were never developers, people who used to be marketers or content managers — suddenly learned to program in a single year. Everyone started building. There are a lot of projects, and many of them are genuinely interesting. And in the real world? In the real world everything is exactly the same.',
    },
    {
      kind: 'p',
      text:
        'So it turns out that some of us found a wonderful way to please ourselves — the dopamine hit of new knowledge. But it is also time to earn money from this. So where do you shift your focus?',
    },
    {
      kind: 'founder',
      text:
        'The problem: we cannot predict the future. Especially now, when the market and technology have started changing at an extraordinary speed. Adapting to change is an agonizing process of shifting strategy.',
    },

    { kind: 'h2', text: 'I went looking for the answer. I found a hair salon.' },
    {
      kind: 'p',
      text:
        'After studying this video in detail and running several dozen meetings to confirm the answer to that question, I found a very interesting business niche: beauty salons and non-surgical cosmetology, medical centers, dentistry. Despite an abundance of automation and CRM systems, they run into a problem surprisingly often: a client leaves a request, books a visit — and then does not come. When the manager calls them — usually right at the hour the appointment was supposed to start — clients often answer: "oh, we forgot. Why didn’t you remind us?"',
    },
    {
      kind: 'p',
      text:
        'Of course there are plenty of ready-made solutions you can install. But there are even more clients who never got one — and many of them have no site, many of them have no CRM at all.',
    },

    { kind: 'h2', text: 'This is exactly what Fractera is for.' },
    {
      kind: 'p',
      text:
        'Fractera — a self-hosted [Agentic Engineering Infrastructure](/en) — was built precisely for scenarios like this. With it you can create both a site and a CRM, listen to and transcribe calls, build tables and log planned visits, send reminders to your users — or even call them. Automate campaigns with reminders or coupons. A business owner can have as many ideas here as they like.',
    },
    {
      kind: 'p',
      text:
        'The advantage is that before, materializing these ideas meant working incredibly long with a team of product people, then hiring programmers, then thinking endlessly about how it all works — or buying expensive services for your own needs. Now all of this is simple. Thanks to agentic engineering, almost any person can pick up a phone and describe how they would like to optimize their business, and do it themselves or with the help of someone who already understands this a little.',
    },
    {
      kind: 'p',
      text:
        'Fractera also frees you from having to remember which services you are supposed to pay for. Most of the cloud services that turn into regular payments and make up the lion’s share of your costs — databases, a CRM subscription, and many others — are already included as ordinary features of your application. They require no separate payment and run in the background. You will not have to deal with the difficulty of connecting a server, an AI model and a domain — it all happens automatically; you only have to wait ten minutes and you can [deploy it on your own VPS](/en/deployments/vps).',
    },

    { kind: 'h2', text: 'One of many. You can find them every day.' },
    {
      kind: 'p',
      text:
        'The example above is one of many. You can find cases like it literally every day and earn money by implementing them — or you can add the materialization of new ideas inside your own business, because it is practically free now. It was never like this before.',
    },
    {
      kind: 'p',
      text:
        'And although it seems almost impossible to find a new niche for a unicorn startup — maybe it is not worth thinking about that. Instead of dreaming about building a unicorn, you can simply automate the hair salon next door, or the beauty salon, or the auto shop. All those you have already been in touch with for a long time. All those who already trust you. Maybe it is time to try?',
    },
  ],
  faq: [
    {
      q: 'What kind of business is this best for?',
      a: 'Local service businesses with appointments and repeat clients — salons, non-surgical cosmetology, clinics, dentistry, auto service — especially the ones with no site or CRM and a recurring no-show problem.',
    },
    {
      q: 'Do I pay separately for a database, CRM, reminders?',
      a: 'No. Those are ordinary built-in features of your own application on your own server — no extra cloud subscriptions, running in the background. Fractera frees you from the recurring bills that usually eat the lion’s share of costs.',
    },
    {
      q: 'Do I need to be a developer?',
      a: 'No. You describe what you want and build it yourself, or with a little help from someone who already understands this. The server, the AI model and the domain connect automatically — about ten minutes.',
    },
  ],
}

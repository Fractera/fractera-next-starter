import type { BlogBlock, FaqPair, BlogBase } from '../../_lib/types'

const POST_1_LINEAR = `you prompt  ─▶  AI writes code  ─▶  you find the bug  ─▶  you fix the prompt  ─┐
     ▲                                                                          │
     └─────────────────────────  by hand, again  ◀─────────────────────────────┘`

const POST_1_LOOP = `you set the goal
     │
     ▼
AI writes code  ─▶  CI runs every check  ─▶  green?  ─▶  ✦ shipped
     ▲                      │
     │                      ▼  (red)
     └──  AI reads the logs and re-prompts itself`

export const en: BlogBase = {
  title: 'Prompt Engineering Is Dead. Long Live Loop Engineering.',
  subtitle:
    'Why the head of Claude Code at Anthropic just signaled the end of the “AI whisperer” era — and what comes next.',
  description:
    'Boris Cherny, who leads Claude Code at Anthropic, says he no longer prompts Claude — he writes loops. Inside the death of prompt engineering and the rise of loop engineering: agentic AI workflows, autonomous self-correcting agents, why the verifier matters more than the prompt, and how the same loop is wired into a workspace you own — machine-checkable gates in the repository, memory that outlives a session, and a control panel that builds and rolls back.',
  excerpt:
    'The engineer leading Claude Code at Anthropic just admitted he doesn’t prompt the model anymore — he writes loops that prompt it for him. Here’s why that ends the “AI whisperer” era, and how we turned it into production architecture.',
  heroCaption: 'The LinkedIn post that set this off — Boris Cherny on writing loops, not prompts.',
  blocks: [
    { kind: 'h2', text: 'The quote that shattered the illusion' },
    {
      kind: 'p',
      text: 'A few days ago, a single quote from **Boris Cherny** — the engineer leading the development of **Claude Code** at **Anthropic** — quietly sent shockwaves through the software community.',
    },
    {
      kind: 'p',
      text: 'On a public panel, Cherny pulled back the curtain on how the people who build the world’s most sophisticated coding AI actually work with their own models. What he said didn’t just challenge the status quo — it declared an entire emerging discipline obsolete:',
    },
    {
      kind: 'quote',
      text: 'I don’t prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops.',
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: 'Let that sink in.' },
    {
      kind: 'p',
      text: 'The man with both hands on the wheel of the best developer model in the world is telling you he took his hands off the wheel. He doesn’t sit in a chat window crafting the perfect paragraph of instructions. He writes code that forces the AI to talk to itself, judge its own mistakes, and fix them inside a closed, autonomous circuit. He builds the machine that steers the model — and then he lets it drive.',
    },
    {
      kind: 'p',
      text: 'If you’re still spending your days fine-tuning prompts to coax the right block of code out of an LLM, his message is brutally clear: **you’re optimizing a world that is already gone.**',
    },

    { kind: 'h2', text: 'The paradigm shift: from micromanagement to system architecture' },
    {
      kind: 'p',
      text: 'To see why this is a tectonic shift, look at how our relationship with generative AI has evolved in just a couple of years.',
    },
    { kind: 'h3', text: 'Phase 1 — The linear prompt (the human bottleneck)' },
    {
      kind: 'p',
      text: 'Until recently, the whole industry was obsessed with **prompt engineering**. We treated LLMs like brilliant but easily-distracted junior developers. The workflow was linear, fragile and entirely manual:',
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: 'In this paradigm, **the human is the bottleneck.** You write a prompt, read the output, spot a syntax error, paste it back into the chat, and pray the model hasn’t forgotten the context five steps later. It feels productive. It is exhausting, unscalable micromanagement — and it absolutely cannot run while you sleep.',
    },
    { kind: 'h3', text: 'Phase 2 — Loop engineering (the autonomous circuit)' },
    {
      kind: 'p',
      text: 'What Cherny is describing is **loop engineering** — agentic workflows where the human steps out of the execution loop entirely. You stop driving the car. You build the track, and let the machine run the laps.',
    },
    {
      kind: 'p',
      text: 'Instead of writing a prompt to solve a problem, you write a programmatic **loop** that embeds the AI inside an automated cycle of execution and verification:',
    },
    {
      kind: 'olist',
      items: [
        '**The goal.** A human sets one high-level objective — “build this API endpoint and reach 98% test coverage.”',
        '**The action.** The AI generates a first draft of the code.',
        '**The verification.** An automated environment — compilers, linters, unit tests, your CI — runs the code and catches every error.',
        '**The self-correction.** On a failure, the system captures the stack trace, feeds it back to the AI as a fresh instruction, and orders it to try again.',
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: 'The loop runs at machine speed, churning through dozens of iterations, self-correcting and self-healing until the verification criteria are met. You never typed a single follow-up. You didn’t write the prompts — you built the track, and the model ran every lap by itself.',
    },

    { kind: 'h2', text: 'The real skill isn’t writing code. It’s writing the judge.' },
    {
      kind: 'p',
      text: 'Here’s the part almost everyone misses — and it’s the whole game. The hard part of a loop is **not** generating the code. Models are already frighteningly good at that. The hard part is the **thing that decides whether the code is any good.**',
    },
    {
      kind: 'p',
      text: 'Give the loop a strong, ruthless verifier — real tests, static analysis, a compiler that refuses to lie — and it converges on something that genuinely works. Give it a weak one, and that exact same loop will cheerfully produce an infinite river of confident, beautifully-formatted garbage, hallucinating its way to a green checkmark that means nothing.',
    },
    {
      kind: 'p',
      text: 'So the skill of the next decade isn’t prompt-craft. It’s **designing the verification** — the bulletproof validation systems that let an AI safely talk to itself without driving off a cliff. That’s a harder, rarer and far more valuable kind of engineering than finding the right words.',
    },

    { kind: 'h2', text: 'From philosophy to production: how we architected the loop' },
    {
      kind: 'p',
      text: 'While the rest of the tech world breaks down Cherny’s quote on social media, the real challenge is unglamorous: **how do you build loop-engineering infrastructure that actually works in production — outside Anthropic’s internal labs?**',
    },
    {
      kind: 'p',
      text: 'Close a loop around a single model and you hit the real-world walls fast: context-window degradation, hallucinatory death spirals, and no memory across a project. At [%SITE%](/en), we spent the last year treating Cherny’s philosophy not as a prediction but as an **architectural blueprint** — and built the loop this workspace runs on.',
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: 'The development loop: the owner sets a goal, the agent edits the repository, machine gates verify it, failures return to the agent as new instructions, and the control panel builds, journals and can roll back',
      caption: 'The loop as it is actually wired: an agent in your repository, gates that refuse to lie, and a panel that closes the circuit.',
    },
    { kind: 'h3', text: 'The anatomy of a production-grade loop' },
    {
      kind: 'p',
      text: 'To make loops viable for real software, you have to stop admiring the model and start building the three unglamorous things around it — the judge, the memory, and the hand that ships:',
    },
    {
      kind: 'list',
      items: [
        '**A verifier that cannot be sweet-talked.** The judge is not a second model with an opinion; it is a set of scripts that fail the build. Do the language signals exist on every public page? Does every post have the markdown twin an AI reader needs? Is a picture referenced that nobody committed? Each check exists because that exact defect shipped once, and each one answers with an exit code rather than a paragraph.',
        '**Memory that outlives the session.** The amnesia effect is real: loop fifteen times on a stubborn bug and the agent loses the architecture. Here the memory is not a service that can be offline — it is files beside the code that travel with the repository: the working instruction, the lessons appended the moment the owner corrects something, the list of anti-patterns, the confirmed user cases. A new session starts by reading them, so the fifteenth iteration knows what the first one learned.',
        '**A closing act that does not belong to the agent.** The loop ends in the control panel: it builds the project, keeps a journal of deployments and can return to the last working build. Settings, texts and images change there with no rebuild at all — so the loop is never asked to solve what was never a code problem.',
      ],
    },
    {
      kind: 'p',
      text: 'Notice what is **not** in that list: a swarm of models supervising each other. That was our first architecture, and we removed it. Orchestration is the most exciting part of an agentic diagram and the least load-bearing part of a working one — a weak judge is not fixed by adding a second opinion, and a strong judge rarely needs one.',
    },

    { kind: 'h2', text: 'The software engineer’s new job description' },
    {
      kind: 'p',
      text: 'We’re moving away from writing code, past writing prompts, and straight into **building cognitive pipelines.** The craft is no longer the instruction — it’s the system the instruction runs inside.',
    },
    {
      kind: 'p',
      text: 'And it isn’t free. Two new costs arrive with the loops. **Comprehension debt:** when an agent writes and rewrites a file three hundred times behind the scenes, your grasp of your own codebase quietly erodes — it works, you’re just no longer sure why. And **raw compute:** a loop can burn real money in tokens chasing one bug across a hundred silent attempts. The engineers who win this era treat cost-versus-quality as a deliberate design decision, not a surprise on the invoice.',
    },
    {
      kind: 'cta',
      text: 'This site is one of those loops: the pages you are reading are static files a gate refused to ship until they carried their language signals, their markdown twin and their place in the sitemap.',
      href: '/en',
      label: 'See the workspace it runs on',
    },
    {
      kind: 'p',
      text: 'The era of prompt engineering is officially behind us. The only question left is the one Cherny already answered for himself: **are you still trying to talk to your AI — or are you building the loops that let it run?**',
    },
    {
      kind: 'note',
      text: "Source: a widely-shared LinkedIn post by Guillermo Flor surfacing Boris Cherny’s remarks. The quote is reproduced as it circulated; the architecture and the analysis are our own.",
    },
  ] satisfies BlogBlock[],
  faq: [
    {
      q: 'What is "loop engineering" and why is it replacing prompt engineering?',
      a: "Loop engineering means writing automated workflows that prompt the AI, run its output through a verifier (tests, CI, a compiler), feed failures back as new instructions, and repeat — until the result is correct. Boris Cherny, who leads Claude Code at Anthropic, said he no longer crafts prompts by hand: he writes the loops that do it for him. The key insight is that the bottleneck was never the prompt — it was the human in the feedback cycle.",
    },
    {
      q: "How is the development loop wired here, in production?",
      a: "A coding agent works inside your own repository, on your machine, with the project's working instruction beside the code. The verifier is a set of gates that run on every build and fail it: language signals on each public page, a markdown twin for every published page, no picture referenced that was never committed, no dictionary missing a key. A failure comes back to the agent as a new instruction, and the loop repeats. The control panel closes the circuit — it builds the project, journals every deployment and can roll back to the last working build.",
    },
    {
      q: "Do I need to write code to run this loop?",
      a: "Not for most of what a site actually changes. The name, the description, the images, the languages, the analytics and the texts of the settings live in the control panel and apply with no rebuild — that is data, not code. Code changes are what the agent does in your repository; you read and approve them, and the panel builds the result. The honest boundary is this: nobody promises you never look at a diff — you are promised that you never have to hand-run the build, and that a broken one can be rolled back in a click.",
    },
  ] satisfies FaqPair[],
}

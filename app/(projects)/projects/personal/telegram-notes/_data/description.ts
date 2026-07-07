// Project description shown on the page. Plain data — edit these strings to
// describe the real project; the components never change.
export const PROJECT_DESCRIPTION = {
  title: "Telegram Notes",
  category: "personal",
  // Why this project exists.
  purpose:
    "Free-form personal notes and reminders in Telegram through spoken hook phrases: one phrase turns a message into a saved memory, a date reminder, or an answer recalled from memory.",
  // What is automated.
  automation:
    "Captures your Telegram messages that begin with a registered hook phrase and, without any manual bookkeeping, files each one as a note, a scheduled reminder, or a memory lookup — then replies in the chat.",
  // How the automation works.
  how:
    "A hook phrase you send in Telegram is detected from its first words, summarized by a cheap model, and saved to the project database plus LightRAG vector memory; \"remind me …\" schedules a date push, and \"what did I save about …\" runs a semantic search — each outcome is answered back in the same chat.",
} as const;

// The "About this project" accordion sections (step 188 Phase 2). Each opens to explain
// one facet of the automation. English by design (the Projects zone is monolingual).
export type AboutSection = { id: string; title: string; summary: string; body: string };

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "what",
    title: "What it is",
    summary: "A personal Telegram automation driven by spoken phrases.",
    body: "A personal automation for Telegram: you say a short \"hook\" phrase in a chat and the bot turns it into a saved note, a date reminder, or an answer pulled from your memory — no manual database, no forms. It is the first of the workspace's built-in automations.",
  },
  {
    id: "how",
    title: "How it works",
    summary: "Detect the hook → summarize → save / remind / recall → reply.",
    body: "The bot watches for your registered hook phrases. When it sees one, a cheap AI model reads the first words to classify your intent and writes a short summary. The message is stored in the project database and in vector memory (LightRAG); a date reminder is scheduled if you gave a time; \"what did I save about …\" runs a semantic search. Every outcome is answered back in the same chat, usually within a minute.",
  },
  {
    id: "types",
    title: "Automation types",
    summary: "Two ways to trigger it: in the bot chat, or from any chat.",
    body: "1) In the bot chat — you write directly to your bot; every message is scanned for a hook phrase.\n2) From any chat (advanced) — a userbot reads your hook phrases in any conversation you are in, and the bot replies. You configure one of the two in Settings.",
  },
  {
    id: "benefit",
    title: "What you gain",
    summary: "Notes stop getting lost; search is by meaning.",
    body: "Notes stop getting lost in conversations — one spoken phrase instead of keeping a database by hand. Search is semantic (by meaning, not exact words). It runs on your own server, needs no webhook or HTTPS, and does not depend on the Brain (Hermes): it keeps working entirely on its own.",
  },
  {
    id: "costs",
    title: "Costs",
    summary: "Only your OpenAI API key, and very little of it.",
    body: "You pay only for the OpenAI API key used to parse and summarize your messages. A cheap model (for example gpt-4o-mini) with no heavy instructions keeps the token cost very low — this automation is deliberately lightweight.",
  },
];

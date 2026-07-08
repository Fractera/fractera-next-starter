"use client";

import { Circle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Hook } from "../_lib/types";
import { useAutomationStatus } from "../_lib/automation-status";
import { HooksPanel } from "./hooks-panel.client";
import { BotKeySettings } from "./bot-key-settings.client";
import { IntervalSettings } from "./interval-settings.client";

// Attention dot shown left of each settings tab (step 188 Phase 4.1) so the user sees at
// a glance WHICH tab needs action — red = broken/needs action, amber = incomplete, green
// = OK, muted = optional/pending.
type Tone = "red" | "amber" | "green" | "muted";
const DOT: Record<Tone, string> = {
  red: "fill-red-500 text-red-500",
  amber: "fill-amber-500 text-amber-500",
  green: "fill-green-500 text-green-500",
  muted: "fill-muted-foreground/30 text-muted-foreground/30",
};
function Dot({ tone, title }: { tone: Tone; title: string }) {
  return <Circle className={`size-2.5 shrink-0 ${DOT[tone]}`} aria-label={title} />;
}

// Settings accordion (step 188 Phase 4): each tab has a title + a "what this is for"
// description. Hooks (spoken triggers + action), the bot track (token + on/off), and the
// cron interval. (The userbot / any-chat track was removed in step 201 — reception is the
// dedicated @fractera_auto bot; the automation is not a standard place to read every chat.)
function SettingTitle({ title, hint, tone, toneTitle }: { title: string; hint: string; tone: Tone; toneTitle: string }) {
  return (
    <span className="flex items-center gap-2.5 text-left">
      <Dot tone={tone} title={toneTitle} />
      <span className="flex flex-col gap-0.5">
        <span className="font-medium">{title}</span>
        <span className="text-xs font-normal text-muted-foreground">{hint}</span>
      </span>
    </span>
  );
}

export function SettingsAccordion({ initialHooks }: { initialHooks: Hook[] }) {
  const status = useAutomationStatus();
  // Per-tab attention (Phase 4.1). Until the store has loaded, show muted (no false alarm).
  const hooksTone: Tone = !status.loaded ? "muted" : initialHooks.length === 0 ? "amber" : "green";
  const hooksTitle = initialHooks.length === 0 ? "No hooks registered yet" : "Hooks registered";
  const botBroken = status.loaded && (!status.enabled || !status.botKeyOk);
  const botTone: Tone = !status.loaded ? "muted" : botBroken ? "red" : "green";
  const botTitle = !status.enabled
    ? "Deactivated — the automation is stopped"
    : !status.botKeyOk
      ? "No bot token — add one"
      : "Active";

  return (
    <Accordion type="single" collapsible className="rounded-lg border px-4">
      <AccordionItem value="hooks">
        <AccordionTrigger>
          <SettingTitle
            title="Trigger phrases (hooks)"
            hint="The spoken phrases that start the automation, and what each one does."
            tone={hooksTone}
            toneTitle={hooksTitle}
          />
        </AccordionTrigger>
        <AccordionContent>
          <HooksPanel initialHooks={initialHooks} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="bot" className={botBroken ? "-mx-4 border-l-2 border-l-red-500 pl-[calc(1rem-2px)] pr-4" : ""}>
        <AccordionTrigger>
          <SettingTitle
            title="Bot chat"
            hint="Connect your Telegram bot and turn the automation on or off."
            tone={botTone}
            toneTitle={botTitle}
          />
        </AccordionTrigger>
        <AccordionContent>
          <BotKeySettings />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="interval">
        <AccordionTrigger>
          <SettingTitle
            title="Run interval"
            hint="How often the scheduled work runs (reminders, polling)."
            tone="muted"
            toneTitle="Scheduling preference"
          />
        </AccordionTrigger>
        <AccordionContent>
          <IntervalSettings />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

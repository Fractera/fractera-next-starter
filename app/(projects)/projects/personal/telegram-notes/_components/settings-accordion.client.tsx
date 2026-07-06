"use client";

import { Circle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Hook } from "../_lib/types";
import { HooksPanel } from "./hooks-panel.client";
import { BotKeySettings } from "./bot-key-settings.client";
import { IntervalSettings } from "./interval-settings.client";

// Settings accordion (step 188 Phase 4): each tab has a title + a "what this is for"
// description. Hooks (spoken triggers + action), the Bot-API track (token + on/off), the
// advanced userbot track (a guided setup checklist — validated once the listener lands in
// Phase 6), and the cron interval. Ordered from the most common to the most advanced.
const USERBOT_STEPS = [
  "Get an API ID and API hash at my.telegram.org (under API development tools).",
  "Enter them in this workspace so the automation can sign in as you.",
  "Confirm the login code Telegram sends to your account.",
  "The session is saved — the automation now reads your hook phrases in any chat.",
];

function SettingTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <span className="flex flex-col gap-0.5 text-left">
      <span className="font-medium">{title}</span>
      <span className="text-xs font-normal text-muted-foreground">{hint}</span>
    </span>
  );
}

export function SettingsAccordion({ initialHooks }: { initialHooks: Hook[] }) {
  return (
    <Accordion type="single" collapsible className="rounded-lg border px-4">
      <AccordionItem value="hooks">
        <AccordionTrigger>
          <SettingTitle
            title="Trigger phrases (hooks)"
            hint="The spoken phrases that start the automation, and what each one does."
          />
        </AccordionTrigger>
        <AccordionContent>
          <HooksPanel initialHooks={initialHooks} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="bot">
        <AccordionTrigger>
          <SettingTitle
            title="Bot chat (simple track)"
            hint="Connect your Telegram bot and turn the automation on or off."
          />
        </AccordionTrigger>
        <AccordionContent>
          <BotKeySettings />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="userbot">
        <AccordionTrigger>
          <SettingTitle
            title="Any chat (advanced track)"
            hint="Trigger the automation from any chat, not only the bot — reads your hooks as you."
          />
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The advanced track signs in as your own Telegram account (a userbot) so a hook
              phrase works in any conversation, and your bot replies. Follow these steps —
              each turns green once complete. Setup is enabled in a later step.
            </p>
            <ol className="space-y-2">
              {USERBOT_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="interval">
        <AccordionTrigger>
          <SettingTitle
            title="Run interval"
            hint="How often the scheduled work runs (reminders, polling)."
          />
        </AccordionTrigger>
        <AccordionContent>
          <IntervalSettings />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { USE_CASES } from "../_data/use-cases";

// Use-cases accordion (step 207.10 items 4 & 6) — replaces the abstract "About" text with concrete,
// plain-language scenarios: one thing you can do per accordion item, each expanding to the exact steps
// (what you say → what it does). Content is data in _data/use-cases.ts.
export function UseCasesAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue={USE_CASES[0]?.id} className="rounded-lg border px-4">
      {USE_CASES.map((u) => (
        <AccordionItem key={u.id} value={u.id}>
          <AccordionTrigger className="text-left">
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{u.title}</span>
              <span className="text-xs font-normal text-muted-foreground">{u.summary}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
              {u.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

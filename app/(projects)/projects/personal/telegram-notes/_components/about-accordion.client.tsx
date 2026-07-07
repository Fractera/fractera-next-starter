"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ABOUT_SECTIONS } from "../_data/description";

// "About this project" as an accordion (step 188 Phase 2): each section opens to
// explain one facet — what it is, how it works, the two automation types, the user
// benefit, and the cost. Content is data in _data/description.ts (ABOUT_SECTIONS).
export function AboutAccordion() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="what"
      className="rounded-lg border px-4"
    >
      {ABOUT_SECTIONS.map((s) => (
        <AccordionItem key={s.id} value={s.id}>
          <AccordionTrigger className="text-left">
            <span className="flex flex-col gap-0.5">
              <span className="font-medium">{s.title}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {s.summary}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {s.body}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

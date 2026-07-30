import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategory, pickI18n } from "./catalog";
import { projectsStrings } from "./projects.i18n";
import { AccessGate } from "./access-gate.client";

// PUBLIC AUTOMATION PAGE (step 304, made STATIC in step 311) — header (from the [lang] layout) · breadcrumbs
// · body · footer. The HERO (title + description) is ALWAYS shown, regardless of access.
//
// STATIC-FIRST (step 311): this whole shell renders statically (ISR) — no session read on the server. Only
// the BODY is gated, and that is the ONE per-visitor decision, so it moves to a client island (AccessGate,
// /api/me). A PUBLIC automation (access "guest") has no gate → its body renders inline here, fully static.
//
// In THIS step the body has no content yet (tables/calendar/diagram/… are later steps): the allowed branch
// renders an empty ready container, the denied branch the access-error container. No cockpit here.
//
// One catalog round-trip: getCategory() returns the category (for the localized breadcrumb label) AND its
// automations (for this automation's hero + access tier) — no separate per-automation fetch needed.
export async function AutomationPage({
  lang,
  category,
  automation,
}: {
  lang: string;
  category: string;
  automation: string;
}) {
  const cat = await getCategory(category);
  if (!cat) notFound();
  const hero = cat.automations.find((a) => a.slug === automation);
  if (!hero) notFound();

  const L = projectsStrings(lang);
  const categoryLabel = pickI18n(cat.titleI18n, lang);
  // Public automation (guest tier) → body is the same for everyone, render it inline (fully static).
  // Gated automation → the per-visitor decision lives in the client island.
  const isPublic = hero.access === "guest";

  return (
    <main data-app-column className="flex-1 px-6 py-10">
      {/* Breadcrumbs — always */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={`/${lang}`} className="transition-colors hover:text-foreground">
          {L.breadcrumbRoot}
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/${lang}/${category}`} className="transition-colors hover:text-foreground">
          {categoryLabel}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{hero.title}</span>
      </nav>

      {/* Hero — always visible, independent of access */}
      <div className="mt-4 space-y-3">
        <h1 className="text-3xl font-semibold">{hero.title}</h1>
        {hero.description && <p className="max-w-3xl text-muted-foreground">{hero.description}</p>}
      </div>

      {/* Body — public renders inline (static); gated defers the per-visitor check to the client island. */}
      <div className="mt-8">
        {isPublic ? (
          // Empty ready container — the automation body (tables/calendar/…) lands in a later step.
          <div className="min-h-[8rem] rounded-xl border border-dashed bg-muted/20" />
        ) : (
          <AccessGate access={hero.access} lang={lang} />
        )}
      </div>
    </main>
  );
}

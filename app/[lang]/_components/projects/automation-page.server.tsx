import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Lock } from "lucide-react";
import { getCategory, pickI18n } from "./catalog";
import { getSessionRoles, meetsTier } from "./access";
import { projectsStrings } from "./projects.i18n";

// PUBLIC AUTOMATION PAGE (step 304) — header (from the [lang] layout) · breadcrumbs · body · footer.
// The HERO (title + description) is ALWAYS shown, like the breadcrumbs and footer, regardless of access.
// Only the BODY is gated: the caller's roles are compared to the automation's required tier and, when they
// fall short, an error container replaces the body while the hero/breadcrumbs/footer stay visible.
//
// In THIS step the body has no content yet (tables/calendar/diagram/… are later steps): the allowed branch
// renders an empty ready container, the denied branch renders the access-error container. No cockpit here —
// no status bar, no launch panel, no dev console, no add/modify button.
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

  const roles = await getSessionRoles();
  const allowed = meetsTier(roles, hero.access);

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

      {/* Body — gated */}
      <div className="mt-8">
        {allowed ? (
          // Empty ready container — the automation body (tables/calendar/…) lands in a later step.
          <div className="min-h-[8rem] rounded-xl border border-dashed bg-muted/20" />
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-10 text-center">
            <Lock className="size-6 text-muted-foreground" />
            <p className="font-medium">{L.bodyNoAccessTitle}</p>
            <p className="max-w-md text-sm text-muted-foreground">{L.bodyNoAccessText}</p>
          </div>
        )}
      </div>
    </main>
  );
}

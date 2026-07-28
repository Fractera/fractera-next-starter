import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getCategory, pickI18n } from "./catalog";
import { projectsStrings } from "./projects.i18n";

// PUBLIC CATEGORY PAGE (step 304) — mirrors the 3003 category hub (category-hub.server.tsx) as a READ-ONLY
// list of the automation cards in one category. Stripped of every cockpit affordance: no "Create automation"
// card, no pending-automations strip, no development status badges, no create/delete. Just the breadcrumb
// back to the home and the automation cards, each linking into its automation page.
export async function CategoryPage({ lang, category }: { lang: string; category: string }) {
  const cat = await getCategory(category);
  if (!cat) notFound(); // unknown category — never render an empty shell for a stray URL
  const L = projectsStrings(lang);

  return (
    <main data-app-column className="flex-1 px-6 py-10">
      <Link
        href={`/${lang}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {L.breadcrumbRoot}
      </Link>

      <h1 className="mt-3 text-3xl font-bold tracking-tight">{pickI18n(cat.titleI18n, lang)}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{pickI18n(cat.descriptionI18n, lang)}</p>

      {cat.automations.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">{L.emptyCategory}</p>
      ) : (
        <div className="mt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {cat.automations.map((a) => (
            <Link
              key={a.slug}
              href={`/${lang}/${category}/${a.slug}`}
              className="group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight">{a.title}</h3>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              {a.description && (
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

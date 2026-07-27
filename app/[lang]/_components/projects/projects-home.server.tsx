import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCatalog, pickI18n } from "./catalog";
import { projectsStrings } from "./projects.i18n";

// PUBLIC HOME BODY (step 304) — replaces the starter's "this is your app + two buttons" hero. It mirrors the
// 3003 Projects index (projects-index.server.tsx) as a READ-ONLY showcase: the permanent categories as cards
// linking into each category page. Every cockpit affordance of the 3003 index is intentionally absent — no
// "Add category", no "Create automation", no "Find automation", no global canvas, no group card. The header
// and footer come from the [lang] layout (TopMenu / FooterMenu) and are untouched.
export async function ProjectsHome({ lang }: { lang: string }) {
  const categories = await getCatalog();
  const L = projectsStrings(lang);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{L.homeTitle}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{L.homeSubtitle}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/${lang}/${c.slug}`}
            className="group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{pickI18n(c.titleI18n, lang)}</h3>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {pickI18n(c.descriptionI18n, lang)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}

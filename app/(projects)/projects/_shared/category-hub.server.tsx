import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { PROJECT_CATEGORIES, type ProjectCategorySlug } from "./categories";
import { listProjectSlugs } from "./projects-manifest";

// Hub page of one Projects-layer category: lists the projects that exist as
// folders under app/(projects)/projects/<category>/. The folder IS the registry —
// a project's slug is its folder name (source of truth, §3.12); no DB read.
// The scan lives in projects-manifest.ts (shared with the account drawer, step 177).

export async function CategoryHub({ slug }: { slug: ProjectCategorySlug }) {
  const category = PROJECT_CATEGORIES.find((c) => c.slug === slug)!;
  const projects = await listProjectSlugs(slug);
  const others = PROJECT_CATEGORIES.filter((c) => c.slug !== slug);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm text-muted-foreground">Projects / {category.slug}</p>
      <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold">
        <FolderKanban className="h-7 w-7" aria-hidden />
        {category.title}
      </h1>
      <p className="mt-4 text-muted-foreground">{category.description}</p>

      <h2 className="mt-10 text-lg font-semibold">Projects in this category</h2>
      {projects.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          No projects yet. A project is created as a named folder
          /projects/{category.slug}/&lt;project-slug&gt; by the agent pipeline.
        </p>
      ) : (
        <ul className="mt-2 space-y-1">
          {projects.map((p) => (
            <li key={p}>
              <Link
                href={`/projects/${category.slug}/${p}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {p}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-lg font-semibold">Other categories</h2>
      <ul className="mt-2 space-y-1">
        {others.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/projects/${c.slug}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

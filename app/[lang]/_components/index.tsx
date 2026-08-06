import { getAppConfig } from "@/config/app-config"

// Route entry component for the localized home (/<lang>).
//
// Step 500: the projects layer (:3003) was removed from the product, so the public
// project showcase that used to be the home body has nothing left to read. The home
// is now the company itself — title and subtitle taken from APP-CONFIG, the single
// place the owner edits them (Admin → App Settings). No name is hardcoded here.
//
// English only for now, by the owner's decision: the config carries one name and one
// description; translating them is a separate job.
export default function HomeEntry({ lang }: { lang: string }) {
  const config = getAppConfig()
  const title = config.name || config.short_name || ""
  const subtitle = config.description || ""

  return (
    <main data-app-column className="flex-1 px-6 py-24" lang={lang}>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </main>
  )
}

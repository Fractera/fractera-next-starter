import { ProjectsHome } from "./projects/projects-home.server"

// Route entry component for the localized home (/<lang>). Step 304: the home BODY is now the PUBLIC
// project showcase — the list of automation categories, read live from the Projects service (:3003) —
// replacing the starter's "this is your app + two buttons" hero (ShellHome). The header (TopMenu) and
// footer (FooterMenu, with its cookie/footer pages) come from the [lang] layout and are unchanged.
// ShellHome and home-config-list stay in this folder, simply no longer mounted here.
export default function HomeEntry({ lang }: { lang: string }) {
  return <ProjectsHome lang={lang} />
}

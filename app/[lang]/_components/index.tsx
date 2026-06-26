import { ShellHome } from "./shell-home.client"
import { SiteToc } from "./site-toc.server"
import { getAppConfig } from "@/config/app-config"
import { getHomeStrings } from "@/lib/i18n/home-strings"

// Route entry component for the localized home (/<lang>). Server by default: it
// reads the live site config (Admin -> Site Settings) and hands it, with the
// active language, to the client island so the landing reflects the owner's
// branding and renders its copy in the visitor's language.
//
// The SiteToc (site table of contents) wraps the hero TOP and BOTTOM — server-
// rendered so its section links are in the static HTML (SEO). It is mounted here,
// in the home entry, so it appears on the home page ONLY (other routes don't import
// it). Edit the section list in lib/i18n/site-sections.ts.
export default function HomeEntry({ lang }: { lang: string }) {
  const heading = getHomeStrings(lang).sectionsHeading
  return (
    <>
      <SiteToc lang={lang} heading={heading} />
      <ShellHome config={getAppConfig()} lang={lang} />
      <SiteToc lang={lang} heading={heading} />
    </>
  )
}

import { ShellHome } from "./shell-home.client"
import { getAppConfig } from "@/config/app-config"

// Route entry component for the localized home (/<lang>). Server by default: it
// reads the live site config (Admin -> Site Settings) and hands it, with the
// active language, to the client island so the landing reflects the owner's
// branding and renders its copy in the visitor's language.
export default function HomeEntry({ lang }: { lang: string }) {
  return <ShellHome config={getAppConfig()} lang={lang} />
}

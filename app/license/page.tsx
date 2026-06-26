import LicenseEntry, { generateMetadata } from "./_components"

// Thin server entry — the page is never a client component. Root-level public page
// (NOT under [lang]): the license text is one legal document, not localized. proxy.ts
// lists `license` as a root path so the language router does not prefix it.
export const dynamic = "force-static"
export { generateMetadata }

export default function Page() {
  return <LicenseEntry />
}

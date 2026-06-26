import { readFileSync } from "node:fs"
import { join } from "node:path"

// Renders the project's LICENSE file. Read at build time from the repo root (cwd is
// the slot root, /opt/fractera/app), so the page is fully static — no runtime fs.
// If the file is missing, fall back to a short note rather than crashing the build.
function readLicense(): string {
  try {
    return readFileSync(join(process.cwd(), "LICENSE"), "utf8")
  } catch {
    return "License file not found."
  }
}

export function generateMetadata() {
  return { title: "License", robots: { index: true, follow: true } }
}

export default function LicenseEntry() {
  const text = readLicense()
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
        <a href="/" className="w-fit text-xs font-mono uppercase tracking-widest text-violet-400/70 hover:text-violet-300">
          ← Home
        </a>
        <h1 className="text-3xl font-bold tracking-tight">License</h1>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.02] p-6 font-mono text-sm leading-relaxed text-white/70">
          {text}
        </pre>
      </div>
    </main>
  )
}

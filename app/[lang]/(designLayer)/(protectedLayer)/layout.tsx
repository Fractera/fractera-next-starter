import type { Metadata } from "next"

// Layout of the protected layer. It exists for exactly ONE reason, and that
// reason is worth a file: every page under it must stay out of search results.
// A page that requires a role has nothing to offer a crawler — and a crawler
// that indexes it publishes the shape of a private area.
//
// 🔒 WHAT THIS LAYOUT MUST NEVER DO: read the session. `auth()`, `cookies()` or
// `headers()` here would make EVERY page of the layer dynamic in one line, and
// the whole point of the layer is a shell that is prerendered and instant. The
// gate lives per page — a client guard against `/api/me`, plus the server check
// inside the `/api/*` route that actually returns the data. Two gates, neither
// of them in this file.
//
// `<html>` and `<body>` belong to `app/[lang]/layout.tsx`; this one only adds
// metadata, so it renders nothing of its own.

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ProtectedLayerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

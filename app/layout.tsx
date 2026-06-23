import "../styles/index.css";

// Bare pass-through root layout (step 131 — static-rendering refactor; mirrors
// 22slots + FES). It renders NO <html>/<body> and calls NO dynamic functions, so it
// never opts the app into dynamic rendering and never locks a single <html lang> for
// the whole route tree. Each zone owns its own root layout with its own <html>:
//   app/[lang]   → <html lang={validLang}>  (validated route param)
//   app/(service) → <html lang="en">         (architect-only, English)
// styles/index.css is imported here once so it applies across every zone.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

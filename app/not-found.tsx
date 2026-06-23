import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider.client";
import { ThemeInit } from "@/components/theme-init";
import { bodyFontClass } from "@/lib/fonts";
import { NotFoundContent } from "@/components/not-found-content";

// GLOBAL 404 for unmatched URLs (step 131). Next.js routes every unmatched URL to the
// ROOT not-found (nested not-found files only fire on an explicit notFound()). Since
// the root layout is bare (no <html>), this root not-found renders its OWN complete
// <html lang="en"> document — otherwise unmatched paths fall back to Next's default
// unstyled 404. The per-zone not-found files ([lang], (service)) still serve explicit
// notFound() calls inside their own <html>.
export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body className={bodyFontClass}>
        <ThemeProvider>
          <NotFoundContent />
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

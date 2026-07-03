import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider.client";
import { ThemeInit } from "@/components/theme-init";
import { bodyFontClass } from "@/lib/fonts";
import { DEFAULT_LANGUAGE } from "@/config/translations/translations.config";
import { requireRole } from "@/lib/auth/require-role";

// Root layout of the Projects layer (§3.12, step 175). Projects are independent
// application levels for PRIVATE use by the architect or a project administrator —
// unlike pages (open to any role), the whole /projects zone admits only
// architect + manager; everyone else is redirected by requireRole(). The zone
// lives at the bare root with no language prefix (proxy.ts keeps "projects" in
// SERVICE_ROOTS) and is MONOLINGUAL: one language — the site's default — so this
// zone owns a static <html lang={DEFAULT_LANGUAGE}>. Pages here are dynamic
// (role gate reads cookies) — the sanctioned cockpit exception to static-first.
// Not indexed; no JSON-LD / GA.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["architect", "manager"]);
  return (
    <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body className={bodyFontClass}>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

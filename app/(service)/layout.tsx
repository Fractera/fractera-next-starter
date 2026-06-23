import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider.client";
import { ThemeInit } from "@/components/theme-init";
import { bodyFontClass } from "@/lib/fonts";

// Root layout for the architect-only service zone (step 131). These pages live at the
// bare root with no language prefix (proxy.ts keeps them unprefixed) and are
// English-only, so this zone owns a static <html lang="en">. The route group
// "(service)" is invisible in the URL — paths are unchanged. Pages here stay
// force-dynamic (architect-only, canon exception); no JSON-LD / GA (not indexed).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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

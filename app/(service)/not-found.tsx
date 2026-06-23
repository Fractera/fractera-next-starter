import type { Metadata } from "next";
import { getAppConfig } from "@/config/app-config";
import { NotFoundContent } from "@/components/not-found-content";

export function generateMetadata(): Metadata {
  const cfg = getAppConfig();
  return { title: `Not found · ${cfg.short_name}`, robots: { index: false, follow: false } };
}

// 404 for the architect-only English service zone (step 131). Renders inside the
// (service) layout's <html lang="en">. Shares the branded body with the [lang] 404.
export default function NotFound() {
  return <NotFoundContent />;
}

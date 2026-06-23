import type { MetadataRoute } from "next";
import { getAppConfig } from "@/config/app-config";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, SINGLE_LANG_MODE } from "@/config/translations/translations.config";

// Static sitemap (step 131). The public surface of the starter is the localized home
// (/<lang>); architect-only service pages are intentionally excluded (noindex). Base
// URL is config-driven (getAppConfig) so it follows the owner's domain.
export const dynamic = "force-static";
export const revalidate = 86_400;

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_SEO_SITEMAP_ENABLED === "false") return [];

  const baseUrl = getAppConfig().url;
  const now = new Date();

  if (SINGLE_LANG_MODE) {
    return [{ url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 }];
  }

  return SUPPORTED_LANGUAGES.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: lang === DEFAULT_LANGUAGE ? 1.0 : 0.9,
  }));
}

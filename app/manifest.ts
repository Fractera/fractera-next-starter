import type { MetadataRoute } from "next";
import { buildManifest } from "@/lib/pwa/manifest";
import { DEFAULT_LANGUAGE } from "@/config/translations/translations.config";

// `/manifest.webmanifest` — манифест на языке по умолчанию.
//
// Страницы ссылаются на СВОЙ языковой манифест (`app/[lang]/layout.tsx`), а этот
// остаётся адресом по умолчанию: на него приходят браузеры и каталоги, пришедшие
// в корень сайта. Содержимое собирает общий строитель, поэтому два манифеста
// разойтись не могут.
export const revalidate = 600;

export default function manifest(): MetadataRoute.Manifest {
  return buildManifest(DEFAULT_LANGUAGE);
}

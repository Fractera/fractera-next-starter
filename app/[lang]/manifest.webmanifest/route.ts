import { buildManifest } from "@/lib/pwa/manifest";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";

// `/<язык>/manifest.webmanifest` — манифест приложения на языке раздела (шаг 504).
//
// Адрес с точкой, поэтому `proxy.ts` его не трогает (его матчер исключает
// `.*\..*`) — тот же механизм, по которому работают `/llms.txt` и markdown-версии.
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 600;

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return new Response(JSON.stringify(buildManifest(lang), null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
}

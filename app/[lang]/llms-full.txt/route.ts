import { buildLlmsFullTxt } from "@/lib/aio/llms";
import { SUPPORTED_LANGUAGES, SINGLE_LANG_MODE } from "@/config/translations/translations.config";

// `/<язык>/llms-full.txt` — полные тексты на языке этого раздела (шаг 505).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SINGLE_LANG_MODE ? [] : SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return new Response(buildLlmsFullTxt(lang), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

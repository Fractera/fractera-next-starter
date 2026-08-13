import { buildLlmsTxt } from "@/lib/aio/llms";
import { SUPPORTED_LANGUAGES, SINGLE_LANG_MODE } from "@/config/translations/translations.config";

// `/<язык>/llms.txt` — та же карта на языке этого раздела (шаг 505).
//
// Зачем отдельный файл на язык: карта перечисляет АДРЕСА страниц, а они у каждого
// языка свои. Одна карта на все языки заставила бы агента угадывать, какой из
// переводов ему нужен, — и он бы выбрал первый.
//
// В одноязычном режиме этих адресов не существует: языкового сегмента нет во всём
// сайте, карта живёт в корне.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SINGLE_LANG_MODE ? [] : SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return new Response(buildLlmsTxt(lang), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

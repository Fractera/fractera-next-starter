import { buildLlmsFullTxt } from "@/lib/aio/llms";
import { DEFAULT_LANGUAGE } from "@/config/translations/translations.config";

// `/llms-full.txt` — полные тексты страниц одним документом, язык по умолчанию.
//
// 🔒 ЭТОГО ФАЙЛА В СПЕЦИФИКАЦИИ llmstxt.org НЕТ. Он — сложившаяся практика
// сообщества, и внутри самого файла это сказано прямо. Выдавать практику за
// стандарт нельзя даже умолчанием.
export const dynamic = "force-static";
export const revalidate = 86_400;

export async function GET() {
  return new Response(buildLlmsFullTxt(DEFAULT_LANGUAGE), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

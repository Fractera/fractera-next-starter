import { productById } from "@/lib/catalogue";
import { localizeProduct } from "@/lib/products/localize";
import { getAppConfig } from "@/config/app-config";

// Markdown-версия карточки товара (шаг 505).
//
// Единственная поверхность, которой нет в общем перечне `lib/aio/surfaces.ts`, и
// по той же причине, по какой товаров нет в карте `llms.txt`: их множество растёт
// в рантайме. Перечислять его нельзя, а отдавать по адресу — можно и нужно: агент
// приходит на конкретный товар по ссылке из карты сайта.
//
// Динамическая по необходимости: товар может появиться после сборки. Это не
// нарушение канона статики — канон о СТРАНИЦАХ, а здесь машинное представление
// строки базы, и ISR по неизвестному заранее ключу невозможен.
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang, slug } = await params;
  const row = await productById(slug);
  if (!row) return new Response("Not found", { status: 404 });

  const p = localizeProduct(row, lang);
  const cfg = getAppConfig();
  const price = new Intl.NumberFormat(lang, { style: "currency", currency: cfg.commerce.currency })
    .format(Number(p.price ?? 0));

  const body = [
    `# ${p.localizedName}`,
    "",
    p.localizedDescription ? `> ${p.localizedDescription}` : "",
    "",
    `- ${price}`,
    p.media_url ? `- ![${p.localizedName}](${p.media_url})` : "",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}

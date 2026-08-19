import { markdownRoute } from "@/lib/aio/md-route";

// Машинная версия страницы. Логика общая — `lib/aio/md-route.ts`; здесь только
// адрес поверхности: Next разбирает значения сегмента статически и переэкспорт
// из объекта не принимает.
const md = markdownRoute("/blog/a-page-is-a-list-of-blocks");

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = md.generateStaticParams;
export const GET = md.GET;

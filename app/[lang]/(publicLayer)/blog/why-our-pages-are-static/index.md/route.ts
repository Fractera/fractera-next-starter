import { markdownRoute } from "@/lib/aio/md-route";

// Машинная версия страницы: тот же текст в markdown, для читателей без браузера.
// Логика общая (`lib/aio/md-route.ts`), здесь только адрес поверхности —
// значения сегмента Next разбирает статически и переэкспорт из объекта не
// принимает.
const md = markdownRoute("/blog/why-our-pages-are-static");

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = md.generateStaticParams;
export const GET = md.GET;

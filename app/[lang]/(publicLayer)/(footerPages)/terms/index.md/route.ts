import { markdownRoute } from "@/lib/aio/md-route";

// Markdown-версия страницы (шаг 505). Логика общая — `lib/aio/md-route.ts`;
// здесь только адрес поверхности и значения сегмента: их Next разбирает
// статически и переэкспорт из объекта не принимает.
const md = markdownRoute("/terms");

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = md.generateStaticParams;
export const GET = md.GET;

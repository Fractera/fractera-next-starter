import { markdownRoute } from "@/lib/aio/md-route";

// Markdown-версия страницы (шаг 505). Логика общая — `lib/aio/md-route.ts`;
// здесь только адрес поверхности, из которой берётся текст.
const md = markdownRoute("/blog/the-end-of-prompt-engineering");

export const dynamic = md.dynamic;
export const dynamicParams = md.dynamicParams;
export const generateStaticParams = md.generateStaticParams;
export const GET = md.GET;

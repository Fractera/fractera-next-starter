import type { Metadata } from 'next'
import { buildAlternates, urlFor } from '@/lib/seo/alternates'
import { brand } from '@/lib/brand'
import { blogList } from '../_lib/post'
import { getBlogUi } from '../_data'
import { POSTS } from '../_list.generated'
import { PostList } from "../_widgets/static/post-list"
import { PageHeader } from "@/components/content-page/page-header.server"
import { PageShell } from "@/components/content-page/page-shell"

// Entry for the /blog router page. Standard router shape: page.tsx is thin and
// re-exports this. The post list is auto-discovered: POSTS comes from
// _list.generated.ts (built by lib/parser-fs from the co-located blog folders).
// All visible strings are DATA — they live in ../_data (getBlogUi), never inline.
//
// 🔒 ЭТА СТРАНИЦА БЫЛА ЕДИНСТВЕННОЙ ПУБЛИЧНОЙ СТРАНИЦЕЙ ВНЕ ОБЩЕЙ ОБОЛОЧКИ
// (владелец, 2026-08-19: «блог выпадает из общей концепции дизайна»). Она
// открывала свой `<main>`, свою ленту со своим воздухом, печатала над заголовком
// НЕ надзаголовок раздела, а целиком SEO-название сайта («Блог · Fractera —
// Agentic Engineering Infrastructure | Fractera»), не давала крошек — которые
// есть у каталога и у каждого поста — и набирала текст карточек классами вместо
// примитивов типографики. Ни одно из этих решений не было осознанным: просто
// каждое из них принималось ЗДЕСЬ, а у соседних страниц — в общем месте.
//
// Теперь оболочка приходит из `PageShell`, шапка — из `PageHeader` с крошками
// того же вида, что у каталога, а текст — из примитивов. Разметка `BreadcrumbList`
// больше не пишется здесь руками: её печатает компонент крошек, и она физически
// не может разойтись с нарисованным путём.

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const ui = getBlogUi(lang)
  // `og:url` — свой, тем же `urlFor`, что и канонический адрес. Прежде он
  // наследовался от макета и указывал на корень сайта на всех языках: ссылка из
  // карточки в мессенджере вела не на список постов (шаг 503).
  return {
    title: ui.metaTitle,
    description: ui.metaDescription,
    alternates: buildAlternates(lang, '/blog'),
    openGraph: {
      title: ui.metaTitle,
      description: ui.metaDescription,
      siteName: brand().name,
      locale: lang,
      url: urlFor(lang, '/blog'),
    },
  }
}


export default async function BlogIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const ui = getBlogUi(lang)
  const posts = blogList(POSTS, lang)

  return (
    <PageShell className="flex flex-col gap-12">
      <PageHeader
        lang={lang}
        breadcrumbs={[{ label: ui.breadcrumbBlog }]}
        title={ui.indexTitle}
        subtitle={ui.indexIntro}
      />

      <PostList lang={lang} ui={ui} posts={posts} />

    </PageShell>
  )
}

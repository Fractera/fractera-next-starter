import { createContentPost } from '@/lib/content/create-content-post'
import { VideoFacade } from '@/components/media/video-facade.client'
import { blogPost } from '../../_lib/post'
import { getBlogUi } from '../../_data'
import { brand } from '@/lib/brand'
import { data } from '../_data'

// Entry for this blog post. Bilingual (en + ru override). The hero is overridden
// with the SAME 16:9 YouTube embed styling the homepage Elon section used — a clean
// rounded-2xl bordered black frame, no caption — and it STARTS at the exact second
// referenced on the homepage link (t=4119s → ?start=4119), so the moment plays from
// the same point.
const VIDEO_EMBED = 'https://www.youtube.com/embed/BYXbuik3dgA?start=4119'
// Куда ведёт обложка, когда скрипты выключены: страница видео, тот же момент.
const VIDEO_WATCH = 'https://www.youtube.com/watch?v=BYXbuik3dgA&t=4119s'

const post = createContentPost({
  format: 'blog',
  subPath: `/blog/${data.meta.slug}`,
  resolve: lang => ({
    ...blogPost(data, lang),
    // 🔒 ОБЛОЖКА, А НЕ ГОЛЫЙ ПЛЕЕР (дефект найден владельцем 2026-08-13).
    // Здесь стоял `<iframe>` YouTube. С выключенным JavaScript YouTube отдаёт в
    // него свою страницу ошибки — «Произошла ошибка. Включите JavaScript…», — и
    // на месте видео посетитель видел сообщение о поломке. Проект обещает работу
    // без скриптов, и материал обязан это обещание держать.
    hero: (
      <VideoFacade
        embedSrc={VIDEO_EMBED}
        watchHref={VIDEO_WATCH}
        poster={data.meta.heroPoster!}
        title="Elon Musk — Dwarkesh Patel interview (the moment)"
        label={getBlogUi(lang).watchVideo}
      />
    ),
  }),
  chrome: (lang, p) => {
    const ui = getBlogUi(lang)
    return {
      breadcrumbs: [
        { label: brand().name, href: `/${lang}` },
        { label: ui.breadcrumbBlog, href: `/${lang}/blog` },
        { label: p.title },
      ],
      backHref: `/${lang}/blog`,
      backLabel: ui.backToBlog,
    }
  },
  titleSuffix: lang => getBlogUi(lang).titleSuffix,
  minLabel: lang => getBlogUi(lang).minRead,
})

export const generateMetadata = post.generateMetadata
export default post.Page

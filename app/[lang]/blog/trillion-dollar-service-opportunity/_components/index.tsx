import { createContentPost } from '@/lib/content/create-content-post'
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

const post = createContentPost({
  format: 'blog',
  subPath: `/blog/${data.meta.slug}`,
  resolve: lang => ({
    ...blogPost(data, lang),
    hero: (
      <div className="my-8 w-full aspect-video rounded-2xl overflow-hidden border border-border bg-background">
        <iframe
          src={VIDEO_EMBED}
          title="Elon Musk — Dwarkesh Patel interview (the moment)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
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

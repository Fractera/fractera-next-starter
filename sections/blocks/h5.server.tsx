import type { SectionRenderer } from '@/sections/contract'
import { H5 } from '@/components/ui/typography'
import { inline, headingId } from '@/lib/content/blocks/inline'

// Заголовок пятого уровня — самый глубокий вид каталога.
//
// 🔒 ЯКОРЬ СТАВИТСЯ И ЗДЕСЬ, ХОТЯ ОГЛАВЛЕНИЕ ЭТОТ УРОВЕНЬ НЕ СОБИРАЕТ. Ссылку на
// подраздел даёт не только оглавление: на неё ссылается соседний раздел, чтобы не
// повторять сказанное, и её приносит человек из чужого письма. Заголовок без
// адреса такую ссылку сделать не позволяет.
export const h5: SectionRenderer<'h5'> = (b, { key: k }) => (
  <H5 key={k} id={headingId(b.text)} className="mt-3 scroll-mt-24">
    {inline(b.text, k)}
  </H5>
)

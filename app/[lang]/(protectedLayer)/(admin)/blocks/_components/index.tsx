import { PostBody } from '@/components/content-page/post-body'
import { SPECIMEN } from '../_data/specimen'
import { blocksCatalogueUi } from '../_data/ui.i18n'
import { H1 } from '@/components/ui/typography'

// Каталог секций — единственное место, где КАЖДЫЙ вид блока действительно
// рисуется. Страница живёт в слое прав `admin`: она инструмент архитектора, а не
// материал для посетителя, поэтому в карты сайта и в машинные поверхности не
// входит и переводов образцов не требует.
//
// 🔒 РИСУЕТ НАСТОЯЩИЙ РЕНДЕРЕР. Здесь нет ни одной собственной разметки блока —
// только `PostBody`, тот же, что рисует статью. Витрина, перерисовывающая блоки
// по-своему, показывала бы не продукт, а себя, и дефект вроде «текст цвета
// страницы на цветной заливке» остался бы невидимым ровно так же, как раньше.

export default function BlocksCatalogue({ lang }: { lang: string }) {
  const ui = blocksCatalogueUi(lang)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-3 border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {SPECIMEN.length} {ui.countLabel}
          </p>
          <H1>{ui.title}</H1>
          <p className="max-w-2xl text-base text-muted-foreground">{ui.subtitle}</p>
        </header>

        {SPECIMEN.map(section => (
          <section key={section.kind} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4">
              {/* Имя вида — машинная строка: она и есть значение в данных
                  материала, поэтому не переводится ни на один язык. */}
              <code className="font-mono text-sm font-semibold text-primary">kind: &apos;{section.kind}&apos;</code>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{ui.whenLabel}: </span>
                {section.when}
              </p>
            </div>
            <div className="rounded-2xl border border-border p-6">
              <PostBody blocks={section.blocks} lang={lang} />
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

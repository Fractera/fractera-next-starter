import { PostBody } from '@/components/content-page/post-body'
import { SPECIMEN, SPECIMEN_CODES } from '../_data/specimen'
import { KindBadge } from '@/components/catalogue/kind-badge'
import { blocksCatalogueUi } from '../_data/ui.i18n'
import { H1 } from '@/components/ui/typography'
import { PageHeader } from "@/components/content-page/page-header.server"
import { FormElements } from "./form-elements"

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
      <div data-app-column className="flex flex-col gap-10 px-6 py-[var(--page-py-content)]">
        <PageHeader lang={lang} eyebrow={`${SPECIMEN.length} ${ui.countLabel}`} title={ui.title} subtitle={ui.subtitle} />

        {/* 🔒 ЗДЕСЬ СТОИТ ТОЛЬКО ОБМЕН ПЕРЕВОДАМИ, А НЕ САМИ ЭЛЕМЕНТЫ (32-9).
            Пока у поля с голосом не было вида, я рисовал его тут руками; теперь
            вид есть (`voiceField`), и оба размера рисует настоящий рендерер в
            общем списке ниже — там же, где остальные тридцать один. Осталась
            рамка с двумя командами: она про СЛОВАРЬ, а не про элемент, и
            второго места у неё нет. */}
        <FormElements lang={lang} />

        {SPECIMEN.map((section, i) => (
          <section key={SPECIMEN_CODES[i]} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4">
              {/* 🔒 КОД ОБРАЗЦА — МЕТКА, А НЕ СТРОЧКА (заказ владельца 2026-08-30):
                  коды «должны быть подсвечены несколько более крупным шрифтом
                  в[нутри] контейнера с фирменным цветом… очень чётко отделяться от
                  основного дизайна». Один компонент на оба каталога: здесь код
                  печатался как `kind: '…'`, а в слое архитектора просто именем —
                  две записи одного и того же уже разошлись.
                  Имя вида не переводится ни на один язык: это машинная строка, она
                  и есть значение в данных материала. */}
              <div className="flex flex-wrap items-center gap-2">
                <KindBadge code={SPECIMEN_CODES[i]} />
                {section.label && <span className="text-sm text-muted-foreground">{section.label}</span>}
              </div>
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

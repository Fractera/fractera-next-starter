import type { Metadata } from "next"
import { db } from "@/lib/db"
import { constructMetadata } from "@/lib/construct-metadata"
import { buildAlternates } from "@/lib/seo/alternates"
import { PageHeader } from "@/components/content-page/page-header.server"
import { PageShell } from "@/components/content-page/page-shell"
import { todoUi } from "../_data/ui.i18n"
import { TodoList, type Todo } from "./todo-list.client"

// СПИСОК ДЕЛ — образец РАБОТАЮЩЕЙ вещи в стартере.
//
// 🔒 ЗАЧЕМ ОН ЗДЕСЬ. Остальные образцы показывают, как строится страница; этот
// показывает, как строится ПОВЕДЕНИЕ: таблица `todos` в `SCHEMA`, дверь
// `app/api/todos`, островок на клиенте. Третья ступень лестницы «что кладут на
// страницу» — та, где нужна не секция, а вещь, которая что-то делает.
//
// 🔒 ОБОЛОЧКА ОСТАЁТСЯ СТАТИЧЕСКОЙ. Заголовок, подпись и первая партия строк
// уезжают в HTML; клиент владеет только списком. Интерактив не делает страницу
// динамической — это разные вещи, и путать их значит терять поиск.
//
// Строки читаются на сервере ОДИН раз для первой отрисовки; дальше их
// перечитывает островок через ту же дверь.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = todoUi(lang)
  return {
    ...constructMetadata({ title: t.title, description: t.subtitle }),
    title: t.title,
    alternates: buildAlternates(lang, "/todo"),
  }
}

export default async function TodoPage({ lang }: { lang: string }) {
  const t = todoUi(lang)
  const rows = (await db
    .prepare("SELECT id, title, done FROM todos ORDER BY created_at DESC LIMIT 100")
    .all()
    .catch(() => [])) as unknown as Todo[]

  return (
    <PageShell>
      <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />
      <TodoList initial={rows} ui={t} />
    </PageShell>
  )
}

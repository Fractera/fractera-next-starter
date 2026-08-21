import { PageHeader } from "@/components/content-page/page-header.server"
import { administrationUsersUi } from "../_data/ui.i18n"
import { usersTableUi } from "../_widgets/dynamic/users-table/ui.i18n"
import { UsersTable } from "../_widgets/dynamic/users-table/index.client"

// Вход страницы УЧЁТНЫХ ЗАПИСЕЙ — серверный компонент и статический каркас:
// крошки, заголовок, объяснение права. Ни одного запроса к службе, поэтому
// страница предрендерена на каждый язык, как и её соседи.
//
// 🔒 ЗДЕСЬ ПРОХОДИТ ГЛАВНАЯ ЧЕРТА ЭТОЙ МОДЕЛИ: «страница пользователя» — это
// СТАТИЧЕСКАЯ страница с динамическими дырами, а не динамическая страница.
// Панель управления ту же страницу строит иначе — читает cookie в серверном
// компоненте и ходит в службу напрямую; для неё это верно, её страницы
// динамические по природе. Здесь одна такая строка (`headers()`, `cookies()`)
// вывела бы из предрендера ВЕСЬ защищённый слой.
//
// Слова резолвятся ЗДЕСЬ и уезжают в островок пропсами: клиентский компонент,
// импортирующий словарь, увёз бы в браузер все его языки.
export default function UsersEntry({ lang }: { lang: string }) {
  const t = administrationUsersUi(lang)
  const ui = usersTableUi(lang)

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />
        <p className="mt-4 max-w-2xl text-xs text-muted-foreground">{t.roleNote}</p>
        <UsersTable lang={lang} ui={ui} />
      </div>
    </main>
  )
}

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { PageHeader } from "@/components/content-page/page-header.server"
import { WorkspaceShell } from "@/components/workspace/workspace-shell"
import { architectLayerUi } from "../../_i18n/architect-layer.i18n"
import { PassportBody } from "../../_components/passport-body.client"

// ПАСПОРТ ПРОЕКТА — шестой вход слоя архитектора (правка владельца 2026-09-02).
//
// 🔒 ЗАЧЕМ ОН НУЖЕН, ЕГО СЛОВАМИ: «очень много разнообразных кейсов входит в него.
// Описать что мы делаем, зачем, как это работает в проекте… чтобы я время от
// времени читал и корректировал — удобно, в человеческом интерфейсе».
//
// 🔒 ТЕКСТ ЖИВЁТ ФАЙЛОМ `development-docs/PASSPORT.md`, А НЕ В КОДЕ ЭКРАНА. Так
// его правит и человек, и агент — обычной правкой файла, без пересборки экрана;
// и это тот самый адрес памяти, который корпус стартера уже называет паспортом
// проекта. Второй копии текста не существует.
//
// 🔒 РАСКЛАДКА ОБЩАЯ (`WorkspaceShell`), КАК У ПЯТИ ОСТАЛЬНЫХ ВХОДОВ: шестая
// копия пары «меню плюс колонка» — тот порог, за которым расхождение перестаёт
// замечаться.
export const dynamic = "force-dynamic"

export default async function PassportPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = architectLayerUi(lang)

  // 🛑 ФАЙЛА МОЖЕТ НЕ БЫТЬ, И ЭТО ЗАКОННЫЙ ИСХОД, А НЕ ПАДЕНИЕ СТРАНИЦЫ: в
  // чужом проекте паспорт ещё не написан. Тогда экран честно говорит, где он
  // должен лежать, вместо пустоты.
  let text = ""
  try {
    text = await readFile(join(process.cwd(), "development-docs", "PASSPORT.md"), "utf8")
  } catch {
    text = ""
  }

  return (
    <main className="min-h-screen bg-background">
      <div data-app-column className="px-6 py-[var(--page-py-work)]">
        <PageHeader
          lang={lang}
          breadcrumbs={[{ label: t.layer }, { label: "Паспорт проекта" }]}
          eyebrow={t.layer}
          title="Паспорт проекта"
          subtitle="Что мы строим, зачем и как это устроено сегодня. Живой документ: правится по мере того, как решения принимаются."
        />

        <WorkspaceShell
          id="passport"
          menuTitle="Паспорт"
          menuWord={t.menuTitle}
          menu={[{ label: "Документ", href: `/${lang}/architect/passport`, active: true }]}
          title="Документ"
          lead="Разделы первого уровня — в липком меню сверху: нажмите, чтобы перейти."
        >
          <div data-passport className="flex min-w-0 flex-1 flex-col gap-6">
            {text ? (
              <PassportBody text={text} />
            ) : (
              <div className="rounded-md border border-dashed border-muted-foreground/30 p-6 text-[length:var(--fs-small)] text-muted-foreground">
                Паспорт ещё не написан. Он лежит файлом `development-docs/PASSPORT.md` в самом
                проекте — создайте его, и он появится здесь.
              </div>
            )}
          </div>
        </WorkspaceShell>
      </div>
    </main>
  )
}

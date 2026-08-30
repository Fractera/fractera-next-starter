import type { SectionRenderer } from '@/sections/contract'
import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import { inline } from '@/lib/content/blocks/inline'

// РАБОЧИЙ ЭКРАН: меню слева, содержимое справа (шаг 48, 2026-08-30).
//
// 🔒 РАСКЛАДКА ЖИВЁТ В `components/workspace/workspace-shell.tsx`, А ЗДЕСЬ ТОЛЬКО
// ПЕРЕВОД ПОЛЕЙ БЛОКА В ЕЁ ПРОПСЫ (шаг 49). Причина: у той же раскладки есть
// второй потребитель — страницы слоя архитектора, — и его содержимое это
// ОСТРОВКИ, а не материал каталога. Островок в блок не завернуть, поэтому общей
// стала раскладка, а не вид.
//
// 🔒 ЧТО ЭТО ЗНАЧИТ ДЛЯ ВИДА: он не узнал о существовании тех страниц. По-прежнему
// получает блоки, по-прежнему ничего не знает ни о слое архитектора, ни о его
// островках. Разошлись бы две копии раскладки — на первой же правке отступа.
//
// 🔒 БЕЗ `"use client"` — свойство слоя: ни один файл под `sections/` не бывает
// клиентским. Ящик открывается переключателем и правилом CSS, поэтому работает
// при выключенном JavaScript; интерактивность приходит островком внутри
// `children`, если она вообще нужна.
//
// 🔒 ЛЕНТУ МЕНЮ В СЛОЕ АРХИТЕКТОРА ЭТОТ ВИД НЕ ТРОГАЕТ. Владелец назвал
// горизонтальную ленту на телефоне неправильной, и здесь её нет: до `md` меню
// становится ящиком в 90 % ширины, который закрывается после выбора.
export const workspace: SectionRenderer<'workspace'> = (b, { key: k, renderBlocks, lang, ui }) => (
  <WorkspaceShell
    key={k}
    id={k}
    menuTitle={b.menuTitle}
    menuWord={ui.workspaceMenu}
    menu={b.menu}
    title={inline(b.title, `${k}-t`)}
    lead={b.lead ? inline(b.lead, `${k}-l`) : undefined}
    notes={b.notes}
    tabs={b.tabs}
    // Подписи пунктов проходят через разбор инлайновой разметки: материал
    // страницы вправе нести в них жирное начертание и ссылку, как и везде.
    renderItem={(item, i) => inline(item.label, `${k}-m-${i}`)}
    renderTab={(item, i) => inline(item.label, `${k}-tab-${i}`)}
  >
    {b.children.length > 0 ? renderBlocks(b.children, lang, ui, `${k}-c`) : null}
  </WorkspaceShell>
)

"use client"

// ВИДЖЕТ «рабочая таблица» — динамический островок персонала (шаг 521).
//
// 🔒 ЭТО ЕДИНИЦА ВЛАДЕНИЯ, А НЕ СБОРКА ЧУЖИХ КУСКОВ. Всё, что отвечает на вопрос
// «как выглядит и ведёт себя ЭТА таблица», лежит в этой папке: поведение списка,
// скелетон, управление, форма заведения, подвал, строка, слова. Снеси папку
// маршрута — виджет исчезнет целиком, не оставив ссылок. Это и есть приёмка.
//
// Прежде наверху лежало 665 строк на четыре слоя прав, а здесь оставалась одна
// сборка: общего было больше, чем своего. Разбор вернул принадлежность.
//
// 🔒 ЧТО ОСТАЛОСЬ СНАРУЖИ. Только сквозное — то, что отвечает «как проект вообще
// делает X»: `projectApi` (обращение к базе), `toast` (сообщение о неудаче),
// `components/ui/*` (кольцо примитивов), `lib/products/*` (модель предмета, ею же
// пользуется публичная витрина), `_tools/translations-dialog` (инструмент: его
// хочет второй проект, он требует сборки — по различителю шага это инструмент, а
// не фрагмент виджета).
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ. Пока человек не нажал «Показать», база не спрошена, и
// страница адресуема мгновенно: защищённая страница — это статическая страница с
// динамическими дырами, а не динамическая страница.
//
// 🔒 УДАЛЕНИЯ ЗДЕСЬ НЕТ И НЕ БУДЕТ: с 2026-08-11 это право слоя
// администрирования. Раньше отсутствие права выражалось непереданным пропсом
// общей таблицы; теперь — отсутствием кода. Второе не разойдётся с намерением.

import { useState } from "react"
import { toast } from "sonner"
import { projectApi } from "@/lib/architecture/project-api"
import { localizeProduct } from "@/lib/products/localize"
import { EmptyState } from "@/components/ui/empty-state"
import { Small } from "@/components/ui/typography"
import { TranslationsDialog, type Drafts } from "@/_tools/translations-dialog/client/translations-dialog.client"
import type { UploadedFile } from "@/services/upload/upload.service"
import type { PlatformErrors } from "@/lib/i18n/platform-errors"
import type { TranslationsUi } from "@/_tools/translations-dialog/types/translations-dialog.i18n"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import type { ImageCropperUi } from "@/services/upload/image-cropper.i18n"
import { useManageList } from "./use-list"
import { ManageToolbar } from "./toolbar.client"
import { ManagePager } from "./pager.client"
import { ManageTableSkeleton } from "./skeleton"
import { ManageRow } from "./row"
import { NewProductForm } from "./form.client"
import type { ManageTableUi } from "./ui.i18n"

export function ManageTable(
  { lang, currency, ui, labels, errors, translationsUi, dialogUi, cropperUi, billingUrl }: {
    lang: string
    /** Валюта витрины: цена без неё — просто цифра. */
    currency: string
    /** Слова САМОГО виджета. Резолвятся на сервере и приезжают пропсом. */
    ui: ManageTableUi
    /** Слова страницы, которые виджет показывает: форма заведения и её тосты. */
    labels: {
      add: string; cancelAdd: string; newProduct: string
      name: string; price: string; uploadPhoto: string; save: string
      created: string; nothingFound: string
    }
    errors: PlatformErrors
    translationsUi: TranslationsUi
    dialogUi: AppDialogUi
    cropperUi: ImageCropperUi
    billingUrl: string
  },
) {
  const list = useManageList(ui.failed)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: "", price: "" })
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)
  // Созданная запись, ждущая переводов. Диалог открывается ПОСЛЕ создания, а не
  // вместо него: продукт уже существует, и закрытие диалога ничего не теряет.
  const [justCreated, setJustCreated] = useState<{ id: string; name: string } | null>(null)

  const money = new Intl.NumberFormat(lang, { style: "currency", currency })

  async function add() {
    if (!form.name.trim() || !form.price) return
    setSaving(true)
    try {
      const res = await fetch(projectApi("/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price),
          media_id: uploaded?.id ?? null,
          media_url: uploaded?.url ?? null,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json().catch(() => ({}))
      toast.success(labels.created)
      const created = data?.product
      if (created?.id) setJustCreated({ id: created.id, name: created.name })
      setForm({ name: "", price: "" })
      setUploaded(null)
      setAdding(false)
      await list.load({ page: 1 })
    } catch {
      toast.error(ui.failed)
    } finally {
      setSaving(false)
    }
  }

  // Переводы новой записи ложатся тем же PATCH, что и правка с карточки: один
  // способ записи на весь проект, а не второй ради формы создания.
  async function saveTranslations(drafts: Drafts): Promise<boolean> {
    if (!justCreated) return false
    try {
      for (const [lng, values] of Object.entries(drafts)) {
        for (const [field, value] of Object.entries(values)) {
          if (!value.trim()) continue
          await fetch(projectApi(`/products/${justCreated.id}`), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ i18n: { field, lang: lng, value } }),
          })
        }
      }
      // 🔒 ОКНО НЕ ЗАКРЫВАЕТСЯ САМО. Сколько языков сохранить и когда уйти —
      // решает человек: он может добавить один перевод, посмотреть, добавить
      // второй. Закрытие после первого сохранения обрывало работу на середине.
      await list.load()
      return true
    } catch {
      toast.error(ui.failed)
      return false
    }
  }

  return (
    <section>
      <ManageToolbar
        labels={{
          tableTitle: ui.tableTitle,
          reveal: ui.reveal,
          loading: ui.loading,
          add: labels.add,
          cancelAdd: labels.cancelAdd,
          searchPlaceholder: ui.searchPlaceholder,
          find: ui.find,
          reset: ui.reset,
        }}
        revealed={list.revealed}
        loading={list.loading}
        adding={adding}
        query={list.query}
        applied={list.applied}
        onQuery={list.setQuery}
        onReveal={() => void list.load({ page: 1 })}
        onToggleAdd={() => setAdding(v => !v)}
        onSearch={() => void list.search()}
        onReset={() => void list.resetSearch()}
      />

      {adding && (
        <NewProductForm
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={() => void add()}
          onUpload={setUploaded}
          lang={lang}
          labels={labels}
          cropperUi={cropperUi}
          dialogUi={dialogUi}
        />
      )}

      {!list.revealed ? (
        <>
          {/* Скелетон повторяет ЧЕТЫРЕ колонки этой таблицы: колонки действия
              здесь нет, потому что действие — сама строка. */}
          <ManageTableSkeleton
            labels={{ colPhoto: ui.colPhoto, colName: ui.colName, colPrice: ui.colPrice, colId: ui.colId }}
          />
          <Small className="mt-2 text-center">{ui.revealHint}</Small>
        </>
      ) : list.products.length === 0 ? (
        <EmptyState title={list.applied ? labels.nothingFound : ui.empty} />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-14 px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colPhoto}</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colName}</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colPrice}</th>
                  <th className="px-4 py-2.5 text-left font-mono font-medium text-muted-foreground">{ui.colId}</th>
                </tr>
              </thead>
              <tbody>
                {list.products.map((row, i) => {
                  // Название на языке страницы: в таблице человек ищет глазами то
                  // же слово, которое увидит в карточке.
                  const p = localizeProduct(row, lang)
                  return (
                    <ManageRow
                      key={p.id}
                      product={p}
                      href={`/${lang}/manage/products/${p.id}`}
                      money={money}
                      striped={i % 2 !== 0}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>

          <ManagePager
            labels={{
              count: ui.count, perPage: ui.perPage,
              prev: ui.prev, next: ui.next, pageOf: ui.pageOf,
              first: ui.first, last: ui.last,
            }}
            total={list.total}
            page={list.page}
            pages={list.pages}
            perPage={list.perPage}
            onPage={(p) => void list.load({ page: p })}
            onSize={(s) => void list.changeSize(s)}
          />
        </>
      )}

      {justCreated && (
        <TranslationsDialog
          open
          lang={lang}
          fields={[{ key: "name", label: labels.name, value: justCreated.name }]}
          ui={translationsUi}
          dialogUi={dialogUi}
          errors={errors}
          billingUrl={billingUrl}
          onSkip={() => setJustCreated(null)}
          onSave={saveTranslations}
        />
      )}
    </section>
  )
}

import type { CropperLabels } from "@/_tools/image-crop/client/image-cropper.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"

// СЛОВА ОБРЕЗЧИКА, ЕДУЩИЕ ЧЕРЕЗ ВЕСЬ СЛОЙ (31-20, 2026-08-29).
//
// 🔒 ДВА СЛОВАРЯ ЕДУТ ПАРОЙ, ПОЭТОМУ И ТИП ОДИН. Обрезчику нужны свои четыре слова
// и слова общего окна продукта; порознь их пришлось бы тянуть двумя пропсами через
// четыре уровня, и однажды кто-то передал бы один из двух.
//
// 🔒 РЕЗОЛВИТСЯ НА СЕРВЕРЕ, ЕДЕТ ПРОПСАМИ. Клиентскому файлу словарь импортировать
// нельзя — общий закон слоя.
export type CropUi = { cropper: CropperLabels; dialog: AppDialogUi }

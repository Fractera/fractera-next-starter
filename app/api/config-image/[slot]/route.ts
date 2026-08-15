import { NextResponse } from "next/server";
import { configImagePair, defaultSlotImage, type ImageSlot } from "@/lib/config-images";

// Картинка слота настроек ПО СТАБИЛЬНОМУ АДРЕСУ.
//
// 🔒 ЗАЧЕМ ДВЕРЬ, ЕСЛИ ЕСТЬ `ConfigImage`. Границы ошибок Next — `error.tsx` и
// `global-error.tsx` — ОБЯЗАНЫ быть клиентскими компонентами, это требование
// фреймворка, а не наш выбор. Клиентский компонент не может прочитать настройки:
// они лежат файлом на диске сервера, и `fs` в браузере не существует. Пропсами
// их тоже не передать — эти компоненты рендерит сам Next, набор их свойств
// фиксирован (`error`, `reset`), и серверного родителя, который мог бы что-то
// передать, у них нет.
//
// Поэтому адрес делается статическим, а разрешение слота остаётся на сервере:
// страница пишет `<img src="/api/config-image/error500-light">`, а какой файл за
// этим стоит — решается здесь, при каждом запросе. Работает с выключенным
// JavaScript (это обычная картинка) и переживает смену настройки без пересборки.
//
// 🔒 ПОЧЕМУ ПЕРЕНАПРАВЛЕНИЕ, А НЕ ОТДАЧА БАЙТОВ. Файл может лежать в `public/`
// (заглушка) или в хранилище (`/api/media/<id>/file`, картинка владельца).
// Перенаправление одинаково работает с обоими и оставляет раздачу тому, чья это
// работа, — иначе пришлось бы вторым кодом читать диск и угадывать тип файла.

export const dynamic = "force-dynamic";

const SLOTS = new Set<ImageSlot>(["loading", "notFound", "error500", "homePage"]);

function parseSlot(raw: string): { slot: ImageSlot; tone: "light" | "dark" } | null {
  const at = raw.lastIndexOf("-");
  if (at < 1) return null;
  const slot = raw.slice(0, at) as ImageSlot;
  const tone = raw.slice(at + 1);
  if (!SLOTS.has(slot)) return null;
  if (tone !== "light" && tone !== "dark") return null;
  return { slot, tone };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  const { slot: raw } = await params;
  const parsed = parseSlot(raw);
  if (!parsed) {
    return new NextResponse("Unknown image slot", { status: 404 });
  }

  const { slot, tone } = parsed;
  const pair = configImagePair(slot);

  // Порядок отступления: запрошенный тон → второй тон → умолчание шаблона.
  //
  // Последняя ступень существует ради страницы ошибки: она обязана показать
  // картинку даже когда файл настроек нечитаем — иначе экран «что-то пошло не
  // так» сам приезжает со сломанным изображением, и посетитель видит уже две
  // поломки вместо одной.
  const target =
    pair[tone] ??
    pair[tone === "light" ? "dark" : "light"] ??
    defaultSlotImage(slot, tone);

  if (!target) {
    return new NextResponse("Slot is empty", { status: 404 });
  }

  return NextResponse.redirect(new URL(target, request.url), {
    status: 307,
    headers: {
      // Настройка меняется без пересборки, поэтому ответ не кэшируется: иначе
      // владелец загрузил бы новую картинку и продолжал видеть прежнюю, не
      // понимая почему. Сам файл, на который ведёт перенаправление, кэшируется
      // своим обработчиком как обычно.
      "Cache-Control": "no-store",
    },
  });
}

// @api report liveness and which build of this application answers
import { NextResponse } from "next/server";

import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";

// `ok`/`ts` говорят, что процесс жив СЕЙЧАС. Остальные три поля говорят, КАКАЯ
// сборка отвечает, — без них живой ответ не отличить от ответа сироты на порту,
// поднятой прошлой сессией.
//
// `commit` — `NEXT_PUBLIC_GIT_COMMIT`, его задаёт сборка; нет переменной — `null`,
// а не пустая строка: отсутствие сведения и сведение «пусто» — разные вещи.
// `builtAt` — момент сборки, подставленный `next.config.ts` (см. `env` там).
// `langs` — включённый набор языков; единственный источник тот же, из которого
// строятся маршруты, поэтому здесь читается `SUPPORTED_LANGUAGES`, а не env
// повторно: два разбора одной переменной разойдутся.
export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: Date.now(),
    commit: process.env.NEXT_PUBLIC_GIT_COMMIT || null,
    builtAt: process.env.NEXT_PUBLIC_BUILT_AT ?? null,
    langs: SUPPORTED_LANGUAGES,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CATALOGUE_TAG } from "@/lib/catalogue";

// On-demand revalidation of the PUBLIC surface after an App Settings change.
// The App Settings MCP (:3218) and the Admin config panel write app-config.json in
// a DIFFERENT process, then POST here so the change shows on the NEXT page load
// instead of waiting out the ISR window (revalidate=600). The public pages stay
// STATIC (ISR) — this only purges their cache, it never makes them dynamic. The
// config feeds metadata / JSON-LD / manifest on every page, so we purge the whole
// public tree. → CRUD-DOCS/workspace-standards/app-settings.md.
//
// Auth: when REVALIDATE_SECRET is set a matching Bearer is required; when it is unset
// (current servers) the endpoint still works — it sits behind the proxy.ts API gate
// (the caller sends x-agent-identity) and only purges cache, which cannot corrupt
// data. Role-based enforcement across all mutating surfaces is unified in step 135.

const SECRET = process.env.REVALIDATE_SECRET ?? "";

export async function POST(req: NextRequest) {
  if (SECRET) {
    const auth = req.headers.get("authorization") ?? "";
    if (!auth.startsWith("Bearer ") || auth.slice(7) !== SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  // Purge the whole public tree. "/" covers the root + app-root routes (manifest,
  // robots, sitemap, llms.txt); "/[lang]" covers every localized content route.
  revalidatePath("/", "layout");
  revalidatePath("/[lang]", "layout");

  // 🔒 СТРАНИЦУ МАЛО ПЕРЕСОБРАТЬ — НАДО ЕЩЁ СБРОСИТЬ ЕЁ ДАННЫЕ (владелец
  // 2026-08-14: «в медиатеке картинки есть, а в товарах их нет»).
  //
  // Каталог читается через `unstable_cache` со СВОИМ сроком в час
  // (`lib/catalogue.ts`). Это два независимых кэша: `revalidatePath` помечает
  // устаревшим HTML, а строки товаров приходят из кэша данных и остаются
  // прежними. Пересобранная страница честно рисует то же самое — и выглядит
  // это как «сброс не работает».
  //
  // Живой случай: на свежем сервере сборка идёт ДО запуска слоя данных, поэтому
  // посев картинок из `prebuild` ничего не находит и каталог собирается с
  // прочерками. Позже `prestart` (`seed-media-when-ready.mjs`) дожидается слоя
  // данных и связывает картинки в базе — но кэш каталога держит строки без
  // них ЧАС. Владелец видит картинки в медиатеке и прочерки в товарах.
  //
  // Поэтому здесь сбрасываются ОБА кэша: разметка и данные, которыми она
  // наполняется. `{ expire: 0 }` — истечь немедленно, а не «обновить в фоне»:
  // второй вариант отдал бы ещё один старый ответ, ради которого этот вызов и
  // делается.
  revalidateTag(CATALOGUE_TAG, { expire: 0 });

  return NextResponse.json({ ok: true, revalidated: ["/", "/[lang]"], tags: [CATALOGUE_TAG], ts: Date.now() });
}

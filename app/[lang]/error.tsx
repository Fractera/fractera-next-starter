"use client";

import Link from "next/link";
import { H1 } from "@/components/ui/typography";

// Error boundary for the public [lang] surface (step 149 — language-safety vaccine).
// Next REQUIRES error.tsx to be a Client Component: this is the sanctioned exception to the
// "no client component owns a route" rule — it is a framework error boundary, NOT a route owner.
// Next server-renders this fallback's HTML when a render throws, so the message is readable with
// JavaScript OFF; only "Try again" (reset) needs JS. It renders INSIDE the [lang] layout's <html>.
//
// WHY THIS EXISTS: without a boundary, ANY thrown error in this subtree — a malformed document, a
// structurally invalid locale tag in toLocaleDateString, an unexpected language file, a bad block —
// returns a raw HTTP 500 (Internal Server Error). With it, the route DEGRADES to this friendly page
// and the rest of the site is unaffected. "Better to ignore the stray file than to fall."
export default function LangError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-white px-8 py-16 text-black">
      {/* 🔒 КАРТИНКА ЧЕРЕЗ ДВЕРЬ `/api/config-image/*`, А НЕ ИЗ НАСТРОЕК НАПРЯМУЮ.
          Этот файл обязан быть клиентским — так требует Next от границы ошибки, —
          а настройки лежат файлом на диске сервера, и `fs` в браузере нет.
          Пропсами их сюда тоже не передать: компонент рендерит сам Next, набор
          свойств фиксирован (`error`, `reset`), серверного родителя у него нет.
          Поэтому адрес статический, а какой файл за ним стоит — решает сервер при
          каждом запросе. Обычная картинка: работает и с выключенным JavaScript.
          Тон светлый: страница нарисована по белому фону явно. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/config-image/error500-light"
        alt=""
        aria-hidden
        width={128}
        height={128}
        decoding="async"
        className="h-32 w-32 object-contain"
      />
      <p className="font-mono text-sm font-bold uppercase tracking-widest text-black/50">
        Something went wrong
      </p>
      <H1 className="max-w-2xl text-center">
        This page could not be displayed
      </H1>
      <p className="max-w-md text-center text-base leading-relaxed text-black/70">
        We hit an unexpected problem rendering this page. The rest of the site is unaffected.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-black/[0.04]"
        >
          Back to home
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </main>
  );
}

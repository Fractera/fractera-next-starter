import Link from "next/link";
import { ConfigImage } from "@/components/media/config-image.server";
import { H1 } from '@/components/ui/typography'

// Shared 404 body (step 131). After the static-rendering refactor the root layout is
// bare (no <html>), so each zone owns its own not-found that renders inside its own
// <html>: app/[lang]/not-found.tsx (localized surface — proxy.ts sends unmatched
// paths under /<lang>/, so real 404 traffic lands here) and app/(service)/not-found.tsx
// (architect-only English zone). Two panes: left = "oops" message + home link;
// right = the F8 logo on a black pane (hidden below md). Fully static / no-JS.
export function NotFoundContent() {
  return (
    <main className="flex min-h-screen w-full">
      {/* Left — white pane with the message */}
      <div className="flex w-full flex-col justify-center gap-6 bg-white px-8 py-16 text-black md:w-1/2 md:px-16">
        <p className="font-mono text-sm font-bold uppercase tracking-widest text-black/50">Error 404</p>
        <H1>
          Oops — something went wrong
        </H1>
        <p className="max-w-md text-base leading-relaxed text-black/70">
          The page you are looking for does not exist, was moved, or never did. Let&apos;s get you
          back on track.
        </p>
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-80"
        >
          Back to home
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </Link>
      </div>

      {/* Right — pane with the project's 404 illustration (hidden below md).
          🔒 КАРТИНКА ИЗ НАСТРОЕК, А НЕ ИЗ КОДА (2026-08-15). Здесь стоял путь
          `/404-logo.png`, вписанный прямо в компонент, — при том что в панели
          управления слот «404» существовал с самого начала. Владелец мог
          загрузить свою картинку, панель отвечала «сохранено», и на сайте не
          менялось ничего: страница показывала не тот файл, который он выбрал.
          Теперь слот читается по-настоящему, а знак Fractera остался умолчанием
          шаблона — то есть свежий проект выглядит так же, как выглядел.
          🔒 `priority` НЕ СТАВИТЬ. Экран «страница не найдена» входит в дерево
          КАЖДОЙ страницы как запасной вид, поэтому его картинка предзагружалась
          бы всюду — браузер писал в консоль «загружено и не использовано» на
          всех страницах сайта разом (отчёт проверки 2026-08-13). */}
      <div className="hidden items-center justify-center bg-background p-12 md:flex md:w-1/2">
        <ConfigImage
          slot="notFound"
          alt="404 — page not found"
          sizes="(max-width: 768px) 0px, 24rem"
          className="w-auto max-w-[60%] object-contain"
        />
      </div>
    </main>
  );
}

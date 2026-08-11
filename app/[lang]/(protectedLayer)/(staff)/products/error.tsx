"use client"

// Граница ошибки раздела. Обязана быть клиентской — этого требует сам Next.
//
// Зачем она в защищённом слое: страница грузит данные после нажатия, и отказ
// сети или базы не должен оставлять человека перед белым экраном. Ошибка ловится
// ЗДЕСЬ, внутри раздела, поэтому шапка приложения и навигация остаются на месте.
//
// `reset()` перерисовывает сегмент — то самое «повторить», которое пользователь
// иначе делает перезагрузкой всей страницы.
import { Button } from "@/components/ui/button"

export default function CatalogueError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-medium text-foreground">Something broke on this page</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          The catalogue itself is fine — this screen failed.
        </p>
        <Button size="sm" className="mt-4" onClick={reset}>Try again</Button>
      </div>
    </main>
  )
}

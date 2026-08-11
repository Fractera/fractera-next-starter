import Link from "next/link"

// Сегментный 404 каталога. Существует затем, чтобы неверный адрес внутри этого
// раздела не выбрасывал человека на общий 404 приложения: он остаётся в разделе,
// видит его язык и ссылку обратно в каталог.
//
// Язык здесь недоступен: `not-found.tsx` не получает params. Поэтому текст
// нейтральный и короткий, а ссылка ведёт на относительный корень раздела —
// работает на любом языке.
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <p className="mt-2 text-sm text-foreground">Not found in this catalogue.</p>
        <Link href=".." className="mt-4 inline-block text-xs text-muted-foreground underline hover:text-foreground">
          ← catalogue
        </Link>
      </div>
    </main>
  )
}

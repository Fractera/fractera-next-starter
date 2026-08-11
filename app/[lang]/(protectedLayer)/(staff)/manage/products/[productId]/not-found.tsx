import Link from "next/link"

// 404 ОДНОГО продукта — не всего каталога. Разница видна человеку: он остаётся
// в разделе и получает ссылку туда, где товары есть, вместо общего тупика.
export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="font-mono text-xs text-muted-foreground">404</p>
        <p className="mt-2 text-sm text-foreground">No such product.</p>
        <Link href="../.." className="mt-4 inline-block text-xs text-muted-foreground underline hover:text-foreground">
          ← catalogue
        </Link>
      </div>
    </main>
  )
}

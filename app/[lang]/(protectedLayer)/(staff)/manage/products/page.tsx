import ProductsEntry from './_components'

// Тонкий вход: язык из адреса уходит в компонент маршрута.
// 🔒 `revalidate` ОБЪЯВЛЕН ЗДЕСЬ, А НЕ РЕЭКСПОРТИРОВАН. Next разбирает его
// статически в самом файле маршрута: `export { revalidate } from "./_components"`
// даёт ошибку сборки «mustn't be reexported». Функции (`generateMetadata`,
// `generateStaticParams`) реэкспортировать можно — значения нельзя.
export const revalidate = 3600
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ProductsEntry lang={lang} />
}

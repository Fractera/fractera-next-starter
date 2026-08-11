import ProductPage, { generateMetadata, generateStaticParams } from "./_components"

// Тонкий вход страницы товара.
// 🔒 `revalidate` ОБЪЯВЛЕН ЗДЕСЬ, А НЕ РЕЭКСПОРТИРОВАН. Next разбирает его
// статически в самом файле маршрута: `export { revalidate } from "./_components"`
// даёт ошибку сборки «mustn't be reexported». Функции (`generateMetadata`,
// `generateStaticParams`) реэкспортировать можно — значения нельзя.
export const revalidate = 3600
export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  return <ProductPage lang={lang} slug={slug} />
}

export { generateMetadata, generateStaticParams }

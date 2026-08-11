import ProductEntry from "./_components"

// Тонкий вход динамического маршрута. Оба параметра приходят из адреса: язык —
// от языкового сегмента, productId — от этого. Страница их только передаёт.
export default async function Page(
  { params }: { params: Promise<{ lang: string; productId: string }> },
) {
  const { lang, productId } = await params
  return <ProductEntry lang={lang} productId={productId} />
}

export { generateStaticParams, revalidate } from "./_components"

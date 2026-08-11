import ProductsEntry from './_components'

// Тонкий вход: язык из адреса уходит в компонент маршрута, страница сама ничего
// не решает. Всё остальное — в ./_components.
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ProductsEntry lang={lang} />
}

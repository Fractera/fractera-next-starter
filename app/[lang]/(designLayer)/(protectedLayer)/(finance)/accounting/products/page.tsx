import ProductsEntry from "./_components"

// Тонкий вход: язык из адреса уходит в компонент маршрута.
// Окно свежести задаёт `app/[lang]/layout.tsx` — своё значение здесь было бы
// ложью: в дереве побеждает меньшее.
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ProductsEntry lang={lang} />
}

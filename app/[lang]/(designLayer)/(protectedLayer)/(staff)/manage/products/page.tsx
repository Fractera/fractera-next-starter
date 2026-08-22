import ProductsEntry from './_components'

// Тонкий вход: язык из адреса уходит в компонент маршрута.
// 🔒 ОКНО СВЕЖЕСТИ ЗАДАЁТ `app/[lang]/layout.tsx` — там `revalidate = 600`, и в дереве
// побеждает МЕНЬШЕЕ значение. Своё число здесь было бы ложью: таблица сборки
// всё равно печатает 10m. Свежесть держит не срок, а сброс по метке
// `revalidateTag(CATALOGUE_TAG)` при изменении товара.
//
// Если окно всё же понадобится своё — объявлять ЗДЕСЬ, в файле маршрута:
// Next разбирает значение сегмента статически и отвергает реэкспорт
// (`export { revalidate } from "./_components"` = ошибка сборки). Функции
// (`generateMetadata`, `generateStaticParams`) реэкспортировать можно.
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <ProductsEntry lang={lang} />
}

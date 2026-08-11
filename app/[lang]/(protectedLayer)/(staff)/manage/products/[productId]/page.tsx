import ProductEntry, { generateStaticParams } from "./_components"

// Тонкий вход карточки менеджера.
// 🔒 ОКНО СВЕЖЕСТИ ЗАДАЁТ `app/[lang]/layout.tsx` — там `revalidate = 600`, и в дереве
// побеждает МЕНЬШЕЕ значение. Своё число здесь было бы ложью: таблица сборки
// всё равно печатает 10m. Свежесть держит не срок, а сброс по метке
// `revalidateTag(CATALOGUE_TAG)` при изменении товара.
//
// Если окно всё же понадобится своё — объявлять ЗДЕСЬ, в файле маршрута:
// Next разбирает значение сегмента статически и отвергает реэкспорт
// (`export { revalidate } from "./_components"` = ошибка сборки). Функции
// (`generateMetadata`, `generateStaticParams`) реэкспортировать можно.
export default async function Page(
  { params }: { params: Promise<{ lang: string; productId: string }> },
) {
  const { lang, productId } = await params
  return <ProductEntry lang={lang} productId={productId} />
}

export { generateStaticParams }

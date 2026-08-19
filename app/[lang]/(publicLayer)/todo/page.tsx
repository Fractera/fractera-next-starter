import Todo, { generateMetadata } from "./_components"

// Тонкий вход страницы списка дел.
// Окно свежести задаёт `app/[lang]/layout.tsx`; своё здесь не объявляется — оно
// было бы ложью, в дереве побеждает меньшее значение.
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <Todo lang={lang} />
}

export { generateMetadata }

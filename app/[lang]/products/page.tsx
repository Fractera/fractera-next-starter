import Catalogue, { generateMetadata, revalidate } from "./_components"

// Тонкий вход публичной витрины.
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <Catalogue lang={lang} />
}

export { generateMetadata, revalidate }

import Catalogue from "./_components"

// Тонкий вход публичного каталога.
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <Catalogue lang={lang} />
}

export { generateMetadata } from "./_components"

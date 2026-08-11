import ProductPage from "./_components"

export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  return <ProductPage lang={lang} slug={slug} />
}

export { generateMetadata, generateStaticParams } from "./_components"

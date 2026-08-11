import ProductPage, { generateMetadata, generateStaticParams, revalidate } from "./_components"

// Тонкий вход страницы товара.
export default async function Page({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  return <ProductPage lang={lang} slug={slug} />
}

export { generateMetadata, generateStaticParams, revalidate }

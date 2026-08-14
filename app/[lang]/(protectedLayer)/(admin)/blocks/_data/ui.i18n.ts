// Слова страницы «Каталог секций» (слой прав `admin`).
//
// 🔒 ЯЗЫКОВ СТОЛЬКО, СКОЛЬКО ВКЛЮЧЕНО (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`, сейчас
// десять) — это строки ОДНОЙ страницы. Сторож `npm run check:i18n` держит число.
// Тексты самих образцов живут в `specimen.ts` и остаются английскими намеренно:
// они показывают форму секции, а не обращаются к посетителю.

export type BlocksCatalogueUi = {
  title: string
  subtitle: string
  countLabel: string
  whenLabel: string
}

const UI: Record<string, BlocksCatalogueUi> = {
  en: { title: 'Section catalogue', subtitle: 'Every kind of section the content engine can render, drawn by the real renderer with sample data.', countLabel: 'kinds', whenLabel: 'When to use it' },
  ru: { title: 'Каталог секций', subtitle: 'Все виды секций, которые умеет движок материалов, нарисованные настоящим рендерером на образцовых данных.', countLabel: 'видов', whenLabel: 'Когда уместен' },
  es: { title: 'Catálogo de secciones', subtitle: 'Todos los tipos de sección que el motor de contenido sabe representar, dibujados por el renderizador real con datos de muestra.', countLabel: 'tipos', whenLabel: 'Cuándo usarlo' },
  fr: { title: 'Catalogue des sections', subtitle: 'Tous les types de section que le moteur de contenu sait rendre, dessinés par le vrai moteur de rendu avec des données d’exemple.', countLabel: 'types', whenLabel: 'Quand l’utiliser' },
  it: { title: 'Catalogo delle sezioni', subtitle: 'Tutti i tipi di sezione che il motore dei contenuti sa disegnare, resi dal renderer reale con dati di esempio.', countLabel: 'tipi', whenLabel: 'Quando usarlo' },
  de: { title: 'Katalog der Abschnitte', subtitle: 'Alle Abschnittsarten, die die Inhalts-Engine darstellen kann — gezeichnet vom echten Renderer mit Beispieldaten.', countLabel: 'Arten', whenLabel: 'Wann sinnvoll' },
  pt: { title: 'Catálogo de secções', subtitle: 'Todos os tipos de secção que o motor de conteúdos consegue desenhar, produzidos pelo renderizador real com dados de exemplo.', countLabel: 'tipos', whenLabel: 'Quando usar' },
  pl: { title: 'Katalog sekcji', subtitle: 'Wszystkie rodzaje sekcji, które potrafi narysować silnik treści — wyrenderowane przez prawdziwy renderer na przykładowych danych.', countLabel: 'rodzajów', whenLabel: 'Kiedy stosować' },
  tr: { title: 'Bölüm kataloğu', subtitle: 'İçerik motorunun çizebildiği tüm bölüm türleri — örnek verilerle, gerçek çizicinin kendisi tarafından oluşturuldu.', countLabel: 'tür', whenLabel: 'Ne zaman kullanılır' },
  nl: { title: 'Catalogus van secties', subtitle: 'Alle soorten secties die de contentmotor kan renderen, getekend door de echte renderer met voorbeeldgegevens.', countLabel: 'soorten', whenLabel: 'Wanneer te gebruiken' },
}

export function blocksCatalogueUi(lang: string): BlocksCatalogueUi {
  return UI[lang] ?? UI.en
}

import type { FooterPageCell } from '@/lib/pages/footer-page'

// Dil hücresi: yalnızca gerekli olan çevrilir. Çevrilmemiş bir alan, blog
// yazılarıyla aynı çözümleyici üzerinden İngilizce tabandan gelir.
export const tr: Partial<FooterPageCell> = {
  title: 'Hizmet Şartları',
  description: 'Bu siteyi ve hizmetlerini kullanmanın kuralları.',
  keywords: 'hizmet şartları, kullanım koşulları',
  blocks: [
    { kind: 'h2', text: 'Burada ne olmalı' },
    { kind: 'p', text: 'Bu yer tutucuyu kendi metninle değiştir. Sen bunu yapana kadar sayfa yine de çalışır: tamamen statik ve dizinlenebilir, ve arama motorları başlığını, açıklamasını ve yapılandırılmış verisini tıpkı bir makalede olduğu gibi alır. [%SITE%](/tr) sayfasına dön.' },
    { kind: 'p', text: 'Hizmet şartları, ziyaretçilerine ne söz verdiğini ve onlardan ne beklediğini belirler.' },
  ],
}

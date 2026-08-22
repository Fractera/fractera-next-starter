import type { FooterPageCell } from '@/lib/pages/footer-page'

// Dil hücresi: yalnızca gerekli olan çevrilir. Çevrilmemiş bir alan, blog
// yazılarıyla aynı çözümleyici üzerinden İngilizce tabandan gelir.
export const tr: Partial<FooterPageCell> = {
  title: 'Gizlilik Politikası',
  description: 'Bu sitenin kişisel verileri nasıl topladığı, kullandığı ve koruduğu.',
  keywords: 'gizlilik politikası, kişisel veri, GDPR',
  blocks: [
    { kind: 'h2', text: 'Burada ne olmalı' },
    { kind: 'p', text: 'Bu yer tutucuyu kendi metninle değiştir. Sen bunu yapana kadar sayfa yine de çalışır: tamamen statik ve dizinlenebilir, ve arama motorları başlığını, açıklamasını ve yapılandırılmış verisini tıpkı bir makalede olduğu gibi alır. [%SITE%](/tr) sayfasına dön.' },
    { kind: 'p', text: 'Bir gizlilik politikası hangi verileri topladığını, neden topladığını, ne kadar süreyle sakladığını ve bir ziyaretçinin bunun kaldırılmasını nasıl isteyebileceğini belirtir.' },
  ],
}

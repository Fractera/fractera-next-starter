import type { FooterPageCell } from '@/lib/pages/footer-page'

// Dil hücresi: yalnızca gerekli olan çevrilir. Çevrilmemiş bir alan, blog
// yazılarıyla aynı çözümleyici üzerinden İngilizce tabandan gelir.
export const tr: Partial<FooterPageCell> = {
  title: 'Çerez Politikası',
  description: 'Bu sitenin hangi çerezleri kullandığı ve bunların nasıl kontrol edileceği.',
  keywords: 'çerez politikası, çerezler, onay',
  blocks: [
    { kind: 'h2', text: 'Burada ne olmalı' },
    { kind: 'p', text: 'Bu yer tutucuyu kendi metninle değiştir. Sen bunu yapana kadar sayfa yine de çalışır: tamamen statik ve dizinlenebilir, ve arama motorları başlığını, açıklamasını ve yapılandırılmış verisini tıpkı bir makalede olduğu gibi alır. [%SITE%](/tr) sayfasına dön.' },
    { kind: 'p', text: 'Bir çerez politikası, sitenin ayarladığı çerezleri, her birinin ne işe yaradığını ve onayın nasıl geri çekileceğini listeler.' },
  ],
}

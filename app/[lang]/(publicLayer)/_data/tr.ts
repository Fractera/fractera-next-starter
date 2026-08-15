import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const tr: Partial<HomeCell> = {
  title: 'Bu, uygulamanızın başlangıç şablonu',
  description: 'Kendi sunucunuzda çalışır ve başka kimseye hesap vermez. Kontrol panelinde ona bir isim verin — bu satır kaybolacak.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Etmen mühendisliği altyapısı' },
  {
    kind: 'badges',
    items: [
      { label: '82 dil', tone: 'reach' },
      { label: 'SEO dahili', tone: 'reach' },
      { label: 'Kendi veritabanı', tone: 'data' },
      { label: 'Vektör arama', tone: 'data' },
      { label: 'Bilgi grafiği', tone: 'data' },
      { label: 'Kendi dosya deposu', tone: 'data' },
      { label: 'Yetkilendirme', tone: 'access' },
      { label: '{roles} rol', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Fractera mimarisi', tone: 'code' },
      { label: '100+ daha fazla', tone: 'muted' },
    ],
  },
  {
    kind: 'panel',
    title: 'Nasıl başlanır',
    children: [
      { kind: 'p', text: 'Boş bir sunucudan üretimdeki kendi kodunuza altı adım. Aşağıdakilerin hepsi zaten kurulu — siz inşa etmiyor, açıyorsunuz.' },
      {
        kind: 'olist',
        items: [
          'Kontrol panelini açın — bu sunucuyla ilgili her şey orada yapılandırılır. [Kontrol paneli]({admin}/{lang})',
          'Uygulamanızın sunulacağı dilleri seçin. [Diller]({admin}/{lang}/languages)',
          'Projenizi ayarlarda tanımlayın: ad, açıklama, logo, SEO. [Uygulama ayarları]({admin}/{lang}/app-settings)',
          'GitHub\'ı bağlayın ve sunucunun kodunu deponuza gönderin. [GitHub]({admin}/{lang}/github)',
          'O depoyu kendi makinenize klonlayın, orada geliştirin ve geri gönderin.',
          'Paneldeki Dağıt düğmesine basın — sunucu commit\'inizi alır ve kendini yeniden inşa eder. [Dağıtımlar]({admin}/{lang}/deployments)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'warn',
    title: 'Başlamadan önce önerilir',
    children: [
      { kind: 'p', text: 'İkisi de hiçbir şeyi engellemez. İkisi de yeniden yapmayı önler: birincisi ürünün düşünen yarısını açar, ikincisi her sayfanın adresini değiştirir.' },
      {
        kind: 'list',
        items: [
          '**Bir OpenAI anahtarı.** Anahtar olmadan Quiz soru sormaz, Quiz olmadan da kullanıcı senaryolarınızı tanımlayacak hiçbir şey yoktur — bu yüzden kodlama ajanı inşa etmeyi reddeder. Bu yüzden panel, ilk senaryolar oluşana kadar anahtarı KIRMIZI bir gereklilik olarak, sonrasında ise kehribar renkli bir öneri olarak ele alır: site anahtarsız da çalışır, sadece vektör arama ve bilgi grafiği boş kalır. Anahtar bir kez girilir ve maliyet doğrudan model sağlayıcınıza gider. [OpenAI anahtarı]({admin}/{lang}/openai)',
          '**Kendi alan adınız.** Site sayısal bir adreste yaşadığı sürece ne sertifikası ne de kurulabilir uygulaması olur — tarayıcı bunları yalnızca güvenli bağlantı üzerinden verir. Alan adına geçmek her sayfanın adresini değiştirir, bu yüzden bunu sayfalar dizinlenmeden önce yapmak daha ucuzdur. [Alan adı]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Herhangi bir koddan önce',
    title: 'Quiz — boş bir sayfa yerine yedi soru',
    children: [
      { kind: 'p', text: 'Bir projenin en pahalı hatası ilk kod satırından önce yapılır: yanlış şey inşa edilir. Kötü inşa edildiğinden değil, «nereden başlamalıyım» sorusunu tek başına yanıtlamak zor olduğundan. Quiz bunu bir sohbete dönüştürür: siz yanıtlarsınız, model sormaya devam eder ve bundan, projenin sonra inşa edileceği senaryo listesi doğar.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'Çekirdek' }, { kind: 'p', text: 'Yedi kısa soru: ürünün ne olduğu, kimin için olduğu, bir kişinin ondan ne almasi gerektiği. Kendi kelimelerinizle yanıtlayın — dikte etmek işe yarar. Sonrasındaki her şey buradan büyür, bu yüzden birkaç cümle, birkaç kelimeden belirgin biçimde daha iyi bir sonuç verir.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Sohbet' }, { kind: 'p', text: 'Sonra kendi dilinizde, sırayla bir soru. Bir oto-quiz vardır: model beş yeni soru sorar ve açıklamayı derinleştirerek bunları kendisi yanıtlar — ama sizin adınıza uydurduğu her şey «Varsayım» olarak işaretlenir ve siz düzeltirsiniz. Gerçek diye geçirilen bir tahmin, daha sonra tamamlanmış senaryoların içinde ortaya çıkardı.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Senaryolar' }, { kind: 'p', text: 'Sohbet numaralandırılmış vakalar hâlinde sentezlenir: kim gelir, ne yapar, sonunda ne doğru olmalıdır. Her birini okur ve ayrı ayrı onaylarsınız. Okunmamış bir vaka hâlâ modelin bir tahminidir.' }] },
        ],
      },
      { kind: 'quote', text: 'Ve bu bir öneri değil, bir ürün kuralıdır: tek bir vaka bile onaylanmamışken panel alarmını yanık tutar ve kodlama ajanı inşa etmeyi reddeder. Okunmamış bir tahmin üzerine inşa etmek, hiç inşa etmemekten daha pahalıya mal olur.' },
      { kind: 'cta', text: 'Quiz — boş bir sayfa yerine yedi soru', href: '{admin}/{lang}/doc-use-cases', label: 'Quiz\'i aç' },
    ],
  },
  {
    kind: 'panel',
    title: 'Bu proje teknik olarak nedir',
    children: [
      { kind: 'p', text: 'Bu bitmiş bir site değil, Fractera mimarisidir: aynı iskelet hem bir açılış sayfasını hem büyük bir SaaS\'ı hem de çok katmanlı otomasyonu taşır. Büyümek yeniden yazmayı gerektirmez — veri, yetkilendirme ve panel katmanları zaten ayrılmıştır ve her biri henüz sahip olmadığınız bir yük için tasarlanmıştır.' },
      { kind: 'p', text: 'Kod burada yazılmaz. Bir geliştirici depoyu kendi makinesine klonlar ve projenin içinde yaşayan talimatları ve becerileri okuyan Claude Code ile çalışır: bunlar kuralları belirler ve otomatik denetimler ihlal edilmelerine izin vermez. Sunucu yalnızca sonucu alır ve yeniden inşa eder.' },
      { kind: 'p', text: 'İskelet, bir milyon satırı aşacak bir proje için inşa edilmiştir: her varlığın kendi klasörü vardır, paylaşılan katman sayılarıyla büyümez, rotalar ve izinler uygulandıkları yerde tanımlanır. Buradaki kararlılık bir vaat değil, bir sonuçtur — yeni bir sayfa merkezi bir çekirdeğe hiçbir şey eklemez.' },
    ],
  },
],
}

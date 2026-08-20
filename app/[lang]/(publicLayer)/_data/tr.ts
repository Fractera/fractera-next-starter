import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const tr: Partial<HomeCell> = {
  title: 'Bu, uygulamanızın başlangıç şablonu',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'Kendi sunucunuz, kendi kodunuz: yetkilendirme, veritabanı, depolama ve vektör arama zaten bağlı. 82 dilde bir açılış sayfası ya da SaaS kurun.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Etmen mühendisliği altyapısı',
    title: 'Bu, uygulamanızın başlangıç şablonu',
    description:
      'Her şey zaten kurulu ve birbirine bağlı — yetkilendirme, kendi veritabanınız, dosya deposu, vektör arama ve yüz kadar araç daha; hepsi, kod yazan bir etmenin iki kez anlatmaya gerek kalmadan bulacağı biçimde düzenlenmiş. Bir açılış sayfası, bir SaaS ya da hiç uyumayan bir otomasyon kurun — 82 dilin herhangi birinde, bir milyon satırı aşacak bir proje için biçilmiş bir iskelet üzerinde. Aynı yığını kendiniz kurmaya göre yaklaşık **dokuz kat daha hızlı** — ve burada hiçbir şey dışarıyı aramaz: ne sağlayıcı, ne abonelik, ne de izin istenecek biri. Sunucu sizin, kod sizin, **yüzde yüz**.',
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Ücretsiz al, ölçekle' },
    image: 'homePage',
    imageAlt: 'SaaS başlangıç şablonu',
  },
  { kind: 'projectTypeMarquee' },
  {
    kind: 'metrics',
    items: [
      { value: '×4', label: 'geliştirmesi daha ucuz' },
      { value: '×9', label: 'başlatması daha hızlı' },
      { value: '×100', label: 'üretimde daha güvenilir' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: '82 dil', tone: 'reach' },
      { label: 'SEO dahili', tone: 'reach' },
      { label: 'AIO etmen taraması', tone: 'reach' },
      { label: 'Kendi veritabanı', tone: 'data' },
      { label: 'Vektör arama', tone: 'data' },
      { label: 'Bilgi grafiği', tone: 'data' },
      { label: 'Kendi dosya deposu', tone: 'data' },
      { label: 'Yetkilendirme', tone: 'access' },
      { label: '{roles} rol', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Fractera mimarisi', tone: 'code' },
      { label: '100+ daha fazla', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Süreç',
    title: 'Nasıl çalışır',
    note: 'Boş bir sunucudan kendi kodunuzun yayına çıkmasına kadar. Aşağıdakilerin tamamı size ait donanımda çalışır.',
    steps: [
      { title: 'Sunucuyu ayağa kaldırın', text: 'Fractera [kurulum robotuyla](https://www.fractera.ai/deployments/vps) dağıtın. Bir işletim sistemi, başlangıç şablonu, kontrol paneli, depolar ve yetkilendirme — kurulu ve birbirine bağlı olarak elinize geçer.' },
      { title: 'Zaten çalıştığınız yerde geliştirin', text: 'GitHub ile eşitleyin, sonra kendi makinenize klonlayın ve Claude Code ya da Codex çalıştırın. Veriler sunucunuzdan gelmeye devam eder; kod kendi IDE\'nizde çalışır.' },
      { title: 'Gönderin, kendi kendine yayınlansın', text: 'Yerel makinede işi bitirin ve projeyi GitHub\'a gönderin. Bu, kendi sunucunuzda hemen yeni bir dağıtım başlatır — ve ziyaretçi yeni projeyi görür.' },
    ],
  },
  {
    kind: 'cards',
    badge: 'Başlangıç',
    title: 'Nasıl başlanır',
    note: 'Aşağıdakilerin tamamı zaten kurulu — inşa etmiyor, açıyorsunuz. Solda yol; sağda onu iki kez yürümekten kurtaran şeyler.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Boş sunucudan yedi adım' },
          { kind: 'p', text: 'Bu projeyi almak için [kurulum robotunu](https://www.fractera.ai/deployments/vps) başlatın.' },
          {
            kind: 'olist',
            items: [
          'Kontrol panelini açın — bu sunucuyla ilgili her şey orada yapılandırılır. [Kontrol paneli]({admin}/{lang})',
          'Uygulamanızın sunulacağı dilleri seçin. [Diller]({admin}/{lang}/languages)',
          'Projenizi ayarlarda tanımlayın: ad, açıklama, logo, SEO. [Uygulama ayarları]({admin}/{lang}/app-settings)',
          'GitHub\'ı bağlayın ve sunucunun kodunu deponuza gönderin. [GitHub]({admin}/{lang}/github)',
          'O depoyu kendi makinenize klonlayın, orada geliştirin ve geri gönderin.',
          'Ortam dosyası `.env.local` dosyasını makinenize taşıyın — git onu asla taşımaz ve o olmadan yerel kopya başlamaz. [Ortam değişkenleri]({admin}/{lang}/env)',
          'Paneldeki Dağıt düğmesine basın — sunucu commit\'inizi alır ve kendini yeniden inşa eder. [Dağıtımlar]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Başlamadan önce önerilir' },
          { kind: 'p', text: 'Bunların hiçbiri bir şeyi engellemez. Üçü de yeniden yapmaktan kurtarır.' },
          {
            kind: 'list',
            items: [
              '**Bir OpenAI anahtarı.** Onsuz Quiz soru sormaz, senaryo olmadan da kodlayan ajan inşa etmeyi reddeder. Site yine de çalışır — yalnızca vektör arama ve bilgi grafiği boş kalır. Bir kez girilir; masraf doğrudan model sağlayıcınıza gider. [OpenAI anahtarı]({admin}/{lang}/openai)',
              '**Kendi alan adınız.** Sayısal bir adreste ne sertifika ne de kurulabilir uygulama olur — tarayıcı bunları yalnızca güvenli bağlantıda verir. Sonradan taşınmak her sayfanın adresini değiştirir, bu yüzden dizine eklenmeden önce daha ucuza gelir. [Alan adı]({admin}/{lang}/domain)',
              '**Chrome için Claude eklentisi.** O olmadan ajan yalnızca kaynak kodu görür: konsol hataları, JavaScript kapalıyken davranış ve sayfanın gerçekte nasıl göründüğü kodun hiçbir yerinde yazmaz. Onunla sayfayı kendisi açar ve tahminini değil, gerçeği düzeltir. [Geliştirme araçları]({admin}/{lang}/dev-tools)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Herhangi bir koddan önce',
    title: 'Quiz — boş bir sayfa yerine yedi soru',
    note: 'Bir projenin en pahalı hatası ilk kod satırından önce yapılır: yanlış şey inşa edilir. Kötü inşa edildiğinden değil, «nereden başlamalıyım» sorusunu tek başına yanıtlamak zor olduğundan. Quiz bunu bir sohbete dönüştürür: siz yanıtlarsınız, model sormaya devam eder ve bundan, projenin sonra inşa edileceği senaryo listesi doğar.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'Çekirdek' }, { kind: 'p', text: 'Yedi kısa soru: ürünün ne olduğu, kimin için olduğu, bir kişinin ondan ne almasi gerektiği. Kendi kelimelerinizle yanıtlayın — dikte etmek işe yarar. Sonrasındaki her şey buradan büyür, bu yüzden birkaç cümle, birkaç kelimeden belirgin biçimde daha iyi bir sonuç verir.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Sohbet' }, { kind: 'p', text: 'Sonra kendi dilinizde, sırayla bir soru. Bir oto-quiz vardır: model beş yeni soru sorar ve açıklamayı derinleştirerek bunları kendisi yanıtlar — ama sizin adınıza uydurduğu her şey «Varsayım» olarak işaretlenir ve siz düzeltirsiniz. Gerçek diye geçirilen bir tahmin, daha sonra tamamlanmış senaryoların içinde ortaya çıkardı.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Senaryolar' }, { kind: 'p', text: 'Sohbet numaralandırılmış vakalar hâlinde sentezlenir: kim gelir, ne yapar, sonunda ne doğru olmalıdır. Her birini okur ve ayrı ayrı onaylarsınız. Okunmamış bir vaka hâlâ modelin bir tahminidir.' }] },
    ],
  },
  { kind: 'statement', text: 'Ve bu bir öneri değil, bir ürün kuralıdır: tek bir vaka bile onaylanmamışken panel alarmını yanık tutar ve kodlama ajanı inşa etmeyi reddeder. Okunmamış bir tahmin üzerine inşa etmek, hiç inşa etmemekten daha pahalıya mal olur.' },
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Ücretsiz al, ölçekle' },
  {
    kind: 'cards',
    badge: 'Mimari',
    title: 'Bu proje teknik olarak nedir',
    note: 'İnşaya başlamadan önce bilinmeye değer üç şey: bu iskelet nedir, kod gerçekte nerede yazılır ve proje ilk yüz sayfasını aştığında ne olur.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'Bu bitmiş bir site değil, Fractera mimarisidir: aynı iskelet hem bir açılış sayfasını hem büyük bir SaaS\'ı hem de çok katmanlı otomasyonu taşır. Büyümek yeniden yazmayı gerektirmez — veri, yetkilendirme ve panel katmanları zaten ayrılmıştır ve her biri henüz sahip olmadığınız bir yük için tasarlanmıştır.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Kod burada yazılmaz. Bir geliştirici depoyu kendi makinesine klonlar ve projenin içinde yaşayan talimatları ve becerileri okuyan Claude Code ile çalışır: bunlar kuralları belirler ve otomatik denetimler ihlal edilmelerine izin vermez. Sunucu yalnızca sonucu alır ve yeniden inşa eder.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'İskelet, bir milyon satırı aşacak bir proje için inşa edilmiştir: her varlığın kendi klasörü vardır, paylaşılan katman sayılarıyla büyümez, rotalar ve izinler uygulandıkları yerde tanımlanır. Buradaki kararlılık bir vaat değil, bir sonuçtur — yeni bir sayfa merkezi bir çekirdeğe hiçbir şey eklemez.' }] },
    ],
  },
  {
    kind: 'quote',
    lead: 'Yüksek yüke hazır',
    text:
      'Vibe coding\'in gizli gerçeği: bir projenin büyük bölümü yüksek yük, veritabanı sorgularından tasarruf ve önbellekleme düşünülmeden yazılır. Geliştiriciler bunu bilmediği için değil — bu standardı bir çatı katmanının içinde tutmak gerçekten zor olduğu için. Çok sayıda küçük ayrıntı bir sayfayı sessizce statik üretimden dinamik render\'a iter. Ve fark yüzde beş ya da on değildir: bazı durumlarda sunucunuzun üzerindeki yük bin kat artar, sunucu ve platform faturanız da onunla birlikte büyür. Fractera uzun bir deneyimin üzerine kuruludur: web geliştirmede otuz yılı aşkın deneyim. Yüksek yük, arama motoru optimizasyonu ve veritabanlarında tasarrufla ilgili her şey bu projenin DNA\'sına yazılmıştır. Onun iskeletidir, onun yaşam gücüdür. Ve size ücretsiz aittir.',
    cite: 'Roma Armstrong · Fractera\'nın kurucusu',
  },
  {
    kind: 'noBill',
    badge: 'Bağımsızlık',
    heading: 'Tümüyle bağımsız bir alan',
    note: 'Sıradan bir projede bunlar üç dış hizmettir: kendi fiyatları, kendi koşulları ve projenizin çalışmaya devam etmesi için kendi izinleri. Burada üçü de kendi sunucunuzda yaşıyor.',
    items: [
      { vendor: 'Vercel', text: 'ödeme yapmıyorsunuz', badge: { label: 'barındırma', tone: 'reach' } },
      { vendor: 'Neon', text: 'ödeme yapmıyorsunuz', badge: { label: 'veritabanı', tone: 'data' } },
      { vendor: 'Clerk', text: 'ödeme yapmıyorsunuz', badge: { label: 'yetkilendirme', tone: 'access' } },
    ],
    title: 'Kimseye ödeme yapmıyorsunuz',
    text: 'Kimseye bağımlı değilsiniz. Proje tamamen sizin.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'languageMarquee',
    title: 'Seksen iki dil — ihtiyaç duymadan önce hazır',
    note: 'Hepsi ürünle birlikte gelir; pazarınızın konuştuklarını siz açarsınız. Statik üretim, arama ve yapay zekâ optimizasyonu, veri önbelleği ve yüksek yüke hazırlık, verimliliği sektörün en üst sınırında tutar — tek dille, birkaç dille ya da seksen iki dilin tamamıyla çalışmanız fark etmez.',
  },
],
}

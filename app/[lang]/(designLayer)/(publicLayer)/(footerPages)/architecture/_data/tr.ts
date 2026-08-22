import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const tr: FooterPageCell = {
  title: 'Mimari',
  description:
    'Bu uygulamanın nasıl bir araya getirildiği: katmanlar, her birinin neye sahip olduğu ve diğerleri kapatıldığında hangilerinin çalışmaya devam ettiği.',
  keywords: 'mimari, katmanlar, statik oluşturma, kendi sunucun, veri katmanı',
  blocks: [
    {
      kind: 'p',
      text: 'Bu sayfa, uygulamanın üzerinde durduğu iskeleti açıklar. Aynı anda iki okuyucu için yazılmıştır — ürünün uygun olup olmadığına karar veren bir insan ve onu değiştirecek olan bir kodlama ajanı. Her ikisinin de aynı şeye ihtiyacı var: Herhangi bir şeye dokunmadan önce hangi katmanın neye sahip olduğunu bilmek. [%SITE%](/tr) adresine geri dön.',
    },

    { kind: 'h2', text: 'Nasıl bağlandığı' },
    {
      kind: 'p',
      text: 'Sunucunuzda birkaç süreç yan yana çalışır. Bunlardan dördü dışarıya yanıt verir ve her birinin tam olarak tek bir görevi vardır. Aralarındaki sınır bir klasörden ziyade bir bağlantı noktasıdır (port) — bu yüzden birindeki bir arıza diğerlerini beraberinde götürmez.',
    },
    {
      kind: 'table',
      headers: ['Port', 'Süreç', 'Ne işe yarar'],
      rows: [
        ['3000', 'Uygulamanız', 'Ziyaretçilerin gördüğü sayfalar. Her gün çalıştığınız şey budur.'],
        ['3001', 'Yetkilendirme', 'Hesaplar, oturumlar, roller. Kontrol panelinden yapılandırılır, sizin tarafınızdan düzenlenmez.'],
        ['3002', 'Kontrol paneli', 'Aynısı: yapılandırılır, düzenlenmez.'],
        ['3300', 'Veri katmanı', 'Satırlar, yüklenen dosyalar, vektörler — ve diğer her şeye açılan tek kapı. Uygulamanız onunla konuşur.'],
      ],
    },
    { kind: 'p', text: 'Yan yana üç hizmet daha çalışır ve bunların hiçbiri tek başına bağımsız bir kapı değildir:' },
    {
      kind: 'list',
      items: [
        'harita — rotalar, mesafe matrisleri ve adres arama, port 3400;',
        'kanallar — Telegram ve ardından gelenler, port 3500;',
        'bilgi grafiği — otonom RAG deposu, port 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Bu portların hiçbirine internetten ulaşılamaz: Güvenlik duvarı yalnızca web portlarına izin verir ve kamuya açık olan her şey bunlar üzerinden gelir. Uygulamanız bu üç hizmete veri katmanı üzerinden — /service/geo, /service/channels, /service/rag — veri katmanının kendisini açan anahtarla ulaşır.',
    },

    { kind: 'h2', text: 'Her katman diğerlerinden bağımsız ayakta kalır' },
    {
      kind: 'p',
      text: 'Ayrı süreçler bir diyagramdan ibaret değildir — kötü bir günde olan şeydir. Dört süreçten herhangi biri, geri kalanı çökmeden durabilir.',
    },
    {
      kind: 'table',
      headers: ['Bu durursa', 'Neler çalışmaya devam eder'],
      rows: [
        ['Uygulamanız', 'Panel, veriler ve hesaplar dokunulmamış olarak kalır; yalnızca site çöker'],
        ['Kontrol paneli', 'Site ziyaretçilere hizmet vermeye devam eder; yalnızca değişikliklerin beklemesi gerekir'],
        ['Veri katmanı', 'Önceden oluşturulmuş sayfalar yine de açılır — statik oluşturmanın amacı da budur'],
        ['Yetkilendirme', 'Kamuya açık sayfalar etkilenmez; yalnızca giriş gerektiren kısımlar kapanır'],
      ],
    },
    {
      kind: 'note',
      text: 'Panel kasıtlı olarak deponuzun (repository) dışında yer alır. GitHub’ınıza giden şey uygulamadır; kokpit sunucuda kalır, bu yüzden bir düzenleme hatası onu bozamaz.',
    },

    { kind: 'h2', text: 'Önce statik ve bunun size kazandırdıkları' },
    {
      kind: 'p',
      text: 'Sayfalar istek başına bir araya getirilmez, önceden oluşturulur. Bu bir performans detayı değildir — sitenin yük altındayken bile düşük maliyetle sunulmasının, arama motorları tarafından tamamen okunabilmesinin ve JavaScript kapatıldığında bile çalışabilmesinin nedenidir.',
    },
    {
      kind: 'list',
      items: [
        'Yönlendirme sunucu tarafındadır, bu nedenle betikleri devre dışı bırakılmış bir ziyaretçi bile tüm sitede gezinmeye devam edebilir.',
        'İçerik her ziyarette değil, belirli bir programa göre yeniden oluşturulur, bu nedenle trafik artışı ekstra bir maliyet yaratmaz.',
        'Gerçekten kimin baktığına bağlı olan her şey — bir kontrol paneli, bir hesap — istek üzerine işlenir (render edilir) ve yalnızca bu kısım işlenir.',
      ],
    },

    { kind: 'h2', text: 'Tek bir tasarım, bir kez kararlaştırılır' },
    {
      kind: 'p',
      text: 'Renkler, tipografi ve aralıklar sayfa başına seçilmez. Tüm ölçek bir yerde, palet başka bir yerde yaşar ve elle yazılmış bir başlık henüz siteye ulaşmadan kontrolden geçemeyip başarısız olur.',
    },
    {
      kind: 'p',
      text: 'Arkalarındaki kural kısadır: **Bir sayfanın nasıl göründüğüne dair hiçbir şey, onu kimin açabileceğine bağlı değildir.** Kamusal veya özel, vitrin veya yönetici tablosu — aynı başlıklar, aynı ölçek, aynı renkler. Erişim bir kişinin neyi görebileceğine karar verir, bunun nasıl ayarlandığına asla karar vermez.',
    },
    {
      kind: 'p',
      text: 'Bu yazılmıştır çünkü yokluğunun somut bir sonucu vardır. Tasarım dosyası boşken, bu projeyi inşa eden ajan "çalışma ekranları" için ikinci bir başlık stili icat etti — iki özel sayfa sonuçta boyut olarak iki kat farklılaştı ve farklı font aileleriyle ayarlandı. Bozuk bir şey yoktu; sadece iki farklı ürünmüş gibi algılanıyordu.',
    },
    {
      kind: 'p',
      text: 'Paletiniz, sayfa sunulurken okunan renk rollerinden oluşan küçük bir dosyadır. Onu değiştirin ve henüz oluşturmadığınız sayfalar da dahil olmak üzere tüm site bunu takip eder; ayrıca her iki tema da dahildir: Açık ve koyu temalar, elle senkronize tutulacak iki tasarım değil, farklı değerlere sahip aynı rollerdir.',
    },

    { kind: 'h2', text: 'Diller: 82 dil mevcut ve bir tane eklemek hiçbir maliyet getirmez' },
    {
      kind: 'p',
      text: 'Ürünle birlikte seksen iki dil sunulur. Pazarınızın konuştuğu dilleri etkinleştirirsiniz ve geri kalanı bekler — daha sonra bir dili etkinleştirmek bir ayardır, sitenin çalışma şeklinin yeniden inşası değildir.',
    },
    {
      kind: 'p',
      text: 'Anlamaya değer olan kısım, bir dil eklemenin ne YAPMADIĞIDIR:',
    },
    {
      kind: 'list',
      items: [
        'Hiçbir sayfayı dinamik hale getirmez. Her dil, tıpkı ilki gibi önceden oluşturulmuş kendi sayfalarını alır — on dil, istek başına derlenen tek bir sayfa değil, on set statik sayfa anlamına gelir.',
        'Arama sıralamasını zayıflatmaz. Her sayfa kendisini kendi dilindeki orijinal olarak ilan eder ve çevirilerini adlandırır, böylece bir arama motoru bunları birbirleriyle yarışan on yakın kopya olarak değil, on dilde tek bir sayfa olarak değerlendirir.',
        'Hızdan ödün vermez. Önceden işlenmiş bir sayfayı sunmak, yanında kaç dil bulunursa bulunsun aynı iştir.',
      ],
    },
    {
      kind: 'note',
      text: 'Tek dilli bir site, basitleştirilmiş bir sürüm değil, başlı başına bir durumdur: Dil, adreslerden tamamen kaybolur ve site sahip olmadığı çevirilerin reklamını yapmayı bırakır.',
    },

    { kind: 'h2', text: 'Arama motorları tarafından bulunur, modeller tarafından okunabilir' },
    {
      kind: 'p',
      text: 'Modern bir siteye iki okuyucu gelir ve farklı şeyler isterler. Arama motoru bir insanı bir sayfaya yönlendirir. Model ise kendisi gelir, okur ve yeniden anlatır. Ürün her ikisi için de inşa edilmiştir ve bu ikisi aynı iş değildir.',
    },
    {
      kind: 'p',
      text: 'Arama motorları için: Sayfalar tamamlanmış HTML olarak sunulur, her biri kendi kanonik adresini ilan eder, çeviriler birbirini adlandırır, meta veriler sayfa başına değil tek bir mekanizma tarafından derlenir ve yapılandırılmış veriler, site haritaları ve robots kuralları varsayılan olarak sunulur. Otomatik kontroller, bunlardan herhangi birini ihlal eden sayfayı reddeder.',
    },
    {
      kind: 'p',
      text: 'Modeller için: Kamuya açık her sayfa aynı zamanda düz metin olarak da mevcuttur. /llms.txt adresinde bir harita, /llms-full.txt adresinde tüm derlem (corpus) ve yanında her sayfanın bir markdown sürümü bulunur. Bu önemlidir çünkü sayfa işaretlemesi (markup) bir model için yarı yarıya gürültüdür — menüler, alt bilgi (footer), rıza bildirimi, betikler — ve bağlamını tüm bunlar için harcar.',
    },
    {
      kind: 'note',
      text: 'Her iki form da AYNI içerikten oluşturulur. Senkronizasyonun bozulacağı ayrı bir "Yapay Zeka sürümü" yoktur: Metni bir kez düzenlersiniz ve her ikisi birlikte değişir. Elle sürdürülen bir kopya ilk düzeltmede farklılaşır ve kimse bunu fark etmez, çünkü kimse onu bir tarayıcıda açmaz.',
    },

    { kind: 'h2', text: 'Ayarlar yeniden derleme yapılmadan uygulanır' },
    {
      kind: 'p',
      text: 'İsim, açıklama, logo, renkler, diller ve özellik anahtarları kodun dışında, sunucudaki yapılandırma dosyalarında yaşar. Uygulama bunları sunum yaparken okur, bu nedenle paneldeki bir değişiklik anında görünür — dağıtım (deployment) yok, duruş süresi (downtime) yok.',
    },
    {
      kind: 'p',
      text: 'Sonuç, kolaylıktan daha önemlidir: Aynı kod tabanı bir fırına da bir pazaryerine de hizmet eder ve buraya ulaşmak için hiçbirinin çatallanması (fork) gerekmemiştir.',
    },

    { kind: 'h2', text: 'Sizin sunucunuz, sizin kodunuz ve çıkış yolu' },
    {
      kind: 'p',
      text: 'Uygulama sizindir: Klonlayın, yerel olarak düzenleyin, geri gönderin (push edin). Buradaki hiçbir şey merkeze bilgi göndermez (call home) — izin istenecek bir satıcı ve iptal edilebilecek bir abonelik yoktur.',
    },
    {
      kind: 'p',
      text: 'Ayrıca ayrılabilirsiniz de. Panele olan bağımlılığı kaldırın ve uygulama her yerde çalışsın. Sunucuda yaşayan kısımları kaybedersiniz — yeniden derleme gerektirmeyen ayarlar, veri katmanı, vektör araması, 82 dilde yetkilendirme, geri alma (rollback) özellikli dağıtım geçmişi — ve kodu saklarsınız. Bu meşru bir çıkıştır, tasarımdan sapma değildir.',
    },

    { kind: 'h2', text: 'Bağlam tükendikten sonra bile büyümeye devam edecek şekilde inşa edilmiştir' },
    {
      kind: 'p',
      text: 'Yapay zeka tarafından inşa edilen bir projedeki katı sınır kodun boyutu değildir. Güvenli bir değişiklik yapılmadan önce bu kodun ne kadarının aynı anda anlaşılması gerektiğidir. Her yeni sayfanın merkezi bir dosyaya eklendiği bir proje bu duvara erken çarpar: Sonunda hiçbir oturum, başka bir şeyi bozmadan bir şeyi değiştirecek kadar bilgiyi bünyesinde tutamaz.',
    },
    {
      kind: 'p',
      text: 'Buradaki yapı tam olarak buna karşı seçilmiştir. **Her varlık kendi klasörüne sahiptir** — sayfaları, verileri, kelimeleri, özel bileşenleri. Klasörü silin ve başka hiçbir yerde hiçbir şey yetim kalmaz.',
    },
    {
      kind: 'list',
      items: [
        'Varlıklar eklendikçe ortak katman büyümez. Bir şey yalnızca iki şey gerçekten kullandığında ortak bir yere yükselir ve bu hamle bir alışkanlık değil, bilinçli bir eylemdir.',
        'İzinler, birinin güncellemesini hatırlaması gereken bir kayıt defterinde değil, uygulandıkları yerde bildirilir.',
        'Rota grupları iki tür sayfayı diskte görünür kılar: Bir tarafta kamuya açık içerik, diğer tarafta rolle sınırlandırılmış ekranlar. İkisinde de olmayan bir klasör cevapsız bir sorudur ve bir kontrol bunu yüksek sesle söyler.',
      ],
    },
    {
      kind: 'p',
      text: 'Sonuç asıl noktadır: Bir varlıkta değişiklik yapmak tek bir klasörü okumayı gerektirir. Milyonlarca satır, kimse onları zihninde tuttuğu için değil, hiçbir tekil değişikliğin buna asla ihtiyaç duymaması sayesinde çalışılabilir kalır.',
    },
    {
      kind: 'p',
      text: 'Başlangıç paketi (starter), başa uygulanan aynı fikirdir. Sunulan şey boş bir depo değil, her desenin çalışan bir örneğidir — bir sayfa, bir gönderi, bir katalog, özel bir ekran, bir iletişim kutusu, bir dil hücresi. Yeni bir sayfa, çalışan bir sayfa kopyalanarak yapılır, böylece yapı disiplin yerine yapım gereği yayılır.',
    },

    { kind: 'h2', text: 'Ajanın uyduğu belgeler' },
    {
      kind: 'p',
      text: 'Kodlama ajanı her oturuma bir önceki oturuma dair hiçbir hafızası olmadan başlar. Ayakta kalan şey projenin içinde yazılıdır ve her oturumun başında okunur. Bu derlem, portlar kadar mimarinin bir parçasıdır — ikinci oturumu da birincisi kadar yetkin kılan şey budur.',
    },
    {
      kind: 'table',
      headers: ['Belge', 'Ne işe yarar'],
      rows: [
        ['Kullanım senaryoları', 'Ürünün NE İÇİN olduğu, senaryo başına bir dosya: Kimin geldiği, onları neyin getirdiği, işleri bittiğinde neyin doğru olması gerektiği. Onaylanmış senaryo yoksa inşa etmek de yoktur — ajanın tahmin etmek yerine durup sorması gerekir.'],
        ['Geliştirme adımları', 'İşin kendisi, dosyalar halinde. Bir adım çalıştırılmadan önce açılır ve eksiksiz bir raporla tamamlananlar klasörüne taşınır. Kapanan bir oturum hiçbir şey kaybetmez; soğuk bir oturum dosyalardan devam eder.'],
        ['Test etme', 'Bir adımın bittiğinin nasıl kanıtlandığı: İki farklı düzlemden iki bağımsız kanıt, açıkça yazılmış. Başarılı bir derleme (green build) asla bunlardan biri değildir — özelliğin çalışıp çalışmadığına bakılmaksızın derleme günlüğü aynı görünür.'],
        ['Anti-desenler', 'Burada zaten zamana mal olmuş yaklaşımlar, her biri başarısızlık mekanizmasıyla birlikte. Kendi kendine gelişir: Ajan, tıkandığı noktayı anladığı an bunu ekler.'],
        ['Dersler', 'Tercihleriniz ve bir kez bir şeyi yanlış yapmaktan kazanılan alışkanlıklar. Bir ders ile ajanın varsayılanı çeliştiğinde, ders kazanır — vardır çünkü varsayılan burada zaten başarısız olmuştur.'],
        ['Tasarım', 'Sayfaların nasıl göründüğü, sizin tarafınızdan kararlaştırılır ve uyulur. Verilmiştir, gelişmez.'],
      ],
    },
    {
      kind: 'p',
      text: 'Bunlardan ikisi yön konusunda açıklanmayı hak ediyor. **Anti-desenler ve dersler ajan tarafından yazılır**; tasarım belgesi ise sizin tarafınızdan yazılır. Fark bilinçlidir: Bir ajan öğrendiklerini kaydedebilir ancak ürünün nasıl görünmesi gerektiğine karar veremez.',
    },
    {
      kind: 'note',
      text: 'Kullanım senaryoları dosyalardan bir hizmete taşınıyor. Onları üreten konuşma zaten kontrol panelinde yaşıyor; ardından bir veritabanı tarafından desteklenen bir araç arayüzünün arkasına geçecekler, böylece ajan bir klasörü okumak yerine ihtiyaç duyduğu senaryoları isteyecek. Kural depolamayla değişmez — onaylanmış senaryo yoksa inşa etmek de yok. Değişen şey, senaryoların ajanın açmayı hatırlaması gereken bir belge olmaktan çıkmasıdır.',
    },

    { kind: 'h2', text: 'Tek bir sunucuda birçok ürün' },
    {
      kind: 'p',
      text: 'Bir senaryonun bir şeye ait olması gerekir. Bu üründe bir **ürüne** aittir — ve bir sunucu bunlardan birkaçını taşır: Bugün bir açılış sayfası (landing page), haftaya planlanmış bir izleyici (watcher), ardından şirket beyni.',
    },
    {
      kind: 'p',
      text: 'İtiraz haklıdır ve cevaptan önce ifade edilmeye değerdir: **Bir web sitesi normalde tek bir üründür.** Bir şirket için profesyonel bir üretim sistemi inşa ediyorsanız bu doğrudur ve buradaki hiçbir şey buna karşı çıkmaz — bir sunucuya tek bir ürün koyun ve bu bölümün geri kalanı size hiçbir şeye mal olmaz.',
    },
    {
      kind: 'p',
      text: 'Ancak insanların inşa ettiği tek şey artık bu değil. Bir kişinin ihtiyaç duyduğu şeylerin giderek daha fazlası kendi verimliliği için küçük bir hizmettir: Belirli bir programa göre çalışan ve nelerin değiştiğini bildiren bir şey, anahtar kelime yerine yargıya göre arama yapan bir şey, satış, pazarlama veya operasyonlarda tekrarlayan bir görevi halleden bir şey. Bunların her biri kendi sunucusunu, kendi alan adını ve kendi faturasını hak edemeyecek kadar küçüktür — ve birlikte bir sistem oluştururlar.',
    },
    {
      kind: 'p',
      text: 'Bu nedenle çalışma birimi site değil, üründür. Bir ürünü kendi sayfasına veya birkaç sayfasına gruplamak, bir kodlama ajanın sormadan bunlardan hangisini değiştirdiğini bilmesini sağlayan şeydir.',
    },

    { kind: 'h3', text: 'Neden sadece proje demiyoruz' },
    {
      kind: 'p',
      text: 'Çünkü proje bir yer değildir. Adresi, klasörü ve tabloları yoktur, dolayısıyla ona ekli bir senaryo yürütülemez — ajan hala işin nereye gittiğini tahmin etmek zorundadır. Bir ürünün her üçü de vardır ve bütün fark budur: Bir ürüne bağlı bir senaryo, inşa edilebilir bir talimattır.',
    },
    {
      kind: 'p',
      text: 'Bir ürün dört köke sahiptir ve bunların hiçbiri elle yapılandırılmaz — dördü de onun kaydından **türetilir**:',
    },
    {
      kind: 'table',
      headers: ['Kök', 'Türetildiği yer'],
      rows: [
        ['Sayfaları', 'Adresi — bu çerçevede bir klasör adı URL segmentinin KENDİSİDİR'],
        ['Mantığı', 'Kalıcı kimliği (id)'],
        ['Tabloları', 'İsim ön eki olarak kalıcı kimliği (id)'],
        ['Senaryoları', 'Kalıcı kimliği (id)'],
      ],
    },
    {
      kind: 'p',
      text: 'Bir senaryo üzerinde çalışan ajan bu dört kökün içine yazar ve başka hiçbir yere yazmaz. Paylaşılan kod paylaşılan bir kökte yaşar ve bir şeyi oraya taşımak adımda belirtilen bilinçli bir eylemdir — bir bileşen için komşu bir ürüne erişmek, bu kuralın durdurmak için var olduğu hamlenin kendisidir, çünkü bir sahibin değişikliği haftalar sonra başka bir ürünü sessizce bu şekilde bozar.',
    },
    {
      kind: 'p',
      text: 'Kimlik (id) kasıtlı olarak anlamsızdır — p1, p2 — ve asla değişmez. Başlıktan veya yapıdan türetilemez, çünkü her ikisini de değiştireceksiniz ve yollar id’ye bağlıdır. Bu durum kuralın yazıldığı gün kanıtlandı: id’si «store» yazan bir ürünün şirket beyni olduğu ortaya çıktı.',
    },

    { kind: 'h3', text: 'Her ürünün bir sayfası yoktur' },
    {
      kind: 'p',
      text: 'Bir ürün üç yüzeyden birini ilan eder ve varsayılan her zaman kapalıya doğru eğilimlidir:',
    },
    {
      kind: 'list',
      items: [
        '**Kamuya açık (Public)** — bir adresi vardır ve ziyaretçiler ona ulaşır.',
        '**Özel (Private)** — kontrol panelinizde bir sekme olarak yaşar ve dış dünyanın içeri girme yolu yoktur.',
        '**Ekransız (Headless)** — hiçbir ekranı yoktur: Kanallar üzerinden ve bir programa göre çalışır; onunla Telegram’da veya raporunda karşılaşırsınız.',
      ],
    },
    {
      kind: 'p',
      text: 'Bir ürün aynı zamanda bir durum (status) taşır — tanımlanıyor, inşa ediliyor, canlı (live). Onu canlıya taşımak yayınlar ve bu bir ayardır: Hiçbir şey yeniden derlenmez ve hiçbir şey dağıtılmaz.',
    },

    { kind: 'h3', text: 'Uygulamada bunun neye benzediği' },
    {
      kind: 'p',
      text: 'Tek sunucusu olan bir danışmanı ele alalım. İlk ürünü bir açılış sayfasıdır: Kamuya açık, kök dizinde, tek bir hedef — bir talep almak. Senaryoları kimin geldiğini ve ayrıldıklarında neyin doğru olması gerektiğini söyler.',
    },
    {
      kind: 'p',
      text: 'İkinci ürünü daha sonra gelir ve sunucu dışında ilkiyle hiçbir şey paylaşmaz. Başlangıçta açılış sayfasından gelen talepler doğrudan mesajlaşma uygulamasına düşüyordu — haftada beş tane olduğu sürece bu yetiyordu. Sonra otuz oldu ve kimin yazdığının, ona ne yanıt verildiğinin ve işin nasıl bittiğinin görüldüğü bir yer gerekti: kendi talep işleme sistemi. Girişin arkasında durur; kendi sayfaları, kendi tabloları ve kendi rolleri vardır, senaryoları ise bir yabancının ilk ziyaretini değil, müşteriyle çalışmayı anlatır.',
    },
    {
      kind: 'p',
      text: 'Her ikisi de tek bir sunucuda yaşar ve hiçbiri diğerine sessizce zarar veremez: Ayrı sayfalar, ayrı mantık, ayrı tablolar, ayrı senaryolar. Ajan bilgi alma formunun ifadesini değiştirmesini istediğinde, talep sisteminden hiçbir şey kapsamda değildir — ajanın dikkatli olmasından değil, sınır ikisinden biri inşa edilmeden önce kararlaştırıldığı için. Daha sonra yanlarına üçüncüsü ve dördüncüsü gelir — gönderiler, raporlar, depo — ve kural değişmez: tek sunucu, ayrı ürünler.',
    },
    {
      kind: 'note',
      text: 'Plan ve gerçek durum bilerek ayrı tutulur. Bir ürünün sahip olması GEREKEN sayfalar yazılır; gerçekten SAHİP OLDUĞU sayfalar ise klasörler taranarak sayılır, asla saklanmaz. Mevcut olanların elle yazılmış bir listesi ilk haftada gerçeklikten uzaklaşır — ajan bir sayfa inşa eder ve listeyi unutur. İkisi arasındaki fark "hala neyin eksik olduğunun" cevabıdır ve sadece bir yarısı sahtelenemediği için güvenilirdir.',
    },
  ],
}
import type { BlogOverride } from '../../_lib/types'

// Türkçe çeviri. Roma Armstrong'un kişisel yazısı — düşünceli, doğrudan,
// ilham verici üslubunu koru. Zorunlu kök bağlantı "Agentic Engineering
// Infrastructure" (çevrilmeyen terim) → /tr, "Fractera nedir" bölümünde.
export const tr: BlogOverride = {
  title: 'Trilyon Dolarlık Fırsat Yandaki Kuaför Salonu',
  subtitle:
    'Elon Musk uzaydan, yapay zekadan ve arabalardan bahsetti. Aklımda kalan cümle daha basitti: dünyadaki çoğu işletmenin hâlâ bir API’si yok. İşte bu yüzden bulduğum niş.',
  description:
    'Yapay zekada yakın vadede en büyük paranın neden bir unicorn şirkette değil — yandaki kuaför salonunda, klinikte, diş hekimliğinde olduğu. Randevuya gelmeme sorunu, sitesi ve CRM’i olmayan işletmeler ve self-hosted bir çalışma alanının neredeyse herkesin önce bir yığın kurmadan bunları otomatikleştirmesine nasıl izin verdiği.',
  excerpt:
    'Elon Musk, çoğu işletmenin hâlâ bir API’si olmadığını söyledi — telefonla, hatta bazıları onsuz bile çalışıyor. Bu fikrin peşinden düzinelerce toplantı yaptım ve göz önünde saklanan bir niş buldum: yandaki kuaför salonu, klinik, diş hekimliği.',
  blocks: [
    {
      kind: 'p',
      text:
        'Bu biraz alışılmadık bir yazı, çünkü başka biriyle başlıyor. Yukarıdaki Elon Musk röportajı dikkatimi çekti — uzaydan, yapay zekadan, arabalardan bahsetti. Ama beni en çok ilham verdiği an sessiz bir andı. Modern dünyanın hissettirdiğinin aksine — sanki her şey zaten icat edilmiş, her site kurulmuş, her uygulama yayınlanmış, her iş süreci otomatikleştirilmiş gibi — dünyadaki işletmelerin ezici çoğunluğunun bir API’si bile olmadığını söyledi. Telefonla çalışıyorlar. Bazıları onsuz bile çalışıyor.',
    },
    {
      kind: 'quote',
      text:
        'Yapay zeka, zaten kullandıkları dış kaynaklı müşteri hizmetleri şirketine verilen her ne ise onu alıp, zaten kullandıkları uygulamalarla müşteri hizmeti yapabilirse, müşteri hizmetlerinde muazzam bir ilerleme kaydedebilirsin — bu da bence dünya ekonomisinin yaklaşık %1’i falan. Toplamda müşteri hizmetleri için neredeyse bir trilyon dolar.',
      cite: 'Elon Musk · Dwarkesh Patel röportajı, Şubat 2026',
    },
    {
      kind: 'p',
      text:
        'Bunu bir inşacının gözüyle tekrar oku. O trilyon başka bir sosyal ağda ya da başka bir yapay zeka kabuğunda yaşamıyor — hiç dijitalleşmemiş sıradan işletmelerin içinde yaşıyor. Ve engel hiçbir zaman fikir değildi; inşa etmekti. Bir ekip işe almak, altyapı kurmak, bir bulut hizmetleri yığını için ay be ay ödeme yapmak. İşte bu engeli tam olarak self-hosted bir çalışma alanı ortadan kaldırıyor — aklımda kalan roketler değil, bu sessiz cümle oldu.',
    },

    { kind: 'h2', text: 'Herkes kod yazmayı öğrendi. Sokak aynı görünüyor.' },
    {
      kind: 'p',
      text:
        'Bir sürü ortakla konuşarak iki senaryo görmeye devam ediyorum. Bir yanda, bir geliştirici seli — hatta hiç geliştirici olmamış insanlar bile, eskiden pazarlamacı ya da içerik yöneticisi olanlar — tek bir yılda birdenbire programlamayı öğrendi. Herkes inşa etmeye başladı. Bir sürü proje var ve birçoğu gerçekten ilginç. Peki gerçek dünyada? Gerçek dünyada her şey tıpatıp aynı.',
    },
    {
      kind: 'p',
      text:
        'Yani anlaşılan bazılarımız kendimizi memnun etmenin harika bir yolunu bulduk — yeni bilginin dopamin patlaması. Ama artık bundan para kazanmanın da zamanı geldi. Peki odağını nereye kaydırıyorsun?',
    },
    {
      kind: 'founder',
      text:
        'Sorun şu: geleceği tahmin edemiyoruz. Özellikle şimdi, pazar ve teknoloji olağanüstü bir hızla değişmeye başlamışken. Değişime uyum sağlamak, stratejiyi değiştirmenin ıstırap verici bir sürecidir.',
    },

    { kind: 'h2', text: 'Cevabı aramaya çıktım. Bir kuaför salonu buldum.' },
    {
      kind: 'p',
      text:
        'Bu videoyu ayrıntılı olarak inceledikten ve bu sorunun cevabını doğrulamak için birkaç düzine toplantı yaptıktan sonra, çok ilginç bir iş nişi buldum: güzellik salonları ve cerrahi olmayan kozmetoloji, tıp merkezleri, diş hekimliği. Bolca otomasyon ve CRM sistemine rağmen, şaşırtıcı derecede sık bir sorunla karşılaşıyorlar: bir müşteri bir talep bırakıyor, bir randevu ayırtıyor — ve sonra gelmiyor. Yönetici onu aradığında — genellikle randevunun başlaması gereken saatte — müşteriler sık sık şöyle cevap veriyor: "aa, unuttuk. Neden bize hatırlatmadınız?"',
    },
    {
      kind: 'p',
      text:
        'Elbette kurabileceğin bir sürü hazır çözüm var. Ama hiçbirini hiç edinmemiş daha da çok müşteri var — ve bunların çoğunun sitesi yok, birçoğunun CRM’i bile yok.',
    },

    { kind: 'h2', text: 'Böyle bir çalışma alanı tam da bunun için var.' },
    {
      kind: 'p',
      text:
        '[%SITE%](/tr), tam olarak böyle senaryolar için inşa edilmiş, self-hosted bir ajanik mühendislik çalışma alanı. Böyle bir işletmenin ayrı ayrı satın almak zorunda kalacağı parçalarla birlikte geliyor: kendi veritabanı ve tabloları, dosya depolama, metne dönüştürülmüş ses, bir müşteriye mesajlaşma uygulamasından ulaşmak için bir kanal, rollerle yetkilendirme ve bir arama motorunun gerçekten okuyabileceği herkese açık bir site. Bir işletme sahibi burada istediği kadar fikre sahip olabilir — parçalar zaten rafta.',
    },
    {
      kind: 'p',
      text:
        'Avantajı şu: daha önce, bu fikirleri hayata geçirmek bir ürün ekibiyle inanılmaz uzun süre çalışmak, sonra programcı işe almak, sonra her şeyin nasıl çalıştığını sonsuza kadar düşünmek — ya da kendi ihtiyaçların için pahalı hizmetler satın almak anlamına geliyordu. Şimdi tüm bunlar basit. Ajanik mühendislik sayesinde, neredeyse herkes bir telefon alıp işini nasıl optimize etmek istediğini anlatabilir ve bunu ya kendisi ya da bunu biraz da olsa anlayan birinin yardımıyla yapabilir.',
    },
    {
      kind: 'p',
      text:
        'Ayrıca seni hangi hizmetler için ödeme yapman gerektiğini hatırlamak zorunda olmaktan da kurtarır. Düzenli ödemelere dönüşen ve maliyetlerinin aslan payını oluşturan çoğu bulut hizmeti — bir veritabanı, depolama, bir CRM aboneliği — artık kendi sunucunda çalışan kendi uygulamanın sıradan özellikleri. Ve günlük değişiklikler bir dağıtım bile değil: isim, metinler, görseller ve diller bir kontrol panelinde düzenlenir ve yeniden derleme olmadan uygulanır, kod ise sana ait bir depoda yaşar.',
    },

    { kind: 'h2', text: 'Birçoktan biri. Onları her gün bulabilirsin.' },
    {
      kind: 'p',
      text:
        'Yukarıdaki örnek birçoktan biri. Bunun gibi vakaları gerçekten her gün bulabilir ve bunları hayata geçirerek para kazanabilirsin — ya da yeni fikirleri hayata geçirmeyi kendi işinin içine de ekleyebilirsin, çünkü artık bu neredeyse bedava. Daha önce hiç böyle değildi.',
    },
    {
      kind: 'p',
      text:
        'Ve bir unicorn girişim için yeni bir niş bulmak neredeyse imkânsız gibi görünse de — belki de bunu düşünmeye değmez. Bir unicorn inşa etmeyi hayal etmek yerine, yandaki kuaför salonunu, ya da güzellik salonunu, ya da oto tamircisini basitçe otomatikleştirebilirsin. Zaten uzun zamandır iletişimde olduğun herkesi. Zaten sana güvenen herkesi. Belki de denemenin zamanı gelmiştir?',
    },
  ],
  faq: [
    {
      q: 'Bu en çok hangi tür işletme için uygun?',
      a: 'Randevuları ve tekrar eden müşterileri olan yerel hizmet işletmeleri — kuaför salonları, cerrahi olmayan kozmetoloji, klinikler, diş hekimliği, oto servisi — özellikle sitesi ya da CRM’i olmayan ve sürekli tekrarlayan bir randevuya gelmeme sorunu yaşayanlar.',
    },
    {
      q: 'Veritabanı, depolama, CRM aboneliği için ayrıca ödeme yapıyor muyum?',
      a: 'Hayır. Bunlar kendi sunucundaki kendi uygulamanın sıradan, yerleşik parçaları, her ay faturalandırılan üçüncü taraf abonelikler değil. Ödediğin şey sunucunun kendisi.',
    },
    {
      q: 'Geliştirici olmam gerekiyor mu?',
      a: 'Bir işletmenin en sık değiştirdiği şeyler için hayır: isimler, metinler, fiyatlar, görseller ve diller kontrol panelinde düzenlenir ve yeniden derleme olmadan uygulanır. Yeni bir şey inşa etmek, senin deponda çalışan bir kodlama ajanının işi — ya senin, ya da bunu biraz da olsa anlayan birinin. Sunucu, yapay zeka modeli ve alan adı senin için zaten bağlanmış durumda.',
    },
  ],
}

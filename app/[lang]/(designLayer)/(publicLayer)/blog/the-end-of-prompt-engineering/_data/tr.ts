import type { BlogOverride } from '../../_lib/types'

// Türkçe çeviri. Yazarın üslubu: doğrudan, akademik olmayan, okuyucuya
// hitap eden bir ton.
// Ürün terimleri ve özel isimler çevrilmez (Claude Code, Anthropic, CI, LLM).
// Diyagramlar metinle birlikte çevrildi: Türkçe bir yazının içinde İngilizce
// bir diyagram, yarım kalmış bir çeviri gibi okunur.

const POST_1_LINEAR = `prompt yazarsın  ─▶  yapay zeka kod yazar  ─▶  hatayı bulursun  ─▶  promptu düzeltirsin  ─┐
     ▲                                                                          │
     └─────────────────────────  yine elle  ◀─────────────────────────────┘`

const POST_1_LOOP = `hedefi belirlersin
     │
     ▼
yapay zeka kod yazar  ─▶  CI tüm kontrolleri çalıştırır  ─▶  yeşil mi?  ─▶  ✦ yayınlandı
     ▲                      │
     │                      ▼  (kırmızı)
     └──  yapay zeka günlükleri okur ve kendini yeniden yönlendirir`

export const tr: BlogOverride = {
  title: 'Prompt Mühendisliği Öldü. Yaşasın Döngü Mühendisliği.',
  subtitle:
    'Anthropic’te Claude Code’un başındaki isim az önce "yapay zeka fısıldayıcısı" çağının sonunu nasıl ilan etti — ve sırada ne var.',
  description:
    'Anthropic’te Claude Code’a liderlik eden Boris Cherny, artık Claude’a prompt yazmadığını, döngüler yazdığını söylüyor. Prompt mühendisliğinin ölümüne ve döngü mühendisliğinin yükselişine dair bir bakış: ajanik yapay zeka iş akışları, kendi kendini düzelten özerk ajanlar, hakemin neden promptdan daha önemli olduğu ve aynı döngünün sana ait bir çalışma alanına nasıl bağlandığı — depoda makine tarafından denetlenen kapılar, oturumdan daha uzun yaşayan bir hafıza ve inşa edip geri alabilen bir kontrol paneli.',
  excerpt:
    'Anthropic’te Claude Code’a liderlik eden mühendis, artık modele prompt yazmadığını — onun yerine prompt yazan döngüler yazdığını itiraf etti. İşte bunun "yapay zeka fısıldayıcısı" çağını neden bitirdiği ve bunu nasıl üretim mimarisine dönüştürdüğümüz.',
  heroCaption: 'Bunu başlatan LinkedIn gönderisi — Boris Cherny, prompt değil döngü yazmak üzerine.',
  blocks: [
    { kind: 'h2', text: 'Yanılsamayı paramparça eden alıntı' },
    {
      kind: 'p',
      text: 'Birkaç gün önce, **Anthropic**’te **Claude Code**’un geliştirilmesine liderlik eden mühendis **Boris Cherny**’den tek bir alıntı, yazılım topluluğunu sessizce sarstı.',
    },
    {
      kind: 'p',
      text: 'Halka açık bir panelde Cherny, dünyanın en gelişmiş kodlama yapay zekasını inşa eden insanların kendi modelleriyle gerçekte nasıl çalıştığının perdesini araladı. Söyledikleri yalnızca statükoya meydan okumakla kalmadı — yeni doğmakta olan koca bir disiplini geçersiz ilan etti:',
    },
    {
      kind: 'quote',
      text: 'Artık Claude’a prompt yazmıyorum. Claude’a prompt veren ve ne yapılacağını çözen döngüler çalıştırıyorum. Benim işim döngüler yazmak.',
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: 'Bunu biraz özümse.' },
    {
      kind: 'p',
      text: 'Dünyanın en iyi geliştirici modelinin direksiyonunda iki eliyle duran adam, sana ellerini direksiyondan çektiğini söylüyor. Bir sohbet penceresinde oturup mükemmel talimat paragrafını işlemiyor. Yapay zekayı kendisiyle konuşmaya, kendi hatalarını değerlendirmeye ve bunları kapalı, özerk bir devre içinde düzeltmeye zorlayan kod yazıyor. Modeli yönlendiren makineyi inşa ediyor — sonra da onu sürmesine izin veriyor.',
    },
    {
      kind: 'p',
      text: 'Hâlâ günlerini bir LLM’den doğru kod bloğunu koparmak için promptları inceden inceye ayarlamaya harcıyorsan, mesajı acımasızca net: **artık var olmayan bir dünyayı optimize ediyorsun.**',
    },

    { kind: 'h2', text: 'Paradigma değişimi: mikro yönetimden sistem mimarisine' },
    {
      kind: 'p',
      text: 'Bunun neden yer kabuğunu sarsan bir değişim olduğunu görmek için, üretken yapay zekayla ilişkimizin sadece birkaç yılda nasıl evrildiğine bak.',
    },
    { kind: 'h3', text: 'Aşama 1 — Doğrusal prompt (insan darboğazı)' },
    {
      kind: 'p',
      text: 'Yakın zamana kadar tüm sektör **prompt mühendisliği** ile saplantılıydı. LLM’lere parlak ama kolayca dikkati dağılan stajyerler gibi davranıyorduk. İş akışı doğrusal, kırılgan ve tamamen elle yürütülüyordu:',
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: 'Bu paradigmada **darboğaz insandır.** Bir prompt yazarsın, çıktıyı okursun, bir sözdizimi hatası fark edersin, bunu sohbete geri yapıştırırsın ve modelin beş adım sonra bağlamı unutmamış olmasını umarsın. Verimli hissettirir. Aslında yorucu, ölçeklenemeyen bir mikro yönetimdir — ve sen uyurken kesinlikle çalışamaz.',
    },
    { kind: 'h3', text: 'Aşama 2 — Döngü mühendisliği (özerk devre)' },
    {
      kind: 'p',
      text: 'Cherny’nin anlattığı şey **döngü mühendisliği** — insanın yürütme döngüsünden tamamen çıktığı ajanik iş akışları. Arabayı sürmeyi bırakırsın. Pisti inşa edersin ve makinenin turları atmasına izin verirsin.',
    },
    {
      kind: 'p',
      text: 'Bir problemi çözmek için prompt yazmak yerine, yapay zekayı otomatik bir yürütme ve doğrulama döngüsünün içine gömen programatik bir **döngü** yazarsın:',
    },
    {
      kind: 'olist',
      items: [
        '**Hedef.** Bir insan tek bir üst düzey amaç belirler — "bu API uç noktasını oluştur ve testlerde %98 kapsama ulaş."',
        '**Eylem.** Yapay zeka kodun ilk taslağını üretir.',
        '**Doğrulama.** Derleyiciler, linter’lar, birim testleri, senin CI’ın gibi otomatik bir ortam kodu çalıştırır ve her hatayı yakalar.',
        '**Kendi kendini düzeltme.** Bir başarısızlıkta sistem yığın izini yakalar, bunu yapay zekaya yeni bir talimat olarak geri besler ve tekrar denemesini emreder.',
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: 'Döngü makine hızında çalışır, onlarca yinelemeyi art arda işler, doğrulama kriterleri karşılanana kadar kendini düzeltir ve kendini iyileştirir. Tek bir takip mesajı bile yazmadın. Promptları sen yazmadın — pisti sen inşa ettin, her turu model tek başına attı.',
    },

    { kind: 'h2', text: 'Asıl beceri kod yazmak değil. Hakemi yazmak.' },
    {
      kind: 'p',
      text: 'İşte neredeyse herkesin kaçırdığı kısım — ve bütün oyun bu. Bir döngünün zor kısmı kodu üretmek **değildir.** Modeller bunda zaten ürkütücü derecede iyi. Zor olan kısım, **kodun iyi olup olmadığına karar veren şeydir.**',
    },
    {
      kind: 'p',
      text: 'Döngüye güçlü, acımasız bir doğrulayıcı ver — gerçek testler, statik analiz, yalan söylemeyi reddeden bir derleyici — ve gerçekten çalışan bir şeye yakınsar. Zayıf bir tane ver, ve aynı döngü seve seve kendinden emin, güzelce biçimlendirilmiş, sonu gelmeyen bir çöp nehri üretir; anlamsız yeşil bir onay işaretine varana kadar halüsinasyon görür.',
    },
    {
      kind: 'p',
      text: 'Yani önümüzdeki on yılın becerisi prompt zanaati değil. **Doğrulamayı tasarlamak** — bir yapay zekanın uçurumdan düşmeden güvenle kendisiyle konuşmasına izin veren, kurşun geçirmez doğrulama sistemleri. Bu, doğru kelimeleri bulmaktan çok daha zor, çok daha nadir ve çok daha değerli bir mühendislik türü.',
    },

    { kind: 'h2', text: 'Felsefeden üretime: döngüyü nasıl tasarladık' },
    {
      kind: 'p',
      text: 'Teknoloji dünyasının geri kalanı Cherny’nin sözlerini sosyal medyada didik didik ederken, asıl mücadele o kadar gösterişli değil: **Anthropic’in dahili laboratuvarlarının dışında, üretimde gerçekten çalışan döngü mühendisliği altyapısını nasıl kurarsın?**',
    },
    {
      kind: 'p',
      text: 'Tek bir modelin etrafında bir döngü kapatırsan gerçek dünyanın duvarlarına hızla çarparsın: bağlam penceresinin bozulması, halüsinasyona dayalı ölüm sarmalları ve bir proje boyunca hiçbir hafıza olmaması. [%SITE%](/tr)’de geçen yılı Cherny’nin felsefesini bir kehanet değil bir **mimari şema** olarak ele alarak geçirdik — ve bu çalışma alanının üzerinde çalıştığı döngüyü inşa ettik.',
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: 'Geliştirme döngüsü: sahip bir hedef belirler, ajan depoyu düzenler, makine kapıları onu doğrular, başarısızlıklar ajana yeni talimat olarak geri döner ve kontrol paneli inşa eder, günlüğe kaydeder ve geri alabilir',
      caption: 'Döngü gerçekte nasıl bağlanmışsa öyle: senin deponda bir ajan, yalan söylemeyi reddeden kapılar ve devreyi kapatan bir panel.',
    },
    { kind: 'h3', text: 'Üretim düzeyinde bir döngünün anatomisi' },
    {
      kind: 'p',
      text: 'Döngüleri gerçek yazılım için uygulanabilir kılmak için, modele hayranlıkla bakmayı bırakıp onun etrafındaki üç gösterişsiz şeyi inşa etmen gerekir — hakem, hafıza ve teslim eden el:',
    },
    {
      kind: 'list',
      items: [
        '**Tatlı sözlerle ikna edilemeyen bir doğrulayıcı.** Hakem, fikri olan ikinci bir model değildir; derlemeyi başarısız kılan bir dizi betiktir. Dil sinyalleri her herkese açık sayfada var mı? Her yazının bir yapay zeka okuyucusunun ihtiyaç duyduğu markdown ikizi var mı? Kimsenin depoya göndermediği bir görsele referans veriliyor mu? Her kontrol, tam olarak o kusur bir kez üretime çıktığı için vardır ve her biri bir paragrafla değil bir çıkış koduyla yanıt verir.',
        '**Oturumdan daha uzun yaşayan hafıza.** Amnezi etkisi gerçektir: inatçı bir hatanın etrafında on beş kez döngü kur ve ajan mimariyi kaybeder. Burada hafıza çevrimdışı olabilecek bir servis değildir — kodun yanında, depoyla birlikte seyahat eden dosyalardır: çalışma talimatı, sahibin bir şeyi düzelttiği anda eklenen dersler, anti-örüntülerin listesi, onaylanmış kullanıcı senaryoları. Yeni bir oturum bunları okuyarak başlar, böylece on beşinci yineleme birincinin öğrendiğini bilir.',
        '**Ajana ait olmayan bir kapanış perdesi.** Döngü kontrol panelinde sona erer: projeyi inşa eder, dağıtımların bir günlüğünü tutar ve son çalışan sürüme geri dönebilir. Ayarlar, metinler ve görseller orada hiçbir yeniden derleme olmadan değişir — böylece döngüden asla bir kod sorunu olmayan bir şeyi çözmesi istenmez.',
      ],
    },
    {
      kind: 'p',
      text: 'O listede **olmayana** dikkat et: birbirini denetleyen bir model sürüsü. Bu bizim ilk mimarimizdi ve onu kaldırdık. Orkestrasyon, ajanik bir diyagramın en heyecan verici parçası ve çalışan birinin en az yük taşıyan parçasıdır — zayıf bir hakem ikinci bir görüş eklenerek düzelmez, güçlü bir hakemin ise buna nadiren ihtiyacı olur.',
    },

    { kind: 'h2', text: 'Yazılım mühendisinin yeni iş tanımı' },
    {
      kind: 'p',
      text: 'Kod yazmaktan uzaklaşıyoruz, prompt yazmayı geride bırakıyoruz ve doğrudan **bilişsel boru hatları inşa etmeye** giriyoruz. Zanaat artık talimat değil — talimatın içinde çalıştığı sistem.',
    },
    {
      kind: 'p',
      text: 'Ve bu bedava değil. Döngülerle birlikte iki yeni maliyet geliyor. **Anlama borcu:** bir ajan sahne arkasında bir dosyayı üç yüz kez yazıp yeniden yazdığında, kendi kod tabanına hâkimiyetin sessizce erir — çalışır, sadece artık neden çalıştığından emin değilsindir. Ve **ham hesaplama:** bir döngü, tek bir hatayı yüz sessiz denemede kovalarken tokenlarda gerçek para yakabilir. Bu çağı kazanan mühendisler, maliyet-kalite dengesini faturadaki bir sürpriz olarak değil, bilinçli bir tasarım kararı olarak ele alır.',
    },
    {
      kind: 'cta',
      text: 'Bu site tam olarak o döngülerden biri: okuduğun sayfalar, dil sinyallerini, markdown ikizlerini ve site haritasındaki yerlerini taşımadan bir kapının yayınlamayı reddettiği statik dosyalardır.',
      href: '/tr',
      label: 'Üzerinde çalıştığı çalışma alanını gör',
    },
    {
      kind: 'p',
      text: 'Prompt mühendisliği çağı resmen geride kaldı. Geriye kalan tek soru, Cherny’nin kendisi için zaten yanıtladığı soru: **hâlâ yapay zekanla konuşmaya mı çalışıyorsun — yoksa onun koşmasına izin veren döngüleri mi inşa ediyorsun?**',
    },
    {
      kind: 'note',
      text: 'Kaynak: Guillermo Flor’un Boris Cherny’nin sözlerini gün yüzüne çıkaran, geniş çapta paylaşılan LinkedIn gönderisi. Alıntı, dolaşıma girdiği haliyle yeniden üretilmiştir; mimari ve analiz bize aittir.',
    },
  ],
  faq: [
    {
      q: '"Döngü mühendisliği" nedir ve prompt mühendisliğinin yerini neden alıyor?',
      a: 'Döngü mühendisliği, yapay zekaya prompt veren, çıktısını bir doğrulayıcıdan (testler, CI, bir derleyici) geçiren, başarısızlıkları yeni talimatlar olarak geri besleyen ve sonuç doğru olana kadar bunu tekrarlayan otomatik iş akışları yazmak anlamına gelir. Anthropic’te Claude Code’a liderlik eden Boris Cherny, artık promptları elle işlemediğini söyledi: bunu onun yerine yapan döngüleri yazıyor. Buradaki kilit görüş, darboğazın hiçbir zaman prompt olmadığı — geri bildirim döngüsündeki insan olduğudur.',
    },
    {
      q: 'Geliştirme döngüsü burada, üretimde nasıl bağlanmış?',
      a: 'Bir kodlama ajanı senin kendi deponda, kendi makinende, projenin çalışma talimatı kodun yanında olacak şekilde çalışır. Doğrulayıcı, her derlemede çalışan ve onu başarısız kılan bir dizi kapıdır: her herkese açık sayfada dil sinyalleri, yayınlanan her sayfa için bir markdown ikizi, hiç depoya gönderilmemiş hiçbir görsele referans verilmemesi, hiçbir sözlükte eksik anahtar olmaması. Bir başarısızlık ajana yeni bir talimat olarak geri döner ve döngü tekrarlanır. Kontrol paneli devreyi kapatır — projeyi inşa eder, her dağıtımı günlüğe kaydeder ve son çalışan sürüme geri dönebilir.',
    },
    {
      q: 'Bu döngüyü çalıştırmak için kod yazmam gerekir mi?',
      a: 'Bir sitenin gerçekte değiştirdiği çoğu şey için hayır. İsim, açıklama, görseller, diller, analitik ve ayarların metinleri kontrol panelinde yaşar ve hiçbir yeniden derleme olmadan uygulanır — bu koddan çok veridir. Kod değişiklikleri, ajanın senin deponda yaptığı şeydir; sen onları okur ve onaylarsın, panel sonucu inşa eder. Dürüst sınır şudur: kimse sana asla bir diff’e bakmayacağını vaat etmiyor — sana vaat edilen, derlemeyi hiçbir zaman elle çalıştırmak zorunda kalmayacağın ve bozuk bir sürümün bir tıkla geri alınabileceğidir.',
    },
  ],
}

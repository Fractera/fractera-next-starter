// Слова cookie-баннера — 82 языка, рядом с самим баннером.
//
// 🔒 ПОЧЕМУ ОНИ ЗДЕСЬ, А НЕ В НАСТРОЙКАХ. Настройки панели ПЕРЕОПРЕДЕЛЯЮТ эти
// слова, но не заменяют их: пока владелец ничего не менял, баннер обязан
// заговорить сам. Прежний движок держал тексты вместе со снесёнными страницами
// legal, и после его удаления баннер получал `undefined` — а он делает
// `strings.message.split(…)`, то есть УРОНИЛ БЫ страницу каждому новому
// посетителю. Дефект внесён мною при сносе legal и здесь же закрыт.
//
// 🔒 82 ЯЗЫКА ОБЯЗАТЕЛЬНЫ (правило 4д). Баннер — переиспользуемая часть
// продукта: он есть в каждом проекте, где включён, и появится в любом языке,
// который владелец включит. Согласие на сбор данных, написанное не на языке
// посетителя, юридически бесполезно — это не «непереведённая строка», а
// несостоявшееся согласие.
//
// `{policy}` — место ссылки на страницу политики. Оно обязано быть в каждом
// сообщении: баннер делит текст по нему.

export type BannerStrings = {
  message: string
  policyLinkLabel: string
  accept: string
  reject: string
}

const P = 'Cookie Policy'

const UI: Record<string, BannerStrings> = {
  en: { message: 'We use cookies to run this site and, with your consent, to measure traffic. See our {policy}.', policyLinkLabel: P, accept: 'Accept', reject: 'Reject' },
  fr: { message: 'Nous utilisons des cookies pour faire fonctionner ce site et, avec votre consentement, mesurer l’audience. Consultez notre {policy}.', policyLinkLabel: 'Politique relative aux cookies', accept: 'Accepter', reject: 'Refuser' },
  es: { message: 'Usamos cookies para gestionar este sitio y, con tu consentimiento, medir el tráfico. Consulta nuestra {policy}.', policyLinkLabel: 'Política de cookies', accept: 'Aceptar', reject: 'Rechazar' },
  pt: { message: 'Usamos cookies para operar este site e, com o seu consentimento, medir o tráfego. Consulte a nossa {policy}.', policyLinkLabel: 'Política de Cookies', accept: 'Aceitar', reject: 'Rejeitar' },
  de: { message: 'Wir verwenden Cookies für den Betrieb dieser Website und, mit Ihrer Einwilligung, zur Reichweitenmessung. Siehe unsere {policy}.', policyLinkLabel: 'Cookie-Richtlinie', accept: 'Akzeptieren', reject: 'Ablehnen' },
  it: { message: 'Usiamo i cookie per far funzionare questo sito e, con il tuo consenso, misurare il traffico. Consulta la nostra {policy}.', policyLinkLabel: 'Informativa sui cookie', accept: 'Accetta', reject: 'Rifiuta' },
  nl: { message: 'We gebruiken cookies om deze site te laten werken en, met uw toestemming, om bezoek te meten. Zie ons {policy}.', policyLinkLabel: 'Cookiebeleid', accept: 'Accepteren', reject: 'Weigeren' },
  sv: { message: 'Vi använder cookies för att driva webbplatsen och, med ditt samtycke, mäta trafik. Se vår {policy}.', policyLinkLabel: 'Cookiepolicy', accept: 'Acceptera', reject: 'Avvisa' },
  no: { message: 'Vi bruker informasjonskapsler for å drive nettstedet og, med ditt samtykke, måle trafikk. Se vår {policy}.', policyLinkLabel: 'Retningslinjer for informasjonskapsler', accept: 'Godta', reject: 'Avvis' },
  da: { message: 'Vi bruger cookies til at drive dette websted og, med dit samtykke, måle trafik. Se vores {policy}.', policyLinkLabel: 'Cookiepolitik', accept: 'Accepter', reject: 'Afvis' },
  fi: { message: 'Käytämme evästeitä sivuston toimintaan ja, suostumuksellasi, kävijämäärän mittaamiseen. Katso {policy}.', policyLinkLabel: 'evästekäytäntömme', accept: 'Hyväksy', reject: 'Hylkää' },
  is: { message: 'Við notum vafrakökur til að reka vefinn og, með samþykki þínu, til að mæla umferð. Sjá {policy}.', policyLinkLabel: 'vafrakökustefnu okkar', accept: 'Samþykkja', reject: 'Hafna' },
  el: { message: 'Χρησιμοποιούμε cookies για τη λειτουργία του ιστότοπου και, με τη συγκατάθεσή σας, για τη μέτρηση επισκεψιμότητας. Δείτε την {policy}.', policyLinkLabel: 'Πολιτική cookie', accept: 'Αποδοχή', reject: 'Απόρριψη' },
  pl: { message: 'Używamy plików cookie do działania tej witryny i, za Twoją zgodą, do pomiaru ruchu. Zobacz naszą {policy}.', policyLinkLabel: 'Politykę plików cookie', accept: 'Akceptuj', reject: 'Odrzuć' },
  cs: { message: 'Používáme cookies k provozu webu a, s vaším souhlasem, k měření návštěvnosti. Viz naše {policy}.', policyLinkLabel: 'Zásady cookies', accept: 'Přijmout', reject: 'Odmítnout' },
  sk: { message: 'Používame cookies na prevádzku webu a, s vaším súhlasom, na meranie návštevnosti. Pozrite si naše {policy}.', policyLinkLabel: 'Zásady cookies', accept: 'Prijať', reject: 'Odmietnuť' },
  hu: { message: 'Sütiket használunk az oldal működtetéséhez és — hozzájárulásoddal — a látogatottság méréséhez. Lásd a {policy}.', policyLinkLabel: 'süti szabályzatunkat', accept: 'Elfogadom', reject: 'Elutasítom' },
  ro: { message: 'Folosim cookie-uri pentru funcționarea site-ului și, cu acordul tău, pentru măsurarea traficului. Vezi {policy}.', policyLinkLabel: 'Politica de cookie-uri', accept: 'Accept', reject: 'Refuz' },
  hr: { message: 'Koristimo kolačiće za rad stranice i, uz vaš pristanak, za mjerenje prometa. Pogledajte našu {policy}.', policyLinkLabel: 'Politiku kolačića', accept: 'Prihvati', reject: 'Odbij' },
  sl: { message: 'Piškotke uporabljamo za delovanje strani in, z vašim soglasjem, za merjenje obiska. Glejte našo {policy}.', policyLinkLabel: 'Politiko piškotkov', accept: 'Sprejmi', reject: 'Zavrni' },
  et: { message: 'Kasutame küpsiseid saidi tööks ja teie nõusolekul külastatavuse mõõtmiseks. Vaadake meie {policy}.', policyLinkLabel: 'küpsiste poliitikat', accept: 'Nõustun', reject: 'Keeldun' },
  lv: { message: 'Izmantojam sīkdatnes vietnes darbībai un, ar jūsu piekrišanu, apmeklējuma mērīšanai. Skatiet mūsu {policy}.', policyLinkLabel: 'sīkdatņu politiku', accept: 'Piekrītu', reject: 'Noraidu' },
  lt: { message: 'Naudojame slapukus svetainės veikimui ir, jums sutikus, lankomumui matuoti. Žr. mūsų {policy}.', policyLinkLabel: 'slapukų politiką', accept: 'Sutinku', reject: 'Atmesti' },
  mt: { message: 'Nużaw il-cookies biex inħaddmu s-sit u, bil-kunsens tiegħek, inkejlu t-traffiku. Ara l-{policy}.', policyLinkLabel: 'Politika tal-Cookies', accept: 'Aċċetta', reject: 'Irrifjuta' },
  ca: { message: 'Fem servir galetes per fer funcionar el lloc i, amb el teu consentiment, per mesurar el trànsit. Consulta la nostra {policy}.', policyLinkLabel: 'Política de galetes', accept: 'Accepta', reject: 'Rebutja' },
  gl: { message: 'Usamos cookies para xestionar este sitio e, co teu consentimento, medir o tráfico. Consulta a nosa {policy}.', policyLinkLabel: 'Política de cookies', accept: 'Aceptar', reject: 'Rexeitar' },
  cy: { message: 'Rydym yn defnyddio cwcis i redeg y wefan hon ac, gyda’ch caniatâd, i fesur traffig. Gweler ein {policy}.', policyLinkLabel: 'Polisi Cwcis', accept: 'Derbyn', reject: 'Gwrthod' },
  ga: { message: 'Úsáidimid fianáin chun an suíomh a rith agus, le do thoil, chun trácht a thomhas. Féach ár {policy}.', policyLinkLabel: 'bPolasaí Fianán', accept: 'Glac leis', reject: 'Diúltaigh' },
  eu: { message: 'Cookieak erabiltzen ditugu gunea funtzionatzeko eta, zure baimenarekin, bisitak neurtzeko. Ikusi gure {policy}.', policyLinkLabel: 'Cookie Politika', accept: 'Onartu', reject: 'Baztertu' },
  ru: { message: 'Мы используем файлы cookie для работы сайта и, с вашего согласия, для оценки трафика. См. нашу {policy}.', policyLinkLabel: 'Политику использования файлов cookie', accept: 'Принять', reject: 'Отклонить' },
  uk: { message: 'Ми використовуємо файли cookie для роботи сайту і, за вашою згодою, для оцінки трафіку. Див. нашу {policy}.', policyLinkLabel: 'Політику щодо файлів cookie', accept: 'Прийняти', reject: 'Відхилити' },
  be: { message: 'Мы выкарыстоўваем файлы cookie для працы сайта і, з вашай згоды, для ацэнкі трафіку. Глядзіце нашу {policy}.', policyLinkLabel: 'Палітыку файлаў cookie', accept: 'Прыняць', reject: 'Адхіліць' },
  bg: { message: 'Използваме бисквитки за работата на сайта и, с ваше съгласие, за измерване на трафика. Вижте нашата {policy}.', policyLinkLabel: 'Политика за бисквитки', accept: 'Приемам', reject: 'Отказвам' },
  sr: { message: 'Користимо колачиће за рад сајта и, уз вашу сагласност, за мерење посета. Погледајте нашу {policy}.', policyLinkLabel: 'Политику колачића', accept: 'Прихвати', reject: 'Одбиј' },
  bs: { message: 'Koristimo kolačiće za rad stranice i, uz vašu saglasnost, za mjerenje posjeta. Pogledajte našu {policy}.', policyLinkLabel: 'Politiku kolačića', accept: 'Prihvati', reject: 'Odbij' },
  mk: { message: 'Користиме колачиња за работа на сајтот и, со ваша согласност, за мерење на посетеноста. Видете ја нашата {policy}.', policyLinkLabel: 'Политика за колачиња', accept: 'Прифати', reject: 'Одбиј' },
  sq: { message: 'Përdorim cookie për funksionimin e faqes dhe, me pëlqimin tuaj, për matjen e trafikut. Shihni {policy}.', policyLinkLabel: 'Politikën e cookie-ve', accept: 'Prano', reject: 'Refuzo' },
  kk: { message: 'Сайттың жұмысы үшін және сіздің келісіміңізбен трафикті бағалау үшін cookie файлдарын қолданамыз. {policy} қараңыз.', policyLinkLabel: 'Cookie саясатын', accept: 'Қабылдау', reject: 'Бас тарту' },
  uz: { message: 'Saytning ishlashi va, sizning roziligingiz bilan, trafikni o‘lchash uchun cookie fayllaridan foydalanamiz. {policy} ko‘ring.', policyLinkLabel: 'Cookie siyosatimizni', accept: 'Qabul qilish', reject: 'Rad etish' },
  ky: { message: 'Сайттын иштеши үчүн жана макулдугуңуз менен трафикти өлчөө үчүн cookie колдонобуз. {policy} караңыз.', policyLinkLabel: 'Cookie саясатын', accept: 'Кабыл алуу', reject: 'Четке кагуу' },
  tg: { message: 'Мо барои кори сомона ва бо розигии шумо барои чен кардани трафик cookie истифода мебарем. {policy}-ро бинед.', policyLinkLabel: 'Сиёсати cookie', accept: 'Қабул', reject: 'Рад' },
  tk: { message: 'Saýtyň işlemegi we siziň razylygyňyz bilen trafigi ölçemek üçin cookie ulanýarys. {policy} serediň.', policyLinkLabel: 'Cookie syýasatymyza', accept: 'Kabul et', reject: 'Ret et' },
  az: { message: 'Saytın işləməsi və razılığınızla trafikin ölçülməsi üçün cookie istifadə edirik. {policy} baxın.', policyLinkLabel: 'Cookie siyasətimizə', accept: 'Qəbul et', reject: 'İmtina et' },
  hy: { message: 'Օգտագործում ենք cookie-ներ կայքի աշխատանքի և, ձեր համաձայնությամբ, այցելությունների չափման համար։ Տես մեր {policy}։', policyLinkLabel: 'Cookie-ների քաղաքականությունը', accept: 'Ընդունել', reject: 'Մերժել' },
  ka: { message: 'ვიყენებთ cookie-ს საიტის მუშაობისთვის და, თქვენი თანხმობით, ტრაფიკის გასაზომად. იხილეთ ჩვენი {policy}.', policyLinkLabel: 'Cookie-ს პოლიტიკა', accept: 'დათანხმება', reject: 'უარყოფა' },
  mn: { message: 'Сайтын ажиллагаанд болон таны зөвшөөрлөөр урсгалыг хэмжихэд cookie ашигладаг. Манай {policy}-г үзнэ үү.', policyLinkLabel: 'Cookie бодлого', accept: 'Зөвшөөрөх', reject: 'Татгалзах' },
  ar: { message: 'نستخدم ملفات تعريف الارتباط لتشغيل هذا الموقع، وبموافقتك، لقياس الزيارات. اطلع على {policy}.', policyLinkLabel: 'سياسة ملفات تعريف الارتباط', accept: 'أوافق', reject: 'أرفض' },
  tr: { message: 'Bu siteyi çalıştırmak ve izniniz ile trafiği ölçmek için çerez kullanıyoruz. {policy} bakın.', policyLinkLabel: 'Çerez Politikamıza', accept: 'Kabul et', reject: 'Reddet' },
  he: { message: 'אנו משתמשים בעוגיות להפעלת האתר, ובהסכמתך, למדידת תנועה. ראו את {policy}.', policyLinkLabel: 'מדיניות העוגיות', accept: 'אישור', reject: 'דחייה' },
  fa: { message: 'ما از کوکی‌ها برای اجرای این سایت و، با رضایت شما، برای سنجش ترافیک استفاده می‌کنیم. {policy} را ببینید.', policyLinkLabel: 'سیاست کوکی', accept: 'پذیرفتن', reject: 'رد کردن' },
  ku: { message: 'Em cookie bikar tînin ji bo xebata malperê û, bi razîbûna we, ji bo pîvana seredanan. {policy} bibînin.', policyLinkLabel: 'Polîtîkaya Cookie', accept: 'Qebûl bike', reject: 'Red bike' },
  af: { message: 'Ons gebruik koekies om hierdie werf te bedryf en, met u toestemming, verkeer te meet. Sien ons {policy}.', policyLinkLabel: 'Koekiebeleid', accept: 'Aanvaar', reject: 'Verwerp' },
  sw: { message: 'Tunatumia vidakuzi kuendesha tovuti hii na, kwa idhini yako, kupima trafiki. Angalia {policy} yetu.', policyLinkLabel: 'Sera ya Vidakuzi', accept: 'Kubali', reject: 'Kataa' },
  ha: { message: 'Muna amfani da kuki don gudanar da wannan shafi kuma, da yardarka, don auna zirga-zirga. Duba {policy} namu.', policyLinkLabel: 'Manufar Kuki', accept: 'Karɓa', reject: 'Ƙi' },
  yo: { message: 'A ń lo kúkì láti ṣiṣẹ́ ojú-òpó yìí àti, pẹ̀lú ìyọ̀ǹda rẹ, láti wọn ìjìjàdù. Wo {policy} wa.', policyLinkLabel: 'Ìlànà Kúkì', accept: 'Gbà', reject: 'Kọ̀' },
  ig: { message: 'Anyị na-eji kuki na-eme ka saịtị a rụọ ọrụ, na, site na nkwenye gị, ịtụ okporo ụzọ. Lee {policy} anyị.', policyLinkLabel: 'Iwu Kuki', accept: 'Nabata', reject: 'Jụ' },
  am: { message: 'ይህን ጣቢያ ለማንቀሳቀስ እና በእርስዎ ፈቃድ ትራፊክን ለመለካት ኩኪዎችን እንጠቀማለን። {policy} ይመልከቱ።', policyLinkLabel: 'የኩኪ ፖሊሲያችንን', accept: 'ተቀበል', reject: 'አትቀበል' },
  zu: { message: 'Sisebenzisa amakhukhi ukusebenzisa le sayithi futhi, ngemvume yakho, ukukala ithrafikhi. Bheka {policy} yethu.', policyLinkLabel: 'Inqubomgomo Yamakhukhi', accept: 'Yamukela', reject: 'Yenqaba' },
  xh: { message: 'Sisebenzisa iikhuki ukuqhuba le sayithi kwaye, ngemvume yakho, ukulinganisa ithrafikhi. Jonga {policy} yethu.', policyLinkLabel: 'uMgaqo-nkqubo weeKhuki', accept: 'Yamkela', reject: 'Yala' },
  rw: { message: 'Dukoresha cookie mu gukoresha uru rubuga kandi, ubyemeye, mu gupima abasura. Reba {policy} yacu.', policyLinkLabel: 'Politiki ya Cookie', accept: 'Emera', reject: 'Anga' },
  so: { message: 'Waxaan u isticmaalnaa cookie-yada shaqada goobtan iyo, ogolaanshahaaga, cabbiraadda booqashada. Eeg {policy} keenna.', policyLinkLabel: 'Siyaasadda Cookie-ga', accept: 'Aqbal', reject: 'Diid' },
  zh: { message: '我们使用 Cookie 来运行本网站，并在您同意的情况下用于统计访问量。请参阅我们的{policy}。', policyLinkLabel: 'Cookie 政策', accept: '接受', reject: '拒绝' },
  ja: { message: '当サイトの運営のため、また同意いただいた場合はアクセス測定のために Cookie を使用します。{policy}をご覧ください。', policyLinkLabel: 'Cookie ポリシー', accept: '同意する', reject: '拒否する' },
  ko: { message: '이 사이트 운영과, 동의하시는 경우 트래픽 측정을 위해 쿠키를 사용합니다. {policy}을 확인하세요.', policyLinkLabel: '쿠키 정책', accept: '동의', reject: '거부' },
  hi: { message: 'हम इस साइट को चलाने के लिए और आपकी सहमति से ट्रैफ़िक मापने के लिए कुकीज़ का उपयोग करते हैं। हमारी {policy} देखें।', policyLinkLabel: 'कुकी नीति', accept: 'स्वीकार करें', reject: 'अस्वीकार करें' },
  ur: { message: 'ہم اس سائٹ کو چلانے اور آپ کی رضامندی سے ٹریفک ناپنے کے لیے کوکیز استعمال کرتے ہیں۔ ہماری {policy} دیکھیں۔', policyLinkLabel: 'کوکی پالیسی', accept: 'قبول کریں', reject: 'مسترد کریں' },
  bn: { message: 'আমরা এই সাইট পরিচালনা করতে এবং আপনার সম্মতিতে ট্রাফিক পরিমাপ করতে কুকি ব্যবহার করি। আমাদের {policy} দেখুন।', policyLinkLabel: 'কুকি নীতি', accept: 'গ্রহণ করুন', reject: 'প্রত্যাখ্যান' },
  te: { message: 'ఈ సైట్‌ను నడపడానికి మరియు మీ సమ్మతితో ట్రాఫిక్‌ను కొలవడానికి కుకీలను ఉపయోగిస్తాము. మా {policy} చూడండి.', policyLinkLabel: 'కుకీ విధానం', accept: 'అంగీకరించు', reject: 'తిరస్కరించు' },
  mr: { message: 'ही साइट चालवण्यासाठी आणि तुमच्या संमतीने रहदारी मोजण्यासाठी आम्ही कुकीज वापरतो. आमचे {policy} पहा.', policyLinkLabel: 'कुकी धोरण', accept: 'स्वीकारा', reject: 'नाकारा' },
  kn: { message: 'ಈ ಸೈಟ್ ನಡೆಸಲು ಮತ್ತು ನಿಮ್ಮ ಒಪ್ಪಿಗೆಯೊಂದಿಗೆ ಟ್ರಾಫಿಕ್ ಅಳೆಯಲು ಕುಕೀಗಳನ್ನು ಬಳಸುತ್ತೇವೆ. ನಮ್ಮ {policy} ನೋಡಿ.', policyLinkLabel: 'ಕುಕೀ ನೀತಿ', accept: 'ಸ್ವೀಕರಿಸಿ', reject: 'ನಿರಾಕರಿಸಿ' },
  gu: { message: 'અમે આ સાઇટ ચલાવવા અને તમારી સંમતિથી ટ્રાફિક માપવા કૂકીઝનો ઉપયોગ કરીએ છીએ. અમારી {policy} જુઓ.', policyLinkLabel: 'કૂકી નીતિ', accept: 'સ્વીકારો', reject: 'નકારો' },
  ml: { message: 'ഈ സൈറ്റ് പ്രവർത്തിപ്പിക്കാനും നിങ്ങളുടെ സമ്മതത്തോടെ ട്രാഫിക് അളക്കാനും ഞങ്ങൾ കുക്കികൾ ഉപയോഗിക്കുന്നു. ഞങ്ങളുടെ {policy} കാണുക.', policyLinkLabel: 'കുക്കി നയം', accept: 'സ്വീകരിക്കുക', reject: 'നിരസിക്കുക' },
  ta: { message: 'இந்தத் தளத்தை இயக்கவும், உங்கள் ஒப்புதலுடன் போக்குவரத்தை அளக்கவும் குக்கீகளைப் பயன்படுத்துகிறோம். எங்கள் {policy} காண்க.', policyLinkLabel: 'குக்கீ கொள்கை', accept: 'ஏற்கிறேன்', reject: 'நிராகரி' },
  ne: { message: 'हामी यो साइट सञ्चालन गर्न र तपाईंको सहमतिमा ट्राफिक मापन गर्न कुकीहरू प्रयोग गर्छौं। हाम्रो {policy} हेर्नुहोस्।', policyLinkLabel: 'कुकी नीति', accept: 'स्वीकार गर्नुहोस्', reject: 'अस्वीकार' },
  vi: { message: 'Chúng tôi dùng cookie để vận hành trang web và, khi bạn đồng ý, để đo lưu lượng. Xem {policy} của chúng tôi.', policyLinkLabel: 'Chính sách cookie', accept: 'Chấp nhận', reject: 'Từ chối' },
  th: { message: 'เราใช้คุกกี้เพื่อให้เว็บไซต์ทำงานและ เมื่อคุณยินยอม เพื่อวัดปริมาณการเข้าชม ดู{policy}ของเรา', policyLinkLabel: 'นโยบายคุกกี้', accept: 'ยอมรับ', reject: 'ปฏิเสธ' },
  id: { message: 'Kami memakai cookie untuk menjalankan situs ini dan, dengan persetujuan Anda, mengukur lalu lintas. Lihat {policy} kami.', policyLinkLabel: 'Kebijakan Cookie', accept: 'Terima', reject: 'Tolak' },
  ms: { message: 'Kami menggunakan kuki untuk mengendalikan tapak ini dan, dengan kebenaran anda, mengukur trafik. Lihat {policy} kami.', policyLinkLabel: 'Dasar Kuki', accept: 'Terima', reject: 'Tolak' },
  tl: { message: 'Gumagamit kami ng cookies para patakbuhin ang site na ito at, sa pahintulot mo, sukatin ang trapiko. Tingnan ang aming {policy}.', policyLinkLabel: 'Patakaran sa Cookies', accept: 'Tanggapin', reject: 'Tanggihan' },
  my: { message: 'ဤဆိုက်ကို လည်ပတ်ရန်နှင့် သင့်ခွင့်ပြုချက်ဖြင့် လာရောက်မှုကို တိုင်းတာရန် ကွတ်ကီးများ အသုံးပြုပါသည်။ ကျွန်ုပ်တို့၏ {policy} ကို ကြည့်ပါ။', policyLinkLabel: 'ကွတ်ကီးမူဝါဒ', accept: 'လက်ခံသည်', reject: 'ငြင်းပယ်သည်' },
  km: { message: 'យើងប្រើខូឃីដើម្បីដំណើរការគេហទំព័រនេះ ហើយដោយមានការយល់ព្រមពីអ្នក ដើម្បីវាស់ចរាចរណ៍។ សូមមើល {policy} របស់យើង។', policyLinkLabel: 'គោលការណ៍ខូឃី', accept: 'ព្រមទទួល', reject: 'បដិសេធ' },
  lo: { message: 'ພວກເຮົາໃຊ້ຄຸກກີ້ເພື່ອໃຫ້ເວັບໄຊນີ້ເຮັດວຽກ ແລະ ດ້ວຍການຍິນຍອມຂອງທ່ານ ເພື່ອວັດແທກການເຂົ້າຊົມ. ເບິ່ງ {policy} ຂອງພວກເຮົາ.', policyLinkLabel: 'ນະໂຍບາຍຄຸກກີ້', accept: 'ຍອມຮັບ', reject: 'ປະຕິເສດ' },
}

export function bannerUi(lang: string): BannerStrings {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

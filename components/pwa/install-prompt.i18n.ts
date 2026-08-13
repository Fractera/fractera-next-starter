// Слова предложения установки — 82 языка, рядом с самим предложением.
//
// 🔒 82 ЯЗЫКА ОБЯЗАТЕЛЬНЫ (правило переиспользуемых элементов). Кнопка живёт в
// `components/` и появляется в ЛЮБОМ языке, который владелец включит в панели, —
// в ту же минуту и без строчки кода. Пришла бы она туда по-английски, и
// переиспользуемая часть продукта была бы сломана сразу во всех новых языках,
// причём заметил бы это только носитель языка, которого рядом нет.
//
// Строк ровно две, и это осознанно: чем меньше слов у переиспользуемого элемента,
// тем дешевле он переводится и тем реже врёт. Всё остальное — рисунок и значок.
//
// Набор кодов тот же, что у cookie-баннера: оба списка описывают одно и то же —
// языки, на которых продукт умеет говорить.

export type InstallStrings = {
  /** Надпись на кнопке. Глагол, а не существительное: это действие. */
  install: string
  /** Подпись к крестику — для читалок экрана и всплывающей подсказки. */
  dismiss: string
}

const UI: Record<string, InstallStrings> = {
  en: { install: 'Install app', dismiss: 'Not now' },
  fr: { install: 'Installer l’application', dismiss: 'Pas maintenant' },
  es: { install: 'Instalar la aplicación', dismiss: 'Ahora no' },
  pt: { install: 'Instalar o aplicativo', dismiss: 'Agora não' },
  de: { install: 'App installieren', dismiss: 'Jetzt nicht' },
  it: { install: 'Installa l’app', dismiss: 'Non ora' },
  nl: { install: 'App installeren', dismiss: 'Niet nu' },
  sv: { install: 'Installera appen', dismiss: 'Inte nu' },
  no: { install: 'Installer appen', dismiss: 'Ikke nå' },
  da: { install: 'Installer appen', dismiss: 'Ikke nu' },
  fi: { install: 'Asenna sovellus', dismiss: 'Ei nyt' },
  is: { install: 'Setja upp forritið', dismiss: 'Ekki núna' },
  el: { install: 'Εγκατάσταση εφαρμογής', dismiss: 'Όχι τώρα' },
  pl: { install: 'Zainstaluj aplikację', dismiss: 'Nie teraz' },
  cs: { install: 'Nainstalovat aplikaci', dismiss: 'Teď ne' },
  sk: { install: 'Nainštalovať aplikáciu', dismiss: 'Teraz nie' },
  hu: { install: 'Alkalmazás telepítése', dismiss: 'Most nem' },
  ro: { install: 'Instalează aplicația', dismiss: 'Nu acum' },
  hr: { install: 'Instaliraj aplikaciju', dismiss: 'Ne sada' },
  sl: { install: 'Namesti aplikacijo', dismiss: 'Ne zdaj' },
  et: { install: 'Paigalda rakendus', dismiss: 'Mitte praegu' },
  lv: { install: 'Instalēt lietotni', dismiss: 'Ne tagad' },
  lt: { install: 'Įdiegti programėlę', dismiss: 'Ne dabar' },
  mt: { install: 'Installa l-app', dismiss: 'Mhux issa' },
  ca: { install: 'Instal·la l’aplicació', dismiss: 'Ara no' },
  gl: { install: 'Instalar a aplicación', dismiss: 'Agora non' },
  cy: { install: 'Gosod yr ap', dismiss: 'Nid nawr' },
  ga: { install: 'Suiteáil an aip', dismiss: 'Ní anois' },
  eu: { install: 'Instalatu aplikazioa', dismiss: 'Orain ez' },
  ru: { install: 'Установить приложение', dismiss: 'Не сейчас' },
  uk: { install: 'Встановити застосунок', dismiss: 'Не зараз' },
  be: { install: 'Усталяваць праграму', dismiss: 'Не зараз' },
  bg: { install: 'Инсталиране на приложението', dismiss: 'Не сега' },
  sr: { install: 'Инсталирај апликацију', dismiss: 'Не сада' },
  bs: { install: 'Instaliraj aplikaciju', dismiss: 'Ne sada' },
  mk: { install: 'Инсталирај ја апликацијата', dismiss: 'Не сега' },
  sq: { install: 'Instalo aplikacionin', dismiss: 'Jo tani' },
  kk: { install: 'Қолданбаны орнату', dismiss: 'Қазір емес' },
  uz: { install: 'Ilovani o‘rnatish', dismiss: 'Hozir emas' },
  ky: { install: 'Колдонмону орнотуу', dismiss: 'Азыр эмес' },
  tg: { install: 'Барномаро насб кунед', dismiss: 'Ҳозир не' },
  tk: { install: 'Programmany gurnaň', dismiss: 'Häzir däl' },
  az: { install: 'Tətbiqi quraşdır', dismiss: 'İndi yox' },
  hy: { install: 'Տեղադրել հավելվածը', dismiss: 'Ոչ հիմա' },
  ka: { install: 'აპლიკაციის დაყენება', dismiss: 'ახლა არა' },
  mn: { install: 'Аппыг суулгах', dismiss: 'Одоо биш' },
  ar: { install: 'تثبيت التطبيق', dismiss: 'ليس الآن' },
  tr: { install: 'Uygulamayı yükle', dismiss: 'Şimdi değil' },
  he: { install: 'התקנת האפליקציה', dismiss: 'לא עכשיו' },
  fa: { install: 'نصب برنامه', dismiss: 'حالا نه' },
  ku: { install: 'Sepanê saz bike', dismiss: 'Niha na' },
  af: { install: 'Installeer die app', dismiss: 'Nie nou nie' },
  sw: { install: 'Sakinisha programu', dismiss: 'Si sasa' },
  ha: { install: 'Sanya manhaja', dismiss: 'Ba yanzu ba' },
  yo: { install: 'Fi ohun elo sori ẹrọ', dismiss: 'Kì í ṣe nísinsìnyí' },
  ig: { install: 'Wụnye ngwa a', dismiss: 'Ọ bụghị ugbu a' },
  am: { install: 'መተግበሪያውን ጫን', dismiss: 'አሁን አይደለም' },
  zu: { install: 'Faka uhlelo lokusebenza', dismiss: 'Hhayi manje' },
  xh: { install: 'Faka usetyenziso', dismiss: 'Hayi ngoku' },
  rw: { install: 'Shyiraho porogaramu', dismiss: 'Ntabwo ubu' },
  so: { install: 'Ku rakib abkaa', dismiss: 'Hadda maya' },
  zh: { install: '安装应用', dismiss: '暂不' },
  ja: { install: 'アプリをインストール', dismiss: '今はしない' },
  ko: { install: '앱 설치', dismiss: '나중에' },
  hi: { install: 'ऐप इंस्टॉल करें', dismiss: 'अभी नहीं' },
  ur: { install: 'ایپ انسٹال کریں', dismiss: 'ابھی نہیں' },
  bn: { install: 'অ্যাপ ইনস্টল করুন', dismiss: 'এখন নয়' },
  te: { install: 'యాప్‌ను ఇన్‌స్టాల్ చేయండి', dismiss: 'ఇప్పుడు కాదు' },
  mr: { install: 'ॲप इंस्टॉल करा', dismiss: 'आत्ता नाही' },
  kn: { install: 'ಅಪ್ಲಿಕೇಶನ್ ಸ್ಥಾಪಿಸಿ', dismiss: 'ಈಗ ಬೇಡ' },
  gu: { install: 'ઍપ ઇન્સ્ટોલ કરો', dismiss: 'હમણાં નહીં' },
  ml: { install: 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക', dismiss: 'ഇപ്പോൾ വേണ്ട' },
  ta: { install: 'செயலியை நிறுவு', dismiss: 'இப்போது வேண்டாம்' },
  ne: { install: 'एप इन्स्टल गर्नुहोस्', dismiss: 'अहिले होइन' },
  vi: { install: 'Cài đặt ứng dụng', dismiss: 'Để sau' },
  th: { install: 'ติดตั้งแอป', dismiss: 'ยังไม่ตอนนี้' },
  id: { install: 'Pasang aplikasi', dismiss: 'Nanti saja' },
  ms: { install: 'Pasang aplikasi', dismiss: 'Bukan sekarang' },
  tl: { install: 'I-install ang app', dismiss: 'Hindi ngayon' },
  my: { install: 'အက်ပ်ကို ထည့်သွင်းရန်', dismiss: 'ယခုမဟုတ်ပါ' },
  km: { install: 'ដំឡើងកម្មវិធី', dismiss: 'មិនមែនឥឡូវទេ' },
  lo: { install: 'ຕິດຕັ້ງແອັບ', dismiss: 'ບໍ່ແມ່ນຕອນນີ້' },
}

/** Нет языка — английский. Та же деградация, что у всего словарного слоя. */
export function installUi(lang: string): InstallStrings {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

/** Сколько языков покрыто — читает машинная проверка. */
export const INSTALL_LANGUAGES = Object.keys(UI)

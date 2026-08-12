// Слова самого верхнего меню — не подписи кнопок владельца, а служебные:
// «Меню» у бургера и aria-подписи ящиков.
//
// 🔒 82 ЯЗЫКА, И ЭТО НЕ ИЗБЫТОЧНОСТЬ (правило 4д). Меню — ПЕРЕИСПОЛЬЗУЕМАЯ часть
// продукта: она есть в каждом проекте и появится в любом языке, который владелец
// включит, в ту же минуту и без строчки кода. Придёт она туда по-английски —
// значит сломана сразу во всех новых языках. До этого здесь жили шесть языков
// прямо в компоненте, то есть на семьдесят шестом рынке бургер молча звался
// "Menu", а незрячий посетитель слышал английское «Open left menu».
//
// Подписи КНОПОК владельца сюда не относятся: они контент его сайта и идут по
// включённому набору `NEXT_PUBLIC_SUPPORTED_LANGUAGES` (`lib/menu/nav-config.ts`).

export type TopMenuUi = {
  /** Бургер на узком экране. */
  menu: string
  openLeft: string
  closeLeft: string
  openRight: string
  closeRight: string
}

const UI: Record<string, TopMenuUi> = {
  en: { menu: 'Menu', openLeft: 'Open left menu', closeLeft: 'Close left menu', openRight: 'Open right menu', closeRight: 'Close right menu' },
  fr: { menu: 'Menu', openLeft: 'Ouvrir le menu gauche', closeLeft: 'Fermer le menu gauche', openRight: 'Ouvrir le menu droit', closeRight: 'Fermer le menu droit' },
  es: { menu: 'Menú', openLeft: 'Abrir el menú izquierdo', closeLeft: 'Cerrar el menú izquierdo', openRight: 'Abrir el menú derecho', closeRight: 'Cerrar el menú derecho' },
  pt: { menu: 'Menu', openLeft: 'Abrir o menu esquerdo', closeLeft: 'Fechar o menu esquerdo', openRight: 'Abrir o menu direito', closeRight: 'Fechar o menu direito' },
  de: { menu: 'Menü', openLeft: 'Linkes Menü öffnen', closeLeft: 'Linkes Menü schließen', openRight: 'Rechtes Menü öffnen', closeRight: 'Rechtes Menü schließen' },
  it: { menu: 'Menu', openLeft: 'Apri il menu a sinistra', closeLeft: 'Chiudi il menu a sinistra', openRight: 'Apri il menu a destra', closeRight: 'Chiudi il menu a destra' },
  nl: { menu: 'Menu', openLeft: 'Linkermenu openen', closeLeft: 'Linkermenu sluiten', openRight: 'Rechtermenu openen', closeRight: 'Rechtermenu sluiten' },
  sv: { menu: 'Meny', openLeft: 'Öppna vänstermenyn', closeLeft: 'Stäng vänstermenyn', openRight: 'Öppna högermenyn', closeRight: 'Stäng högermenyn' },
  no: { menu: 'Meny', openLeft: 'Åpne venstremenyen', closeLeft: 'Lukk venstremenyen', openRight: 'Åpne høyremenyen', closeRight: 'Lukk høyremenyen' },
  da: { menu: 'Menu', openLeft: 'Åbn venstremenuen', closeLeft: 'Luk venstremenuen', openRight: 'Åbn højremenuen', closeRight: 'Luk højremenuen' },
  fi: { menu: 'Valikko', openLeft: 'Avaa vasen valikko', closeLeft: 'Sulje vasen valikko', openRight: 'Avaa oikea valikko', closeRight: 'Sulje oikea valikko' },
  is: { menu: 'Valmynd', openLeft: 'Opna vinstri valmynd', closeLeft: 'Loka vinstri valmynd', openRight: 'Opna hægri valmynd', closeRight: 'Loka hægri valmynd' },
  el: { menu: 'Μενού', openLeft: 'Άνοιγμα αριστερού μενού', closeLeft: 'Κλείσιμο αριστερού μενού', openRight: 'Άνοιγμα δεξιού μενού', closeRight: 'Κλείσιμο δεξιού μενού' },
  pl: { menu: 'Menu', openLeft: 'Otwórz lewe menu', closeLeft: 'Zamknij lewe menu', openRight: 'Otwórz prawe menu', closeRight: 'Zamknij prawe menu' },
  cs: { menu: 'Nabídka', openLeft: 'Otevřít levou nabídku', closeLeft: 'Zavřít levou nabídku', openRight: 'Otevřít pravou nabídku', closeRight: 'Zavřít pravou nabídku' },
  sk: { menu: 'Ponuka', openLeft: 'Otvoriť ľavú ponuku', closeLeft: 'Zavrieť ľavú ponuku', openRight: 'Otvoriť pravú ponuku', closeRight: 'Zavrieť pravú ponuku' },
  hu: { menu: 'Menü', openLeft: 'Bal menü megnyitása', closeLeft: 'Bal menü bezárása', openRight: 'Jobb menü megnyitása', closeRight: 'Jobb menü bezárása' },
  ro: { menu: 'Meniu', openLeft: 'Deschide meniul din stânga', closeLeft: 'Închide meniul din stânga', openRight: 'Deschide meniul din dreapta', closeRight: 'Închide meniul din dreapta' },
  hr: { menu: 'Izbornik', openLeft: 'Otvori lijevi izbornik', closeLeft: 'Zatvori lijevi izbornik', openRight: 'Otvori desni izbornik', closeRight: 'Zatvori desni izbornik' },
  sl: { menu: 'Meni', openLeft: 'Odpri levi meni', closeLeft: 'Zapri levi meni', openRight: 'Odpri desni meni', closeRight: 'Zapri desni meni' },
  et: { menu: 'Menüü', openLeft: 'Ava vasak menüü', closeLeft: 'Sulge vasak menüü', openRight: 'Ava parem menüü', closeRight: 'Sulge parem menüü' },
  lv: { menu: 'Izvēlne', openLeft: 'Atvērt kreiso izvēlni', closeLeft: 'Aizvērt kreiso izvēlni', openRight: 'Atvērt labo izvēlni', closeRight: 'Aizvērt labo izvēlni' },
  lt: { menu: 'Meniu', openLeft: 'Atidaryti kairįjį meniu', closeLeft: 'Uždaryti kairįjį meniu', openRight: 'Atidaryti dešinįjį meniu', closeRight: 'Uždaryti dešinįjį meniu' },
  mt: { menu: 'Menu', openLeft: 'Iftaħ il-menu tax-xellug', closeLeft: 'Agħlaq il-menu tax-xellug', openRight: 'Iftaħ il-menu tal-lemin', closeRight: 'Agħlaq il-menu tal-lemin' },
  ca: { menu: 'Menú', openLeft: 'Obre el menú esquerre', closeLeft: 'Tanca el menú esquerre', openRight: 'Obre el menú dret', closeRight: 'Tanca el menú dret' },
  gl: { menu: 'Menú', openLeft: 'Abrir o menú esquerdo', closeLeft: 'Pechar o menú esquerdo', openRight: 'Abrir o menú dereito', closeRight: 'Pechar o menú dereito' },
  cy: { menu: 'Dewislen', openLeft: 'Agor y ddewislen chwith', closeLeft: 'Cau’r ddewislen chwith', openRight: 'Agor y ddewislen dde', closeRight: 'Cau’r ddewislen dde' },
  ga: { menu: 'Roghchlár', openLeft: 'Oscail an roghchlár ar chlé', closeLeft: 'Dún an roghchlár ar chlé', openRight: 'Oscail an roghchlár ar dheis', closeRight: 'Dún an roghchlár ar dheis' },
  eu: { menu: 'Menua', openLeft: 'Ireki ezkerreko menua', closeLeft: 'Itxi ezkerreko menua', openRight: 'Ireki eskuineko menua', closeRight: 'Itxi eskuineko menua' },
  ru: { menu: 'Меню', openLeft: 'Открыть левое меню', closeLeft: 'Закрыть левое меню', openRight: 'Открыть правое меню', closeRight: 'Закрыть правое меню' },
  uk: { menu: 'Меню', openLeft: 'Відкрити ліве меню', closeLeft: 'Закрити ліве меню', openRight: 'Відкрити праве меню', closeRight: 'Закрити праве меню' },
  be: { menu: 'Меню', openLeft: 'Адкрыць левае меню', closeLeft: 'Закрыць левае меню', openRight: 'Адкрыць правае меню', closeRight: 'Закрыць правае меню' },
  bg: { menu: 'Меню', openLeft: 'Отвори лявото меню', closeLeft: 'Затвори лявото меню', openRight: 'Отвори дясното меню', closeRight: 'Затвори дясното меню' },
  sr: { menu: 'Мени', openLeft: 'Отвори леви мени', closeLeft: 'Затвори леви мени', openRight: 'Отвори десни мени', closeRight: 'Затвори десни мени' },
  bs: { menu: 'Meni', openLeft: 'Otvori lijevi meni', closeLeft: 'Zatvori lijevi meni', openRight: 'Otvori desni meni', closeRight: 'Zatvori desni meni' },
  mk: { menu: 'Мени', openLeft: 'Отвори го левото мени', closeLeft: 'Затвори го левото мени', openRight: 'Отвори го десното мени', closeRight: 'Затвори го десното мени' },
  sq: { menu: 'Menu', openLeft: 'Hap menunë e majtë', closeLeft: 'Mbyll menunë e majtë', openRight: 'Hap menunë e djathtë', closeRight: 'Mbyll menunë e djathtë' },
  kk: { menu: 'Мәзір', openLeft: 'Сол жақ мәзірді ашу', closeLeft: 'Сол жақ мәзірді жабу', openRight: 'Оң жақ мәзірді ашу', closeRight: 'Оң жақ мәзірді жабу' },
  uz: { menu: 'Menyu', openLeft: 'Chap menyuni ochish', closeLeft: 'Chap menyuni yopish', openRight: 'O‘ng menyuni ochish', closeRight: 'O‘ng menyuni yopish' },
  ky: { menu: 'Меню', openLeft: 'Сол менюну ачуу', closeLeft: 'Сол менюну жабуу', openRight: 'Оң менюну ачуу', closeRight: 'Оң менюну жабуу' },
  tg: { menu: 'Меню', openLeft: 'Кушодани менюи чап', closeLeft: 'Бастани менюи чап', openRight: 'Кушодани менюи рост', closeRight: 'Бастани менюи рост' },
  tk: { menu: 'Menýu', openLeft: 'Çep menýuny aç', closeLeft: 'Çep menýuny ýap', openRight: 'Sag menýuny aç', closeRight: 'Sag menýuny ýap' },
  az: { menu: 'Menyu', openLeft: 'Sol menyunu aç', closeLeft: 'Sol menyunu bağla', openRight: 'Sağ menyunu aç', closeRight: 'Sağ menyunu bağla' },
  hy: { menu: 'Ընտրացանկ', openLeft: 'Բացել ձախ ընտրացանկը', closeLeft: 'Փակել ձախ ընտրացանկը', openRight: 'Բացել աջ ընտրացանկը', closeRight: 'Փակել աջ ընտրացանկը' },
  ka: { menu: 'მენიუ', openLeft: 'მარცხენა მენიუს გახსნა', closeLeft: 'მარცხენა მენიუს დახურვა', openRight: 'მარჯვენა მენიუს გახსნა', closeRight: 'მარჯვენა მენიუს დახურვა' },
  mn: { menu: 'Цэс', openLeft: 'Зүүн цэсийг нээх', closeLeft: 'Зүүн цэсийг хаах', openRight: 'Баруун цэсийг нээх', closeRight: 'Баруун цэсийг хаах' },
  ar: { menu: 'القائمة', openLeft: 'فتح القائمة اليسرى', closeLeft: 'إغلاق القائمة اليسرى', openRight: 'فتح القائمة اليمنى', closeRight: 'إغلاق القائمة اليمنى' },
  tr: { menu: 'Menü', openLeft: 'Sol menüyü aç', closeLeft: 'Sol menüyü kapat', openRight: 'Sağ menüyü aç', closeRight: 'Sağ menüyü kapat' },
  he: { menu: 'תפריט', openLeft: 'פתיחת התפריט השמאלי', closeLeft: 'סגירת התפריט השמאלי', openRight: 'פתיחת התפריט הימני', closeRight: 'סגירת התפריט הימני' },
  fa: { menu: 'منو', openLeft: 'باز کردن منوی چپ', closeLeft: 'بستن منوی چپ', openRight: 'باز کردن منوی راست', closeRight: 'بستن منوی راست' },
  ku: { menu: 'Pêşek', openLeft: 'Pêşeka çepê veke', closeLeft: 'Pêşeka çepê bigire', openRight: 'Pêşeka rastê veke', closeRight: 'Pêşeka rastê bigire' },
  af: { menu: 'Kieslys', openLeft: 'Open linkerkieslys', closeLeft: 'Sluit linkerkieslys', openRight: 'Open regterkieslys', closeRight: 'Sluit regterkieslys' },
  sw: { menu: 'Menyu', openLeft: 'Fungua menyu ya kushoto', closeLeft: 'Funga menyu ya kushoto', openRight: 'Fungua menyu ya kulia', closeRight: 'Funga menyu ya kulia' },
  ha: { menu: 'Menu', openLeft: 'Buɗe menu na hagu', closeLeft: 'Rufe menu na hagu', openRight: 'Buɗe menu na dama', closeRight: 'Rufe menu na dama' },
  yo: { menu: 'Àkójọ', openLeft: 'Ṣí àkójọ òsì', closeLeft: 'Ti àkójọ òsì', openRight: 'Ṣí àkójọ ọ̀tún', closeRight: 'Ti àkójọ ọ̀tún' },
  ig: { menu: 'Menu', openLeft: 'Mepee menu aka ekpe', closeLeft: 'Mechie menu aka ekpe', openRight: 'Mepee menu aka nri', closeRight: 'Mechie menu aka nri' },
  am: { menu: 'ምናሌ', openLeft: 'የግራ ምናሌ ክፈት', closeLeft: 'የግራ ምናሌ ዝጋ', openRight: 'የቀኝ ምናሌ ክፈት', closeRight: 'የቀኝ ምናሌ ዝጋ' },
  zu: { menu: 'Imenyu', openLeft: 'Vula imenyu yesokunxele', closeLeft: 'Vala imenyu yesokunxele', openRight: 'Vula imenyu yesokudla', closeRight: 'Vala imenyu yesokudla' },
  xh: { menu: 'Imenyu', openLeft: 'Vula imenyu yasekhohlo', closeLeft: 'Vala imenyu yasekhohlo', openRight: 'Vula imenyu yasekunene', closeRight: 'Vala imenyu yasekunene' },
  rw: { menu: 'Ibikubiye', openLeft: 'Fungura urutonde rw’ibumoso', closeLeft: 'Funga urutonde rw’ibumoso', openRight: 'Fungura urutonde rw’iburyo', closeRight: 'Funga urutonde rw’iburyo' },
  so: { menu: 'Liiska', openLeft: 'Fur liiska bidix', closeLeft: 'Xir liiska bidix', openRight: 'Fur liiska midig', closeRight: 'Xir liiska midig' },
  zh: { menu: '菜单', openLeft: '打开左侧菜单', closeLeft: '关闭左侧菜单', openRight: '打开右侧菜单', closeRight: '关闭右侧菜单' },
  ja: { menu: 'メニュー', openLeft: '左メニューを開く', closeLeft: '左メニューを閉じる', openRight: '右メニューを開く', closeRight: '右メニューを閉じる' },
  ko: { menu: '메뉴', openLeft: '왼쪽 메뉴 열기', closeLeft: '왼쪽 메뉴 닫기', openRight: '오른쪽 메뉴 열기', closeRight: '오른쪽 메뉴 닫기' },
  hi: { menu: 'मेन्यू', openLeft: 'बायाँ मेन्यू खोलें', closeLeft: 'बायाँ मेन्यू बंद करें', openRight: 'दायाँ मेन्यू खोलें', closeRight: 'दायाँ मेन्यू बंद करें' },
  ur: { menu: 'مینو', openLeft: 'بائیں مینو کھولیں', closeLeft: 'بائیں مینو بند کریں', openRight: 'دائیں مینو کھولیں', closeRight: 'دائیں مینو بند کریں' },
  bn: { menu: 'মেনু', openLeft: 'বাম মেনু খুলুন', closeLeft: 'বাম মেনু বন্ধ করুন', openRight: 'ডান মেনু খুলুন', closeRight: 'ডান মেনু বন্ধ করুন' },
  te: { menu: 'మెనూ', openLeft: 'ఎడమ మెనూ తెరవండి', closeLeft: 'ఎడమ మెనూ మూసివేయండి', openRight: 'కుడి మెనూ తెరవండి', closeRight: 'కుడి మెనూ మూసివేయండి' },
  mr: { menu: 'मेनू', openLeft: 'डावा मेनू उघडा', closeLeft: 'डावा मेनू बंद करा', openRight: 'उजवा मेनू उघडा', closeRight: 'उजवा मेनू बंद करा' },
  kn: { menu: 'ಮೆನು', openLeft: 'ಎಡ ಮೆನು ತೆರೆಯಿರಿ', closeLeft: 'ಎಡ ಮೆನು ಮುಚ್ಚಿ', openRight: 'ಬಲ ಮೆನು ತೆರೆಯಿರಿ', closeRight: 'ಬಲ ಮೆನು ಮುಚ್ಚಿ' },
  gu: { menu: 'મેનૂ', openLeft: 'ડાબું મેનૂ ખોલો', closeLeft: 'ડાબું મેનૂ બંધ કરો', openRight: 'જમણું મેનૂ ખોલો', closeRight: 'જમણું મેનૂ બંધ કરો' },
  ml: { menu: 'മെനു', openLeft: 'ഇടത് മെനു തുറക്കുക', closeLeft: 'ഇടത് മെനു അടയ്ക്കുക', openRight: 'വലത് മെനു തുറക്കുക', closeRight: 'വലത് മെനു അടയ്ക്കുക' },
  ta: { menu: 'மெனு', openLeft: 'இடது மெனுவைத் திற', closeLeft: 'இடது மெனுவை மூடு', openRight: 'வலது மெனுவைத் திற', closeRight: 'வலது மெனுவை மூடு' },
  ne: { menu: 'मेनु', openLeft: 'बायाँ मेनु खोल्नुहोस्', closeLeft: 'बायाँ मेनु बन्द गर्नुहोस्', openRight: 'दायाँ मेनु खोल्नुहोस्', closeRight: 'दायाँ मेनु बन्द गर्नुहोस्' },
  vi: { menu: 'Menu', openLeft: 'Mở menu bên trái', closeLeft: 'Đóng menu bên trái', openRight: 'Mở menu bên phải', closeRight: 'Đóng menu bên phải' },
  th: { menu: 'เมนู', openLeft: 'เปิดเมนูด้านซ้าย', closeLeft: 'ปิดเมนูด้านซ้าย', openRight: 'เปิดเมนูด้านขวา', closeRight: 'ปิดเมนูด้านขวา' },
  id: { menu: 'Menu', openLeft: 'Buka menu kiri', closeLeft: 'Tutup menu kiri', openRight: 'Buka menu kanan', closeRight: 'Tutup menu kanan' },
  ms: { menu: 'Menu', openLeft: 'Buka menu kiri', closeLeft: 'Tutup menu kiri', openRight: 'Buka menu kanan', closeRight: 'Tutup menu kanan' },
  tl: { menu: 'Menu', openLeft: 'Buksan ang kaliwang menu', closeLeft: 'Isara ang kaliwang menu', openRight: 'Buksan ang kanang menu', closeRight: 'Isara ang kanang menu' },
  my: { menu: 'မီနူး', openLeft: 'ဘယ်ဘက်မီနူးကို ဖွင့်ရန်', closeLeft: 'ဘယ်ဘက်မီနူးကို ပိတ်ရန်', openRight: 'ညာဘက်မီနူးကို ဖွင့်ရန်', closeRight: 'ညာဘက်မီနူးကို ပိတ်ရန်' },
  km: { menu: 'ម៉ឺនុយ', openLeft: 'បើកម៉ឺនុយខាងឆ្វេង', closeLeft: 'បិទម៉ឺនុយខាងឆ្វេង', openRight: 'បើកម៉ឺនុយខាងស្តាំ', closeRight: 'បិទម៉ឺនុយខាងស្តាំ' },
  lo: { menu: 'ເມນູ', openLeft: 'ເປີດເມນູຊ້າຍ', closeLeft: 'ປິດເມນູຊ້າຍ', openRight: 'ເປີດເມນູຂວາ', closeRight: 'ປິດເມນູຂວາ' },
}

export function topMenuUi(lang: string): TopMenuUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

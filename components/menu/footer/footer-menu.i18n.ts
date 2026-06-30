// Co-located footer translations. These strings BELONG to the footer: they live in the
// footer folder and are imported by nothing else. Delete the footer folder and they go
// with it — zero orphaned data left in the project (co-location rule).
//
// HEADINGS (the two footer-area titles) cover the FULL language catalogue (82, see
// config/translations/language-metadata.ts) — same reach as the rest of the localized
// product. CHROME (copyright + theme labels) stays en/es/ru for now. Any language missing
// from a map falls back to English.

export type FooterLabels = {
  footerPages: string;   // heading over the footer-page navigation (every group on the footer slot)
  pageSections: string;  // heading over the home-page section scroll links (home only)
  rights: string;
  system: string;
  light: string;
  dark: string;
};

// The two footer headings — all 82 catalogue languages.
const HEADINGS: Record<string, { footerPages: string; pageSections: string }> = {
  en: { footerPages: "Footer pages", pageSections: "Page sections" },
  fr: { footerPages: "Pages du pied de page", pageSections: "Sections de la page" },
  es: { footerPages: "Páginas del pie", pageSections: "Secciones de la página" },
  pt: { footerPages: "Páginas do rodapé", pageSections: "Seções da página" },
  de: { footerPages: "Footer-Seiten", pageSections: "Seitenabschnitte" },
  it: { footerPages: "Pagine del footer", pageSections: "Sezioni della pagina" },
  nl: { footerPages: "Footerpagina's", pageSections: "Paginasecties" },
  sv: { footerPages: "Sidfotssidor", pageSections: "Sidsektioner" },
  no: { footerPages: "Bunntekstsider", pageSections: "Sideseksjoner" },
  da: { footerPages: "Sidefodssider", pageSections: "Sideafsnit" },
  fi: { footerPages: "Alatunnisteen sivut", pageSections: "Sivun osiot" },
  is: { footerPages: "Síður í síðufæti", pageSections: "Hlutar síðu" },
  el: { footerPages: "Σελίδες υποσέλιδου", pageSections: "Ενότητες σελίδας" },
  pl: { footerPages: "Strony stopki", pageSections: "Sekcje strony" },
  cs: { footerPages: "Stránky v zápatí", pageSections: "Sekce stránky" },
  sk: { footerPages: "Stránky v päte", pageSections: "Sekcie stránky" },
  hu: { footerPages: "Lábléc oldalai", pageSections: "Oldalszakaszok" },
  ro: { footerPages: "Pagini din subsol", pageSections: "Secțiuni ale paginii" },
  hr: { footerPages: "Stranice podnožja", pageSections: "Odjeljci stranice" },
  sl: { footerPages: "Strani noge", pageSections: "Razdelki strani" },
  et: { footerPages: "Jaluse lehed", pageSections: "Lehe jaotised" },
  lv: { footerPages: "Kājenes lapas", pageSections: "Lapas sadaļas" },
  lt: { footerPages: "Poraštės puslapiai", pageSections: "Puslapio skiltys" },
  mt: { footerPages: "Paġni tal-qiegħ", pageSections: "Taqsimiet tal-paġna" },
  ca: { footerPages: "Pàgines del peu", pageSections: "Seccions de la pàgina" },
  gl: { footerPages: "Páxinas do pé", pageSections: "Seccións da páxina" },
  cy: { footerPages: "Tudalennau troedyn", pageSections: "Adrannau'r dudalen" },
  ga: { footerPages: "Leathanaigh bhuntásc", pageSections: "Ranna an leathanaigh" },
  eu: { footerPages: "Oineko orriak", pageSections: "Orriaren atalak" },
  ru: { footerPages: "Страницы футера", pageSections: "Разделы страницы" },
  uk: { footerPages: "Сторінки футера", pageSections: "Розділи сторінки" },
  be: { footerPages: "Старонкі ніжняга калонтытула", pageSections: "Раздзелы старонкі" },
  bg: { footerPages: "Страници във футъра", pageSections: "Раздели на страницата" },
  sr: { footerPages: "Странице подножја", pageSections: "Одељци странице" },
  bs: { footerPages: "Stranice podnožja", pageSections: "Odjeljci stranice" },
  mk: { footerPages: "Страници во подножјето", pageSections: "Делови на страницата" },
  sq: { footerPages: "Faqet e fundit", pageSections: "Seksionet e faqes" },
  kk: { footerPages: "Төменгі деректеме беттері", pageSections: "Бет бөлімдері" },
  uz: { footerPages: "Pastki qism sahifalari", pageSections: "Sahifa boʻlimlari" },
  ky: { footerPages: "Астыңкы колонтитул барактары", pageSections: "Барак бөлүмдөрү" },
  tg: { footerPages: "Саҳифаҳои поён", pageSections: "Бахшҳои саҳифа" },
  tk: { footerPages: "Aşaky bölüm sahypalary", pageSections: "Sahypa bölümleri" },
  az: { footerPages: "Altbilgi səhifələri", pageSections: "Səhifə bölmələri" },
  hy: { footerPages: "Էջատակի էջեր", pageSections: "Էջի բաժիններ" },
  ka: { footerPages: "ქვედა კოლონტიტულის გვერდები", pageSections: "გვერდის სექციები" },
  mn: { footerPages: "Хөлийн хэсгийн хуудаснууд", pageSections: "Хуудасны хэсгүүд" },
  ar: { footerPages: "صفحات التذييل", pageSections: "أقسام الصفحة" },
  tr: { footerPages: "Alt bilgi sayfaları", pageSections: "Sayfa bölümleri" },
  he: { footerPages: "דפי כותרת תחתונה", pageSections: "מקטעי העמוד" },
  fa: { footerPages: "صفحه‌های پاورقی", pageSections: "بخش‌های صفحه" },
  ku: { footerPages: "Rûpelên jêrîn", pageSections: "Beşên rûpelê" },
  af: { footerPages: "Voetskrif-bladsye", pageSections: "Bladsy-afdelings" },
  sw: { footerPages: "Kurasa za chini", pageSections: "Sehemu za ukurasa" },
  ha: { footerPages: "Shafukan ƙasa", pageSections: "Sassan shafi" },
  yo: { footerPages: "Àwọn ojú-ìwé ìsàlẹ̀", pageSections: "Àwọn apá ojú-ìwé" },
  ig: { footerPages: "Ibe ala", pageSections: "Akụkụ ibe" },
  am: { footerPages: "የግርጌ ገጾች", pageSections: "የገጽ ክፍሎች" },
  zu: { footerPages: "Amakhasi aphansi", pageSections: "Izigaba zekhasi" },
  xh: { footerPages: "Amaphepha asezantsi", pageSections: "Amacandelo ephepha" },
  rw: { footerPages: "Amapaji yo hasi", pageSections: "Ibice by'urupapuro" },
  so: { footerPages: "Bogagga hoose", pageSections: "Qaybaha bogga" },
  zh: { footerPages: "页脚页面", pageSections: "页面板块" },
  ja: { footerPages: "フッターページ", pageSections: "ページセクション" },
  ko: { footerPages: "푸터 페이지", pageSections: "페이지 섹션" },
  hi: { footerPages: "फ़ुटर पृष्ठ", pageSections: "पृष्ठ अनुभाग" },
  ur: { footerPages: "فوٹر کے صفحات", pageSections: "صفحے کے حصے" },
  bn: { footerPages: "ফুটার পৃষ্ঠা", pageSections: "পৃষ্ঠার বিভাগ" },
  te: { footerPages: "ఫుటర్ పేజీలు", pageSections: "పేజీ విభాగాలు" },
  mr: { footerPages: "फूटर पृष्ठे", pageSections: "पृष्ठ विभाग" },
  kn: { footerPages: "ಅಡಿಟಿಪ್ಪಣಿ ಪುಟಗಳು", pageSections: "ಪುಟದ ವಿಭಾಗಗಳು" },
  gu: { footerPages: "ફૂટર પૃષ્ઠો", pageSections: "પૃષ્ઠ વિભાગો" },
  ml: { footerPages: "ഫൂട്ടർ പേജുകൾ", pageSections: "പേജ് വിഭാഗങ്ങൾ" },
  ta: { footerPages: "அடிக்குறிப்பு பக்கங்கள்", pageSections: "பக்கப் பிரிவுகள்" },
  ne: { footerPages: "फुटर पृष्ठहरू", pageSections: "पृष्ठ खण्डहरू" },
  vi: { footerPages: "Trang chân trang", pageSections: "Phần của trang" },
  th: { footerPages: "หน้าส่วนท้าย", pageSections: "ส่วนของหน้า" },
  id: { footerPages: "Halaman footer", pageSections: "Bagian halaman" },
  ms: { footerPages: "Halaman pengaki", pageSections: "Bahagian halaman" },
  tl: { footerPages: "Mga pahina ng footer", pageSections: "Mga seksyon ng pahina" },
  my: { footerPages: "အောက်ခြေ စာမျက်နှာများ", pageSections: "စာမျက်နှာ အပိုင်းများ" },
  km: { footerPages: "ទំព័របាតកថា", pageSections: "ផ្នែករបស់ទំព័រ" },
  lo: { footerPages: "ໜ້າສ່ວນທ້າຍ", pageSections: "ພາກສ່ວນຂອງໜ້າ" },
};

// Copyright + theme-toggle labels. Kept at en/es/ru (English fallback) — extend as needed.
const CHROME: Record<string, { rights: string; system: string; light: string; dark: string }> = {
  en: { rights: "All rights reserved.", system: "Theme: system", light: "Theme: light", dark: "Theme: dark" },
  es: { rights: "Todos los derechos reservados.", system: "Tema: sistema", light: "Tema: claro", dark: "Tema: oscuro" },
  ru: { rights: "Все права защищены.", system: "Тема: системная", light: "Тема: светлая", dark: "Тема: тёмная" },
};

export function footerLabels(lang: string): FooterLabels {
  const h = HEADINGS[lang] ?? HEADINGS.en;
  const c = CHROME[lang] ?? CHROME.en;
  return { ...h, ...c };
}

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
  social: string;        // aria-label/title for the mobile social-links hamburger
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
const CHROME: Record<string, { rights: string; system: string; light: string; dark: string; social: string }> = {
  en: { rights: "All rights reserved.", system: "Theme: system", light: "Theme: light", dark: "Theme: dark", social: "Social links" },
  es: { rights: "Todos los derechos reservados.", system: "Tema: sistema", light: "Tema: claro", dark: "Tema: oscuro", social: "Redes sociales" },
  ru: { rights: "Все права защищены.", system: "Тема: системная", light: "Тема: светлая", dark: "Тема: тёмная", social: "Соцсети" },
};

export function footerLabels(lang: string): FooterLabels {
  const h = HEADINGS[lang] ?? HEADINGS.en;
  const c = CHROME[lang] ?? CHROME.en;
  return { ...h, ...c };
}

// ─── Layers navigator (footer) ───────────────────────────────────────────────
// The four main app areas ("service pages") reached from the footer navigator:
// Home (public) + the role-gated cockpit layers Admin / Design / Projects. Owner-facing
// cockpit navigation → the admin-layers ten (rule 4г: en,es,fr,it,ru,de,pt,pl,tr,nl);
// any other language falls back to English. `denied` is the red toast on insufficient role.
// 🪦 Слова навигатора «слоёв» удалены 2026-08-12 вместе с самим навигатором:
// он вёл на Design :3004 и слой проектов :3003, снесённые шагом 500. Словарь
// без потребителя гниёт молча — следующая сессия принимает его за нужный.

// ─── Ссылка на панель управления (футер) ─────────────────────────────────────
//
// 🔒 ЭТО НАДПИСЬ ДЛЯ ВЛАДЕЛЬЦА, А НЕ ДЛЯ ПОСЕТИТЕЛЯ (владелец 2026-08-14).
// Панель закрыта авторизацией, поэтому ссылку осмысленно читает тот, у кого
// есть доступ, — а он работает в языках кокпита. Отсюда те же десять языков,
// что у соседнего переключателя ширины (правило 4г), с английским запасным.
//
// Это НЕ воскрешение снесённого «навигатора слоёв»: тот вёл на Design :3004 и
// слой проектов :3003, которых больше нет, и был удалён именно за ссылки в
// никуда. Здесь одна ссылка на одну живую службу.
export type AdminLinkLabels = { admin: string };

const ADMIN_LINK: Record<string, AdminLinkLabels> = {
  en: { admin: "Control panel" },
  es: { admin: "Panel de control" },
  fr: { admin: "Panneau de contrôle" },
  it: { admin: "Pannello di controllo" },
  ru: { admin: "Панель управления" },
  de: { admin: "Kontrollzentrum" },
  pt: { admin: "Painel de controlo" },
  pl: { admin: "Panel sterowania" },
  tr: { admin: "Kontrol paneli" },
  nl: { admin: "Configuratiescherm" },
};

export function adminLinkLabels(lang: string): AdminLinkLabels {
  return ADMIN_LINK[lang] ?? ADMIN_LINK.en;
}

// ─── Architect layer (footer) ────────────────────────────────────────────────
//
// Подпись входа в слой архитектора — страницу настроек проекта ВНУТРИ самого
// проекта (шаг 31-1, решение владельца 2026-08-28).
//
// 🔒 СЛОВО НЕ ПОВТОРЯЕТ СОСЕДА. Рядом стоит «Панель управления» — чужой
// поддомен, где живёт платформа. Здесь настройки самого проекта, и назвать это
// вторыми «настройками» значило бы поставить в один ряд две кнопки, между
// которыми человек выбирает наугад.
//
// 🔒 ЯЗЫКОВ ДВА, И ЭТО НАЗВАНО ЧЕСТНО. Владелец 2026-08-28: «en + ru сейчас,
// остальные файлом позже» — набор строк слоя ещё меняется каждый подшаг, и
// переводить его сейчас значит переводить дважды. Резолвер откатывается на
// английский, поэтому остальные языки видят рабочую кнопку, а не пустоту.
export type ArchitectLinkUi = { footer: string };

const ARCHITECT_LINK: Record<string, ArchitectLinkUi> = {
  en: { footer: "Project settings" },
  ru: { footer: "Настройки проекта" },
};

export function architectLinkUi(lang: string): ArchitectLinkUi {
  return ARCHITECT_LINK[lang] ?? ARCHITECT_LINK.en;
}

// ─── Design layer (footer) ───────────────────────────────────────────────────
//
// 🔒 ОТДЕЛЬНЫЙ ВХОД, А НЕ РАЗДЕЛ ВНУТРИ НАСТРОЕК — указание владельца 2026-08-29,
// отменившее моё решение того же дня: «я хотел, чтобы здесь была ещё одна кнопка,
// которая называется дизайн… чтобы они не были в одной огромной вкладке настройки
// проекта, которая уже сильно перегружена».
//
// 🔒 СЛОВО КОРОТКОЕ И НЕ ПОВТОРЯЕТ СОСЕДЕЙ. В ряду уже стоят «Настройки проекта» и
// «Панель управления»; третья кнопка со словом «настройки» сделала бы выбор между
// ними угадыванием.
export type DesignLinkUi = { footer: string };

const DESIGN_LINK: Record<string, DesignLinkUi> = {
  en: { footer: "Design" },
  ru: { footer: "Дизайн" },
};

export function designLinkUi(lang: string): DesignLinkUi {
  return DESIGN_LINK[lang] ?? DESIGN_LINK.en;
}

// ─── Dev-mode entry (footer) ────────────────────────────────────────────────
//
// 🔒 ТРЕТИЙ ВХОД СЛОЯ (владелец 2026-08-31), и заведён он по тому же доводу, что
// «Дизайн» до него: вкладка настроек проекта несла девять групп, из которых
// режим разработки не был настройкой вовсе — он решает, КАК с проектом работает
// агент. «Главное освободить основную вкладку от избыточных и не связанных
// инструментов».
//
// 🔒 СЛОВО ТО ЖЕ, ЧТО В МЕНЮ И В ЗАГОЛОВКЕ СТРАНИЦЫ. Вход, названный иначе, чем
// место, куда он ведёт, заставляет человека проверять догадку нажатием.
export type DevModeLinkUi = { footer: string };

const DEV_MODE_LINK: Record<string, DevModeLinkUi> = {
  en: { footer: "Development mode" },
  ru: { footer: "Режим разработки" },
};

export function devModeLinkUi(lang: string): DevModeLinkUi {
  return DEV_MODE_LINK[lang] ?? DEV_MODE_LINK.en;
}

// ─── Telegram bot (footer) ──────────────────────────────────────────────────
//
// 🔒 ЧЕТВЁРТЫЙ ВХОД СЛОЯ (владелец 2026-08-31, дословно: «я хочу, чтоб мы создали
// Telegram-бот внутри footer»). Довод тот же, что у дизайна и режима разработки:
// у бота свои три раздела, и вложить их в настройки проекта значило бы удлинить
// меню, из которого каждый раз выбирают одну строку.
//
// 🔒 СЛОВО ТО ЖЕ, ЧТО В МЕНЮ И В ЗАГОЛОВКЕ СТРАНИЦЫ. Вход, названный иначе, чем
// место, куда он ведёт, заставляет человека проверять догадку нажатием.
export type TelegramLinkUi = { footer: string };

const TELEGRAM_LINK: Record<string, TelegramLinkUi> = {
  en: { footer: "Telegram bot" },
  ru: { footer: "Telegram-бот" },
};

export function telegramLinkUi(lang: string): TelegramLinkUi {
  return TELEGRAM_LINK[lang] ?? TELEGRAM_LINK.en;
}

// ─── Architect group heading (footer) ───────────────────────────────────────
//
// 🔒 ПОДПИСЬ ГРУППЫ, А НЕ ЕЩЁ ОДНА ССЫЛКА (владелец 2026-08-29). Четыре
// служебные ссылки, отделённые линией и не подписанные, читаются как забытая
// владельцем настройка подвала: линия говорит «это другое», но не говорит «другое
// ЧТО».
//
// 🔒 СЛОВО НАЗЫВАЕТ АДРЕСАТА, А НЕ СОДЕРЖИМОЕ. «Служебные ссылки» описывало бы
// нас, а не человека; «страницы архитектора» отвечает на вопрос «кому это»,
// который у посетителя возникает первым.
export type ArchitectGroupUi = { title: string };

const ARCHITECT_GROUP: Record<string, ArchitectGroupUi> = {
  en: { title: "Architect pages" },
  ru: { title: "Страницы архитектора" },
};

export function architectGroupUi(lang: string): ArchitectGroupUi {
  return ARCHITECT_GROUP[lang] ?? ARCHITECT_GROUP.en;
}

// ─── Content-width toggle (footer) ───────────────────────────────────────────
// aria-label/title for the wide/narrow screen-width button (ported from the Projects
// zone). Admin-layers ten (rule 4г); English fallback for any other language.
export type WidthLabels = { wide: string; normal: string };

const WIDTH_LABELS: Record<string, WidthLabels> = {
  en: { wide: "Widen the screen", normal: "Narrow the screen" },
  es: { wide: "Ampliar la pantalla", normal: "Reducir la pantalla" },
  fr: { wide: "Élargir l'écran", normal: "Réduire l'écran" },
  it: { wide: "Allarga lo schermo", normal: "Restringi lo schermo" },
  ru: { wide: "Шире экран", normal: "Уже экран" },
  de: { wide: "Bildschirm verbreitern", normal: "Bildschirm verschmälern" },
  pt: { wide: "Ampliar a tela", normal: "Estreitar a tela" },
  pl: { wide: "Poszerz ekran", normal: "Zwęź ekran" },
  tr: { wide: "Ekranı genişlet", normal: "Ekranı daralt" },
  nl: { wide: "Scherm verbreden", normal: "Scherm versmallen" },
};

export function widthLabels(lang: string): WidthLabels {
  return WIDTH_LABELS[lang] ?? WIDTH_LABELS.en;
}

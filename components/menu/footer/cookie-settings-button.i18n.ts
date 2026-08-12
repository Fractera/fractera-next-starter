// Слово кнопки «Настройки cookie» — 82 языка, рядом с самой кнопкой.
//
// 🔒 СЛОВАРЬ ЖИВЁТ ВОЗЛЕ КОМПОНЕНТА, А НЕ В ОБЩЕМ СКЛАДЕ (владелец, 2026-08-12).
// Удалите папку кнопки — словарь уйдёт вместе с ней, и в проекте не останется
// строк, которые некому показать. Обратная сторона того же правила: сюда не
// тянется длинный импорт из чужой части приложения.
//
// 🔒 82 ЯЗЫКА ОБЯЗАТЕЛЬНЫ (правило 4д). Кнопка — переиспользуемая часть
// продукта: она есть в каждом проекте, где включён баннер, и появится в любом
// языке, который владелец включит, в ту же минуту. Придёт она туда
// по-английски — значит сломана сразу во всех новых языках.
//
// Перевод здесь один: «настройки cookie» — то, что открывает баннер повторно.
// Слово `cookie` в большинстве языков не переводится и остаётся заимствованным.

// Тип записан многострочно намеренно: сторож словарей читает его блок до
// закрывающей скобки на отдельной строке, и однострочная запись сбивала счёт
// ключей (он насчитал 82 вместо одного). Единая форма у всех словарей дешевле
// исключения в проверке.
export type CookieButtonUi = {
  settings: string
}

const UI: Record<string, CookieButtonUi> = {
  en: { settings: 'Cookie settings' },
  fr: { settings: 'Paramètres des cookies' },
  es: { settings: 'Configuración de cookies' },
  pt: { settings: 'Definições de cookies' },
  de: { settings: 'Cookie-Einstellungen' },
  it: { settings: 'Impostazioni cookie' },
  nl: { settings: 'Cookie-instellingen' },
  sv: { settings: 'Cookie-inställningar' },
  no: { settings: 'Innstillinger for informasjonskapsler' },
  da: { settings: 'Cookieindstillinger' },
  fi: { settings: 'Evästeasetukset' },
  is: { settings: 'Vafrakökustillingar' },
  el: { settings: 'Ρυθμίσεις cookie' },
  pl: { settings: 'Ustawienia plików cookie' },
  cs: { settings: 'Nastavení cookies' },
  sk: { settings: 'Nastavenia cookies' },
  hu: { settings: 'Süti beállítások' },
  ro: { settings: 'Setări cookie' },
  hr: { settings: 'Postavke kolačića' },
  sl: { settings: 'Nastavitve piškotkov' },
  et: { settings: 'Küpsiste seaded' },
  lv: { settings: 'Sīkdatņu iestatījumi' },
  lt: { settings: 'Slapukų nustatymai' },
  mt: { settings: 'Settings tal-cookies' },
  ca: { settings: 'Configuració de galetes' },
  gl: { settings: 'Configuración de cookies' },
  cy: { settings: 'Gosodiadau cwcis' },
  ga: { settings: 'Socruithe fianán' },
  eu: { settings: 'Cookie-en ezarpenak' },
  ru: { settings: 'Настройки cookie' },
  uk: { settings: 'Налаштування cookie' },
  be: { settings: 'Налады cookie' },
  bg: { settings: 'Настройки за бисквитки' },
  sr: { settings: 'Подешавања колачића' },
  bs: { settings: 'Postavke kolačića' },
  mk: { settings: 'Поставки за колачиња' },
  sq: { settings: 'Cilësimet e cookie-ve' },
  kk: { settings: 'Cookie параметрлері' },
  uz: { settings: 'Cookie sozlamalari' },
  ky: { settings: 'Cookie жөндөөлөрү' },
  tg: { settings: 'Танзимоти cookie' },
  tk: { settings: 'Cookie sazlamalary' },
  az: { settings: 'Cookie parametrləri' },
  hy: { settings: 'Cookie-ների կարգավորումներ' },
  ka: { settings: 'Cookie-ს პარამეტრები' },
  mn: { settings: 'Cookie тохиргоо' },
  ar: { settings: 'إعدادات ملفات تعريف الارتباط' },
  tr: { settings: 'Çerez ayarları' },
  he: { settings: 'הגדרות עוגיות' },
  fa: { settings: 'تنظیمات کوکی' },
  ku: { settings: 'Mîhengên cookie' },
  af: { settings: 'Koekie-instellings' },
  sw: { settings: 'Mipangilio ya vidakuzi' },
  ha: { settings: 'Saitunan kuki' },
  yo: { settings: 'Ètò kúkì' },
  ig: { settings: 'Ntọala kuki' },
  am: { settings: 'የኩኪ ቅንብሮች' },
  zu: { settings: 'Izilungiselelo zamakhukhi' },
  xh: { settings: 'Iisethingi zekhuki' },
  rw: { settings: 'Igenamiterere rya cookie' },
  so: { settings: 'Dejinta cookie-ga' },
  zh: { settings: 'Cookie 设置' },
  ja: { settings: 'Cookie 設定' },
  ko: { settings: '쿠키 설정' },
  hi: { settings: 'कुकी सेटिंग्स' },
  ur: { settings: 'کوکی سیٹنگز' },
  bn: { settings: 'কুকি সেটিংস' },
  te: { settings: 'కుకీ సెట్టింగ్‌లు' },
  mr: { settings: 'कुकी सेटिंग्ज' },
  kn: { settings: 'ಕುಕೀ ಸೆಟ್ಟಿಂಗ್‌ಗಳು' },
  gu: { settings: 'કૂકી સેટિંગ્સ' },
  ml: { settings: 'കുക്കി ക്രമീകരണങ്ങൾ' },
  ta: { settings: 'குக்கீ அமைப்புகள்' },
  ne: { settings: 'कुकी सेटिङहरू' },
  vi: { settings: 'Cài đặt cookie' },
  th: { settings: 'การตั้งค่าคุกกี้' },
  id: { settings: 'Pengaturan cookie' },
  ms: { settings: 'Tetapan kuki' },
  tl: { settings: 'Mga setting ng cookie' },
  my: { settings: 'ကွတ်ကီး ဆက်တင်များ' },
  km: { settings: 'ការកំណត់ខូឃី' },
  lo: { settings: 'ການຕັ້ງຄ່າຄຸກກີ້' },
}

export function cookieButtonUi(lang: string): CookieButtonUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

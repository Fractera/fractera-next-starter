// Слова, без которых не обходится НИ ОДНО модальное окно продукта, — 82 языка.
//
// 🔒 ПОЧЕМУ ЭТОТ СЛОВАРЬ ВООБЩЕ ПОЯВИЛСЯ. Подпись крестика жила строкой внутри
// примитива `components/ui/dialog.tsx` — по-английски, во всех восьмидесяти двух
// языках сразу. Её читает программа чтения с экрана, то есть для незрячего
// человека это ЕДИНСТВЕННОЕ описание кнопки, и на японской странице оно
// говорило «Close».
//
// 🔒 ПОЧЕМУ 82, А НЕ ДЕСЯТЬ. Окно — переиспользуемая часть продукта: оно есть в
// каждом проекте и появится в любом языке, который владелец включит в панели, в
// ту же минуту. Строка на десяти языках молча становится английской на
// семьдесят втором рынке. Правило `/code/CLAUDE.md` §4д.
//
// 🔒 ПЕРЕВОДЫ НЕ СОЧИНЯЛИСЬ. Слово перенесено ДОСЛОВНО из
// `components/i18n/translations-dialog.i18n.ts`, где оно уже жило на всех 82
// языках, — скриптом, ключ в ключ. Второй перевод того же слова разошёлся бы с
// первым на первой же правке.
//
// 🔒 ЭТОТ МОДУЛЬ НЕ ИМПОРТИРУЕТСЯ ИЗ КЛИЕНТА НАПРЯМУЮ. Серверный компонент
// зовёт `appDialogUi(lang)` и передаёт результат островку пропсом `ui`.

// Тип записан многострочно намеренно: сторож словарей читает его блок до
// закрывающей скобки на отдельной строке, и однострочная запись сбивает счёт
// ключей.
export type AppDialogUi = {
  /** Подпись крестика и кнопки закрытия. Читается программой чтения с экрана. */
  close: string
}

const UI: Record<string, AppDialogUi> = {
  en: { close: 'Close' },
  fr: { close: 'Fermer' },
  es: { close: 'Cerrar' },
  pt: { close: 'Fechar' },
  de: { close: 'Schließen' },
  it: { close: 'Chiudi' },
  nl: { close: 'Sluiten' },
  sv: { close: 'Stäng' },
  no: { close: 'Lukk' },
  da: { close: 'Luk' },
  fi: { close: 'Sulje' },
  is: { close: 'Loka' },
  el: { close: 'Κλείσιμο' },
  pl: { close: 'Zamknij' },
  cs: { close: 'Zavřít' },
  sk: { close: 'Zavrieť' },
  hu: { close: 'Bezárás' },
  ro: { close: 'Închide' },
  hr: { close: 'Zatvori' },
  sl: { close: 'Zapri' },
  et: { close: 'Sulge' },
  lv: { close: 'Aizvērt' },
  lt: { close: 'Uždaryti' },
  mt: { close: 'Agħlaq' },
  ca: { close: 'Tanca' },
  gl: { close: 'Pechar' },
  cy: { close: 'Cau' },
  ga: { close: 'Dún' },
  eu: { close: 'Itxi' },
  ru: { close: 'Закрыть' },
  uk: { close: 'Закрити' },
  be: { close: 'Закрыць' },
  bg: { close: 'Затвори' },
  sr: { close: 'Затворите' },
  bs: { close: 'Zatvori' },
  mk: { close: 'Затвори' },
  sq: { close: 'Mbyll' },
  kk: { close: 'Жабу' },
  uz: { close: 'Yopish' },
  ky: { close: 'Жабуу' },
  tg: { close: 'Бастан' },
  tk: { close: 'Ýap' },
  az: { close: 'Bağla' },
  hy: { close: 'Փակել' },
  ka: { close: 'დახურვა' },
  mn: { close: 'Хаах' },
  ar: { close: 'إغلاق' },
  tr: { close: 'Kapat' },
  he: { close: 'סגור' },
  fa: { close: 'بستن' },
  ku: { close: 'Bigire' },
  af: { close: 'Sluit' },
  sw: { close: 'Funga' },
  ha: { close: 'Rufe' },
  yo: { close: 'Pá' },
  ig: { close: 'Mechie' },
  am: { close: 'ዝጉ' },
  zu: { close: 'Vala' },
  xh: { close: 'Vala' },
  rw: { close: 'Funga' },
  so: { close: 'Xir' },
  zh: { close: '关闭' },
  ja: { close: '閉じる' },
  ko: { close: '닫기' },
  hi: { close: 'बंद करें' },
  ur: { close: 'بند کریں' },
  bn: { close: 'বন্ধ করুন' },
  te: { close: 'మూసివేయండి' },
  mr: { close: 'बंद करा' },
  kn: { close: 'ಮುಚ್ಚಿ' },
  gu: { close: 'બંધ કરો' },
  ml: { close: 'അടയ്ക്കുക' },
  ta: { close: 'மூடு' },
  ne: { close: 'बन्द गर्नुहोस्' },
  vi: { close: 'Đóng' },
  th: { close: 'ปิด' },
  id: { close: 'Tutup' },
  ms: { close: 'Tutup' },
  tl: { close: 'Isara' },
  my: { close: 'ပိတ်ပါ' },
  km: { close: 'បិទ' },
  lo: { close: 'ປິດ' },
}

export function appDialogUi(lang: string): AppDialogUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

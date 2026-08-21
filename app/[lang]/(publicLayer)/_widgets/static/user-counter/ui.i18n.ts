// Слова счётчика пользователей — СВОИ, страничный набор (правило 4д): виджет
// принадлежит ОДНОМУ маршруту (главная) и не переиспользуется. Десять языков —
// тот же набор, что у пяти виджетов защищённого слоя и у `security-orbit`.
//
// `{count}` — место, куда встаёт УЖЕ ГОТОВОЕ число (форматирует `format.ts`).
// Само число НЕ ПЕРЕВОДИТСЯ — тот же закон, что у `value`/`label` в блоке
// `metrics` (`lib/content/blocks/types.ts`): подпись рядом с числом — обычная
// продуктовая строка, а число — машинная величина.

export type UserCounterUi = {
  caption: string
}

const UI: Record<string, UserCounterUi> = {
  en: { caption: "In total, the service is used by {count} people." },
  ru: { caption: "Всего сервисом пользуются {count} людей." },
  es: { caption: "En total, el servicio lo usan {count} personas." },
  fr: { caption: "Au total, le service est utilisé par {count} personnes." },
  it: { caption: "In totale, il servizio è usato da {count} persone." },
  de: { caption: "Insgesamt nutzen {count} Menschen den Dienst." },
  pt: { caption: "No total, o serviço é usado por {count} pessoas." },
  pl: { caption: "Łącznie z usługi korzysta {count} osób." },
  tr: { caption: "Toplamda hizmeti {count} kişi kullanıyor." },
  nl: { caption: "In totaal gebruiken {count} mensen de dienst." },
}

export function userCounterUi(lang: string): UserCounterUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

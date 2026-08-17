import words from "./image-cropper.i18n.json"

// Слова обрезчика картинок.
//
// 🔒 ДО 2026-08-17 ИХ НЕ БЫЛО ВОВСЕ. «Crop image», «Scale», «Cancel», «Apply»
// стояли в разметке строками, то есть окно обрезки было англоязычным во всех
// языках продукта. Заметить это по коду нельзя: строка выглядит как строка, а
// сторож словарей проверяет только те файлы, что ему назвали.
//
// 🔒 ЯЗЫКОВ ПОКА ДВА, И ЭТО ЧЕСТНОЕ СОСТОЯНИЕ, А НЕ ЗАКОНЧЕННОЕ. По устройству
// продукта окно переиспользуемое, значит ему положены все 82. Сочинять
// восемьдесят языков я не имею права — канон проекта говорит прямо: агент
// готовит два конца обмена, а не середину. Поэтому словарь заведён в форме,
// пригодной для обмена (тип здесь, слова в JSON рядом) и зарегистрирован в
// `DICTS` (`scripts/i18n-export.mjs`):
//
//   npm run i18n:export image-cropper --langs <языки>
//   npm run i18n:import image-cropper <ответ модели>
//
// До прихода перевода словарь НЕ вносится в `scripts/check-i18n.mjs`: список
// сторожа объявляет, сколько языков файл ОБЯЗАН нести, и записать туда «два»
// значило бы узаконить недоделку.

export type ImageCropperUi = {
  title: string
  scale: string
  cancel: string
  apply: string
}

const UI = words as Record<string, ImageCropperUi>

export function imageCropperUi(lang: string): ImageCropperUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

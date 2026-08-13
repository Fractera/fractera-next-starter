// Объявление заставок iOS (шаг 504). СЕРВЕРНЫЙ компонент: чистая разметка.
//
// ЗАЧЕМ. Приложение, установленное на iPhone, показывает при запуске картинку
// `apple-touch-startup-image`. Её нет — Safari рисует БЕЛЫЙ ЭКРАН: на тёмной теме
// запуск выглядит как вспышка и поломка, и это первое, что видит пользователь
// после установки.
//
// ПОЧЕМУ ЭТОГО ОБЫЧНО НЕ ДЕЛАЮТ. Android берёт цвет фона из манифеста и картинки
// не требует. iOS требует РАСТР под каждое разрешение и выбирает его медиа-
// запросом: ширина, высота, плотность пикселей и ориентация. Один файл не
// подойдёт ни одному устройству, кроме своего.
//
// Картинки рисует `npm run icons:default` вместе с иконками — тем же нейтральным
// знаком на фоне темы, без букв и чужого логотипа.
//
// 🔒 СПИСОК ЖИВЁТ ЗДЕСЬ ОДИН РАЗ. Он же — источник имён файлов для генератора:
// разойдись они, и часть устройств получила бы ссылку на несуществующую картинку,
// то есть тот же белый экран, только незаметно. Проверку делает `check:pwa`.

// `w` и `h` — размеры В ПИКСЕЛЯХ УСТРОЙСТВА; медиа-запрос работает с логическими
// точками, поэтому ширина делится на плотность.
export const IOS_SPLASH = [
  { name: 'iphone-15-pro-max', w: 1290, h: 2796, dpr: 3 },
  { name: 'iphone-15', w: 1179, h: 2556, dpr: 3 },
  { name: 'iphone-13', w: 1170, h: 2532, dpr: 3 },
  { name: 'iphone-x', w: 1125, h: 2436, dpr: 3 },
  { name: 'iphone-xr', w: 828, h: 1792, dpr: 2 },
  { name: 'iphone-8', w: 750, h: 1334, dpr: 2 },
  { name: 'ipad', w: 1536, h: 2048, dpr: 2 },
  { name: 'ipad-pro-11', w: 1668, h: 2388, dpr: 2 },
  { name: 'ipad-pro-12', w: 2048, h: 2732, dpr: 2 },
] as const

export function IosSplash() {
  return (
    <>
      {IOS_SPLASH.flatMap(d => {
        const w = d.w / d.dpr
        const h = d.h / d.dpr
        return [
          <link
            key={`${d.name}-p`}
            rel="apple-touch-startup-image"
            href={`/splash/${d.name}-portrait.png`}
            media={`(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d.dpr}) and (orientation: portrait)`}
          />,
          <link
            key={`${d.name}-l`}
            rel="apple-touch-startup-image"
            href={`/splash/${d.name}-landscape.png`}
            media={`(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d.dpr}) and (orientation: landscape)`}
          />,
        ]
      })}
      {/* Полоса состояния сливается с заставкой и с сайтом, иначе поверх тёмного
          фона остаётся светлая планка с чужим цветом. */}
      {/* Оба имени, и оба нужны. `mobile-web-app-capable` — современное,
          стандартное, его и требует браузер; `apple-…` объявлен устаревшим, но
          старые iOS понимают ТОЛЬКО его, а именно они и есть та половина
          устройств, ради которой заставки выше вообще написаны. Убрать старое
          значит потерять полноэкранный запуск там, где он единственный работал. */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </>
  )
}

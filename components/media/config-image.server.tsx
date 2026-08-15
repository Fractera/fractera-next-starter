import { configImagePair, type ImageSlot } from '@/lib/config-images'
import { StaticImage } from '@/components/media/static-image.server'

// Картинка слота настроек — с парой под тему.
//
// 🔒 ПОЧЕМУ ДВА ЭЛЕМЕНТА, А НЕ ОДИН С ПОДМЕНОЙ АДРЕСА. Тему выбирает браузер уже
// после того, как сервер отдал HTML: класс `.dark` ставит инлайн-скрипт по
// сохранённому выбору человека. Сервер этого выбора не знает и знать не может —
// значит обязан отдать ОБА варианта и позволить теме показать нужный. Попытка
// «угадать тему на сервере» даёт вспышку чужого тона при каждой загрузке.
//
// 🔒 СВЕТЛЫЙ — ПЕРВЫЙ, ТЁМНЫЙ — ПОД `dark:`. С выключенным JavaScript класс
// `.dark` не появляется никогда, и страница остаётся светлой. Порядок наоборот
// дал бы чёрный прямоугольник на белом листе — причём именно на странице ошибки,
// где посетителю и так плохо.
//
// Слот пуст (владелец очистил его намеренно) — не рисуется ничего. Пустая рамка
// на месте картинки читается как поломка страницы, а не как «картинки нет».

type Props = {
  slot: ImageSlot
  alt: string
  className?: string
  sizes?: string
  /** Первый экран — грузить сразу. Для страниц ошибок оставить выключенным. */
  priority?: boolean
}

export function ConfigImage({ slot, alt, className, sizes, priority }: Props) {
  const { light, dark } = configImagePair(slot)
  if (!light && !dark) return null

  // Один из тонов не заполнен — показываем второй в обеих темах: картинка не по
  // тону лучше, чем её отсутствие на половине страниц.
  const lightSrc = light ?? dark
  const darkSrc = dark ?? light
  const sameFile = lightSrc === darkSrc

  if (sameFile && lightSrc) {
    return <StaticImage src={lightSrc} alt={alt} className={className} sizes={sizes} priority={priority} />
  }

  // Показ решают ОБЁРТКИ, а не сами картинки: `StaticImage` отдаёт `next/image`,
  // который в разных ветках рисует разную обвязку, и вешать на него ещё и
  // управление видимостью значит зависеть от этой обвязки.
  return (
    <>
      <span className="contents dark:hidden">
        <StaticImage src={lightSrc!} alt={alt} sizes={sizes} priority={priority} className={className} />
      </span>
      {/* Вторая копия того же смысла — от чтения с экрана она скрыта: иначе
          человек услышал бы одно описание дважды, на каждой странице ошибки. */}
      <span aria-hidden className="hidden dark:contents">
        <StaticImage src={darkSrc!} alt="" sizes={sizes} priority={priority} className={className} />
      </span>
    </>
  )
}

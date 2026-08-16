import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Ряд мер: одна строка, ячейка на меру, в каждой число и слово при нём.
//
// 🔒 ПОЧЕМУ ЭТО НЕ `<table>`, ХОТЯ ВЫГЛЯДИТ КАК СТРОКА ТАБЛИЦЫ. Таблица заявляет
// связь между строками и столбцами: у ячейки есть заголовок столбца и заголовок
// строки, и читалка с экрана произносит их вместе. Здесь связи нет — есть три
// независимые пары «число → что оно значит», и это ровно определение списка
// определений (`<dl>`). Разметка, обещающая связь, которой нет, врёт не глазу, а
// тому, кто страницу не видит.
//
// 🔒 ЧИСЛО НАД СЛОВОМ, А НЕ РЯДОМ. Взгляд по странице идёт сверху вниз: три
// крупных числа в ряд читаются за один такт, и только потом глаз спускается за
// пояснением. Поставь их в строку со словами — и ряд превратится в три фразы,
// которые надо читать.
//
// 🔒 РАЗДЕЛИТЕЛЬ МЕНЯЕТ ОСЬ ВМЕСТЕ С РАСКЛАДКОЙ. На телефоне ячейки стоят
// столбиком, и вертикальная черта между ними разрезала бы текст поперёк чтения.
export const metrics: SectionRenderer<'metrics'> = (b, { key: k }) => (
  <dl
    key={k}
    className="my-8 grid divide-y divide-border overflow-hidden rounded-2xl border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0"
  >
    {b.items.map((item, i) => (
      <div key={`${k}-${i}`} className="flex flex-col items-center gap-2 px-5 py-7 text-center">
        {/* Число — самое крупное на секции и цветом акцента: это и есть
            утверждение, слово под ним лишь объясняет, к чему оно относится. */}
        <dt className="text-4xl font-semibold leading-none tracking-tight text-primary md:text-5xl">
          {item.value}
        </dt>
        <dd className="text-sm leading-relaxed text-muted-foreground">
          {inline(item.label, `${k}-${i}-l`)}
        </dd>
      </div>
    ))}
  </dl>
)

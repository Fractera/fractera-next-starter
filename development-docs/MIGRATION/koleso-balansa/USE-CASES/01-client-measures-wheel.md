# Клиент измеряет сферу жизни

**Сценарий.** Клиент заводит сферу («Здоровье»), делит её на сегменты и раз в период ставит каждому
оценку с комментарием. Из оценок собирается колесо баланса: видно, какая сфера просела.

**Откуда прочитано.** `prisma/schema.prisma` — модели `Area`, `Segments`, `CompletedSegments`;
`app/api/segments/route.ts`, `app/api/segments/completed-segments/route.ts`.

```ts
// app/api/segments/completed-segments/route.ts — замер сегмента
const { date, value, clerkUserId, segmentsId, comment } = body;
```

```prisma
model CompletedSegments {
  id String @id @default(cuid())
  date String
  value Int
  comment String?
  segmentsId String
  clerkUserId String
}
```

**Что переносится.** Сфера → сегменты → замеры, агрегат для колеса.

🔒 **Чего НЕ повторяем.** Владелец записи определяется по `clerkUserId` **из тела запроса**: кто прислал
чужой идентификатор, тот и получил чужие данные. У нас владелец берётся из сессии, и тело запроса на это
не влияет никогда. Даты хранятся строкой (`date String`) — у нас это дата базы, иначе сортировка и
периоды считаются лексикографически.

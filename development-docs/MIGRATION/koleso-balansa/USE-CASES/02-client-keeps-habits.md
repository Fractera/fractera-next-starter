# Клиент ведёт привычки

**Сценарий.** Внутри сферы клиент заводит привычку, задаёт расписание (дни недели или число раз) и
отмечает выполнение дня. Из отметок растёт «пульс дня» и статистика активностей.

**Откуда прочитано.** Модели `Activities`, `Frequency`, `CompletedDays`; `app/api/activities/route.ts`,
`app/api/activities/completed-days/route.ts`; экраны `app/dashboard/activities`,
`app/dashboard/statistic-puls-dnya`.

```prisma
model Frequency {
  type String
  days String[]
  number Int
  activitiesId String
}
```

**Что переносится.** Привычка, расписание, отметка дня, ряды для двух экранов статистики.

🔒 **Чего НЕ повторяем.** Напоминания жили полями `notificationTime` / `isNotificationOn` прямо в
таблице и никем не рассылались. У нас напоминание — задача канала платформы; поле в таблице хранит
только желание пользователя, а доставку делает канал.

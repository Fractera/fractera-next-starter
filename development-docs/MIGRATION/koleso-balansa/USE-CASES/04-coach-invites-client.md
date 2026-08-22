# Коуч приглашает клиента

**Сценарий.** Коуч выпускает приглашение и передаёт ссылку клиенту. Клиент по ней попадает в свой
кабинет, уже связанный с коучем.

**Откуда прочитано.** Модель `Invite`, `app/api/invite-generate/route.ts`, `app/page.tsx`.

```ts
// app/api/invite-generate/route.ts
const newClerkUserId = `appUserId_${uuidv4()}`;
await prismadb.invite.create({ data: { clerkUserId: newClerkUserId } });
```

```tsx
// app/page.tsx — приглашение опознаётся так
const clerkUserId = urlParams.get("clerkUserId");
if (clerkUserId?.startsWith("appUserId")) localStorage.setItem("clerkUserId", clerkUserId);
```

**Что переносится.** Само приглашение: коуч выпускает — клиент приходит связанным.

🔒 **Чего НЕ повторяем — это главная дыра оригинала.** Личность здесь берётся из адресной строки и
кладётся в `localStorage`: кто подставил чужой идентификатор, тот и вошёл. У нас приглашение — одноразовый
код, который **обменивается на сессию** в слое авторизации; ни `localStorage`, ни параметр адреса
личностью не являются.

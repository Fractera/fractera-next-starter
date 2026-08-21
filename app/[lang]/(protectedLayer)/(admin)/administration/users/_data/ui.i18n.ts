// Слова страницы УЧЁТНЫХ ЗАПИСЕЙ — каркас: заголовок, объяснение, отказ.
//
// 🔒 ЗДЕСЬ ДВА ЯЗЫКА, А У СОСЕДЕЙ 82 — И ЭТО ЗАПИСАННЫЙ ДОЛГ, А НЕ ДЫРА
// (решение владельца 2026-08-21). Правило проекта: в разработке пишем на
// включённом наборе, а недостающие языки заносим в
// `development-docs/TRANSLATION-DEBT.md` и закрываем отдельным прогоном в конце.
// Строка про эту страницу там уже стоит.
//
// Почему не заполнить 82 руками: матрица на 82 языка заполняется МАШИННО —
// `npm run i18n:export` → внешняя модель перевода → `npm run i18n:import`,
// который сверяет ключи и подстановки. Восемьдесят языков, написанных по памяти,
// выглядят как перевод и не являются им; проверить их здесь нечем.
//
// Класс словаря при этом тот же, что у соседей: страница ЕДЕТ С ПРОДУКТОМ, а не
// пишется под проект, поэтому её долг — 82, а не десять.

export type AdministrationUsersUi = {
  title: string
  subtitle: string
  /** Почему страница доступна одной роли — человек видит причину, а не пустоту. */
  roleNote: string
}

const DICT: Record<string, AdministrationUsersUi> = {
  en: {
    title: "User accounts",
    subtitle: "Who has access to this project, and with which roles.",
    roleNote:
      "Accounts live in the authentication service, not in this application: there is no second copy of people here. Only an architect may open this page and change a role.",
  },
  ru: {
    title: "Учётные записи",
    subtitle: "У кого есть доступ к этому проекту и с какими ролями.",
    roleNote:
      "Записи живут в службе авторизации, а не в этом приложении: второй копии людей здесь нет. Открыть страницу и изменить роль вправе только архитектор.",
  },
}

export function administrationUsersUi(lang: string): AdministrationUsersUi {
  return DICT[lang] ?? DICT.en
}

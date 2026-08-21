// Слова виджета «таблица учётных записей» — СВОИ, а не общие с соседними
// таблицами. Четыре таблицы товаров намеренно разошлись (шаг 521); эта — пятая
// по счёту и первая не про товары, и общего словаря у неё быть не может тем
// более: у неё другие колонки и другое действие.
//
// 🔒 ДВА ЯЗЫКА ВМЕСТО ДЕСЯТИ — ЗАПИСАННЫЙ ДОЛГ (решение владельца 2026-08-21).
// Виджету положен страничный набор из десяти; сейчас написан включённый набор
// проекта, а недостающие восемь стоят строкой в
// `development-docs/TRANSLATION-DEBT.md`.

export type UsersTableUi = {
  reveal: string
  loading: string
  empty: string
  searchPlaceholder: string
  search: string
  colAccount: string
  colRoles: string
  colProvider: string
  colCreated: string
  colLastSeen: string
  /** Запись заведена, а вход не состоялся ни разу. */
  lastSeenNever: string
  /**
   * Служба не прислала колонку. Отдельная строка, а не та же, что выше:
   * «мы не знаем» и «человек не заходил» — разные ответы, и владелец просит
   * колонку ровно затем, чтобы их различать.
   */
  lastSeenUnknown: string
  edit: string
  save: string
  cancel: string
  saved: string
  failed: string
  forbidden: string
  unreachable: string
  rolesRequired: string
  total: string
  prev: string
  next: string
  first: string
  last: string
  /** «страница {page} из {pages}» — подстановки обязательны обе. */
  pageOf: string
  /** Заголовок над таблицей — как у соседних списков продукта. */
  tableTitle: string
  /** Подсказка под скелетоном: почему данных пока нет. */
  revealHint: string
}

const DICT: Record<string, UsersTableUi> = {
  en: {
    reveal: "Show accounts",
    loading: "Loading accounts…",
    empty: "No accounts match this search.",
    searchPlaceholder: "email or nickname",
    search: "Search",
    colAccount: "Account",
    colRoles: "Roles",
    colProvider: "Signed in with",
    colCreated: "Created",
    colLastSeen: "Last seen",
    lastSeenNever: "Never signed in",
    lastSeenUnknown: "Not reported",
    edit: "Change roles",
    save: "Save",
    cancel: "Cancel",
    saved: "Roles changed.",
    failed: "Could not load the accounts.",
    forbidden: "Only an administrator or an architect may see and change accounts.",
    unreachable: "The authentication service did not answer.",
    rolesRequired: "An account keeps at least one role.",
    total: "accounts",
    prev: "Previous page",
    next: "Next page",
    first: "First page",
    last: "Last page",
    pageOf: "page {page} of {pages}",
    tableTitle: "Accounts",
    revealHint: "Nothing is requested until you ask — the page opens instantly and costs the service nothing.",
  },
  ru: {
    reveal: "Показать записи",
    loading: "Загружаем записи…",
    empty: "По этому запросу записей нет.",
    searchPlaceholder: "почта или имя",
    search: "Искать",
    colAccount: "Запись",
    colRoles: "Роли",
    colProvider: "Вход через",
    colCreated: "Заведена",
    colLastSeen: "Последний вход",
    lastSeenNever: "Ни разу не заходил",
    lastSeenUnknown: "Нет данных",
    edit: "Изменить роли",
    save: "Сохранить",
    cancel: "Отмена",
    saved: "Роли изменены.",
    failed: "Не удалось загрузить записи.",
    forbidden: "Видеть и менять записи вправе администратор и архитектор.",
    unreachable: "Служба авторизации не ответила.",
    rolesRequired: "У записи остаётся хотя бы одна роль.",
    total: "записей",
    prev: "Предыдущая страница",
    next: "Следующая страница",
    first: "Первая страница",
    last: "Последняя страница",
    pageOf: "страница {page} из {pages}",
    tableTitle: "Записи",
    revealHint: "Пока не попросите, ничего не запрашивается — страница открывается мгновенно и не стоит службе ничего.",
  },
}

export function usersTableUi(lang: string): UsersTableUi {
  return DICT[lang] ?? DICT.en
}

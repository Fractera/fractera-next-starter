import type { ProductDossier } from "@/config/products-config.defaults"

// СЛОВА ДОСКИ КЕЙСОВ (34-E, 2026-08-29).
//
// 🔒 ПЕРЕНЕСЕНЫ ИЗ СЛОВАРЯ ПАНЕЛИ ДОСЛОВНО — ветки `useCases` и `productPage`.
// Это тексты, которые владелец правил год; переписать их при переносе значило бы
// подменить принятое своим, а человек, знавший панель, увидел бы другой продукт.
//
// 🔒 СЛОВАРЬ СЕРВЕРНЫЙ — общий закон слоя: строки едут островку пропсами.

export type CasesUi = {
  draft: string
  confirmed: string
  confirm: string
  unconfirm: string
  confirmAll: string
  confirmedAll: string
  edit: string
  save: string
  saving: string
  cancel: string
  remove: string
  removeConfirm: string
  remarkTitle: string
  remarkPlaceholder: string
  rewrite: string
  rewriting: string
  failed: string
  savedCase: string
  noKey: string
  titleLabel: string
  summaryLabel: string
  gateMissing: string
  gateUnconfirmed: string
  gateReady: string
  added: string
  p_addCase: string
  p_addCaseTitle: string
  p_addCaseHint: string
  p_addCaseName: string
  p_addCaseSummary: string
  p_addCaseSave: string
  p_addCaseCancel: string
  p_addCaseSaved: string
  p_saving: string
  p_failed: string
}

const en: CasesUi = {
    draft: "not confirmed",
    confirmed: "confirmed",
    confirm: "Confirm",
    unconfirm: "Withdraw confirmation",
    confirmAll: "Confirm all",
    confirmedAll: "All cases confirmed",
    edit: "Edit",
    save: "Save",
    saving: "Saving…",
    cancel: "cancel",
    remove: "delete",
    removeConfirm: "Delete this case?",
    remarkTitle: "Or say what is wrong with it — the model rewrites the case",
    remarkPlaceholder: "e.g. it is not the manager who does this, it is the client — and there is no email",
    rewrite: "Rewrite",
    rewriting: "Rewriting…",
    failed: "Could not do that",
    savedCase: "Case saved — it went back to unconfirmed, read it once more",
    noKey: "The Quiz needs an OpenAI key — add it in the OpenAI section, then come back.",
    titleLabel: "Title",
    summaryLabel: "The scenario",
    gateMissing: "No user cases yet — development does not start without them. Answer the questions below; the Quiz turns your answers into cases.",
    gateUnconfirmed: "{confirmed} of {total} cases confirmed. The rest are still the model's guesses — read them and confirm, or correct them first.",
    gateReady: "All {total} cases are confirmed. This is what the agent builds against.",
    added: "{n} cases added — each waiting for your confirmation.",
    p_addCase: "Add a case by hand",
    p_addCaseTitle: "New use case",
    p_addCaseHint: "One scenario in your own words: who uses the product, what brought them, what must be true when they are done.",
    p_addCaseName: "Title",
    p_addCaseSummary: "Scenario",
    p_addCaseSave: "Add",
    p_addCaseCancel: "Cancel",
    p_addCaseSaved: "Case added as a draft",
    p_saving: "Saving…",
    p_failed: "Did not work out",
}

const ru: CasesUi = {
    draft: "не подтверждён",
    confirmed: "подтверждён",
    confirm: "Подтвердить",
    unconfirm: "Снять подтверждение",
    confirmAll: "Подтвердить все",
    confirmedAll: "Все кейсы подтверждены",
    edit: "Править",
    save: "Сохранить",
    saving: "Сохраняю…",
    cancel: "отмена",
    remove: "удалить",
    removeConfirm: "Удалить этот кейс?",
    remarkTitle: "Или скажите, что с ним не так, — модель перепишет кейс",
    remarkPlaceholder: "например: это делает не менеджер, а клиент, и почты у него нет",
    rewrite: "Переписать",
    rewriting: "Переписываю…",
    failed: "Не удалось",
    savedCase: "Кейс сохранён — он снова не подтверждён, перечитайте его",
    noKey: "Quiz нужен ключ OpenAI — добавьте его в разделе OpenAI и вернитесь.",
    titleLabel: "Заголовок",
    summaryLabel: "Сценарий",
    gateMissing: "Кейсов ещё нет — без них разработка не начинается. Ответьте на вопросы ниже, а Quiz превратит ваши ответы в кейсы.",
    gateUnconfirmed: "Подтверждено {confirmed} из {total}. Остальные пока догадки модели — прочитайте и подтвердите либо сначала поправьте.",
    gateReady: "Все {total} кейсов подтверждены. Именно по ним агент и строит.",
    added: "Добавлено кейсов: {n} — каждый ждёт вашего подтверждения.",
    p_addCase: "Дописать кейс руками",
    p_addCaseTitle: "Новый пользовательский кейс",
    p_addCaseHint: "Один сценарий вашими словами: кто пользуется продуктом, что его привело, что должно быть верно, когда он закончил.",
    p_addCaseName: "Заголовок",
    p_addCaseSummary: "Сценарий",
    p_addCaseSave: "Добавить",
    p_addCaseCancel: "Отмена",
    p_addCaseSaved: "Кейс добавлен черновиком",
    p_saving: "Сохраняю…",
    p_failed: "Не получилось",
}

const DICT: Record<string, CasesUi> = { en, ru }

export function casesUi(lang: string): CasesUi {
  return DICT[lang] ?? DICT[lang.slice(0, 2)] ?? DICT.en
}

/** Строка досье в том виде, в каком её показывает доска. */
export type ProductRow = ProductDossier

import { ENTRY_KINDS } from "@/lib/products/telegram-desk/branches/capture"
import { INTENTS } from "@/lib/products/telegram-desk/route-intent"
import { ARTIFACT_KINDS } from "@/lib/products/telegram-desk/artifact-kinds"
import type { Fact } from "./types"

// ВСТРОЕННЫЕ ПРИЗНАКИ — ПОРОЖДАЮТСЯ ИЗ СВОИХ ИСТОЧНИКОВ (81-1).
//
// 🔒 НИ ОДНО ИМЯ ЗДЕСЬ НЕ НАПИСАНО РУКАМИ ТАМ, ГДЕ ЕГО МОЖНО ВЗЯТЬ ИЗ КОДА.
// Рода сущностей приходят из `ENTRY_KINDS`, намерения — из `INTENTS`, места
// назначения — из `ARTIFACT_KINDS`. Добавили род в источник — он появился в
// реестре сам, и никто не обязан об этом помнить.
//
// ✗ ЭТОТ КЛАСС ОШИБКИ ОПЛАЧЕН В ПРОЕКТЕ ТРИЖДЫ ЗА ТРИ ДНЯ: инструкция говорила
// «пять инструментов» при шести папках, «шесть разделов» при семи, «пять родов
// вложений» при шести. Список, написанный руками, расходится с кодом МОЛЧА, и
// разбудить некому.
//
// 🔒 ЧТО ВСЁ-ТАКИ НАПИСАНО РУКАМИ И ПОЧЕМУ ЭТО ЗАКОННО. Из кода порождаются
// ИМЕНА; человеческое описание, инструкция узнавания и поведение при неудаче
// взять неоткуда — их не существует в источниках. Это ровно та половина, ради
// которой реестр и заводится: код знает, ЧТО есть, и не знает, КАК это узнавать.
// Поэтому имена порождены, а тексты написаны — и расхождение невозможно там, где
// оно опасно.
//
// 🔒 УРОВЕНЬ «field» ОПИСЫВАЕТ КОЛОНКИ `tgdesk_messages`, и они перечислены здесь
// поимённо намеренно: колонка — это не список, из неё нельзя вывести смысл. Зато
// расхождение видно сразу: колонка есть, признака нет — значит поле заполняется
// и никем не объявлено.

/** Признак, который система умеет сегодня. Порождается, а не хранится. */
export function builtinFacts(): Fact[] {
  return [
    ...materialFacts(),
    ...intentFacts(),
    ...entityFacts(),
    ...destinationFacts(),
    ...fieldFacts(),
  ]
}

/** Чем сообщение пришло. Известно до всякого разбора — из самого канала. */
function materialFacts(): Fact[] {
  const known: Record<string, { title: string; description: string; howToFind: string }> = {
    text: {
      title: "Печатный текст",
      description: "Человек написал сообщение буквами.",
      howToFind: "Канал отдаёт сообщение без вложения звука.",
    },
    voice: {
      title: "Голосовое сообщение",
      description:
        "Человек надиктовал. Служба расшифровывает запись, и дальше по потоку она неотличима от печатного текста — отличие видно только здесь.",
      howToFind: "Канал отдаёт вложение звука; служба возвращает расшифровку.",
    },
  }
  return Object.entries(known).map(([key, t]) => ({
    key: `material.${key}`,
    level: "material" as const,
    title: t.title,
    description: t.description,
    valueType: "flag" as const,
    howToFind: t.howToFind,
    storedIn: "tgdesk_messages.raw_kind",
    onMissing: "silent" as const,
    builtin: true,
    enabled: true,
  }))
}

/** Зачем сообщение пришло. Первый вызов модели: маршрутизатор намерений. */
function intentFacts(): Fact[] {
  const said: Record<string, string> = {
    capture: "Человек рассказывает о случившемся — это сохраняется.",
    question: "Спрашивает о собственной жизни: что покупал, обещал, тратил.",
    schedule: "Просит напомнить или поставить событие в календарь.",
    confirm: "Соглашается или отказывается — и больше ничего.",
    correct: "Поправляет то, что система предложила: другую дату, другую сумму.",
    where: "Отвечает на вопрос, где он живёт, — для часового пояса.",
    meta: "Спрашивает о самой системе: кто ты, что умеешь.",
    command: "Команда, начинается с косой черты.",
  }
  return INTENTS.map(key => ({
    key: `intent.${key}`,
    level: "intent" as const,
    title: key,
    description: said[key] ?? "",
    valueType: "flag" as const,
    howToFind: "Маршрутизатор намерений спрашивает модель одним коротким вопросом и получает имя ветви.",
    storedIn: "ветвь обработки; в базе не хранится",
    onMissing: "silent" as const,
    builtin: true,
    enabled: true,
  }))
}

/** Чем сообщение оказалось. Второй вызов модели: разбор рассказа. */
function entityFacts(): Fact[] {
  const said: Record<string, string> = {
    memo: "Просьба запомнить нечто как есть.",
    note: "Заметка: факт, который стоит сохранить.",
    task: "Задача — то, что человек собирается сделать.",
    receipt: "Чек или покупка: сумма, продавец, предмет.",
    place: "Место — адрес, заведение, точка на карте.",
    idea: "Идея, замысел, мысль на будущее.",
  }
  return ENTRY_KINDS.map(key => ({
    key: `entity.${key}`,
    level: "entity" as const,
    title: key,
    description: said[key] ?? "",
    valueType: "text" as const,
    howToFind: "Разбор рассказа возвращает род сущности и её поля.",
    storedIn: "tgdesk_entries.kind",
    onMissing: "silent" as const,
    builtin: true,
    enabled: true,
  }))
}

/** Куда сообщение уехало после разбора. */
function destinationFacts(): Fact[] {
  const said: Record<string, { title: string; description: string }> = {
    media: { title: "Медиатека", description: "Присланный файл сохранён и доступен по имени." },
    vector: { title: "Векторный склад", description: "Смысл сообщения записан для поиска по смыслу, а не по словам." },
    rag: { title: "Граф знаний", description: "Конверт сообщения ушёл в граф: источник, автор, время, признаки, суть." },
  }
  return ARTIFACT_KINDS.map(key => ({
    key: `destination.${key}`,
    level: "destination" as const,
    title: said[key]?.title ?? key,
    description: said[key]?.description ?? "",
    valueType: "link" as const,
    howToFind: "Отметка ставится обработкой, когда отправка прошла; отказ пишется в заметки сообщения.",
    storedIn: "tgdesk_artifacts.kind",
    onMissing: "silent" as const,
    builtin: true,
    enabled: true,
  }))
}

/**
 * Что извлечено ИЗ содержимого. Это и есть признаки в узком смысле — те, о
 * которых владелец говорил на примере про пирожки.
 *
 * 🔒 ПЕРВЫМ СТОИТ СВЯЗЬ, И ОНА ОБЯЗАТЕЛЬНА. Слово владельца 2026-09-01: «должен
 * быть всегда и у всех по умолчанию, как минимум это связанные сообщения».
 * 🛑 И ТУТ ЖЕ НАЗВАНА ЕЁ ГРАНИЦА: сегодня связь ищется ПО ВРЕМЕНИ — окно 180
 * секунд, — а не по смыслу. «Фотография, которую я отправлял недавно» найдётся,
 * только если она пришла в последние три минуты. Признак, описанный честно,
 * показывает свой предел; описанный красиво — обещает то, чего нет.
 */
function fieldFacts(): Fact[] {
  return [
    {
      key: "field.link",
      level: "field",
      title: "Связь с другим сообщением",
      description:
        "Сообщения одного разговора, идущие подряд. Человек говорит «эту фотографию», «то место» — и без связи вторая фраза теряет предмет первой.",
      valueType: "link",
      howToFind:
        "Сегодня — по времени: соседнее сообщение того же чата в пределах 180 секунд. По смыслу пока не ищется.",
      storedIn: "tgdesk_messages.bundle",
      onMissing: "join",
      builtin: true,
      enabled: true,
      required: true,
    },
    {
      key: "field.happened",
      level: "field",
      title: "Когда это случилось",
      description:
        "Дата события отдельно от даты рассказа. «Вчера купил» кладётся под вчерашнее число, а не под минуту разговора.",
      valueType: "date",
      howToFind: "Разбор возвращает дату события, если она названа словами: вчера, в понедельник, третьего числа.",
      storedIn: "tgdesk_messages.happened_unix",
      onMissing: "silent",
      builtin: true,
      enabled: true,
    },
    {
      key: "field.money",
      level: "field",
      title: "Тут про деньги",
      description:
        "Отметка, что в сообщении речь о цене, оплате или заработке. По ней «покажи траты» отвечается условием, а не перечитыванием года переписки.",
      valueType: "flag",
      howToFind: "Разбор ставит отметку, когда упомянута цена, платёж или зарплата.",
      storedIn: "tgdesk_messages.has_financial",
      onMissing: "silent",
      builtin: true,
      enabled: true,
    },
    {
      key: "field.geo",
      level: "field",
      title: "Координаты",
      description:
        "Точка на карте, присланная Telegram. Слово «здесь» координатами не становится — сегодня их даёт только настоящая геометка.",
      valueType: "geo",
      howToFind: "Канал присылает широту и долготу вложением.",
      storedIn: "tgdesk_messages.lat, tgdesk_messages.lon",
      onMissing: "ask",
      builtin: true,
      enabled: true,
    },
    {
      key: "field.forwarded",
      level: "field",
      title: "Переслано от",
      description: "Кто автор пересланного сообщения. Важно, когда человек передаёт чужие слова.",
      valueType: "text",
      howToFind: "Канал сообщает имя исходного отправителя.",
      storedIn: "tgdesk_messages.forwarded_from",
      onMissing: "silent",
      builtin: true,
      enabled: true,
    },
    {
      key: "field.facets",
      level: "field",
      title: "О чём это",
      description:
        "Два-шесть коротких тегов, называющих предмет сообщения словами человека. Сегодня они уезжают только в конверт графа и никуда больше — это готовый поток кандидатов в реестр.",
      valueType: "list",
      howToFind: "Разбор возвращает теги вместе со сводкой.",
      storedIn: "нигде: печатается в конверт графа",
      onMissing: "silent",
      builtin: true,
      enabled: true,
    },
  ]
}

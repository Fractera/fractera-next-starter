import { openAiKey } from "@/lib/openai-key"
import { SOCIAL_BRANDS } from "@/lib/socials/catalogue"
import type { SocialCandidate, SocialOutcome, SocialResolveResult } from "../types/socials-ai"

// РАСПОЗНАВАНИЕ СОЦСЕТИ — ПОЛНЫЙ ЦИКЛ, А НЕ ОЦИФРОВКА НАЗВАНИЯ (31-25, 2026-08-29).
//
// Перенос из панели управления (`bridges/app/app/api/config/social-resolve`), где
// эта способность живёт с шага 523. Перенесена ЦЕЛИКОМ, по слову владельца, с
// одним содержательным отличием — про значок, оно ниже.
//
// 🔒 ЗАЧЕМ ЭТО СУЩЕСТВУЕТ. Владелец говорит фразой: «добавь мой Instagram, профиль
// латиницей, транслитерацией, слова через дефис». Из неё надо получить ТРИ разные
// вещи, и ни одну нельзя добыть полем ввода:
//   • какая это сеть — «телеграм», «Telegram», «tg» пишут по-разному, а правило
//     ссылки и значок надо взять одни и те же;
//   • как у этой сети собирается адрес — `t.me/<псевдоним>`, `wa.me/<номер>`, у
//     LinkedIn личный профиль это `/in/`, а не `/company/`;
//   • какой именно профиль имелся в виду — из описания рождается несколько
//     кандидатов, и выбрать обязан ЧЕЛОВЕК, а не модель.
//
// 🔒 ОТВЕТ ПРЕДЛАГАЕТСЯ, А НЕ ПРИМЕНЯЕТСЯ. Функция ничего не пишет в конфиг: она
// возвращает предложение, а сохраняет его владелец, посмотрев на имя, значок и
// пример собранной ссылки.
//
// 🔒 ОТЛИЧИЕ ОТ ПАНЕЛИ: ЗНАЧОК БЕРЁТСЯ ИЗ СВОЕГО КАТАЛОГА, А НЕ КАЧАЕТСЯ ИЗВНЕ.
// Панель просит у модели `simple-icons`-слаг и скачивает картинку с чужого хоста
// отдельной дверью. Здесь это было бы шагом назад: у нас десять значков нарисовано
// в коде (`components/icons/socials.tsx`), они живут по законам темы и не требуют
// сети. Модель по-прежнему называет слаг, но он СОПОСТАВЛЯЕТСЯ с каталогом; сеть
// вне десятки заводится без значка — законное состояние, а не отказ.

const KNOWN_KEYS = SOCIAL_BRANDS.map(b => b.key).join(", ")

/** Слаг модели → ключ нашего каталога. Неизвестный слаг даёт пустую строку. */
function toIconKey(slug: unknown): string {
  const s = String(slug ?? "").trim().toLowerCase()
  if (!s) return ""
  if (SOCIAL_BRANDS.some(b => b.key === s)) return s
  // Историческое имя: сеть переименовалась, а модели её знают по-старому.
  if (s === "twitter") return "x"
  return ""
}

/**
 * Чем закончилась проверка адреса.
 *
 * Разбор намеренно грубый и честный: мы не притворяемся, что умеем отличить
 * «нет такого профиля» от «нас не пустили», когда сеть отвечает одинаково.
 */
function classify(code: number | null): SocialOutcome {
  if (code === null) return "closed" // не ответила вовсе — судить не о чем
  if (code === 404 || code === 410) return "absent"
  if (code >= 200 && code < 300) return "exists"
  if (code === 401 || code === 403 || code === 429) return "closed"
  if (code >= 300 && code < 400) return "closed" // увела на вход — значит закрыта
  return "closed"
}

/**
 * Значение внутри адреса: кодируем ТОЛЬКО то, что действительно опасно.
 *
 * 🔒 `encodeURIComponent` ЛОМАЕТ НОМЕРА ТЕЛЕФОНОВ (замер 2026-08-21). Она считает
 * небезопасным `+`, хотя в пути он законен, и превращает его в `%2B`: номер
 * `+79161234567` становился адресом `wa.me/%2B79161234567` — ссылка выглядит
 * правильной и не работает. Пострадала бы любая сеть, где значение это номер.
 */
function encodeValue(v: string): string {
  return encodeURIComponent(v).replace(/%2B/g, "+").replace(/%40/g, "@")
}

async function probe(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "Mozilla/5.0 (compatible; FracteraSocialCheck/1.0)" },
      signal: AbortSignal.timeout(6000),
    })
    return res.status
  } catch {
    return null
  }
}

const PROMPT = `You turn a free-form phrase about a social network into a machine record.

Return STRICT JSON only, no prose, with exactly these keys:
{
  "name": "canonical network name as its owner writes it, e.g. Instagram, X, Telegram, LinkedIn",
  "iconSlug": "lowercase slug of the network, e.g. instagram, x, telegram, linkedin",
  "urlTemplate": "profile URL with the literal placeholder {value}, e.g. https://t.me/{value}",
  "valueHint": "what the owner must type, in HIS language: handle without @, phone number, full URL",
  "candidates": ["up to 5 handle guesses derived from the phrase, most likely first"]
}

Rules that matter:
- The URL template must be the form used for the kind of profile the phrase describes. LinkedIn
  personal profiles are /in/, companies are /company/ — choose by the phrase, do not default.
- If the phrase describes how the handle is spelled (transliteration, hyphens, dots), produce the
  spelling variants as candidates: hyphenated, dotted, and joined.
- If the phrase already contains an explicit handle or URL, put it first in candidates.
- If you cannot recognise the network, return "name": "" and leave the rest empty.
- These slugs have a drawn icon here, prefer them when they fit: ${KNOWN_KEYS}.`

const MODEL = process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini"

/** Название языка для модели: она пишет подсказку на языке владельца. */
function languageName(lang: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(lang) ?? lang
  } catch {
    return lang
  }
}

export async function resolveSocial(phrase: string, lang: string): Promise<SocialResolveResult> {
  const key = openAiKey()
  // 🔒 НЕТ КЛЮЧА — ЭТО ФАКТ, А НЕ ПОЛОМКА. Конструктор обязан продолжать работать
  // руками, поэтому причина называется своим именем, а не превращается в ошибку.
  if (!key) return { ok: false, reason: "no-key" }
  if (!phrase.trim()) return { ok: false, reason: "unknown-network" }

  let proposal: {
    name?: string
    iconSlug?: string
    urlTemplate?: string
    valueHint?: string
    candidates?: unknown
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `${PROMPT}\n\nThe owner speaks ${languageName(lang)}; write valueHint in that language.`,
          },
          { role: "user", content: phrase },
        ],
      }),
      signal: AbortSignal.timeout(25000),
    })
    if (!res.ok) {
      // Отказ модели называется своим именем, а не превращается в пустой список.
      return { ok: false, reason: "model", detail: `${res.status} ${(await res.text()).slice(0, 200)}` }
    }
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    proposal = JSON.parse(data.choices?.[0]?.message?.content ?? "{}")
  } catch (e) {
    return { ok: false, reason: "model", detail: String(e).slice(0, 200) }
  }

  if (!proposal?.name) return { ok: false, reason: "unknown-network" }

  const template = String(proposal.urlTemplate ?? "")
  if (!template) return { ok: false, reason: "unknown-network" }

  // Кандидаты проверяются ПАРАЛЛЕЛЬНО и с потолком: пять адресов по шесть секунд
  // последовательно — это полминуты ожидания у человека, сказавшего одну фразу.
  // 🔒 ДУБЛИ УБИРАЮТСЯ ДО ПРОВЕРКИ (замер 2026-08-21). Модель на номере телефона
  // вернула `79161234567` дважды: пять «вариантов написания» превратились в четыре,
  // и человек читал один и тот же адрес в двух строках, ища между ними разницу.
  const raw = [
    ...new Set(
      (Array.isArray(proposal.candidates) ? proposal.candidates : [])
        .map(v => String(v).trim().replace(/^@/, ""))
        .filter(Boolean),
    ),
  ].slice(0, 5)

  const candidates: SocialCandidate[] = await Promise.all(
    raw.map(async value => {
      const url = template.includes("{value}") ? template.replace("{value}", encodeValue(value)) : template
      const code = await probe(url)
      return { value, url, outcome: classify(code), code }
    }),
  )

  return {
    ok: true,
    name: String(proposal.name),
    iconKey: toIconKey(proposal.iconSlug),
    urlTemplate: template,
    valueHint: String(proposal.valueHint ?? ""),
    candidates,
  }
}

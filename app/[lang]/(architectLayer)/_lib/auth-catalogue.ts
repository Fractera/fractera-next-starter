// КАТАЛОГ ПРОВАЙДЕРОВ ВХОДА И РОЛЕЙ — ЧИСТЫЕ ДАННЫЕ (78-5, 2026-09-01).
//
// 🔒 СПИСОК ПРОВАЙДЕРОВ — СНИМОК, И ОН ЧЕСТНО НАЗВАН СНИМКОМ. Порождать его на
// лету нечем: пакет `next-auth` стоит у СЛУЖБЫ ВХОДА, а не в этом приложении, и
// заглянуть в его папку отсюда невозможно ни на сервере, ни тем более на машине
// человека. Значит это единственный случай в проекте, где список пишется руками,
// — и раз так, у него обязаны быть версия и дата, чтобы следующий читатель знал,
// с чем сверяться.
//
// 🔒 ВЗЯТ ИЗ ПЕРВОИСТОЧНИКА, А НЕ ИЗ ПАМЯТИ: перечислены файлы
// `next-auth/providers/*.js` установленного пакета. Без служебных `index` и
// `oauth-types` — они не провайдеры. Пересказ по памяти дал бы правдоподобный
// список, в котором половина имён неверна, а проверить его человеку нечем.
//
// 🔒 ЭТО СПИСОК ВОЗМОЖНОСТЕЙ ПОДЛОЖКИ, А НЕ ОБЕЩАНИЕ ПРОДУКТА. Любой из них
// поддерживает Auth.js; чтобы он появился ЗДЕСЬ, нужна работа — ключи, адрес
// возврата, кнопка на странице входа. Поэтому рядом стоит адрес поддержки, а не
// кнопка «включить».

/** Версия пакета, из которого снят список. */
export const AUTH_LIB = "Auth.js (next-auth) 5.0.0-beta.31"
/** Когда снят. Дата важнее версии: пакет обновляют чаще, чем читают этот файл. */
export const AUTH_LIB_SNAPSHOT = "2026-09-01"

/** Настроены и работают в этом проекте. */
export const PROVIDERS_ON = ["credentials", "google", "resend"] as const

/**
 * Всё, что подложка умеет. 104 записи.
 *
 * Порядок алфавитный намеренно: смысловой группировки у этого списка нет —
 * человек ищет здесь СВОЁ имя, а не изучает классификацию.
 */
export const PROVIDERS_ALL = [
  "42-school", "apple", "asgardeo", "atlassian", "auth0", "authentik", "azure-ad",
  "azure-ad-b2c", "azure-devops", "bankid-no", "battlenet", "beyondidentity", "bitbucket",
  "box", "boxyhq-saml", "bungie", "click-up", "cognito", "coinbase", "concept2",
  "credentials", "descope", "discord", "dribbble", "dropbox", "duende-identity-server6",
  "email", "eventbrite", "eveonline", "facebook", "faceit", "figma", "forwardemail",
  "foursquare", "freshbooks", "frontegg", "fusionauth", "github", "gitlab", "google",
  "hubspot", "huggingface", "identity-server4", "instagram", "kakao", "keycloak", "kinde",
  "line", "linkedin", "logto", "loops", "mailchimp", "mailgun", "mailru", "mastodon",
  "mattermost", "medium", "microsoft-entra-id", "naver", "netlify", "netsuite",
  "nextcloud", "nodemailer", "notion", "okta", "onelogin", "ory-hydra", "osso", "osu",
  "passage", "passkey", "patreon", "ping-id", "pinterest", "pipedrive", "postmark",
  "reddit", "resend", "roblox", "salesforce", "sendgrid", "simplelogin", "slack",
  "spotify", "strava", "threads", "tiktok", "todoist", "trakt", "twitch", "twitter",
  "united-effects", "vipps", "vk", "webauthn", "webex", "wechat", "wikimedia",
  "wordpress", "workos", "yandex", "zitadel", "zoho", "zoom",
] as const

/** Куда писать за новым провайдером. Решение владельца 2026-09-01. */
export const SUPPORT_EMAIL = "admin@fractera.ai"

/**
 * Роли доступа — ровно три, и их ПРИНУЖДАЕТ подложка.
 *
 * 🔒 СПИСОК НЕ ПЕРЕПИСЫВАЕТСЯ, А БЕРЁТСЯ У `lib/roles.ts`. Второй перечень ролей
 * разошёлся бы с первым, и разошёлся бы именно тот, который что-то охраняет —
 * закон навыка `use-roles` дословно: «никогда не перепечатывай список ролей».
 */
export { ACCESS_TIERS, ALL_ROLES, PROTECTED_GROUP_ROLES } from "@/lib/roles"

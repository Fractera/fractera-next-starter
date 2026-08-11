// Words of the access dialog. Co-located with the component that shows them —
// they are used nowhere else, and a shared dictionary would outlive the reason
// they exist.
//
// Ten languages, the same set the legal layer ships. A person who cannot open a
// page deserves the explanation in their own language: this dialog is the one
// screen they will meet at their angriest.

export type AccessGateUi = {
  /** Заголовок диалога. */
  title: string
  /** Строка с перечислением ролей; `{roles}` подставляется. */
  needRoles: string
  /** Что делать, если доступ должен быть. */
  haveAccess: string
  /** Что делать, если человек попал сюда случайно. */
  wrongPlace: string
  /** Кнопка «у меня есть доступ» → авторизация. */
  signIn: string
  /** Кнопка «вернуться на главную». */
  goHome: string
  /** Кнопка «отмена» → предыдущая страница. */
  cancel: string
  /** Пока идёт проверка. */
  checking: string
}

const UI: Record<string, AccessGateUi> = {
  en: { title: 'This page is not open to you', needRoles: 'It requires one of these roles: {roles}.', haveAccess: 'If you should have access, sign in — you will come straight back here.', wrongPlace: 'If you landed here by accident, go back or return to the home page.', signIn: 'I have access — sign in', goHome: 'Go to the home page', cancel: 'Cancel', checking: 'Checking access…' },
  ru: { title: 'Эта страница вам не открыта', needRoles: 'Для неё нужна одна из ролей: {roles}.', haveAccess: 'Если доступ у вас должен быть — пройдите авторизацию, и вы вернётесь сюда же.', wrongPlace: 'Если вы попали сюда случайно — вернитесь назад или на главную.', signIn: 'У меня есть доступ — войти', goHome: 'Вернуться на главную', cancel: 'Отмена', checking: 'Проверяю доступ…' },
  es: { title: 'Esta página no está abierta para ti', needRoles: 'Requiere uno de estos roles: {roles}.', haveAccess: 'Si deberías tener acceso, inicia sesión y volverás aquí.', wrongPlace: 'Si llegaste por accidente, vuelve atrás o ve al inicio.', signIn: 'Tengo acceso — iniciar sesión', goHome: 'Ir al inicio', cancel: 'Cancelar', checking: 'Comprobando acceso…' },
  fr: { title: "Cette page ne vous est pas ouverte", needRoles: 'Elle exige l’un de ces rôles : {roles}.', haveAccess: 'Si vous devez y avoir accès, connectez-vous — vous reviendrez ici.', wrongPlace: 'Si vous êtes arrivé ici par erreur, revenez en arrière ou à l’accueil.', signIn: "J'ai un accès — se connecter", goHome: "Aller à l'accueil", cancel: 'Annuler', checking: 'Vérification de l’accès…' },
  it: { title: 'Questa pagina non è aperta per te', needRoles: 'Richiede uno di questi ruoli: {roles}.', haveAccess: 'Se dovresti avere accesso, accedi — tornerai qui.', wrongPlace: 'Se sei arrivato per errore, torna indietro o alla home.', signIn: 'Ho accesso — accedi', goHome: 'Vai alla home', cancel: 'Annulla', checking: 'Verifica accesso…' },
  de: { title: 'Diese Seite ist für Sie nicht geöffnet', needRoles: 'Sie erfordert eine dieser Rollen: {roles}.', haveAccess: 'Wenn Sie Zugriff haben sollten, melden Sie sich an — Sie kommen hierher zurück.', wrongPlace: 'Wenn Sie versehentlich hier sind, gehen Sie zurück oder zur Startseite.', signIn: 'Ich habe Zugriff — anmelden', goHome: 'Zur Startseite', cancel: 'Abbrechen', checking: 'Zugriff wird geprüft…' },
  pt: { title: 'Esta página não está aberta para você', needRoles: 'Ela exige uma destas funções: {roles}.', haveAccess: 'Se você deveria ter acesso, faça login — você voltará para cá.', wrongPlace: 'Se chegou aqui por engano, volte ou vá para a página inicial.', signIn: 'Tenho acesso — entrar', goHome: 'Ir para a página inicial', cancel: 'Cancelar', checking: 'Verificando acesso…' },
  pl: { title: 'Ta strona nie jest dla Ciebie otwarta', needRoles: 'Wymaga jednej z ról: {roles}.', haveAccess: 'Jeśli powinieneś mieć dostęp, zaloguj się — wrócisz tutaj.', wrongPlace: 'Jeśli trafiłeś tu przypadkiem, wróć lub przejdź na stronę główną.', signIn: 'Mam dostęp — zaloguj się', goHome: 'Przejdź na stronę główną', cancel: 'Anuluj', checking: 'Sprawdzam dostęp…' },
  tr: { title: 'Bu sayfa size açık değil', needRoles: 'Şu rollerden biri gerekir: {roles}.', haveAccess: 'Erişiminiz olması gerekiyorsa giriş yapın — buraya geri dönersiniz.', wrongPlace: 'Buraya yanlışlıkla geldiyseniz geri dönün veya ana sayfaya gidin.', signIn: 'Erişimim var — giriş yap', goHome: 'Ana sayfaya git', cancel: 'İptal', checking: 'Erişim kontrol ediliyor…' },
  nl: { title: 'Deze pagina is niet voor u toegankelijk', needRoles: 'Er is een van deze rollen voor nodig: {roles}.', haveAccess: 'Als u toegang hoort te hebben, log in — u komt hier terug.', wrongPlace: 'Bent u hier per ongeluk, ga terug of naar de startpagina.', signIn: 'Ik heb toegang — inloggen', goHome: 'Naar de startpagina', cancel: 'Annuleren', checking: 'Toegang controleren…' },
}

export function accessGateUi(lang: string): AccessGateUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}

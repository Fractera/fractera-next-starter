// Co-located account-control strings. They BELONG to the account feature and are imported
// by nothing else — delete components/menu/account/ and they go with it (co-location rule).
//
// Three default strings across the FULL 82-language catalogue (config/translations/
// language-metadata.ts), English fallback for anything unlisted. `account` is the label of
// the account button/drawer: it is chosen IDIOMATICALLY per locale (how each language
// actually names this control), NOT translated literally — e.g. en "My account",
// ru "Личный кабинет", de "Mein Konto", ja "マイアカウント".

export type AccountLabels = {
  signIn: string;   // not authenticated → opens the auth flow
  account: string;  // authenticated → opens the account drawer (idiomatic per locale)
  signOut: string;  // bottom of the drawer
};

const ACCOUNT: Record<string, AccountLabels> = {
  en: { signIn: "Sign in", account: "My account", signOut: "Sign out" },
  fr: { signIn: "Se connecter", account: "Mon compte", signOut: "Se déconnecter" },
  es: { signIn: "Iniciar sesión", account: "Mi cuenta", signOut: "Cerrar sesión" },
  pt: { signIn: "Entrar", account: "Minha conta", signOut: "Sair" },
  de: { signIn: "Anmelden", account: "Mein Konto", signOut: "Abmelden" },
  it: { signIn: "Accedi", account: "Il mio account", signOut: "Esci" },
  nl: { signIn: "Inloggen", account: "Mijn account", signOut: "Uitloggen" },
  sv: { signIn: "Logga in", account: "Mitt konto", signOut: "Logga ut" },
  no: { signIn: "Logg inn", account: "Min konto", signOut: "Logg ut" },
  da: { signIn: "Log ind", account: "Min konto", signOut: "Log ud" },
  fi: { signIn: "Kirjaudu sisään", account: "Oma tili", signOut: "Kirjaudu ulos" },
  is: { signIn: "Skrá inn", account: "Aðgangurinn minn", signOut: "Skrá út" },
  el: { signIn: "Σύνδεση", account: "Ο λογαριασμός μου", signOut: "Αποσύνδεση" },
  pl: { signIn: "Zaloguj się", account: "Moje konto", signOut: "Wyloguj się" },
  cs: { signIn: "Přihlásit se", account: "Můj účet", signOut: "Odhlásit se" },
  sk: { signIn: "Prihlásiť sa", account: "Môj účet", signOut: "Odhlásiť sa" },
  hu: { signIn: "Bejelentkezés", account: "Fiókom", signOut: "Kijelentkezés" },
  ro: { signIn: "Autentificare", account: "Contul meu", signOut: "Deconectare" },
  hr: { signIn: "Prijava", account: "Moj račun", signOut: "Odjava" },
  sl: { signIn: "Prijava", account: "Moj račun", signOut: "Odjava" },
  et: { signIn: "Logi sisse", account: "Minu konto", signOut: "Logi välja" },
  lv: { signIn: "Pieslēgties", account: "Mans konts", signOut: "Iziet" },
  lt: { signIn: "Prisijungti", account: "Mano paskyra", signOut: "Atsijungti" },
  mt: { signIn: "Idħol", account: "Il-kont tiegħi", signOut: "Oħroġ" },
  ca: { signIn: "Inicia la sessió", account: "El meu compte", signOut: "Tanca la sessió" },
  gl: { signIn: "Iniciar sesión", account: "A miña conta", signOut: "Pechar sesión" },
  cy: { signIn: "Mewngofnodi", account: "Fy nghyfrif", signOut: "Allgofnodi" },
  ga: { signIn: "Logáil isteach", account: "Mo chuntas", signOut: "Logáil amach" },
  eu: { signIn: "Hasi saioa", account: "Nire kontua", signOut: "Amaitu saioa" },
  ru: { signIn: "Войти", account: "Личный кабинет", signOut: "Выйти" },
  uk: { signIn: "Увійти", account: "Особистий кабінет", signOut: "Вийти" },
  be: { signIn: "Увайсці", account: "Асабісты кабінет", signOut: "Выйсці" },
  bg: { signIn: "Вход", account: "Моят профил", signOut: "Изход" },
  sr: { signIn: "Пријава", account: "Мој налог", signOut: "Одјава" },
  bs: { signIn: "Prijava", account: "Moj račun", signOut: "Odjava" },
  mk: { signIn: "Најави се", account: "Мојот профил", signOut: "Одјави се" },
  sq: { signIn: "Hyr", account: "Llogaria ime", signOut: "Dil" },
  kk: { signIn: "Кіру", account: "Жеке кабинет", signOut: "Шығу" },
  uz: { signIn: "Kirish", account: "Shaxsiy kabinet", signOut: "Chiqish" },
  ky: { signIn: "Кирүү", account: "Жеке кабинет", signOut: "Чыгуу" },
  tg: { signIn: "Воридшавӣ", account: "Кабинети шахсӣ", signOut: "Баромад" },
  tk: { signIn: "Gir", account: "Hasabym", signOut: "Çyk" },
  az: { signIn: "Daxil ol", account: "Hesabım", signOut: "Çıxış" },
  hy: { signIn: "Մուտք", account: "Իմ հաշիվը", signOut: "Ելք" },
  ka: { signIn: "შესვლა", account: "ჩემი ანგარიში", signOut: "გასვლა" },
  mn: { signIn: "Нэвтрэх", account: "Миний бүртгэл", signOut: "Гарах" },
  ar: { signIn: "تسجيل الدخول", account: "حسابي", signOut: "تسجيل الخروج" },
  tr: { signIn: "Giriş yap", account: "Hesabım", signOut: "Çıkış yap" },
  he: { signIn: "התחברות", account: "החשבון שלי", signOut: "התנתקות" },
  fa: { signIn: "ورود", account: "حساب کاربری", signOut: "خروج" },
  ku: { signIn: "Têketin", account: "Hesabê min", signOut: "Derketin" },
  af: { signIn: "Meld aan", account: "My rekening", signOut: "Meld af" },
  sw: { signIn: "Ingia", account: "Akaunti yangu", signOut: "Toka" },
  ha: { signIn: "Shiga", account: "Asusuna", signOut: "Fita" },
  yo: { signIn: "Wọlé", account: "Àkáùntì mi", signOut: "Jáde" },
  ig: { signIn: "Banye", account: "Akaụntụ m", signOut: "Pụọ" },
  am: { signIn: "ግባ", account: "መለያዬ", signOut: "ውጣ" },
  zu: { signIn: "Ngena", account: "I-akhawunti yami", signOut: "Phuma" },
  xh: { signIn: "Ngena", account: "I-akhawunti yam", signOut: "Phuma" },
  rw: { signIn: "Injira", account: "Konti yanjye", signOut: "Sohoka" },
  so: { signIn: "Gal", account: "Akoonkayga", signOut: "Bax" },
  zh: { signIn: "登录", account: "我的账户", signOut: "退出" },
  ja: { signIn: "ログイン", account: "マイアカウント", signOut: "ログアウト" },
  ko: { signIn: "로그인", account: "내 계정", signOut: "로그아웃" },
  hi: { signIn: "साइन इन करें", account: "मेरा खाता", signOut: "साइन आउट करें" },
  ur: { signIn: "سائن ان", account: "میرا اکاؤنٹ", signOut: "سائن آؤٹ" },
  bn: { signIn: "সাইন ইন", account: "আমার অ্যাকাউন্ট", signOut: "সাইন আউট" },
  te: { signIn: "సైన్ ఇన్", account: "నా ఖాతా", signOut: "సైన్ అవుట్" },
  mr: { signIn: "साइन इन", account: "माझे खाते", signOut: "साइन आउट" },
  kn: { signIn: "ಸೈನ್ ಇನ್", account: "ನನ್ನ ಖಾತೆ", signOut: "ಸೈನ್ ಔಟ್" },
  gu: { signIn: "સાઇન ઇન", account: "મારું ખાતું", signOut: "સાઇન આઉટ" },
  ml: { signIn: "സൈൻ ഇൻ", account: "എന്റെ അക്കൗണ്ട്", signOut: "സൈൻ ഔട്ട്" },
  ta: { signIn: "உள்நுழைக", account: "எனது கணக்கு", signOut: "வெளியேறு" },
  ne: { signIn: "साइन इन", account: "मेरो खाता", signOut: "साइन आउट" },
  vi: { signIn: "Đăng nhập", account: "Tài khoản của tôi", signOut: "Đăng xuất" },
  th: { signIn: "เข้าสู่ระบบ", account: "บัญชีของฉัน", signOut: "ออกจากระบบ" },
  id: { signIn: "Masuk", account: "Akun saya", signOut: "Keluar" },
  ms: { signIn: "Log masuk", account: "Akaun saya", signOut: "Log keluar" },
  tl: { signIn: "Mag-sign in", account: "Aking account", signOut: "Mag-sign out" },
  my: { signIn: "ဝင်ရောက်ရန်", account: "ကျွန်ုပ်အကောင့်", signOut: "ထွက်ရန်" },
  km: { signIn: "ចូល", account: "គណនីរបស់ខ្ញុំ", signOut: "ចេញ" },
  lo: { signIn: "ເຂົ້າສູ່ລະບົບ", account: "ບັນຊີຂອງຂ້ອຍ", signOut: "ອອກຈາກລະບົບ" },
};

export function accountLabels(lang: string): AccountLabels {
  return ACCOUNT[lang] ?? ACCOUNT.en;
}

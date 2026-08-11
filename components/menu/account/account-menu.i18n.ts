// Co-located account-control strings. They BELONG to the account feature and are imported
// by nothing else — delete components/menu/account/ and they go with it (co-location rule).
//
// Eight strings across the FULL 82-language catalogue (config/translations/
// language-metadata.ts), English fallback for anything unlisted. `account` is the label of
// the account button/drawer: it is chosen IDIOMATICALLY per locale (how each language
// actually names this control), NOT translated literally — e.g. en "My account",
// ru "Личный кабинет", de "Mein Konto", ja "マイアカウント". The same applies to the four
// layer headers: several languages use one word for "personal" and "staff" (es/ro
// "Personal" means the staff), so the personal layer is named "my space" there instead of
// translated word-for-word.
//
// 🪦 The key `projects` was removed 2026-08-11: it headed the Projects accordion, and the
// Projects layer was demolished in step 500. A dead key in an 82-language file costs a
// translation in every one of them, forever, for a screen nobody can open.

export type AccountLabels = {
  signIn: string;   // not authenticated → opens the auth flow
  account: string;  // authenticated → opens the account drawer (idiomatic per locale)
  signOut: string;  // bottom of the drawer
  // Headers of the four permission layers the drawer groups its sections by
  // (`PROTECTED_GROUP_ROLES` in lib/roles.ts). They belong HERE, in the full
  // 82-language catalogue, because the four layers are the product's own
  // architecture — every project built on this starter has them, and a layer
  // that speaks English on a Japanese site is a broken reusable element, not a
  // missing translation. The labels of the LINKS inside a section are the
  // opposite case: they name one project's pages and live with those pages.
  groupAccount: string;  // (account) — the visitor's own data
  groupStaff: string;    // (staff)   — other people's data, on duty
  groupFinance: string;  // (finance) — money
  groupAdmin: string;    // (admin)   — the project itself
  groupEmpty: string;    // layer the person belongs to, with no pages built yet
};

const ACCOUNT: Record<string, AccountLabels> = {
  en: { signIn: "Sign in", account: "My account", signOut: "Sign out", groupAccount: "Personal", groupStaff: "Staff", groupFinance: "Finance", groupAdmin: "Administration", groupEmpty: "No sections yet" },
  fr: { signIn: "Se connecter", account: "Mon compte", signOut: "Se déconnecter", groupAccount: "Espace personnel", groupStaff: "Équipe", groupFinance: "Finances", groupAdmin: "Administration", groupEmpty: "Aucune section pour l’instant" },
  es: { signIn: "Iniciar sesión", account: "Mi cuenta", signOut: "Cerrar sesión", groupAccount: "Mi espacio", groupStaff: "Personal", groupFinance: "Finanzas", groupAdmin: "Administración", groupEmpty: "Aún no hay secciones" },
  pt: { signIn: "Entrar", account: "Minha conta", signOut: "Sair", groupAccount: "Meu espaço", groupStaff: "Equipe", groupFinance: "Finanças", groupAdmin: "Administração", groupEmpty: "Ainda não há seções" },
  de: { signIn: "Anmelden", account: "Mein Konto", signOut: "Abmelden", groupAccount: "Persönlich", groupStaff: "Personal", groupFinance: "Finanzen", groupAdmin: "Verwaltung", groupEmpty: "Noch keine Bereiche" },
  it: { signIn: "Accedi", account: "Il mio account", signOut: "Esci", groupAccount: "Area personale", groupStaff: "Personale", groupFinance: "Finanze", groupAdmin: "Amministrazione", groupEmpty: "Ancora nessuna sezione" },
  nl: { signIn: "Inloggen", account: "Mijn account", signOut: "Uitloggen", groupAccount: "Persoonlijk", groupStaff: "Personeel", groupFinance: "Financiën", groupAdmin: "Beheer", groupEmpty: "Nog geen secties" },
  sv: { signIn: "Logga in", account: "Mitt konto", signOut: "Logga ut", groupAccount: "Personligt", groupStaff: "Personal", groupFinance: "Ekonomi", groupAdmin: "Administration", groupEmpty: "Inga sektioner ännu" },
  no: { signIn: "Logg inn", account: "Min konto", signOut: "Logg ut", groupAccount: "Personlig", groupStaff: "Ansatte", groupFinance: "Økonomi", groupAdmin: "Administrasjon", groupEmpty: "Ingen seksjoner ennå" },
  da: { signIn: "Log ind", account: "Min konto", signOut: "Log ud", groupAccount: "Personligt", groupStaff: "Personale", groupFinance: "Økonomi", groupAdmin: "Administration", groupEmpty: "Ingen sektioner endnu" },
  fi: { signIn: "Kirjaudu sisään", account: "Oma tili", signOut: "Kirjaudu ulos", groupAccount: "Henkilökohtainen", groupStaff: "Henkilöstö", groupFinance: "Talous", groupAdmin: "Hallinta", groupEmpty: "Ei vielä osioita" },
  is: { signIn: "Skrá inn", account: "Aðgangurinn minn", signOut: "Skrá út", groupAccount: "Persónulegt", groupStaff: "Starfsfólk", groupFinance: "Fjármál", groupAdmin: "Stjórnun", groupEmpty: "Engir hlutar enn" },
  el: { signIn: "Σύνδεση", account: "Ο λογαριασμός μου", signOut: "Αποσύνδεση", groupAccount: "Προσωπικά", groupStaff: "Προσωπικό", groupFinance: "Οικονομικά", groupAdmin: "Διαχείριση", groupEmpty: "Δεν υπάρχουν ενότητες ακόμη" },
  pl: { signIn: "Zaloguj się", account: "Moje konto", signOut: "Wyloguj się", groupAccount: "Osobiste", groupStaff: "Personel", groupFinance: "Finanse", groupAdmin: "Administracja", groupEmpty: "Brak sekcji" },
  cs: { signIn: "Přihlásit se", account: "Můj účet", signOut: "Odhlásit se", groupAccount: "Osobní", groupStaff: "Personál", groupFinance: "Finance", groupAdmin: "Správa", groupEmpty: "Zatím žádné sekce" },
  sk: { signIn: "Prihlásiť sa", account: "Môj účet", signOut: "Odhlásiť sa", groupAccount: "Osobné", groupStaff: "Personál", groupFinance: "Financie", groupAdmin: "Správa", groupEmpty: "Zatiaľ žiadne sekcie" },
  hu: { signIn: "Bejelentkezés", account: "Fiókom", signOut: "Kijelentkezés", groupAccount: "Személyes", groupStaff: "Munkatársak", groupFinance: "Pénzügy", groupAdmin: "Adminisztráció", groupEmpty: "Még nincsenek szakaszok" },
  ro: { signIn: "Autentificare", account: "Contul meu", signOut: "Deconectare", groupAccount: "Spațiul meu", groupStaff: "Personal", groupFinance: "Finanțe", groupAdmin: "Administrare", groupEmpty: "Încă nu există secțiuni" },
  hr: { signIn: "Prijava", account: "Moj račun", signOut: "Odjava", groupAccount: "Osobno", groupStaff: "Osoblje", groupFinance: "Financije", groupAdmin: "Administracija", groupEmpty: "Još nema odjeljaka" },
  sl: { signIn: "Prijava", account: "Moj račun", signOut: "Odjava", groupAccount: "Osebno", groupStaff: "Osebje", groupFinance: "Finance", groupAdmin: "Upravljanje", groupEmpty: "Zaenkrat ni razdelkov" },
  et: { signIn: "Logi sisse", account: "Minu konto", signOut: "Logi välja", groupAccount: "Isiklik", groupStaff: "Töötajad", groupFinance: "Rahandus", groupAdmin: "Haldus", groupEmpty: "Jaotisi veel pole" },
  lv: { signIn: "Pieslēgties", account: "Mans konts", signOut: "Iziet", groupAccount: "Personīgi", groupStaff: "Personāls", groupFinance: "Finanses", groupAdmin: "Administrēšana", groupEmpty: "Sadaļu vēl nav" },
  lt: { signIn: "Prisijungti", account: "Mano paskyra", signOut: "Atsijungti", groupAccount: "Asmeninis", groupStaff: "Personalas", groupFinance: "Finansai", groupAdmin: "Administravimas", groupEmpty: "Skyrių kol kas nėra" },
  mt: { signIn: "Idħol", account: "Il-kont tiegħi", signOut: "Oħroġ", groupAccount: "Personali", groupStaff: "Staff", groupFinance: "Finanzi", groupAdmin: "Amministrazzjoni", groupEmpty: "Għad m’hemmx taqsimiet" },
  ca: { signIn: "Inicia la sessió", account: "El meu compte", signOut: "Tanca la sessió", groupAccount: "Espai personal", groupStaff: "Personal", groupFinance: "Finances", groupAdmin: "Administració", groupEmpty: "Encara no hi ha seccions" },
  gl: { signIn: "Iniciar sesión", account: "A miña conta", signOut: "Pechar sesión", groupAccount: "Espazo persoal", groupStaff: "Persoal", groupFinance: "Finanzas", groupAdmin: "Administración", groupEmpty: "Aínda non hai seccións" },
  cy: { signIn: "Mewngofnodi", account: "Fy nghyfrif", signOut: "Allgofnodi", groupAccount: "Personol", groupStaff: "Staff", groupFinance: "Cyllid", groupAdmin: "Gweinyddu", groupEmpty: "Dim adrannau eto" },
  ga: { signIn: "Logáil isteach", account: "Mo chuntas", signOut: "Logáil amach", groupAccount: "Pearsanta", groupStaff: "Foireann", groupFinance: "Airgeadas", groupAdmin: "Riarachán", groupEmpty: "Níl aon rannán fós" },
  eu: { signIn: "Hasi saioa", account: "Nire kontua", signOut: "Amaitu saioa", groupAccount: "Nire eremua", groupStaff: "Langileak", groupFinance: "Finantzak", groupAdmin: "Administrazioa", groupEmpty: "Oraindik ez dago atalik" },
  ru: { signIn: "Войти", account: "Личный кабинет", signOut: "Выйти", groupAccount: "Личное", groupStaff: "Персонал", groupFinance: "Финансы", groupAdmin: "Администрирование", groupEmpty: "Разделов пока нет" },
  uk: { signIn: "Увійти", account: "Особистий кабінет", signOut: "Вийти", groupAccount: "Особисте", groupStaff: "Персонал", groupFinance: "Фінанси", groupAdmin: "Адміністрування", groupEmpty: "Розділів поки немає" },
  be: { signIn: "Увайсці", account: "Асабісты кабінет", signOut: "Выйсці", groupAccount: "Асабістае", groupStaff: "Персанал", groupFinance: "Фінансы", groupAdmin: "Адміністраванне", groupEmpty: "Раздзелаў пакуль няма" },
  bg: { signIn: "Вход", account: "Моят профил", signOut: "Изход", groupAccount: "Лично", groupStaff: "Персонал", groupFinance: "Финанси", groupAdmin: "Администриране", groupEmpty: "Все още няма раздели" },
  sr: { signIn: "Пријава", account: "Мој налог", signOut: "Одјава", groupAccount: "Лично", groupStaff: "Особље", groupFinance: "Финансије", groupAdmin: "Администрација", groupEmpty: "Још нема одељака" },
  bs: { signIn: "Prijava", account: "Moj račun", signOut: "Odjava", groupAccount: "Lično", groupStaff: "Osoblje", groupFinance: "Finansije", groupAdmin: "Administracija", groupEmpty: "Još nema odjeljaka" },
  mk: { signIn: "Најави се", account: "Мојот профил", signOut: "Одјави се", groupAccount: "Лично", groupStaff: "Персонал", groupFinance: "Финансии", groupAdmin: "Администрација", groupEmpty: "Сè уште нема секции" },
  sq: { signIn: "Hyr", account: "Llogaria ime", signOut: "Dil", groupAccount: "Personale", groupStaff: "Stafi", groupFinance: "Financat", groupAdmin: "Administrimi", groupEmpty: "Ende asnjë seksion" },
  kk: { signIn: "Кіру", account: "Жеке кабинет", signOut: "Шығу", groupAccount: "Жеке", groupStaff: "Қызметкерлер", groupFinance: "Қаржы", groupAdmin: "Әкімшілік", groupEmpty: "Бөлімдер әзірге жоқ" },
  uz: { signIn: "Kirish", account: "Shaxsiy kabinet", signOut: "Chiqish", groupAccount: "Shaxsiy", groupStaff: "Xodimlar", groupFinance: "Moliya", groupAdmin: "Boshqaruv", groupEmpty: "Hozircha bo‘limlar yo‘q" },
  ky: { signIn: "Кирүү", account: "Жеке кабинет", signOut: "Чыгуу", groupAccount: "Жеке", groupStaff: "Кызматкерлер", groupFinance: "Каржы", groupAdmin: "Башкаруу", groupEmpty: "Бөлүмдөр азырынча жок" },
  tg: { signIn: "Воридшавӣ", account: "Кабинети шахсӣ", signOut: "Баромад", groupAccount: "Шахсӣ", groupStaff: "Кормандон", groupFinance: "Молия", groupAdmin: "Маъмурият", groupEmpty: "Ҳанӯз бахше нест" },
  tk: { signIn: "Gir", account: "Hasabym", signOut: "Çyk", groupAccount: "Şahsy", groupStaff: "Işgärler", groupFinance: "Maliýe", groupAdmin: "Dolandyryş", groupEmpty: "Häzirlikçe bölüm ýok" },
  az: { signIn: "Daxil ol", account: "Hesabım", signOut: "Çıxış", groupAccount: "Şəxsi", groupStaff: "Heyət", groupFinance: "Maliyyə", groupAdmin: "İdarəetmə", groupEmpty: "Hələ bölmə yoxdur" },
  hy: { signIn: "Մուտք", account: "Իմ հաշիվը", signOut: "Ելք", groupAccount: "Անձնական", groupStaff: "Անձնակազմ", groupFinance: "Ֆինանսներ", groupAdmin: "Կառավարում", groupEmpty: "Դեռ բաժիններ չկան" },
  ka: { signIn: "შესვლა", account: "ჩემი ანგარიში", signOut: "გასვლა", groupAccount: "პირადი", groupStaff: "პერსონალი", groupFinance: "ფინანსები", groupAdmin: "ადმინისტრირება", groupEmpty: "განყოფილებები ჯერ არ არის" },
  mn: { signIn: "Нэвтрэх", account: "Миний бүртгэл", signOut: "Гарах", groupAccount: "Хувийн", groupStaff: "Ажилтан", groupFinance: "Санхүү", groupAdmin: "Удирдлага", groupEmpty: "Одоогоор хэсэг алга" },
  ar: { signIn: "تسجيل الدخول", account: "حسابي", signOut: "تسجيل الخروج", groupAccount: "الشخصي", groupStaff: "الموظفون", groupFinance: "المالية", groupAdmin: "الإدارة", groupEmpty: "لا توجد أقسام بعد" },
  tr: { signIn: "Giriş yap", account: "Hesabım", signOut: "Çıkış yap", groupAccount: "Kişisel", groupStaff: "Personel", groupFinance: "Finans", groupAdmin: "Yönetim", groupEmpty: "Henüz bölüm yok" },
  he: { signIn: "התחברות", account: "החשבון שלי", signOut: "התנתקות", groupAccount: "אישי", groupStaff: "צוות", groupFinance: "כספים", groupAdmin: "ניהול", groupEmpty: "אין עדיין מדורים" },
  fa: { signIn: "ورود", account: "حساب کاربری", signOut: "خروج", groupAccount: "شخصی", groupStaff: "کارکنان", groupFinance: "مالی", groupAdmin: "مدیریت", groupEmpty: "هنوز بخشی وجود ندارد" },
  ku: { signIn: "Têketin", account: "Hesabê min", signOut: "Derketin", groupAccount: "Kesane", groupStaff: "Personel", groupFinance: "Darayî", groupAdmin: "Rêvebirin", groupEmpty: "Hê beş tune" },
  af: { signIn: "Meld aan", account: "My rekening", signOut: "Meld af", groupAccount: "Persoonlik", groupStaff: "Personeel", groupFinance: "Finansies", groupAdmin: "Administrasie", groupEmpty: "Nog geen afdelings nie" },
  sw: { signIn: "Ingia", account: "Akaunti yangu", signOut: "Toka", groupAccount: "Binafsi", groupStaff: "Wafanyakazi", groupFinance: "Fedha", groupAdmin: "Utawala", groupEmpty: "Bado hakuna sehemu" },
  ha: { signIn: "Shiga", account: "Asusuna", signOut: "Fita", groupAccount: "Na kaina", groupStaff: "Ma’aikata", groupFinance: "Kudi", groupAdmin: "Gudanarwa", groupEmpty: "Babu sassa tukuna" },
  yo: { signIn: "Wọlé", account: "Àkáùntì mi", signOut: "Jáde", groupAccount: "Ti ara ẹni", groupStaff: "Òṣìṣẹ́", groupFinance: "Ìnáwó", groupAdmin: "Ìṣàkóso", groupEmpty: "Kò sí apá kankan sibẹ̀" },
  ig: { signIn: "Banye", account: "Akaụntụ m", signOut: "Pụọ", groupAccount: "Nke onwe", groupStaff: "Ndị ọrụ", groupFinance: "Ego", groupAdmin: "Nchịkwa", groupEmpty: "Enweghị akụkụ ugbua" },
  am: { signIn: "ግባ", account: "መለያዬ", signOut: "ውጣ", groupAccount: "የግል", groupStaff: "ሠራተኞች", groupFinance: "ፋይናንስ", groupAdmin: "አስተዳደር", groupEmpty: "እስካሁን ክፍሎች የሉም" },
  zu: { signIn: "Ngena", account: "I-akhawunti yami", signOut: "Phuma", groupAccount: "Okomuntu siqu", groupStaff: "Abasebenzi", groupFinance: "Ezezimali", groupAdmin: "Ukuphatha", groupEmpty: "Azikho izigaba okwamanje" },
  xh: { signIn: "Ngena", account: "I-akhawunti yam", signOut: "Phuma", groupAccount: "Eyakho", groupStaff: "Abasebenzi", groupFinance: "Ezemali", groupAdmin: "Ulawulo", groupEmpty: "Akukho macandelo okwangoku" },
  rw: { signIn: "Injira", account: "Konti yanjye", signOut: "Sohoka", groupAccount: "Bwite", groupStaff: "Abakozi", groupFinance: "Imari", groupAdmin: "Ubuyobozi", groupEmpty: "Nta bice birahari" },
  so: { signIn: "Gal", account: "Akoonkayga", signOut: "Bax", groupAccount: "Shakhsi", groupStaff: "Shaqaalaha", groupFinance: "Maaliyadda", groupAdmin: "Maamulka", groupEmpty: "Weli qaybo ma jiraan" },
  zh: { signIn: "登录", account: "我的账户", signOut: "退出", groupAccount: "个人", groupStaff: "员工", groupFinance: "财务", groupAdmin: "管理", groupEmpty: "暂无板块" },
  ja: { signIn: "ログイン", account: "マイアカウント", signOut: "ログアウト", groupAccount: "個人", groupStaff: "スタッフ", groupFinance: "経理", groupAdmin: "管理", groupEmpty: "セクションはまだありません" },
  ko: { signIn: "로그인", account: "내 계정", signOut: "로그아웃", groupAccount: "개인", groupStaff: "직원", groupFinance: "재무", groupAdmin: "관리", groupEmpty: "아직 섹션이 없습니다" },
  hi: { signIn: "साइन इन करें", account: "मेरा खाता", signOut: "साइन आउट करें", groupAccount: "व्यक्तिगत", groupStaff: "स्टाफ", groupFinance: "वित्त", groupAdmin: "प्रशासन", groupEmpty: "अभी कोई अनुभाग नहीं" },
  ur: { signIn: "سائن ان", account: "میرا اکاؤنٹ", signOut: "سائن آؤٹ", groupAccount: "ذاتی", groupStaff: "عملہ", groupFinance: "مالیات", groupAdmin: "انتظامیہ", groupEmpty: "ابھی کوئی سیکشن نہیں" },
  bn: { signIn: "সাইন ইন", account: "আমার অ্যাকাউন্ট", signOut: "সাইন আউট", groupAccount: "ব্যক্তিগত", groupStaff: "কর্মী", groupFinance: "অর্থ", groupAdmin: "প্রশাসন", groupEmpty: "এখনও কোনো বিভাগ নেই" },
  te: { signIn: "సైన్ ఇన్", account: "నా ఖాతా", signOut: "సైన్ అవుట్", groupAccount: "వ్యక్తిగతం", groupStaff: "సిబ్బంది", groupFinance: "ఆర్థికం", groupAdmin: "నిర్వహణ", groupEmpty: "ఇంకా విభాగాలు లేవు" },
  mr: { signIn: "साइन इन", account: "माझे खाते", signOut: "साइन आउट", groupAccount: "वैयक्तिक", groupStaff: "कर्मचारी", groupFinance: "वित्त", groupAdmin: "प्रशासन", groupEmpty: "अद्याप विभाग नाहीत" },
  kn: { signIn: "ಸೈನ್ ಇನ್", account: "ನನ್ನ ಖಾತೆ", signOut: "ಸೈನ್ ಔಟ್", groupAccount: "ವೈಯಕ್ತಿಕ", groupStaff: "ಸಿಬ್ಬಂದಿ", groupFinance: "ಹಣಕಾಸು", groupAdmin: "ಆಡಳಿತ", groupEmpty: "ಇನ್ನೂ ವಿಭಾಗಗಳಿಲ್ಲ" },
  gu: { signIn: "સાઇન ઇન", account: "મારું ખાતું", signOut: "સાઇન આઉટ", groupAccount: "વ્યક્તિગત", groupStaff: "સ્ટાફ", groupFinance: "નાણાં", groupAdmin: "વહીવટ", groupEmpty: "હજી કોઈ વિભાગ નથી" },
  ml: { signIn: "സൈൻ ഇൻ", account: "എന്റെ അക്കൗണ്ട്", signOut: "സൈൻ ഔട്ട്", groupAccount: "വ്യക്തിഗതം", groupStaff: "ജീവനക്കാർ", groupFinance: "ധനകാര്യം", groupAdmin: "ഭരണം", groupEmpty: "ഇതുവരെ വിഭാഗങ്ങളില്ല" },
  ta: { signIn: "உள்நுழைக", account: "எனது கணக்கு", signOut: "வெளியேறு", groupAccount: "தனிப்பட்டது", groupStaff: "பணியாளர்கள்", groupFinance: "நிதி", groupAdmin: "நிர்வாகம்", groupEmpty: "இன்னும் பிரிவுகள் இல்லை" },
  ne: { signIn: "साइन इन", account: "मेरो खाता", signOut: "साइन आउट", groupAccount: "व्यक्तिगत", groupStaff: "कर्मचारी", groupFinance: "वित्त", groupAdmin: "प्रशासन", groupEmpty: "अहिलेसम्म कुनै खण्ड छैन" },
  vi: { signIn: "Đăng nhập", account: "Tài khoản của tôi", signOut: "Đăng xuất", groupAccount: "Cá nhân", groupStaff: "Nhân sự", groupFinance: "Tài chính", groupAdmin: "Quản trị", groupEmpty: "Chưa có mục nào" },
  th: { signIn: "เข้าสู่ระบบ", account: "บัญชีของฉัน", signOut: "ออกจากระบบ", groupAccount: "ส่วนตัว", groupStaff: "พนักงาน", groupFinance: "การเงิน", groupAdmin: "การจัดการ", groupEmpty: "ยังไม่มีส่วนใด" },
  id: { signIn: "Masuk", account: "Akun saya", signOut: "Keluar", groupAccount: "Pribadi", groupStaff: "Staf", groupFinance: "Keuangan", groupAdmin: "Administrasi", groupEmpty: "Belum ada bagian" },
  ms: { signIn: "Log masuk", account: "Akaun saya", signOut: "Log keluar", groupAccount: "Peribadi", groupStaff: "Kakitangan", groupFinance: "Kewangan", groupAdmin: "Pentadbiran", groupEmpty: "Belum ada bahagian" },
  tl: { signIn: "Mag-sign in", account: "Aking account", signOut: "Mag-sign out", groupAccount: "Personal", groupStaff: "Mga tauhan", groupFinance: "Pananalapi", groupAdmin: "Pangangasiwa", groupEmpty: "Wala pang seksyon" },
  my: { signIn: "ဝင်ရောက်ရန်", account: "ကျွန်ုပ်အကောင့်", signOut: "ထွက်ရန်", groupAccount: "ကိုယ်ရေး", groupStaff: "ဝန်ထမ်း", groupFinance: "ဘဏ္ဍာရေး", groupAdmin: "စီမံခန့်ခွဲမှု", groupEmpty: "ကဏ္ဍများ မရှိသေးပါ" },
  km: { signIn: "ចូល", account: "គណនីរបស់ខ្ញុំ", signOut: "ចេញ", groupAccount: "ផ្ទាល់ខ្លួន", groupStaff: "បុគ្គលិក", groupFinance: "ហិរញ្ញវត្ថុ", groupAdmin: "រដ្ឋបាល", groupEmpty: "មិនទាន់មានផ្នែក" },
  lo: { signIn: "ເຂົ້າສູ່ລະບົບ", account: "ບັນຊີຂອງຂ້ອຍ", signOut: "ອອກຈາກລະບົບ", groupAccount: "ສ່ວນຕົວ", groupStaff: "ພະນັກງານ", groupFinance: "ການເງິນ", groupAdmin: "ການບໍລິຫານ", groupEmpty: "ຍັງບໍ່ມີພາກສ່ວນ" },
};

export function accountLabels(lang: string): AccountLabels {
  return ACCOUNT[lang] ?? ACCOUNT.en;
}

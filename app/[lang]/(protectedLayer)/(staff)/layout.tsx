import { AccessGate } from "@/components/auth/access-gate.client"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"
import { accessGateUi } from "@/components/auth/access-gate.i18n"
import { accountLabels } from "@/components/menu/account/account-menu.i18n"
import { FlowRail } from "../_components/flow-rail.server"

// Дверь подгруппы «staff». Форма одинакова у всех четырёх намеренно: увидев один
// такой макет, агент понимает устройство слоя, даже если не открыл README.
//
// Роли НЕ перечислены здесь — они в `lib/roles.ts`, в единственном месте,
// откуда их читают и паспорта страниц, и диалог отказа. Список ролей, набранный
// в макете руками, разойдётся с паспортом, и разойдётся молча.
//
// 🔒 Макет НЕ читает сессию: `auth()`/`cookies()`/`headers()` здесь сделали бы
// динамическим весь слой одной строкой. Спрашивает островок, после гидратации;
// настоящая проверка — в `/api/*`, которые отдают данные.
export default async function Layout(
  { children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> },
) {
  const { lang } = await params
  return (
    <AccessGate roles={PROTECTED_GROUP_ROLES.staff} lang={lang} ui={accessGateUi(lang)}>
      {/* Полоса потока: имя слоя берётся из того же словаря, что и заголовок
          блока в ящике аккаунта (82 языка) — два места, называющие один слой
          разными словами, хуже, чем ни одного. */}
      <FlowRail group="staff" label={accountLabels(lang).groupStaff} />
      {children}
    </AccessGate>
  )
}

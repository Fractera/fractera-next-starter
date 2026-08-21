import { CounterFrame } from "./parts"

// СТАТИЧЕСКИЙ БЛИЗНЕЦ — то, что отдаёт сервер и что видит человек с выключенным
// JavaScript.
//
// 🔒 ЭТО НЕ ЗАПАСНОЙ ВАРИАНТ, А ОСНОВНОЙ (тот же закон, что у `security-orbit`).
// Конечное число уже здесь, посчитанное сервером один раз: без JS счётчик не
// крутится, но лжи в цифре нет — она та же самая, что появится после отсчёта у
// того, у кого JavaScript включён.
export function CounterStatic({ formatted, caption }: { formatted: string; caption: string }) {
  return <CounterFrame digits={formatted} caption={caption} />
}

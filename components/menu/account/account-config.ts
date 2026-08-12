import { getAppConfig } from "@/config/app-config";
import { featureOn, featureDecided } from "@/config/platform-config";

// Кто решает судьбу ПУБЛИЧНОЙ кнопки входа в оболочке приложения.
//
// 🔒 РЕШЕНИЕ ВЛАДЕЛЬЦА 2026-08-12: РЕШАЕТ ПАНЕЛЬ, В РАНТАЙМЕ. Раньше это была
// сборочная переменная `NEXT_PUBLIC_APP_SHELL_AUTH`, то есть включение кнопки
// стоило пересборки, а соседние выключатели панели применялись сразу. Владелец
// видел два разных поведения у двух похожих переключателей и справедливо считал
// это дефектом. Теперь источник истины — `features.auth` в
// `PLATFORM-CONFIG/platform-config.json`, а сторона ящика — `nav.authSide` в
// `APP-CONFIG/app-config.json`.
//
// 🔒 ПЕРЕМЕННАЯ ОСТАЁТСЯ ЗАПАСНЫМ ЗНАЧЕНИЕМ, И ЭТО НЕ ВЕЖЛИВОСТЬ К ПРОШЛОМУ.
// На работающих серверах авторизация включена именно ею, а `features.auth` по
// умолчанию ВЫКЛЮЧЕН. Считай мы «выключено по умолчанию» решением владельца —
// каждый такой сервер потерял бы кнопку входа при первом развёртывании, молча.
// Поэтому переменная действует, пока владелец не тронул выключатель; тронул —
// решает он, и переменная больше не спорит.
//
// 🔒 ЭТОТ ФАЙЛ СЕРВЕРНЫЙ (через `config/*`, где `fs` и `server-only`).
// Островки аккаунта берут отсюда ТОЛЬКО тип — `import type` стирается при
// компиляции. Значение импортировать из клиента нельзя: `server-only` ответит
// ошибкой сборки, и это правильный ответ, а не помеха.

export type AuthShellSide = "left" | "right";

function envSide(): AuthShellSide | null {
  const raw = process.env.NEXT_PUBLIC_APP_SHELL_AUTH?.trim().toLowerCase();
  return raw === "left" || raw === "right" ? raw : null;
}

/** Сторона ящика аккаунта, когда публичная авторизация включена; иначе `null`. */
export function appShellAuthSide(): AuthShellSide | null {
  const fallback = envSide();

  // Владелец не высказывался — работает прежнее поведение сервера.
  const on = featureDecided("auth") ? featureOn("auth") : fallback !== null;
  if (!on) return null;

  const nav = (getAppConfig() as { nav?: { authSide?: unknown } }).nav;
  const side = nav?.authSide;
  if (side === "left" || side === "right") return side;

  // Включено, но сторона не выбрана: берём прежнюю, иначе правую — ящик обязан
  // открываться откуда-то, и «не выбрано» не повод не показать кнопку вовсе.
  return fallback ?? "right";
}

/** True, когда публичный элемент входа обязан отрисоваться. */
export function isAuthRequired(): boolean {
  return appShellAuthSide() !== null;
}

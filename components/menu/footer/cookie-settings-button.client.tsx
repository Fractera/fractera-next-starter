"use client";

import { Cookie } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// Кнопка «Настройки cookie» в подвале — открывает баннер повторно.
//
// 🔒 ЗАЧЕМ ОНА НУЖНА. Согласие на cookie можно не только дать, но и ОТОЗВАТЬ, а
// баннер после первого решения больше не всплывает: он помнит выбор. Без этой
// кнопки посетитель, однажды нажавший «принять», не имеет ни одного способа
// вернуться к своему решению — а право отозвать согласие законом предполагается
// таким же простым, как право его дать.
//
// 🔒 ПОВТОРНЫЙ ВЫЗОВ ЧЕРЕЗ СОБЫТИЕ ОКНА, А НЕ ЧЕРЕЗ ОБЩЕЕ СОСТОЯНИЕ. Баннер уже
// слушает `open-cookie-settings` — механизм был, не хватало того, кто его
// позовёт. Событие ничего не знает о том, кто его послал, поэтому кнопка не
// тянет за собой ни провайдера, ни импорта самого баннера: два независимых
// островка, связанных одним именем события.

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
      className={buttonVariants({ variant: "ghost", size: "sm" }) + " gap-1.5 text-muted-foreground hover:text-foreground"}
    >
      <Cookie className="size-3.5" />
      {label}
    </button>
  );
}

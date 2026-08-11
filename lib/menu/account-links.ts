import { productsUi } from "@/app/[lang]/(protectedLayer)/(staff)/manage/products/_data/ui.i18n"
import { accountingProductsUi } from "@/app/[lang]/(protectedLayer)/(finance)/accounting/products/_data/ui.i18n"
import { administrationProductsUi } from "@/app/[lang]/(protectedLayer)/(admin)/administration/products/_data/ui.i18n"
import { shoppingProductsUi } from "@/app/[lang]/(protectedLayer)/(account)/shopping/products/_data/ui.i18n"
import type { DrawerLink } from "@/components/menu/account/account-drawer.client"

// РАБОЧИЕ РАЗДЕЛЫ, которые ящик аккаунта показывает вошедшему.
//
// Здесь, а не в самом ящике: ящик — переиспользуемая часть продукта на 82 языках,
// а этот список — страницы КОНКРЕТНОГО проекта. Клиент, которому товары не нужны,
// удаляет строку отсюда и не трогает общий компонент.
//
// 🔒 ЗАЧЕМ ЭТО ВООБЩЕ ПОЯВИЛОСЬ. Страница менеджера существовала с самого начала и
// не была связана НИ ОДНОЙ ссылкой: попасть в неё можно было, только набрав адрес
// руками. Менеджер, вошедший под своей ролью, свою же таблицу не находил. Дефект
// обнаружился, когда публичная витрина заняла адрес `/[lang]/products` и страница
// переехала в `/[lang]/manage/products`: старый адрес молча стал открывать витрину.
//
// 🔒 ПУНКТ НАЗЫВАЕТ СВОЙ СЛОЙ, А НЕ СПИСОК РОЛЕЙ. Роли слоя знает `lib/roles.ts`,
// и ящик спрашивает их там же — поэтому пункт физически не может разойтись с
// дверью, которую открывает. Перечисли роли здесь копией, и однажды пункт начнёт
// либо дразнить отказом, либо прятать доступное.
//
// Видимость — вежливость, а не защита: замок стоит на самой странице
// (`layout.tsx` подгруппы) и в маршрутах данных.
//
// 🔒 ЭТОТ ФАЙЛ — ЕДИНСТВЕННОЕ МЕСТО, КОТОРОМУ ПОЗВОЛЕНО ЗНАТЬ ПРО СТРАНИЦЫ РАЗНЫХ
// ГРУПП. Он и существует ради этого: собрать меню из того, что построено. Сами
// группы друг о друге по-прежнему не знают ничего.
//
// Слова каждого пункта живут при своей странице (её `_data/ui.i18n.ts`), а не в
// словаре ящика: это строка одной страницы, и языков у неё столько же, сколько у
// страницы, — не 82 впрок.
export function accountLinks(lang: string): DrawerLink[] {
  return [
    { href: `/${lang}/shopping/products`, label: shoppingProductsUi(lang).title, group: "account" },
    { href: `/${lang}/manage/products`, label: productsUi(lang).title, group: "staff" },
    { href: `/${lang}/accounting/products`, label: accountingProductsUi(lang).title, group: "finance" },
    { href: `/${lang}/administration/products`, label: administrationProductsUi(lang).title, group: "admin" },
  ]
}

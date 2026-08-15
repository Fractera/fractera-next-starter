import Script from "next/script";

// Поднимает сохранённый выбор ширины в `html[data-app-width]` ДО первой
// отрисовки — тем же приёмом, что и тема. Без этого лента успевала показаться
// широкой и прыгала на своё место после гидратации.
//
// 🔒 ЗАМЕР ПОЛОСЫ ПРОКРУТКИ УДАЛЁН 2026-08-15. Здесь считалась переменная
// `--app-sbw`: ширина полосы прокрутки, нужная единственно для вычисления
// `calc(100vw - …)` в прежнем «во всю ширину экрана» — `100vw` включает полосу и
// без поправки давал горизонтальную прокрутку. Растяжения на весь экран в
// механизме больше нет (оба состояния — предел: 80rem и 64rem), значит и
// поправка не нужна. Оставлять её значило бы держать обработчик `resize`,
// который на каждом изменении окна считает число, которое никто не читает.
const appWidthScript = `
(function() {
  try {
    if (localStorage.getItem('fractera-app-width') === 'narrow') {
      document.documentElement.setAttribute('data-app-width', 'narrow');
    }
  } catch (e) {}
})();
`;

export function AppWidthInit() {
  return (
    <Script id="app-width-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: appWidthScript }} />
  );
}

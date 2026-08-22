// ВРЕМЕННАЯ ПРОБА ШАГА 538 — удаляется сразу после проверки, вместе с серверной копией.
// Проверяет ровно две вещи: при `customDesign: false` адрес отвечает 404, при `true` —
// страница открывается и НЕ несёт ни меню, ни подвала.
export default function Probe538() {
  return <main data-probe="538">free layer alive</main>;
}

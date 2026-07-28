import Script from "next/script";

// Raises the saved content-width choice into html[data-app-width] BEFORE paint (same
// technique as ThemeInit) so the wide layout never flashes/jumps after hydration, and
// measures the scrollbar width into --app-sbw (100vw includes it; without the correction
// the wide mode would overflow horizontally). Recomputed on resize/load. The storage key
// is shared with the footer toggle (app-width-toggle.client.tsx). Ported from the Projects
// zone (:3003) ZoneWidthInit.
const appWidthScript = `
(function() {
  var el = document.documentElement;
  try {
    if (localStorage.getItem('fractera-app-width') === 'wide') {
      el.setAttribute('data-app-width', 'wide');
    }
  } catch (e) {}
  function sbw() {
    var v = window.innerWidth - el.clientWidth;
    el.style.setProperty('--app-sbw', (v > 0 ? v : 0) + 'px');
  }
  sbw();
  window.addEventListener('resize', sbw);
  window.addEventListener('load', sbw);
})();
`;

export function AppWidthInit() {
  return (
    <Script id="app-width-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: appWidthScript }} />
  );
}

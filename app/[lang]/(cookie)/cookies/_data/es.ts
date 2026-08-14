import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const es: Partial<FooterPageCell> = {
  title: 'Política de cookies',
  description: 'Qué cookies usa este sitio y cómo controlarlas.',
  keywords: 'política de cookies, cookies, consentimiento',
  blocks: [
    { kind: 'h2', text: 'Qué debería ir aquí' },
    { kind: 'p', text: 'Sustituye este texto de relleno por tu propio contenido. Mientras tanto, la página sigue funcionando: es totalmente estática e indexable, y los motores de búsqueda reciben su título, descripción y datos estructurados exactamente igual que un artículo. Volver a [%SITE%](/es).' },
    { kind: 'p', text: 'Una política de cookies enumera las cookies que fija el sitio, para qué sirve cada una y cómo se retira el consentimiento.' },
  ],
}

import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const es: Partial<FooterPageCell> = {
  title: 'Términos de servicio',
  description: 'Las reglas para usar este sitio y sus servicios.',
  keywords: 'términos de servicio, términos y condiciones',
  blocks: [
    { kind: 'h2', text: 'Qué debería ir aquí' },
    { kind: 'p', text: 'Sustituye este texto de relleno por tu propio contenido. Mientras tanto, la página sigue funcionando: es totalmente estática e indexable, y los motores de búsqueda reciben su título, descripción y datos estructurados exactamente igual que un artículo. Volver a [%SITE%](/es).' },
    { kind: 'p', text: 'Los términos de servicio establecen qué prometes a tus visitantes y qué esperas de ellos.' },
  ],
}

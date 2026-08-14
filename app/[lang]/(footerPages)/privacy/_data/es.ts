import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка: переводится только то, что нужно. Непереведённое поле
// возьмётся из английской основы тем же резолвером, что и у постов блога.
export const es: Partial<FooterPageCell> = {
  title: 'Política de privacidad',
  description: 'Cómo este sitio recopila, usa y protege los datos personales.',
  keywords: 'política de privacidad, datos personales, RGPD',
  blocks: [
    { kind: 'h2', text: 'Qué debería ir aquí' },
    { kind: 'p', text: 'Sustituye este texto de relleno por tu propio contenido. Mientras tanto, la página sigue funcionando: es totalmente estática e indexable, y los motores de búsqueda reciben su título, descripción y datos estructurados exactamente igual que un artículo. Volver a [%SITE%](/es).' },
    { kind: 'p', text: 'Una política de privacidad indica qué datos recopilas, para qué, cuánto tiempo los conservas y cómo puede un visitante solicitar su eliminación.' },
  ],
}

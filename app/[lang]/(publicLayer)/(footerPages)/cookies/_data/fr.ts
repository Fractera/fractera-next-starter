import type { FooterPageCell } from '@/lib/pages/footer-page'

// Cellule de langue : seul ce qui doit changer est traduit. Un champ non
// traduit vient de la base anglaise via le même résolveur que les articles du
// blog.
export const fr: Partial<FooterPageCell> = {
  title: 'Politique relative aux cookies',
  description: 'Quels cookies ce site utilise et comment les contrôler.',
  keywords: 'politique de cookies, cookies, consentement',
  blocks: [
    { kind: 'h2', text: 'Ce qui doit figurer ici' },
    { kind: 'p', text: "Remplace ce texte de remplissage par ton propre contenu. En attendant, la page fonctionne quand même : elle est entièrement statique et indexable, et les moteurs de recherche reçoivent son titre, sa description et ses données structurées exactement comme pour un article. Retour à [%SITE%](/fr)." },
    { kind: 'p', text: "Une politique de cookies liste les cookies que le site dépose, à quoi sert chacun, et comment le consentement est retiré." },
  ],
}

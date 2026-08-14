import type { FooterPageCell } from '@/lib/pages/footer-page'

// Cellule de langue : seul ce qui doit changer est traduit. Un champ non
// traduit vient de la base anglaise via le même résolveur que les articles du
// blog.
export const fr: Partial<FooterPageCell> = {
  title: "Conditions d'utilisation",
  description: "Les règles pour utiliser ce site et ses services.",
  keywords: "conditions d'utilisation, conditions générales",
  blocks: [
    { kind: 'h2', text: 'Ce qui doit figurer ici' },
    { kind: 'p', text: "Remplace ce texte de remplissage par ton propre contenu. En attendant, la page fonctionne quand même : elle est entièrement statique et indexable, et les moteurs de recherche reçoivent son titre, sa description et ses données structurées exactement comme pour un article. Retour à [%SITE%](/fr)." },
    { kind: 'p', text: "Les conditions d'utilisation énoncent ce que tu promets à tes visiteurs et ce que tu attends d'eux." },
  ],
}

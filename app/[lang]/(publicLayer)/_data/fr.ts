import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const fr: Partial<HomeCell> = {
  title: 'Voici votre application',
  description: 'Elle fonctionne sur votre propre serveur et ne rend de comptes à personne d\'autre. Donnez-lui un nom dans le panneau de contrôle — cette ligne disparaîtra.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Infrastructure d\'ingénierie agentique' },
  {
    kind: 'badges',
    items: [
      { label: '82 langues', tone: 'reach' },
      { label: 'SEO intégré', tone: 'reach' },
      { label: 'Base de données propre', tone: 'data' },
      { label: 'Recherche vectorielle', tone: 'data' },
      { label: 'Graphe de connaissances', tone: 'data' },
      { label: 'Stockage de fichiers propre', tone: 'data' },
      { label: 'Autorisation', tone: 'access' },
      { label: '{roles} rôles', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Architecture Fractera', tone: 'code' },
      { label: '100+ de plus', tone: 'muted' },
    ],
  },
  {
    kind: 'panel',
    title: 'Comment commencer',
    children: [
      { kind: 'p', text: 'Six étapes d\'un serveur nu à votre propre code en production. Tout ci-dessous est déjà installé — vous l\'activez, vous ne le construisez pas.' },
      {
        kind: 'olist',
        items: [
          'Ouvrez le panneau de contrôle — tout ce qui concerne ce serveur s\'y configure. [Panneau de contrôle]({admin}/{lang})',
          'Choisissez les langues dans lesquelles votre application sera livrée. [Langues]({admin}/{lang}/languages)',
          'Utilisez les réglages pour décrire votre projet : nom, description, logo, SEO. [Réglages de l\'app]({admin}/{lang}/app-settings)',
          'Connectez GitHub et envoyez le code du serveur vers votre dépôt. [GitHub]({admin}/{lang}/github)',
          'Clonez ce dépôt sur votre propre machine, développez-y, puis renvoyez vos changements.',
          'Cliquez sur Déployer dans le panneau — le serveur récupère votre commit et se reconstruit lui-même. [Déploiements]({admin}/{lang}/deployments)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'warn',
    title: 'Recommandé avant de commencer',
    children: [
      { kind: 'p', text: 'Aucun des deux ne bloque quoi que ce soit. Les deux évitent de refaire le travail : le premier active la moitié pensante du produit, le second change l\'adresse de chaque page.' },
      {
        kind: 'list',
        items: [
          '**Une clé OpenAI.** Sans clé, le Quiz ne pose aucune question, et sans Quiz il n\'y a rien pour décrire vos cas d\'usage — l\'agent codeur refuse donc de construire. C\'est pourquoi le panneau traite la clé comme une exigence ROUGE tant que les premiers cas n\'existent pas, puis comme une suggestion ambrée ensuite : le site fonctionne sans elle, seuls la recherche vectorielle et le graphe de connaissances restent vides. La clé est saisie une fois et la dépense va directement à votre fournisseur de modèle. [Clé OpenAI]({admin}/{lang}/openai)',
          '**Votre propre domaine.** Tant que le site vit à une adresse numérique, il n\'a ni certificat ni application installable — le navigateur ne les accorde que sur une connexion sécurisée. Passer à un domaine change l\'adresse de chaque page, mieux vaut donc le faire avant qu\'elles ne soient indexées. [Domaine]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Avant tout code',
    title: 'Quiz — sept questions au lieu d\'une page blanche',
    children: [
      { kind: 'p', text: 'L\'erreur la plus coûteuse d\'un projet se commet avant la première ligne de code : on construit la mauvaise chose. Pas par mauvaise construction, mais parce que « par où commencer » est difficile à répondre seul. Quiz transforme cela en conversation : vous répondez, le modèle continue à poser des questions, et il en sort la liste des scénarios avec laquelle le projet est ensuite construit.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'La graine' }, { kind: 'p', text: 'Sept questions courtes : ce qu\'est le produit, à qui il s\'adresse, ce qu\'une personne doit en retirer. Répondez avec vos propres mots — la dictée fonctionne. Tout ce qui suit part de là, donc quelques phrases donnent un résultat nettement meilleur que quelques mots.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'La conversation' }, { kind: 'p', text: 'Ensuite, une question à la fois, dans votre langue. Il existe un auto-quiz : le modèle pose cinq nouvelles questions et y répond lui-même, approfondissant la description — mais tout ce qu\'il a inventé en votre nom est marqué « Hypothèse », et vous le corrigez. Une supposition passée pour un fait réapparaîtrait plus tard, dans les scénarios finis.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Les scénarios' }, { kind: 'p', text: 'La conversation est synthétisée en cas numérotés : qui arrive, ce qu\'il fait, ce qui doit être vrai à la fin. Vous les lisez et les confirmez un par un. Un cas non lu reste une supposition du modèle.' }] },
        ],
      },
      { kind: 'quote', text: 'Et ceci n\'est pas un conseil mais une règle du produit : tant qu\'un seul cas reste non confirmé, le panneau garde son alarme allumée et l\'agent codeur refuse de construire. Construire sur une supposition non lue coûte plus cher que ne rien construire du tout.' },
      { kind: 'cta', text: 'Quiz — sept questions au lieu d\'une page blanche', href: '{admin}/{lang}/doc-use-cases', label: 'Ouvrir Quiz' },
    ],
  },
  {
    kind: 'panel',
    title: 'Ce qu\'est ce projet, techniquement',
    children: [
      { kind: 'p', text: 'Ce n\'est pas un site fini mais l\'architecture Fractera : un même squelette porte aussi bien une landing page qu\'un gros SaaS ou une automatisation multi-niveaux. Grandir ne demande pas de réécriture — les couches données, autorisation et panneau sont déjà séparées, et chacune est conçue pour une charge que vous n\'avez pas encore.' },
      { kind: 'p', text: 'Le code ne s\'écrit pas ici. Un développeur clone le dépôt sur sa propre machine et travaille avec Claude Code, qui lit les instructions et compétences vivant dans le projet : elles fixent les règles, et des vérifications automatiques empêchent qu\'on les enfreigne. Le serveur ne fait que recevoir le résultat et se reconstruire.' },
      { kind: 'p', text: 'Le squelette est conçu pour un projet qui dépassera le million de lignes : chaque entité a son propre dossier, la couche partagée ne grossit pas avec leur nombre, et les routes et permissions sont déclarées là où elles s\'appliquent. La stabilité ici n\'est pas une promesse mais une conséquence — une nouvelle page n\'ajoute rien à un tronc central.' },
    ],
  },
],
}

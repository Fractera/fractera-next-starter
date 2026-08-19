import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const fr: Partial<HomeCell> = {
  title: 'Voici le starter de votre application',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'Votre serveur, votre code : autorisation, base de données, stockage et recherche vectorielle déjà reliés. Créez une landing page ou un SaaS en 82 langues.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Infrastructure d\'ingénierie agentique',
    title: 'Voici le starter de votre application',
    description:
      'Tout est déjà installé et relié — autorisation, votre propre base de données, stockage de fichiers, recherche vectorielle et une centaine d\'outils de plus, rangés pour qu\'un agent de codage les trouve sans qu\'on le lui explique deux fois. Construisez une page d\'atterrissage, un SaaS ou une automatisation qui ne dort jamais, dans chacune des 82 langues, sur un squelette taillé pour un projet qui dépassera le million de lignes. Environ **neuf fois plus vite** que d\'assembler la même pile vous-même — et rien ici n\'appelle au-dehors : aucun fournisseur, aucun abonnement, personne à qui demander la permission. Le serveur est à vous, le code est à vous, **à cent pour cent**.',
    image: 'homePage',
    imageAlt: 'Modèle de démarrage SaaS',
  },
  { kind: 'projectTypeMarquee' },
  {
    kind: 'metrics',
    items: [
      { value: '×4', label: 'moins cher à développer' },
      { value: '×9', label: 'plus rapide à lancer' },
      { value: '×100', label: 'plus fiable en production' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: '82 langues', tone: 'reach' },
      { label: 'SEO intégré', tone: 'reach' },
      { label: 'AIO navigation agentique', tone: 'reach' },
      { label: 'Base de données propre', tone: 'data' },
      { label: 'Recherche vectorielle', tone: 'data' },
      { label: 'Graphe de connaissances', tone: 'data' },
      { label: 'Stockage de fichiers propre', tone: 'data' },
      { label: 'Autorisation', tone: 'access' },
      { label: '{roles} rôles', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Architecture Fractera', tone: 'code' },
      { label: '100+ de plus', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Processus',
    title: 'Comment ça marche',
    note: 'D\'un serveur vide à votre propre code en production. Tout ce qui suit tourne sur du matériel qui vous appartient.',
    steps: [
      { title: 'Mettez le serveur en route', text: 'Déployez-le avec le robot installateur Fractera. Vous obtenez un système d\'exploitation, un modèle de départ, le panneau de contrôle, les stockages et l\'autorisation — installés et reliés entre eux.' },
      { title: 'Développez là où vous travaillez déjà', text: 'Synchronisez avec GitHub, puis clonez sur votre propre machine et lancez Claude Code ou Codex. Les données continuent de venir de votre serveur ; le code s\'exécute dans votre propre IDE.' },
      { title: 'Poussez, et le déploiement se fait seul', text: 'Terminez sur la machine locale et envoyez le projet sur GitHub. Cela déclenche immédiatement un nouveau déploiement sur votre propre serveur — et le visiteur voit le nouveau projet.' },
    ],
  },
  {
    kind: 'cards',
    badge: 'Démarrage',
    title: 'Comment commencer',
    note: 'Tout ce qui suit est déjà installé — vous l\'activez, vous ne le construisez pas. À gauche le chemin ; à droite ce qui évite de le parcourir deux fois.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Sept étapes depuis un serveur vide' },
          {
            kind: 'olist',
            items: [
          'Ouvrez le panneau de contrôle — tout ce qui concerne ce serveur s\'y configure. [Panneau de contrôle]({admin}/{lang})',
          'Choisissez les langues dans lesquelles votre application sera livrée. [Langues]({admin}/{lang}/languages)',
          'Utilisez les réglages pour décrire votre projet : nom, description, logo, SEO. [Réglages de l\'app]({admin}/{lang}/app-settings)',
          'Connectez GitHub et envoyez le code du serveur vers votre dépôt. [GitHub]({admin}/{lang}/github)',
          'Clonez ce dépôt sur votre propre machine, développez-y, puis renvoyez vos changements.',
          "Transférez le fichier d'environnement `.env.local` sur votre machine — git ne le transporte jamais, et sans lui la copie locale ne démarre pas. [Variables d'environnement]({admin}/{lang}/env)",
          'Cliquez sur Déployer dans le panneau — le serveur récupère votre commit et se reconstruit lui-même. [Déploiements]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Recommandé avant de commencer' },
          { kind: 'p', text: 'Ni l\'un ni l\'autre ne bloque quoi que ce soit. Les deux évitent de refaire le travail.' },
          {
            kind: 'list',
            items: [
              '**Une clé OpenAI.** Sans elle, le Quiz ne pose aucune question, et sans cas l\'agent programmeur refuse de construire. Le site fonctionne quand même — seuls la recherche vectorielle et le graphe de connaissances restent vides. Saisie une fois ; la dépense va directement à votre fournisseur de modèle. [Clé OpenAI]({admin}/{lang}/openai)',
              '**Votre propre domaine.** Sur une adresse numérique, il n\'y a ni certificat ni application installable — le navigateur ne les accorde que sur connexion sécurisée. Déménager plus tard change l\'adresse de chaque page : c\'est moins cher avant l\'indexation. [Domaine]({admin}/{lang}/domain)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Avant tout code',
    title: 'Quiz — sept questions au lieu d\'une page blanche',
    note: 'L\'erreur la plus coûteuse d\'un projet se commet avant la première ligne de code : on construit la mauvaise chose. Pas par mauvaise construction, mais parce que « par où commencer » est difficile à répondre seul. Quiz transforme cela en conversation : vous répondez, le modèle continue à poser des questions, et il en sort la liste des scénarios avec laquelle le projet est ensuite construit.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'La graine' }, { kind: 'p', text: 'Sept questions courtes : ce qu\'est le produit, à qui il s\'adresse, ce qu\'une personne doit en retirer. Répondez avec vos propres mots — la dictée fonctionne. Tout ce qui suit part de là, donc quelques phrases donnent un résultat nettement meilleur que quelques mots.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'La conversation' }, { kind: 'p', text: 'Ensuite, une question à la fois, dans votre langue. Il existe un auto-quiz : le modèle pose cinq nouvelles questions et y répond lui-même, approfondissant la description — mais tout ce qu\'il a inventé en votre nom est marqué « Hypothèse », et vous le corrigez. Une supposition passée pour un fait réapparaîtrait plus tard, dans les scénarios finis.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Les scénarios' }, { kind: 'p', text: 'La conversation est synthétisée en cas numérotés : qui arrive, ce qu\'il fait, ce qui doit être vrai à la fin. Vous les lisez et les confirmez un par un. Un cas non lu reste une supposition du modèle.' }] },
    ],
  },
  { kind: 'statement', text: 'Et ceci n\'est pas un conseil mais une règle du produit : tant qu\'un seul cas reste non confirmé, le panneau garde son alarme allumée et l\'agent codeur refuse de construire. Construire sur une supposition non lue coûte plus cher que ne rien construire du tout.' },
  { kind: 'cta', href: '{admin}/{lang}/doc-use-cases', label: 'Ouvrir Quiz' },
  {
    kind: 'cards',
    badge: 'Architecture',
    title: 'Ce qu\'est ce projet, techniquement',
    note: 'Trois choses à savoir avant de construire : ce qu\'est ce squelette, où le code s\'écrit réellement, et ce qui se passe quand le projet dépasse ses cent premières pages.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'Ce n\'est pas un site fini mais l\'architecture Fractera : un même squelette porte aussi bien une landing page qu\'un gros SaaS ou une automatisation multi-niveaux. Grandir ne demande pas de réécriture — les couches données, autorisation et panneau sont déjà séparées, et chacune est conçue pour une charge que vous n\'avez pas encore.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Le code ne s\'écrit pas ici. Un développeur clone le dépôt sur sa propre machine et travaille avec Claude Code, qui lit les instructions et compétences vivant dans le projet : elles fixent les règles, et des vérifications automatiques empêchent qu\'on les enfreigne. Le serveur ne fait que recevoir le résultat et se reconstruire.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'Le squelette est conçu pour un projet qui dépassera le million de lignes : chaque entité a son propre dossier, la couche partagée ne grossit pas avec leur nombre, et les routes et permissions sont déclarées là où elles s\'appliquent. La stabilité ici n\'est pas une promesse mais une conséquence — une nouvelle page n\'ajoute rien à un tronc central.' }] },
    ],
  },
  {
    kind: 'noBill',
    badge: 'Indépendance',
    heading: 'Un espace entièrement indépendant',
    note: 'Sur un projet ordinaire, ce sont trois services extérieurs : leurs tarifs, leurs conditions et leur autorisation pour que votre projet continue de tourner. Ici, les trois vivent sur votre propre serveur.',
    items: [
      { vendor: 'Vercel', text: 'vous ne payez pas', badge: { label: 'hébergement', tone: 'reach' } },
      { vendor: 'Neon', text: 'vous ne payez pas', badge: { label: 'base de données', tone: 'data' } },
      { vendor: 'Clerk', text: 'vous ne payez pas', badge: { label: 'autorisation', tone: 'access' } },
    ],
    title: 'Vous ne payez personne',
    text: 'Vous ne dépendez de personne. Le projet est entièrement le vôtre.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'languageMarquee',
    title: 'Quatre-vingt-deux langues, prêtes avant que vous en ayez besoin',
    note: 'Toutes sont livrées avec le produit — vous activez celles que parle votre marché. Génération statique, optimisation pour la recherche et pour l\'IA, mise en cache des données et préparation aux fortes charges maintiennent l\'efficacité au sommet du secteur — et la maintiennent de la même façon, que vous travailliez avec une langue, plusieurs ou les quatre-vingt-deux.',
  },
],
}

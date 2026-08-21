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
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: "Prenez-le gratuitement, passez à l'échelle" },
    image: 'homePage',
    imageAlt: 'Modèle de démarrage SaaS',
  },
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
      { label: 'Open Code', tone: 'code' },
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
      { title: 'Mettez le serveur en route', text: 'Déployez-le avec le [robot installateur](https://www.fractera.ai/deployments/vps) Fractera. Vous obtenez un système d\'exploitation, un modèle de départ, le panneau de contrôle, les stockages et l\'autorisation — installés et reliés entre eux.' },
      { title: 'Développez là où vous travaillez déjà', text: 'Synchronisez avec GitHub, puis clonez sur votre propre machine et lancez Claude Code ou Codex. Les données continuent de venir de votre serveur ; le code s\'exécute dans votre propre IDE.' },
      { title: 'Poussez, et le déploiement se fait seul', text: 'Terminez sur la machine locale et envoyez le projet sur GitHub. Cela déclenche immédiatement un nouveau déploiement sur votre propre serveur — et le visiteur voit le nouveau projet.' },
    ],
  },
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
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
          { kind: 'p', text: 'Lancez le [robot installateur](https://www.fractera.ai/deployments/vps) pour obtenir ce projet.' },
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
          { kind: 'p', text: 'Rien de tout cela ne bloque quoi que ce soit. Les trois évitent de refaire le travail.' },
          {
            kind: 'list',
            items: [
              '**Une clé OpenAI.** Sans elle, le Quiz ne pose aucune question, et sans cas l\'agent programmeur refuse de construire. Le site fonctionne quand même — seuls la recherche vectorielle et le graphe de connaissances restent vides. Saisie une fois ; la dépense va directement à votre fournisseur de modèle. [Clé OpenAI]({admin}/{lang}/openai)',
              '**Votre propre domaine.** Sur une adresse numérique, il n\'y a ni certificat ni application installable — le navigateur ne les accorde que sur connexion sécurisée. Déménager plus tard change l\'adresse de chaque page : c\'est moins cher avant l\'indexation. [Domaine]({admin}/{lang}/domain)',
              "**Extension Claude pour Chrome.** Sans elle, l'agent ne voit que le code : les erreurs de console, le comportement sans JavaScript et l'aspect réel de la page ne sont écrits nulle part. Avec elle, il ouvre la page lui-même et corrige ce qui est là, pas ce qu'il a supposé. [Outils de développement]({admin}/{lang}/dev-tools)",
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
  // 🔒 ЛЕНТА НАПРАВЛЕНИЙ СТОИТ ПОД QUIZ, А НЕ ПОД ПЕРВЫМ ЭКРАНОМ (владелец
  // 2026-08-22). Наверху она была украшением: человек ещё не знает, зачем ему
  // список направлений. Здесь она довод — Quiz объясняет, КАК выбрать, а лента
  // показывает, ИЗ ЧЕГО. Две связанные вещи стоят рядом.
  { kind: 'projectTypeMarquee' },
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: "Prenez-le gratuitement, passez à l'échelle" },
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
    kind: 'quote',
    lead: 'Prêt pour la haute charge',
    text:
      'La réalité cachée du vibe coding : l\'essentiel d\'un projet se construit sans penser à la haute charge, à l\'économie de requêtes vers la base de données, à la mise en cache. Non parce que les développeurs l\'ignorent — mais parce que tenir ce standard à l\'intérieur d\'un framework est vraiment difficile. Trop de petites choses font glisser une page, sans bruit, de la génération statique vers le rendu dynamique. Et l\'écart n\'est ni de cinq ni de dix pour cent : dans certains cas la charge sur votre serveur est multipliée par mille, et votre facture de serveurs et de plateformes avec elle. Fractera est bâtie sur une longue expérience : plus de trente ans de développement web. Tout ce qui touche à la haute charge, à l\'optimisation pour les moteurs de recherche et à l\'économie sur les bases de données est inscrit dans l\'ADN du projet. C\'est son squelette et sa force vitale. Et elle est à vous, gratuitement.',
    cite: 'Roma Armstrong · fondateur de Fractera',
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
    kind: 'problemSolution',
    badge: 'Le déménagement est simple',
    title: 'Comment déplacer votre projet vers l’architecture Fractera',
    note: 'Votre projet tourne déjà — sur Vercel ou ailleurs. Et vous payez : l’hébergement, la base de données, le stockage des images, l’autorisation, les e-mails. Chaque service facture à part, et chaque facture grandit avec vous. Le déménagement paraît impossible ; il ne l’est pas : Fractera démonte votre projet et le remonte sur sa propre architecture, sur votre serveur, où tout cela existe déjà et ne coûte rien de plus.',
    demandLabel: 'Ce que vous faites',
    answerLabel: 'Pourquoi cela marche sur Fractera',
    items: [
      {
        title: 'Installer Fractera',
        demand: 'Achetez un serveur — à partir de trois euros par mois. Achetez un domaine — à partir d’un dollar par an. Lancez le robot d’installation et suivez-le : le reste, il le fait seul.',
        answer: 'Trois euros, c’est toute votre facture d’hébergement. Pas celle du premier mois, pas « jusqu’au dépassement du quota » — toute. Base de données, stockage d’images, connexion par mot de passe, courrier : tout est déjà sur votre serveur et compris dans ces trois euros. Il ne reste rien à payer à côté.',
      },
      {
        title: 'Choisir le mode déménagement',
        demand: 'Dans le panneau, ouvrez l’onglet « Déménager vers Fractera » et indiquez l’adresse de votre dépôt. Le temps du déménagement, gardez-le public — le vôtre et celui de Fractera ; vous pourrez les refermer quand vous voudrez. Enregistrez le mode.',
        answer: 'C’est le seul réglage que vous touchez à la main. À partir de là, le projet sait qu’il déménage et se comporte en conséquence : il ne part pas d’une page blanche, il démonte ce que vous avez déjà écrit.',
      },
      {
        title: 'Prévenir l’agent',
        demand: 'Ouvrez le projet dans votre éditeur, sur votre machine, là où vous travaillez d’habitude. Lancez-le et dites à l’agent que le déménagement commence. Avec des mots ordinaires, comme à un collègue.',
        answer: 'Ensuite il lit votre ancien projet lui-même : quelle architecture, quelles bibliothèques, ce qui dépend de quoi. Vous n’avez rien à expliquer ni à vous rappeler — il regarde le code, pas votre mémoire.',
      },
      {
        title: 'Recevoir le plan par étapes',
        demand: 'Rien. Regardez le résultat : l’énorme tâche « déplacer le projet » est dépliée en étapes, chacune avec son numéro et son but.',
        answer: 'Le déménagement cesse de faire peur parce qu’il cesse d’être un bloc. Vous voyez la liste : ce qui est fait, ce qui tourne, ce qui vient. Impossible de s’enliser à mi-chemin et de perdre le fil.',
      },
      {
        title: 'Monter le squelette',
        demand: 'Répondez aux questions sur les droits : qui pourra voir et modifier quoi dans votre application. Elles sont peu nombreuses et parlent toutes de votre produit, pas de technique.',
        answer: 'L’ossature se monte d’abord : adresses des pages, tables, connexion, dépôts — public pour le code, fermé pour ce qui ne doit pas être montré. On la monte une fois, et le projet grandit dedans au lieu d’être refait à chaque nouvelle fonction.',
      },
      {
        title: 'Ajouter les fonctions',
        demand: 'Suivez les étapes. Une étape, une fonction : une page, un formulaire, un paiement, des e-mails. Cochez ce qui est fait et ajoutez du neuf quand l’idée vient.',
        answer: 'Chaque étape est vérifiée et on vous montre qu’elle marche : pas « la compilation est passée », mais une page vivante avec votre propre texte. Vous savez donc toujours où vous en êtes, et vous ne restez jamais avec un projet « à peu près prêt ».',
      },
      {
        title: 'Déplacer les données',
        demand: 'Donnez à l’agent l’accès à vos bases. Il déplace ce qui s’est déjà accumulé : utilisateurs, commandes, textes, images.',
        answer: 'C’est la dernière étape. Après elle, vous avez sur votre serveur une copie complète et vivante du projet — avec vos données, vos gens et votre domaine. Les anciennes factures peuvent être annulées : désormais vous payez le serveur et le domaine, rien d’autre.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Quatre-vingt-deux langues, prêtes avant que vous en ayez besoin',
    note: 'Toutes sont livrées avec le produit — vous activez celles que parle votre marché. Génération statique, optimisation pour la recherche et pour l\'IA, mise en cache des données et préparation aux fortes charges maintiennent l\'efficacité au sommet du secteur — et la maintiennent de la même façon, que vous travailliez avec une langue, plusieurs ou les quatre-vingt-deux.',
  },
],
  faq: [
    {
      q: 'Combien cela coûte-t-il, et y a-t-il des frais cachés ?',
      a: 'Il n’y a pas de frais cachés parce qu’il n’y a personne à payer : la plateforme est en code ouvert, et tout ce que vous installez et utilisez vous appartient à cent pour cent. Vos dépenses, ce sont votre serveur, votre domaine et l’IA en nuage si vous vous en servez ; vous les calculez vous-même et payez directement le fournisseur. Nous ne prenons ni abonnement, ni pourcentage, ni frais par utilisateur.',
    },
    {
      q: 'Quel est l’avantage principal ?',
      a: 'La fiabilité — c’est là qu’est mise la mise. Il existe aujourd’hui bien des façons de monter vite une application, et mieux vaut ne pas se faire d’illusions : presque toutes sont faites pour que vous payiez d’abord vos propres erreurs. Une application efficace n’intéresse que vous ; celui qui vous vend des services a intérêt à ce que vous en achetiez et en payiez le plus possible, séparément. Le plus cher vient ensuite : enfreindre la loi et être sanctionné à cause de l’endroit où sont les données, des coupures imprévues, des sanctions, et tout simplement la perte de vos données. Fractera ferme cela en gardant tout sur votre propre serveur.',
    },
    {
      q: 'Et s’il me faut davantage ?',
      a: 'Votre outil principal est le vôtre — Claude Code, Codex ou un autre — et il tourne sur votre machine. Le projet monte loin en charge : le squelette est taillé pour des millions de lignes et reste efficace. Et s’il vous faut un changement conceptuel d’architecture au niveau du panneau de contrôle, ou si construire l’application reste difficile, envoyez une demande à admin@fractera.ai : un développeur vous contactera et proposera une solution.',
    },
  ],
}

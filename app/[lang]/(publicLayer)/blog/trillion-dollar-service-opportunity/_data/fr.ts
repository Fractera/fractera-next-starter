import type { BlogOverride } from '../../_lib/types'

// Version française. Ton de l'auteur (Roma Armstrong) : personnel, direct,
// inspirant. L'ancre racine obligatoire « Agentic Engineering Infrastructure »
// (terme non traduit) → /fr.
export const fr: BlogOverride = {
  title: "L'opportunité à mille milliards de dollars, c'est le salon d'à côté",
  subtitle:
    "Elon Musk a parlé de l'espace, de l'IA et des voitures. La phrase qui m'est restée était plus simple : la plupart des entreprises sur terre n'ont toujours pas d'API. Voici la voie que j'ai trouvée grâce à ça.",
  description:
    "Pourquoi le gros de l'argent à court terme dans l'IA n'est pas dans une licorne — il est dans le salon de coiffure, la clinique, le cabinet dentaire d'à côté. Le problème des rendez-vous manqués, les entreprises sans site ni CRM, et comment un espace de travail self-hosted permet à presque n'importe qui de les automatiser sans monter d'abord toute une pile de services.",
  excerpt:
    "Elon Musk a dit que la plupart des entreprises n'ont toujours pas d'API — elles fonctionnent avec un téléphone, ou même sans ça. J'ai passé des dizaines de rendez-vous à creuser cette idée et j'ai trouvé une niche cachée à la vue de tous : le salon, la clinique, le cabinet dentaire d'à côté.",
  blocks: [
    {
      kind: 'p',
      text:
        "C'est un post un peu inhabituel, parce qu'il commence par quelqu'un d'autre. L'interview d'Elon Musk ci-dessus a capté mon attention — il a parlé de l'espace, d'intelligence artificielle, de voitures. Mais le moment qui m'a le plus inspiré a été un moment tranquille. Il a dit que malgré l'impression que donne le monde moderne — comme si tout avait déjà été inventé, chaque site construit, chaque application livrée, chaque processus métier automatisé — l'écrasante majorité des entreprises sur terre n'ont même pas d'API. Elles fonctionnent avec un téléphone. Certaines fonctionnent sans même ça.",
    },
    {
      kind: 'quote',
      text:
        "Si l'IA peut simplement prendre en charge tout ce qui est déjà confié à l'entreprise de service client externalisée qu'elles utilisent déjà, et faire ce service client avec les applications qu'elles utilisent déjà, alors on peut faire des progrès considérables dans le service client, qui représente, je crois, environ 1 % de l'économie mondiale. Ça avoisine les mille milliards de dollars, au total, rien que pour le service client.",
      cite: 'Elon Musk · Interview de Dwarkesh Patel, février 2026',
    },
    {
      kind: 'p',
      text:
        "Relis ça avec un œil de bâtisseur. Ces mille milliards ne vivent pas dans un autre réseau social ni dans un autre habillage d'IA — ils vivent à l'intérieur d'entreprises ordinaires qui ne se sont jamais numérisées. Et la barrière n'a jamais été l'idée ; c'était la construction. Embaucher une équipe, câbler une infrastructure, payer mois après mois pour une pile de services cloud. Cette barrière, c'est exactement ce qu'un espace de travail self-hosted supprime — c'est pour ça que cette phrase tranquille, et pas les fusées, est celle que j'ai gardée.",
    },

    { kind: 'h2', text: 'Tout le monde a appris à coder. La rue a l\'air identique.' },
    {
      kind: 'p',
      text:
        "À force de parler avec beaucoup de partenaires, je vois toujours les deux mêmes scénarios. D'un côté, un flot de développeurs — et même des gens qui n'avaient jamais été développeurs, des gens qui faisaient du marketing ou géraient du contenu — ont soudain appris à programmer en une seule année. Tout le monde s'est mis à construire. Il y a énormément de projets, et beaucoup sont vraiment intéressants. Et dans le monde réel ? Dans le monde réel, tout est exactement pareil.",
    },
    {
      kind: 'p',
      text:
        "Il s'avère donc que certains d'entre nous ont trouvé une merveilleuse façon de se faire plaisir — la décharge de dopamine du savoir nouveau. Mais il est aussi temps d'en tirer de l'argent. Alors, vers où déplaces-tu ton attention ?",
    },
    {
      kind: 'founder',
      text:
        "Le problème : nous ne pouvons pas prédire l'avenir. Surtout maintenant, alors que le marché et la technologie ont commencé à changer à une vitesse extraordinaire. S'adapter au changement est un processus douloureux de changement de stratégie.",
    },

    { kind: 'h2', text: 'Je suis parti chercher la réponse. J\'ai trouvé un salon de coiffure.' },
    {
      kind: 'p',
      text:
        "Après avoir étudié cette vidéo en détail et mené plusieurs dizaines de rendez-vous pour confirmer la réponse à cette question, j'ai trouvé une niche d'affaires très intéressante : les salons de beauté et la cosmétologie non chirurgicale, les centres médicaux, les cabinets dentaires. Malgré une abondance d'outils d'automatisation et de systèmes CRM, ils rencontrent un problème étonnamment souvent : un client laisse une demande, réserve une visite — puis ne vient pas. Quand le responsable l'appelle — généralement à l'heure même où le rendez-vous devait commencer — les clients répondent souvent : « oh, on avait oublié. Pourquoi vous ne nous l'avez pas rappelé ? »",
    },
    {
      kind: 'p',
      text:
        "Bien sûr, il existe une multitude de solutions toutes faites qu'on peut installer. Mais il y a encore plus de clients qui n'en ont jamais installé une — et beaucoup d'entre eux n'ont pas de site, beaucoup n'ont même pas de CRM du tout.",
    },

    { kind: 'h2', text: "C'est exactement pour ça qu'existe un espace de travail comme celui-ci." },
    {
      kind: 'p',
      text:
        "[%SITE%](/fr) est un espace de travail d'ingénierie agentique self-hosted, construit précisément pour des scénarios comme celui-ci. Il arrive avec les pièces qu'une telle entreprise devrait sinon acheter séparément : une base de données et des tables à elle, du stockage de fichiers, de la voix transformée en texte, un canal pour joindre un client dans une messagerie, une autorisation avec des rôles, et un site public qu'un moteur de recherche peut vraiment lire. Le propriétaire de l'entreprise peut avoir autant d'idées qu'il veut ici — les pièces sont déjà sur l'étagère.",
    },
    {
      kind: 'p',
      text:
        "L'avantage, c'est qu'avant, matérialiser ces idées voulait dire travailler incroyablement longtemps avec une équipe produit, puis embaucher des programmeurs, puis réfléchir sans fin à comment tout ça fonctionne — ou acheter des services coûteux pour ses propres besoins. Maintenant tout ça est simple. Grâce à l'ingénierie agentique, presque n'importe qui peut prendre un téléphone et décrire comment il aimerait optimiser son entreprise, et le faire lui-même ou avec l'aide de quelqu'un qui comprend déjà un peu tout ça.",
    },
    {
      kind: 'p',
      text:
        "Ça te libère aussi d'avoir à te souvenir de quels services tu es censé payer. La plupart des services cloud qui se transforment en paiements réguliers et forment la part du lion de tes coûts — une base de données, du stockage, un abonnement CRM — sont déjà des fonctionnalités ordinaires de ta propre application, tournant sur ton propre serveur. Et les changements du quotidien ne sont pas du tout un déploiement : le nom, les textes, les images et les langues s'éditent dans un panneau de contrôle et s'appliquent sans reconstruction, tandis que le code vit dans un dépôt qui t'appartient.",
    },

    { kind: 'h2', text: 'Un cas parmi tant d\'autres. Tu peux en trouver chaque jour.' },
    {
      kind: 'p',
      text:
        "L'exemple ci-dessus est un cas parmi tant d'autres. Tu peux trouver des cas comme celui-là littéralement chaque jour et gagner de l'argent en les mettant en œuvre — ou tu peux ajouter la matérialisation de nouvelles idées à l'intérieur de ta propre entreprise, parce que c'est pratiquement gratuit maintenant. Ça n'a jamais été comme ça avant.",
    },
    {
      kind: 'p',
      text:
        "Et bien qu'il semble presque impossible de trouver une nouvelle niche pour une startup licorne — peut-être que ça ne vaut pas la peine d'y penser. Plutôt que de rêver de construire une licorne, tu peux simplement automatiser le salon de coiffure d'à côté, ou le salon de beauté, ou le garage automobile. Tous ceux avec qui tu es déjà en contact depuis longtemps. Tous ceux qui te font déjà confiance. C'est peut-être le moment d'essayer ?",
    },
  ],
  faq: [
    {
      q: 'Pour quel type d\'entreprise est-ce le mieux adapté ?',
      a: "Les entreprises de services locales avec des rendez-vous et des clients récurrents — salons, cosmétologie non chirurgicale, cliniques, cabinets dentaires, garages automobiles — surtout celles sans site ni CRM et avec un problème récurrent de rendez-vous manqués.",
    },
    {
      q: 'Est-ce que je paie séparément pour une base de données, du stockage, un abonnement CRM ?',
      a: "Non. Ce sont des pièces ordinaires intégrées à ta propre application sur ton propre serveur, pas des abonnements tiers facturés chaque mois. Ce que tu payes, c'est le serveur lui-même.",
    },
    {
      q: 'Dois-je être développeur ?',
      a: "Pas pour ce qu'une entreprise change le plus souvent : les noms, les textes, les prix, les images et les langues s'éditent dans le panneau de contrôle et s'appliquent sans reconstruction. Construire quelque chose de nouveau, c'est le travail d'un agent de code qui travaille dans ton dépôt — le tien, ou celui de quelqu'un qui comprend déjà un peu tout ça. Le serveur, le modèle d'IA et le domaine sont connectés pour toi.",
    },
  ],
}

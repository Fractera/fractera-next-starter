import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const fr: FooterPageCell = {
  title: 'Architecture',
  description:
    'Comment cette application est assemblée : les couches, ce que chacune possède et lesquelles continuent de fonctionner lorsque les autres sont éteintes.',
  keywords: 'architecture, couches, génération statique, propre serveur, couche de données',
  blocks: [
    {
      kind: 'p',
      text: 'Cette page décrit le squelette sur lequel repose l’application. Elle est écrite pour deux lecteurs à la fois — une personne qui décide si le produit convient, et un agent de codage qui va le modifier. Tous deux ont besoin de la même chose : savoir quelle couche possède quoi, avant de toucher à quoi que ce soit. Retour à [%SITE%](/fr).',
    },

    { kind: 'h2', text: 'Comment elle est câblée' },
    {
      kind: 'p',
      text: 'Plusieurs processus s’exécutent côte à côte sur votre serveur. Quatre d’entre eux répondent vers l’extérieur, et chacun a exactement une tâche. La frontière entre eux est un port plutôt qu’un dossier — c’est pourquoi une panne dans l’un n’entraîne pas les autres.',
    },
    {
      kind: 'table',
      headers: ['Port', 'Processus', 'À quoi il sert'],
      rows: [
        ['3000', 'Votre application', 'Les pages que voient les visiteurs. C’est celle avec laquelle vous travaillez tous les jours.'],
        ['3001', 'Autorisation', 'Comptes, sessions, rôles. Configuré depuis le panneau de contrôle, non édité par vous.'],
        ['3002', 'Panneau de contrôle', 'De même : configuré, non édité.'],
        ['3300', 'Couche de données', 'Lignes, fichiers téléversés, vecteurs — et la seule porte vers tout le reste. Votre application communique avec elle.'],
      ],
    },
    { kind: 'p', text: 'Trois autres services fonctionnent en parallèle, et aucun d’eux n’est une porte à lui seul :' },
    {
      kind: 'list',
      items: [
        'la carte — itinéraires, matrices de distance et recherche d’adresses, port 3400 ;',
        'les canaux — Telegram et ce qui suit, port 3500 ;',
        'le graphe de connaissances — le magasin RAG agentique, port 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Aucun de ces ports n’est accessible depuis Internet : le pare-feu n’admet que les ports web, et tout ce qui est public arrive par leur intermédiaire. Votre application atteint les trois services via la couche de données — /service/geo, /service/channels, /service/rag — avec la même clé qui ouvre la couche de données elle-même.',
    },

    { kind: 'h2', text: 'Chaque couche survit aux autres' },
    {
      kind: 'p',
      text: 'Des processus séparés ne sont pas un schéma — c’est ce qui se produit un mauvais jour. N’importe lequel des quatre peut s’arrêter sans que le reste ne tombe avec lui.',
    },
    {
      kind: 'table',
      headers: ['Si ceci s’arrête', 'Ce qui fonctionne toujours'],
      rows: [
        ['Votre application', 'Le panneau, les données et les comptes sont intacts ; seul le site est hors ligne'],
        ['Panneau de contrôle', 'Le site continue de servir les visiteurs ; seules les modifications doivent attendre'],
        ['Couche de données', 'Les pages générées à l’avance s’ouvrent toujours — c’est à cela que sert la génération statique'],
        ['Autorisation', 'Les pages publiques ne sont pas affectées ; seul ce qui se trouve derrière une connexion se ferme'],
      ],
    },
    {
      kind: 'note',
      text: 'Le panneau vit délibérément en dehors de votre dépôt. Ce qui voyage vers votre GitHub, c’est l’application ; le cockpit reste sur le serveur, c’est pourquoi une erreur d’édition ne peut pas le casser.',
    },

    { kind: 'h2', text: 'Le statique d’abord, et ce que cela vous apporte' },
    {
      kind: 'p',
      text: 'Les pages sont générées à l’avance, non assemblées par requête. Ce n’est pas un détail de performance — c’est la raison pour laquelle le site reste peu coûteux à servir sous la charge, entièrement lisible par les moteurs de recherche et fonctionnel avec JavaScript désactivé.',
    },
    {
      kind: 'list',
      items: [
        'Le routage est côté serveur, ainsi un visiteur avec les scripts désactivés navigue toujours sur l’ensemble du site.',
        'Le contenu est régénéré selon un calendrier plutôt qu’à chaque visite, ainsi un pic de trafic ne coûte rien de plus.',
        'Tout ce qui dépend réellement de qui regarde — un tableau de bord, un compte — est rendu par requête, et seulement cette partie-là.',
      ],
    },

    { kind: 'h2', text: 'Un design, décidé une fois pour toutes' },
    {
      kind: 'p',
      text: 'Les couleurs, la typographie et les espacements ne sont pas choisis par page. Toute l’échelle vit à un endroit, la palette à un autre, et un titre écrit à la main échoue à une vérification avant même d’atteindre le site.',
    },
    {
      kind: 'p',
      text: 'La loi sous-jacente est courte : **rien dans l’apparence d’une page ne dépend de qui peut l’ouvrir.** Public ou privé, vitrine ou tableau d’administration — mêmes titres, même échelle, mêmes couleurs. L’accès décide de ce qu’une personne peut voir, jamais de la façon dont c’est composé.',
    },
    {
      kind: 'p',
      text: 'Ceci est écrit parce que son absence a une forme. Tant que le fichier de design était vide, l’agent construisant ce projet a inventé un second style de titre pour les « écrans de travail » — deux pages privées se sont retrouvées avec un écart de taille du simple au double et composées dans des familles différentes. Rien n’était cassé ; cela se lisait simplement comme deux produits différents.',
    },
    {
      kind: 'p',
      text: 'Votre palette est un petit fichier de rôles de couleurs, lu au moment où la page est servie. Modifiez-le et l’ensemble du site suit — y compris les pages que vous n’avez pas encore construites, et y compris les deux thèmes : clair et sombre sont les mêmes rôles avec des valeurs différentes, et non deux designs à maintenir synchronisés à la main.',
    },

    { kind: 'h2', text: 'Langues : 82 disponibles, et en ajouter une ne coûte rien' },
    {
      kind: 'p',
      text: 'Quatre-vingt-deux langues sont livrées avec le produit. Vous activez celles que votre marché parle, et le reste attend — en activer une plus tard est un simple réglage, pas une re-conception de la façon dont fonctionne le site.',
    },
    {
      kind: 'p',
      text: 'La partie qui mérite d’être comprise est ce qu’ajouter une langue NE FAIT PAS :',
    },
    {
      kind: 'list',
      items: [
        'Cela ne rend aucune page dynamique. Chaque langue obtient ses propres pages, générées à l’avance exactement comme la première — dix langues signifient dix ensembles de pages statiques, pas une page assemblée par requête.',
        'Cela ne dilue pas le référencement naturel. Chaque page se déclare comme l’originale dans sa propre langue et nomme ses traductions, ainsi un moteur de recherche les traite comme une seule page en dix langues plutôt que dix quasi-doublons en compétition les uns avec les autres.',
        'Cela ne coûte rien en vitesse. Servir une page pré-rendue représente le même travail, quel que soit le nombre de langues existant à côté.',
      ],
    },
    {
      kind: 'note',
      text: 'Un site unilingue est un cas à part entière, pas une version amputée : la langue disparaît complètement des adresses, et le site cesse de promouvoir des traductions qu’il n’a pas.',
    },

    { kind: 'h2', text: 'Trouvé par les moteurs de recherche, lisible par les modèles' },
    {
      kind: 'p',
      text: 'Deux lecteurs arrivent sur un site moderne, et ils veulent des choses différentes. Un moteur de recherche envoie une personne vers une page. Un modèle vient lui-même, lit et reformule. Le produit est conçu pour les deux, et les deux ne représentent pas la même tâche.',
    },
    {
      kind: 'p',
      text: 'Pour les moteurs de recherche : les pages sont servies sous forme de HTML fini, chacune déclare sa propre adresse canonique, les traductions se désignent mutuellement, les métadonnées sont assemblées par un seul mécanisme plutôt que par page, et les données structurées, sitemaps et règles robots sont livrés par défaut. Des contrôles automatisés refusent une page qui enfreint l’une de ces règles.',
    },
    {
      kind: 'p',
      text: 'Pour les modèles : chaque page publique existe aussi en texte brut. Il y a une carte sur /llms.txt, l’ensemble du corpus sur /llms-full.txt, et une version markdown de chaque page à côté. Cela importe car le balisage d’une page est à moitié du bruit pour un modèle — menus, pied de page, bannière de consentement, scripts — et il dépense son contexte pour tout cela.',
    },
    {
      kind: 'note',
      text: 'Les deux formes sont construites à partir du MÊME contenu. Il n’y a pas de « version pour IA » séparée qui risquerait de se désynchroniser : modifiez le texte une fois et les deux changent ensemble. Une copie maintenue à la main divergerait dès la première correction, et personne ne s’en rendrait compte, car personne ne l’ouvre dans un navigateur.',
    },

    { kind: 'h2', text: 'Les paramètres s’appliquent sans re-build' },
    {
      kind: 'p',
      text: 'Le nom, la description, le logo, les couleurs, les langues et les interrupteurs de fonctionnalités vivent dans des fichiers de configuration sur le serveur, en dehors du code. L’application les lit lorsqu’elle sert les pages, de sorte qu’une modification dans le panneau est immédiatement visible — aucun déploiement, aucune interruption de service.',
    },
    {
      kind: 'p',
      text: 'La conséquence importe plus que la commodité : la même base de code sert une boulangerie et une place de marché, et aucune n’a eu besoin d’être forkée pour en arriver là.',
    },

    { kind: 'h2', text: 'Votre serveur, votre code, et la porte de sortie' },
    {
      kind: 'p',
      text: 'L’application vous appartient : clonez-la, éditez-la localement, puis repoussez-la. Rien ici ne télécharge d’informations vers l’extérieur — il n’y a aucun fournisseur à qui demander l’autorisation et aucun abonnement qui puisse être révoqué.',
    },
    {
      kind: 'p',
      text: 'Vous pouvez aussi partir. Retirez la dépendance au panneau et l’application fonctionne n’importe où. Vous perdez les parties qui vivent sur le serveur — paramètres sans re-build, la couche de données, la recherche vectorielle, l’autorisation en 82 langues, l’historique de déploiement avec retour en arrière — et vous conservez le code. C’est une sortie légitime, pas une déviation par rapport à la conception.',
    },

    { kind: 'h2', text: 'Conçu pour continuer à croître après l’épuisement du contexte' },
    {
      kind: 'p',
      text: 'La limite stricte d’un projet construit par IA n’est pas la taille du code. C’est la quantité de ce code qui doit être comprise d’un coup avant de pouvoir faire une modification en toute sécurité. Un projet où chaque nouvelle page s’ajoute à un fichier central heurte rapidement ce mur : à terme, aucune session ne peut en contenir suffisamment pour modifier quoi que ce soit sans casser autre chose.',
    },
    {
      kind: 'p',
      text: 'La structure choisie ici va exactement à l’encontre de cela. **Chaque entité possède son propre dossier** — ses pages, ses données, ses mots, ses composants privés. Supprimez le dossier et rien ne se retrouve orphelin ailleurs.',
    },
    {
      kind: 'list',
      items: [
        'La couche partagée ne grandit pas à mesure que des entités sont ajoutées. Quelque chose ne monte vers un espace partagé que lorsque deux éléments l’utilisent réellement, et ce déplacement est un acte délibéré, pas une habitude.',
        'Les permissions sont déclarées là où elles sont appliquées, et non dans un registre que quelqu’un doit penser à mettre à jour.',
        'Les groupes de routes rendent les deux types de pages visibles sur le disque : le contenu public d’un côté, les écrans protégés par des rôles de l’autre. Un dossier n’appartenant à aucun des deux est une question sans réponse, et une vérification le signale à voix haute.',
      ],
    },
    {
      kind: 'p',
      text: 'La conséquence est là tout l’intérêt : une modification apportée à une entité nécessite de lire un seul dossier. Des millions de lignes restent exploitables non pas parce que quelqu’un les garde en mémoire, mais parce qu’aucune modification individuelle n’a jamais besoin de le faire.',
    },
    {
      kind: 'p',
      text: 'Le projet de départ applique cette même idée au commencement. Ce qui est livré n’est pas un dépôt vide, mais un exemple fonctionnel de chaque motif — une page, un article, un catalogue, un écran privé, une boîte de dialogue, une cellule de langue. Une nouvelle page est créée en copiant une page fonctionnelle, de sorte que la structure se propage par construction plutôt que par discipline.',
    },

    { kind: 'h2', text: 'Les documents auxquels l’agent obéit' },
    {
      kind: 'p',
      text: 'Un agent de codage commence chaque session sans aucun souvenir de la précédente. Ce qui survit est écrit, à l’intérieur du projet, et lu au début de chaque session. Ce corpus fait tout autant partie de l’architecture que les ports — c’est ce qui rend la deuxième session aussi compétente que la première.',
    },
    {
      kind: 'table',
      headers: ['Document', 'À quoi il sert'],
      rows: [
        ['Cas d’usage', 'À QUOI sert le produit, un fichier par scénario : qui arrive, ce qui l’a amené, ce qui doit être vrai lorsqu’il a terminé. Aucun cas confirmé signifie aucune construction — l’agent est tenu de s’arrêter et de poser des questions au lieu de deviner.'],
        ['Étapes de développement', 'Le travail lui-même, sous forme de fichiers. Une étape est ouverte avant d’être exécutée et déplacée dans le dossier des étapes terminées avec un rapport complet. Une session qui s’interrompt ne perd rien ; une session à froid reprend à partir des fichiers.'],
        ['Tests', 'Comment prouver qu’une étape est terminée : deux preuves indépendantes issues de deux plans différents, rédigées en toutes lettres. Un build vert n’en fait jamais partie — un journal de build semble identique, que la fonctionnalité marche ou non.'],
        ['Anti-patterns', 'Les approches qui ont déjà coûté du temps ici, chacune avec le mécanisme de l’échec. Auto-évolutif : l’agent les ajoute dès qu’une impasse est comprise.'],
        ['Leçons', 'Vos préférences et les habitudes acquises en vous trompant une fois. Lorsqu’une leçon et le comportement par défaut de l’agent sont en désaccord, la leçon l’emporte — elle existe parce que le choix par défaut a déjà échoué ici.'],
        ['Design', 'L’apparence des pages, décidée par vous et respectée. Donné, non évolutif.'],
      ],
    },
    {
      kind: 'p',
      text: 'Deux d’entre eux méritent un mot sur leur sens d’écriture. **Les anti-patterns et les leçons sont écrits par l’agent** ; le document de design est écrit par vous. La différence est délibérée : un agent peut enregistrer ce qu’il a appris, mais ne peut pas décider de ce à quoi le produit doit ressembler.',
    },
    {
      kind: 'note',
      text: 'Les cas d’usage passent des fichiers à un service. La conversation qui les produit vit déjà dans le panneau de contrôle ; ensuite, ils se déplaceront derrière une interface d’outils adossée à une base de données, afin que l’agent demande les cas dont il a besoin au lieu de lire un dossier. La règle ne change pas avec le stockage — pas de cas confirmé, pas de construction. Ce qui change, c’est que les cas cessent d’être un document que l’agent doit penser à ouvrir.',
    },

    { kind: 'h2', text: 'Plusieurs produits sur un seul serveur' },
    {
      kind: 'p',
      text: 'Un cas doit appartenir à quelque chose. Dans ce produit, il appartient à un **produit** — et un serveur en transporte plusieurs : une page d’atterrissage aujourd’hui, un observateur planifié la semaine prochaine, le cerveau de l’entreprise après cela.',
    },
    {
      kind: 'p',
      text: 'L’objection est légitime et mérite d’être posée avant la réponse : **un site web est normalement un seul produit.** Si vous construisez un système de production professionnel pour une entreprise, c’est exact, et rien ici ne le contredit — mettez un produit sur un serveur et le reste de cette section ne vous coûte rien.',
    },
    {
      kind: 'p',
      text: 'Mais ce n’est plus la seule chose que les gens construisent. De plus en plus, ce dont une personne a besoin est un petit service pour sa propre efficacité : quelque chose qui s’exécute selon un calendrier et signale ce qui a changé, quelque chose qui cherche par jugement plutôt que par mot-clé, quelque chose qui gère une tâche récurrente dans les ventes, le marketing ou les opérations. Chacun d’eux est trop petit pour mériter son propre serveur, son propre domaine et sa propre facture — et ensemble, ils forment un système.',
    },
    {
      kind: 'p',
      text: 'Ainsi, l’unité de travail est le produit, pas le site. Regrouper un produit sur sa propre page ou poignée de pages est ce qui permet à un agent de codage de savoir, sans demander, lequel il est en train de modifier.',
    },

    { kind: 'h3', text: 'Pourquoi ne pas simplement l’appeler un projet' },
    {
      kind: 'p',
      text: 'Parce qu’un projet n’est pas un lieu. Il n’a pas d’adresse, pas de dossier et pas de tables, de sorte qu’un cas qui lui est rattaché ne peut pas être exécuté — l’agent doit encore deviner où va le travail. Un produit a les trois, et c’est toute la différence : un cas rattaché à un produit est une instruction exécutable.',
    },
    {
      kind: 'p',
      text: 'Un produit possède quatre racines, et aucune d’entre elles n’est configurée à la main — toutes les quatre sont **dérivées** de son enregistrement :',
    },
    {
      kind: 'table',
      headers: ['Racine', 'Dérivée de'],
      rows: [
        ['Ses pages', 'Son adresse — dans ce framework, un nom de dossier EST le segment d’URL'],
        ['Sa logique', 'Son identifiant permanent'],
        ['Ses tables', 'Son identifiant permanent, sous forme de préfixe de nom'],
        ['Ses cas', 'Son identifiant permanent'],
      ],
    },
    {
      kind: 'p',
      text: 'Lorsqu’il travaille sur un cas, l’agent écrit à l’intérieur de ces quatre racines et nulle part ailleurs. Le code partagé vit dans une racine partagée, et y déplacer quelque chose est un acte délibéré énoncé dans l’étape — aller chercher un composant dans un produit voisin est le geste exact que cette règle existe pour empêcher, car c’est ainsi que la modification d’un propriétaire casse silencieusement un autre produit des semaines plus tard.',
    },
    {
      kind: 'p',
      text: 'L’identifiant est délibérément dénué de sens — p1, p2 — et ne change jamais. Il ne peut pas être dérivé du titre ou de la structure, car vous modifierez les deux, et les chemins dépendent de l’identifiant. Cela a été prouvé le jour même où la règle a été écrite : un produit dont l’identifiant indiquait « store » s’est révélé être le cerveau d’une entreprise.',
    },

    { kind: 'h3', text: 'Chaque produit n’a pas forcément de page' },
    {
      kind: 'p',
      text: 'Un produit déclare l’une des trois surfaces, et le choix par défaut penche toujours vers le fermé :',
    },
    {
      kind: 'list',
      items: [
        '**Public** — il a une adresse et les visiteurs l’atteignent.',
        '**Privé** — il vit comme un onglet dans votre panneau de contrôle, et le monde extérieur n’a aucun moyen d’y entrer.',
        '**Headless** — il n’a aucun écran : il fonctionne via des canaux et selon un calendrier, et vous le retrouvez dans Telegram ou dans son rapport.',
      ],
    },
    {
      kind: 'p',
      text: 'Un produit porte également un statut — en cours de description, en cours de construction, en ligne (live). Le passer en ligne le publie, et c’est un simple réglage : rien n’est reconstruit et rien n’est déployé.',
    },

    { kind: 'h3', text: 'À quoi cela ressemble en pratique' },
    {
      kind: 'p',
      text: 'Prenons une consultante avec un serveur. Son premier produit est une page d’atterrissage : publique, à la racine, avec un seul objectif — obtenir une demande de contact. Ses cas indiquent qui arrive et ce qui doit être vrai lorsqu’ils repartent.',
    },
    {
      kind: 'p',
      text: 'Son second produit arrive plus tard et ne partage rien avec le premier à part le serveur. Au début, les demandes venues de la page d’accueil tombaient simplement dans sa messagerie — cela suffisait tant qu’il y en avait cinq par semaine. Puis il y en a eu trente, et il a fallu un endroit où l’on voit qui a écrit, ce qu’on lui a répondu et comment cela s’est terminé : son propre système de traitement des demandes. Il est derrière une connexion, avec ses pages, ses tables et ses rôles, et ses cas décrivent le travail avec un client, non la première visite d’un inconnu.',
    },
    {
      kind: 'p',
      text: 'Tous deux vivent sur un même serveur, et aucun ne peut endommager discrètement l’autre : pages séparées, logique séparée, tables séparées, cas séparés. Quand elle demande à l’agent de modifier la formulation du formulaire de contact, rien concernant le système de demandes n’est concerné — non pas parce que l’agent a fait attention, mais parce que la frontière a été décidée avant que l’un ou l’autre ne soit construit. Plus tard, un troisième et un quatrième les rejoindront — envois, rapports, stock — et la règle ne changera pas : un serveur, des produits distincts.',
    },
    {
      kind: 'note',
      text: 'Le plan et la réalité sont maintenus séparés à dessein. Les pages qu’un produit DEVRAIT avoir sont écrites ; les pages qu’il a réellement sont comptées en parcourant les dossiers, jamais stockées. Une liste manuscrite de ce qui existe diverge de la réalité dès la première semaine — l’agent construit une page et oublie la liste. L’écart entre les deux est la réponse à « ce qui manque encore », et il n’est digne de confiance que parce qu’une de ses moitiés ne peut pas être falsifiée.',
    },
  ],
}
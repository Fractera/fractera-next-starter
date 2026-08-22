import type { BlogOverride } from '../../_lib/types'

// Traduction française. Ton de l'auteur : direct, sans registre académique,
// adressé au lecteur.
// Les termes de produit et les noms propres ne se traduisent pas (Claude Code,
// Anthropic, CI, LLM).
// Les diagrammes sont traduits avec le texte : un diagramme en anglais dans un
// article en français se lit comme une traduction à moitié faite.

const POST_1_LINEAR = `tu écris un prompt  ─▶  l'IA écrit du code  ─▶  tu trouves le bug  ─▶  tu corriges le prompt  ─┐
     ▲                                                                          │
     └──────────────────────────  encore à la main  ◀─────────────────────────────────┘`

const POST_1_LOOP = `tu fixes l'objectif
     │
     ▼
l'IA écrit du code  ─▶  la CI fait tourner tous les tests  ─▶  au vert ?  ─▶  ✦ livré
     ▲                      │
     │                      ▼  (au rouge)
     └──  l'IA lit les journaux et se reformule elle-même la consigne`

export const fr: BlogOverride = {
  title: "L'ingénierie de prompts est morte. Vive l'ingénierie de boucles.",
  subtitle:
    "Pourquoi le responsable de Claude Code chez Anthropic vient de signer la fin de l'ère du « chuchoteur d'IA » — et ce qui vient ensuite.",
  description:
    "Boris Cherny, qui dirige Claude Code chez Anthropic, dit qu'il n'écrit plus de prompts pour Claude — il écrit des boucles. Plongée dans la mort de l'ingénierie de prompts et la naissance de l'ingénierie de boucles : flux de travail agentiques, agents autocorrecteurs, pourquoi le juge compte plus que la formulation, et comment cette même boucle est câblée dans un espace de travail que tu possèdes — des portes vérifiables par machine dans le dépôt, une mémoire qui survit à la session, et un panneau de contrôle qui construit et sait revenir en arrière.",
  excerpt:
    "L'ingénieur qui dirige Claude Code chez Anthropic vient d'admettre qu'il ne parle plus au modèle avec des prompts — il écrit des boucles qui lui parlent à sa place. Pourquoi cela clôt l'ère du « chuchoteur d'IA », et comment on en a tiré une architecture de production.",
  heroCaption: "La publication LinkedIn qui a tout déclenché — Boris Cherny sur écrire des boucles, pas des prompts.",
  blocks: [
    { kind: 'h2', text: "La citation qui a brisé l'illusion" },
    {
      kind: 'p',
      text: "Il y a quelques jours, une seule phrase de **Boris Cherny** — l'ingénieur qui dirige le développement de **Claude Code** chez **Anthropic** — a silencieusement secoué la communauté des développeurs.",
    },
    {
      kind: 'p',
      text: "Sur un panel public, Cherny a levé le voile sur la manière dont les gens qui construisent l'IA de programmation la plus sophistiquée au monde travaillent réellement avec leurs propres modèles. Ce qu'il a dit n'a pas seulement bousculé le statu quo — cela a déclaré obsolète toute une discipline émergente :",
    },
    {
      kind: 'quote',
      text: "Je n'écris plus de prompts pour Claude. J'ai des boucles qui tournent, qui écrivent des prompts pour Claude et décident elles-mêmes de la suite. Mon travail, c'est d'écrire des boucles.",
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: "Laisse cette phrase infuser." },
    {
      kind: 'p',
      text: "L'homme qui a les deux mains sur le volant du meilleur modèle de développement au monde te dit qu'il a lâché le volant. Il ne s'assoit pas dans une fenêtre de chat à peaufiner le paragraphe d'instructions parfait. Il écrit du code qui force l'IA à se parler à elle-même, à juger ses propres erreurs et à les corriger dans un circuit autonome fermé. Il construit la machine qui pilote le modèle — puis il la laisse conduire.",
    },
    {
      kind: 'p',
      text: "Si tu passes encore tes journées à peaufiner des prompts pour arracher à un LLM le bon bloc de code, son message est d'une clarté brutale : **tu optimises un monde qui a déjà disparu.**",
    },

    { kind: 'h2', text: 'Le changement de paradigme : du micro-management à l\'architecture de systèmes' },
    {
      kind: 'p',
      text: "Pour comprendre pourquoi c'est un bouleversement tectonique, regarde comment notre relation à l'IA générative a évolué en à peine deux ans.",
    },
    { kind: 'h3', text: "Phase 1 — le prompt linéaire (l'humain comme goulot d'étranglement)" },
    {
      kind: 'p',
      text: "Jusqu'à récemment, toute l'industrie était obsédée par l'**ingénierie de prompts**. On traitait les LLM comme des juniors brillants mais facilement distraits. Le processus était linéaire, fragile et entièrement manuel :",
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: "Dans ce paradigme, **le goulot d'étranglement, c'est l'humain.** Tu écris un prompt, tu lis la réponse, tu repères une erreur de syntaxe, tu la recolles dans le chat, et tu pries pour que le modèle n'ait pas oublié le contexte cinq étapes plus tard. On a l'impression d'être productif. En réalité c'est un micro-management épuisant, qui ne passe pas à l'échelle — et qui, à coup sûr, ne tourne pas pendant que tu dors.",
    },
    { kind: 'h3', text: "Phase 2 — l'ingénierie de boucles (le circuit autonome)" },
    {
      kind: 'p',
      text: "Ce que décrit Cherny, c'est l'**ingénierie de boucles** — des flux de travail agentiques où l'humain sort entièrement de la boucle d'exécution. Tu arrêtes de conduire la voiture. Tu construis la piste, et tu laisses la machine faire les tours.",
    },
    {
      kind: 'p',
      text: "Au lieu d'écrire un prompt pour résoudre un problème, tu écris une **boucle** programmatique qui insère l'IA dans un cycle automatisé d'exécution et de vérification :",
    },
    {
      kind: 'olist',
      items: [
        "**L'objectif.** Un humain fixe un seul objectif de haut niveau — « construis ce point d'entrée d'API et atteins 98 % de couverture de tests ».",
        "**L'action.** L'IA génère un premier jet du code.",
        "**La vérification.** Un environnement automatisé — compilateurs, linters, tests unitaires, ta CI — exécute le code et attrape chaque erreur.",
        "**L'autocorrection.** En cas d'échec, le système capture la trace de la pile, la renvoie à l'IA comme une nouvelle instruction, et lui ordonne de réessayer.",
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: "La boucle tourne à vitesse machine, enchaînant des dizaines d'itérations, s'autocorrigeant et s'autoréparant jusqu'à ce que les critères de vérification soient satisfaits. Tu n'as jamais tapé la moindre relance. Tu n'as pas écrit les prompts — tu as construit la piste, et le modèle a fait chaque tour tout seul.",
    },

    { kind: 'h2', text: "La vraie compétence n'est pas d'écrire du code. C'est d'écrire le juge." },
    {
      kind: 'p',
      text: "Voici la partie que presque tout le monde rate — et c'est tout l'enjeu. La partie difficile d'une boucle, ce **n'est pas** de générer le code. Les modèles y sont déjà effroyablement bons. La partie difficile, c'est **ce qui décide si le code est bon.**",
    },
    {
      kind: 'p',
      text: "Donne à la boucle un vérificateur fort et impitoyable — de vrais tests, de l'analyse statique, un compilateur qui ne sait pas mentir — et elle converge vers quelque chose qui fonctionne vraiment. Donne-lui un vérificateur faible, et cette même boucle produira joyeusement un fleuve infini de déchets confiants et magnifiquement formatés, hallucinant son chemin vers une coche verte qui ne veut rien dire.",
    },
    {
      kind: 'p',
      text: "Donc la compétence de la prochaine décennie, ce n'est pas l'art du prompt. C'est **concevoir la vérification** — les systèmes de validation à toute épreuve qui laissent une IA se parler à elle-même en sécurité sans partir dans le décor. C'est une ingénierie plus difficile, plus rare et bien plus précieuse que de trouver les bons mots.",
    },

    { kind: 'h2', text: 'De la philosophie à la production : comment nous avons architecturé la boucle' },
    {
      kind: 'p',
      text: "Pendant que le reste du monde tech décortique la citation de Cherny sur les réseaux sociaux, le vrai défi n'a rien de glamour : **comment construire une infrastructure d'ingénierie de boucles qui fonctionne réellement en production — hors des laboratoires internes d'Anthropic ?**",
    },
    {
      kind: 'p',
      text: "Ferme une boucle autour d'un seul modèle et tu heurtes vite les murs du monde réel : dégradation de la fenêtre de contexte, spirales hallucinatoires mortelles, aucune mémoire à l'échelle d'un projet. Sur [%SITE%](/fr), on a passé la dernière année à traiter la philosophie de Cherny non pas comme une prédiction mais comme un **plan architectural** — et on a construit la boucle sur laquelle tourne cet espace de travail.",
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: "La boucle de développement : le propriétaire fixe un objectif, l'agent modifie le dépôt, des portes automatiques vérifient, les échecs reviennent à l'agent comme de nouvelles instructions, et le panneau de contrôle construit, journalise et sait revenir en arrière",
      caption: "La boucle telle qu'elle est réellement câblée : un agent dans ton dépôt, des portes qui ne savent pas mentir, et un panneau qui ferme le circuit.",
    },
    { kind: 'h3', text: "L'anatomie d'une boucle de niveau production" },
    {
      kind: 'p',
      text: "Pour rendre les boucles viables sur du vrai logiciel, il faut arrêter d'admirer le modèle et construire autour de lui les trois choses sans glamour — le juge, la mémoire et la main qui livre :",
    },
    {
      kind: 'list',
      items: [
        "**Un vérificateur qu'on ne peut pas amadouer.** Le juge n'est pas un second modèle avec une opinion ; c'est un ensemble de scripts qui font échouer la construction. Les signaux de langue existent-ils sur chaque page publique ? Chaque article a-t-il le jumeau markdown dont un lecteur IA a besoin ? Une image est-elle référencée sans que personne ne l'ait déposée ? Chaque vérification existe parce que ce défaut exact a été livré une fois, et chacune répond par un code de sortie, pas par un paragraphe.",
        "**Une mémoire qui survit à la session.** L'effet d'amnésie est réel : boucle quinze fois sur un bug tenace et l'agent perd l'architecture de vue. Ici la mémoire n'est pas un service qui peut être hors ligne — ce sont des fichiers à côté du code qui voyagent avec le dépôt : l'instruction de travail, les leçons ajoutées à l'instant où le propriétaire corrige quelque chose, la liste des antipatterns, les cas d'utilisateur confirmés. Une nouvelle session commence par les lire, si bien que la quinzième itération sait ce que la première a appris.",
        "**Un acte final qui n'appartient pas à l'agent.** La boucle se termine dans le panneau de contrôle : il construit le projet, tient un journal des déploiements et sait revenir à la dernière construction qui fonctionnait. Les réglages, les textes et les images changent là, sans aucune reconstruction — la boucle n'est donc jamais sollicitée pour résoudre ce qui n'a jamais été un problème de code.",
      ],
    },
    {
      kind: 'p',
      text: "Remarque ce qui **n'est pas** dans cette liste : un essaim de modèles qui se surveillent entre eux. C'était notre première architecture, et on l'a retirée. L'orchestration est la partie la plus spectaculaire d'un diagramme agentique et la moins structurante d'un système qui fonctionne — un juge faible n'est pas réparé en ajoutant un second avis, et un juge fort n'en a presque jamais besoin.",
    },

    { kind: 'h2', text: "La nouvelle fiche de poste de l'ingénieur logiciel" },
    {
      kind: 'p',
      text: "On s'éloigne d'écrire du code, on dépasse écrire des prompts, et on entre droit dans **la construction de pipelines cognitifs.** Le métier n'est plus l'instruction — c'est le système à l'intérieur duquel cette instruction s'exécute.",
    },
    {
      kind: 'p',
      text: "Et ce n'est pas gratuit. Deux nouveaux coûts arrivent avec les boucles. **La dette de compréhension :** quand un agent écrit et réécrit un fichier trois cents fois en coulisses, ta maîtrise de ta propre base de code s'érode en silence — ça marche, tu n'es simplement plus sûr de pourquoi. Et **le calcul brut :** une boucle peut brûler de l'argent réel en tokens en poursuivant un seul bug sur cent tentatives silencieuses. Les ingénieurs qui gagnent cette ère traitent le rapport coût-qualité comme une décision de conception délibérée, pas comme une surprise sur la facture.",
    },
    {
      kind: 'cta',
      text: "Ce site est l'une de ces boucles : les pages que tu lis sont des fichiers statiques qu'une porte a refusé de livrer tant qu'ils ne portaient pas leurs signaux de langue, leur jumeau markdown et leur place dans le plan du site.",
      href: '/fr',
      label: "Voir l'espace de travail sur lequel il tourne",
    },
    {
      kind: 'p',
      text: "L'ère de l'ingénierie de prompts est officiellement derrière nous. La seule question qui reste est celle à laquelle Cherny a déjà répondu pour lui-même : **essaies-tu encore de parler à ton IA — ou construis-tu déjà les boucles qui la laissent tourner ?**",
    },
    {
      kind: 'note',
      text: "Source : une publication LinkedIn largement partagée de Guillermo Flor, qui a mis au jour les propos de Boris Cherny. La citation est reproduite telle qu'elle a circulé ; l'architecture et l'analyse sont les nôtres.",
    },
  ],
  faq: [
    {
      q: 'Qu\'est-ce que l\'« ingénierie de boucles » et pourquoi remplace-t-elle l\'ingénierie de prompts ?',
      a: "L'ingénierie de boucles consiste à écrire des flux de travail automatisés qui interpellent l'IA, font passer sa sortie par un vérificateur (tests, CI, compilateur), renvoient les échecs comme de nouvelles instructions, et répètent — jusqu'à ce que le résultat soit correct. Boris Cherny, qui dirige Claude Code chez Anthropic, a dit qu'il ne fabrique plus de prompts à la main : il écrit les boucles qui le font pour lui. L'idée clé, c'est que le goulot d'étranglement n'a jamais été le prompt — c'était l'humain dans le cycle de rétroaction.",
    },
    {
      q: 'Comment la boucle de développement est-elle câblée ici, en production ?',
      a: "Un agent de code travaille dans ton propre dépôt, sur ta propre machine, avec l'instruction de travail du projet à côté du code. Le vérificateur est un ensemble de portes qui tournent à chaque construction et la font échouer : signaux de langue sur chaque page publique, jumeau markdown pour chaque page publiée, aucune image référencée qui n'a jamais été déposée, aucun dictionnaire à qui il manque une clé. Un échec revient à l'agent comme une nouvelle instruction, et la boucle recommence. Le panneau de contrôle ferme le circuit — il construit le projet, journalise chaque déploiement et sait revenir à la dernière construction qui fonctionnait.",
    },
    {
      q: 'Dois-je savoir coder pour faire tourner cette boucle ?',
      a: "Pas pour l'essentiel de ce qu'un site change réellement. Le nom, la description, les images, les langues, l'analytique et les textes des réglages vivent dans le panneau de contrôle et s'appliquent sans reconstruction — ce sont des données, pas du code. Les changements de code sont ce que fait l'agent dans ton dépôt ; tu les lis et les approuves, et le panneau construit le résultat. La limite honnête est celle-ci : personne ne te promet que tu ne regarderas jamais un diff — on te promet que tu n'auras jamais à lancer la construction à la main, et qu'une construction cassée peut être annulée en un clic.",
    },
  ],
}

import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const pt: Partial<HomeCell> = {
  title: 'Este é o starter da sua aplicação',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'O seu servidor, o seu código: autorização, base de dados, armazenamento e pesquisa vetorial já ligados. Crie uma landing page ou um SaaS em 82 idiomas.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Infraestrutura de engenharia agêntica',
    title: 'Este é o starter da sua aplicação',
    description:
      'Está tudo já instalado e ligado entre si — autorização, uma base de dados própria, armazenamento de ficheiros, pesquisa vetorial e mais uma centena de ferramentas, organizadas de modo que um agente de programação as encontre sem ter de ouvir duas vezes. Construa uma página de destino, um SaaS ou uma automatização que nunca dorme, em qualquer um dos 82 idiomas, sobre um esqueleto talhado para um projeto que vai ultrapassar o milhão de linhas. Cerca de **nove vezes mais rápido** do que montar a mesma pilha sozinho — e aqui nada telefona para fora: nenhum fornecedor, nenhuma subscrição, ninguém a quem pedir autorização. O servidor é seu, o código é seu, **a cem por cento**.',
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Leve grátis e escale' },
    image: 'homePage',
    imageAlt: 'Modelo inicial de SaaS',
  },
  // 🔒 ЛЕНТА НАПРАВЛЕНИЙ — ПЕРВОЕ, ЧТО ИДЁТ ЗА ПЕРВЫМ ЭКРАНОМ (владелец
  // 2026-08-22). Человек, только что прочитавший, ЧТО это, сразу видит, ЧТО этим
  // строят: двадцать два направления проходят перед ним прежде любых доводов.
  // Она стоит вне ленты страницы, во всю ширину, вместе с рядом ярлыков.
  { kind: 'projectTypeMarquee' },
  // 🔒 РЯД МЕР УШЁЛ ВНИЗ, под виджет безопасности (владелец 2026-08-22). Три
  // множителя — это довод, а доводу место после того, как названа ценность:
  // сначала «безопасность встроена в основу», потом «во сколько раз дешевле»,
  // и только потом «как это работает».
  //
  // Механически: ряда мер больше нет среди поднятых видов (`LEAD_KINDS` в
  // `_data/index.ts`), поэтому он рисуется в ленте страницы — первым её блоком.
  {
    kind: 'metrics',
    items: [
      { value: '×4', label: 'mais barato de construir' },
      { value: '×9', label: 'mais rápido de lançar' },
      { value: '×100', label: 'mais fiável em produção' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: 'Open Code', tone: 'code' },
      { label: '82 idiomas', tone: 'reach' },
      { label: 'SEO incorporado', tone: 'reach' },
      { label: 'AIO navegação agêntica', tone: 'reach' },
      { label: 'Base de dados própria', tone: 'data' },
      { label: 'Pesquisa vetorial', tone: 'data' },
      { label: 'Grafo de conhecimento', tone: 'data' },
      { label: 'Armazenamento de ficheiros próprio', tone: 'data' },
      { label: 'Autorização', tone: 'access' },
      { label: '{roles} funções', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Arquitetura Fractera', tone: 'code' },
      { label: '100+ mais', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Processo',
    title: 'Como funciona',
    note: 'De um servidor vazio ao seu próprio código em produção. Tudo o que se segue corre em hardware que é seu.',
    steps: [
      { title: 'Ponha o servidor de pé', text: 'Implante-o com o [robô instalador](https://www.fractera.ai/deployments/vps) da Fractera. Recebe um sistema operativo, um modelo inicial, o painel de controlo, os armazenamentos e a autorização — instalados e ligados entre si.' },
      { title: 'Desenvolva onde já trabalha', text: 'Sincronize com o GitHub, depois clone para a sua máquina e execute o Claude Code ou o Codex. Os dados continuam a vir do seu servidor; o código corre no seu próprio IDE.' },
      { title: 'Faça push e implanta-se sozinho', text: 'Termine na máquina local e envie o projeto para o GitHub. Isso inicia de imediato uma nova implantação no seu próprio servidor — e o visitante vê o novo projeto.' },
    ],
  },
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
  {
    kind: 'cards',
    badge: 'Primeiros passos',
    title: 'Como começar',
    note: 'Tudo o que se segue já está instalado — está a ligá-lo, não a construí-lo. À esquerda o caminho; à direita o que evita percorrê-lo duas vezes.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Sete passos desde um servidor vazio' },
          { kind: 'p', text: 'Inicie o [robô instalador](https://www.fractera.ai/deployments/vps) para obter este projeto.' },
          {
            kind: 'olist',
            items: [
          'Abra o painel de controlo — tudo sobre este servidor é configurado ali. [Painel de controlo]({admin}/{lang})',
          'Escolha os idiomas em que a sua aplicação será disponibilizada. [Idiomas]({admin}/{lang}/languages)',
          'Use as definições para descrever o seu projeto: nome, descrição, logótipo, SEO. [Definições da app]({admin}/{lang}/app-settings)',
          'Ligue o GitHub e envie o código do servidor para o seu repositório. [GitHub]({admin}/{lang}/github)',
          'Clone esse repositório na sua própria máquina, desenvolva lá e envie de volta.',
          'Leve o ficheiro de ambiente `.env.local` para a sua máquina — o git nunca o transporta e sem ele a cópia local não arranca. [Variáveis de ambiente]({admin}/{lang}/env)',
          'Pressione Implementar no painel — o servidor pega no seu commit e reconstrói-se sozinho. [Implementações]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Recomendado antes de começar' },
          { kind: 'p', text: 'Nada disto bloqueia nada. Os três poupam retrabalho.' },
          {
            kind: 'list',
            items: [
              '**Uma chave OpenAI.** Sem ela o Quiz não faz perguntas, e sem casos o agente programador recusa-se a construir. O site continua a funcionar — só a pesquisa vetorial e o grafo de conhecimento ficam vazios. Introduz-se uma vez; o custo vai direto para o seu fornecedor de modelo. [Chave OpenAI]({admin}/{lang}/openai)',
              '**Um domínio seu.** Num endereço numérico não há certificado nem aplicação instalável — o navegador só os concede em ligação segura. Mudar mais tarde altera o endereço de cada página, por isso sai mais barato antes da indexação. [Domínio]({admin}/{lang}/domain)',
              '**Extensão Claude para Chrome.** Sem ela o agente vê apenas o código: os erros de consola, o comportamento sem JavaScript e o aspeto real da página não estão escritos em lado nenhum. Com ela abre a página sozinho e corrige o que lá está, não o que supôs. [Ferramentas de desenvolvimento]({admin}/{lang}/dev-tools)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Antes de qualquer código',
    title: 'Quiz — sete perguntas em vez de uma página em branco',
    note: 'O erro mais caro de um projeto acontece antes da primeira linha de código: constrói-se a coisa errada. Não por má construção, mas porque «por onde começo» é difícil de responder sozinho. O Quiz transforma isso numa conversa: você responde, o modelo continua a perguntar, e daí cresce a lista de cenários com que o projeto é depois construído.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'A semente' }, { kind: 'p', text: 'Sete perguntas curtas: o que é o produto, para quem é, o que uma pessoa deve levar consigo. Responda com as suas próprias palavras — o ditado funciona. Tudo o que se segue cresce a partir daqui, por isso um par de frases dá um resultado nitidamente melhor do que um par de palavras.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'A conversa' }, { kind: 'p', text: 'Depois, uma pergunta de cada vez, no seu idioma. Existe um auto-quiz: o modelo faz cinco novas perguntas e responde-lhes ele mesmo, aprofundando a descrição — mas tudo o que inventou em seu nome fica marcado como «Suposição», e você corrige. Uma suposição apresentada como facto apareceria mais tarde, dentro dos cenários terminados.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Os cenários' }, { kind: 'p', text: 'A conversa é sintetizada em casos numerados: quem chega, o que faz, o que tem de ser verdade no final. Você lê e confirma cada um separadamente. Um caso não lido continua a ser uma suposição do modelo.' }] },
    ],
  },
  { kind: 'statement', text: 'E isto não é um conselho, é uma regra do produto: enquanto um único caso estiver por confirmar, o painel mantém o alarme aceso e o agente programador recusa-se a construir. Construir sobre uma suposição não lida custa mais do que não construir nada.' },
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Leve grátis e escale' },
  {
    kind: 'cards',
    badge: 'Arquitetura',
    title: 'O que é este projeto, tecnicamente',
    note: 'Três coisas que vale a pena saber antes de construir: o que é este esqueleto, onde o código é realmente escrito e o que acontece quando o projeto ultrapassa as suas primeiras cem páginas.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'Isto não é um site acabado mas a arquitetura Fractera: o mesmo esqueleto sustenta tanto uma landing page como um grande SaaS ou uma automação multinível. Crescer não exige reescrever — as camadas de dados, autorização e painel já estão separadas, e cada uma está preparada para uma carga que ainda não tem.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'O código não é escrito aqui. Um programador clona o repositório para a sua própria máquina e trabalha com o Claude Code, que lê as instruções e competências que vivem dentro do projeto: elas fixam as regras, e verificações automáticas não permitem que sejam quebradas. O servidor só recebe o resultado e reconstrói-se.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'O esqueleto é construído para um projeto que ultrapassará o milhão de linhas: cada entidade tem a sua própria pasta, a camada partilhada não cresce com o seu número, e rotas e permissões são declaradas onde são aplicadas. A estabilidade aqui não é uma promessa mas uma consequência — uma nova página não acrescenta nada a um núcleo central.' }] },
    ],
  },
  {
    kind: 'quote',
    lead: 'Pronto para carga elevada',
    text:
      'A realidade escondida do vibe coding: a maior parte de um projeto é construída sem pensar em carga elevada, em poupar consultas à base de dados, em cache. Não porque os programadores não saibam disso — mas porque manter esse padrão dentro de uma framework é realmente difícil. Demasiadas pequenas coisas empurram em silêncio uma página da geração estática para a renderização dinâmica. E a diferença não é de cinco nem de dez por cento: em alguns casos a carga sobre o seu servidor cresce mil vezes, e com ela cresce a sua fatura de servidores e plataformas. A Fractera é construída sobre uma longa experiência: mais de trinta anos de desenvolvimento web. Tudo o que diz respeito a carga elevada, otimização para motores de busca e poupança em bases de dados está escrito no ADN do projeto. É o seu esqueleto, é a sua força vital. E é sua de graça.',
    cite: 'Roma Armstrong · fundador da Fractera',
  },
  {
    kind: 'noBill',
    badge: 'Independência',
    heading: 'Um espaço totalmente independente',
    note: 'Num projeto comum são três serviços alheios: os seus preços, as suas condições e a sua permissão para que o seu projeto continue a funcionar. Aqui os três vivem no seu próprio servidor.',
    items: [
      { vendor: 'Vercel', text: 'não paga a', badge: { label: 'alojamento', tone: 'reach' } },
      { vendor: 'Neon', text: 'não paga a', badge: { label: 'base de dados', tone: 'data' } },
      { vendor: 'Clerk', text: 'não paga a', badge: { label: 'autorização', tone: 'access' } },
    ],
    title: 'Não paga a ninguém',
    text: 'Não depende de ninguém. O projeto é inteiramente seu.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'problemSolution',
    badge: 'Mudar é fácil',
    title: 'Como mudar o seu projeto para a arquitetura Fractera',
    note: 'O seu projeto já funciona — na Vercel ou noutro sítio. E você paga: o alojamento, a base de dados, o armazenamento das imagens, a autorização, o email. Cada serviço cobra à parte, e cada fatura cresce consigo. A mudança parece impossível, e não é: a Fractera desmonta o seu projeto e volta a montá-lo na sua própria arquitetura, no seu servidor, onde tudo isso já existe e não custa nada a mais.',
    demandLabel: 'O que você faz',
    answerLabel: 'Porque funciona na Fractera',
    items: [
      {
        title: 'Instalar a Fractera',
        demand: 'Compre um servidor — a partir de três euros por mês. Compre um domínio — a partir de um dólar por ano. Ponha a correr o robô instalador e siga-o: o resto ele faz sozinho.',
        answer: 'Três euros são toda a sua fatura de alojamento. Não a do primeiro mês, nem «até passar o limite» — toda. Base de dados, armazenamento de imagens, entrada com palavra-passe e email já estão no seu servidor e vêm dentro desses três euros. Não sobra nada para pagar à parte.',
      },
      {
        title: 'Escolher o modo mudança',
        demand: 'No painel abra o separador «Mudança para a Fractera» e indique o endereço do seu repositório. Durante a mudança convém mantê-lo público — o seu e o da Fractera; pode voltar a fechá-los quando quiser. Guarde o modo.',
        answer: 'É a única definição que você toca à mão. A partir daqui o projeto sabe que está a mudar-se e age em conformidade: não constrói a partir de uma página em branco, desmonta o que você já escreveu.',
      },
      {
        title: 'Avisar o agente',
        demand: 'Abra o projeto no seu editor, na sua máquina, onde costuma trabalhar. Ponha-o a correr e diga ao agente que a mudança começa. Com palavras normais, como diria a um colega.',
        answer: 'Daí em diante ele lê o seu projeto antigo sozinho: que arquitetura tem, que bibliotecas usa, o que depende de quê. Você não precisa de explicar nem de recordar nada — ele olha para o código, não para a sua memória.',
      },
      {
        title: 'Receber o plano em passos',
        demand: 'Nada. Veja o que saiu: a tarefa enorme «mudar o projeto» está estendida em passos, cada um com o seu número e o seu objetivo.',
        answer: 'A mudança deixa de assustar porque deixa de ser um bloco só. Você vê a lista: o que está feito, o que está a correr, o que vem a seguir. Não há onde encalhar a meio e perder o fio.',
      },
      {
        title: 'Levantar o esqueleto',
        demand: 'Responda às perguntas sobre permissões: quem poderá ver e alterar o quê na sua aplicação. São poucas e todas falam do seu produto, não de técnica.',
        answer: 'Primeiro sobe a estrutura: endereços das páginas, tabelas, entrada, repositórios — público para o código e fechado para o que não se pode mostrar. Levanta-se uma vez, e o projeto cresce lá dentro em vez de ser refeito a cada função nova.',
      },
      {
        title: 'Acrescentar as funções',
        demand: 'Percorra os passos. Um passo, uma função: uma página, um formulário, um pagamento, os emails. Marque o que está feito e acrescente o novo quando lhe ocorrer.',
        answer: 'Cada passo é verificado e mostram-lhe que funciona: não «a compilação passou», mas uma página viva com o seu texto. Por isso você sabe sempre onde está e nunca fica com um projeto que «mais ou menos está pronto».',
      },
      {
        title: 'Mudar os dados',
        demand: 'Dê ao agente acesso às suas bases. Ele leva o que já se acumulou: utilizadores, encomendas, textos, imagens.',
        answer: 'É o último passo. Depois dele tem no seu servidor uma cópia completa e a funcionar do projeto — com os seus dados, a sua gente e o seu domínio. As faturas antigas podem ser canceladas: a partir de agora paga o servidor e o domínio, e mais nada.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Oitenta e dois idiomas, prontos antes de precisar deles',
    note: 'Todos vêm com o produto: ative os que o seu mercado fala. Geração estática, otimização para pesquisa e para IA, cache de dados e prontidão para carga elevada mantêm a eficiência no topo do setor — e mantêm-na igual, quer trabalhe com um idioma, com vários ou com os oitenta e dois.',
  },
],
  faq: [
    {
      q: 'Quanto custa e há cobranças escondidas?',
      a: 'Cobranças escondidas não há, porque não há a quem pagar: a plataforma é de código aberto, e tudo o que instalar e usar pertence-lhe a cem por cento. As suas despesas são o seu servidor, o seu domínio e a IA na nuvem se a usar; essas conta-as você e paga diretamente ao fornecedor. Nós não levamos subscrição, nem percentagem, nem taxa por utilizador.',
    },
    {
      q: 'Qual é a principal vantagem?',
      a: 'A fiabilidade — é aí que está a aposta. Hoje há muitas maneiras de montar depressa uma aplicação, e é melhor não ter ilusões: quase todas estão feitas para que você pague sobretudo os seus próprios erros. Uma aplicação eficiente interessa só a si; a quem lhe vende serviços interessa que compre e pague o maior número possível de serviços avulsos. O caro vem depois: violar a lei e ser multado por causa de onde estão os dados, cortes imprevistos, sanções e simplesmente a perda dos seus dados. A Fractera fecha isso mantendo tudo no seu próprio servidor.',
    },
    {
      q: 'E se eu precisar de mais?',
      a: 'A sua ferramenta principal é a sua — Claude Code, Codex ou outra — e corre na sua máquina. O projeto escala muito: o esqueleto está talhado para milhões de linhas e continua eficiente. E se precisar de uma alteração conceptual da arquitetura ao nível do painel de controlo, ou construir a aplicação ainda lhe custar, envie um pedido para admin@fractera.ai e um programador entrará em contacto e proporá uma solução.',
    },
  ],
}

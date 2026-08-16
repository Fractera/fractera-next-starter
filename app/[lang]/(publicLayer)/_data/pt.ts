import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const pt: Partial<HomeCell> = {
  title: 'Este é o starter da sua aplicação',
  description: 'Ela roda no seu próprio servidor e não responde a mais ninguém. Dê-lhe um nome no painel de controlo — esta linha vai desaparecer.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Infraestrutura de engenharia agêntica' },
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
      { label: '82 idiomas', tone: 'reach' },
      { label: 'SEO incorporado', tone: 'reach' },
      { label: 'Base de dados própria', tone: 'data' },
      { label: 'Pesquisa vetorial', tone: 'data' },
      { label: 'Grafo de conhecimento', tone: 'data' },
      { label: 'Armazenamento de ficheiros próprio', tone: 'data' },
      { label: 'Autorização', tone: 'access' },
      { label: '{roles} funções', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
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
      { title: 'Ponha o servidor de pé', text: 'Implante-o com o robô instalador da Fractera. Recebe um sistema operativo, um modelo inicial, o painel de controlo, os armazenamentos e a autorização — instalados e ligados entre si.' },
      { title: 'Desenvolva onde já trabalha', text: 'Sincronize com o GitHub, depois clone para a sua máquina e execute o Claude Code ou o Codex. Os dados continuam a vir do seu servidor; o código corre no seu próprio IDE.' },
      { title: 'Faça push e implanta-se sozinho', text: 'Termine na máquina local e envie o projeto para o GitHub. Isso inicia de imediato uma nova implantação no seu próprio servidor — e o visitante vê o novo projeto.' },
    ],
  },
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
          { kind: 'h3', text: 'Seis passos desde um servidor vazio' },
          {
            kind: 'olist',
            items: [
          'Abra o painel de controlo — tudo sobre este servidor é configurado ali. [Painel de controlo]({admin}/{lang})',
          'Escolha os idiomas em que a sua aplicação será disponibilizada. [Idiomas]({admin}/{lang}/languages)',
          'Use as definições para descrever o seu projeto: nome, descrição, logótipo, SEO. [Definições da app]({admin}/{lang}/app-settings)',
          'Ligue o GitHub e envie o código do servidor para o seu repositório. [GitHub]({admin}/{lang}/github)',
          'Clone esse repositório na sua própria máquina, desenvolva lá e envie de volta.',
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
          { kind: 'p', text: 'Nenhum dos dois bloqueia nada. Ambos poupam retrabalho.' },
          {
            kind: 'list',
            items: [
              '**Uma chave OpenAI.** Sem ela o Quiz não faz perguntas, e sem casos o agente programador recusa-se a construir. O site continua a funcionar — só a pesquisa vetorial e o grafo de conhecimento ficam vazios. Introduz-se uma vez; o custo vai direto para o seu fornecedor de modelo. [Chave OpenAI]({admin}/{lang}/openai)',
              '**Um domínio seu.** Num endereço numérico não há certificado nem aplicação instalável — o navegador só os concede em ligação segura. Mudar mais tarde altera o endereço de cada página, por isso sai mais barato antes da indexação. [Domínio]({admin}/{lang}/domain)',
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
  { kind: 'cta', text: 'Quiz — sete perguntas em vez de uma página em branco', href: '{admin}/{lang}/doc-use-cases', label: 'Abrir Quiz' },
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
  },
],
}

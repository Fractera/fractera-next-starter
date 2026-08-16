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
    title: 'Como funciona',
    note: 'De um servidor vazio ao seu próprio código em produção. Tudo o que se segue corre em hardware que é seu.',
    steps: [
      { title: 'Ponha o servidor de pé', text: 'Implante-o com o robô instalador da Fractera. Recebe um sistema operativo, um modelo inicial, o painel de controlo, os armazenamentos e a autorização — instalados e ligados entre si.' },
      { title: 'Desenvolva onde já trabalha', text: 'Sincronize com o GitHub, depois clone para a sua máquina e execute o Claude Code ou o Codex. Os dados continuam a vir do seu servidor; o código corre no seu próprio IDE.' },
      { title: 'Faça push e implanta-se sozinho', text: 'Termine na máquina local e envie o projeto para o GitHub. Isso inicia de imediato uma nova implantação no seu próprio servidor — e o visitante vê o novo projeto.' },
    ],
  },
  {
    kind: 'panel',
    title: 'Como começar',
    children: [
      { kind: 'p', text: 'Seis passos de um servidor vazio até ao seu próprio código em produção. Tudo abaixo já está instalado — você está a ativá-lo, não a construí-lo.' },
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
    kind: 'panel',
    tone: 'warn',
    title: 'Recomendado antes de começar',
    children: [
      { kind: 'p', text: 'Nenhum dos dois bloqueia nada. Ambos poupam retrabalho: o primeiro liga a metade pensante do produto, o segundo muda o endereço de cada página.' },
      {
        kind: 'list',
        items: [
          '**Uma chave OpenAI.** Sem chave, o Quiz não faz perguntas, e sem Quiz não há com que descrever os seus casos de uso — por isso o agente programador recusa-se a construir. Por isso o painel trata a chave como requisito VERMELHO até existirem os primeiros casos, e como sugestão âmbar depois: o site funciona sem ela, apenas a pesquisa vetorial e o grafo de conhecimento ficam vazios. A chave é introduzida uma vez e o custo vai diretamente para o seu fornecedor do modelo. [Chave OpenAI]({admin}/{lang}/openai)',
          '**O seu próprio domínio.** Enquanto o site viver num endereço numérico não tem certificado nem aplicação instalável — o navegador só os concede numa ligação segura. Mudar para um domínio altera o endereço de cada página, por isso é mais barato fazê-lo antes de serem indexadas. [Domínio]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Antes de qualquer código',
    title: 'Quiz — sete perguntas em vez de uma página em branco',
    children: [
      { kind: 'p', text: 'O erro mais caro de um projeto acontece antes da primeira linha de código: constrói-se a coisa errada. Não por má construção, mas porque «por onde começo» é difícil de responder sozinho. O Quiz transforma isso numa conversa: você responde, o modelo continua a perguntar, e daí cresce a lista de cenários com que o projeto é depois construído.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'A semente' }, { kind: 'p', text: 'Sete perguntas curtas: o que é o produto, para quem é, o que uma pessoa deve levar consigo. Responda com as suas próprias palavras — o ditado funciona. Tudo o que se segue cresce a partir daqui, por isso um par de frases dá um resultado nitidamente melhor do que um par de palavras.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'A conversa' }, { kind: 'p', text: 'Depois, uma pergunta de cada vez, no seu idioma. Existe um auto-quiz: o modelo faz cinco novas perguntas e responde-lhes ele mesmo, aprofundando a descrição — mas tudo o que inventou em seu nome fica marcado como «Suposição», e você corrige. Uma suposição apresentada como facto apareceria mais tarde, dentro dos cenários terminados.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Os cenários' }, { kind: 'p', text: 'A conversa é sintetizada em casos numerados: quem chega, o que faz, o que tem de ser verdade no final. Você lê e confirma cada um separadamente. Um caso não lido continua a ser uma suposição do modelo.' }] },
        ],
      },
      { kind: 'quote', text: 'E isto não é um conselho, é uma regra do produto: enquanto um único caso estiver por confirmar, o painel mantém o alarme aceso e o agente programador recusa-se a construir. Construir sobre uma suposição não lida custa mais do que não construir nada.' },
      { kind: 'cta', text: 'Quiz — sete perguntas em vez de uma página em branco', href: '{admin}/{lang}/doc-use-cases', label: 'Abrir Quiz' },
    ],
  },
  {
    kind: 'cards',
    title: 'O que é este projeto, tecnicamente',
    note: 'Três coisas que vale a pena saber antes de construir: o que é este esqueleto, onde o código é realmente escrito e o que acontece quando o projeto ultrapassa as suas primeiras cem páginas.',
    items: [
      'Isto não é um site acabado mas a arquitetura Fractera: o mesmo esqueleto sustenta tanto uma landing page como um grande SaaS ou uma automação multinível. Crescer não exige reescrever — as camadas de dados, autorização e painel já estão separadas, e cada uma está preparada para uma carga que ainda não tem.',
      'O código não é escrito aqui. Um programador clona o repositório para a sua própria máquina e trabalha com o Claude Code, que lê as instruções e competências que vivem dentro do projeto: elas fixam as regras, e verificações automáticas não permitem que sejam quebradas. O servidor só recebe o resultado e reconstrói-se.',
      'O esqueleto é construído para um projeto que ultrapassará o milhão de linhas: cada entidade tem a sua própria pasta, a camada partilhada não cresce com o seu número, e rotas e permissões são declaradas onde são aplicadas. A estabilidade aqui não é uma promessa mas uma consequência — uma nova página não acrescenta nada a um núcleo central.',
    ],
  },
  {
    kind: 'noBill',
    heading: 'Um espaço totalmente independente',
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

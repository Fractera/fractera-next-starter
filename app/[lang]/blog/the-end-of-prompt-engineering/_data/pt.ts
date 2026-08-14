import type { BlogOverride } from '../../_lib/types'

// Tradução para português (Portugal). Tom do autor: direto, sem registo
// académico, dirigido ao leitor.
// Termos de produto e nomes próprios não se traduzem (Claude Code, Anthropic,
// CI, LLM).
// Os diagramas foram traduzidos junto com o texto: um diagrama em inglês
// dentro de um artigo em português lê-se como uma tradução a meio.

const POST_1_LINEAR = `escreves um prompt  ─▶  a IA escreve código  ─▶  encontras o bug  ─▶  corriges o prompt  ─┐
     ▲                                                                          │
     └──────────────────────────  outra vez à mão  ◀─────────────────────────────────┘`

const POST_1_LOOP = `defines o objetivo
     │
     ▼
a IA escreve código  ─▶  o CI executa todas as verificações  ─▶  passou?  ─▶  ✦ entregue
     ▲                      │
     │                      ▼  (falhou)
     └──  a IA lê os registos e volta a perguntar-se a si mesma`

export const pt: BlogOverride = {
  title: 'A engenharia de prompts morreu. Viva a engenharia de ciclos.',
  subtitle:
    'Por que razão o responsável pelo Claude Code na Anthropic acaba de assinalar o fim da era do "sussurrador de IA" — e o que vem a seguir.',
  description:
    'Boris Cherny, que lidera o Claude Code na Anthropic, diz que já não escreve prompts para a Claude — escreve ciclos. Um olhar sobre a morte da engenharia de prompts e o nascimento da engenharia de ciclos: fluxos de trabalho agênticos, agentes autónomos autocorretivos, por que o juiz importa mais do que o prompt, e como esse mesmo ciclo está montado num espaço de trabalho que é teu — verificações automáticas no repositório, memória que sobrevive à sessão, e um painel de controlo que constrói e sabe reverter.',
  excerpt:
    'O engenheiro que lidera o Claude Code na Anthropic admitiu que já não dá prompts ao modelo — escreve ciclos que o fazem por ele. Eis porque isto encerra a era do "sussurrador de IA" e como daí nasceu uma arquitetura de produção.',
  heroCaption: 'A publicação no LinkedIn que despoletou tudo isto — Boris Cherny sobre escrever ciclos, não prompts.',
  blocks: [
    { kind: 'h2', text: 'A citação que quebrou a ilusão' },
    {
      kind: 'p',
      text: 'Há alguns dias, uma única frase de **Boris Cherny** — o engenheiro que lidera o desenvolvimento do **Claude Code** na **Anthropic** — percorreu em silêncio, como uma onda de choque, a comunidade de programadores.',
    },
    {
      kind: 'p',
      text: 'Num painel público, Cherny revelou como trabalham realmente com os seus próprios modelos as pessoas que constroem a IA de programação mais sofisticada do mundo. O que disse não só contrariou o status quo — declarou obsoleta toda uma disciplina emergente:',
    },
    {
      kind: 'quote',
      text: 'Já não escrevo prompts para a Claude. Tenho ciclos em execução que fazem prompts à Claude e decidem por si mesmos o que fazer a seguir. O meu trabalho é escrever ciclos.',
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: 'Deixa isto assentar.' },
    {
      kind: 'p',
      text: 'O homem com as duas mãos no volante do melhor modelo de programação do mundo está a dizer-te que soltou o volante. Não se senta numa janela de chat a lapidar o parágrafo perfeito de instruções. Escreve código que obriga a IA a falar consigo própria, a avaliar os seus próprios erros e a corrigi-los dentro de um circuito autónomo e fechado. Constrói a máquina que conduz o modelo — e depois deixa-a andar.',
    },
    {
      kind: 'p',
      text: 'Se ainda passas os dias a afinar prompts para arrancar do modelo o bloco de código certo, a mensagem dele é brutalmente clara: **estás a otimizar um mundo que já não existe.**',
    },

    { kind: 'h2', text: 'A mudança de paradigma: da microgestão à arquitetura de sistemas' },
    {
      kind: 'p',
      text: 'Para perceber por que motivo isto é uma mudança tectónica, repara em como a nossa relação com a IA generativa evoluiu em apenas dois anos.',
    },
    { kind: 'h3', text: 'Fase 1 — o prompt linear (o humano como gargalo)' },
    {
      kind: 'p',
      text: 'Até há pouco tempo, toda a indústria estava obcecada com a **engenharia de prompts**. Tratávamos os modelos de linguagem como estagiários brilhantes mas facilmente distraídos. O fluxo de trabalho era linear, frágil e inteiramente manual:',
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: 'Neste paradigma, **o humano é o gargalo.** Escreves um prompt, lês a resposta, detetas um erro de sintaxe, colas-o de volta no chat e esperas que o modelo não se tenha esquecido do contexto cinco passos depois. Parece produtivo. É uma microgestão exaustiva e que não escala — e definitivamente não funciona enquanto dormes.',
    },
    { kind: 'h3', text: 'Fase 2 — a engenharia de ciclos (o circuito autónomo)' },
    {
      kind: 'p',
      text: 'O que Cherny está a descrever é **engenharia de ciclos** — fluxos de trabalho agênticos em que o humano sai completamente do ciclo de execução. Deixas de conduzir o carro. Constróis a pista e deixas a máquina dar as voltas.',
    },
    {
      kind: 'p',
      text: 'Em vez de escrever um prompt para resolver um problema, escreves um **ciclo** programático que embute a IA num circuito automatizado de execução e verificação:',
    },
    {
      kind: 'olist',
      items: [
        '**O objetivo.** Um humano define um único objetivo de alto nível — "constrói este endpoint de API e alcança 98% de cobertura de testes".',
        '**A ação.** A IA gera uma primeira versão do código.',
        '**A verificação.** Um ambiente automatizado — compiladores, linters, testes unitários, o teu CI — executa o código e apanha cada erro.',
        '**A autocorreção.** Perante uma falha, o sistema captura o rasto do erro, devolve-o à IA como uma nova instrução e ordena-lhe que tente novamente.',
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: 'O ciclo corre à velocidade da máquina, avançando por dezenas de iterações, autocorrigindo-se e autocurando-se até as condições de verificação serem cumpridas. Nunca escreveste um único acompanhamento. Não escreveste os prompts — construíste a pista, e o modelo deu cada volta sozinho.',
    },

    { kind: 'h2', text: 'A verdadeira competência não é escrever código. É escrever o juiz.' },
    {
      kind: 'p',
      text: 'Aqui está a parte que quase toda a gente ignora — e é o jogo inteiro. A parte difícil de um ciclo **não** é gerar o código. Os modelos já são assustadoramente bons nisso. A parte difícil é **aquilo que decide se o código é bom.**',
    },
    {
      kind: 'p',
      text: 'Dá ao ciclo um verificador forte e implacável — testes reais, análise estática, um compilador que se recusa a mentir — e ele converge para algo que realmente funciona. Dá-lhe um fraco, e esse mesmo ciclo produzirá alegremente um rio infinito de lixo confiante e lindamente formatado, alucinando o caminho até uma marca verde que não significa nada.',
    },
    {
      kind: 'p',
      text: 'Por isso a competência da próxima década não é a arte do prompt. É **desenhar a verificação** — os sistemas de validação à prova de bala que deixam uma IA falar consigo mesma em segurança sem cair de um precipício. É uma engenharia mais difícil, mais rara e muito mais valiosa do que encontrar as palavras certas.',
    },

    { kind: 'h2', text: 'Da filosofia à produção: como construímos o ciclo' },
    {
      kind: 'p',
      text: 'Enquanto o resto do mundo tecnológico dissecava a citação de Cherny nas redes sociais, o verdadeiro desafio não tem glamour: **como construir uma infraestrutura de engenharia de ciclos que funcione mesmo em produção — fora dos laboratórios internos da Anthropic?**',
    },
    {
      kind: 'p',
      text: 'Fecha um ciclo à volta de um único modelo e depressa esbarras nas paredes do mundo real: degradação da janela de contexto, espirais alucinatórias de morte, e nenhuma memória ao longo de um projeto. Na [%SITE%](/pt), passámos o último ano a tratar a filosofia de Cherny não como uma previsão mas como um **plano arquitetónico** — e construímos o ciclo sobre o qual corre este espaço de trabalho.',
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: 'O ciclo de desenvolvimento: o proprietário define um objetivo, o agente edita o repositório, verificações automáticas avaliam-no, a falha volta ao agente como nova instrução, e o painel de controlo constrói, regista e sabe reverter',
      caption: 'O ciclo tal como está realmente montado: um agente no teu repositório, verificações que não sabem mentir, e um painel que fecha o circuito.',
    },
    { kind: 'h3', text: 'A anatomia de um ciclo de nível produção' },
    {
      kind: 'p',
      text: 'Para tornar os ciclos viáveis em software real, é preciso deixar de admirar o modelo e construir à sua volta três coisas sem glamour — o juiz, a memória e a mão que entrega:',
    },
    {
      kind: 'list',
      items: [
        '**Um verificador que não se deixa convencer.** O juiz não é um segundo modelo com opinião própria; é um conjunto de scripts que fazem a compilação falhar. Os sinais de idioma existem em cada página pública? Cada publicação tem o gémeo em markdown de que um leitor de IA precisa? Há alguma imagem referenciada que ninguém enviou para o repositório? Cada verificação existe porque esse defeito exato chegou a produção uma vez, e cada uma responde com um código de saída, não com um parágrafo.',
        '**Memória que sobrevive à sessão.** O efeito de amnésia é real: quinze voltas à volta de um bug teimoso e o agente perde de vista a arquitetura. Aqui a memória não é um serviço que pode estar offline — são ficheiros ao lado do código que viajam com o repositório: a instrução de trabalho, as lições anexadas no momento em que o proprietário corrige algo, a lista de antipadrões, os casos de utilizador confirmados. Uma nova sessão começa por os ler — por isso a décima quinta volta sabe o que a primeira aprendeu.',
        '**Um ato final que não pertence ao agente.** O ciclo termina no painel de controlo: constrói o projeto, mantém um registo de implantações e sabe voltar à última build que funcionava. As definições, os textos e as imagens mudam ali sem qualquer reconstrução — por isso nunca se pede ao ciclo que resolva o que nunca foi um problema de código.',
      ],
    },
    {
      kind: 'p',
      text: 'Repara no que **não** está nessa lista: um enxame de modelos a supervisionarem-se mutuamente. Essa foi a nossa primeira arquitetura, e retirámo-la. A orquestração é a parte mais empolgante de um diagrama agêntico e a menos estrutural de um que funciona — um juiz fraco não se corrige com uma segunda opinião, e um forte raramente precisa de uma.',
    },

    { kind: 'h2', text: 'A nova descrição de funções do engenheiro de software' },
    {
      kind: 'p',
      text: 'Estamos a afastar-nos de escrever código, a passar por escrever prompts, e a entrar diretamente em **construir tubagens cognitivas.** O ofício já não é a instrução — é o sistema dentro do qual essa instrução corre.',
    },
    {
      kind: 'p',
      text: 'E não é grátis. Dois novos custos chegam com os ciclos. **Dívida de compreensão:** quando um agente escreve e reescreve um ficheiro trezentas vezes nos bastidores, o teu domínio sobre a tua própria base de código desgasta-se em silêncio — funciona, só que já não tens a certeza de porquê. E **computação bruta:** um ciclo pode queimar dinheiro real em tokens a perseguir um único bug ao longo de cem tentativas silenciosas. Os engenheiros que ganham nesta era tratam o equilíbrio entre custo e qualidade como uma decisão de design deliberada, não como uma surpresa na fatura.',
    },
    {
      kind: 'cta',
      text: 'Este site é um desses ciclos: as páginas que estás a ler são ficheiros estáticos que uma verificação se recusou a publicar até carregarem os seus sinais de idioma, o seu gémeo em markdown e o seu lugar no mapa do site.',
      href: '/pt',
      label: 'Ver o espaço de trabalho onde corre',
    },
    {
      kind: 'p',
      text: 'A era da engenharia de prompts ficou oficialmente para trás. Resta apenas a pergunta que Cherny já respondeu a si mesmo: **ainda estás a tentar falar com a tua IA — ou já estás a construir os ciclos que a deixam correr?**',
    },
    {
      kind: 'note',
      text: 'Fonte: uma publicação no LinkedIn de Guillermo Flor, amplamente partilhada, que trouxe à luz as palavras de Boris Cherny. A citação é reproduzida tal como circulou; a arquitetura e a análise são nossas.',
    },
  ],
  faq: [
    {
      q: 'O que é a "engenharia de ciclos" e por que está a substituir a engenharia de prompts?',
      a: 'A engenharia de ciclos consiste em escrever fluxos de trabalho automatizados que fazem prompts à IA, passam o seu resultado por um verificador (testes, CI, um compilador), devolvem as falhas como novas instruções, e repetem — até o resultado estar correto. Boris Cherny, que lidera o Claude Code na Anthropic, disse que já não elabora prompts à mão: escreve os ciclos que o fazem por ele. A perceção chave é que o gargalo nunca foi o prompt — era o humano dentro do ciclo de retroação.',
    },
    {
      q: 'Como está montado aqui, em produção, o ciclo de desenvolvimento?',
      a: 'Um agente de programação trabalha dentro do teu próprio repositório, na tua própria máquina, com a instrução de trabalho do projeto ao lado do código. O verificador é um conjunto de verificações que correm em cada build e a fazem falhar: sinais de idioma em cada página pública, um gémeo em markdown para cada página publicada, nenhuma imagem referenciada que nunca tenha sido enviada, nenhum dicionário sem uma chave. Uma falha volta ao agente como nova instrução, e o ciclo repete-se. O painel de controlo fecha o circuito — constrói o projeto, regista cada implantação e sabe voltar à última build que funcionava.',
    },
    {
      q: 'Preciso de saber programar para trabalhar com este ciclo?',
      a: 'Não para a maior parte do que um site realmente muda. O nome, a descrição, as imagens, os idiomas, a analítica e os textos das definições vivem no painel de controlo e aplicam-se sem qualquer reconstrução — isso são dados, não código. As mudanças de código são o que o agente faz no teu repositório; tu lês e aprovas, e o painel constrói o resultado. O limite honesto é este: ninguém promete que nunca vais olhar para uma diferença — promete-se-te que nunca vais ter de correr a build à mão, e que uma que falhe pode ser revertida com um clique.',
    },
  ],
}

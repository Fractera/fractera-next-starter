import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const pt: FooterPageCell = {
  title: 'Arquitetura',
  description:
    'Como esta aplicação é estruturada: as camadas, o que cada uma possui e quais delas continuam a funcionar quando as outras são desligadas.',
  keywords: 'arquitetura, camadas, geração estática, servidor próprio, camada de dados',
  blocks: [
    {
      kind: 'p',
      text: 'Esta página descreve o esqueleto no qual a aplicação se apoia. Foi escrita para dois leitores ao mesmo tempo — uma pessoa que decide se o produto é adequado e um agente de codificação que irá alterá-lo. Ambos precisam da mesma coisa: saber qual camada possui o quê, antes de tocar em qualquer coisa. Voltar para [%SITE%](/pt).',
    },

    { kind: 'h2', text: 'Como ela está interligada' },
    {
      kind: 'p',
      text: 'Vários processos são executados lado a lado no seu servidor. Quatro deles respondem para fora, e cada um tem exatamente uma função. A fronteira entre eles é uma porta em vez de uma pasta — e é por isso que uma falha em um deles não arrasta os outros consigo.',
    },
    {
      kind: 'table',
      headers: ['Porta', 'Processo', 'Para que serve'],
      rows: [
        ['3000', 'Sua aplicação', 'As páginas que os visitantes veem. É com esta que você trabalha todos os dias.'],
        ['3001', 'Autorização', 'Contas, sessões, funções. Configurado no painel de controle, não editado por você.'],
        ['3002', 'Painel de controle', 'O mesmo: configurado, não editado.'],
        ['3300', 'Camada de dados', 'Linhas, arquivos enviados, vetores — e a única porta para todo o resto. Sua aplicação se comunica com ela.'],
      ],
    },
    { kind: 'p', text: 'Mais três serviços são executados em paralelo, e nenhum deles é uma porta própria:' },
    {
      kind: 'list',
      items: [
        'o mapa — rotas, matrizes de distância e busca de endereços, porta 3400;',
        'canais — Telegram e o que quer que venha a seguir, porta 3500;',
        'o grafo de conhecimento — o repositório RAG agêntico, porta 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Nenhuma destas portas é acessível a partir da internet: o firewall permite apenas as portas web, e tudo o que é público chega através delas. Sua aplicação alcança os três serviços por meio da camada de dados — /service/geo, /service/channels, /service/rag — com a mesma chave que abre a própria camada de dados.',
    },

    { kind: 'h2', text: 'Cada camada sobrevive às outras' },
    {
      kind: 'p',
      text: 'Processos separados não são um diagrama — eles são o que acontece em um dia ruim. Qualquer um dos quatro pode parar sem que o restante caia junto.',
    },
    {
      kind: 'table',
      headers: ['Se isto parar', 'O que continua funcionando'],
      rows: [
        ['Sua aplicação', 'O painel, os dados e as contas permanecem intactos; apenas o site fica fora do ar'],
        ['Painel de controle', 'O site continua servindo os visitantes; apenas as alterações precisam esperar'],
        ['Camada de dados', 'Páginas geradas com antecedência ainda abrem — é para isso que serve a geração estática'],
        ['Autorização', 'Páginas públicas não são afetadas; apenas o que está atrás de um login é fechado'],
      ],
    },
    {
      kind: 'note',
      text: 'O painel fica deliberadamente fora do seu repositório. O que vai para o seu GitHub é a aplicação; o cockpit permanece no servidor, razão pela qual um erro de edição não pode quebrá-lo.',
    },

    { kind: 'h2', text: 'Estático em primeiro lugar, e o que você ganha com isso' },
    {
      kind: 'p',
      text: 'As páginas são geradas com antecedência, não montadas a cada requisição. Isso não é um detalhe de desempenho — é o motivo pelo qual o site continua barato de servir sob carga, totalmente legível por motores de busca e funcional com o JavaScript desativado.',
    },
    {
      kind: 'list',
      items: [
        'O roteamento é no lado do servidor, para que um visitante com scripts desativados ainda navegue por todo o site.',
        'O conteúdo é regenerado em uma programação em vez de a cada visita, portanto, um pico de tráfego não custa nada a mais.',
        'Tudo o que realmente depende de quem está olhando — um painel, uma conta — é renderizado por requisição, e apenas essa parte.',
      ],
    },

    { kind: 'h2', text: 'Um design, decidido uma única vez' },
    {
      kind: 'p',
      text: 'Cores, tipografia e espaçamento não são escolhidos por página. Toda a escala vive em um lugar, a paleta em outro, e um título escrito à mão falha em uma verificação antes mesmo de chegar ao site.',
    },
    {
      kind: 'p',
      text: 'A regra por trás disso é curta: **nada na aparência de uma página depende de quem pode abri-la.** Pública ou privada, vitrine ou tabela de administração — mesmos títulos, mesma escala, mesmas cores. O acesso decide o que uma pessoa pode ver, nunca como é configurado.',
    },
    {
      kind: 'p',
      text: 'Isso está escrito porque a sua ausência tem uma forma. Enquanto o arquivo de design estava vazio, o agente que construiu este projeto inventou um segundo estilo de título para "telas de trabalho" — duas páginas privadas terminaram com o dobro de diferença em tamanho e definidas em famílias diferentes. Nada estava quebrado; simplesmente parecia ser dois produtos diferentes.',
    },
    {
      kind: 'p',
      text: 'Sua paleta é um pequeno arquivo de funções de cor, lido enquanto a página é servida. Altere-o e todo o site o acompanhará — incluindo as páginas que você ainda não construiu, e incluindo ambos os temas: claro e escuro são as mesmas funções com valores diferentes, não dois designs a serem mantidos em sintonia manualmente.',
    },

    { kind: 'h2', text: 'Idiomas: 82 disponíveis, e adicionar um não custa nada' },
    {
      kind: 'p',
      text: 'Oitenta e dois idiomas vêm com o produto. Você ativa os que o seu mercado fala, e o restante espera — ativar um mais tarde é uma configuração, não uma reconstrução do modo como o site funciona.',
    },
    {
      kind: 'p',
      text: 'A parte que vale a pena entender é o que adicionar um idioma NÃO faz:',
    },
    {
      kind: 'list',
      items: [
        'Não torna nenhuma página dinâmica. Cada idioma recebe suas próprias páginas, geradas com antecedência exatamente como a primeira — dez idiomas significam dez conjuntos de páginas estáticas, não uma página montada por requisição.',
        'Não dilui o ranqueamento de busca. Cada página se declara a original em seu próprio idioma e nomeia suas traduções, para que um motor de busca as trate como uma página em dez idiomas em vez de dez cópias quase idênticas competindo entre si.',
        'Não custa velocidade. Servir uma página pré-renderizada é o mesmo trabalho, independentemente de quantos idiomas existam ao lado dela.',
      ],
    },
    {
      kind: 'note',
      text: 'Um site de idioma único é um caso por si só, não uma versão reduzida: o idioma desaparece completamente dos endereços, e o site para de anunciar traduções que não possui.',
    },

    { kind: 'h2', text: 'Encontrado por motores de busca, legível por modelos' },
    {
      kind: 'p',
      text: 'Dois leitores chegam a um site moderno, e eles querem coisas diferentes. Um motor de busca envia uma pessoa para uma página. Um modelo vem ele mesmo, lê e reconta. O produto é construído para ambos, e os dois não são o mesmo trabalho.',
    },
    {
      kind: 'p',
      text: 'Para motores de busca: as páginas são servidas como HTML finalizado, cada uma declara seu próprio endereço canônico, as traduções nomeiam-se mutuamente, os metadados são montados por um único mecanismo em vez de por página, e dados estruturados, sitemaps e regras do robots vêm por padrão. Verificações automáticas recusam uma página que quebre qualquer uma dessas regras.',
    },
    {
      kind: 'p',
      text: 'Para modelos: cada página pública também existe como texto puro. Há um mapa em /llms.txt, todo o corpus em /llms-full.txt, e uma versão em markdown de cada página ao lado dela. Isso importa porque a marcação da página é metade ruído para um modelo — menus, rodapé, banner de consentimento, scripts — e ele gasta seu contexto com tudo isso.',
    },
    {
      kind: 'note',
      text: 'Ambas as formas são construídas a partir do MESMO conteúdo. Não existe uma "versão para IA" separada para ficar dessincronizada: edite o texto uma vez e ambos mudam juntos. Uma cópia mantida manualmente divergiria na primeira correção, e ninguém perceberia, porque ninguém a abre em um navegador.',
    },

    { kind: 'h2', text: 'As configurações se aplicam sem necessidade de recompilação' },
    {
      kind: 'p',
      text: 'O nome, a descrição, o logotipo, as cores, os idiomas e os seletores de recursos vivem em arquivos de configuração no servidor, fora do código. A aplicação os lê à medida que serve, de modo que uma alteração no painel seja visível imediatamente — sem implantação, sem tempo de inatividade.',
    },
    {
      kind: 'p',
      text: 'A consequência importa mais do que a conveniência: a mesma base de código atende a uma padaria e a um marketplace, e nenhum dos dois teve que ser bifurcado para chegar lá.',
    },

    { kind: 'h2', text: 'Seu servidor, seu código e a saída' },
    {
      kind: 'p',
      text: 'A aplicação é sua: clone-a, edite-a localmente, faça o push de volta. Nada aqui telefona de volta para casa — não há fornecedor para pedir permissão e nenhuma assinatura que possa ser revogada.',
    },
    {
      kind: 'p',
      text: 'Você também pode ir embora. Remova a dependência do painel e a aplicação funcionará em qualquer lugar. Você perde as partes que vivem no servidor — configurações sem recompilação, a camada de dados, a busca vetorial, a autorização em 82 idiomas, o histórico de implantação com reversão — e mantém o código. Essa é uma saída legítima, não um desvio do design.',
    },

    { kind: 'h2', text: 'Construído para continuar crescendo depois que o contexto acabar' },
    {
      kind: 'p',
      text: 'O limite rígido em um projeto construído por IA não é o tamanho do código. É o quanto desse código precisa ser compreendido de uma só vez antes que uma alteração segura possa ser feita. Um projeto onde cada nova página se acrescenta a um arquivo central atinge essa barreira cedo: eventualmente nenhuma sessão consegue reter o suficiente para alterar algo sem quebrar outra coisa.',
    },
    {
      kind: 'p',
      text: 'A estrutura aqui foi escolhida exatamente contra isso. **Cada entidade possui sua própria pasta** — suas páginas, seus dados, suas palavras, seus componentes privados. Exclua a pasta e nada ficará órfão em nenhum outro lugar.',
    },
    {
      kind: 'list',
      items: [
        'A camada compartilhada não cresce à medida que entidades são adicionadas. Algo só sobe para um local compartilhado quando duas coisas realmente o usam, e essa mudança é um ato deliberado, não um hábito.',
        'As permissões são declaradas onde são aplicadas, não em um registro que alguém precisa se lembrar de atualizar.',
        'Grupos de rotas tornam os dois tipos de página visíveis no disco: conteúdo público de um lado, telas protegidas por função do outro. Uma pasta em nenhum dos dois é uma pergunta sem resposta, e uma verificação diz isso em voz alta.',
      ],
    },
    {
      kind: 'p',
      text: 'A consequência é o ponto principal: uma alteração em uma entidade requer a leitura de apenas uma pasta. Milhões de linhas permanecem viáveis de trabalhar não porque alguém as esteja mantendo na mente, mas porque nenhuma alteração individual precisa fazer isso.',
    },
    {
      kind: 'p',
      text: 'O iniciador é a mesma ideia aplicada ao começo. O que é entregue não é um repositório vazio, mas um exemplo funcional de cada padrão — uma página, uma publicação, um catálogo, uma tela privada, um diálogo, uma célula de idioma. Uma nova página é feita copiando uma funcional, de modo que a estrutura se propaga por construção em vez de por disciplina.',
    },

    { kind: 'h2', text: 'Os documentos aos quais o agente obedece' },
    {
      kind: 'p',
      text: 'Um agente de codificação começa cada sessão sem memória da anterior. O que sobrevive está escrito, dentro do projeto, e é lido no início de cada sessão. Este corpus é tão parte da arquitetura quanto as portas — é o que torna a segunda sessão tão competente quanto a primeira.',
    },
    {
      kind: 'table',
      headers: ['Documento', 'Para que serve'],
      rows: [
        ['Casos de uso', 'PARA QUE serve o produto, um arquivo por cenário: quem chega, o que os trouxe, o que deve ser verdade quando terminarem. Nenhum caso confirmado significa sem construção — o agente é obrigado a parar e perguntar em vez de adivinhar.'],
        ['Etapas de desenvolvimento', 'O trabalho em si, como arquivos. Uma etapa é aberta antes de ser executada e movida para a pasta de concluídas com um relatório completo. Uma sessão que morre não perde nada; uma sessão do zero retoma a partir dos arquivos.'],
        ['Testes', 'Como uma etapa é comprovadamente concluída: duas provas independentes de dois planos diferentes, descritas em detalhes. Uma compilação verde nunca é uma delas — um log de compilação parece idêntico, quer o recurso funcione ou não.'],
        ['Antipadrões', 'Abordagens que já custaram tempo aqui, cada uma com o mecanismo da falha. Autoevolutivo: o agente adiciona no momento em que um beco sem saída é compreendido.'],
        ['Lições', 'Suas preferências e os hábitos adquiridos por errar algo uma vez. Onde uma lição e o padrão do agente discordarem, a lição vence — ela existe porque o padrão já falhou aqui.'],
        ['Design', 'Como as páginas se parecem, decidido por você e obedecido. Dado, não evolutivo.'],
      ],
    },
    {
      kind: 'p',
      text: 'Dois destes merecem uma palavra sobre direção. **Antipadrões e lições são escritos pelo agente**; o documento de design é escrito por você. A diferença é deliberada: um agente pode registrar o que aprendeu, mas não pode decidir como o produto deve se parecer.',
    },
    {
      kind: 'note',
      text: 'Os casos de uso estão mudando de arquivos para um serviço. A conversa que os produz já vive no painel de controle; a seguir, eles se moverão para trás de uma interface de ferramentas respaldada por um banco de dados, para que o agente peça os casos de que precisa em vez de ler uma pasta. A regra não muda com o armazenamento — nenhum caso confirmado, sem construção. O que muda é que os casos deixam de ser um documento que o agente precisa se lembrar de abrir.',
    },

    { kind: 'h2', text: 'Muitos produtos em um servidor' },
    {
      kind: 'p',
      text: 'Um caso precisa pertencer a algo. Neste produto, ele pertence a um **produto** — e um servidor carrega vários deles: uma landing page hoje, um monitor agendado na próxima semana, o cérebro da empresa depois disso.',
    },
    {
      kind: 'p',
      text: 'A objeção é justa e vale a pena ser declarada antes da resposta: **um site normalmente é um produto.** Se você está construindo um sistema de produção profissional para uma empresa, isso está correto, e nada aqui discorda disso — coloque um produto em um servidor e o resto desta seção não lhe custa nada.',
    },
    {
      kind: 'p',
      text: 'Mas isso não é mais a única coisa que as pessoas constroem. Cada vez mais o que uma pessoa precisa é de um pequeno serviço para sua própria eficácia: algo que roda em um agendamento e relata o que mudou, algo que busca por critério em vez de por palavra-chave, algo que lida com uma tarefa recorrente em vendas, marketing ou operações. Cada um deles é pequeno demais para merecer seu próprio servidor, seu próprio domínio e sua própria fatura — e juntos eles são um sistema.',
    },
    {
      kind: 'p',
      text: 'Portanto, a unidade de trabalho é o produto, não o site. Agrupar um produto em sua própria página ou em um punhado de páginas é o que permite a um agente de codificação saber, sem perguntar, qual deles está alterando.',
    },

    { kind: 'h3', text: 'Por que não chamá-lo simplesmente de projeto' },
    {
      kind: 'p',
      text: 'Porque um projeto não é um lugar. Ele não tem endereço, nem pasta, nem tabelas, portanto, um caso associado a ele não pode ser executado — o agente ainda precisa adivinhar para onde vai o trabalho. Um produto tem todos os três, e essa é toda a diferença: um caso associado a um produto é uma instrução que pode ser construída.',
    },
    {
      kind: 'p',
      text: 'Um produto possui quatro raízes, e nenhuma delas é configurada manualmente — todas as quatro são **derivadas** do seu registro:',
    },
    {
      kind: 'table',
      headers: ['Raiz', 'Derivada de'],
      rows: [
        ['Suas páginas', 'Seu endereço — neste framework, o nome de uma pasta É o segmento da URL'],
        ['Sua lógica', 'Seu ID permanente'],
        ['Suas tabelas', 'Seu ID permanente, como um prefixo de nome'],
        ['Seus casos', 'Seu ID permanente'],
      ],
    },
    {
      kind: 'p',
      text: 'Trabalhando em um caso, o agente escreve dentro dessas quatro raízes e em nenhum outro lugar. O código compartilhado vive em uma raiz compartilhada, e mover algo para lá é um ato deliberado declarado na etapa — buscar um componente em um produto vizinho é o movimento exato que esta regra existe para impedir, porque é assim que a alteração de um proprietário quebra silenciosamente outro produto semanas depois.',
    },
    {
      kind: 'p',
      text: 'O ID é deliberadamente sem significado — p1, p2 — e nunca muda. Ele não pode ser derivado do título ou da estrutura, porque você alterará ambos, e os caminhos dependem do ID. Isso foi provado no mesmo dia em que a regra foi escrita: um produto cujo ID dizia «store» acabou se revelando o cérebro da empresa.',
    },

    { kind: 'h3', text: 'Nem todo produto tem uma página' },
    {
      kind: 'p',
      text: 'Um produto declara uma de três superfícies, e o padrão sempre tende para o fechado:',
    },
    {
      kind: 'list',
      items: [
        '**Público** — tem um endereço e os visitantes chegam até ele.',
        '**Privado** — vive como uma aba em seu painel de controle, e o mundo exterior não tem como entrar.',
        '**Headless** — não tem tela alguma: funciona por meio de canais e em um agendamento, e você o encontra no Telegram ou em seu relatório.',
      ],
    },
    {
      kind: 'p',
      text: 'Um produto também carrega um status — sendo descrito, sendo construído, live. Movel-o para live o publica, e isso é uma configuração: nada é reconstruído e nada é implantado.',
    },

    { kind: 'h3', text: 'Como isso se parece na prática' },
    {
      kind: 'p',
      text: 'Considere uma consultora com um servidor. Seu primeiro produto é uma landing page: pública, na raiz, um único objetivo — obter um contato. Seus casos dizem quem chega e o que deve ser verdade quando vão embora.',
    },
    {
      kind: 'p',
      text: 'O segundo produto dela aparece mais tarde e não partilha nada com o primeiro além do servidor. No início os pedidos vindos da página de entrada caíam simplesmente no seu mensageiro — chegava enquanto eram cinco por semana. Depois passaram a trinta, e foi preciso um sítio onde se veja quem escreveu, o que lhe responderam e como acabou: um sistema próprio de tratamento de pedidos. Fica atrás da entrada, com as suas páginas, as suas tabelas e os seus papéis, e os seus casos descrevem o trabalho com um cliente, não a primeira visita de um desconhecido.',
    },
    {
      kind: 'p',
      text: 'Ambos vivem em um servidor, e nenhum dos dois pode danificar silenciosamente o outro: páginas separadas, lógica separada, tabelas separadas, casos separados. Quando ela pede ao agente para alterar a redação do formulário de contato, nada sobre o sistema de pedidos está no escopo — não porque o agente foi cuidadoso, mas porque a fronteira foi decidida antes que qualquer um deles fosse construído. Mais tarde estarão ao lado um terceiro e um quarto — envios, relatórios, armazém — e a regra não muda: um servidor, produtos distintos.',
    },
    {
      kind: 'note',
      text: 'O plano e o fato são mantidos separados de propósito. As páginas que um produto DEVERIA ter estão escritas; as páginas que ele realmente TEM são contadas percorrendo as pastas, nunca armazenadas. Uma lista escrita à mão do que existe diverge da realidade na primeira semana — o agente constrói uma página e se esquece da lista. A lacuna entre os dois é a resposta para "o que ainda está faltando", e só é confiável porque uma metade dela não pode ser forjada.',
    },
  ],
}

import type { BlogOverride } from '../../_lib/types'

// Versão em português (Portugal). Tom do autor (Roma Armstrong): pessoal,
// direto, inspirador. A âncora raiz obrigatória "Agentic Engineering
// Infrastructure" (termo não traduzido) → /pt.
export const pt: BlogOverride = {
  title: 'A oportunidade de um bilião de dólares é o salão ao lado',
  subtitle:
    'Elon Musk falou sobre o espaço, a inteligência artificial e os carros. A frase que ficou comigo foi mais simples: a maioria dos negócios no planeta ainda não tem sequer uma API. Foi este o nicho que encontrei por causa disso.',
  description:
    'Por que motivo o grande dinheiro, a curto prazo, na IA não está num unicórnio — está no cabeleireiro, na clínica, na clínica dentária ao lado. O problema das faltas, os negócios sem site nem CRM, e como um espaço de trabalho self-hosted permite que quase qualquer pessoa os automatize sem primeiro montar uma pilha de serviços.',
  excerpt:
    'Elon Musk disse que a maioria dos negócios ainda não tem API — funcionam com um telemóvel, ou nem isso. Passei dezenas de reuniões atrás dessa ideia e encontrei um nicho à vista de todos: o salão, a clínica, a clínica dentária ao lado.',
  blocks: [
    {
      kind: 'p',
      text:
        'Este é um post ligeiramente pouco habitual, porque começa com outra pessoa. A entrevista de Elon Musk acima chamou-me a atenção — falou sobre o espaço, sobre inteligência artificial, sobre carros. Mas o momento que mais me inspirou foi um momento tranquilo. Disse que, apesar de como o mundo moderno parece — como se já tudo tivesse sido inventado, cada site construído, cada aplicação lançada, cada processo de negócio automatizado — a esmagadora maioria dos negócios no planeta nem sequer tem uma API. Funcionam com um telemóvel. Alguns funcionam sem sequer isso.',
    },
    {
      kind: 'quote',
      text:
        'Se a IA conseguir simplesmente pegar no que já é dado à empresa de apoio ao cliente subcontratada que já usam e fazer esse apoio ao cliente com as aplicações que já usam, então é possível fazer avanços tremendos no apoio ao cliente, que é, penso eu, cerca de 1% da economia mundial. É perto de um bilião de dólares no total, só em apoio ao cliente.',
      cite: 'Elon Musk · Entrevista a Dwarkesh Patel, fevereiro de 2026',
    },
    {
      kind: 'p',
      text:
        'Lê isto de novo com olhos de construtor. Esse bilião não vive noutra rede social nem noutro invólucro de IA — vive dentro de negócios comuns que nunca se digitalizaram. E a barreira nunca foi a ideia; foi a construção. Contratar uma equipa, montar infraestrutura, pagar mês após mês por uma pilha de serviços na nuvem. Essa barreira é exatamente o que um espaço de trabalho self-hosted remove — por isso foi esta frase tranquila, e não os foguetões, que ficou comigo.',
    },

    { kind: 'h2', text: 'Toda a gente aprendeu a programar. A rua continua igual.' },
    {
      kind: 'p',
      text:
        'A falar com muitos parceiros, continuo a ver dois cenários. Por um lado, uma vaga de programadores — e até pessoas que nunca foram programadoras, gente que antes trabalhava em marketing ou gestão de conteúdos — aprenderam de repente a programar num único ano. Toda a gente começou a construir. Há muitos projetos, e muitos deles são genuinamente interessantes. E no mundo real? No mundo real está tudo exatamente na mesma.',
    },
    {
      kind: 'p',
      text:
        'Por isso acontece que alguns de nós encontrámos uma forma maravilhosa de nos agradarmos a nós próprios — a descarga de dopamina do conhecimento novo. Mas também já é altura de ganhar dinheiro com isto. Então para onde deslocas o foco?',
    },
    {
      kind: 'founder',
      text:
        'O problema: não conseguimos prever o futuro. Especialmente agora, quando o mercado e a tecnologia começaram a mudar a uma velocidade extraordinária. Adaptar-se à mudança é um processo angustiante de alterar estratégia.',
    },

    { kind: 'h2', text: 'Fui à procura da resposta. Encontrei um cabeleireiro.' },
    {
      kind: 'p',
      text:
        'Depois de estudar este vídeo em detalhe e de fazer várias dezenas de reuniões para confirmar a resposta a essa pergunta, encontrei um nicho de negócio muito interessante: salões de beleza e cosmetologia não cirúrgica, centros médicos, clínicas dentárias. Apesar da abundância de automação e sistemas de CRM, deparam-se com um problema surpreendentemente frequente: um cliente deixa um pedido, marca uma visita — e depois não aparece. Quando o gestor lhe liga — normalmente mesmo à hora em que a marcação devia começar — os clientes respondem muitas vezes: "ah, esquecemo-nos. Porque é que não nos lembraram?"',
    },
    {
      kind: 'p',
      text:
        'Claro que há muitas soluções já prontas que se podem instalar. Mas há ainda mais clientes que nunca instalaram nenhuma — e muitos deles não têm site, muitos não têm sequer CRM.',
    },

    { kind: 'h2', text: 'É exatamente para isto que serve um espaço de trabalho como este.' },
    {
      kind: 'p',
      text:
        '[%SITE%](/pt) é um espaço de trabalho de engenharia agêntica self-hosted, construído precisamente para cenários como este. Vem de fábrica com as peças que esse negócio, de outra forma, teria de comprar em separado: uma base de dados e tabelas próprias, armazenamento de ficheiros, voz transformada em texto, um canal para chegar a um cliente numa aplicação de mensagens, autorização com papéis, e um site público que um motor de busca consegue realmente ler. O dono do negócio pode ter tantas ideias quantas quiser — as peças já estão na prateleira.',
    },
    {
      kind: 'p',
      text:
        'A vantagem é que, antes, materializar estas ideias significava trabalhar incrivelmente muito tempo com uma equipa de produto, depois contratar programadores, depois pensar sem parar em como tudo funciona — ou comprar serviços caros para as necessidades próprias. Agora tudo isto é simples. Graças à engenharia agêntica, quase qualquer pessoa pode pegar num telefone e descrever como gostaria de otimizar o seu negócio, e fazê-lo sozinha ou com a ajuda de alguém que já perceba um pouco disto.',
    },
    {
      kind: 'p',
      text:
        'Também te livra de teres de te lembrar de quais os serviços que deves pagar. A maioria dos serviços na nuvem que se transformam em pagamentos regulares e representam a maior parte dos teus custos — uma base de dados, armazenamento, uma subscrição de CRM — já são funcionalidades comuns da tua própria aplicação, a correr no teu próprio servidor. E as mudanças do dia a dia não são de todo uma implantação: o nome, os textos, as imagens e os idiomas editam-se num painel de controlo e aplicam-se sem reconstrução, enquanto o código vive num repositório que te pertence.',
    },

    { kind: 'h2', text: 'Um de muitos. Podes encontrá-los todos os dias.' },
    {
      kind: 'p',
      text:
        'O exemplo acima é um de muitos. Podes encontrar casos assim literalmente todos os dias e ganhar dinheiro a implementá-los — ou podes acrescentar a materialização de novas ideias dentro do teu próprio negócio, porque agora é praticamente gratuito. Nunca foi assim antes.',
    },
    {
      kind: 'p',
      text:
        'E embora pareça quase impossível encontrar um nicho novo para um unicórnio startup — talvez não valha a pena pensar nisso. Em vez de sonhar em construir um unicórnio, podes simplesmente automatizar o cabeleireiro ao lado, ou o salão de beleza, ou a oficina automóvel. Todos aqueles com quem já contactas há muito tempo. Todos os que já confiam em ti. Talvez seja altura de experimentar?',
    },
  ],
  faq: [
    {
      q: 'Para que tipo de negócio é isto mais indicado?',
      a: 'Negócios de serviços locais com marcações e clientes recorrentes — salões, cosmetologia não cirúrgica, clínicas, clínicas dentárias, oficinas automóveis — sobretudo os que não têm site nem CRM e têm um problema recorrente de faltas.',
    },
    {
      q: 'Pago à parte por uma base de dados, armazenamento, uma subscrição de CRM?',
      a: 'Não. Isso são peças comuns já incluídas na tua própria aplicação, no teu próprio servidor, e não subscrições de terceiros faturadas todos os meses. O que pagas é o próprio servidor.',
    },
    {
      q: 'Preciso de ser programador?',
      a: 'Não para as coisas que um negócio muda mais frequentemente: nomes, textos, preços, imagens e idiomas editam-se no painel de controlo e aplicam-se sem reconstrução. Construir algo novo é trabalho de um agente de código a trabalhar no teu repositório — o teu, ou o de alguém que já perceba um pouco disto. O servidor, o modelo de IA e o domínio já estão ligados por ti.',
    },
  ],
}

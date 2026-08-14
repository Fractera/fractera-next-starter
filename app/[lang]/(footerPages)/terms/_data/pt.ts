import type { FooterPageCell } from '@/lib/pages/footer-page'

// Célula de idioma: só se traduz o que é preciso. Um campo não traduzido
// vem da base em inglês pelo mesmo resolvedor que os posts do blog.
export const pt: Partial<FooterPageCell> = {
  title: 'Termos de Serviço',
  description: 'As regras para usar este site e os seus serviços.',
  keywords: 'termos de serviço, termos e condições',
  blocks: [
    { kind: 'h2', text: 'O que deve constar aqui' },
    { kind: 'p', text: 'Substitui este texto de exemplo pelo teu próprio conteúdo. Até lá, a página continua a funcionar: é totalmente estática e indexável, e os motores de busca recebem o seu título, descrição e dados estruturados exatamente como num artigo. Voltar a [%SITE%](/pt).' },
    { kind: 'p', text: 'Os termos de serviço estabelecem o que prometes aos teus visitantes e o que esperas deles.' },
  ],
}

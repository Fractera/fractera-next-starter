import type { FooterPageCell } from '@/lib/pages/footer-page'

// Célula de idioma: só se traduz o que é preciso. Um campo não traduzido
// vem da base em inglês pelo mesmo resolvedor que os posts do blog.
export const pt: Partial<FooterPageCell> = {
  title: 'Política de Privacidade',
  description: 'Como este site recolhe, utiliza e protege dados pessoais.',
  keywords: 'política de privacidade, dados pessoais, RGPD',
  blocks: [
    { kind: 'h2', text: 'O que deve constar aqui' },
    { kind: 'p', text: 'Substitui este texto de exemplo pelo teu próprio conteúdo. Até lá, a página continua a funcionar: é totalmente estática e indexável, e os motores de busca recebem o seu título, descrição e dados estruturados exatamente como num artigo. Voltar a [%SITE%](/pt).' },
    { kind: 'p', text: 'Uma política de privacidade indica que dados recolhes, para quê, durante quanto tempo os guardas e como um visitante pode pedir a sua remoção.' },
  ],
}

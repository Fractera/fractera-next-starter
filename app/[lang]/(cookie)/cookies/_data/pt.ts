import type { FooterPageCell } from '@/lib/pages/footer-page'

// Célula de idioma: só se traduz o que é preciso. Um campo não traduzido
// vem da base em inglês pelo mesmo resolvedor que os posts do blog.
export const pt: Partial<FooterPageCell> = {
  title: 'Política de Cookies',
  description: 'Que cookies este site utiliza e como as controlar.',
  keywords: 'política de cookies, cookies, consentimento',
  blocks: [
    { kind: 'h2', text: 'O que deve constar aqui' },
    { kind: 'p', text: 'Substitui este texto de exemplo pelo teu próprio conteúdo. Até lá, a página continua a funcionar: é totalmente estática e indexável, e os motores de busca recebem o seu título, descrição e dados estruturados exatamente como num artigo. Voltar a [%SITE%](/pt).' },
    { kind: 'p', text: 'Uma política de cookies enumera as cookies que o site define, para que serve cada uma e como se retira o consentimento.' },
  ],
}

# Validação atual — 30/10/2026

- Build de produção Next.js aprovado após revisão de legibilidade.
- 13 testes Playwright aprovados (36,1 s), com o servidor local de desenvolvimento: navegação/acessibilidade em 360, 390, 768, 1024 e 1440px; sequência de imagens em 390/1440px; retorno aos frames 1, 31 e 60 com comparação dos pixels; modo de movimento reduzido; pausa/retomada da faixa em loop; cards e convite de depoimentos.
- Nenhuma violação axe nos estados públicos testados. Corrigidos contraste do texto "SOB MEDIDA" e cabeçalho transparente sobre seções claras.
- Inspeção adicional em 360, 390, 768, 1024 e 1864px: sem overflow; textos principais 17–19px, navegação 16–18px, rótulos 14px, consentimento 16px, campos/busca com raio de 12px, borda de 1px e margem real de 30–32px após o aviso.
- Removidos micro-rótulos dos cards. Inputs com label destacado, fundo próprio, borda e placeholder secundário. CTAs editoriais e rodapé com aparência de botões.
- Arquivos da hero aprovados preservados nesta revisão: scroll-journey.tsx SHA256 BA6DEFB9201696230023C7A003966ACDA4C8F8C63623BDCD4B5628B4AC3D1220; redesign.css SHA256 8645ACE3794D4DEBD943A34A0BEF0E257803DBB513254FD9D2F3ED7FF00FB513.
- Depoimentos reais não fornecidos: seção vazia identificada, sem nomes/avaliações inventados. CRUD de depoimentos/migração 002 aguarda Supabase, como as demais integrações.
- Capturas e script de inspeção em reports/readability e scripts/check-readability.mjs.

**As métricas Lighthouse abaixo pertencem à versão de 27/10; não são medições do layout atual.** Não foi realizada nova auditoria Lighthouse nesta revisão de tipografia.

# Histórico de validação — 27/10/2026

## Ambiente
Windows; Node 24.20.0; Next.js 16.4.3; Chrome headless; build de produção em `http://localhost:3000`. Playwright 1.64.1, axe 4.14.0, Lighthouse 13.5.0. Supabase ainda não foi criado pelo proprietário. Não foram utilizados dados fictícios de catálogo ou clientes.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| `npm run typecheck` (next typegen + tsc) | Aprovado |
| `npm run lint` | Aprovado, sem avisos |
| `npm run build` | Aprovado |
| `npm test` | 8 testes aprovados, 12,4 s na última execução |
| Responsividade | 360, 390, 768, 1024 e 1440 px, sem overflow horizontal |
| Navegação | Menu mobile, âncoras, abas e teclado aprovados |
| Catálogo vazio | Busca, filtros e estado vazio aprovados |
| WhatsApp | Link aponta para 5517997448213, mensagem codificada |
| Formulário | Validação nativa verificada; envio desabilitado sem banco |
| Administração sem configuração | Guia de configuração exibido; nenhum dado administrativo exposto |
| Imagens | Imagens públicas carregadas, largura natural maior que zero |
| Metadados e rotas | Título, robots, sitemap e 404 verificados |
| Acessibilidade axe | Nenhuma violação detectada nos estados públicos testados e tela inicial de configuração administrativa |
| JavaScript | Nenhum pageerror nos cinco tamanhos |
| Console Lighthouse | Nenhum erro de console nas medições finais |
| Revisão visual | Capturas desktop e mobile inspecionadas; hierarquia e CTA legíveis |
| Dependências | `npm install --package-lock-only`: 478 pacotes auditados, zero vulnerabilidades reportadas |

## Lighthouse final

Execução às 06:58 de Brasília. Perfis mobile padrão e desktop, cada um com uma medição final. Relatórios completos em `reports/`.

| Métrica | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 98 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 2,29 s | 0,59 s |
| CLS | 0 | 0 |
| TBT | 34,5 ms | 0 ms |

As metas de laboratório foram atingidas nesta medição. **INP não medido**: exige dados reais de interação/usuários. TBT não é INP. Resultados locais não garantem resultados na Vercel, em rede real ou após cadastrar conteúdo.

## Falhas encontradas e corrigidas

- Erro inicial de sintaxe no cliente Supabase: corrigido; TypeScript e build reexecutados.
- Links locais sem Next Link e exportação anônima no PostCSS: corrigidos; lint aprovado.
- Seletor de teste esperava espaço no nome de aba: corrigido para localizar o nome textual.
- Contraste insuficiente nos números de abas e rótulo da marca inconsistente: corrigidos; axe repetido nas cinco larguras.
- Favicon ausente gerava 404 no console: SVG e ICO adicionados; console final sem erros.
- Uma medição intermediária teve LCP mobile 2,77 s. O carregamento GSAP foi eliminado em telas menores que 900px; nova medição final em 2,29 s. Há variabilidade normal entre execuções.
- Revisão identificou limite padrão de 1 MB em Server Actions: corpo configurado para 4 MB e imagens limitadas a 3 MB (incluindo bucket), deixando margem para o transporte na Vercel.

## Revisão básica de segurança
Inspeção de código: autenticação validada via `getUser`; todas as mutações administrativas exigem associação em admins; políticas RLS definidas; nenhuma service_role ou senha incluída; schema Zod nos inputs; assinatura/tipo/tamanho de upload verificados; SVG bloqueado no upload; consentimento obrigatório no formulário; leads públicos não legíveis; snapshot de materiais e histórico gerados no banco; deduplicação de leads por telefone normalizado; headers nosniff e DENY. Isso é revisão estática, não pentest nem validação real das políticas no Supabase.

## Bloqueado / não executado

- Login com usuário real, troca de senha, refresh de sessão e autorização de usuário comum.
- Execução da migração SQL em Supabase, confirmação prática do RLS e bucket.
- CRUD persistente, upload e exclusão/edição de conteúdo com banco real.
- Envio persistente de orçamento e atualização transacional de atendimento.
- Acessibilidade do dashboard autenticado com dados reais.
- Deploy e testes na URL final da Vercel.

Motivo: usuário informou que ainda não preparou Supabase; não há projeto, credenciais ou contas para esses testes. Siga `supabase/VERIFICATION.md` antes de declarar o sistema operacional em produção. O website e WhatsApp podem ser publicados antes disso, mantendo os estados explícitos de configuração.

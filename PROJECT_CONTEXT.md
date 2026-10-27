# Contexto do projeto

## Escopo e ambiente
Briefing: State Marcenaria, website premium e dashboard persistente. Usuário forneceu telefone 17 99744-8213, cidade Votuporanga–SP e repositório `https://github.com/caiosobrinho93/state-marcenaria-v2.git`. Supabase ainda não criado pelo usuário.

Checkout de trabalho: `C:/Users/caiosobrinho/Documents/ChatGPT/marcenaria-state`. Origem de imagens: pasta Desktop/projeto-marcenaria com 60 frames WebP, preservados. Três frames foram copiados para public/images. Sem logos, dados de catálogo ou projetos reais fornecidos.

## Arquitetura
Next.js App Router + TypeScript, React, Tailwind CSS e CSS com tokens. GSAP carregado dinamicamente em clientes que aceitam animação; parallax desktop com scrub. SSR para conteúdo público, Server Actions para mutações, Supabase Auth com cookies e proxy para refresh administrativo. Autorização central em `admin()` usa `getUser` e tabela admins, além de RLS em todas as tabelas. Aplicação usa somente chave pública, nunca service_role.

Dados: entries (materiais, projetos, categorias, fabricantes), settings (conteúdo público), leads, lead_history, admins. A lista de materiais do lead é um snapshot gerado no banco. Atualização de status/histórico é transacional via RPC. Storage público com escrita exclusiva de admin.

## Fluxos
Visitante: conhecer ambientes, filtrar catálogo, abrir detalhes em dialog nativo, selecionar materiais e enviá-los por WhatsApp; formulário persistente somente quando banco configurado. Portfólio vem exclusivamente do banco. Referências visuais não são anunciadas como projetos executados.
Admin: login, conteúdo CRUD, imagens, disponibilidade, ordenação, publicação, destaques, leads/status/notas, website/SEO/contato, nome e senha.

## Continuidade
Conectar Supabase, executar SQL, criar usuário e associação admins. Executar roteiro em supabase/VERIFICATION.md e atualizar TEST_REPORT.md com evidências. Não declarar auth, RLS, Storage ou CRUD reais aprovados antes desse teste. Ver README para deploy. Referências visuais e conteúdo editorial devem ser aprovados pela empresa antes de lançamento comercial.

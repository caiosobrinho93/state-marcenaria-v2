# Contexto do projeto

## Escopo e ambiente
Briefing: State Marcenaria, website premium e dashboard persistente. Usuário forneceu telefone 17 99744-8213, cidade Votuporanga–SP e repositório `https://github.com/caiosobrinho93/state-marcenaria-v2.git`. Supabase ainda não criado pelo usuário.

Checkout de trabalho: `C:/Users/caiosobrinho/Documents/ChatGPT/marcenaria-state`. Origem de imagens: pasta Desktop/projeto-marcenaria com 60 frames WebP, preservados. Sequência completa otimizada em public/sequence/desktop (2,16 MB) e mobile (0,88 MB), mais três fotos editoriais. Sem logos, dados de catálogo, depoimentos ou projetos reais fornecidos.

## Arquitetura
Next.js App Router + TypeScript, React, Tailwind CSS e CSS com tokens. Hero em canvas com 60 frames e GSAP ScrollTrigger com scrub, desktop e mobile; cache limitado de imagens próximas, fallback estático para movimento reduzido/economia de dados. SSR para conteúdo público, Server Actions para mutações, Supabase Auth com cookies e proxy para refresh administrativo. Autorização central em `admin()` usa `getUser` e tabela admins, além de RLS em todas as tabelas. Aplicação usa somente chave pública, nunca service_role.

Dados: entries (materiais, projetos, categorias, fabricantes, depoimentos), settings (conteúdo público), leads, lead_history, admins. Depoimentos usam a migração 002; nenhum relato fictício foi inserido. A lista de materiais do lead é um snapshot gerado no banco. Atualização de status/histórico é transacional via RPC. Storage público com escrita exclusiva de admin.

## Direção aprovada e ajustes atuais — 30/10/2026
O usuário aprovou o efeito da hero e pediu explicitamente para preservá-lo. Não alterar scroll-journey.tsx ou regras `.journey` ao ajustar o restante. Novas seções em editorial-extras.tsx: faixa CSS em loop com pausa, cards de ambientes e diferenciais, etapas e depoimentos. Typography/readability.css: textos principais 17–19 px, navegação 16–18 px, rótulos 14 px, campos com borda e fundo, raios 12 px, espaçamento 30–32 px após aviso e CTAs com aparência de botões. Cabeçalho ganha fundo escuro apenas após sair da hero para manter contraste sobre as seções claras.

## Fluxos
Visitante: conhecer ambientes, filtrar catálogo, abrir detalhes em dialog nativo, selecionar materiais e enviá-los por WhatsApp; formulário persistente somente quando banco configurado. Portfólio vem exclusivamente do banco. Referências visuais não são anunciadas como projetos executados.
Admin: login, conteúdo CRUD, imagens, disponibilidade, ordenação, publicação, destaques, leads/status/notas, website/SEO/contato, nome e senha.

## Continuidade
Conectar Supabase, executar SQL, criar usuário e associação admins. Executar roteiro em supabase/VERIFICATION.md e atualizar TEST_REPORT.md com evidências. Não declarar auth, RLS, Storage ou CRUD reais aprovados antes desse teste. Ver README para deploy. Referências visuais e conteúdo editorial devem ser aprovados pela empresa antes de lançamento comercial.

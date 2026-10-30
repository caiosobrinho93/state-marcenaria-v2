# State Marcenaria

Website mobile-first e painel administrativo em Next.js, TypeScript, Tailwind CSS, GSAP e Supabase. Preparado para GitHub e Vercel. Contato comercial configurado: **(17) 99744-8213 · Votuporanga–SP**.

## Executar

Requer Node.js 22 ou superior.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

No PowerShell: `Copy-Item .env.example .env.local`.
Sem Supabase, o website exibe conteúdo editorial e imagens conceituais; o catálogo fica vazio, o formulário persistente fica desabilitado e `/admin` explica a configuração. O WhatsApp funciona sem banco. Nenhum estoque, projeto executado ou depoimento fictício foi inserido.

## Ativar Supabase

1. Crie um projeto Supabase.
2. Execute **supabase/migrations/001_initial.sql** e depois **002_testimonials.sql** no SQL Editor. As migrações criam tabelas, índices, funções, políticas RLS, bucket `media` e suporte a depoimentos autorizados.
3. Em Project Settings/API, copie a URL e a **publishable key** para `.env.local`. Não use `service_role` nem secret key.
4. Em Authentication/Users, crie um usuário com e-mail confirmado e senha forte. Desative cadastro público se não for necessário.
5. Copie o UUID desse usuário e execute no SQL Editor:

```sql
insert into public.admins(id) values ('UUID_DO_USUARIO');
```

6. Reinicie o servidor. Entre em `/admin` e cadastre conteúdo real. Cadastros novos começam como rascunho e materiais começam **sob consulta**.
7. Em Website, confira WhatsApp, localização, textos, imagem e SEO. Publique somente conteúdo autorizado.

`admins` não pode ser alterada pela aplicação. Toda mutação administrativa verifica o usuário no servidor e também passa pelo RLS. Não existe senha padrão. Uploads aceitam JPEG/PNG/WebP de até 3 MB com inspeção de assinatura. Vídeos são vinculados por URL HTTPS, sem upload de vídeo.

## Publicar na Vercel

1. Importe `caiosobrinho93/state-marcenaria-v2` na Vercel.
   A branch padrão enviada é `codex/state-marcenaria`; selecione-a como Production Branch.
2. Framework: **Next.js**, root directory: **./**, Node: **22.x**. Os comandos padrão de instalação e build são suficientes.
3. Configure, nos ambientes apropriados:
   - `NEXT_PUBLIC_SITE_URL`: URL canônica HTTPS do site (sem barra final).
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: chave pública do projeto.
4. Faça deploy. Atualize o Site URL e URLs permitidas no Supabase Auth se utilizar convites/redefinição de senha.
5. Cadastre o domínio e confira robots, sitemap, WhatsApp e formulário no domínio final.

O deploy também funciona antes do Supabase, com as limitações explícitas descritas acima. Não há exportação estática: autenticação, Server Actions e consultas exigem o runtime Next.js.

## Verificações

```sh
npm run typecheck
npm run lint
npm run build
npm test
```

Playwright usa Chrome instalado no Windows e Chromium no CI. Em outras máquinas, instale Chrome ou ajuste `channel` no arquivo de configuração. O CI instala Chromium automaticamente. Os testes públicos assumem ambiente **sem Supabase**, para verificar a entrega inicial; não apontar CI para a base de produção.

Leia **TEST_REPORT.md** para resultados e limites, e **supabase/VERIFICATION.md** para o roteiro obrigatório após conectar o banco. O teste de desempenho não garante métricas reais de usuários.

## Organização

Hero atual: os 60 frames fornecidos são controlados pela rolagem, inclusive no mobile. `scripts/prepare-sequence.mjs` gera as variantes otimizadas a partir da pasta original. A preferência de movimento reduzido usa uma imagem estática. A faixa de texto em loop tem botão de pausa. Na seção de depoimentos, somente cadastros publicados no painel aparecem como relatos; sem conteúdo real, há um convite para compartilhar a experiência.

- `src/app`: rotas, metadados, Server Actions.
- `src/components`: website, login e painel.
- `src/lib`: cliente Supabase, autorização, conteúdo e tipos.
- `supabase/migrations`: estrutura PostgreSQL e permissões.
- `tests`: testes de navegação e acessibilidade.
- `.github/workflows/ci.yml`: TypeScript, lint, build e Playwright.

Os arquivos visuais foram copiados de `Desktop/projeto-marcenaria`; os originais foram preservados. A aplicação foi criada no checkout Git fornecido pelo ambiente. Não há logotipo oficial fornecido: a marca utiliza composição tipográfica em texto.

## Operação e limites

- Bucket público: use apenas imagens comerciais autorizadas. Remover um cadastro não apaga arquivos; faça a limpeza de imagens não utilizadas no Storage.
- Histórico de atendimento mantém nome e referência dos materiais mesmo se o catálogo mudar.
- Painel mostra 200 leads e 500 eventos recentes. Exportação, paginação avançada e retenção automática não estão implementadas.
- O endpoint de leads impõe validação e intervalo de 5 minutos por telefone normalizado. Isso reduz duplicatas, mas não substitui proteção antiautomação distribuída; configure controles de tráfego no provedor conforme necessário.
- A exclusão de dados pessoais pode ser feita pelo responsável no Supabase; backups e retenção devem ser definidos antes de operar comercialmente.
- Alteração de senha autenticada está no painel. Recuperação de conta é operada pelo responsável no Supabase Auth.

Referências técnicas: [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side), [Vercel Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs).

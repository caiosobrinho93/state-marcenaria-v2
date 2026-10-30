# Implementação
- [x] Inspecionar pasta original e preservar os 60 frames WebP.
- [x] Definir Next.js, Supabase, GSAP, Tailwind e deploy Vercel.
- [x] Hero com os 60 frames controlados pelo scroll em desktop e mobile; cache limitado e movimento reduzido.
- [x] Cards de ambientes/diferenciais/etapas e faixa contínua com pausa.
- [x] Seção de depoimentos sem conteúdo inventado e cadastro administrativo via migração 002.
- [x] Nove ajustes de leitura: fontes, campos explícitos, espaçamento, cantos de 12 px e CTAs como botões.
- [x] Código do catálogo, seleção, portfólio e solicitação persistida; WhatsApp operacional sem banco.
- [x] Código de Auth, autorização no servidor, CRUD, upload, Storage e migração RLS.
- [x] Formulários de conteúdo, perfil e SEO.
- [x] TypeScript, lint e build aprovados; 13 testes Playwright públicos aprovados na revisão atual.
- [x] Auditorias Lighthouse desktop/mobile e axe, evidências em reports e TEST_REPORT.md.
- [ ] Validar integração real após receber Supabase e conta administrativa.
- [x] Código enviado ao GitHub na branch `codex/state-marcenaria` (branch padrão do repositório novo).
- [ ] Importar o repositório na Vercel e configurar variáveis de ambiente.

## Limites do escopo entregue
- A sequência fornecida percorre cozinha e closet; outros ambientes são apresentados em cards/descrições, sem atribuir imagens ou projetos reais inexistentes.
- Sem dados de catálogo/projetos reais, o site exibe estados vazios claros. Fotos existentes são referências conceituais.
- Upload de vídeo não implementado: vídeo opcional configurável por URL HTTPS.
- Indicadores e histórico do painel refletem atendimentos; não há auditoria global de edições de catálogo.
- Painel limita listagem a 200 leads / 500 eventos recentes; paginação e exportação ainda não implementadas.
- CRUD, autenticação, autorização RLS e Storage precisam de validação integrada real após criar Supabase. Roteiro em supabase/VERIFICATION.md.

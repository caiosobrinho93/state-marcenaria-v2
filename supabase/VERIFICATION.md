# Verificação após conectar Supabase

Este roteiro **não foi executado contra um Supabase real** nesta entrega porque o projeto ainda não existe.

Execute em ambiente de teste com dois usuários: administrador associado à tabela admins e usuário comum sem associação.

1. Aplicar migração. Confirmar RLS em admins, entries, settings, leads e lead_history.
2. Sem sessão: `/admin` pede login; chamadas diretas de mutação são recusadas. REST não lê leads, histórico nem associação de outros usuários.
3. Login com usuário comum: acesso negado e sessão encerrada. Usuário comum não insere, altera ou remove conteúdo, settings, imagens ou associação admins diretamente pela API.
4. Admin: criar material em rascunho. Verificar persistência após recarregar e ausência na página pública.
5. Editar título, categoria, fabricante, especificações, variações e ordem; publicar. Confirmar no site, busca, filtro, modal e seleção. Alterar disponibilidade e verificar texto.
6. Fazer upload de JPEG/PNG/WebP; validar URL. Rejeitar SVG, arquivo com assinatura incorreta, arquivo vazio e arquivo >3 MB.
7. Criar projeto com galeria; publicar, filtrar, ampliar, despublicar, excluir. Confirmar alterações após recarregar.
8. Criar e editar categorias/fabricantes; verificar sugestões no editor.
9. Enviar lead válido com materiais selecionados e consentimento. Confirmar contato, snapshot dos itens e status novo. Repetir mesmo telefone normalizado antes de 5 minutos: recusar.
10. Tentar UUID inexistente ou de material não publicado no lead: recusar. Texto excessivo e telefone inválido: recusar.
11. Atualizar status com nota. Confirmar evento no histórico e persistência após recarregar. Material excluído não apaga o snapshot histórico.
12. Atualizar conteúdo, SEO, imagem, vídeo HTTPS e WhatsApp; conferir no site. Despublicar website e voltar a publicar.
13. Atualizar nome e senha (12+ caracteres). Sair. Senha antiga não autentica e nova autentica. Verificar renovação de sessão.
14. Repetir testes nas larguras 360, 390, 768, 1024 e 1440. Conferir console e teclado nos formulários administrativos.
15. Na URL Vercel final, verificar cookies HTTPS, cabeçalhos, sitemap e metadados. Executar Lighthouse novamente com conteúdo real.

Registrar data, ambiente, conta de teste (sem senha), resultado e evidência em TEST_REPORT.md. Não usar dados reais de clientes para testes.

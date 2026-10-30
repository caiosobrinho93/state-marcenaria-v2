# Sistema visual

## Revisão de legibilidade — 30/10/2026 (regras atuais)
Preservar a hero e sua sequência aprovada. As folhas redesign.css, enhancements.css e readability.css sucedem os estilos base. Corpo das seções: 17–19px, navegação: 16–18px, rótulos: 14px. Removidos códigos minúsculos dos cards de diferenciais. Campos de formulário: fundo escuro, borda visível, raio de 12px, label em peso 600 e placeholder de peso normal. Avisos têm 30–32px de margem inferior. Consentimento em 16px. CTAs em botões preenchidos/contornados; não apenas texto sublinhado. Nenhum dado real de cliente é simulado.

## Fundação original (subordinada à revisão acima)

- Grafite: `#11120F`; painéis: `#1B1C18`; texto: `#F3F0E8`; secundário: `#AAA99F`; dourado principal: `#EAB308`.
- Composição editorial, margens generosas, fotografias de interiores e traços finos. Sem métricas ou depoimentos inventados.
- Arial/Helvetica de sistema para evitar downloads e mudanças de layout. Títulos 35–86px responsivos, peso normal, tracking discreto. Marca tipográfica provisória em texto.
- CTAs amarelos com texto escuro; botões secundários com contorno. Elementos interativos de pelo menos 44px quando possível. Foco visível dourado.
- Seções numeradas: possibilidades, essência, materiais, portfólio e contato. Imagens conceituais explicitamente identificadas.
- Mobile: menu expansível, conteúdo em coluna, filtros que quebram linha, abas de ambiente com rolagem local, campos de formulário em 16px.
- Animações: transform, scrub, sem canvas ou carregamento dos 60 frames; desktop somente. `prefers-reduced-motion` e economia de dados desligam GSAP. Sem conteúdo invisível dependente de JavaScript.
- Dialog nativo para detalhes, semântica de abas com teclado, labels, skip link, status de envio e avisos de configuração.

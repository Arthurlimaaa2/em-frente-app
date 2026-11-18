# Handoff — Cartões de Enfrentamento (TCC)

Documento para continuidade do projeto em outro assistente (ChatGPT). Descreve o produto, as regras invioláveis, a arquitetura atual, o que está pronto, o que foi testado e o que falta.

---

## 1. Produto

Aplicativo web (PWA-ready) de **cartões de enfrentamento** inspirados em TCC: o usuário consulta cartões prontos e/ou escreve os seus para reler em momentos difíceis.

**Modelo híbrido de acesso**
- **Leitura livre, sem login:** biblioteca pública de cartões, busca e filtros.
- **Zona pessoal, com login:** criar, editar, favoritar, revisar, compartilhar (PDF/texto), lembretes e exclusão/exportação de dados.

**Tipos de cartão**
- **A — Frase-âncora:** uma frase curta para reler.
- **B — Pensamento e resposta:** pensamento automático e resposta alternativa (frente/verso).
- **C — Ação orientada:** situação + checklist de passos.
- **D — Reestruturação completa:** só existe como cartão pessoal, criado no assistente de 7 etapas (situação, pensamento, emoções/intensidade, exame de evidências, resposta alternativa, ação concreta, resumo).

**Temas fixos (9):** ansiedade, incerteza, autocrítica, comparação social, procrastinação, frustração, limites pessoais, relações, adaptação a mudanças. O usuário também cria temas próprios.

---

## 2. Regras invioláveis (não negociar em nenhuma alteração)

1. **Nada de inferência automática.** O app nunca conclui o estado emocional do usuário a partir do texto nem reescreve o que ele escreveu. A única sugestão existente é um aviso opcional ("essa palavra parece descrever emoção, não pensamento") com botão para o usuário decidir.
2. **Integridade do texto do usuário.** Nenhum campo é reformulado, resumido ou "corrigido" pelo sistema.
3. **Linguagem clínica:** psicoeducação, nunca diagnóstico, nunca promessa de resultado. Aviso fixo: não substitui psicoterapia; em crise, CVV 188.
4. **Privacidade por padrão.** Cartões pessoais, revisões, favoritos e preferências são visíveis apenas ao dono (regras de linha por usuário). Conteúdo sensível em tela bloqueada é desligado por padrão.
5. **Autodeterminação de dados.** Exportar tudo em JSON e apagar tudo, dentro do próprio app.
6. **Sem gamificação de sofrimento:** nada de streaks, rankings ou métricas de "melhora" clínica.
7. **Idioma:** interface e conteúdo em pt-BR, tom direto e acolhedor, sem exclamações em excesso.

---

## 3. Stack e ambiente

- **Base44** (plataforma): hospedagem, autenticação, banco (entidades), execução do código.
- **TanStack Start + React 19 + Vite**, rotas por arquivo, **Tailwind CSS**, componentes **shadcn/ui**, ícones **lucide-react**, PDF com **jsPDF**, toasts com **sonner**.
- Não há build local nem repositório separado: o código vive no projeto Base44 e é publicado pelo botão **Publish** (o app **ainda não foi publicado** — não existe URL pública).
- Acesso a dados via SDK `@/api/base44Client` (`base44.entities.*`).
- Leitura pública da biblioteca passa por uma *server function* (`listPublishedTemplates`, `getTemplateById`) em `src/lib/server-fns.js`, que devolve apenas templates com `status: "published"`.

---

## 4. Modelo de dados (entidades Base44)

| Entidade | Campos principais | Acesso |
|---|---|---|
| `CardTemplate` | `type` (A/B/C), `title`, `category_key`, `anchor_phrase`, `thought`, `response`, `situation`, `steps[]`, `tags[]`, `status` (published/draft), `version` | leitura pública só de `published`; escrita admin |
| `PersonalCard` | `type` (A–D), `title`, `category_key`, `status` (draft/active/archived), `source_template_id`, `anchor_phrase`, `thought`, `response`, `situation`, `steps[]`, `emotions[]`, `intensity_before`, `intensity_after`, `evidence_for`, `evidence_against`, `alternative_perspective`, `next_review_date`, `tags[]` | só o dono (ler/criar/editar/apagar) |
| `CardRevision` | `card_id`, `revision_number`, `title`, `type`, `snapshot_json` (JSON do cartão anterior) | só o dono |
| `Favorite` | `target_type` (template/personal), `target_id` | só o dono |
| `CustomCategory` | `label`, `color`, `sort_order` | só o dono |
| `ReminderPreference` | `enabled`, `time_local`, `weekdays[]`, `selection_mode` (random/favorite/fixed), `selected_card_id`, `show_sensitive_on_lockscreen` | só o dono |

**Conteúdo já carregado:** 30 templates publicados — 12 tipo A, 10 tipo B, 8 tipo C, distribuídos nos 9 temas. Não há templates tipo D (D é criado pelo usuário).

**Política de retenção de revisões:** ao editar, a versão anterior é gravada em `CardRevision`; mantêm-se as **5 últimas** (as excedentes são apagadas). Ao excluir um cartão, todas as revisões dele são apagadas junto.

---

## 5. Rotas / páginas

**Públicas (layout `_site`)**
- `/` — home: hero, cartão do dia (rotativo por data), vitrine de um cartão de cada tipo, CTA para biblioteca/criar.
- `/biblioteca` — busca por título/frase, filtro por tipo (A/B/C) e por tema.
- `/biblioteca/$templateId` — detalhe do cartão, favoritar e "salvar cópia em meus cartões" (exige login).

**Autenticadas (layout `_authed`, gate `requireSignedIn`)**
- `/meus-cartoes` — abas Ativos/Rascunhos/Favoritos/Arquivados, busca, filtro por tema, atalhos para criar/rapid/categorias/compartilhar, banner de importação de favoritos de visitante.
- `/meus-cartoes/$cardId` — detalhe: editar (encaminha para o editor do tipo), favoritar, compartilhar, arquivar/reativar, excluir, histórico de versões com restauração.
- `/criar/rapido` — rota legada preservada, agora redireciona para o fluxo D; A/B/C ficam reservados para o app futuro.
- `/criar/enfrentamento` — assistente D de 7 etapas; salva rascunho a cada avanço; edição via `?card=<id>`.
- `/preferencias` — lembrete diário (horário, dias, qual cartão mostrar), aviso sobre widget, exportar/apagar dados, limites do recurso.

**Autenticação (páginas padrão do Base44):** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/mfa`.

---

## 6. Lógica central (onde está cada coisa)

- `src/lib/categories.js` — temas fixos, rótulos dos tipos, emoções, dias da semana.
- `src/lib/cards.js` — formulário D vazio, payload do cartão, resumo por tipo, cartão do dia, `saveRevisionSnapshot` (retenção 5), `updatePersonalCard`, `deletePersonalCard` (apaga revisões), `copyTemplateToPersonal`.
- `src/lib/share.js` — montagem dos blocos de conteúdo, texto puro, PDF (A4, com versão completa ou resumida e aviso legal) e compartilhamento nativo via `navigator.share` com fallback para copiar.
- `src/lib/privacy.js` — exportação JSON de todas as entidades pessoais e exclusão total.
- `src/lib/favorites.js` — favoritos de visitante em `localStorage` (nada vai ao servidor).
- `src/components/FavoritesProvider.jsx` — carrega os favoritos **uma única vez por sessão** e compartilha com todos os botões. **Isso é crítico:** a primeira versão disparava uma consulta por cartão na lista e estourava o limite de requisições; qualquer lista nova deve consumir esse contexto, nunca consultar favoritos por item.
- `src/components/cards/*` — `CardRenderer` escolhe o componente visual por tipo (A = citação, B = frente/verso, C = checklist interativo, D = resposta + acordeão de detalhes).
- `src/components/wizard/*` — assistente D e campos reutilizáveis.
- `src/components/share/PdfExportButton.jsx` — exportação local do cartão D em PDF. `ShareDialog.jsx` permanece preservado para uma versão futura de compartilhamento.
- `src/components/reminders/ReminderForm.jsx` — preferências de lembrete + prévia da notificação.

---

## 7. Identidade visual

- Fundo creme quente, verde-petróleo como cor primária, acentos pastéis por tema.
- Tipografia: **Fraunces** (títulos) + **Inter** (texto).
- Cantos generosos, cartões com borda suave, sombra discreta, muito respiro.
- Layout mobile-first; no desktop as listas usam grade de 2–3 colunas.

---

## 8. Estado de verificação

**Testado e funcionando no preview**
- Biblioteca com 30 cartões, busca e filtros; virar o cartão tipo B; favoritar e desfavoritar.
- Criar cartão rápido pelo formulário e excluir pelo próprio cartão (com confirmação).
- Assistente D avançando de etapa com rascunho salvo; telas de Meus cartões e Preferências renderizando; layout mobile sem rolagem horizontal.
- Correção do excesso de requisições de favoritos, revalidada sem avisos de limite.

**Não verificado automaticamente**
- Prévia do compartilhamento e geração do PDF.
- Salvar o lembrete e reler a preferência salva.
- Navegação da biblioteca sem conta e favoritos de visitante (a sessão do editor é sempre autenticada).

---

## 9. Pendências e próximos passos (prioridade)

1. **Homologação editorial:** revisar os 30 textos com profissional de saúde mental; ajustar tom e evitar qualquer promessa.
2. **Acessibilidade:** contraste de todos os chips, foco visível, rótulos ARIA nas listas, teste com leitor de tela, alvo de toque ≥ 44px.
3. **LGPD:** texto de consentimento no cadastro, política de privacidade pública, prazo de retenção, contato do responsável.
4. **Notificação real / widget:** depende de um aplicativo Android complementar (widget de tela inicial + notificação com app fechado). O app web entrega hoje apenas o banner interno de lembrete na home. Definir o contrato: deep link para `/meus-cartoes/$cardId`, leitura da preferência salva e regra de conteúdo neutro na tela bloqueada.
5. **Cobertura de testes manuais** dos itens da seção 8 e do compartilhamento em iPhone e Android.
6. **Publicar** o app para gerar a URL pública (hoje não publicado).

---

## 10. Como continuar sem quebrar o que existe

- Mexer apenas no que for pedido; não alterar regras de acesso nem campos das entidades sem necessidade.
- Qualquer lista de cartões deve usar `useFavorites()` para o estado de favoritos (uma requisição por sessão).
- Ao editar um cartão, sempre passar por `updatePersonalCard` (grava revisão antes).
- Ao excluir, sempre usar `deletePersonalCard` (apaga revisões em cascata).
- Manter o aviso legal em telas públicas, no PDF e na exportação.
- Novos campos de texto do usuário nunca passam por IA para serem reescritos.

---

## 11. Perguntas úteis antes de qualquer tarefa nova

1. A mudança é na biblioteca (pública) ou na zona pessoal (privada)?
2. Ela toca o texto clínico/editorial ou só interface?
3. Precisa de novo campo no banco ou cabe nas entidades existentes?
4. Funciona em 375px de largura?
5. Pode ser revertida pelo usuário sem suporte?

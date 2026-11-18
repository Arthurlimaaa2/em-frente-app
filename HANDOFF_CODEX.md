# Cartões de Enfrentamento TCC — Handoff para Codex

## Origem e estado

- Aplicativo Base44 original: `6af3e3bf101d72fa21d6d29f`.
- Recuperação de 155 arquivos de código via API de leitura do Base44 em 11/11/2026.
- Exportação adicional de 30 registros públicos `CardTemplate` em `data/card-templates.json` (12 A, 10 B, 8 C). Dados de autor e datas foram retirados do fixture; os IDs originais foram preservados.
- Esta é uma cópia do código de desenvolvimento, não uma comprovação de build nem uma migração completa de serviços de backend.

## Objetivo do produto

App Android-first para cartões de enfrentamento da terapia cognitivo-comportamental. Biblioteca pública A/B/C, criação livre de cartões rápidos, modelo D guiado como principal recurso, categorias/favoritos, edição e revisão, lembretes opcionais, exportação PDF/texto para psicólogo e widget Android.

## Decisões de produto

- A biblioteca de exemplos pode ser consultada sem cadastro.
- Cadastro opcional para sincronizar conteúdo pessoal.
- Textos pessoais não devem ser reescritos automaticamente; preservar privacidade e acesso privado.
- Não há diagnóstico, substituição de tratamento, gamificação ou exposição pública de relatos pessoais.

## Código recuperado

- Stack: React 19, TanStack Start/Router, Vite, Tailwind, shadcn/ui, Base44 SDK.
- Rotas públicas em `src/routes/_site/`; rotas de usuário em `src/routes/_authed/`.
- Esquemas em `base44/entities/`.
- Lógica de cartões, compartilhamento, privacidade e favoritos em `src/lib/`.
- Leia `AGENTS.md` e `README.md` antes de alterar arquitetura ou fluxos de autenticação.

## Pendências prioritárias

1. Confirmar instalação de dependências e compilação num ambiente Codex com acesso ao registro npm; não verificado na recuperação.
2. Testar biblioteca anônima, favoritos, isolamento dos cartões privados, wizard D e exportação.
3. Escolher continuidade com Base44 como backend ou migração gradual para backend independente. Não assumir que o front-end sozinho funciona sem Base44.
4. Revisar tecnicamente segurança/LGPD e editorialmente os 30 cartões com profissional qualificado antes da publicação.
5. Definir implementação Android (PWA ou contêiner nativo) e widget nativo, que não vem automaticamente do projeto web.

## Atenção à migração

O arquivo `data/card-templates.json` contém apenas templates públicos. Nenhum dado pessoal de usuários foi exportado. Não enviar este app para produção sem verificar regras de acesso e armazenamento de dados sensíveis.

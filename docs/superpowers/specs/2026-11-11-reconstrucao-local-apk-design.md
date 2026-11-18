# Cartões de Enfrentamento — Reconstrução local e APK

## Intenção

Reconstruir localmente as capacidades usadas do Base44 para que o aplicativo funcione sem serviço remoto e possa ser empacotado como APK Android.

## Objetivos

- Preservar a interface e os fluxos recuperados sempre que possível.
- Disponibilizar a biblioteca pública com os 30 templates recuperados.
- Substituir entidades Base44 por armazenamento local persistente.
- Manter cartões pessoais, revisões, favoritos, categorias, lembretes, exportação e exclusão de dados.
- Criar um perfil local no dispositivo, sem fingir que existe autenticação ou sincronização online.
- Produzir um APK instalável por Capacitor.

## Fora do escopo da primeira versão

- Login remoto, cadastro, MFA, recuperação de senha e sincronização entre dispositivos.
- Gateway de IA Base44 e chamadas pagas a serviços externos.
- Widget Android nativo e notificações garantidas em segundo plano; serão tratados depois do APK básico.
- Publicação em loja.

## Abordagens consideradas

1. Continuar com Base44: preserva o backend, mas viola a exigência de reconstrução independente e não permite validação local completa.
2. Reescrever em React Native: cria um app nativo, mas exigiria reimplementar a interface recuperada.
3. Capacitor + armazenamento local: reutiliza a interface React existente, permite APK Android e deixa a persistência offline explícita. É a abordagem escolhida.

## Arquitetura escolhida

Um repositório local único abstrairá as entidades `PersonalCard`, `CardRevision`, `Favorite`, `CustomCategory` e `ReminderPreference`, com dados persistidos no dispositivo e identificadores gerados localmente. `CardTemplate` continuará sendo um fixture público somente leitura. A camada de UI deixará de importar o SDK Base44; rotas públicas usarão dados locais e rotas pessoais usarão o repositório local com um perfil local ativo.

## Segurança e privacidade

Os dados pessoais permanecerão no dispositivo e não serão enviados para servidor. O perfil local não é autenticação. A exportação e exclusão devem abranger todos os dados locais. O conteúdo continuará com o aviso de que não substitui atendimento profissional.

## Critérios de aceite

- `npm ci`, `npm test`, `npm run lint` e `npm run build` passam.
- A biblioteca pública funciona sem variáveis Base44.
- É possível criar, editar, revisar, excluir e exportar cartões localmente.
- Favoritos, categorias e lembrete persistem após recarregar o app.
- O projeto Capacitor gera um APK debug quando o Android SDK está disponível.

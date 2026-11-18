# Em Frente — V0.1.4 e preparação para a Play Store

## Identidade do produto

**Nome oficial:** Em Frente

**Ideia do nome:** um jogo de palavras entre seguir em frente e o recurso de enfrentamento. O aplicativo ajuda a pessoa a transformar uma situação difícil em uma resposta mais equilibrada e um próximo passo possível.

**Descrição curta sugerida:** Cartões práticos para atravessar momentos difíceis com mais clareza.

**Descrição longa sugerida:**

Em Frente é um recurso de autocuidado inspirado na terapia cognitivo-comportamental. A pessoa pode consultar cartões práticos ou construir, passo a passo, uma resposta alternativa para uma situação que está incomodando.

O fluxo organiza situação, pensamento, emoções, evidências, resposta alternativa e uma ação concreta. Os cartões pessoais ficam armazenados localmente no aparelho nesta versão.

O aplicativo não faz diagnóstico, não promete eficácia clínica e não substitui psicoterapia, atendimento médico ou ajuda de emergência.

## Escopo da V0.1

- Biblioteca de cartões prontos.
- Criação guiada de cartões pessoais.
- Múltiplos passos de ação e intensidade antes/depois.
- Favoritos, categorias, rascunhos e revisão local.
- Navegação ajustada para Android WebView e áreas seguras do aparelho.
- Sem dependência do Base44 no fluxo local principal.

## Validação técnica

- Testes automatizados: `npm test` (22 testes).
- Build web móvel: `npm run build:mobile`.
- Sincronização Android: `npx cap copy android`.
- APK debug: `android/app/build/outputs/apk/debug/app-debug.apk`.
- AAB release unsigned: `android/app/build/outputs/bundle/release/app-release.aab`.
- Teste físico realizado em Samsung Galaxy A05s com Android 15.

## Checklist antes do envio

- [ ] Gerar APK/AAB assinado para release.
- [ ] Criar e guardar uma keystore de upload fora do repositório; nunca publicar a senha ou a keystore.
- [ ] Confirmar application ID definitivo e política de privacidade pública.
- [ ] Criar ícone, banner e capturas de tela finais com a marca Em Frente.
- [ ] Revisar classificação etária e declaração de conteúdo de saúde/autocuidado.
- [ ] Testar instalação limpa, atualização e persistência dos dados.
- [ ] Testar rotação, teclado, botão voltar, menu, salvar e sair.
- [ ] Conferir que nenhum segredo, chave ou arquivo de desenvolvimento foi incluído.
- [ ] Fazer uma rodada final em pelo menos dois aparelhos Android.

## Nota de segurança

Em situação de crise, o aplicativo deve orientar a pessoa a procurar ajuda imediata. No Brasil, o CVV atende pelo 188. Essa orientação não substitui os serviços locais de emergência.

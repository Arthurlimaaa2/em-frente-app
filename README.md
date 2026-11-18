# Em Frente

Aplicativo Android de apoio à reflexão pessoal com cartões curtos de enfrentamento. A versão atual mantém um fluxo simples, com sugestões para começar a escrever, salvamento local e exportação em PDF. Inclui widgets de acesso rápido e contador de dias, além de temas claro, escuro e uma paleta para daltonismo.

O app não faz diagnóstico e não substitui psicoterapia ou atendimento de emergência. Os dados dos cartões ficam no armazenamento local do aplicativo.

## Versão atual: 0.3.2

- Modelo de cartão simplificado, com sugestões de escrita.
- Cartões salvos localmente e exportação em PDF.
- Widgets de reflexão rápida e contador de dias.
- Temas claro, escuro e paleta para daltonismo.
- Sem IA ou compartilhamento nesta versão.

### Baixar

Os APKs disponíveis estão em [`releases/apk`](releases/apk). Todos são builds **debug**, destinados a avaliação e teste. Para distribuir atualizações confiáveis, é necessário gerar e assinar uma versão de produção com uma keystore permanente do proprietário.

| Versão | APK |
|---|---|
| 0.3.2 | [em-frente-v0.3.2-debug.apk](releases/apk/em-frente-v0.3.2-debug.apk) |
| 0.3.1 | [em-frente-v0.3.1-debug.apk](releases/apk/em-frente-v0.3.1-debug.apk) |
| 0.3.0 | [em-frente-v0.3.0-debug.apk](releases/apk/em-frente-v0.3.0-debug.apk) |
| 0.2.0 | [em-frente-v0.2.0-debug.apk](releases/apk/em-frente-v0.2.0-debug.apk) |
| 0.1.4 | [em-frente-v0.1.4-debug.apk](releases/apk/em-frente-v0.1.4-debug.apk) |
| 0.1.3 | [em-frente-v0.1.3-debug.apk](releases/apk/em-frente-v0.1.3-debug.apk) |
| 0.1.2 | [em-frente-v0.1.2-debug.apk](releases/apk/em-frente-v0.1.2-debug.apk) |
| 0.1.1 | [em-frente-v0.1.1-debug.apk](releases/apk/em-frente-v0.1.1-debug.apk) |

O arquivo `cartoes-enfrentamento-debug.apk` é anterior à adoção do nome Em Frente.

## Compatibilidade

- Android 7.0 (API 24) ou posterior; abrange Android 10 (2020) até versões atuais compatíveis.
- Projeto configurado para compilar com SDK Android 37.
- Testado em um Samsung Galaxy A05s com Android 15. Outros aparelhos e versões precisam de validação adicional.

## Compilar

Requisitos: Node.js/npm, JDK 21 e Android SDK 37 com Build Tools 36.

```bash
npm ci
npm run build:mobile
npx cap copy android
cd android
./gradlew assembleDebug
```

No Windows, use `gradlew.bat assembleDebug`.

## Estrutura

- `src/`: aplicação web e interface.
- `android/`: projeto Android/Capacitor.
- `docs/`: documentação e histórico de escopo.
- `releases/apk/`: APKs debug arquivados.

## Licença

Código e identidade visual sob licença proprietária; todos os direitos reservados. Consulte [`LICENSE`](LICENSE). A publicação do código não concede autorização para redistribuição, modificação ou uso comercial. Bibliotecas de terceiros mantêm suas próprias licenças.

A licença atual não permite inclusão no catálogo oficial do F-Droid, que exige software livre. Uma distribuição F-Droid exigiria uma decisão expressa do titular sobre licenciamento.

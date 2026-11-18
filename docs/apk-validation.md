# Validação do APK — 11/11/2026

## Resultado

- APK debug gerado em `android/app/build/outputs/apk/debug/app-debug.apk`.
- Entregável copiado para `D:/ChatGPT/Projetos/CartoesTCC/outputs/cartoes-enfrentamento-debug.apk`.
- Assinatura APK v2 verificada com `apksigner`.
- Package: `br.com.cartoesenfrentamento.app`.
- Nome exibido: `Cartões de Enfrentamento`.

## Verificações

- `npm ci`: passou.
- `npm test`: 10 testes passaram.
- `npm run lint`: passou.
- `npm run build`: passou.
- `npm run build:mobile`: passou.
- `gradlew.bat assembleDebug` com JDK 21 e Android SDK 36: passou.
- `adb devices`: nenhum dispositivo físico/emulador conectado; instalação e interação visual ainda não foram executadas.

## Limitações conhecidas

Esta primeira versão é offline/local. O perfil, cartões, revisões, favoritos, categorias e lembretes ficam no armazenamento do dispositivo. Não há login remoto, sincronização, MFA ou widget Android nativo.

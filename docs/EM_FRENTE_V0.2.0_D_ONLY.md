# Em Frente v0.2.0 — cartão D

## Escopo desta versão

O app foi reduzido ao cartão D: situação, pensamento, emoções, exame dos fatos, resposta alternativa, ação concreta e resumo.

Foram adicionadas sugestões estáticas e opcionais para começar a escrever. Elas não usam IA, não fazem chamadas de rede e só entram no campo quando a pessoa toca em uma sugestão.

O cartão salvo pode ser exportado localmente em PDF pela tela do cartão ou pela tela “Meus cartões”. Compartilhamento com outra pessoa ficou reservado para uma versão futura.

## Preservação

Os componentes e o catálogo A/B/C não foram apagados. Eles foram retirados do caminho ativo e ficam preservados para um aplicativo separado.

## Validação realizada

- `npm test`: 28 testes aprovados;
- `npx eslint src tests --quiet`: aprovado;
- `npm run build`: aprovado;
- `npm run build:mobile`: aprovado;
- `npx cap copy android`: aprovado;
- Gradle `assembleDebug bundleRelease` com Temurin JDK 21: aprovado;
- APK identificado como `br.com.cartoesenfrentamento.app`, `versionCode 4`, `versionName 0.2.0`, rótulo `Em Frente`.

O build ainda informa um aviso de chunk acima de 500 kB; não é falha de compilação. A assinatura de publicação do AAB ainda precisa ser feita com a keystore do proprietário.

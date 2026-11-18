# Em Frente D-only — design da versão simplificada

## Intenção

Transformar o Em Frente em uma primeira versão enxuta para Android: um único fluxo de cartão D, com sugestões curtas para ajudar a escrever e exportação local em PDF.

## Objetivos

- manter o wizard de enfrentamento como o único caminho de criação;
- mostrar sugestões estáticas e opcionais nos campos principais;
- permitir salvar um cartão próprio em PDF no dispositivo;
- reduzir a superfície ativa do app para melhorar a fluidez e facilitar a validação.

## Fora desta versão

- modelos A, B e C na interface, criação ou biblioteca ativa;
- compartilhamento com outra pessoa;
- IA, geração automática de texto ou chamadas adicionais de rede;
- apagar os arquivos A/B/C existentes, que ficam preservados para o app futuro.

## Abordagens consideradas

1. Esconder A/B/C apenas com filtros. Rejeitada: deixaria rotas e ações antigas expostas e não resolveria o catálogo sem D.
2. Manter o wizard D, criar uma camada de sugestões D-only e exportar PDF diretamente. Escolhida: reaproveita as correções de Android, reduz o código executado e preserva os originais.
3. Reescrever o app em uma tela única. Rejeitada: aumentaria o risco de regressão e descartaria o fluxo D já validado.

## Decisões de implementação

- A/B/C continuam nos arquivos de origem, mas não aparecem nos caminhos ativos.
- As sugestões são exemplos fixos, selecionáveis, sem IA e sem persistência própria.
- O PDF usa o `jsPDF` já instalado e é salvo pelo navegador/WebView com nome gerado localmente.
- A próxima versão será `0.2.0`, pois o escopo funcional mudou de forma relevante.

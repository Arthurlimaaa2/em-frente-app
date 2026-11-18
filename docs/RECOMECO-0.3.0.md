# Em Frente 0.3.0 — Recomeço

Implementação autorizada na conversa: identidade ameixa/lavanda/coral, símbolo de
círculo aberto e seta, remoção do nome público cartão D, contador local configurável
por nome e data, widget rápido 1x1 e widget de dias.

O contador começa em zero na data inicial e usa dias de calendário locais.
Android guarda nome/data em SharedPreferences; a interface lê e grava por um plugin
Capacitor local. O widget usa esses mesmos dados, atualiza periodicamente pelo
Android e recebe eventos de mudança de data, horário, fuso e reinício.
Cada instância do widget mostra o mesmo contador único.

A interface web usa armazenamento local como alternativa. Notificações de
aniversário ficam para uma versão futura. O fluxo existente de sete etapas foi
preservado nesta rodada; seu encurtamento ainda depende da discussão do modelo.

Sequência de trabalho: identidade e textos; contador; integração nativa e widgets;
compilação; instalação e verificação no smartphone conectado.

Backup anterior: D:/ChatGPT/Projetos/CartoesTCC/backups/before-recomeco-20261118.

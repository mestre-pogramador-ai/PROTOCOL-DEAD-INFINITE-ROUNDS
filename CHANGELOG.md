# CHANGELOG

## V0.2 · Estação Zero

- Arena industrial subterrânea de 40 × 40 m, quatro entradas abrigadas, centro de combate e rotas laterais abertas. Pilares, venezianas, anteparos e sinalização usam o kit industrial e materiais compartilhados.
- Grade de navegação ampliada, alcance de perseguição estendido e detecção de obstáculos ao longo do segmento de movimento. As verificações entre células ficam em cache.
- Estação de munição, quatro perks e pórtico aberto acessíveis na nova planta. Cobertura e colisões participam dos testes de tiro, movimento e alcance das máquinas.
- A validação inclui comparação de render da V0.1 com a V0.2 em SwiftShader, três reinícios consecutivos e capturas reais. Consulte [o relatório](docs/STATUS_WORK.md) e [as evidências](docs/evidence/v02/).



## V0.1.0-fork — estabilização (18/11/2026)

- Importação integral do ZIP no repositório independente, preservando atribuições.
- Testes legados ajustados ao balanceamento arcade e à porta aberta sem cobrança.
- Regressão de 20 rodadas para os limites de spawn, preparação e quatro arquétipos.
- Smokes Chromium para UI, munição, reinício, derrota e isolamento do recorde.
- Runner de áudio usa a dependência declarada playwright-core; fixture isola ondas automáticas durante testes de mixagem.
- Faixa de perks mais estreita em janela pequena para reservar espaço ao HUD lateral.
- Ambiente e evidências documentados em docs/CLOUD_SETUP.md e docs/STATUS_WORK.md.


## V0.1.0-fork — primeira derivação

- Reaproveitamento do código, modelos e áudio da M8.1.4a.
- Nome e identidade de INFINITE ROUNDS.
- Ondas mais rápidas e dificuldade limitada para arcade.
- Corredor original aberto por padrão.
- Cura limitada por rodada concluída.
- Preferências e recordes separados dos do DEAD ZONE.
- Novos testes específicos e adaptação de testes legados que verificavam números antigos.
- Documentação orientada à continuidade por agente de IA.

**Estado:** código-fonte entregue para validação; testes dependentes do npm/browser ainda não executados neste ambiente.

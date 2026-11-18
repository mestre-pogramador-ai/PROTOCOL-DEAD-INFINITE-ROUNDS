# STATUS_WORK — PROTOCOL: DEAD INFINITE ROUNDS

## V0.2 · Estação Zero · 18/11/2026

A arena jogável ocupa um piso de 40 × 40 m com teto a 5,5 m. As quatro entradas ficam atrás dos anteparos norte, sul, leste e oeste. Cada anteparo tem duas saídas para a pista lateral. As faixas no piso delimitam a volta pela estação. O centro tem linhas de tiro abertas, acesso à máquina de munição e ao pórtico leste. As quatro máquinas de perks continuam acessíveis ao sul. A cobertura, os pilares e as paredes usam as mesmas dimensões no render, no Rapier e no cálculo de obstrução de tiros.

O alcance de perseguição cobre a diagonal da estação. A busca em grade leva em conta a largura de cada infectado e verifica o caminho até o alvo quando o centro da célula mais próxima cai dentro de um obstáculo. O mapa fixo permite reaproveitar as verificações de passagem entre células. A seleção de spawn usa as quatro entradas, distância, ocupação, orientação do jogador e cobertura. Os limites do diretor continuam em 6, 8 e 10 vivos conforme a rodada.

### Validação

| Execução | Resultado |
|---|---|
| Referência V0.1, commit `f096b21` | 198 testes e 13 verificações de movimento aprovados; a suíte inclui travessia do pórtico aberto, compras e progressão por rodadas. |
| `npm test` | 204 testes aprovados em 32 arquivos. Inclui ataques após contornar cobertura nas 16 combinações de entrada e arquétipo, passagem das quatro entradas aos cantos e serviços, limites de spawn, cura e progressão. |
| `npm run test:motion` | 13 verificações aprovadas. |
| `npm run build` | TypeScript e Vite concluídos. Vite sinaliza o tamanho do bundle principal. |
| Chromium, interface do jogo | M9, recarga, compra de uma bala por 6 CR, início antecipado da rodada, pausa e reinício com 500 CR, 100 HP e 15/90. |
| Chromium, Runtime acelerado | Derrota por seis ataques registrados, limpeza dos inimigos no reinício, pórtico aberto e recorde persistido em chave própria. |
| Chromium, fixture de compras com créditos iniciais de teste | Quatro perks, efeitos, proteção contra compra duplicada, crédito insuficiente e travessia física do pórtico por teclado sem débito. |
| Runtime com mira e controles automatizados | Três rodadas consecutivas na Estação Zero com spawns naturais e IA ativa. 27 eliminações, 54 disparos da M9 e 270 CR gastos em munição. |
| Chromium, fixture de combate | Com grupos semeados de 6, 12 e 20 infectados, nove disparos e quatro eliminações por grupo. Os grupos de 12 e 20 são testes de estresse fora do director. Nenhum erro JavaScript ou HTTP registrado pelo runner. |
| Chromium, Web Audio | 33 arquivos carregados. O teste exerceu o mixer, os efeitos de combate, pausa e descarte do contexto. |

Os casos históricos de colisão e tiro agora usam paredes e anteparos da Estação Zero. O teste de progressão com quatro perks descarta o custo antigo de destravar a porta. Durante uma execução paralela com o render por software, o teste de estresse com 20 infectados excedeu o prazo de 5 s. A execução final completa passou com o prazo original.

### Medição no Chromium

Chromium headless, WebGL2 sobre SwiftShader, viewport de 640 × 360, densidade de pixels 1. O cenário de medição pausa a IA, posiciona grupos mistos diante da mesma câmera e contabiliza chamadas WebGL da cena, sombras e arma. Para cada grupo, o script aguarda cinco quadros de aquecimento e mede os 15 seguintes. As quantidades representam carga de render controlada. O FPS inclui a variação do executor em nuvem.

A primeira referência foi capturada antes da alteração da geometria (`before.json`). A comparação abaixo usa uma segunda execução isolada do código V0.1 do Git (`baseline-replay.json`) seguida da versão final (`after.json`). O heap é a memória JavaScript informada pelo Chromium, em MiB. Geometrias e texturas são contagens de recursos do Three.js.

| Carga | FPS V0.1 → V0.2 | Draw calls por quadro | Heap JS (MiB) | Geometrias | Texturas |
|---|---:|---:|---:|---:|---:|
| 6 infectados | 3.51 → 3.18 | 40 → 41 | 26.7 → 27.9 | 28 → 33 | 26 → 27 |
| 8 infectados | 2.08 → 4.05 | 48 → 49 | 29.2 → 30.4 | 28 → 33 | 28 → 29 |
| 10 infectados | 3.66 → 4.47 | 52 → 53 | 31.6 → 26.7 | 28 → 33 | 30 → 31 |
| Reinício 1 (10) | 4.40 → 4.26 | 52 → 53 | 26.7 → 26.5 | 28 → 33 | 30 → 31 |
| Reinício 2 (10) | 2.98 → 4.62 | 52 → 53 | 26.2 → 26.4 | 28 → 33 | 30 → 31 |
| Reinício 3 (10) | 4.43 → 4.86 | 52 → 53 | 26.4 → 26.6 | 28 → 33 | 30 → 31 |

As contagens da V0.2 ficaram estáveis nos três reinícios com dez infectados. A faixa curta de amostragem e a coleta de lixo limitam a interpretação do heap. Pendentes uma sessão longa, medições em GPU física e uma partida manual completa. A simulação do director cobre vinte rodadas; os testes de combate e economia usam condições controladas.

A [vista geral da estação](evidence/v02/station.png), a [captura em primeira pessoa](evidence/v02/active.png), os logs e os JSONs estão em [evidence/v02](evidence/v02/). Para repetir a medição, execute `node tools/build-visual-fixture.mjs`, sirva `/tmp/m811-visual-build` na porta 4175 e rode `node tools/measure-station.cjs /tmp/station.json`. O parâmetro `STATION_PROFILE_URL` seleciona outra instância da fixture.

## Histórico da V0.1


## Concluído neste fork

- [x] Inspecionado ZIP de origem M8.1.4a.
- [x] Criada cópia separada, sem alterar fonte original.
- [x] Reaproveitada estrutura TypeScript/React/Three.js/Rapier, modelos e sons locais.
- [x] Adaptado escalonamento de rodadas e duração de preparação.
- [x] Limitado número de infectados vivos a 10 (máximo de controle de onda).
- [x] Adicionada cura limitada de 20 HP após rodada.
- [x] Porta liberada automaticamente nas partidas, sem gasto de créditos.
- [x] Alterada identidade do menu e HUD.
- [x] Chaves separadas para configurações e recordes.
- [x] Adicionado teste do modo INFINITE ROUNDS e atualizados testes que dependiam de regras antigas.
- [x] Preservados documentos de atribuição dos assets.
- [x] Parser/transpilação isolada de 86 arquivos TS/TSX sem erros sintáticos.
- [x] Smoke test Node das regras de ondas (3/6s, spawn, teto de 10/48) e recuperação de HP.
- [x] Workflow Windows restrito a acionamento manual (`workflow_dispatch`); sem build automático no push.

## Pendente de validação

- [x] `npm ci` completo — validado em 18/11/2026 com cache gravável (ver relatório abaixo).
- [x] `npm test` e `npm run test:motion` em ambiente com dependências instaladas.
- [x] Checagem TypeScript e execução em Chromium headless com WebGL2; validação manual em desktop/GPU física pendente.
- [ ] Jogar até a rodada 20, incluindo retentativas e morte real.
- [ ] Confirmar navegação e interações quando a porta já começa aberta.
- [ ] Validar curva de dificuldade e economia numéricas por telemetria local.
- [x] Reavaliados os testes de progressão que cobravam pela porta.
- [ ] Medir FPS, draw calls e memória ao longo de três reinícios.
- [ ] Revisar a disposição da estação de munição e perks para uma arena única definitiva.

## Limites

Nenhum novo GLB, sprite, efeito sonoro, arena final, instalador ou APK foi criado. O conteúdo jogável reaproveitado é o da origem, com alterações de modo descritas em `REAPROVEITAMENTO.md`.

## Próxima tarefa do agente

Instalar dependências, executar o conjunto completo de testes, corrigir falhas relacionadas ao modo arcade sem remover funcionalidades herdadas, rodar o jogo no Chrome/Edge e registrar logs/screenshots e métricas; não ampliar o escopo sem aprovação.

## Validação de estabilização — 18/11/2026

### Importação e escopo

- ZIP `PROTOCOL-DEAD-INFINITE-ROUNDS-V0.1-FONTE.zip` extraído: 220 arquivos.
- Importação publicada em `main`, commit `5fa45a6`, antes da estabilização.
- Nenhum arquivo do DEAD ZONE original foi alterado; créditos/licenças preservados.
- Nenhum asset foi substituído. Modelos renderizados e 33 sons carregados nos testes.
- Nenhum executável, instalador, mapa ou arma nova foi criado.

### Comandos e evidências reais

- `npm ci --cache /tmp/protocol-npm-cache`: 432 pacotes instalados, lockfile preservado.
  A tentativa sem cache explícito falhou por falta de escrita em `/home/agent/.npm`;
  os avisos de tarball foram resolvidos sem desativar integridade ou TLS.
- `npm test`: **198 testes passaram em 31 arquivos**. A primeira execução teve
  192 aprovados e cinco falhas: quatro expectativas de balanceamento antigo e
  um timeout do teste de multidão. Expectativas atualizadas para 195 eliminações,
  793 tiros/635 acertos (80,1%) na pista controlada; porta aberta sem débito.
  O teste de multidão conserva todas as asserções, com prazo de 20 segundos.
- `npm run test:motion`: **13/13 verificações passaram**.
- `npm run build`: TypeScript e build Vite web passaram. Aviso de bundle JS
  maior que 500 kB permanece; não houve empacotamento Electron.
- Teste novo do RoundDirector executa R1–R20, espera 3/6 s, verifica bloqueio de
  spawn ao atingir 6/8/10 vivos, total 6 + 3 por rodada até 48 e os quatro tipos.
- Suítes existentes cobrem M9, hitscan/headshots, recarga, munição finita,
  economia, perks, colisão, navegação, cura limitada e persistência independente.
  Progressão Runtime de dez rodadas usa pista/IA controladas; não é uma partida manual.
- `node tools/validate-infinite-browser.cjs`: passou no Chromium headless com
  WebGL2/SwiftShader. Menu, tiro, recarga, compra de uma bala por 6 CR (500→494),
  início antecipado da rodada, pausa e reinício (500 CR, 15/90, preparo de 3 s).
  Nenhum pageerror ou HTTP >=400 observado. Screenshots em `/tmp/protocol-evidence`.
- `node tools/validate-infinite-runtime-browser.cjs`: Runtime/Rapier executados
  no Chromium com tempo acelerado, sem render de partida. IA real matou o
  jogador após seis eventos de dano; reset restaurou 100 HP, zero inimigos e
  porta aberta. Recorde salvo em chave INFINITE ROUNDS, preservando uma chave
  sentinela do DEAD ZONE. Isso verifica isolamento, não migração de recordes antigos.
- `node tools/build-audio-fixture.mjs` + servidor HTTP em 4186 +
  `node tools/validate-audio.cjs`: passou; **33 arquivos**, nenhum erro de asset.
  Tiro, kill, recarga, tiro vazio, volume, mute, vozes limitadas, músicas,
  pausa/resume, reset e dispose verificados pelo Web Audio. Não houve escuta humana.
  A fixture isola o agendamento de ondas: antes disso ondas arcade matavam o
  ouvinte imóvel durante a checagem de música crítica. Combate/áudio continuam reais;
  estados de mixagem são entradas sintéticas explicitamente controladas.
- Fixture de perks: compras dos quatro perks confirmadas com débitos e efeitos;
  recarga em andamento permaneceu 1,5 s, próxima passou a 1,125 s.

### Limitações e pendências

- Não foi jogada manualmente uma partida de sobrevivência até R20. R20 foi
  validada pelo teste determinístico do director; a pista Runtime cobre R1–R10.
- WebGL2 disponível por software; desempenho em GPU física, FPS/draw calls,
  memória por três reinícios e balanceamento humano permanecem pendentes.
- Ferramentas de desktop compartilhado ausentes; testes usaram Chromium headless.
- O teste histórico de perks em 640×360 encontrou sobreposição do HUD; validação
  do ajuste de layout em janela pequena registrada abaixo; sequência em 1280×720 passou.
- Configuração reutilizável descrita em `docs/CLOUD_SETUP.md`. Atualização dos
  campos da plataforma não confirmada: `draft_not_editable`. Não foi publicada
  uma nova versão do ambiente nem testada restauração em nova tarefa.

### Evidências persistidas

JSONs e screenshots selecionados: `docs/evidence/2026-11-18/`. Logs completos desta instância em `/tmp/protocol-*.log` e `/tmp/protocol-evidence/`.

A sequência de perks em 1280×720 passou integralmente: quatro compras, bloqueio de compra duplicada, débito correto, recarga rápida somente na próxima recarga, HUD sem sobreposição, dano de 18 reduzido a 15,3, pausa, exportação do diagnóstico M8.1.4, reset e rejeição por crédito insuficiente. O runner usa prazo maior para movimentação no render por software.

O ajuste de HUD em 640×360 passou no probe `node tools/validate-infinite-hud-browser.cjs`: quatro rótulos injetados no DOM (não simula compras), sem interseção com onda, créditos, vida, munição e botão de erros. Evidência `hud-640.json`/`hud-640.png`.

# STATUS_WORK — PROTOCOL: DEAD INFINITE ROUNDS

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

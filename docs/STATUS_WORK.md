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

- [ ] `npm ci` completo — tentativa neste ambiente falhou porque o registro npm não respondeu; tentativa offline retornou ENOTCACHED (`zustand`). Dependências não foram empacotadas.
- [ ] `npm test` e `npm run test:motion` em ambiente com dependências instaladas.
- [ ] Checagem TypeScript e teste de execução em navegador desktop.
- [ ] Jogar até a rodada 20, incluindo retentativas e morte real.
- [ ] Confirmar navegação e interações quando a porta já começa aberta.
- [ ] Validar curva de dificuldade e economia numéricas por telemetria local.
- [ ] Reavaliar testes que assumiam a porta comprável, agora incompatíveis por mudança deliberada.
- [ ] Medir FPS, draw calls e memória ao longo de três reinícios.
- [ ] Revisar a disposição da estação de munição e perks para uma arena única definitiva.

## Limites

Nenhum novo GLB, sprite, efeito sonoro, arena final, instalador ou APK foi criado. O conteúdo jogável reaproveitado é o da origem, com alterações de modo descritas em `REAPROVEITAMENTO.md`.

## Próxima tarefa do agente

Instalar dependências, executar o conjunto completo de testes, corrigir falhas relacionadas ao modo arcade sem remover funcionalidades herdadas, rodar o jogo no Chrome/Edge e registrar logs/screenshots e métricas; não ampliar o escopo sem aprovação.

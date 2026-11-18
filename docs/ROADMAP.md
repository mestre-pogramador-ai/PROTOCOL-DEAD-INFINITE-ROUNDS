# Roadmap incremental

## V0.1-fork — base de reaproveitamento

**Objetivo:** projetar e disponibilizar o núcleo do INFINITE ROUNDS como ramificação real da M8.1.4a.

Entregas incluídas no código: regras arcade, cura entre ondas, porta aberta, novo nome, recordes separados, documentação e testes específicos. Mantém M9, 4 inimigos, máquina de munição, perks, áudio e cena original. A versão ainda requer validação no PC; não declarar finalizada para publicação.

**Critérios:** instalar dependências, passar no teste de TypeScript/Vitest, abrir no Chrome ou Edge, chegar à rodada 10, morrer/reiniciar, confirmar salvamento de recorde e áudio.

## V0.1-validada — estabilização

**Objetivo:** corrigir problemas que aparecerem ao executar este fork.

Tarefas: validar testes históricos remanescentes; jogar 20 rodadas; medir FPS com 6/8/10 infectados vivos; ajustar dano/HP e caixa de colisão; testar compra da estação/perks, áudio, pausa e gameover; verificar repetição de 3 reinícios sem vazamento.

**Critérios:** testes automáticos passando, gameplay de ponta a ponta sem travamento, ausência de erros graves no console, registros das medições.

## V0.2 — Estação Zero implementada

**Objetivo:** substituir a sala/corredor provisórios pela arena única desenhada, sem áreas bloqueadas.

Tarefas: planta final, geometria modular e arte, pontos de spawn ocultos, colisões, paths e linhas de visão compatíveis, testes de navegação e de arma. A arena 40×40 m é proposta inicial, não dimensão congelada.

**Critérios:** nenhuma entrada de spawn visível injusta, rotas fechadas, paredes atravessáveis ou quedas de desempenho críticas.

A implementação, os testes executados e as medições disponíveis estão em [STATUS_WORK.md](STATUS_WORK.md).

## V0.3 — variedade de armas

**Objetivo:** ampliar o arsenal apenas após o loop principal estar estável.

Tarefas: planejar arma 2, importar GLB licenciado, configurar sons, animação, dano, munição e UI por arma; ampliar a loja; adicionar testes de troca e recarga.

**Critérios:** nenhuma regressão na M9, armas balanceadas e modelos com créditos.

## V1.0 — publicação

**Objetivo:** acabamento, configuração e distribuição (itch.io; Windows apenas se solicitado).

Tarefas: otimização final, acessibilidade e opções, tutorial mínimo, rankings locais, licenças, testes de navegadores e pacote de distribuição.

**Critérios:** revisão funcional, estabilidade, performance e licenciamento aprovados. Não gerar EXE automaticamente.

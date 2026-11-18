# Prompt para Codex / agente de implementação

Você recebeu o projeto **PROTOCOL: DEAD — INFINITE ROUNDS V0.1-fork**, derivado diretamente do ZIP `PROTOCOLDEADZONE-m8.1.4a-horror-audio.zip`.

**Missão:** validar e estabilizar esta base reutilizada para um FPS de sobrevivência zumbi rápido, sem começar novamente do zero.

Antes de editar, leia `README.md`, `AGENTS.md`, `docs/REAPROVEITAMENTO.md` e `docs/STATUS_WORK.md`. Inspecione `src/app/Runtime.ts`, `src/gameplay/rounds/RoundDirector.ts`, `src/gameplay/enemies`, `src/gameplay/weapons/M9.ts` e a camada UI.

Tarefas desta etapa, em ordem:

1. Instale dependências com `npm ci` e execute `npm test`; investigue todas as falhas relacionadas à mudança para modo arcade e portas sempre abertas.
2. Execute `npm run test:motion`, verifique TypeScript e execute o jogo via Vite no Chrome/Edge desktop com WebGL2.
3. Valide 3s na primeira rodada, 6s nas seguintes, crescimento até 48 inimigos por rodada, máximo 10 vivos simultaneamente, quatro arquétipos, M9, áudio, compra de munição e perks, cura até 20 HP por rodada, derrota/reinício e recordes independentes.
4. Corrija bugs, travamentos e inconsistências sem reescrever sistemas existentes e sem ampliar a versão para novos mapas/armas.
5. Registre os testes realmente executados, evidências e pendências em `docs/STATUS_WORK.md` e no changelog.

**Não criar executável Windows, instalador ou nova arena** nesta tarefa. Não editar o projeto DEAD ZONE original. Se encontrar falta de assets, explique em relatório antes de substituir. Preserve todos os créditos/licenças de terceiros.

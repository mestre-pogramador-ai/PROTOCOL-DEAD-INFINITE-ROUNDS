# PROTOCOL: DEAD — INFINITE ROUNDS

**V0.2 · Estação Zero (código-fonte)** — FPS de sobrevivência zumbi para navegador/desktop, independente de **PROTOCOL: DEAD ZONE**.

Este repositório foi derivado **diretamente do arquivo fornecido pelo usuário** `PROTOCOLDEADZONE-m8.1.4a-horror-audio.zip`. Não foi clonado do GitHub e **o projeto original não foi alterado**. O objetivo é reaproveitar o código e os assets disponíveis, reduzindo o tempo de desenvolvimento do modo arcade de rodadas infinitas.

## Estação Zero

A estação subterrânea ocupa 40 × 40 m. Quatro entradas protegidas por anteparos alimentam a área de combate central e as rotas laterais. A estação de munição fica próxima ao início da partida. As quatro máquinas de perks ficam na fileira ao sul. Cada partida começa com o pórtico leste aberto.

Resultados dos testes, medições em Chromium e capturas estão em [STATUS_WORK](docs/STATUS_WORK.md) e [evidências da V0.2](docs/evidence/v02/).

## Sistemas de jogo

- FPS em Three.js / React Three Fiber e controlador Rapier (correr, pular, agachar, mira, colisão).
- Pistola **M9** funcional com modelo GLB, braços FPS, tiros hitscan, headshots, recarga e áudio próprio. **É a única arma implementada na origem**; novas armas não estão prontas.
- Quatro arquétipos de infectados (**Comum, Corredor, Brutamontes e Predador**), IA, rotas, modelos GLB, animações e áudio.
- Director de ondas, gerenciamento de inimigos, economia, créditos, máquina de perks, estação de munição, HUD, pausa, resultados, configurações e recorde local.
- Ambiente modular, shaders, culling de personagens, áudio dinâmico e diagnóstico **BAIXAR ERROS**.

## Regras do modo INFINITE ROUNDS

1. **Rodada inicial em 3 segundos**; demais rodadas com **6 segundos** de preparação. T ainda permite antecipar.
2. **Balanceamento arcade**: rodada 1 = 6 infectados; +3 por rodada até o máximo de **48 infectados totais** por rodada; no máximo **6 / 8 / 10 vivos ao mesmo tempo** conforme a rodada.
3. Vida base de infectados = **84 HP**, escalada a cada 3 rodadas e limitada a 1,6×; spawn reduz de 1,6 s até um piso de 0,65 s.
4. **Recuperação de até 20 HP** ao concluir uma rodada (nunca acima da vida máxima e nunca revive o jogador).
5. Porta/corredor do cenário original **permanentemente abertos** em jogo novo ou após reinício. A V0.2 usa a Estação Zero.
6. Identidade textual, HUD e título atualizados para INFINITE ROUNDS.
7. Preferências e recordes em **chaves de armazenamento separadas**, sem sobrescrever dados do DEAD ZONE.

**Importante:** a loja de munição e os perks já existentes **continuam acessíveis** para ampliar a jogabilidade, mas não houve adição de armas, mapas, equipamentos ou chefes novos. Os outros sistemas não foram recriados.

## Requisitos

- Node.js 22 (ou versão suportada pelo Vite 6 / Electron presente no `package.json`).
- npm e internet na primeira instalação das dependências.
- Chrome ou Edge desktop com **WebGL 2**.
- Áudio disponível após interação do jogador, conforme restrições do navegador.

## Executar o código-fonte

```bash
npm ci
npm run dev
```

Abra a URL local informada pelo Vite. Se `npm ci` falhar por indisponibilidade de rede, use uma conexão com o registro npm; o ZIP não inclui `node_modules`.

## Testar

```bash
npm test
npm run test:motion
npm run build
```

Consulte o relatório da versão em `docs/STATUS_WORK.md` para os resultados e o ambiente de execução.

## Controles

| Comando | Tecla |
|---|---|
| Andar | WASD |
| Olhar | Mouse |
| Disparar | Clique esquerdo |
| Mirar | Clique direito |
| Recarregar | R |
| Correr | Shift |
| Pular | Espaço |
| Agachar | Ctrl / C |
| Interagir com munição e perks | E |
| Antecipar rodada | T |
| Pausar | Esc |

## Documentação

- [`docs/REAPROVEITAMENTO.md`](docs/REAPROVEITAMENTO.md) — inventário real de módulos, decisões e limitações.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — próximos marcos com critérios.
- [`docs/STATUS_WORK.md`](docs/STATUS_WORK.md) — estado de implementação, pendências e validações.
- [`AGENTS.md`](AGENTS.md) — instruções para Codex / agentes.
- [`PROMPT_INICIAL.md`](PROMPT_INICIAL.md) — prompt para retomar o desenvolvimento.

## Licenciamento de assets

**Mantenha os créditos ao distribuir ou publicar o jogo.** Os modelos de arma/zumbis e parte do áudio possuem **CC-BY 3.0** (atribuição obrigatória); outros são CC0. As informações e licenças originais foram preservadas em:

- [`public/assets/manifests/ATTRIBUTION.md`](public/assets/manifests/ATTRIBUTION.md)
- [`public/assets/audio/licenses/SOURCES.md`](public/assets/audio/licenses/SOURCES.md)
- [`public/assets/manifests/CC-BY-3.0.txt`](public/assets/manifests/CC-BY-3.0.txt)

A distribuição pública futura deve incluir avisos de atribuição acessíveis.

## Base de origem

O arquivo carregado foi `PROTOCOLDEADZONE-m8.1.4a-horror-audio.zip`. O repositório informado pelo usuário foi `mestre-pogramador-ai/PROTOCOLDEADZONE`, mas **a origem desta cópia é o ZIP**, não o estado remoto do repositório.

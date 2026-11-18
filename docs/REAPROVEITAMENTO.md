# Inventário de reaproveitamento (M8.1.4a → INFINITE ROUNDS)

## Núcleo transferido praticamente sem alterações

| Área | Arquivo ou pasta | Reaproveitamento |
|---|---|---|
| Loop / inicialização | `src/app/Runtime.ts`, `src/core/*` | Preservado; configuração de porta e cura adaptadas |
| Física / FPS | `src/physics/PhysicsWorld.ts`, `src/gameplay/player/*` | Rapier e controlador mantidos |
| Arma M9 | `src/gameplay/weapons/*`, `src/gameplay/combat/*` | Modelo, arma real do código, hitscan, recarga, headshots |
| IA inimiga | `src/gameplay/enemies/*` | Quatro arquétipos, IA, navegação, separação e mortes |
| Ondas | `src/gameplay/rounds/*` | API mantida; somente escalonamento de `RoundDirector` alterado |
| Economia | `src/gameplay/economy/*` | Créditos e munição reaproveitados sem nova loja |
| Perks | `src/gameplay/perks/*` | Quatro máquinas existentes preservadas |
| Ambiente | `src/world/maps/containment.ts`, `src/presentation/rendering/*` | Sala e corredor originais com porta aberta; cenário temporário |
| Sons | `src/presentation/audio/*`, `public/assets/audio/*` | Sons e música da M8.1.4a reutilizados |
| Interface | `src/presentation/ui/*`, `src/style.css` | Layout e estados reaproveitados; textos atualizados |
| Persistência | `src/infrastructure/persistence/*` | IDs alterados para não afetar o jogo original |
| Erros/testes | `src/core/diagnostics/*`, `src/tests/*` | Diagnóstico preservado; testes de ondas adaptados |

## Modificações introduzidas

- **`RoundDirector.ts`:** progressão curta, crescimento limitado, 6 / 8 / 10 inimigos vivos, preparação 3/6s, HP limitado, intervalo de spawn controlado.
- **`PlayerDamage.ts`:** método `heal` para recuperar vida no encerramento da onda.
- **`Runtime.ts`:** abre o corredor nas inicializações; aplica recuperação real de até 20 HP ao encerrar onda; mantém créditos/perks/módulos de áudio.
- **`App.tsx`:** identidade, objetivos e instruções do modo infinito, sem trocar a arquitetura de UI.
- **`LocalBest.ts` e `Settings.ts`:** separação das chaves `localStorage`.
- **`src/tests/InfiniteRounds.test.ts`:** verificações de dificuldade, cura, isolamento de dados e porta aberta.

## O que não foi encontrado na origem

- Não há catálogo de armas jogáveis além da M9. Há variações/arquivos históricos da M9, **não armas inéditas**.
- Não há segunda arena pronta para substituir o mapa original.
- Não existe modo multiplayer nem sistema de partidas online neste código.
- Não existe um executável Windows pré-gerado neste ZIP; há apenas configuração para futura compilação.

## Decisões de arquitetura

- Usar diretamente a aplicação, sem duplicar runtime/estado/física/renderização.
- **Não** ampliar o cenário nesta iteração; isso exigiria refazer layout, colisão, navegação, spawns e testes em conjunto.
- Deixar o corredor aberto inicialmente é uma adaptação de regras, não uma reconstrução da arena. Permite movimentação adicional, mas o cenário ainda tem uma topologia diferente da proposta 40×40 m.
- Conservar economia, estação de munição e perks porque já estão implementados; o custo de manter esses sistemas é menor que reintroduzi-los posteriormente.
- Preservar materiais, dependências, scripts e atribuições CC-BY da origem.

## Riscos conhecidos

- O balanceamento herdado da M9 (dano 32, carregador 15 e 90 munições de reserva) não foi retestado contra a nova curva de HP.
- Existem testes históricos do DEAD ZONE que precisam ser revalidados com a nova regra de porta sempre aberta.
- O limite 10 corresponde a **inimigos vivos**, não necessariamente 10 cadáveres animados temporários na cena; validar draw calls e tempo de CPU no navegador.
- O intervalo e a saúde foram definidos por design, **não** medidos em partida real.
- Assets de terceiros exigem respeito à licença e créditos.

# Instruções para agentes IA — INFINITE ROUNDS

1. Este é um **fork independente** de DEAD ZONE M8.1.4a, baseado no ZIP fornecido pelo usuário. Não modificar o repositório de origem.
2. **Não recriar sistemas funcionais.** Reutilizar `Runtime`, `RoundDirector`, `EnemyManager`, `M9Controller`, `PhysicsWorld`, `AudioDirector`, a cena e GLBs reais.
3. A V0.1-fork já contém: arena original com porta aberta; round 1 em 3s; seguintes em 6s; 6 +3 inimigos por rodada até 48; limite simultâneo 6/8/10; cura máxima de 20 HP entre ondas; recordes separados.
4. Manter contratos (`RoundDirector.tick`, `Runtime.getResults`, `EnemyManager`), sem criar outro loop de renderização, física ou temporizador paralelo. React controla menus, não IA por frame.
5. A M9 é a **única arma funcional** encontrada na origem. Não afirmar que outras armas existem; novas armas exigem planejamento e aprovação.
6. Manter quatro arquétipos da origem e os sistemas de economia, munição e perks, sem aumentar a complexidade desnecessariamente.
7. Se alterar geometria, atualizar em conjunto render, física, navegação, spawns e testes; evitar geometria visual sem colisão equivalente.
8. Não apagar atribuições ou licenças `public/assets/manifests/*` e `public/assets/audio/licenses/*`; conferir créditos ao publicar.
9. Não modificar o nome/identidade do jogo original no GitHub do usuário. Não adicionar dependências externas por padrão.
10. Realizar testes regressivos (`npm test`, `npm run test:motion`) e validar o jogo em navegador desktop. Registrar resultados reais no `docs/STATUS_WORK.md`.
11. Prioridade da próxima sessão: **validar e estabilizar**, não gerar novos assets nem EXE/instaladores.
12. Não declarar um teste aprovado sem executá-lo. Se depender de rede, acesso ou ferramenta indisponível, registrar claramente.

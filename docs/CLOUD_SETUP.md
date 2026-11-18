# Ambiente de desenvolvimento na nuvem

Usar o checkout existente em `/workspace/PROTOCOL-DEAD-INFINITE-ROUNDS`.
Cada tarefa já é isolada; não criar worktree sem solicitação explícita.
Ler `AGENTS.md` e os documentos de reaproveitamento/status antes de editar.

## Instalação e execução verificadas

Node disponível nesta validação: 24.22.1; Chromium do sistema; npm 11.9.0.
O README recomenda Node 22 ou outra versão suportada pelas dependências.

```sh
cd /workspace/PROTOCOL-DEAD-INFINITE-ROUNDS
npm ci --cache /tmp/protocol-npm-cache
npm run dev -- --port 5173 --strictPort
```

O cache explícito evita o diretório padrão não gravável desta máquina. Não
remover checksums nem desativar TLS. Não são necessárias credenciais de aplicação.
O Vite deve responder por HTTP e mostrar INICIAR OPERAÇÃO em navegador com WebGL2.
Processos precisam ser iniciados novamente em tarefas futuras.

```sh
npm test
npm run test:motion
npm run build
node tools/validate-infinite-browser.cjs
node tools/validate-infinite-runtime-browser.cjs
```

Os dois últimos comandos exigem Vite ativo. `INFINITE_URL` permite outra URL;
o smoke visual usa Chromium headless e WebGL2 por SwiftShader. Não representa
benchmark de GPU física nem partida manual até R20. Evidências: `/tmp/protocol-evidence`.

Áudio (fixture própria; outro terminal para o servidor):

```sh
node tools/build-audio-fixture.mjs
python -m http.server 4186 --bind 0.0.0.0 --directory /tmp/pdz-audio-browser
node tools/validate-audio.cjs
```

Perks (fixture com créditos semeados para testar compras):

```sh
node tools/build-perk-fixture.mjs
python -m http.server 4174 --bind 0.0.0.0 --directory /tmp/m81-perk-build
EXPECTED_REPORT_VERSION=M8.1.4 node tools/validate-m81-browser.cjs
```

`build` produz somente a aplicação web. Não executar scripts desktop de
empacotamento nesta tarefa. Preservar todas as atribuições e licenças.

## Persistência da configuração da plataforma

A tentativa de atualizar `install_script` e `start_skill` retornou
`draft_not_editable`; a gravação não foi confirmada. O rascunho lido contém
`install_script: npm ci` e nenhum `start_skill`. Os passos acima preservam a
configuração proposta no Git para revisão e uso em futuras tarefas. Isso não
confirma publicação de snapshot nem restauração em uma nova máquina.

# Photoshop

Repositorio de scripts, paineis e extensoes para Adobe Photoshop.

## Projeto inicial

Este repositorio foi criado para concentrar o desenvolvimento do painel UXP de exportacao de artboards.

Objetivo inicial:

- Detectar artboards no documento ativo do Photoshop.
- Exportar cada artboard como arquivo separado.
- Oferecer opcoes para remover ou preservar propriedades conforme o fluxo de producao.
- Gerar pacote final para instalacao/teste quando a versao estiver pronta.

## Estrutura recomendada

```text
Artboard Exporter UXP/
  manifest.json
  index.html
  main.js
  styles.css
  assets/
  dist/
```

## Regra principal

Antes de alterar qualquer painel, script ou arquivo de empacotamento, leia:

1. `VERSIONING.md`
2. `AGENTS.md`
3. `CLAUDE.md`

Esses arquivos definem o padrao compartilhado entre Codex, Claude Code e qualquer outro agente que trabalhe neste repositorio.

## Fluxo recomendado

1. Entender qual painel ou script sera alterado.
2. Conferir a versao atual no `manifest.json`, no cabecalho do script ou na documentacao do projeto.
3. Implementar a mudanca no menor escopo possivel.
4. Atualizar a versao quando a mudanca alterar comportamento, empacotamento ou estabilidade.
5. Fazer commit com mensagem clara em portugues.
6. Subir para o GitHub.

## Cuidados especificos de UXP

- Nao confundir UXP com CEP/ZXP de After Effects.
- Validar comandos Photoshop/UXP antes de assumir que uma acao DOM ou batchPlay esta disponivel.
- Evitar fechar ou modificar o documento original sem confirmacao clara do fluxo.
- Separar codigo-fonte de pacotes finais em `dist/`.
- Nao commitar arquivos temporarios gerados pelo sistema ou pelo Photoshop.

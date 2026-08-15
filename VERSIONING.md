# Versioning

Este repositorio usa um padrao simples baseado em SemVer:

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
1.0.1
```

## Como incrementar

- `PATCH` (`1.0.0` -> `1.0.1`): correcao de bug, ajuste pequeno, compatibilidade, texto, comentario, empacotamento ou melhoria interna.
- `MINOR` (`1.0.0` -> `1.1.0`): novo recurso compativel com o fluxo anterior.
- `MAJOR` (`1.0.0` -> `2.0.0`): mudanca grande, incompatibilidade ou alteracao importante no fluxo de uso.

## Onde atualizar

Para paineis UXP, a versao principal deve estar em:

```text
manifest.json
```

Quando existir cabecalho em arquivos como `main.js`, ele tambem deve ser mantido em sintonia.

Exemplo em `manifest.json`:

```json
{
  "version": "1.0.1"
}
```

Exemplo em script:

```javascript
// Version: 1.0.1
```

## Estado inicial

A primeira versao funcional do painel deve ser marcada como:

```text
1.0.0
```

A primeira correcao pequena depois disso deve virar:

```text
1.0.1
```

## Changelog

Quando a mudanca for relevante, registre um changelog curto no README do projeto ou no cabecalho do arquivo principal:

```text
v1.0.1 changelog:
- Corrige erro ao exportar artboards com opcoes desligadas.
- Ajusta uso de batchPlay para evitar comando indisponivel.
```

## Commits

Use mensagens objetivas em portugues, preferencialmente neste estilo:

```text
fix: corrige exportacao de artboards
feat: adiciona opcao para remover propriedades
chore: organiza arquivos de empacotamento UXP
release: prepara Artboard Exporter UXP v1.0.1
```

Quando a mudanca representar uma versao pronta para teste ou uso, incluir a versao na mensagem do commit.

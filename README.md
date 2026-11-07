# Photoshop — ferramentas da Noé VFX

Ferramentas para o **Adobe Photoshop**: um painel próprio da Noé VFX e um MCP de terceiros, incluído com a licença original.

## O que tem aqui

| Pasta | O que é | Versão |
| :--- | :--- | :--- |
| [`Scripts PS`](Scripts%20PS) | **Export Artboards**: painel que exporta cada artboard do documento como um arquivo separado, com opções do que remover ou manter | 1.3.3 |
| [`Photoshop-mcp`](Photoshop-mcp) | MCP que deixa assistentes de IA controlarem o Photoshop. **Obra de Ali Sait Teke**, licença MIT, com uma pequena correção nossa | 1.7.37 |

## Export Artboards: como instalar

1. Baixe o [`.ccx`](Scripts%20PS/release/v1.3.3/Photoshop%20-%20Export%20Artboards%20UXP.ccx).
2. Dê um duplo clique: o Creative Cloud instala o painel.
3. No Photoshop, abra **Plug-ins → Export Artboards**, escolha as opções e exporte.

Prefere carregar pelo UXP Developer Tool? Use o [`.zip`](Scripts%20PS/release/v1.3.3/Photoshop%20-%20Export%20Artboards%20UXP.zip), que é o próprio código do painel (sem etapa de build).

## Photoshop MCP

O código e a licença são do autor original, **Ali Sait Teke** ([projeto original](https://github.com/alisaitteke/photoshop-mcp)). A licença MIT está em [`Photoshop-mcp/LICENSE`](Photoshop-mcp/LICENSE) e a única alteração nossa está descrita em [`ORIGEM.md`](Photoshop-mcp/ORIGEM.md). Para usar, instale as dependências com `npm install` na pasta `server`.

## Estrutura do repositório

```text
Photoshop/
├─ Scripts PS/        painel Export Artboards (pacotes em release/vX.Y.Z/, CHANGELOG e HANDOFF)
└─ Photoshop-mcp/     MCP de terceiros (MIT), com LICENSE e ORIGEM
```

## Contato

Noé VFX — [noevfx.com](https://noevfx.com) · [labs@noevfx.com](mailto:labs@noevfx.com)

Adobe e Photoshop são marcas da Adobe. Estas ferramentas são independentes e não são afiliadas nem endossadas pela Adobe.

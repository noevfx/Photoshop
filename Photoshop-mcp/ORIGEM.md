# Origem e licença

Esta pasta contém o **Photoshop MCP** 1.7.37, de **Ali Sait Teke** (https://github.com/alisaitteke/photoshop-mcp), licenciado sob a **MIT** (ver `LICENSE`, copyright do autor original). Pacote original: https://photoshop-mcp.com

## Modificações da Noé VFX (06/11/2026)

- `server/dist/api/photoshop-api.js`: a execução do script passou a usar `eval` com o texto do script serializado por `JSON.stringify`, em vez de embutir o script direto numa função. É uma correção pequena; nenhuma ferramenta foi acrescentada.

Todo o resto é do autor original, sem alterações. A pasta `server/node_modules` não faz parte do repositório (é instalada com `npm install`).

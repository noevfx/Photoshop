# Photoshop (Scripts PS) — HANDOFF

Repositório `noevfx/Photoshop` (git próprio). Um produto: painel UXP **Export Artboards 1.3.3**. Regras gerais: `D:\.IA agents\global\AGENTS.md`, `PS_PATTERNS.md` e `RELEASES.md`.

## Mapa

```text
Photoshop\
├─ Scripts PS\                (este repositório)
│   ├─ release\v1.3.3\        .ccx e .zip do painel
│   ├─ version.txt            1.3.3
│   └─ README.md  CHANGELOG.md  HANDOFF.md  VERSIONING.md  AGENTS.md  CLAUDE.md
└─ Photoshop-mcp\             MCP de terceiros ("Photoshop MCP" 1.7.37, MIT, Ali Sait Teke; 1 correção nossa em `photoshop-api.js`): republicar só com `LICENSE` e crédito, ver `ORIGEM.md`
```

## Como continuar

- O painel é JavaScript puro (sem build): `manifest.json`, `js/main.js`, `css/style.css`, `icons/`. O código está dentro do `.zip` da release.
- Para editar: extrair o `.zip` para uma pasta de trabalho, carregar no UXP Developer Tool, testar no Photoshop, subir a versão em `manifest.json` (id `com.claude.exportartboards`), gerar `.ccx` e `.zip` em `release/vX.Y.Z/`.
- Padrões de Photoshop (smart objects, não-destrutividade, `batchPlay` cirúrgico): `PS_PATTERNS.md`.

## Como lançar uma versão

`D:\.IA agents\global\RELEASES.md`: backup em `_backups\` → bump no `manifest.json` e em `version.txt` → entrada no `CHANGELOG.md` → pacotes em `release\vX.Y.Z\` → commit → publicar e espelhar no Drive.

## Estado (2026-10-25)

- Reorganizado em 2026-10-25 (ver `CHANGELOG.md`). Ainda nada foi enviado ao GitHub: os repositórios `noevfx/...` serão criados e enviados só com ordem do Eduardo ("pode subir pro git").
- O código-fonte editável do painel não está versionado fora do `.zip`; se a pasta de trabalho original ainda existir em algum lugar do PC, vale trazê-la para cá.
- O servidor MCP de Photoshop que o Claude Code usa fica em `C:\Users\enn_g\.claude\mcp\photoshop-mcp\server\dist\index.js` (cópia do pacote de terceiros), não em `Photoshop-mcp\`.

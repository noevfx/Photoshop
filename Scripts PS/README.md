# Photoshop — Scripts PS

Scripts, painéis e extensões para Adobe Photoshop do ecossistema Noé VFX. Hoje o repositório tem um produto:

## Export Artboards (painel UXP) — versão 1.3.3

Detecta os artboards do documento ativo do Photoshop e exporta cada um como arquivo separado, com opções para remover ou preservar propriedades conforme o fluxo de produção.

- **Pacote para instalar:** `release/v1.3.3/Photoshop - Export Artboards UXP.ccx` (duplo clique instala pelo Creative Cloud) ou o `.zip` com os mesmos arquivos (JS/CSS/HTML sem etapa de build, usado para carregar o painel no UXP Developer Tool).
- **Código-fonte:** o painel não tem build; o conteúdo do `.zip` é o próprio código (`manifest.json`, `js/main.js`, `css/style.css`, `icons/`). Ao editar, extrair para uma pasta de trabalho, mudar a versão no `manifest.json` e gerar o pacote novo em `release/vX.Y.Z/`.
- **Id do plugin:** `com.claude.exportartboards`.

## Estrutura

```text
Scripts PS\
├─ release\vX.Y.Z\   pacotes de cada versão, em ordem crescente (hoje v1.3.3)
├─ version.txt       versão atual
├─ CHANGELOG.md  HANDOFF.md  VERSIONING.md  AGENTS.md  CLAUDE.md
```

## Regras

Antes de alterar painel, script ou empacotamento, ler `VERSIONING.md`, `AGENTS.md` e `CLAUDE.md`; a diretriz de releases de todos os projetos está em `D:\.IA agents\global\RELEASES.md`. SemVer (`MAJOR.MINOR.PATCH`), commits em português com prefixos semânticos. Padrões de Photoshop: `D:\.IA agents\manuais\PS_PATTERNS.md`.

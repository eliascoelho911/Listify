# Plano de Implementação: [FEATURE]

**Branch**: `[###-feature-name]` | **Data**: [DATE] | **Versão alvo**: [ex.: MVP, v1.0] | **Spec**: [link]
**Input**: Feature specification de `/specs/[###-feature-name]/spec.md`

**Nota**: Este template é preenchido pelo comando `/speckit.plan`. Veja `.codex/prompts/speckit.plan.md`
para o workflow de execução.

## Resumo

[Extrato da spec: requisito principal + abordagem técnica vinda de research]

## Contexto Técnico

<!--
  ACTION REQUIRED: Substitua o conteúdo desta seção pelos detalhes técnicos
  do projeto. A estrutura abaixo é apenas um guia para orientar a iteração.
-->

**Linguagem/Versão**: [ex.: Kotlin 2.x, Swift 5.x, TS 5.x ou NEEDS CLARIFICATION]  
**Dependências Principais**: [ex.: Jetpack Compose, SwiftUI, React Native ou NEEDS CLARIFICATION]  
**Storage**: [se aplicável, ex.: SQLite, CoreData, arquivos ou N/A]  
**Testes**: [ex.: JUnit, XCTest, Jest ou NEEDS CLARIFICATION]  
**Plataforma-alvo**: [ex.: Android, iOS ou NEEDS CLARIFICATION]  
**Tipo de Projeto**: [single/web/mobile - determina a estrutura]  
**Metas de Performance**: [ex.: 60 fps, “instantâneo” percebido, offline-first ou NEEDS CLARIFICATION]  
**Restrições**: [ex.: offline-first, sem travar UI, <100MB ou NEEDS CLARIFICATION]  
**Escala/Escopo**: [ex.: MVP com 1 lista, v1 com X telas, ou NEEDS CLARIFICATION]

## Checagem da Constituição

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] Documentação em pt-BR; nomes de código (classes/funções/endpoints) em inglês
- [ ] Versão-alvo definida (MVP/v1/v1.x) + fora de escopo explícito
- [ ] Fluxos críticos minimalistas (adicionar/marcar/filtrar com pouco atrito)
- [ ] Offline-first e UX instantânea (sem travar UI)
- [ ] Estados claros e resumo de progresso no topo
- [ ] Clean Architecture (UI sem lógica de negócio; domínio testável)
- [ ] Testes planejados para novas regras de negócio (unidade no domínio; integração quando aplicável)

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Código-fonte (raiz do repositório)
<!--
  ACTION REQUIRED: Substitua a árvore placeholder abaixo pela estrutura real
  desta feature. Remova opções não usadas e expanda a opção escolhida com
  paths reais (ex.: apps/admin, packages/something). O plano final MUST NOT
  incluir labels "Option".
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Tracking de Complexidade

> **Preencha APENAS se houver violações na Checagem da Constituição que precisem ser justificadas**

| Violação | Por que é necessário | Alternativa mais simples rejeitada porque |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

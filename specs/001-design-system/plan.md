# Plano de Implementação: Design System Completo com Atomic Design

**Branch**: `001-design-system` | **Data**: 2026-01-09 | **Versão alvo**: v2.0 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification de `/specs/001-design-system/spec.md`

**Nota**: Este template é preenchido pelo comando `/speckit.plan`. Veja `.codex/prompts/speckit.plan.md`
para o workflow de execução.

## Resumo

Implementar um Design System completamente novo para o Listify usando Atomic Design, com tokens baseados em Shadcn (incluindo tokens customizados de topbar), tipografia Fira Sans/Code, paleta cyan/gray, large radius e spacing compacto. Inclui suporte a dark/light themes (dark padrão), Storybook para documentação, CLI para scaffolding, testes visuais e coexistência controlada com o Design System legado para permitir desenvolvimento gradual.

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5.9.2
**Framework Principal**: React Native 0.81.5 + Expo ~54.0.31
**Dependências Principais**:
- React 19.1.0
- Expo Router ~6.0.21 (file-based routing)
- Zustand ^5.0.9 (state management)
- i18next ^25.7.3 + react-i18next ^16.5.1 (internacionalização)
- React Native Reanimated ~4.1.1 (animações performáticas)
- React Native Gesture Handler ~2.28.0
- NEEDS CLARIFICATION: Lucide React Native (ícones - verificar pacote correto)
- NEEDS CLARIFICATION: Storybook React Native (versão e setup)
- NEEDS CLARIFICATION: Ferramenta de screenshot testing (Playwright vs Chromatic vs Detox)

**Storage**: AsyncStorage (para persistência de preferência de theme)
**Testes**: Jest ^29.7.0 + ts-jest ^29.4.6
**Plataforma-alvo**: Mobile (iOS + Android via Expo)
**Tipo de Projeto**: Mobile app (React Native + Expo) com Clean Architecture
**Arquitetura Atual**: Clean Architecture com camadas:
- `src/app/`: Bootstrap, DI container, i18n setup
- `src/domain/`: Pure business logic (entities, use-cases, ports)
- `src/data/`: Mappers (SQLite row → domain entity)
- `src/infra/`: SQLite implementation, external services
- `src/presentation/`: React components, screens, Zustand stores, hooks
- `src/design-system/`: Theme tokens, DS components

**Metas de Performance**:
- 60 fps em animações e transições
- Operações de UI instantâneas (offline-first, sem travar)
- Renderização performática com Reanimated para animações complexas

**Restrições**:
- Offline-first (Design System deve funcionar sem conectividade)
- Zero valores hard-coded (enforçado via ESLint customizado)
- Hierarquia Atomic Design estrita (enforçado via ESLint)
- Fira Sans/Code devem ser carregadas via Expo Fonts
- NEEDS CLARIFICATION: Tamanho de bundle (limite aceitável com Fira fonts + Lucide icons)

**Escala/Escopo**: v2.0 - Redesign completo do Design System + migração 100% dos componentes existentes

## Checagem da Constituição

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Documentação em pt-BR; nomes de código (classes/funções/endpoints) em inglês
  - ✅ Spec e plan em pt-BR; componentes serão nomeados em inglês (Button, Card, etc)
- [x] Versão-alvo definida (MVP/v1/v1.x) + fora de escopo explícito
  - ✅ v2.0 definida; fora de escopo: nenhum (versão completa)
- [x] Fluxos críticos minimalistas (adicionar/marcar/filtrar com pouco atrito)
  - ✅ Design System é infraestrutura; não adiciona atrito aos fluxos existentes. Componentes atoms serão minimalistas por design.
- [x] Offline-first e UX instantânea (sem travar UI)
  - ✅ Design System funciona 100% offline; theme switching usa AsyncStorage local; animações com Reanimated (thread UI nativa)
- [x] Estados claros e resumo de progresso no topo
  - ✅ Não aplicável (Design System é infraestrutura); componentes terão estados visuais claros (default, focus, error, disabled)
- [x] Clean Architecture (UI sem lógica de negócio; domínio testável)
  - ✅ Design System vive em src/design-system/; zero lógica de negócio; apenas apresentação pura (tokens + componentes)
- [x] Testes planejados para novas regras de negócio (unidade no domínio; integração quando aplicável)
  - ✅ Testes visuais (screenshots) para validar aparência; testes de componentes (Jest + React Native Testing Library); sem regras de negócio no DS

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

```text
src/
├── app/                          # Bootstrap, DI, i18n (existente)
├── domain/                       # Business logic (existente)
├── data/                         # Mappers (existente)
├── infra/                        # SQLite, external services (existente)
├── presentation/                 # App components, screens, stores (existente - será migrado)
└── design-system/                # ⭐ NOVO - Estrutura Atomic Design
    ├── tokens/                   # Design tokens (fundação)
    │   ├── colors.ts             # Shadcn colors + topbar customizados (cyan/gray palette)
    │   ├── typography.ts         # Fira Sans/Code config
    │   ├── spacing.ts            # Compact spacing scale
    │   ├── radii.ts              # Large radius scale
    │   ├── animations.ts         # Durações e easing curves
    │   ├── shadows.ts            # Elevation tokens
    │   └── index.ts              # Barrel export
    ├── theme/                    # Theme provider e configs
    │   ├── ThemeProvider.tsx     # Context provider (dark/light switching)
    │   ├── theme.ts              # Theme object (dark + light)
    │   ├── useTheme.ts           # Hook para consumir theme
    │   └── index.ts
    ├── atoms/                    # ⚛️ Componentes atômicos
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   ├── Button.styles.ts
    │   │   ├── Button.types.ts
    │   │   └── Button.stories.tsx
    │   ├── Input/
    │   ├── Label/
    │   ├── Badge/
    │   ├── Icon/                 # Wrapper Lucide
    │   └── index.ts
    ├── molecules/                # 🧬 Componentes compostos (atoms)
    │   ├── FormField/            # Label + Input
    │   ├── SearchBar/
    │   └── index.ts
    ├── organisms/                # 🦠 Componentes complexos
    │   ├── Navbar/               # Usa topbar tokens
    │   ├── ShoppingListCard/
    │   └── index.ts
    ├── templates/                # 📐 Layout structures
    │   └── index.ts
    ├── utils/                    # Helpers do DS
    │   ├── cn.ts                 # classnames utility (if needed)
    │   └── index.ts
    └── index.ts                  # Barrel export do DS completo

.storybook/                       # ⭐ NOVO - Storybook config
├── main.ts
├── preview.ts
└── theme.ts                      # Storybook custom theme

scripts/                          # ⭐ NOVO - CLI tools
└── ds-cli/
    ├── generate.ts               # Generate atom/molecule/organism
    ├── templates/
    └── index.ts

tests/
├── design-system/                # ⭐ NOVO - Testes do DS
│   ├── atoms/
│   ├── molecules/
│   ├── visual/                   # Screenshot tests
│   └── utils/
├── domain/                       # Existente
├── data/                         # Existente
└── presentation/                 # Existente
```

**Structure Decision**: Mobile app (React Native + Expo) com Clean Architecture existente. O novo Design System será adicionado em `src/design-system/` seguindo Atomic Design estrito, coexistindo com o Design System legado em `src/legacy-design-system/`. Novos componentes devem usar o novo DS, enquanto componentes existentes em `src/presentation/` continuam usando o DS legado.

**⚠️ IMPORTANTE - Coexistência com DS Legado**:
1. Renomear `src/design-system/` → `src/legacy-design-system/` antes de começar implementação
2. Atualizar `tsconfig.json` para adicionar path alias `@legacy-design-system/*` apontando para `src/legacy-design-system/*`
3. Manter path alias `@design-system/*` para o novo DS
4. Atualizar imports em `src/presentation/` para usar `@legacy-design-system/*`
5. Componentes existentes continuam usando `@legacy-design-system/*` indefinidamente
6. Novos componentes devem usar `@design-system/*` (novo DS)
7. DS legado permanece no projeto para manter compatibilidade com código existente

## Tracking de Complexidade

> **Preencha APENAS se houver violações na Checagem da Constituição que precisem ser justificadas**

Nenhuma violação. Todos os princípios da constituição foram respeitados.

---

## Re-Checagem da Constituição (Pós-Design)

*Re-executada após Phase 1 (research, data-model, contracts, quickstart)*

- [x] Documentação em pt-BR; nomes de código (classes/funções/endpoints) em inglês
  - ✅ research.md, data-model.md, quickstart.md em pt-BR
  - ✅ contracts/ usa nomes em inglês (Button, Input, Theme)
  - ✅ Comentários em contracts em inglês (JSDoc)

- [x] Versão-alvo definida (MVP/v1/v1.x) + fora de escopo explícito
  - ✅ v2.0 mantida em todos os artefatos
  - ✅ Fora de escopo: nenhum (versão completa)

- [x] Fluxos críticos minimalistas (adicionar/marcar/filtrar com pouco atrito)
  - ✅ Design System não adiciona atrito; componentes atoms são minimalistas
  - ✅ Spacing compacto definido explicitamente (data-model.md)
  - ✅ API de componentes simples (ver contracts/components.contract.ts)

- [x] Offline-first e UX instantânea (sem travar UI)
  - ✅ Theme switching usa AsyncStorage local (research.md, data-model.md)
  - ✅ Animações com Reanimated (thread UI nativa - research.md)
  - ✅ Fonts carregadas async com splash screen (research.md decisão #6)
  - ✅ Zero dependências externas online (Lucide tree-shakeable local)

- [x] Estados claros e resumo de progresso no topo
  - ✅ N/A para Design System (infraestrutura)
  - ✅ Componentes têm estados visuais claros (Input: default/focus/error/disabled)
  - ✅ Button tem feedback visual (loading, disabled states)

- [x] Clean Architecture (UI sem lógica de negócio; domínio testável)
  - ✅ Design System é apresentação pura (src/design-system/)
  - ✅ Zero lógica de negócio (apenas tokens + componentes visuais)
  - ✅ ThemeProvider é infraestrutura pura (persistência via AsyncStorage)
  - ✅ Separação clara: tokens → theme → atoms → molecules → organisms

- [x] Testes planejados para novas regras de negócio (unidade no domínio; integração quando aplicável)
  - ✅ Testes visuais (Detox screenshots) para validar aparência (research.md decisão #3)
  - ✅ Testes de componentes com Jest + React Native Testing Library (planejado)
  - ✅ Zero regras de negócio no DS (N/A para testes de domínio)

### Decisões Técnicas Alinhadas com Constituição

| Decisão | Princípio Atendido | Evidência |
|---------|-------------------|-----------|
| AsyncStorage para theme | Offline-first | research.md #1, data-model.md seção 3 |
| Fira fonts via expo-font | Offline-first | research.md #6, carregamento local |
| Lucide tree-shakeable | Performance + Offline | research.md #1, bundle size aceitável |
| Spacing compacto | Menos atrito | data-model.md seção 1.3, valores < Shadcn |
| Reanimated animações | UX instantânea | research.md #5, 60fps garantido |
| Atomic Design enforçado | Clean Architecture | data-model.md seção 5, ESLint rules |
| Dark theme padrão | Decisão de produto | data-model.md seção 2.2, spec.md |

✅ **PASS**: Todas as checagens passaram. Design alinhado com constituição do Listify.

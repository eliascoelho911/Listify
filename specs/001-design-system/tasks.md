---

description: "Lista de tarefas para implementação do Design System Completo com Atomic Design"
---

# Tarefas: Design System Completo com Atomic Design

**Versão alvo**: v2.0
**Input**: Documentos de design em `/specs/001-design-system/`
**Pré-requisitos**: plan.md, spec.md, research.md, data-model.md, contracts/

**Testes**: Este Design System é infraestrutura pura (sem lógica de negócio). Testes são focados em:
- Testes de componentes (Jest + React Native Testing Library)
- Validação de tokens e themes
- Compliance de hierarquia Atomic Design (ESLint)

**Organização**: Tarefas são agrupadas por user story para permitir implementação e validação independentes.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a tarefa pertence (ex.: US1, US2, US3)
- Inclua paths exatos nos textos das tarefas

## Convenções de Paths

- **Design System**: `src/design-system/`
- **Testes**: `tests/design-system/`
- **Scripts**: `scripts/ds-cli/`
- **Storybook**: `.storybook/`

---

## Fase 1: Setup (Infra Compartilhada)

**Propósito**: Preparar projeto para novo Design System e renomear DS antigo

- [x] T001 Renomear `src/design-system/` para `src/legacy-design-system/`
- [x] T002 Atualizar tsconfig.json para adicionar path alias `@legacy-design-system/*` apontando para `src/legacy-design-system/*`
- [x] T003 Atualizar todos os imports em `src/presentation/` de `@design-system/*` para `@legacy-design-system/*`
- [x] T004 Criar estrutura de pastas do novo Design System em `src/design-system/`
- [x] T005 [P] Instalar dependência lucide-react-native
- [x] T006 [P] Instalar dependências do Storybook (@storybook/react-native ~7.6.x)
- [x] T007 [P] Baixar e adicionar Fira Sans fonts (Regular, Medium, SemiBold, Bold) em `assets/fonts/`
- [x] T008 [P] Baixar e adicionar Fira Code fonts (Regular, Medium) em `assets/fonts/`

---

## Fase 2: Fundacional (Pré-requisitos Bloqueantes)

**Propósito**: Configurar ESLint customizado para enforçar regras do Design System

**⚠️ CRÍTICO**: Nenhuma user story começa até esta fase estar concluída

- [x] T009 Criar arquivo `eslint-rules/no-hardcoded-values.js` com regra customizada detectando valores hard-coded
- [x] T010 Criar arquivo `eslint-rules/atomic-design-imports.js` com regra validando hierarquia Atomic Design
- [x] T011 Criar arquivo `eslint-rules/theme-provider-usage.js` com regra enforçando uso de useTheme()
- [x] T012 Atualizar `.eslintrc.js` para incluir rules customizadas com severity "error"
- [x] T013 Configurar eslint-plugin-local-rules em package.json e .eslintrc.js

**Checkpoint**: ESLint pronto — implementação de user stories pode começar (em paralelo, se possível)

---

## Fase 3: User Story 1 - Configurar Sistema de Tokens Base (Priority: P1) 🎯 MVP

**Objetivo**: Criar tokens completos de design (Fira fonts, cyan/gray colors, large radius, compact spacing, animations, shadows)

**Teste Independente**: Importar tokens e verificar valores específicos (Fira Sans/Code, cores cyan/gray, radius large, spacing compacto)

### Implementação para User Story 1

- [x] T014 [P] [US1] Criar arquivo `src/design-system/tokens/colors.ts` com paletas gray (chumbo) e cyan + tokens Shadcn + topbar customizados
- [x] T015 [P] [US1] Criar arquivo `src/design-system/tokens/typography.ts` com families (Fira Sans/Code), weights, sizes, lineHeights
- [x] T016 [P] [US1] Criar arquivo `src/design-system/tokens/spacing.ts` com escala compacta (xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32)
- [x] T017 [P] [US1] Criar arquivo `src/design-system/tokens/radii.ts` com escala large (none: 0, sm: 8, md: 12, lg: 16, xl: 24, full: 9999)
- [x] T018 [P] [US1] Criar arquivo `src/design-system/tokens/animations.ts` com durations (fast: 150, normal: 300, slow: 500) e easings
- [x] T019 [P] [US1] Criar arquivo `src/design-system/tokens/shadows.ts` com elevation levels (none, sm, md, lg, xl)
- [x] T020 [US1] Criar arquivo `src/design-system/tokens/index.ts` com barrel export de todos os tokens
- [x] T021 [US1] Criar testes em `tests/design-system/tokens/colors.test.ts` validando paleta cyan/gray e tokens Shadcn/topbar
- [x] T022 [US1] Criar testes em `tests/design-system/tokens/typography.test.ts` validando Fira Sans/Code families
- [x] T023 [US1] Criar testes em `tests/design-system/tokens/spacing.test.ts` validando valores compactos
- [x] T024 [US1] Criar testes em `tests/design-system/tokens/radii.test.ts` validando large radius padrão

**Checkpoint**: Tokens completos e testados — foundation pronta para themes e componentes

---

## Fase 4: User Story 3 - Implementar Dark e Light Themes (Priority: P1)

**Objetivo**: Criar theme provider com suporte a dark (padrão) e light themes usando tokens cyan/gray

**Teste Independente**: Testar theme provider renderizando em dark default, alternando para light, verificando persistência

### Implementação para User Story 3

- [x] T025 [P] [US3] Criar arquivo `src/design-system/theme/theme.ts` com objetos darkTheme e lightTheme usando tokens cyan/gray
- [x] T026 [US3] Criar arquivo `src/design-system/theme/ThemeProvider.tsx` com Context provider, font loading (expo-font), AsyncStorage persistence, splash screen management
- [x] T027 [P] [US3] Criar arquivo `src/design-system/theme/useTheme.ts` com hook consumindo ThemeContext
- [x] T028 [P] [US3] Criar arquivo `src/design-system/theme/index.ts` com barrel export
- [ ] T029 [US3] Criar testes em `tests/design-system/theme/theme.test.ts` validando dark/light theme values
- [ ] T030 [US3] Criar testes em `tests/design-system/theme/ThemeProvider.test.tsx` validando dark default, theme switching, persistência

**Checkpoint**: Theme system funcional com dark default e light theme alternável

---

## Fase 5: User Story 2 - Criar Componentes Atoms do Design System (Priority: P1)

**Objetivo**: Implementar atoms (Button, Input, Label, Badge, Icon, Card) usando tokens, large radius, compact spacing, Fira fonts

**Teste Independente**: Renderizar atoms no Storybook verificando Fira fonts, cyan/gray colors, large radius, compact spacing

### Implementação para User Story 2

- [ ] T031 [P] [US2] Criar atom Button em `src/design-system/atoms/Button/Button.tsx` com variants Shadcn (default, destructive, outline, ghost, link) e sizes (sm, md, lg, icon)
- [ ] T032 [P] [US2] Criar styles `src/design-system/atoms/Button/Button.styles.ts` usando tokens (zero hard-coded)
- [ ] T033 [P] [US2] Criar types `src/design-system/atoms/Button/Button.types.ts` com ButtonProps interface
- [ ] T034 [P] [US2] Criar stories `src/design-system/atoms/Button/Button.stories.tsx` com todas variants/sizes
- [ ] T035 [P] [US2] Criar testes `tests/design-system/atoms/Button.test.tsx` validando variants, states (disabled, loading)
- [ ] T036 [P] [US2] Criar atom Input em `src/design-system/atoms/Input/Input.tsx` com states (default, focus, error, disabled)
- [ ] T037 [P] [US2] Criar styles `src/design-system/atoms/Input/Input.styles.ts` usando tokens
- [ ] T038 [P] [US2] Criar types `src/design-system/atoms/Input/Input.types.ts` com InputProps interface
- [ ] T039 [P] [US2] Criar stories `src/design-system/atoms/Input/Input.stories.tsx` com todos states
- [ ] T040 [P] [US2] Criar testes `tests/design-system/atoms/Input.test.tsx` validando states e error handling
- [ ] T041 [P] [US2] Criar atom Label em `src/design-system/atoms/Label/Label.tsx` com suporte a required/disabled
- [ ] T042 [P] [US2] Criar styles `src/design-system/atoms/Label/Label.styles.ts` usando typography tokens
- [ ] T043 [P] [US2] Criar types `src/design-system/atoms/Label/Label.types.ts`
- [ ] T044 [P] [US2] Criar stories `src/design-system/atoms/Label/Label.stories.tsx`
- [ ] T045 [P] [US2] Criar atom Badge em `src/design-system/atoms/Badge/Badge.tsx` com variants (default, secondary, destructive, outline)
- [ ] T046 [P] [US2] Criar styles `src/design-system/atoms/Badge/Badge.styles.ts` usando xl radius
- [ ] T047 [P] [US2] Criar types `src/design-system/atoms/Badge/Badge.types.ts`
- [ ] T048 [P] [US2] Criar stories `src/design-system/atoms/Badge/Badge.stories.tsx`
- [ ] T049 [P] [US2] Criar atom Icon em `src/design-system/atoms/Icon/Icon.tsx` como wrapper para lucide-react-native
- [ ] T050 [P] [US2] Criar types `src/design-system/atoms/Icon/Icon.types.ts` com IconProps interface
- [ ] T051 [P] [US2] Criar stories `src/design-system/atoms/Icon/Icon.stories.tsx` com ícones comuns
- [ ] T052 [P] [US2] Criar componentes Card atoms em `src/design-system/atoms/Card/` (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [ ] T053 [P] [US2] Criar styles `src/design-system/atoms/Card/Card.styles.ts` usando large radius
- [ ] T054 [P] [US2] Criar types `src/design-system/atoms/Card/Card.types.ts`
- [ ] T055 [P] [US2] Criar stories `src/design-system/atoms/Card/Card.stories.tsx` com composição completa
- [ ] T056 [US2] Criar arquivo `src/design-system/atoms/index.ts` com barrel export de todos atoms

**Checkpoint**: Atoms completos e documentados no Storybook — blocos fundamentais prontos

---

## Fase 6: User Story 4 - Estruturar Atomic Design Architecture (Priority: P1)

**Objetivo**: Criar estrutura de pastas completa e metadata de componentes seguindo hierarquia Atomic Design

**Teste Independente**: Verificar estrutura de pastas e que ESLint detecta violações de hierarquia

### Implementação para User Story 4

- [ ] T057 [P] [US4] Criar pastas vazias: `src/design-system/molecules/`, `src/design-system/organisms/`, `src/design-system/templates/`, `src/design-system/pages/`
- [ ] T058 [P] [US4] Criar arquivo `src/design-system/utils/cn.ts` com classnames utility (se necessário)
- [ ] T059 [P] [US4] Criar arquivo `src/design-system/utils/index.ts` com barrel export
- [ ] T060 [US4] Criar arquivo `src/design-system/index.ts` com barrel export completo do DS (tokens, theme, atoms, molecules, organisms, templates, utils)
- [ ] T061 [US4] Criar documentação `src/design-system/README.md` explicando Atomic Design hierarchy, import rules, quando criar atom vs molecule vs organism
- [ ] T062 [US4] Validar que ESLint detecta violações de hierarquia (testar import de molecule em atom, etc)

**Checkpoint**: Estrutura Atomic Design completa e enforçada por ESLint

---

## Fase 7: User Story 5 - Configurar Storybook para Documentação Visual (Priority: P1)

**Objetivo**: Configurar Storybook React Native mostrando atoms com theme switching

**Teste Independente**: Acessar Storybook, navegar atoms, alternar dark/light theme, modificar props via controles

### Implementação para User Story 5

- [ ] T063 [US5] Executar `npx storybook@latest init --type react_native` para setup inicial
- [ ] T064 [US5] Criar arquivo `.storybook/main.ts` com configuração de stories paths (atoms, molecules, organisms, templates)
- [ ] T065 [US5] Criar arquivo `.storybook/preview.tsx` com ThemeProvider wrapper global
- [ ] T066 [US5] Criar arquivo `.storybook/theme.ts` customizando Storybook UI com cores do DS
- [ ] T067 [US5] Configurar theme switcher toolbar addon em `.storybook/preview.tsx`
- [ ] T068 [US5] Adicionar script `"storybook": "storybook dev"` em package.json
- [ ] T069 [US5] Testar Storybook abrindo in-app e verificando stories de atoms renderizando com Fira fonts, large radius, spacing compacto
- [ ] T070 [US5] Validar alternância de theme (dark ↔ light) via toolbar

**Checkpoint**: Storybook funcional com atoms documentados e theme switching

---

## Fase 8: User Story 7 - Criar Molecules e Organisms (Priority: P2)

**Objetivo**: Criar molecules (FormField, SearchBar) e organisms (Navbar com topbar tokens, ShoppingListCard) compostos de atoms

**Teste Independente**: Renderizar molecules/organisms no Storybook verificando composição correta de atoms

### Implementação para User Story 7

- [ ] T071 [P] [US7] Criar molecule FormField em `src/design-system/molecules/FormField/FormField.tsx` compondo Label + Input atoms
- [ ] T072 [P] [US7] Criar styles `src/design-system/molecules/FormField/FormField.styles.ts` com spacing compacto
- [ ] T073 [P] [US7] Criar types `src/design-system/molecules/FormField/FormField.types.ts`
- [ ] T074 [P] [US7] Criar stories `src/design-system/molecules/FormField/FormField.stories.tsx`
- [ ] T075 [P] [US7] Criar molecule SearchBar em `src/design-system/molecules/SearchBar/SearchBar.tsx` compondo Input + Icon atoms
- [ ] T076 [P] [US7] Criar styles `src/design-system/molecules/SearchBar/SearchBar.styles.ts`
- [ ] T077 [P] [US7] Criar types `src/design-system/molecules/SearchBar/SearchBar.types.ts`
- [ ] T078 [P] [US7] Criar stories `src/design-system/molecules/SearchBar/SearchBar.stories.tsx`
- [ ] T079 [US7] Criar arquivo `src/design-system/molecules/index.ts` com barrel export
- [ ] T080 [P] [US7] Criar organism Navbar em `src/design-system/organisms/Navbar/Navbar.tsx` usando tokens customizados topbar (topbar, topbar-foreground, topbar-primary, topbar-accent, topbar-border, topbar-ring)
- [ ] T081 [P] [US7] Criar styles `src/design-system/organisms/Navbar/Navbar.styles.ts` com topbar tokens
- [ ] T082 [P] [US7] Criar types `src/design-system/organisms/Navbar/Navbar.types.ts`
- [ ] T083 [P] [US7] Criar stories `src/design-system/organisms/Navbar/Navbar.stories.tsx`
- [ ] T084 [P] [US7] Criar organism ShoppingListCard em `src/design-system/organisms/ShoppingListCard/ShoppingListCard.tsx` compondo Card, Badge, Icon atoms
- [ ] T085 [P] [US7] Criar styles `src/design-system/organisms/ShoppingListCard/ShoppingListCard.styles.ts`
- [ ] T086 [P] [US7] Criar types `src/design-system/organisms/ShoppingListCard/ShoppingListCard.types.ts`
- [ ] T087 [P] [US7] Criar stories `src/design-system/organisms/ShoppingListCard/ShoppingListCard.stories.tsx`
- [ ] T088 [US7] Criar arquivo `src/design-system/organisms/index.ts` com barrel export
- [ ] T089 [US7] Validar no Storybook que molecules importam apenas atoms e organisms importam atoms + molecules (compliance ESLint)

**Checkpoint**: Molecules e organisms completos e documentados no Storybook

---

## Fase 9: User Story 8 - Implementar Sistema de Animações e Transições (Priority: P2)

**Objetivo**: Criar biblioteca de animações reutilizáveis e aplicar em componentes-chave com React Native Reanimated

**Teste Independente**: Testar animações em Button press, modal open/close, navegação verificando 60fps e reduced motion support

### Implementação para User Story 8

- [ ] T090 [P] [US8] Criar arquivo `src/design-system/utils/animations/useButtonAnimation.ts` com hook para feedback visual de Button press
- [ ] T091 [P] [US8] Criar arquivo `src/design-system/utils/animations/useModalAnimation.ts` com hook para modal slide + fade (usando Reanimated)
- [ ] T092 [P] [US8] Criar arquivo `src/design-system/utils/animations/useReducedMotion.ts` com hook detectando preferência reduced motion
- [ ] T093 [US8] Integrar useButtonAnimation em Button atom (`src/design-system/atoms/Button/Button.tsx`)
- [ ] T094 [US8] Atualizar stories de Button para demonstrar animação de press
- [ ] T095 [US8] Criar exemplo de modal animado em Storybook usando useModalAnimation
- [ ] T096 [US8] Testar que animações respeitam reduced motion preference (desabilitam quando ativo)
- [ ] T097 [US8] Validar performance com React DevTools verificando 60fps em animações

**Checkpoint**: Sistema de animações funcional com suporte a reduced motion

---

## Fase 10: User Story 6 - Estabelecer Coexistência entre Design Systems (Priority: P1)

**Objetivo**: Estabelecer coexistência controlada entre DS legado e novo DS, permitindo desenvolvimento incremental

**Teste Independente**: Verificar que ambos DS funcionam simultaneamente, imports corretos, sem conflitos

### Implementação para User Story 6

- [ ] T098 [US6] Criar documentação em `src/design-system/README.md` explicando estratégia de coexistência (quando usar DS legado vs novo DS)
- [ ] T099 [US6] Adicionar seção em `src/design-system/README.md` com guidelines: "Componentes existentes usam `@legacy-design-system/*`, novos componentes usam `@design-system/*`"
- [ ] T100 [US6] Adicionar exemplos na documentação mostrando imports corretos para ambos DS
- [ ] T101 [US6] Executar `npm test` para validar que ambos DS funcionam sem conflitos
- [ ] T102 [US6] Executar `npm run build` para validar que path aliases estão configurados corretamente
- [ ] T103 [US6] Criar teste de smoke em `tests/design-system/coexistence.test.ts` verificando que imports de ambos DS funcionam simultaneamente

**Checkpoint**: Coexistência estabelecida, documentação clara, ambos DS funcionais sem conflitos

---

## Fase 11: User Story 11 - Documentar Design System (Priority: P2)

**Objetivo**: Criar documentação completa (README.md) sobre tokens, Atomic Design, componentes, guidelines, decisões de design

**Teste Independente**: Novo desenvolvedor segue documentação do zero para criar componente e usar DS

### Implementação para User Story 11

- [ ] T111 [P] [US11] Expandir `src/design-system/README.md` com seção "Por que Fira Sans/Code" (brand identity, legibilidade)
- [ ] T112 [P] [US11] Adicionar seção "Por que cyan theme e gray chumbo base" (paleta moderna, contraste)
- [ ] T113 [P] [US11] Adicionar seção "Por que large radius" (visual moderno, friendly)
- [ ] T114 [P] [US11] Adicionar seção "Por que spacing compacto" (densidade de informação, menos atrito)
- [ ] T115 [P] [US11] Adicionar seção "Tokens customizados topbar" com exemplos de uso
- [ ] T116 [P] [US11] Adicionar seção "Dark theme como padrão" (preferência de design, conforto visual)
- [ ] T117 [P] [US11] Adicionar guidelines "Quando criar atom vs molecule vs organism" com exemplos práticos
- [ ] T118 [P] [US11] Adicionar seção "Import rules e hierarquia Atomic Design" com exemplos de código correto/incorreto
- [ ] T119 [P] [US11] Adicionar seção "Como usar theme switching" com código de exemplo
- [ ] T120 [P] [US11] Adicionar seção "Acessibilidade" (contraste WCAG AA, touch targets, reduced motion)
- [ ] T121 [US11] Criar guia de contribuição em `src/design-system/CONTRIBUTING.md` explicando como adicionar novos componentes
- [ ] T122 [US11] Pedir feedback de desenvolvedor novo seguindo documentação para criar componente teste

**Checkpoint**: Documentação completa e validada por onboarding real

---

## Fase 12: User Story 9 - Criar CLI para Scaffolding de Componentes (Priority: P3)

**Objetivo**: Implementar CLI que gera boilerplate de componentes seguindo Atomic Design e padrões do DS

**Teste Independente**: Executar comandos CLI (generate atom/molecule/organism) e verificar código gerado segue padrões

### Implementação para User Story 9

- [ ] T123 [P] [US9] Criar arquivo `scripts/ds-cli/templates/atom.template.tsx` com template de atom
- [ ] T124 [P] [US9] Criar arquivo `scripts/ds-cli/templates/atom.styles.template.ts` com template de styles
- [ ] T125 [P] [US9] Criar arquivo `scripts/ds-cli/templates/atom.types.template.ts` com template de types
- [ ] T126 [P] [US9] Criar arquivo `scripts/ds-cli/templates/atom.stories.template.tsx` com template de stories
- [ ] T127 [P] [US9] Criar arquivo `scripts/ds-cli/templates/atom.test.template.tsx` com template de testes
- [ ] T128 [P] [US9] Criar templates similares para molecule e organism
- [ ] T129 [US9] Criar arquivo `scripts/ds-cli/generate.ts` com lógica de geração (ler template, substituir placeholders, criar arquivos)
- [ ] T130 [US9] Criar arquivo `scripts/ds-cli/index.ts` com CLI interface (commander.js ou similar)
- [ ] T131 [US9] Adicionar comandos: `ds generate atom <name>`, `ds generate molecule <name>`, `ds generate organism <name>`
- [ ] T132 [US9] Adicionar flag `--with-story` para incluir arquivo .stories.tsx
- [ ] T133 [US9] Adicionar comando `ds --help` com documentação de comandos
- [ ] T134 [US9] Adicionar script em package.json: `"ds": "tsx scripts/ds-cli/index.ts"`
- [ ] T135 [US9] Testar `npm run ds generate atom TestButton` e verificar arquivos criados seguem convenções
- [ ] T136 [US9] Validar que código gerado passa em ESLint rules (usa tokens, hierarquia correta)

**Checkpoint**: CLI funcional gerando componentes seguindo padrões do DS

---

## Fase 13: Polish & Cross-Cutting Concerns

**Propósito**: Melhorias finais, validação e otimizações cross-story

- [ ] T137 [P] Executar bundle size analysis com react-native-bundle-visualizer verificando impacto do DS (~415KB esperado)
- [ ] T138 [P] Validar que fonts Fira Sans/Code são carregadas com splash screen persistence
- [ ] T139 [P] Testar app em iOS verificando rendering correto de todos os componentes
- [ ] T140 [P] Testar app em Android verificando rendering correto de todos os componentes
- [ ] T141 [P] Validar contraste WCAG AA em dark theme (cyan/gray)
- [ ] T142 [P] Validar contraste WCAG AA em light theme (cyan/gray)
- [ ] T143 [P] Verificar touch targets mínimos 44x44px mesmo com spacing compacto
- [ ] T144 [P] Testar reduced motion preference funcionando (animações desabilitadas)
- [ ] T145 Executar todos os testes do DS: `npm test tests/design-system/`
- [ ] T146 Executar linting completo: `npm run lint` verificando zero warnings (política do projeto)
- [ ] T147 Validar quickstart.md seguindo passo a passo para criar componente
- [ ] T148 Criar screenshots de Storybook (atoms, molecules, organisms) em dark/light themes para documentação
- [ ] T149 [P] Otimizar imports de Lucide icons para tree-shaking máximo
- [ ] T150 [P] Verificar que nenhum token tem valor hard-coded (auditoria final)
- [ ] T151 Atualizar README.md principal do projeto mencionando novo Design System
- [ ] T152 Criar PR summary documentando mudanças: novo DS, migração completa, remoção do DS antigo

---

## Dependências & Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Sem dependências — pode iniciar imediatamente
- **Fundacional (Fase 2)**: Depende da conclusão do Setup — BLOQUEIA todas as user stories
- **User Stories (Fase 3+)**: Todas dependem da conclusão da fase Fundacional
  - **US1 (Tokens)** → BLOQUEIA US2, US3, US7, US8 (todos dependem de tokens)
  - **US3 (Themes)** → Depende de US1
  - **US2 (Atoms)** → Depende de US1 e US3
  - **US4 (Atomic Design Structure)** → Pode rodar em paralelo com US1-3
  - **US5 (Storybook)** → Depende de US2 (precisa de atoms para documentar)
  - **US7 (Molecules/Organisms)** → Depende de US2 (compõe atoms)
  - **US8 (Animações)** → Depende de US2 (integra com atoms)
  - **US6 (Migração)** → Depende de US2, US7 (precisa de atoms e organisms prontos)
  - **US11 (Documentação)** → Depende de todas anteriores estarem completas
  - **US9 (CLI)** → Depende de padrões maduros (pode rodar após US2, US7)
- **Polish (Fase 13)**: Depende das user stories desejadas estarem concluídas

### User Story Dependencies

- **User Story 1 (P1) - Tokens**: Pode começar após fase Fundacional — BLOQUEIA todas outras stories
- **User Story 3 (P1) - Themes**: Pode começar após US1 concluída
- **User Story 2 (P1) - Atoms**: Pode começar após US1 e US3 concluídas
- **User Story 4 (P1) - Atomic Design Structure**: Pode rodar em paralelo com US1-3
- **User Story 5 (P1) - Storybook**: Pode começar após US2 concluída
- **User Story 7 (P2) - Molecules/Organisms**: Pode começar após US2 concluída
- **User Story 8 (P2) - Animações**: Pode começar após US2 concluída
- **User Story 6 (P1) - Coexistência**: Pode começar após US2 concluída (setup básico de documentação)
- **User Story 11 (P2) - Documentação**: Pode começar após US6 concluída (expande documentação de coexistência)
- **User Story 9 (P3) - CLI**: Pode começar após US2 e US7 concluídas (padrões maduros)

### Within Each User Story

- Tokens (US1): Todos os arquivos em paralelo [P]
- Themes (US3): theme.ts antes de ThemeProvider.tsx, hooks em paralelo
- Atoms (US2): Todos os atoms podem ser implementados em paralelo [P]
- Molecules/Organisms (US7): Molecules em paralelo, organisms em paralelo
- Animações (US8): Hooks em paralelo, integração sequencial
- Coexistência (US6): Tarefas de documentação podem ser feitas em paralelo [P], testes ao final

### Parallel Opportunities

- **Fase 1 (Setup)**: T001-T004 sequenciais (renaming), T005-T008 paralelos [P]
- **Fase 2 (Fundacional)**: T009-T011 paralelos [P], T012-T013 sequenciais
- **US1 (Tokens)**: T014-T019 todos paralelos [P], testes T021-T024 paralelos
- **US3 (Themes)**: theme.ts e useTheme.ts paralelos [P]
- **US2 (Atoms)**: Cada atom (Button, Input, Label, Badge, Icon, Card) paralelo [P]
- **US7 (Molecules/Organisms)**: FormField e SearchBar paralelos, Navbar e ShoppingListCard paralelos
- **US8 (Animações)**: Todos os hooks paralelos [P]
- **US6 (Coexistência)**: T098-T100 paralelos [P] (documentação), T101-T103 sequenciais (testes)
- **US9 (CLI)**: Templates paralelos [P], T123-T128
- **US11 (Documentação)**: T111-T120 paralelos [P]
- **Polish**: T137-T144 e T149-T150 paralelos [P]

---

## Exemplo de Paralelismo: User Story 2 (Atoms)

```bash
# Implementar todos os atoms em paralelo (arquivos independentes):
T031: Button.tsx
T036: Input.tsx
T041: Label.tsx
T045: Badge.tsx
T049: Icon.tsx
T052: Card components

# Cada atom pode ter suas tarefas (tsx, styles, types, stories) em paralelo:
Button: T031 [P], T032 [P], T033 [P], T034 [P] → todos juntos
Input: T036 [P], T037 [P], T038 [P], T039 [P] → todos juntos
...
```

---

## Estratégia de Implementação

### MVP Primeiro (Core do DS)

1. Concluir Fase 1: Setup
2. Concluir Fase 2: Fundacional (ESLint rules - CRÍTICO)
3. Concluir Fase 3: User Story 1 (Tokens - BLOQUEIA tudo)
4. Concluir Fase 4: User Story 3 (Themes - depende de tokens)
5. Concluir Fase 5: User Story 2 (Atoms - depende de tokens + themes)
6. Concluir Fase 6: User Story 4 (Atomic Design Structure)
7. Concluir Fase 7: User Story 5 (Storybook - depende de atoms)
8. **PARAR E VALIDAR**: Storybook funcional com atoms em dark/light themes
9. Este é o MVP do Design System - base funcional pronta

### Entrega Incremental

1. **MVP (Fases 1-7)**: Tokens + Themes + Atoms + Storybook → validar visualmente
2. **Fase 8**: User Story 7 → adicionar Molecules/Organisms → testar composição
3. **Fase 9**: User Story 8 → adicionar Animações → validar UX
4. **Fase 10**: User Story 6 → Estabelecer Coexistência → documentar estratégia
5. **Fase 11**: User Story 11 → Documentar → validar onboarding
6. **Fase 12**: User Story 9 → CLI → facilitar desenvolvimento futuro
7. **Fase 13**: Polish → otimizações finais

### Parallel Team Strategy

Com múltiplas pessoas:

1. **Time conclui Setup + Fundacional junto** (T001-T013)
2. **Após Fundacional**:
   - Pessoa A: US1 (Tokens - T014-T024) — CRÍTICO, bloqueia todos
3. **Após US1**:
   - Pessoa A: US3 (Themes - T025-T030)
   - Pessoa B: US4 (Atomic Design Structure - T057-T062) — em paralelo
4. **Após US3**:
   - Pessoa A: US2 Atoms parte 1 (Button, Input - T031-T040)
   - Pessoa B: US2 Atoms parte 2 (Label, Badge - T041-T048)
   - Pessoa C: US2 Atoms parte 3 (Icon, Card - T049-T056)
5. **Após US2**:
   - Pessoa A: US5 (Storybook - T063-T070)
   - Pessoa B: US7 (Molecules - T071-T079)
   - Pessoa C: US8 (Animações - T090-T097)
6. **Após US7**:
   - Pessoa A: US7 (Organisms - T080-T089)
   - Pessoa B: US6 (Coexistência - T098-T103)
   - Pessoa C: US9 (CLI - T123-T136)
7. **Finalizações paralelas**:
   - Pessoa A: US11 (Documentação - T111-T122)
   - Pessoa B: Polish parte 1 (T137-T144)
   - Pessoa C: Polish parte 2 (T145-T152)

---

## Notas

- [P] = tarefas em arquivos diferentes, sem dependências — podem rodar em paralelo
- [Story] = label que mapeia a tarefa para uma user story (rastreabilidade)
- **User Story 10 (Testes Visuais com Screenshots)** foi OMITIDA conforme solicitado
- Cada user story deve ser completável e testável de forma independente
- Design System é infraestrutura pura — foco em testes de componentes, não de negócio
- Faça commit após cada tarefa ou grupo lógico
- Pare em checkpoints para validar independentemente
- ESLint enforça arquitetura — confie nas rules customizadas
- Dark theme é padrão fixo inicial — não detecta system preference
- Coexistência entre DS legado e novo DS permite desenvolvimento incremental sem breaking changes

---

## Resumo de Tarefas

**Total de Tarefas**: 145

**Por User Story**:
- Setup (Fase 1): 8 tarefas
- Fundacional (Fase 2): 5 tarefas
- US1 (Tokens): 11 tarefas
- US3 (Themes): 6 tarefas
- US2 (Atoms): 26 tarefas
- US4 (Atomic Design): 6 tarefas
- US5 (Storybook): 8 tarefas
- US7 (Molecules/Organisms): 19 tarefas
- US8 (Animações): 8 tarefas
- US6 (Coexistência): 6 tarefas
- US11 (Documentação): 12 tarefas
- US9 (CLI): 14 tarefas
- Polish (Fase 13): 16 tarefas

**Oportunidades de Paralelismo**:
- Setup: 4 tarefas paralelas
- Fundacional: 3 tarefas paralelas
- US1: 6 tokens + 4 testes paralelos
- US2: 6 atoms completos paralelos (cada atom com ~5 subtarefas)
- US7: 2 molecules + 2 organisms paralelos
- US11: 10 seções de documentação paralelas
- Polish: ~12 tarefas de validação paralelas

**MVP Scope (Recomendado)**:
- Fases 1-7 (T001-T070): Setup + Fundacional + US1 + US3 + US2 + US4 + US5
- Total: ~70 tarefas
- Entrega: Tokens completos, Themes dark/light, Atoms funcionais, Storybook documentado
- Validação: Design System base pronto para uso

**Path to Production**:
1. MVP (Fases 1-7): 70 tarefas → DS base funcional
2. Molecules/Organisms + Animações (Fases 8-9): +27 tarefas → componentes complexos
3. Coexistência (Fase 10): +6 tarefas → estratégia de adoção gradual documentada
4. Documentação + CLI (Fases 11-12): +26 tarefas → developer experience
5. Polish (Fase 13): +16 tarefas → otimizações finais

**Validação de Formato**: ✅ Todas as 145 tarefas seguem formato: `- [ ] [ID] [P?] [Story?] Descrição com file path`

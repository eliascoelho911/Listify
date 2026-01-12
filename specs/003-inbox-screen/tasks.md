# Tarefas: Inbox Screen

**Versão alvo**: MVP
**Input**: Documentos de design em `/specs/003-inbox-screen/`
**Pré-requisitos**: plan.md, spec.md, research.md, data-model.md, contracts/

**Testes**: Testes MUST acompanhar novos requisitos de negócio/novos use cases:
- Testes de unidade para regras de domínio (use cases, value objects)
- Testes de integração para mappers SQLite
- Testes para DI container
- Testes para componentes do Design System

**Stories**: TODOS os componentes criados MUST ter stories com todos os casos de uso.

**Organização**: Tarefas são agrupadas por user story para permitir implementação e validação independentes.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a tarefa pertence (ex.: US1, US2, US3)
- Paths exatos incluídos nos textos das tarefas

---

## Fase 1: Setup (Infra Compartilhada)

**Propósito**: Instalação de dependências e estrutura inicial do projeto

- [X] T001 Instalar dependências: `npx expo install @shopify/flash-list @react-navigation/drawer react-native-reanimated`
- [X] T002 [P] Criar estrutura de diretórios do domínio inbox em src/domain/inbox/
- [X] T003 [P] Criar estrutura de diretórios de data inbox em src/data/inbox/mappers/
- [X] T004 [P] Criar estrutura de diretórios de componentes em src/presentation/components/inbox/
- [X] T005 [P] Criar estrutura de diretórios de state em src/presentation/state/inbox/

---

## Fase 2: Fundacional (Pré-requisitos Bloqueantes)

**Propósito**: Domínio core, infraestrutura SQLite e DI que MUST estar prontos antes de QUALQUER user story

**⚠️ CRÍTICO**: Nenhuma user story começa até esta fase estar concluída

### Entidades e Types

- [X] T006 [P] Criar entity Tag em src/domain/inbox/entities/Tag.ts conforme contracts/entities.ts
- [X] T007 [P] Criar entity UserInput em src/domain/inbox/entities/UserInput.ts conforme contracts/entities.ts
- [X] T008 [P] Criar types PaginatedUserInputs e DateGroup em src/domain/inbox/entities/types.ts
- [X] T009 [P] Criar barrel export em src/domain/inbox/entities/index.ts
- [X] T010 [P] Criar value object TagName em src/domain/inbox/value-objects/TagName.ts com validação (max 30 chars, lowercase, regex)
- [X] T011 Criar teste para TagName em tests/domain/inbox/TagName.test.ts

### Constants e Errors

- [X] T012 [P] Criar constants em src/domain/inbox/constants.ts (MAX_TEXT_LENGTH, MAX_TAG_LENGTH, DEFAULT_PAGE_SIZE, TAG_REGEX)
- [X] T013 [P] Criar domain errors em src/domain/inbox/use-cases/errors.ts conforme contracts/use-cases.ts (EmptyTextError, TextTooLongError, UserInputNotFoundError, InvalidTagNameError)

### Repository Port

- [X] T014 Criar interface InboxRepository em src/domain/inbox/ports/InboxRepository.ts conforme contracts/InboxRepository.ts

### Migration SQLite

- [X] T015 Criar Migration #2 (0002_inbox) em src/infra/storage/sqlite/migrations/index.ts com tabelas user_inputs, tags, input_tags

### Mappers (Data Layer)

- [X] T016 [P] Criar SQLite row types em src/data/inbox/mappers/types.ts (UserInputRow, TagRow, InputTagRow)
- [X] T017 Criar mappers em src/data/inbox/mappers/sqliteMappers.ts (mapUserInputRowToEntity, mapTagRowToEntity, mapEntityToRow)
- [X] T018 Criar teste para mappers em tests/data/inbox/sqliteMappers.test.ts

### Repository Implementation

- [X] T019 Implementar InboxSqliteRepo em src/infra/storage/sqlite/InboxSqliteRepo.ts seguindo padrão do ShoppingSqliteRepo
- [X] T019b Criar teste de integração para InboxSqliteRepo em tests/infra/storage/sqlite/InboxSqliteRepo.test.ts

### DI Container

- [X] T020 [P] Adicionar InboxRepository type em src/app/di/types.ts
- [X] T021 Atualizar container em src/app/di/container.ts para criar InboxSqliteRepo
- [X] T022 Criar AppDependenciesProvider em src/app/di/AppDependenciesProvider.tsx com loading/error states
- [X] T023 Criar hook useInboxRepository em src/app/di/AppDependenciesProvider.tsx

### Testes DI

- [X] T024 [P] Criar estrutura de testes DI em tests/app/di/
- [X] T025 [P] Criar teste para AppDependenciesProvider em tests/app/di/AppDependenciesProvider.test.tsx
- [X] T026 Criar teste para container (buildDependencies) em tests/app/di/container.test.ts

### i18n (Adicionar ao common.json existente)

- [X] T027 [P] Adicionar chaves inbox.* em src/app/i18n/locale/pt-BR/common.json
- [X] T028 [P] Adicionar chaves inbox.* em src/app/i18n/locale/en/common.json

### Use Cases Core

- [X] T029 Criar função extractTags (pure function) em src/domain/inbox/use-cases/extractTags.ts
- [X] T030 Criar teste para extractTags em tests/domain/inbox/extractTags.test.ts

**Checkpoint**: Base pronta — implementação de user stories pode começar

---

## Fase 3: User Story 1 - Registrar novo input de texto (Priority: P1) 🎯 MVP

**Objetivo**: Permitir ao usuário criar inputs via bottombar com suporte a tags

**Teste Independente**: Abrir app, digitar texto na bottombar, pressionar enviar, verificar input na lista

### Design System - InputBar Molecule

> **InputBar**: Molecule que combina Input + IconButton para entrada de dados com ação de envio. Reutilizável em qualquer contexto que precise de input com botão de ação.

- [X] T031 [US1] Criar InputBar molecule via CLI: `npm run ds generate molecule InputBar`
- [X] T032 [US1] Implementar InputBar.types.ts com props: placeholder, value, onChangeText, onSubmit, isSubmitting, disabled, submitIcon
- [X] T033 [US1] Implementar InputBar.styles.ts usando tokens do theme (Input + IconButton layout)
- [X] T034 [US1] Implementar InputBar.tsx combinando Input atom + IconButton atom
- [X] T035 [US1] Criar InputBar.stories.tsx com casos: Default, WithValue, Submitting, Disabled, CustomIcon
- [X] T036 [US1] Criar teste InputBar em tests/design-system/molecules/InputBar.test.tsx

### Design System - SuggestionsPopUp Molecule

> **SuggestionsPopUp**: Molecule inspirada no Command do Shadcn para exibir lista de sugestões acima de um input. Pode ser usada para autocomplete de tags, comandos, etc.

- [X] T037 [US1] Criar SuggestionsPopUp molecule via CLI: `npm run ds generate molecule SuggestionsPopUp`
- [X] T038 [US1] Implementar SuggestionsPopUp.types.ts com props: items[], onSelect, visible, position, renderItem?, emptyMessage
- [X] T039 [US1] Implementar SuggestionsPopUp.styles.ts usando tokens (Card-like container, list items)
- [X] T040 [US1] Implementar SuggestionsPopUp.tsx com FlatList de sugestões e animação de entrada
- [X] T041 [US1] Criar SuggestionsPopUp.stories.tsx com casos: Default, Empty, Loading, ManyItems, CustomRender
- [X] T042 [US1] Criar teste SuggestionsPopUp em tests/design-system/molecules/SuggestionsPopUp.test.tsx

### Testes para User Story 1 ⚠️

- [X] T043 [P] [US1] Criar teste CreateUserInput em tests/domain/inbox/CreateUserInput.test.ts
- [X] T044 [P] [US1] Criar testUtils com factories em tests/domain/inbox/testUtils.ts

### Implementação Use Case

- [X] T045 [US1] Implementar CreateUserInput use case em src/domain/inbox/use-cases/CreateUserInput.ts

### Store (State Management)

- [X] T046 [US1] Criar inboxStore com Zustand em src/presentation/state/inbox/inboxStore.ts (state: inputs, inputText, isSubmitting, tagSuggestions)
- [X] T047 [US1] Criar InboxStoreProvider em src/presentation/state/inbox/InboxStoreProvider.tsx
- [X] T048 [US1] Criar hook useInboxVM em src/presentation/hooks/useInboxVM.ts

### Componentes UI Inbox (usam DS molecules)

- [X] T049 [US1] Criar InboxBottomBar em src/presentation/components/inbox/InboxBottomBar.tsx usando InputBar molecule + lógica de detecção de tags
- [X] T050 [US1] Criar InboxTagSuggestions em src/presentation/components/inbox/InboxTagSuggestions.tsx usando SuggestionsPopUp molecule + dados do store

### Integração na Tela

- [X] T051 [US1] Criar InboxScreen básica em src/presentation/screens/InboxScreen.tsx com InboxBottomBar funcional

**Checkpoint**: User Story 1 funcional - usuário pode criar inputs com tags

---

## Fase 4: User Story 2 - Visualizar histórico de inputs (Priority: P2)

**Objetivo**: Exibir lista de inputs com scroll infinito e agrupamento por data

**Teste Independente**: Criar múltiplos inputs em dias diferentes, verificar agrupamento por data com badges

### Design System - DateBadge Atom

> **DateBadge**: Atom para exibir badges de data como separadores (sticky headers). Variante visual do Badge para contexto temporal.

- [X] T052 [US2] Criar DateBadge atom via CLI: `npm run ds generate atom DateBadge`
- [X] T053 [US2] Implementar DateBadge.types.ts com props: label (string), variant?: 'today' | 'yesterday' | 'default'
- [X] T054 [US2] Implementar DateBadge.styles.ts com estilo de badge de data (muted background, centered)
- [X] T055 [US2] Implementar DateBadge.tsx
- [X] T056 [US2] Criar DateBadge.stories.tsx com casos: Today, Yesterday, OtherDate, AllVariants
- [X] T057 [US2] Criar teste DateBadge em tests/design-system/atoms/DateBadge.test.tsx

### Testes para User Story 2 ⚠️

- [X] T058 [P] [US2] Criar teste GetUserInputs em tests/domain/inbox/GetUserInputs.test.ts
- [X] T059 [P] [US2] Criar teste GetUserInputsGrouped em tests/domain/inbox/GetUserInputsGrouped.test.ts

### Implementação Use Cases

- [X] T060 [US2] Implementar GetUserInputs use case em src/domain/inbox/use-cases/GetUserInputs.ts
- [X] T061 [US2] Implementar GetUserInputsGrouped use case em src/domain/inbox/use-cases/GetUserInputsGrouped.ts (agrupa por data com labels)

### Componentes UI para US2

- [X] T062 [US2] Criar componente UserInputCard em src/presentation/components/inbox/UserInputCard.tsx (text, tags badges, horário)
- [X] T063 [US2] Implementar FlashList com sticky headers (DateBadge) em InboxScreen.tsx
- [X] T064 [US2] Adicionar empty state quando lista vazia em InboxScreen.tsx
- [X] T065 [US2] Implementar scroll infinito (loadMore) no inboxStore e InboxScreen

**Checkpoint**: User Stories 1 e 2 funcionais - criar e visualizar inputs

---

## Fase 5: User Story 3 - Editar e excluir inputs (Priority: P3)

**Objetivo**: Permitir edição e exclusão de inputs existentes com confirmação

**Teste Independente**: Criar input, long press, editar texto/tags, verificar persistência. Excluir input, confirmar remoção.

### Design System - ContextMenu Molecule

> **ContextMenu**: Molecule para menu de opções contextual (long press). Inspirado no DropdownMenu do Shadcn.

- [X] T066 [US3] Criar ContextMenu molecule via CLI: `npm run ds generate molecule ContextMenu`
- [X] T067 [US3] Implementar ContextMenu.types.ts com props: items[], visible, onClose, anchorPosition
- [X] T068 [US3] Implementar ContextMenu.styles.ts usando tokens (Card elevated, list items with icons)
- [X] T069 [US3] Implementar ContextMenu.tsx com overlay + menu posicionado
- [X] T070 [US3] Criar ContextMenu.stories.tsx com casos: Default, WithIcons, Destructive, ManyItems
- [X] T071 [US3] Criar teste ContextMenu em tests/design-system/molecules/ContextMenu.test.tsx

### Design System - AlertDialog Molecule

> **AlertDialog**: Molecule para diálogos de confirmação. Baseado no AlertDialog do Shadcn.

- [X] T072 [US3] Criar AlertDialog molecule via CLI: `npm run ds generate molecule AlertDialog`
- [X] T073 [US3] Implementar AlertDialog.types.ts com props: visible, title, description, confirmLabel, cancelLabel, onConfirm, onCancel, variant
- [X] T074 [US3] Implementar AlertDialog.styles.ts usando tokens (Modal overlay, Card content)
- [X] T075 [US3] Implementar AlertDialog.tsx com Modal + Card + Buttons
- [X] T076 [US3] Criar AlertDialog.stories.tsx com casos: Default, Destructive, Loading, CustomLabels
- [X] T077 [US3] Criar teste AlertDialog em tests/design-system/molecules/AlertDialog.test.tsx

### Testes para User Story 3 ⚠️

- [X] T078 [P] [US3] Criar teste UpdateUserInput em tests/domain/inbox/UpdateUserInput.test.ts
- [X] T079 [P] [US3] Criar teste DeleteUserInput em tests/domain/inbox/DeleteUserInput.test.ts

### Implementação Use Cases

- [X] T080 [US3] Implementar UpdateUserInput use case em src/domain/inbox/use-cases/UpdateUserInput.ts
- [X] T081 [US3] Implementar DeleteUserInput use case em src/domain/inbox/use-cases/DeleteUserInput.ts

### Componentes UI para US3

- [X] T082 [US3] Criar InputOptionsMenu em src/presentation/components/inbox/InputOptionsMenu.tsx usando ContextMenu molecule
- [X] T083 [US3] Criar DeleteConfirmDialog em src/presentation/components/inbox/DeleteConfirmDialog.tsx usando AlertDialog molecule
- [X] T084 [US3] Adicionar long press handler no UserInputCard para abrir InputOptionsMenu
- [X] T085 [US3] Implementar modo de edição na InputBar: carregar texto/tags do input selecionado, indicador visual de edição, botão cancelar, diálogo de confirmação se houver rascunho
- [X] T086 [US3] Adicionar actions update/delete no inboxStore com optimistic updates

**Checkpoint**: User Stories 1, 2 e 3 funcionais - CRUD completo de inputs

---

## Fase 6: User Story 4 - Navegar pela interface do Inbox (Priority: P4)

**Objetivo**: Estrutura visual completa com toolbar, sidebar (drawer) e navegação

**Teste Independente**: Tocar no ícone menu, sidebar abre. Tocar fora, sidebar fecha. Logo visível.

### Design System - Logo Atom

- [X] T087 [US4] Criar Logo atom via CLI: `npm run ds generate atom Logo`
- [X] T088 [US4] Implementar Logo.types.ts com props: size?: 'sm' | 'md' | 'lg'
- [X] T089 [US4] Implementar Logo.styles.ts usando tokens (Fira Sans Bold, primary color)
- [X] T090 [US4] Implementar Logo.tsx com Text estilizado "Listify"
- [X] T091 [US4] Criar Logo.stories.tsx com casos: Small, Medium, Large, AllSizes
- [X] T092 [US4] Criar teste Logo em tests/design-system/atoms/Logo.test.tsx

### Design System - EmptyState Molecule

> **EmptyState**: Molecule para estados vazios com ícone, título e descrição opcional.

- [X] T093 [US4] Criar EmptyState molecule via CLI: `npm run ds generate molecule EmptyState`
- [X] T094 [US4] Implementar EmptyState.types.ts com props: icon?, title, description?, action?
- [X] T095 [US4] Implementar EmptyState.styles.ts usando tokens (centered layout, muted colors)
- [X] T096 [US4] Implementar EmptyState.tsx
- [X] T097 [US4] Criar EmptyState.stories.tsx com casos: Default, WithIcon, WithAction, Minimal
- [X] T098 [US4] Criar teste EmptyState em tests/design-system/molecules/EmptyState.test.tsx

### Drawer Navigation

- [X] T099 [US4] Criar drawer layout em app/(drawer)/_layout.tsx com Expo Router Drawer
- [X] T100 [US4] Criar CustomDrawerContent em src/presentation/components/navigation/CustomDrawerContent.tsx
- [X] T101 [US4] Criar rota inbox em app/(drawer)/inbox/index.tsx
- [X] T102 [US4] Criar rota settings placeholder em app/(drawer)/settings/index.tsx

### Integração Root Layout

- [X] T103 [US4] Atualizar app/_layout.tsx para incluir AppDependenciesProvider
- [X] T104 [US4] Adicionar Navbar com Logo e IconButton menu no InboxScreen

### Componentes Visuais

- [X] T105 [US4] Criar PinnedListsSection em src/presentation/components/inbox/PinnedListsSection.tsx usando EmptyState molecule
- [X] T106 [US4] Adicionar SearchBar visual (não funcional) no InboxScreen usando molecule existente

**Checkpoint**: User Stories 1-4 funcionais - interface completa

---

## Fase 7: User Story 5 - Usar tags para organizar inputs (Priority: P5)

**Objetivo**: Sistema completo de tags com autocomplete e sugestões em tempo real

**Teste Independente**: Digitar `#com`, verificar sugestão `#compras`. Selecionar sugestão, tag inserida.

### Testes para User Story 5 ⚠️

- [X] T107 [P] [US5] Criar teste SearchTags em tests/domain/inbox/SearchTags.test.ts

### Implementação Use Case

- [X] T108 [US5] Implementar SearchTags use case em src/domain/inbox/use-cases/SearchTags.ts

### Integração de Tags

- [X] T109 [US5] Integrar SearchTags no InboxTagSuggestions com debounce
- [X] T110 [US5] Implementar seleção de tag no InboxTagSuggestions (inserir no texto)
- [X] T111 [US5] Exibir tags como badges no UserInputCard usando Badge atom existente

**Checkpoint**: Todas as user stories funcionais - feature completa

---

## Fase 8: Polish & Cross-Cutting Concerns

**Propósito**: Melhorias finais, otimizações e validação

### Barrel Exports

- [X] T112 [P] Criar barrel exports em src/domain/inbox/index.ts
- [X] T113 [P] Criar barrel exports em src/domain/inbox/use-cases/index.ts
- [X] T114 [P] Atualizar barrel exports do Design System em src/design-system/molecules/index.ts
- [X] T115 [P] Atualizar barrel exports do Design System em src/design-system/atoms/index.ts

### UI Polish

- [X] T116 Adicionar loading states durante operações (criar, editar, excluir)
- [X] T117 Implementar error handling com Toast/Snackbar para erros de domínio

### Performance

- [X] T118 Testar performance com 500+ inputs (verificar FlashList fluido)
- [X] T119 [P] Adicionar estimatedItemSize no FlashList para otimização

### Validação Final

- [X] T120 Rodar `npm run lint` e corrigir warnings
- [X] T121 Rodar `npm test -- inbox` e garantir todos testes passando
- [X] T122 Rodar `npm run storybook` e validar todos os componentes DS criados
- [X] T123 Validar checklist de quickstart.md manualmente

### Validação Offline (Princípio IV da Constituição)

- [X] T124 Validar funcionamento offline: criar input, editar, excluir com airplane mode ativo
- [X] T125 Validar persistência após restart: criar inputs, fechar app completamente, reabrir e verificar dados

---

## Dependências & Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Sem dependências — pode iniciar imediatamente
- **Fundacional (Fase 2)**: Depende da conclusão do Setup — BLOQUEIA todas as user stories
- **User Stories (Fase 3-7)**: Todas dependem da conclusão da fase Fundacional
  - User stories SHOULD seguir em sequência por prioridade (P1 → P2 → P3 → P4 → P5)
  - Componentes DS dentro de cada story devem ser criados ANTES dos componentes de presentation
- **Polish (Fase 8)**: Depende de todas as user stories desejadas estarem concluídas

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após fase Fundacional — cria InputBar e SuggestionsPopUp molecules
- **User Story 2 (P2)**: Pode começar após fase Fundacional — cria DateBadge atom, usa componentes de US1
- **User Story 3 (P3)**: Pode começar após fase Fundacional — cria ContextMenu e AlertDialog molecules, estende UserInputCard de US2
- **User Story 4 (P4)**: Pode começar após fase Fundacional — cria Logo atom e EmptyState molecule, independente
- **User Story 5 (P5)**: Pode começar após fase Fundacional — estende InboxTagSuggestions de US1

### Novos Componentes do Design System

| Componente | Tipo | User Story | Descrição |
|------------|------|------------|-----------|
| InputBar | Molecule | US1 | Input + IconButton para entrada com ação |
| SuggestionsPopUp | Molecule | US1 | Lista de sugestões tipo Command |
| DateBadge | Atom | US2 | Badge de data para sticky headers |
| ContextMenu | Molecule | US3 | Menu contextual (long press) |
| AlertDialog | Molecule | US3 | Diálogo de confirmação |
| Logo | Atom | US4 | Logo "Listify" estilizado |
| EmptyState | Molecule | US4 | Estado vazio com ícone e texto |

### Within Each User Story

- Componentes DS (atoms/molecules) ANTES de componentes de presentation
- Stories JUNTO com implementação do componente DS
- Testes de domínio antes da implementação quando possível (TDD)
- Use cases antes de componentes UI
- Store updates antes de componentes que os consomem

### Parallel Opportunities

**Fase 2 (Fundacional)**:
- T006, T007, T008, T009, T010, T012, T013 podem rodar em paralelo (arquivos diferentes)
- T016, T020, T024, T025, T027, T028 podem rodar em paralelo

**User Story 1**:
- T043, T044 podem rodar em paralelo (testes)
- InputBar e SuggestionsPopUp podem ser desenvolvidos em paralelo

**User Story 2**:
- T058, T059 podem rodar em paralelo (testes)

**User Story 3**:
- T078, T079 podem rodar em paralelo (testes)
- ContextMenu e AlertDialog podem ser desenvolvidos em paralelo

---

## Exemplo de Paralelismo: Fase 2 (Fundacional)

```bash
# Rodar em paralelo - entidades e types:
Tarefa: T006 "Criar entity Tag em src/domain/inbox/entities/Tag.ts"
Tarefa: T007 "Criar entity UserInput em src/domain/inbox/entities/UserInput.ts"
Tarefa: T008 "Criar types PaginatedUserInputs em src/domain/inbox/entities/types.ts"
Tarefa: T010 "Criar value object TagName em src/domain/inbox/value-objects/TagName.ts"
Tarefa: T012 "Criar constants em src/domain/inbox/constants.ts"
Tarefa: T013 "Criar domain errors em src/domain/inbox/use-cases/errors.ts"

# Sequencial após entidades:
Tarefa: T014 "Criar interface InboxRepository" (depende de entities)
Tarefa: T015 "Criar Migration #2" (pode ser paralelo com T014)

# Testes DI em paralelo:
Tarefa: T024 "Criar estrutura de testes DI em tests/app/di/"
Tarefa: T025 "Criar teste para AppDependenciesProvider"
```

---

## Exemplo: User Story 1 - Ordem de Execução

```bash
# 1. Primeiro: Componentes do Design System
Tarefa: T031-T036 "InputBar molecule" (via CLI + implementação + stories + teste)
Tarefa: T037-T042 "SuggestionsPopUp molecule" (via CLI + implementação + stories + teste)

# 2. Depois: Testes de domínio
Tarefa: T043 "Teste CreateUserInput"
Tarefa: T044 "testUtils"

# 3. Depois: Use case
Tarefa: T045 "CreateUserInput use case"

# 4. Depois: Store e hooks
Tarefa: T046-T048 "inboxStore, Provider, useInboxVM"

# 5. Por último: Componentes de presentation que usam DS
Tarefa: T049 "InboxBottomBar usando InputBar"
Tarefa: T050 "InboxTagSuggestions usando SuggestionsPopUp"
Tarefa: T051 "InboxScreen"
```

---

## Estratégia de Implementação

### MVP Primeiro (Apenas User Story 1)

1. Concluir Fase 1: Setup
2. Concluir Fase 2: Fundacional (CRÍTICO)
3. Concluir Fase 3: User Story 1 (inclui InputBar e SuggestionsPopUp molecules)
4. **PARAR E VALIDAR**: criar input funciona, tags são extraídas
5. Validar no Storybook: InputBar e SuggestionsPopUp
6. Deploy/demo se estiver pronto

### Entrega Incremental

1. Setup + Fundacional → base pronta
2. User Story 1 → criar inputs com tags → MVP! 🎯
   - Novos DS: InputBar, SuggestionsPopUp
3. User Story 2 → visualizar histórico → demo
   - Novos DS: DateBadge
4. User Story 3 → editar/excluir → CRUD completo
   - Novos DS: ContextMenu, AlertDialog
5. User Story 4 → navegação completa → UX profissional
   - Novos DS: Logo, EmptyState
6. User Story 5 → tags autocomplete → feature completa
7. Polish → production ready

---

## Resumo

| Fase | Tarefas | DS Components | Propósito |
|------|---------|---------------|-----------|
| Setup | T001-T005 | - | Dependências e estrutura |
| Fundacional | T006-T030, T019b | - | Domínio, infra, DI, testes DI |
| US1 (P1) | T031-T051 | InputBar, SuggestionsPopUp | Criar inputs 🎯 MVP |
| US2 (P2) | T052-T065 | DateBadge | Visualizar lista |
| US3 (P3) | T066-T086 | ContextMenu, AlertDialog | Editar/excluir |
| US4 (P4) | T087-T106 | Logo, EmptyState | Navegação/drawer |
| US5 (P5) | T107-T111 | - | Tags autocomplete |
| Polish | T112-T125 | - | Finalização + validação offline |

**Total**: 126 tarefas
**MVP mínimo**: Fases 1-3 (52 tarefas)
**Feature completa**: Fases 1-8 (126 tarefas)

**Novos componentes DS**: 7 (2 atoms + 5 molecules)
- Atoms: DateBadge, Logo
- Molecules: InputBar, SuggestionsPopUp, ContextMenu, AlertDialog, EmptyState

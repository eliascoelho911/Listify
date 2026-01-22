# Tarefas: Listify Core

**Versão alvo**: MVP
**Input**: Documentos de design em `/specs/004-listify-core/`
**Pré-requisitos**: plan.md, spec.md, research.md, data-model.md, contracts/smart-input-parser.contract.md

**Testes**: TDD é OBRIGATÓRIO para domain e data layers conforme CLAUDE.md. Testes de apresentação são recomendados para stores.

**Organização**: Tarefas agrupadas por user story para implementação e validação independentes.

## Formato: `[ID] [P?] [Story?] Descrição com path`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story associada (US1.1, US2.1, etc.)
- Paths exatos em cada tarefa

---

## Fase 1: Setup (Infra Compartilhada)

**Propósito**: Inicialização do projeto e estrutura básica de persistência

- [X] T001 Criar schema Drizzle com todas as tabelas em src/infra/drizzle/schema.ts
- [X] T002 Criar migration SQL inicial em src/infra/drizzle/migrations/0001_initial_schema.sql
- [X] T003 Criar migration de seed da lista de Notas em src/infra/drizzle/migrations/0002_seed_notes_list.sql
- [X] T004 [P] Criar inicialização do banco de dados em src/infra/drizzle/index.ts
- [X] T005 [P] Criar persistence contracts em src/data/persistence/list.persistence.ts
- [X] T006 [P] Criar persistence contracts em src/data/persistence/item.persistence.ts
- [X] T007 [P] Criar persistence contracts em src/data/persistence/section.persistence.ts
- [X] T008 [P] Criar persistence contracts em src/data/persistence/user.persistence.ts
- [X] T009 [P] Criar persistence contracts em src/data/persistence/user-preferences.persistence.ts
- [X] T010 [P] Criar persistence contracts em src/data/persistence/purchase-history.persistence.ts
- [X] T011 [P] Criar persistence contracts em src/data/persistence/search-history.persistence.ts
- [X] T012 Criar barrel export em src/data/persistence/index.ts

---

## Fase 2: Fundacional (Pré-requisitos Bloqueantes)

**Propósito**: Domain entities, mappers e repositories base que TODAS as user stories usam

**⚠️ CRÍTICO**: Nenhuma user story começa até esta fase estar concluída

### 2.1 Domain Entities (TDD Obrigatório)

- [X] T013 [P] Escrever testes para List entity em tests/domain/list/list.entity.test.ts
- [X] T014 [P] Escrever testes para Item discriminated union em tests/domain/item/item.entity.test.ts
- [X] T015 [P] Escrever testes para Section entity em tests/domain/section/section.entity.test.ts
- [X] T016 [P] Escrever testes para User entity em tests/domain/user/user.entity.test.ts
- [X] T017 [P] Escrever testes para UserPreferences entity em tests/domain/user-preferences/user-preferences.entity.test.ts
- [X] T018 [P] Escrever testes para PurchaseHistory entity em tests/domain/purchase-history/purchase-history.entity.test.ts
- [X] T019 [P] Escrever testes para SearchHistoryEntry entity em tests/domain/search-history/search-history.entity.test.ts
- [X] T020 [P] Implementar List entity e types em src/domain/list/entities/list.entity.ts
- [X] T021 [P] Implementar Item discriminated union em src/domain/item/entities/item.entity.ts
- [X] T022 [P] Implementar Section entity em src/domain/section/entities/section.entity.ts
- [X] T023 [P] Implementar User entity em src/domain/user/entities/user.entity.ts
- [X] T024 [P] Implementar UserPreferences entity em src/domain/user-preferences/entities/user-preferences.entity.ts
- [X] T025 [P] Implementar PurchaseHistory entity em src/domain/purchase-history/entities/purchase-history.entity.ts
- [X] T026 [P] Implementar SearchHistoryEntry entity em src/domain/search-history/entities/search-history.entity.ts

### 2.2 Domain Ports

- [X] T027 [P] Criar ListRepository port em src/domain/list/ports/list.repository.ts
- [X] T028 [P] Criar ItemRepository port (base) em src/domain/item/ports/item.repository.ts
- [X] T029 [P] Criar SectionRepository port em src/domain/section/ports/section.repository.ts
- [X] T030 [P] Criar UserRepository port em src/domain/user/ports/user.repository.ts
- [X] T031 [P] Criar UserPreferencesRepository port em src/domain/user-preferences/ports/user-preferences.repository.ts
- [X] T032 [P] Criar PurchaseHistoryRepository port em src/domain/purchase-history/ports/purchase-history.repository.ts
- [X] T033 [P] Criar SearchHistoryRepository port em src/domain/search-history/ports/search-history.repository.ts
- [X] T034 [P] Criar GlobalSearchRepository port em src/domain/search/ports/global-search.repository.ts
- [X] T035 [P] Criar SmartInputParser port em src/domain/common/ports/smart-input-parser.port.ts
- [X] T036 [P] Criar CategoryInference port em src/domain/common/ports/category-inference.port.ts
- [X] T037 [P] Criar MediaProviderRepository port em src/domain/common/ports/media-provider.port.ts

### 2.3 Data Mappers (TDD Obrigatório)

- [X] T038 [P] Escrever testes para list.mapper em tests/data/mappers/list.mapper.test.ts
- [X] T039 [P] Escrever testes para item.mapper em tests/data/mappers/item.mapper.test.ts
- [X] T040 [P] Escrever testes para section.mapper em tests/data/mappers/section.mapper.test.ts
- [X] T041 [P] Escrever testes para user.mapper em tests/data/mappers/user.mapper.test.ts
- [X] T042 [P] Escrever testes para user-preferences.mapper em tests/data/mappers/user-preferences.mapper.test.ts
- [X] T043 [P] Escrever testes para purchase-history.mapper em tests/data/mappers/purchase-history.mapper.test.ts
- [X] T044 [P] Escrever testes para search-history.mapper em tests/data/mappers/search-history.mapper.test.ts
- [X] T045 [P] Implementar list.mapper em src/data/mappers/list.mapper.ts
- [X] T046 [P] Implementar item.mapper em src/data/mappers/item.mapper.ts
- [X] T047 [P] Implementar section.mapper em src/data/mappers/section.mapper.ts
- [X] T048 [P] Implementar user.mapper em src/data/mappers/user.mapper.ts
- [X] T049 [P] Implementar user-preferences.mapper em src/data/mappers/user-preferences.mapper.ts
- [X] T050 [P] Implementar purchase-history.mapper em src/data/mappers/purchase-history.mapper.ts
- [X] T051 [P] Implementar search-history.mapper em src/data/mappers/search-history.mapper.ts

### 2.4 Infrastructure Repositories

- [X] T052 [P] Implementar DrizzleListRepository em src/infra/repositories/DrizzleListRepository.ts
- [X] T053 [P] Implementar DrizzleNoteItemRepository em src/infra/repositories/DrizzleNoteItemRepository.ts
- [X] T054 [P] Implementar DrizzleShoppingItemRepository em src/infra/repositories/DrizzleShoppingItemRepository.ts
- [X] T055 [P] Implementar DrizzleMovieItemRepository em src/infra/repositories/DrizzleMovieItemRepository.ts
- [X] T056 [P] Implementar DrizzleBookItemRepository em src/infra/repositories/DrizzleBookItemRepository.ts
- [X] T057 [P] Implementar DrizzleGameItemRepository em src/infra/repositories/DrizzleGameItemRepository.ts
- [X] T058 [P] Implementar DrizzleSectionRepository em src/infra/repositories/DrizzleSectionRepository.ts
- [X] T059 [P] Implementar DrizzleUserRepository em src/infra/repositories/DrizzleUserRepository.ts
- [X] T060 [P] Implementar DrizzleUserPreferencesRepository em src/infra/repositories/DrizzleUserPreferencesRepository.ts
- [X] T061 [P] Implementar DrizzlePurchaseHistoryRepository em src/infra/repositories/DrizzlePurchaseHistoryRepository.ts
- [X] T062 [P] Implementar DrizzleSearchHistoryRepository em src/infra/repositories/DrizzleSearchHistoryRepository.ts
- [X] T063 [P] Implementar DrizzleGlobalSearchRepository em src/infra/repositories/DrizzleGlobalSearchRepository.ts

### 2.5 DI Container

- [X] T064 Atualizar AppDependencies interface em src/app/di/types.ts
- [X] T065 Atualizar buildDependencies em src/app/di/container.ts
- [X] T066 Atualizar AppDependenciesProvider com useMigrations em src/app/di/AppDependenciesProvider.tsx

**Checkpoint**: Base pronta — implementação de user stories pode começar

---

## Fase 3: US1.1 - Navegação Principal via BottomBar (Priority: P0) 🎯 MVP

**Objetivo**: Usuário navega entre Inbox, Buscar, Notas e Listas via bottombar fixa

**Teste Independente**: Tocar em cada aba e verificar se a tela correta é exibida

### Implementação

- [X] T067 [P] [US1.1] Criar átomo NavigationTab em src/design-system/atoms/NavigationTab/ via CLI
- [X] T068 [P] [US1.1] Criar átomo FAB (botão central) em src/design-system/atoms/FAB/ via CLI
- [X] T069 [US1.1] Criar organismo Bottombar em src/design-system/organisms/Bottombar/ via CLI
- [X] T070 [US1.1] Criar tabs layout com Bottombar customizado em app/(tabs)/_layout.tsx
- [X] T071 [P] [US1.1] Criar placeholder screen Inbox em app/(tabs)/index.tsx
- [X] T072 [P] [US1.1] Criar placeholder screen Search em app/(tabs)/search.tsx
- [X] T073 [P] [US1.1] Criar placeholder screen Notes em app/(tabs)/notes.tsx
- [X] T074 [P] [US1.1] Criar placeholder screen Lists em app/(tabs)/lists.tsx
- [X] T075 [US1.1] Implementar preservação de estado entre abas via Expo Router

**Checkpoint**: Navegação entre 4 abas + FAB central funcional

---

## Fase 4: US1.2 - Navbar e Acesso a Configurações (Priority: P0)

**Objetivo**: Usuário acessa configurações via ícone de perfil na navbar superior

**Teste Independente**: Tocar no ícone de perfil e verificar navegação para settings

### Implementação

- [X] T076 [P] [US1.2] Criar átomo ScreenTitle em src/design-system/atoms/ScreenTitle/ via CLI
- [X] T077 [P] [US1.2] Criar molécula ProfileButton em src/design-system/molecules/ProfileButton/ via CLI
- [X] T078 [US1.2] Criar organismo Navbar em src/design-system/organisms/Navbar/ via CLI
- [X] T079 [US1.2] Criar placeholder SettingsScreen em src/presentation/screens/SettingsScreen.tsx
- [X] T080 [US1.2] Configurar rota settings em app/settings.tsx
- [X] T081 [US1.2] Integrar Navbar em todas as telas principais via tabs layout

**Checkpoint**: Navbar com perfil navegando para settings

---

## Fase 5: US2.1 - Campo de Entrada Inteligente (Priority: P0) 🎯 MVP

**Objetivo**: Campo de entrada com parsing automático de @lista, quantidade e valor monetário

**Teste Independente**: Digitar diferentes formatos e verificar parsing correto

### Testes (TDD para infra service)

- [X] T082 [P] [US2.1] Escrever testes do SmartInputParserService conforme contract em tests/infra/services/SmartInputParserService.test.ts

### Implementação

- [X] T083 [US2.1] Implementar SmartInputParserService em src/infra/services/SmartInputParserService.ts
- [X] T084 [P] [US2.1] Criar molécula InlineHighlight para highlighting em src/design-system/molecules/InlineHighlight/ via CLI
- [X] T085 [P] [US2.1] Criar molécula ParsePreview para preview de chips em src/design-system/molecules/ParsePreview/ via CLI
- [X] T086 [P] [US2.1] Criar molécula ListSuggestionDropdown em src/design-system/molecules/ListSuggestionDropdown/ via CLI
- [X] T087 [US2.1] Criar organismo SmartInputModal em src/design-system/organisms/SmartInputModal/ via CLI
- [X] T088 [US2.1] Criar hook useSmartInput em src/presentation/hooks/useSmartInput.ts
- [X] T089 [US2.1] Integrar SmartInputModal com FAB central no tabs layout

**Checkpoint**: Campo de entrada inteligente com parsing e inline highlighting funcional ✅

---

## Fase 6: US2.2 - Criação de Lista Inline com Inferência (Priority: P1)

**Objetivo**: Criar lista automaticamente quando @NovaLista não existe, inferindo categoria

**Teste Independente**: Digitar @NomeNovo e verificar fluxo de criação com inferência

### Testes (TDD para infra service)

- [X] T090 [P] [US2.2] Escrever testes do CategoryInferenceService em tests/infra/services/CategoryInferenceService.test.ts

### Implementação

- [X] T091 [US2.2] Implementar CategoryInferenceService em src/infra/services/CategoryInferenceService.ts
- [X] T092 [US2.2] Criar molécula MiniCategorySelector em src/design-system/molecules/MiniCategorySelector/ via CLI
- [X] T093 [US2.2] Integrar inferência no SmartInputModal com fluxo de criação de lista

**Checkpoint**: Criação inline de lista com inferência de categoria funcional

---

## Fase 7: US2.3 - Captura Rápida de Item (Priority: P1)

**Objetivo**: Adicionar item em menos de 10 segundos usando entrada inteligente

**Teste Independente**: Medir tempo desde abertura até item criado

### Implementação

- [X] T094 [US2.3] Criar useItemStore com optimistic updates em src/presentation/stores/useItemStore.ts
- [X] T095 [US2.3] Integrar criação de item no SmartInputModal
- [X] T096 [US2.3] Implementar modal que permanece aberto para criação contínua
- [X] T097 [US2.3] Implementar item sem lista associada vai para Inbox

**Checkpoint**: Captura ultra-rápida de itens funcional ✅

---

## Fase 8: US3.1 - Inbox como Hub Central (Priority: P1) 🎯 MVP

**Objetivo**: Visualizar todos os itens recentes com scroll infinito e agrupamento

**Teste Independente**: Criar diversos itens, verificar agrupamento e scroll infinito

### Implementação

- [X] T098 [P] [US3.1] Criar átomo GroupHeader em src/design-system/atoms/GroupHeader/ via CLI
- [X] T099 [P] [US3.1] Criar molécula ItemCard (genérico) em src/design-system/molecules/ItemCard/ via CLI
- [X] T100 [P] [US3.1] Criar molécula SortingControls em src/design-system/molecules/SortingControls/ via CLI
- [X] T101 [US3.1] Criar organismo InfiniteScrollList em src/design-system/organisms/InfiniteScrollList/ via CLI
- [X] T102 [US3.1] Criar hook useInfiniteScroll em src/presentation/hooks/useInfiniteScroll.ts
- [X] T103 [US3.1] Criar InboxScreen completa em src/presentation/screens/InboxScreen.tsx
- [X] T104 [US3.1] Integrar InboxScreen em app/(tabs)/index.tsx

**Checkpoint**: Inbox com scroll infinito e agrupamento por data/lista funcional

---

## Fase 9: US3.2 - Tela Listas com Agrupamento por Categoria (Priority: P1)

**Objetivo**: Visualizar listas agrupadas por tipo (Notas, Compras, Filmes, Livros, Games)

**Teste Independente**: Navegar para aba Listas, verificar dropdowns expansíveis por tipo

### Implementação

- [X] T105 [P] [US3.2] Criar molécula ListCard em src/design-system/molecules/ListCard/ via CLI
- [X] T106 [P] [US3.2] Criar molécula EmptyState em src/design-system/molecules/EmptyState/ via CLI
- [X] T107 [US3.2] Criar organismo CategoryDropdown em src/design-system/organisms/CategoryDropdown/ via CLI
- [X] T108 [US3.2] Criar useListStore com optimistic updates em src/presentation/stores/useListStore.ts
- [X] T109 [US3.2] Criar ListsScreen em src/presentation/screens/ListsScreen.tsx
- [X] T110 [US3.2] Integrar ListsScreen em app/(tabs)/lists.tsx

**Checkpoint**: Tela Listas com dropdowns por categoria funcional

---

## Fase 10: US3.3 - Tela Notas com Layout Configurável (Priority: P1)

**Objetivo**: Visualizar itens da lista de Notas única com agrupamento e ordenação

**Teste Independente**: Navegar para aba Notas, alterar agrupamento/ordenação

### Implementação

- [X] T111 [P] [US3.3] Criar molécula NoteCard (variante de ItemCard) em src/design-system/molecules/NoteCard/ via CLI
- [X] T112 [US3.3] Criar useUserPreferencesStore em src/presentation/stores/useUserPreferencesStore.ts
- [X] T113 [US3.3] Criar NotesScreen em src/presentation/screens/NotesScreen.tsx
- [X] T114 [US3.3] Integrar NotesScreen em app/(tabs)/notes.tsx
- [X] T115 [US3.3] Implementar persistência de configurações de layout

**Checkpoint**: Tela Notas com agrupamento configurável funcional

---

## Fase 11: US3.4 - Tela de Busca Avançada (Priority: P1)

**Objetivo**: Buscar itens com filtros, histórico e highlight de termos

**Teste Independente**: Executar busca, verificar filtros e histórico

### Implementação

- [X] T116 [P] [US3.4] Criar molécula SearchInput com auto-foco em src/design-system/molecules/SearchInput/ via CLI
- [X] T117 [P] [US3.4] Criar átomo FilterChip em src/design-system/atoms/FilterChip/ via CLI
- [X] T118 [P] [US3.4] Criar molécula SearchHistory em src/design-system/molecules/SearchHistory/ via CLI
- [X] T119 [P] [US3.4] Criar molécula SearchResultCard em src/design-system/molecules/SearchResultCard/ via CLI
- [X] T120 [US3.4] Criar useSearchStore em src/presentation/stores/useSearchStore.ts
- [X] T121 [US3.4] Criar SearchScreen em src/presentation/screens/SearchScreen.tsx
- [X] T122 [US3.4] Integrar SearchScreen em app/(tabs)/search.tsx
- [X] T123 [US3.4] Implementar highlight de termos buscados nos resultados
- [X] T124 [US3.4] Implementar histórico de 10 buscas com FIFO

**Checkpoint**: Busca avançada com filtros e histórico funcional ✅

---

## Fase 12: US4.1 - Criar Lista Customizada (Priority: P1)

**Objetivo**: Criar novas listas de Compras, Filmes, Livros ou Games

**Teste Independente**: Criar lista via formulário, verificar na listagem

### Implementação

- [X] T125 [P] [US4.1] Criar molécula CategorySelector em src/design-system/molecules/CategorySelector/ via CLI
- [X] T126 [US4.1] Criar organismo ListForm em src/design-system/organisms/ListForm/ via CLI
- [X] T127 [US4.1] Adicionar fluxo de criação de lista na ListsScreen
- [X] T128 [US4.1] Implementar validação de nome único por tipo

**Checkpoint**: Criação de listas customizadas funcional ✅

---

## Fase 13: US6.1 - Marcar Itens e Ver Total (Priority: P1) 🎯 MVP

**Objetivo**: Marcar itens de compras e ver total atualizado em tempo real

**Teste Independente**: Criar lista de compras, marcar itens, verificar total

### Implementação

- [X] T129 [P] [US6.1] Criar átomo Checkbox em src/design-system/atoms/Checkbox/ via CLI
- [X] T130 [P] [US6.1] Criar átomo PriceBadge em src/design-system/atoms/PriceBadge/ via CLI
- [X] T131 [P] [US6.1] Criar molécula ShoppingItemCard em src/design-system/molecules/ShoppingItemCard/ via CLI
- [X] T132 [US6.1] Criar molécula TotalBar em src/design-system/molecules/TotalBar/ via CLI
- [X] T133 [US6.1] Criar ShoppingListScreen em src/presentation/screens/ShoppingListScreen.tsx
- [X] T134 [US6.1] Configurar rota em app/list/[id].tsx
- [X] T135 [US6.1] Implementar cálculo de total em tempo real (<100ms)
- [X] T136 [US6.1] Implementar indicador "(X itens sem valor)" na TotalBar

**Checkpoint**: Lista de compras com marcação e total funcional

---

## Fase 14: US6.2 - Reordenar Itens de Compras (Priority: P1)

**Objetivo**: Arrastar itens para reordenar na lista de compras

**Teste Independente**: Arrastar item, fechar e reabrir lista, verificar ordem persistida

### Implementação

- [X] T137 [P] [US6.2] Criar átomo DragHandle em src/design-system/atoms/DragHandle/ via CLI
- [X] T138 [US6.2] Criar organismo DraggableList em src/design-system/organisms/DraggableList/ via CLI
- [X] T139 [US6.2] Criar hook useDragAndDrop em src/presentation/hooks/useDragAndDrop.ts
- [X] T140 [US6.2] Integrar drag and drop na ShoppingListScreen
- [X] T141 [US6.2] Implementar persistência de sortOrder no banco

**Checkpoint**: Reordenação de itens com drag and drop funcional

---

## Fase 15: US4.2 - Editar e Excluir Lista (Priority: P2)

**Objetivo**: Renomear ou excluir listas existentes (exceto lista de Notas)

**Teste Independente**: Editar nome, excluir lista, verificar tratamento de itens

### Implementação

- [X] T142 [P] [US4.2] Criar molécula ContextMenu em src/design-system/molecules/ContextMenu/ via CLI
- [X] T143 [P] [US4.2] Criar molécula ConfirmationDialog em src/design-system/molecules/ConfirmationDialog/ via CLI
- [X] T144 [US4.2] Adicionar long-press na ListCard para menu de contexto
- [X] T145 [US4.2] Implementar fluxo de edição de lista
- [X] T146 [US4.2] Implementar fluxo de exclusão com opção de mover itens
- [X] T147 [US4.2] Bloquear edição/exclusão da lista de Notas pré-fabricada

**Checkpoint**: Gerenciamento completo de listas (exceto Notas)

---

## Fase 16: US5.1 - Criar e Gerenciar Seções (Priority: P2)

**Objetivo**: Criar seções dentro de listas para organização visual

**Teste Independente**: Criar seção, arrastar itens entre seções, excluir seção

### Implementação

- [X] T148 [P] [US5.1] Criar molécula SectionHeader em src/design-system/molecules/SectionHeader/ via CLI
- [X] T149 [P] [US5.1] Criar átomo SectionAddButton em src/design-system/atoms/SectionAddButton/ via CLI
- [X] T150 [US5.1] Criar useSectionStore em src/presentation/stores/useSectionStore.ts
- [X] T151 [US5.1] Integrar seções nas screens de lista
- [X] T152 [US5.1] Implementar drag de itens entre seções
- [X] T153 [US5.1] Implementar reordenação de seções
- [X] T154 [US5.1] Implementar botão "Adicionar nessa seção" com @Lista:Seção preenchido

**Checkpoint**: Seções com drag and drop funcional

---

## Fase 17: US6.3 - Editar Item de Compras (Priority: P2)

**Objetivo**: Editar item existente via modal inteligente

**Teste Independente**: Tocar em item, editar via modal, verificar persistência

### Implementação

- [X] T155 [US6.3] Criar organismo EditModal (sheet) em src/design-system/organisms/EditModal/ via CLI
- [X] T156 [US6.3] Implementar pré-preenchimento do campo com dados atuais
- [X] T157 [US6.3] Integrar EditModal na ShoppingListScreen
- [X] T158 [US6.3] Implementar exclusão de item via modal

**Checkpoint**: Edição de itens de compras funcional

---

## Fase 18: US6.4 - Concluir Compra e Histórico (Priority: P2)

**Objetivo**: Salvar registro da compra e resetar lista

**Teste Independente**: Marcar itens, concluir compra, verificar histórico

### Implementação

- [X] T159 [P] [US6.4] Criar molécula CompleteButton em src/design-system/molecules/CompleteButton/ via CLI
- [X] T160 [P] [US6.4] Criar molécula HistoryCard em src/design-system/molecules/HistoryCard/ via CLI
- [X] T161 [US6.4] Criar organismo HistoryList em src/design-system/organisms/HistoryList/ via CLI
- [X] T162 [US6.4] Criar usePurchaseHistoryStore em src/presentation/stores/usePurchaseHistoryStore.ts
- [X] T163 [US6.4] Criar PurchaseHistoryScreen em src/presentation/screens/PurchaseHistoryScreen.tsx
- [X] T164 [US6.4] Configurar rota em app/history/[listId].tsx
- [X] T165 [US6.4] Implementar snapshot de compra no histórico
- [X] T166 [US6.4] Implementar reset de marcações após conclusão

**Checkpoint**: Conclusão de compra e histórico funcional

---

## Fase 19: US6.5 - Reutilizar Itens do Histórico (Priority: P2)

**Objetivo**: Readicionar itens de compra anterior à lista atual

**Teste Independente**: Acessar histórico, adicionar itens, verificar soma de quantidade

### Implementação

- [X] T167 [P] [US6.5] Criar molécula SelectableItemList em src/design-system/molecules/SelectableItemList/ via CLI
- [X] T168 [P] [US6.5] Criar átomo AddAllButton em src/design-system/atoms/AddAllButton/ via CLI
- [X] T169 [US6.5] Criar HistoryDetailScreen em src/presentation/screens/HistoryDetailScreen.tsx
- [X] T170 [US6.5] Implementar "Comprar tudo novamente"
- [X] T171 [US6.5] Implementar seleção individual de itens
- [X] T172 [US6.5] Implementar soma de quantidade para itens existentes
- [X] T173 [US6.5] Implementar indicação visual de itens já na lista

**Checkpoint**: Reutilização de histórico funcional

---

## Fase 20: US7.1 - Criar e Organizar Notas (Priority: P2)

**Objetivo**: Criar notas e reordenar via drag and drop

**Teste Independente**: Criar nota, reordenar, verificar persistência

### Implementação

- [X] T174 [US7.1] Adicionar criação de NoteItem no useItemStore
- [X] T175 [US7.1] Integrar drag and drop na NotesScreen
- [X] T176 [US7.1] Implementar geração automática de título (fallback: timestamp)

**Checkpoint**: Criação e reordenação de notas funcional

---

## Fase 21: US7.2 - Tela de Detalhes da Nota (Priority: P2)

**Objetivo**: Visualizar e editar nota com suporte a markdown

**Teste Independente**: Abrir nota, editar com markdown, verificar renderização

### Implementação

- [X] T177 [P] [US7.2] Criar molécula MarkdownViewer em src/design-system/molecules/MarkdownViewer/ via CLI
- [X] T178 [P] [US7.2] Criar molécula MarkdownEditor em src/design-system/molecules/MarkdownEditor/ via CLI
- [X] T179 [P] [US7.2] Criar átomo InlineEdit em src/design-system/atoms/InlineEdit/ via CLI
- [X] T180 [US7.2] Criar NoteDetailScreen em src/presentation/screens/NoteDetailScreen.tsx
- [X] T181 [US7.2] Configurar rota em app/note/[id].tsx
- [X] T182 [US7.2] Implementar modo visualização como padrão
- [X] T183 [US7.2] Implementar edição inline de título
- [X] T184 [US7.2] Implementar suporte a markdown (negrito, itálico, listas, headers, links)

**Checkpoint**: Tela de detalhes de nota com markdown funcional

---

## Fase 22: US8.1 - Adicionar Filme com Enriquecimento (Priority: P2)

**Objetivo**: Buscar filme no TMDb e adicionar com dados enriquecidos

**Teste Independente**: Buscar filme, selecionar resultado, verificar dados preenchidos

### Implementação

- [X] T185 [P] [US8.1] Criar molécula MediaSearchDropdown em src/design-system/molecules/MediaSearchDropdown/ via CLI
- [X] T186 [P] [US8.1] Criar molécula MediaCard em src/design-system/molecules/MediaCard/ via CLI
- [X] T187 [US8.1] Implementar TMDbProviderService em src/infra/services/TMDbProviderService.ts
- [X] T188 [US8.1] Criar InterestListScreen em src/presentation/screens/InterestListScreen.tsx
- [X] T189 [US8.1] Configurar rota genérica para listas de interesse em app/list/[id].tsx
- [X] T190 [US8.1] Integrar busca inline no SmartInputModal para listas de filmes
- [X] T191 [US8.1] Implementar marcação "visto" para filmes
- [X] T192 [US8.1] Implementar fallback para entrada manual sem TMDb

**Checkpoint**: Listas de filmes com enriquecimento TMDb funcional

---

## Fase 23: US10.1 - Excluir Itens de Qualquer Lista (Priority: P2)

**Objetivo**: Remover itens de qualquer tipo de lista

**Teste Independente**: Excluir itens de diferentes listas via swipe e menu

### Implementação

- [X] T193 [US10.1] Criar molécula SwipeToDelete em src/design-system/molecules/SwipeToDelete/ via CLI
- [X] T194 [US10.1] Integrar exclusão via long-press com ContextMenu
- [X] T195 [US10.1] Integrar exclusão via swipe
- [X] T196 [US10.1] Implementar confirmação antes de exclusão permanente

**Checkpoint**: Exclusão de itens funcional em todas as listas

---

## Fase 24: US8.2 - Adicionar Livro com Busca Integrada (Priority: P3)

**Objetivo**: Buscar livro no Google Books e adicionar com dados enriquecidos

**Teste Independente**: Buscar livro, selecionar resultado, verificar dados preenchidos

### Implementação

- [X] T197 [US8.2] Implementar GoogleBooksProviderService em src/infra/services/GoogleBooksProviderService.ts
- [X] T198 [US8.2] Criar variante BookCard de MediaCard
- [X] T199 [US8.2] Integrar busca inline no SmartInputModal para listas de livros
- [X] T200 [US8.2] Implementar marcação "lido" para livros

**Checkpoint**: Listas de livros com enriquecimento Google Books funcional

---

## Fase 25: US8.3 - Adicionar Game com Busca Integrada (Priority: P3)

**Objetivo**: Buscar game no IGDB e adicionar com dados enriquecidos

**Teste Independente**: Buscar game, selecionar resultado, verificar dados preenchidos

### Implementação

- [X] T201 [US8.3] Implementar IGDBProviderService em src/infra/services/IGDBProviderService.ts
- [X] T202 [US8.3] Criar variante GameCard de MediaCard
- [X] T203 [US8.3] Integrar busca inline no SmartInputModal para listas de games
- [X] T204 [US8.3] Implementar marcação "jogado" para games

**Checkpoint**: Listas de games com enriquecimento IGDB funcional

---

## Fase 26: US9.1 - Configuração de Tema (Priority: P3)

**Objetivo**: Configurar tema (claro/escuro/auto) e cor de destaque

**Teste Independente**: Alterar tema, verificar mudança visual imediata e persistência

### Implementação

- [X] T205 [P] [US9.1] Criar molécula ThemeSelector em src/design-system/molecules/ThemeSelector/ via CLI
- [X] T206 [P] [US9.1] Criar molécula ColorPicker em src/design-system/molecules/ColorPicker/ via CLI
- [X] T207 [US9.1] Completar SettingsScreen com seções de tema e cor
- [X] T208 [US9.1] Integrar tema automático com preferência do sistema
- [X] T209 [US9.1] Implementar persistência de configurações via UserPreferences

**Checkpoint**: Configuração de tema e cor funcional ✅

---

## Fase 27: Polish & Cross-Cutting Concerns

**Propósito**: Melhorias que afetam múltiplas user stories

- [ ] T210 [P] Adicionar i18n para todas as strings de UI em src/app/i18n/locales/
- [ ] T211 [P] Implementar loading states para todas as operações assíncronas
- [ ] T212 [P] Implementar error boundaries para tratamento de erros
- [ ] T213 [P] Adicionar empty states com ilustrações em todas as telas de lista
- [ ] T214 Otimizar performance de FlatList com memoização
- [ ] T215 Executar `npm run lint` e corrigir warnings
- [ ] T216 Executar `npm test` e garantir cobertura adequada
- [ ] T217 Validar todos os cenários de quickstart.md
- [ ] T218 Testar edge cases documentados em spec.md

---

## Dependências & Ordem de Execução

### Dependências entre Fases

- **Setup (Fase 1)**: Sem dependências — pode iniciar imediatamente
- **Fundacional (Fase 2)**: Depende de Setup — BLOQUEIA todas as user stories
- **US1.1 (Fase 3)**: Depende de Fundacional — navegação é base para todas as telas
- **US1.2 (Fase 4)**: Pode rodar em paralelo com US1.1
- **US2.1 (Fase 5)**: Depende de US1.1 (FAB no Bottombar)
- **US2.2 (Fase 6)**: Depende de US2.1 (SmartInputModal)
- **US2.3 (Fase 7)**: Depende de US2.2 (inferência) e useItemStore
- **US3.x (Fases 8-11)**: Dependem de US1.1 (navegação) e useItemStore
- **US4.1 (Fase 12)**: Depende de US3.2 (ListsScreen)
- **US6.x (Fases 13-14)**: Dependem de US4.1 (criar lista de compras)
- **Fases P2 e P3**: Dependem das respectivas funcionalidades P1 estarem prontas
- **Polish (Fase 27)**: Depende de todas as user stories desejadas estarem concluídas

### Dependências entre User Stories

```
Setup → Fundacional → [US1.1, US1.2] → US2.1 → US2.2 → US2.3
                           ↓
                    [US3.1, US3.2, US3.3, US3.4]
                           ↓
                         US4.1
                           ↓
                    [US6.1, US6.2]
                           ↓
            [US4.2, US5.1, US6.3, US6.4, US6.5, US7.x, US8.1, US10.1]
                           ↓
                    [US8.2, US8.3, US9.1]
                           ↓
                        Polish
```

### Parallel Opportunities

**Dentro de Setup:**
- T005-T011 (persistence contracts) podem rodar em paralelo

**Dentro de Fundacional:**
- T013-T019 (testes de entity) podem rodar em paralelo
- T020-T026 (entities) podem rodar em paralelo após testes
- T027-T037 (ports) podem rodar em paralelo
- T038-T044 (testes de mapper) podem rodar em paralelo
- T045-T051 (mappers) podem rodar em paralelo após testes
- T052-T063 (repositories) podem rodar em paralelo

**Após Fundacional:**
- US1.1 e US1.2 podem rodar em paralelo
- US3.1, US3.2, US3.3, US3.4 podem rodar em paralelo (mesma dependência)
- US6.1 e US6.2 podem rodar em paralelo

**Team Strategy:**
- Pessoa A: Setup + Fundacional (critical path)
- Pessoa B: US1.x + US2.x (navegação e entrada)
- Pessoa C: US3.x (telas principais)
- Pessoa D: US6.x (listas de compras)

---

## Exemplo de Paralelismo: Fase 2 (Fundacional)

```bash
# Escrever todos os testes de entity em paralelo:
T013: "Escrever testes para List entity"
T014: "Escrever testes para Item discriminated union"
T015: "Escrever testes para Section entity"
T016: "Escrever testes para User entity"
T017: "Escrever testes para UserPreferences entity"
T018: "Escrever testes para PurchaseHistory entity"
T019: "Escrever testes para SearchHistoryEntry entity"

# Implementar todas as entities em paralelo (após testes):
T020-T026: "Implementar [Entity] entity"

# Implementar todos os ports em paralelo:
T027-T037: "Criar [X]Repository port"
```

---

## Estratégia de Implementação

### MVP Primeiro (P0 + Core P1)

1. Concluir Fase 1: Setup
2. Concluir Fase 2: Fundacional (CRÍTICO)
3. Concluir Fases 3-5: US1.1, US1.2, US2.1 (navegação + entrada inteligente)
4. Concluir Fases 8, 9, 13: US3.1, US3.2, US6.1 (Inbox, Listas, Compras básico)
5. **PARAR E VALIDAR**: testar MVP de forma independente
6. Deploy/demo se estiver pronto

### Entrega Incremental

1. **MVP**: Setup + Fundacional + P0 + Core P1 (navegação, entrada, inbox, listas, compras)
2. **Iteração 2**: Busca (US3.4), Notas (US3.3), Reordenação (US6.2)
3. **Iteração 3**: Gerenciamento (US4.2), Seções (US5.1), Edição (US6.3)
4. **Iteração 4**: Histórico (US6.4, US6.5), Notas detalhes (US7.x)
5. **Iteração 5**: Interesse (US8.x), Tema (US9.1)
6. Polish final

---

## Resumo de Tarefas

| Fase | User Story | Prioridade | Tarefas | Paralelas |
|------|------------|------------|---------|-----------|
| 1 | Setup | - | 12 | 8 |
| 2 | Fundacional | - | 54 | 48 |
| 3 | US1.1 BottomBar | P0 | 9 | 4 |
| 4 | US1.2 Navbar | P0 | 6 | 2 |
| 5 | US2.1 Smart Input | P0 | 8 | 4 |
| 6 | US2.2 Inferência | P1 | 4 | 1 |
| 7 | US2.3 Captura | P1 | 4 | 0 |
| 8 | US3.1 Inbox | P1 | 7 | 3 |
| 9 | US3.2 Listas | P1 | 6 | 2 |
| 10 | US3.3 Notas | P1 | 5 | 1 |
| 11 | US3.4 Busca | P1 | 9 | 4 |
| 12 | US4.1 Criar Lista | P1 | 4 | 1 |
| 13 | US6.1 Marcar/Total | P1 | 8 | 3 |
| 14 | US6.2 Reordenar | P1 | 5 | 1 |
| 15 | US4.2 Editar Lista | P2 | 6 | 2 |
| 16 | US5.1 Seções | P2 | 7 | 2 |
| 17 | US6.3 Editar Item | P2 | 4 | 0 |
| 18 | US6.4 Histórico | P2 | 8 | 2 |
| 19 | US6.5 Reutilizar | P2 | 7 | 2 |
| 20 | US7.1 Organizar Notas | P2 | 3 | 0 |
| 21 | US7.2 Detalhes Nota | P2 | 8 | 3 |
| 22 | US8.1 Filmes | P2 | 8 | 2 |
| 23 | US10.1 Excluir | P2 | 4 | 0 |
| 24 | US8.2 Livros | P3 | 4 | 0 |
| 25 | US8.3 Games | P3 | 4 | 0 |
| 26 | US9.1 Tema | P3 | 5 | 2 |
| 27 | Polish | - | 9 | 4 |
| **Total** | | | **218** | **101** |

---

## Notas

- [P] = tarefas em arquivos diferentes, sem dependências entre si
- [Story] = label que mapeia tarefa à user story (rastreabilidade)
- Cada user story é completável e testável de forma independente
- TDD é OBRIGATÓRIO para domain e data layers
- Faça commit após cada tarefa ou grupo lógico
- Pare em checkpoints para validar a story de forma independente
- Use `npm run ds generate` para criar componentes do Design System

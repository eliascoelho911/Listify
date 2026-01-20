# Plano de Implementação: Listify Core

**Branch**: `004-listify-core` | **Data**: 2026-01-20 | **Versão alvo**: MVP | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification de `/specs/004-listify-core/spec.md`

## Resumo

O Listify Core implementa o MVP de um aplicativo mobile de gerenciamento de notas e listas com **captura unificada e inteligente**. A abordagem técnica utiliza Clean Architecture com React Native/Expo, Drizzle ORM para persistência SQLite, Zustand para estado reativo, e um Design System baseado em Atomic Design com tokens do Shadcn. O diferencial é o campo de entrada inteligente com parsing automático de @lista, quantidade e valor monetário.

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5.9.2 (strict mode)
**Dependências Principais**: React Native 0.81.5, Expo 54.0.31, Expo Router 6.0.21, Zustand 5.0.9, Drizzle ORM 0.45.1
**Storage**: SQLite via Expo SQLite 16.0.10 + Drizzle ORM
**Testes**: Jest 29.7.0 + ts-jest + @testing-library/react-native
**Plataforma-alvo**: Mobile (iOS e Android via Expo)
**Tipo de Projeto**: Mobile single-app
**Metas de Performance**: ≤100ms feedback visual, 60fps em listas, offline-first, app abre em <3s
**Restrições**: Offline-first, sem travar UI, updates otimistas com rollback
**Escala/Escopo**: MVP com 5 tipos de lista (Notas única + Compras/Filmes/Livros/Games customizáveis)

## Checagem da Constituição

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Documentação em pt-BR; nomes de código (classes/funções/endpoints) em inglês
- [x] Versão-alvo definida (MVP) + fora de escopo explícito (sincronização cloud, auth, widgets)
- [x] Fluxos críticos minimalistas (entrada inteligente, bottombar, marcação de itens)
- [x] Offline-first e UX instantânea (SQLite local, updates otimistas)
- [x] Estados claros e resumo de progresso (total de compras na barra, badges visuais)
- [x] Clean Architecture (domain sem React, UI sem lógica de negócio, domínio testável)
- [x] Testes planejados para novas regras de negócio (TDD mandatory para domain e data layers)

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/004-listify-core/
├── plan.md              # Este arquivo
├── spec.md              # Especificação da feature
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal contracts)
│   └── smart-input-parser.contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Código-fonte (raiz do repositório)

```text
src/
├── app/                          # Bootstrap, DI, i18n
│   ├── di/
│   │   ├── container.ts          # buildDependencies() com todos os repos
│   │   ├── types.ts              # AppDependencies interface
│   │   └── AppDependenciesProvider.tsx
│   └── i18n/
│       └── locales/{en,pt-BR}/   # Translation files
│
├── domain/                       # ✅ EXISTENTE - Pure business logic
│   ├── common/                   # Traits, ports genéricos, pagination
│   │   └── ports/
│   │       ├── smart-input-parser.port.ts    # 🆕 SmartInputParser interface
│   │       ├── category-inference.port.ts    # 🆕 CategoryInference interface
│   │       └── media-provider.port.ts        # 🆕 MediaProviderRepository interface
│   ├── list/                     # List entity, ports, types
│   ├── item/                     # Item discriminated union, metadata
│   ├── section/                  # Section entity
│   ├── user/                     # User entity
│   ├── user-preferences/         # Preferences, layout configs
│   ├── purchase-history/         # Shopping completion snapshots
│   └── search-history/           # Search history entries
│
├── data/                         # 🆕 Mappers (SQLite row ↔ domain)
│   └── mappers/
│       ├── list.mapper.ts
│       ├── item.mapper.ts
│       ├── section.mapper.ts
│       ├── user.mapper.ts
│       ├── user-preferences.mapper.ts
│       ├── purchase-history.mapper.ts
│       └── search-history.mapper.ts
│
├── infra/                        # 🆕 Implementations
│   ├── drizzle/
│   │   ├── schema.ts             # Drizzle table definitions
│   │   ├── migrations/           # SQL migrations
│   │   └── index.ts              # Database initialization
│   ├── repositories/
│   │   ├── DrizzleListRepository.ts
│   │   ├── DrizzleNoteItemRepository.ts
│   │   ├── DrizzleShoppingItemRepository.ts
│   │   ├── DrizzleMovieItemRepository.ts
│   │   ├── DrizzleBookItemRepository.ts
│   │   ├── DrizzleGameItemRepository.ts
│   │   ├── DrizzleSectionRepository.ts
│   │   ├── DrizzleUserRepository.ts
│   │   ├── DrizzleUserPreferencesRepository.ts
│   │   ├── DrizzlePurchaseHistoryRepository.ts
│   │   ├── DrizzleSearchHistoryRepository.ts
│   │   └── DrizzleGlobalSearchRepository.ts
│   └── services/
│       ├── SmartInputParserService.ts
│       ├── CategoryInferenceService.ts
│       ├── TMDbProviderService.ts
│       ├── GoogleBooksProviderService.ts
│       └── IGDBProviderService.ts
│
├── presentation/                 # 🆕 React components, stores, hooks
│   ├── stores/
│   │   ├── useListStore.ts
│   │   ├── useItemStore.ts
│   │   ├── useSectionStore.ts
│   │   ├── useSearchStore.ts
│   │   ├── useUserPreferencesStore.ts
│   │   └── usePurchaseHistoryStore.ts
│   ├── hooks/
│   │   ├── useListData.ts
│   │   ├── useItemData.ts
│   │   ├── useSmartInput.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useDragAndDrop.ts
│   ├── screens/
│   │   ├── InboxScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── NotesScreen.tsx
│   │   ├── ListsScreen.tsx
│   │   ├── ListDetailScreen.tsx
│   │   ├── NoteDetailScreen.tsx
│   │   ├── ShoppingListScreen.tsx
│   │   ├── InterestListScreen.tsx
│   │   ├── PurchaseHistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── components/               # Screen-specific components
│       ├── SmartInputModal.tsx
│       ├── ListSuggestionDropdown.tsx
│       ├── ParsePreview.tsx
│       ├── InlineHighlight.tsx
│       ├── ItemCard.tsx
│       ├── ShoppingItemCard.tsx
│       ├── NoteCard.tsx
│       ├── MediaCard.tsx
│       ├── SectionHeader.tsx
│       ├── TotalBar.tsx
│       ├── SortingControls.tsx
│       ├── FilterChips.tsx
│       └── CategoryDropdown.tsx
│
└── design-system/                # ✅ PARCIALMENTE EXISTENTE
    ├── tokens/                   # ✅ Completo
    ├── theme/                    # ✅ Completo
    ├── atoms/                    # ✅ 10 componentes
    ├── molecules/                # 🔄 8 componentes (expandir)
    └── organisms/                # 🔄 3 componentes (expandir)

app/                              # Expo Router file-based routing
├── _layout.tsx                   # Root layout (providers)
├── (tabs)/                       # 🆕 Tab navigation
│   ├── _layout.tsx               # Bottombar layout
│   ├── index.tsx                 # Inbox
│   ├── search.tsx                # Search
│   ├── notes.tsx                 # Notes
│   └── lists.tsx                 # Lists
├── list/
│   └── [id].tsx                  # List detail
├── note/
│   └── [id].tsx                  # Note detail
├── shopping/
│   └── [id].tsx                  # Shopping list
├── history/
│   └── [listId].tsx              # Purchase history
└── settings.tsx                  # Settings

tests/
├── domain/                       # TDD: Write FIRST
│   ├── list/
│   ├── item/
│   ├── section/
│   └── ...
├── data/                         # TDD: Write FIRST
│   └── mappers/
├── infra/                        # Integration tests
│   └── repositories/
├── presentation/                 # Store tests
│   ├── stores/
│   └── hooks/
└── design-system/                # Component tests
    ├── atoms/
    ├── molecules/
    └── organisms/
```

**Structure Decision**: Mobile single-app com Clean Architecture. O projeto já possui a estrutura de diretórios configurada com path aliases. Os layers `data/`, `infra/repositories/`, e `presentation/` precisam ser implementados.

## Tracking de Complexidade

| Violação | Por que é necessário | Alternativa mais simples rejeitada porque |
|----------|---------------------|-------------------------------------------|
| 5 tipos de lista | Spec exige Notes, Shopping, Movies, Books, Games | Lista genérica única não atende requisitos de campos específicos |
| Discriminated unions | Type-safety para diferentes tipos de item | Union simples não permite TypeScript narrowing |
| 12+ repositories | ISP - Interface Segregation Principle | Repository único viola SRP e dificulta testes |
| 3 external providers | TMDb, Google Books, IGDB para enriquecimento | Sem dados externos, listas de interesse perdem valor |

---

## Checagem da Constituição (Pós-Design)

*Re-avaliação após Phase 1 design completo.*

### I. Qualidade de Código como Pré-requisito ✅

- [x] TypeScript strict mode habilitado
- [x] Path aliases configurados (`@domain/*`, `@presentation/*`, etc.)
- [x] ESLint com zero warnings policy
- [x] Componentes com `ReactElement` como tipo de retorno
- [x] Props em arquivos `.types.ts` separados

### II. Clean Architecture e Separação Clara de Camadas ✅

- [x] Domain layer sem imports React/RN (ESLint enforced)
- [x] Lógica de negócio em domain, não em UI
- [x] Repositories abstraídos via ports (interfaces)
- [x] Fluxo de dependências: `app → presentation → domain ← data → infra`
- [x] DI container em `src/app/di/container.ts`

### III. Cobertura de Testes Obrigatória ✅

- [x] TDD mandatory para domain layer (documentado em quickstart.md)
- [x] TDD mandatory para data layer mappers
- [x] Testes de stores planejados
- [x] Estrutura de testes definida (`tests/domain/`, `tests/data/`, etc.)

### IV. Design System Consistente ✅

- [x] Atomic Design (atoms → molecules → organisms)
- [x] CLI para criação de componentes (`npm run ds generate`)
- [x] Tokens via `useTheme()` (ESLint enforced)
- [x] Hierarquia de imports respeitada (ESLint `atomic-design-imports`)
- [x] Storybook para documentação visual

### V. Confiabilidade e Ausência de Bugs ✅

- [x] Pre-commit check: `npm test && npm run lint`
- [x] Operações assíncronas com loading/error/success states (stores)
- [x] Optimistic updates com rollback (padrão documentado)
- [x] Edge cases tratados (documentados em spec e contracts)

### VI. Performance Percebida ✅

- [x] Metas definidas: ≤100ms feedback, 60fps, <3s boot
- [x] Offline-first com SQLite local
- [x] Updates otimistas para UX instantânea
- [x] FlatList virtualizado para listas longas

**Status**: ✅ Todas as checagens passaram. Plano aprovado para Phase 2 (tasks).

---

## Artefatos Gerados

| Artefato | Path | Conteúdo |
|----------|------|----------|
| Plan | `specs/004-listify-core/plan.md` | Este documento |
| Research | `specs/004-listify-core/research.md` | Pesquisa técnica (Drizzle, Zustand, Expo Router, etc.) |
| Data Model | `specs/004-listify-core/data-model.md` | Entidades, schema SQLite, relacionamentos |
| Smart Input Contract | `specs/004-listify-core/contracts/smart-input-parser.contract.md` | Interface e regras do parser |
| Quickstart | `specs/004-listify-core/quickstart.md` | Guia de desenvolvimento |

**Próximo passo**: Execute `/speckit.tasks` para gerar a lista de tarefas ordenadas por dependência.

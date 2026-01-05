---
description: 'Lista de tarefas para implementar a feature 001-grocery-list'
---

# Tarefas: Listify — Lista Única de Compras

**Branch**: `001-grocery-list`  
**Versão alvo**: `v1.0 (MVP)`  
**Inputs**: `specs/001-grocery-list/spec.md`, `specs/001-grocery-list/plan.md`, `specs/001-grocery-list/data-model.md`, `specs/001-grocery-list/research.md`

**Definição de MVP (este repo)**: entregar **US1 (P1)** + base offline-first (SQLite) + resumo/topo e preço opcional conforme `plan.md`. Itens P2/P3 entram como **v1.1+** salvo indicação contrária.

**Internacionalização (obrigatório)**: o app deve estar disponível em **pt-BR** e **en** desde o MVP; todo texto de UI deve usar i18n (sem strings hard coded). Referência: `specs/001-grocery-list/spec.md` (seção “Internacionalização”) e `specs/001-grocery-list/plan.md` (pasta `src/app/i18n`).

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências diretas)
- **[Story]**: a qual user story pertence (US1…US8)
- Paths nas tarefas assumem a estrutura definida no `specs/001-grocery-list/plan.md` (Expo Router + `src/` + `tests/`)

---

## Fase 0: Bootstrap do app (bloqueante)

- [x] T001 Criar projeto Expo + Expo Router (TypeScript strict) com rotas em `app/` (`app/_layout.tsx`, `app/index.tsx`, `app/item/[id].tsx`)
- [x] T002 [P] Definir estrutura de pastas conforme `plan.md` (`src/domain`, `src/data`, `src/infra`, `src/presentation`, `src/design-system`, `tests/`)
- [x] T003 Configurar aliases TS (ex.: `@domain/*`, `@infra/*`) em `tsconfig.json` e ajustar imports-base
- [x] T004 [P] Configurar ESLint (TS strict) + regras de fronteira do domínio (proibir imports de RN/Expo em `src/domain/**`) + script `npm run lint`
- [x] T005 [P] Configurar Jest para testes puros de TypeScript (domínio) em `tests/` + script `npm test`
- [x] T005A [P] Configurar i18n (pt-BR + en): instalar `i18next`, `react-i18next`, `expo-localization`; criar init em `src/app/i18n/i18n.ts`; adicionar recursos `src/app/i18n/locales/{en,pt-BR}`; inicializar no bootstrap (`app/_layout.tsx` / `AppProviders`) e adotar `t()` nas telas do MVP

**Checkpoint**: `npm test` e `npm run lint` rodam; app abre e renderiza uma tela simples.

---

## Fase 1: Fundacional (offline-first + DI) — bloqueia US1

- [x] T006 [P] Criar composition root/DI: `src/app/di/types.ts` e `src/app/di/container.ts` (sem lib externa)
- [x] T007 Criar providers globais: `src/app/providers/AppProviders.tsx` (DI + tema + store)
- [x] T008 Implementar SQLite wrapper + migrações: `src/infra/storage/sqlite/SqliteDatabase.ts` e `src/infra/storage/sqlite/migrations/0001_init.sql`
- [x] T009 Implementar bootstrap do schema (PRAGMA `user_version`, migrate on start) e tratamento de falha de leitura (estado “recovery” em `presentation`)
- [x] T010 Implementar `ShoppingRepository` (port) em `src/domain/shopping/ports/ShoppingRepository.ts` (assinaturas mínimas do `data-model.md`)
- [x] T011 Implementar repo SQLite: `src/infra/storage/sqlite/ShoppingSqliteRepo.ts` com `getActiveList()`, `getCategories()`, `getItems(listId)`, `upsertItem()`, `deleteItem()`, `upsertCategory()`, `transaction()`
- [x] T012 Seed inicial: criar 1 lista ativa + categorias pré-definidas (FR-007) se o DB estiver vazio (dentro de transação)

**Checkpoint**: abrir o app cria DB local e retorna lista ativa + categorias + itens (vazio) sem crash.

---

## Fase 2: Design System (tokens + base visual) — bloqueante para as fases seguintes

- [x] T013 [P] Definir tokens de cores (neutros, primária, estados) em `src/design-system/tokens/colors.ts`
- [x] T014 [P] Definir tokens de tipografia (família, tamanhos, pesos, line-height) em `src/design-system/tokens/typography.ts`
- [x] T015 [P] Definir tokens de espaçamento, raios e sombras em `src/design-system/tokens/spacing.ts`, `src/design-system/tokens/radii.ts`, `src/design-system/tokens/shadows.ts`
- [x] T016 Definir tema base e exports unificados em `src/design-system/theme/theme.ts` e `src/design-system/tokens/index.ts`
- [x] T017 Adaptar a base de UI para usar tokens do design system (substituir valores hard coded) em `src/presentation/screens/ShoppingListScreen.tsx`, `src/presentation/screens/EditItemScreen.tsx`, `src/app/providers/AppProviders.tsx`, `src/app/index.tsx`

**Checkpoint**: tokens definidos e UI existente usando apenas tokens do design system.

---

## Fase 3: US1 (P1) — Capturar e concluir itens rapidamente 🎯 MVP

### Testes de domínio (TDD recomendado)

- [x] T018 [P] [US1] Implementar testes de `CreateItemFromFreeText` (defaults, `@categoria`, frações, vírgula, erro “nome vazio”) em `tests/domain/shopping/CreateItemFromFreeText.test.ts`
- [x] T019 [P] [US1] Implementar testes de `ToggleItemPurchased` (alternância, `purchasedAt`, reposicionamento básico “comprados ao final da categoria”) em `tests/domain/shopping/ToggleItemPurchased.test.ts`
- [x] T020 [P] [US1] Implementar testes de `UpdateItem` (regras de preço conforme spec, sem perder status) em `tests/domain/shopping/UpdateItem.test.ts`

### Domínio (entities, value objects, use cases)

- [x] T021 [P] [US1] Criar value objects: `src/domain/shopping/value-objects/Quantity.ts` e `src/domain/shopping/value-objects/Unit.ts` (normalização + parse)
- [x] T022 [P] [US1] Criar tipos/entidades: `src/domain/shopping/entities/ShoppingList.ts`, `src/domain/shopping/entities/ShoppingItem.ts`, `src/domain/shopping/entities/Category.ts`
- [x] T023 [US1] Implementar parsing de linha única (quantidade/unidade/nome/@categoria) em `src/domain/shopping/use-cases/CreateItemFromFreeText.ts`
- [x] T024 [US1] Implementar `ToggleItemPurchased` em `src/domain/shopping/use-cases/ToggleItemPurchased.ts`
- [x] T025 [US1] Implementar `UpdateItem` e `DeleteItem` em `src/domain/shopping/use-cases/UpdateItem.ts` e `src/domain/shopping/use-cases/DeleteItem.ts`
- [x] T026 [US1] Implementar `GetActiveListState` (shape “VM-friendly”) em `src/domain/shopping/use-cases/GetActiveListState.ts`

### Data/Infra (mappers + repositório)

- [x] T027 [P] [US1] Criar DTOs e mappers SQLite↔domínio: `src/data/shopping/mappers/*` (rows → entities; entities → params SQL)
- [x] T028 [US1] Ajustar `src/infra/storage/sqlite/ShoppingSqliteRepo.ts` para respeitar ordenação por `categoryId` + `status` + `position` e garantir posições consistentes ao inserir
- [x] T029 [US1] Garantir atomicidade das operações críticas via `transaction()` (create/toggle/update/delete)

### Presentation (telas + store + UX)

- [ ] T030 [P] [US1] Criar store/view-model Zustand: `src/presentation/state/shoppingListStore.ts` (carregar estado, ações async, optimistic UI + rollback)
- [ ] T031 [P] [US1] Criar hook `src/presentation/hooks/useShoppingListVM.ts` (selectors + actions)
- [ ] T032 [P] [US1] Criar componentes base: `src/presentation/components/AddItemInput.tsx`, `src/presentation/components/CategorySection.tsx`, `src/presentation/components/ShoppingItemRow.tsx`
- [ ] T033 [US1] Implementar tela principal: `src/presentation/screens/ShoppingListScreen.tsx` (agrupamento por categoria, “comprados ao final”, input fixo no rodapé)
- [ ] T034 [US1] Implementar fluxo de editar item via rota `app/item/[id].tsx` + screen `src/presentation/screens/EditItemScreen.tsx`
- [ ] T035 [US1] Implementar gesto simples de remover (ex.: swipe) + undo via snackbar/toast (presentation-level)
- [ ] T036 [US1] Implementar preview leve do parsing enquanto digita (sem bloquear): destaque/tooltip no `AddItemInput`
- [ ] T037 [US1] Implementar estado de erro não-bloqueante para falhas de escrita (FR-043) preservando texto digitado
- [ ] T038 [US1] Implementar estado de recovery (FR-044) com “tentar novamente” e “resetar dados locais” (com confirmação)

**Checkpoint**: US1 completa manualmente: adicionar por texto, agrupar por categoria, marcar comprado (mover ao final), editar e remover com UX robusta.

---

## Fase 4: US3 (P2) — Resumo e preços opcionais (incluído no v1.0 pelo `plan.md`)

- [ ] T039 [P] [US3] Criar util de dinheiro (minor units + formatação) em `src/domain/shopping/value-objects/Money.ts` (ou equivalente) + testes em `tests/domain/shopping/Money.test.ts`
- [ ] T040 [US3] Implementar regra de cálculo do resumo (contadores + gastos/estimativas) em `src/domain/shopping/use-cases/ComputeListSummary.ts` + testes em `tests/domain/shopping/ComputeListSummary.test.ts`
- [ ] T041 [US3] Adicionar bloco de resumo no topo em `src/presentation/components/ListSummaryHeader.tsx` (ocultar valores quando não calculáveis)
- [ ] T042 [US3] Implementar captura opcional de preço ao marcar como comprado (sheet/modal) respeitando `askPriceOnPurchase` em `src/presentation/components/PricePromptSheet.tsx`
- [ ] T043 [US3] Integrar `UpdateItem` para recalcular `unitPriceMinor/totalPriceMinor` ao editar quantidade/preço (spec “último campo editado”)

**Checkpoint**: com alguns itens precificados, resumo mostra contadores e valores; ao marcar comprado, app pode sugerir inserir preço sem bloquear fluxo.

---

## Fase 5: US4 (P3) — Busca e “ocultar comprados” (opcional v1.0; recomendado v1.1 se conflitar com DnD)

- [ ] T044 [P] [US4] Implementar busca por nome (client-side) no VM em `src/presentation/state/shoppingListStore.ts` (sem violar domínio)
- [ ] T045 [US4] Implementar toggle “ocultar comprados” na UI (comportamento local) e garantir que resumo permanece correto
- [ ] T046 [US4] Persistir preferência `hidePurchasedByDefault` em `lists` via `ShoppingRepository` (quando existir UI de configuração)

---

## v1.1+ (Backlog organizado por user story)

### US2 (P2) — Gestos avançados + drag-and-drop

- [ ] T047 [US2] Implementar drag-and-drop dentro e entre categorias, persistindo `position`/`categoryId` em `src/presentation/screens/ShoppingListScreen.tsx`
- [ ] T048 [US2] Definir estratégia consistente com “ocultar comprados” (reordenar visíveis sem quebrar ordem dos comprados)
- [ ] T049 [US2] Testes de integração (quando aplicável) para reorder/move garantindo atomicidade no repo SQLite

### US5/US6 (P3) — Histórico, concluir e reuso

- [ ] T050 [US5] Modelar storage de histórico (snapshot JSON ou tabelas) e migração `0002_add_history.sql` em `src/infra/storage/sqlite/migrations/`
- [ ] T051 [US6] Implementar “concluir compra” (snapshot + reset lista ativa) e “reiniciar” (sem histórico) com confirmações
- [ ] T052 [US5] Implementar tela de histórico + ação de reuso (incremental/substituir) com confirmação explícita

### US7/US8 (P3) — Localização e configurações

- [ ] T053 [US8] Implementar tela de configurações (`app/settings.tsx`) e persistir preferências (moeda, askPriceOnPurchase, hidePurchasedByDefault)
- [ ] T054 [US7] Implementar associação de local à lista e lembrete por proximidade (opt-in) com cooldown (FR-046)
- [ ] T055 [US7] Tratar permissões (negado/limitado) sem quebrar fluxo principal e com orientação clara

---

## Validação final (por release)

- [ ] T056 Rodar `npm test && npm run lint`
- [ ] T057 Revisar `specs/001-grocery-list/quickstart.md` e atualizar comandos/paths conforme implementação real

---

description: "Lista de tarefas para implementar a feature 001-grocery-list"

---

# Tarefas: Listify — Lista Única de Compras

**Branch**: `001-grocery-list`  
**Versão alvo**: `v1.0 (MVP)`  
**Inputs**: `specs/001-grocery-list/spec.md`, `specs/001-grocery-list/plan.md`, `specs/001-grocery-list/data-model.md`, `specs/001-grocery-list/research.md`

**Definição de MVP (este repo)**: entregar **US1 (P1)** + base offline-first (SQLite) + resumo/topo e preço opcional conforme `plan.md`. Itens P2/P3 entram como **v1.1+** salvo indicação contrária.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências diretas)
- **[Story]**: a qual user story pertence (US1…US8)
- Paths nas tarefas assumem a estrutura definida no `specs/001-grocery-list/plan.md` (Expo Router + `src/` + `tests/`)

---

## Fase 0: Bootstrap do app (bloqueante)

- [X] T001 Criar projeto Expo + Expo Router (TypeScript strict) com rotas em `app/` (`app/_layout.tsx`, `app/index.tsx`, `app/item/[id].tsx`)
- [X] T002 [P] Definir estrutura de pastas conforme `plan.md` (`src/domain`, `src/data`, `src/infra`, `src/presentation`, `src/design-system`, `tests/`)
- [X] T003 Configurar aliases TS (ex.: `@domain/*`, `@infra/*`) em `tsconfig.json` e ajustar imports-base
- [X] T004 [P] Configurar ESLint (TS strict) + regras de fronteira do domínio (proibir imports de RN/Expo em `src/domain/**`) + script `npm run lint`
- [X] T005 [P] Configurar Jest para testes puros de TypeScript (domínio) em `tests/` + script `npm test`

**Checkpoint**: `npm test` e `npm run lint` rodam; app abre e renderiza uma tela simples.

---

## Fase 1: Fundacional (offline-first + DI) — bloqueia US1

- [ ] T006 [P] Criar composition root/DI: `src/app/di/types.ts` e `src/app/di/container.ts` (sem lib externa)
- [ ] T007 Criar providers globais: `src/app/providers/AppProviders.tsx` (DI + tema + store)
- [ ] T008 Implementar SQLite wrapper + migrações: `src/infra/storage/sqlite/SqliteDatabase.ts` e `src/infra/storage/sqlite/migrations/0001_init.sql`
- [ ] T009 Implementar bootstrap do schema (PRAGMA `user_version`, migrate on start) e tratamento de falha de leitura (estado “recovery” em `presentation`)
- [ ] T010 Implementar `ShoppingRepository` (port) em `src/domain/shopping/ports/ShoppingRepository.ts` (assinaturas mínimas do `data-model.md`)
- [ ] T011 Implementar repo SQLite: `src/infra/storage/sqlite/ShoppingSqliteRepo.ts` com `getActiveList()`, `getCategories()`, `getItems(listId)`, `upsertItem()`, `deleteItem()`, `upsertCategory()`, `transaction()`
- [ ] T012 Seed inicial: criar 1 lista ativa + categorias pré-definidas (FR-007) se o DB estiver vazio (dentro de transação)

**Checkpoint**: abrir o app cria DB local e retorna lista ativa + categorias + itens (vazio) sem crash.

---

## Fase 2: US1 (P1) — Capturar e concluir itens rapidamente 🎯 MVP

### Testes de domínio (TDD recomendado)

- [ ] T020 [P] [US1] Implementar testes de `CreateItemFromFreeText` (defaults, `@categoria`, frações, vírgula, erro “nome vazio”) em `tests/domain/shopping/CreateItemFromFreeText.test.ts`
- [ ] T021 [P] [US1] Implementar testes de `ToggleItemPurchased` (alternância, `purchasedAt`, reposicionamento básico “comprados ao final da categoria”) em `tests/domain/shopping/ToggleItemPurchased.test.ts`
- [ ] T022 [P] [US1] Implementar testes de `UpdateItem` (regras de preço conforme spec, sem perder status) em `tests/domain/shopping/UpdateItem.test.ts`

### Domínio (entities, value objects, use cases)

- [ ] T023 [P] [US1] Criar value objects: `src/domain/shopping/value-objects/Quantity.ts` e `src/domain/shopping/value-objects/Unit.ts` (normalização + parse)
- [ ] T024 [P] [US1] Criar tipos/entidades: `src/domain/shopping/entities/ShoppingList.ts`, `src/domain/shopping/entities/ShoppingItem.ts`, `src/domain/shopping/entities/Category.ts`
- [ ] T025 [US1] Implementar parsing de linha única (quantidade/unidade/nome/@categoria) em `src/domain/shopping/use-cases/CreateItemFromFreeText.ts`
- [ ] T026 [US1] Implementar `ToggleItemPurchased` em `src/domain/shopping/use-cases/ToggleItemPurchased.ts`
- [ ] T027 [US1] Implementar `UpdateItem` e `DeleteItem` em `src/domain/shopping/use-cases/UpdateItem.ts` e `src/domain/shopping/use-cases/DeleteItem.ts`
- [ ] T028 [US1] Implementar `GetActiveListState` (shape “VM-friendly”) em `src/domain/shopping/use-cases/GetActiveListState.ts`

### Data/Infra (mappers + repositório)

- [ ] T029 [P] [US1] Criar DTOs e mappers SQLite↔domínio: `src/data/shopping/mappers/*` (rows → entities; entities → params SQL)
- [ ] T030 [US1] Ajustar `src/infra/storage/sqlite/ShoppingSqliteRepo.ts` para respeitar ordenação por `categoryId` + `status` + `position` e garantir posições consistentes ao inserir
- [ ] T031 [US1] Garantir atomicidade das operações críticas via `transaction()` (create/toggle/update/delete)

### Presentation (telas + store + UX)

- [ ] T032 [P] [US1] Criar store/view-model Zustand: `src/presentation/state/shoppingListStore.ts` (carregar estado, ações async, optimistic UI + rollback)
- [ ] T033 [P] [US1] Criar hook `src/presentation/hooks/useShoppingListVM.ts` (selectors + actions)
- [ ] T034 [P] [US1] Criar componentes base: `src/presentation/components/AddItemInput.tsx`, `src/presentation/components/CategorySection.tsx`, `src/presentation/components/ShoppingItemRow.tsx`
- [ ] T035 [US1] Implementar tela principal: `src/presentation/screens/ShoppingListScreen.tsx` (agrupamento por categoria, “comprados ao final”, input fixo no rodapé)
- [ ] T036 [US1] Implementar fluxo de editar item via rota `app/item/[id].tsx` + screen `src/presentation/screens/EditItemScreen.tsx`
- [ ] T037 [US1] Implementar gesto simples de remover (ex.: swipe) + undo via snackbar/toast (presentation-level)
- [ ] T038 [US1] Implementar preview leve do parsing enquanto digita (sem bloquear): destaque/tooltip no `AddItemInput`
- [ ] T039 [US1] Implementar estado de erro não-bloqueante para falhas de escrita (FR-043) preservando texto digitado
- [ ] T040 [US1] Implementar estado de recovery (FR-044) com “tentar novamente” e “resetar dados locais” (com confirmação)

**Checkpoint**: US1 completa manualmente: adicionar por texto, agrupar por categoria, marcar comprado (mover ao final), editar e remover com UX robusta.

---

## Fase 3: US3 (P2) — Resumo e preços opcionais (incluído no v1.0 pelo `plan.md`)

- [ ] T050 [P] [US3] Criar util de dinheiro (minor units + formatação) em `src/domain/shopping/value-objects/Money.ts` (ou equivalente) + testes em `tests/domain/shopping/Money.test.ts`
- [ ] T051 [US3] Implementar regra de cálculo do resumo (contadores + gastos/estimativas) em `src/domain/shopping/use-cases/ComputeListSummary.ts` + testes em `tests/domain/shopping/ComputeListSummary.test.ts`
- [ ] T052 [US3] Adicionar bloco de resumo no topo em `src/presentation/components/ListSummaryHeader.tsx` (ocultar valores quando não calculáveis)
- [ ] T053 [US3] Implementar captura opcional de preço ao marcar como comprado (sheet/modal) respeitando `askPriceOnPurchase` em `src/presentation/components/PricePromptSheet.tsx`
- [ ] T054 [US3] Integrar `UpdateItem` para recalcular `unitPriceMinor/totalPriceMinor` ao editar quantidade/preço (spec “último campo editado”)

**Checkpoint**: com alguns itens precificados, resumo mostra contadores e valores; ao marcar comprado, app pode sugerir inserir preço sem bloquear fluxo.

---

## Fase 4: US4 (P3) — Busca e “ocultar comprados” (opcional v1.0; recomendado v1.1 se conflitar com DnD)

- [ ] T060 [P] [US4] Implementar busca por nome (client-side) no VM em `src/presentation/state/shoppingListStore.ts` (sem violar domínio)
- [ ] T061 [US4] Implementar toggle “ocultar comprados” na UI (comportamento local) e garantir que resumo permanece correto
- [ ] T062 [US4] Persistir preferência `hidePurchasedByDefault` em `lists` via `ShoppingRepository` (quando existir UI de configuração)

---

## v1.1+ (Backlog organizado por user story)

### US2 (P2) — Gestos avançados + drag-and-drop

- [ ] T100 [US2] Implementar drag-and-drop dentro e entre categorias, persistindo `position`/`categoryId` em `src/presentation/screens/ShoppingListScreen.tsx`
- [ ] T101 [US2] Definir estratégia consistente com “ocultar comprados” (reordenar visíveis sem quebrar ordem dos comprados)
- [ ] T102 [US2] Testes de integração (quando aplicável) para reorder/move garantindo atomicidade no repo SQLite

### US5/US6 (P3) — Histórico, concluir e reuso

- [ ] T110 [US5] Modelar storage de histórico (snapshot JSON ou tabelas) e migração `0002_add_history.sql` em `src/infra/storage/sqlite/migrations/`
- [ ] T111 [US6] Implementar “concluir compra” (snapshot + reset lista ativa) e “reiniciar” (sem histórico) com confirmações
- [ ] T112 [US5] Implementar tela de histórico + ação de reuso (incremental/substituir) com confirmação explícita

### US7/US8 (P3) — Localização e configurações

- [ ] T120 [US8] Implementar tela de configurações (`app/settings.tsx`) e persistir preferências (moeda, askPriceOnPurchase, hidePurchasedByDefault)
- [ ] T121 [US7] Implementar associação de local à lista e lembrete por proximidade (opt-in) com cooldown (FR-046)
- [ ] T122 [US7] Tratar permissões (negado/limitado) sem quebrar fluxo principal e com orientação clara

---

## Validação final (por release)

- [ ] T900 Rodar `npm test && npm run lint`
- [ ] T901 Revisar `specs/001-grocery-list/quickstart.md` e atualizar comandos/paths conforme implementação real

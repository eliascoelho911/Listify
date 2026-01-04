# Data Model — Listify (v1.0)

**Data**: 2026-01-04 | **Spec**: `specs/001-grocery-list/spec.md`

Este documento descreve o modelo de dados e um esquema inicial de persistência para o MVP (v1.0), mantendo compatibilidade com evoluções (v1.1/v2.0).

## 1) Modelo de domínio (resumo)

> Campos e regras detalhadas estão na spec; aqui fica o “espelho” em formato de referência.

### `ShoppingList`

- `id: UUID`
- `createdAt`, `updatedAt`
- `currencyCode` (default `BRL`)
- `isCompleted`, `completedAt?`
- `hidePurchasedByDefault`
- `askPriceOnPurchase`
- `location?` (v1.1+ recomendado)

### `ShoppingItem`

- `id: UUID`, `listId: UUID`
- `name: string` (não vazio)
- `quantity: Quantity` (default `1`)
- `unit: Unit` (default `un`)
- `categoryId: UUID`
- `status: "pending" | "purchased"`
- `position: number`
- `createdAt`, `updatedAt`, `purchasedAt?`
- `unitPriceMinor?`, `totalPriceMinor?` (inteiros)

### `Category`

- `id: UUID`
- `name: string` (único case-insensitive)
- `isPredefined: boolean`
- `sortOrder: number`

## 2) Ports (interfaces do domínio)

### `ShoppingRepository`

- Fonte de verdade do estado da lista ativa (items/categorias/lista).
- Implementação concreta prevista: `src/infra/storage/sqlite/ShoppingSqliteRepo.ts`.

Operações mínimas (v1.0):

- `getActiveList()`
- `getCategories()`
- `getItems(listId)`
- `upsertItem(item)`
- `deleteItem(id)`
- `upsertCategory(category)`
- `transaction(fn)`

## 3) Esquema SQLite (v1.0)

> Proposta focada em simplicidade e migração previsível. O MVP assume “1 lista ativa”, mas modela por `list_id` para facilitar evolução.

### 3.1 Tabelas

```sql
-- lists
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  is_completed INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  hide_purchased_by_default INTEGER NOT NULL DEFAULT 0,
  ask_price_on_purchase INTEGER NOT NULL DEFAULT 0
);

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE,
  is_predefined INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name_unique ON categories(name);

-- items
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY NOT NULL,
  list_id TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity_num TEXT NOT NULL,          -- decimal como string (evita float)
  unit TEXT NOT NULL,
  category_id TEXT NOT NULL,
  status TEXT NOT NULL,                -- "pending" | "purchased"
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  purchased_at TEXT,
  unit_price_minor INTEGER,
  total_price_minor INTEGER,
  FOREIGN KEY(list_id) REFERENCES lists(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_items_list_category ON items(list_id, category_id);
CREATE INDEX IF NOT EXISTS idx_items_list_status ON items(list_id, status);
CREATE INDEX IF NOT EXISTS idx_items_list_name ON items(list_id, name);
```

### 3.2 Observações do schema

- `quantity_num` como `TEXT`: preserva precisão (ex.: “0.5”, “2.125”) sem depender de `REAL`.
- `status` como `TEXT` por legibilidade; pode virar `INTEGER` em otimização futura.
- Índices focam em listagem agrupada e busca por nome.

## 4) Migrações

Estratégia recomendada:

- `PRAGMA user_version` como versão do schema.
- Migrações em `src/infra/storage/sqlite/migrations/` com incremento monotônico:
  - `0001_init.sql` (tabelas base)
  - `0002_add_history.sql` (v1.1)

## 5) Evolução planejada (v1.1+)

### Histórico (v1.1)

Opções:

1) **Snapshot JSON** por compra concluída (mais simples; menos consultável).
2) **Tabelas normalizadas** `history_entries`, `history_items` (melhor para consultas/estatísticas).

Recomendação: começar com **snapshot JSON** (se v1.1 precisar rápido) e migrar para tabelas normalizadas em v2.0 se necessário.

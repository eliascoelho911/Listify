# Data Model: Listify Core

**Branch**: `004-listify-core` | **Data**: 2026-01-20 | **Plan**: [plan.md](./plan.md)

Este documento descreve o modelo de dados do Listify Core, incluindo entidades de domínio, schema SQLite e relacionamentos.

---

## 1. Visão Geral das Entidades

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           LISTIFY DATA MODEL                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────┐       1:N        ┌───────────┐       1:N       ┌──────┐  │
│   │   User   │─────────────────▶│   List    │────────────────▶│Section│  │
│   └──────────┘                  └───────────┘                 └──────┘  │
│        │                              │                           │      │
│        │ 1:1                          │ 1:N                      │ 1:N  │
│        ▼                              ▼                          ▼      │
│   ┌──────────────┐              ┌───────────┐                ┌──────┐  │
│   │UserPreferences│              │   Item    │◀───────────────│      │  │
│   └──────────────┘              └───────────┘                └──────┘  │
│                                       │                                  │
│                                       │ (shopping only)                  │
│                                       ▼                                  │
│                              ┌─────────────────┐                        │
│                              │PurchaseHistory  │                        │
│                              └─────────────────┘                        │
│                                                                          │
│   ┌───────────────────┐                                                 │
│   │SearchHistoryEntry │ (standalone, não relacionado)                   │
│   └───────────────────┘                                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Entidades de Domínio

### 2.1 List (Discriminated Union)

A entidade `List` representa um agrupador de itens. Usa discriminated union com `listType` como discriminador.

```typescript
// Tipos
type ListType = 'notes' | 'shopping' | 'movies' | 'books' | 'games';

type BaseList = Entity & Timestamped & {
  name: string;
  description?: string;
  isPrefabricated: boolean;
};

type NotesList = BaseList & { listType: 'notes' };      // Única, pré-fabricada
type ShoppingList = BaseList & { listType: 'shopping' }; // Múltiplas
type MoviesList = BaseList & { listType: 'movies' };    // Múltiplas
type BooksList = BaseList & { listType: 'books' };      // Múltiplas
type GamesList = BaseList & { listType: 'games' };      // Múltiplas

type List = NotesList | ShoppingList | MoviesList | BooksList | GamesList;
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `name` | string | ✅ | Nome da lista |
| `description` | string | ❌ | Descrição opcional |
| `listType` | ListType | ✅ | Tipo da lista (discriminador) |
| `isPrefabricated` | boolean | ✅ | Se é lista pré-fabricada (Notas) |
| `createdAt` | Date | ✅ | Data de criação |
| `updatedAt` | Date | ✅ | Data de atualização |

**Regras de Negócio**:
- Lista de Notas (`listType: 'notes'`) é única e `isPrefabricated: true`
- Usuário não pode criar, renomear ou excluir a lista de Notas
- Outras listas (`shopping`, `movies`, `books`, `games`) podem ser múltiplas
- Nome único por `listType` (não pode ter duas "Mercado" do tipo shopping)

---

### 2.2 Item (Discriminated Union)

A entidade `Item` representa um item dentro de uma lista. Usa discriminated union com `type` como discriminador.

```typescript
// Metadados de provedores externos
type BaseMetadata = {
  coverUrl?: string;
  description?: string;
  releaseDate?: string;
  rating?: number;
};

type MovieMetadata = BaseMetadata & { category: 'movie'; cast?: string[] };
type BookMetadata = BaseMetadata & { category: 'book'; authors?: string[] };
type GameMetadata = BaseMetadata & { category: 'game'; developer?: string };

// Tipos de item
type ItemType = 'note' | 'shopping' | 'movie' | 'book' | 'game';

type BaseItem = Entity & Sortable & Timestamped & {
  listId?: string;     // Opcional: item pode estar na Inbox sem lista
  sectionId?: string;  // Opcional: item pode estar fora de seção
  title: string;
};

type NoteItem = BaseItem & { type: 'note'; description?: string };
type ShoppingItem = BaseItem & { type: 'shopping'; quantity?: string; price?: number; isChecked?: boolean };
type MovieItem = BaseItem & { type: 'movie'; externalId?: string; metadata?: MovieMetadata; isChecked?: boolean };
type BookItem = BaseItem & { type: 'book'; externalId?: string; metadata?: BookMetadata; isChecked?: boolean };
type GameItem = BaseItem & { type: 'game'; externalId?: string; metadata?: GameMetadata; isChecked?: boolean };

type Item = NoteItem | ShoppingItem | MovieItem | BookItem | GameItem;
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `listId` | string | ❌ | FK para List (null = Inbox) |
| `sectionId` | string | ❌ | FK para Section |
| `title` | string | ✅ | Título do item |
| `type` | ItemType | ✅ | Tipo do item (discriminador) |
| `sortOrder` | number | ✅ | Ordem para drag & drop |
| `description` | string | ❌ | (note) Conteúdo markdown |
| `quantity` | string | ❌ | (shopping) Ex: "2kg", "500ml" |
| `price` | number | ❌ | (shopping) Valor em reais |
| `isChecked` | boolean | ❌ | (shopping/interest) Marcado/consumido |
| `externalId` | string | ❌ | (interest) ID no provedor externo |
| `metadata` | JSON | ❌ | (interest) Dados do provedor |
| `createdAt` | Date | ✅ | Data de criação |
| `updatedAt` | Date | ✅ | Data de atualização |

**Regras de Negócio**:
- Tipo do item deve corresponder ao `listType` da lista associada
- `NoteItem` só pode estar em lista `notes`
- `ShoppingItem` só pode estar em lista `shopping`
- etc.
- Item sem `listId` aparece na Inbox
- Item sem `sectionId` aparece no topo da lista (antes das seções)
- `sortOrder` é único por escopo (lista + seção)

---

### 2.3 Section

A entidade `Section` representa uma seção dentro de uma lista para organização visual.

```typescript
type Section = Entity & Sortable & Timestamped & {
  listId: string;  // FK obrigatória
  name: string;
};
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `listId` | string | ✅ | FK para List |
| `name` | string | ✅ | Nome da seção |
| `sortOrder` | number | ✅ | Ordem da seção na lista |
| `createdAt` | Date | ✅ | Data de criação |
| `updatedAt` | Date | ✅ | Data de atualização |

**Regras de Negócio**:
- Seções são específicas por lista (não globais)
- Nome único dentro da mesma lista
- Ao excluir seção, itens ficam sem seção (não são excluídos)
- `sortOrder` é único por lista

---

### 2.4 User

A entidade `User` representa o perfil local do usuário.

```typescript
type User = Entity & Timestamped & {
  name: string;
  email: string;
  photoUrl?: string;
};
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `name` | string | ✅ | Nome do usuário |
| `email` | string | ✅ | Email do usuário |
| `photoUrl` | string | ❌ | URL da foto de perfil |
| `createdAt` | Date | ✅ | Data de criação |
| `updatedAt` | Date | ✅ | Data de atualização |

**Regras de Negócio**:
- MVP: usuário único local (sem autenticação)
- Criado automaticamente no primeiro boot do app

---

### 2.5 UserPreferences

A entidade `UserPreferences` armazena configurações do usuário.

```typescript
type Theme = 'light' | 'dark' | 'auto';

type LayoutConfig<GroupCriteria> = {
  groupBy: GroupCriteria;
  sortDirection: 'asc' | 'desc';
};

type LayoutConfigs = Record<string, LayoutConfig<ItemGroupCriteria>>;
// Chaves: listId | 'inbox' | 'notes'

type UserPreferences = Entity & Timestamped & {
  userId: string;
  theme: Theme;
  primaryColor?: string;
  layoutConfigs: LayoutConfigs;
};
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `userId` | string | ✅ | FK para User |
| `theme` | Theme | ✅ | Tema do app |
| `primaryColor` | string | ❌ | Cor de destaque (hex) |
| `layoutConfigs` | JSON | ✅ | Configurações de layout por tela |
| `createdAt` | Date | ✅ | Data de criação |
| `updatedAt` | Date | ✅ | Data de atualização |

**Regras de Negócio**:
- 1:1 com User
- Criado junto com User no primeiro boot
- `layoutConfigs` armazena agrupamento e ordenação por tela/lista

---

### 2.6 PurchaseHistory

A entidade `PurchaseHistory` armazena snapshots de compras concluídas.

```typescript
type PurchaseHistorySection = {
  originalSectionId: string;
  name: string;
  sortOrder: number;
};

type PurchaseHistoryItem = {
  originalItemId: string;
  sectionId?: string;
  title: string;
  quantity?: string;
  price?: number;
  sortOrder: number;
  wasChecked: boolean;
};

type PurchaseHistory = Entity & Timestamped & {
  listId: string;
  purchaseDate: Date;
  totalValue: number;
  sections: PurchaseHistorySection[];  // JSON
  items: PurchaseHistoryItem[];        // JSON
};
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `listId` | string | ✅ | FK para List (shopping) |
| `purchaseDate` | Date | ✅ | Data da compra |
| `totalValue` | number | ✅ | Total da compra |
| `sections` | JSON | ✅ | Snapshot das seções |
| `items` | JSON | ✅ | Snapshot dos itens |
| `createdAt` | Date | ✅ | Data de criação |
| `updatedAt` | Date | ✅ | Data de atualização |

**Regras de Negócio**:
- Snapshot imutável (não referencia items atuais)
- Só para listas do tipo `shopping`
- Criado ao "Concluir compra"
- Items guardam `wasChecked` para saber quais foram comprados

---

### 2.7 SearchHistoryEntry

A entidade `SearchHistoryEntry` armazena buscas recentes.

```typescript
type SearchHistoryEntry = {
  id: string;
  query: string;
  searchedAt: Date;
};
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | string (UUID) | ✅ | Identificador único |
| `query` | string | ✅ | Termo buscado |
| `searchedAt` | Date | ✅ | Data da busca |

**Regras de Negócio**:
- Máximo 10 entradas (FIFO)
- Busca duplicada atualiza `searchedAt` ao invés de criar nova

---

## 3. Persistence Contracts (Data Layer)

Os tipos de row são definidos em `src/data/persistence/` como **contratos** que o Drizzle schema deve implementar. Isso segue o Dependency Inversion Principle e facilita cloud sync futuro.

```typescript
// src/data/persistence/list.persistence.ts
export interface ListRow {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
  is_prefabricated: number; // 0 | 1
  created_at: number;
  updated_at: number;
}

// src/data/persistence/item.persistence.ts
export interface ItemRow {
  id: string;
  list_id: string | null;
  section_id: string | null;
  title: string;
  type: string;
  sort_order: number;
  description: string | null;
  quantity: string | null;
  price: number | null;
  is_checked: number | null;
  external_id: string | null;
  metadata: string | null; // JSON string
  created_at: number;
  updated_at: number;
}

// src/data/persistence/section.persistence.ts
export interface SectionRow {
  id: string;
  list_id: string;
  name: string;
  sort_order: number;
  created_at: number;
  updated_at: number;
}
```

**Fluxo**: `domain ← data/mappers ← data/persistence ← infra/drizzle`

---

## 4. Schema SQLite (Drizzle ORM)

O schema Drizzle deve produzir rows compatíveis com os contratos definidos em `data/persistence/`.

```typescript
// src/infra/drizzle/schema.ts
import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

// ============================================
// LISTS
// ============================================
export const lists = sqliteTable('lists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  listType: text('list_type').notNull(), // 'notes' | 'shopping' | 'movies' | 'books' | 'games'
  isPrefabricated: integer('is_prefabricated', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('lists_list_type_idx').on(table.listType),
  uniqueIndex('lists_name_type_unique').on(table.name, table.listType),
]);

// ============================================
// SECTIONS
// ============================================
export const sections = sqliteTable('sections', {
  id: text('id').primaryKey(),
  listId: text('list_id').notNull().references(() => lists.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('sections_list_id_idx').on(table.listId),
  uniqueIndex('sections_list_name_unique').on(table.listId, table.name),
]);

// ============================================
// ITEMS
// ============================================
export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  listId: text('list_id').references(() => lists.id, { onDelete: 'set null' }),
  sectionId: text('section_id').references(() => sections.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'note' | 'shopping' | 'movie' | 'book' | 'game'
  sortOrder: integer('sort_order').notNull().default(0),
  // Note fields
  description: text('description'),
  // Shopping fields
  quantity: text('quantity'),
  price: real('price'),
  isChecked: integer('is_checked', { mode: 'boolean' }).default(false),
  // Interest fields
  externalId: text('external_id'),
  metadata: text('metadata', { mode: 'json' }), // JSON string
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('items_list_id_idx').on(table.listId),
  index('items_section_id_idx').on(table.sectionId),
  index('items_type_idx').on(table.type),
  index('items_created_at_idx').on(table.createdAt),
  index('items_title_idx').on(table.title),
]);

// ============================================
// USERS
// ============================================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  photoUrl: text('photo_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// ============================================
// USER PREFERENCES
// ============================================
export const userPreferences = sqliteTable('user_preferences', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  theme: text('theme').notNull().default('dark'), // 'light' | 'dark' | 'auto'
  primaryColor: text('primary_color'),
  layoutConfigs: text('layout_configs', { mode: 'json' }).notNull().default('{}'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  uniqueIndex('user_preferences_user_id_unique').on(table.userId),
]);

// ============================================
// PURCHASE HISTORY
// ============================================
export const purchaseHistory = sqliteTable('purchase_history', {
  id: text('id').primaryKey(),
  listId: text('list_id').notNull().references(() => lists.id, { onDelete: 'cascade' }),
  purchaseDate: integer('purchase_date', { mode: 'timestamp' }).notNull(),
  totalValue: real('total_value').notNull().default(0),
  sections: text('sections', { mode: 'json' }).notNull().default('[]'),
  items: text('items', { mode: 'json' }).notNull().default('[]'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  index('purchase_history_list_id_idx').on(table.listId),
  index('purchase_history_purchase_date_idx').on(table.purchaseDate),
]);

// ============================================
// SEARCH HISTORY
// ============================================
export const searchHistory = sqliteTable('search_history', {
  id: text('id').primaryKey(),
  query: text('query').notNull(),
  searchedAt: integer('searched_at', { mode: 'timestamp' }).notNull(),
}, (table) => [
  uniqueIndex('search_history_query_unique').on(table.query),
  index('search_history_searched_at_idx').on(table.searchedAt),
]);
```

---

## 5. Relacionamentos

```text
User (1) ─────────────────── (1) UserPreferences
  │
  │ implícito (MVP: usuário único)
  ▼
List (1) ─────────────────── (N) Section
  │                              │
  │ 1:N                          │ 1:N
  ▼                              ▼
Item ◀────────────────────────────┘
  │
  │ (apenas shopping)
  ▼
PurchaseHistory (snapshot imutável)

SearchHistoryEntry (standalone)
```

### Comportamento de Cascata

| Relação | ON DELETE |
|---------|-----------|
| List → Section | CASCADE |
| List → Item | SET NULL |
| Section → Item | SET NULL |
| User → UserPreferences | CASCADE |
| List → PurchaseHistory | CASCADE |

---

## 6. Índices para Performance

| Tabela | Índice | Colunas | Propósito |
|--------|--------|---------|-----------|
| lists | lists_list_type_idx | listType | Filtrar por tipo |
| lists | lists_name_type_unique | name, listType | Unicidade |
| sections | sections_list_id_idx | listId | FK lookup |
| sections | sections_list_name_unique | listId, name | Unicidade |
| items | items_list_id_idx | listId | Listar itens de lista |
| items | items_section_id_idx | sectionId | Listar itens de seção |
| items | items_type_idx | type | Filtrar por tipo |
| items | items_created_at_idx | createdAt | Ordenação Inbox |
| items | items_title_idx | title | Busca full-text |
| purchase_history | purchase_history_list_id_idx | listId | Histórico por lista |
| purchase_history | purchase_history_purchase_date_idx | purchaseDate | Ordenação |
| search_history | search_history_query_unique | query | Dedup |
| search_history | search_history_searched_at_idx | searchedAt | Ordenação |

---

## 7. Migrações

### Migration 0001: Initial Schema

```sql
-- 0001_initial_schema.sql
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  list_type TEXT NOT NULL,
  is_prefabricated INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX lists_list_type_idx ON lists(list_type);
CREATE UNIQUE INDEX lists_name_type_unique ON lists(name, list_type);

CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX sections_list_id_idx ON sections(list_id);
CREATE UNIQUE INDEX sections_list_name_unique ON sections(list_id, name);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  list_id TEXT REFERENCES lists(id) ON DELETE SET NULL,
  section_id TEXT REFERENCES sections(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  quantity TEXT,
  price REAL,
  is_checked INTEGER DEFAULT 0,
  external_id TEXT,
  metadata TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX items_list_id_idx ON items(list_id);
CREATE INDEX items_section_id_idx ON items(section_id);
CREATE INDEX items_type_idx ON items(type);
CREATE INDEX items_created_at_idx ON items(created_at);
CREATE INDEX items_title_idx ON items(title);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  photo_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark',
  primary_color TEXT,
  layout_configs TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX user_preferences_user_id_unique ON user_preferences(user_id);

CREATE TABLE IF NOT EXISTS purchase_history (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  purchase_date INTEGER NOT NULL,
  total_value REAL NOT NULL DEFAULT 0,
  sections TEXT NOT NULL DEFAULT '[]',
  items TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX purchase_history_list_id_idx ON purchase_history(list_id);
CREATE INDEX purchase_history_purchase_date_idx ON purchase_history(purchase_date);

CREATE TABLE IF NOT EXISTS search_history (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  searched_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX search_history_query_unique ON search_history(query);
CREATE INDEX search_history_searched_at_idx ON search_history(searched_at);
```

### Migration 0002: Seed Prefabricated Notes List

```sql
-- 0002_seed_notes_list.sql
INSERT INTO lists (id, name, description, list_type, is_prefabricated, created_at, updated_at)
VALUES (
  'prefab-notes-list',
  'Notas',
  'Lista de notas pré-fabricada',
  'notes',
  1,
  strftime('%s', 'now') * 1000,
  strftime('%s', 'now') * 1000
);
```

---

## 8. Validações de Domínio

| Regra | Tabela | Validação |
|-------|--------|-----------|
| Nome obrigatório | lists, sections | NOT NULL |
| Nome único por tipo | lists | UNIQUE(name, list_type) |
| Nome único por lista | sections | UNIQUE(list_id, name) |
| Tipo válido (list) | lists | CHECK ou app-level |
| Tipo válido (item) | items | CHECK ou app-level |
| Item-List type match | items | App-level (domain) |
| Max 10 search entries | search_history | App-level (FIFO delete) |

---

## 9. Transições de Estado

### Item de Compras

```text
                    ┌─────────────┐
                    │  UNCHECKED  │
                    │ isChecked=0 │
                    └──────┬──────┘
                           │
                           │ marcar
                           ▼
                    ┌─────────────┐
                    │   CHECKED   │
                    │ isChecked=1 │
                    └──────┬──────┘
                           │
                           │ concluir compra
                           ▼
                    ┌─────────────┐
                    │  UNCHECKED  │ (reset)
                    │ isChecked=0 │
                    └─────────────┘
```

### Item de Interesse (Filme/Livro/Game)

```text
                    ┌─────────────┐
                    │  UNWATCHED  │ (para assistir/ler/jogar)
                    │ isChecked=0 │
                    └──────┬──────┘
                           │
                           │ marcar como consumido
                           ▼
                    ┌─────────────┐
                    │   WATCHED   │ (visto/lido/jogado)
                    │ isChecked=1 │
                    └─────────────┘
```

---

## Conclusão

O modelo de dados está completo e pronto para implementação:

- ✅ 7 entidades definidas com tipos TypeScript
- ✅ Schema Drizzle ORM com índices otimizados
- ✅ Relacionamentos e comportamento de cascata
- ✅ Migrations SQL para criação inicial
- ✅ Regras de negócio documentadas
- ✅ Transições de estado especificadas

Próximo passo: contracts/ (Smart Input Parser contract)

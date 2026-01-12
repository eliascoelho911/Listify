# Modelo de Dados: Inbox Screen

**Feature**: 003-inbox-screen
**Data**: 2026-01-11
**Status**: Completo

## Visão Geral

O domínio Inbox gerencia entradas de texto do usuário (UserInputs) com suporte a tags para categorização. O modelo é independente do domínio Shopping existente.

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   UserInput     │       │    InputTag     │       │      Tag        │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id: string      │──────<│ inputId: string │>──────│ id: string      │
│ text: string    │       │ tagId: string   │       │ name: string    │
│ createdAt: Date │       └─────────────────┘       │ usageCount: int │
│ updatedAt: Date │                                 │ createdAt: Date │
│ tags: Tag[]     │                                 └─────────────────┘
└─────────────────┘
        N:N (via InputTag junction table)
```

## Entidades do Domínio

### UserInput

Representa uma entrada de texto criada pelo usuário no inbox.

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | string | UUID único | Required, UUID format |
| `text` | string | Conteúdo do input | Required, non-empty, max 5000 chars |
| `createdAt` | Date | Data de criação | Required, imutável após criação |
| `updatedAt` | Date | Data de atualização | Required, atualiza em cada edit |
| `tags` | Tag[] | Tags associadas | Array (pode ser vazio) |

**Regras de negócio**:
- `text` não pode ser apenas espaços em branco
- `createdAt` é definido uma vez na criação e nunca muda
- `updatedAt` é atualizado em cada modificação
- `tags` são extraídas do texto (#tag) ou adicionadas manualmente

### Tag

Representa uma categoria/etiqueta para organizar inputs.

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| `id` | string | UUID único | Required, UUID format |
| `name` | string | Nome normalizado | Required, lowercase, max 30 chars |
| `usageCount` | number | Contador de uso | Required, >= 1 |
| `createdAt` | Date | Data de criação | Required |

**Regras de negócio**:
- `name` é normalizado para lowercase (case-insensitive)
- `name` é único no sistema (constraint no banco)
- `usageCount` incrementa cada vez que a tag é usada em um input
- `usageCount` decrementa quando um input com a tag é deletado
- Tags com `usageCount = 0` podem ser mantidas ou limpas periodicamente

### InputTag (Junction Table)

Relacionamento many-to-many entre UserInput e Tag.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `inputId` | string | FK para UserInput |
| `tagId` | string | FK para Tag |

**Regras de negócio**:
- Chave primária composta (inputId, tagId)
- CASCADE delete quando UserInput é deletado
- CASCADE delete quando Tag é deletada

## Value Objects

### TagName

Value object para nome de tag normalizado.

```typescript
type TagName = {
  readonly value: string;  // lowercase, trimmed, max 30 chars
};

// Factory function
function createTagName(raw: string): TagName | null {
  const normalized = raw.toLowerCase().trim();
  if (normalized.length === 0 || normalized.length > 30) {
    return null;
  }
  // Validar caracteres permitidos: letras, números, underscore, acentos
  if (!/^[a-zA-ZÀ-ÿ0-9_]+$/.test(normalized)) {
    return null;
  }
  return { value: normalized };
}
```

## Schema SQLite

### Migration #2: Inbox Tables

```sql
-- Migration 2: Inbox tables (0002_inbox)
-- Adicionado ao array MIGRATIONS em src/infra/storage/sqlite/migrations/index.ts

-- Tabela principal de inputs
CREATE TABLE IF NOT EXISTS user_inputs (
  id TEXT PRIMARY KEY NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,  -- ISO 8601 format
  updated_at TEXT NOT NULL   -- ISO 8601 format
);

-- Índice para ordenação cronológica (scroll infinito)
CREATE INDEX IF NOT EXISTS idx_user_inputs_created ON user_inputs(created_at);

-- Tabela de tags
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE,  -- Case-insensitive comparison
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL  -- ISO 8601 format
);

-- Índice único para evitar tags duplicadas (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Junction table para relação N:N
CREATE TABLE IF NOT EXISTS input_tags (
  input_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (input_id, tag_id),
  FOREIGN KEY (input_id) REFERENCES user_inputs(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Índices para queries eficientes
CREATE INDEX IF NOT EXISTS idx_input_tags_input ON input_tags(input_id);
CREATE INDEX IF NOT EXISTS idx_input_tags_tag ON input_tags(tag_id);
```

### Row Types (Data Layer)

```typescript
// SQLite row types (snake_case)
type UserInputRow = {
  id: string;
  text: string;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
};

type TagRow = {
  id: string;
  name: string;
  usage_count: number;
  created_at: string;  // ISO 8601
};

type InputTagRow = {
  input_id: string;
  tag_id: string;
};
```

## Queries Principais

### 1. Listar UserInputs (Paginado)

```sql
-- Busca inputs com paginação (mais antigos primeiro para scroll de chat)
SELECT
  ui.id,
  ui.text,
  ui.created_at,
  ui.updated_at
FROM user_inputs ui
ORDER BY ui.created_at ASC
LIMIT :limit OFFSET :offset;

-- Para cada input, buscar tags associadas
SELECT
  t.id,
  t.name,
  t.usage_count,
  t.created_at
FROM tags t
INNER JOIN input_tags it ON t.id = it.tag_id
WHERE it.input_id = :inputId;
```

### 2. Criar UserInput

```sql
-- Inserir input
INSERT INTO user_inputs (id, text, created_at, updated_at)
VALUES (:id, :text, :createdAt, :updatedAt);

-- Para cada tag extraída:
-- 1. Inserir ou atualizar tag
INSERT INTO tags (id, name, usage_count, created_at)
VALUES (:id, :name, 1, :createdAt)
ON CONFLICT(name) DO UPDATE SET usage_count = usage_count + 1;

-- 2. Criar relação
INSERT INTO input_tags (input_id, tag_id)
VALUES (:inputId, :tagId);
```

### 3. Atualizar UserInput

```sql
-- Atualizar texto
UPDATE user_inputs
SET text = :text, updated_at = :updatedAt
WHERE id = :id;

-- Remover relações antigas
DELETE FROM input_tags WHERE input_id = :inputId;

-- Decrementar usage_count das tags removidas
UPDATE tags SET usage_count = usage_count - 1
WHERE id IN (SELECT tag_id FROM input_tags WHERE input_id = :inputId);

-- Inserir novas relações (mesmo fluxo de criação)
```

### 4. Deletar UserInput

```sql
-- CASCADE delete remove automaticamente de input_tags
DELETE FROM user_inputs WHERE id = :id;

-- Opcional: Decrementar usage_count das tags
-- (ou fazer via trigger se preferir)
UPDATE tags SET usage_count = usage_count - 1
WHERE id IN (SELECT tag_id FROM input_tags WHERE input_id = :id);
```

### 5. Buscar Tags (Autocomplete)

```sql
SELECT id, name, usage_count, created_at
FROM tags
WHERE name LIKE :prefix || '%'
ORDER BY usage_count DESC
LIMIT 10;
```

## Mappers (Data Layer)

```typescript
// src/data/inbox/mappers/sqliteMappers.ts

import type { UserInput, Tag } from '@domain/inbox/entities';
import type { UserInputRow, TagRow } from './types';

export function mapUserInputRowToEntity(
  row: UserInputRow,
  tags: Tag[]
): UserInput {
  return {
    id: row.id,
    text: row.text,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    tags,
  };
}

export function mapUserInputEntityToRow(input: UserInput): UserInputRow {
  return {
    id: input.id,
    text: input.text,
    created_at: input.createdAt.toISOString(),
    updated_at: input.updatedAt.toISOString(),
  };
}

export function mapTagRowToEntity(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    usageCount: row.usage_count,
    createdAt: new Date(row.created_at),
  };
}

export function mapTagEntityToRow(tag: Tag): TagRow {
  return {
    id: tag.id,
    name: tag.name,
    usage_count: tag.usageCount,
    created_at: tag.createdAt.toISOString(),
  };
}
```

## Diagrama de Estados

### UserInput Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   [Texto digitado]                                          │
│         │                                                   │
│         ▼                                                   │
│   ┌───────────┐                                             │
│   │  DRAFT    │  (apenas na UI, não persiste)               │
│   └─────┬─────┘                                             │
│         │ send()                                            │
│         ▼                                                   │
│   ┌───────────┐                                             │
│   │  CREATED  │  createdAt = now, updatedAt = now           │
│   └─────┬─────┘                                             │
│         │ edit()                                            │
│         ▼                                                   │
│   ┌───────────┐                                             │
│   │  UPDATED  │  updatedAt = now, createdAt preserved       │
│   └─────┬─────┘                                             │
│         │ delete()                                          │
│         ▼                                                   │
│   ┌───────────┐                                             │
│   │  DELETED  │  Removed from DB (CASCADE)                  │
│   └───────────┘                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Considerações de Performance

### Índices

| Tabela | Índice | Propósito |
|--------|--------|-----------|
| `user_inputs` | `idx_user_inputs_created` | Ordenação cronológica |
| `tags` | `idx_tags_name` (UNIQUE) | Busca/dedup por nome |
| `input_tags` | `idx_input_tags_input` | Buscar tags de um input |
| `input_tags` | `idx_input_tags_tag` | Buscar inputs de uma tag |

### Estimativas de Tamanho

| Cenário | UserInputs | Tags | Storage |
|---------|------------|------|---------|
| Light use | ~100 | ~20 | < 100KB |
| Regular use | ~1000 | ~50 | < 1MB |
| Heavy use | ~10000 | ~200 | < 10MB |

### Otimizações Futuras

1. **Batch loading de tags**: Carregar tags de múltiplos inputs em uma query
2. **Lazy loading**: Carregar tags sob demanda (se lista não mostrar tags inline)
3. **Tag cleanup**: Job periódico para remover tags com usageCount = 0

# Reactive Clean Architecture com Hooks

Este documento descreve o padrão de arquitetura usado no Listify para features com dados reativos.

## Visao Geral

O padrao combina:
- **Clean Architecture** para separacao de responsabilidades
- **Drizzle useLiveQuery** para reatividade de dados
- **Zustand** para estado de UI
- **Hooks de UseCase** para encapsular DI

---

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Screen.tsx                                                             │
│       │                                                                 │
│       ↓                                                                 │
│  useFeatureVM.ts (ViewModel Hook)                                       │
│       │                                                                 │
│       ├── useFeatureLive() ← dados reativos (Drizzle useLiveQuery)      │
│       │                                                                 │
│       ├── useFeatureUIStore() ← estado de UI (Zustand)                  │
│       │                                                                 │
│       └── UseCase Hooks ← operacoes de negocio                          │
│              useCreateX()                                               │
│              useUpdateX()                                               │
│              useDeleteX()                                               │
│                                                                         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────┐
│                                  │         DOMAIN LAYER                 │
├──────────────────────────────────┼──────────────────────────────────────┤
│                                  ↓                                      │
│  Use Cases (funcoes puras)                                              │
│      createX(), updateX(), deleteX()                                    │
│                            │                                            │
│                            ↓                                            │
│  Repository Interface (Port)                                            │
│                            ↑                                            │
│                            │ implements                                 │
└────────────────────────────┼────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────┐
│                            │           INFRA LAYER                      │
├────────────────────────────┼────────────────────────────────────────────┤
│                            ↓                                            │
│  FeatureDrizzleRepo (implements Repository)                             │
│                            │                                            │
│                            ↓                                            │
│  DrizzleDB (Drizzle ORM)                                                │
│                            │                                            │
│                            ↓                                            │
│  SQLite (expo-sqlite)                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Camadas e Responsabilidades

### 1. Hook de Dados Reativos (`useFeatureLive.ts`)

**Proposito:** Fornecer dados reativos que atualizam automaticamente quando o DB muda.

```typescript
import { useMemo } from 'react';
import { useDrizzle } from '@drizzle/DrizzleProvider';
import { desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import type { DomainEntity } from '@domain/feature/entities';

export type UseFeatureLiveResult = {
  items: DomainEntity[];
  isLoading: boolean;
  error: Error | null;
  updatedAt: Date | undefined;
};

export function useFeatureLive(): UseFeatureLiveResult {
  const db = useDrizzle();

  const { data: rawItems, error, updatedAt } = useLiveQuery(
    db.query.featureTable.findMany({
      with: { /* relations */ },
      orderBy: [desc(featureTable.updatedAt)],
    }),
  );

  // Mapeia dados raw para entidades de dominio
  const items = useMemo((): DomainEntity[] => {
    if (!rawItems) return [];
    return rawItems.map((raw) => ({
      id: raw.id,
      // ... mapear campos, converter datas
      createdAt: new Date(raw.createdAt),
    }));
  }, [rawItems]);

  return {
    items,
    isLoading: rawItems === undefined && !error,
    error: error ?? null,
    updatedAt,
  };
}
```

**Caracteristicas:**
- Usa `useLiveQuery` do Drizzle para reatividade
- Mapeia dados raw (strings) para entidades de dominio (Date objects)
- Retorna estados de loading e error
- Nao expoe detalhes do ORM para a camada superior

---

### 2. Hook de Repository (`useFeatureRepository.ts`)

**Proposito:** Ponto unico de acoplamento com a implementacao concreta do repository.

```typescript
import { useMemo } from 'react';
import { useDrizzle } from '@drizzle/DrizzleProvider';
import { FeatureDrizzleRepo } from '@drizzle/FeatureDrizzleRepo';
import type { FeatureRepository } from '@domain/feature/ports/FeatureRepository';

export function useFeatureRepository(): FeatureRepository {
  const db = useDrizzle();
  return useMemo(() => new FeatureDrizzleRepo(db), [db]);
}
```

**Caracteristicas:**
- Unico lugar que conhece a implementacao concreta
- Retorna a interface abstrata do domain
- Memoizado para estabilidade de referencia

---

### 3. Hooks de UseCase (`use-cases/*.ts`)

**Proposito:** Encapsular a injecao do repository nos use cases.

```typescript
// useCreateFeatureItem.ts
import { useCallback } from 'react';
import type { DomainEntity } from '@domain/feature/entities';
import { createFeatureItem, type CreateInput } from '@domain/feature/use-cases/CreateFeatureItem';
import { useFeatureRepository } from '../useFeatureRepository';

export type CreateFeatureItemFn = (input: CreateInput) => Promise<DomainEntity>;

export function useCreateFeatureItem(): CreateFeatureItemFn {
  const repository = useFeatureRepository();

  return useCallback(
    (input: CreateInput) => createFeatureItem(input, { repository }),
    [repository],
  );
}
```

**Caracteristicas:**
- Um hook por operacao (create, update, delete, etc.)
- Encapsula DI do repository
- Retorna funcao memoizada com `useCallback`
- ViewModel nao precisa conhecer o repository

---

### 4. Store de UI (`FeatureUIStore.ts`)

**Proposito:** Gerenciar estado de UI apenas (nao dados de dominio).

```typescript
import { createStore } from 'zustand/vanilla';
import type { DomainEntity } from '@domain/feature/entities';

export type FeatureUIState = {
  // Estado de UI
  inputText: string;
  isSubmitting: boolean;
  lastError: Error | null;
  editingItem: DomainEntity | null;

  // Actions
  setInputText: (text: string) => void;
  setIsSubmitting: (value: boolean) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  startEditing: (item: DomainEntity) => void;
  cancelEditing: () => void;
  resetAfterMutation: () => void;
};

export const createFeatureUIStore = () =>
  createStore<FeatureUIState>((set) => ({
    inputText: '',
    isSubmitting: false,
    lastError: null,
    editingItem: null,

    setInputText: (text) => set({ inputText: text }),
    setIsSubmitting: (value) => set({ isSubmitting: value }),
    setError: (error) => set({ lastError: error, isSubmitting: false }),
    clearError: () => set({ lastError: null }),
    startEditing: (item) => set({ editingItem: item, inputText: item.text }),
    cancelEditing: () => set({ editingItem: null, inputText: '' }),
    resetAfterMutation: () => set({ inputText: '', isSubmitting: false, editingItem: null }),
  }));
```

**Caracteristicas:**
- Usa Zustand vanilla (createStore, nao create)
- Apenas estado de UI, sem dados de dominio
- Actions sincronas e simples
- Provider separado para isolar contexto

---

### 5. ViewModel Hook (`useFeatureVM.ts`)

**Proposito:** Orquestrar dados reativos, estado de UI e operacoes.

```typescript
import { useCallback, useMemo } from 'react';
import { useStore } from 'zustand';
import type { DomainEntity } from '@domain/feature/entities';
import { useFeatureUIStore } from '../state/feature/FeatureUIStoreProvider';
import {
  useCreateFeatureItem,
  useUpdateFeatureItem,
  useDeleteFeatureItem,
} from './use-cases';
import { useFeatureLive } from './useFeatureLive';

export function useFeatureVM() {
  const store = useFeatureUIStore();

  // UseCase hooks (com DI encapsulada)
  const createItem = useCreateFeatureItem();
  const updateItem = useUpdateFeatureItem();
  const deleteItem = useDeleteFeatureItem();

  // Dados reativos
  const { items, isLoading, error: liveQueryError } = useFeatureLive();

  // Estado de UI via selectors
  const inputText = useStore(store, (s) => s.inputText);
  const isSubmitting = useStore(store, (s) => s.isSubmitting);
  const lastError = useStore(store, (s) => s.lastError);
  const editingItem = useStore(store, (s) => s.editingItem);

  // Actions de UI
  const setInputText = useStore(store, (s) => s.setInputText);
  const setIsSubmitting = useStore(store, (s) => s.setIsSubmitting);
  const setError = useStore(store, (s) => s.setError);
  const clearError = useStore(store, (s) => s.clearError);
  const resetAfterMutation = useStore(store, (s) => s.resetAfterMutation);

  // Handlers que combinam UI state + UseCase
  const handleSubmit = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    clearError();

    try {
      if (editingItem) {
        await updateItem(editingItem.id, trimmed);
      } else {
        await createItem({ text: trimmed });
      }
      resetAfterMutation();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Operation failed'));
    }
  }, [inputText, editingItem, createItem, updateItem, /* ... */]);

  const handleDelete = useCallback(async (id: string) => {
    clearError();
    try {
      await deleteItem(id);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Delete failed'));
    }
  }, [deleteItem, clearError, setError]);

  return {
    // Dados (reativos)
    items,
    isLoading,

    // Estado UI
    inputText,
    isSubmitting,
    lastError: liveQueryError ?? lastError,
    editingItem,
    isEditing: editingItem !== null,

    // Actions
    setInputText,
    handleSubmit,
    handleDelete,
    // ...
  };
}
```

**Caracteristicas:**
- Nao importa repository ou use cases diretamente
- Usa hooks de UseCase para operacoes
- Combina dados reativos + estado UI
- Expoe interface limpa para a Screen

---

## Estrutura de Arquivos

```
src/
├── domain/feature/
│   ├── entities/
│   │   └── FeatureEntity.ts
│   ├── ports/
│   │   └── FeatureRepository.ts    # Interface
│   └── use-cases/
│       ├── CreateFeatureItem.ts
│       ├── UpdateFeatureItem.ts
│       ├── DeleteFeatureItem.ts
│       └── errors.ts
│
├── infra/drizzle/
│   ├── FeatureDrizzleRepo.ts       # Implementacao
│   └── schema.ts
│
└── presentation/
    ├── hooks/
    │   ├── useFeatureLive.ts       # Dados reativos
    │   ├── useFeatureRepository.ts # DI do repository
    │   ├── useFeatureVM.ts         # ViewModel
    │   └── use-cases/
    │       ├── useCreateFeatureItem.ts
    │       ├── useUpdateFeatureItem.ts
    │       ├── useDeleteFeatureItem.ts
    │       └── index.ts
    │
    ├── state/feature/
    │   ├── featureUIStore.ts       # Store definition
    │   └── FeatureUIStoreProvider.tsx
    │
    └── screens/
        └── FeatureScreen.tsx
```

---

## Regras de Dependencia

| Camada | Pode importar de | NAO pode importar de |
|--------|------------------|----------------------|
| Screen | presentation/* | domain/*, infra/* |
| VM Hook | presentation/hooks/*, presentation/state/* | infra/* diretamente |
| UseCase Hooks | domain/use-cases, presentation/hooks/useRepository | infra/* |
| Live Hook | @drizzle/*, domain/entities | domain/use-cases |
| Repository Hook | @drizzle/*, domain/ports | - |
| UI Store | domain/entities (tipos apenas) | infra/* |
| Domain Use Cases | domain/ports, domain/entities | infra/*, presentation/* |
| Drizzle Repo | domain/ports, @drizzle/* | presentation/* |

---

## Exemplo de Implementacao: Inbox

O feature Inbox segue este padrao:

| Componente | Arquivo |
|------------|---------|
| Entidade | `src/domain/inbox/entities/UserInput.ts` |
| Port | `src/domain/inbox/ports/InboxRepository.ts` |
| Use Cases | `src/domain/inbox/use-cases/Create/Update/Delete*.ts` |
| Repo Impl | `src/infra/drizzle/InboxDrizzleRepo.ts` |
| Live Hook | `src/presentation/hooks/useUserInputsLive.ts` |
| Repo Hook | `src/presentation/hooks/useInboxRepository.ts` |
| UseCase Hooks | `src/presentation/hooks/use-cases/useCreate*.ts` |
| UI Store | `src/presentation/state/inbox/inboxUIStore.ts` |
| ViewModel | `src/presentation/hooks/useInboxVM.ts` |

---

## Checklist para Nova Feature

1. [ ] Criar entidades em `domain/feature/entities/`
2. [ ] Criar interface do repository em `domain/feature/ports/`
3. [ ] Criar use cases em `domain/feature/use-cases/`
4. [ ] Criar implementacao Drizzle em `infra/drizzle/FeatureDrizzleRepo.ts`
5. [ ] Criar hook reativo `useFeatureLive.ts`
6. [ ] Criar hook de repository `useFeatureRepository.ts`
7. [ ] Criar hooks de use case em `hooks/use-cases/`
8. [ ] Criar UI store em `state/feature/`
9. [ ] Criar ViewModel hook `useFeatureVM.ts`
10. [ ] Criar Screen usando o VM

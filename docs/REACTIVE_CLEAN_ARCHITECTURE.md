# Reactive Clean Architecture com Hooks

Este documento descreve o padrão de arquitetura usado no Listify para features com dados reativos.

## Visao Geral

O padrao combina:
- **Clean Architecture** para separacao de responsabilidades
- **Drizzle useLiveQuery** para reatividade de dados
- **Zustand** para estado de UI
- **Container Centralizado de DI** para injecao de dependencias via Context

---

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    APP BOOTSTRAP (DI Container)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  AppDependenciesProvider (Context)                                      │
│       │                                                                 │
│       ├── buildDependencies() ← inicializa DB, repos, use cases        │
│       │                                                                 │
│       └── Expoe hooks: useInboxUseCases(), useShoppingUseCases()       │
│                                                                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────────────┐
│                             │       PRESENTATION LAYER                  │
├─────────────────────────────┼───────────────────────────────────────────┤
│                             ↓                                           │
│  Screen.tsx                                                             │
│       │                                                                 │
│       ↓                                                                 │
│  useFeatureVM.ts (ViewModel Hook)                                       │
│       │                                                                 │
│       ├── useFeatureLive() ← dados reativos (Drizzle useLiveQuery)      │
│       │                                                                 │
│       ├── useFeatureUIStore() ← estado de UI (Zustand)                  │
│       │                                                                 │
│       └── useInboxUseCases() ← operations (do Container)                │
│              { createUserInput, updateUserInput, deleteUserInput }      │
│                                                                         │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────────┐
│                              │         DOMAIN LAYER                     │
├──────────────────────────────┼──────────────────────────────────────────┤
│                              ↓                                          │
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

**IMPORTANTE:** Este hook é considerado LEGACY e usado apenas para casos especiais como paginação híbrida. ViewModels NÃO devem usar este hook - devem usar `useInboxUseCases()` do Container.

**Proposito:** Ponto unico de acoplamento com a implementacao concreta do repository (usado por hooks especializados como `useUserInputsPaginated`).

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
- **Uso limitado**: Apenas para hooks especializados (paginacao, live queries)
- **ViewModels**: Devem usar `useInboxUseCases()` em vez deste hook

---

### 3. Container Centralizado de DI (`app/di/`)

**Proposito:** Centralizar toda a injecao de dependencias da aplicacao em um unico ponto.

#### Estrutura

O Container DI e composto por 3 arquivos:

**1. `types.ts` - Definicao de Tipos**

Define `InboxUseCases`, `ShoppingUseCases`, `AppDependencies`:

```typescript
import type { UserInput, Tag, PaginatedUserInputs } from '@domain/inbox/entities';
import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';
import type { ShoppingRepository } from '@domain/shopping/ports/ShoppingRepository';

/**
 * Inbox domain use cases centralizados no container.
 * Pure functions (GetUserInputsGrouped) não estão incluídas.
 */
export type InboxUseCases = {
  createUserInput: (input: CreateUserInputInput) => Promise<UserInput>;
  updateUserInput: (id: string, text: string) => Promise<UserInput>;
  deleteUserInput: (id: string) => Promise<void>;
  getUserInputs: (page?: number, limit?: number) => Promise<PaginatedUserInputs>;
  searchTags: (input: SearchTagsInput) => Promise<Tag[]>;
};

export type AppDependencies = {
  database: SqliteDatabase;
  inboxRepository: InboxRepository;
  shoppingRepository: ShoppingRepository;
  inboxUseCases: InboxUseCases;
  shoppingUseCases: ShoppingUseCases;
};
```

**2. `container.ts` - Factory de Dependencias**

Cria repositories e injeta nos use cases via **closure binding**:

```typescript
import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { InboxDrizzleRepo } from '@infra/drizzle/InboxDrizzleRepo';
import { createUserInput, UpdateUserInput, DeleteUserInput, GetUserInputs, SearchTags } from '@domain/inbox/use-cases';
import type { AppDependencies, InboxUseCases } from './types';

export async function buildDependencies(): Promise<AppDependencies> {
  // 1. Inicializa DB e repositories
  const rawDb = openDatabaseSync('listify.db', { enableChangeListener: true });
  rawDb.execSync('PRAGMA foreign_keys = ON;');
  const drizzleDb = drizzle(rawDb, { schema });
  const inboxRepository = new InboxDrizzleRepo(drizzleDb);

  // 2. Cria use cases com closure (repository ja injetado)
  const inboxUseCases: InboxUseCases = {
    createUserInput: (input) =>
      createUserInput(input, { repository: inboxRepository }),

    updateUserInput: (id, text) =>
      UpdateUserInput(inboxRepository, id, text),

    deleteUserInput: (id) =>
      DeleteUserInput(inboxRepository, id),

    getUserInputs: (page = 0, limit = 20) =>
      GetUserInputs(inboxRepository, page, limit),

    searchTags: (input) =>
      SearchTags(input, (params) => inboxRepository.searchTags(params)),
  };

  return { database, inboxRepository, inboxUseCases, /* ... */ };
}
```

**3. `AppDependenciesProvider.tsx` - Context Provider**

Gerencia inicialização assíncrona e fornece via Context:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { buildDependencies } from './container';
import type { AppDependencies, InboxUseCases } from './types';

const AppDependenciesContext = createContext<AppDependencies | null>(null);

/**
 * Provider global para centralizar injeção de dependências.
 * Gerencia a inicialização assíncrona do banco de dados e repositories.
 */
export function AppDependenciesProvider({ children }) {
  const [state, setState] = useState({
    dependencies: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    buildDependencies()
      .then((deps) => setState({ dependencies: deps, isLoading: false, error: null }))
      .catch((error) => setState({ dependencies: null, isLoading: false, error }));
  }, []);

  if (state.isLoading) return <LoadingFallback />;
  if (state.error) return <ErrorFallback error={state.error} />;

  return (
    <AppDependenciesContext.Provider value={state.dependencies}>
      {children}
    </AppDependenciesContext.Provider>
  );
}

/**
 * Hook para acessar os Inbox UseCases.
 */
export function useInboxUseCases(): InboxUseCases {
  const context = useContext(AppDependenciesContext);
  if (!context) throw new Error('useInboxUseCases must be used within AppDependenciesProvider');
  return context.inboxUseCases;
}
```

#### Como Funciona a Injecao via Closure

O Container usa **closure binding** para injetar o repository nos use cases:

```typescript
// Use case no domain (funcao pura)
export async function createUserInput(
  input: CreateUserInputInput,
  deps: { repository: InboxRepository }
): Promise<UserInput> {
  return deps.repository.createUserInput(input);
}

// Container cria closure com repository ja injetado
const inboxUseCases: InboxUseCases = {
  createUserInput: (input) => createUserInput(input, { repository: inboxRepository }),
  //                ^^^^^^^ - Closure captura 'inboxRepository'
};

// ViewModel usa funcao sem conhecer o repository
const { createUserInput } = useInboxUseCases();
await createUserInput({ text: 'Comprar leite' }); // Repository ja esta injetado!
```

**Caracteristicas:**
- **Unico ponto de DI**: Todo o wiring acontece em `container.ts`
- **Closure binding**: Use cases ja tem repository injetado via closure
- **Type-safe**: TypeScript garante assinatura correta dos use cases
- **Async bootstrap**: Provider gerencia inicializacao assincrona do DB
- **Error handling**: Loading e error states durante bootstrap
- **Simples para ViewModels**: Apenas desestrutura e usa

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
import { useCallback } from 'react';
import { useStore } from 'zustand';
import type { UserInput } from '@domain/inbox/entities';
import { useInboxUseCases } from '@app/di/AppDependenciesProvider';
import { useInboxUIStore } from '../state/inbox/InboxUIStoreProvider';
import { useUserInputsLive } from './useUserInputsLive';

export function useInboxVM() {
  const store = useInboxUIStore();

  // UseCases do Container (repository ja injetado)
  const { createUserInput, updateUserInput, deleteUserInput, searchTags } = useInboxUseCases();

  // Dados reativos
  const { inputs, isLoading, error: liveQueryError } = useUserInputsLive();

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
      if (editingInput) {
        // Use case ja tem repository injetado
        await updateUserInput(editingInput.id, trimmed);
      } else {
        await createUserInput({ text: trimmed });
      }
      resetAfterMutation();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Operation failed'));
    }
  }, [inputText, editingInput, createUserInput, updateUserInput, setIsSubmitting, clearError, setError, resetAfterMutation]);

  const handleDelete = useCallback(async (id: string) => {
    clearError();
    try {
      await deleteUserInput(id);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Delete failed'));
    }
  }, [deleteUserInput, clearError, setError]);

  const handleSearchTags = useCallback(async (query: string) => {
    try {
      const tags = await searchTags({ query, limit: 5 });
      // ... atualizar UI com tags
    } catch (error) {
      // ... handle error
    }
  }, [searchTags]);

  return {
    // Dados (reativos)
    inputs,
    isLoading,

    // Estado UI
    inputText,
    isSubmitting,
    lastError: liveQueryError ?? lastError,
    editingInput,
    isEditing: editingInput !== null,

    // Actions
    setInputText,
    handleSubmit,
    handleDelete,
    handleSearchTags,
    // ...
  };
}
```

**Caracteristicas:**
- **Nao importa repository**: Todo DI vem do Container
- **Destructuring simples**: `const { createUserInput, ... } = useInboxUseCases()`
- **Use cases prontos**: Repository ja esta injetado via closure
- **Combina 3 fontes**: Dados reativos + Estado UI + Operacoes
- **Expoe interface limpa**: Screen nao conhece arquitetura interna

**Vantagens vs Padrao Antigo:**
- ✅ Menos imports (1 hook vs N hooks)
- ✅ Menos boilerplate (sem `useCallback` por operacao)
- ✅ DI centralizado (facil testar e mockar)
- ✅ Type-safe (TypeScript garante assinaturas)

---

## Estrutura de Arquivos

```
src/
├── app/
│   └── di/                          # ← NOVO: Dependency Injection Container
│       ├── types.ts                 # InboxUseCases, AppDependencies types
│       ├── container.ts             # buildDependencies() factory
│       └── AppDependenciesProvider.tsx  # Context provider
│
├── domain/feature/
│   ├── entities/
│   │   └── FeatureEntity.ts
│   ├── ports/
│   │   └── FeatureRepository.ts    # Interface
│   └── use-cases/
│       ├── CreateFeatureItem.ts    # Pure functions
│       ├── UpdateFeatureItem.ts    # Pure functions
│       ├── DeleteFeatureItem.ts    # Pure functions
│       └── errors.ts
│
├── infra/drizzle/
│   ├── FeatureDrizzleRepo.ts       # Implementacao
│   └── schema.ts
│
└── presentation/
    ├── hooks/
    │   ├── useFeatureLive.ts       # Dados reativos
    │   ├── useFeatureRepository.ts # ← LEGACY: paginacao apenas
    │   └── useFeatureVM.ts         # ViewModel
    │
    ├── state/feature/
    │   ├── featureUIStore.ts       # Store definition
    │   └── FeatureUIStoreProvider.tsx
    │
    └── screens/
        └── FeatureScreen.tsx
```

**Notas:**
- `app/di/` - Novo ponto central de DI (substitui `hooks/use-cases/`)
- `useFeatureRepository.ts` - Hook LEGACY, usado apenas por hooks especializados
- Use cases no domain continuam sendo **pure functions**
- ViewModels usam `useInboxUseCases()` do Container

---

## Regras de Dependencia

| Camada | Pode importar de | NAO pode importar de |
|--------|------------------|----------------------|
| Screen | presentation/* | domain/*, infra/* |
| VM Hook | @app/di/AppDependenciesProvider, presentation/* | infra/* |
| Container (DI) | domain/*, infra/* | presentation/* |
| Live Hook | @drizzle/*, domain/entities | domain/use-cases |
| Repository Hook | @drizzle/*, domain/ports | - |
| UI Store | domain/entities (tipos apenas) | infra/* |
| Domain Use Cases | domain/ports, domain/entities | infra/*, presentation/* |
| Drizzle Repo | domain/ports, @drizzle/* | presentation/* |

**Fluxo de DI:**
1. `container.ts` cria repositories e injeta nos use cases via closure
2. `AppDependenciesProvider` expoe via Context
3. ViewModels usam `useInboxUseCases()` para acessar operacoes

---

## Exemplo de Implementacao: Inbox

O feature Inbox segue este padrao:

| Componente | Arquivo |
|------------|---------|
| **Domain** | |
| Entidade | `src/domain/inbox/entities/UserInput.ts` |
| Port | `src/domain/inbox/ports/InboxRepository.ts` |
| Use Cases | `src/domain/inbox/use-cases/CreateUserInput.ts` |
|  | `src/domain/inbox/use-cases/UpdateUserInput.ts` |
|  | `src/domain/inbox/use-cases/DeleteUserInput.ts` |
| **Infra** | |
| Repo Impl | `src/infra/drizzle/InboxDrizzleRepo.ts` |
| **DI Container** | |
| Types | `src/app/di/types.ts` (define `InboxUseCases`) |
| Factory | `src/app/di/container.ts` (cria use cases com closure) |
| Provider | `src/app/di/AppDependenciesProvider.tsx` |
| **Presentation** | |
| Live Hook | `src/presentation/hooks/useUserInputsLive.ts` |
| Repo Hook (Legacy) | `src/presentation/hooks/useInboxRepository.ts` |
| UI Store | `src/presentation/state/inbox/inboxUIStore.ts` |
| ViewModel | `src/presentation/hooks/useInboxVM.ts` |

**Exemplo de uso no ViewModel:**

```typescript
// src/presentation/hooks/useInboxVM.ts
import { useInboxUseCases } from '@app/di/AppDependenciesProvider';

export function useInboxVM() {
  // Desestrutura use cases (repository ja injetado)
  const { createUserInput, updateUserInput, deleteUserInput, searchTags } = useInboxUseCases();

  // Usa diretamente, sem conhecer repository
  const handleSubmit = async () => {
    await createUserInput({ text: inputText });
  };

  return { handleSubmit, /* ... */ };
}
```

---

## Checklist para Nova Feature

1. [ ] **Domain**: Criar entidades em `domain/feature/entities/`
2. [ ] **Domain**: Criar interface em `domain/feature/ports/FeatureRepository.ts`
3. [ ] **Domain**: Criar use cases em `domain/feature/use-cases/` (pure functions)
4. [ ] **Infra**: Criar `infra/drizzle/FeatureDrizzleRepo.ts`
5. [ ] **DI Container**: Adicionar tipo `FeatureUseCases` em `app/di/types.ts`
6. [ ] **DI Container**: Criar use cases com closure em `app/di/container.ts`
7. [ ] **DI Container**: Adicionar hook `useFeatureUseCases()` em `AppDependenciesProvider.tsx`
8. [ ] **Presentation**: Criar `useFeatureLive.ts`
9. [ ] **Presentation**: Criar UI store em `state/feature/`
10. [ ] **Presentation**: Criar `useFeatureVM.ts` usando `useFeatureUseCases()`
11. [ ] **Presentation**: Criar Screen
12. [ ] **Tests**: Testar use cases, mappers, ViewModel

**Exemplo de adicionar use cases no Container:**

```typescript
// 1. Definir tipo em types.ts
export type FeatureUseCases = {
  createItem: (input: CreateInput) => Promise<Item>;
  updateItem: (id: string, data: UpdateData) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
};

// 2. Criar no container.ts com closure binding
const featureUseCases: FeatureUseCases = {
  createItem: (input) => createItem(input, { repository: featureRepository }),
  updateItem: (id, data) => updateItem(id, data, { repository: featureRepository }),
  deleteItem: (id) => deleteItem(id, { repository: featureRepository }),
};

// 3. Adicionar ao AppDependencies
return {
  database,
  featureRepository,
  featureUseCases,  // ← novo
  // ...
};

// 4. Criar hook no AppDependenciesProvider.tsx
export function useFeatureUseCases(): FeatureUseCases {
  return useAppDependencies().featureUseCases;
}
```

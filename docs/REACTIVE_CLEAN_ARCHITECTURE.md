# Reactive Clean Architecture com Hooks

Este documento descreve o padrao de arquitetura usado no Listify para features com dados reativos.

## Visao Geral

O padrao combina:
- **Clean Architecture** para separacao de responsabilidades
- **Drizzle useLiveQuery** para reatividade de dados (encapsulado no Container DI)
- **Zustand** para estado de UI
- **Container Centralizado de DI** para injecao de dependencias via Context

**Principio fundamental:** A camada de presentation NAO deve importar diretamente do Drizzle. Todas as dependencias do ORM ficam encapsuladas no Container DI (`app/di/`).

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
│       ├── Expoe hooks: useInboxUseCases(), useShoppingUseCases()       │
│       │                                                                 │
│       └── Expoe hooks reativos: useUserInputsLive() (encapsula Drizzle)│
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
│       ├── useUserInputsLive() ← dados reativos (do Container DI)       │
│       │                                                                 │
│       ├── useFeatureUIStore() ← estado de UI (Zustand)                  │
│       │                                                                 │
│       └── useInboxUseCases() ← operations (do Container)                │
│              { createUserInput, updateUserInput, deleteUserInput }      │
│                                                                         │
│  ⚠️  NENHUM IMPORT de @drizzle/* ou drizzle-orm/* na presentation!     │
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

### 1. Hook de Dados Reativos (`app/di/hooks/useFeatureLive.ts`)

**Proposito:** Fornecer dados reativos que atualizam automaticamente quando o DB muda.

**IMPORTANTE:** Este hook fica no Container DI (`app/di/hooks/`), NAO na presentation. Isso garante que o Drizzle fica encapsulado e a presentation nao conhece detalhes do ORM.

```typescript
// src/app/di/hooks/useUserInputsLive.ts
import { useMemo } from 'react';
import { desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import type { UserInput } from '@domain/inbox/entities';
import { userInputs } from '@infra/drizzle/schema';

import { useAppDependencies } from '../AppDependenciesProvider';

export type UseUserInputsLiveResult = {
  inputs: UserInput[];
  isLoading: boolean;
  error: Error | null;
  updatedAt: Date | undefined;
};

export function useUserInputsLive(limit?: number): UseUserInputsLiveResult {
  const { drizzleDb } = useAppDependencies();

  const { data: rawInputs, error, updatedAt } = useLiveQuery(
    drizzleDb.query.userInputs.findMany({
      with: { inputTags: { with: { tag: true } } },
      orderBy: [desc(userInputs.updatedAt)],
      ...(limit !== undefined ? { limit } : {}),
    }),
  );

  // Mapeia dados raw para entidades de dominio
  const inputs = useMemo((): UserInput[] => {
    if (!rawInputs) return [];
    return rawInputs.map((raw) => ({
      id: raw.id,
      text: raw.text,
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      tags: raw.inputTags.map((it) => ({
        id: it.tag.id,
        name: it.tag.name,
        usageCount: it.tag.usageCount,
        createdAt: new Date(it.tag.createdAt),
      })),
    }));
  }, [rawInputs]);

  return {
    inputs,
    isLoading: rawInputs === undefined && !error,
    error: error ?? null,
    updatedAt,
  };
}
```

**Caracteristicas:**
- Fica em `app/di/hooks/`, NAO em `presentation/hooks/`
- Usa `useAppDependencies()` para obter `drizzleDb`
- Encapsula `useLiveQuery` do Drizzle
- Mapeia dados raw (strings) para entidades de dominio (Date objects)
- Re-exportado via `AppDependenciesProvider.tsx`

---

### 2. Container Centralizado de DI (`app/di/`)

**Proposito:** Centralizar toda a injecao de dependencias da aplicacao em um unico ponto, incluindo hooks reativos.

#### Estrutura

O Container DI e composto por 4 arquivos:

**1. `types.ts` - Definicao de Tipos**

```typescript
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type * as schema from '@infra/drizzle/schema';

export type DrizzleDB = ExpoSQLiteDatabase<typeof schema>;

export type InboxUseCases = {
  createUserInput: (input: CreateUserInputInput) => Promise<UserInput>;
  updateUserInput: (id: string, text: string) => Promise<UserInput>;
  deleteUserInput: (id: string) => Promise<void>;
  getUserInputs: (page?: number, limit?: number) => Promise<PaginatedUserInputs>;
  searchTags: (input: SearchTagsInput) => Promise<Tag[]>;
};

export type AppDependencies = {
  database: SqliteDatabase;
  drizzleDb: DrizzleDB;  // Exposto para hooks reativos
  inboxRepository: InboxRepository;
  shoppingRepository: ShoppingRepository;
  inboxUseCases: InboxUseCases;
  shoppingUseCases: ShoppingUseCases;
};
```

**2. `container.ts` - Factory de Dependencias**

```typescript
export async function buildDependencies(): Promise<AppDependencies> {
  // 1. Inicializa DB (unica vez!)
  const rawDb = openDatabaseSync('listify.db', { enableChangeListener: true });
  rawDb.execSync('PRAGMA foreign_keys = ON;');
  const drizzleDb = drizzle(rawDb, { schema });
  const inboxRepository = new InboxDrizzleRepo(drizzleDb);

  // 2. Cria use cases com closure (repository ja injetado)
  const inboxUseCases: InboxUseCases = {
    createUserInput: (input) =>
      createUserInput(input, { repository: inboxRepository }),
    // ...
  };

  return {
    database,
    drizzleDb,  // Exposto para hooks reativos
    inboxRepository,
    inboxUseCases,
    // ...
  };
}
```

**3. `hooks/useUserInputsLive.ts` - Hook Reativo**

Encapsula `useLiveQuery` do Drizzle (ver secao anterior).

**4. `AppDependenciesProvider.tsx` - Context Provider**

```typescript
export function AppDependenciesProvider({ children }) {
  // ... inicializacao assincrona ...
  return (
    <AppDependenciesContext.Provider value={state.dependencies}>
      {children}
    </AppDependenciesContext.Provider>
  );
}

// Hooks expostos
export function useAppDependencies(): AppDependencies { /* ... */ }
export function useInboxUseCases(): InboxUseCases { /* ... */ }
export function useInboxRepository(): InboxRepository { /* ... */ }

// Re-export hooks reativos
export { useUserInputsLive, type UseUserInputsLiveResult } from './hooks';
```

---

### 3. Store de UI (`FeatureUIStore.ts`)

**Proposito:** Gerenciar estado de UI apenas (nao dados de dominio).

```typescript
import { createStore } from 'zustand/vanilla';

export type FeatureUIState = {
  inputText: string;
  isSubmitting: boolean;
  lastError: Error | null;
  editingItem: DomainEntity | null;
  // Actions...
};

export const createFeatureUIStore = () =>
  createStore<FeatureUIState>((set) => ({
    inputText: '',
    isSubmitting: false,
    // ...
  }));
```

---

### 4. ViewModel Hook (`useFeatureVM.ts`)

**Proposito:** Orquestrar dados reativos, estado de UI e operacoes.

```typescript
// src/presentation/hooks/useInboxVM.ts
import { useCallback } from 'react';
import { useStore } from 'zustand';
import { useInboxUseCases, useUserInputsLive } from '@app/di/AppDependenciesProvider';
import { useInboxUIStore } from '../state/inbox/InboxUIStoreProvider';

export function useInboxVM() {
  const store = useInboxUIStore();

  // UseCases do Container (repository ja injetado)
  const { createUserInput, updateUserInput, deleteUserInput } = useInboxUseCases();

  // Dados reativos (do Container DI)
  const { inputs, isLoading, error: liveQueryError } = useUserInputsLive();

  // Estado de UI via Zustand
  const inputText = useStore(store, (s) => s.inputText);
  // ...

  return {
    inputs,
    isLoading,
    inputText,
    handleSubmit,
    // ...
  };
}
```

**Caracteristicas:**
- **Nao importa de @drizzle/***: Todo DI vem do Container
- **Usa hooks do Container**: `useInboxUseCases()`, `useUserInputsLive()`
- **Combina 3 fontes**: Dados reativos + Estado UI + Operacoes
- **Expoe interface limpa**: Screen nao conhece arquitetura interna

---

## Estrutura de Arquivos

```
src/
├── app/
│   └── di/                              # Container de DI
│       ├── types.ts                     # DrizzleDB, InboxUseCases, AppDependencies
│       ├── container.ts                 # buildDependencies() factory
│       ├── AppDependenciesProvider.tsx  # Context provider + hooks
│       └── hooks/                       # Hooks reativos (encapsulam Drizzle)
│           ├── index.ts                 # Barrel export
│           └── useUserInputsLive.ts     # Hook reativo com useLiveQuery
│
├── domain/feature/
│   ├── entities/
│   │   └── FeatureEntity.ts
│   ├── ports/
│   │   └── FeatureRepository.ts         # Interface
│   └── use-cases/
│       └── *.ts                         # Pure functions
│
├── infra/drizzle/
│   ├── FeatureDrizzleRepo.ts            # Implementacao
│   ├── schema.ts
│   └── index.ts                         # Exports (SEM DrizzleProvider)
│
└── presentation/
    ├── hooks/
    │   ├── useFeatureVM.ts              # ViewModel (usa hooks do Container)
    │   └── useUserInputsPaginated.ts    # Paginacao (usa hooks do Container)
    │
    ├── state/feature/
    │   ├── featureUIStore.ts            # Store definition
    │   └── FeatureUIStoreProvider.tsx
    │
    └── screens/
        └── FeatureScreen.tsx
```

**Notas importantes:**
- `app/di/hooks/` - Hooks reativos ficam AQUI, nao em presentation
- `presentation/` - NAO importa de `@drizzle/*` ou `drizzle-orm/*`
- Use cases no domain continuam sendo **pure functions**

---

## Regras de Dependencia

| Camada | Pode importar de | NAO pode importar de |
|--------|------------------|----------------------|
| Screen | presentation/* | domain/*, infra/*, @drizzle/* |
| VM Hook | @app/di/AppDependenciesProvider, presentation/* | infra/*, @drizzle/* |
| Container (DI) | domain/*, infra/*, drizzle-orm/* | presentation/* |
| Live Hook (DI) | @app/di/*, @infra/drizzle/*, drizzle-orm/* | presentation/* |
| UI Store | domain/entities (tipos apenas) | infra/*, @drizzle/* |
| Domain Use Cases | domain/ports, domain/entities | infra/*, presentation/* |
| Drizzle Repo | domain/ports, @drizzle/* | presentation/* |

**Regra de ouro:** A camada `presentation/` NUNCA importa de `@drizzle/*` ou `drizzle-orm/*`.

---

## Exemplo de Implementacao: Inbox

| Componente | Arquivo |
|------------|---------|
| **Domain** | |
| Entidade | `src/domain/inbox/entities/UserInput.ts` |
| Port | `src/domain/inbox/ports/InboxRepository.ts` |
| Use Cases | `src/domain/inbox/use-cases/*.ts` |
| **Infra** | |
| Repo Impl | `src/infra/drizzle/InboxDrizzleRepo.ts` |
| **DI Container** | |
| Types | `src/app/di/types.ts` |
| Factory | `src/app/di/container.ts` |
| Provider | `src/app/di/AppDependenciesProvider.tsx` |
| Live Hook | `src/app/di/hooks/useUserInputsLive.ts` |
| **Presentation** | |
| UI Store | `src/presentation/state/inbox/inboxUIStore.ts` |
| ViewModel | `src/presentation/hooks/useInboxVM.ts` |
| Paginated Hook | `src/presentation/hooks/useUserInputsPaginated.ts` |

---

## Checklist para Nova Feature

1. [ ] **Domain**: Criar entidades em `domain/feature/entities/`
2. [ ] **Domain**: Criar interface em `domain/feature/ports/FeatureRepository.ts`
3. [ ] **Domain**: Criar use cases em `domain/feature/use-cases/` (pure functions)
4. [ ] **Infra**: Criar `infra/drizzle/FeatureDrizzleRepo.ts`
5. [ ] **DI Container**: Adicionar tipo `FeatureUseCases` em `app/di/types.ts`
6. [ ] **DI Container**: Criar use cases com closure em `app/di/container.ts`
7. [ ] **DI Container**: Adicionar hook `useFeatureUseCases()` em `AppDependenciesProvider.tsx`
8. [ ] **DI Container**: Se precisar de dados reativos, criar `app/di/hooks/useFeatureLive.ts`
9. [ ] **Presentation**: Criar UI store em `state/feature/`
10. [ ] **Presentation**: Criar `useFeatureVM.ts` usando hooks do Container
11. [ ] **Presentation**: Criar Screen
12. [ ] **Tests**: Testar use cases, mappers, ViewModel

**Exemplo de hook reativo no Container:**

```typescript
// 1. Criar hook em app/di/hooks/useFeatureLive.ts
export function useFeatureLive(): UseFeatureLiveResult {
  const { drizzleDb } = useAppDependencies();

  const { data, error, updatedAt } = useLiveQuery(
    drizzleDb.query.featureTable.findMany({ /* ... */ })
  );

  // Mapear e retornar...
}

// 2. Exportar em app/di/hooks/index.ts
export { useFeatureLive } from './useFeatureLive';

// 3. Re-exportar em AppDependenciesProvider.tsx
export { useFeatureLive } from './hooks';

// 4. Usar no ViewModel (presentation)
import { useFeatureLive } from '@app/di/AppDependenciesProvider';
```

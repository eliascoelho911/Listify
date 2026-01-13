# Reactive Clean Architecture com Hooks

Este documento descreve o padrao de arquitetura usado no Listify para features com dados reativos.

## Visao Geral

O padrao combina:
- **Clean Architecture** para separacao de responsabilidades
- **Subscriber Pattern** no Repository para reatividade de dados
- **Zustand** para estado de UI
- **Container Centralizado de DI** para injecao de dependencias via Context

**Principio fundamental:** A camada de presentation NAO deve importar diretamente do Drizzle. A reatividade e implementada no Repository (infra) via padrao Observer/Subscriber, e consumida na presentation via hooks.

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
│       ├── Expoe hooks: useFeatureUseCases()                            │
│       │                                                                 │
│       └── Expoe hooks: useFeatureRepository()                          │
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
│       ├── useFeatureLive() ← hook reativo (usa repository.subscribe)   │
│       │                                                                 │
│       ├── useFeatureUIStore() ← estado de UI (Zustand)                 │
│       │                                                                 │
│       └── useFeatureUseCases() ← operations (do Container)             │
│              { create, update, delete }                                 │
│                                                                         │
│  useFeatureLive.ts (Hook Reativo)                                       │
│       │                                                                 │
│       └── useFeatureRepository().subscribeToFeature(callback)          │
│                                                                         │
│  NENHUM IMPORT de @drizzle/* ou drizzle-orm/* na presentation!         │
│                                                                         │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────────┐
│                              │         DOMAIN LAYER                     │
├──────────────────────────────┼──────────────────────────────────────────┤
│                              ↓                                          │
│  Use Cases (funcoes puras)                                              │
│      create(), update(), delete()                                       │
│                            │                                            │
│                            ↓                                            │
│  Repository Interface (Port)                                            │
│      subscribeToFeature(callback, options): unsubscribe                 │
│      create(), update(), delete(), getById(), getAll()                  │
│                            ↑                                            │
│                            │ implements                                 │
└────────────────────────────┼────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────────┐
│                            │           INFRA LAYER                      │
├────────────────────────────┼────────────────────────────────────────────┤
│                            ↓                                            │
│  FeatureDrizzleRepo (implements Repository)                             │
│       │                                                                 │
│       ├── subscribers: Map<callback, options>  ← Subscriber Pattern    │
│       │                                                                 │
│       ├── subscribeToFeature() ← registra callback, emite inicial      │
│       │                                                                 │
│       ├── notifySubscribers() ← chamado apos cada mutacao              │
│       │                                                                 │
│       └── create/update/delete → executa + notifySubscribers()         │
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

### 1. Subscriber Pattern no Repository (`infra/`)

**Proposito:** Implementar reatividade diretamente no Repository, notificando subscribers apos cada mutacao.

**IMPORTANTE:** O padrao Subscriber fica na camada de infra, encapsulando o ORM. A presentation consome via interface do domain.

```typescript
// src/infra/drizzle/FeatureDrizzleRepo.ts
export class FeatureDrizzleRepo implements FeatureRepository {
  private subscribers: Map<SubscriptionCallback, SubscribeOptions> = new Map();

  constructor(private db: DrizzleDB) {}

  /**
   * Registra um callback para receber dados atualizados
   */
  subscribeToFeature(
    callback: (items: FeatureEntity[]) => void,
    options?: { limit?: number },
  ): () => void {
    // 1. Registra o subscriber
    this.subscribers.set(callback, { limit: options?.limit });

    // 2. Emite dados iniciais imediatamente
    this.db.query.featureTable
      .findMany({
        orderBy: [desc(featureTable.updatedAt)],
        ...(options?.limit ? { limit: options.limit } : {}),
      })
      .then((results) => {
        if (this.subscribers.has(callback)) {
          callback(results.map(mapRawToEntity));
        }
      });

    // 3. Retorna funcao de unsubscribe
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notifica todos os subscribers com dados atualizados
   * Chamado internamente apos cada mutacao
   */
  private async notifySubscribers(): Promise<void> {
    for (const [callback, options] of this.subscribers) {
      try {
        const results = await this.db.query.featureTable.findMany({
          orderBy: [desc(featureTable.updatedAt)],
          ...(options.limit ? { limit: options.limit } : {}),
        });
        callback(results.map(mapRawToEntity));
      } catch {
        // Silently ignore errors in notification
      }
    }
  }

  async create(params: CreateParams): Promise<FeatureEntity> {
    const result = await this.db.transaction(async (tx) => {
      // ... logica de criacao ...
    });

    // Notifica apos mutacao bem-sucedida
    this.notifySubscribers();

    return result;
  }

  async update(params: UpdateParams): Promise<FeatureEntity> {
    const result = await this.db.transaction(async (tx) => {
      // ... logica de atualizacao ...
    });

    this.notifySubscribers();
    return result;
  }

  async delete(id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      // ... logica de delecao ...
    });

    this.notifySubscribers();
  }
}
```

**Caracteristicas:**
- Map de subscribers com opcoes (ex: limit)
- Emissao inicial imediata ao registrar
- Notificacao automatica apos cada mutacao
- Funcao de unsubscribe para cleanup

---

### 2. Interface do Repository com Subscription (`domain/ports/`)

**Proposito:** Definir contrato que inclui metodo de subscription.

```typescript
// src/domain/feature/ports/FeatureRepository.ts
export type SubscriptionCallback = (items: FeatureEntity[]) => void;
export type SubscribeOptions = { limit?: number };

export interface FeatureRepository {
  // === Subscription (Reatividade) ===
  subscribeToFeature(
    callback: SubscriptionCallback,
    options?: SubscribeOptions,
  ): () => void;  // Retorna unsubscribe function

  // === CRUD ===
  create(params: CreateParams): Promise<FeatureEntity>;
  update(params: UpdateParams): Promise<FeatureEntity>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<FeatureEntity | null>;

  // === Paginacao ===
  getAll(params: GetAllParams): Promise<PaginatedResult>;
}
```

---

### 3. Hook de Dados Reativos (`presentation/hooks/`)

**Proposito:** Fornecer dados reativos que atualizam automaticamente quando o Repository notifica mudancas.

**IMPORTANTE:** Este hook fica na presentation, mas NAO importa do Drizzle. Usa o Repository via DI.

```typescript
// src/presentation/hooks/useFeatureLive.ts
import { useCallback, useEffect, useState } from 'react';

import type { FeatureEntity } from '@domain/feature/entities';
import { useFeatureRepository } from '@app/di/AppDependenciesProvider';

export type UseFeatureLiveResult = {
  items: FeatureEntity[];
  isLoading: boolean;
  error: Error | null;
  updatedAt: Date | undefined;
};

export function useFeatureLive(limit?: number): UseFeatureLiveResult {
  const repository = useFeatureRepository();

  const [items, setItems] = useState<FeatureEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>(undefined);

  const handleUpdate = useCallback((newItems: FeatureEntity[]) => {
    setItems(newItems);
    setIsLoading(false);
    setUpdatedAt(new Date());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      // Subscribe ao repository - recebe dados iniciais e atualizacoes
      const unsubscribe = repository.subscribeToFeature(handleUpdate, {
        limit,
      });

      // Cleanup: unsubscribe quando o componente desmonta
      return () => {
        unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to subscribe'));
      setIsLoading(false);
      return undefined;
    }
  }, [repository, limit, handleUpdate]);

  return {
    items,
    isLoading,
    error,
    updatedAt,
  };
}
```

**Caracteristicas:**
- Fica em `presentation/hooks/`, NAO em `app/di/hooks/`
- Usa `useFeatureRepository()` do Container DI
- NAO importa nada do Drizzle
- Gerencia estados: items, isLoading, error, updatedAt
- Cleanup automatico via unsubscribe

---

### 4. Hook de Paginacao Hibrida (Opcional)

**Proposito:** Combinar reatividade com paginacao on-demand para listas grandes.

**Estrategia:**
- Primeiros N itens (ex: 50): Via subscription reativa
- Itens mais antigos: Carregados sob demanda
- Deduplicacao automatica entre as duas fontes

```typescript
// src/presentation/hooks/useFeaturePaginated.ts
import { useCallback, useMemo, useState } from 'react';

import type { FeatureEntity } from '@domain/feature/entities';
import { useFeatureRepository } from '@app/di/AppDependenciesProvider';
import { useFeatureLive } from './useFeatureLive';

const INITIAL_PAGE_SIZE = 50;  // Itens reativos
const DEFAULT_PAGE_SIZE = 20;  // Itens paginados

export function useFeaturePaginated(): UseFeaturePaginatedResult {
  const repository = useFeatureRepository();

  // Dados reativos para os primeiros N itens
  const { items: liveItems, isLoading, error: liveError } =
    useFeatureLive(INITIAL_PAGE_SIZE);

  // Estado para itens mais antigos (carregados sob demanda)
  const [olderItems, setOlderItems] = useState<FeatureEntity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Merge com deduplicacao automatica
  const items = useMemo((): FeatureEntity[] => {
    if (olderItems.length === 0) {
      return liveItems;
    }

    // Remove itens que ja estao na lista reativa
    const liveIds = new Set(liveItems.map((item) => item.id));
    const uniqueOlder = olderItems.filter((item) => !liveIds.has(item.id));

    return [...liveItems, ...uniqueOlder];
  }, [liveItems, olderItems]);

  const loadMore = useCallback(async (): Promise<void> => {
    if (!hasMore || isLoadingMore || isLoading) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const result = await repository.getAll({
        page,
        limit: DEFAULT_PAGE_SIZE,
      });

      setOlderItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, isLoading, repository, page]);

  return {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error: liveError,
  };
}
```

---

### 5. Container Centralizado de DI (`app/di/`)

**Proposito:** Centralizar toda a injecao de dependencias da aplicacao.

#### Estrutura

O Container DI e composto por 3 arquivos:

**1. `types.ts` - Definicao de Tipos**

```typescript
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type * as schema from '@infra/drizzle/schema';

export type DrizzleDB = ExpoSQLiteDatabase<typeof schema>;

export type FeatureUseCases = {
  create: (input: CreateInput) => Promise<FeatureEntity>;
  update: (id: string, data: UpdateData) => Promise<FeatureEntity>;
  delete: (id: string) => Promise<void>;
  getAll: (page?: number, limit?: number) => Promise<PaginatedResult>;
};

export type AppDependencies = {
  database: SqliteDatabase;
  drizzleDb: DrizzleDB;
  featureRepository: FeatureRepository;
  featureUseCases: FeatureUseCases;
};
```

**2. `container.ts` - Factory de Dependencias**

```typescript
export async function buildDependencies(): Promise<AppDependencies> {
  // 1. Inicializa DB
  const rawDb = openDatabaseSync('app.db', { enableChangeListener: true });
  rawDb.execSync('PRAGMA foreign_keys = ON;');
  const drizzleDb = drizzle(rawDb, { schema });

  // 2. Cria repositories
  const featureRepository = new FeatureDrizzleRepo(drizzleDb);

  // 3. Cria use cases com closure (repository ja injetado)
  const featureUseCases: FeatureUseCases = {
    create: (input) =>
      createFeature(input, { repository: featureRepository }),
    update: (id, data) =>
      updateFeature(featureRepository, id, data),
    delete: (id) =>
      deleteFeature(featureRepository, id),
    getAll: (page = 0, limit = 20) =>
      getAllFeatures(featureRepository, page, limit),
  };

  return {
    database,
    drizzleDb,
    featureRepository,
    featureUseCases,
  };
}
```

**3. `AppDependenciesProvider.tsx` - Context Provider**

```typescript
export function AppDependenciesProvider({ children, fallback }) {
  // ... inicializacao assincrona ...
  return (
    <AppDependenciesContext.Provider value={state.dependencies}>
      {children}
    </AppDependenciesContext.Provider>
  );
}

// Hooks expostos
export function useAppDependencies(): AppDependencies { /* ... */ }
export function useFeatureRepository(): FeatureRepository { /* ... */ }
export function useFeatureUseCases(): FeatureUseCases { /* ... */ }
```

---

### 6. Store de UI (`presentation/state/`)

**Proposito:** Gerenciar estado de UI apenas (nao dados de dominio).

```typescript
// src/presentation/state/feature/featureUIStore.ts
import { createStore } from 'zustand/vanilla';

export type FeatureUIState = {
  inputText: string;
  isSubmitting: boolean;
  lastError: Error | null;
  editingItem: FeatureEntity | null;
};

export type FeatureUIActions = {
  setInputText: (text: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  startEditing: (item: FeatureEntity) => void;
  cancelEditing: () => void;
  resetAfterMutation: () => void;
};

export const createFeatureUIStore = () =>
  createStore<FeatureUIState & FeatureUIActions>((set) => ({
    inputText: '',
    isSubmitting: false,
    lastError: null,
    editingItem: null,

    setInputText: (text) => set({ inputText: text }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setError: (error) => set({ lastError: error }),
    clearError: () => set({ lastError: null }),
    startEditing: (item) => set({ editingItem: item, inputText: item.text }),
    cancelEditing: () => set({ editingItem: null, inputText: '' }),
    resetAfterMutation: () => set({ inputText: '', editingItem: null, isSubmitting: false }),
  }));
```

---

### 7. ViewModel Hook (`presentation/hooks/`)

**Proposito:** Orquestrar dados reativos, estado de UI e operacoes.

```typescript
// src/presentation/hooks/useFeatureVM.ts
import { useCallback, useMemo } from 'react';
import { useStore } from 'zustand';

import { useFeatureUseCases } from '@app/di/AppDependenciesProvider';
import { useFeatureUIStore } from '../state/feature/FeatureUIStoreProvider';
import { useFeaturePaginated } from './useFeaturePaginated';

export function useFeatureVM() {
  const store = useFeatureUIStore();

  // UseCases do Container (repository ja injetado)
  const { create, update, delete: deleteItem } = useFeatureUseCases();

  // Dados reativos + paginacao
  const {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error: dataError,
  } = useFeaturePaginated();

  // Estado de UI via Zustand
  const inputText = useStore(store, (s) => s.inputText);
  const isSubmitting = useStore(store, (s) => s.isSubmitting);
  const editingItem = useStore(store, (s) => s.editingItem);
  const lastError = useStore(store, (s) => s.lastError);

  // Actions do Zustand
  const setInputText = useStore(store, (s) => s.setInputText);
  const setIsSubmitting = useStore(store, (s) => s.setIsSubmitting);
  const setError = useStore(store, (s) => s.setError);
  const resetAfterMutation = useStore(store, (s) => s.resetAfterMutation);

  // Combina erros
  const combinedError = useMemo(
    () => dataError ?? lastError,
    [dataError, lastError]
  );

  // Handler de submit
  const handleSubmit = useCallback(async () => {
    const trimmedText = inputText.trim();
    if (trimmedText.length === 0) return;

    setIsSubmitting(true);

    try {
      if (editingItem) {
        await update(editingItem.id, { text: trimmedText });
      } else {
        await create({ text: trimmedText });
      }
      resetAfterMutation();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to save'));
      setIsSubmitting(false);
    }
  }, [inputText, editingItem, create, update, resetAfterMutation, setError, setIsSubmitting]);

  return {
    items,
    inputText,
    isSubmitting,
    isLoading,
    isLoadingMore,
    hasMore,
    lastError: combinedError,
    editingItem,
    isEditing: editingItem !== null,
    // Actions
    setInputText,
    handleSubmit,
    handleLoadMore: loadMore,
    // ... outros handlers
  };
}
```

**Caracteristicas:**
- **Nao importa de @drizzle/***: Todo DI vem do Container
- **Combina 3 fontes**: Dados reativos + Estado UI + Operacoes
- **Expoe interface limpa**: Screen nao conhece arquitetura interna

---

## Estrutura de Arquivos

```
src/
├── app/
│   └── di/                              # Container de DI
│       ├── types.ts                     # DrizzleDB, FeatureUseCases, AppDependencies
│       ├── container.ts                 # buildDependencies() factory
│       └── AppDependenciesProvider.tsx  # Context provider + hooks
│
├── domain/feature/
│   ├── entities/
│   │   └── FeatureEntity.ts
│   ├── ports/
│   │   └── FeatureRepository.ts         # Interface com subscribeToFeature()
│   └── use-cases/
│       └── *.ts                         # Pure functions
│
├── infra/drizzle/
│   ├── FeatureDrizzleRepo.ts            # Implementa Repository + Subscriber Pattern
│   ├── schema.ts
│   └── index.ts
│
└── presentation/
    ├── hooks/
    │   ├── useFeatureLive.ts            # Hook reativo (usa repository.subscribe)
    │   ├── useFeaturePaginated.ts       # Paginacao hibrida (opcional)
    │   └── useFeatureVM.ts              # ViewModel
    │
    ├── state/feature/
    │   ├── featureUIStore.ts            # Store definition
    │   └── FeatureUIStoreProvider.tsx
    │
    └── screens/
        └── FeatureScreen.tsx
```

**Notas importantes:**
- Hooks reativos ficam em `presentation/hooks/`, NAO em `app/di/`
- Reatividade e implementada no Repository via Subscriber Pattern
- `presentation/` NAO importa de `@drizzle/*` ou `drizzle-orm/*`
- Use cases no domain continuam sendo **pure functions**

---

## Regras de Dependencia

| Camada | Pode importar de | NAO pode importar de |
|--------|------------------|----------------------|
| Screen | presentation/* | domain/*, infra/*, @drizzle/* |
| VM Hook | @app/di/*, presentation/* | infra/*, @drizzle/* |
| Live Hook | @app/di/*, @domain/entities | infra/*, @drizzle/* |
| Container (DI) | domain/*, infra/*, drizzle-orm/* | presentation/* |
| UI Store | domain/entities (tipos apenas) | infra/*, @drizzle/* |
| Domain Use Cases | domain/ports, domain/entities | infra/*, presentation/* |
| Drizzle Repo | domain/ports, @drizzle/* | presentation/* |

**Regra de ouro:** A camada `presentation/` NUNCA importa de `@drizzle/*` ou `drizzle-orm/*`.

---

## Fluxo de Dados e Mutacoes

```
1. Usuario interage com Screen
       ↓
2. useFeatureVM().handleSubmit()
       ↓
3. useFeatureUseCases().create()
       ↓
4. createFeature(input, { repository })  ← Use Case puro
       ↓
5. repository.create()
       ↓
6. FeatureDrizzleRepo.create():
   - Executa transacao no DB
   - Retorna entidade criada
   - Chama this.notifySubscribers()
       ↓
7. notifySubscribers() itera todos os callbacks registrados
       ↓
8. Cada callback recebe: callback(updatedItemsArray)
       ↓
9. useFeatureLive() recebe callback → setItems(newItems)
       ↓
10. useFeaturePaginated() ve nova data → useMemo deduplica
       ↓
11. useFeatureVM() retorna items atualizados
       ↓
12. Screen re-renderiza com novos dados
```

---

## Checklist para Nova Feature

1. [ ] **Domain**: Criar entidades em `domain/feature/entities/`
2. [ ] **Domain**: Criar interface em `domain/feature/ports/FeatureRepository.ts`
   - Incluir metodo `subscribeToFeature(callback, options): unsubscribe`
3. [ ] **Domain**: Criar use cases em `domain/feature/use-cases/` (pure functions)
4. [ ] **Infra**: Criar `infra/drizzle/FeatureDrizzleRepo.ts`
   - Implementar Subscriber Pattern (Map de subscribers + notifySubscribers)
5. [ ] **DI Container**: Adicionar tipo `FeatureUseCases` em `app/di/types.ts`
6. [ ] **DI Container**: Criar use cases com closure em `app/di/container.ts`
7. [ ] **DI Container**: Adicionar hooks em `AppDependenciesProvider.tsx`:
   - `useFeatureRepository()`
   - `useFeatureUseCases()`
8. [ ] **Presentation**: Criar hook reativo `presentation/hooks/useFeatureLive.ts`
9. [ ] **Presentation**: (Opcional) Criar `useFeaturePaginated.ts` se precisar de paginacao
10. [ ] **Presentation**: Criar UI store em `state/feature/`
11. [ ] **Presentation**: Criar `useFeatureVM.ts` combinando dados + UI + operacoes
12. [ ] **Presentation**: Criar Screen
13. [ ] **Tests**: Testar use cases, repository, ViewModel

**Exemplo de implementacao do Subscriber no Repository:**

```typescript
// 1. Adicionar metodo na interface (domain)
interface FeatureRepository {
  subscribeToFeature(
    callback: (items: FeatureEntity[]) => void,
    options?: { limit?: number }
  ): () => void;
  // ... outros metodos
}

// 2. Implementar no FeatureDrizzleRepo (infra)
class FeatureDrizzleRepo implements FeatureRepository {
  private subscribers = new Map<Function, { limit?: number }>();

  subscribeToFeature(callback, options) {
    this.subscribers.set(callback, options ?? {});
    // Emitir dados iniciais...
    return () => this.subscribers.delete(callback);
  }

  private async notifySubscribers() {
    for (const [callback, opts] of this.subscribers) {
      const data = await this.db.query.featureTable.findMany({ limit: opts.limit });
      callback(data.map(mapRawToEntity));
    }
  }
}

// 3. Criar hook na presentation
function useFeatureLive(limit?: number) {
  const repo = useFeatureRepository();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = repo.subscribeToFeature(setItems, { limit });
    return unsub;
  }, [repo, limit]);

  return { items };
}
```

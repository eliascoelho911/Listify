# Research: Listify Core

**Branch**: `004-listify-core` | **Data**: 2026-01-20 | **Plan**: [plan.md](./plan.md)

Este documento consolida as pesquisas técnicas realizadas durante Phase 0 do planejamento, resolvendo todas as questões marcadas como "NEEDS CLARIFICATION" e documentando best practices para as tecnologias escolhidas.

---

## 1. Drizzle ORM com Expo SQLite

### Decisão
Usar Drizzle ORM v0.45.1 com driver `drizzle-orm/expo-sqlite` para persistência local.

### Racional
- **Type-safety**: Schema TypeScript gera tipos automaticamente
- **Migrations bundled**: `useMigrations` hook aplica migrations no boot do app
- **Zero runtime dependencies**: Tree-shakeable, leve para mobile
- **Drizzle Studio**: Dev tools para debug do banco em desenvolvimento

### Padrão de Implementação

```typescript
// src/infra/drizzle/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const lists = sqliteTable('lists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  listType: text('list_type').notNull(), // 'notes' | 'shopping' | 'movies' | 'books' | 'games'
  isPrefabricated: integer('is_prefabricated', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

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
  metadata: text('metadata', { mode: 'json' }),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
```

```typescript
// src/infra/drizzle/index.ts
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export function initializeDatabase(dbName = 'listify.db') {
  const expoDb = SQLite.openDatabaseSync(dbName);
  return drizzle(expoDb, { schema });
}

export type DrizzleDB = ReturnType<typeof initializeDatabase>;
```

### Migrations
- Usar `drizzle-kit generate` para gerar migrations SQL
- Migrations são bundled no app via import
- `useMigrations` hook no AppDependenciesProvider aplica automaticamente

### Alternativas Consideradas
| Alternativa | Rejeitada porque |
|-------------|------------------|
| WatermelonDB | Mais complexo, overkill para offline-only sem sync |
| TypeORM | Pior performance em mobile, tipo de projeto web-first |
| Raw SQLite | Sem type-safety, mais código boilerplate |

---

## 2. Zustand com Optimistic Updates

### Decisão
Usar Zustand v5.0.9 com padrão de updates otimistas e rollback em erro.

### Racional
- **Simplicidade**: API mínima, sem boilerplate
- **Performance**: Não usa Context, evita re-renders desnecessários
- **TypeScript**: Inferência de tipos excelente
- **Hooks-based**: Integra naturalmente com React

### Padrão de Implementação

```typescript
// src/presentation/stores/useListStore.ts
import { create } from 'zustand';
import type { List, CreateListInput } from '@domain/list';
import type { ListRepository } from '@domain/list/ports';

interface ListState {
  lists: List[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLists: () => Promise<void>;
  createList: (input: CreateListInput) => Promise<List | null>;
  deleteList: (id: string) => Promise<boolean>;
}

export function createListStore(listRepository: ListRepository) {
  return create<ListState>((set, get) => ({
    lists: [],
    isLoading: false,
    error: null,

    fetchLists: async () => {
      set({ isLoading: true, error: null });
      try {
        const lists = await listRepository.getAll({ sortBy: 'createdAt', sortDirection: 'desc' });
        set({ lists, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to fetch lists', isLoading: false });
      }
    },

    createList: async (input) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticList: List = {
        id: tempId,
        ...input,
        isPrefabricated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as List;

      // Optimistic update
      const backup = get().lists;
      set({ lists: [...backup, optimisticList] });

      try {
        const created = await listRepository.create(input);
        // Replace temp with real
        set({ lists: get().lists.map(l => l.id === tempId ? created : l) });
        return created;
      } catch (error) {
        // Rollback
        set({ lists: backup, error: 'Failed to create list' });
        return null;
      }
    },

    deleteList: async (id) => {
      const backup = get().lists;
      // Optimistic remove
      set({ lists: backup.filter(l => l.id !== id) });

      try {
        const success = await listRepository.delete(id);
        if (!success) throw new Error('Delete failed');
        return true;
      } catch (error) {
        // Rollback
        set({ lists: backup, error: 'Failed to delete list' });
        return false;
      }
    },
  }));
}
```

### Hook de Acesso com DI

```typescript
// src/presentation/hooks/useListStore.ts
import { useMemo } from 'react';
import { useAppDependencies } from '@app/di/AppDependenciesProvider';
import { createListStore } from '../stores/useListStore';

export function useListStore() {
  const { listRepository } = useAppDependencies();
  return useMemo(() => createListStore(listRepository), [listRepository]);
}
```

### Alternativas Consideradas
| Alternativa | Rejeitada porque |
|-------------|------------------|
| Redux Toolkit | Mais boilerplate, overkill para app local |
| Jotai | Atomico demais, stores fragmentados para este caso |
| React Context | Re-renders em cascata, pior performance |

---

## 3. Expo Router Tabs Layout

### Decisão
Usar Expo Router v6 com layout `(tabs)` para navegação principal via Bottombar.

### Racional
- **File-based routing**: Convenção sobre configuração
- **Native tabs**: Performance nativa, transições suaves
- **Deep linking**: URLs para cada tela automaticamente
- **Nested layouts**: Suporta drawer + tabs + stack

### Estrutura de Arquivos

```text
app/
├── _layout.tsx           # Root: providers + Stack
├── (tabs)/
│   ├── _layout.tsx       # Tabs navigator com Bottombar
│   ├── index.tsx         # Inbox (tab 1)
│   ├── search.tsx        # Search (tab 2)
│   ├── notes.tsx         # Notes (tab 3)
│   └── lists.tsx         # Lists (tab 4)
├── list/
│   └── [id].tsx          # Stack: List detail
├── note/
│   └── [id].tsx          # Stack: Note detail
├── shopping/
│   └── [id].tsx          # Stack: Shopping list
├── history/
│   └── [listId].tsx      # Stack: Purchase history
└── settings.tsx          # Stack: Settings
```

### Implementação do Tabs Layout

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Bottombar } from '@design-system/organisms/Bottombar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <Bottombar {...props} />}
      screenOptions={{
        headerShown: false, // Custom Navbar per screen
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Inbox' }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Buscar' }}
      />
      <Tabs.Screen
        name="notes"
        options={{ title: 'Notas' }}
      />
      <Tabs.Screen
        name="lists"
        options={{ title: 'Listas' }}
      />
    </Tabs>
  );
}
```

### FAB Central
O botão central "Adicionar" não é uma tab, mas um FAB absoluto no Bottombar que abre o SmartInputModal.

---

## 4. Smart Input Parser

### Decisão
Implementar parser de texto com regex para extrair @lista, quantidade e valor monetário, seguindo Clean Architecture com port no domain.

### Racional
- **Offline-first**: Parser local, sem latência de rede
- **Determinístico**: Regras claras, testáveis
- **Extensível**: Fácil adicionar novos padrões
- **Clean Architecture**: Port no domain, implementação no infra

### Padrão de Implementação

#### 1. Port no Domain (abstração)

```typescript
// src/domain/common/ports/smart-input-parser.port.ts
export interface Highlight {
  type: 'list' | 'section' | 'price' | 'quantity';
  start: number;
  end: number;
  value: string;
}

export interface ParsedInput {
  title: string;
  listName: string | null;
  sectionName: string | null;
  quantity: string | null;
  price: number | null;
  rawText: string;
  highlights: Highlight[];
}

export interface ParseContext {
  currentListName?: string;
  isShoppingList?: boolean;
}

export interface SmartInputParser {
  parse(text: string, context?: ParseContext): ParsedInput;
}
```

#### 2. Implementação no Infra

```typescript
// src/infra/services/SmartInputParserService.ts
import type { SmartInputParser, ParsedInput, ParseContext } from '@domain/common/ports';

const LIST_PATTERN = /@([^:\s@]+)(?::([^\s@]+))?/g;
const PRICE_PATTERN = /R\$\s?(\d+(?:[.,]\d{2})?)/gi;
const QUANTITY_PATTERN = /(\d+(?:[.,]\d+)?)\s*(kg|g|l|ml|un|pc|dz|cx)/gi;

export class SmartInputParserService implements SmartInputParser {
  parse(text: string, context?: ParseContext): ParsedInput {
    const highlights: Highlight[] = [];
    let title = text;
    let listName: string | null = null;
    let sectionName: string | null = null;
    let quantity: string | null = null;
    let price: number | null = null;

    // Extract @list:section
    const listMatch = LIST_PATTERN.exec(text);
    if (listMatch) {
      listName = listMatch[1];
      sectionName = listMatch[2] || null;
      highlights.push({
        type: 'list',
        start: listMatch.index,
        end: listMatch.index + listMatch[0].length,
        value: listMatch[0],
      });
      title = title.replace(listMatch[0], '').trim();
    }

    // Extract price (only for shopping context)
    if (context?.isShoppingList) {
      const priceMatch = PRICE_PATTERN.exec(text);
      if (priceMatch) {
        price = parseFloat(priceMatch[1].replace(',', '.'));
        highlights.push({
          type: 'price',
          start: priceMatch.index,
          end: priceMatch.index + priceMatch[0].length,
          value: priceMatch[0],
        });
        title = title.replace(priceMatch[0], '').trim();
      }
    }

    // Extract quantity
    const quantityMatch = QUANTITY_PATTERN.exec(text);
    if (quantityMatch) {
      quantity = quantityMatch[0];
      highlights.push({
        type: 'quantity',
        start: quantityMatch.index,
        end: quantityMatch.index + quantityMatch[0].length,
        value: quantityMatch[0],
      });
      title = title.replace(quantityMatch[0], '').trim();
    }

    return {
      title: title.trim(),
      listName,
      sectionName,
      quantity,
      price,
      rawText: text,
      highlights: highlights.sort((a, b) => a.start - b.start),
    };
  }
}
```

#### 3. DI Container

```typescript
// src/app/di/container.ts
import { SmartInputParserService } from '@infra/services/SmartInputParserService';

export async function buildDependencies(): Promise<AppDependencies> {
  return {
    // ...repositories
    smartInputParser: new SmartInputParserService(),
  };
}
```

#### 4. Hook via DI (Presentation)

```typescript
// src/presentation/hooks/useSmartInput.ts
import { useState, useMemo } from 'react';
import { useAppDependencies } from '@app/di/AppDependenciesProvider';

export function useSmartInput(currentListName?: string, isShoppingList?: boolean) {
  const { smartInputParser } = useAppDependencies(); // ✅ Via DI
  const [text, setText] = useState('');

  const parsed = useMemo(
    () => smartInputParser.parse(text, { currentListName, isShoppingList }),
    [text, smartInputParser, currentListName, isShoppingList]
  );

  return { text, setText, parsed };
}
```

### Regras de Parsing
1. `@Lista` → Referência a lista existente ou criação de nova
2. `@Lista:Seção` → Lista + seção específica
3. `:Seção` → Seção na lista atual (contexto implícito)
4. `R$X,XX` → Valor monetário (só extraído se lista é tipo Shopping)
5. `Xkg/g/l/ml/un` → Quantidade com unidade

### Alternativas Consideradas
| Alternativa | Rejeitada porque |
|-------------|------------------|
| NLP/AI parsing | Latência, custo, requer conexão |
| Parser combinators | Complexidade desnecessária para padrões simples |
| Manual split | Frágil, difícil manter |
| Import direto no hook | Viola Clean Architecture (presentation → infra) |

---

## 5. Category Inference

### Decisão
Usar heurísticas locais para inferência de categoria, com fallback para mini-seletor manual. Port no domain, implementação no infra.

### Racional
- **Offline-first**: Funciona sem conexão
- **Performance**: Instantâneo, sem latência
- **Backlog**: IA cloud pode ser adicionada depois
- **Clean Architecture**: Port no domain, implementação no infra

### Padrão de Implementação

#### 1. Port no Domain (abstração)

```typescript
// src/domain/common/ports/category-inference.port.ts
import type { ListType } from '@domain/list';

export type InferenceConfidence = 'high' | 'medium' | 'low';

export interface InferenceResult {
  listType: ListType;
  confidence: InferenceConfidence;
}

export interface CategoryInference {
  infer(text: string): InferenceResult;
}
```

#### 2. Implementação no Infra

```typescript
// src/infra/services/CategoryInferenceService.ts
import type { CategoryInference, InferenceResult } from '@domain/common/ports';
import type { ListType } from '@domain/list';

const SHOPPING_PATTERNS = [
  /R\$\s?\d/i,
  /comprar/i,
  /mercado/i,
  /supermercado/i,
  /\d+\s*(kg|g|l|ml|un)/i,
];

const MOVIE_PATTERNS = [
  /assistir/i,
  /filme/i,
  /cinema/i,
  /série/i,
  /temporada/i,
];

const BOOK_PATTERNS = [
  /ler/i,
  /livro/i,
  /autor/i,
  /editora/i,
  /capítulo/i,
];

const GAME_PATTERNS = [
  /jogar/i,
  /game/i,
  /jogo/i,
  /console/i,
  /ps5|xbox|switch|pc/i,
];

export class CategoryInferenceService implements CategoryInference {
  infer(text: string): InferenceResult {
    const scores = {
      shopping: this.countMatches(text, SHOPPING_PATTERNS),
      movies: this.countMatches(text, MOVIE_PATTERNS),
      books: this.countMatches(text, BOOK_PATTERNS),
      games: this.countMatches(text, GAME_PATTERNS),
      notes: 0,
    };

    const maxScore = Math.max(...Object.values(scores));

    if (maxScore === 0) {
      return { listType: 'notes', confidence: 'low' };
    }

    const winner = Object.entries(scores).find(([, score]) => score === maxScore)![0] as ListType;
    const confidence = maxScore >= 2 ? 'high' : maxScore === 1 ? 'medium' : 'low';

    return { listType: winner, confidence };
  }

  private countMatches(text: string, patterns: RegExp[]): number {
    return patterns.filter(p => p.test(text)).length;
  }
}
```

#### 3. DI Container

```typescript
// src/app/di/container.ts
import { CategoryInferenceService } from '@infra/services/CategoryInferenceService';

export async function buildDependencies(): Promise<AppDependencies> {
  return {
    // ...repositories
    categoryInference: new CategoryInferenceService(),
  };
}
```

### Fluxo UX
1. Usuário digita `@NovaLista` (lista não existe)
2. Sistema infere categoria baseado no conteúdo via `categoryInference.infer()`
3. Se `confidence === 'high'`: criar silenciosamente
4. Se `confidence !== 'high'`: exibir mini-seletor de tipo

---

## 6. External Providers (TMDb, Google Books, IGDB)

### Decisão
Implementar services abstratos com interface comum, debounce de 300ms para busca.

### Racional
- **Interface uniforme**: MediaSearchResult para todos os providers
- **Graceful degradation**: Funciona sem conexão (entrada manual)
- **Rate limiting**: Debounce evita excesso de requests

### Padrão de Interface

```typescript
// src/domain/common/ports/media-provider.port.ts
export interface MediaSearchResult {
  externalId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  year: number | null;
  metadata: Record<string, unknown>;
}

export interface MediaProviderRepository {
  search(query: string): Promise<MediaSearchResult[]>;
  getById(externalId: string): Promise<MediaSearchResult | null>;
}
```

### Implementação TMDb

```typescript
// src/infra/services/TMDbProviderService.ts
import type { MediaProviderRepository, MediaSearchResult } from '@domain/common/ports';

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export class TMDbProviderService implements MediaProviderRepository {
  async search(query: string): Promise<MediaSearchResult[]> {
    if (!TMDB_API_KEY) return [];

    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.results.map((movie: any) => ({
      externalId: String(movie.id),
      title: movie.title,
      description: movie.overview,
      imageUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      metadata: {
        voteAverage: movie.vote_average,
        originalTitle: movie.original_title,
      },
    }));
  }

  async getById(externalId: string): Promise<MediaSearchResult | null> {
    // Implementation similar to search but for single item
  }
}
```

### DI Container

```typescript
// src/app/di/container.ts
import { TMDbProviderService } from '@infra/services/TMDbProviderService';
import { GoogleBooksProviderService } from '@infra/services/GoogleBooksProviderService';
import { IGDBProviderService } from '@infra/services/IGDBProviderService';

export async function buildDependencies(): Promise<AppDependencies> {
  return {
    // ...repositories
    movieProvider: new TMDbProviderService(),
    bookProvider: new GoogleBooksProviderService(),
    gameProvider: new IGDBProviderService(),
  };
}
```

### Alternativas Consideradas
| Alternativa | Rejeitada porque |
|-------------|------------------|
| GraphQL federation | Overkill para 3 providers |
| Proxy server | Custo e complexidade extra |
| Cache agressivo | Dados podem ficar desatualizados |

---

## 7. Drag and Drop (Reordenação)

### Decisão
Usar `react-native-gesture-handler` + `react-native-reanimated` para drag and drop fluido.

### Racional
- **Performance**: Animações no thread de UI nativo
- **Já instalados**: Dependências existentes no projeto
- **Padrão Expo**: Recomendado oficialmente

### Padrão de Implementação

```typescript
// src/presentation/hooks/useDragAndDrop.ts
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export function useDragAndDrop<T extends { id: string; sortOrder: number }>(
  items: T[],
  onReorder: (items: T[]) => void
) {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      // Calculate new position and update sort order
      isDragging.value = false;
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: isDragging.value ? 100 : 0,
    opacity: isDragging.value ? 0.9 : 1,
  }));

  return { panGesture, animatedStyle };
}
```

---

## 8. Infinite Scroll (Paginação)

### Decisão
Usar `FlatList` nativo com `onEndReached` + threshold para carregar mais itens.

### Racional
- **Virtualização nativa**: Performance garantida
- **Simple API**: Não precisa biblioteca extra
- **Threshold configurável**: UX suave sem loading visível

### Padrão de Implementação

```typescript
// src/presentation/hooks/useInfiniteScroll.ts
import { useState, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchPage: (offset: number, limit: number) => Promise<{ data: T[]; total: number }>;
  pageSize?: number;
}

export function useInfiniteScroll<T>({ fetchPage, pageSize = 20 }: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { data, total } = await fetchPage(offset, pageSize);
      setItems((prev) => [...prev, ...data]);
      setOffset((prev) => prev + data.length);
      setHasMore(offset + data.length < total);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPage, offset, pageSize, isLoading, hasMore]);

  const refresh = useCallback(async () => {
    setOffset(0);
    setHasMore(true);
    const { data, total } = await fetchPage(0, pageSize);
    setItems(data);
    setOffset(data.length);
    setHasMore(data.length < total);
  }, [fetchPage, pageSize]);

  return { items, isLoading, hasMore, loadMore, refresh };
}
```

---

## Conclusão

Todas as questões técnicas foram resolvidas:

| Item | Status | Decisão |
|------|--------|---------|
| Database ORM | ✅ Resolvido | Drizzle ORM + Expo SQLite |
| State Management | ✅ Resolvido | Zustand com optimistic updates |
| Navigation | ✅ Resolvido | Expo Router tabs layout |
| Smart Input | ✅ Resolvido | Regex parser local |
| Category Inference | ✅ Resolvido | Heurísticas locais + mini-seletor |
| External Providers | ✅ Resolvido | TMDb/Google Books/IGDB com debounce |
| Drag and Drop | ✅ Resolvido | Gesture Handler + Reanimated |
| Infinite Scroll | ✅ Resolvido | FlatList nativo |

Próximo passo: Phase 1 - Design & Contracts (data-model.md, contracts/, quickstart.md)

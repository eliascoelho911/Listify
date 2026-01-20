# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web |
| `npm run lint` | Run ESLint (zero warnings policy) |
| `npm test` | Run Jest tests |

**Pre-commit**: `npm test && npm run lint`

## Architecture

Listify is a React Native shopping list app using **Clean Architecture**:

```
src/
├── app/          # Bootstrap, DI container, i18n setup
├── domain/       # Pure business logic (no React/RN imports enforced by ESLint)
│   └── shopping/ # Entities, value-objects, ports, use-cases
├── data/         # Mappers (SQLite row → domain entity)
├── infra/        # SQLite implementation, external services
├── presentation/ # React components, screens, Zustand stores, hooks
└── design-system/# Theme tokens (colors, spacing, typography), DS components
```

**Dependency flow**: `app` → `presentation` → `domain` ← `data` ← `infra`

**File-based routing**: `app/` directory uses Expo Router

## Key Patterns

- **State**: Zustand with optimistic updates and rollback on error
- **DI**: Container in `src/app/di/container.ts` with async bootstrap
- **Repository**: `ShoppingRepository` interface in domain, SQLite impl in infra
- **Path aliases**: `@domain/*`, `@presentation/*`, `@infra/*`, `@data/*`, `@app/*`, `@design-system/*`
- **Reactive Clean Architecture**: Pattern for features with reactive data - see [`docs/REACTIVE_CLEAN_ARCHITECTURE.md`](./docs/REACTIVE_CLEAN_ARCHITECTURE.md)

## Clean Architecture & SOLID Principles

### Domain Layer (Pure Business Logic)

The domain layer contains entities, value objects, and ports (interfaces). It has **zero dependencies on frameworks or external libraries** (enforced by ESLint).

#### Entity Composition with Traits

Entities are composed using TypeScript intersection types (traits pattern):

```typescript
// src/domain/common/entity/index.ts
export type Entity = { id: string };
export type Timestamped = { createdAt: Date; updatedAt: Date };
export type Sortable = { sortOrder: number };

// src/domain/section/entities/section.entity.ts - Composing traits
export type Section = Entity & Sortable & Timestamped & {
  listId: string;
  name: string;
};
```

- ❌ WRONG: Creating a monolithic base class with all properties
- ✅ RIGHT: Compose small, focused traits via intersection types

#### Discriminated Unions for Type Safety

Use discriminated unions with a `type` literal to enable exhaustive type checking:

```typescript
// src/domain/item/entities/item.entity.ts
export type NoteItem = BaseItem & { type: 'note'; description?: string };
export type ShoppingItem = BaseItem & { type: 'shopping'; quantity?: string; price?: number };
export type Item = NoteItem | ShoppingItem | MovieItem | BookItem | GameItem;
export type ItemType = Item['type']; // 'note' | 'shopping' | 'movie' | 'book' | 'game'
```

- ❌ WRONG: Using `item.type === 'note'` without TypeScript narrowing the type
- ✅ RIGHT: TypeScript automatically narrows the union type after the check

#### Input/Output Types Pattern

Define explicit input types for create/update operations:

```typescript
// src/domain/list/entities/list.entity.ts
export type CreateListInput = Omit<List, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateListInput = Partial<Omit<List, 'id' | 'createdAt'>>;
```

| Type | Pattern | Excludes |
|------|---------|----------|
| CreateInput | `Omit<Entity, ...>` | id, createdAt, updatedAt |
| UpdateInput | `Partial<Omit<Entity, ...>>` | id, createdAt, type (immutable) |

#### Repository Ports (Interface Segregation - ISP)

Repositories extend small, focused use case interfaces:

```typescript
// src/domain/common/ports.ts - Granular interfaces
export interface CreateUseCase<T, Input> { create(input: Input): Promise<T>; }
export interface GetByIdUseCase<T> { getById(id: string): Promise<T | null>; }
export interface UpdateUseCase<T, Input> { update(id: string, updates: Input): Promise<T | null>; }
export interface DeleteUseCase { delete(id: string): Promise<boolean>; }
export interface SearchUseCase<T, Criteria, SortField> { search(...): Promise<PaginatedResult<T>>; }

// src/domain/list/ports/list.repository.ts - Composed repository
export interface ListRepository extends
  CreateUseCase<List, CreateListInput>,
  ReadUseCase<List, ListSortField>,
  UpdateUseCase<List, UpdateListInput>,
  DeleteUseCase,
  SearchUseCase<List, ListFilterCriteria, ListSortField>,
  GroupUseCase<List, ListGroupCriteria> {}
```

- ❌ WRONG: One massive interface with 20+ methods
- ✅ RIGHT: Compose from single-responsibility use case interfaces (ISP)

#### Domain Layer Rules

| Rule | Enforcement |
|------|-------------|
| No React/RN imports | ESLint rule |
| No framework dependencies | Pure TypeScript only |
| Depend on abstractions | Ports (interfaces), not implementations |
| One entity per file | Convention |

### Data Layer (Mappers)

Mappers transform between persistence format (SQLite rows) and domain entities. They are **pure functions** with no side effects.

```typescript
// Pattern for src/data/mappers/
export function toDomainList(row: ListRow): List {
  return {
    id: row.id,
    listType: row.list_type as ListType,
    name: row.name,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function toPersistenceList(input: CreateListInput): Omit<ListRow, 'id'> {
  return {
    list_type: input.listType,
    name: input.name,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}
```

- ❌ WRONG: Business logic in mappers (validation, calculations)
- ✅ RIGHT: Pure data transformation only

### Infrastructure Layer (Implementations)

Infrastructure implements domain ports using external libraries (Drizzle, SQLite):

```typescript
// Pattern for src/infra/repositories/
export class DrizzleListRepository implements ListRepository {
  constructor(private db: DrizzleDB) {}

  async create(input: CreateListInput): Promise<List> {
    const row = await this.db.insert(lists).values(toPersistenceList(input)).returning();
    return toDomainList(row[0]);
  }

  async getById(id: string): Promise<List | null> {
    const row = await this.db.select().from(lists).where(eq(lists.id, id)).get();
    return row ? toDomainList(row) : null;
  }
}
```

**Dependency Inversion Principle (DIP)**: Infra depends on domain interfaces, not the reverse.

### Dependency Injection

#### Container Pattern

```typescript
// src/app/di/container.ts
export async function buildDependencies(options?: BuildDependenciesOptions): Promise<AppDependencies> {
  const db = await initializeDatabase(options?.databaseName);
  const listRepository = new DrizzleListRepository(db);
  const itemRepository = new DrizzleItemRepository(db);
  return { listRepository, itemRepository, /* ... */ };
}
```

#### React Context Provider

```typescript
// src/app/di/AppDependenciesProvider.tsx - Already implemented
export function useAppDependencies(): AppDependencies {
  const context = useContext(AppDependenciesContext);
  if (!context) throw new Error('useAppDependencies must be used within AppDependenciesProvider');
  return context;
}
```

#### Accessing Dependencies

- ❌ WRONG: Import repositories directly in components
  ```typescript
  import { DrizzleListRepository } from '@infra/repositories';
  const repo = new DrizzleListRepository(db); // Tight coupling!
  ```
- ✅ RIGHT: Use DI hook in stores/hooks
  ```typescript
  const { listRepository } = useAppDependencies();
  ```

### Presentation Layer Patterns

#### Separation of Concerns

Components should be "dumb" - business logic belongs in stores:

- ❌ WRONG: Business logic in components
  ```typescript
  function ListScreen() {
    const handleDelete = async (id) => {
      if (items.length === 1) { showWarning(); return; } // Business logic in UI!
      await repo.delete(id);
    };
  }
  ```
- ✅ RIGHT: Business logic in Zustand store
  ```typescript
  // Store handles logic + optimistic updates
  const useListStore = create((set, get) => ({
    deleteItem: async (id) => {
      const backup = get().items;
      set({ items: backup.filter(i => i.id !== id) }); // Optimistic
      try {
        await listRepository.delete(id);
      } catch {
        set({ items: backup }); // Rollback
      }
    }
  }));

  // Component is dumb
  function ListScreen() {
    const { items, deleteItem } = useListStore();
    return <List data={items} onDelete={deleteItem} />;
  }
  ```

#### Custom Hooks Pattern

Separate concerns into focused hooks:

```typescript
// ✅ Data fetching hook
function useListData(listId: string) {
  const { listRepository } = useAppDependencies();
  const [list, setList] = useState<List | null>(null);
  useEffect(() => { listRepository.getById(listId).then(setList); }, [listId]);
  return { list, isLoading: list === null };
}

// ✅ UI state hook (separate from data)
function useListUI() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  return { isEditing, setIsEditing, selectedIds, toggleSelection };
}
```

### SOLID Quick Reference

| Principle | Application in Listify |
|-----------|------------------------|
| **S**ingle Responsibility | One entity per file, one use case per interface |
| **O**pen/Closed | Extend via trait composition, not modification |
| **L**iskov Substitution | Discriminated unions ensure type safety |
| **I**nterface Segregation | Small use case interfaces (Create, Read, Update, Delete) |
| **D**ependency Inversion | Domain defines ports, infra implements them |

### Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Importing React in domain | Violates layer isolation | ESLint enforces this |
| Business logic in components | Hard to test, violates SRP | Move to stores |
| Direct repository instantiation | Tight coupling | Use DI container |
| Missing `type` in discriminated unions | Runtime errors | Always include discriminator |
| Mutable domain entities | Side effects | Use immutable patterns (spread, map) |

## Coding Guidelines

### TypeScript - Strongly Typed Development (MANDATORY)
**ALWAYS develop with strong typing. Avoid any implicit types or loose typing patterns.**

- Use explicit types for ALL function parameters, return types, and variables
  - ❌ WRONG: `function getData(data) { ... }`
  - ✅ RIGHT: `function getData(data: ShoppingItem[]): Promise<void> { ... }`
- Use `ReactElement` for component return types (not `JSX.Element`)
- Use `StyleProp<TextStyle>` or `StyleProp<ViewStyle>` for React Native style props (never use arrays directly as `TextStyle`)
- Never use implicit `any` type - always use explicit types or generics
- Define proper types for all component props (use interfaces/types in `.types.ts` files)
- Use generics where appropriate: `Array<T>`, `Optional<T>`, etc.
- Strict mode enabled - TypeScript errors MUST be resolved, never ignored
- Avoid `unknown` unless necessary; prefer specific types

### Internationalization (Required)
- All UI text must use `t()` or `<Trans />` from react-i18next
- Supported: pt-BR, en (fallback: `en`)
- User data (item names, custom categories) is NOT translated
- Use `FALLBACK_LOCALE` constant from `src/domain/shopping/constants.ts`
- Format currency/numbers/dates with `Intl.*Format` + active locale

### Design System (src/design-system/)

**CRITICAL**: Follow Atomic Design methodology with strict hierarchy and token-based styling.

**Design Philosophy**: O Design System do Listify é um **remix inspirado no Shadcn UI** - usamos a filosofia e estrutura de tokens do Shadcn como base, mas com customizações significativas para atender a identidade visual e requisitos mobile-first do Listify. Não é uma implementação completa do Shadcn, mas sim uma adaptação com componentes e tokens próprios.

**Principais diferenças em relação ao Shadcn**:
- Tipografia customizada (Fira Sans/Code vs system fonts)
- Espaçamento compacto (25-33% menor para otimização mobile)
- Border radius large (50-100% maior para identidade playful)
- Dark theme como padrão (não segue system preference)
- Componentes adaptados para React Native (não são ports diretos do Shadcn Web)

#### Component Creation Workflow

**ALWAYS use CLI to create components** (NEVER create manually):
```bash
npm run ds generate atom ComponentName      # For atoms
npm run ds generate molecule ComponentName  # For molecules
npm run ds generate organism ComponentName  # For organisms
```

CLI generates 5 files automatically:
- `Component.tsx` - Main component (uses `useTheme()` hook)
- `Component.styles.ts` - Style factory with theme tokens
- `Component.types.ts` - TypeScript interfaces
- `Component.stories.tsx` - Storybook documentation
- `Component.test.tsx` - Jest tests

#### Mandatory Rules (Enforced by ESLint)

1. **Zero Hard-Coded Values** (ESLint: `no-hardcoded-values`)
   - ❌ NEVER: `backgroundColor: '#06b6d4'`, `padding: 16`, `fontSize: 14`
   - ✅ ALWAYS: `backgroundColor: theme.colors.primary`, `padding: theme.spacing.lg`, `fontSize: theme.typography.sizes.sm`

2. **Use `useTheme()` Hook** (ESLint: `theme-provider-usage`)
   - ❌ NEVER import theme directly: `import { darkTheme } from '@design-system/theme/theme'`
   - ✅ ALWAYS use hook: `const { theme } = useTheme()`

3. **Respect Atomic Design Hierarchy** (ESLint: `atomic-design-imports`)
   - **Atoms** → can import: tokens, theme, utils | ❌ CANNOT: molecules, organisms
   - **Molecules** → can import: atoms, tokens, theme, utils | ❌ CANNOT: other molecules, organisms
   - **Organisms** → can import: atoms, molecules, tokens, theme, utils | ❌ CANNOT: templates, pages

#### Component Structure Template

```typescript
// Component.tsx
import { useTheme } from '../../theme';
import { createComponentStyles } from './Component.styles';
import type { ComponentProps } from './Component.types';

export function Component(props: ComponentProps): ReactElement {
  const { theme } = useTheme(); // ✅ Required hook
  const styles = createComponentStyles(theme);
  return <View style={styles.container}>{props.children}</View>;
}

// Component.styles.ts
export const createComponentStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,     // ✅ Token
      padding: theme.spacing.md,              // ✅ Token
      borderRadius: theme.radii.lg,           // ✅ Token
      fontFamily: theme.typography.families.body, // ✅ Token
    },
  });
};
```

#### Available Tokens

- **Colors**: `theme.colors.{primary, secondary, background, foreground, card, muted, accent, destructive, border, input, ring, topbar, ...}`
- **Spacing**: `theme.spacing.{xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, ...}`
- **Typography**: `theme.typography.{families.body: 'Fira Sans', families.mono: 'Fira Code', sizes.base: 16, weights.semibold: 600, ...}`
- **Radii**: `theme.radii.{sm: 8, md: 12, lg: 16, xl: 24, full: 9999}`

#### Pre-Commit Validation (MANDATORY)

```bash
npm run lint      # ESLint - MUST pass with zero warnings
npm test         # Jest tests - MUST pass
npm run storybook # Visual validation - dark & light themes
```

#### Storybook

View and develop components in isolation:
```bash
npm run storybook              # Start Storybook
npm run storybook:generate     # Regenerate stories index
```

Storybook config: `.rnstorybook/` (React Native specific, not `.storybook/`)

#### Documentation

- Full workflow: `src/design-system/README.md` (has Quick Reference at top)
- Contributing guide: `src/design-system/CONTRIBUTING.md`
- Quick start: `specs/001-design-system/quickstart.md`

**Design philosophy**: Modern, Friendly - Fira Sans typography, Cyan theme, Gray base, Large radius, Compact spacing

### Exceptions
- Exception messages must be in English

### Debugging
- Add debug logs with `console.debug` for future issue tracking

## Testing & TDD (Test-Driven Development)

### TDD Cycle: Red → Green → Refactor

```
1. RED    → Write a failing test first
2. GREEN  → Write minimal code to make it pass
3. REFACTOR → Improve code quality while tests pass
```

### When to Apply TDD (MANDATORY vs OPTIONAL)

| Layer | TDD Required? | Rationale |
|-------|---------------|-----------|
| **Domain** (entities, value objects, ports) | ✅ **MANDATORY** | Pure business logic, no dependencies, easy to test |
| **Data** (mappers) | ✅ **MANDATORY** | Pure functions, critical for data integrity |
| **Presentation** (stores, hooks) | ⚠️ **Recommended** | Business logic in stores benefits from TDD |
| **Infrastructure** (repositories) | ⚠️ **Optional** | Requires DB setup, integration tests preferred |
| **Design System** (components) | ⚠️ **Optional** | Visual components often test-after with Storybook |

### Test File Structure

```
tests/
├── domain/           # TDD: Write tests FIRST
│   ├── list/
│   │   └── list.entity.test.ts
│   └── item/
│       └── item.entity.test.ts
├── data/             # TDD: Write tests FIRST
│   └── mappers/
│       └── list.mapper.test.ts
├── presentation/     # TDD recommended for stores
│   ├── stores/
│   │   └── listStore.test.ts
│   └── hooks/
│       └── useListData.test.ts
├── design-system/    # Test-after for visual components
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
└── setup.ts          # Global mocks
```

### Domain Layer TDD (MANDATORY)

Domain tests are pure unit tests with **zero mocks**. Always write the test BEFORE the implementation.

#### TDD Example: Entity Creation

```typescript
// Step 1: RED - Write failing test first
// tests/domain/list/list.entity.test.ts
describe('List Entity', () => {
  describe('CreateListInput validation', () => {
    it('should require name field', () => {
      const input: CreateListInput = {
        listType: 'shopping',
        name: 'Groceries',
      };
      expect(input.name).toBe('Groceries');
      expect(input.listType).toBe('shopping');
    });

    it('should have valid list types', () => {
      const validTypes: ListType[] = ['shopping', 'movies', 'books', 'games', 'notes'];
      validTypes.forEach(type => {
        expect(['shopping', 'movies', 'books', 'games', 'notes']).toContain(type);
      });
    });
  });
});

// Step 2: GREEN - Implement the entity to make tests pass
// Step 3: REFACTOR - Improve if needed while tests stay green
```

#### TDD Example: Discriminated Union

```typescript
// tests/domain/item/item.entity.test.ts
describe('Item Discriminated Union', () => {
  it('should narrow type correctly for ShoppingItem', () => {
    const item: Item = {
      id: '1',
      listId: 'list-1',
      title: 'Milk',
      type: 'shopping',
      quantity: '2L',
      price: 5.99,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (item.type === 'shopping') {
      // TypeScript should narrow to ShoppingItem
      expect(item.price).toBe(5.99);
      expect(item.quantity).toBe('2L');
    }
  });

  it('should narrow type correctly for NoteItem', () => {
    const item: Item = {
      id: '2',
      listId: 'list-1',
      title: 'Remember to call',
      type: 'note',
      description: 'Call the doctor',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (item.type === 'note') {
      expect(item.description).toBe('Call the doctor');
    }
  });
});
```

### Data Layer TDD (MANDATORY)

Mappers are pure functions - test every transformation path.

```typescript
// tests/data/mappers/list.mapper.test.ts
describe('List Mapper', () => {
  describe('toDomainList', () => {
    it('should convert SQLite row to domain entity', () => {
      const row = {
        id: 'uuid-123',
        list_type: 'shopping',
        name: 'Groceries',
        created_at: 1704067200000, // timestamp
        updated_at: 1704153600000,
      };

      const list = toDomainList(row);

      expect(list.id).toBe('uuid-123');
      expect(list.listType).toBe('shopping');
      expect(list.name).toBe('Groceries');
      expect(list.createdAt).toBeInstanceOf(Date);
      expect(list.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('toPersistenceList', () => {
    it('should convert domain input to SQLite row', () => {
      const input: CreateListInput = {
        listType: 'shopping',
        name: 'Groceries',
      };

      const row = toPersistenceList(input);

      expect(row.list_type).toBe('shopping');
      expect(row.name).toBe('Groceries');
      expect(typeof row.created_at).toBe('number');
      expect(typeof row.updated_at).toBe('number');
    });
  });
});
```

### Presentation Layer TDD (Recommended for Stores)

For Zustand stores with business logic, TDD improves reliability.

```typescript
// tests/presentation/stores/listStore.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';

const mockListRepository = {
  getAll: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

describe('useListStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load lists on initialization', async () => {
    const mockLists = [{ id: '1', name: 'Shopping', listType: 'shopping' }];
    mockListRepository.getAll.mockResolvedValue(mockLists);

    const { result } = renderHook(() => useListStore(mockListRepository));

    await waitFor(() => {
      expect(result.current.lists).toEqual(mockLists);
    });
  });

  it('should optimistically add item then rollback on error', async () => {
    mockListRepository.create.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useListStore(mockListRepository));

    await act(async () => {
      await result.current.addList({ name: 'New List', listType: 'shopping' });
    });

    // Should rollback to empty after error
    expect(result.current.lists).toHaveLength(0);
  });
});
```

### Component Testing (Test-After)

Design System components use test-after approach with Storybook for visual validation.

```typescript
// tests/design-system/atoms/Button.test.tsx
import { renderWithTheme } from '../testUtils';
import { Button } from '@design-system/atoms/Button';
import { fireEvent } from '@testing-library/react-native';

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button onPress={onPress}>Click me</Button>
    );

    fireEvent.press(getByText('Click me'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button onPress={onPress} disabled>Disabled</Button>
    );

    fireEvent.press(getByText('Disabled'));

    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### Test Utilities

Use the provided test helper for Design System components:

```typescript
// tests/design-system/testUtils.tsx
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@design-system/theme';

export function renderWithTheme(component: React.ReactElement) {
  return render(
    <ThemeProvider initialMode="dark">{component}</ThemeProvider>
  );
}
```

### Mock Patterns

#### Module Mocks (Global)
```typescript
// tests/setup.ts
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
  },
}));
```

#### Repository Mocks (Per Test)
```typescript
const mockRepository = {
  getById: jest.fn().mockResolvedValue({ id: '1', name: 'Test' }),
  create: jest.fn().mockResolvedValue({ id: '2', name: 'New' }),
  delete: jest.fn().mockResolvedValue(true),
};
```

#### Spy Mocks (Console Errors)
```typescript
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
// ... test code
consoleSpy.mockRestore();
```

### Running Tests

```bash
npm test                    # Run all tests
npm test -- list            # Run tests matching "list"
npm test -- --watch         # Watch mode
npm test -- --coverage      # Coverage report
```

### TDD Checklist Before PR

- [ ] Domain entities have tests written FIRST
- [ ] Mappers have bidirectional conversion tests
- [ ] Store business logic has unit tests
- [ ] All tests pass: `npm test`
- [ ] No skipped tests (`.skip`) without TODO comment

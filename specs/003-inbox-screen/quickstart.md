# Quickstart: Inbox Screen

**Feature**: 003-inbox-screen
**Data**: 2026-01-11

Guia rápido para desenvolver a feature Inbox Screen.

## Pré-requisitos

1. Node.js 18+
2. Expo CLI instalado
3. Branch correta: `003-inbox-screen`

```bash
git checkout 003-inbox-screen
npm install
```

## Setup Inicial

### 1. Instalar Dependências Novas

```bash
npx expo install @shopify/flash-list @react-navigation/drawer
```

### 2. Verificar Reanimated

O `react-native-reanimated` já está instalado. Verificar configuração em `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // Deve estar no final
  };
};
```

## Ordem de Implementação

### Fase 1: Domínio (sem UI)

1. **Entidades** (`src/domain/inbox/entities/`)
   ```
   UserInput.ts  # type UserInput = { id, text, createdAt, updatedAt, tags }
   Tag.ts        # type Tag = { id, name, usageCount, createdAt }
   ```

2. **Value Objects** (`src/domain/inbox/value-objects/`)
   ```
   TagName.ts    # createTagName(raw: string): TagName | null
   ```

3. **Constants** (`src/domain/inbox/constants.ts`)
   ```typescript
   export const MAX_TEXT_LENGTH = 5000;
   export const MAX_TAG_LENGTH = 30;
   export const DEFAULT_PAGE_SIZE = 20;
   export const TAG_REGEX = /#([a-zA-ZÀ-ÿ0-9_]+)/g;
   ```

4. **Errors** (`src/domain/inbox/use-cases/errors.ts`)
   ```typescript
   export class EmptyTextError extends Error { ... }
   export class UserInputNotFoundError extends Error { ... }
   ```

5. **Use Cases** (`src/domain/inbox/use-cases/`)
   ```
   CreateUserInput.ts   # extractTags + create
   UpdateUserInput.ts   # update text + recalculate tags
   DeleteUserInput.ts   # delete + decrement usageCount
   GetUserInputs.ts     # paginated list
   SearchTags.ts        # prefix search
   ```

6. **Repository Port** (`src/domain/inbox/ports/InboxRepository.ts`)
   ```typescript
   export interface InboxRepository {
     createUserInput(params): Promise<UserInput>;
     updateUserInput(params): Promise<UserInput>;
     deleteUserInput(id: string): Promise<void>;
     getUserInputById(id: string): Promise<UserInput | null>;
     getUserInputs(params): Promise<PaginatedUserInputs>;
     searchTags(params): Promise<Tag[]>;
     transaction<T>(fn): Promise<T>;
   }
   ```

### Fase 2: Infra (SQLite)

1. **Migration** (`src/infra/storage/sqlite/migrations/index.ts`)
   ```typescript
   // Adicionar ao array MIGRATIONS:
   {
     id: 2,
     name: '0002_inbox',
     sql: INBOX_SCHEMA,
   }
   ```

2. **Mappers** (`src/data/inbox/mappers/sqliteMappers.ts`)
   ```typescript
   mapUserInputRowToEntity(row, tags): UserInput
   mapUserInputEntityToRow(input): UserInputRow
   mapTagRowToEntity(row): Tag
   mapTagEntityToRow(tag): TagRow
   ```

3. **Repository** (`src/infra/storage/sqlite/InboxSqliteRepo.ts`)
   - Implementar InboxRepository interface
   - Usar SqliteDatabase existente
   - Seguir padrão do ShoppingSqliteRepo

### Fase 3: DI Container

1. **Types** (`src/app/di/types.ts`)
   ```typescript
   import type { InboxRepository } from '@domain/inbox/ports/InboxRepository';

   export type AppDependencies = {
     database: SqliteDatabase;
     shoppingRepository: ShoppingRepository;
     inboxRepository: InboxRepository;  // NOVO
   };
   ```

2. **Container** (`src/app/di/container.ts`)
   ```typescript
   import { InboxSqliteRepo } from '@infra/storage/sqlite/InboxSqliteRepo';

   export async function buildDependencies(): Promise<AppDependencies> {
     const database = new SqliteDatabase({ databaseName: options.databaseName });
     const shoppingRepository = new ShoppingSqliteRepo(database);
     const inboxRepository = new InboxSqliteRepo(database);  // NOVO

     return { database, shoppingRepository, inboxRepository };
   }
   ```

3. **AppDependenciesProvider** (`src/app/di/AppDependenciesProvider.tsx`)
   - Criar provider global (ver plan.md)

### Fase 4: Presentation (Store)

1. **Store** (`src/presentation/state/inbox/inboxStore.ts`)
   - Seguir padrão do shoppingListStore
   - Optimistic updates com rollback
   - State: inputs, isLoading, isSubmitting, lastError, inputText

2. **Provider** (`src/presentation/state/inbox/InboxStoreProvider.tsx`)
   - Contexto para injetar store

3. **Hook** (`src/presentation/hooks/useInboxVM.ts`)
   - View model para tela Inbox

### Fase 5: Design System

1. **Logo Atom** (via CLI)
   ```bash
   npm run ds generate atom Logo
   ```
   - Editar arquivos gerados
   - Text "Listify", Fira Sans Bold, primary color

### Fase 6: UI Components

1. **Components** (`src/presentation/components/inbox/`)
   ```
   InboxInputBar.tsx        # Bottombar com input + send
   UserInputCard.tsx        # Card de cada input
   DateBadge.tsx            # Separador de data (sticky)
   TagSuggestions.tsx       # Popup de sugestões
   PinnedListsSection.tsx   # Empty state de listas
   InputOptionsMenu.tsx     # Menu editar/excluir
   DeleteConfirmDialog.tsx  # Confirmação de exclusão
   ```

2. **Screen** (`src/presentation/screens/InboxScreen.tsx`)
   - Composição dos componentes
   - FlashList com sticky headers
   - useInboxVM hook

### Fase 7: Navegação

1. **Drawer Layout** (`app/(drawer)/_layout.tsx`)
   ```typescript
   import { Drawer } from 'expo-router/drawer';

   export default function DrawerLayout() {
     return (
       <Drawer screenOptions={{ headerShown: false }}>
         <Drawer.Screen name="inbox" />
         <Drawer.Screen name="settings" />
       </Drawer>
     );
   }
   ```

2. **Inbox Route** (`app/(drawer)/inbox/index.tsx`)
   ```typescript
   import { InboxScreen } from '@presentation/screens/InboxScreen';
   export default InboxScreen;
   ```

3. **Root Layout** (`app/_layout.tsx`)
   - Adicionar AppDependenciesProvider
   - Ajustar initialRouteName

### Fase 8: i18n

1. **Locales** (`src/domain/inbox/locales/`)
   ```
   inbox.en.json
   inbox.pt-BR.json
   ```

2. **Registrar** no setup de i18n existente

## Comandos Úteis

```bash
# Desenvolvimento
npm start                 # Expo dev server
npm run android           # Run on Android
npm run ios               # Run on iOS

# Testes
npm test -- inbox         # Testes do domínio
npm test -- --watch       # Watch mode
npm run lint              # ESLint (zero warnings!)

# Design System
npm run ds generate atom Logo    # Criar átomo Logo
npm run storybook                # Storybook

# Git
git status
git add -A && git commit -m "feat(inbox): description"
```

## Checklist de Validação

### Domínio
- [ ] Entidades tipadas corretamente
- [ ] Use cases com testes unitários
- [ ] Erros de domínio específicos

### Infra
- [ ] Migration executa sem erros
- [ ] Repository implementa interface
- [ ] Mappers convertem corretamente

### Presentation
- [ ] Store com optimistic updates
- [ ] Components seguem Design System
- [ ] Tokens do theme (sem hard-coded values)

### UI/UX
- [ ] Criar input em < 5 segundos
- [ ] Sugestões de tag aparecem ao digitar #
- [ ] Long press abre menu de opções
- [ ] Confirmação antes de excluir
- [ ] Empty state quando lista vazia
- [ ] Scroll infinito carrega mais itens

### Performance
- [ ] FlashList com 500+ itens fluido
- [ ] Operações não travam UI
- [ ] Dados persistem após reiniciar

## Troubleshooting

### Migration não executa
- Verificar PRAGMA user_version no banco
- Limpar cache: `npx expo start --clear`

### Drawer não abre
- Verificar GestureHandlerRootView no root
- Verificar imports do drawer

### Tags não aparecem
- Verificar regex TAG_REGEX
- Verificar JOIN na query de busca

### FlashList warning
- Adicionar `estimatedItemSize` prop
- Verificar keyExtractor retorna string única

## Referências

- [Plan](./plan.md) - Plano completo
- [Spec](./spec.md) - Especificação funcional
- [Design](./design.md) - Design visual
- [Research](./research.md) - Decisões técnicas
- [Data Model](./data-model.md) - Modelo de dados
- [Contracts](./contracts/) - Interfaces TypeScript

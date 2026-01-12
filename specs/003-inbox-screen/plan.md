# Plano de Implementação: Inbox Screen

**Branch**: `003-inbox-screen` | **Data**: 2026-01-11 | **Versão alvo**: MVP | **Spec**: [spec.md](./spec.md)

## Resumo

Implementar a tela de Inbox do Listify seguindo Clean Architecture, com domínio independente do Shopping existente. A tela permite criar, visualizar, editar e excluir User Inputs com suporte a tags. Interface minimalista com bottombar inteligente, lista com scroll infinito agrupada por data, e navegação via sidebar (Expo Router Drawer).

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5.x
**Dependências Principais**: React Native 0.81, Expo 54, Zustand 5.x, expo-sqlite 16.x, react-i18next, @shopify/flash-list, @react-navigation/drawer
**Storage**: SQLite (mesmo banco `listify.db`, novas tabelas via Migration #2)
**Testes**: Jest (unidade no domínio, integração para repositório)
**Plataforma-alvo**: Mobile (Android/iOS via Expo)
**Tipo de Projeto**: Mobile app (Clean Architecture)
**Metas de Performance**: Offline-first, UI instantânea (< 100ms), scroll fluido com 500+ itens (FlashList)
**Restrições**: Sem travar UI, persistência local, domínio independente do Shopping
**Escala/Escopo**: MVP - Inbox como tela inicial, sem integração com Shopping

## Checagem da Constituição

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Documentação em pt-BR; nomes de código (classes/funções/endpoints) em inglês
- [x] Versão-alvo definida (MVP) + fora de escopo explícito (busca real, voz, integração Shopping)
- [x] Fluxos críticos minimalistas (criar input em < 5 segundos)
- [x] Offline-first e UX instantânea (optimistic updates com rollback)
- [x] Estados claros (lista agrupada por data, feedback visual, empty states)
- [x] Clean Architecture (UI sem lógica de negócio; domínio testável)
- [x] Testes planejados para novas regras de negócio (unidade no domínio; integração quando aplicável)

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/003-inbox-screen/
├── spec.md              # Especificação (pronta)
├── plan.md              # Este arquivo
├── design.md            # Design visual (pronto)
├── research.md          # Decisões técnicas
├── data-model.md        # Modelo de dados
├── quickstart.md        # Guia rápido de desenvolvimento
├── contracts/           # Interfaces TypeScript
│   ├── InboxRepository.ts
│   ├── entities.ts
│   └── use-cases.ts
└── tasks.md             # Tarefas (gerado por /speckit.tasks)
```

### Código-fonte (estrutura a criar)

```text
src/
├── domain/inbox/                    # NOVO DOMÍNIO
│   ├── constants.ts
│   ├── entities/
│   │   ├── UserInput.ts
│   │   └── Tag.ts
│   ├── value-objects/
│   │   └── TagName.ts
│   ├── ports/
│   │   └── InboxRepository.ts
│   ├── use-cases/
│   │   ├── CreateUserInput.ts
│   │   ├── UpdateUserInput.ts
│   │   ├── DeleteUserInput.ts
│   │   ├── GetUserInputs.ts
│   │   ├── SearchTags.ts
│   │   └── errors.ts
│   └── locales/
│       ├── inbox.en.json
│       └── inbox.pt-BR.json
│
├── data/inbox/
│   └── mappers/
│       └── sqliteMappers.ts
│
├── infra/storage/sqlite/
│   ├── InboxSqliteRepo.ts           # NOVA IMPLEMENTAÇÃO
│   └── migrations/
│       └── index.ts                  # Adicionar Migration #2
│
├── presentation/
│   ├── screens/
│   │   └── InboxScreen.tsx          # NOVA TELA
│   ├── components/inbox/            # NOVOS COMPONENTES
│   │   ├── InboxInputBar.tsx
│   │   ├── UserInputCard.tsx
│   │   ├── DateBadge.tsx
│   │   ├── TagSuggestions.tsx
│   │   ├── PinnedListsSection.tsx
│   │   ├── InputOptionsMenu.tsx
│   │   └── DeleteConfirmDialog.tsx
│   ├── components/navigation/
│   │   └── CustomDrawerContent.tsx
│   ├── state/inbox/
│   │   ├── inboxStore.ts
│   │   └── InboxStoreProvider.tsx
│   └── hooks/
│       └── useInboxVM.ts
│
├── design-system/
│   └── atoms/
│       └── Logo/                    # NOVO COMPONENTE
│
└── app/
    ├── di/
    │   ├── container.ts             # Adicionar inboxRepository
    │   ├── types.ts                 # Adicionar InboxRepository type
    │   └── AppDependenciesProvider.tsx  # NOVO - Provider global
    ├── _layout.tsx                  # Adicionar AppDependenciesProvider
    └── (drawer)/                    # NOVO - Drawer layout
        ├── _layout.tsx
        ├── inbox/
        │   └── index.tsx
        └── settings/
            └── index.tsx            # Placeholder

tests/
├── domain/inbox/
│   ├── testUtils.ts
│   ├── CreateUserInput.test.ts
│   ├── UpdateUserInput.test.ts
│   ├── DeleteUserInput.test.ts
│   ├── GetUserInputs.test.ts
│   └── TagName.test.ts
└── data/inbox/
    └── sqliteMappers.test.ts
```

**Structure Decision**: Mobile app com Clean Architecture seguindo o padrão já estabelecido no domínio Shopping. O novo domínio Inbox é completamente independente, usando as mesmas camadas (domain → data → infra → presentation) e padrões (Zustand store com optimistic updates, SQLite repository, atomic design components).

## Arquitetura de Componentes UI

### Expo Router Drawer (Sidebar)

A navegação será implementada com Expo Router Drawer para a sidebar lateral.

**Dependências a adicionar:**
```bash
npx expo install @react-navigation/drawer react-native-reanimated
```

**Estrutura de arquivos:**
```
app/
├── _layout.tsx              # Root com ThemeProvider, AppDependenciesProvider
└── (drawer)/                # Grupo com Drawer layout
    ├── _layout.tsx          # Drawer layout config
    ├── inbox/
    │   └── index.tsx        # Tela Inbox (rota padrão)
    └── settings/
        └── index.tsx        # Tela Settings (placeholder)
```

### Hierarquia da Tela Inbox

```
InboxScreen (dentro do Drawer)
├── InboxNavbar (usa Navbar existente)
│   ├── IconButton [Menu] → abre drawer
│   └── Logo [Listify] → centralizado
│
├── SearchBar (molecule existente) [visual only]
│
├── PinnedListsSection (component)
│   └── EmptyState (dashed border)
│
├── FlashList (@shopify/flash-list)
│   ├── DateBadge (sticky header por dia)
│   └── UserInputCard (cada input)
│       ├── Text (conteúdo)
│       ├── Badge[] (tags)
│       └── Text (horário)
│
├── TagSuggestions (popup acima da bottombar)
│
└── InboxInputBar (bottombar fixa)
    ├── TextInput
    └── IconButton [Send]
```

## Modelo de Dados

### Entidades

| Entidade | Campos | Descrição |
|----------|--------|-----------|
| **UserInput** | id, text, createdAt, updatedAt, tags[] | Entrada de texto do usuário |
| **Tag** | id, name, usageCount, createdAt | Tag para categorização |
| **InputTag** | inputId, tagId | Relação N:N (junction table) |

### Schema SQLite (Migration #2)

```sql
-- Migration 2: Inbox tables (0002_inbox)
CREATE TABLE IF NOT EXISTS user_inputs (
  id TEXT PRIMARY KEY NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_inputs_created ON user_inputs(created_at);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

CREATE TABLE IF NOT EXISTS input_tags (
  input_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (input_id, tag_id),
  FOREIGN KEY (input_id) REFERENCES user_inputs(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_input_tags_input ON input_tags(input_id);
CREATE INDEX IF NOT EXISTS idx_input_tags_tag ON input_tags(tag_id);
```

## Use Cases

| Use Case | Input | Output | Regras |
|----------|-------|--------|--------|
| **CreateUserInput** | text: string | UserInput | Extrai tags (#tag), cria tags novas, incrementa usageCount |
| **UpdateUserInput** | id, text?, tags[]? | UserInput | Preserva createdAt, atualiza updatedAt, recalcula tags |
| **DeleteUserInput** | id: string | void | Remove input e relações (cascade) |
| **GetUserInputs** | page, limit | { inputs[], hasMore } | Paginação, ordem ASC (recente embaixo) |
| **SearchTags** | query: string | Tag[] | Busca prefixo, ordena por usageCount DESC |

## AppDependenciesProvider

Provider global para centralizar injeção de dependências:

```typescript
// src/app/di/AppDependenciesProvider.tsx
export function AppDependenciesProvider({ children, fallback }): ReactElement {
  const [state, setState] = useState({ dependencies: null, isLoading: true, error: null });

  useEffect(() => {
    buildDependencies()
      .then(deps => setState({ dependencies: deps, isLoading: false, error: null }))
      .catch(error => setState({ dependencies: null, isLoading: false, error }));
  }, []);

  if (state.isLoading) return fallback ?? <LoadingScreen />;
  if (state.error) return <ErrorScreen error={state.error} />;

  return (
    <AppDependenciesContext.Provider value={state.dependencies}>
      {children}
    </AppDependenciesContext.Provider>
  );
}

// Hooks específicos
export function useInboxRepository(): InboxRepository {
  return useAppDependencies().inboxRepository;
}
```

## Fluxo de Dados (Optimistic Updates)

```
1. Usuário digita "#compras leite" na bottombar
   ↓
2. TagSuggestions detecta "#" e mostra sugestões
   ↓
3. Usuário pressiona Send
   ↓
4. Store: snapshot estado atual
   ↓
5. Store: atualização otimista (UI atualiza imediatamente)
   ↓
6. Use Case: CreateUserInput
   - Extrai tags do texto
   - Cria/atualiza tags no banco
   - Persiste UserInput
   ↓
7. Repository: SQLite transaction
   ↓
8. Store: sincroniza com resposta (ou rollback se erro)
```

## Internacionalização

Chaves i18n necessárias (pt-BR e en):

```json
{
  "inbox": {
    "title": "Inbox",
    "search": { "placeholder": "Buscar..." },
    "input": { "placeholder": "Digite algo...", "send": "Enviar" },
    "pinnedLists": { "title": "Suas principais listas", "empty": "Nenhuma lista fixada" },
    "list": { "empty": { "title": "Nenhum item ainda", "subtitle": "Comece digitando algo abaixo" } },
    "actions": { "edit": "Editar", "delete": "Excluir", "cancel": "Cancelar", "save": "Salvar" },
    "dialog": { "deleteTitle": "Excluir item?", "deleteDescription": "Esta ação não pode ser desfeita." },
    "dates": { "today": "Hoje", "yesterday": "Ontem" },
    "errors": { "createFailed": "Falha ao criar item", "updateFailed": "Falha ao atualizar", "deleteFailed": "Falha ao excluir" }
  }
}
```

## Verificação

### Testes Automatizados
```bash
npm test -- inbox           # Testes do domínio inbox
npm test -- sqliteMappers   # Testes dos mappers
npm run lint               # Zero warnings
```

### Testes Manuais
1. Criar input com texto simples → aparece na lista
2. Criar input com #tag → tag é criada/associada
3. Digitar # → sugestões aparecem
4. Long press em input → menu editar/excluir
5. Editar input → alterações persistem
6. Excluir input → confirmação → removido
7. Scroll até o fim → mais itens carregam
8. Fechar e reabrir app → dados persistem
9. Alternar tema (dark/light) → visual correto

### Critérios de Aceite
- [ ] Criar input em < 5 segundos
- [ ] Lista carrega em < 1 segundo
- [ ] Sugestões de tags em tempo real
- [ ] 100% offline funcional
- [ ] Scroll fluido com 500+ itens

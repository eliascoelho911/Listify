# Listify

App de listas de compras inteligente com foco em produtividade e design moderno.

## Tecnologias

- **React Native** 0.81.5 com **Expo** ~54.0.31
- **TypeScript** 5.9.2 (strict mode)
- **Expo Router** para navegação file-based
- **Zustand** para state management
- **SQLite** para persistência local
- **Clean Architecture** com separação de camadas

## Estrutura do Projeto

```
src/
├── app/          # Bootstrap, DI container, routing (Expo Router)
├── domain/       # Business logic (entities, use cases, ports)
├── data/         # Data mappers (SQLite → domain)
├── infra/        # Infrastructure (SQLite, external services)
├── presentation/ # React components, screens, hooks, stores
├── design-system/    # 🎨 NEW: Complete Design System (Atomic Design)
└── legacy-design-system/  # Old DS (being deprecated)
```

## 🎨 Design System

**Novo Design System completo** implementado seguindo **Atomic Design** e convenções **Shadcn**:

### Características

- **Tokens**: Fira Sans/Code, cyan theme, gray "chumbo", large radius, compact spacing
- **Themes**: Dark (padrão) e Light com AsyncStorage persistence
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Zero Hard-Coded Values**: ESLint enforça uso de tokens
- **Storybook**: 30+ stories documentando todos os componentes
- **TypeScript**: Type-safe completo com strict mode
- **Acessibilidade**: WCAG 2.1 Level AA compliance

### Componentes Disponíveis

**Atoms**:
- Button (5 variants Shadcn, 4 sizes, loading, icons)
- Input (4 states, error/helper text)
- Label (required indicator, disabled)
- Badge (4 variants, pill shape)
- Icon (Lucide wrapper, 4 sizes)
- Card (6 composable components)

**Molecules**:
- FormField (Label + Input composition)
- SearchBar (Input + Icon com clear button)

**Organisms**:
- Navbar (usando topbar custom tokens)
- ShoppingListCard (Card + Badge + Icon composition)

### Uso

```typescript
import { Button, Card, FormField, useTheme } from '@design-system';

function MyScreen() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <Card>
      <FormField label="Email" required />
      <Button onPress={toggleTheme}>
        Switch to {mode === 'dark' ? 'Light' : 'Dark'}
      </Button>
    </Card>
  );
}
```

### Documentação

- **README completo**: [`src/design-system/README.md`](./src/design-system/README.md) (700+ linhas)
- **Guia de contribuição**: [`src/design-system/CONTRIBUTING.md`](./src/design-system/CONTRIBUTING.md) (500+ linhas)
- **Storybook**: `npm run storybook` para visualização interativa

## Comandos

```bash
# Desenvolvimento
npm start           # Inicia Expo dev server
npm run android     # Run em Android
npm run ios         # Run em iOS
npm run web         # Run na web

# Quality
npm run lint        # ESLint (zero warnings policy)
npm test            # Jest tests

# Design System
npm run storybook   # Visualizar componentes no Storybook
```

## Arquitetura

**Clean Architecture** com **DI Container**:
- `domain/` - Pure business logic (sem imports RN/React)
- `data/` - Mappers entre camadas
- `infra/` - SQLite implementation
- `presentation/` - React components, Zustand stores
- `app/` - Bootstrap, DI, i18n setup

### Fluxo de Dependências

```
app → presentation → domain ← data → infra
```

## Internacionalização

- **i18next** + react-i18next
- Locales: `pt-BR` (padrão), `en`
- Todo texto de UI usa `t()` ou `<Trans />`
- User data (nomes de itens) NÃO é traduzido

## Path Aliases

```typescript
@app/*               → src/app/*
@domain/*            → src/domain/*
@data/*              → src/data/*
@infra/*             → src/infra/*
@presentation/*      → src/presentation/*
@design-system/*     → src/design-system/*
@legacy-design-system/* → src/legacy-design-system/*
@tests/*             → tests/*
```

## Contribuindo

1. Leia [`CLAUDE.md`](./CLAUDE.md) para convenções do projeto
2. Para adicionar componentes ao DS, leia [`src/design-system/CONTRIBUTING.md`](./src/design-system/CONTRIBUTING.md)
3. Siga **zero warnings policy**: `npm run lint` deve passar sem avisos
4. Todos os testes devem passar: `npm test`

## Licença

MIT
